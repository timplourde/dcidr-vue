import Vue from 'vue';
import template from './criteria-comparison-list.html';
import { MUTATIONS } from '../constants';
import { mapState } from 'vuex';
import CriteriaComparisonComponent from './criteria-comparison';
import decisionNavigation from '../mixins/decision-navigation';
import scrollToTop from '../mixins/scroll-to-top';
import {ROUTES} from '../constants';
import LayoutComponent from './layout';

const CriteriaComparisonListComponent = Vue.extend({
  mixins: [decisionNavigation, scrollToTop],
  name: 'criteria-comparison-list-component',
  template,
  computed: mapState({
      criteriaComparisons: state => state.decision.criteriaComparisons,
      hasEnough: state => state.decision.gates.allCriteriaComparisonsRanked
    }),
  methods: {
    setRank(newRank, hash){
      this.$store.commit(MUTATIONS.CRITERIA_COMPARISON_RANK_CHANGED, {
        hash,
        newRank
      });
    },
    back: function(){
       this.$router.push({path: ROUTES.OPTION_COMPARISONS });
    },
    proceed: function(){
      if(this.hasEnough){
        this.$router.push({path: ROUTES.REPORT });
      }
    }
  }
});

export default CriteriaComparisonListComponent;