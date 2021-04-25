import 'vue';
import { createApp } from 'vue';

const HelloVueApp = {
    data() {
        return {
            message: 'Hello Vue!!',
        };
    },
    delimiters: ['[[', ']]'],
};

createApp(HelloVueApp).mount('#app');
