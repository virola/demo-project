/**
 * @file  摇一摇的VIEW
 */
define(
    function(require) {
        
        require('er/tpl!./show.html');

        // 状态码和显示模板的对应配置
        var TPL_CONF = {
            1: 'shakeWin',
            2: 'shakeAlready',
            3: 'shakeActOver',
            5: 'shakeNotWin'
        };

        var View = require('er/View');

        function ShowView() {
            View.apply(this, arguments);
        }

        ShowView.prototype.template = 'shakepage';

        var etpl = require('etpl');

        ShowView.prototype.showResult = function (status, data) {

            var view = this;
            var template = TPL_CONF[status];

            if (!template) {
                require('common/dialog').alert('活动还未开始呢！', '', function () {
                    require('er/locator').redirect('/');
                    this.dispose();
                });

                return false;
            }
            
            var html = etpl.render(template, data);
            var container = view.getContainerElement();
            container.innerHTML = html;

        };

        ShowView.prototype.enterDocument = function () {
            var view = this;
            $(view.getContainerElement()).on('click', '#btn-restart', function () {
                view.fire('restart');
            });
        };

        require('er/util').inherits(ShowView, View);

        return ShowView;
    }
);