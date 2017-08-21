/**
 * Created by MiracleTJF on 2017/8/11.
 */
var formula_array = [];

function CALAll(myform){
    var i;
    for (i=0;i<myform.elements.length;i++) {
        if ((myform.elements[i].getAttribute("onblur")+"").indexOf("ColInput(this)")) {
            ColInput(myform.elements[i]);
        }
    }
}

/*输入校验*/
function ColInput(obj) {
    if (checkInput(obj)) {
        var RowCode = obj.getAttribute("row");
        var ColCode = obj.getAttribute("col");
        for (j = 0; j < formula_array.length; j++) {
            var ListName = "entitylist";
            var f = formula_array[j].split(",");
            if(f.length>1)	ListName=f[1];
            CAL(f[0], RowCode, ColCode, ListName);
        }
    }
}

/*计算*/
function CAL(formula, RowCode, ColCode, ListName) {
    var result = formula.split("=")[0].replace(/\"/g, "");
    if (/^\d+$/.test(result)) {
        CAL_C(formula, RowCode, ColCode, ListName);
    } else if (/^[A-Za-z]+$/.test(result)) {
        CAL_R(formula, RowCode, ColCode, ListName);
    } else {
        CAL_L(formula, RowCode, ColCode, ListName);
    }
}

/*单元格计算*/

function CAL_L(formula, RowCode, ColCode, ListName) {
    var result = formula.split("=")[0];
    var process = formula.split("=")[1];
    var reg = /\"([^\"]*)\"/g;
    var arr = process.match(reg);
    var fnull = 0;
    for (i = 0; i < arr.length; i++) {
        var r = arr[i].replace(/\"/g, "").replace(/[^0-9]+/g, "")-1;
        var c = arr[i].replace(/\"/g, "").replace(/[^a-zA-Z]+/g, "");
        var val = "";
        if(document.getElementsByName(ListName+"/entity[@hciTagIndex='" + r + "']/COL_" + c)[0])
            val = document.getElementsByName(ListName+"/entity[@hciTagIndex='" + r + "']/COL_" + c)[0].value;
        if (val != "") fnull++;
        process = process.replace(arr[i], Number(val));
    }
    var r = result.replace(/\"/g, "").replace(/[^0-9]+/g, "")-1;
    var c = result.replace(/\"/g, "").replace(/[^a-zA-Z]+/g, "");
    var val = "";
    if (fnull != 0) val = Number(eval(process)).toFixed(2);
    if(document.getElementsByName(ListName+"/entity[@hciTagIndex='" + r + "']/COL_" + c)[0]){
        var robj = document.getElementsByName(ListName+"/entity[@hciTagIndex='" + r + "']/COL_" + c)[0];
        robj.value = val;
        showVal(robj, val);
    }
}

/*行计算*/

function CAL_C(formula, RowCode, ColCode, ListName) {
    var result = formula.split("=")[0];
    var process = formula.split("=")[1];
    var reg = /\"([^\"]*)\"/g;
    var arr = process.match(reg);
    var fnull = 0;
    for (i = 0; i < arr.length; i++) {
        var r = arr[i].replace(/\"/g, "")-1;
        var c = ColCode;
        var val = "";
        if(document.getElementsByName(ListName+"/entity[@hciTagIndex='" + r + "']/COL_" + c)[0])
            val = document.getElementsByName(ListName+"/entity[@hciTagIndex='" + r + "']/COL_" + c)[0].value;
        if (val != "") fnull++;
        process = process.replace(arr[i], Number(val));
    }
    var r = result.replace(/\"/g, "")-1;
    var c = ColCode;
    var val = "";
    if (fnull != 0) val = Number(eval(process)).toFixed(2);
    if(document.getElementsByName(ListName+"/entity[@hciTagIndex='" + r + "']/COL_" + c)[0]){
        var robj = document.getElementsByName(ListName+"/entity[@hciTagIndex='" + r + "']/COL_" + c)[0];
        robj.value = val;
        showVal(robj, val);
    }
}

/*列计算*/

function CAL_R(formula, RowCode, ColCode, ListName) {
    var result = formula.split("=")[0];
    var process = formula.split("=")[1];
    var reg = /\"([^\"]*)\"/g;
    var arr = process.match(reg);
    var fnull = 0;
    for (i = 0; i < arr.length; i++) {
        //alert(arr[i].replace(/\"/g,""));
        //公式替换
        var r = RowCode;
        var c = arr[i].replace(/\"/g, "");
        val = "";
        if(document.getElementsByName(ListName+"/entity[@hciTagIndex='" + r + "']/COL_" + c)[0])
            val = document.getElementsByName(ListName+"/entity[@hciTagIndex='" + r + "']/COL_" + c)[0].value;
        if (val != "") fnull++;
        process = process.replace(arr[i], Number(val));
    }
    //公式计算、赋值
    var r = RowCode;
    var c = result.replace(/\"/g, "");
    var val = "";
    if (fnull != 0) val = Number(eval(process)).toFixed(2);
    if(document.getElementsByName(ListName+"/entity[@hciTagIndex='" + r + "']/COL_" + c)[0]){
        var robj = document.getElementsByName(ListName+"/entity[@hciTagIndex='" + r + "']/COL_" + c)[0];
        robj.value = val;
        showVal(robj, val);
    }
}

/*对象是否在数组中*/
function in_array(stringToSearch, arrayToSearch) {
    for (s = 0; s < arrayToSearch.length; s++) {
        thisEntry = arrayToSearch[s].toString();
        if (thisEntry == stringToSearch) {
            return true;
        }
    }
    return false;
}

/*单元格是否在公式中*/
function in_formula(label, formula) {
    var process = formula.split("=")[1];
    var reg = /\"([^\"]*)\"/g;
    var arr = process.match(reg);
    return in_array("\"" + label + "\"", arr);
}

function showVal(obj, val) {
    if(obj.getAttribute("type")=="hidden"){
        if (obj.parentNode.lastChild.nodeName == "#text") {
            obj.parentNode.removeChild(obj.parentNode.lastChild);
        }
        var textnode = document.createTextNode(val);
        obj.parentNode.appendChild(textnode);
    }
}

/*
 * 锁定表头和列
 *
 * 参数定义
 *  table - 要锁定的表格元素或者表格ID
 *  freezeRowNum - 要锁定的前几行行数，如果行不锁定，则设置为0
 *  freezeColumnNum - 要锁定的前几列列数，如果列不锁定，则设置为0
 *  width - 表格的滚动区域宽度
 *  height - 表格的滚动区域高度
 */
function freezeTable(table, freezeRowNum, freezeColumnNum, width, height) {
    if (typeof(freezeRowNum) == 'string')
        freezeRowNum = parseInt(freezeRowNum);

    if (typeof(freezeColumnNum) == 'string')
        freezeColumnNum = parseInt(freezeColumnNum);

    var tableId;
    if (typeof(table) == 'string') {
        tableId = table;
        table = $('#' + tableId);
    } else
        tableId = table.attr('id');

    var divTableLayout = $("#" + tableId + "_tableLayout");

    if (divTableLayout.length != 0) {
        divTableLayout.before(table);
        divTableLayout.empty();
    } else {
        table.after("<div id='" + tableId + "_tableLayout' style='overflow:hidden;height:" + height + "px; width:" + width + "px;'></div>");

        divTableLayout = $("#" + tableId + "_tableLayout");
    }

    var html = '';
    if (freezeRowNum > 0 && freezeColumnNum > 0)
        html += '<div id="' + tableId + '_tableFix" style="padding: 0px;"></div>';

    if (freezeRowNum > 0)
        html += '<div id="' + tableId + '_tableHead" style="padding: 0px;"></div>';

    if (freezeColumnNum > 0)
        html += '<div id="' + tableId + '_tableColumn" style="padding: 0px;"></div>';

    html += '<div id="' + tableId + '_tableData" style="padding: 0px;"></div>';


    $(html).appendTo("#" + tableId + "_tableLayout");

    var divTableFix = freezeRowNum > 0 && freezeColumnNum > 0 ? $("#" + tableId + "_tableFix") : null;
    var divTableHead = freezeRowNum > 0 ? $("#" + tableId + "_tableHead") : null;
    var divTableColumn = freezeColumnNum > 0 ? $("#" + tableId + "_tableColumn") : null;
    var divTableData = $("#" + tableId + "_tableData");
    var tableClone = table.clone(true);
    divTableData.append(table);

    if (divTableFix != null) {
        var tableFixClone = tableClone;
        tableFixClone.attr("id", tableId + "_tableFixClone");
        tableFixClone.find("tr").each(function(RowIndex){
            if(RowIndex>=freezeRowNum){
                $(this).children().find("input,select").remove();
            }
            else{
                $(this).find("td").each(function(ColumnIndex){
                    if(ColumnIndex>=freezeColumnNum){
                        $(this).find("input,select").remove();
                    }
                })
            }
        })
        divTableFix.append(tableFixClone);
    }

    if (divTableHead != null) {
        var tableHeadClone = tableClone;
        tableHeadClone.attr("id", tableId + "_tableHeadClone");
        tableHeadClone.find("tr").each(function(RowIndex){
            if(RowIndex>=freezeRowNum){
                $(this).children().find("input,select").remove();
            }
            else{
                $(this).find("td").each(function(ColumnIndex){
                    if(ColumnIndex<freezeColumnNum){
                        $(this).find("input,select").remove();
                    }
                })
            }
        })
        divTableHead.append(tableHeadClone);
    }

    if (divTableColumn != null) {
        var tableColumnClone = tableClone;
        tableColumnClone.attr("id", tableId + "_tableColumnClone");
        tableColumnClone.find("tr").each(function(RowIndex){
            if(RowIndex<freezeRowNum){
                $(this).children().find("input,select").remove();
            }
            else{
                $(this).find("td").each(function(ColumnIndex){
                    if(ColumnIndex>=freezeColumnNum){
                        $(this).find("input,select").remove();
                    }
                })
            }
        })
        divTableColumn.append(tableColumnClone);
    }

    divTableData.find("tr").each(function(RowIndex){
        if(RowIndex<freezeRowNum){
            $(this).children().find("input,select").remove();
        }
        else{
            $(this).find("td").each(function(ColumnIndex){
                if(ColumnIndex<freezeColumnNum){
                    $(this).find("input,select").remove();
                }
            })
        }
    })

    $("#" + tableId + "_tableLayout table").css("margin", "0");

    if (freezeRowNum > 0) {
        var HeadHeight = 0;
        var ignoreRowNum = 0;
        $("#" + tableId + "_tableHead tr:lt(" + freezeRowNum + ")").each(function () {
            if (ignoreRowNum > 0)
                ignoreRowNum--;
            else {
                var td = $(this).find('td:first, th:first');
                HeadHeight += td.outerHeight(true);

                ignoreRowNum = td.attr('rowSpan');
                if (typeof(ignoreRowNum) == 'undefined')
                    ignoreRowNum = 0;
                else
                    ignoreRowNum = parseInt(ignoreRowNum) - 1;
            }
        });
//        HeadHeight += 2;

        divTableHead.css("height", HeadHeight);
        divTableFix != null && divTableFix.css("height", HeadHeight);
    }

    if (freezeColumnNum > 0) {
        var ColumnsWidth = 0;
        var ColumnsNumber = 0;
        $("#" + tableId + "_tableColumn tr:eq(" + freezeRowNum + ")").find("td:lt(" + freezeColumnNum + "), th:lt(" + freezeColumnNum + ")").each(function () {
            if (ColumnsNumber >= freezeColumnNum)
                return;

            ColumnsWidth += $(this).outerWidth(true);

            ColumnsNumber += $(this).attr('colSpan') ? parseInt($(this).attr('colSpan')) : 1;
        });
//        ColumnsWidth += 2;

        divTableColumn.css("width", ColumnsWidth);
        divTableFix != null && divTableFix.css("width", ColumnsWidth);
    }

    divTableData.scroll(function () {
        divTableHead != null && divTableHead.scrollLeft(divTableData.scrollLeft());

        divTableColumn != null && divTableColumn.scrollTop(divTableData.scrollTop());
    });

    divTableFix != null && divTableFix.css({ "overflow": "hidden", "position": "absolute", "z-index": "50" });
    divTableHead != null && divTableHead.css({ "overflow": "hidden", "width": width - 17, "position": "absolute", "z-index": "45" });
    divTableColumn != null && divTableColumn.css({ "overflow": "hidden", "height": height - 17, "position": "absolute", "z-index": "40" });
    divTableData.css({ "overflow": "scroll", "width": width, "height": height, "position": "absolute" });

    divTableFix != null && divTableFix.offset(divTableLayout.offset());
    divTableHead != null && divTableHead.offset(divTableLayout.offset());
    divTableColumn != null && divTableColumn.offset(divTableLayout.offset());
    divTableData.offset(divTableLayout.offset());
}

/*
 * 调整锁定表的宽度和高度，这个函数在resize事件中调用
 *
 * 参数定义
 *  table - 要锁定的表格元素或者表格ID
 *  width - 表格的滚动区域宽度
 *  height - 表格的滚动区域高度
 */
function adjustTableSize(table, width, height) {
    var tableId;
    if (typeof(table) == 'string')
        tableId = table;
    else
        tableId = table.attr('id');
    $("#" + tableId + "_tableLayout").width(width).height(height);
    $("#" + tableId + "_tableHead").width(width - 17);
    $("#" + tableId + "_tableColumn").height(height - 17);
    $("#" + tableId + "_tableData").width(width).height(height);
}

function pageHeight() {
    if ($.browser.msie) {
        return document.compatMode == "CSS1Compat" ? document.documentElement.clientHeight : document.body.clientHeight;
    } else {
        return self.innerHeight;
    }
};

//返回当前页面宽度
function pageWidth() {
    if ($.browser.msie) {
        return document.compatMode == "CSS1Compat" ? document.documentElement.clientWidth : document.body.clientWidth;
    } else {
        return self.innerWidth;
    }
};

/*
 $(document).ready(function() {
 var table = $("table");
 var tableId = table.attr('id');
 var freezeRowNum = table.attr('freezeRowNum');
 var freezeColumnNum = table.attr('freezeColumnNum');
 if (typeof(freezeRowNum) != 'undefined' + typeof(freezeColumnNum) != 'undefined') {
 freezeTable(table, freezeRowNum + 0, freezeColumnNum + 0, pageWidth(), pageHeight());

 var flag = false;
 $(window).resize(function() {
 if (flag)
 return ;

 setTimeout(function() {
 adjustTableSize(tableId, pageWidth(), pageHeight());
 flag = false;
 }, 100);

 flag = true;
 });
 }
 });*/
