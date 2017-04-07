import Vue from 'vue';
import template from './welcome.html';
import { MUTATIONS } from '../constants.js';
import InlineHelpComponent from './inline-help';
import decisionNavigation from '../mixins/decision-navigation';
import LayoutComponent from './layout';
import {ROUTES} from '../constants';

const WelcomeComponent = Vue.extend({
  mixins: [decisionNavigation],
  template,
  data: function() {
    return {
      showLearnMore: false
    }
  },
  methods: {
    newDecision: function() {
      this.$store.commit(MUTATIONS.NEW_DECISION);
      this.$router.push({ path: ROUTES.OPTIONS  });
    },
    archive: function(){
      this.$router.push({ path: ROUTES.ARCHIVE });
    }
  }
});

export default WelcomeComponent;