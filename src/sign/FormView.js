define(
    function(require) {
        
        require('er/tpl!./form.html');

        var View = require('er/View');

        function FormView() {
            View.apply(this, arguments);
        }

        FormView.prototype.template = 'signform';

        var dialog = require('common/dialog');

        FormView.prototype.enterDocument = function() {
            var view = this;

            var form = $('.checkin-form');

            $('#checkin-btn').on('click', function () {
                var elements = form.serializeArray();
                var data = {};

                $.each(elements, function (i, item) {
                    data[item.name] = $.trim(item.value);
                });

                if (!data.department) {
                    dialog.alert('请选择部门信息');
                    return;
                }

                if (!data.name) {
                    dialog.alert('请输入姓名');
                    return;
                }

                if (!data.mobile || /\d{11}/.test(data.mobile) == false) {
                    dialog.alert('请输入正确的手机号码');
                    return;
                }

                view.fire('submit', data);
            });
        };

        require('er/util').inherits(FormView, View);

        return FormView;
    }
);