(function($) {
    $('#video').hide();
    $('body').delegate('.video-btn', 'click',  function(){
        $('#video').show();
    });
    var imgLoadNum = 0,
        controlTag = false,
        bannerArea = $('#J-banner-area'),
        siderBarDom = $('#sliderBar'),
        heightNum = $(window).height(),
        tagDom = siderBarDom.find('a');

    var types = ['DOMMouseScroll', 'mousewheel'];



    isIe69 = function() {
        return BrowserDetect['browser'] == 'Explorer' && BrowserDetect['version'] < 10;
    };

    $.event.special.mousewheel = {
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
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
        },

        unmousewheel: function(fn) {
            return this.unbind("mousewheel", fn);
        }
    });


    function handler(event) {
        var orgEvent = event || window.event,
            args = [].slice.call(arguments, 1),
            delta = 0,
            returnValue = true,
            deltaX = 0,
            deltaY = 0;

        event = $.event.fix(orgEvent);
        event.type = "mousewheel";


        // Old school scrollwheel delta
        if (event.wheelDelta) {
            delta = event.wheelDelta / 120;
        }
        if (event.detail) {
            delta = -event.detail / 3;
        }


        // New school multidimensional scroll (touchpads) deltas
        deltaY = delta;

        // Gecko
        if (orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
            deltaY = 0;
            deltaX = -1 * delta;
        }

        // Webkit
        if (orgEvent.wheelDeltaY !== undefined) {
            deltaY = orgEvent.wheelDeltaY / 120;
        }
        if (orgEvent.wheelDeltaX !== undefined) {
            deltaX = -1 * orgEvent.wheelDeltaX / 120;
        }

        args.unshift(event, delta, deltaX, deltaY);

        return $.event.handle.apply(this, args);

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
            footerDom = $('.footer');

        if (num == 4) {
            footerDom.css('bottom', -340).attr('data-show', 'hide');;

            if (bottomDom.hasClass('current')) {
                bottomDom.removeClass('current');
            }
        } else {
            footerDom.css('bottom', -390).attr('data-show', 'hide');;

            if (!bottomDom.hasClass('current')) {
                bottomDom.addClass('current');
            }
        }

        if(num == 0) {
            nextButtonDom.html('凤凰新平台三大特性');
        }
        
        if(num == 1) {
            nextButtonDom.html('凤凰娱乐十年大事记');
            
            
        }

        if(num == 2) {
            nextButtonDom.html('凤凰娱乐的优势');
        }

        if(num == 3) {
            nextButtonDom.html('凤凰娱乐彩种介绍');
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
        if(!(chiildDom.eq(num).hasClass('current'))){
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

        if(!(chiildDom.eq(num).hasClass('current'))){
            chiildDom.eq(num).addClass('current');
        }
        doms.attr('data-position', -(num * heightNum));
        doms.attr('data-animateid', num);
        siderBalControl(doms.attr('data-position'));
    };

    //侧边栏点击
    tagDom.bind('click', function() {
        var num = $(this).index();

        animateScrollTo(num);
    });

    //屏幕尺寸改变
    $(window).resize(function(event) {

        animateScrollTo(0, 'reset');
    });

    //向下翻屏
    $('#J-next-section').bind('click', function() {
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


    /*
     * 第二屏幕
     * 年份展示
     */
    var leaveDom = null,
        touchTime = null,
        picArea = $('#J-pic-area'),
        pivMoveArea = $('#J-move-pic'),
        picListDom = picArea.find('ul li');

    picArea.delegate('ul li', 'mouseenter', function(event) {
        var dom = $(this);

        if(touchTime){
            clearTimeout(touchTime);
            touchTime = null;
        }

        touchTime = setTimeout(function(){
            dom.parent().children('li').each(function(i){
                if(!($(this).hasClass('close'))){
                    dom.parent().children('li').addClass('close');  
                }
            });
            dom.removeClass('close').addClass('open');
        },100);

    });
    picArea.delegate('ul li', 'mouseleave', function(event) {
        var dom = $(this);

        if(touchTime){
            clearTimeout(touchTime);
            touchTime = null;
        }

        leaveDom = setTimeout(function(){
            if(!(dom.hasClass('close'))){
                dom.removeClass('open').addClass('close');
            }
        },100); 
        
    });

    picArea.delegate('ul', 'mousemove', function(e) {
        var dom = $(this),
            domWidth = dom.outerWidth(),
            winWidth = $(window).width(),
            x = e.pageX,
            y = e.pageY,
            c = (domWidth - winWidth) / 2,
            p = winWidth / 2 - x,
            s = p / (winWidth / 2),
            unit = p < 0 ? -1 : 1;

        if (domWidth - winWidth == 0) {
            return;
        }

        dom.css('marginLeft', -960 + ((c / 100) * parseInt(s * 100)));
    })

    picArea.delegate('ul', 'mouseleave', function() {
        if(leaveDom){
            clearTimeout(leaveDom);
            leaveDom = null;
        }

        $(this).find('li').removeClass('close').removeClass('open');
    });

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
                $('#J-page-bottom').addClass('current');

                setTimeout(function() {
                    appendHtmlDom(1);
                    appendHtmlDom(2);
                    appendHtmlDom(3);
                    appendHtmlDom(4);
                }, 300);
            });

        }, 200);
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

    //load动画
    loadProcess();

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

            }else{

                parentDom.css('bottom', 0);
            }

            parentDom.attr('data-show', 'show');

        } else {

            if (isIe69()) {
                parentDom.animate({
                    bottom: -340
                }, 300);
                
            }else{
                parentDom.css('bottom', -340);
                
            }

            parentDom.attr('data-show', 'hide');
        }
    });

})(jQuery);