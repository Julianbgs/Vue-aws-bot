import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import BootstrapVue from 'bootstrap-vue';
import ElementsUI from 'element-ui';
import { Loading } from 'element-ui';
import { Notification } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueDataTables from 'vue-data-tables';

axios.defaults.baseURL = 'https://www.json-generator.com';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.interceptors.request.use( function (config) {
    if (localStorage.getItem('jwt')) {
        const token = localStorage.getItem('jwt');
        config.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return config;
});
Vue.prototype.$http = axios;

Vue.use(BootstrapVue);
Vue.use(ElementsUI, Loading, Notification);
Vue.use(VueDataTables);
// set language to EN
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';

locale.use(lang);

Vue.config.productionTip = false;
global.Host = 'https://www.json-generator.com';

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app');
