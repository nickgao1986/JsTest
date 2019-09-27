function MaxChar(str) {
    this.str = str || '';
    this.maxCharMeta = {};
}

MaxChar.prototype.parse = function () {
    var str = this.str;
    var objChar = {},
    maxCounter = 0;
    /**
     objChar={
        a:{
            char:'a',
            num:3,
            index:[2,3,4]
        }
     }

     */
    for(var i=0;i<str.length;i++) {
        if(objChar[str[i]]) {
            objChar[str[i]].num++;
            objChar[str[i]].indexs.push(i);
        }else{
            var meta = {
                char:str[i],
                num:1,
                indexs:[i]
            }
            objChar[str[i]] = meta;
        }
        if(maxCounter<objChar[str[i]].num) {
            this.maxCharMeta = objChar[str[i]];
            maxCounter = objChar[str[i]].num;
        }
    }
    return this;
}

MaxChar.prototype.maxCharInfo = function () {
    return this.maxCharMeta;
}

var maxCharOut = {
    inputStr:null,
    parseStr:null,
    init:function () {
        this.getStrInfo();

        
    },
    getStrInfo:function () {
        var inputStr = document.getElementById('inputStr');
        var btn = document.getElementById('calculateBtn');
        btn.onclick = function () {
            maxCharOut.inputStr = inputStr.value;
            maxCharOut.parse();
            maxCharOut.chatView();
        }
    },
    parse:function () {
        this.parseStr = new MaxChar(this.inputStr).parse().maxCharInfo();
    },
    chatView:function () {
        var maxChar = document.getElementById('maxChar');
        var maxCounter = document.getElementById('maxCounter');
        var strIndex = document.getElementById('strIndex');
        if(this.parseStr) {
            maxChar.innerHTML = this.parseStr.char;
            maxCounter.innerHTML = this.parseStr.num;
            strIndex.innerHTML = this.parseStr.indexs.join(',');
        }

    }
};

(function () {
    maxCharOut.init();
})();