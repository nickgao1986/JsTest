

		
/*	requestAnimationFrame兼容函数	*/
(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    }
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
    }
})();

$(function () {
	
	//	调用 百度分享
	window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"2","bdMiniList":false,"bdPic":"","bdStyle":"0","bdSize":"24"},"share":{}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)];
	
	
    //mqfix(); //	IE8媒体查询样式延迟显示的处理

    htmlSize(750); //	rem缩放函数调用

    screenContainer('js-nopad'); //	container满屏高度设置

    scrollPosfix('pos-fix'); //	fixed定位元素的横向滚动显示

    scrollShow('.js-scroller', 'x-show', 0); //	滚动定位元素

    goTop('.js-gotop'); //	返回顶部



    //	sideBarPos('.side-bar',1250,45);			//	侧边栏定位调用

    $('input, textarea').placeholder(); //	调用placeholder插件

 
    //	移动端 点击 菜单按钮 展开/收起 导航层
    $('.x-header .menu-btn').on('click', function () {
        var hd = $('.x-header');
        if (!hd.hasClass('menu-open')) {
            hd.addClass('menu-open');
            if ($('.x-header').css('position') === 'fixed') {
                unWinScroll();
            } else {
                $('body, html').animate({
                    scrollTop: 0
                }, 100, function () {
                    unWinScroll();
                });
            }
        } else {
            hd.removeClass('menu-open');
            enWinScroll();
        }
    });

    //	移动端 点击 导航链接 收起 弹出导航层（用于解决点击锚点导航在页面没刷新的情况下收起弹出的导航层）
    $('.nav-lv a[href]').on('click', function () {
        $('.x-header').removeClass('menu-open');
        enWinScroll();
    });

    //	移动端 点击 导航项的箭头 展开/收起 子级导航
    $('.nav-mod .arr').on('click', function () {
        var _this = $(this);
        var par = _this.closest('.nav-item');
        if (!par.hasClass('act')) {
            par.addClass('act').siblings('.nav-item').removeClass('act').children('.nav-lv').slideUp(0);
            _this.parent().siblings('.nav-lv').slideDown(200);
        } else {
            par.removeClass('act').children('.nav-lv').slideUp(200);
        }
    });

    //	pc端搜索
    $('.search-trigger').on('click', function (e) {
        if (!$('.search-box').hasClass('x-show')) {
            e.stopPropagation();
            $('.search-box').addClass('x-show');
        }
    });

    $('.search-box').on('click', function (e) {
        e.stopPropagation();
    });

    $(document).on('click', function () {
        if ($('.search-box').hasClass('x-show')) {
            $('.search-box').removeClass('x-show');
        }
    });

    //	关闭弹窗
    /*$('.pop-close, .pop-overlay').on('click', function (e) {
        e.stopPropagation();
        $(this).parents('.pop-mod').removeClass('x-show');
        enWinScroll();
    });
*/
    //	下拉框
    $('.select-mod').each(function () {
        var obj = $(this);
        var selectBtn = obj.find('.select-btn');
        var selectTit = obj.find('.select-tit');
        var selectOpts = obj.find('.select-opts');
        var selectQue = obj.find('.squery-list');
        var selectIpt = obj.find('.select-input');
        var selectNat = obj.find('.select-native');
        var val = obj.find('.select-val');

        selectOpts.mCustomScrollbar({
            mouseWheel: {
                preventDefault: true
            }
        });

        selectQue.mCustomScrollbar();

        selectBtn.on('click', function () {
            if (!device().isMobile) {
                if (!obj.hasClass('sc-show')) {
                    obj.addClass('sc-show');
                } else {
                    obj.removeClass('sc-show');
                }
            }
        });

        selectTit.on('click', function () {
            var _this = $(this);
            var grp = _this.parents('.select-grp');
            if (!grp.hasClass('open')) {
                grp.addClass('open').siblings('.select-grp').removeClass('open');
                selectOpts.mCustomScrollbar("scrollTo", grp, {
                    scrollInertia: 0
                });
            } else {
                grp.removeClass('open');
            }
        });

        selectNat.on('change', function () {
            var _this = $(this);

            obj.find('.select-item').eq(_this.get(0).selectedIndex).trigger('click');
        });

        obj.on('click', '.select-item', function () {
            var _this = $(this);
            var ptxt = _this.parent().siblings('.select-tit').text();
            var text = !ptxt ? _this.text() : ptxt + ' - ' + _this.text();

            if (!_this.hasClass('selected')) {
                obj.find('.select-item').removeClass('selected');
                _this.addClass('selected');
                obj.removeClass('sc-show');
                val.text(text);
                selectIpt.val(text);
                if (selectNat[0]) {
                    selectNat[0].selectedindex = _this.index();
                }
                if (val.hasClass('placeholder')) {
                    val.removeClass('placeholder');
                }
            }
        });

        obj.on('click', '.squery-item', function () {
            var _this = $(this);
            var text = _this.text();

            if (!_this.hasClass('selected')) {
                _this.addClass('selected').siblings().removeClass('selected');
                //				obj.removeClass('sq-show');
                val.text(text);
                selectIpt.val(text);
                if (val.hasClass('placeholder')) {
                    val.removeClass('placeholder');
                }
            }
        });

        if (!!obj.data('selectClickup')) {
            selectOpts.data("mCS").opt.mouseWheel.preventDefault = false;

            obj.on('mouseenter', function () {
                obj.addClass('hover');
            });

            obj.on('mouseleave', function () {
                obj.removeClass('hover');
            });

            $(document).on('click', function () {
                if (!obj.hasClass('hover')) {
                    obj.removeClass('sc-show');
                }
            });
        } else {
            obj.on('mouseleave', function () {
                obj.removeClass('sc-show');
            });
        }

        selectIpt.on('focus', function () {
            obj.addClass('sq-show');
        });

        selectIpt.on('blur', function () {
            setTimeout(function () {
                obj.removeClass('sq-show');
            }, 300);
        });

    });

    //	tab切换模块
    $('.tab-mod').each(function () {
        var _this = $(this);
        var _bar = _this.children('.tab-bar');
        var _term = _bar.find('.tab-term');
        var _cont = _this.children('.tab-cont');
        var _item = _cont.children('.tab-item');

        if (_bar.find('.cur').length < 1) {
            _term.eq(0).addClass('cur');
        }
        var _cur = _bar.find('.cur');

        _item.eq(_cur.index()).addClass('act');
        _term.on('click', function () {
            var $this = $(this);
            if (!$this.hasClass('cur')) {
                $this.addClass('cur').siblings('.tab-term').removeClass('cur');
                _item.eq($this.index()).addClass('act').siblings('.tab-item').removeClass('act');
            }
        });
    });


    ///
});


/* Function */

/*	IE8媒体查询样式延迟显示的处理	*/
function mqfix() {
    var load = $('<div style="position: fixed; left: 0; top: 0; right: 0; bottom: 0; background: #fff; z-index: 999999;"></div>');

    $('body').append(load[0]);

    $(window).on('load', function () {
        if ($.support.leadingWhitespace) {
            load.fadeOut(100, function () {
                load.remove();
            });
        } else {
            setTimeout(function () {
                load.fadeOut(100, function () {
                    load.remove();
                });
            }, 600);
        }
    });
}

/*	返回顶部	*/
function goTop(cls) { //	cls-[字符串]	类名
    $(cls).on('click', function () {
        $('body, html').stop().animate({
            scrollTop: 0
        }, 400 + $(window).scrollTop() * 0.3);
    });
}

/*	哈希锚点滚动	*/
function haScroll(cls) { //	cls-[字符串]	类名，侦测作为锚点的 A 元素和 非 A 元素 cls 的点击事件触发锚点跳转（目标为 A 元素的 href 或 非 A 元素 cls 的 data-x-href），目标的 data-x-offset 为偏移量，负值向上偏移，正值向下偏移
    if($(window).width()<=750){return;}
    var lAnchors = location.hash;
    var lOffset;
    if ($(lAnchors).length) {
        lOffset = $(lAnchors).data('x-offset') || 0;

        $('body, html').stop().animate({
            scrollTop: $(lAnchors).offset().top - lOffset
        }, 500);
        
    }

    $('a[href^="#"], ' + cls).on('click', function (e) {
        var cAnchors = $(this).attr('href') || $(this).data('x-href');
        if (/#$/.test(cAnchors)) return;
        var cOffset = $(cAnchors).data('x-offset');
        var cOffset = $(cAnchors).data('x-offset') || 0;
        var target = e.target;

        if (typeof cOffset === 'string') {
            cOffset = $(cOffset).height();
        } else if (typeof cOffset === 'number') {
            cOffset = cOffset;
        } else {
            cOffset = 0;
        }

        if ($(cAnchors).length && (target == this ? true : !(/(INPUT|TEXTAREA|BUTTON|SELECT|A)/i).test(target.tagName))) {
            e.preventDefault();
            $('body, html').stop().animate({
                scrollTop: $(cAnchors).offset().top - cOffset
            }, 400);
        }
    });
}
$(function(){haScroll();})
/*	rem缩放函数	*/
function htmlSize(px) { //	px-[整数] 设计尺寸
    //	if(device().isMobile){
    foo();

    function foo() {
        var ww = $(window).width() < 320 ? 320 : $(window).width();
        if (ww > px) {
            $('html').css({
                'font-size': '14px'
            });
        } else {
            $('html').css({
                'font-size': (ww / px) * 100 + 'px'
            });
        }
    }

    $(window).on('resize', foo);
    //	}
}

/*	百度地图	*/
function loadMap() {
    var script = document.createElement("script");
    script.src = "http://api.map.baidu.com/api?v=3.0&ak=3c3f2a3587ab7a1d7ac9f2b326d66ec8&callback=createMap";
    document.body.appendChild(script);
}

function createMap() {
    var bdmap = $('#bdmap'),
        map = new BMap.Map(bdmap[0]),
        jData = [];

    window.map = map;

    map.centerAndZoom(new BMap.Point(116.404, 39.915), 18);
    bdmap.data('bdmap', map);

    //addMapControl(); //	向地图添加控件
    //	setMapEvent();			//	设置地图事件
    //	setMapStyle();		  //	设置地图风格	http://lbsyun.baidu.com/custom/list.htm
    dataFun(); //	调用查询函数

    function addMapControl() {
        map.addControl(new BMap.NavigationControl()); //	平移缩放控件
    }

    function setMapEvent() {
        map.disableDragging(); //	禁用地图拖拽(默认开启)
        map.enableScrollWheelZoom(); //	开启滚轮缩放(默认禁用)
    }

    function setMapStyle() {
        map.setMapStyle({
            style: 'midnight'
        }); //	normal、dark、midnight、grayscale、hardedge
    }

    function dataFun() {
        var dList = bdmap.data('list'),
            dSelected = (bdmap.data('selected') == undefined || bdmap.data('selected') < 0) ? -1 : bdmap.data('selected'),
            dInfo = bdmap.data('info'),
            dShowinfo = bdmap.data('showinfo'),
            dPoint = bdmap.data('point'),
            dSearch = bdmap.data('search');

        var $list = $('.' + dList),
            $infos = $('.' + $list.data('infos')),
            $syncs = $('.' + $list.data('syncs'));

        jData.push({
            par: bdmap,
            cld: bdmap,
            idx: 0,
            info: $('.' + dInfo),
            point: dPoint,
            search: dSearch,
            onoff: true
        });

        if (dList) {
            $list.children().each(function (idx, ele) {
               
                jData.push({
                    par: $list,
                    cld: $(ele),
                    idx: idx,
                    info: $infos.children().eq(idx),
                    point: $(ele).data('point'),
                    search: $(ele).data('search'),
                    onoff: true
                });
            });

            if (dSelected >= 0) {
                $list.children().removeClass('cur').eq(dSelected).addClass('cur');
                $syncs.children().removeClass('act').eq(dSelected).addClass('act');
            }

         //   foo(dSelected + 1);
          //  var timter=0;
            $list.children().on('click', function () {
                
                var _this = $(this);
                var _idx = _this.index();
              //  clearTimeout(timter);
             //   timter=setTimeout(function(){
                    if (!_this.hasClass('cur')) {
                        $list.children().removeClass('cur').eq(_idx).addClass('cur');
                        $syncs.children().removeClass('act').eq(_idx).addClass('act');
                        foo(_idx + 1);
                    }
           //     },100);
            });
            
            $list.children().eq(0).trigger("click");
    
            
            
        } else {
            foo(0);
        }

        function foo(idx) {
            var _idx = idx; //console.log(jData[_idx].point);
            if (jData[_idx].point) {
                if (jData[_idx].info.length > 0) {
                    addMapOverlay(jData[_idx]);
                }
               /*  else {
                    console.warn('指定坐标模式下必须同时指定信息框 (data-info)');
                    return;
                }*/
            } else if (jData[_idx].search) {
                serchMap(jData[_idx]);
            } else {
                console.warn('坐标点 或 查询字符串 (data-point / data-search) 均未指定');
            }
        }

        function serchMap(data) {
            var _data = data;
            var local = new BMap.LocalSearch(map);

            if (_data.info.length > 0) {
                local = new BMap.LocalSearch(map);
            } else {
                local = new BMap.LocalSearch(map, {
                    renderOptions: {
                        map: map
                    }
                });
                local.setPageCapacity(1);
            }

            local.search(_data.search, {
                forceLocal: false
            });

            if (_data.info.length < 1) return;

            local.setSearchCompleteCallback(function (ldata) {
                if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                    if (ldata.getPoi(0) && !_data.point) {
                        _data.point = [ldata.getPoi(0).point.lng, ldata.getPoi(0).point.lat];
                        addMapOverlay(_data);
                    }
                }
                
            });
        }
        
        function addMapOverlay(data) {
           
            //		var myIcon = new BMap.Icon("http://lbsyun.baidu.com/jsdemo/img/fox.gif", new BMap.Size(300,157));		//	自定义标注图标
            //		var marker = new BMap.Marker(pt,{icon:myIcon});		//	标注点
            var _data = data;
            var point = new BMap.Point(_data.point[0], _data.point[1]);
            var marker = new BMap.Marker(point);
            var $ele = _data.info.length > 1 ? $('.' + _data.info) : _data.info;
            var ifcont, opts, infoWindow;

            if ($ele.length > 0) {
                ifcont = $ele.html();
                opts = {
                    width: $ele.width()
                };
                infoWindow = new BMap.InfoWindow(ifcont, opts);
               marker.addEventListener("click", function (e) {
                    marker.openInfoWindow(infoWindow);
                });
            }

            if (_data.onoff) {
                _data.onoff = false;
                map.addOverlay(marker);
                marker.setAnimation(BMAP_ANIMATION_BOUNCE); //	跳动的动画
                _data.marker = marker;
            }

            map.panTo(point,true);

            if (_data.par != _data.cld || bdmap.data('showinfo')) {
               _data.marker.openInfoWindow(infoWindow);
                setTimeout(function () {
                    if($(window).width() > 750){
                        map.panBy(-250,0)
                    }
                }, 300);
            }
        }
    }
}

/*	随机正负1	*/
function ranPlus() {
    var ran = Math.random();
    return Math.random() > 0.5 ? 1 : -1
}

/*	获取滚动条宽度	*/
function getScrollBarWidth() {
    var rw = 0,
        wh = 0,
        bh = 0;
    wh = $(window).height();
    bh = $('body').height();
    if (bh > wh) {
        if (!$('body').data('scrollBarWidth')) {
            $('body').append('<div class="fnScrollBarWrap" style="position: fixed; left: 0; top: 0; width: 100px; height: 100px; overflow: auto; visibility: hidden; z-index: -9999;"><div class="fnScrollBarInner" style="width: 100%; height: 200px;"></div></div>');
            rw = 100 - $('.fnScrollBarInner').width();
            $('body').data('scrollBarWidth', rw);
            $('.fnScrollBarWrap').remove();
        } else {
            rw = $('body').data('scrollBarWidth');
        }
    }
    return rw;
}

/*	禁止窗口滚动	*/
function unWinScroll() {
    var top = $(window).scrollTop();
    $('body').css({
        'position': 'fixed',
        'top': -top + 'px',
        'left': '0px',
        'right': getScrollBarWidth() + 'px'
    }).data('winScroll', top);
}

/*	释放窗口滚动	*/
function enWinScroll() {
    $('body').removeAttr('style');
    $(window).scrollTop($('body').data('winScroll'));
}

/*	禁止选中	*/
function unSelect(ele) { //	ele-[字符串]	操作对象，通常设为body
    $(ele).attr('unselectable', 'on').css({
        '-moz-user-select': '-moz-none',
        '-moz-user-select': 'none',
        '-o-user-select': 'none',
        '-khtml-user-select': 'none',
        /* you could also put this in a class */
        '-webkit-user-select': 'none',
        /* and add the CSS class here instead */
        '-ms-user-select': 'none',
        'user-select': 'none'
    }).on('selectstart', function () {
        return false;
    });
}

/*	释放选中	*/
function enSelect(ele) { //	ele-[字符串]	被禁止选中的对象
    $(ele).attr('unselectable', 'off').css({
        '-moz-user-select': 'text',
        '-moz-user-select': 'text',
        '-o-user-select': 'text',
        '-khtml-user-select': 'text',
        /* you could also put this in a class */
        '-webkit-user-select': 'text',
        /* and add the CSS class here instead */
        '-ms-user-select': 'text',
        'user-select': 'text'
    }).off('selectstart');
}

/*	多行文本省略号	*/
function ellipsis(e, h) {
    $(e).each(function () {
        var $p = $(this);
        while ($p.outerHeight() > h) {
            $p.text($p.text().replace(/(\s)*([a-zA-Z0-9]+|\W)(\.\.\.)?$/, "..."));
        }
    });
}

/*	滚动tab	*/
function scrollTab(ele) {
    var scrolltab = $(ele);
    var scrollitem = scrolltab.find('li');
    var myScroll = new IScroll(scrolltab[0], {
        //		momentum: false,
        mouseWheel: true,
        scrollX: true,
        scrollY: false,
        click: true,
        tap: true
    });

    scrolltab.on('touchmove', function (e) {
        e.preventDefault();
    });

    scrollitem.on('tap', function () {
        if (!$(this).hasClass('cur')) {
            $(this).addClass('cur').siblings().removeClass('cur');
            myScroll.scrollToElement(this, 500, true, null, IScroll.utils.ease.circular);
        }
    });
}

/*	侧边栏定位	*/
function sideBarPos(ele, wrap, n) {
    var sBar = $(ele);
    sBar.css('margin-left', wrap / 2 + n + 'px');
    var sWidth = sBar.width() + n;
    var gWidth = wrap + sWidth * 2;

    rePos();

    $(window).on('resize', rePos);

    function rePos() {
        if (sBar.offset().left + sBar.width() < gWidth) {
            sBar.css({
                'left': 'auto',
                'right': 0
            });
        } else {
            sBar.css({
                'left': '50%',
                'right': 'auto'
            });
        }
    }
}

/*	模拟 background-size:contain 算法	*/
function fixContain(ele, node, w, h) {

}

/*	模拟 background-size:cover 算法	*/
function fixCover(ele, node, w, h, limit, winw, winh, pos) { //	ele-元素对象（父级）,node-子元素类型（为空默认子元素）,w-元素原始宽度,h-元素原始高度,limit-元素对象最小宽度,winw-设为窗口宽度,winh-设为窗口高度,pos-是否z绝对定位
    var _this = $(ele);
    if (winw) {
        _this.css({
            'width': $(window).width(),
            'min-width': limit + 'px'
        });
    }
    if (winh) {
        _this.css('height', $(window).height());
    }
    var per = w / h;
    var ww = _this.width();
    var wh = _this.height();
    var pw = wh * per;
    var ph = ww / per;
    var cld = null;
    if (node == '') {
        cld = _this.children();
    } else {
        cld = _this.find(node);
    }
    if (pos) {
        cld.css({
            'position': 'absolute',
            'left': '0',
            'top': '0'
        });
    }
    cld.css({
        'margin-top': 0,
        'margin-left': 0,
        'max-width': 'none',
        'max-height': 'none'
    });
    if (ww < pw) {
        cld.css({
            'width': pw + 'px',
            'height': wh + 'px',
            'margin-left': (ww - pw) * 0.5 + 'px'
        });
    } else {
        cld.css({
            'width': ww + 'px',
            'height': ph + 'px',
            'margin-top': (wh - ph) * 0.5 + 'px'
        });
    }
}

/*	行宽间距计算器	*/
function rowWidth(n, w, min, max) { //	n-元素数量,w-父级宽度,min-最小间距,max-最大间距
    var item = [];

    for (var i = min; i <= max; i++) {
        if ((w - (n - 1) * i) % n == 0) {
            item.push('width:' + (w - (n - 1) * i) / n + ', margin:' + i);
        }
    }
    return item;
}

/*	判断客户端设备类型 http://devicedetector.net	*/
function device() {
    var ua = navigator.userAgent || navigator.vendor || window.opera || '';

    var fullNameRe = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i;
    var prefixRe = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;
    var fullNameMobileRe = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i;
    var prefixMobileRe = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;

    var dd = {
        isPhone: !!(fullNameRe.test(ua) || prefixRe.test(ua.substr(0, 4))),
        isMobile: !!(fullNameMobileRe.test(ua) || prefixMobileRe.test(ua.substr(0, 4))),
        isTablet: (!!(fullNameRe.test(ua) || prefixRe.test(ua.substr(0, 4)))) && !(!!(fullNameMobileRe.test(ua) || prefixMobileRe.test(ua.substr(0, 4)))),
        isWechat: (ua.toLowerCase().match(/MicroMessenger/i) == 'micromessenger')
    };

    return dd;
}

//	打开弹窗
function popShow(ele) {
    $(ele).addClass('x-show');
    unWinScroll();
}

//	关闭弹窗
function popHide() {
    $('.pop-mod').removeClass('x-show');
    enWinScroll();
}

/*	滚动定位元素	*/
function scrollShow(ele, cls, range) { //	ele-[字符串] 类名(要加‘.’) 元素对象; cls-[字符串] 类名(不要加‘.’) 对象显示状态样式名； range-[整数] window 的 scrollTop 大于 range 时 ele 添加 cls
    if ($(ele).length < 1) return;
    var posbtm = parseInt($(ele).css('bottom'));

    foo();

    $(window).on('resize', foo);

    $(window).on('scroll', function () {
        if ($('body').css('position') !== 'fixed') {
            foo();
        }
    });

    function foo() {
        if ($(window).scrollTop() > range) {
            if (!$(ele).hasClass(cls)) {
                $(ele).addClass(cls);
            }
        //    if (($(window).scrollTop() + $(window).height()) > $('.x-footer').offset().top) {
         //       $(ele).css('bottom', $(window).scrollTop() + $(window).height() - $('.x-footer').offset().top + 'px');
          //  } else {
              //  if (parseInt($(ele).css('bottom')) != posbtm) {
               //     $(ele).css('bottom', posbtm + 'px');
              //  }
          //  }
        }
         else {
            if ($(ele).hasClass(cls)) {
                $(ele).removeClass(cls);
            }
        }

        //		if($('.x-wrap').innerWidth() < $('.x-container').width()){
        //			$(ele).css({'left': '50%', 'right': 'auto', 'margin-left': $('.x-wrap').innerWidth() / 2 + 10 +'px'});
        //		}else{
        //			$(ele).css({'left': 'auto', 'right': '0', 'margin-left': '0px'});
        //		}
    }
}

/*	fixed定位元素的横向滚动显示	*/
function scrollPosfix(ele) { //	ele-[字符串] 类名(不要加‘.’)
    foo();

    $(window).on('scroll', foo);

    function foo() {
        var posEle = $('.' + ele);
        if ($(window).scrollLeft() > 0) {
            if (posEle.hasClass(ele)) {
                posEle.css('margin-left', -$(window).scrollLeft() + 'px');
            } else {
                posEle.css('margin-left', '0px');
                posEle = null;
            }
        }
    }
}

/*	container满屏高度设置	*/
function screenContainer(cls) { //	cls-[字符串] 类名(不要加‘.’) 当x-container设置此类名时，函数不会为x-container添加padding值来填充x-header的高度
    var container = $('.x-container');
    var header = $('.x-header');
    var footer = $('.x-footer');

    foo();

    function foo() {
        var wHeight = $(window).height();
        var hHeight = header.innerHeight();
        var fHeight = footer.innerHeight();

        if (header.css('position') === 'fixed' || header.css('position') === 'absolute') {
            if (container.hasClass(cls)) {
                container.css({
                    'min-height': wHeight - fHeight + 'px'
                });
            } else {
                if (container.css('box-sizing') === 'border-box') {
                    container.css({
                        'min-height': wHeight - fHeight + 'px'
                    });
                } else {
                    container.css({
                        'min-height': wHeight - fHeight - hHeight + 'px'
                    });
                }
            }
        } else {
            container.css({
                'min-height': wHeight - fHeight - hHeight + 'px'
            });
        }
    }

    $(window).on('load', foo);

    $(window).on('resize', foo);
}

/*	基于xRoll触发的翻滚计数器，[par]需调用xRoll	*/
function rollNumber(par, rate, cld, data, dur) { //par, rate-回调函数提供的参数 cld-数字子集 data-子集data名(用来存储数字) dur-滚动时间
    par.find(cld).each(function () {

        var ele = $(this),
            demo = {
                score: 0
            },
            num = ele.data(data) + '',
            fix = num.split('.') || num,
            len = fix.length > 1 ? fix[1].length : 0;

        if (ele.data('onOff') === undefined) {
            ele.data('onOff', true);
        }

        if (rate < 0.1) {
            ele.data('onOff', true);
            ele.text(0);
        } else if (rate >= 1) {
            if (ele.data('onOff')) {
                ele.data('onOff', false);
                TweenMax.to(demo, dur, {
                    score: num,
                    onUpdate: showScore,
                    onUpdateParams: [ele, demo, len]
                });
            }
        }

    });

    function showScore(p1, p2, p3) {
        p1.text(p2.score.toFixed(p3));
    }
}

/*	获取外部坐标相对于元素中心点的距离与弧度、角度，函数返回对象{dist: ,rad: ,ang: }	*/
function getAngle($ele, mx, my) { //	参数 $ele - 元素，mx - 外部x坐标，my - 外部y坐标
    if (!$ele.data('cp')) {
        $ele.data('cp', {
            x: $ele.offset().left + $ele.width() / 2,
            y: $ele.offset().top + $ele.height() / 2
        });
    }

    var rel_x = mx - $ele.data('cp').x;
    var rel_y = my - $ele.data('cp').y;
    var val = {};

    val.dist = Math.sqrt(rel_x * rel_x + rel_y * rel_y);
    val.rad = Math.acos(-rel_y / val.dist);
    val.rad = (rel_x > 0) ? val.rad : 2 * Math.PI - val.rad;
    val.ang = val.rad * (180 / Math.PI);

    return val;
}


function scorllAnimate(ele, c) {
    var _offsetAnimate = $(ele).offset().top
    var _scroll1Animate = $(window).scrollTop() + $(window).height() / 1.5;
    if (!c) {
        c = "anim";
    }
    if (_scroll1Animate >= _offsetAnimate) {
        $(ele).addClass(c)
    } else {
        $(ele).removeClass(c)
    }
}

/* ******************************************************************************************************************* */

$(function () {



})

$(window).load(function () {
    
});

/* ******************************************************************************************************************* */

function scrollact(e, fix) {
    fix = fix ? fix : 0;
    if ($(e)[0].flag) {
        return false;
    }
    if ($(window).scrollTop() > ($(e).offset().top - $(window).height() / 2) + fix) {
        $(e)[0].flag = 1;
        return true;
    }
}
/*$(window).load(function () {
    var html = $(".scalebox");
    var bwidth = html.width();
    var mgrbl60 = $(".mgrbl60");
    var hmgrbl60 = mgrbl60.height();
    html.css({
        width: 1800,
    });
    windowSize(html, 1800, 1350);
    $(window).resize(function () {
        windowSize(html, 1800, 1350);
    }).trigger("resize");
    function windowSize(body, max, min) {
        var _width = $(window).width()-104;
        var scale = _width / max;
        if(_width+104<=1350){
           scale = (1350-104) / max;
        }
        body.css("-webkit-transform", "scale(" + scale + ")");
        mgrbl60.css({height:hmgrbl60*scale});
    }
});*/

$(function(){
    IEVersion();

    $("input,textarea").bind("focus",function(){
        $(".gotop").hide();
    });
    $("input,textarea").bind("blur",function(){
        $(".gotop").show();
    });
    /*if($(window).width()>750){
        var navitem = $(".nav-mod .nav-item");
        var two_nav=$(".x-header .two_nav");
        var item = two_nav.find(".item");
        var timer = 0;
        navitem.bind("mouseenter",function(){

            if($(this).find(".arr").length==0){
               return ;
            }
            var index = $(this).index();
            navitem.removeClass("cur");
            two_nav.removeClass("cur");
            item.removeClass("cur");

            $(this).addClass("cur");
            two_nav.addClass("cur");
            item.eq(index-1).addClass("cur");
            clearTimeout(timer);
        });

        navitem.bind("mouseleave",function(){
            timer = setTimeout(function(){
                navitem.removeClass("cur");
                two_nav.removeClass("cur");
                item.removeClass("cur");
            },100);
        })

        two_nav.bind("mouseenter",function(){
            clearTimeout(timer);
        });
        two_nav.bind("mouseleave",function(){
            timer = setTimeout(function(){
                navitem.removeClass("cur");
                two_nav.removeClass("cur");
                item.removeClass("cur");
            },100);
        });

    }else{
        if($(".pubctabs").length){
            $(".pubctabs").each(function(){
                if($(this).find(".now").length){
                    var left = $(this).find(".now").offset().left-$(this).offset().left;
                    $(".pubctabs").scrollLeft(left);
                }
                
            })
        }
        
        
    }*/
    
   $(window).scroll(function(){
       var st = $(this).scrollTop();
       if(st>$(this).height()/3){
           $(".gotop1").addClass("show");
       }else{
        $(".gotop1").removeClass("show");
       }
   });

   $(".gotop1").bind("click",function(){
       $("html,body").animate({scrollTop:0},1500);
   })

   
   pbtabs(".cjwt .pbtabs");


   //网战找错
        
   (function(){
        $(".x-footer .wzzcbox").bind("click",function(){
            $(".wzzc_alert1").fadeIn();
            $(".wzzc_alert1 .im5 input").val(location.href);
        });
		
		$(".wzzc_alert1 .close").bind("click",function(){
			$(".wzzc_alert1").hide();
			return false;
		});
    })()

    $(".wzzc_alert1 .button a.close").bind("click",function(){
        $(".wzzc_alert1").hide();
        return false;
    });
})

function pbtabs(pbtabs){
    if(!$(pbtabs).length){
        return false;
    }
    var leftbox = $(pbtabs).offset().left;
    var nowleft = $(pbtabs).find(".now").offset().left;
    $(pbtabs).scrollLeft(nowleft-leftbox);
}
function IEVersion() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if(isIE) {
    	$("html").addClass("ie");
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if(fIEVersion == 7) {
            return 7;
        } else if(fIEVersion == 8) {
    		$("html").addClass("ie ie8");
            return 8;
        } else if(fIEVersion == 9) {
    		$("html").addClass("ie ie9");
            return 9;
        } else if(fIEVersion == 10) {
    		$("html").addClass("ie ie10");
            return 10;
        } else {
            return 6;//IE版本<=7
        }   

    } else if(isEdge) {
    	$("html").addClass("ie edge");
        return 'edge';//edge
    } else if(isIE11) {
    	$("html").addClass("ie ie11");
        return 11; //IE11  
    }else{
        return -1;//不是ie浏览器
    }
    
}

function sA(ele,c,d){
	if(!$(ele).size() == 0){
        if(!d){d=0}
        if(!c){c = "animateing";}
		var _offsetAnimate = $(ele).offset().top 
		var _scroll1Animate = $(window).scrollTop() + $(window).height()/2-d;
        
		if(_scroll1Animate >= _offsetAnimate){$(ele).addClass(c);}
		else{$(ele).removeClass(c)}
	}else{
		return false;
	}
}
function showAlert(cls,a){
    if(typeof a == "string"){
        $(a).removeClass("show");
    }
    $(cls).add(".mask60").addClass("show");
    $("html,body").css({overflow:"hidden"});
    $(".js-gotop").hide();
    
    return false;
}
function hideAlert(cls){
    $(cls).add(".mask60").removeClass("show");
    $("html,body").css({overflow:"visible"});
    $(".js-gotop").show();
    return false;
}