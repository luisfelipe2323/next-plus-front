import Vue from 'vue';

import './plugins';

import { sync } from 'vuex-router-sync';
import { LoaderPlugin } from 'vue-google-login';

// Application imports
import App from './App';
import router from '@/router';
import store from '@/store';

// init
Vue.use(LoaderPlugin, {
  client_id: process.env.VUE_APP_GOOGLE_CLIENT
});

sync(store, router);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');