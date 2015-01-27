define(
    function (require) {
        var Model = require('er/Model');

        function IndexModel() {
            Model.apply(this, arguments);

            var user = require('common/user').get();

            this.set('user', user.data);
        }

        require('er/util').inherits(IndexModel, Model);

        return IndexModel;
    }
);