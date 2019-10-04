$(document).ready(function(){
    var sub=$("#sub")
    var activeRow//当前激活的一级菜单行
    var activeMenu//二级菜单

    //延迟
    var timer
    //鼠标是否在子菜单中
    var mouseInSub=false
    sub.on('mouseenter',function(e){
        mouseInSub=true
    }).on('mouseleave',function(e){
        mouseInSub=false
    })

    $("#test").on("mouseenter",function(e){
        sub.removeClass("none")
    }).on("mouseleave",function(e){
        sub.addClass("none")
        if(activeRow){
            activeRow.removeClass('active')
            activeRow=null
        }
        if(activeMenu){
            activeMenu.addClass('none');
            activeMenu=null;
        }


    }).on('mouseenter','li',function(e){
        if(!activeRow){
            activeRow=$(e.target)
            activeRow.addClass('active')
            activeMenu=$('#'+activeRow.data('id'))
            activeMenu.removeClass('none')
            return
        }
        if(timer){
            clearTimeout(timer)
        }

        timer=setTimeout(function(){
            if(mouseInSub){
                return
            }
            activeRow.removeClass('active');
            activeMenu.addClass('none')
            activeRow=$(e.target)
            activeRow.addClass('active')
            activeMenu=$('#'+activeRow.data('id'))
            activeMenu.removeClass('none')
            time=null
        },300)

    })
})