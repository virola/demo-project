/**
 * @file 关于我们
 * @author ()
 */

define(function (require, exports, module) {
    
    var Action = require('er/Action');


    /**
     * 主模块
     */
    function About() {
        Action.apply(this, arguments);
    }

    About.prototype.modelType = function (context) {
        var Model = require('er/Model');
        var model = new Model(context);

        return model;
    };
    About.prototype.viewType = require('./AboutView');

    require('er/util').inherits(About, Action);

    // return模块
    return About;
});
