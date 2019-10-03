$(function() {
    //contentScroll();
    dialog();
    departmentScroll();
    selectBox();
    subTab();

    function contentScroll() {
        $('.imageScroll ul').carouFredSel({
            pagination: '.imageScroll nav',
            scroll: {
                fx: 'crossfade',
                pauseOnHover : true,
                items: 1,
                duration: 500
            },
            auto: {
                play: true,
                timeoutDuration: 3000
            }
        });

        $('.col-video ul li').each(function() {
            var $li = $(this);
            $li.data('caption', $li.find('a').attr('title'));
            $li.video();
        });

        $('.col-video ul').carouFredSel({
            prev: '.col-video .btn-prev',
            next: '.col-video .btn-next',
            pagination: '.col-video .select',
            scroll: {
                pauseOnHover : true,
                items: 1,
                duration: 500,
                onBefore: function(data) {
                    videoCaption(data.items.visible);
                }
            },
            auto: {
                play: true,
                timeoutDuration: 3000
            }
        });

        videoCaption($('.col-video ul li').first());

        function videoCaption($li) {
            $('.col-video p').hide().text($li.data('caption')).fadeIn(300);
        }

        $('#col-specialist .scroll').each(function() {
            $(this).find('ul').carouFredSel({
                prev: $(this).find('.btn-prev'),
                next: $(this).find('.btn-next'),
                scroll: {
                    pauseOnHover : true,
                    items: 2,
                    duration: 500
                },
                auto: {
                    play: false,
                    timeoutDuration: 3000
                }
            });
        });
    }

    function dialog() {
        $('.dialog-bg').css({opacity: 0.8}).click(function() {
            $(this).parent().fadeOut(300);
            return false;
        });
        $('.dialog-close').click(function() {
            $(this).closest('.dialog').fadeOut(300);
            return false;
        });
        $('.dialog-window').click(function() {
            return false;
        });
        $('.row-maps .col h3 a').click(function() {
            var $dialog = $($(this).attr('href'));
            var $window = $dialog.find('.dialog-window');
            $dialog.show();
            $window.css({
                marginLeft: -Math.floor($window.outerWidth() / 2),
                marginTop: -Math.floor($window.outerHeight() / 2)
            }).fadeIn(300);
            return false;
        });
    }

    function departmentScroll() {
        var $ul = $('#col-department .scroll ul');
        var $prev = $('#col-department .scroll .btn-prev');
        var $next = $('#col-department .scroll .btn-next');
        var winWidth = $('#col-department .scroll .window').width();
        var ulWidth = 0;
        var delay = 10;
        var dir = 1;

        $('#col-department .scroll li').each(function() {
            ulWidth += $(this).outerWidth(true);
        });
        $ul.width(ulWidth);

        $prev.mouseover(function(e) {
            if(!$next.is(':visible')) $next.fadeIn(300);
            dir = -1;
            departmentScroll.timer = setInterval(scroll, delay);
        });
        $prev.mouseout(function(e) {
            clearInterval(departmentScroll.timer);
        });

        $next.mouseover(function(e) {
            if(!$prev.is(':visible')) $prev.fadeIn(300);
            dir = 1;
            departmentScroll.timer = setInterval(scroll, delay);
        });
        $next.mouseout(function(e) {
            clearInterval(departmentScroll.timer);
        });

        function scroll() {
            var left = $ul.position().left + 1 * dir;
            $ul.css({left: left});
            if(left == 0) {
                $next.hide();
                clearInterval(departmentScroll.timer);
            }else if(Math.abs(left) + winWidth == ulWidth) {
                $prev.hide();
                clearInterval(departmentScroll.timer);
            }
        }
    }

    function selectBox() {
        var $box = $('#col-specialist .selectBox');
        var $span = $box.find('span');
        var $ul = $box.find('ul');
        var $sheets = $('#col-specialist .scroll');

        $sheets.each(function(index) {
            var title = $(this).find('h4').text();
            var id = 'specialistSheet-' + index
            var $li = $('<li>').data('sheetId', id).text(title);
            $(this).attr('id', id);
            $ul.append($li);
        });
        $span.text($ul.find('li').first().text());
        $('html').mousedown(function(e) {
            var $box = $(e.target).closest('.selectBox');
            if(!$box.length) $ul.hide();
        });
        $box.click(function(e) {
            if($ul.is(':visible')) $ul.hide();
            else $ul.fadeIn(300);
            return false;
        });
        $ul.on('click', 'li', function(e) {
            var $li = $(this);
            $span.text($li.text());
            $ul.hide();
            $sheets.hide();
            $('#' + $li.data('sheetId')).fadeIn(300);
            return false;
        });
    }

    function subTab() {
        var $sub = $('#sub');
        var $btns = $('.sub-nav .btn');
        var $tab = $('.sub-tab');
        var $sheets = $('.sub-tab-sheet');

        $btns.click(function(e) {
            var $btn = $(this);
            var $sheet = $($btn.attr('href'));
            var isExpand = $sub.hasClass('sub-expand') ? true : false;

            if(!isExpand) {
                $('html,body').animate({scrollTop: $sub.offset().top}, 300);
                $sub.addClass('sub-expand');
            }
            if(!$btn.hasClass('active')) {
                $btns.removeClass('active');
                $sheets.hide();
                $sheet.fadeIn(300);
                $tab.css({height: $sheet.outerHeight(true)});
                $btn.addClass('active');
            }

            return false;
        });

        $('.sub-close').click(function(e) {
            $sub.removeClass('sub-expand');
            $btns.removeClass('active');
            $sheets.hide();
            $tab.removeAttr('style');

            return false;
        });
    }
});
