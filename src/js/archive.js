/* global ko */

(function (global) {
    "use strict";

    var ns = global.dcidr = global.dcidr || {},
        decisionSerializer,
        listSerializer,
        storage = ns.browser.storage,
        LIST_KEY = "decision-list";

    decisionSerializer = {
        toJSON  : function (decision) {
            return JSON.stringify(decision.export());
        },
        fromJSON : function (json) {
            var model = JSON.parse(json);
            return new ns.Decision(model);
        }
    };

    listSerializer = {
        toJSON : function (list) {
            return JSON.stringify(list);
        },
        fromJSON : function (json) {
            return JSON.parse(json);
        }
    };

    function saveList(list) {
        var listJson = listSerializer.toJSON(list);
        storage.save(LIST_KEY, listJson);
    }

    function deleteDecisionFromListAndSave(id) {
        var list = getList();
        list = ko.utils.arrayFilter(list, function (item) {
            return item.id !== id;
        });
        saveList(list);
    }

    function getList () {
        var data = storage.retrieve(LIST_KEY);
        return !data ? [] : listSerializer.fromJSON(data);
    }

    function saveDecision (decision) {

        var list = getList();
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
    }

    function getDecision (id) {
        var json = storage.retrieve(id);
        if (!json) {
            deleteDecisionFromListAndSave(id);
            return null;
        }
        return decisionSerializer.fromJSON(json);
    }

    function deleteDecision (id) {
        deleteDecisionFromListAndSave(id);
        storage.destroy(id);
        return true;
    }

    function empty () {
        storage.empty();
        return true;
    }


    ns.archive = {
        getList: getList,
        saveDecision: saveDecision,
        getDecision: getDecision,
        deleteDecision: deleteDecision,
        empty: empty
    };

})(window);