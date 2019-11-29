function Guestbook(fields, token, opt, cb) {
    var gb = this
    ,   error
    ,   datas
    ,   isSending = true
    ,   languageSetting = {
        'zh-CN' :{
            emptyInput  : '请填写{field}',
            emptyChoose : '请选择{field}',
            emptyLength : '长度不能为0',
            maxLength   : '{field}的长度不能超过{max}个字符',
            randLength  : '{field}请控制在{min}~{max}个字符之内',
            verify      : '验证码',
        },
        'tr' :{
            emptyInput  : '請填寫{field}',
            emptyChoose : '請選擇{field}',
            emptyLength : '長度不能為0',
            maxLength   : '{field}的長度不能超過{max}個字元',
            randLength  : '{field}請控制在{min}~{max}個字元之內',
            verify      : '驗證碼',
        },
        'en' :{
            emptyInput  : 'Please input {field}',
            emptyChoose : 'Please choose {field}',
            emptyLength : 'Length can not be empty',
            maxLength   : 'The length of {field} should not exceed {max} characters',
            randLength  : '{field} please control within {min}~{max} characters',
            verify      : 'Verification Code',
        },
    };

    this.valids = {};
    this.language = opt.language || 'zh-CN';
    this.language = this.language in languageSetting ? this.language : this.language.split('-')[0]; // fr-CA fallback to fr
    this.language = this.language in languageSetting ? this.language : 'zh-CN';
    var fieldParse = function(field) {
        this.field = field;
    };

    //不支持jQuery, 动态加载jQuery
    setTimeout(function(){ withjQuery();},1);

    fieldParse.prototype.parse = function() {
        var fp = this;
        // console.log(fp.field);
        if(fp.field.fieldname == 'verify'){
            fp.field.itemname = languageSetting[gb.language].verify;
        }
        return {
            valid: function () {
                var val  = (opt.parse && opt.parse[fp.field.fieldname]) ? opt.parse[fp.field.fieldname](gb) : gb.getEleByName(fp.field.fieldname)[0].value;
                var prompt  = '';
                var vallen = val.length;
                if ( (! vallen) && fp.field.valid == 1) {
                    prompt = languageSetting[gb.language].emptyInput.replace(/{field}/, fp.field.itemname);
                    fp.setError(fp.field.fieldname, prompt);
                    return;
                }

                if (fp.field.strlen && fp.field.strlen != "0") {
                    if ( (! vallen) && fp.field.strlen.substring(0, 1) == "0") {
                        prompt = languageSetting[gb.language].emptyLength;
                        fp.setError(fp.field.fieldname, prompt);
                        return;
                    }

                    switch(fp.field.strlen.indexOf(',')) {
                        // 限制最大值
                        case -1:
                            var max = parseInt(fp.field.strlen);
                            if( vallen > max ){
                                prompt = languageSetting[gb.language].maxLength.replace(/{field}/, fp.field.itemname);
                                prompt = prompt.replace(/{max}/, max);
                                fp.setError(fp.field.fieldname, prompt);
                                return;
                            }
                            break;

                        // 限制区间
                        default:
                            var min = parseInt(fp.field.strlen.split(',')[0])
                            ,   max = parseInt(fp.field.strlen.split(',')[1]);
                            if( vallen < min || vallen > max ){
                                prompt = languageSetting[gb.language].randLength.replace(/{field}/, fp.field.itemname);
                                prompt = prompt.replace(/{min}/, min);
                                prompt = prompt.replace(/{max}/, max);
                                fp.setError(fp.field.fieldname, prompt);
                                return;
                            }
                            break;
                    }

                }

                if ( fp.field.preg  && fp.field.preg instanceof Object) {

                    for (var i in fp.field.preg) {
                        eval('var reg = ' + fp.field.preg[i].reg);
                        if( val.match(reg) == null ){
                            fp.setError(fp.field.fieldname, fp.field.preg[i].msg);
                            return;
                        }
                    }
                }

                fp.setData(fp.field.fieldname, val);
            }
        };
    };

     fieldParse.prototype.setError = function(k, v) {
        if ( ! error) error = {};
        //error[Object.getOwnPropertyNames(error).length] = {'error':k,'msg':v};
        error[k] = v;
    }

    fieldParse.prototype.setData = function(k, v) {
        if ( ! datas) datas = {};
        datas[k] = v;
    }

    this.getEleByName = function(name) {
        return document.getElementsByName(token + '_' + name);
    };

    // 提交
    this.trigger = function(){
        if ( gb.validate('submit') && isSending ) {
            isSending = false;
            // jQuery引入后提交表单数据
            if(window.jQueryLoad){
                jQuery.ajax({
                    type: "POST",
                    url: document.getElementById(token).getAttribute('data-action'),
                    data: datas,
                    dataType: 'json',
                    success: function(data){

                        if(data.status == 1){
                            if(opt.onSuccess && typeof opt.onSuccess === "function" ){
                                opt.onSuccess(data);
                            }
                        }else{
                            if(opt.onError && typeof opt.onError === "function" ){
                                opt.onError(data);
                            }
                        }
                        isSending = true;
                    },
                    error:function(XMLHttpRequest, textStatus, errorThrown){
                        isSending = true;
                    }
                });
            }
        }
        return false;
    }

    // 验证
    this.validate = function(type) {
        error = datas = null;
        for (var i in fields) {
            if(!opt.allError && type != 'submit'){
                if(gb.getEleByName(i)[0] != this){
                    continue;
                }
            }
            if ( ! gb.valids[i]) {
                gb.valids[i] = new fieldParse(fields[i]).parse();
            }
            gb.valids[i].valid();
            // 有错误就进行跳出操作
            if(error && !opt.allError){
                break;
            }
        }
        if(cb( (! error ? true : error), gb)){
            return true;
        }
        return false;
    };

    if (fields) {
        opt.validate(this, this.validate);
        opt.trigger(this, this.trigger);
    }

    function withjQuery(callback) {
        if(!(window.jQuery)) {
            var js = document.createElement('script');
            js.setAttribute('src', 'https://code.jquery.com/jquery-1.8.3.min.js');
            js.setAttribute('type', 'text/javascript');
            js.onload = js.onreadystatechange = function() {
                if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
                    window.jQueryLoad = true;
                    js.onload = js.onreadystatechange = null;
                }
            };
            document.getElementsByTagName('head')[0].appendChild(js);
        }else{
            window.jQueryLoad = true;
        }
    }
}