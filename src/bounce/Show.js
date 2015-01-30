/**
 * @file 抢红包
 * @author virola(virola.zhu@gmail.com)
 */

define(function (require, exports, module) {

    var Action = require('er/Action');

    function Show() {
        Action.apply(this, arguments);
    }

    Show.prototype.createModel = function (context) {
        var Model = require('er/Model');
        var model = new Model(context);

        return model;
    };

    Show.prototype.viewType = require('bounce/ShowView');

    Show.prototype.initBehavior = function() {
        var action = this;

        action.on('grab', function (args) {
            if (action.grabing) {
                return false;
            }

            action.grabing = 1;

            require('common/ajax').post(url.POST_BOUNCE).done(function (data) {
                // 抢红包的结果
                action.grabing = 0;
                action.view.fire('showResult', data);
                
            }).fail(function (args) {
                action.grabing = 0;
                console.log('fail');
            });
        });

        // 事件绑定
        $('#btn-bounce').on('click', function () {
            console.log('抢红包了!');

            action.fire('grab');

            return false;
        });
    };

    var url = require('url');

    require('er/util').inherits(Show, Action);

    // return模块
    return Show;
});
