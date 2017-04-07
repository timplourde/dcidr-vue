import Vue from 'vue';
import template from './options.html';
import { MUTATIONS } from '../constants';
import { mapState } from 'vuex';
import InlineHelpComponent from './inline-help';
import decisionNavigation from '../mixins/decision-navigation';
import {ROUTES} from '../constants';
import LayoutComponent from './layout';

const OptionsComponent = Vue.extend({
  mixins: [decisionNavigation],
  name: 'options-component',
  template,
  mounted(){
       this.$refs.newOptionInput.focus();
   },
  data : function(){
    return {
      newOption: null,
      showHelp: false
    };
  },
  methods: {
      addOption: function() {
        let newVal = this.newOption || '';
        newVal = newVal.trim().replace('|', '');
        if(newVal.length && !this.options.find(o => o.toLowerCase() === newVal)){
          this.$store.commit(MUTATIONS.ADD_OPTION, newVal);
        }
        this.newOption = null;
      },
      removeOption: function(name) {
        this.$store.commit(MUTATIONS.REMOVE_OPTION, name);
      },
      back: function(){
        this.$router.push({path: ROUTES.HOME });
      },
      proceed: function(){
        if(this.hasEnough){
           this.$router.push({path: ROUTES.CRITERIA });
        }
      }
  },
  computed: mapState({
      options: state => state.decision.options,
      hasEnough: state => state.decision.gates.hasEnoughOptions
    })
});

export default OptionsComponent;