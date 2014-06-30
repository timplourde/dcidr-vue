
describe("decidr.Decision", function () {

    function rankEverything(decision) {
        ko.utils.arrayForEach(decision.optionComparisons(), function (i) {
            i.rank('gt');
        });
        ko.utils.arrayForEach(decision.criteriaComparisons(), function (i) {
            i.rank('gt');
        });
    }

    it("constructs an empty new decision when nothing is passed to the CTOR", function () {
        this.clock = sinon.useFakeTimers();

        var decision = new dcidr.Decision();
        expect(decision.id).not.toBe(null);
        expect(decision.name()).toEqual('');
        expect(decision.date).toEqual(new Date());
        expect(decision.options()).toEqual([]);
        expect(decision.criteria()).toEqual([]);
        expect(decision.optionComparisons()).toEqual([]);
        expect(decision.criteriaComparisons()).toEqual([]);
        expect(decision.report()).toEqual([]);

        this.clock.restore();
    });

    it("constructs a decision from data passed to the CTOR", function () {
        var data = fixtures.getSavedReport();
        var decision = new dcidr.Decision(data);

        expect(decision.id).toBe(data.id);
        expect(decision.name()).toEqual(data.name);
        expect(decision.date).toEqual(data.date);
        expect(decision.options()).toEqual(data.options);
        expect(decision.criteria()).toEqual(data.criteria);

        var ocs = decision.optionComparisons();
        for (var i = 0; i < data.optionComparisons; i++) {
            var original = data.optionComparisons[i];
            var current = ocs[i];
            expect(current.criteria).toEqual(original.criteria);
            expect(current.optionA).toEqual(original.optionA);
            expect(current.optionB).toEqual(original.optionB);
            expect(current.hash).toEqual(original.hash);
            expect(current.rank()).toEqual(original.rank);
        }

        var ccs = decision.criteriaComparisons();
        for (var i = 0; i < data.criteriaComparisons; i++) {
            var original = data.criteriaComparisons[i];
            var current = ocs[i];
            expect(current.criteriaA).toEqual(original.criteriaA);
            expect(current.criteriaB).toEqual(original.criteriaB);
            expect(current.hash).toEqual(original.hash);
            expect(current.rank()).toEqual(original.rank);
        }

        expect(decision.report()).toEqual(data.report);

    });

    it("exports a serializable decision object", function () {
        var data = fixtures.getSavedReport();
        var decision = new dcidr.Decision(data);
        var exported = decision.export();
        expect(exported).toEqual(data);
    });

    it("generates a report", function () {
        var fakeReport = ['dogs','cats'];
        spyOn(dcidr, 'report').and.returnValue(fakeReport);

        var decision = new dcidr.Decision();

        expect(decision.generateReport()).toBeFalsy();
        expect(decision.report()).toEqual([]);

        decision.options(['one', 'two']);
        decision.criteria(['a', 'b']);
        rankEverything(decision);

        expect(decision.generateReport()).toBeTruthy();

        expect(decision.report()).toEqual(fakeReport);
    });

    describe("sets gates correctly", function () {
        var decision;

        beforeEach(function () {
            decision = new dcidr.Decision(fixtures.getSavedReport());
        });

        it("for having enough options", function () {
            expect(decision.gates.options()).toBeTruthy();
            decision.options([]);
            expect(decision.gates.options()).toBeFalsy();
            decision.options.push('a');
            expect(decision.gates.options()).toBeFalsy();
            decision.options.push('b');
            expect(decision.gates.options()).toBeTruthy();
        });

        it("for having enough criteria", function () {
            expect(decision.gates.criteria()).toBeTruthy();
            decision.criteria([]);
            expect(decision.gates.criteria()).toBeFalsy();
            decision.criteria.push('a');
            expect(decision.gates.criteria()).toBeFalsy();
            decision.criteria.push('b');
            expect(decision.gates.criteria()).toBeTruthy();
        });

        it("for ranking all optionComparisons", function () {
            expect(decision.gates.optionComparisons()).toBeTruthy();
            decision.optionComparisons()[0].rank(null);
            expect(decision.gates.optionComparisons()).toBeFalsy();
        });

        it("for ranking all criteriaComparisons", function () {
            expect(decision.gates.criteriaComparisons()).toBeTruthy();
            decision.criteriaComparisons()[0].rank(null);
            expect(decision.gates.criteriaComparisons()).toBeFalsy();
        });

        it("to generate a report", function () {
            expect(decision.gates.report()).toBeTruthy();

            decision.criteriaComparisons()[0].rank(null);
            expect(decision.gates.report()).toBeFalsy();
            decision.criteriaComparisons()[0].rank('gt');

            decision.optionComparisons()[0].rank(null);
            expect(decision.gates.report()).toBeFalsy();
            decision.optionComparisons()[0].rank('gt');

            decision.criteria([]);
            expect(decision.gates.report()).toBeFalsy();
            decision.criteria(['one', 'two']);
            rankEverything(decision);
            expect(decision.gates.report()).toBeTruthy();

            decision.options([]);
            expect(decision.gates.report()).toBeFalsy();
            decision.options(['one', 'two']);
            rankEverything(decision);
            expect(decision.gates.report()).toBeTruthy();
        });
    });

    describe("updates criteriaComparisons", function () {
        var decision;

        beforeEach(function () {
            decision = new dcidr.Decision();
            decision.options(['1', '2']);
        });

        it("when adding criteria", function () {
            decision.criteria.push('a');
            expect(decision.criteriaComparisons().length).toBe(0);
            decision.criteria.push('b');
            expect(decision.criteriaComparisons().length).toBe(1);
            decision.criteria.push('c');

            expect(ko.toJS(decision.criteriaComparisons())).toEqual([
                { criteriaA: 'b', criteriaB: 'c', rank: null, hash: 'b|c' },
                { criteriaA: 'a', criteriaB: 'c', rank: null, hash: 'a|c' },
                { criteriaA: 'a', criteriaB: 'b', rank: null, hash: 'a|b' }]);
        });

        it("when removing criteria", function () {
            decision.criteria(['a','b','c','d']);
            expect(decision.criteriaComparisons().length).toBe(6);
            decision.criteria.pop();
            expect(decision.criteriaComparisons().length).toBe(3);
            expect(ko.toJS(decision.criteriaComparisons())).toEqual([
                { criteriaA: 'b', criteriaB: 'c', rank: null, hash: 'b|c' },
                { criteriaA: 'a', criteriaB: 'c', rank: null, hash: 'a|c' },
                { criteriaA: 'a', criteriaB: 'b', rank: null, hash: 'a|b' }]);
        });

    });

    describe("updates optionComparisons", function () {
        var decision;

        beforeEach(function () {
            decision = new dcidr.Decision();
        });

        it("when adding options", function () {
            decision.criteria(['a','b']);
            decision.options.push('1');
            expect(decision.optionComparisons().length).toBe(0);
            decision.options.push('2');
            expect(decision.optionComparisons().length).toBe(2);
            decision.options.push('3');
            expect(decision.optionComparisons().length).toBe(6);

            expect(ko.toJS(decision.optionComparisons())).toEqual([
                { criteria: 'b', optionA: '2', optionB: '3', rank: null, hash: 'b|2|3' },
                { criteria: 'b', optionA: '1', optionB: '3', rank: null, hash: 'b|1|3' },
                { criteria: 'b', optionA: '1', optionB: '2', rank: null, hash: 'b|1|2' },
                { criteria: 'a', optionA: '2', optionB: '3', rank: null, hash: 'a|2|3' },
                { criteria: 'a', optionA: '1', optionB: '3', rank: null, hash: 'a|1|3' },
                { criteria: 'a', optionA: '1', optionB: '2', rank: null, hash: 'a|1|2' }]);

        });

        it("when removing options", function () {
            decision.criteria(['a', 'b']);
            decision.options(['1', '2', '3']);
            expect(decision.optionComparisons().length).toBe(6);

            decision.options.pop();

            expect(ko.toJS(decision.optionComparisons())).toEqual([
                { criteria: 'b', optionA: '1', optionB: '2', rank: null, hash: 'b|1|2' },
                { criteria: 'a', optionA: '1', optionB: '2', rank: null, hash: 'a|1|2' }]);
        });

        it("when adding criteria", function () {
            decision.criteria(['a', 'b']);
            decision.options(['1', '2']);
            expect(decision.optionComparisons().length).toBe(2);

            decision.criteria.push('c');
            expect(ko.toJS(decision.optionComparisons())).toEqual([
                { criteria: 'c', optionA: '1', optionB: '2', rank: null, hash: 'c|1|2' },
                { criteria: 'b', optionA: '1', optionB: '2', rank: null, hash: 'b|1|2' },
                { criteria: 'a', optionA: '1', optionB: '2', rank: null, hash: 'a|1|2' }]);
        });

        it("when removing criteria", function () {
            decision.criteria(['a', 'b','c']);
            decision.options(['1', '2']);
            expect(decision.optionComparisons().length).toBe(3);

            decision.criteria.pop();
            expect(ko.toJS(decision.optionComparisons())).toEqual([
                { criteria: 'b', optionA: '1', optionB: '2', rank: null, hash: 'b|1|2' },
                { criteria: 'a', optionA: '1', optionB: '2', rank: null, hash: 'a|1|2' }]);
        });

    });
});

