define(
    function(require) {
        
        require('er/tpl!./index.html');

        var View = require('er/View');

        function IndexView() {
            View.apply(this, arguments);
        }

        IndexView.prototype.template = 'home';

        IndexView.prototype.enterDocument = function() {
            var view = this;

            view.startRotate();

            view.on('leave', function () {
                if (view.entryTimer) {
                    clearInterval(view.entryTimer);
                }
            });

            $('.home-entrance a').on('click', function () {
                // todo
            });
        };



        IndexView.prototype.startRotate = function () {
            var view = this;
            var entries = $('.home-entrance a');
            view.entryLength = entries.length;

            // 定时器
            view.entryTimer = setInterval(function () {
                var before;
                if (view.curIndex > 0) {
                    before = $(entries.get(view.curIndex - 1));
                    
                }
                if (view.curIndex == 0) {
                    before = $(entries.get(view.entryLength - 1));
                }
                if (before) {
                    before.toggleClass('rotate');
                }

                // init
                if (view.curIndex == null) {
                    view.curIndex = 0;
                }
                
                $(entries.get(view.curIndex)).toggleClass('rotate');
                view.curIndex++;

                if (view.curIndex >= view.entryLength) {
                    view.curIndex = 0;
                }
            }, 3000);
        }

        require('er/util').inherits(IndexView, View);

        return IndexView;
    }
);