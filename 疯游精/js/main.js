//如何在一个网站或者一个页面，去书写你的JS代码：
//1.js的分层(功能) : jquery(tools)  组件(ui)  应用(app), mvc(backboneJs)
//2.js的规划(管理) : 避免全局变量和方法(命名空间，闭包，面向对象) , 模块化(seaJs,requireJs)
// 命名空间
var g = {};
// 通用工具
g.tools = {};
// 获取最终样式
g.tools.getStyle = function(obj, attr) {
    return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr];
};
// getElementsByClassName的兼容版
g.tools.getByClass = function(oParent, sClass) {
    var aEle = oParent.getElementsByTagName('*');
    var arr = [];
    //var re=new RegExp('\\b'+sClass+'\\b', 'i');
    var re = eval('/\\b' + sClass + '\\b/i');
    for (var i = 0; i < aEle.length; i++) {
        //  if(aEle[i].className == sClass){  //不能获取有多个类名的类
        if (re.test(aEle[i].className)) {
            //  if(aEle[i].className.indexOf(sClass)!= -1){ //只能截取类名的一部分
            //  if(aEle[i].className.search(sClass)!=-1){   //只能截取类名的一部分
            arr.push(aEle[i]);
        }
    }
    return arr;
};
// 事件对象
g.tools.EventUtil = {
    addHandler: function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false); //false表示在冒泡阶段调用事件处理程序。
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
    removeHandler: function(element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false); //false表示在冒泡阶段调用事件处理程序。
        } else if (element.detachEvent) {
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    },
    getEvent: function(event) {
        return event ? event : window.event;
    },
    getTarget: function(event) {
        return event.target || event.srcElement;
    },
    preventDefault: function(event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    stopPropagation: function(event) {
        if (event.stopPropagation) {
            event.stopPropagation(); //清楚目标元素也可以阻止冒泡，目标元素在文档中是事件冒泡的前提。
        } else {
            event.cancelBubble = true;
        }
    },
    getRelatedTarget: function(event) {
        if (event.relatedTarget) {
            return event.relatedTarget;
        } else if (event.toElement) {
            return event.toElement;
        } else if (event.fromElement) {
            return event.fromElement;
        } else {
            return null;
        }
    },
    getWheelDelta: function(event) {
        if (event.whellDelta) {
            return (client.engine.opera && client.engine.opera < 9.5 ? -event.whellDelta : event.whellDelta);
        } else {
            return -event.detail * 40;
        }
    },
    getCharCode: function(event) {
        if (typeof event.charCode == "number") {
            return event.charCode;
        } else {
            return event.keyCode;
        }
    }
};
// ui组件
g.ui = {};
// 运动库
g.ui.move = {
    buffer: function(obj, json,time, fn) {
        clearInterval(obj.timer);
        var iTime = time?time:30;
        obj.timer = setInterval(function() {
            var bStop = true; //这一次运动就结束了——所有的值都到达了
            for (var attr in json) {
                //1.取当前的值
                var iCur = 0;
                if (attr == 'opacity') {
                    iCur = parseInt(parseFloat(g.tools.getStyle(obj, attr)) * 100);
                } else {
                    iCur = parseInt(g.tools.getStyle(obj, attr));
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
    },
    tanXin: function(obj, attr, iTarget) {
        var iSpeed = 0;
        var dis = parseInt(g.tools.getStyle(obj, attr));
        clearInterval(obj.timer);
        obj.timer = setInterval(function() {
            iSpeed += (iTarget - dis) / 5;
            iSpeed *= 0.7;
            dis += iSpeed;
            //弹性运动：距离足够近 并且 速度足够小
            if (Math.abs(iSpeed) < 1 && Math.abs(dis - iTarget) < 1) {
                clearInterval(obj.timer);
                obj.style[attr] = iTarget + 'px';
                //alert('关了');
            } else {
                obj.style[attr] = dis + 'px';
            }
        }, 30);
    },
    shake: function(obj, attr, endFn) {
        if (obj.onOff) {
            return;
        }
        obj.onOff = true;
        var pos = parseInt(g.tools.getStyle(obj, attr));
        var arr = [];
        var num = 0;
        var timer = null;
        for (var i = 20; i > 0; i -= 2) {
            arr.push(i, -i);
        }
        arr.push(0);
        clearInterval(obj.shake);
        obj.shake = setInterval(function() {
            obj.style[attr] = pos + arr[num] + 'px';
            num++;
            if (num === arr.length) {
                clearInterval(obj.shake);
                endFn && endFn();
                obj.onOff = false;
            }
        }, 30);
    }
};
// 输入框文本切换
g.ui.textChange = function(obj, str) {
    obj.onfocus = function() {
        if (this.value == str) {
            this.value = '';
            this.style.color = '#000';
        }
    };
    obj.onblur = function() {
        if (this.value == '') {
            this.value = str;
            this.style.color = '#ddd';
        } else this.style.color = '#000';
    };
};
// 拖拽
g.ui.Drag = {};
g.ui.Drag.superDrag = function(id) {
    var _this = this;
    this.oDiv = document.getElementById(id);
    this.oDiv.onmousedown = function(ev) {
        _this.fnDown(ev);
    }
};
g.ui.Drag.superDrag.prototype.fnDown = function(ev) {
    var oEvent = g.tools.EventUtil.getEvent(ev);
    this.disX = oEvent.clientX - this.oDiv.offsetLeft;
    this.disY = oEvent.clientY - this.oDiv.offsetTop;
    var _this = this;
    document.onmousemove = function(ev) {
        _this.fnMove(ev);
        g.tools.EventUtil.preventDefault(oEvent);
        /*  if (oEvent.preventDefault) {
                oEvent.preventDefault();
            }else{
                oEvent.returnValue = false;
            }*/
    }
    document.onmouseup = function(ev) {
        _this.fnUp(ev);
    }
    return false;
};
g.ui.Drag.superDrag.prototype.fnMove = function(ev) {
    var oEvent = g.tools.EventUtil.getEvent(ev);
    var l = oEvent.clientX - this.disX;
    var t = oEvent.clientY - this.disY;
    this.oDiv.style.left = l + 'px';
    this.oDiv.style.top = t + 'px';
};
g.ui.Drag.superDrag.prototype.fnUp = function(ev) {
    document.onmousemove = null
    document.onmosueup = null;
};
g.ui.Drag.subDrag = function(id) {
    g.ui.Drag.superDrag.call(this, id);
};
/*for(var i in superDrag.prototype){
        subDrag.prototype[i] = superDrag.prototype[i];  
    }*/
if (!Object.create) {
    Object.create = function(proto) {
        function F() {};
        F.prototype = proto;
        return new F();
    }
};
g.ui.Drag.subDrag.prototype = Object.create(g.ui.Drag.superDrag.prototype);
g.ui.Drag.subDrag.prototype.constructor = g.ui.Drag.subDrag;
// g.ui.Drag.subDrag.prototype = new superDrag();
/*function inheritPrototype(subType,superType){
        var prototype = Object(superType.prototype);
        prototype.constructor = subType;
        subType.prototype = prototype;
    }
    inheritPrototype(subDrag,superDrag);*/
g.ui.Drag.subDrag.prototype.fnMove = function(ev) {
    var oEvent = ev || event;
    var l = oEvent.clientX - this.disX;
    var t = oEvent.clientY - this.disY;
    if (l < 0) {
        l = 0;
    } else if (l > document.documentElement.clientWidth - this.oDiv.offsetWidth) {
        l = document.documentElement.clientWidth - this.oDiv.offsetWidth;
    }
    if (t < 0) {
        t = 0;
    } else if (t > document.documentElement.clientHeight - this.oDiv.offsetHeight) {
        t = document.documentElement.clientHeight - this.oDiv.offsetHeight;
    }
    this.oDiv.style.left = l + 'px';
    this.oDiv.style.top = t + 'px';
};
