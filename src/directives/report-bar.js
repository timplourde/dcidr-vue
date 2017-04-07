import Vue from 'vue';

export function registerReportBar() {
    Vue.directive('report-bar', function (el, binding) {
         setTimeout(function () {
            el.style.width = (binding.value.mine / binding.value.best) * 90 + '%';
        }, 500);
    });
}