var ApiPoster = (function() {
    var _cardId = 0;
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

    CARD_DEFAULT_DATA = $.extend(CARD_DEFAULT_DATA, {
        'defaultBackground': BG_DEFAULT,
        'image': '',
        'count': '1012'
    });

    function init(cardId, showPageId, uploadPageId, loadedCallback, mustUploadImage) {
        function handleCardData(data) {
            data = $.extend({}, CARD_DEFAULT_DATA, data);

            app.renderCard(data);

            var imageUrl = data.image == '' ? data.defaultBackground: data.image;
            var userContent = data.message;
            if (showPageId != '') {
                app.shareImage = imageUrl;
            }

            if (uploadPageId != '') {
                var renderUpload = template.compile(_tmplImageUpload);
                _tmplImageUpload = renderUpload({
                    textCount: 0,
                    cardId: cardId,
                    textColor: data.fontColor,
                    count: data.count,
                    action: URL_POST_CARD,
                    btnUploadText: '',
                    btnPublishText: '',
                    btnChangeText: ''
                });
                bindImageUpload(uploadPageId)
            }
            if (loadedCallback != undefined) {
                loadedCallback(imageUrl, userContent)
            }
        }

        _cardId = cardId;
        if (mustUploadImage != undefined) {
            _mustUploadImage = mustUploadImage;
        }
        var sharedImageId = getUrlParameterByName('sid');

        if (!cardId) {
            handleCardData(CARD_DEFAULT_DATA);
            return;
        }

        $.getJSON(URL_GET_CARD, {
            'card_id': cardId
        }, function (result) {
            handleCardData(result.data || {});
        });
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
            
            var form = _$imageUpload.find('.form');

            var file = document.getElementById('file-to-upload').files[0];

            btnPublish.val('正在生成...');
            btnPublish.attr('disabled', true);

            var transform = form.find('.transform').val();

            var strFrom = $.trim(form.find('[name="from"]').val());
            var strTo = $.trim(form.find('[name="to"]').val());
            var strMsg = $.trim(form.find('[name="message"]').val());

            // canvas resize file
            $.buildfileupload({
                uploadurl: URL_POST_CARD,
                file: file,
                uploadinputname: 'image',
                maxfilesize: 1000 * 1000,
                transform: transform,
                uploadformdata: {
                    from: strFrom,
                    to: strTo,
                    message: strMsg
                },
                success: function (result) {
                    try {
                        data = JSON.parse(result);
                        if (data.status == 0) {
                            var cardId = data.data['card_id'];
                            window.location.href = 'heka.html?card_id=' + cardId;
                        }
                    }
                    catch (e) {
                        console.log('error databack:', result);
                    }
                    
                    btnPublish.val('生成新年贺卡');
                    btnPublish.removeAttr('disabled');
                },
                error: function () {
                    btnPublish.val('生成新年贺卡');
                    btnPublish.removeAttr('disabled');
                }
            });

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


/**
 * 程序启动
 * 
 * @namespace
 */
var app = {};
app.animate_goto = 3;
app.animate_gotoup = 3;
app.animate_gotodown = 4;
app.shareUrl = location.href;
app.shareAppId = '';
app.canTouchPage = 1;
app.startTouchPage = true;
app.width = $(window).width();
app.height = $('.main').height();
app.isPc = false;
app.pages = [];
app.pagesBG = [];
app.sharedCallback = null;
app.host = 'http://94uv.cn/';
app.startPageId = 0;
app.init = null;
app.showCopyright = true;
app.loadingCallback = null;
app.loadingDelay = 0;
app.loopSwipe = 1;
app.cardId = '';

app.showArrows = function() {
    $('#arrows').show()
};
app.hideArrows = function() {
    $('#arrows').hide()
};
app.showShare = function(msg) {
    var sharePage = $('#share');
    if (typeof(msg) != 'undefined') {
        sharePage.find('.msg').html(msg)
    }
    sharePage.show()
};
app.hideShare = function() {
    $('#share').hide()
};
app.setShareTitle = function(title) {
    document.title = title;
    app.shareTitle = title;
};
app.setShareImage = function(src) {
    $('#shareImg').attr('src', src);
    app.shareImage = src;
};
app.setShareDesc = function(desc) {
    app.shareDesc = desc;
};
app.setShareUrl = function(url) {
    app.shareUrl = url;
};
$('#share').click(function() {
    $(this).hide()
});

app.renderCard = function (data) {
    $('#card-to').text(data.to);
    $('#card-from').text(data.from);
    $('#card-message').text(data.message);
    $('#card-image').attr('src', data.image);
};

app.showCopyright = false;
var _orialSharedTitle = null;
var _orialSharedDesc = null;
var _orialSharedImage = null;

function setShareInfo(title, desc, image, params) {
    if (params != '') {
        var url = location.href;
        var id = getUrlParameterByName('id');
        if (url.indexOf('?') != -1) {
            url = url.substr(0, url.indexOf('?'))
        }
        if (id != '') {
            params = 'id=' + id + '&' + params
        }
        app.shareUrl = url + '?' + params
    }
    if (_orialSharedTitle == null) _orialSharedTitle = app.shareTitle;
    if (_orialSharedDesc == null) _orialSharedDesc = app.shareDesc;
    if (_orialSharedImage == null) _orialSharedImage = app.shareImage;
    if (title == '') {
        app.shareTitle = _orialSharedTitle
    } else {
        app.shareTitle = title
    }
    if (desc == '') {
        app.shareDesc = _orialSharedDesc
    } else {
        app.shareDesc = desc
    }
    if (image == '') {
        app.shareImage = _orialSharedImage
    } else {
        app.shareImage = image
    }
}
function getUrlParameterByName(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
    results = regex.exec(location.search);
    return results === null ? '': decodeURIComponent(results[1].replace(/\+/g, ' '))
}
function checkIsPC() {
    var system = {
        win: false,
        mac: false,
        xll: false
    };
    var p = navigator.platform;
    system.win = p.indexOf('Win') == 0;
    system.mac = p.indexOf('Mac') == 0;
    system.x11 = (p == 'X11') || (p.indexOf('Linux') == 0);
    if (system.win || system.mac || system.xll) {
        return true
    } else {
        return false
    }
}
function initPages() {
    var html = $('#pages').html();
    html = html.replace(/\r|\n/g, '');
    var patt = new RegExp('<page(.*?class=\"pt-page.*?)style=\"(.*?)\">(.*?)<\/page>', 'g');
    var outer = '';
    while ((result = patt.exec(html)) != null) {
        outer += '<div ' + result[1] + '></div>';
        app.pages.push(result[3]);
        app.pagesBG.push(result[2])
    }
    $('#wrapper').prepend(outer);
    $('#wrapper').height(app.height);
    $('#wrapper').css('top', ( - 1 * app.height) + 'px');
    $('#loading').css('top', ( - 2 * app.height) + 'px');
    $('#share').css('top', ( - 2 * app.height) + 'px');
    PageTransitions.init(app.startPageId)
}
function getPageIndex($pages, id) {
    var j = 0;
    for (j = 0; j < $pages.length; j++) {
        if ($pages.eq(j).attr('id') == id) {
            return j
        }
    }
    return 0
}
function initSpecialPages() {
    var pages = ['#floor', '#loading', '#share'];
    for ($i = 0; $i < pages.length; $i++) {
        $wrapper = $(pages[$i]);
        $page = $wrapper.find('.pt-page');
        if ($page.data('isrender') != true) {
            $page.data('isrender', true);
            if (typeof(bindPageEvent) == 'function') {
                bindPageEvent($page)
            }
            $page.height(app.height);
            // $page.find('img[data-link]').click(function() {
            //     window.open($(this).attr('data-link'))
            // });
            // $page.find('div[data-link]').click(function() {
            //     window.open($(this).attr('data-link'))
            // });
        }
        $wrapper.height(app.height)
    }
}

var curPageIndex = 0;
function renderPage(pageId) {
    var $pageWrapper = $('#wrapper');
    var $pages = $pageWrapper.find('.pt-page');
    var $curPage = null,
    $nextPage = null,
    $prePage = null;
    if (pageId <= 0) {
        $curPage = $pageWrapper.find('div.pt-page:not(.ifpage)').first()
    } else {
        $curPage = $pageWrapper.find('#' + pageId).first()
    }
    curPageIndex = -1;
    $prePage = $curPage.prev(':not(.ifpage)');
    if ($prePage.attr('id') == undefined) {
        $prePage = $pageWrapper.find('div.pt-page:not(.ifpage)').last();
        curPageIndex = 0
    }
    $nextPage = $curPage.next(':not(.ifpage)');
    if ($nextPage.attr('id') == undefined) {
        $nextPage = $pageWrapper.find('div.pt-page:not(.ifpage)').first();
        curPageIndex = 1
    }
    var renderList = [];
    renderList.push($curPage);
    if ($curPage.attr('id') != $prePage.attr('id')) renderList.push($prePage);
    if ($nextPage.attr('id') != $curPage.attr('id')) renderList.push($nextPage);
    for (i = 0; i < renderList.length; i++) {
        $cur = renderList[i];
        cur = getPageIndex($pages, $cur.attr('id'));
        if ($cur.data('isrender') != true) {
            $cur.attr('style', app.pagesBG[cur]);
            $cur.append(app.pages[cur]);
            $cur.data('isrender', true);
            if (typeof(bindPageEvent) == 'function') bindPageEvent($cur);
            $cur.height(app.height);
            $cur.find('img[data-link]').click(function() {
                window.open($(this).attr('data-link'))
            });
            $cur.find('div[data-link]').click(function() {
                window.open($(this).attr('data-link'))
            });
        }
    }
}
var startPos;
var endPos;
var isScrolling = 0;
function fnPageTouch(e) {
    switch (e.type) {
    case 'touchstart':
        {
            if (e.targetTouches.length == 1) {
                var touch = e.targetTouches[0];
                startPos = {
                    x: touch.pageX,
                    y: touch.pageY,
                    time: +new Date
                };　　isScrolling = 0
            }
            break
        }
    case 'touchend':
        {
            if (e.changedTouches.length == 1) {
                var touch = e.changedTouches[0];
                var endTouchy = touch.pageY;
                var excTouchy = endTouchy - startPos.y;
                var scrollTop = $(window).scrollTop() - excTouchy;
                var scrollBtm = $(document).height() - $(window).scrollTop() - currentScroll.height();
                if (scrollTop < -100) {
                    goPage( - 1)
                } else if (scrollBtm < -60) {
                    goPage( - 2)
                }
            }
            break
        }
    case 'touchmove':
        {　　
            if (e.targetTouches.length > 1 || e.scale && e.scale !== 1) {
                return
            }
            break
        }
    }
    e.stopPropagation()
}
function fnTestDisplay(text) {
    var showBody = $('<div />').css({
        'position': 'fixed',
        'top': 10 + 'px'
    }).html(text);
    showBody.appendTo('body');
    setTimeout(function() {
        showBody.remove()
    },
    300)
}
var currentScroll;
var lastScroll;
function fnCheckPageStyle(page) {
    var checkPage = page;
    var hasStylex = checkPage.hasClass('xStyle');
    var hasStyley = checkPage.hasClass('yStyle');
    return hasStylex || hasStyley
}
function fnLoadPageStyle(page) {
    if (fnCheckPageStyle(page) == true) {
        lastScroll = page
    }
}
function fnUnLoadPageStyle() {
    if (lastScroll != undefined) {
        lastScroll.css('overflow', 'hidden');
    }
}
function fnLoadScrollPage(page) {
    var pageEvnet = document.getElementById(page.attr('id'));
    if (pageEvnet == undefined) {
        return
    }
    var hasPageStyle = fnCheckPageStyle(page);
    if (hasPageStyle == true) {
        currentScroll = page;
        fnLoadPageStyle(currentScroll);
        pageEvnet.addEventListener('touchstart', fnPageTouch, false);
        pageEvnet.addEventListener('touchmove', fnPageTouch, false);
        pageEvnet.addEventListener('touchend', fnPageTouch, false)
    }
}
function initPC() {
    var $copyright = $('#copyright');
    if (checkIsPC()) {
        app.isPc = true;
        app.width = 320;
        app.height = Math.min(960 * (320 / 640), app.height);
        $('.pt-wrapper').width(app.width);
        $('.pt-wrapper').height(app.height);
        $('.pt-wrapper').css('margin', '0px auto');
        $copyright.css({
            'border': 'none',
            'color': '#00b7ff',
            'background': '#fff',
            'top': $(document).height() + 'px',
            'opacity': '1'
        });
        $copyright.show();
        var left = $(window).width() / 2 + app.width / 2;
        $("#pc-board").find(".qrcode div").html("<img src=\"http://www.starlord.cn/wsite/qrcode?url=" + decodeURIComponent(location.href) + "\"/>");
        $("#pc-board").css("left", left + "px");
        $("#pc-board").show();
        $(".icon-arrow").hide()
    }
}
function loading() {
    $('#loading b').html('正在加载：0%');
    var imgSrcList = [];
    if (typeof(app.pagesBG[0]) != 'undefined') {
        var matches = app.pagesBG[0].match(/url\((.*?)\)/);
        if (matches) {
            url = matches[1];
            imgSrcList.push(url)
        }
    }
    var div = document.createElement("div");
    div.innerHTML = app.pages[0];
    $(div).find('img').each(function() {
        imgSrcList.push($(this).attr('src'))
    });
    var len = imgSrcList.length,
    count = 0;
    if (len != 0) {
        for (i = 0; i < len; i++) {
            src = imgSrcList[i];
            var imgT = new Image();
            imgT.src = src;
            imgT.onload = function() {
                count++;
                num = parseInt(count / len * 100, 10);
                if (num > 100) num = 100;
                $('#loading b').html('正在加载：' + num + '%');
                if (app.loadingCallback != null) app.loadingCallback(num);
                if (num > 95) {
                    $('#btn-audio').show();
                    setTimeout(function() {
                        $('#loading').addClass('fadeOutUp animated');
                        setTimeout(function() {
                            $('#loading').hide()
                        },
                        1000)
                    }, app.loadingDelay);

                    renderPage(app.startPageId);

                    if (app.startPageId == 0) {
                        var pages = $('#wrapper').find('.pt-page');
                        fnVisiablePage(pages.eq(0))
                    } else {
                        fnVisiablePage($('#wrapper').find('#' + app.startPageId))
                    }
                    playPage()
                }
            }
        }
    } else {
        $('#btn-audio').show();
        $('#loading').hide();
        renderPage(app.startPageId);

        if (app.startPageId == 0) {
            var pages = $('.pt-page');
            fnVisiablePage(pages.eq(0))
        } else {
            fnVisiablePage($('#wrapper').find('#' + app.startPageId))
        }
        playPage()
    }
}
function playPage() {
    if ($('#page-166').hasClass('in')) {
        if (page166Inited == false) {
            page166Inited = true;

            // 贺卡初始化
            ApiPoster.init(app.cardId, '', 'page-168',
                function(imageurl, content) {
                    content = content.replace(/(^\s*)|(\s*$)/g, '');
                    if (content == '') {
                        content = '小伙伴\n新年快乐\n';
                    }

                    html = content.split("\n");
                    var from = '';
                    if (html.length > 2) {
                        from = html[2]
                    }
                    var msg = '';
                    for (i = 0; i < 2; i++) {
                        msg += html[i];
                        if (i == 0) {
                            msg += '，'
                        }
                    }
                    title = content.replace(/\n/g, ' ');
                    app.setShareImage(imageurl);
                    app.setShareTitle(title)
                }
            );

            var scene = document.getElementById('page-166');
            var parallax = new Parallax(scene);
        }
        
    }
    if ($('#page-169').hasClass('in')) {
        if (page169Inited == false) {
            page169Inited = true;
            var scene = document.getElementById('page-169');
            var parallax = new Parallax(scene);
        }
        
    }
    if ($('#page-168').hasClass('in')) {}
}
function fnVisiablePage(visiablePage) {
    visiablePage.addClass("in");
    fnLoadScrollPage(visiablePage)
}
function goPage(gotoPage) {
    var animate = app.animate_goto;
    if (gotoPage == -1) {
        animate = app.animate_gotoup
    } else if (gotoPage == -2) {
        animate = app.animate_gotodown
    }
    goPage2(animate, gotoPage)
}
function goPage2(animate, gotoPage) {
    var $pageWrapper = $("#wrapper");
    var $pages = $pageWrapper.find('.pt-page');

    var pageCount = $pages.length;
    if (pageCount <= 1) return;
    PageTransitions.AnimateGo($pageWrapper, animate, gotoPage);
    var currentPageId = $pageWrapper.data('current');
    renderPage(currentPageId);

    var $currentPage = null;
    if (currentPageId == 0) {
        $currentPage = $pageWrapper.find('div.pt-page:not(.ifpage)').first()
    } else {
        $currentPage = $pageWrapper.find("#" + currentPageId).first()
    }
    var isLastPage = false;
    if ($currentPage.attr("id") == $pageWrapper.find('div.pt-page:not(.ifpage)').last().attr("id")) {
        isLastPage = true
    } else if ($pageWrapper.find('div.pt-page:not(.ifpage)').length == 0) {
        if ($currentPage.attr("id") == $pageWrapper.find('div.pt-page').last().attr("id")) {
            isLastPage = true
        }
    }
    if (app.canTouchPage == 1) {
        if (isLastPage == true) {
            $('.u-arrow-down').eq(0).hide()
        } else {
            $('.u-arrow-down').eq(0).show()
        }
    }
    $pages.removeClass('in');
    fnUnLoadPageStyle();
    fnVisiablePage($currentPage);
    playPage();
}
function fnTouchMoveEnabled(e) {
    e.preventDefault();
    e.stopPropagation()
}
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
function init() {
    app.cardId = getQueryString('card_id');
    app.width = $(window).width();
    app.height = $('.main').height();
    if (app.init != null) {
        app.init();
    }

    initPC();
    initPages();
    initSpecialPages();
    loading();

    var swip1 = true;
    if (app.canTouchPage == 1) {
        $('.u-arrow-down').eq(0).show();
        $('.u-arrow-left').eq(0).hide()
    }
    document.addEventListener('touchmove', fnTouchMoveEnabled, false);
    var pages = $('#wrapper').find('.pt-page');
    var pageCount = pages.length;
    if (pageCount == 1) {
        $('.u-arrow-down').eq(0).hide()
    }
}
$(function() {
    app.shareTitle = $('#share-title').html();
    app.shareDesc = $('#share-desc').html();
    app.shareImage = $('#share-image').html();
    app.width = $(window).width();
    app.height = document.documentElement.clientHeight;

    BG_DEFAULT = $('#cover-default').attr('src');

    document.addEventListener('dblclick', function(e) {
        e.preventDefault()
    });
    init();

    if (app.canTouchPage == 1) {
        $(document).swipeUp(function() {
            if (app.startTouchPage) {
                if (app.loopSwipe == 0 && curPageIndex == 1) {
                    return;
                }
                goPage(-1);
            }
        });
        $(document).swipeDown(function() {
            if (app.startTouchPage) {
                if (app.loopSwipe == 0 && curPageIndex == 0) {
                    return
                }
                goPage(-2);
            }
        });
        $('#btnNext').show();
        $('#btnNext').click(function() {
            goPage( - 1)
        })
    }
    $('#btn-audio').click(function() {
        var myAudio = document.querySelectorAll('audio')[0];
        if (myAudio.paused) {
            myAudio.play();
            $('.icon-audio').addClass('border-anim')
        } else {
            myAudio.pause();
            $('.icon-audio').removeClass('border-anim')
        }
        return false
    })
});