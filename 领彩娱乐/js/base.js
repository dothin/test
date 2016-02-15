/* 
 * @Author: gaohuabin
 * @Date:   2016-02-02 20:05:57
 * @Last Modified by:   gaohuabin
 * @Last Modified time: 2016-02-13 23:14:47
 */
$.extend({
    placeholder: function(obj) {
        obj.each(function(i, e) {
            var text = $(this).attr('placeholder');
            if ($(this).attr('type') == 'password') {
                var left = $(this).position().left;
                var width = $(this).width();
                var top = $(this).position().top;
                var span = $('<span class="text">' + text + '</span>');
                span.appendTo($(this).parent()).css({
                    'position': 'absolute',
                    'left': left,
                    'top': top,
                    'color': '#999',
                    'font-size': '19px',
                    'width': width
                });
                if ($(this).val() != '') {
                    span.hide();
                };
                $(this).focus(function() {
                    span.hide();
                });
                $(this).blur(function() {
                    if ($(this).val() == '') {
                        span.show();
                    } else {
                        span.hide();
                    }
                });
            } else {
                $(this).val(text).css({
                    'color': '#999',
                    'font-size': '19px'
                });
                $(this).focus(function() {
                    if ($(this).val() == text) {
                        $(this).val('').css({
                            'color': '#000'
                        });
                    } else {
                        $(this).css({
                            'color': '#000'
                        });
                    }
                });
                $(this).blur(function() {
                    if ($(this).val() == '') {
                        $(this).val(text).css({
                            'color': '#999'
                        });
                    } else {
                        $(this).val() = '';
                    }
                });
            }
        })
    }
})
$(function() {
    var isPlaceholderSupport = (function() {
        return 'placeholder' in document.createElement('input');
    })();
    if (!isPlaceholderSupport) {
        var placeholder = $('input[placeholder]');
        $.placeholder(placeholder);
    };
    $('.login-form p i').click(function() {
        if ($('.login-form p input').prop('checked')) {
            $('.login-form p input').removeAttr('checked');
            $(this).removeClass('checked').addClass('unchecked');
        } else {
            $('.login-form p input').prop('checked', true);
            $(this).removeClass('unchecked').addClass('checked');
        }
    });
    //查看详情
    //slideUp->animate
    //ie8下slideUp吃下margin
    var height = $('.detail').height();
    $('.detail').height(0);
    $('.active-part a').each(function() {
        $(this).click(function(e) {
            var detail = $(this).parents('.active-part').find('.detail');
            if ($(this).html() == '查看详情' && detail.height() == 0) {
                $(this).html('收起');
                detail.show().animate({
                    height: height
                });
            } else {
                $(this).html('查看详情');
                detail.animate({
                    height: 0
                });
            }
        });
    });
    initImgHeight();

    function initImgHeight() {
        var height = $(window).height(),headerHeight=$('.header').height();
        $('.advantage-section').height(height-headerHeight);
        //$('.index .header .container').height(height-headerHeight);

    }
    $(window).on('resize', function() {
        initImgHeight();
    })
})
//测速
var urlList = ["http://www.baidu.com", "http://www.yahoo.com", "http://www.google.com", "http://www.yahoo9.com", "http://www.yahoo6.com", "http://www.yahoo7.com", "http://www.yahoo2.com"];
var url = $("#url_val");
var err_tip = $("#error_tip");
var suc_tip = $("#success_tip");
var list = $("#list");
url.focus(function() {
    err_tip.hide();
    suc_tip.hide();
});

function checkURL() {
    //alert(url.val());
    if (url.val() == "") {
        err_tip.html("(请输入您要检测的域名)").show();
    } else if (!/^[0-9a-zA-Z]+[0-9a-zA-Z\.-]*\.[a-zA-Z]{2,4}$/.test(url.val().replace(/\s+/g, "").replace(/[a-zA-z]+:\/\/+/, ""))) {
        err_tip.html("(您填写的格式有误，请重新填写完整域名。)").show();
    } else {
        var nowURL = "http://" + url.val().replace(/\s+/g, "").replace(/[a-zA-z]+:\/\/+/, "");
        for (i = 0; i < urlList.length; i++) {
            if (nowURL == urlList[i] || nowURL == urlList[i].replace("www.", "")) {
                suc_tip.html("(此域名为财富娱乐官方站点，值得信赖)").show();
                return false;
            }
        }
        err_tip.html("(此域名切勿填写您的账号密码，以免上当受骗)").show();
    }
    return false;
    //setTimeout(function(){err_tip.hide()},5000);
}
var ping = 1;
setInterval("ping++", 100);
newRequest();

function RequestAgain() {
    $("#list>li").each(function() {
        $(this).find("i").html("默认").get(0).className = "default";
        $(this).find("span").html('测试中...').get(0).className = "bg_default";
        $(this).find("a").attr("href", "javascript:;");
    })
    ping = 1;
    newRequest();
}

function newRequest() {
    //  aler("sss");
    for (var i = 0; i < urlList.length; i++) {
        $("#list>li").eq(i).find("span").html('测试中...');
        var msinputvalue = urlList[i];
        $("#list>li").eq(i).append("<img src=" + urlList[i] + "/" + Math.random() + " width='1' height='1' onerror='autotest(" + i + ")' style='display:none'>");
    }
}

function autotest(i) {
    if (ping * 10 <= 69) {
        $("#list>li").eq(i).find("i").html("极速").get(0).className = "fast";
        $("#list>li").eq(i).find("span").html(urlList[i]).addClass('bg_fast');
        $("#list>li").eq(i).find("a").attr("href", urlList[i]);
    } else if (ping * 10 > 69 && ping * 10 <= 149) {
        $("#list>li").eq(i).find("i").html("一般").get(0).className = "general";
        $("#list>li").eq(i).find("span").html(urlList[i]).addClass('bg_general');
        $("#list>li").eq(i).find("a").attr("href", urlList[i]);
    } else if (ping * 10 > 150 && ping * 10 <= 500) {
        $("#list>li").eq(i).find("i").html("拥挤").get(0).className = "crowded";
        $("#list>li").eq(i).find("span").html(urlList[i]).addClass('bg_crowded');
        $("#list>li").eq(i).find("a").attr("href", urlList[i]);
    } else {
        $("#list>li").eq(i).find("i").html("堵塞").get(0).className = "jam";
        $("#list>li").eq(i).find("span").html(urlList[i]).addClass('bg_jam');
        $("#list>li").eq(i).find("a").attr("href", urlList[i]);
    }
    $("#list>li").eq(i).find("img").remove();
}