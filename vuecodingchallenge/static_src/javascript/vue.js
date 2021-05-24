import { createApp } from 'vue';
import axios from 'axios';

const HelloVueApp = {
    // NB don't use arrow functions on an options property or callback
    data() {
        return {
            bindMessage: 'update me',
            message: 'Try something',
            news: [],
            category: '',
        };
    },
    delimiters: ['[[', ']]'],
    created() {
        console.log('called when app is created');
    },
    beforeUpdate() {
        console.log('called before updating');
    },
    updated() {
        console.log('called when app is updated');
    },
    mounted() {
        axios
            .get(
                '/api/v2/pages/?type=news.NewsPage&fields=introduction,body,news_types(news_type_name),image_thumbnail',
            )
            .then((response) => {
                this.news = response.data.items;
                //console.log(this.news);
            });
    },
    unmounted() {
        console.log('called when app is unmounted');
    },
    methods: {
        // don't use arrow functions - vue can't bind the right 'this' value otherwise
        trySomething() {
            this.message = 'You tried it!';
        },
        test() {
            this.news = [
                {
                    id: 9,
                    meta: {
                        type: 'news.NewsPage',
                        detail_url: 'http://localhost/api/v2/pages/5/',
                        html_url: 'http://localhost/test-news/news-page-1/',
                        slug: 'news-page-1',
                        first_published_at: '2021-04-12T10:29:29.820188+01:00',
                    },
                    title: 'Test replacement news',
                    introduction: 'News intro',
                    body: [
                        {
                            type: 'heading',
                            value: 'Test news body',
                            id: '186f3716-564b-46af-9a35-cfa75cec8dda',
                        },
                    ],
                    news_types: [
                        {
                            id: 1,
                            meta: {
                                type: 'news.NewsPageNewsType',
                            },
                            news_type_name: 'news type 1',
                        },
                        {
                            id: 2,
                            meta: {
                                type: 'news.NewsPageNewsType',
                            },
                            news_type_name: 'stories',
                        },
                    ],
                    image_thumbnail: {
                        url: '/media/images/willow.2e16d0ba.fill-100x100.jpg',
                        width: 100,
                        height: 100,
                    },
                },
                {
                    id: 10,
                    meta: {
                        type: 'news.NewsPage',
                        detail_url: 'http://localhost/api/v2/pages/6/',
                        html_url: 'http://localhost/test-news/news-page-2/',
                        slug: 'news-page-2',
                        first_published_at: '2021-04-12T10:36:47.981481+01:00',
                    },
                    title: 'Another replacement news',
                    introduction: 'News intro',
                    body: [
                        {
                            type: 'heading',
                            value: 'Test news body',
                            id: '186f3716-564b-46af-9a35-cfa75cec8dda',
                        },
                        {
                            type: 'image',
                            value: {
                                image: 1,
                                caption: '',
                            },
                            id: '98f46009-1adb-4f94-a96f-1495d5958966',
                        },
                    ],
                    news_types: [
                        {
                            id: 3,
                            meta: {
                                type: 'news.NewsPageNewsType',
                            },
                            news_type_name: 'news type 2',
                        },
                        {
                            id: 6,
                            meta: {
                                type: 'news.NewsPageNewsType',
                            },
                            news_type_name: 'news type 1',
                        },
                    ],
                    image_thumbnail: {
                        url: '/media/images/sky16x9.2e16d0ba.fill-100x100.jpg',
                        width: 100,
                        height: 100,
                    },
                },
            ];
        },
        filterResults(category) {
            if (category === '') return this.news;
            return this.news.filter((newsItem) => {
                console.log(newsItem.news_types);
                //return newsItem.news_types.includes('news type 1');
                let result = false;
                newsItem.news_types.forEach((newsType) => {
                    console.log(Object.values(newsType).includes(category));
                    if (Object.values(newsType).includes(category)) {
                        result = true;
                    }
                });
                return result;
            });
        },
        setCategory(category) {
            this.category = category;
            console.log(this.category);
        },
    },
    computed: {
        newsTypes() {
            let news_types = [''];
            this.news.forEach((newsItem) => {
                newsItem.news_types.forEach((newsType) => {
                    if (!news_types.includes(newsType.news_type_name)) {
                        news_types.push(newsType.news_type_name);
                    }
                });
            });
            return news_types;
        },
    },
};

// method that takes arguments as to the page number and filters and fetches the correct data. would need to update news.
// need to paginate the api listing and also allow it to take filters

const app = createApp(HelloVueApp);

app.component('news-item', {
    props: ['newsitem'],
    template: `<li>
        <h2>{{ newsitem.title }}</h2>
        <p>{{ newsitem.introduction }}</p>
        <img v-if="newsitem.image_thumbnail"
            :src="newsitem.image_thumbnail.url"
            :width="newsitem.image_thumbnail.width"
            :height="newsitem.image_thumbnail.height"
        >
    </li>`,
});

app.mount('#app');
