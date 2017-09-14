//计算公式
var formula_array = [];
//校验公式
var valid_array = [];
var operation_array = ['>=','==','<=','!=','>','<'];

/*获取校验运算符*/
function GetOperation(valid){
    for(var i = 0;i < operation_array.length;i++) {
        if(valid.indexOf(operation_array[i])>-1) {
            return operation_array[i];
        }
    }
}
/*全部计算*/
function CALAll(myform){
    for (var i=0;i<myform.elements.length;i++) {
        if ((myform.elements[i].getAttribute("onblur")+"").indexOf("ColInput(this)")>-1) {
            if(ColInput(myform.elements[i]) == false) {
                var obj = myform.elements[i];
                tdActive(obj.parentNode.parentNode);
                obj.select();
                return false;
            }
        }
    }
    return true;
}
/*输入计算、校验*/
function ColInput(obj) {
    if (checkInput(obj) == false) return false;
    var RowCode = obj.getAttribute("row");
    var ColCode = obj.getAttribute("col");
    for (var j = 0; j < formula_array.length; j++) {
        var ListName = "entitylist";
        var f = formula_array[j].split(",");
        if(f.length>1)	ListName=f[1];
        CAL(f[0], RowCode, ColCode, ListName);
    }
    if(obj.value!=""){
        for (var j = 0; j < valid_array.length; j++) {
            var ListName = "entitylist";
            var v = valid_array[j].split(",");
            if(v.length>1)	ListName=v[1];
            var r = VAL(v[0], RowCode, ColCode, ListName)
            if(r[0]==false) {
                alert("数据错误！不符合公式："+r[1]);
                return false;
            }
        }
    }
    return true;
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
/*校验*/
function VAL(valid, RowCode, ColCode, ListName) {
    var operation = GetOperation(valid);
    var result = valid.split(operation)[0].replace(/\"/g, "");
    var r = true;
    if (/^\d+$/.test(result)) {
        r = VAL_C(valid, RowCode, ColCode, ListName);
    } else if (/^[A-Za-z]+$/.test(result)) {
        r = VAL_R(valid, RowCode, ColCode, ListName);
    } else {
        r = VAL_L(valid, RowCode, ColCode, ListName);
    }
    return r;
}
/*单元格计算*/
function CAL_L(formula, RowCode, ColCode, ListName) {
    if(formula.indexOf('"'+ ColCode + (Number(RowCode)+1) +'"')>-1){
        var result = formula.split("=")[0];
        var process = formula.split("=")[1];
        var reg = /\"([^\"]*)\"/g;
        var arr = process.match(reg);
        var fnull = 0;
        for (var i = 0; i < arr.length; i++) {
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
}
/*单元格校验*/
function VAL_L(valid, RowCode, ColCode, ListName) {
    if(valid.indexOf('"'+ ColCode + (Number(RowCode)+1) +'"')>-1){
        var operation = GetOperation(valid);
        var result = valid.split(operation)[0];
        var process = valid.split(operation)[1];
        var display = process;
        var reg = /\"([^\"]*)\"/g;
        var arr = process.match(reg);
        var fnull = 0;
        for (var i = 0; i < arr.length; i++) {
            var r = arr[i].replace(/\"/g, "").replace(/[^0-9]+/g, "")-1;
            var c = arr[i].replace(/\"/g, "").replace(/[^a-zA-Z]+/g, "");
            var val = "";var dis = arr[i];
            if(document.getElementsByName(ListName+"/entity[@hciTagIndex='" + r + "']/COL_" + c)[0]) {
                val = document.getElementsByName(ListName+"/entity[@hciTagIndex='" + r + "']/COL_" + c)[0].value;
                dis = document.getElementsByName(ListName+"/entity[@hciTagIndex='" + r + "']/COL_" + c)[0].getAttribute("eos_displayname");
            }
            if (val != "") fnull++;
            display = display.replace(arr[i], dis);
            process = process.replace(arr[i], Number(val));
        }
        var r = result.replace(/\"/g, "").replace(/[^0-9]+/g, "")-1;
        var c = result.replace(/\"/g, "").replace(/[^a-zA-Z]+/g, "");
        var val = "";
        if (fnull != 0) val = Number(eval(process)).toFixed(2);
        if(document.getElementsByName(ListName+"/entity[@hciTagIndex='" + r + "']/COL_" + c)[0]){
            var robj = document.getElementsByName(ListName+"/entity[@hciTagIndex='" + r + "']/COL_" + c)[0];
            var v = "Number(" + robj.value + ")" + operation + "Number(" + val + ")";
            return [eval(v),robj.getAttribute("eos_displayname") + operation + display];
        }
        return true;
    }
    return true;
}
/*行计算*/
function CAL_C(formula, RowCode, ColCode, ListName) {
    if(formula.indexOf('"'+ Number(RowCode)+1 +'"')>-1){
        var result = formula.split("=")[0];
        var process = formula.split("=")[1];
        var reg = /\"([^\"]*)\"/g;
        var arr = process.match(reg);
        var fnull = 0;
        for (var i = 0; i < arr.length; i++) {
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
}
/*行校验*/
function VAL_C(valid, RowCode, ColCode, ListName) {
    if(valid.indexOf('"'+ Number(RowCode)+1 +'"')>-1){
        var operation = GetOperation(valid);
        var result = valid.split(operation)[0];
        var process = valid.split(operation)[1];
        var display = process;
        var reg = /\"([^\"]*)\"/g;
        var arr = process.match(reg);
        var fnull = 0;var dis = arr[i];
        for (var i = 0; i < arr.length; i++) {
            var r = arr[i].replace(/\"/g, "")-1;
            var c = ColCode;
            var val = "";
            if(document.getElementsByName(ListName+"/entity[@hciTagIndex='" + r + "']/COL_" + c)[0]) {
                val = document.getElementsByName(ListName+"/entity[@hciTagIndex='" + r + "']/COL_" + c)[0].value;
                dis = document.getElementsByName(ListName+"/entity[@hciTagIndex='" + r + "']/COL_" + c)[0].getAttribute("eos_displayname");
            }
            if (val != "") fnull++;
            display = display.replace(arr[i], dis);
            process = process.replace(arr[i], Number(val));
        }
        var r = result.replace(/\"/g, "")-1;
        var c = ColCode;
        var val = "";
        if (fnull != 0) val = Number(eval(process)).toFixed(2);
        if(document.getElementsByName(ListName+"/entity[@hciTagIndex='" + r + "']/COL_" + c)[0]){
            var robj = document.getElementsByName(ListName+"/entity[@hciTagIndex='" + r + "']/COL_" + c)[0];
            var v = "Number(" + robj.value + ")" + operation + "Number(" + val + ")";
            return [eval(v),robj.getAttribute("eos_displayname") + operation + display];
        }
        return true;
    }
    return true;
}
/*列计算*/
function CAL_R(formula, RowCode, ColCode, ListName) {
    if(formula.indexOf('"' + ColCode + '"')>-1){
        var result = formula.split("=")[0];
        var process = formula.split("=")[1];
        var reg = /\"([^\"]*)\"/g;
        var arr = process.match(reg);
        var fnull = 0;
        for (var i = 0; i < arr.length; i++) {
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
}
/*列校验*/
function VAL_R(valid, RowCode, ColCode, ListName) {
    if(valid.indexOf('"' + ColCode + '"')>-1){
        var operation = GetOperation(valid);
        var result = valid.split(operation)[0];
        var process = valid.split(operation)[1];
        var display = process;
        var reg = /\"([^\"]*)\"/g;
        var arr = process.match(reg);
        var fnull = 0;var dis = arr[i];
        for (var i = 0; i < arr.length; i++) {
            //alert(arr[i].replace(/\"/g,""));
            //公式替换
            var r = RowCode;
            var c = arr[i].replace(/\"/g, "");
            val = "";
            if(document.getElementsByName(ListName+"/entity[@hciTagIndex='" + r + "']/COL_" + c)[0]) {
                val = document.getElementsByName(ListName+"/entity[@hciTagIndex='" + r + "']/COL_" + c)[0].value;
                dis = document.getElementsByName(ListName+"/entity[@hciTagIndex='" + r + "']/COL_" + c)[0].getAttribute("eos_displayname");
            }
            if (val != "") fnull++;
            display = display.replace(arr[i], dis);
            process = process.replace(arr[i], Number(val));
        }
        //公式计算、赋值
        var r = RowCode;
        var c = result.replace(/\"/g, "");
        var val = "";
        if (fnull != 0) val = Number(eval(process)).toFixed(2);
        if(document.getElementsByName(ListName+"/entity[@hciTagIndex='" + r + "']/COL_" + c)[0]){
            var robj = document.getElementsByName(ListName+"/entity[@hciTagIndex='" + r + "']/COL_" + c)[0];
            var v = "Number(" + robj.value + ")" + operation + "Number(" + val + ")";
            return [eval(v),robj.getAttribute("eos_displayname") + operation + display];
        }
        return true;
    }
    return true;
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
        freezeRowNum = parseInt(freezeRowNum)

    if (typeof(freezeColumnNum) == 'string')
        freezeColumnNum = parseInt(freezeColumnNum)

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

    divTableData.append(table);

    if (divTableColumn != null) {
        var tableColumnClone = table.clone(true);
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

    if (divTableHead != null) {
        var tableHeadClone = table.clone(true);
        tableHeadClone.attr("id", tableId + "_tableHeadClone");
        tableHeadClone.find("tr").each(function(RowIndex){
            if(RowIndex>=freezeRowNum){
                $(this).remove();
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

    if (divTableFix != null) {
        var tableFixClone = table.clone(true);
        tableFixClone.attr("id", tableId + "_tableFixClone");
        tableFixClone.find("tr").each(function(RowIndex){
            if(RowIndex>=freezeRowNum){
                $(this).remove();
            }
            else{
                $(this).find("td").each(function(ColumnIndex){
                    if(ColumnIndex>=freezeColumnNum){
                        $(this).remove();
                    }
                })
            }
        })
        divTableFix.append(tableFixClone);
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
