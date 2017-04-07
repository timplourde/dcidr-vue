import {ROUTES} from '../constants';

const decisionNavigation = {
    created(){
        // re-route the user in case they deep link to a decision
        // in an invalid state for the view
        let gates = {};
        if(this.$store 
            && this.$store.state
            && this.$store.state.decision 
            && this.$store.state.decision.gates){
            gates = this.$store.state.decision.gates;
        }
        let path = '';
        if(this.$route && this.$route.path){
            path = this.$route.path;
        }
        switch(path){
            case ROUTES.CRITERIA:
                if(!gates.hasEnoughOptions){
                    this.$router.push({path: ROUTES.OPTIONS});
                }
                break;
            case ROUTES.OPTION_COMPARISONS:
                if(!gates.hasEnoughCriteria){
                    this.$router.push({path: ROUTES.CRITERIA});
                }
                break;
             case ROUTES.CRITERIA_COMPARISONS:
                if(!gates.allOptionComparisonsRanked){
                    this.$router.push({path: ROUTES.OPTION_COMPARISONS});
                }
                break;
            case ROUTES.REPORT:
            case ROUTES.SAVE:
                if(!gates.hasEnoughOptions
                    || !gates.hasEnoughCriteria
                    || !gates.allOptionComparisonsRanked
                    || !gates.allCriteriaComparisonsRanked ) {
                        this.$router.push({path: ROUTES.OPTIONS});
                }
                break;
            default:
                break;
        }
    }
};

export default decisionNavigation;