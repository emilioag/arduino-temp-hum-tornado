var temperatureOptions = {
    // backgroundColor: '#1b1b1b',
    tooltip : {
        formatter: "<i class='wi wi-thermometer'></i>&nbsp;&nbsp; {c} ºC",
        textStyle: {
            fontFamily: 'Lato'
        }
    },
    series : [
        {
            name:'Temperatura: ',
            type:'gauge',
            min:-20,
            max:50,
            splitNumber:7,
            radius: '50%',
            axisLine: {
                lineStyle: {
                    color: [
                        [0.49, '#1e90ff'],
                        [0.65, '#FFA500'],
                        [1, '#ff4500']],
                    width: 10,
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            axisLabel: {
                textStyle: {
                    fontWeight: 'bolder',
                    color: '#000',
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            axisTick: {
                length :15,        // 属性length控制线长
                lineStyle: {
                    color: 'auto',
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            splitLine: {           // 分隔线
                length :25,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    width:3,
                    color: '#fff',
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            pointer: {           // 分隔线
                shadowColor : '#fff', //默认透明
                shadowBlur: 0
            },
            title : {
                formatter:'{name} ºC',
                textStyle: {
                    fontWeight: 'bolder',
                    fontSize: 15,
                    fontFamily: 'Ubuntu Mono',
                    color: '#000',
                    shadowColor : '#fff',
                    shadowBlur: 10,
                },

            },
            detail : {
                backgroundColor: 'rgba(30,144,255,0.8)',
                borderWidth: 1,
                borderColor: '#fff',
                shadowColor : '#fff',
                shadowBlur: 5,
                offsetCenter: [0, '50%'],
                formatter:'{value} ºC',
                textStyle: {
                    fontWeight: 'bolder',
                    fontFamily: 'Ubuntu Mono',
                    color: '#fff',
                    fontSize: 19,
                }
            },
            data:[{value: 19.43, name: 'Temperatura'}]
        }
    ]
};

var humedadOptions = {
    // backgroundColor: '#1b1b1b',
    tooltip : {
        formatter: "<i class='wi wi-humidity'></i>&nbsp;&nbsp; {c} ºC",
        textStyle: {
            fontFamily: 'Lato'
        }
    },
    series : [
        {
            name:'Humedad: ',
            type:'gauge',
            min:0,
            max:100,
            splitNumber:10,
            radius: '50%',
            axisLine: {
                lineStyle: {
                    color: [
                        [0.2, '#1e90ff'],
                        [0.4, '#FFA500'],
                        [1, '#ff4500']],
                    width: 10,
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            axisLabel: {
                textStyle: {
                    fontWeight: 'bolder',
                    color: '#000',
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            axisTick: {
                length :15,        // 属性length控制线长
                lineStyle: {
                    color: 'auto',
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            splitLine: {           // 分隔线
                length :25,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    width:3,
                    color: '#fff',
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            pointer: {           // 分隔线
                shadowColor : '#fff', //默认透明
                shadowBlur: 0
            },
            title : {
                formatter:'{name} ºC',
                textStyle: {
                    fontWeight: 'bolder',
                    fontSize: 15,
                    fontFamily: 'Ubuntu Mono',
                    color: '#000',
                    shadowColor : '#fff',
                    shadowBlur: 10,
                },

            },
            detail : {
                backgroundColor: 'rgba(30,144,255,0.8)',
                borderWidth: 1,
                borderColor: '#fff',
                shadowColor : '#fff',
                shadowBlur: 5,
                offsetCenter: [0, '50%'],
                formatter:'{value} %',
                textStyle: {
                    fontWeight: 'bolder',
                    fontFamily: 'Ubuntu Mono',
                    color: '#fff',
                    fontSize: 19,
                }
            },
            data:[{value: 40, name: 'Humedad'}]
        }
    ]
};

function setColor(tempColor, humColor) {
    if ( tempColor <= 14 ) {
        tempColorOptions.series[0].detail.backgroundColor = '#1e90ff';
    } else if ( tempColor > 14 && tempColor < 26 ) {
        temperatureOptions.series[0].detail.backgroundColor = '#FFA500';
    } else {
        temperatureOptions.series[0].detail.backgroundColor = '#ff4500'
    }
    if ( humColor <= 20 ) {
        humedadOptions.series[0].detail.backgroundColor = '#1e90ff';
    } else if ( humColor > 20 && humColor <= 40 ) {
        humedadOptions.series[0].detail.backgroundColor = '#FFA500';
    } else {
        humedadOptions.series[0].detail.backgroundColor = '#ff4500'
    }
}

$(function($){
    if (!("WebSocket" in window)) {
        alert("Your browser does not support web sockets");
    }else{
        var temperaturaChart = echarts.init(document.getElementById('temperature'));
        var humedadChart = echarts.init(document.getElementById('humidity'));
        setup(temperaturaChart, humedadChart);
    }
    function setup(temperaturaChart, humedadChart){
        var host = "ws://192.168.1.38:9090/ws";
        var socket = new WebSocket(host);
        if(socket){
            socket.onopen = function(){
                console.log("Connection openned")
            }
            socket.onmessage = function(msg){

                var response = JSON.parse(msg["data"]);
                console.log(response);
                var temperature = response["Temperature"];
                var humidity = response["Humidity"];

                setColor(temperature, humidity);

                humedadOptions.series[0].data[0].value = humidity;
                temperatureOptions.series[0].data[0].value = temperature;
                humedadChart.setOption(humedadOptions);
                temperaturaChart.setOption(temperatureOptions);

            }
            socket.onclose = function(){
                console.log("The connection has been closed.");
            }
            socket.onerror = function(ev){
                console.log("on error");
            };
        }else{
            console.log("invalid socket");
        }
    }
});