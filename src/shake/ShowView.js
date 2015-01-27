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
            3: 'shakeNotWin',
            4: 'shakeActOver'
        };

        var View = require('er/View');

        function ShowView() {
            View.apply(this, arguments);
        }

        ShowView.prototype.template = 'shakepage';

        ShowView.prototype.restart = function () {

        };

        ShowView.prototype.showResult = function (status, data) {
            console.log('result:' + status);

            var view = this;

            var template = TPL_CONF[status];
            // view.model.set('name', data.name || '');
            // view.model.set('level', data.level || '');
            // view.model.set('prizes', data.prizes || []);

            var etpl = require('etpl');
            var html = etpl.render(template, data);
            var container = view.getContainerElement();
            container.innerHTML = html;
            // debugger;
        };

        require('er/util').inherits(ShowView, View);

        return ShowView;
    }
);