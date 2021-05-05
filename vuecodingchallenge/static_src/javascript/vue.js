import { createApp } from 'vue';
import axios from 'axios';

const HelloVueApp = {
    data() {
        return {
            news: [],
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
                // console.log(this.newsItems);
            });
    },
};

createApp(HelloVueApp).mount('#app');
