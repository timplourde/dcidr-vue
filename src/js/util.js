/* global ko */
(function (global) {
    "use strict";

    var ns = global.dcidr = global.dcidr || {};

    ns.Const = {
        NAV: {
            NEXT: "nav-next",
            PREV: "nav-prev",
            ARCHIVE: "nav-archive"
        },
        EVENTS: {
            NEW_DECISION: "new",
            BUILD_REPORT: "build-report",
            EXIT: "exit",
            SAVE: "save",
            LOAD: "load",
            DELETE: "delete",
            PURGE_ARCHIVE: "purge-archive"
        }
    };

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
            element.innerText = (pct * 100).toFixed(2) + '%';
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

    ns.Util = {
        newId: function () {
            return (new Date()).getTime().toString();
        }
    };

    ns.Browser = {
        scrollToTop: function () {
            window.scrollTo(0, 0);
        },
        history: {
            push: function (name) {
                history.pushState(name);
            },
            onPop: function (callback) {
                window.addEventListener('popstate', function (event) {
                    callback(event.state);
                });
            }
        },
        storage: {
            isAvailable: function () {
                return typeof window.localStorage !== 'undefined';
            },
            save: function (key, value) {
                if (!this.isAvailable()) {
                    return;
                }
                return window.localStorage.setItem(key, value);
            },
            retrieve: function (key) {
                if (!this.isAvailable()) {
                    return;
                }
                return window.localStorage.getItem(key);
            },
            destroy: function (key) {
                if (!this.isAvailable()) {
                    return;
                }
                return window.localStorage.removeItem(key);
            },
            empty: function (key) {
                if (!this.isAvailable()) {
                    return;
                }
                return window.localStorage.clear();
            }
        }
    };

})(window);
