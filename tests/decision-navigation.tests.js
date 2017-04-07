import decisionNavigation from "../src/mixins/decision-navigation";
import {ROUTES} from '../src/constants';

describe("decisionNavigtion.created", function(){
    beforeEach(function(){
        decisionNavigation.$state = null;
        decisionNavigation.$route = null;
        decisionNavigation.$router = {
            push: function(newRoute){
                decisionNavigation.newPath = newRoute.path;
            }
        };
    });
    function setGates(gates){
        decisionNavigation.$store = {
            state: {
                decision: {
                    gates
                }
            }
        }
    }
    function setPath(path){
        decisionNavigation.$route = {
            path
        }
    }
    it("it bounces to OPTIONS if there are not enough options", function(){
        setPath(ROUTES.CRITERIA);
        setGates({
            hasEnoughOptions: false
        });

        decisionNavigation.created();
        
        expect(decisionNavigation.newPath).to.equal(ROUTES.OPTIONS);
    });
    it("it bounces to CRITERIA if there are not enough criteria", function(){
        setPath(ROUTES.OPTION_COMPARISONS);
        setGates({
            hasEnoughCriteria: false
        });

        decisionNavigation.created();
        
        expect(decisionNavigation.newPath).to.equal(ROUTES.CRITERIA);
    });

    it("it bounces to OPTION_COMPARISONS if all option comparisons have not been ranked", function(){
        setPath(ROUTES.CRITERIA_COMPARISONS);
        setGates({
            allOptionComparisonsRanked: false
        });

        decisionNavigation.created();
        
        expect(decisionNavigation.newPath).to.equal(ROUTES.OPTION_COMPARISONS);
    });

    it("it bounces to OPTIONS if not all gates have been passed", function(){
        [ROUTES.REPORT, ROUTES.SAVE].forEach( route => {

            setPath(route);
            setGates({
                allCriteriaComparisonsRanked: false
            });

            decisionNavigation.created();
            
            expect(decisionNavigation.newPath).to.equal(ROUTES.OPTIONS);
        });
        
    });
});
