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
                url: 'http://127.0.0.1:9901/wnsGUI.pr.spGUIExpand.do',
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
            if(value == 'Q'){
                return '';
            }else if(value == "T"){
                return 'status1';
            }
            return 'status2';
        },
        statusType2: function(index){
            if((index/5)%2 == 0){
                return 'status1';
            }
        },
        pz: function (value) {
            if (value == "83") {
                return 'wanxianmi';
            } else if (value == "84") {
                return 'yumi';
            } else if (value == "85") {
                return 'zaoxianmi';
            } else if (value == "88") {
                return 'xiaomai';
            } else if (value == "92") {
                return 'dadou';
            } else {
                return 'xiaomai';
            }
        }

    }
});

containerBox.dataSearch(warehouseId);