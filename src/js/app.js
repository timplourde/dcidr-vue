/* global ko */

(function (global) {
    "use strict";

    var ns = global.dcidr = global.dcidr || {};

    ns.App = function () {
        var self = this,
            VIEWS = {
                LOADING: 'loading',
                WELCOME: 'welcome',
                OPTIONS: 'define-options',
                CRITERIA: 'define-criteria',
                COMPARE_OPTIONS: 'compare-options',
                COMPARE_CRITERIA: 'compare-criteria',
                REPORT: 'report',
                SAVE: 'save-to-archive',
                ARCHIVE: 'archive'
            },
            TEMPLATE_POSTFIX = "-template",
            wizardSequence = [
                VIEWS.OPTIONS,
                VIEWS.CRITERIA,
                VIEWS.COMPARE_OPTIONS,
                VIEWS.COMPARE_CRITERIA,
                VIEWS.REPORT,
                VIEWS.SAVE
            ],
            components = {},
            archive = new ns.Archive();

        components[VIEWS.WELCOME] = ns.Components.Welcome;
        components[VIEWS.OPTIONS] = ns.Components.Options;
        components[VIEWS.CRITERIA] = ns.Components.Criteria;
        components[VIEWS.COMPARE_OPTIONS] = ns.Components.CompareOptions;
        components[VIEWS.COMPARE_CRITERIA] = ns.Components.CompareCriteria;
        components[VIEWS.REPORT] = ns.Components.Report;
        components[VIEWS.SAVE] = ns.Components.SaveToArchive;
        components[VIEWS.ARCHIVE] = ns.Components.Archive;

        self.currentView = ko.observable({
            name: VIEWS.LOADING + TEMPLATE_POSTFIX
        });
        self.decision = null;

        self.useWelcomeLayout = ko.computed(function () {
            return self.currentView() && self.currentView().name &&
                self.currentView().name === VIEWS.WELCOME + TEMPLATE_POSTFIX;
        });

        self.isTransitioning = ko.observable(false);

        self.setCurrentView = function (viewName, arg) {
            self.isTransitioning(true);

            setTimeout(function () {
                var current = self.currentView();
                if (current && current.data && current.data.dispose) {
                    current.data.dispose();
                }
                var component = typeof components[viewName] === 'function' ? new components[viewName](arg) : {};
                self.currentView({
                    nav: viewName,
                    name: viewName + TEMPLATE_POSTFIX,
                    data: component
                });
                ns.Browser.history.push(viewName);
                self.isTransitioning(false);
            }, 350);
        };

        ns.Browser.history.onPop(function (val) {
            if (val === "welcome") {
                self.exit();
            } else {
                ko.postbox.publish(ns.Const.NAV.PREV);
            }
        });

        self.newDecision = function () {
            if (self.decision) {
                self.decision.dispose();
            }
            self.decision = new ns.Decision();
            self.setCurrentView(VIEWS.OPTIONS, self.decision);
        };

        self.loadReport = function () {
            if (self.decision && self.decision.generateReport()) {
                self.setCurrentView(VIEWS.REPORT, self.decision);
                return true;
            }
            return false;
        };

        self.saveCurrentDecisionToArchive = function () {
            archive.saveDecision(self.decision);
        };

        self.deleteDecision = function (id) {
            archive.deleteDecision(id);
        };

        self.purgeArchive = function () {
            archive.empty();
            self.goToWelcome();
        };

        self.loadArchive = function () {
            var archiveData = archive.getList();
            self.setCurrentView(VIEWS.ARCHIVE, archiveData);
        };

        self.loadDecision = function (id) {
            self.decision = archive.getDecision(id);
            //if (!self.loadReport()) {
            self.setCurrentView(VIEWS.OPTIONS, self.decision);
            //}
        };

        self.exitCurrentDecision = function () {
            if (self.decision) {
                self.decision.dispose();
            }
            self.decision = null;
            self.goToWelcome();
        };

        self.goToWelcome = function () {
            var list = archive.getList();
            self.setCurrentView(VIEWS.WELCOME, list.length);
        };

        ko.postbox.subscribe(ns.Const.NAV.PREV, function () {
            var current = self.currentView().nav;
            var ix = wizardSequence.indexOf(current);
            if (ix > 0) {
                self.setCurrentView(wizardSequence[ix - 1], self.decision);
            } else {
                self.exitCurrentDecision();
            }
            ns.Browser.scrollToTop();
        });

        ko.postbox.subscribe(ns.Const.NAV.NEXT, function () {
            var current = self.currentView().nav;
            var ix = wizardSequence.indexOf(current);
            if (ix === wizardSequence.length - 1) {
                // this should not happen
                self.exitCurrentDecision();
            } else {
                self.setCurrentView(wizardSequence[ix + 1], self.decision);
            }
            ns.Browser.scrollToTop();
        });


        ko.postbox.subscribe(ns.Const.NAV.ARCHIVE, self.loadArchive);

        ko.postbox.subscribe(ns.Const.EVENTS.NEW_DECISION, self.newDecision);
        ko.postbox.subscribe(ns.Const.EVENTS.BUILD_REPORT, self.loadReport);
        ko.postbox.subscribe(ns.Const.EVENTS.SAVE, self.saveCurrentDecisionToArchive);
        ko.postbox.subscribe(ns.Const.EVENTS.EXIT, self.exitCurrentDecision);
        ko.postbox.subscribe(ns.Const.EVENTS.DELETE, self.deleteDecision);
        ko.postbox.subscribe(ns.Const.EVENTS.PURGE_ARCHIVE, self.purgeArchive);
        ko.postbox.subscribe(ns.Const.EVENTS.LOAD, self.loadDecision);

        self.goToWelcome();

        self.fake = function (page) {
            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            function setRandomRank(comparison) {
                var ranks = ['eq', 'lt', 'mlt', 'gt', 'mgt'];
                return comparison.rank(ranks[getRandomInt(0, ranks.length - 1)]);
            }
            function fullMonty() {
                self.newDecision();
                self.decision.options(["NYC", "Ski Trip", "Beach", "Gettysburg"]);
                self.decision.criteria(["Cost", "Agony", 'Educational Value', 'Fun']);
                ko.utils.arrayForEach(self.decision.criteriaComparisons(), setRandomRank);
                ko.utils.arrayForEach(self.decision.optionComparisons(), setRandomRank);
            }
            fullMonty();
            self.loadReport();
        };

    };
})(window);