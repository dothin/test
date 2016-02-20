/* 
 * @Author: gaohuabin
 * @Date:   2016-02-20 10:46:05
 * @Last Modified by:   gaohuabin
 * @Last Modified time: 2016-02-20 18:14:41
 */
$(function() {
    /*Object {text: Object, t: Object}
t: Object
hu: Array[1]
s: Array[1]
te: Array[1]
th: Array[1]
thh: Array[1]
__proto__: Object
text: Object
c: "五星复式"
m: "1"
n: "1"
p: "2"*/
    var beishuValue = localStorage.getItem("beishu") ? localStorage.getItem("beishu") : 1;
    $('.beishu').text(beishuValue);
    listInit();

    function listInit() {
        $('.bet-lists ul').empty();
        if (!localStorage.getItem("outputStr")) return;
        var outputStr = localStorage.getItem("outputStr").split('$$');
        var len = outputStr.length,
            zhu = 0,
            yuan = 0;
        var beishuText = parseInt($('.beishu').text());
        for (var i = 0; i < len; i++) {
            outputStr[i] = JSON.parse(outputStr[i]);
            var liStr = '<li><div class="lists-left"><div class="left-top">';
            if (outputStr[i].text.c.indexOf('和值') > 0) {
                liStr += '<span>' + outputStr[i].t.thh + '</span></div>';
            } else {
                liStr += '<span>' + outputStr[i].t.thh.join('') + ',</span><span>' + outputStr[i].t.th.join('') + ',</span><span>' + outputStr[i].t.hu.join('') + ',</span><span>' + outputStr[i].t.te.join('') + ',</span><span>' + outputStr[i].t.s.join('') + '</span></div>';
            }
            liStr += '<div class="left-bottom">';
            liStr += '<p><span>' + outputStr[i].text.c + '</span><span>' + outputStr[i].text.n + '</span>注X<span>' + outputStr[i].text.p + '</span>元</p></div></div>';
            liStr += '<div class="lists-right"><span>' + parseFloat(outputStr[i].text.m) * beishuText + '倍' + '</span><a href="javascript:;" title="">X</a></div></li>';
            if ($('.bet-lists').children('li').size() !== 0) {
                $(liStr).insertBefore($('.bet-lists ul li').first());
            } else {
                $(liStr).appendTo($('.bet-lists ul'));
            }
            zhu += parseFloat(outputStr[i].text.n);
            yuan += parseFloat(outputStr[i].text.n) * parseFloat(outputStr[i].text.p) * parseFloat(outputStr[i].text.m) * beishuText;
            outputStr[i].text.m = parseFloat(outputStr[i].text.m) * beishuText.toString();
        };
        $('.zhu').text(zhu);
        $('.yuan').text(yuan);
        //删除当前
        $('.lists-right a').on('tap', function() {
            var _index = $(this).parents('li').index();
            outputStr.splice(_index, 1);
            resetLocalstorage();
            listInit();
        });

        function resetLocalstorage() {
            var arrOutputStr = [];
            for (var i = 0; i < outputStr.length; i++) {
                arrOutputStr.push(JSON.stringify(outputStr[i]));
            };
            var _outputStr = '';
            if (outputStr.length !== 0) {
                _outputStr = arrOutputStr.join('$$');
            }
            localStorage.setItem("outputStr", _outputStr);
        }
    }
    $('.footer-top-left .addone').on('tap', function() {
        var beishuText = parseInt($('.beishu').text());
        if (beishuText + 1 >= 10) {
            $('.beishu').text(10);
        } else {
            $('.beishu').text(beishuText + 1);
        }
        localStorage.setItem("beishu", $('.beishu').text());
        listInit();
    })
    $('.footer-top-left .reone').on('tap', function() {
        var beishuText = parseInt($('.beishu').text());
        if (beishuText - 1 <= 0) {
            $('.beishu').text(1);
        } else {
            $('.beishu').text(beishuText - 1);
        }
        localStorage.setItem("beishu", $('.beishu').text());
        listInit();
    })
    $('.footer-top-right .addone').on('tap', function() {
        var qishuText = parseInt($('.qishu').text());
        if (qishuText + 1 >= 10) {
            $('.qishu').text(10);
        } else {
            $('.qishu').text(qishuText + 1);
        }
    })
    $('.footer-top-right .reone').on('tap', function() {
        var qishuText = parseInt($('.qishu').text());
        if (qishuText - 1 <= 0) {
            $('.qishu').text(1);
        } else {
            $('.qishu').text(qishuText - 1);
        }
    })
    //清空
    $('.clear-all').on('tap', function() {
        var _outputStr = '';
        localStorage.setItem("outputStr", _outputStr);
        localStorage.setItem("beishu", 1);
        listInit();
    })
    // 开奖
    $('.aside a').on('tap', function() {
        kaijiang.start();
    })
    var kaijiang = {
        start: function() {
            $('.reward-box div').each(function(index, el) {
                $(this).find('span').eq(Math.floor(Math.random() * 10)).addClass('active').siblings('span').removeClass('active');
            });
        }
    }
    //回到上一页
    $('.goback').on('tap',function(){
        history.go(-1);
    })
})