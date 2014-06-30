/* global ko */
(function (global) {
    "use strict";

    var ns = global.dcidr = global.dcidr || {};

    ns.const = {
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

    ns.util = {
        newId: function () {
            return (new Date()).getTime().toString();
        }
    };

    ns.browser = {
        scrollToTop: function () {
            window.scrollTo(0, 0);
        },
        history: {
            push: function (name) {
                history.pushState(name, document.title);
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
