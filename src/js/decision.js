/* global ko */
(function (global) {
    "use strict";

    var ns = global.dcidr = global.dcidr || {};

    ns.Decision = function (model) {
        var self = this,
            subscriptions = [],
            generateOptionComparisons,
            syncComparisons,
            updateOptionComparisons,
            generateCriteriaComparisons,
            updateCriteriaComparisons,
            OptionComparison,
            CriteriaComparison,
            arrayToHashMap,
            hashSorter,
            syncOptionComparisons;

        model = model || {};

        arrayToHashMap = function (arr) {
            var ret = {};
            ko.utils.arrayForEach(arr, function (a) {
                ret[a.hash] = a;
            });
            return ret;
        };

        hashSorter = function (a, b) {
            return a.hash > b.hash ? -1 : (a.hash < b.hash ? 1 : 0);
        };

        syncOptionComparisons = function () {
            syncComparisons(generateOptionComparisons(), self.optionComparisons);
        };

        OptionComparison = function (crit, optionA, optionB, rank) {
            this.criteria = crit;
            this.optionA = optionA;
            this.optionB = optionB;
            this.rank = ko.observable(rank || null);
            this.hash = this.criteria + '|' + this.optionA + '|' + this.optionB;
        };

        CriteriaComparison = function (critA, critB, rank) {
            this.criteriaA = critA;
            this.criteriaB = critB;
            this.rank = ko.observable(rank || null);
            this.hash = this.criteriaA + '|' + this.criteriaB;
        };

        generateOptionComparisons = function () {
            var result = [],
                options = self.options(),
                criteria = self.criteria();

            ko.utils.arrayForEach(criteria, function (crit) {
                for (var i = 0; i < options.length; i++) {
                    for (var j = i + 1; j < options.length; j++) {
                        result.push(new OptionComparison(crit, options[i], options[j]));
                    }
                }
            });

            return result;
        };

        generateCriteriaComparisons = function () {
            var result = [],
                criteria = self.criteria();

            for (var i = 0; i < criteria.length; i++) {
                for (var j = i + 1; j < criteria.length; j++) {
                    result.push(new CriteriaComparison(criteria[i], criteria[j]));
                }
            }

            return result;
        };

        syncComparisons = function (proposed, targetArray) {
            var current = targetArray(),
                proposedMap = {},
                currentMap = {};

            proposedMap = arrayToHashMap(proposed);
            currentMap = arrayToHashMap(current);

            // add to current
            for (var hash in proposedMap) {
                if (!currentMap[hash]) {
                    current.push(proposedMap[hash]);

                }
            }
            // remove from current
            current = ko.utils.arrayFilter(current, function (c) {
                return typeof proposedMap[c.hash] !== 'undefined';
            });

            targetArray(current.sort(hashSorter));
        };

        self.id = model.id || ns.Util.newId();
        self.name = ko.observable(model.name || '');
        self.date = model.date || new Date();
        self.options = ko.observableArray(model.options || []);
        self.criteria = ko.observableArray(model.criteria || []);
        self.optionComparisons = ko.observableArray();
        if (model.optionComparisons) {
            ko.utils.arrayForEach(model.optionComparisons, function (oc) {
                self.optionComparisons.push(new OptionComparison(oc.criteria, oc.optionA, oc.optionB, oc.rank));
            });
        }
        self.criteriaComparisons = ko.observableArray();
        if (model.criteriaComparisons) {
            ko.utils.arrayForEach(model.criteriaComparisons, function (cc) {
                self.criteriaComparisons.push(new CriteriaComparison(cc.criteriaA, cc.criteriaB, cc.rank));
            });
        }
        self.report = ko.observableArray(model.report || []);

        self.gates = {
            options: ko.computed(function () {
                return self.options().length >= 2;
            }),
            criteria: ko.computed(function () {
                return self.criteria().length >= 2;
            }),
            optionComparisons: ko.computed(function () {
                var allHaveBeenRanked = true;
                ko.utils.arrayForEach(self.optionComparisons(), function (comp) {
                    if (comp.rank() === null) {
                        allHaveBeenRanked = false;
                    }
                });
                return allHaveBeenRanked;
            }),
            criteriaComparisons: ko.computed(function () {
                var allHaveBeenRanked = true;
                ko.utils.arrayForEach(self.criteriaComparisons(), function (comp) {
                    if (comp.rank() === null) {
                        allHaveBeenRanked = false;
                    }
                });
                return allHaveBeenRanked;
            })
        };
        self.gates.report = ko.computed(function () {
            return self.gates.options() &&
                self.gates.criteria() &&
                self.gates.optionComparisons() &&
                self.gates.criteriaComparisons();
        });

        subscriptions.push(self.options.subscribe(function (vals) {
            // sync optionComparisons
            if (self.gates.options() && self.gates.criteria()) {
                syncOptionComparisons();
            }
        }));

        subscriptions.push(self.criteria.subscribe(function (vals) {
            // sync optionComparisons and criteriaComparisons
            if (self.gates.options() && self.gates.criteria()) {
                syncOptionComparisons();
                syncComparisons(generateCriteriaComparisons(), self.criteriaComparisons);
            }
        }));

        self.generateReport = function () {
            if (self.gates.report()) {
                self.report(ns.Report(ko.toJS(self)));
                return true;
            } else {
                return false;
            }
        };

        self.export = function () {
            return ko.toJS({
                id: self.id,
                name: self.name,
                date: self.date,
                options: self.options,
                criteria: self.criteria,
                optionComparisons: self.optionComparisons,
                criteriaComparisons: self.criteriaComparisons,
                report: self.report
            });
        };

        self.dispose = function () {
            ko.utils.arrayForEach(subscriptions, function (sub) {
                sub.dispose();
            });
        };

    };
})(window);