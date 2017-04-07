import Decision from "../src/model/decision";
import modelFactory from "./decision-model";

describe("Decision", function() {
    let sut = null;

    beforeEach(function(){
        sut = new Decision();
    });

    describe("CTOR", function() {

        it("sets default properties when no model is passed", function() {
            sut = new Decision();
            expect(sut.id).to.not.be.null;
            expect(sut.name).to.be.null;
            expect(sut.date).not.to.be.null;
            expect(sut.options).to.deep.equal([]);
            expect(sut.criteria).to.deep.equal([]);
            expect(sut.optionComparisons).to.deep.equal([]);
            expect(sut.criteriaComparisons).to.deep.equal([]);
            expect(sut.report).to.deep.equal([]);
            expect(sut.gates).to.deep.equal({
                hasEnoughOptions: false,
                hasEnoughCriteria: false,
                allCriteriaComparisonsRanked: false,
                allOptionComparisonsRanked: false
            });
        });

        it("sets properties when a model is passed", function() {
            const model = modelFactory();
            sut = new Decision(model);
            expect(sut.id).to.equal(model.id);
            expect(sut.name).to.equal(model.name);
            expect(sut.date).to.equal(model.date);
            expect(sut.options).to.deep.equal(model.options);
            expect(sut.criteria).to.deep.equal(model.criteria);
            expect(sut.optionComparisons).to.deep.equal(model.optionComparisons);
            expect(sut.criteriaComparisons).to.deep.equal(model.criteriaComparisons);
            expect(sut.report).to.deep.equal(model.report);
        });

        it("sets gates property when a model is passed", function() {
            let sut = new Decision(modelFactory());
            expect(sut.gates).to.deep.equal({
                hasEnoughOptions: true,
                hasEnoughCriteria: true,
                allCriteriaComparisonsRanked: true,
                allOptionComparisonsRanked: true
            });
        });

       
    });

     describe("addOption", function(){

        it("updates gates.hasEnoughOptions", function(){
            sut.addOption("opt-a");
            expect(sut.gates.hasEnoughOptions).to.be.false;
            sut.addOption("opt-b");
            expect(sut.gates.hasEnoughOptions).to.be.true;
        });
        it("adds optionComparisons", function(){
            sut.addCrit("crit-x");
            sut.addCrit("crit-y");
            sut.addOption("opt-a");
            sut.addOption("opt-b");
            expect(sut.optionComparisons.length).to.equal(2);
            sut.addOption("opt-c");
            expect(sut.optionComparisons.length).to.equal(6);

            expect(sut.optionComparisons[0]).to.deep.equal({
                "criteria":"crit-y",
                "optionA":"opt-b",
                "optionB":"opt-c",
                "rank":null,
                "hash":"crit-y|opt-b|opt-c"
            });
        });
    });
    describe("removeOption", function(){
        it("updates gates.hasEnoughOptions", function(){
            sut.addOption("opt-a");
            sut.addOption("opt-b");
            sut.removeOption("opt-b");
            expect(sut.gates.hasEnoughOptions).to.be.false;
        });
        it("removes optionComparisons", function(){
            sut.addCrit("crit-x");
            sut.addCrit("crit-y");
            sut.addOption("opt-a");
            sut.addOption("opt-b");
            sut.removeOption("opt-c");
            expect(sut.optionComparisons.length).to.equal(2);
        });
    });
    describe("addCrit", function(){
        it("updates gates.hasEnoughCriteria", function(){
            sut.addCrit('c1');
            expect(sut.gates.hasEnoughCriteria).to.be.false;
            sut.addCrit('c2');
            expect(sut.gates.hasEnoughCriteria).to.be.true;
        });
        it("doesn't allow for duplicates", function(){
            sut.addCrit('c1');
            sut.addCrit('C1');
            expect(sut.criteria.length).to.equal(1);
        });
        it("adds criteriaComparisons", function(){
            sut.addCrit('c1');
            sut.addCrit('c2');
            expect(sut.criteriaComparisons.length).to.equal(1);
            sut.addCrit('c3');
            expect(sut.criteriaComparisons.length).to.equal(3);
            
            expect(sut.criteriaComparisons[0]).to.deep.equal({
                "criteriaA":"c2",
                "criteriaB":"c3",
                "rank":null,
                "hash":"c2|c3"
            });
        });
        it("adds optionComparisons", function(){
            sut.addOption('o1');
            sut.addOption('o2');
            sut.addCrit('c1');
            sut.addCrit('c2');
            expect(sut.optionComparisons.length).to.equal(2);
            sut.addCrit('c3');
            expect(sut.optionComparisons.length).to.equal(3);
        });
    });
    describe("removeCrit", function(){
        it("updates gates.hasEnoughCriteria", function(){
            sut.addCrit('c1');
            sut.addCrit('c2');
            expect(sut.gates.hasEnoughCriteria).to.be.true;
            sut.removeCrit('c2');
            expect(sut.gates.hasEnoughCriteria).to.be.false;
        });
        it("doesn't allow for duplicates", function(){
            sut.addOption('o1');
            sut.addOption('O1');
            expect(sut.options.length).to.equal(1);
        });
        it("removes criteriaComparisons", function(){
            sut.addCrit('c1');
            sut.addCrit('c2');
            sut.addCrit('c3');
            expect(sut.criteriaComparisons.length).to.equal(3);
            sut.removeCrit('c3');
            expect(sut.criteriaComparisons.length).to.equal(1);
        });
        it("removes optionComparisons", function(){
            sut.addOption('o1');
            sut.addOption('o2');
            sut.addCrit('c1');
            sut.addCrit('c2');
            sut.addCrit('c3');
            expect(sut.optionComparisons.length).to.equal(3);
            sut.removeCrit('c3');
            expect(sut.optionComparisons.length).to.equal(2);
        });
    });
    describe("setting all ranks", function(){
        beforeEach(function(){
            sut.addOption('o1');
            sut.addOption('o2');
            sut.addCrit('c1');
            sut.addCrit('c2');
            sut.optionComparisons.forEach(function(r){
                sut.updateOptionComparisonRank(r.hash, 'gt');
            });
            sut.criteriaComparisons.forEach(function(r){
                sut.updateCriteriaComparisonRank(r.hash, 'lt');
            });
        });
        it("generates a report", function(){ 
            expect(sut.report).to.deep.equal([{"option":"o1","score":0.9615384615384613},{"option":"o2","score":0.038461538461538464}]);
        });
        it("sets all gates to true", function(){ 
            expect(sut.gates).to.deep.equal({
                hasEnoughOptions: true,
                hasEnoughCriteria: true,
                allCriteriaComparisonsRanked: true,
                allOptionComparisonsRanked: true
            });
        });
        describe("then adding an option", function(){
            beforeEach(function(){
                sut.addOption("o3");
            });
            it("adds optionComparisons", function(){
                expect(sut.optionComparisons.length).to.equal(6);
            });
            it("sets gates.allOptionComparisonsRanked to false", function(){
                expect(sut.gates.allOptionComparisonsRanked).to.be.false;
            });
            it("empties the report", function(){
                expect(sut.report).to.deep.equal([]);
            });
        });
        describe("then adding an crit", function(){
            beforeEach(function(){
                sut.addCrit("c3");
            });
            it("adds comparisons", function(){
                expect(sut.criteriaComparisons.length).to.equal(3);
                expect(sut.optionComparisons.length).to.equal(3);
            });
            it("sets rank gates to false", function(){
                expect(sut.gates.allOptionComparisonsRanked).to.be.false;
                expect(sut.gates.allCriteriaComparisonsRanked).to.be.false;
            });
            it("empties the report", function(){
                expect(sut.report).to.deep.equal([]);
            });
        });
    });
});