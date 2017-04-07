import Vue from 'vue';
import VueRouter from 'vue-router';
import WelcomeComponent from './components/welcome';
import OptionsComponent from './components/options';
import CriteriaComponent from './components/criteria';
import OptionComparisonListComponent from './components/option-comparison-list';
import CriteriaComparisonListComponent from './components/criteria-comparison-list';
import ReportComponent from './components/report';
import SavePromptComponent from './components/save-prompt';
import ArchivedDecisionsComponent from './components/archived-decisions';
import {ROUTES} from './constants';

// router config
Vue.use(VueRouter);

const router = new VueRouter({
  routes : [
    { path: ROUTES.HOME, component: WelcomeComponent },
    { path: ROUTES.OPTIONS, component: OptionsComponent },
    { path: ROUTES.CRITERIA, component: CriteriaComponent },
    { path: ROUTES.OPTION_COMPARISONS, component: OptionComparisonListComponent },
    { path: ROUTES.CRITERIA_COMPARISONS, component: CriteriaComparisonListComponent },
    { path: ROUTES.REPORT, component: ReportComponent },
    { path: ROUTES.SAVE, component: SavePromptComponent },
    { path: ROUTES.ARCHIVE, component: ArchivedDecisionsComponent},
    { path: '*', redirect: '/' }  // default route
  ]
});

export default router;