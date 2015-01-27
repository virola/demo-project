/**
 * @file 
 * @author virola(virola.zhu@gmail.com)
 */

define(function (require, exports, module) {

    var permission = require('er/permission');

    /**
     * main
     */
    function main(env) {

        require('er/events').on(
            'error',
            function(error) {
                console.log(error);
            }
        );

        var user = require('common/user');
        user.checkSign().done(function (data) {
            console.log('main:', data);
            
            if (data.signed) {
                permission.add({
                    'signed': {
                        'SIGN': false,
                        'INDEX': true
                    }
                });
            }
            else {
                permission.add({
                    'unsigned': {
                        'SIGN': true,
                        'INDEX': false
                    }
                });
            }
            
            
            require('common/hookajax')();
            require('./config');
            require('er').start();
        });
    }


    // return模块
    return main;
});
