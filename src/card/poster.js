var ApiPoster = (function() {
    var _host = '';
    var _cardId = 0;
    var _musicList = [];
    var _textArray = [];
    var _type;
    var _dialogueList = [];
    var _currentDialogueIndex = 1;
    // _$posterShow = null,
    var _$imageUpload = null;
    var _mustUploadImage = 1;
    function heredoc(fn) {
        return fn.toString().split('\n').slice(1, -1).join('\n') + '\n'
    }
    var _tmplImageUpload = $('#upload-content').html();

    function getUrlParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        return results === null ? '': decodeURIComponent(results[1].replace(/\+/g, " "))
    }
    function imageScale(file) {
        if (!file) {
            return false;
        }
        if (typeof FileReader === 'undefined') {
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#image-scale').attr('src', e.target.result)
        };
        reader.readAsDataURL(file);
        _$imageUpload.find('.upload-scale').show();
        app.hideArrows();
        app.startTouchPage = false;

        _$imageUpload.find('.transform').val('0,0,1,0');
        ImageScale.init('scale-zone',
        function(data) {
            var w = _$imageUpload.find('.zone').width();
            _$imageUpload.find('.transform').val(data.translate.x * 1.0 / w + ',' + data.translate.y * 1.0 / w + ',' + data.scale + ',' + data.angle)
        })
    }
    function initText() {
        var previewWidth = $('#preview').width();
        var scale = previewWidth * 1.0 / 480;

        var textColor = _$imageUpload.find('.textColor').val();
        var textContainerObj = $('#textContainer');
        var editContainerObj = _$imageUpload.find('.editContainer');

        $('.text-edit').blur(function() {
            var text = $(this).val();
            var maxCount = parseInt($(this).attr('data'));
            if (maxCount > 0 && text.length > maxCount) {
                text = text.substr(0, maxCount)
            }
            if (!text) {
                text = $(this).data('text');
            }
            $(this).val(text);
            var id = $(this).attr('id');
            _$imageUpload.find('.p' + id).html(text)
        })
    }

var defaultData = {
    'userContent': '',
    'frameFileName': 'http://swimage1.cyku.net/2014/12/29/1419842705944.png',
    'defaultBackground': BG_DEFAULT,
    'userImageUrl': '',
    'title': '',
    'type': 'poster',
    'musicUrl': '',
    'shareCount': '1012'
};


    function init(host, cardId, showPageId, uploadPageId, loadedCallback, writeTitle, btnChangeTitle, btnPublishTitle, mustUploadImage) {
        _host = host;
        _cardId = cardId;
        if (mustUploadImage != undefined) {
            _mustUploadImage = mustUploadImage;
        }
        var sharedImageId = getUrlParameterByName('sid');

        if (!cardId) {
            handleCardData(defaultData);
            return;
        }

        $.getJSON(URL_GET_CARD, {
            'card_id': cardId
        }, handleCardData)

        function handleCardData(data) {
            _type = data.type;
            var imageUrl = data.userImageUrl == '' ? data.defaultBackground: data.userImageUrl;
            var userContent = data.userContent;
            if (showPageId != '') {
                app.shareImage = imageUrl;

                // todo..
            }
            if (uploadPageId != '') {
                var btnUploadText = '选择照片';
                var btnPublishText = '生成我的专属海报';
                if (typeof(btnPublishTitle) != 'undefined') {
                    btnPublishText = btnPublishTitle;
                }
                btnChangeText = '更换台词';
                if (typeof(btnChangeTitle) != 'undefined') {
                    btnChangeText = btnChangeTitle;
                }
                var renderUpload = template.compile(_tmplImageUpload);
                _tmplImageUpload = renderUpload({
                    textCount: _textArray.length,
                    cardId: cardId,
                    textColor: data.fontColor,
                    shareCount: data.shareCount,
                    action: URL_POST_CARD,
                    btnUploadText: btnUploadText,
                    btnPublishText: btnPublishText,
                    title: typeof(writeTitle) != 'undefined' && writeTitle != '' ? writeTitle: "写一写 " + data.title,
                    btnChangeText: btnChangeText,
                    frameFileName: data.frameFileName
                });
                bindImageUpload(uploadPageId)
            }
            if (loadedCallback != undefined) {
                loadedCallback(imageUrl, userContent)
            }
        }

    }




    function bindImageUpload(pageId) {
        $('#' + pageId).prepend(_tmplImageUpload);
        _$imageUpload = $('#image-upload');
        initText();

        $('#file-to-upload').change(function() {
            var file = document.getElementById('file-to-upload').files[0];
            imageScale(file);
            if (file) {
                _$imageUpload.find('.photo-filename').val('OK');
            }
            else {
                _$imageUpload.find('.photo-filename').val('');
            }
            
            _$imageUpload.find('.btn-upload .text').html('选择完成');
            _$imageUpload.find('.btn-upload').addClass('btn-upload-selected');
            return false;
        });
        _$imageUpload.find('.btn-upload').click(function() {
            $('#file-to-upload').trigger('click');
            return false;
        });
        var btnPublish = _$imageUpload.find('.mark-card-btn');

        btnPublish.click(function() {
            var v = _$imageUpload.find('.photo-filename').val();
            if (v == '' && _mustUploadImage == 1) {
                alert('要上传照片哦，么么哒！');
                return false;
            }
            btnPublish.val('正在生成...');
            btnPublish.attr('disabled', true);
            _$imageUpload.find('input').removeAttr('disabled');
            var form = _$imageUpload.find('.form');
            console.log(form.serialize());


            // form.submit();
            
            return false;
        });

        var btnScale = _$imageUpload.find('.btn-scale');
        btnScale.click(function() {
            _$imageUpload.find('.upload-scale').hide();
            app.startTouchPage = true;
            app.showArrows()
        })
    }
    return {
        init: init,
    }
})();
var ImageScale = (function() {
    var reqAnimationFrame = (function() {
        return window[Hammer.prefixed(window, 'requestAnimationFrame')] ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60)
        }
    })();

    var zone;
    var el;
    var START_X;
    var START_Y;
    var ticking = false;
    var transform;
    var timer;
    var mc;
    var updateCallback = null;

    function init(scaleZoneId, callback) {
        updateCallback = callback;
        zone = document.querySelector("#" + scaleZoneId);
        $("#" + scaleZoneId).height(($("#" + scaleZoneId).width() * 1.0 / 480) * 640);
        el = document.querySelector("#image-scale");
        START_X = 0;
        START_Y = 0;
        mc = new Hammer.Manager(zone);
        mc.add(new Hammer.Pan({
            threshold: 0,
            pointers: 0
        }));
        mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));
        mc.add(new Hammer.Rotate({
            threshold: 0
        })).recognizeWith(mc.get('pan'));
        mc.add(new Hammer.Pinch({
            threshold: 0
        })).recognizeWith([mc.get('pan'), mc.get('rotate')]);
        mc.add(new Hammer.Tap({
            event: 'doubletap',
            taps: 2
        }));
        mc.add(new Hammer.Tap());
        mc.on('panstart panmove', onPan);
        mc.on('rotatestart rotatemove', onRotate);
        mc.on('pinchstart pinchmove', onPinch);
        mc.on('doubletap', onDoubleTap);
        resetElement()
    }
    function resetElement() {
        el.className = 'animate';
        transform = {
            translate: {
                x: START_X,
                y: START_Y
            },
            scale: 1,
            angle: 0
        };
        requestElementUpdate()
    }
    function updateElementTransform() {
        var value = ['translate(' + transform.translate.x + 'px, ' + transform.translate.y + 'px)', 'scale(' + transform.scale + ', ' + transform.scale + ')', 'rotate(' + transform.angle + 'deg)'];
        value = value.join(' ');
        el.textContent = value;
        el.style.webkitTransform = value;
        el.style.mozTransform = value;
        el.style.transform = value;
        ticking = false;
        if (updateCallback != null) {
            updateCallback(transform)
        }
    }
    function requestElementUpdate() {
        if (!ticking) {
            reqAnimationFrame(updateElementTransform);
            ticking = true
        }
    }
    function onPan(ev) {
        el.className = '';
        transform.translate = {
            x: START_X + ev.deltaX,
            y: START_Y + ev.deltaY
        };
        requestElementUpdate()
    }
    var initScale = 1;
    function onPinch(ev) {
        if (ev.type == 'pinchstart') {
            initScale = transform.scale || 1
        }
        el.className = '';
        transform.scale = initScale * ev.scale;
        requestElementUpdate()
    }
    var initAngle = 0;
    function onRotate(ev) {
        if (ev.type == 'rotatestart') {
            initAngle = transform.angle || 0
        }
        el.className = '';
        transform.rz = 1;
        transform.angle = initAngle + ev.rotation;
        requestElementUpdate()
    }
    function onDoubleTap(ev) {
        resetElement();
        requestElementUpdate()
    }
    return {
        init: init,
    }
})();