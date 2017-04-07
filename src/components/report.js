import Vue from 'vue';
import template from './report.html';
import { MUTATIONS } from '../constants';
import { mapState } from 'vuex';
import decisionNavigation from '../mixins/decision-navigation';
import {ROUTES} from '../constants';
import LayoutComponent from './layout';

const ReportComponent = Vue.extend({
  mixins: [decisionNavigation],
  name: 'report-component',
  template,
  computed: mapState({
      report: state => state.decision.report,
      bestScore: state => state.decision.report.reduce((bestScore, reportOption)=> {
          if(reportOption.score > bestScore){
              bestScore = reportOption.score;
          }
          return bestScore;
      },0)
    }),
  filters: {
    percentage: function (value) {
      if (!value) return ''
      return (value * 100).toFixed(2) + '%';
    }
  },
  methods: {
    back: function(){
       this.$router.push({path: ROUTES.CRITERIA_COMPARISONS });
    },
    proceed: function(){
       this.$router.push({path: ROUTES.SAVE });
    }
  }
});

export default ReportComponent;