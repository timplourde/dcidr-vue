import Vue from 'vue';
import template from './option-comparison.html';

const OptionComparisonComponent = Vue.component('option-comparison', {
  template,
  props: ['comparison', 'comparisonArrayIndex'],
  methods: {
    setRank(newRank){
      this.$emit('rank-changed', newRank, this.comparison.hash);
    }
  }
});

export default OptionComparisonComponent;