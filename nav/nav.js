$(function() {
    function  nav(liID,ulID) {
        var oLi = document.getElementById(liID);
        var oUl = document.getElementById(ulID);

        oLi.onmouseover = function () {
            oUl.style.height = '130px';
        };
        oLi.onmouseout = function () {
            oUl.style.height = '0';
        }
    }
    nav('li1','ul1');
    nav('li2','ul2');
    nav('li3','ul3');

});
