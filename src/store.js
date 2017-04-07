import Vue from 'vue';
import Vuex from 'vuex';
import {MUTATIONS} from './constants';
import Decision from './model/decision';

// vuex config
Vue.use(Vuex);

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production', 
  state: {
    decision: new Decision()
  },
  mutations: {
    [MUTATIONS.NEW_DECISION] (state) {
      state.decision = new Decision();
    },
    [MUTATIONS.LOAD_DECISION] (state, decisionModel) {
      state.decision = new Decision(decisionModel);
    },
    [MUTATIONS.ADD_OPTION] (state, name) {
      state.decision.addOption(name);
    },
    [MUTATIONS.REMOVE_OPTION] (state, name) {
      state.decision.removeOption(name);
    },
    [MUTATIONS.ADD_CRIT] (state, name) {
      state.decision.addCrit(name);
    },
    [MUTATIONS.REMOVE_CRIT] (state, name) {
      state.decision.removeCrit(name);
    },
    [MUTATIONS.OPTION_COMPARISON_RANK_CHANGED] (state, {hash, newRank}) {
      state.decision.updateOptionComparisonRank(hash, newRank);
    },
    [MUTATIONS.CRITERIA_COMPARISON_RANK_CHANGED] (state, {hash, newRank}) {
      state.decision.updateCriteriaComparisonRank(hash, newRank);
    },
    [MUTATIONS.DECISION_NAME_CHANGED] (state, name) {
      state.decision.name = name;
    },
    [MUTATIONS.DEBUG_DATA] (state) {
      state.decision = new Decision();
      state.decision.addOption('option-a');
      state.decision.addOption('option-b');
      state.decision.addCrit('crit-1');
      state.decision.addCrit('crit-2');
      state.decision.updateOptionComparisonRank('crit-1|option-a|option-b', 'mlt');
      state.decision.updateOptionComparisonRank('crit-2|option-a|option-b', 'gt');
      state.decision.updateCriteriaComparisonRank('crit-1|crit-2', 'lt');
    },
  },
  getters: {
    gates: state => {
      if(!state.decision) return null;
      return state.decision.gates;
    }
  }
});

export default store;