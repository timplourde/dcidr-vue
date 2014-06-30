
describe("decidr.archive", function () {
    var sut = dcidr.archive;

    it("empties local storage", function () {
        spyOn(dcidr.browser.storage, 'empty');
        sut.empty();
        expect(dcidr.browser.storage.empty).toHaveBeenCalled();
    });

    it("returns the parsed list from storage when it exists", function () {
        spyOn(dcidr.browser.storage, 'retrieve').and.returnValue("[1, 2, 3]");
        var result = sut.getList();
        expect(result).toEqual([1, 2, 3]);
    });

    it("returns an empty array when no list exists in storage", function () {
        spyOn(dcidr.browser.storage, 'retrieve').and.returnValue(null);
        var result = sut.getList();
        expect(result).toEqual([]);
    });

    it("getDecision returns a decision which exists", function () {
        var decision = fixtures.getSavedReport();
        var fakeDecision = JSON.stringify(decision);
        spyOn(dcidr.browser.storage, 'retrieve').and.returnValue(fakeDecision);

        var result = sut.getDecision('123');

        expect(dcidr.browser.storage.retrieve).toHaveBeenCalledWith('123');
        expect(result.export(), decision);
    });

    it("getDecision returns null when a decision which exists and deleted it from the list", function () {

        var retVals = {
            'decision-list': '[{ "id": "123" }, { "id": "456"}]',
            '123': null
        };
        function fake(param) {
            return retVals[param];
        }

        spyOn(dcidr.browser.storage, 'retrieve').and.callFake(fake);
        spyOn(dcidr.browser.storage, 'save');

        var result = sut.getDecision('123');

        expect(dcidr.browser.storage.retrieve).toHaveBeenCalledWith('123');
        expect(dcidr.browser.storage.save).toHaveBeenCalledWith('decision-list', 
            '[{"id":"456"}]');
        expect(result).toBeNull();
    });

    it("deleteDecision deletes the desicion and the list entry", function () {

        var retVals = {
            'decision-list': '[{ "id": "123" }, { "id": "456"}]'
        };
        function fake(param) {
            return retVals[param];
        }

        spyOn(dcidr.browser.storage, 'destroy');
        spyOn(dcidr.browser.storage, 'save');

        var result = sut.deleteDecision('123');

        expect(dcidr.browser.storage.destroy).toHaveBeenCalledWith('123');
        expect(dcidr.browser.storage.save).toHaveBeenCalledWith('decision-list',
            '[{"id":"456"}]');
        expect(result).toEqual(true);
    });

    it("saveDecision saves and appends to the list", function () {
        var data = fixtures.getSavedReport();
        data.id = '123';
        var decision = new dcidr.Decision(data);
        var retVals = {
            'decision-list': '[{ "id": "456"}]'     // excluding name, date
        };
        function fake(param) {
            return retVals[param];
        }

        spyOn(dcidr.browser.storage, 'retrieve').and.callFake(fake);
        spyOn(dcidr.browser.storage, 'save');

        var result = sut.saveDecision(decision);

        expect(dcidr.browser.storage.save).toHaveBeenCalledWith('decision-list',
            '[{"id":"456"},{"id":"123","name":"","date":"2014-06-29T17:07:58.358Z"}]');
        expect(result).toEqual('123');
    });

    it("saveDecision saves and updates the list entry", function () {
        var data = fixtures.getSavedReport();
        data.id = '123';
        data.name= "UPDATED";
        var decision = new dcidr.Decision(data);
        var retVals = {
            'decision-list': '[{ "id": "123", "name": "OLD", "date": "OLD"}, {"id":"456"}]' 
        };
        function fake(param) {
            return retVals[param];
        }

        spyOn(dcidr.browser.storage, 'retrieve').and.callFake(fake);
        spyOn(dcidr.browser.storage, 'save');

        var result = sut.saveDecision(decision);

        expect(dcidr.browser.storage.save).toHaveBeenCalledWith('decision-list',
            '[{"id":"123","name":"UPDATED","date":"2014-06-29T17:07:58.358Z"},{"id":"456"}]');
        expect(result).toEqual('123');
    });
});
