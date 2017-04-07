import Vue from 'vue';
import template from './criteria-comparison.html';

const CriteriaComparisonComponent = Vue.component('criteria-comparison', {
  template,
  props: ['comparison'],
  methods: {
    setRank(newRank){
      this.$emit('rank-changed', newRank, this.comparison.hash);
    }
  }
});

export default CriteriaComparisonComponent;