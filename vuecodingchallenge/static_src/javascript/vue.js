import Vue from 'vue';
import Main from '../vue/Main.vue';

new Vue({
    render: (createEl) => createEl(Main),
}).$mount('#app');
