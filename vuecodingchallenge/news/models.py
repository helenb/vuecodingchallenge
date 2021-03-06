from django.conf import settings
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.db import models
from django.db.models.functions import Coalesce
from modelcluster.fields import ParentalKey
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel, StreamFieldPanel
from wagtail.core.fields import StreamField
from wagtail.search import index
from wagtail.api import APIField

from vuecodingchallenge.utils.blocks import StoryBlock
from vuecodingchallenge.utils.models import BasePage, RelatedPage


class NewsType(models.Model):
    title = models.CharField(max_length=128)

    APIField('title')

    def __str__(self):
        return self.title


class NewsPageNewsType(models.Model):
    page = ParentalKey("news.NewsPage", related_name="news_types")
    news_type = models.ForeignKey(
        "NewsType", related_name="+", on_delete=models.CASCADE
    )

    panels = [FieldPanel("news_type")]

    def __str__(self):
        return self.news_type.title

    news_type_name = property(str)

    api_fields = [
        APIField('news_type_name'),
    ]


class NewsPageRelatedPage(RelatedPage):
    source_page = ParentalKey("news.NewsPage", related_name="related_pages")


class NewsPage(BasePage):
    template = "patterns/pages/news/news_page.html"

    subpage_types = []
    parent_page_types = ["NewsIndex"]

    # It's datetime for easy comparison with first_published_at
    publication_date = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Use this field to override the date that the "
        "news item appears to have been published.",
    )
    introduction = models.TextField(blank=True)
    body = StreamField(StoryBlock())

    search_fields = BasePage.search_fields + [
        index.SearchField("introduction"),
        index.SearchField("body"),
    ]

    content_panels = BasePage.content_panels + [
        FieldPanel("publication_date"),
        FieldPanel("introduction"),
        StreamFieldPanel("body"),
        InlinePanel("news_types", label="News types"),
        InlinePanel("related_pages", label="Related pages"),
    ]

    api_fields = [
        APIField('publication_date'),
        APIField('introduction'),
        APIField('body'),
        APIField('news_types')
    ]

    @property
    def display_date(self):
        if self.publication_date:
            return self.publication_date
        else:
            return self.first_published_at


class NewsIndex(BasePage):
    template = "patterns/pages/news/news_index.html"

    subpage_types = ["NewsPage"]
    parent_page_types = ["home.HomePage"]

    def get_context(self, request, *args, **kwargs):
        news = (
            NewsPage.objects.live()
            .public()
            .descendant_of(self)
            .annotate(date=Coalesce("publication_date", "first_published_at"))
            .order_by("-date")
        )

        if request.GET.get("news_type"):
            news = news.filter(news_types__news_type=request.GET.get("news_type"))

        # Pagination
        page = request.GET.get("page", 1)
        paginator = Paginator(news, settings.DEFAULT_PER_PAGE)
        try:
            news = paginator.page(page)
        except PageNotAnInteger:
            news = paginator.page(1)
        except EmptyPage:
            news = paginator.page(paginator.num_pages)

        context = super().get_context(request, *args, **kwargs)
        context.update(
            news=news,
            # Only show news types that have been used
            news_types=NewsPageNewsType.objects.all()
            .values_list("news_type__pk", "news_type__title")
            .distinct()
            .order_by("news_type__title"),
        )
        return context
