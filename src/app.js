import 'babel-polyfill';
import Vue from 'vue';
import router from './router';
import store from './store';
import {registerReportBar} from './directives/report-bar';

// register directives
registerReportBar();

// application
const app = new Vue({
  el: '#app',
  router,
  store,
  computed: {
    useWelcomeLayout: function() {
      return this.$route.path === "/";
    }
  }
});