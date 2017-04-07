import Vue from 'vue';
import template from './option-comparison-list.html';
import { MUTATIONS } from '../constants';
import { mapState } from 'vuex';
import OptionComparisonComponent from './option-comparison';
import decisionNavigation from '../mixins/decision-navigation';
import scrollToTop from '../mixins/scroll-to-top';
import {ROUTES} from '../constants';
import LayoutComponent from './layout';

const OptionComparisonListComponent = Vue.extend({
  mixins: [decisionNavigation, scrollToTop],
  name: 'option-comparison-list-component',
  template,
  computed: mapState({
      optionComparisons: state => state.decision.optionComparisons,
      hasEnough: state => state.decision.gates.allOptionComparisonsRanked
    }),
  methods: {
    setRank(newRank, hash){
      this.$store.commit(MUTATIONS.OPTION_COMPARISON_RANK_CHANGED, {
        hash,
        newRank
      })
    },
    back: function(){
       this.$router.push({path: ROUTES.CRITERIA });
    },
    proceed: function(){
      if(this.hasEnough){
       this.$router.push({path: ROUTES.CRITERIA_COMPARISONS });
      }
    }
  }
});

export default OptionComparisonListComponent;