/**
 * @file 
 * @author virola(virola.zhu@gmail.com)
 */

define(function (require, exports, module) {

    
    var dialog = require('common/dialog');

    var Action = require('er/Action');

    /**
     * 签到表单
     */
    function Index() {
        Action.apply(this, arguments);
    }

    Index.prototype.modelType = require('index/IndexModel');
    Index.prototype.viewType = require('index/IndexView');

    

    var actStatus = require('common/actStatus');

    Index.prototype.initBehavior = function() {
        var action = this;
        var view = action.view;

        view.on('act-click', function (args) {
            var link = $(args.data);
            var name = link.data('act');
            
            actStatus.get().done(function () {
                var result = actStatus.judge(name);
                if (!result) {
                    dialog.alert('嘿！悠着点，活动还没开始呢！');
                }
                else {
                    window.location.href = link.attr('href');
                }
            }).fail(function (msg) {
                dialog.alert(msg || '嘿！悠着点，活动还没开始呢！');
            });
        });
    };

    Index.prototype.getStatus = function () {
        var action = this;
        
    };

    require('er/util').inherits(Index, Action);

    // return模块
    return Index;
});
