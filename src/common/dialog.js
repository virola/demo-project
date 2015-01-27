define(
    function (require) {
        var dialog = {};

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
                        button.on('click', item.fn);
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
                var winHeight = $(window).height();

                var top = (winHeight - height) / 2;

                layer.css('top', top + 'px');
            },

            dispose: function () {
                this.mask && this.mask.remove();
                this.layer && this.layer.remove();

                this.mask = this.layer = this.title = this.content = this.buttons = null;
            }
        };

        dialog.alert = function (msg, title) {
            var dlg = new Dialog({
                title: title,
                content: msg,
                mask: 1,
                buttons: [
                    {
                        text: '确 定',
                        style: 'ok'
                    }
                ]
            });

            return dlg;
        };

        return dialog;
    }
);