define(
    function (require) {
        var dialog = {};

        /**
         * 对话框
         * 
         * @constructor
         * @param {Object} options 参数
         * 
         * @param {string} title 标题
         * @param {string} content 内容
         * @param {string} width 宽度
         * @param {boolean} autoOpen 是否自动展示
         * @param {boolean} mask 是否显示遮罩
         * @param {string} buttons 按钮事件
         *  {
         *      text: '确定',
         *      style: 'btn-ok',
         *      fn: function () {}
         *  }
         */
        function Dialog(options) {
            this.options = $.extend({
                autoOpen: 1
            }, options);

            this.init();
        };

        Dialog.prototype = {
            constructor: Dialog,

            init: function () {
                var options = this.options;

                var layer = this.layer = $('<div/>').addClass('dialog dialog-alert');

                var title = this.title = $('<h5/>').addClass('dialog-title').text(options.title).appendTo(layer);
                var content = this.content = $('<div/>').addClass('dialog-content').text(options.content).appendTo(layer);
                
                layer.appendTo($(document.body));

                this.initBtns();
                this.initMask();

                if (!options.autoOpen) {
                    layer.hide();
                }
                else {
                    this.show();
                }
            },

            initBtns: function () {
                var me = this;
                var btns = me.options.buttons || [];

                if (!btns.length) {
                    return false;
                }

                var layer = me.layer;
                var btnPanel = me.buttons = $('<div/>').addClass('dialog-foot').appendTo(layer);

                $.each(btns, function (i, item) {
                    var button = $('<button/>').addClass('btn').text(item.text).appendTo(btnPanel);

                    if (item.style) {
                        button.addClass('btn-' + item.style);
                    }

                    if (item.fn) {
                        button.on('click', function () {
                            item.fn.call(me);
                        });
                    }
                    else {
                        button.on('click', function () {
                            me.dispose();
                        });
                    }
                });
            },

            initMask: function () {
                var me = this;
                if (me.options.mask) {
                    me.mask = $('<div/>').addClass('dialog-mask').appendTo($(document.body));
                    me.mask.on('click', function () {
                        me.dispose();
                    });
                }
            },

            show: function () {
                var layer = this.layer;
                var height = layer.height();
                var width = layer.width();
                var winHeight = $(window).height();
                var winWidth = $(window).width();

                var top = (winHeight - height) / 2;
                var left = (winWidth - width) / 2;

                layer.css({
                    'top': top + 'px',
                    'left': left + 'px'
                });
            },

            dispose: function () {
                this.mask && this.mask.remove();
                this.layer && this.layer.remove();

                this.mask = this.layer = this.title = this.content = this.buttons = null;
            }
        };

        dialog.alert = function (msg, title, okhandler) {
            var options = {
                title: title || '提示',
                content: msg,
                mask: 1,
                width: 460,
                buttons: [
                    {
                        text: '确 定',
                        style: 'ok'
                    }
                ]
            };
            if (typeof okhandler == 'function') {
                options.buttons[0].fn = function () {
                    okhandler.call(this);
                };
            }
            var dlg = new Dialog(options);
            return dlg;
        };

        return dialog;
    }
);