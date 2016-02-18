(function($) {
    $('#video').hide();
    $('body').delegate('.video-btn', 'click', function() {
        $('#video').show();
    });
    var imgLoadNum = 0,
        controlTag = false,
        bannerArea = $('#J-banner-area'),
        siderBarDom = $('#sliderBar'),
        heightNum = $(window).height(),
        tagDom = siderBarDom.find('a'),
        lowestDelta, nullLowestDeltaTimeout;
    isIe69 = function() {
        return BrowserDetect['browser'] == 'Explorer' && BrowserDetect['version'] < 10;
    };
    var types = ['DOMMouseScroll', 'mousewheel'];
    var special = $.event.special.mousewheel = {
        setup: function() {
            if (this.addEventListener) {
                for (var i = types.length; i;) {
                    this.addEventListener(types[--i], handler, false);
                }
            } else {
                this.onmousewheel = handler;
            }
        },
        teardown: function() {
            if (this.removeEventListener) {
                for (var i = types.length; i;) {
                    this.removeEventListener(types[--i], handler, false);
                }
            } else {
                this.onmousewheel = null;
            }
        },
        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true // calls getBoundingClientRect for each event
        }
    };
    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.on("mousewheel", fn) : this.trigger("mousewheel");
        },
        unmousewheel: function(fn) {
            return this.off("mousewheel", fn);
        }
    });

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

    function handler(event) {
        var orgEvent = event || window.event,
            args = [].slice.call(arguments, 1),
            delta = 0,
            deltaX = 0,
            deltaY = 0,
            absDelta = 0,
            offsetX = 0,
            offsetY = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';
        // Old school scrollwheel delta
        if ('detail' in orgEvent) {
            deltaY = orgEvent.detail * -1;
        }
        if ('wheelDelta' in orgEvent) {
            deltaY = orgEvent.wheelDelta;
        }
        if ('wheelDeltaY' in orgEvent) {
            deltaY = orgEvent.wheelDeltaY;
        }
        if ('wheelDeltaX' in orgEvent) {
            deltaX = orgEvent.wheelDeltaX * -1;
        }
        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ('axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }
        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;
        // New school wheel delta (wheel event)
        if ('deltaY' in orgEvent) {
            deltaY = orgEvent.deltaY * -1;
            delta = deltaY;
        }
        if ('deltaX' in orgEvent) {
            deltaX = orgEvent.deltaX;
            if (deltaY === 0) {
                delta = deltaX * -1;
            }
        }
        // No change actually happened, no reason to go any further
        if (deltaY === 0 && deltaX === 0) {
            return;
        }
        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if (orgEvent.deltaMode === 1) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if (orgEvent.deltaMode === 2) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }
        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX));
        if (!lowestDelta || absDelta < lowestDelta) {
            lowestDelta = absDelta;
            // Adjust older deltas if necessary
            if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
                lowestDelta /= 40;
            }
        }
        // Adjust older deltas if necessary
        if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
            // Divide all the things by 40!
            delta /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }
        // Get a whole, normalized value for the deltas
        delta = Math[delta >= 1 ? 'floor' : 'ceil'](delta / lowestDelta);
        deltaX = Math[deltaX >= 1 ? 'floor' : 'ceil'](deltaX / lowestDelta);
        deltaY = Math[deltaY >= 1 ? 'floor' : 'ceil'](deltaY / lowestDelta);
        // Normalise offsetX and offsetY properties
        if (special.settings.normalizeOffset && this.getBoundingClientRect) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }
        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;
        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);
        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) {
            clearTimeout(nullLowestDeltaTimeout);
        }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);
        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }
    halt = function(e) {
        e.preventDefault();
        e.stopPropagation();
    };
    //屏幕滚动逻辑
    bannerArea.mousewheel(function(event, delta, delyaX, delyaY) {
        var deltaSpeed = delta;
        windowScroll(this, event, delta);
        halt(event);
    });
    //滚动完成统一执行函数
    doSomeThingAnimate = function(num) {
        $('#video').hide();
        var nextButtonDom = $('#J-next-section'),
            bottomDom = $('#J-page-bottom'),
            topDom = $('#J-page-top'),
            footerDom = $('.footer');
        if (num == 4) {
            footerDom.css('bottom', -340).attr('data-show', 'hide');;
            if (bottomDom.hasClass('bottom-current')) {
                bottomDom.removeClass('bottom-current');
            }
        } else {
            footerDom.css('bottom', -440).attr('data-show', 'hide');;
            if (!bottomDom.hasClass('bottom-current')) {
                bottomDom.addClass('bottom-current');
            }
        }
        if (num == 0) {
            if (topDom.hasClass('top-current')) {
                topDom.removeClass('top-current');
            }
        } else {
            if (!topDom.hasClass('top-current')) {
                topDom.addClass('top-current');
            }
        }
        if (num == 0) {
            nextButtonDom.find('span').html('领彩三大特性');
        }
        if (num == 1) {
            nextButtonDom.find('span').html('领彩十年大事记');
        }
        if (num == 2) {
            nextButtonDom.find('span').html('领彩6大优势');
        }
        if (num == 3) {
            nextButtonDom.find('span').html('领彩彩种介绍');
        }
    };
    //屏幕滚动事件
    windowScroll = function(dom, event, type) {
        var num = 0,
            speedType = type,
            doms = $(dom),
            chiildDom = doms.children(),
            childSize = chiildDom.size(),
            heightNum = $(window).height(),
            allHeight = childSize * heightNum,
            firstDom = doms.find('div:first'),
            positionTop = Number(doms.attr('data-position'));
        if (firstDom.is(':animated')) {
            return;
        }
        if (speedType > 0) {
            if (Number(positionTop) === 0) {
                return;
            }
            if (isIe69()) {
                firstDom.animate({
                    marginTop: positionTop + heightNum
                }, 1000, 'easeOutCubic');
            } else {
                if (controlTag) {
                    return;
                }
                controlTag = true;
                firstDom.css('marginTop', positionTop + heightNum);
                setTimeout(function() {
                    controlTag = false;
                }, 1000);
            }
            num = -(positionTop + heightNum) / heightNum;
            doms.attr('data-position', positionTop + heightNum);
        } else {
            if (positionTop == -(allHeight - heightNum)) {
                return;
            }
            if (isIe69()) {
                firstDom.animate({
                    marginTop: positionTop - heightNum
                }, 1000, 'easeOutCubic');
            } else {
                if (controlTag) {
                    return;
                }
                controlTag = true;
                firstDom.css('marginTop', positionTop - heightNum);
                setTimeout(function() {
                    controlTag = false;
                }, 1000);
            }
            num = -(positionTop - heightNum) / heightNum;
            doms.attr('data-position', positionTop - heightNum);
        }
        doSomeThingAnimate(num);
        if (!(chiildDom.eq(num).hasClass('current'))) {
            chiildDom.eq(num).addClass('current');
        }
        doms.attr('data-animateid', num);
        siderBalControl(doms.attr('data-position'));
    };
    //动画切换
    animateScrollTo = function(num, type) {
        var doms = bannerArea,
            chiildDom = doms.children(),
            childSize = chiildDom.size(),
            heightNum = $(window).height(),
            allHeight = childSize * heightNum,
            firstDom = doms.find('div:first'),
            positionTop = Number(doms.attr('data-position'));
        if (type == 'reset') {
            firstDom.stop();
        } else {
            if (firstDom.is(':animated')) {
                return;
            }
            if (num > childSize - 1) {
                return;
            }
        }
        if (isIe69()) {
            firstDom.animate({
                marginTop: -(num * heightNum)
            }, 1000, 'easeOutCubic');
        } else {
            if (controlTag && type != 'reset') {
                return;
            }
            controlTag = true;
            firstDom.css('marginTop', -(num * heightNum));
            setTimeout(function() {
                controlTag = false;
            }, 1000);
        }
        doSomeThingAnimate(num);
        if (!(chiildDom.eq(num).hasClass('current'))) {
            chiildDom.eq(num).addClass('current');
        }
        doms.attr('data-position', -(num * heightNum));
        doms.attr('data-animateid', num);
        siderBalControl(doms.attr('data-position'));
    };
    //侧边栏点击
    tagDom.on('click', function() {
        var num = $(this).index();
        animateScrollTo(num);
    });
    //屏幕尺寸改变
    $(window).resize(function(event) {
        animateScrollTo(0, 'reset');
    });
    //向下翻屏
    $('#J-next-section').on('click', function() {
        var doms = bannerArea,
            num = doms.attr('data-animateid');
        animateScrollTo(Number(num) + 1);
    });
    siderBalControl = function(topNum) {
        var heightNum = $(window).height(),
            num = topNum * -1 / heightNum;
        tagDom.removeClass('current');
        tagDom.eq(num).addClass('current');
    };
    //头屏进度条
    //判断图片加载
    loadImg = function(src, callback, num) {
        var img = new Image();
        img.src = src;
        if (img.complete) {
            callback(num);
            return;
        }

        function get() {
            if (img.complete) {
                callback(num);
                //循环求值
                if (getTimer) {
                    clearInterval(getTimer);
                    getTimer = null;
                }
            } else if (img.error) {
                callback();
            }
        }
        var getTimer = setInterval(get, 100);
    };
    appendHtmlDom = function(num, callback) {
        var domList = $('#J-banner-area').children(),
            currentDom = domList.eq(Number(num)),
            htmlDom = currentDom.find('textarea').text();
        currentDom.html(htmlDom);
        setTimeout(function() {
            if (callback) {
                callback();
            }
        }, 100);
    };
    //开始动画
    startAnimate = function() {
        //等待CSS3动画完成
        setTimeout(function() {
            $('#J-loading-page').fadeOut('slow');
            appendHtmlDom(0, function() {
                $('#J-banner-area').find('div:first').addClass('current');
                $('#J-page-bottom').addClass('bottom-current');
                setTimeout(function() {
                    appendHtmlDom(1);
                    appendHtmlDom(2);
                    appendHtmlDom(3);
                    appendHtmlDom(4);
                    new TabBanner({
                        'obj': '.things',
                        'isTab': true,
                        'time': 3
                    });
                }, 300);
            });
        }, 200);
    };

    function TabBanner(param) {
        this.o = $('.things');
        this.aBl = $('.things-ul-box');
        this.aBu = $('.things-box');
        this.aTa = $('.tab-btn');
        this.l = this.aBl.length;
        this.w = this.o.width();
        this.n = 0;
        this.tab = param.isTab;
        this.time = param.time * 1000;
        this.init();
    };
    TabBanner.prototype = {
        init: function() {
            this.aBu.html(this.aBu.html() + this.aBu.html());
            this.aBu.width(this.l * this.w * 2);
            if (this.tab) {
                var _html = '<a class="active"></a>';
                for (var i = 1; i < this.l; i++) {
                    _html = _html + '<a></a>'
                }
                this.aTa.append(_html);
                this.aTa.show();
                this.clickFn();
            }
            this.autoTab();
            this.isoverFn();
        },
        clickFn: function() {
            var that = this;
            this.aTa.on('click', 'a', function() {
                that.startTab($(this).index());
                that.n = $(this).index();
            });
        },
        startTab: function(n) {
            var that = this
            var _left = -this.w * n;
            that.aBu.animate({
                'left': _left
            }, function() {
                if (n == that.l) {
                    that.aBu.css({
                        'left': 0
                    });
                    n = 0;
                }
                if (that.tab) {
                    that.aTa.find('a').eq(n).addClass('active').siblings('a').removeClass('active');
                }
            });
        },
        autoTab: function() {
            var that = this;
            this.timer = setInterval(function() {
                that.n = that.n + 1;
                that.startTab(that.n);
                if (that.n == that.l) {
                    that.n = 0;
                }
            }, this.time)
        },
        isoverFn: function() {
            var that = this;
            this.o.mouseover(function() {
                clearInterval(that.timer);
            });
            this.o.mouseout(function() {
                that.autoTab();
            });
        }
    };
    loadAnimate = function(num) {
        var loadUnitHeight = 114 / num,
            animateDom = $('#J-logo-loading');
        imgLoadNum++;
        animateDom.css('height', loadUnitHeight * imgLoadNum);
        if (num == imgLoadNum) {
            //图片静态资源加载完毕
            startAnimate();
        }
    };
    loadAnimate(1);
    //load动画
    loadProcess = function() {
        var imgList = ['images/banner.jpg', 'images/shi-heng.png', 'images/shi-shu.png', 'images/slider-left.png', 'images/slider-right.png', 'images/flower.png', 'images/title.png', 'images/time-right.png', 'images/time-left.png'];
        for (var i = 0; i < imgList.length; i++) {
            (function(s) {
                setTimeout(function() {
                    loadImg(imgList[s], loadAnimate, imgList.length);
                }, 200 * s);
            })(i);
        }
    };
    //load动画(不用)
    //loadProcess();
    /*
     底部footer开关
     */
    $('#J-footer-show').click(function() {
        var parentDom = $(this).parent(),
            showStatus = parentDom.attr('data-show');
        if (showStatus == 'hide') {
            if (isIe69()) {
                parentDom.animate({
                    bottom: 0
                }, 300);
            } else {
                parentDom.css('bottom', 0);
            }
            parentDom.attr('data-show', 'show');
        } else {
            if (isIe69()) {
                parentDom.animate({
                    bottom: -340
                }, 300);
            } else {
                parentDom.css('bottom', -340);
            }
            parentDom.attr('data-show', 'hide');
        }
    });
})(jQuery);