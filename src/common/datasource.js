define(function (require) {

    var ajax = require('common/ajax');

    var datasource = {

        constant: function (value) {

            return function () {
                return value;
            };

        },

        remote: function (url, options) {

            return function (model) {

                options = require('er/util').mix(
                    { url: url }, 
                    options
                );

                return ajax.request(options);
            };

        }

    };


    return datasource;

});