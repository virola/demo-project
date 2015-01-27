/**
 * @file 年会节目列表
 * @author virola(virola.zhu@gmail.com)
 */

define(function (require, exports, module) {


    var Action = require('er/Action');

    function Rank() {
        Action.apply(this, arguments);
    }

    Rank.prototype.modelType = require('program/RankModel');

    Rank.prototype.viewType = require('program/RankView');

    Rank.prototype.initBehavior = function() {
        
        this.on('entercomplete', function (args) {
            // console.log(args);
        });
    };

    require('er/util').inherits(Rank, Action);

    // return模块
    return Rank;
});
