define(function(require) {
    
    require('er/tpl!./index.html');

    var dialog = require('common/dialog');

    var View = require('er/View');

    function AboutView() {
        View.apply(this, arguments);
    }

    AboutView.prototype.template = 'about';

    AboutView.prototype.enterDocument = function() {
        $('#btn-main').on('click', function () {
            dialog.alert('好的');
        });
    };

    require('er/util').inherits(AboutView, View);

    return AboutView;
});