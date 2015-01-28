define(
    function(require) {
        
        require('er/tpl!./show.html');

        var View = require('er/View');

        function ShowView() {
            View.apply(this, arguments);
        }

        ShowView.prototype.template = 'program';

        ShowView.prototype.enterDocument = function () {
            var view = this;

            // 投票的反应
            view.on('vote', function (data) {
                var id = data.voteId;
                var btns = $('.btn[data-id="' + id + '"]');
                btns.each(function (i) {
                    var target = $(this).closest('.vote');
                    // 票数增加
                    target.find('p em').text(data.voteNum);

                    // +1漂浮
                    var tip = $('<i/>').text('+1').addClass('tip');
                    
                    tip.appendTo(target.find('p'));
                });
            });

            // 初始化上下翻页
            var container = view.getContainerElement();

            $(container).on('touchstart, touchmove', function (e) {
                e.preventDefault();
            });

            view.initSwiper();
        };


        ShowView.prototype.initSwiper = function() {
            var view = this;
            require(['swiper'], function (Swiper) {
                view.swiper = new Swiper('.slides', {
                    wrapperClass: 'slide-wrap',
                    slideClass: 'slide',
                    mode: 'vertical',
                    loop: true,
                    preventLinks: false,
                    longSwipesRatio: 0.3,
                    touchRatio: 1.2,
                });
            });
        };

        require('er/util').inherits(ShowView, View);

        return ShowView;
    }
);