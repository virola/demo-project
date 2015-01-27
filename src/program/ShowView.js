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

                var target = $('.btn[data-id="' + id + '"]').closest('.vote');

                // 票数增加
                target.find('p em').text(data.voteNum);

                // +1漂浮
                var tip = $('<i/>').text('+1').addClass('tip');
                
                tip.appendTo(target.find('p'));

                // setTimeout(function () {
                //     tip.remove();
                // }, 1000);
            });
        };

        require('er/util').inherits(ShowView, View);

        return ShowView;
    }
);