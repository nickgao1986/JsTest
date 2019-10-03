(function($) {
    $.u = {
        createClass: function(methods) {
            var constructor = methods.initialize;
            delete methods.initialize;
            $.extend(constructor.prototype, methods);
            return constructor;
        },

        exist: function($e, type) {
            switch(type || 'jQuery') {
                case 'string':
                    return Boolean(typeof $e == 'string' && $e.length > 0); break;
                case 'number':
                    return Boolean(typeof $e == 'number' && $e.length > 0); break;
                case 'object':
                    return Boolean(typeof $e == 'object' && $e.length > 0); break;
                case 'jQuery':
                default:
                    return Boolean($e instanceof jQuery && $e.length > 0);
            }
        },

        event: {
            stop: function(e) {
                e.stopPropagation();
                e.preventDefault();
            },

            isMouseOut: function(e, className) {

            }
        },

        browser: {
            ie: navigator.userAgent.indexOf('MSIE') == -1 ? false : true,
            ie6: navigator.userAgent.indexOf('MSIE 6.0') == -1 ? false : true,
            ie7: navigator.userAgent.indexOf('MSIE 7.0') == -1 ? false : true,
            ie8: navigator.userAgent.indexOf('MSIE 8.0') == -1 ? false : true,
            ie9: navigator.userAgent.indexOf('MSIE 9.0') == -1 ? false : true,
            ie10: navigator.userAgent.indexOf('MSIE 10.0') == -1 ? false : true
        }
    };

    $.u.fx = $.u.createClass({
        initialize: function($element) {
            this.element = $element;
            this.style = {};
            this.foldStyle = null;
            this.fxIn = {};
            this.fxOut = {};
            this.startShow = false;
            this.completeHide = false;
            this.duration = 300;
        },

        set: function(propertyName, from, to) {
            if(typeof propertyName == 'object') {
                for(var p in propertyName) {
                    this.style[p] = propertyName[p][0];
                    this.fxIn[p] = propertyName[p][1];
                    this.fxOut[p] = propertyName[p][0];
                }
            }else {
                this.style[propertyName] = from;
                this.fxIn[propertyName] = to;
                this.fxOut[propertyName] = from;
            }
        },

        setFade: function() {
            this.set('opacity', 0, 1);
        },

        setFold: function(side, length, isDynamic) {
            var $e = this.element;

            if(!length) length = $e[side]();
            this.foldStyle = {};
            this.foldStyle[side] = Math.floor(length);

            if(isDynamic) {
                var isHeight = side == 'height' ? true : false,
                    marginSide = isHeight ? 'marginTop' : 'marginLeft',
                    marginProperty = isHeight ? 'margin-top' : 'margin-left',
                    paddingSide = isHeight ? 'paddingTop' : 'paddingLeft',
                    paddingProperty = isHeight ? 'padding-top' : 'padding-left';

                if($e[0].tagName == 'UL') {
                    $e.fxLis = [];
                    $e.children('li').each(function(index, element) {
                        var $li = $(element),
                            marginVal = Math.floor(parseInt($li.css(marginProperty))),
                            paddingVal = Math.floor(parseInt($li.css(paddingProperty)));
                        $li.createFx({marginSide: [0, marginVal], paddingSide: [0, paddingVal]});
                        $e.fxLis.push($li);
                    });
                }else {
                    this.set(marginSide, 0, $e.css(marginProperty));
                    this.set(paddingSide, 0, $e.css(paddingProperty));
                }
            }

            this.set(side, 0, this.foldStyle[side]);
        },

        playIn: function(duration, complete) {
            var fx = this,
                $e = this.element,
                s = this.style,
                d = duration || this.duration;

            if(this.startShow) $e.show();
            if(!$.isEmptyObject(this.fxIn)) {
                if(this.foldStyle && $e.fxLis) $($e.fxLis).each(function(index, $li) {
                    $li.fx.playIn(d, function($e) {
                        $e.fx.removeFoldDynamicStyle();
                    });
                });
                $e.css(s).animate(this.fxIn, d, function() {
                    fx.completeDefaultIn();
                    if(complete) complete($e);
                });
            }
        },

        playOut: function(duration, complete) {
            var fx = this,
                $e = this.element,
                d = duration || this.duration;

            if(!$.isEmptyObject(fx.fxOut)) {
                if(this.foldStyle && $e.fxLis) $($e.fxLis).each(function(index, $li) {
                    $li.fx.playOut(d, function($e) {
                        $e.fx.removeFoldDynamicStyle();
                    });
                });
                $e.animate(fx.fxOut, d, function() {
                    fx.completeDefaultOut();
                    if(complete) complete($e);
                });
            }
        },

        isSetIn: function() {
            return !$.isEmptyObject(this.fxIn);
        },

        isSetOut: function() {
            return !$.isEmptyObject(this.fxOut);
        },



        completeDefaultIn: function() {
            var $e = this.element;

            if(this.foldStyle) this.removeFoldStyle();
        },

        completeDefaultOut: function() {
            var $e = this.element;

            if(this.completeHide) $e.hide();
            if(this.foldStyle) this.removeFoldStyle();
        },

        removeStyleDeclaration: function(styleProperties) {
            var $e = this.element,
                inlineStyle = $e.attr('style'),
                pattern = new RegExp('(' + styleProperties.join('|') + ')\\:\\s*\\w+\\;', 'g');

            $e.attr('style', inlineStyle.replace(pattern, ''));
        },

        removeFoldStyle: function() {
            this.removeStyleDeclaration(['width', 'height']);
        },

        removeFoldDynamicStyle: function() {
            this.removeStyleDeclaration(['margin-top', 'margin-left', 'padding-top', 'padding-left']);
        }
    });

    $.fn.createFx = function() {
        this.fx = new $.u.fx(this);
        if(arguments.length > 0) this.fx.set.apply(this.fx, arguments);
        return this.fx;
    },

        $.fn.move = function(options) {
            if(typeof options != 'object') return this.css({left: arguments[0], top: arguments[1]});

            var o = $.extend({}, $.fn.move.defaults, options),
                isWindow = $.isWindow(o.view[0]) ? true : false,
                $e = this,
                $doc = $(document),
                w = $e.outerWidth(true),
                h = $e.outerHeight(true),
                x = o.x + o.offsetX,
                y = o.y + o.offsetY,
                docw = isWindow ? document.documentElement.scrollWidth : o.view[0].scrollWidth,
                doch = isWindow ? document.documentElement.scrollHeight : o.view[0].scrollHeight;

            if(!isWindow) {
                x += o.view.scrollLeft();
                y += o.view.scrollTop();
            }

            $e.css({
                left: o.bleeding ? x : Math.min(Math.max(x, 0), docw - w),
                top: o.bleeding ? y : Math.min(Math.max(y, 0), doch - h)
            });

            if(o.scroll && $e.css('position') != 'fixed') {
                var vw = isWindow ? o.view.width() : o.view[0].clientWidth,
                    vh = isWindow ? o.view.height() : o.view[0].clientHeight,
                    sl = isWindow ? $doc.scrollLeft() : o.view.scrollLeft(),
                    st = isWindow ? $doc.scrollTop() : o.view.scrollTop();

                if(x < sl) o.view.scrollLeft(x);
                if((x + w) > (vw + sl)) o.view.scrollLeft(x + w - vw);
                if(y < st) o.view.scrollTop(y);
                if((y + h) > (vh + st)) o.view.scrollTop(y + h - vh);
            }

            return $e;
        };

    $.fn.move.defaults = {
        bleeding: true,
        scroll: false,
        view: $(window),
        X: 0,
        Y: 0,
        offsetX: 0,
        offsetY: 0
    };

    $.fn.pos = function(options) {
        if(typeof arguments[0] == 'string') return ie6Fixed(this.css('position', arguments[0]));

        var o = $.extend({}, $.fn.pos.defaults, options),
            $e = this;

        if(!o.offset) o.offset = $(document.body);
        else if(!/absolute|fixed|relative/.test(o.offset.css('position'))) o.offset.css('position', 'relative');
        $e.css('position', o.type).appendTo(o.offset);

        if(o.at) {
            var hw = $e.outerWidth() / 2,
                hh = $e.outerHeight() / 2;
            $e.css({margin: 0, left: 'auto', top: 'auto', right: 'auto', bottom: 'auto'});
            switch(o.at) {
                case 7:
                    $e.css({left: 0, top: 0}); break;
                case 8:
                    $e.css({left: '50%', top: 0, marginLeft: -hw}); break;
                case 9:
                    $e.css({right: 0, top: 0}); break;
                case 4:
                    $e.css({left: 0, top: '50%', marginTop: -hh}); break;
                case 5:
                case 'center':
                default:
                    $e.css({left: '50%', top: '50%', marginLeft: -hw, marginTop: -hh}); break;
                case 6:
                    $e.css({right: 0, top: '50%', marginTop: -hh}); break;
                case 1:
                    $e.css({left: 0, bottom: 0}); break;
                case 2:
                    $e.css({left: '50%', bottom: 0, marginLeft: -hw}); break;
                case 3:
                    $e.css({right: 0, bottom: 0}); break;
            }
        }
        return ie6Fixed($e);

        function ie6Fixed($e) {
            var s = $e[0].style;

            if($.u.browser.ie6 && s.position == 'fixed') {
                s.position = 'absolute';
                if(s.left == '50%') s.setExpression('left', '(fakeVar = document.documentElement.clientWidth / 2 + document.documentElement.scrollLeft) + "px"');
                else s.setExpression('left', '(fakeVar = document.documentElement.scrollLeft) + "px"');
                if(s.top == '50%') s.setExpression('top', '(fakeVar = document.documentElement.clientHeight / 2 + document.documentElement.scrollTop) + "px"');
                else s.setExpression('top', '(fakeVar = document.documentElement.scrollTop) + "px"');
            }
            return $e;
        }
    };

    $.fn.pos.defaults = {
        offset: null,
        type: 'absolute'
    };

    $.fn.draggable = function(options) {
        var o = $.extend({}, $.fn.draggable.defaults, options);
        var	$e = this;

        if(!/absolute|fixed/.test($e.css('position'))) $e.css({position: 'absolute'});
        if(!o.view) {
            for(var $p = $e.parent(); $p.size() > 0; $p = $p.parent()) {
                if(/absolute|fixed|relative/.test($p.css('position'))) {
                    o.view = $p;
                    break;
                }
            }
        }
        if(!o.view) o.view = $(window);
        var	isWindow = o.view.length && $.isWindow(o.view[0]) ? true : false;
        var	$doc = isWindow ? $(document) : o.view;

        if(isWindow) $(document.body).append($e);
        (o.trigger ? $e.find(o.trigger) : $e).css('cursor', 'move');

        if(o.dispatch) drag(o.dispatch);
        else $e.on('mousedown', o.trigger, drag);

        function drag(event) {
            o.offsetX = -(event.pageX - $e.offset().left);
            o.offsetY = -(event.pageY - $e.offset().top);

            $doc.off('mousemove.draggable').on('mousemove.draggable', function(event) {
                if($e.css('position') == 'fixed') {
                    o.x = event.originalEvent.clientX;
                    o.y = event.originalEvent.clientY;
                }else {
                    o.x = isWindow ? event.pageX : event.pageX - o.view.offset().left;
                    o.y = isWindow ? event.pageY : event.pageY - o.view.offset().top;
                }
                $e.move(o);
                if(o.mousemove && $.isFunction(o.mousemove)) o.mousemove.call($e, event);

                return false;
            });

            $(document).off('mouseup.draggable').on('mouseup.draggable', function(event) {
                $doc.off('.draggable');
                if(o.mouseup && $.isFunction(o.mouseup)) o.mouseup.call($e, event);

                return false;
            });

            return false;
        }

        return $e;
    };

    $.fn.draggable.defaults = {
        dispatch: null,
        mousemove: null,
        trigger: null,
        view: null
    }

    $.fn.dialog = function(options) {
        var o = $.extend({}, $.fn.dialog.defaults, options),
            $body = $(document.body),
            $dialog = this,
            $btnClose = $dialog.find('.' + o.classBtnClose),
            $bg, $offset;

        if(!$dialog.hasClass(o.classActive)) {
            if(o.draggable) o.fixed = false;
            if($btnClose.length) $btnClose.on('click.dialog', function(event) {
                event.stopPropagation();
                event.preventDefault();
                destroy();
            });
            if(o.width) $dialog.css({width: o.width});
            if(o.height) $dialog.css({height: o.height});
            build();
        }
        return $dialog;

        function build() {
            $bg = $('<div>').addClass(o.classBg).css({opacity: o.bgOpacity}),
                $offset = $('<div>').addClass(o.classBg).css({background: 'transparent', opacity: 1});
            $body.append($bg).append($offset.append($dialog));
            if(!o.modal) $offset.on('click.dialog', function(event) {
                event.stopPropagation();
                event.preventDefault();
                if(event.target == event.currentTarget) destroy();
            });
            $bg.hide().fadeIn();
            $dialog.addClass(o.classActive).show().css({
                marginLeft: -Math.round($dialog.outerWidth(true) / 2),
                marginTop: -Math.round($dialog.outerHeight(true) / 2)
            });

            if(o.draggable) {
                $dialog.draggable({
                    bleeding: true,
                    scroll: false,
                    view: $offset
                });
            }
        }

        function destroy() {
            if($.isFunction(o.beforeClose)) o.beforeClose.call(this);

            $('.template').append($dialog.removeAttr('style').removeClass(o.classActive));
            $offset.remove();
            $bg.fadeOut(function() {$bg.remove();});
            $btnClose.off('click');

            if($.isFunction(o.afterClose)) o.afterClose.call(this);
        }
    }
    $.fn.dialogClose = function() {
        this.find('.dialog-close').trigger('click');
    };
    $.fn.dialog.defaults = {
        bgOpacity: 0.5,
        classBg: 'dialog-bg',
        classDialog: 'dialog',
        classActive: 'dialog-active',
        classBtnClose: 'dialog-close',
        draggable: false,
        fxFade: false,
        fxSlide: false,
        fxDuration: 300,
        fixed: false,
        modal: true
    }

    $.fn.tab = function(options) {
        var o = $.extend({}, $.fn.tab.Defaults, options);
        if(!/mouseover|click/.test(o.event)) o.event = 'click';

        var $tabList = this,
            $links = $tabList.find('.' + o.classLinks).find('.' + o.classLink),
            $tabs = $tabList.find('.' + o.classTabs).find('.' + o.classTab),
            $linkActive = null,
            $tabActive = null;

        if(o.autoAttach) {
            var r = String(Math.random()).substring(2);
            $links.each(function(i, e) {$(this).attr('href', '#tabSheet-' + r + i)});
            $tabs.each(function(i, e) {$(this).attr('id', 'tabSheet-' + r + i)});
        }
        $links.each(function() {if($(this).hasClass(o.classLinkActive)) $linkActive = $(this);});
        $tabs.each(function() {if($(this).hasClass(o.classTabActive)) $tabActive = $(this);});
        if(!$linkActive) $linkActive = $links.first().addClass(o.classLinkActive);
        if(!$tabActive) {
            $tabActive = $linkActive ? getTab($linkActive) : $tabs.first();
            $tabActive.addClass(o.classTabActive).show();
        }
        if(o.event == 'mouseover') $links.on('click.tab', function(e) {return e.preventDefault();});

        $links.on(o.event + '.tab', function(e) {
            if($(this).hasClass(o.classLinkActive)) return false;

            var $link = $(this),
                $tab = getTab($link);

            $linkActive.removeClass(o.classLinkActive);
            $linkActive = $link.addClass(o.classLinkActive);
            if(o.fxFade || o.fxResize) {
                $tab.createFx();
                $tab.fx.startShow = $tab.fx.completeHide = true;
                if(o.fxFade) $tab.fx.setFade();
                if(o.fxResize) $tab.fx.set('height', $tabActive.height(), $tab.height());
                if($tab.fx.isSetIn()) {
                    if(o.fxFade) {
                        $tabActive.fadeOut(100, function() {
                            switchTab($tab);
                            $tab.fx.playIn(o.fxDuration, function($tab) {
                                $tab.css({height: 'auto'});
                            });
                        });
                    }else {
                        switchTab($tab);
                        $tab.fx.playIn(o.fxDuration, function($tab) {
                            $tab.css({height: 'auto'});
                        });
                    }
                }
            }else switchTab($tab);

            return false;
        });

        function getTab($link) {
            var $tab = $($link.attr('href'));
            if($tab.length == 0) throw new Error('[$.fn.tab] Cannot find related tab. Tab missing.');
            return $tab;
        }

        function switchTab($tab) {
            if(o.preSwitch) o.preSwitch($tabActive, $tab);
            $tabActive.removeClass(o.classTabActive).hide();
            $tab.addClass(o.classTabActive).show();
            $tabActive = $tab;
            if(o.switchComplete && typeof o.switchComplete == 'function') o.switchComplete($tabActive);
        }
    };

    $.fn.tab.Defaults = {
        autoAttach: true,
        event: 'click',
        classLinks: 'tab-nav',
        classLink: 'tab-head',
        classLinkActive: 'tab-head-active',
        classTabs: 'tab-content',
        classTab: 'tab-sheet',
        classTabActive: 'tab-sheet-active',
        fxFade: false,
        fxResize: false,
        fxDuration: 400
    };

    $.fn.list = function(options) {
        var o = $.extend({}, $.fn.list.Defaults, options),
            $list = this,
            $lis = $list.children('li'),
            $liContentActive;

        $lis.each(function() {
            var $li = $(this),
                $liLinks = getLiLink($li),
                $liContent = getLiContent($li);

            if($liLinks.hasClass(o.classItemLinkActive)) activate($liLinks);
            setFx($liContent);
            $liLinks.on('click.list', function(e) {
                var $link = $(this);
                if($link.hasClass(o.classItemLinkActive)) destroy($liContent);
                else {
                    build($liContent);
                    $link.addClass(o.classItemLinkActive);
                }

                e.preventDefault();
            });
        });

        switch(o.selected) {
            case 'first':
                activate(getLiLink($lis.first())); break;
            case 'last':
                activate(getLiLink($lis.last())); break;
            case 'all':
                $lis.each(function() {activate(getLiLink($(this)));}); break;
        }

        return $list;

        function build($liContent) {
            if(o.exclusive && !$liContent.is($liContentActive)) destroy($liContentActive);
            $liContentActive = $liContent.addClass(o.classItemContentActive);
            $liContent.fx.playIn(o.fxDuration);
        }

        function destroy($liContent) {
            if($.u.exist($liContent)) {
                $liContent.removeClass(o.classItemContentActive);
                $liContent.siblings('.' + o.classItemLink).removeClass(o.classItemLinkActive);
                if($liContent.fx.isSetOut()) $liContent.fx.playOut();
                else $liContent.hide();
            }
        }

        function getLiLink($li) {
            return $li.find('.' + o.classItemLink);
        }

        function getLiContent($e) {
            switch($e[0].tagName.toLowerCase()) {
                case 'li':
                default:
                    return $e.find('.' + o.classItemContent);
                case 'a':
                    return $e.siblings('.' + o.classItemContent);
            }
        }

        function setFx($liContent) {
            $liContent.createFx();
            $liContent.fx.startShow = $liContent.fx.completeHide = true;
            if(o.fxFade) $liContent.fx.setFade();
            if(o.fxFold) $liContent.fx.setFold('height', null, o.fxFoldDynamic);
        }

        function activate($liLink) {
            $liLink.addClass(o.classItemLinkActive);
            $liContentActive = getLiContent($liLink).show();
            setFx($liContentActive);
        }
    };

    $.fn.list.Defaults = {
        classList: 'list',
        classItemLink: 'li-a',
        classItemLinkActive: 'li-a-active',
        classItemContent: 'li-content',
        classItemContentActive: 'li-content-active',
        exclusive: false,
        fxFade: false,
        fxFold: false,
        fxFoldDynamic: false,
        fxDuration: 300,
        selected: false
    }

    $.fn.tooltip = function(options) {
        var o = $.extend({}, $.fn.tooltip.Defaults, options),
            $target = this,
            $tooltip,
            thisTitle = $target.attr('title'),
            classTempDiv = 'ui-temp-div';

        if(o.event == 'hover') $target.mouseover(build);
        else $target.click(function(e) {
            if($tooltip || $tooltip.hasClass(o.classTooltipActive)) destroy(e);
            else build(e);
        });

        function build(e) {
            if(o.content) {
                if($.u.exist(o.content)) $tooltip = o.content;
                else if($.u.exist(o.content, 'string')) $tooltip = createDiv(o.content);
                else $.u.event.stop(e);
            }else {
                $tooltip = $target.find('.' + o.classTooltip);
                if($tooltip.length > 0) {
                    var $btnClose = $tooltip.find('.' + o.classTooltipClose);
                    if($btnClose.length > 0) $btnClose.unbind('click.tooltip').on('click.tooltip', destroy);
                }else {
                    if(thisTitle && thisTitle.length > 0) $tooltip = createDiv(thisTitle);
                    else $.u.event.stop(e);
                }
            }

            if(o.context == 'global') $tooltip.pos();
            if(thisTitle) $target.attr('title', '');
            $target.addClass(o.classTargetActive).off('mouseover').mouseout(destroy);
            $tooltip.addClass(o.classTooltipActive).mouseout(destroy);

            var x, y;
            if(o.follow) {
                $target.mousemove(function(e) {
                    $tooltip.move(e.pageX + o.offsetX, e.pageY + o.offsetY);
                    $.u.event.stop(e);
                });
            }else {
                var targetX = o.context != 'global' ? $target[0].offsetLeft : $target.offset().left,
                    targetY = o.context != 'global' ? $target[0].offsetTop : $target.offset().top,
                    targetW = $target.width(),
                    targetH = $target.height(),
                    tooltipW = $tooltip.outerWidth(),
                    tooltipH = $tooltip.outerHeight();
                switch(o.position) {
                    case 'top':
                        y = targetY - tooltipH - o.offsetY; break;
                    case 'right':
                        x = targetX + targetW + o.offsetX; break;
                    case 'bottom':
                    default:
                        y = targetY + targetH + o.offsetY; break;
                    case 'left':
                        x = targetX - tooltipW - o.offsetX; break
                }
                if(/left|right/.test(o.position)) {
                    switch(o.alignV) {
                        case 'top':
                        default:
                            y = targetY; break;
                        case 'bottom':
                            y = targetY - (tooltipH - targetH); break;
                        case 'center':
                            y = targetY - (tooltipH - targetH)/2; break;
                    }
                }else {
                    switch(o.alignH) {
                        case 'left':
                        default:
                            x = targetX; break;
                        case 'right':
                            x = targetX - (tooltipW - targetW); break;
                        case 'center':
                            x = targetX - (tooltipW - targetW)/2; break;
                    }
                }
            }
            $tooltip.move({
                bleeding: true,
                x: Math.round(x),
                y: Math.round(y)
            });

            if(o.fxFade || o.fxSlide) {
                $tooltip.createFx();
                $tooltip.fx.startShow = $tooltip.fx.completeHide = true;
                if(o.fxFade) $tooltip.fx.setFade();
                if(o.fxSlide) {
                    var halfW = Math.round(tooltipW/2),
                        halfH = Math.round(tooltipH/2);
                    switch(o.fxSlideDir) {
                        case 'up':
                            $tooltip.fx.set('top', y + halfH, y); break;
                        case 'right':
                            $tooltip.fx.set('left', x - halfW, x); break;
                        case 'down':
                        default:
                            $tooltip.fx.set('top', y - halfH, y); break;
                        case 'left':
                            $tooltip.fx.set('left', x + halfW, x); break;
                    }
                }
                $tooltip.fx.playIn(o.fxDuration);
            }else {
                $tooltip.show();
            }

            $.u.event.stop(e);
        }

        function createDiv(txt) {
            return $('<div>').addClass(o.classTooltip + ' ' + classTempDiv).text(txt)
                .append($('<div class="triangle"></div>')).append($('<div class="triangle-border"></div>'));
        }

        function destroy(event) {
            var $over = $(event.relatedTarget);
            if($over.hasClass(o.classTooltipActive)) return false;
            if($tooltip.fx && $tooltip.fx.isSetOut()) $tooltip.fx.playOut(o.fxDuration, clear);
            else {
                $tooltip.hide();
                clear();
            }
        }

        function clear() {
            $target.removeClass(o.classTargetActive).off('mouseout').mouseover(build);
            $tooltip.removeClass(o.classTooltipActive);
            if(thisTitle) $target.attr('title', thisTitle);
            if($tooltip.hasClass(classTempDiv)) $tooltip.remove();
        }
    };

    $.fn.tooltip.Defaults = {
        alignH: 'left',
        alignV: 'top',
        classTooltip: 'tooltip',
        classTooltipActive: 'tooltip-active',
        classTooltipClose: 'tooltip-close',
        content: null,
        context: 'global',
        event: 'hover',
        follow: false,
        fxFade: false,
        fxSlide: false,
        fxSlideDir: 'down',
        fxDuration: 300,
        offsetX: 10,
        offsetY: 10,
        position: 'bottom'
    };

    $.fn.draggable.defaults = {
        bleeding: true,
        scroll: false,
        view: null,
        trigger: null
    };

    $.fn.rollover = function(options) {
        if(this.length == 0) return this;

        var o = $.extend({}, $.fn.rollover.defaults, options),
            $target = this,
            $active = $target.find('.' + o.classRolloverActive),
            targetW = $target.innerWidth(),
            targetH = $target.innerHeight(),
            activeW = $active.outerWidth(true),
            activeH = $active.outerHeight(true);

        $target.css({overflow: 'hidden'});
        $active.pos({offset: $target}).createFx();
        $active.fx.startShow = $active.fx.completHide = true;
        if(o.fxFade) $active.fx.setFade();
        if(o.fxSlide) {
            switch(o.fxSlideDir) {
                case 'top':
                    $active.css({left: 0}).fx.set('bottom', -activeH, 0); break;
                case 'right':
                    $active.css({top: 0}).fx.set('right', -activeW, 0); break;
                case 'down':
                default:
                    $active.css({left: 0}).fx.set('top', -activeH, 0); break;
                case 'left':
                    $active.css({top: 0}).fx.set('left', -activeW, 0); break;
            }
        }

        $target.hover(function(e) {
            build();
        }, function(e) {
            destroy();
        });

        function build() {
            if($active.fx.isSetIn()) {
                if(!o.fxSlide) $active.move(0, 0);
                $active.fx.playIn();
            }else $active.move(0, 0).show();
        }

        function destroy() {
            if($active.fx.isSetOut()) $active.fx.playOut();
            else $active.hide();
        }
    };

    $.fn.rollover.defaults = {
        classRollover: 'ui-rollover',
        classRolloverActive: 'ui-rollover-active',
        fxFade: false,
        fxSlide: false,
        fxSlideDir: 'down'
    };

    $.fn.inputInteger = function() {
        var $input = this;
        var ns = '.inputDate';

        $input.on('keypress' + ns, function(event) {
            var char = String.fromCharCode(event.which);
            var int = '0123456789';
            if(int.indexOf(char) == -1) event.preventDefault();
        });
    };

    $.fn.inputDate = function(options) {
        var o = $.extend({}, $.fn.inputDate.defaults, options);
        var $box = this.parent();
        var $input = this;
        var $cal = o.update ? $box.find('.' + o.cls.calendar) : $('<div>').appendTo($box);
        var val = $input.val();
        var ns = '.inputDate';

        if(val) {
            o.calendar.dateSelected = val;
            o.calendar.dateStart = 'selected';
            $input.data('value', setDefaultTime(new Date(val)).valueOf());
        }
        o.calendar.postSelect = function(dateSelected) {
            $input.val(formatDate(dateSelected));
            $input.data('value', dateSelected.valueOf());
            hide();
            if($.isFunction(o.postSelect)) o.postSelect(dateSelected);
        };
        $cal.empty().calendar(o.calendar);
        if(!o.update) {
            $cal.addClass(o.cls.calendar).hide();
            $cal.css({
                position: 'absolute',
                left: 0
            });

            if(!$.fn.inputDate._globalHide) {
                $('html').on('mousedown' + ns, function(event) {
                    $('.' + o.cls.calendar).hide().parent().find('input').removeClass(o.cls.active);
                    event.stopPropagation();
                });
                $.fn.inputDate._globalHide = true;
            }
            $box.on('mousedown' + ns, '*', function(event) {
                if($input.hasClass(o.cls.active)) return false;
            });
            $input.on('click' + ns, function(event) {
                $(this).addClass(o.cls.active);
                show();
            });
        }

        function setDefaultTime(date) {
            date.setHours(12);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            return date;
        }

        function formatDate(date) {
            var mm = date.getMonth() + 1;
            var dd = date.getDate();
            if(mm < 10) mm = '0' + mm;
            if(dd < 10) dd = '0' + dd;
            return date.getFullYear() + '-' + mm + '-' + dd;
        }

        function hide() {
            $cal.hide();
        }

        function show() {
            var boxHeight = $box.outerHeight();
            var scrollHeight = $(window).scrollTop() + $(window).height();
            var calHeight = $box.offset().top + boxHeight + $cal.outerHeight(true);
            if(scrollHeight > calHeight) $cal.css({top: boxHeight, bottom: 'auto'});
            else $cal.css({top: 'auto', bottom: boxHeight});
            $cal.fadeIn('fast');
        }
    };
    $.fn.inputDate.defaults = {
        cls: {
            active: 'inputDate-active',
            calendar: 'calendar'
        },
        calendar: {},
        mode: 'drop',
        readonly: true,
        update: false
    };
    $.fn.inputDate._globalHide = false;

    $.fn.calendar = function(options) {
        var o = $.extend(true, {}, $.fn.calendar.defaults, options);
        var $box = this;

        build();
        return $box;

        function build() {
            var dateToday = getDateValue(o.dateToday || new Date());
            var dateSelected = o.dateSelected ? getDateValue(o.dateSelected) : null;
            var dateDynamic;

            if(o.dateStart == 'today') dateDynamic = new Date(dateToday.valueOf());
            else if(o.dateStart == 'selected' && dateSelected instanceof Date) dateDynamic = new Date(dateSelected.valueOf());
            else dateDynamic = getDateValue(o.dateStart || new Date());
            setDefaultTime(dateToday);
            setDefaultTime(dateSelected);
            setDefaultTime(dateDynamic);

            //  control generate
            var $ctrl = $('<div>').addClass(o.cls.ctrl).appendTo($box);
            if(o.yearButton) $ctrl
                .append(getCtrlBtn(o.text.prevYear, o.text.prevYearTitle, o.cls.btnPrevYear))
                .append(getCtrlBtn(o.text.nextYear, o.text.nextYearTitle, o.cls.btnNextYear));
            if(o.monthButton) $ctrl
                .append(getCtrlBtn(o.text.prevMonth, o.text.prevMonthTitle, o.cls.btnPrevMonth))
                .append(getCtrlBtn(o.text.nextMonth, o.text.nextMonthTitle, o.cls.btnNextMonth));
            var $strong = $('<strong>').appendTo($ctrl);
            var $spanYear = $('<span>').text(dateDynamic.getFullYear()).addClass(o.cls.spanYear).appendTo($strong);
            var $spanMonth = $('<span>').addClass(o.cls.spanMonth).appendTo($strong);
            if(o.monthSelect) {
                var $select = $('<select>').attr('name', 'calendar-month');
                var monthList = [];
                $(o.text.month).each(function(index, element) {
                    var option = { text: element, value: index };
                    if(option.value == dateDynamic.getMonth()) options.selected = true;
                    monthList.push(option);
                });
                $spanMonth.append($select).inputSelect({
                    data: monthList,
                    selectedIndex: dateDynamic.getMonth(),
                    width: 'preserve',
                    postSelect: function(index, value) {
                        dateDynamic.setDate(1);
                        dateDynamic.setMonth(index);
                        populate();
                    }
                });
            } else {
                $spanMonth.text(o.text.month[dateDynamic.getMonth()]);
            }

            // table generate
            var $table = $('<table>').addClass(o.cls.table).appendTo($box);
            var $thead = $('<thead>').appendTo($table);
            var $tbody = $('<tbody>').appendTo($table);
            if(o.selectable) $tbody.on('click.calendarGrid', 'td', tdClick);

            var $trWeek = $('<tr>').appendTo($thead);
            var weekStartIndex = o.firstDay.toLowerCase() == 'sunday' ? 0 : 1;
            for(var i = 0; i < 7; i++) {
                $trWeek.append($('<th>').text((o.isWeekFull ? o.text.weekFull : o.text.week)[(weekStartIndex + i) % 7]));
            }
            populate();

            function populate() {
                var dateDynamicMonth = dateDynamic.getMonth();
                var date = new Date(dateDynamic.valueOf());
                date.setDate(1);
                date.setDate(date.getDate() - (date.getDay() - weekStartIndex));

                $tbody.empty();
                do {
                    var $trDate = $('<tr>');
                    for(var i = 0; i < 7; i++) {
                        var dateValue = date.valueOf();
                        var $td = $('<td>')
                            .text(date.getDate())
                            .attr('abbr', dateValue)
                            .data('value', dateValue);
                        var dateMonth = date.getMonth() + (date.getFullYear() - dateDynamic.getFullYear()) * 12;

                        if(date.getMonth() == dateDynamicMonth) $td.addClass(o.cls.tdThisMonth);
                        else if(dateMonth < dateDynamicMonth) $td.addClass(o.cls.tdPrevMonth);
                        else if(dateMonth > dateDynamicMonth) $td.addClass(o.cls.tdNextMonth);
                        if(date.getDay() == 0 || date.getDay() == 6) $td.addClass(o.cls.tdWeekend);
                        if(dateValue == dateToday.valueOf()) $td.addClass(o.cls.tdToday);
                        if(dateSelected && dateSelected.valueOf() == dateValue) $td.addClass(o.cls.tdSelected);

                        $trDate.append($td);
                        date.setDate(date.getDate() + 1);
                    }
                    $tbody.append($trDate);
                } while(date.getMonth() == dateDynamicMonth);

                if($.isFunction(o.postPopulate)) o.postPopulate.call($box[0], dateDynamic);
            }

            function setDefaultTime(d) {
                if(d && d instanceof Date) {
                    d.setHours(12);
                    d.setMinutes(0);
                    d.setSeconds(0);
                    d.setMilliseconds(0);
                }
            }

            function update(year, month, date, time) {

            }

            function getDateValue(value) {
                if(!value) return undefined;
                if(value instanceof Date) return value;
                if(typeof value == 'string') return new Date(value);
            }

            function getCtrlBtn(content, title, cls) {
                return $('<a>' + content + '</a>')
                    .attr('href', '#').attr('title', title)
                    .addClass(o.cls.btn).addClass(cls)
                    .on('click.calendarCtrl', btnClick);
            }

            function btnClick(event) {
                var $btn = $(this);
                dateDynamic.setDate(1);
                if($btn.hasClass(o.cls.btnPrevMonth)) dateDynamic.setMonth(dateDynamic.getMonth() - 1);
                else if($btn.hasClass(o.cls.btnNextMonth)) dateDynamic.setMonth(dateDynamic.getMonth() + 1);
                else if($btn.hasClass(o.cls.btnPrevYear)) dateDynamic.setYear(dateDynamic.getFullYear() - 1);
                else if($btn.hasClass(o.cls.btnNextYear)) dateDynamic.setYear(dateDynamic.getFullYear() + 1);

                var yearText = dateDynamic.getFullYear();
                var monthIndex = dateDynamic.getMonth();
                var monthText = o.text.month[monthIndex];
                $spanYear.text(yearText);
                if(o.monthSelect) {
                    $spanMonth.find('span.' + $.fn.inputSelect.defaults.cls.selectText).text(monthText);
                    $spanMonth.find('select')[0].selectedIndex = monthIndex;
                } else $spanMonth.text(monthText);
                populate();
                event.preventDefault();
                event.stopPropagation();
            }

            function tdClick(event) {
                var $td = $(this);
                dateSelected = new Date(parseInt($td.data('value')));
                $tbody.find('.' + o.cls.tdSelected).removeClass(o.cls.tdSelected);
                $td.addClass(o.cls.tdSelected);
                if(o.postSelect && $.isFunction(o.postSelect)) o.postSelect.call($box, dateSelected);
                if(o.populateOnClick && dateSelected.getMonth() != dateDynamic.getMonth()) {
                    dateDynamic = new Date(dateSelected.valueOf());
                    populate();
                }
            }
        }

    };
    $.fn.calendar.defaults = {
        cls: {
            box: 'calendar',
            ctrl: 'calendar-control',
            spanYear: 'year',
            spanMonth: 'month',
            btn: 'btn-ctrl',
            btnPrevYear: 'btn-prevYear',
            btnNextYear: 'btn-nextYear',
            btnPrevMonth: 'btn-prevMonth',
            btnNextMonth: 'btn-nextMonth',
            table: 'calendar-grid',
            tdThisMonth: 'thisMonth',
            tdPrevMonth: 'prevMonth',
            tdNextMonth: 'nextMonth',
            tdToday: 'today',
            tdWeekend: 'weekend',
            tdSelected: 'selected'
        },
        text: {
            month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            week: ['日', '一', '二', '三', '四', '五', '六'],
            weekFull: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            prevYear: '&lsaquo;&lsaquo;',
            prevYearTitle: '上一年',
            nextYear: '&rsaquo;&rsaquo;',
            nextYearTitle: '下一年',
            prevMonth: '&lsaquo;',
            prevMonthTitle: '上一月',
            nextMonth: '&rsaquo;',
            nextMonthTitle: '下一月'
        },
        yearButton: true,
        yearSelect: false,
        monthButton: true,
        monthSelect: false,
        dateToday: '',
        dateSelected: '',
        dateEvent: '',
        dateStart: 'today',
        selectable: true,
        firstDay: 'monday',
        isWeekFull: false,
        populateOnClick: true,
        postPopulate: null,
        postSelect: null
    };

    $.fn.video = function(options) {
        var o = $.extend({}, $.fn.video.defaults, options);
        var $box = this;

        /*if(!o.url) {
         o.url = $box.find('a').first().attr('href');
         $box.find('a').first().remove();
         }*/
        if(!o.width) o.width = $box.width();
        if(!o.height) o.height = $box.height();
        /*build();

         function build() {
         var flashVars= 'file=' + o.url;
         if(o.logoText) flashVars += '&LogoText=' + o.logoText;
         if(o.BufferTime) flashVars += '&BufferTime=' + o.bufferTime;
         if(o.autoPlay) flashVars += '&IsAutoPlay=1';
         var htObject = '<object width="' + o.width + '" height="' + o.height + '" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,19,0" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">';
         htObject += '<param name="movie" value="' + o.movie + '">';
         htObject += '<param name="quality" value="' + o.quality + '">';
         htObject += '<param name="allowfullscreen" value="' + o.allowFullScreen + '">';
         htObject += '<param name="wmode" value="' + o.wmode + '">';
         htObject += '<param name="flashvars" value="' + flashVars + '">';
         htObject += '<embed width="' + o.width + '" height="' + o.height + '" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" quality="' + o.quality + '" flashvars="vcastr_file=' + o.url + '" allowfullscreen="' + o.allowFullScreen + '" wmode=' + o.wmode + ' src="' + o.movie + '" ignore="1">';
         htObject += '</object>';
         $box.html(htObject);
         }*/
    };
    /*
     $.fn.video.defaults = {
     movie: 'scripts/flvplayer.swf',
     quality: 'high',
     allowFullScreen: 'true',
     wmode: 'opaque'
     };
     */
    $.fn.pdf = function(options) {
        var o = $.extend({}, $.fn.pdf.defaults, options);
        var $box = this;

        if(!o.url) {
            o.url = $box.find('a').first().attr('href');
            $box.find('a').first().remove();
        }
        build();

        function build() {
            var pdfObj = '<object classid="clsid:CA8A9780-280D-11CF-A24D-444553540000" width="100%" height="100%" border="0">';
            pdfObj += '<param name="_Version" value="65539">';
            pdfObj += '<param name="_ExtentX" value="20108">';
            pdfObj += '<param name="_ExtentY" value="10866">';
            pdfObj += '<param name="_StockProps" value="0">';
            pdfObj += '<param name="src" value="' + o.url + '#view=FitH">';
            pdfObj += '</object>';
            pdfObj += '<embed src="' + o.url + '#view=FitH" width="100%" height="100%" type="application/pdf"/>';
            $box.append($('<div>').html(pdfObj));
        }

        $.fn.pdf.defaults = {

        };
    };
})(jQuery);