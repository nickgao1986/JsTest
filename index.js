/**
 * Created by gaoyoujian on 2019/9/26.
 */
var studentScore={
    score:'',
    init:function () {
        //alert('init');
        this.getScore();
    },
    getScore:function () {
        var scoreValue = document.getElementById('studentScore');
        var scoreBtn = document.getElementById('checkScore');
        scoreBtn.onclick = function () {
            studentScore.score = scoreValue.value;
            if(studentScore.score == '') {
                //尚未输入
                alert('你尚未输入成绩，请输入!');
                return;
            }else{
                studentScore.calculateTwo();
            }
        }
    },
    calculate:function () {
        var score = studentScore.score;
        switch (true) {
            case score>90 && score<=100:
                 studentScore._finalScore('优等生');
                 break;
            case score>80 && score<=90:
                studentScore._finalScore('一等生');
                break;
            case score>70 && score<=80:
                studentScore._finalScore('二等生');
                break;
            case score>60 && score<=70:
                studentScore._finalScore('三等生');
                break;
            default:
                alert("请输入1-100的数字");
                break;
        }
    },
    calculateTwo:function () {
        var score = studentScore.score;
        var rank = null;
        if(score >= 0 && score <= 100) {
            rank = 10 - Math.floor(score/10);
            rank += '等生';
            this._finalScore(rank);
        }else{
            alert("请输入1-100的数字");
        }
    },
    _finalScore:function (str) {
        var finalScore = document.getElementById('finalScore');
        finalScore.innerHTML = str;
    }
};
(function() {
    studentScore.init();
})();