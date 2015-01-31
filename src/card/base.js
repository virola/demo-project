; (function($) {
    var touch = {},
    touchTimeout, tapTimeout, swipeTimeout, longTapTimeout, longTapDelay = 750,
    gesture;
    function swipeDirection(x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left': 'Right') : (y1 - y2 > 0 ? 'Up': 'Down')
    }
    function longTap() {
        longTapTimeout = null;
        if (touch.last) {
            touch.el.trigger('longTap');
            touch = {}
        }
    }
    function cancelLongTap() {
        if (longTapTimeout) {
            clearTimeout(longTapTimeout)
        }
        longTapTimeout = null
    }
    function cancelAll() {
        if (touchTimeout) {
            clearTimeout(touchTimeout)
        }
        if (tapTimeout) {
            clearTimeout(tapTimeout)
        }
        if (swipeTimeout) {
            clearTimeout(swipeTimeout)
        }
        if (longTapTimeout) {
            clearTimeout(longTapTimeout)
        }
        touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null;
        touch = {}
    }
    function isPrimaryTouch(event) {
        return (event.pointerType == 'touch' || event.pointerType == event.MSPOINTER_TYPE_TOUCH) && event.isPrimary
    }
    function isPointerEventType(e, type) {
        return (e.type == 'pointer' + type || e.type.toLowerCase() == 'mspointer' + type)
    }
    $(document).ready(function() {
        var now, delta, deltaX = 0,
        deltaY = 0,
        firstTouch, _isPointerType;
        if ('MSGesture' in window) {
            gesture = new MSGesture();
            gesture.target = document.body
        }
        $(document).bind('MSGestureEnd',
        function(e) {
            var swipeDirectionFromVelocity = e.velocityX > 1 ? 'Right': e.velocityX < -1 ? 'Left': e.velocityY > 1 ? 'Down': e.velocityY < -1 ? 'Up': null;
            if (swipeDirectionFromVelocity) {
                touch.el.trigger('swipe');
                touch.el.trigger('swipe' + swipeDirectionFromVelocity)
            }
        }).on('touchstart MSPointerDown pointerdown',
        function(e) {
            if ((_isPointerType = isPointerEventType(e, 'down')) && !isPrimaryTouch(e)) {
                return
            }
            firstTouch = _isPointerType ? e: e.touches[0];
            if (e.touches && e.touches.length === 1 && touch.x2) {
                touch.x2 = undefined;
                touch.y2 = undefined
            }
            now = Date.now();
            delta = now - (touch.last || now);
            touch.el = $('tagName' in firstTouch.target ? firstTouch.target: firstTouch.target.parentNode);
            touchTimeout && clearTimeout(touchTimeout);
            touch.x1 = firstTouch.pageX;
            touch.y1 = firstTouch.pageY;
            if (delta > 0 && delta <= 250) {
                touch.isDoubleTap = true
            }
            touch.last = now;
            longTapTimeout = setTimeout(longTap, longTapDelay);
            if (gesture && _isPointerType) {
                gesture.addPointer(e.pointerId)
            }
        }).on('touchmove MSPointerMove pointermove',
        function(e) {
            if ((_isPointerType = isPointerEventType(e, 'move')) && !isPrimaryTouch(e)) {
                return
            }
            firstTouch = _isPointerType ? e: e.touches[0];
            cancelLongTap();
            touch.x2 = firstTouch.pageX;
            touch.y2 = firstTouch.pageY;
            deltaX += Math.abs(touch.x1 - touch.x2);
            deltaY += Math.abs(touch.y1 - touch.y2)
        }).on('touchend MSPointerUp pointerup',
        function(e) {
            if ((_isPointerType = isPointerEventType(e, 'up')) && !isPrimaryTouch(e)) {
                return
            }
            cancelLongTap();
            if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) || (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)) {
                swipeTimeout = setTimeout(function() {
                    touch.el.trigger('swipe');
                    touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
                    touch = {}
                },
                0)
            } else if ('last' in touch) {
                if (deltaX < 30 && deltaY < 30) {
                    tapTimeout = setTimeout(function() {
                        var event = $.Event('tap');
                        event.cancelTouch = cancelAll;
                        touch.el.trigger(event);
                        if (touch.isDoubleTap) {
                            if (touch.el) {
                                touch.el.trigger('doubleTap')
                            }
                            touch = {}
                        } else {
                            touchTimeout = setTimeout(function() {
                                touchTimeout = null;
                                if (touch.el) {
                                    touch.el.trigger('singleTap')
                                }
                                touch = {}
                            },
                            250)
                        }
                    },
                    0)
                } else {
                    touch = {}
                }
                deltaX = deltaY = 0
            }
        }).on('touchcancel MSPointerCancel pointercancel', cancelAll);
        $(window).on('scroll', cancelAll)
    }); ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(eventName) {
        $.fn[eventName] = function(callback) {
            return this.on(eventName, callback)
        }
    })
})(Zepto);
!
function() {
    function a(a) {
        return a.replace(t, "").replace(u, ",").replace(v, "").replace(w, "").replace(x, "").split(y)
    }
    function b(a) {
        return "'" + a.replace(/('|\\)/g, "\\$1").replace(/\r/g, "\\r").replace(/\n/g, "\\n") + "'"
    }
    function c(c, d) {
        function e(a) {
            return m += a.split(/\n/).length - 1,
            k && (a = a.replace(/\s+/g, " ").replace(/<!--[\w\W]*?-->/g, "")),
            a && (a = s[1] + b(a) + s[2] + "\n"),
            a
        }
        function f(b) {
            var c = m;
            if (j ? b = j(b, d) : g && (b = b.replace(/\n/g,
            function() {
                return m++,
                "$line=" + m + ";"
            })), 0 === b.indexOf("=")) {
                var e = l && !/^=[=#]/.test(b);
                if (b = b.replace(/^=[=#]?|[\s;]*$/g, ""), e) {
                    var f = b.replace(/\s*\([^\)]+\)/, "");
                    n[f] || /^(include|print)$/.test(f) || (b = "$escape(" + b + ")")
                } else b = "$string(" + b + ")";
                b = s[1] + b + s[2]
            }
            return g && (b = "$line=" + c + ";" + b),
            r(a(b),
            function(a) {
                if (a && !p[a]) {
                    var b;
                    b = "print" === a ? u: "include" === a ? v: n[a] ? "$utils." + a: o[a] ? "$helpers." + a: "$data." + a,
                    w += a + "=" + b + ",",
                    p[a] = !0
                }
            }),
            b + "\n"
        }
        var g = d.debug,
        h = d.openTag,
        i = d.closeTag,
        j = d.parser,
        k = d.compress,
        l = d.escape,
        m = 1,
        p = {
            $data: 1,
            $filename: 1,
            $utils: 1,
            $helpers: 1,
            $out: 1,
            $line: 1
        },
        q = "".trim,
        s = q ? ["$out='';", "$out+=", ";", "$out"] : ["$out=[];", "$out.push(", ");", "$out.join('')"],
        t = q ? "$out+=text;return $out;": "$out.push(text);",
        u = "function(){var text=''.concat.apply('',arguments);" + t + "}",
        v = "function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);" + t + "}",
        w = "'use strict';var $utils=this,$helpers=$utils.$helpers," + (g ? "$line=0,": ""),
        x = s[0],
        y = "return new String(" + s[3] + ");";
        r(c.split(h),
        function(a) {
            a = a.split(i);
            var b = a[0],
            c = a[1];
            1 === a.length ? x += e(b) : (x += f(b), c && (x += e(c)))
        });
        var z = w + x + y;
        g && (z = "try{" + z + "}catch(e){throw {filename:$filename,name:'Render Error',message:e.message,line:$line,source:" + b(c) + ".split(/\\n/)[$line-1].replace(/^\\s+/,'')};}");
        try {
            var A = new Function("$data", "$filename", z);
            return A.prototype = n,
            A
        } catch(B) {
            throw B.temp = "function anonymous($data,$filename) {" + z + "}",
            B
        }
    }
    var d = function(a, b) {
        return "string" == typeof b ? q(b, {
            filename: a
        }) : g(a, b)
    };
    d.version = "3.0.0",
    d.config = function(a, b) {
        e[a] = b
    };
    var e = d.defaults = {
        openTag: "<%",
        closeTag: "%>",
        escape: !0,
        cache: !0,
        compress: !1,
        parser: null
    },
    f = d.cache = {};
    d.render = function(a, b) {
        return q(a, b)
    };
    var g = d.renderFile = function(a, b) {
        var c = d.get(a) || p({
            filename: a,
            name: "Render Error",
            message: "Template not found"
        });
        return b ? c(b) : c
    };
    d.get = function(a) {
        var b;
        if (f[a]) b = f[a];
        else if ("object" == typeof document) {
            var c = document.getElementById(a);
            if (c) {
                var d = (c.value || c.innerHTML).replace(/^\s*|\s*$/g, "");
                b = q(d, {
                    filename: a
                })
            }
        }
        return b
    };
    var h = function(a, b) {
        return "string" != typeof a && (b = typeof a, "number" === b ? a += "": a = "function" === b ? h(a.call(a)) : ""),
        a
    },
    i = {
        "<": "&#60;",
        ">": "&#62;",
        '"': "&#34;",
        "'": "&#39;",
        "&": "&#38;"
    },
    j = function(a) {
        return i[a]
    },
    k = function(a) {
        return h(a).replace(/&(?![\w#]+;)|[<>"']/g, j)
    },
    l = Array.isArray ||
    function(a) {
        return "[object Array]" === {}.toString.call(a)
    },
    m = function(a, b) {
        var c, d;
        if (l(a)) for (c = 0, d = a.length; d > c; c++) b.call(a, a[c], c, a);
        else for (c in a) b.call(a, a[c], c)
    },
    n = d.utils = {
        $helpers: {},
        $include: g,
        $string: h,
        $escape: k,
        $each: m
    };
    d.helper = function(a, b) {
        o[a] = b
    };
    var o = d.helpers = n.$helpers;
    d.onerror = function(a) {
        var b = "Template Error\n\n";
        for (var c in a) b += "<" + c + ">\n" + a[c] + "\n\n";
        "object" == typeof console && console.error(b)
    };
    var p = function(a) {
        return d.onerror(a),
        function() {
            return "{Template Error}"
        }
    },
    q = d.compile = function(a, b) {
        function d(c) {
            try {
                return new i(c, h) + ""
            } catch(d) {
                return b.debug ? p(d)() : (b.debug = !0, q(a, b)(c))
            }
        }
        b = b || {};
        for (var g in e) void 0 === b[g] && (b[g] = e[g]);
        var h = b.filename;
        try {
            var i = c(a, b)
        } catch(j) {
            return j.filename = h || "anonymous",
            j.name = "Syntax Error",
            p(j)
        }
        return d.prototype = i.prototype,
        d.toString = function() {
            return i.toString()
        },
        h && b.cache && (f[h] = d),
        d
    },
    r = n.$each,
    s = "break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined",
    t = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g,
    u = /[^\w$]+/g,
    v = new RegExp(["\\b" + s.replace(/,/g, "\\b|\\b") + "\\b"].join("|"), "g"),
    w = /^\d[^,]*|,\d[^,]*/g,
    x = /^,+|,+$/g,
    y = /^$|,+/;
    e.openTag = "{{",
    e.closeTag = "}}";
    var z = function(a, b) {
        var c = b.split(":"),
        d = c.shift(),
        e = c.join(":") || "";
        return e && (e = ", " + e),
        "$helpers." + d + "(" + a + e + ")"
    };
    e.parser = function(a) {
        a = a.replace(/^\s/, "");
        var b = a.split(" "),
        c = b.shift(),
        e = b.join(" ");
        switch (c) {
        case "if":
            a = "if(" + e + "){";
            break;
        case "else":
            b = "if" === b.shift() ? " if(" + b.join(" ") + ")": "",
            a = "}else" + b + "{";
            break;
        case "/if":
            a = "}";
            break;
        case "each":
            var f = b[0] || "$data",
            g = b[1] || "as",
            h = b[2] || "$value",
            i = b[3] || "$index",
            j = h + "," + i;
            "as" !== g && (f = "[]"),
            a = "$each(" + f + ",function(" + j + "){";
            break;
        case "/each":
            a = "});";
            break;
        case "echo":
            a = "print(" + e + ");";
            break;
        case "print":
        case "include":
            a = c + "(" + b.join(",") + ");";
            break;
        default:
            if (/^\s*\|\s*[\w\$]/.test(e)) {
                var k = !0;
                0 === a.indexOf("#") && (a = a.substr(1), k = !1);
                for (var l = 0,
                m = a.split("|"), n = m.length, o = m[l++]; n > l; l++) o = z(o, m[l]);
                a = (k ? "=": "=#") + o
            } else a = d.helpers[c] ? "=#" + c + "(" + b.join(",") + ");": "=" + a
        }
        return a
    },
    "function" == typeof define ? define(function() {
        return d
    }) : "undefined" != typeof exports ? module.exports = d: this.template = d
} ();

!
function(a, b, c, d) {
    "use strict";
    function e(a, b, c) {
        return setTimeout(k(a, c), b)
    }
    function f(a, b, c) {
        return Array.isArray(a) ? (g(a, c[b], c), !0) : !1
    }
    function g(a, b, c) {
        var e;
        if (a) if (a.forEach) a.forEach(b, c);
        else if (a.length !== d) for (e = 0; e < a.length;) b.call(c, a[e], e, a),
        e++;
        else for (e in a) a.hasOwnProperty(e) && b.call(c, a[e], e, a)
    }
    function h(a, b, c) {
        for (var e = Object.keys(b), f = 0; f < e.length;)(!c || c && a[e[f]] === d) && (a[e[f]] = b[e[f]]),
        f++;
        return a
    }
    function i(a, b) {
        return h(a, b, !0)
    }
    function j(a, b, c) {
        var d, e = b.prototype;
        d = a.prototype = Object.create(e),
        d.constructor = a,
        d._super = e,
        c && h(d, c)
    }
    function k(a, b) {
        return function() {
            return a.apply(b, arguments)
        }
    }
    function l(a, b) {
        return typeof a == kb ? a.apply(b ? b[0] || d: d, b) : a
    }
    function m(a, b) {
        return a === d ? b: a
    }
    function n(a, b, c) {
        g(r(b),
        function(b) {
            a.addEventListener(b, c, !1)
        })
    }
    function o(a, b, c) {
        g(r(b),
        function(b) {
            a.removeEventListener(b, c, !1)
        })
    }
    function p(a, b) {
        for (; a;) {
            if (a == b) return ! 0;
            a = a.parentNode
        }
        return ! 1
    }
    function q(a, b) {
        return a.indexOf(b) > -1
    }
    function r(a) {
        return a.trim().split(/\s+/g)
    }
    function s(a, b, c) {
        if (a.indexOf && !c) return a.indexOf(b);
        for (var d = 0; d < a.length;) {
            if (c && a[d][c] == b || !c && a[d] === b) return d;
            d++
        }
        return - 1
    }
    function t(a) {
        return Array.prototype.slice.call(a, 0)
    }
    function u(a, b, c) {
        for (var d = [], e = [], f = 0; f < a.length;) {
            var g = b ? a[f][b] : a[f];
            s(e, g) < 0 && d.push(a[f]),
            e[f] = g,
            f++
        }
        return c && (d = b ? d.sort(function(a, c) {
            return a[b] > c[b]
        }) : d.sort()),
        d
    }
    function v(a, b) {
        for (var c, e, f = b[0].toUpperCase() + b.slice(1), g = 0; g < ib.length;) {
            if (c = ib[g], e = c ? c + f: b, e in a) return e;
            g++
        }
        return d
    }
    function w() {
        return ob++
    }
    function x(a) {
        var b = a.ownerDocument;
        return b.defaultView || b.parentWindow
    }
    function y(a, b) {
        var c = this;
        this.manager = a,
        this.callback = b,
        this.element = a.element,
        this.target = a.options.inputTarget,
        this.domHandler = function(b) {
            l(a.options.enable, [a]) && c.handler(b)
        },
        this.init()
    }
    function z(a) {
        var b, c = a.options.inputClass;
        return new(b = c ? c: rb ? N: sb ? Q: qb ? S: M)(a, A)
    }
    function A(a, b, c) {
        var d = c.pointers.length,
        e = c.changedPointers.length,
        f = b & yb && d - e === 0,
        g = b & (Ab | Bb) && d - e === 0;
        c.isFirst = !!f,
        c.isFinal = !!g,
        f && (a.session = {}),
        c.eventType = b,
        B(a, c),
        a.emit("hammer.input", c),
        a.recognize(c),
        a.session.prevInput = c
    }
    function B(a, b) {
        var c = a.session,
        d = b.pointers,
        e = d.length;
        c.firstInput || (c.firstInput = E(b)),
        e > 1 && !c.firstMultiple ? c.firstMultiple = E(b) : 1 === e && (c.firstMultiple = !1);
        var f = c.firstInput,
        g = c.firstMultiple,
        h = g ? g.center: f.center,
        i = b.center = F(d);
        b.timeStamp = nb(),
        b.deltaTime = b.timeStamp - f.timeStamp,
        b.angle = J(h, i),
        b.distance = I(h, i),
        C(c, b),
        b.offsetDirection = H(b.deltaX, b.deltaY),
        b.scale = g ? L(g.pointers, d) : 1,
        b.rotation = g ? K(g.pointers, d) : 0,
        D(c, b);
        var j = a.element;
        p(b.srcEvent.target, j) && (j = b.srcEvent.target),
        b.target = j
    }
    function C(a, b) {
        var c = b.center,
        d = a.offsetDelta || {},
        e = a.prevDelta || {},
        f = a.prevInput || {}; (b.eventType === yb || f.eventType === Ab) && (e = a.prevDelta = {
            x: f.deltaX || 0,
            y: f.deltaY || 0
        },
        d = a.offsetDelta = {
            x: c.x,
            y: c.y
        }),
        b.deltaX = e.x + (c.x - d.x),
        b.deltaY = e.y + (c.y - d.y)
    }
    function D(a, b) {
        var c, e, f, g, h = a.lastInterval || b,
        i = b.timeStamp - h.timeStamp;
        if (b.eventType != Bb && (i > xb || h.velocity === d)) {
            var j = h.deltaX - b.deltaX,
            k = h.deltaY - b.deltaY,
            l = G(i, j, k);
            e = l.x,
            f = l.y,
            c = mb(l.x) > mb(l.y) ? l.x: l.y,
            g = H(j, k),
            a.lastInterval = b
        } else c = h.velocity,
        e = h.velocityX,
        f = h.velocityY,
        g = h.direction;
        b.velocity = c,
        b.velocityX = e,
        b.velocityY = f,
        b.direction = g
    }
    function E(a) {
        for (var b = [], c = 0; c < a.pointers.length;) b[c] = {
            clientX: lb(a.pointers[c].clientX),
            clientY: lb(a.pointers[c].clientY)
        },
        c++;
        return {
            timeStamp: nb(),
            pointers: b,
            center: F(b),
            deltaX: a.deltaX,
            deltaY: a.deltaY
        }
    }
    function F(a) {
        var b = a.length;
        if (1 === b) return {
            x: lb(a[0].clientX),
            y: lb(a[0].clientY)
        };
        for (var c = 0,
        d = 0,
        e = 0; b > e;) c += a[e].clientX,
        d += a[e].clientY,
        e++;
        return {
            x: lb(c / b),
            y: lb(d / b)
        }
    }
    function G(a, b, c) {
        return {
            x: b / a || 0,
            y: c / a || 0
        }
    }
    function H(a, b) {
        return a === b ? Cb: mb(a) >= mb(b) ? a > 0 ? Db: Eb: b > 0 ? Fb: Gb
    }
    function I(a, b, c) {
        c || (c = Kb);
        var d = b[c[0]] - a[c[0]],
        e = b[c[1]] - a[c[1]];
        return Math.sqrt(d * d + e * e)
    }
    function J(a, b, c) {
        c || (c = Kb);
        var d = b[c[0]] - a[c[0]],
        e = b[c[1]] - a[c[1]];
        return 180 * Math.atan2(e, d) / Math.PI
    }
    function K(a, b) {
        return J(b[1], b[0], Lb) - J(a[1], a[0], Lb)
    }
    function L(a, b) {
        return I(b[0], b[1], Lb) / I(a[0], a[1], Lb)
    }
    function M() {
        this.evEl = Nb,
        this.evWin = Ob,
        this.allow = !0,
        this.pressed = !1,
        y.apply(this, arguments)
    }
    function N() {
        this.evEl = Rb,
        this.evWin = Sb,
        y.apply(this, arguments),
        this.store = this.manager.session.pointerEvents = []
    }
    function O() {
        this.evTarget = Ub,
        this.evWin = Vb,
        this.started = !1,
        y.apply(this, arguments)
    }
    function P(a, b) {
        var c = t(a.touches),
        d = t(a.changedTouches);
        return b & (Ab | Bb) && (c = u(c.concat(d), "identifier", !0)),
        [c, d]
    }
    function Q() {
        this.evTarget = Xb,
        this.targetIds = {},
        y.apply(this, arguments)
    }
    function R(a, b) {
        var c = t(a.touches),
        d = this.targetIds;
        if (b & (yb | zb) && 1 === c.length) return d[c[0].identifier] = !0,
        [c, c];
        var e, f, g = t(a.changedTouches),
        h = [],
        i = this.target;
        if (f = c.filter(function(a) {
            return p(a.target, i)
        }), b === yb) for (e = 0; e < f.length;) d[f[e].identifier] = !0,
        e++;
        for (e = 0; e < g.length;) d[g[e].identifier] && h.push(g[e]),
        b & (Ab | Bb) && delete d[g[e].identifier],
        e++;
        return h.length ? [u(f.concat(h), "identifier", !0), h] : void 0
    }
    function S() {
        y.apply(this, arguments);
        var a = k(this.handler, this);
        this.touch = new Q(this.manager, a),
        this.mouse = new M(this.manager, a)
    }
    function T(a, b) {
        this.manager = a,
        this.set(b)
    }
    function U(a) {
        if (q(a, bc)) return bc;
        var b = q(a, cc),
        c = q(a, dc);
        return b && c ? cc + " " + dc: b || c ? b ? cc: dc: q(a, ac) ? ac: _b
    }
    function V(a) {
        this.id = w(),
        this.manager = null,
        this.options = i(a || {},
        this.defaults),
        this.options.enable = m(this.options.enable, !0),
        this.state = ec,
        this.simultaneous = {},
        this.requireFail = []
    }
    function W(a) {
        return a & jc ? "cancel": a & hc ? "end": a & gc ? "move": a & fc ? "start": ""
    }
    function X(a) {
        return a == Gb ? "down": a == Fb ? "up": a == Db ? "left": a == Eb ? "right": ""
    }
    function Y(a, b) {
        var c = b.manager;
        return c ? c.get(a) : a
    }
    function Z() {
        V.apply(this, arguments)
    }
    function $() {
        Z.apply(this, arguments),
        this.pX = null,
        this.pY = null
    }
    function _() {
        Z.apply(this, arguments)
    }
    function ab() {
        V.apply(this, arguments),
        this._timer = null,
        this._input = null
    }
    function bb() {
        Z.apply(this, arguments)
    }
    function cb() {
        Z.apply(this, arguments)
    }
    function db() {
        V.apply(this, arguments),
        this.pTime = !1,
        this.pCenter = !1,
        this._timer = null,
        this._input = null,
        this.count = 0
    }
    function eb(a, b) {
        return b = b || {},
        b.recognizers = m(b.recognizers, eb.defaults.preset),
        new fb(a, b)
    }
    function fb(a, b) {
        b = b || {},
        this.options = i(b, eb.defaults),
        this.options.inputTarget = this.options.inputTarget || a,
        this.handlers = {},
        this.session = {},
        this.recognizers = [],
        this.element = a,
        this.input = z(this),
        this.touchAction = new T(this, this.options.touchAction),
        gb(this, !0),
        g(b.recognizers,
        function(a) {
            var b = this.add(new a[0](a[1]));
            a[2] && b.recognizeWith(a[2]),
            a[3] && b.requireFailure(a[3])
        },
        this)
    }
    function gb(a, b) {
        var c = a.element;
        g(a.options.cssProps,
        function(a, d) {
            c.style[v(c.style, d)] = b ? a: ""
        })
    }
    function hb(a, c) {
        var d = b.createEvent("Event");
        d.initEvent(a, !0, !0),
        d.gesture = c,
        c.target.dispatchEvent(d)
    }
    var ib = ["", "webkit", "moz", "MS", "ms", "o"],
    jb = b.createElement("div"),
    kb = "function",
    lb = Math.round,
    mb = Math.abs,
    nb = Date.now,
    ob = 1,
    pb = /mobile|tablet|ip(ad|hone|od)|android/i,
    qb = "ontouchstart" in a,
    rb = v(a, "PointerEvent") !== d,
    sb = qb && pb.test(navigator.userAgent),
    tb = "touch",
    ub = "pen",
    vb = "mouse",
    wb = "kinect",
    xb = 25,
    yb = 1,
    zb = 2,
    Ab = 4,
    Bb = 8,
    Cb = 1,
    Db = 2,
    Eb = 4,
    Fb = 8,
    Gb = 16,
    Hb = Db | Eb,
    Ib = Fb | Gb,
    Jb = Hb | Ib,
    Kb = ["x", "y"],
    Lb = ["clientX", "clientY"];
    y.prototype = {
        handler: function() {},
        init: function() {
            this.evEl && n(this.element, this.evEl, this.domHandler),
            this.evTarget && n(this.target, this.evTarget, this.domHandler),
            this.evWin && n(x(this.element), this.evWin, this.domHandler)
        },
        destroy: function() {
            this.evEl && o(this.element, this.evEl, this.domHandler),
            this.evTarget && o(this.target, this.evTarget, this.domHandler),
            this.evWin && o(x(this.element), this.evWin, this.domHandler)
        }
    };
    var Mb = {
        mousedown: yb,
        mousemove: zb,
        mouseup: Ab
    },
    Nb = "mousedown",
    Ob = "mousemove mouseup";
    j(M, y, {
        handler: function(a) {
            var b = Mb[a.type];
            b & yb && 0 === a.button && (this.pressed = !0),
            b & zb && 1 !== a.which && (b = Ab),
            this.pressed && this.allow && (b & Ab && (this.pressed = !1), this.callback(this.manager, b, {
                pointers: [a],
                changedPointers: [a],
                pointerType: vb,
                srcEvent: a
            }))
        }
    });
    var Pb = {
        pointerdown: yb,
        pointermove: zb,
        pointerup: Ab,
        pointercancel: Bb,
        pointerout: Bb
    },
    Qb = {
        2 : tb,
        3 : ub,
        4 : vb,
        5 : wb
    },
    Rb = "pointerdown",
    Sb = "pointermove pointerup pointercancel";
    a.MSPointerEvent && (Rb = "MSPointerDown", Sb = "MSPointerMove MSPointerUp MSPointerCancel"),
    j(N, y, {
        handler: function(a) {
            var b = this.store,
            c = !1,
            d = a.type.toLowerCase().replace("ms", ""),
            e = Pb[d],
            f = Qb[a.pointerType] || a.pointerType,
            g = f == tb,
            h = s(b, a.pointerId, "pointerId");
            e & yb && (0 === a.button || g) ? 0 > h && (b.push(a), h = b.length - 1) : e & (Ab | Bb) && (c = !0),
            0 > h || (b[h] = a, this.callback(this.manager, e, {
                pointers: b,
                changedPointers: [a],
                pointerType: f,
                srcEvent: a
            }), c && b.splice(h, 1))
        }
    });
    var Tb = {
        touchstart: yb,
        touchmove: zb,
        touchend: Ab,
        touchcancel: Bb
    },
    Ub = "touchstart",
    Vb = "touchstart touchmove touchend touchcancel";
    j(O, y, {
        handler: function(a) {
            var b = Tb[a.type];
            if (b === yb && (this.started = !0), this.started) {
                var c = P.call(this, a, b);
                b & (Ab | Bb) && c[0].length - c[1].length === 0 && (this.started = !1),
                this.callback(this.manager, b, {
                    pointers: c[0],
                    changedPointers: c[1],
                    pointerType: tb,
                    srcEvent: a
                })
            }
        }
    });
    var Wb = {
        touchstart: yb,
        touchmove: zb,
        touchend: Ab,
        touchcancel: Bb
    },
    Xb = "touchstart touchmove touchend touchcancel";
    j(Q, y, {
        handler: function(a) {
            var b = Wb[a.type],
            c = R.call(this, a, b);
            c && this.callback(this.manager, b, {
                pointers: c[0],
                changedPointers: c[1],
                pointerType: tb,
                srcEvent: a
            })
        }
    }),
    j(S, y, {
        handler: function(a, b, c) {
            var d = c.pointerType == tb,
            e = c.pointerType == vb;
            if (d) this.mouse.allow = !1;
            else if (e && !this.mouse.allow) return;
            b & (Ab | Bb) && (this.mouse.allow = !0),
            this.callback(a, b, c)
        },
        destroy: function() {
            this.touch.destroy(),
            this.mouse.destroy()
        }
    });
    var Yb = v(jb.style, "touchAction"),
    Zb = Yb !== d,
    $b = "compute",
    _b = "auto",
    ac = "manipulation",
    bc = "none",
    cc = "pan-x",
    dc = "pan-y";
    T.prototype = {
        set: function(a) {
            a == $b && (a = this.compute()),
            Zb && (this.manager.element.style[Yb] = a),
            this.actions = a.toLowerCase().trim()
        },
        update: function() {
            this.set(this.manager.options.touchAction)
        },
        compute: function() {
            var a = [];
            return g(this.manager.recognizers,
            function(b) {
                l(b.options.enable, [b]) && (a = a.concat(b.getTouchAction()))
            }),
            U(a.join(" "))
        },
        preventDefaults: function(a) {
            if (!Zb) {
                var b = a.srcEvent,
                c = a.offsetDirection;
                if (this.manager.session.prevented) return void b.preventDefault();
                var d = this.actions,
                e = q(d, bc),
                f = q(d, dc),
                g = q(d, cc);
                return e || f && c & Hb || g && c & Ib ? this.preventSrc(b) : void 0
            }
        },
        preventSrc: function(a) {
            this.manager.session.prevented = !0,
            a.preventDefault()
        }
    };
    var ec = 1,
    fc = 2,
    gc = 4,
    hc = 8,
    ic = hc,
    jc = 16,
    kc = 32;
    V.prototype = {
        defaults: {},
        set: function(a) {
            return h(this.options, a),
            this.manager && this.manager.touchAction.update(),
            this
        },
        recognizeWith: function(a) {
            if (f(a, "recognizeWith", this)) return this;
            var b = this.simultaneous;
            return a = Y(a, this),
            b[a.id] || (b[a.id] = a, a.recognizeWith(this)),
            this
        },
        dropRecognizeWith: function(a) {
            return f(a, "dropRecognizeWith", this) ? this: (a = Y(a, this), delete this.simultaneous[a.id], this)
        },
        requireFailure: function(a) {
            if (f(a, "requireFailure", this)) return this;
            var b = this.requireFail;
            return a = Y(a, this),
            -1 === s(b, a) && (b.push(a), a.requireFailure(this)),
            this
        },
        dropRequireFailure: function(a) {
            if (f(a, "dropRequireFailure", this)) return this;
            a = Y(a, this);
            var b = s(this.requireFail, a);
            return b > -1 && this.requireFail.splice(b, 1),
            this
        },
        hasRequireFailures: function() {
            return this.requireFail.length > 0
        },
        canRecognizeWith: function(a) {
            return !! this.simultaneous[a.id]
        },
        emit: function(a) {
            function b(b) {
                c.manager.emit(c.options.event + (b ? W(d) : ""), a)
            }
            var c = this,
            d = this.state;
            hc > d && b(!0),
            b(),
            d >= hc && b(!0)
        },
        tryEmit: function(a) {
            return this.canEmit() ? this.emit(a) : void(this.state = kc)
        },
        canEmit: function() {
            for (var a = 0; a < this.requireFail.length;) {
                if (! (this.requireFail[a].state & (kc | ec))) return ! 1;
                a++
            }
            return ! 0
        },
        recognize: function(a) {
            var b = h({},
            a);
            return l(this.options.enable, [this, b]) ? (this.state & (ic | jc | kc) && (this.state = ec), this.state = this.process(b), void(this.state & (fc | gc | hc | jc) && this.tryEmit(b))) : (this.reset(), void(this.state = kc))
        },
        process: function() {},
        getTouchAction: function() {},
        reset: function() {}
    },
    j(Z, V, {
        defaults: {
            pointers: 1
        },
        attrTest: function(a) {
            var b = this.options.pointers;
            return 0 === b || a.pointers.length === b
        },
        process: function(a) {
            var b = this.state,
            c = a.eventType,
            d = b & (fc | gc),
            e = this.attrTest(a);
            return d && (c & Bb || !e) ? b | jc: d || e ? c & Ab ? b | hc: b & fc ? b | gc: fc: kc
        }
    }),
    j($, Z, {
        defaults: {
            event: "pan",
            threshold: 10,
            pointers: 1,
            direction: Jb
        },
        getTouchAction: function() {
            var a = this.options.direction,
            b = [];
            return a & Hb && b.push(dc),
            a & Ib && b.push(cc),
            b
        },
        directionTest: function(a) {
            var b = this.options,
            c = !0,
            d = a.distance,
            e = a.direction,
            f = a.deltaX,
            g = a.deltaY;
            return e & b.direction || (b.direction & Hb ? (e = 0 === f ? Cb: 0 > f ? Db: Eb, c = f != this.pX, d = Math.abs(a.deltaX)) : (e = 0 === g ? Cb: 0 > g ? Fb: Gb, c = g != this.pY, d = Math.abs(a.deltaY))),
            a.direction = e,
            c && d > b.threshold && e & b.direction
        },
        attrTest: function(a) {
            return Z.prototype.attrTest.call(this, a) && (this.state & fc || !(this.state & fc) && this.directionTest(a))
        },
        emit: function(a) {
            this.pX = a.deltaX,
            this.pY = a.deltaY;
            var b = X(a.direction);
            b && this.manager.emit(this.options.event + b, a),
            this._super.emit.call(this, a)
        }
    }),
    j(_, Z, {
        defaults: {
            event: "pinch",
            threshold: 0,
            pointers: 2
        },
        getTouchAction: function() {
            return [bc]
        },
        attrTest: function(a) {
            return this._super.attrTest.call(this, a) && (Math.abs(a.scale - 1) > this.options.threshold || this.state & fc)
        },
        emit: function(a) {
            if (this._super.emit.call(this, a), 1 !== a.scale) {
                var b = a.scale < 1 ? "in": "out";
                this.manager.emit(this.options.event + b, a)
            }
        }
    }),
    j(ab, V, {
        defaults: {
            event: "press",
            pointers: 1,
            time: 500,
            threshold: 5
        },
        getTouchAction: function() {
            return [_b]
        },
        process: function(a) {
            var b = this.options,
            c = a.pointers.length === b.pointers,
            d = a.distance < b.threshold,
            f = a.deltaTime > b.time;
            if (this._input = a, !d || !c || a.eventType & (Ab | Bb) && !f) this.reset();
            else if (a.eventType & yb) this.reset(),
            this._timer = e(function() {
                this.state = ic,
                this.tryEmit()
            },
            b.time, this);
            else if (a.eventType & Ab) return ic;
            return kc
        },
        reset: function() {
            clearTimeout(this._timer)
        },
        emit: function(a) {
            this.state === ic && (a && a.eventType & Ab ? this.manager.emit(this.options.event + "up", a) : (this._input.timeStamp = nb(), this.manager.emit(this.options.event, this._input)))
        }
    }),
    j(bb, Z, {
        defaults: {
            event: "rotate",
            threshold: 0,
            pointers: 2
        },
        getTouchAction: function() {
            return [bc]
        },
        attrTest: function(a) {
            return this._super.attrTest.call(this, a) && (Math.abs(a.rotation) > this.options.threshold || this.state & fc)
        }
    }),
    j(cb, Z, {
        defaults: {
            event: "swipe",
            threshold: 10,
            velocity: .65,
            direction: Hb | Ib,
            pointers: 1
        },
        getTouchAction: function() {
            return $.prototype.getTouchAction.call(this)
        },
        attrTest: function(a) {
            var b, c = this.options.direction;
            return c & (Hb | Ib) ? b = a.velocity: c & Hb ? b = a.velocityX: c & Ib && (b = a.velocityY),
            this._super.attrTest.call(this, a) && c & a.direction && a.distance > this.options.threshold && mb(b) > this.options.velocity && a.eventType & Ab
        },
        emit: function(a) {
            var b = X(a.direction);
            b && this.manager.emit(this.options.event + b, a),
            this.manager.emit(this.options.event, a)
        }
    }),
    j(db, V, {
        defaults: {
            event: "tap",
            pointers: 1,
            taps: 1,
            interval: 300,
            time: 250,
            threshold: 2,
            posThreshold: 10
        },
        getTouchAction: function() {
            return [ac]
        },
        process: function(a) {
            var b = this.options,
            c = a.pointers.length === b.pointers,
            d = a.distance < b.threshold,
            f = a.deltaTime < b.time;
            if (this.reset(), a.eventType & yb && 0 === this.count) return this.failTimeout();
            if (d && f && c) {
                if (a.eventType != Ab) return this.failTimeout();
                var g = this.pTime ? a.timeStamp - this.pTime < b.interval: !0,
                h = !this.pCenter || I(this.pCenter, a.center) < b.posThreshold;
                this.pTime = a.timeStamp,
                this.pCenter = a.center,
                h && g ? this.count += 1 : this.count = 1,
                this._input = a;
                var i = this.count % b.taps;
                if (0 === i) return this.hasRequireFailures() ? (this._timer = e(function() {
                    this.state = ic,
                    this.tryEmit()
                },
                b.interval, this), fc) : ic
            }
            return kc
        },
        failTimeout: function() {
            return this._timer = e(function() {
                this.state = kc
            },
            this.options.interval, this),
            kc
        },
        reset: function() {
            clearTimeout(this._timer)
        },
        emit: function() {
            this.state == ic && (this._input.tapCount = this.count, this.manager.emit(this.options.event, this._input))
        }
    }),
    eb.VERSION = "2.0.4",
    eb.defaults = {
        domEvents: !1,
        touchAction: $b,
        enable: !0,
        inputTarget: null,
        inputClass: null,
        preset: [[bb, {
            enable: !1
        }], [_, {
            enable: !1
        },
        ["rotate"]], [cb, {
            direction: Hb
        }], [$, {
            direction: Hb
        },
        ["swipe"]], [db], [db, {
            event: "doubletap",
            taps: 2
        },
        ["tap"]], [ab]],
        cssProps: {
            userSelect: "none",
            touchSelect: "none",
            touchCallout: "none",
            contentZooming: "none",
            userDrag: "none",
            tapHighlightColor: "rgba(0,0,0,0)"
        }
    };
    var lc = 1,
    mc = 2;
    fb.prototype = {
        set: function(a) {
            return h(this.options, a),
            a.touchAction && this.touchAction.update(),
            a.inputTarget && (this.input.destroy(), this.input.target = a.inputTarget, this.input.init()),
            this
        },
        stop: function(a) {
            this.session.stopped = a ? mc: lc
        },
        recognize: function(a) {
            var b = this.session;
            if (!b.stopped) {
                this.touchAction.preventDefaults(a);
                var c, d = this.recognizers,
                e = b.curRecognizer; (!e || e && e.state & ic) && (e = b.curRecognizer = null);
                for (var f = 0; f < d.length;) c = d[f],
                b.stopped === mc || e && c != e && !c.canRecognizeWith(e) ? c.reset() : c.recognize(a),
                !e && c.state & (fc | gc | hc) && (e = b.curRecognizer = c),
                f++
            }
        },
        get: function(a) {
            if (a instanceof V) return a;
            for (var b = this.recognizers,
            c = 0; c < b.length; c++) if (b[c].options.event == a) return b[c];
            return null
        },
        add: function(a) {
            if (f(a, "add", this)) return this;
            var b = this.get(a.options.event);
            return b && this.remove(b),
            this.recognizers.push(a),
            a.manager = this,
            this.touchAction.update(),
            a
        },
        remove: function(a) {
            if (f(a, "remove", this)) return this;
            var b = this.recognizers;
            return a = this.get(a),
            b.splice(s(b, a), 1),
            this.touchAction.update(),
            this
        },
        on: function(a, b) {
            var c = this.handlers;
            return g(r(a),
            function(a) {
                c[a] = c[a] || [],
                c[a].push(b)
            }),
            this
        },
        off: function(a, b) {
            var c = this.handlers;
            return g(r(a),
            function(a) {
                b ? c[a].splice(s(c[a], b), 1) : delete c[a]
            }),
            this
        },
        emit: function(a, b) {
            this.options.domEvents && hb(a, b);
            var c = this.handlers[a] && this.handlers[a].slice();
            if (c && c.length) {
                b.type = a,
                b.preventDefault = function() {
                    b.srcEvent.preventDefault()
                };
                for (var d = 0; d < c.length;) c[d](b),
                d++
            }
        },
        destroy: function() {
            this.element && gb(this, !1),
            this.handlers = {},
            this.session = {},
            this.input.destroy(),
            this.element = null
        }
    },
    h(eb, {
        INPUT_START: yb,
        INPUT_MOVE: zb,
        INPUT_END: Ab,
        INPUT_CANCEL: Bb,
        STATE_POSSIBLE: ec,
        STATE_BEGAN: fc,
        STATE_CHANGED: gc,
        STATE_ENDED: hc,
        STATE_RECOGNIZED: ic,
        STATE_CANCELLED: jc,
        STATE_FAILED: kc,
        DIRECTION_NONE: Cb,
        DIRECTION_LEFT: Db,
        DIRECTION_RIGHT: Eb,
        DIRECTION_UP: Fb,
        DIRECTION_DOWN: Gb,
        DIRECTION_HORIZONTAL: Hb,
        DIRECTION_VERTICAL: Ib,
        DIRECTION_ALL: Jb,
        Manager: fb,
        Input: y,
        TouchAction: T,
        TouchInput: Q,
        MouseInput: M,
        PointerEventInput: N,
        TouchMouseInput: S,
        SingleTouchInput: O,
        Recognizer: V,
        AttrRecognizer: Z,
        Tap: db,
        Pan: $,
        Swipe: cb,
        Pinch: _,
        Rotate: bb,
        Press: ab,
        on: n,
        off: o,
        each: g,
        merge: i,
        extend: h,
        inherit: j,
        bindFn: k,
        prefixed: v
    }),
    typeof define == kb && define.amd ? define(function() {
        return eb
    }) : "undefined" != typeof module && module.exports ? module.exports = eb: a[c] = eb
} (window, document, "Hammer");
; (function(window, document, undefined) {
    'use strict';
    var NAME = 'Parallax';
    var MAGIC_NUMBER = 30;
    var DEFAULTS = {
        relativeInput: false,
        clipRelativeInput: false,
        calibrationThreshold: 100,
        calibrationDelay: 500,
        supportDelay: 500,
        calibrateX: false,
        calibrateY: true,
        invertX: true,
        invertY: true,
        limitX: false,
        limitY: false,
        scalarX: 10.0,
        scalarY: 10.0,
        frictionX: 0.1,
        frictionY: 0.1,
        originX: 0.5,
        originY: 0.5
    };
    function Parallax(element, options) {
        this.element = element;
        this.layers = element.getElementsByClassName('layer');
        var data = {
            calibrateX: this.data(this.element, 'calibrate-x'),
            calibrateY: this.data(this.element, 'calibrate-y'),
            invertX: this.data(this.element, 'invert-x'),
            invertY: this.data(this.element, 'invert-y'),
            limitX: this.data(this.element, 'limit-x'),
            limitY: this.data(this.element, 'limit-y'),
            scalarX: this.data(this.element, 'scalar-x'),
            scalarY: this.data(this.element, 'scalar-y'),
            frictionX: this.data(this.element, 'friction-x'),
            frictionY: this.data(this.element, 'friction-y'),
            originX: this.data(this.element, 'origin-x'),
            originY: this.data(this.element, 'origin-y')
        };
        for (var key in data) {
            if (data[key] === null) delete data[key]
        }
        this.extend(this, DEFAULTS, options, data);
        this.calibrationTimer = null;
        this.calibrationFlag = true;
        this.enabled = false;
        this.depths = [];
        this.raf = null;
        this.bounds = null;
        this.ex = 0;
        this.ey = 0;
        this.ew = 0;
        this.eh = 0;
        this.ecx = 0;
        this.ecy = 0;
        this.erx = 0;
        this.ery = 0;
        this.cx = 0;
        this.cy = 0;
        this.ix = 0;
        this.iy = 0;
        this.mx = 0;
        this.my = 0;
        this.vx = 0;
        this.vy = 0;
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onDeviceOrientation = this.onDeviceOrientation.bind(this);
        this.onOrientationTimer = this.onOrientationTimer.bind(this);
        this.onCalibrationTimer = this.onCalibrationTimer.bind(this);
        this.onAnimationFrame = this.onAnimationFrame.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.initialise()
    }
    Parallax.prototype.extend = function() {
        if (arguments.length > 1) {
            var master = arguments[0];
            for (var i = 1,
            l = arguments.length; i < l; i++) {
                var object = arguments[i];
                for (var key in object) {
                    master[key] = object[key]
                }
            }
        }
    };
    Parallax.prototype.data = function(element, name) {
        return this.deserialize(element.getAttribute('data-' + name))
    };
    Parallax.prototype.deserialize = function(value) {
        if (value === "true") {
            return true
        } else if (value === "false") {
            return false
        } else if (value === "null") {
            return null
        } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
            return parseFloat(value)
        } else {
            return value
        }
    };
    Parallax.prototype.camelCase = function(value) {
        return value.replace(/-+(.)?/g,
        function(match, character) {
            return character ? character.toUpperCase() : ''
        })
    };
    Parallax.prototype.transformSupport = function(value) {
        var element = document.createElement('div');
        var propertySupport = false;
        var propertyValue = null;
        var featureSupport = false;
        var cssProperty = null;
        var jsProperty = null;
        for (var i = 0,
        l = this.vendors.length; i < l; i++) {
            if (this.vendors[i] !== null) {
                cssProperty = this.vendors[i][0] + 'transform';
                jsProperty = this.vendors[i][1] + 'Transform'
            } else {
                cssProperty = 'transform';
                jsProperty = 'transform'
            }
            if (element.style[jsProperty] !== undefined) {
                propertySupport = true;
                break
            }
        }
        switch (value) {
        case '2D':
            featureSupport = propertySupport;
            break;
        case '3D':
            if (propertySupport) {
                var body = document.body || document.createElement('body');
                var documentElement = document.documentElement;
                var documentOverflow = documentElement.style.overflow;
                if (!document.body) {
                    documentElement.style.overflow = 'hidden';
                    documentElement.appendChild(body);
                    body.style.overflow = 'hidden';
                    body.style.background = ''
                }
                body.appendChild(element);
                element.style[jsProperty] = 'translate3d(1px,1px,1px)';
                propertyValue = window.getComputedStyle(element).getPropertyValue(cssProperty);
                featureSupport = propertyValue !== undefined && propertyValue.length > 0 && propertyValue !== "none";
                documentElement.style.overflow = documentOverflow;
                body.removeChild(element)
            }
            break
        }
        return featureSupport
    };
    Parallax.prototype.ww = null;
    Parallax.prototype.wh = null;
    Parallax.prototype.wcx = null;
    Parallax.prototype.wcy = null;
    Parallax.prototype.wrx = null;
    Parallax.prototype.wry = null;
    Parallax.prototype.portrait = null;
    Parallax.prototype.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i);
    Parallax.prototype.vendors = [null, ['-webkit-', 'webkit'], ['-moz-', 'Moz'], ['-o-', 'O'], ['-ms-', 'ms']];
    Parallax.prototype.motionSupport = !!window.DeviceMotionEvent;
    Parallax.prototype.orientationSupport = !!window.DeviceOrientationEvent;
    Parallax.prototype.orientationStatus = 0;
    Parallax.prototype.transform2DSupport = Parallax.prototype.transformSupport('2D');
    Parallax.prototype.transform3DSupport = Parallax.prototype.transformSupport('3D');
    Parallax.prototype.propertyCache = {};
    Parallax.prototype.initialise = function() {
        if (this.transform3DSupport) this.accelerate(this.element);
        var style = window.getComputedStyle(this.element);
        if (style.getPropertyValue('position') === 'static') {
            this.element.style.position = 'relative'
        }
        this.updateLayers();
        this.updateDimensions();
        this.enable();
        this.queueCalibration(this.calibrationDelay)
    };
    Parallax.prototype.updateLayers = function() {
        this.layers = this.element.getElementsByClassName('layer');
        this.depths = [];
        for (var i = 0,
        l = this.layers.length; i < l; i++) {
            var layer = this.layers[i];
            if (this.transform3DSupport) this.accelerate(layer);
            layer.style.position = i ? 'absolute': 'relative';
            layer.style.display = 'block';
            layer.style.left = 0;
            layer.style.top = 0;
            this.depths.push(this.data(layer, 'depth') || 0)
        }
    };
    Parallax.prototype.updateDimensions = function() {
        this.ww = window.innerWidth;
        this.wh = window.innerHeight;
        this.wcx = this.ww * this.originX;
        this.wcy = this.wh * this.originY;
        this.wrx = Math.max(this.wcx, this.ww - this.wcx);
        this.wry = Math.max(this.wcy, this.wh - this.wcy)
    };
    Parallax.prototype.updateBounds = function() {
        this.bounds = this.element.getBoundingClientRect();
        this.ex = this.bounds.left;
        this.ey = this.bounds.top;
        this.ew = this.bounds.width;
        this.eh = this.bounds.height;
        this.ecx = this.ew * this.originX;
        this.ecy = this.eh * this.originY;
        this.erx = Math.max(this.ecx, this.ew - this.ecx);
        this.ery = Math.max(this.ecy, this.eh - this.ecy)
    };
    Parallax.prototype.queueCalibration = function(delay) {
        clearTimeout(this.calibrationTimer);
        this.calibrationTimer = setTimeout(this.onCalibrationTimer, delay)
    };
    Parallax.prototype.enable = function() {
        if (!this.enabled) {
            this.enabled = true;
            if (this.orientationSupport) {
                this.portrait = null;
                window.addEventListener('deviceorientation', this.onDeviceOrientation);
                setTimeout(this.onOrientationTimer, this.supportDelay)
            } else {
                this.cx = 0;
                this.cy = 0;
                this.portrait = false;
                window.addEventListener('mousemove', this.onMouseMove)
            }
            window.addEventListener('resize', this.onWindowResize);
            this.raf = requestAnimationFrame(this.onAnimationFrame)
        }
    };
    Parallax.prototype.disable = function() {
        if (this.enabled) {
            this.enabled = false;
            if (this.orientationSupport) {
                window.removeEventListener('deviceorientation', this.onDeviceOrientation)
            } else {
                window.removeEventListener('mousemove', this.onMouseMove)
            }
            window.removeEventListener('resize', this.onWindowResize);
            cancelAnimationFrame(this.raf)
        }
    };
    Parallax.prototype.calibrate = function(x, y) {
        this.calibrateX = x === undefined ? this.calibrateX: x;
        this.calibrateY = y === undefined ? this.calibrateY: y
    };
    Parallax.prototype.invert = function(x, y) {
        this.invertX = x === undefined ? this.invertX: x;
        this.invertY = y === undefined ? this.invertY: y
    };
    Parallax.prototype.friction = function(x, y) {
        this.frictionX = x === undefined ? this.frictionX: x;
        this.frictionY = y === undefined ? this.frictionY: y
    };
    Parallax.prototype.scalar = function(x, y) {
        this.scalarX = x === undefined ? this.scalarX: x;
        this.scalarY = y === undefined ? this.scalarY: y
    };
    Parallax.prototype.limit = function(x, y) {
        this.limitX = x === undefined ? this.limitX: x;
        this.limitY = y === undefined ? this.limitY: y
    };
    Parallax.prototype.origin = function(x, y) {
        this.originX = x === undefined ? this.originX: x;
        this.originY = y === undefined ? this.originY: y
    };
    Parallax.prototype.clamp = function(value, min, max) {
        value = Math.max(value, min);
        value = Math.min(value, max);
        return value
    };
    Parallax.prototype.css = function(element, property, value) {
        var jsProperty = this.propertyCache[property];
        if (!jsProperty) {
            for (var i = 0,
            l = this.vendors.length; i < l; i++) {
                if (this.vendors[i] !== null) {
                    jsProperty = this.camelCase(this.vendors[i][1] + '-' + property)
                } else {
                    jsProperty = property
                }
                if (element.style[jsProperty] !== undefined) {
                    this.propertyCache[property] = jsProperty;
                    break
                }
            }
        }
        element.style[jsProperty] = value
    };
    Parallax.prototype.accelerate = function(element) {
        this.css(element, 'transform', 'translate3d(0,0,0)');
        this.css(element, 'transform-style', 'preserve-3d');
        this.css(element, 'backface-visibility', 'hidden')
    };
    Parallax.prototype.setPosition = function(element, x, y) {
        x += 'px';
        y += 'px';
        if (this.transform3DSupport) {
            this.css(element, 'transform', 'translate3d(' + x + ',' + y + ',0)')
        } else if (this.transform2DSupport) {
            this.css(element, 'transform', 'translate(' + x + ',' + y + ')')
        } else {
            element.style.left = x;
            element.style.top = y
        }
    };
    Parallax.prototype.onOrientationTimer = function(event) {
        if (this.orientationSupport && this.orientationStatus === 0) {
            this.disable();
            this.orientationSupport = false;
            this.enable()
        }
    };
    Parallax.prototype.onCalibrationTimer = function(event) {
        this.calibrationFlag = true
    };
    Parallax.prototype.onWindowResize = function(event) {
        this.updateDimensions()
    };
    Parallax.prototype.onAnimationFrame = function() {
        this.updateBounds();
        var dx = this.ix - this.cx;
        var dy = this.iy - this.cy;
        if ((Math.abs(dx) > this.calibrationThreshold) || (Math.abs(dy) > this.calibrationThreshold)) {
            this.queueCalibration(0)
        }
        if (this.portrait) {
            this.mx = this.calibrateX ? dy: this.iy;
            this.my = this.calibrateY ? dx: this.ix
        } else {
            this.mx = this.calibrateX ? dx: this.ix;
            this.my = this.calibrateY ? dy: this.iy
        }
        this.mx *= this.ew * (this.scalarX / 100);
        this.my *= this.eh * (this.scalarY / 100);
        if (!isNaN(parseFloat(this.limitX))) {
            this.mx = this.clamp(this.mx, -this.limitX, this.limitX)
        }
        if (!isNaN(parseFloat(this.limitY))) {
            this.my = this.clamp(this.my, -this.limitY, this.limitY)
        }
        this.vx += (this.mx - this.vx) * this.frictionX;
        this.vy += (this.my - this.vy) * this.frictionY;
        for (var i = 0,
        l = this.layers.length; i < l; i++) {
            var layer = this.layers[i];
            var depth = this.depths[i];
            var xOffset = this.vx * depth * (this.invertX ? -1 : 1);
            var yOffset = this.vy * depth * (this.invertY ? -1 : 1);
            this.setPosition(layer, xOffset, yOffset)
        }
        this.raf = requestAnimationFrame(this.onAnimationFrame)
    };
    Parallax.prototype.onDeviceOrientation = function(event) {
        if (!this.desktop && event.beta !== null && event.gamma !== null) {
            this.orientationStatus = 1;
            var x = (event.beta || 0) / MAGIC_NUMBER;
            var y = (event.gamma || 0) / MAGIC_NUMBER;
            var portrait = this.wh > this.ww;
            if (this.portrait !== portrait) {
                this.portrait = portrait;
                this.calibrationFlag = true
            }
            if (this.calibrationFlag) {
                this.calibrationFlag = false;
                this.cx = x;
                this.cy = y
            }
            this.ix = x;
            this.iy = y
        }
    };
    Parallax.prototype.onMouseMove = function(event) {
        var clientX = event.clientX;
        var clientY = event.clientY;
        if (!this.orientationSupport && this.relativeInput) {
            if (this.clipRelativeInput) {
                clientX = Math.max(clientX, this.ex);
                clientX = Math.min(clientX, this.ex + this.ew);
                clientY = Math.max(clientY, this.ey);
                clientY = Math.min(clientY, this.ey + this.eh)
            }
            this.ix = (clientX - this.ex - this.ecx) / this.erx;
            this.iy = (clientY - this.ey - this.ecy) / this.ery
        } else {
            this.ix = (clientX - this.wcx) / this.wrx;
            this.iy = (clientY - this.wcy) / this.wry
        }
    };
    window[NAME] = Parallax
})(window, document); (function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame']
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall)
            },
            timeToCall);
            lastTime = currTime + timeToCall;
            return id
        }
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id)
        }
    }
} ());
var PageTransitions = (function() {
    var startPageIndex = 0,
    animEndEventNames = {
        'WebkitAnimation': 'webkitAnimationEnd',
        'OAnimation': 'oAnimationEnd',
        'msAnimation': 'MSAnimationEnd',
        'animation': 'animationend'
    },
    animEndEventName = animEndEventNames[Modernizr.prefixed('animation')],
    support = Modernizr.cssanimations;
    function init(startPageId) {
        $("#wrapper").find('.pt-page').each(function() {
            var $page = $(this);
            $page.data('originalClassList', $page.attr('class'))
        });
        $("#wrapper").each(function() {
            var $wrapperDiv = $(this);
            $wrapperDiv.data('current', startPageId);
            $wrapperDiv.data('isAnimating', false);
            if (startPageId == 0) {
                $wrapperDiv.children('.pt-page').eq(startPageIndex).addClass('pt-page-current')
            } else {
                $wrapperDiv.find("#" + startPageId).addClass('pt-page-current')
            }
        })
    }
    function AnimateGo($pageWrapper, selectedAnimNumber, gotoPage) {
        var inClass, outClass;
        if (selectedAnimNumber < 0 || selectedAnimNumber > 67) {
            selectedAnimNumber = 1
        }
        switch (selectedAnimNumber) {
        case 1:
            inClass = 'pt-page-moveFromRight';
            outClass = 'pt-page-moveToLeft';
            break;
        case 2:
            inClass = 'pt-page-moveFromLeft';
            outClass = 'pt-page-moveToRight';
            break;
        case 3:
            inClass = 'pt-page-moveFromBottom';
            outClass = 'pt-page-moveToTop';
            break;
        case 4:
            inClass = 'pt-page-moveFromTop';
            outClass = 'pt-page-moveToBottom';
            break;
        case 5:
            inClass = 'pt-page-moveFromRight pt-page-ontop';
            outClass = 'pt-page-fade';
            break;
        case 6:
            inClass = 'pt-page-moveFromLeft pt-page-ontop';
            outClass = 'pt-page-fade';
            break;
        case 7:
            inClass = 'pt-page-moveFromBottom pt-page-ontop';
            outClass = 'pt-page-fade';
            break;
        case 8:
            inClass = 'pt-page-moveFromTop pt-page-ontop';
            outClass = 'pt-page-fade';
            break;
        case 9:
            inClass = 'pt-page-moveFromRightFade';
            outClass = 'pt-page-moveToLeftFade';
            break;
        case 10:
            inClass = 'pt-page-moveFromLeftFade';
            outClass = 'pt-page-moveToRightFade';
            break;
        case 11:
            inClass = 'pt-page-moveFromBottomFade';
            outClass = 'pt-page-moveToTopFade';
            break;
        case 12:
            inClass = 'pt-page-moveFromTopFade';
            outClass = 'pt-page-moveToBottomFade';
            break;
        case 13:
            inClass = 'pt-page-moveFromRight';
            outClass = 'pt-page-moveToLeftEasing pt-page-ontop';
            break;
        case 14:
            inClass = 'pt-page-moveFromLeft';
            outClass = 'pt-page-moveToRightEasing pt-page-ontop';
            break;
        case 15:
            inClass = 'pt-page-moveFromBottom';
            outClass = 'pt-page-moveToTopEasing pt-page-ontop';
            break;
        case 16:
            inClass = 'pt-page-moveFromTop';
            outClass = 'pt-page-moveToBottomEasing pt-page-ontop';
            break;
        case 17:
            inClass = 'pt-page-moveFromRight pt-page-ontop';
            outClass = 'pt-page-scaleDown';
            break;
        case 18:
            inClass = 'pt-page-moveFromLeft pt-page-ontop';
            outClass = 'pt-page-scaleDown';
            break;
        case 19:
            inClass = 'pt-page-moveFromBottom pt-page-ontop';
            outClass = 'pt-page-scaleDown';
            break;
        case 20:
            inClass = 'pt-page-moveFromTop pt-page-ontop';
            outClass = 'pt-page-scaleDown';
            break;
        case 21:
            inClass = 'pt-page-scaleUpDown pt-page-delay300';
            outClass = 'pt-page-scaleDown';
            break;
        case 22:
            inClass = 'pt-page-scaleUp pt-page-delay300';
            outClass = 'pt-page-scaleDownUp';
            break;
        case 23:
            inClass = 'pt-page-scaleUp';
            outClass = 'pt-page-moveToLeft pt-page-ontop';
            break;
        case 24:
            inClass = 'pt-page-scaleUp';
            outClass = 'pt-page-moveToRight pt-page-ontop';
            break;
        case 25:
            inClass = 'pt-page-scaleUp';
            outClass = 'pt-page-moveToTop pt-page-ontop';
            break;
        case 26:
            inClass = 'pt-page-scaleUp';
            outClass = 'pt-page-moveToBottom pt-page-ontop';
            break;
        case 27:
            inClass = 'pt-page-scaleUpCenter pt-page-delay400';
            outClass = 'pt-page-scaleDownCenter';
            break;
        case 28:
            inClass = 'pt-page-moveFromRight pt-page-delay200 pt-page-ontop';
            outClass = 'pt-page-rotateRightSideFirst';
            break;
        case 29:
            inClass = 'pt-page-moveFromLeft pt-page-delay200 pt-page-ontop';
            outClass = 'pt-page-rotateLeftSideFirst';
            break;
        case 30:
            inClass = 'pt-page-moveFromTop pt-page-delay200 pt-page-ontop';
            outClass = 'pt-page-rotateTopSideFirst';
            break;
        case 31:
            inClass = 'pt-page-moveFromBottom pt-page-delay200 pt-page-ontop';
            outClass = 'pt-page-rotateBottomSideFirst';
            break;
        case 32:
            inClass = 'pt-page-flipInLeft pt-page-delay500';
            outClass = 'pt-page-flipOutRight';
            break;
        case 33:
            inClass = 'pt-page-flipInRight pt-page-delay500';
            outClass = 'pt-page-flipOutLeft';
            break;
        case 34:
            inClass = 'pt-page-flipInBottom pt-page-delay500';
            outClass = 'pt-page-flipOutTop';
            break;
        case 35:
            inClass = 'pt-page-flipInTop pt-page-delay500';
            outClass = 'pt-page-flipOutBottom';
            break;
        case 36:
            inClass = 'pt-page-scaleUp';
            outClass = 'pt-page-rotateFall pt-page-ontop';
            break;
        case 37:
            inClass = 'pt-page-rotateInNewspaper pt-page-delay500';
            outClass = 'pt-page-rotateOutNewspaper';
            break;
        case 38:
            inClass = 'pt-page-moveFromRight';
            outClass = 'pt-page-rotatePushLeft';
            break;
        case 39:
            inClass = 'pt-page-moveFromLeft';
            outClass = 'pt-page-rotatePushRight';
            break;
        case 40:
            inClass = 'pt-page-moveFromBottom';
            outClass = 'pt-page-rotatePushTop';
            break;
        case 41:
            inClass = 'pt-page-moveFromTop';
            outClass = 'pt-page-rotatePushBottom';
            break;
        case 42:
            inClass = 'pt-page-rotatePullRight pt-page-delay180';
            outClass = 'pt-page-rotatePushLeft';
            break;
        case 43:
            inClass = 'pt-page-rotatePullLeft pt-page-delay180';
            outClass = 'pt-page-rotatePushRight';
            break;
        case 44:
            inClass = 'pt-page-rotatePullBottom pt-page-delay180';
            outClass = 'pt-page-rotatePushTop';
            break;
        case 45:
            inClass = 'pt-page-rotatePullTop pt-page-delay180';
            outClass = 'pt-page-rotatePushBottom';
            break;
        case 46:
            inClass = 'pt-page-moveFromRightFade';
            outClass = 'pt-page-rotateFoldLeft';
            break;
        case 47:
            inClass = 'pt-page-moveFromLeftFade';
            outClass = 'pt-page-rotateFoldRight';
            break;
        case 48:
            inClass = 'pt-page-moveFromBottomFade';
            outClass = 'pt-page-rotateFoldTop';
            break;
        case 49:
            inClass = 'pt-page-moveFromTopFade';
            outClass = 'pt-page-rotateFoldBottom';
            break;
        case 50:
            inClass = 'pt-page-rotateUnfoldLeft';
            outClass = 'pt-page-moveToRightFade';
            break;
        case 51:
            inClass = 'pt-page-rotateUnfoldRight';
            outClass = 'pt-page-moveToLeftFade';
            break;
        case 52:
            inClass = 'pt-page-rotateUnfoldTop';
            outClass = 'pt-page-moveToBottomFade';
            break;
        case 53:
            inClass = 'pt-page-rotateUnfoldBottom';
            outClass = 'pt-page-moveToTopFade';
            break;
        case 54:
            inClass = 'pt-page-rotateRoomLeftIn';
            outClass = 'pt-page-rotateRoomLeftOut pt-page-ontop';
            break;
        case 55:
            inClass = 'pt-page-rotateRoomRightIn';
            outClass = 'pt-page-rotateRoomRightOut pt-page-ontop';
            break;
        case 56:
            inClass = 'pt-page-rotateRoomTopIn';
            outClass = 'pt-page-rotateRoomTopOut pt-page-ontop';
            break;
        case 57:
            inClass = 'pt-page-rotateRoomBottomIn';
            outClass = 'pt-page-rotateRoomBottomOut pt-page-ontop';
            break;
        case 58:
            inClass = 'pt-page-rotateCubeLeftIn';
            outClass = 'pt-page-rotateCubeLeftOut pt-page-ontop';
            break;
        case 59:
            inClass = 'pt-page-rotateCubeRightIn';
            outClass = 'pt-page-rotateCubeRightOut pt-page-ontop';
            break;
        case 60:
            inClass = 'pt-page-rotateCubeTopIn';
            outClass = 'pt-page-rotateCubeTopOut pt-page-ontop';
            break;
        case 61:
            inClass = 'pt-page-rotateCubeBottomIn';
            outClass = 'pt-page-rotateCubeBottomOut pt-page-ontop';
            break;
        case 62:
            inClass = 'pt-page-rotateCarouselLeftIn';
            outClass = 'pt-page-rotateCarouselLeftOut pt-page-ontop';
            break;
        case 63:
            inClass = 'pt-page-rotateCarouselRightIn';
            outClass = 'pt-page-rotateCarouselRightOut pt-page-ontop';
            break;
        case 64:
            inClass = 'pt-page-rotateCarouselTopIn';
            outClass = 'pt-page-rotateCarouselTopOut pt-page-ontop';
            break;
        case 65:
            inClass = 'pt-page-rotateCarouselBottomIn';
            outClass = 'pt-page-rotateCarouselBottomOut pt-page-ontop';
            break;
        case 66:
            inClass = 'pt-page-rotateSidesIn pt-page-delay200';
            outClass = 'pt-page-rotateSidesOut';
            break;
        case 67:
            inClass = 'pt-page-rotateSlideIn';
            outClass = 'pt-page-rotateSlideOut';
            break
        }
        var currentPageId = $pageWrapper.data('current'),
        $pages = $pageWrapper.find('div.pt-page'),
        pagesCount = $pages.length,
        endCurrentPage = false,
        endNextPage = false;
        if (pagesCount <= 1) return;
        if ($pageWrapper.data('isAnimating')) {
            return false
        }
        $pageWrapper.data('isAnimating', true);
        var $currentPage = null;
        if (currentPageId == 0) {
            $currentPage = $pageWrapper.find('div.pt-page:not(.ifpage)').first()
        } else {
            $currentPage = $pageWrapper.find("#" + currentPageId).first()
        }
        var $nextPage = null;
        if (gotoPage == -1) {
            $nextPage = $currentPage.next();
            while ($nextPage.hasClass("ifpage")) {
                $nextPage = $nextPage.next();
                if ($nextPage.attr("id") == undefined) {
                    break
                }
            }
            if ($nextPage.attr("id") == undefined) {
                $nextPage = $pageWrapper.find('div.pt-page:not(.ifpage)').first()
            }
            $pageWrapper.data('current', $nextPage.attr("id"))
        } else if (gotoPage == -2) {
            $nextPage = $currentPage.prev();
            while ($nextPage.hasClass("ifpage")) {
                $nextPage = $nextPage.prev();
                if ($nextPage.attr("id") == undefined) {
                    break
                }
            }
            if ($nextPage.attr("id") == undefined) {
                $nextPage = $pageWrapper.find('div.pt-page:not(.ifpage)').last()
            }
            $pageWrapper.data('current', $nextPage.attr("id"))
        } else {
            $nextPage = $pageWrapper.find("#" + gotoPage).first();
            $pageWrapper.data('current', $nextPage.attr("id"))
        }
        if ($nextPage != null) {
            if ($nextPage.attr("id") != $currentPage.attr("id")) {
                $nextPage.addClass('pt-page-current')
            }
            $currentPage.addClass(outClass).on(animEndEventName,
            function() {
                $currentPage.off(animEndEventName);
                endCurrentPage = true;
                if (endNextPage) {
                    onEndAnimation($pageWrapper, $nextPage, $currentPage)
                }
            });
            $nextPage.addClass(inClass).on(animEndEventName,
            function() {
                $nextPage.off(animEndEventName);
                endNextPage = true;
                if (endCurrentPage) {
                    onEndAnimation($pageWrapper, $nextPage, $currentPage)
                }
            })
        } else {
            $pageWrapper.data('isAnimating', false)
        }
        if (!support) {
            onEndAnimation($currentPage, $nextPage)
        }
    }
    function onEndAnimation($pageWrapper, $nextPage, $currentPage) {
        resetPage($nextPage, $currentPage);
        $pageWrapper.data('isAnimating', false)
    }
    function resetPage($nextPage, $currentPage) {
        $currentPage.attr('class', $currentPage.data('originalClassList'));
        $nextPage.attr('class', $nextPage.data('originalClassList') + ' pt-page-current')
    }
    return {
        init: init,
        AnimateGo: AnimateGo,
    }
})();