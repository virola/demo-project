/**
 * @file 
 * @author virola(virola.zhu@gmail.com)
 */

define(function (require, exports, module) {

    var Action = require('er/Action');

    /**
     * 签到表单
     */
    function Index() {
        Action.apply(this, arguments);
    }

    Index.prototype.modelType = require('index/IndexModel');
    Index.prototype.viewType = require('index/IndexView');

    // Index.prototype.initBehavior = function() {
    //     Action.prototype.initBehavior.apply(this, arguments);
    // };

    require('er/util').inherits(Index, Action);

    // return模块
    return Index;
});
