/*'use strict';*/
window.onload = function() {
    skzz.bannerMove();
    skzz.lunbo();
};
var skzz = {};

function getStyle(obj, attr) {
    return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr];
};

function doMove(obj, json, time, fn) {
    clearInterval(obj.timer);
    var iTime = time ? time : 30;
    obj.timer = setInterval(function() {
        var bStop = true; //这一次运动就结束了——所有的值都到达了
        for (var attr in json) {
            //1.取当前的值
            var iCur = 0;
            if (attr == 'opacity') {
                iCur = parseInt(parseFloat(getStyle(obj, attr)) * 100);
            } else {
                iCur = parseInt(getStyle(obj, attr));
            }
            //2.算速度
            var iSpeed = (json[attr] - iCur) / 8;
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
            //3.检测停止
            if (iCur != json[attr]) {
                bStop = false;
            }
            if (attr == 'opacity') {
                obj.style.filter = 'alpha(opacity:' + (iCur + iSpeed) + ')';
                obj.style.opacity = (iCur + iSpeed) / 100;
            } else {
                obj.style[attr] = iCur + iSpeed + 'px';
            }
        }
        if (bStop) {
            clearInterval(obj.timer);
            if (fn) {
                fn();
            }
        }
    }, iTime)
}
skzz.bannerMove = function() {
    var oUl = document.getElementById('banner');
    var aLi = oUl.getElementsByTagName('li');
    var aA = document.getElementById('btn').getElementsByTagName('a');
    var oPrev = document.getElementById('prev');
    var oNext = document.getElementById('next');
    var len = aLi.length;
    var aImg = oUl.getElementsByTagName('img');
    var startTime = null;
    var iNow = 0;
    var iNum = 0;
    var clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
    //让banner居中
    function toResize() {
        for (var i = 0; i < len; i++) {
            //aImg[i].style.left = -(oneLen - clientWidth) / 2 + 'px';
            aImg[i].style.width = clientWidth + 'px';
        };
    };
    toResize();
    var oneLen = parseInt(g.tools.getStyle(aImg[0], 'width'));
    oUl.style.width = oneLen * len + 'px';
    window.onresize = function() {
        toResize();
    }
    for (var i = 0; i < len; i++) {
        aA[i].index = i;
        aA[i].onclick = function() {
            btnSwitch(this);
        };
        aA[i].onmouseover = function() {
            clearInterval(startTime);
        };
        aA[i].onmouseout = function() {
            startTime = setInterval(init, 3000);
        };
    };

    function btnSwitch(that) {
        for (var i = 0; i < len; i++) {
            aA[i].className = '';
        };
        that.className = 'active';
        var _this = that;
        var timer = setInterval(function() {
            var iCur = 0;
            iCur = parseInt(g.tools.getStyle(oUl, 'left'));
            var iSpeed = ((_this.index) * oneLen + iCur) / 8;
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
            oUl.style.left = iCur - iSpeed + 'px';
            oNext.removeEventListener('click', init, false);
            oPrev.removeEventListener('click', leftMove, false);
            for (var i = 0; i < len; i++) {
                aA[i].onclick = false;
            };
            if (iCur == -(_this.index) * oneLen) {
                oNext.addEventListener('click', init, false);
                oPrev.addEventListener('click', leftMove, false);
                (function() {
                    for (var i = 0; i < len; i++) {
                        aA[i].index = i;
                        aA[i].onclick = function() {
                            btnSwitch(this);
                        };
                    };
                })()
                clearInterval(timer);
            }
        }, 30)
        /*oUl.style.left = -(this.index) * oneLen + 'px';
            oUl.style.transition = 'all 1s'*/
        iNow = that.index;
        iNum = that.index;
    };
    startTime = setInterval(init, 3000);
    oUl.onmouseover = oPrev.onmouseover = oNext.onmouseover = function() {
        clearInterval(startTime);
    };
    oUl.onmouseout = oPrev.onmouseout = oNext.onmouseout = function() {
        startTime = setInterval(init, 3000);
    };

    function init() {
        if (iNow == len - 1) {
            aLi[0].style.cssText = "position: relative; left: " + oneLen * len + "px;";
            iNow = 0;
        } else {
            iNow++; //按钮切换
        }
        iNum++; //banner切换
        for (var i = 0; i < len; i++) {
            aA[i].className = '';
        };
        aA[iNow].className = 'active';
        var timer = setInterval(function() {
            var iCur = 0;
            iCur = parseInt(g.tools.getStyle(oUl, 'left'));
            var iSpeed = (iNum * oneLen + iCur) / 8;
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
            oUl.style.left = iCur - iSpeed + 'px';
            oNext.removeEventListener('click', init, false);
            oPrev.removeEventListener('click', leftMove, false);
            if (iCur == -iNum * oneLen) {
                oNext.addEventListener('click', init, false);
                oPrev.addEventListener('click', leftMove, false);
                clearInterval(timer);
                if (iNow == 0) {
                    aLi[0].style.position = 'static';
                    oUl.style.left = 0;
                    iNum = 0;
                }
            }
        }, 30)
        /*iNow++;
        iNow%=len;
        for (var i = 0; i < aA.length; i++) {
            aA[i].className = '';
        };
        this.className = 'active';
        oUl.style.left = -iNow* oneLen + 'px';
        oUl.style.transition = 'all 1s'*/
    }
    oNext.addEventListener('click', init, false);
    oPrev.addEventListener('click', leftMove, false);

    function leftMove() {
        if (iNow == 0) {
            aLi[len - 1].style.cssText = "position: relative; right: " + oneLen * len + "px;";
            iNow = len - 1;
        } else {
            iNow--;
        }
        iNum--;
        for (var i = 0; i < len; i++) {
            aA[i].className = '';
        };
        aA[iNow].className = 'active';
        var timer = setInterval(function() {
            var iCur = 0;
            iCur = parseInt(g.tools.getStyle(oUl, 'left'));
            var iSpeed = (iNum * oneLen + iCur) / 8;
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
            oUl.style.left = iCur - iSpeed + 'px';
            // console.log(iNum)
            oNext.removeEventListener('click', init, false);
            oPrev.removeEventListener('click', leftMove, false);
            if (iCur == -iNum * oneLen) {
                oNext.addEventListener('click', init, false);
                oPrev.addEventListener('click', leftMove, false);
                clearInterval(timer);
                if (iNow == len - 1) {
                    //console.log('here')
                    aLi[len - 1].style.position = 'static';
                    oUl.style.left = -iNow * oneLen + 'px';
                    iNum = len - 1;
                }
            }
        }, 30)
    }
};
skzz.lunbo = function() {
    var oLunbo = document.getElementById('lunbo');
    var olPrev = document.getElementById('lPrev');
    var olNext = document.getElementById('lNext');
    var oUl = oLunbo.getElementsByTagName('ul')[0];
    var aLi = oUl.getElementsByTagName('li');
    var timer = null;
    var iNow = 0;
    var onelen = aLi[0].offsetWidth + 10;
    oUl.innerHTML += oUl.innerHTML;
    var len = aLi.length;
    oUl.style.width = len * onelen + 'px';
    timer = setInterval(init,2000);
    function init() {
        if(iNow == aLi.length/2){
            iNow = 0;
            oUl.style.left = 0;
        }
        iNow++;
        doMove(oUl, {
            left: -iNow * onelen
        });
    }
    olNext.onclick = function() {
        init();
    }
    oLunbo.onmouseover = olPrev.onmouseover = function(){
        clearInterval(timer);
    }
    oLunbo.onmouseout = olPrev.onmouseout = function(){
        timer = setInterval(init,2000);
    }
    olPrev.onclick = function() {
        clearInterval(timer)
        if(iNow == 0){
            iNow = aLi.length/2;
            oUl.style.left = -iNow*onelen + 'px';
        }
        iNow--;
        doMove(oUl, {
            left: -iNow * onelen
        });
    }
}