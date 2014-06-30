/* global ko*/

(function () {
    "use strict";
    ko.bindingHandlers.scoreBar = {
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var data = ko.unwrap(valueAccessor());
            setTimeout(function () {
                element.style.width = (data.mine / data.best) * 90 + '%';
            }, 500);
        }
    };

    ko.bindingHandlers.prettyDateFromString = {
        update: function (element, valueAccessor) {
            var data = ko.unwrap(valueAccessor());
            var d = new Date(data);
            return ko.bindingHandlers.text.update(element, function () {
                return (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
            });
        }
    };


    ko.bindingHandlers.percentage = {
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var pct = ko.unwrap(valueAccessor());
            return ko.bindingHandlers.text.update(element, function () {
                return (pct * 100).toFixed(2) + '%';
            });
        }
    };

    ko.bindingHandlers.enterKeyPress = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            ko.utils.registerEventHandler(element, 'keypress', function (evt) {
                if (evt.keyCode === 13) {
                    evt.preventDefault();
                    valueAccessor().call(viewModel);
                }
            });
        }
    };

    ko.extenders.toggle = function (target) {
        target.toggle = function () {
            target(!target());
        };
        return target;
    };
})();
