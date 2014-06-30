
describe("decidr.components.", function () {
    var sut,
        decision;

    function expectCommonWizardFunctionality(component) {
        spyOn(ko.postbox, 'publish');
        
        component.proceed();
        expect(ko.postbox.publish).toHaveBeenCalledWith(dcidr.const.NAV.NEXT);

        component.goBack();
        expect(ko.postbox.publish).toHaveBeenCalledWith(dcidr.const.NAV.PREV);

        expect(component.showHelp()).toBeFalsy();
        component.showHelp.toggle();
        expect(component.showHelp()).toBeTruthy();
    };

    function expectRankSettingFunctionality(component) {
        var item = {
            rank: ko.observable(null)
        };
        component.setMlt(item);
        expect(item.rank()).toEqual('mlt');
        component.setLt(item);
        expect(item.rank()).toEqual('lt');
        component.setEq(item);
        expect(item.rank()).toEqual('eq');
        component.setGt(item);
        expect(item.rank()).toEqual('gt');
        component.setMgt(item);
        expect(item.rank()).toEqual('mgt');
    };

    describe("Welcome", function () {
        
        beforeEach(function () {
            sut = new dcidr.components.Welcome();
        });

        it("sets default property values", function () {
            expect(sut.isArchiveButtonVisible).toEqual(false);
            expect(sut.isAboutSectionVisible()).toEqual(false);
        });

        it("sets default property values", function () {
            sut = new dcidr.components.Welcome(true);
            expect(sut.isArchiveButtonVisible).toEqual(true);
            expect(sut.isAboutSectionVisible()).toEqual(false);
        });

        it('toggles isAboutSectionVisible', function () {
            sut.isAboutSectionVisible.toggle();
            expect(sut.isAboutSectionVisible()).toEqual(true);
        });

        it('publishes events', function () {
            spyOn(ko.postbox, 'publish');
            sut.loadArchive();
            expect(ko.postbox.publish).toHaveBeenCalledWith(dcidr.const.NAV.ARCHIVE);
            sut.getStarted();
            expect(ko.postbox.publish).toHaveBeenCalledWith(dcidr.const.EVENTS.NEW_DECISION);
        });
    });

    describe("Options", function () {
        beforeEach(function () {
            decision = {
                options: ko.observableArray(['a', 'b']),
                gates: {
                    options: ko.observable(true)
                }
            };
            sut = new dcidr.components.Options(decision);
        });

       it("adds an item if it does not already exist (case + trim insensitive)", function () {
            sut.addItem();
            expect(sut.items().length).toEqual(2);

            sut.newItem(' B ');
            sut.addItem();
            expect(sut.items().length).toEqual(2);
            expect(sut.newItem()).toEqual('');

            sut.newItem('c');
            sut.addItem();
            expect(sut.items()).toEqual(['a', 'b', 'c']);
            expect(sut.newItem()).toEqual('');
        });

        it("removes an item", function () {
            sut.removeItem('b');
            expect(sut.items()).toEqual(['a']);
        });

        it("sets canProceed based on decision.gates.options", function () {
            expect(sut.canProceed()).toEqual(true);
            decision.gates.options(false);
            expect(sut.canProceed()).toEqual(false);
        });

        it('has common wizard component functionality', function () {
            expectCommonWizardFunctionality(sut);
        });
    });

    describe("Criteria", function () {
        beforeEach(function () {
            decision = {
                criteria: ko.observableArray(['a', 'b']),
                gates: {
                    criteria: ko.observable(true)
                }
            };
            sut = new dcidr.components.Criteria(decision);
        });

        it("adds an item if it does not already exist (case + trim insensitive)", function () {
            sut.addItem();
            expect(sut.items().length).toEqual(2);

            sut.newItem(' B ');
            sut.addItem();
            expect(sut.items().length).toEqual(2);
            expect(sut.newItem()).toEqual('');

            sut.newItem('c');
            sut.addItem();
            expect(sut.items()).toEqual(['a', 'b', 'c']);
            expect(sut.newItem()).toEqual('');
        });

        it("removes an item", function () {
            sut.removeItem('b');
            expect(sut.items()).toEqual(['a']);
        });

        it("sets canProceed based on decision.gates.criteria", function () {
            expect(sut.canProceed()).toEqual(true);
            decision.gates.criteria(false);
            expect(sut.canProceed()).toEqual(false);
        });

        it('has common wizard component functionality', function () {
            expectCommonWizardFunctionality(sut);
        });
    });

    describe("CompareOptions", function () {
        beforeEach(function () {
            decision = {
                optionComparisons: ko.observableArray(['a', 'b']),
                gates: {
                    optionComparisons: ko.observable(true)
                }
            };
            sut = new dcidr.components.CompareOptions(decision);
        });

        it('fires events for goBack and proceed', function () {
            spyOn(ko.postbox, 'publish');

            sut.proceed();
            expect(ko.postbox.publish).toHaveBeenCalledWith(dcidr.const.NAV.NEXT);

            sut.goBack();
            expect(ko.postbox.publish).toHaveBeenCalledWith(dcidr.const.NAV.PREV);
        });

        it('has rank setting functionality', function () {
            expectRankSettingFunctionality(sut);
        });

        it('has optionComparisons', function () {
            expect(sut.optionComparisons).toEqual(decision.optionComparisons);
        });

        it("sets canProceed based on decision.gates.optionComparisons", function () {
            expect(sut.canProceed()).toEqual(true);
            decision.gates.optionComparisons(false);
            expect(sut.canProceed()).toEqual(false);
        });
        
    });

    describe("CompareCriteria", function () {
        beforeEach(function () {
            decision = {
                criteriaComparisons: ko.observableArray(['a', 'b']),
                gates: {
                    criteriaComparisons: ko.observable(true)
                }
            };
            sut = new dcidr.components.CompareCriteria(decision);
        });

        it('fires events for goBack and proceed', function () {
            spyOn(ko.postbox, 'publish');

            sut.proceed();
            expect(ko.postbox.publish).toHaveBeenCalledWith(dcidr.const.EVENTS.BUILD_REPORT);

            sut.goBack();
            expect(ko.postbox.publish).toHaveBeenCalledWith(dcidr.const.NAV.PREV);
        });

        it('has rank setting functionality', function () {
            expectRankSettingFunctionality(sut);
        });

        it('has criteriaComparisons', function () {
            expect(sut.criteriaComparisons).toEqual(decision.criteriaComparisons);
        });

        it("sets canProceed based on decision.gates.criteriaComparisons", function () {
            expect(sut.canProceed()).toEqual(true);
            decision.gates.criteriaComparisons(false);
            expect(sut.canProceed()).toEqual(false);
        });

        it('sets hasMultiple', function () {
            expect(sut.hasMultiple).toEqual(true);
        });
    });

    describe("Report", function () {
        beforeEach(function () {
            decision = {
                report: ko.observableArray([{ name: 'a', score: .6 }, { name: 'b', score: .4 }])
            };
            sut = new dcidr.components.Report(decision);
        });

        it('fires events for goBack and proceed', function () {
            spyOn(ko.postbox, 'publish');

            sut.proceed();
            expect(ko.postbox.publish).toHaveBeenCalledWith(dcidr.const.NAV.NEXT);

            sut.goBack();
            expect(ko.postbox.publish).toHaveBeenCalledWith(dcidr.const.NAV.PREV);
        });

        it('has a report', function () {
            expect(sut.report).toEqual(decision.report);
        });

        it('has a bestScore', function () {
            expect(sut.bestScore).toEqual(.6);
        });
    });

    describe("SaveToArchive", function () {
        beforeEach(function () {
            decision = {
                name: ko.observable('')
            };
            sut = new dcidr.components.SaveToArchive(decision);
        });

        it('fires events for goBack and exit', function () {
            spyOn(ko.postbox, 'publish');

            sut.goBack();
            expect(ko.postbox.publish).toHaveBeenCalledWith(dcidr.const.NAV.PREV);

            sut.exit();
            expect(ko.postbox.publish).toHaveBeenCalledWith(dcidr.const.EVENTS.EXIT);
        });

        it('okToSave is true if the name is not emppty', function () {
            expect(sut.okToSave()).toBeFalsy();
            sut.name('omg');
            expect(sut.okToSave()).toBeTruthy();
        });

        it('saveAndExit conditionally exits', function () {
            spyOn(ko.postbox, 'publish');
            spyOn(sut, 'exit');

            sut.saveAndExit();
            expect(sut.exit).not.toHaveBeenCalled();
            expect(ko.postbox.publish).not.toHaveBeenCalled();

            sut.name('omg');
            sut.saveAndExit();
            expect(sut.exit).toHaveBeenCalled();
            expect(ko.postbox.publish).toHaveBeenCalledWith(dcidr.const.EVENTS.SAVE);
        });
    });

    describe("Archive", function () {
        beforeEach(function () {
            decisionList = [{
                id: 123,
                name: '123'
            }, {
                id: 456,
                name: '456'
            }];
            sut = new dcidr.components.Archive(decisionList);
        });

        it('sets decisions', function () {
            expect(sut.decisions()).toEqual(decisionList);
        });

        it('sets isEmpty based on decisions', function () {
            expect(sut.isEmpty()).toBeFalsy();
            sut.decisions([]);
            expect(sut.isEmpty()).toBeTruthy();
        });

        it('fires events', function () {
            spyOn(ko.postbox, 'publish');

            sut.destroyAll();
            expect(ko.postbox.publish).toHaveBeenCalledWith(dcidr.const.EVENTS.PURGE_ARCHIVE);

            sut.goHome();
            expect(ko.postbox.publish).toHaveBeenCalledWith(dcidr.const.EVENTS.EXIT);

            sut.load(sut.decisions()[0]);
            expect(ko.postbox.publish).toHaveBeenCalledWith(dcidr.const.EVENTS.LOAD, 123);
        });

        it('removes the decision from the list and conditionaly firex events', function () {
            spyOn(ko.postbox, 'publish');

            sut.destroy(sut.decisions()[0]);
            expect(sut.decisions().length).toBe(1);
            expect(ko.postbox.publish).toHaveBeenCalledWith(dcidr.const.EVENTS.DELETE, 123);
            expect(ko.postbox.publish).not.toHaveBeenCalledWith(dcidr.const.EVENTS.EXIT);

            sut.destroy(sut.decisions()[0]);
            expect(sut.decisions().length).toBe(0);
            expect(ko.postbox.publish).toHaveBeenCalledWith(dcidr.const.EVENTS.DELETE, 456);
            expect(ko.postbox.publish).toHaveBeenCalledWith(dcidr.const.EVENTS.EXIT);
        });

    });
});
