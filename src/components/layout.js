import Vue from 'vue';
import template from './layout.html';

const LayoutComponent = Vue.component('app-layout', {
  template,
  data: function(){
   return {
      thisYear: (new Date()).getFullYear()
    }; 
  },
  props: {
    welcome: {
      type: Boolean,
      default: () => false
    }
  }
});

export default LayoutComponent;