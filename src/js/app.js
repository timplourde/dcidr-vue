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
            subscriptions = [];

        components[VIEWS.WELCOME] = ns.components.Welcome;
        components[VIEWS.OPTIONS] = ns.components.Options;
        components[VIEWS.CRITERIA] = ns.components.Criteria;
        components[VIEWS.COMPARE_OPTIONS] = ns.components.CompareOptions;
        components[VIEWS.COMPARE_CRITERIA] = ns.components.CompareCriteria;
        components[VIEWS.REPORT] = ns.components.Report;
        components[VIEWS.SAVE] = ns.components.SaveToArchive;
        components[VIEWS.ARCHIVE] = ns.components.Archive;

        // props

        self.currentView = ko.observable({
            name: VIEWS.LOADING + TEMPLATE_POSTFIX
        });

        self.decision = null;

        self.useWelcomeLayout = ko.computed(function () {
            return self.currentView() && self.currentView().name &&
                self.currentView().name === VIEWS.WELCOME + TEMPLATE_POSTFIX;
        });

        self.isTransitioning = ko.observable(false);

        // private

        function getArchiveList() {
            return ns.archive.getList();
        }

        function saveCurrentDecisionToArchive() {
            ns.archive.saveDecision(self.decision);
        }

        function deleteDecision(id) {
            ns.archive.deleteDecision(id);
        }

        function loadDecisionAndGoToFirstView(id) {
            self.decision = ns.archive.getDecision(id);
            self.setCurrentView(VIEWS.OPTIONS, self.decision);
        }

        function goToArchiveView() {
            var archiveData = getArchiveList();
            self.setCurrentView(VIEWS.ARCHIVE, archiveData);
        }

        function purgeArchiveAndGoToWelcomeView() {
            ns.archive.empty();
            self.goToWelcomeView();
        }

        function startNewDecisionAndLoadFirstView() {
            disposeCurrentDecision();
            self.decision = new ns.Decision();
            self.setCurrentView(VIEWS.OPTIONS, self.decision);
        }

        function generateReportAndLoadReportView() {
            if (self.decision && self.decision.generateReport()) {
                self.setCurrentView(VIEWS.REPORT, self.decision);
                return true;
            }
            return false;
        }

        function disposeCurrentDecision() {
            if (self.decision) {
                self.decision.dispose();
            }
        }

        function exitCurrentDecision() {
            disposeCurrentDecision();
            self.decision = null;
            self.goToWelcomeView();
        }

        /*
         function handleBrowserBackNav(state) {
            if (state === "welcome") {
                self.exitCurrentDecision();
            } else {
                ko.postbox.publish(ns.const.NAV.PREV);
            }
        }*/

        function handleBackNav() {
            var current = self.currentView().nav;
            var ix = wizardSequence.indexOf(current);
            if (ix > 0) {
                self.setCurrentView(wizardSequence[ix - 1], self.decision);
            } else {
                exitCurrentDecision();
            }
            ns.browser.scrollToTop();
        }

        function handleForwardNav() {
            var current = self.currentView().nav;
            var ix = wizardSequence.indexOf(current);
            if (ix === wizardSequence.length - 1) {
                // this should not happen
                exitCurrentDecision();
            } else {
                self.setCurrentView(wizardSequence[ix + 1], self.decision);
            }
            ns.browser.scrollToTop();
        }

        // public

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
                ns.browser.history.push(viewName);
                self.isTransitioning(false);
            }, 350);
        };

        self.goToWelcomeView = function () {
            var list = getArchiveList();
            self.setCurrentView(VIEWS.WELCOME, list.length);
        };

        self.dispose = function () {
            ko.utils.arrayForEach(subscriptions, function (s) {
                s.dispose();
            });
        };

        self.init = self.goToWelcomeView;

        ns.browser.history.onPop(handleBackNav);

        subscriptions.push(ko.postbox.subscribe(ns.const.NAV.PREV, handleBackNav));
        subscriptions.push(ko.postbox.subscribe(ns.const.NAV.NEXT, handleForwardNav));
        subscriptions.push(ko.postbox.subscribe(ns.const.NAV.ARCHIVE, goToArchiveView));

        subscriptions.push(ko.postbox.subscribe(ns.const.EVENTS.NEW_DECISION, startNewDecisionAndLoadFirstView));
        subscriptions.push(ko.postbox.subscribe(ns.const.EVENTS.BUILD_REPORT, generateReportAndLoadReportView));
        subscriptions.push(ko.postbox.subscribe(ns.const.EVENTS.SAVE, saveCurrentDecisionToArchive));
        subscriptions.push(ko.postbox.subscribe(ns.const.EVENTS.EXIT, exitCurrentDecision));
        subscriptions.push(ko.postbox.subscribe(ns.const.EVENTS.DELETE, deleteDecision));
        subscriptions.push(ko.postbox.subscribe(ns.const.EVENTS.PURGE_ARCHIVE, purgeArchiveAndGoToWelcomeView));
        subscriptions.push(ko.postbox.subscribe(ns.const.EVENTS.LOAD, loadDecisionAndGoToFirstView));

       
        // fake data
        self.fake = function (page) {
            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            function setRandomRank(comparison) {
                var ranks = ['eq', 'lt', 'mlt', 'gt', 'mgt'];
                return comparison.rank(ranks[getRandomInt(0, ranks.length - 1)]);
            }
            function fullMonty() {
                startNewDecisionAndLoadFirstView();
                self.decision.options(["NYC", "Ski Trip", "Beach", "Gettysburg"]);
                self.decision.criteria(["Cost", "Agony", 'Educational Value', 'Fun']);
                ko.utils.arrayForEach(self.decision.criteriaComparisons(), setRandomRank);
                ko.utils.arrayForEach(self.decision.optionComparisons(), setRandomRank);
            }
            fullMonty();
            generateReportAndLoadReportView();
        };

    };
})(window);