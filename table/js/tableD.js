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
        editTd = $('td.edit .cell-box');
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
    $('#table_primary_tableLayout').css({'width':tbW+'px','height':tbH+'px'});
    $('#table_primary_tableData').css({'width':tbW+'px','height':tbH+'px'});
    $('#table_primary_tableHead').css({'width':tbW-17+'px'});
    $('#table_primary_tableColumn').css({'height':tbH-17+'px'});
}

//回车事件
document.onkeydown=function(event){
    var objAc,idAc,idNe,posY,posX;
    var e = event || window.event || arguments.callee.caller.arguments[0];

    if(e && e.keyCode==13){
        var act = $(document.activeElement).parent();
        if(act.parent().attr("class").indexOf("edit")>-1){
            var i = editTd.index(act)+1;
            if(i>=editTd.length) i = 0;
            editTd.eq(i).click();
        }
    }else if(e && e.keyCode == 39){
        objAc = $('.cell-box.active') || $('#cell_9_1');
        idAc = objAc.attr("id");
        console.log(idAc);
        idNe = idAc.match(/\d+/g);
        posY = idNe[0];
        posX = ++idNe[1];
        $('#cell_'+posY+'_'+posX).click();
    }else if(e && e.keyCode == 37){
        objAc = $('.cell-box.active') || $('#cell_9_1');
        idAc = objAc.attr("id");
        console.log(idAc);
        idNe = idAc.match(/\d+/g);
        posY = idNe[0];
        posX = --idNe[1];
        $('#cell_'+posY+'_'+posX).click();
    }else if(e && e.keyCode == 38){
        objAc = $('.cell-box.active') || $('#cell_9_1');
        idAc = objAc.attr("id");
        console.log(idAc);
        idNe = idAc.match(/\d+/g);
        posY = --idNe[0];
        posX = idNe[1];
      console.log('#cell_'+posY+'_'+posX);
        $('#cell_'+posY+'_'+posX).click();
    }else if(e && e.keyCode == 40){
        objAc = $('.cell-box.active') || $('#cell_9_1');
        idAc = objAc.attr("id");
        console.log(idAc);
        idNe = idAc.match(/\d+/g);
        posY = ++idNe[0];
        posX = idNe[1];
        $('#cell_'+posY+'_'+posX).click();
    }
};

//function表格变化
function tableToChange(callback) {
    setTimeout(function () {
        winHeight = window.innerHeight || document.body.clientHeight;
        winWidth = window.innerWidth || document.body.clientWidth;
        var $tableBox = $('#table_box');
        var $tablePrimary = $('#table_primary');
        var numObj = tableCreat($tablePrimary,1,5);
        fRows = $tableBox.attr("freezeRowNum")-(-1) || 1;
        fCols = $tableBox.attr("freezeColumnNum")-(-1) || 1;
        console.log(fRows + ","+ fCols);
        freezeTable($("#table_primary"),fRows,fCols,winWidth,winHeight);
        $("#table_primary_tableHead .cell-box,#table_primary_tableColumn .cell-box,#table_primary_tableFix .cell-box").removeAttr("id");
        if( typeof (callback)=="function"){
            callback();
        }
    },1000)
}


//创建初始化表格
function tableCreat($table,addRow,addCol) {
    var trs = $table.find('tr');
    var tdLen = 0,trLen;
    var trHead = '<td><div class="cell-box head"></div></td>';
    var tdModel = '<td><div class="cell-box"></div></td>';
    var tdHead = '<td><div class="cell-box head"></div></td>';
    var addHtml = '',addTop = '';
    trLen = trs.length;
   for(var i=0;i<trLen;i++){
       var tds = trs.eq(i).find("td");
       var trHtml = '';
       for(var j = 0;j<tds.length;j++) {
           var td = tds.eq(j);
           if(i == 0){
               var tdW = td.attr('colspan') || 1;
               tdLen += parseInt(tdW);
           }
           var ht = td.html();
           var style = td.attr('style') || "";
           var align = td.attr('align') || "center";
           td.html('<div id="cell_'+i+'_'+j+'" class="cell-box" style="'+style+'text-align: '+align+'\;" onclick="tdActive(this)">'+ht+'</div>');
       }
       for(var k =0; k<addCol;k++){
           trHtml += tdModel;
       }
       trs.eq(i).prepend('<td class="head"><div class="cell-box">'+i+'</div></td>');

       trs.eq(i).append(trHtml);
   }


   //增加底部
   for(var l=0;l<addRow;l++){
       addHtml += '<tr><td class="head"><div class="cell-box">'+(trLen+l)+'</div></td>';
       for(var m=0; m < addCol + tdLen;m++){
            addHtml += tdModel;
       }
       addHtml += '</tr>';
   }

   //增加顶部
   addTop = '<tr><td class="horn"><div class="cell-box"></div></td>';
    for(var n=0; n < addCol + tdLen;n++){
       if(n<26){
           addTop += '<td  class="title"><div class="cell-box">'+String.fromCharCode(65 + n)+'</div></td>';
       }else {
           addTop += '<td  class="title"><div class="cell-box">A'+String.fromCharCode(65 + n -26)+'</div></td>';
       }
    }
    addTop +='</tr>';

    $table.find('tbody').prepend(addTop);
    $table.find('tbody').append(addHtml);
    return {trNum: trLen,tdNum: tdLen};
}
//表格加工（固定行列）
function tableTransform($table,rows,cols) {


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
    console.log($(obj).parent().parent().parent().parent().parent());
    var activeOdd = $('.active') || null;//active对象数组

    if(activeOdd){
        activeOdd.removeClass('active');
    }
    var $obj = $(obj);
    $obj.addClass('active');
    if ($obj.find('input[type="text"]').length > 0) {
        $obj.find('input[type="text"]').eq(0).focus();
    }

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