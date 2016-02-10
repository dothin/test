/* 
 * @Author: gaohuabin
 * @Date:   2016-02-10 14:52:37
 * @Last Modified by:   gaohuabin
 * @Last Modified time: 2016-02-10 23:00:56
 */
$(function() {
    /*loader.init();
                var loader={
                tag:true,
                init:function(){
                    if (this.tag) {
                        var width=screen.availWidth;
                        var height=document.documentElement.clientHeight;

                        $(this.defaultHtml).appendTo($('body'));
                        $('.ui-icon-loading').css({
                            'top':height/2
                        });
                        this.tag=false;
                    };
                    
                },
                defaultHtml: "<div class='ui-loader'>" +
                    "<span class='ui-icon-loading'></span>" +
                    "</div>"
              };*/
    $('.choose-mode').on('tap', function() {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $('.mode-content').animate({
                "height": "0",
                "transition": ".1s"
            }, 100);
        } else {
            $(this).addClass('active');
            $('.mode-content').animate({
                "height": "340px",
                "transition": ".4s"
            }, 300);
        }
    })
    $('.price').on('tap', function() {
        if ($(this).text() == '元') {
            $('.footer-pirce .pri').text('0.2');
            $(this).html('角');
            var num = $('.footer-pirce .num').text();
            var price = $('.footer-pirce .pri').text();
            $('.footer-pirce .total').text(totalPrice(num, price));
        } else {
            $('.footer-pirce .pri').text('2');
            $(this).html('元');
            var num = $('.footer-pirce .num').text();
            var price = $('.footer-pirce .pri').text();
            $('.footer-pirce .total').text(totalPrice(num, price));
        }
    })

    function totalPrice(num, price) {
        return num * price + '元';
    }
    var arrText = ['五星复式.5'];
    init();

    function init() {
        if (localStorage.getItem("items")) {
            var arrItems = localStorage.getItem("items").split(',');
            console.log(arrItems)
            arrText = arrItems;
            var len = arrItems.length;

            for (var i = 0; i < len; i++) {
                var arr=arrItems[i].split('.');
                $('.mode-top ul').append('<li><a href="javascript:;" data-id="'+arr[1]+'" title="">' + arr[0] + '</a></li>');
            };
            $('.mode-top ul').get(0).children[0].className = 'active';
            $('.choose-mode').text($('.mode-top ul li').get(0).children[0].innerHTML);
            action('5', $($('.mode-top ul li').get(0).children[0]));
        } else {
            $('.mode-top ul').append('<li class="active"><a href="javascript:;" data-id="5" title="">五星复式</a></li>');
            $('.choose-mode').text("五星复式");
            action($('.mode-top ul li a').get(0).dataset.id, $('.mode-top ul li a'));
        }
    }
    $('.mode-content .mode-top').on('tap', 'a', function() {
        var text = $(this).text();
        var index = $(this).get(0).dataset.id;
        $('.mode-top ul li').each(function(index, el) {
            $(this).removeClass('active');
        });
        $(this).parent().addClass('active');
        $('.choose-mode').removeClass('active').text(text);
        $('.mode-content').animate({
            "height": "0",
            "transition": ".1s"
        }, 100);
        $('.number-box').hide();
        console.log(index)
        action(index, $(this));
    })
    //$('.mode-top ul').
    $('.mode-content .items').on('tap', 'a', function() {
        var arr = $(this).parents('.items').find('span').text().split('');
        var stars = arr[0] + arr[1];
        var index = $(this).get(0).dataset.id;
        var text = stars + $(this).text();
        var sText = stars + $(this).text()+'.'+index;
        if ($.inArray(sText, arrText) == -1) {
            arrText.push(sText);
            $('.mode-top ul li').each(function(index, el) {
                $(this).removeClass('active');
            });
            $('.mode-top ul').get(0).insertBefore($('<li class="active"><a href="javascript:;" data-id="' + index + '" title="">' + text + '</a></li>').get(0), $('.mode-top ul li').get(0));
        } else {
            $('.mode-top ul li').each(function(index, el) {
                $(this).removeClass('active');
                /*if ($(this).text() == text) {
                    var left = $(this).offset().left;
                    $(this).addClass('active').parent().animate({
                        'left': -left
                    })
                };*/
            });
        }
        $('.choose-mode').removeClass('active').text(text);
        $('.mode-content').animate({
            "height": "0",
            "transition": ".1s"
        }, 100);
        localStorage.setItem("items", arrText);
        $('.number-box').hide();
        console.log(index)
        action(index, $(this));
    })

    function action(index, that) {
        console.log(that.text())
        switch (index) {
            case '1':
                $('.tabs .ten-thousand').show().find('span').hide();
                break;
            case '2':
                $('.tabs .ten-thousand').show();
                $('.tabs .thousand').show();
                switch($('.choose-mode').text()){
                    case '五星组选60':
                        $('.tabs .ten-thousand span').show().text('二重号位');
                        $('.tabs .thousand span').show().text('单号位');
                        break;
                    case '五星组选30':
                        $('.tabs .ten-thousand span').show().text('二重号位');
                        $('.tabs .thousand span').show().text('单号位');
                        break;
                    case '五星组选20':
                        $('.tabs .ten-thousand span').show().text('三重号位');
                        $('.tabs .thousand span').show().text('单号位');
                        break;
                    case '五星组选10':
                        $('.tabs .ten-thousand span').show().text('三重号位');
                        $('.tabs .thousand span').show().text('二重号位');
                        break;
                    case '五星组选5':
                        $('.tabs .ten-thousand span').show().text('四重号位');
                        $('.tabs .thousand span').show().text('单号位');
                        break;
                    case '四星组选4':
                        $('.tabs .ten-thousand span').show().text('三重号位');
                        $('.tabs .thousand span').show().text('单号位');
                        break;
                    case '前二复式':
                        $('.tabs .ten-thousand span').show().text('万位');
                        $('.tabs .thousand span').show().text('千位');
                        break;
                    case '后二复式':
                        $('.tabs .ten-thousand span').show().text('十位');
                        $('.tabs .thousand span').show().text('个位');
                        break;
                }
                break;
            case '3':
                $('.tabs .ten-thousand').show();
                $('.tabs .thousand').show();
                $('.tabs .hundred').show();
                switch($('.choose-mode').text()){
                    case '前三复式':
                        $('.tabs .ten-thousand span').show().text('万位');
                        $('.tabs .thousand span').show().text('千位');
                        $('.tabs .hundred span').show().text('百位');
                        break;
                    case '中三复式':
                        $('.tabs .ten-thousand span').show().text('千位');
                        $('.tabs .thousand span').show().text('百位');
                        $('.tabs .hundred span').show().text('十位');
                        break;
                    case '后三复式':
                        $('.tabs .ten-thousand span').show().text('百位');
                        $('.tabs .thousand span').show().text('十位');
                        $('.tabs .hundred span').show().text('个位');
                        break;
                }
                break;
            case '4':
                $('.tabs .thousand').show().find('span').text('千位');
                $('.tabs .hundred').show().find('span').text('百位');
                $('.tabs .ten').show().find('span').text('十位');
                $('.tabs .single').show().find('span').text('个位');
                break;
            case '5':
                $('.tabs .ten-thousand').show().find('span').text('万位');
                $('.tabs .thousand').show().find('span').text('千位');
                $('.tabs .hundred').show().find('span').text('百位');
                $('.tabs .ten').show().find('span').text('十位');
                $('.tabs .single').show().find('span').text('个位');
                break;
            case '6':
                $('.tabs .three-direct').show();
                break;
            case '7':
                $('.tabs .three-group').show();
                break;
            case '8':
                $('.tabs .two-direct').show();
                break;
            case '9':
                $('.tabs .two-group').show();
                break;
            default:
                break;
        }
    }
})