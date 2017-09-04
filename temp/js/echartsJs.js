// 路径配置
    require.config({
        paths: {
            echarts: 'dist'
        }
    });

// 使用
require(
    [
        'echarts',
        'echarts/chart/pie', // 使用柱状图就加载bar模块，按需加载
        'echarts/chart/gauge' // 使用柱状图就加载bar模块，按需加载
    ],
    function (ec) {
        // 基于准备好的dom，初始化echarts图表
        var myChart1 = ec.init(document.getElementById('chart1'));
        var myChart2 = ec.init(document.getElementById('chart2'));

        var option1 = {
            tooltip : {
                formatter: "{a} <br/>{b} : {c}%"
            },
            series : [
                {
                    name:'直属库',
                    type:'gauge',
                    center : ['50%', '50%'],    // 默认全局居中
                    radius : [0, '75%'],
                    startAngle: 140,
                    endAngle : -140,
                    min: 0,                     // 最小值
                    max: 100,                   // 最大值
                    precision: 0,               // 小数精度，默认为0，无小数点
                    splitNumber: 10,             // 分割段数，默认为5
                    axisLine: {            // 坐标轴线
                        show: true,        // 默认显示，属性show控制显示与否
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: [[0.3, 'lightgreen'],[0.6, 'orange'],[1, '#ff4500']],
                            width: 30
                        }
                    },
                    axisTick: {            // 坐标轴小标记
                        show: true,        // 属性show控制显示与否，默认不显示
                        splitNumber: 5,    // 每份split细分多少段
                        length :8,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: '#eee',
                            width: 1,
                            type: 'solid'
                        }
                    },
                    axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                        show: false,

                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            color: '#333'
                        }
                    },
                    splitLine: {           // 分隔线
                        show: true,        // 默认显示，属性show控制显示与否
                        length :30,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: '#eee',
                            width: 2,
                            type: 'solid'
                        }
                    },
                    pointer : {
                        length : '80%',
                        width : 8,
                        color : 'auto'
                    },
                    title : {
                        show : true,
                        offsetCenter: ['-65%', -10],       // x, y，单位px
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            color: '#333',
                            fontSize : 15
                        }
                    },
                    detail : {
                        show : true,
                        backgroundColor: 'rgba(0,0,0,0)',
                        borderWidth: 0,
                        borderColor: '#ccc',
                        width: 100,
                        height: 40,
                        offsetCenter: ['-60%', 10],       // x, y，单位px
                        formatter:'{value}%',
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            color: 'auto',
                            fontSize : 30
                        }
                    },
                    data:[{value: 15, name: '健康指数'}]
                }
            ]
        };

        var option2 = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                x : 'right',
                y : 'center',
                data:['安全','轻微','严重']
            },
            calculable : true,
            series : [
                {
                    name:'健康指数',
                    type:'pie',
                    radius : '80%',
                    center: ['50%', '50%'],
                    data:[
                        {value:70, name:'安全'},
                        {value:20, name:'轻微'},
                        {value:10, name:'严重'}
                    ]
                }
            ],
            color : ['#2ec8ca','#fec516','#ff4500']
        };

        // 为echarts对象加载数据
        myChart1.setOption(option1);
        myChart2.setOption(option2);
    }
);