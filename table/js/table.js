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

//回车事件
document.onkeydown=function(event){
    var objAc,idAc,idNe,posY,posX;
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if(e && e.keyCode==13){
        var act = $(document.activeElement).parent();
        if(act.attr("class").indexOf("edit")>-1){
            var i = editTd.index(act)+1;
            if(i>=editTd.length) i = 0;
            editTd.eq(i).click();
        }
    }else if(e && e.keyCode == 39){
        objAc = $('.cell-box.active');
        idAc = objAc.attr("id");
        idNe = idAc.match(/\d+/g);
        posY = idNe[0];
        posX = ++idNe[1];
        $('#cell_'+posY+'_'+posX +' .cell-c-box').click();
    }else if(e && e.keyCode == 37){
        objAc = $('.cell-box.active');
        idAc = objAc.attr("id");
        idNe = idAc.match(/\d+/g);
        posY = idNe[0];
        posX = --idNe[1];
        $('#cell_'+posY+'_'+posX +' .cell-c-box').click();
    }else if(e && e.keyCode == 38){
        objAc = $('.cell-box.active');
        idAc = objAc.attr("id");
        idNe = idAc.match(/\d+/g);
        posY = --idNe[0];
        posX = idNe[1];
        $('#cell_'+posY+'_'+posX +' .cell-c-box').click();
    }else if(e && e.keyCode == 40){
        objAc = $('.cell-box.active');
        idAc = objAc.attr("id");
        idNe = idAc.match(/\d+/g);
        posY = ++idNe[0];
        posX = idNe[1];
        $('#cell_'+posY+'_'+posX +' .cell-c-box').click();
    }
};

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


//创建初始化表格
function tabCreat(row, col, $table) {
    var trs = $table.find('tr');
    var rowCD = [];
    rows = trs.length;
    cols = 0;
    var minWidthCell = 90;
    var tableBg = '<table id="table_changed" cellpadding="0" cellspacing="0" style="border-collapse:separate;">';
    for (var i = 0; i < row; i++) {
        rowCD[i] = 0;
    }
    for (var i = 0; i < trs.length; i++) {
        var tds = trs.eq(i).find('td');
        tableBg += '<tr>';
        for (var j = 0; j < tds.length + col; j++) {
            var td = tds.eq(j);
            var colsp = parseInt(RCspan(td.attr('colspan')));
            var rowsp = parseInt(RCspan(td.attr('rowspan')));
            var tdAlign, tdWidth, tdHeight, tdtype,tdWidthC, tdStyle;
            if (i == 0) {
                cols += colsp;
            }
            if (j == 0) {
                tableBg += '<td class="title"><div class="td-box"><div class="cell-box"><div class="cell-c-box">' + (i + 1) + '</div></div></div></td>'
            }
            if (td.length !== 0) {
                tdWidthC= (minWidthCell>td.width())?minWidthCell:td.width();
                tdWidth = td.attr('width')|| tdWidthC;
                tdHeight = td.height();
                tdAlign = RAlign(td.attr('align'));
                tdStyle = RStyle(td.attr('style'));
                tdtype = RType(td.attr('csstype'));
                tableBg += '<td csstype=' + tdtype + ' colspan=' + colsp + ' rowspan=' + rowsp + ' align=' + tdAlign + ' style="'+ tdStyle +'"><div class="td-box" style="min-width: ' + tdWidth + 'px; min-height: ' + tdHeight + 'px;"><div class="cell-box" onclick="tdActive(this)" id="cell_'+i+'_'+j+'" style=" text-align: ' + tdAlign + '"><div class="cell-c-box">' + td.html() + '</div></div></div></td>';
            } else {
                tableBg += '<td><div class="td-box"><div class="cell-box"></div></div></td>'
            }
        }
        tableBg += '</tr>';
    }
    for (var i = trs.length; i < trs.length + row; i++) {
        tableBg += '<tr>';
        for (var j = 0; j < cols; j++) {
            if (j == 0) {
                tableBg += '<td class="title"><div class="td-box"><div class="cell-box"><div class="cell-c-box">' + (i + 1) + '</div></div></div></td>'
            }
            tableBg += '<td><div class="td-box" style="min-width: '+minWidthBlank+'px;"><div class="cell-box"></div></div></td>';
        }
        tableBg += '</tr>';
    }
    return {table: tableBg, colCount: cols};
}
//创建div盒子表格
function tableBoxCreat($table, cols) {
    var tdTop = '<tr>';
    tdTop += '<td class="title"><div class="td-box"><div class="cell-box"><div class="cell-c-box"></div></div></div></td>';
    for (var i = 1; i <= cols; i++) {
        if (i > 26) {
            tdTop += '<td class="title"><div class="td-box" style="min-width: '+minWidthBlank+'px;"><div class="cell-box"><div class="cell-c-box">A' + String.fromCharCode(64 + i - 26) + '</div></div></div></td>';
        }
        else {
            tdTop += '<td class="title"><div class="td-box" style="min-width: '+minWidthBlank+'px;"><div class="cell-box"><div class="cell-c-box">' + String.fromCharCode(64 + i) + '</div></div></div></td>';
        }
    }
    tdTop += '</tr>';
    $table.prepend(tdTop);
    $('#table_changed td[csstype="edit"] .cell-c-box').addClass('edit');
    $('#table_changed td[csstype="two"]').addClass('two');
    $('#table_changed td[csstype="three"]').addClass('three');
}
//返回1或属性值
function RCspan(n) {
    return n || 1;
}
//返回对齐方式或者center
function RAlign(n) {
    return n || 'center';
}
//返回edit属性
function RType(type) {
    return type || 'default';
}

//返回属性
function RStyle(style) {
    return style || '';
}
//
//设置表格宽度
function setTableSize(tableWidth) {
    var tableBox = document.getElementById('table_box');
    tableBox.style.height = (window.innerHeight || document.body.clientHeight ) + 'px';
    tableBox.style.width = tableWidth + 'px';
}
//点击选中
function tdActive(obj) {
    var tdall = $('#table_changed .cell-box');//active对象数组
    var $obj = $(obj);
    tdall.eq(ad).removeClass('active');
    $obj.addClass('active');
    if ($obj.find('input[type="text"]').length > 0) {
        $obj.find('input[type="text"]').eq(0).focus();
    }
    ad = tdall.index($obj);
}

function changeZoom(sz) {
    $('body').css({'zoom': sz});
}

function ok(){
    falert_status = 1;
    if(checkForm(document.form1) == false) {
        return;
    } else {
        CALAll(document.form1);
        $(document.form1).ajaxSubmit(options);
        return true;
    }
}

function showRequest(formData, jqForm, options) {
    $("#loading").bind("ajaxStart",function() {
        $(this).show();
    }).bind("ajaxStop",function() {
        $(this).hide();
    });
    return true;
}