/* global ko */
(function (global) {
    "use strict";

    var ns = global.dcidr = global.dcidr || {};

    ns.Report = function (decision) {
        // todo cleanse ranks
        // todo throw error for missing ranks

        var model = decision,
            rankMap = {},
            criteriaRdvs,
            optionRdvs = {},
            optionTotals = {},
            grandTotal = 0;

        rankMap = {
            'mlt': 0.1,
            'lt': 0.2,
            'eq': 1,
            'gt': 5,
            'mgt': 10
        };

        function convertRanks(ranks) {
            ranks = ko.utils.arrayMap(ranks, function (r) {
                r.rank = rankMap[r.rank];
            });
            return ranks;
        }

        function optionTotalsToArray(totals) {
            var ret = [];
            for (var opt in totals) {
                if (totals.hasOwnProperty(opt)) {
                    ret.push({
                        option: opt,
                        score: totals[opt]
                    });
                }
            }
            return ret.sort(function (a, b) {
                return a.score > b.score ? -1 : (a.score < b.score ? 1 : 0);
            });
        }

        function calcRdvs(ranks, keyA, keyB) {
            var rdvs = {}, total = 0, inverses = [];

            // inverses
            ko.utils.arrayForEach(ranks, function (cc) {
                var inv = {};
                inv[keyB] = cc[keyA];
                inv[keyA] = cc[keyB];
                inv.rank = 1 / cc.rank;
                inverses.push(inv);
            });

            ranks = ranks.concat(inverses);

            ko.utils.arrayForEach(ranks, function (cc) {
                total += cc.rank;
                if (!rdvs[cc[keyA]]) {
                    rdvs[cc[keyA]] = cc.rank;
                } else {
                    rdvs[cc[keyA]] += cc.rank;
                }
            });
            for (var key in rdvs) {
                if (rdvs.hasOwnProperty(key)) {
                    rdvs[key] = rdvs[key] / total;
                }
            }
            return rdvs;
        }

        convertRanks(model.criteriaComparisons);
        convertRanks(model.optionComparisons);

        criteriaRdvs = calcRdvs(model.criteriaComparisons, 'criteriaA', 'criteriaB');

        ko.utils.arrayForEach(model.criteria, function (c) {
            var relevantRanks = ko.utils.arrayFilter(model.optionComparisons, function (oc) {
                return oc.criteria === c;
            });
            optionRdvs[c] = calcRdvs(relevantRanks, 'optionA', 'optionB');
        });

        ko.utils.arrayForEach(model.options, function (opt) {
            optionTotals[opt] = 0;
            for (var crit in criteriaRdvs) {
                if (criteriaRdvs.hasOwnProperty(crit)) {
                    var critRdv = criteriaRdvs[crit];
                    var optionRdv = optionRdvs[crit][opt];
                    optionTotals[opt] += optionRdvs[crit][opt] * critRdv;
                    grandTotal += optionRdvs[crit][opt] * critRdv;
                }
            }
        });

        return optionTotalsToArray(optionTotals);

    };

})(window);