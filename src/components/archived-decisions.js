import Vue from 'vue';
import template from './archived-decisions.html';
import { MUTATIONS } from '../constants';
import Vuex from 'vuex';
import {loadArchive, loadDecisionModel, deleteDecision, deleteArchive} from '../model/archive';
import decisionNavigation from '../mixins/decision-navigation';
import {ROUTES} from '../constants';
import LayoutComponent from './layout';

Vue.use(Vuex);

const ArchivedDecisionsComponent = Vue.extend({
  mixins: [decisionNavigation],
  name: 'archived-decisions-component',
  template,
  data: function() {
    return {
        archivedDecisions: []
    };
  },
  created: function(){
    this.loadArchive();
  },
  filters: {
    prettyDate: function (value) {
      if (!value) return '';
      var d = new Date(value);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }
  },
  methods: {
    loadArchive: function(){
      this.archivedDecisions = loadArchive().sort( (a, b) => {
        return a.date < b.date ? 1 : -1;
      })
    },
    back: function(){
      this.$router.push({path: ROUTES.HOME });
    },
    deleteAll: function(){
      deleteArchive();
      this.back();
    },
    loadDecision: function(id){
      let decisionModel = loadDecisionModel(id);
      if(decisionModel){
        this.$store.commit(MUTATIONS.LOAD_DECISION, decisionModel);
        this.$router.push({path: ROUTES.OPTIONS });
      }
    },
    deleteDecision: function(id){
      deleteDecision(id);
      this.loadArchive();
    }
  }
});

export default ArchivedDecisionsComponent;