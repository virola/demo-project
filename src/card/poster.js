var ApiPoster = (function() {
    var _host = "";
    var _packageId = 0;
    var _musicList = [];
    var _textArray = [];
    var _type = "cd";
    var _dialogueList = [];
    var _currentDialogueIndex = 1;
    var _$cdShow = null,
    _$posterShow = null,
    _$imageUpload = null;
    var _mustUploadImage = 1;
    function heredoc(fn) {
        return fn.toString().split('\n').slice(1, -1).join('\n') + '\n'
    }
    var _tmplCDShow = '         <div id="cdShow" class="cdShow">                <div class="cd-cover">                  <div style="background:url({{imageUrl}}!w260);"></div>              </div>          <div class="btn-play play-state-pause">                 <a href=# class="play-state"></a>               </div>              <div class="text-box entry" >                       {{each userContent as value i}}                         {{if value!=""}}                                <p class="text-{{i}}">{{value}}</p>                         {{/if}}                     {{/each}}               </div>          </div>          {{if musicUrl!=""}}<audio id="audioCD" loop style = "z-index:0;width:0px;height:0px;left:0px;bottom:0px"><source src="{{musicUrl}}" type="audio/mpeg"> </audio>{{/if}}      ';
    var _tmplPosterShow = '       <div id="posterShow" class="posterShow">          <div style="background:red;"><img src="{{imageUrl}}"/></div>            <div class="text-box">                  {{userContent}}                     {{each userContent as value i}}                         {{if value!=""}}                                <p class="text-{{i}}">{{value}}</p>                         {{/if}}                     {{/each}}               </div>          </div>';
    var _tmplImageUpload = '<div id="imageUpload" class="imageUpload">              <div id="log"></div>            <form method="post"  class="form"  enctype="multipart/form-data" action="{{action}}">                   <input type="hidden" class="packageId" name="packageId" value="{{packageId}}" />                    <input type="hidden" class="photoFileName" name="photoFileName" value="" />                 <input type="hidden" class="textColor" name="textColor" value="{{textColor}}"/>                 <input type="hidden" class="joinFaffle" name="joinFaffle" value="0"/>                   <input type="hidden" class="transform" name="transform"/>               <div class="upload-container" style="">                 <center>                        <div class="button green btnUpload">                            <div class="text">{{btnUploadText}}<br/>                                {{if shareCount>200}}<span style="font-size:12px;color:#fff;">已有{{shareCount}}人参与</span>{{/if}}                         </div>                      </div>                  </center>                   {{if textCount>0}}                  <div style="margin-top:10px;" class="text-box">                     <div style="font-size:18px;font-weight:bold;font-family:\"宋体\""> {{title}}</div>                            <div class="editContainer" style="margin-top:4px;"></div>                       <div class="changeDialogueBox" style="font-size:12px;font-family: \"宋体\";margin-bottom:18px;margin-top:2px;display:none;">或 <a type="button"  class="button btnChangeDialogue" href="#">{{btnChangeText}}</a></div>                         <div style="display:none;">                         <div style="font-size:12px;margin-top:5px;">点击更换字体颜色:</div>                         <table>                             <tr>                                    <td><a href=#  data="#00B5B5" style="background-color:#00B5B5" class="text-color selected " ></a></td>                                  <td><a href=#  data="#000000" style="background-color:#000000" class="text-color " ></a></td>                                   <td><a href=#  data="#ffffff" style="background-color:#ffffff" class="text-color " ></a></td>                                   </tr>                           </table>                        </div>                  </div>                  {{/if}}                 <center style="margin-top:15px;"><input type="button" class="super button red btnPublish" value="{{btnPublishText}}"/></center>             </div>              <div class="upload-scale">                  <div class="zone" id="scaleZone">                       <img id="imageScale" class="image-scale"/>                      {{if frameFileName!=""}}<img src="{{frameFileName}}" class="image-mask"/>{{/if}}                        <div>移动或双指缩放图片</div>                    </div>                  <a class="large button green btn-scale">确定</a>              </div>              <input style="opacity: 0; " accept="image/*"  name="fileToUpload" id="fileToUpload" type="file">            </form>         </div>      ';
    function getUrlParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        return results === null ? "": decodeURIComponent(results[1].replace(/\+/g, " "))
    }
    function imageScale(file) {
        if (typeof FileReader === 'undefined') {
            return
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            $("#imageScale").attr("src", e.target.result)
        };
        reader.readAsDataURL(file);
        _$imageUpload.find(".upload-scale").show();
        app.hideArrows();
        app.startTouchPage = false;
        _$imageUpload.find(".transform").val("0,0,1,0");
        ImageScale.init("scaleZone",
        function(data) {
            var w = _$imageUpload.find(".zone").width();
            _$imageUpload.find(".transform").val(data.translate.x * 1.0 / w + "," + data.translate.y * 1.0 / w + "," + data.scale + "," + data.angle)
        })
    }
    function initDialogue() {
        if (_dialogueList.length > 1) {
            _$imageUpload.find(".changeDialogueBox").show()
        } else {
            _$imageUpload.find(".changeDialogueBox").hide()
        }
    }
    function changeDialogue() {
        var count = _dialogueList.length;
        if (count > 0) {
            if (_currentDialogueIndex >= count) {
                _currentDialogueIndex = 0
            }
            var dialogue = _dialogueList[_currentDialogueIndex];
            var maxCount = Math.min(_textArray.length, dialogue.length);
            for (var i = 0; i < maxCount; i++) {
                _$imageUpload.find(".pe" + i).text(dialogue[i]);
                _$imageUpload.find(".e" + i).val(dialogue[i])
            }
            _currentDialogueIndex += 1
        }
    }
    function initText() {
        var previewWidth = $("#preview").width();
        var scale = previewWidth * 1.0 / 480;
        if (_textArray.length > 0) {
            if (_$cdShow != null) _$cdShow.find(".text-box").show()
        }
        for (var i = 0; i < _textArray.length; i++) {
            _textArray[i].x = _textArray[i].x * scale - 6;
            _textArray[i].y = _textArray[i].y * scale;
            _textArray[i].fontSize = _textArray[i].fontSize * scale
        }
        var textColor = _$imageUpload.find(".textColor").val();
        var textContainerObj = $("#textContainer");
        var editContainerObj = _$imageUpload.find(".editContainer");
        for (var i = 0; i < _textArray.length; i++) {
            var cur_text = _textArray[i];
            var fontColor = textColor;
            var className = "";
            if (cur_text.fontColor != "") {
                fontColor = cur_text.fontColor;
                className = "nochange_color"
            }
            var html = "<span class='" + className + " pe" + i + "' style=\"color:" + fontColor + ";font-family: '宋体';font-size:" + cur_text.fontSize + "px;position:absolute;left:" + cur_text.x + "px;top:" + cur_text.y + "px;\">" + cur_text.content + "</span>";
            textContainerObj.append(html);
            var disabled = "";
            var type = "text";
            var disabledClass = "";
            if (cur_text.edit == 0) {
                disabled = "disabled='disabled'";
                disabledClass = "disabled"
            }
            if (cur_text.show == 0) {
                type = "hidden"
            }
            var maxFontCount = "";
            if (cur_text.maxFontCount != "" && cur_text.maxFontCount != "0") {
                maxFontCount = "<span style='font-size:12px;'>最多" + cur_text.maxFontCount + "个字</span>"
            }
            html = "<div><input data='" + cur_text.maxFontCount + "' class='text-edit e" + i + " " + disabledClass + "' type='" + type + "' " + disabled + " name='edit[]'  value=\"" + cur_text.content + "\" placeholder=\"" + cur_text.placeholder + "\" /> " + maxFontCount + "</div>";
            editContainerObj.append(html)
        }
        $(".text-edit").blur(function() {
            var text = $(this).val();
            var maxCount = parseInt($(this).attr("data"));
            if (maxCount > 0 && text.length > maxCount) {
                text = text.substr(0, maxCount)
            }
            $(this).val(text);
            var id = $(this).attr("id");
            _$imageUpload.find(".p" + id).html(text)
        })
    }

var defaultData = {
    "userContent": "",
    "frameFileName": "",
    "defaultBackground": "",
    "userImageUrl": "",
    "title": "",
    "type": "poster",
    "musicUrl": "",
    "shareCount": "1012",
    "fontColor": "#000000",
    "colorList": [
        {
            "color": "#000000"
        },
        {
            "color": "#ffffff"
        }
    ],
    "dialogueList": [],
    "textList": [
        {
            "id": "155",
            "content": "小伙伴",
            "fontName": "MHeiGB-Bold",
            "fontSize": "20",
            "x": "0",
            "y": "0",
            "height": "20",
            "maxFontCount": "0",
            "canEdit": "1",
            "horizontalAlign": "1",
            "fontColor": "",
            "placeholder": "小伙伴",
            "isShow": "1"
        },
        {
            "id": "156",
            "content": "新年快乐",
            "fontName": "MHeiGB-Bold",
            "fontSize": "20",
            "x": "0",
            "y": "0",
            "height": "20",
            "maxFontCount": "5",
            "canEdit": "1",
            "horizontalAlign": "1",
            "fontColor": "",
            "placeholder": "",
            "isShow": "1"
        },
        {
            "id": "157",
            "content": "你的泰富",
            "fontName": "MHeiGB-Bold",
            "fontSize": "20",
            "x": "0",
            "y": "0",
            "height": "20",
            "maxFontCount": "0",
            "canEdit": "1",
            "horizontalAlign": "1",
            "fontColor": "",
            "placeholder": "签名",
            "isShow": "1"
        },
        {
            "id": "158",
            "content": "",
            "fontName": "MHeiGB-Bold",
            "fontSize": "20",
            "x": "0",
            "y": "0",
            "height": "20",
            "maxFontCount": "0",
            "canEdit": "1",
            "horizontalAlign": "1",
            "fontColor": "",
            "placeholder": "",
            "isShow": "0"
        }
    ]
};


    function init(host, packageId, showPageId, uploadPageId, loadedCallback, writeTitle, btnChangeTitle, btnPublishTitle, mustUploadImage) {
        _host = host;
        _packageId = packageId;
        if (mustUploadImage != undefined) {
            _mustUploadImage = mustUploadImage
        }
        var sharedImageId = getUrlParameterByName("sid");
        $.get('data.json', {
            "packageId": packageId,
            "sharedImageId": sharedImageId
        },
        function(data) {
            _type = data.type;
            var imageUrl = data.userImageUrl == "" ? data.defaultBackground: data.userImageUrl;
            var userContent = data.userContent;
            if (showPageId != "") {
                app.shareImage = imageUrl + "!w200xh200";
                if (userContent.replace(/(^\s*)|(\s*$)/g, '') == "") {
                    for (i = 0; i < data.textList.length; i++) {
                        text = data.textList[i];
                        userContent += "\n" + text.content
                    }
                }
                if (data.type == "cd") {
                    var renderCDShow = template.compile(_tmplCDShow);
                    _tmplCDShow = renderCDShow({
                        musicUrl: data.musicUrl,
                        imageUrl: imageUrl,
                        userContent: userContent.split("\n")
                    });
                    bindCDShow(showPageId)
                } else {
                    var renderPosterShow = template.compile(_tmplPosterShow);
                    _tmplPosterShow = renderPosterShow({
                        imageUrl: imageUrl,
                        userContent: userContent.split("\n")
                    });
                    bindPosterShow(showPageId)
                }
            }
            if (uploadPageId != "") {
                var btnUploadText = "";
                var btnPublishText = "";
                if (_type == "cd") {
                    btnUploadText = "选择照片";
                    btnPublishText = "生成我的CD封面"
                } else {
                    btnUploadText = "选择照片";
                    btnPublishText = "生成我的专属海报"
                }
                if (typeof(btnPublishTitle) != "undefined") {
                    btnPublishText = btnPublishTitle
                }
                btnChangeText = "更换台词";
                if (typeof(btnChangeTitle) != "undefined") {
                    btnChangeText = btnChangeTitle
                }
                for (i = 0; i < data.textList.length; i++) {
                    text = data.textList[i];
                    _textArray.push({
                        maxFontCount: text.maxFontCount,
                        content: text.content,
                        x: text.x,
                        y: text.y,
                        fontSize: text.fontSize,
                        fontColor: text.fontColor,
                        fontName: "",
                        edit: text.canEdit,
                        show: text.isShow,
                        placeholder: text.placeholder,
                    })
                }
                for (i = 0; i < data.dialogueList.length; i++) {
                    dialogue = data.dialogueList[i];
                    _dialogueList.push(dialogue)
                }
                var renderUpload = template.compile(_tmplImageUpload);
                _tmplImageUpload = renderUpload({
                    textCount: _textArray.length,
                    packageId: packageId,
                    textColor: data.fontColor,
                    shareCount: data.shareCount,
                    action: _host + "web/publish2",
                    btnUploadText: btnUploadText,
                    btnPublishText: btnPublishText,
                    title: typeof(writeTitle) != "undefined" && writeTitle != "" ? writeTitle: "写一写 " + data.title,
                    btnChangeText: btnChangeText,
                    frameFileName: data.frameFileName
                });
                bindImageUpload(uploadPageId)
            }
            if (loadedCallback != undefined) {
                loadedCallback(imageUrl, userContent)
            }
        },
        "json")
    }

    

    
    function bindImageUpload(pageId) {
        $("#" + pageId).prepend(_tmplImageUpload);
        _$imageUpload = $("#imageUpload");
        initDialogue();
        _$imageUpload.find(".btnChangeDialogue").click(function() {
            changeDialogue();
            return false
        });
        initText();
        $(".text-color").click(function() {
            $(".text-color").removeClass('selected');
            var color = $(this).attr("data");
            $("#textContainer span").each(function() {
                if ($(this).hasClass("nochange_color") == false) $(this).css("text-color", color)
            });
            _$imageUpload.find(".textColor").val(color);
            $(this).addClass('selected');
            return false
        });
        $("#fileToUpload").change(function() {
            imageScale(document.getElementById("fileToUpload").files[0]);
            _$imageUpload.find(".photoFileName").val("OK");
            _$imageUpload.find(".btnUpload .text").html("选择完成");
            _$imageUpload.find(".btnUpload").addClass("btnUploadSelected");
            return false
        });
        _$imageUpload.find(".btnUpload").click(function() {
            $("#fileToUpload").trigger('click');
            return false
        });
        var btnPublish = _$imageUpload.find(".btnPublish");
        btnPublish.click(function() {
            var v = _$imageUpload.find(".photoFileName").val();
            if (v == "" && _mustUploadImage == 1) {
                alert("要上传照片哦，么么哒！");
                return false
            }
            btnPublish.val("正在生成...");
            btnPublish.attr("disabled", true);
            _$imageUpload.find("input").removeAttr("disabled");
            _$imageUpload.find(".form").submit();
            return false
        });
        var btnScale = _$imageUpload.find(".btn-scale");
        btnScale.click(function() {
            _$imageUpload.find(".upload-scale").hide();
            app.startTouchPage = true;
            app.showArrows()
        })
    }
    function bindPosterShow(pageId) {
        $("#" + pageId).prepend(_tmplPosterShow);
        _$posterShow = $("#posterShow")
    }
    function bindCDShow(pageId) {
        $("#" + pageId).prepend(_tmplCDShow);
        _$cdShow = $("#cdShow");
        _$cdShow.find(".entry").each(function() {
            var e = $(this);
            var top = parseFloat(e.css("top")) * app.width / 640;
            e.css("top", top + "px")
        });
        var left = (_$cdShow.width() - 69) / 2;
        var top = 20 + 125;
        var btns = $(".btn-play");
        btns.css("left", left + "px");
        var audio = document.getElementById("audioCD");
        if (audio != null) audio.play();
        setTimeout(function() {
            $(".text-box").addClass("fadeInUp animated")
        },
        500);
        $(".btn-play").click(function() {
            if ($(this).hasClass("play-state-play") == true) {
                audio.play();
                $(this).removeClass("play-state-play");
                $(this).addClass("play-state-pause");
                $(".cd-cover").css("-webkit-animation-play-state", "running");
                $(".cd-cover").css("-moz-animation-play-state", "running");
                $(".cd-cover").css("animation-play-state", "running")
            } else {
                audio.pause();
                $(this).removeClass("play-state-pause");
                $(this).addClass("play-state-play");
                $(".cd-cover").css("-webkit-animation-play-state", "paused");
                $(".cd-cover").css("-moz-animation-play-state", "paused");
                $(".cd-cover").css("animation-play-state", "paused")
            }
            return false
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
        el = document.querySelector("#imageScale");
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
        mc.on("panstart panmove", onPan);
        mc.on("rotatestart rotatemove", onRotate);
        mc.on("pinchstart pinchmove", onPinch);
        mc.on("doubletap", onDoubleTap);
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
        value = value.join(" ");
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