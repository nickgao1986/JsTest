$(function() {

    //把两个数组合并，并删除第二个元素
    function test1() {
        var arr1=['a','b','c'];
        var arr2=[1,2,3,4];
        var arr3=arr1.concat(arr2)
        arr3.splice(1,1);
        alert(arr3);
    }

    //计算一个数组arr所有元素的和
    //var arr = [1,2,3,4,5,6];
    //console.log(sum(arr));

    function sum(arr) {
        if(arr) {
            var sum1 = 0;
            for(var i=0;i<arr.length;i++) {
                if(typeof arr[i]=="number") {
                    sum1 += arr[i];
                }
            }
            return sum1;
        }
    }


    //编写一个方法去掉数组里面 重复的内容  var arr=[1,2,3,4,5,1,2,3]
    function deleteDuplicate(arr) {
        var result = [];
        for(var i=0;i<arr.length;i++) {
            if(result.indexOf(arr[i]) === -1) {
                result.push(arr[i]);
            }
        }
        return result;
    }

    // var arr=[1,2,3,4,5,1,2,3];
    // console.log(deleteDuplicate(arr));

    //冒泡排序
    function sort1() {
        var array=[1,3,2,2,4,9,5,8,7,6];
        //正序排
        console.log(array.sort())
        //正序排
        for (var i=0;i<array.length;i++) {
            for (var j=0;j<array.length;j++) {
                if(array[i]<array[j]){
                    var d=array[j];
                    array[j]=array[i];
                    array[i]=d;
                }
            }
        }
        console.log(array)
        //splice() 方法向/从数组中添加/删除项目，然后返回被删除的项目。注释：该方法会改变原始数组。
        //console.log(array.splice(3,4))
        console.log(array.reverse())
        //倒序排
        for (var i=0;i<array.length;i++) {
            for (var j=0;j<array.length;j++) {
                if(array[i]>array[j]){
                    var d = array[i];
                    array[i] = array[j];
                    array[j] = d;
                }
            }
        }
        console.log(array)
    }

    //输出固定格式的日期
    function parseTodayDate() {
        var d= new Date();
        var y=d.getFullYear();
        var m=d.getMonth()+1;
        m = m <10? '0'+ m : m;
        var day=d.getDate();
        day = day < 10? '0'+ day : day;
        console.log(y+'-'+m+'-'+day)
    }

    //输出字符串中出现次数最多的值
    function findMaxChar() {
        var str="aaabcd";
        var obj={};
        for (var i=0;i<str.length;i++) {
            if(!obj[str.charAt(i)]){
                obj[str.charAt(i)]=1;
            }else{
                obj[str.charAt(i)]++;
            }
        }
        var maxchar="";
        var maxvalue=1;
        for (key in obj) {
            if(obj[key]>maxvalue){
                maxvalue=obj[key];
                maxchar=key;
            }
        }
        console.log(maxchar+"---"+maxvalue)
    }

    //数字保留2位小数
    function test(num){
        if(typeof(num)==='number'){
            if(num%1===0){
                var s=num.toString();
                var rs=s.indexOf('.');
                if(rs<0){
                    rs=s.length;
                    s += ".";
                }
                while (s.length <= rs +2){
                    s+="0";
                }
                return s;
            }else{
                return parseFloat(num.toFixed(2));
            }
        }else{
            return "不是数字";
        }
        console.log(test(22));
        console.log(test(-330));
        console.log(test('哈哈'));
        console.log(test(3.55556));
        console.log(test(-3.55556));
    }

    //数字前加0
    function test1(num){
        if(typeof(num)==='number'){
            if(num%1===0){
                //必需。要抽取的子串的起始下标。必须是数值。如果是负数，那么该参数声明从字符串的尾部开始算起的位置。也就是说，-1 指字符串中最后一个字符，-2 指倒数第二个字符，以此类推。
                //可选。子串中的字符数。必须是数值。如果省略了该参数，那么返回从 stringObject 的开始位置到结尾的字串。
                return ("0000000000" + num).substr(-10);
            }else{
                //toFixed() 方法可把 Number 四舍五入为指定小数位数的数字。
                return num.toFixed(2);
            }
        }else{
            return "不是数字";
        }
        console.log(test1(229999));
        console.log(test1('哈哈'));
        console.log(test1(3.55556));
    }

    //数组内最大差值
    function maxAndMin() {
        var array=[1,2,3,5,0,8];
        var min=array[0];
        var max=array[0];
        for(var i=1;i<array.length;i++){
            if(array[i]>min){
                max=array[i];
            }else{
                min=array[i];
            }
        }
        console.log(max+'-'+min)
    }

    //随机数相加等于固定值
    function ramdomTest() {
        do{
            var a,b,c,d,e;
            //Math.floor() 返回小于或等于一个给定数字的最大整数
            a = Math.floor(Math.random()*5+1);
            b = Math.floor(Math.random()*5+1);
            c = Math.floor(Math.random()*5+1);
            d = Math.floor(Math.random()*5+1);
            e = Math.floor(Math.random()*5+1);
        }
        while(a+b+c+d+e!=20);
        console.log(a+'-'+b+'-'+c+'-'+d+'-'+e);
    }

    //用js实现随机选取10–100之间的10个数字，存入一个数组，并排序
    function test4() {
        var array=[];
        for (var i=0;i<10;i++) {
            array.push(Math.floor(Math.random()*90+10));
        }
        console.log(array.sort().reverse())
    }

    //			16、var numberArray = [3,6,2,4,1,5]; （考察基础API）
//			1) 实现对该数组的倒排，反转，输出[5,1,4,2,6,3]
//			reverse()
//			2) 实现对该数组的降序排列，输出[6,5,4,3,2,1]
//			冒泡排序

    //字符串翻转与数组翻转
    // var str="abcdef";
    // console.log(str.split("").reverse().join(""))
    //
    // var numberArray = [3,6,2,4,1,5];
    // console.log(numberArray.reverse());


    //去除前后空格
    // var str = "     sss    "
    // var t= str.replace(/(^\s*)|(\s*$)/g, "");
    // console.log(t);

    //replace() 方法用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。
    // var str="Welcome to Microsoft! "
    // str=str + "We are proud to announce that Microsoft has "
    // str=str + "one of the largest Web Developers sites in the world."
    //
    // var t = str.replace(/Microsoft/g, "W3School");
    // console.log(t);


});
