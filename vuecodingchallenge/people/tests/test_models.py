from wagtail.tests.utils import WagtailPageTests

from vuecodingchallenge.home.models import HomePage
from vuecodingchallenge.people.factories import PersonIndexPageFactory, PersonPageFactory
from vuecodingchallenge.people.models import PersonIndexPage, PersonPage


class PeopleTests(WagtailPageTests):
    def test_factories(self):
        PersonPageFactory()
        PersonIndexPageFactory()

    def test_can_create_person_page_under_home_page(self):
        self.assertCanCreateAt(HomePage, PersonIndexPage)

    def test_can_create_person_page_under_person_index_page(self):
        self.assertCanCreateAt(PersonIndexPage, PersonPage)
