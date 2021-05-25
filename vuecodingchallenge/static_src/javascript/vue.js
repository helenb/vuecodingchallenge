import { createApp } from 'vue';
import axios from 'axios';

const HelloVueApp = {
    // NB don't use arrow functions on an options property or callback
    data() {
        return {
            news: [],
            filteredNews: [],
            category: 'All news',
            perPage: 3,
            pageNum: 1,
            currentPageNews: [],
            hasNext: false,
            hasPrev: false,
        };
    },
    delimiters: ['[[', ']]'],

    mounted() {
        axios
            .get(
                '/api/v2/pages/?type=news.NewsPage&fields=introduction,body,news_types(news_type_name),image_thumbnail',
            )
            .then((response) => {
                this.news = response.data.items;
                this.filterResults();
                this.paginate();
            });
    },

    // methods are re-run every time they are called
    // don't use arrow functions - vue can't bind the right 'this' value otherwise
    methods: {
        // filter the news listing by category
        filterResults() {
            if (this.category === 'All news') {
                this.filteredNews = this.news;
                return;
            }

            this.filteredNews = this.news.filter((newsItem) => {
                let result = false;
                newsItem.news_types.forEach((newsType) => {
                    if (Object.values(newsType).includes(this.category)) {
                        result = true;
                    }
                });
                return result;
            });
        },

        // paginates the filtered listing
        paginate() {
            const paginatedResults = [];
            for (let i = 0; i < this.numPages; i++) {
                let start = i * this.perPage;
                let end = i * this.perPage + this.perPage;
                paginatedResults.push(this.filteredNews.slice(start, end));
            }
            this.paginatedResults = paginatedResults;
            this.currentPageNews = this.paginatedResults[0];
            this.hasNext = this.paginatedResults.length > 1;
            this.hasPrev = false;
            this.pageNum = 1;
        },

        getNextPage() {
            let nextPageIndex = this.pageNum;
            this.currentPageNews = this.paginatedResults[nextPageIndex];
            this.hasPrev = true;
            this.pageNum++;
            this.hasNext = this.paginatedResults.length > this.pageNum;
        },

        getPrevPage() {
            let prevPageIndex = this.pageNum - 2;
            console.log(prevPageIndex);
            this.currentPageNews = this.paginatedResults[prevPageIndex];
            this.hasPrev = this.prevPageIndex >= 0;
            this.hasNext = true;
            this.pageNum--;
        },
    },

    // computed properties are run once, and then their result is cached unless the data they reference updates
    computed: {
        // get a list of categories present for our news list
        allNewsTypes() {
            let news_types = ['All news'];
            this.news.forEach((newsItem) => {
                newsItem.news_types.forEach((newsType) => {
                    if (!news_types.includes(newsType.news_type_name)) {
                        news_types.push(newsType.news_type_name);
                    }
                });
            });
            return news_types;
        },

        numPages() {
            return Math.ceil(this.filteredNews.length / this.perPage);
        },
    },
};

const app = createApp(HelloVueApp);

// creates the news item component
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
        <ul v-for="category in newsitem.news_types">
            <li>
                {{ category.news_type_name }}
            </li>
        </ul>
    </li>`,
});

app.mount('#app');

// to dos
// try api fetches for pagination / filters
// respond to and update url params
