/**
 * @file 年会节目列表
 * @author virola(virola.zhu@gmail.com)
 */

define(function (require, exports, module) {


    var Action = require('er/Action');

    function Show() {
        Action.apply(this, arguments);
    }

    Show.prototype.modelType = require('program/ShowModel');

    Show.prototype.viewType = require('program/ShowView');

    Show.prototype.initBehavior = function() {
        var action = this;
        
        action.view.on('voteClick', function (args) {
            action.vote({
                'vote_id': args.voteId
            });
        });

        action.on('leave', function () {
            action.view.swiper = null;
        });
    };

    var VOTE_URL = require('url').POST_PROGRAM;

    /**
     * 投票交互
     * 
     * @param {Object} data 投票数据
     * @param {Function} callback 回调
     */
    Show.prototype.vote = function(data) {
        var action = this;
        require('er/ajax').post(VOTE_URL, data).done(function (result) {
            console.log(data);

            action.view.fire('vote', {
                voteNum: result,
                voteId: data['vote_id']
            });
        }).fail(function (result) {
            require('common/dialog').alert(result && result.message || '投票失败！');
        });
    };

    require('er/util').inherits(Show, Action);

    // return模块
    return Show;
});
