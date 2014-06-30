
describe("decidr.App", function () {
    var sut,
        VIEW_TIMEOUT = 351;

    beforeEach(function () {
        sut = new dcidr.App();
        spyOnAllFunctions(dcidr.components, true);
        spyOn(dcidr.browser, 'scrollToTop');
        spyOnAllFunctions(dcidr.browser.history);
    });

    afterEach(function () {
        sut.dispose();
    });


    it("sets default property values", function () {
        expect(sut.currentView().name).toEqual('loading-template');
        expect(sut.decision).toBeNull();
        expect(sut.isTransitioning()).toBeFalsy();
    });

    it("(async) init loads the welcome page during construction", function (done) {
        sut.init();
        setTimeout(function () {
            expect(sut.currentView().name).toEqual('welcome-template');
            expect(sut.isTransitioning()).toBeFalsy();
            done();
        }, VIEW_TIMEOUT);
    });

    it("sets useWelcomeLayout if the welcome page is loaded", function () {
        expect(sut.useWelcomeLayout()).toBeFalsy();
        sut.currentView({ name: 'welcome-template' });
        expect(sut.useWelcomeLayout()).toBeTruthy();
    });

    it("(async) setCurrentView loads the appropriate view", function (done) {
        sut.decision = new dcidr.Decision();
        var fakeView = {
            data: {
                dispose: jasmine.createSpy('fakeViewDispose')
            }
        };
        sut.currentView(fakeView);

        sut.setCurrentView('define-options', sut.decision);
        setTimeout(function () {
            expect(fakeView.data.dispose).toHaveBeenCalled();
            expect(sut.currentView().name).toEqual('define-options-template');
            expect(sut.currentView().nav).toEqual('define-options');
            expect(sut.currentView().data.items()).toEqual([]);  // integration-y
            expect(sut.isTransitioning()).toBeFalsy();
            expect(dcidr.browser.history.push).toHaveBeenCalledWith('define-options');
            done();
        }, VIEW_TIMEOUT);
    });

    it("goToWelcomeView gets the archive list and loads welcome", function () {
        spyOn(dcidr.archive, 'getList').and.returnValue([1,2,3]);
        spyOn(sut, 'setCurrentView');

        sut.goToWelcomeView();

        expect(sut.setCurrentView).toHaveBeenCalledWith('welcome', 3);

    });

    it("loadDecision delegates to the archive and goes to welcome", function () {
        
    });

    // handle all events
    it("handles the NAV.ARCHIVE message", function () {
        spyOn(dcidr.archive, 'getList').and.returnValue('archive');
        spyOn(sut, 'setCurrentView');

        ko.postbox.publish(dcidr.const.NAV.ARCHIVE);
        
        expect(sut.setCurrentView).toHaveBeenCalledWith('archive', 'archive');
    });

    it("handles the NAV.NEXT message", function () {
        spyOn(sut, 'setCurrentView');

        sut.currentView({
            nav: 'define-options'
        });

        ko.postbox.publish(dcidr.const.NAV.NEXT);

        expect(sut.setCurrentView).toHaveBeenCalledWith('define-criteria', sut.decision);
    });

    it("handles the NAV.PREV message when we're not on the first page", function () {
        spyOn(sut, 'setCurrentView');

        sut.currentView({
            nav: 'define-criteria'
        });

        ko.postbox.publish(dcidr.const.NAV.PREV);

        expect(sut.setCurrentView).toHaveBeenCalledWith('define-options', sut.decision);
    });

    it("handles the NAV.PREV message when we're on the first page, existing the current decision", function () {

        spyOn(sut, 'goToWelcomeView');
        var spy = jasmine.createSpy();
        sut.decision = {
            dispose: spy
        };
        sut.currentView({
            nav: 'define-options'
        });

        ko.postbox.publish(dcidr.const.NAV.PREV);

        expect(sut.goToWelcomeView).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
        expect(sut.decision).toBeNull();
    });

    it("handles the EVENTS.NEW_DECISION message", function () {
        spyOn(sut, 'setCurrentView');
        var spy = jasmine.createSpy();
        sut.decision = {
            dispose: spy
        };

        ko.postbox.publish(dcidr.const.EVENTS.NEW_DECISION);

        expect(sut.decision).not.toBeNull();
        expect(sut.setCurrentView).toHaveBeenCalledWith('define-options', sut.decision);
    });

    it("handles the EVENTS.BUILD_REPORT message", function () {
        spyOn(sut, 'setCurrentView');
        var spy = jasmine.createSpy().and.returnValue(true);
        sut.decision = {
            generateReport: spy
        };

        ko.postbox.publish(dcidr.const.EVENTS.BUILD_REPORT);

        expect(spy).toHaveBeenCalled();
        expect(sut.setCurrentView).toHaveBeenCalledWith('report', sut.decision);
    });

    it("handles the EVENTS.SAVE message", function () {
        spyOn(dcidr.archive, 'saveDecision');
        ko.postbox.publish(dcidr.const.EVENTS.SAVE);
        expect(dcidr.archive.saveDecision).toHaveBeenCalledWith(sut.decision);
    });

    it("handles the EVENTS.EXIT message", function () {
        spyOn(sut, 'goToWelcomeView');
        var spy = jasmine.createSpy();
        sut.decision = {
            dispose: spy
        };

        ko.postbox.publish(dcidr.const.EVENTS.EXIT);

        expect(sut.goToWelcomeView).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
        expect(sut.decision).toBeNull();

    });

    it("handles the EVENTS.DELETE message", function () {
        spyOn(dcidr.archive, 'deleteDecision');
        ko.postbox.publish(dcidr.const.EVENTS.DELETE, 111);
        expect(dcidr.archive.deleteDecision).toHaveBeenCalledWith(111);
    });

    it("handles the EVENTS.PURGE_ARCHIVE message", function () {
        spyOn(dcidr.archive, 'empty');
        spyOn(sut, 'goToWelcomeView');

        ko.postbox.publish(dcidr.const.EVENTS.PURGE_ARCHIVE);

        expect(dcidr.archive.empty).toHaveBeenCalled();
        expect(sut.goToWelcomeView).toHaveBeenCalled();
    });

    it("handles the EVENTS.LOAD message", function () {
        spyOn(dcidr.archive, 'getDecision').and.returnValue('fake decision');
        spyOn(sut, 'setCurrentView');

        ko.postbox.publish(dcidr.const.EVENTS.LOAD, '111');

        expect(dcidr.archive.getDecision).toHaveBeenCalledWith('111');
        expect(sut.setCurrentView).toHaveBeenCalledWith('define-options', 'fake decision');
    });
});
