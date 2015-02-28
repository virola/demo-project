define(function(require) {
    
    require('er/tpl!./index.html');

    var dialog = require('common/dialog');

    var View = require('er/View');

    function IndexView() {
        View.apply(this, arguments);
    }

    IndexView.prototype.template = 'home';

    IndexView.prototype.enterDocument = function() {
        $('#btn-main').on('click', function () {
            dialog.alert('好的');
        });
    };

    require('er/util').inherits(IndexView, View);

    return IndexView;
});