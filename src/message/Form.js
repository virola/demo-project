/**
 * @file 祝福墙留言
 * @author virola(virola.zhu@gmail.com)
 */

define(function (require, exports, module) {

    var Action = require('er/Action');

    /**
     * 留言表单
     */
    function Form() {
        Action.apply(this, arguments);
    }

    Form.prototype.modelType = require('message/FormModel');

    Form.prototype.viewType = require('message/FormView');

    var msgUrl = require('url').POST_MESSAGE;

    var dialog = require('common/dialog');

    Form.prototype.initBehavior = function() {
        var view = this.view;

        view.on('submit', function (data) {
            require('er/ajax').post(msgUrl, data).done(function (result) {
                dialog.alert('提交成功');
            }).fail(function (result) {
                console.log(result);
                dialog.alert(result.message || '提交失败，请稍后再试');
            });
        });
    };

    require('er/util').inherits(Form, Action);

    // return模块
    return Form;
});
