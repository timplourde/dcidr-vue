/* global ko */
(function (global) {
    "use strict";

    var ns = global.dcidr = global.dcidr || {};

    ns.components = ns.components || {};

    ns.components.Welcome = function (archiveIsNotEmpty) {
        this.getStarted = function () {
            ko.postbox.publish(ns.const.EVENTS.NEW_DECISION);
        };
        this.loadArchive = function () {
            ko.postbox.publish(ns.const.NAV.ARCHIVE);
        };
        this.isArchiveButtonVisible = archiveIsNotEmpty || false;
        this.isAboutSectionVisible = ko.observable(false).extend({ toggle: true });
    };

    ns.components.RankSetter = function () {
        this.setMlt = function (comparison) {
            comparison.rank('mlt');
        };
        this.setLt = function (comparison) {
            comparison.rank('lt');
        };
        this.setEq = function (comparison) {
            comparison.rank('eq');
        };
        this.setGt = function (comparison) {
            comparison.rank('gt');
        };
        this.setMgt = function (comparison) {
            comparison.rank('mgt');
        };

    };

    ns.components.BaseWizardComponent = function () {
        this.proceed = function () {
            ko.postbox.publish(ns.const.NAV.NEXT);
        };
        this.goBack = function () {
            ko.postbox.publish(ns.const.NAV.PREV);
        };
        this.showHelp = ko.observable(false).extend({ toggle: true });
    };

    ns.components.StringListEditor = function (stringList) {
        var self = this;

        self = ko.utils.extend(self, new ns.components.BaseWizardComponent());

        self.items = stringList;    // just for binding

        self.newItem = ko.observable();
        self.addItem = function () {
            var item = self.newItem();
            if (!item) {
                return;
            }
            item = item.trim();
            if (!item.length) {
                return;
            }
            var exists = false;
            ko.utils.arrayForEach(stringList(), function (o) {
                if (o.toLowerCase() === item.toLowerCase()) {
                    exists = true;
                }
            });
            if (!exists) {
                stringList.push(item);
            }
            self.newItem('');
        };

        self.removeItem = function (item) {
            stringList.remove(item);
        };

    };

    ns.components.Options = function (decision) {
        var self = this;
        self = ko.utils.extend(self, new ns.components.StringListEditor(decision.options));
        self.canProceed = decision.gates.options;
    };

    ns.components.Criteria = function (decision) {
        var self = this;
        self = ko.utils.extend(self, new ns.components.StringListEditor(decision.criteria));
        self.canProceed = decision.gates.criteria;
    };

    ns.components.CompareOptions = function (decision) {
        var self = this;

        self = ko.utils.extend(self, new ns.components.BaseWizardComponent());
        self = ko.utils.extend(self, new ns.components.RankSetter());

        self.optionComparisons = decision.optionComparisons; // for binding
        self.canProceed = decision.gates.optionComparisons;
    };

    ns.components.CompareCriteria = function (decision) {
        var self = this;

        self = ko.utils.extend(self, new ns.components.RankSetter());

        self.criteriaComparisons = decision.criteriaComparisons; // for binding
        self.canProceed = decision.gates.criteriaComparisons;

        this.proceed = function () {
            ko.postbox.publish(ns.const.EVENTS.BUILD_REPORT);
        };
        this.goBack = function () {
            ko.postbox.publish(ns.const.NAV.PREV);
        };

    };

    ns.components.Report = function (decision) {
        var self = this;

        this.proceed = function () {
            ko.postbox.publish(ns.const.NAV.NEXT);
        };
        this.goBack = function () {
            ko.postbox.publish(ns.const.NAV.PREV);
        };

        self.report = decision.report; // for binding
        self.bestScore = decision.report()[0].score; // assumes it's sorted
    };

    ns.components.SaveToArchive = function (decision) {
        var self = this;

        self.name = decision.name;

        self.okToSave = ko.computed(function () {
            return self.name().length;
        });

        self.saveAndExit = function () {
            if (self.okToSave()) {
                ko.postbox.publish(ns.const.EVENTS.SAVE);
                self.exit();
            }
        };

        self.goBack = function () {
            ko.postbox.publish(ns.const.NAV.PREV);
        };

        self.exit = function () {
            ko.postbox.publish(ns.const.EVENTS.EXIT);
        };

    };

    ns.components.Archive = function (listOfDecisions) {
        var self = this;

        self.decisions = ko.observableArray(listOfDecisions);

        self.isEmpty = ko.computed(function () {
            return self.decisions().length === 0;
        });

        self.load = function (decision) {
            ko.postbox.publish(ns.const.EVENTS.LOAD, decision.id);
        };

        self.destroy = function (decision) {
            ko.postbox.publish(ns.const.EVENTS.DELETE, decision.id);
            self.decisions.remove(decision);
            if (self.decisions().length === 0) {
                self.goHome();
            }
        };

        self.destroyAll = function () {
            ko.postbox.publish(ns.const.EVENTS.PURGE_ARCHIVE);
        };

        self.goHome = function () {
            ko.postbox.publish(ns.const.EVENTS.EXIT);
        };

    };
})(window);