define(
    function (require) {

        var loading = $('#loading');

        var ajaxCount = 0;

        function getQueryString(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        }

        /**
         * 处理AJAX公用参数userId和nestId
         */
        function hookAjax() {
            // project id hook
            var projectId = getQueryString('project_id');

            var ajax = require('er/ajax');
            var userData = require('common/storage').get('user');
                    
            // 这里做一些共用参数的注入
            ajax.hooks.beforeExecute = function (options) {

                // loading show
                ajaxCount++;
                loading.show();
                if (!options.timeout) {
                    options.timeout = 30000;
                }
            };

            ajax.hooks.afterReceive = function (xhr, options) {
                // loading hide
                ajaxCount--;
                if (ajaxCount == 0) {
                    loading.hide();
                }
            };

            ajax.hooks.afterParse = function (data, xhr, options) {
                if (options.url.indexOf('.html') > -1) {
                    return data;
                }

                // 302 redirect
                if (data['status'] == 302) {
                    var url = data['redirect'];
                    window.location.href = url;

                    return {};
                }
                
                return data;
            };

        }

        return hookAjax;
    }
);