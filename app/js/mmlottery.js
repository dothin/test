/* 
 * @Author: gaohuabin
 * @Date:   2016-02-10 14:52:37
 * @Last Modified by:   gaohuabin
 * @Last Modified time: 2016-02-20 18:05:17
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
    var bet = {};
    bet.addFooterActive = function() {
        $('.multiple').addClass('active');
        $('.footer-pirce').addClass('active');
        return this;
    };
    bet.removeFooterActive = function() {
        var b = true;
        $('.ten-number .box-content a').each(function() {
            if ($(this).hasClass('active')) b = false;
        })
        if (b) {
            $('.multiple').removeClass('active');
            $('.footer-pirce').removeClass('active');
        };
        return this;
    };
    bet.getNumberBasketSpan = function() {
        return parseInt($('.number-basket').find('span').text());
    };
    bet.setNumberBasketSpan = function(num) {
        if (num) {
            $('.number-basket').find('span').text(num);
        } else {
            $('.number-basket').find('span').text(bet.getNumberBasketSpan() + 1);
        }
        return this;
    };
    bet.numberBasketSpanShow = function() {
        $('.number-basket').find('span').show();
        return this;
    };
    bet.numberBasketSpanHide = function() {
        $('.number-basket').find('span').text(0).hide();
        return this;
    };
    bet.removeBoxActive = function() {
        $('.box-header a').removeClass('active');
        $('.box-content a').removeClass('active');
        return this;
    };
    bet.checkChoosed = function() {
        var a = {
            b: 0,
            c: 0,
            d: false,
            n: [],
            t: $('.choose-mode').text()
        }
        if (a.t == '一星复式') {
            $(".number-box").each(function() {
                if ($(this).css("display") == 'block') {
                    $(this).find('.box-content').find('a').each(function() {
                        if ($(this).hasClass('active')) a.d = true;
                    })
                }
            })
        } else {
            $(".number-box").each(function() {
                if ($(this).css("display") == 'block') {
                    a.c++;
                    a.d = false;
                    $(this).find('.box-content').find('a').each(function() {
                        if ($(this).hasClass('active')) a.d = true;
                    })
                    a.d && a.n.push(a.d);
                }
            })
            a.c == a.n.length ? a.d = true : a.d = false;
        }
        return a.d;
    };
    bet.getBetNumber = function() {
        var a = {
            n: 0,
            b: null,
            c: [],
            t: $('.choose-mode').text()
        }
        if (bet.checkChoosed()) {
            a.n = 1;
            a.b = bet.getFuShiList().t;
            for (x in a.b) {
                if (a.b[x].length > 0) {
                    a.c.push(a.b[x].length)
                };
            }
            var len = a.c.length;
            if (a.t == '一星复式') {
                a.n = 0;
                for (var i = 0; i < len; i++) {
                    a.n += a.c[i];
                };
            } else {
                for (var i = 0; i < len; i++) {
                    a.n *= a.c[i];
                };
            }
        } else {
            a.n = 0;
        }
        return a.n;
    };
    bet.setTotalPrice = function() {
        var num = $('.footer-pirce .num').text();
        var price = $('.footer-pirce .pri').text();
        var beishu = $('.multiple span').text();
        $('.footer-pirce .total').text((num * price * beishu).toFixed(1) + '元');
        return this;
    };
    bet.setFooterNum = function() {
        $('.footer-pirce').find('.num').text(bet.getBetNumber());
        return this;
    };
    bet.outputStr = function() {
        var a = $('.choose-mode').text();
        if (a.indexOf('和值') > 0) {
            return JSON.stringify(bet.getHeZhiList());
        } else {
            return JSON.stringify(bet.getFuShiList());
        }
    }
    bet.setLocalStorage = function() {
        var outputStr = '';
        if (bet.checkChoosed()) {
            if (localStorage.getItem("outputStr")) {
                outputStr = bet.outputStr() + '$$' + localStorage.getItem("outputStr");
            } else {
                outputStr = bet.outputStr();
            }
            localStorage.setItem("outputStr", outputStr);
        }
        return this;
    }
    bet.getFuShiList = function() {
        var str = {
            text: {
                c: $('.choose-mode').text(),
                n: $('.footer-pirce .num').text(),
                p: $('.footer-pirce .pri').text(),
                m: $('.multiple span').text()
            },
            t: {
                thh: [],
                th: [],
                hu: [],
                te: [],
                s: []
            }
        };
        $(".ten-number .number-box").each(function() {
            var arr = $(this).attr('class').split(' ');
            var a = $(this).find('.box-content').find('a');
            switch (arr[1]) {
                case 'ten-thousand':
                    a.each(function(index, el) {
                        if ($(this).hasClass('active')) {
                            str.t.thh.push($(this).text());
                        };
                    });
                    break;
                case 'thousand':
                    a.each(function(index, el) {
                        if ($(this).hasClass('active')) {
                            str.t.th.push($(this).text());
                        };
                    });
                    break;
                case 'hundred':
                    a.each(function(index, el) {
                        if ($(this).hasClass('active')) {
                            str.t.hu.push($(this).text());
                        };
                    });
                    break;
                case 'ten':
                    a.each(function(index, el) {
                        if ($(this).hasClass('active')) {
                            str.t.te.push($(this).text());
                        };
                    });
                    break;
                case 'single':
                    a.each(function(index, el) {
                        if ($(this).hasClass('active')) {
                            str.t.s.push($(this).text());
                        };
                    });
                    break;
            }
        })
        return str;
    };
    bet.getHeZhiList = function() {
        var str = {
            text: {
                c: $('.choose-mode').text(),
                n: $('.footer-pirce .num').text(),
                p: $('.footer-pirce .pri').text(),
                m: $('.multiple span').text()
            },
            t: {
                thh: []
            }
        };
        $(".hezhi .number-box").each(function() {
            var a = $(this).find('.box-content').find('a');
            a.each(function(index, el) {
                if ($(this).hasClass('active')) {
                    str.t.thh.push($(this).text());
                };
            });
        });
        return str;
    };
    bet.createRandom = function(num, from, to) {
        var arr = [];
        var json = {};
        while (arr.length < num) {
            //产生单个随机数
            var ranNum = Math.floor(Math.random() * (to - from)) + from;
            //通过判断json对象的索引值是否存在 来标记 是否重复
            if (!json[ranNum]) {
                json[ranNum] = 1;
                arr.push(ranNum);
            }
        }
        return arr;
    };
    bet.randChoose = function() {
        var a = {
            chooseModeText: $('.choose-mode').text(),
            arrText: ['五星组选10', '五星组选5', '五星一帆风顺', '五星好事成双', '五星三星报喜', '五星四季发财', '四星组选4'],
            hezhi: function() {
                $(".number-box").each(function() {
                    if ($(this).css("display") == 'block') {
                        $(this).find('.box-content').each(function(i, ele) {
                            $(this).find('a').removeClass('active');
                            $(this).find('a').eq(arr[0]).addClass('active');
                        })
                    }
                })
            },
            oneColumn: function() {
                len = arr.length;
                $(".number-box").each(function() {
                    if ($(this).css("display") == 'block') {
                        $(this).find('.box-content').each(function(i, ele) {
                            $(this).find('a').removeClass('active');
                            for (var i = 0; i < len; i++) {
                                $(this).find('a').eq(arr[i]).addClass('active');
                            };
                        })
                    }
                })
            },
            twoColumn: function() {
                len = arr.length;
                $(".number-box").each(function() {
                    if ($(this).css("display") == 'block') {
                        $(this).find('.box-content').each(function(i, ele) {
                            $(this).find('a').removeClass('active');
                        })
                        if ($(this).index() == 0) {
                            $(this).first().find('.box-content').find('a').eq(Math.floor(Math.random() * 10)).addClass('active');
                        } else {
                            for (var i = 0; i < len; i++) {
                                $(this).last().find('.box-content').find('a').eq(arr[i]).addClass('active');
                            };
                        }
                    }
                })
            }
        }
        if (a.chooseModeText.indexOf('复式') > 0 || a.chooseModeText.indexOf('一码不定位') > 0 || a.chooseModeText.indexOf('包胆') > 0 || a.chooseModeText.indexOf('跨度') > 0 || $.inArray(a.chooseModeText, a.arrText) != -1) {
            $(".number-box").each(function() {
                if ($(this).css("display") == 'block') {
                    $(this).find('.box-content').each(function(i, ele) {
                        $(this).find('a').removeClass('active');
                        $(this).find('a').eq(Math.floor(Math.random() * 10)).addClass('active');
                    })
                }
            })
            if (a.chooseModeText == '一星复式') {
                $(".number-box").each(function(i, ele) {
                    if ($(this).css("display") == 'block') {
                        $(".number-box").find('.box-content').find('a').removeClass('active');
                        $(".number-box").eq(Math.floor(Math.random() * 5)).find('.box-content').find('a').eq(Math.floor(Math.random() * 10)).addClass('active');
                    }
                })
            };
        };
        if (a.chooseModeText.indexOf('三直选和值') > 0) {
            var arr = bet.createRandom(1, 0, 28);
            a.hezhi();
        };
        if (a.chooseModeText.indexOf('三组选和值') > 0) {
            var arr = bet.createRandom(1, 1, 27);
            a.hezhi();
        };
        if (a.chooseModeText.indexOf('二直选和值') > 0) {
            var arr = bet.createRandom(1, 0, 19);
            a.hezhi();
        };
        if (a.chooseModeText.indexOf('二组选和值') > 0) {
            var arr = bet.createRandom(1, 1, 17);
            a.hezhi();
        };
        if (a.chooseModeText.indexOf('组三') > 0 || a.chooseModeText == '四星组选6' || a.chooseModeText.indexOf('二码不定位') > 0) {
            var arr = bet.createRandom(2, 0, 10);
            a.oneColumn();
        };
        if (a.chooseModeText.indexOf('组六') > 0 || a.chooseModeText.indexOf('三码不定位') > 0) {
            var arr = bet.createRandom(3, 0, 10);
            a.oneColumn();
        };
        if (a.chooseModeText == '四星组选24') {
            var arr = bet.createRandom(4, 0, 10);
            a.oneColumn();
        };
        if (a.chooseModeText == '五星组选120') {
            var arr = bet.createRandom(5, 0, 10);
            a.oneColumn();
        };
        if (a.chooseModeText == '四星组选12' || a.chooseModeText == '五星组选20') {
            var arr = bet.createRandom(2, 0, 10);
            a.twoColumn();
        };
        if (a.chooseModeText == '五星组选30') {
            var arr = bet.createRandom(2, 0, 10);
            a.twoColumn();
        };
        if (a.chooseModeText == '五星组选60') {
            var arr = bet.createRandom(3, 0, 10);
            a.twoColumn();
        };
        bet.addFooterActive();
        return this;
    }
    $('.choose-mode').on('tap', function() {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $('.mode-content').animate({
                "height": "0"
            }, 100).hide();
        } else {
            $(this).addClass('active');
            // .show()放前面，为了解决兼容问题
            $('.mode-content').show().animate({
                "height": "340px"
            }, 300);
        }
    })
    $('.price').on('tap', function() {
        if ($(this).text() == '元') {
            $('.footer-pirce .pri').text('0.2');
            $(this).html('角');
            bet.setTotalPrice();
        } else {
            $('.footer-pirce .pri').text('2');
            $(this).html('元');
            bet.setTotalPrice();
        }
    })
    var arrText = ['五星复式.5'];
    init();
    //初始化玩法
    function init() {
        if (localStorage.getItem("items")) {
            var arrItems = localStorage.getItem("items").split(',');
            if (localStorage.getItem("outputStr")) {
                var outputStr = localStorage.getItem("outputStr").split('$$');
                var outputStrLen = outputStr.length;
                bet.setNumberBasketSpan(outputStrLen).numberBasketSpanShow();
            }
            arrText = arrItems;
            var len = arrItems.length;
            for (var i = 0; i < len; i++) {
                var arr = arrItems[i].split('.');
                $('.mode-top ul').append('<li><a href="javascript:;" data-id="' + arr[1] + '" title="">' + arr[0] + '</a></li>');
            };
            $('.mode-top ul li').first().addClass('active');
            $('.choose-mode').text($('.mode-top ul li a').first().text());
            action('5', $('.mode-top ul li a').first());
        } else {
            $('.mode-top ul').append('<li class="active"><a href="javascript:;" data-id="5" title="">五星复式</a></li>');
            $('.choose-mode').text("五星复式");
            action($('.mode-top ul li a').get(0).dataset.id, $('.mode-top ul li a'));
        }
    }
    //玩法头部点击操作
    $('.mode-content .mode-top').on('tap', 'a', function() {
        bet.removeBoxActive();
        bet.removeFooterActive();
        bet.setFooterNum();
        var text = $(this).text();
        var index = $(this).get(0).dataset.id;
        $(this).parent().addClass('active').siblings().removeClass('active');
        $('.choose-mode').removeClass('active').text(text);
        $('.mode-content').animate({
            "height": "0"
        }, 100).hide();
        $('.number-box').hide();
        action(index, $(this));
    })
    //玩法点击操作
    $('.mode-content .items').on('tap', 'a', function() {
        bet.removeBoxActive();
        bet.removeFooterActive();
        bet.setFooterNum();
        var arr = $(this).parents('.items').find('span').text().split('');
        var stars = arr[0] + arr[1];
        var index = $(this).get(0).dataset.id;
        var text = stars + $(this).text();
        var sText = stars + $(this).text() + '.' + index;
        $('.mode-top ul li').removeClass('active');
        if ($.inArray(sText, arrText) == -1) {
            arrText.push(sText);
            $('<li class="active"><a href="javascript:;" data-id="' + index + '" title="">' + text + '</a></li>').insertBefore($('.mode-top ul li').first());
        } else {
            $('.mode-top ul li').each(function() {
                if ($(this).text() == text) {
                    $(this).insertBefore($('.mode-top ul li').first()).addClass('active');
                };
            })
        }
        $('.choose-mode').removeClass('active').text(text);
        $('.mode-content').animate({
            "height": "0"
        }, 100).hide();
        localStorage.setItem("items", arrText);
        $('.number-box').hide();
        action(index, $(this));
    })
    //栏目内操作
    $('.box-content').on('tap', 'a', function() {
        $(this).parents('.number-box').find('.box-header a').removeClass('active');
        bet.addFooterActive();
        if ($('.choose-mode').text().indexOf('包胆') == -1) {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            } else {
                $(this).addClass('active');
            }
        } else {
            $(this).parents('.box-content').find('a').removeClass('active');
            $(this).addClass('active');
        }
        bet.setFooterNum().setTotalPrice();
    })
    //栏目头部，大小单双等操作
    $('.box-header').on('tap', 'a', function() {
        bet.addFooterActive();
        var contenta = $(this).parents('.number-box').find('.box-content a');
        var len = contenta.length;
        var headera = $(this).parents('.number-box').find('.box-header a');
        headera.removeClass('active');
        $(this).addClass('active').parents('.number-box').find('.box-content a').removeClass('active');
        var arr = $(this).get(0).className.split(' ');
        switch (arr[0]) {
            case "big":
                contenta.each(function(i, ele) {
                    if (i >= len / 2) {
                        $(this).addClass('active');
                    };
                })
                break;
            case "small":
                contenta.each(function(i, ele) {
                    if (i < len / 2) {
                        $(this).addClass('active');
                    };
                })
                break;
            case "all":
                contenta.each(function(i, ele) {
                    $(this).addClass('active');
                })
                break;
            case "single":
                contenta.each(function(i, ele) {
                    if (i % 2) {
                        $(this).addClass('active');
                    };
                })
                break;
            case "double":
                contenta.each(function(i, ele) {
                    if (i % 2 == 0) {
                        $(this).addClass('active');
                    };
                })
                break;
            case "clear":
                bet.removeFooterActive();
                break;
        }
        bet.setFooterNum().setTotalPrice();
    })
    // 机选一注
    $('.footer-pirce').on('tap', function() {
        if (!bet.checkChoosed()) {
            bet.removeBoxActive().randChoose().setFooterNum().setTotalPrice();
        } else {
            bet.setNumberBasketSpan().numberBasketSpanShow().setLocalStorage().removeBoxActive().removeFooterActive();
        }
    });
    //机选一注
    $('.rand-choose').on('tap', function() {
        bet.removeBoxActive().randChoose().setFooterNum().setTotalPrice();
    });
    // 号码篮操作
    $('.number-basket').on('tap', function() {
        var span = $(this).find('span');
        if (span.text() == 0) {
            if (!bet.checkChoosed()) {
                bet.removeBoxActive().randChoose().setFooterNum().setTotalPrice();
                $(this).attr('href', 'javascript:;');
            } else {
                $(this).attr('href', 'numberBasket.html');
                bet.setLocalStorage();
            }
        } else {
            if (!bet.checkChoosed()) {
                $(this).attr('href', 'numberBasket.html');
            } else {
                $(this).attr('href', 'numberBasket.html');
                bet.setLocalStorage();
            }
        }
    })
    // 倍数栏显示与隐藏
    $('.multiple').on('tap', function() {
        $('.beitoushu').toggleClass('hide');
    })
    // 倍数操作
    $('.beitoushu .addone').on('tap', function() {
        var multipleText = parseInt($('.multiple span').text());
        if (multipleText + 1 >= 100) {
            $('.multiple span').text(100);
        } else {
            $('.multiple span').text(multipleText + 1);
        }
        bet.setTotalPrice();
    })
    $('.beitoushu .addten').on('tap', function() {
        var multipleText = parseInt($('.multiple span').text());
        if (multipleText + 10 >= 100) {
            $('.multiple span').text(100);
        } else {
            $('.multiple span').text(multipleText + 10);
        }
        bet.setTotalPrice();
    })
    $('.beitoushu .reone').on('tap', function() {
        var multipleText = parseInt($('.multiple span').text());
        $('.multiple span').text(multipleText - 1);
        if (multipleText - 1 <= 0) {
            $('.multiple span').text(1);
        } else {
            $('.multiple span').text(multipleText - 1);
        }
        bet.setTotalPrice();
    })
    $('.beitoushu .reten').on('tap', function() {
        var multipleText = parseInt($('.multiple span').text());
        if (multipleText - 10 <= 0) {
            $('.multiple span').text(1);
        } else {
            $('.multiple span').text(multipleText - 10);
        }
        bet.setTotalPrice();
    })
    // 添加到号码篮
    /*$('.footer-pirce i').on('tap', function() {
        bet.setNumberBasketSpan().numberBasketSpanShow().setLocalStorage();
    })*/
    function action(index, that) {
        // console.log(that.text())
        switch (index) {
            case '1':
                $('.tabs .ten-thousand').show().find('span').hide();
                if ($('.choose-mode').text().indexOf('包胆') > 0) {
                    $('.tabs .ten-thousand').find('.box-header').css('visibility', 'hidden');
                } else {
                    $('.tabs .ten-thousand').find('.box-header').css('visibility', 'visible');
                }
                break;
            case '2':
                $('.tabs .ten-thousand').show();
                $('.tabs .ten-thousand').show().find('span').show();
                $('.tabs .ten-thousand').find('.box-header').css('visibility', 'visible');
                $('.tabs .thousand').show();
                switch ($('.choose-mode').text()) {
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
                        $('.tabs .ten-thousand').hide();
                        $('.tabs .thousand').hide();
                        $('.tabs .ten').show().find('span').text('十位');
                        $('.tabs .single').show().find('span').text('个位');
                        break;
                }
                break;
            case '3':
                $('.tabs .ten-thousand').show();
                $('.tabs .ten-thousand').show().find('span').show();
                $('.tabs .ten-thousand').find('.box-header').css('visibility', 'visible');
                $('.tabs .thousand').show();
                $('.tabs .hundred').show();
                switch ($('.choose-mode').text()) {
                    case '前三复式':
                        $('.tabs .ten-thousand span').show().text('万位');
                        $('.tabs .thousand span').show().text('千位');
                        $('.tabs .hundred span').show().text('百位');
                        break;
                    case '中三复式':
                        $('.tabs .ten-thousand').hide();
                        $('.tabs .thousand').show().find('span').text('千位');
                        $('.tabs .hundred').show().find('span').text('百位');
                        $('.tabs .ten').show().find('span').text('十位');
                        break;
                    case '后三复式':
                        $('.tabs .ten-thousand').hide();
                        $('.tabs .thousand').hide();
                        $('.tabs .hundred').show().find('span').text('百位');
                        $('.tabs .ten').show().find('span').text('十位');
                        $('.tabs .single').show().find('span').text('个位');
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
                $('.tabs .ten-thousand').show().find('span').show();
                $('.tabs .ten-thousand').find('.box-header').css('visibility', 'visible');
                $('.tabs .thousand').show().find('span').text('千位');
                $('.tabs .hundred').show().find('span').text('百位');
                $('.tabs .ten').show().find('span').text('十位');
                $('.tabs .single').show().find('span').text('个位');
                var obj = {};
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