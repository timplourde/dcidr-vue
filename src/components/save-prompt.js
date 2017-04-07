import Vue from 'vue';
import template from './save-prompt.html';
import { MUTATIONS } from '../constants';
import Vuex from 'vuex';
import {saveDecision} from '../model/archive';
import decisionNavigation from '../mixins/decision-navigation';
import {ROUTES} from '../constants';
import LayoutComponent from './layout';

Vue.use(Vuex);

const SavePromptComponent = Vue.extend({
  mixins: [decisionNavigation],
  name: 'save-prompt-component',
  template,
  data: function() {
    return {
        // not directly binding to the name on purpose
        // we don't want to commit the mutation until we're done
        decisionName: this.$store.state.decision.name || ''
    };
  },
  methods: {
    back: function(){
       this.$router.push({path: ROUTES.REPORT });
    },
    saveAndExit: function(){
        this.$store.commit(MUTATIONS.DECISION_NAME_CHANGED, this.decisionName);
        if(this.decisionName.length){
          saveDecision(this.$store.state.decision);
        }
        this.$router.push({path: ROUTES.HOME });
    }
  }
});

export default SavePromptComponent;