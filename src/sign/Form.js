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

            require('er/ajax').post(signUrl, data).done(function (result) {
                // user.store({
                //     department: data.department,
                //     mobile: data.mobile,
                //     name: data.name
                // });

                user.updateSign(true);
                
                action.redirect('/');
            });
        });
    };

    require('er/util').inherits(Form, Action);

    // return模块
    return Form;
});
