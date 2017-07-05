/**
 * Created by Administrator on 2017/4/18.
 */
var containerBox = new Vue({
    el : "#container_box",
    data: {
        storages: {},
        tuli: {}
    },
    methods: {
        dataSearch: function(objid){
            var _self = this;
            $.ajax({
                type: 'get',
                url: 'http://127.0.0.1:8180/wmsGUI.pr.spGUIExpand.do',
                dataType: 'jsonp',
                jsonp: 'callback',
                data: {
                    "param/sp_id": objid
                },
                success: function (data) {
                    _self.storages = data.sh;
                    _self.tuli = data.gb;
                    console.log(data);
                }
            });
        }
    },
    filters : {
        statusType: function (value) {
            if(value == 'P'){
                return '';
            }
            return 'status';
        },
        statusType2: function(index){
            if((index/5)%2 == 0){
                return 'status1';
            }
        },
        pz: function (value) {
            if (value == 83 || value == 85) {
                return 'xiaomai';
            } else if (value == 86) {
                return 'yumi';
            } else {
                return 'dadou';
            }
        }

    }
});

containerBox.dataSearch(warehouseId);