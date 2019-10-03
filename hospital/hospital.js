/**
 * Created by gaoyoujian on 2019/9/26.
 */
var studentScore={
    init:function () {
        $(document).ready(function () {
            console.log("bbbb");
            // $(".sub-close").click(function () {
            //     console.log("aaaa");
            //     studentScore.subTab();
            //     alert("class="+$(".sub-close").text());
            // });
            studentScore.subTab();
        });
    },
    subTab:function() {
        var $sub = $('#sub');
        var $btns = $('.sub-nav .btn');
        var $tab = $('.sub-tab');
        var $sheets = $('.sub-tab-sheet');

        $btns.click(function (e) {
            var $btn = $(this);
            var $sheet = $($btn.attr('href'));
            var isExpand = $sub.hasClass('sub-expand') ? true : false;

            if (!isExpand) {
                $('html,body').animate({scrollTop: $sub.offset().top}, 300);
                $sub.addClass('sub-expand');
            }
            if (!$btn.hasClass('active')) {
                $btns.removeClass('active');
                $sheets.hide();
                $sheet.fadeIn(300);
                $tab.css({height: $sheet.outerHeight(true)});
                $btn.addClass('active');
            }

            return false;
        });

        $('.sub-close').click(function (e) {
            $sub.removeClass('sub-expand');
            $btns.removeClass('active');
            $sheets.hide();
            $tab.removeAttr('style');

            return false;
        });
    }

};
(function() {
    console.log("ccc");
    studentScore.init();
})();


