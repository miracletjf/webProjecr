/**
 * Created by MiracleTJF on 2017/8/11.
 */
var ad = 0;//当前获取active下标
var minWidthBlank = 10; //表格最小宽度
var falert_status = 1;
var winHeight,winWidth;
var msg = "";
var fRows,fCols,rows,cols;


loading();

function loading() {
    var loadHtml = '<div id="htmlTarget" style="display:none"></div><div class="loading-box" id="loading">'+
        '<div class="img-wrap">'+
        '<img src="css/icon/load.gif">'+
        '</div>'+
        '</div>';
    document.write(loadHtml);
}

var editTd;

$(document).ready(function () {
    if(document.form1){
        var t1 = setInterval("save()",60000);//自动保存1000为1秒钟
    }
    tableToChange(function () {
        changeZoom($('#zoom_size').html());
        $('#loading').hide();
        editTd = $('#table_changed td[csstype="edit"] .cell-c-box');
        editTd.eq(0).click();
    });
});
// 当窗口变化时执行
window.onresize = function(){
    var winW = window.innerWidth || document.body.clientWidth;
    var winH = window.innerHeight || document.body.clientHeight;
    reCount(winW,winH);
}
//重新计算宽高
function reCount(tbW,tbH){
    $('#table_changed_tableLayout').css({'width':tbW+'px','height':tbH+'px'});
    $('#table_changed_tableData').css({'width':tbW+'px','height':tbH+'px'});
    $('#table_changed_tableHead').css({'width':tbW-17+'px'});
    $('#table_changed_tableColumn').css({'height':tbH-17+'px'});
}



//function表格变化
function tableToChange(callback) {
    setTimeout(function () {
        winHeight = window.innerHeight || document.body.clientHeight;
        winWidth = window.innerWidth || document.body.clientWidth;
        var $tableBox = $('#table_box');
        var $tablePrimary = $('#table_primary');
        $tablePrimary.find('td').attr('nowrap', 'nowrap');
        var tableObj = tabCreat(20, 10, $tablePrimary);
        var tableTd = tableObj.table;
        var tableTdCol = tableObj.colCount;
        $tableBox.html(tableTd);
        tableBoxCreat($('#table_changed'), tableTdCol);
        fRows = $tableBox.attr("freezeRowNum")-(-1) || 1;
        fCols = $tableBox.attr("freezeColumnNum")-(-1) || 1;
        freezeTable($("#table_changed"),fRows,fCols,winWidth,winHeight);
        $("#table_changed_tableHead .cell-box,#table_changed_tableColumn .cell-box,#table_changed_tableFix .cell-box").removeAttr("onclick");
        if( typeof (callback)=="function"){
            callback();
        }
    },1000)
}

