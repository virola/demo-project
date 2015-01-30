define(
    function (require) {

        // 摇一摇间隔时间
        var GAP_TIME = 8000;

        // request url
        var url = require('url').POST_SHAKE_GIFT;

        var exports = {};

        // 定时器
        var timer;

        exports.start = function () {
            var _me = this;
            if (timer) {
                clearTimeout(timer);
            }

            timer = setTimeout(function () {
                _me.shake();
            }, GAP_TIME);
        }

        exports.stop = function() {
            if (timer) {
                clearTimeout(timer);
            }
        }

        exports.shake = function () {
            var _me = this;

            require('common/ajax').post(url).done(function (data) {
                console.log('shake~~');
                _me.fire('shake', data);
            }).fail(function () {
                console.log('shake fail~~');

                // 失败就是没摇中
                _me.fire('shake', {
                    status: 5
                });
            });
        }

        var Shake = new (require('eoo').create(require('mini-event/EventTarget'), exports));

        return Shake;
    }
);