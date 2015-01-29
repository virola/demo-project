define(
    function(require) {
        
        require('er/tpl!./rank.html');

        var View = require('er/View');

        function RankView() {
            View.apply(this, arguments);
        }

        RankView.prototype.template = 'rank';

        require('er/util').inherits(RankView, View);

        return RankView;
    }
);