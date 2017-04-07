import CriteriaComponent from "../src/components/criteria";
import Vue from 'vue';
import store from '../src/store';
import {MUTATIONS} from '../src/constants';

describe("CriteriaComponent", function(){
    var unsub, mutations;
    
    beforeEach(function(){
        mutations = [];
        unsub = store.subscribe((mutation, state) => {
            mutations.push(mutation);
        });
    });

    afterEach(function(){
        unsub();
    });

    it("has default data", function(){
        const vm = new CriteriaComponent();
        expect(vm.newCrit).to.equal(null);
        expect(vm.showHelp).to.equal(false);
    });

    it('adds a crit if one with the same name does not already exist', function(){
        const vm = new CriteriaComponent({store});

        vm.newCrit = 'new';
        vm.addCrit();
        expect(vm.newCrit).to.equal(null);

        vm.newCrit = 'new';
        vm.addCrit();
        expect(mutations.filter(m=>{
            return m.type === MUTATIONS.ADD_CRIT
        }).length).to.equal(1);
    });
    it('removes a crit', function(){
        const vm = new CriteriaComponent({store});
        vm.removeCrit('foo');
        expect(mutations.filter(m=> {
            return m.type === MUTATIONS.REMOVE_CRIT
                && m.payload === 'foo';
        }).length).to.equal(1);
    })
});
