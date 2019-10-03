/**
 * Created by gaoyoujian on 2019/9/26.
 */
var studentScore={
    init:function () {
        console.log("ddd");
        $(document).ready(function () {
            console.log("bbbb");
            $(".sub-close").click(function () {
                console.log("aaaa");
                alert("class="+$(".sub-close").text());
            });
        });
    }
};
(function() {
    console.log("ccc");
    studentScore.init();
})();