define(
    function(require) {
        
        require('er/tpl!./form.html');

        var View = require('er/View');

        function FormView() {
            View.apply(this, arguments);
        }

        FormView.prototype.template = 'messageform';

        FormView.prototype.enterDocument = function() {
            var view = this;
            $('#msg-form').on('submit', function () {
                var content = $.trim($('#bless-msg').val());

                if (!content) {
                    require('common/dialog').alert('请输入您要说的祝福');

                    return false;
                }
                view.fire('submit', {
                    content: content
                });
            });
        };

        require('er/util').inherits(FormView, View);

        return FormView;
    }
);