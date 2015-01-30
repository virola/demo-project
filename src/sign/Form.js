/**
 * @file 签到表单
 * @author virola(virola.zhu@gmail.com)
 */

define(function (require, exports, module) {

    var user = require('common/user');

    var Action = require('er/Action');

    /**
     * 签到表单
     */
    function Form() {
        Action.apply(this, arguments);
    }

    Form.prototype.modelType = require('sign/FormModel');

    Form.prototype.viewType = require('sign/FormView');

    var signUrl = require('url').POST_SIGN;

    Form.prototype.initBehavior = function() {
        var action = this;
        var view = action.view;

        view.on('submit', function (data) {
            var params = {
                department: data.department,
                mobile: data.mobile,
                name: data.name
            }; 

            require('common/ajax').post(signUrl, params).done(function (result) {
                    user.updateSign(true);
                    action.redirect('/');
            }).fail(function (result) {
                require('common/dialog').alert(result.message || '请求失败，请稍候再试');
            });
        });


        require('common/user').checkSign().done(function (userModel) {
            if (userModel && userModel.signed) {
                require('er/locator').redirect('/');
            }
        });
    };

    require('er/util').inherits(Form, Action);

    // return模块
    return Form;
});
