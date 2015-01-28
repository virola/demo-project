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

    Show.prototype.viewType = require('shake/ShowView');

    var shake = require('shake/shake');

    Show.prototype.initBehavior = function() {
        var action = this;
        action.on('entercomplete', function (args) {
            // 开始摇奖
            shake.start();
            shake.once('shake', function (data) {
                var status = data.status;
                action && action.view && action.view.showResult(status, data);
            });
        });
        
        action.on('leave', function (args) {
            // 停止摇奖
            shake.stop();
        });
    };

    require('er/util').inherits(Show, Action);

    // return模块
    return Show;
});
