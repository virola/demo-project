define(
    function(require) {
        
        require('er/tpl!./show.html');

        var View = require('er/View');

        function ShowView() {
            View.apply(this, arguments);
        }

        ShowView.prototype.template = 'bounce';

        ShowView.prototype.enterDocument = function() {
            var view = this;
            view.on('showResult', function (data) {
                // console.log(data);
                view.handleResult(data.status, data);
            });

        };

        var STATUS_TPL = {
            1: 'bounceGet',  // 抢到了
            2: 'bounceAlready',   // 抢过了
            3: 'bounceOver',    // 结束了
            4: ''       // 未开始
        };

        ShowView.prototype.handleResult = function (status, data) {
            var view = this;
            var tpl = STATUS_TPL[status];

            // 没有模板就跳回
            if (!tpl) {
                require('er/locator').redirect('/');
                return;
            }

            var etpl = require('etpl');
            var html = etpl.render(tpl, data);
            var container = view.getContainerElement();
            container.innerHTML = html;
        }

        require('er/util').inherits(ShowView, View);



        return ShowView;
    }
);