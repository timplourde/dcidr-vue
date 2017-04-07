import Vue from 'vue';
import template from './criteria.html';
import { MUTATIONS } from '../constants';
import { mapState } from 'vuex';
import InlineHelpComponent from './inline-help';
import decisionNavigation from '../mixins/decision-navigation';
import {ROUTES} from '../constants';
import LayoutComponent from './layout';

const CriteriaComponent = Vue.extend({
  mixins: [decisionNavigation],
  name: 'criteria-component',
  template,
  mounted(){
       this.$refs.newCritInput.focus();
  },
  data : function(){
    return {
      newCrit: null,
      showHelp: false
    };
  },
  methods: {
      addCrit: function() {
        let newVal = this.newCrit || '';
        newVal = newVal.trim().replace('|', '');
        if(newVal.length && !this.criteria.find(o => o.toLowerCase() === newVal)){
          this.$store.commit(MUTATIONS.ADD_CRIT, newVal);
        }
        this.newCrit = null;
      },
      removeCrit: function(name) {
        this.$store.commit(MUTATIONS.REMOVE_CRIT, name);
      },
      back: function(){
        this.$router.push({path: ROUTES.OPTIONS });
      },
      proceed: function(){
        if(this.hasEnough){
          this.$router.push({path: ROUTES.OPTION_COMPARISONS });
        }
      }
  },
  computed: mapState({
    criteria: state => state.decision.criteria,
    hasEnough: state => state.decision.gates.hasEnoughCriteria
  })
});

export default CriteriaComponent;