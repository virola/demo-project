/**
 * @file 
 * @author virola(virola.zhu@gmail.com)
 */

define(function (require, exports, module) {

    var Deferred = require('er/Deferred');
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

    var STATE_MAP = {
        'xnhb': ['xnhb1', 'xnhb2'],
        'xnhk': 'xnhk',
        'zfq': 'zfq',
        'nhjm': 'nhjm',
        'yyy': ['yyy1', 'yyy2', 'yyy3']
    };

    var URL_STATE = require('url').GET_ACT_STATUS;

    Index.prototype.initBehavior = function() {
        var action = this;
        var view = action.view;

        view.on('act-click', function (args) {
            var link = $(args.data);
            var states = STATE_MAP[link.data('act')] || null;
            if (!states) {
                dialog.alert('活动还未开始！');
                return;
            }

            action.getStatus().done(function () {
                var begin;
                var sts = action.actStatus.status;
                if (states instanceof Array) {
                    $.each(states, function (i, key) {
                        begin = begin || sts[key];
                    });
                }
                else {
                    begin = sts[states];
                }

                if (!begin) {
                    dialog.alert('嘿！悠着点，活动还没开始呢！');
                }
                else {
                    window.location.href = link.attr('href');
                }
            }).fail(function (args) {
                console.log(args);
            });
        });
    };

    Index.prototype.getStatus = function () {
        var action = this;
        var status = action.actStatus;

        var request = new Deferred();

        if (status && status.timestamp) {
            var now = (new Date()).getTime();

            // 30s 内不用重复请求
            if (now - status.timestamp < 30000) {
                request.resolve();
                return request.promise;
            }
        }

        require('er/ajax').getJSON(URL_STATE).done(function (data) {
            action.actStatus = {
                timestamp: (new Date()).getTime(),
                status: data
            };

            request.resolve();
        })
        .fail(function (args) {
            console.log(args);
        });

        return request.promise;
    };

    require('er/util').inherits(Index, Action);

    // return模块
    return Index;
});
