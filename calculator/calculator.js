/**
 * Created by gaoyoujian on 2019/9/26.
 */
var studentScore={
    score:'',
    init:function () {

        cal.addEventListener('click',function () {
            var input1 = document.getElementById('num1').value;
            var input2 = document.getElementById('num2').value;
            var method = document.getElementById('method');
            var cal    = document.getElementById('cal');
            console.log('<<<11 input1='+input1);

            if(studentScore.checkNumber(input1,input2,method.value)) {
                studentScore.getScore(parseInt(input1),parseInt(input2),method.value);
            }
        })

    },
    getScore:function (sum1,sum2,operator) {
        var result = 0;
        console.log('<<<operator='+operator+"sum1="+sum1+"sum2="+sum2);
        switch (operator){
            case 'add':
                result = sum1+sum2;
                break;
            case 'minus':
                result = sum1-sum2;
                break;
            case 'multiple':
                result = sum1*sum2;
                break;
            case 'divide':
                result = sum1/sum2;
                break;
        }
        studentScore._finalScore(result);
    },
    checkNumber:function (sum1,sum2,operator) {
        console.log('sum1='+sum1+"sum2="+sum2);
        if(!sum1 || !sum2) {
            alert("请做输入");
            return false;
        }

        if(isNaN(sum1) || isNaN(sum2)) {
            alert('请输入数字');
            return false;
        }

        if(operator=='divide' && parseInt(sum2) === 0) {
            alert('除数不能为0');
            return false;
        }
        return true;
    },
    _finalScore:function (str) {
        var finalScore = document.getElementById('result');
        finalScore.innerHTML = str;
    }
};
(function() {
    studentScore.init();
})();