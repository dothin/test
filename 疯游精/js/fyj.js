! function() {
    window.onload = function() {
        fyj.getLiText();
        fyj.toTextChange();
        fyj.toNavHover();
        fyj.toImgChange();
        fyj.toTabSwitch();
        fyj.mnRadio();
        fyj.goTop('gotop');
    };
    var fyj = {};
    fyj = {};
    fyj.getLiText = function() {
        var oHeader = document.getElementById('header');
        var oHeaderSearch = g.tools.getByClass(oHeader, 'header-search')[0];
        var oH2 = oHeaderSearch.getElementsByTagName('h2')[0];
        var oUl = oHeaderSearch.getElementsByTagName('ul')[0];
        var oA = oUl.getElementsByTagName('a');
        var onOff = true;
        var iUlHeight = parseInt(g.tools.getStyle(oA[0], 'height')) * oA.length;
        oH2.onclick = function(ev) {
            var oEvent = g.tools.EventUtil.getEvent(ev);
            if (onOff) g.ui.move.buffer(oUl, {
                height: iUlHeight
            }, 5);
            else g.ui.move.buffer(oUl, {
                height: 0
            }, 5);
            onOff = !onOff;
            g.tools.EventUtil.stopPropagation(oEvent);
            document.onclick = function() {
                g.ui.move.buffer(oUl, {
                    height: 0
                }, 5);
                onOff = true;
            }
        }
        for (var i = 0; i < oA.length; i++) {
            oA[i].onclick = function() {
                oH2.innerHTML = this.innerHTML;
                g.ui.move.buffer(oUl, {
                    height: 0
                });
            }
        }
    };
    fyj.toTextChange = function() {
        var oText = g.tools.getByClass(document.body, 'text-change');
        g.ui.textChange(oText[0], '目的地、主题、签证、或景区名称');
        g.ui.textChange(oText[1], '北京');
        g.ui.textChange(oText[2], '上海');
        g.ui.textChange(oText[3], '2015-04-02');
        g.ui.textChange(oText[4], 'yyyy-mm-dd');
    };
    fyj.toNavHover = function() {
        var oHeader = document.getElementById('header');
        var oHeaderNav = g.tools.getByClass(oHeader, 'header-nav')[0];
        var aLi = oHeaderNav.getElementsByTagName('li');
        var aA = oHeaderNav.getElementsByTagName('a');
        var oBg = aLi[aLi.length - 1];
        //var oldWidth = g.tools.getStyle(aA[0],'width');
        //getStyle貌似不能获取IE下auto属性，而offset完美解决了兼容问题
        var oldWidth = aA[0].offsetWidth + 'px';
        var oldLeft = 0;
        oBg.style.width = oldWidth;
        //oBg.style.paddingLeft=oBg.style.paddingRight=30+'px';
        for (var i = 0; i < aLi.length; i++) {
            aLi[i].index = i;
            aLi[i].onmouseover = function() {
                g.ui.move.tanXin(oBg, 'left', this.offsetLeft);
                //oBg.style.width = g.tools.getStyle(aA[this.index],'width');
                oBg.style.width = aA[this.index].offsetWidth + 'px';
                //document.title =aA[this.index].offsetWidth+'px';
            };
            aLi[i].onmouseout = function() {
                g.ui.move.tanXin(oBg, 'left', oldLeft);
                oBg.style.width = oldWidth;
            };
            aLi[i].onclick = function() {
                g.ui.move.tanXin(oBg, 'left', this.offsetLeft);
                //oBg.style.width = g.tools.getStyle(aA[this.index],'width');
                oBg.style.width = aA[this.index].offsetWidth + 'px';
                //oldWidth = g.tools.getStyle(aA[this.index],'width');
                oldWidth = aA[this.index].offsetWidth + 'px';
                oldLeft = this.offsetLeft;
            };
        }
    };
    fyj.toImgChange = function() {
        var oCenter = document.getElementById('center');
        var aImg = oCenter.getElementsByTagName('img');
        var aOlLi = oCenter.getElementsByTagName('ol')[0].getElementsByTagName('li');
        var iNum = 0;
        var timer = null;
        g.ui.move.buffer(aImg[iNum], {
            opacity: 100
        });
        start();

        function start() {
            timer = setInterval(function() {
                iNum++;
                iNum %= aImg.length;
                //aImg[i].index = i;
                for (var i = 0; i < aImg.length; i++) {
                    g.ui.move.buffer(aImg[i], {
                        opacity: 0
                    });
                    aOlLi[i].className = '';
                }
                aOlLi[iNum].className = 'active';
                g.ui.move.buffer(aImg[iNum], {
                    opacity: 100
                });
            }, 3000);
        }
        for (var i = 0; i < aOlLi.length; i++) {
            aOlLi[i].index = i;
            aOlLi[i].onmouseover = function() {
                clearInterval(timer);
                for (var i = 0; i < aImg.length; i++) {
                    g.ui.move.buffer(aImg[i], {
                        opacity: 0
                    });
                    aOlLi[i].className = '';
                }
                this.className = 'active';
                g.ui.move.buffer(aImg[this.index], {
                    opacity: 100
                });
                iNum = this.index;
            }
            aOlLi[i].onmouseout = start;
        }
    };
    fyj.toTabSwitch = function() {
        var oCenter = document.getElementById('center');
        var oTab = g.tools.getByClass(oCenter, 'tab')[0];
        var aLi = oTab.getElementsByTagName('li');
        var aDiv = g.tools.getByClass(oCenter, 'center-content');
        /*  var aPosition = [
            {
                "ticket":"-110px -23px",
                "tickets":"-188px -22px",
                "hotel":"-265px -22px",
                "tourism":"-343px -32px",
                "visa":"-426px -22px"
            },
            {
                "ticket":"-110px 20px",
                "tickets":"-188px 21px",
                "hotel":"-265px 21px",
                "tourism":"-343px 15px",
                "visa":"-426px 24px"
            }
            ];*/
        var json = {
            "old": ["-110px -23px", "-188px -22px", "-265px -22px", "-343px -32px", "-426px -22px"],
            "_new": ["-110px 20px", "-189px 21px", "-265px 21px", "-344px 16px", "-426px 24px"]
        }
        for (var i = 0; i < aLi.length; i++) {
            aLi[i].index = i;
            aLi[i].onmouseover = function() {
                for (var i = 0; i < aLi.length; i++) {
                    aLi[i].style.backgroundColor = '#f3f3f3';
                    aLi[i].style.color = '#555';
                    aLi[i].style.backgroundPosition = json.old[i];
                    /*aLi[i].style.cssText = "background-color:#f3f3f3;background-position:"+json.old[i]+";color:#555;";*/
                    aDiv[i].style.cssText = 'opacity: 0;visibility: hidden;';
                };
                this.style.backgroundColor = '#fff';
                this.style.color = '#008cd6';
                this.style.backgroundPosition = json._new[this.index];
                /*this.style.cssText = "background-color:#fff;background-position:"+json._new[this.index]+";color:#008cd6; ";*/
                aDiv[this.index].style.cssText = 'opacity: 1;visibility: visible;';
            }
        }
    };

    fyj.mnRadio = function(){
        var oCenter = document.getElementById('center');
        var aLabel = g.tools.getByClass(oCenter, 'radio')[0].getElementsByTagName('label')
        var aRadio = g.tools.getByClass(oCenter, 'radio')[0].getElementsByTagName('input');
        var len = aRadio.length;
        for(var i=0;i<len;i++){
            if(aRadio[i].checked){
                aRadio[i].parentNode.className = 'radio-show';
            }
            else
                aRadio[i].parentNode.className = 'radio-hide';
        };
        for(var i=0;i<len;i++){
            aLabel[i].onclick = function(){
                for(var i=0;i<len;i++){
                    aLabel[i].className = 'radio-hide';
                    aLabel[i].childNodes[0].checked = false;
                    
                };
                this.className = 'radio-show';
                this.childNodes[0].checked = true;
            }
        }
    };

     fyj.goTop = function(id){
        var oTop = document.getElementById(id);
        function getScrollTop(){
            return document.documentElement.scrollTop||document.body.scrollTop;
        };
        function setScrollTop(value){
            if(document.documentElement.scrollTop)
                document.documentElement.scrollTop = value;
            else
                document.body.scrollTop = value;
        };
        window.onscroll = function(){
            getScrollTop() > 0?oTop.style.display = "block":oTop.style.display = "none";
        };
        oTop.onclick = function(){
            var timer = setInterval(function(){
                setScrollTop(getScrollTop()-getScrollTop()/10);
                if(getScrollTop()<1)
                    clearInterval(timer);
            },10)
        }
     };
     
    /*  $(window).scroll(function(){  
            if ($(window).scrollTop()>100){  
                $("#goTopBtn").fadeIn(1000);  
            }  
            else  
            {  
                $("#goTopBtn").fadeOut(1000);  
            }  
        });  
        $("#goTopBtn").click(function(){
             $('body,html').animate({scrollTop:0},100);  
        }) */
}();