define(
    function (require) {
        var Model = require('er/Model');

        var statusUrl = require('url').GET_ACT_STATUS;

        function FormModel() {
            Model.apply(this, arguments);

            
        }

        require('er/util').inherits(FormModel, Model);

        return FormModel;
    }
);