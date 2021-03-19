from wagtail.tests.utils import WagtailPageTests

from vuecodingchallenge.events.factories import EventIndexPageFactory, EventPageFactory
from vuecodingchallenge.events.models import EventIndexPage, EventPage
from vuecodingchallenge.home.models import HomePage


class EventsTests(WagtailPageTests):
    def test_factories(self):
        EventPageFactory()
        EventIndexPageFactory()

    def test_can_create_event_index_page_under_home_page(self):
        self.assertCanCreateAt(HomePage, EventIndexPage)

    def test_can_create_event_page_under_event_index_page(self):
        self.assertCanCreateAt(EventIndexPage, EventPage)
