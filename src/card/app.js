var app = {};
app.animate_goto = 3;
app.animate_gotoup = 3;
app.animate_gotodown = 4;
app.shareTitle = $('#shareTitle').html();
app.shareDesc = $('#shareDesc').html();
app.shareImage = $('#shareImage').html();
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
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? '': decodeURIComponent(results[1].replace(/\+/g, " "))
}
function checkIsPC() {
    var system = {
        win: false,
        mac: false,
        xll: false
    };
    var p = navigator.platform;
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
    if (system.win || system.mac || system.xll) {
        return true
    } else {
        return false
    }
}
function initPages() {
    var html = $("#pages").html();
    html = html.replace(/\r|\n/g, '');
    var patt = new RegExp('<page(.*?class=\"pt-page.*?)style=\"(.*?)\">(.*?)<\/page>', 'g');
    var outer = '';
    while ((result = patt.exec(html)) != null) {
        outer += "<div " + result[1] + "></div>";
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
            $page.find('img[data-link]').click(function() {
                window.open($(this).attr('data-link'))
            });
            $page.find('div[data-link]').click(function() {
                window.open($(this).attr('data-link'))
            });
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
    var hasStylex = checkPage.hasClass("xStyle");
    var hasStyley = checkPage.hasClass("yStyle");
    return hasStylex || hasStyley
}
function fnLoadPageStyle(page) {
    if (fnCheckPageStyle(page) == true) {
        lastScroll = page
    }
}
function fnUnLoadPageStyle() {
    if (lastScroll != undefined) {
        lastScroll.css("overflow", "hidden");
    }
}
function fnLoadScrollPage(page) {
    var pageEvnet = document.getElementById(page.attr("id"));
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
    var $copyright = $("#copyright");
    if (checkIsPC()) {
        app.isPc = true;
        app.width = 320;
        app.height = Math.min(960 * (320 / 640), app.height);
        $(".pt-wrapper").width(app.width);
        $(".pt-wrapper").height(app.height);
        $(".pt-wrapper").css("margin", "0px auto");
        $copyright.css({
            "border": "none",
            "color": "#00b7ff",
            "background": "#fff",
            "top": $(document).height() + "px",
            "opacity": "1"
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
    $(div).find("img").each(function() {
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
                $('#loading b').html("正在加载：" + num + '%');
                if (app.loadingCallback != null) app.loadingCallback(num);
                if (num > 95) {
                    $("#btnAudio").show();
                    setTimeout(function() {
                        $('#loading').addClass('fadeOutUp animated');
                        setTimeout(function() {
                            $('#loading').hide()
                        },
                        1000)
                    },
                    app.loadingDelay);
                    renderPage(app.startPageId);
                    if (app.startPageId == 0) {
                        var pages = $("#wrapper").find('.pt-page');
                        fnVisiablePage(pages.eq(0))
                    } else {
                        fnVisiablePage($("#wrapper").find("#" + app.startPageId))
                    }
                    playPage()
                }
            }
        }
    } else {
        $("#btnAudio").show();
        $('#loading').hide();
        renderPage(app.startPageId);
        if (app.startPageId == 0) {
            var pages = $('.pt-page');
            fnVisiablePage(pages.eq(0))
        } else {
            fnVisiablePage($("#wrapper").find("#" + app.startPageId))
        }
        playPage()
    }
}
function playPage() {
    if ($('#page-166').hasClass('in')) {
        if (page166Inited == false) {
            page166Inited = true;

            // 贺卡初始化
            ApiPoster.init(
                app.host, 70, '', "page-168",
                function(imageurl, content) {
                    content = content.replace(/(^\s*)|(\s*$)/g, '');
                    if (content == '') {
                        content = "小伙伴\n新年快乐\n"
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
                            msg += "，"
                        }
                    }
                    title = content.replace(/\n/g, " ");
                    app.setShareImage(imageurl + "!300x300");
                    app.setShareTitle(title)
                },
                "写下你的祝福", "换一换", "生成我的贺卡", 0
            );

            var scene = document.getElementById('page-166');
            var parallax = new Parallax(scene);
        }
        
    }
    if ($('#page-169').hasClass('in')) {
        restartSnow();
        if (page169Inited == false) {
            page169Inited = true;
            var scene = document.getElementById('page-169');
            var parallax = new Parallax(scene)
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
    console.log($pages);
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
    $pages.removeClass("in");
    fnUnLoadPageStyle();
    fnVisiablePage($currentPage);
    playPage();
}
function fnTouchMoveEnabled(e) {
    e.preventDefault();
    e.stopPropagation()
}
function init() {
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
    var pages = $("#wrapper").find(".pt-page");
    var pageCount = pages.length;
    if (pageCount == 1) {
        $('.u-arrow-down').eq(0).hide()
    }
}
$(function() {
    app.shareTitle = $("#shareTitle").html();
    app.shareDesc = $("#shareDesc").html();
    app.shareImage = $("#shareImage").html();
    app.width = $(window).width();
    app.height = document.documentElement.clientHeight;
    document.addEventListener('dblclick',
    function(e) {
        e.preventDefault()
    });
    init();

    if (app.canTouchPage == 1) {
        $(document).swipeUp(function() {
            if (app.startTouchPage) {
                if (app.loopSwipe == 0 && curPageIndex == 1) {
                    return
                }
                goPage( - 1)
            }
        });
        $(document).swipeDown(function() {
            if (app.startTouchPage) {
                if (app.loopSwipe == 0 && curPageIndex == 0) {
                    return
                }
                goPage( - 2)
            }
        });
        $("#btnNext").show();
        $("#btnNext").click(function() {
            goPage( - 1)
        })
    }
    $("#btnAudio").click(function() {
        var myAudio = document.querySelectorAll('audio')[0];
        if (myAudio.paused) {
            myAudio.play();
            $('.icon_audio').addClass('border_anim')
        } else {
            myAudio.pause();
            $('.icon_audio').removeClass('border_anim')
        }
        return false
    })
});