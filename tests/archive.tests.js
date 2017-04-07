import *  as archive from "../src/model/archive";

describe("archive.", function(){

    afterEach(function(){
        archive.deleteArchive();
    });

    describe("saving a decision", function(){
        var decisionModel = {
            id:"123", 
            name:"name",
            date: "date",
            somethingElse: "somethingElse"
        };
        beforeEach(function(){
            archive.saveDecision(decisionModel);
        });
        it("persists to localStorage", function(){
            let saved = archive.loadDecisionModel("123");
            expect(saved).to.deep.equal(saved);
        });
        it("adds an entry to the list", function(){
            let list = archive.loadArchive();
            expect(list[0].id).to.equal(decisionModel.id);
            expect(list[0].name).to.equal(decisionModel.name);
            expect(list[0].date).to.not.be.null;
        });
    });

    describe("updating a decision", function(){
        var decisionModel = {
            id:"123", 
            name:"name",
            date: "date"
        };
        beforeEach(function(){
            archive.saveDecision(decisionModel);
            var updated = Object.assign({}, decisionModel);
            updated.name = 'updated';
            archive.saveDecision(updated);
        });
        it("updates the name", function(){
            let saved = archive.loadDecisionModel(decisionModel.id);
            expect(saved.id).to.equal(decisionModel.id);
            expect(saved.name).to.equal("updated");
        });
        it("updates the name in the archive", function(){
            let list = archive.loadArchive();
            expect(list[0].name).to.equal("updated");
        });
    });
});
