/* global ko */
(function (global) {
    "use strict";

    var ns = global.dcidr = global.dcidr || {};

    ns.DecisionSerializer = function () {
        var self = this;

        self.toJSON = function (decision) {
            return JSON.stringify(decision.export());
        };

        self.fromJSON = function (json) {
            var model = JSON.parse(json);
            return new ns.Decision(model);
        };

    };

    ns.ListSerializer = function () {
        var self = this;

        self.toJSON = function (list) {
            return JSON.stringify(list);
        };

        self.fromJSON = function (json) {
            return JSON.parse(json);
        };

    };

    ns.Archive = function () {
        // assumes storage is available
        var self = this,
            storage = ns.Browser.storage,
            decisionSerializer = new ns.DecisionSerializer(),
            listSerializer = new ns.ListSerializer(),
            LIST_KEY = "decision-list";

        function saveList(list) {
            var listJson = listSerializer.toJSON(list);
            storage.save(LIST_KEY, listJson);
        }

        function deleteDecisionFromListAndSave(id) {
            var list = self.getList();
            list = ko.utils.arrayFilter(list, function (item) {
                return item.id !== id;
            });
            saveList(list);
        }

        self.getList = function () {
            var data = storage.retrieve(LIST_KEY);
            return !data ? [] : listSerializer.fromJSON(data);
        };

        self.saveDecision = function (decision) {

            var list = self.getList();
            var atIndex = -1;

            for (var i = 0; i < list.length; i++) {
                if (list[i].id === decision.id) {
                    atIndex = i;
                    break;
                }
            }

            if (atIndex === -1) {
                list.push({
                    id: decision.id,
                    name: decision.name(),
                    date: decision.date
                });
            } else {
                list[atIndex].name = decision.name();
                list[atIndex].date = decision.date;
            }

            saveList(list);

            var decisionJson = decisionSerializer.toJSON(decision);
            storage.save(decision.id, decisionJson);

            return decision.id;
        };

        self.getDecision = function (id) {
            var json = storage.retrieve(id);
            if (!json) {
                deleteDecisionFromListAndSave(id);
                return null;
            }
            return decisionSerializer.fromJSON(json);
        };

        self.deleteDecision = function (id) {
            deleteDecisionFromListAndSave(id);
            storage.destroy(id);
            return true;
        };

        self.empty = function () {
            storage.empty();
            return true;
        };

    };
})(window);