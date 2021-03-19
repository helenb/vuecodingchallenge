from wagtail.tests.utils import WagtailPageTests

from vuecodingchallenge.home.models import HomePage
from vuecodingchallenge.news.factories import NewsIndexPageFactory, NewsPageFactory
from vuecodingchallenge.news.models import NewsIndex, NewsPage


class NewsTests(WagtailPageTests):
    def test_factories(self):
        NewsPageFactory()
        NewsIndexPageFactory()

    def test_can_create_news_page_under_home_page(self):
        self.assertCanCreateAt(HomePage, NewsIndex)

    def test_can_create_news_page_under_news_index_page(self):
        self.assertCanCreateAt(NewsIndex, NewsPage)
