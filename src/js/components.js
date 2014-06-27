/* global ko */
(function (global) {
    "use strict";

    var ns = global.dcidr = global.dcidr || {};

    ns.Components = ns.Components || {};

    ns.Components.Welcome = function (archiveIsNotEmpty) {
        this.getStarted = function () {
            ko.postbox.publish(ns.Const.EVENTS.NEW_DECISION);
        };
        this.loadArchive = function () {
            ko.postbox.publish(ns.Const.NAV.ARCHIVE);
        };
        this.isArchiveButtonVisible = archiveIsNotEmpty;
        this.isAboutSectionVisible = ko.observable(false);
        this.showAbout = function () {
            this.isAboutSectionVisible(true);
        }.bind(this);
    };

    ns.Components.RankSetter = function () {
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

    ns.Components.BaseWizardComponent = function () {
        this.proceed = function () {
            ko.postbox.publish(ns.Const.NAV.NEXT);
        };
        this.goBack = function () {
            ko.postbox.publish(ns.Const.NAV.PREV);
        };
        this.showHelp = ko.observable(false).extend({ toggle: true });
    };

    ns.Components.StringListEditor = function (stringList) {
        var self = this;

        self = ko.utils.extend(self, new ns.Components.BaseWizardComponent());

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

    ns.Components.Options = function (decision) {
        var self = this;
        self = ko.utils.extend(self, new ns.Components.StringListEditor(decision.options));
        self.canProceed = decision.gates.options;
    };

    ns.Components.Criteria = function (decision) {
        var self = this;
        self = ko.utils.extend(self, new ns.Components.StringListEditor(decision.criteria));
        self.canProceed = decision.gates.criteria;
    };

    ns.Components.CompareOptions = function (decision) {
        var self = this;

        self = ko.utils.extend(self, new ns.Components.BaseWizardComponent());
        self = ko.utils.extend(self, new ns.Components.RankSetter());

        self.optionComparisons = decision.optionComparisons; // for binding
        self.canProceed = decision.gates.optionComparisons;
    };

    ns.Components.CompareCriteria = function (decision) {
        var self = this;

        self = ko.utils.extend(self, new ns.Components.RankSetter());

        self.criteriaComparisons = decision.criteriaComparisons; // for binding
        self.canProceed = decision.gates.criteriaComparisons;

        this.proceed = function () {
            ko.postbox.publish(ns.Const.EVENTS.BUILD_REPORT);
        };
        this.goBack = function () {
            ko.postbox.publish(ns.Const.NAV.PREV);
        };

    };

    ns.Components.Report = function (decision) {
        var self = this;

        this.proceed = function () {
            ko.postbox.publish(ns.Const.NAV.NEXT);
        };
        this.goBack = function () {
            ko.postbox.publish(ns.Const.NAV.PREV);
        };

        self.bestScore = decision.report()[0].score;

        self.report = decision.report; // for binding
    };

    ns.Components.SaveToArchive = function (decision) {
        var self = this;

        self.name = decision.name;

        self.okToSave = ko.computed(function () {
            return self.name().length;
        });

        self.saveAndExit = function () {
            if (self.okToSave()) {
                ko.postbox.publish(ns.Const.EVENTS.SAVE);
                self.exit();
            }
        };

        self.goBack = function () {
            ko.postbox.publish(ns.Const.NAV.PREV);
        };

        self.exit = function () {
            ko.postbox.publish(ns.Const.EVENTS.EXIT);
        };

    };

    ns.Components.Archive = function (listOfDecisions) {
        var self = this;

        self.decisions = ko.observableArray(listOfDecisions);

        self.isEmpty = ko.computed(function () {
            return self.decisions().length === 0;
        });

        self.load = function (decision) {
            ko.postbox.publish(ns.Const.EVENTS.LOAD, decision.id);
        };

        self.destroy = function (decision) {
            ko.postbox.publish(ns.Const.EVENTS.DELETE, decision.id);
            self.decisions.remove(decision);
            if (self.decisions().length === 0) {
                self.goHome();
            }
        };

        self.destroyAll = function () {
            ko.postbox.publish(ns.Const.EVENTS.PURGE_ARCHIVE);
        };

        self.goHome = function () {
            ko.postbox.publish(ns.Const.EVENTS.EXIT);
        };

    };
})(window);