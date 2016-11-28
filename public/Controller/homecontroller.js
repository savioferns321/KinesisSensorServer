homeapp.controller('homecontroller', function($scope, $http,socket) {
    $scope.getdata=function(){
        var chart;
        $scope.readingArr = [];
        socket.on('data', function(data) {

            if(isJson(data)){
                var jsonObj = JSON.parse(data);
                //console.log("JSON : "+ jsonObj);

                //console.log(jsonObj.time);
                //console.log(jsonObj['time']);
                console.log(jsonObj['reading']);
                $scope.readingArr.push(jsonObj['reading']);
            } else {
                console.log("String : "+ data);
            }

        });

        function isJson(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }

        $scope.chart = Highcharts.chart({
            chart: {
                renderTo: 'graphDiv',
                defaultSeriesType: 'spline',
                events: {
                    load: function () {

                        var series = this.series[0];
                        setInterval(function () {
                            var shift = series.data.length > 20,
                                point = 0,
                                x = new Date().getTime();
                            if (typeof $scope.readingArr !== 'undefined' && $scope.readingArr.length > 0) {
                                // the array is defined and has at least one element
                                point = $scope.readingArr.shift();
                                console.log("New point is : "+point);
                            }
                            console.log("Adding point : "+point);
                            series.addPoint([x, point], true, shift);
                        },1000);
                    }
                }
            },
            title: {
                text: 'Live data feed'
            },

            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150,
                maxZoom: 20 * 1000
            },

            series: [{
                name: 'Time',
                data: []
            }]
        });
    };

    $scope.getAggregationData = function () {

        $scope.dataArr = [];
        socket.on('data', function(data) {

            if(isJson(data)){
                var jsonObj = JSON.parse(data);
                $scope.dataArr.push(jsonObj);

            } else {
                console.log("String : "+ data);
            }

        });

        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });


        //TODO Add option for historical data
        $scope.charts = {
            tempChart: Highcharts.chart({
                chart: {
                    renderTo: 'tempChartDiv',
                    defaultSeriesType: 'spline',
                    events: {
                        load: loadData
                    }
                },
                /*rangeSelector: {
                 buttons: [{
                 count: 1,
                 type: 'hour',
                 text: '1H'
                 }, {
                 count: 5,
                 type: 'hour',
                 text: '5H'
                 }, {
                 type: 'all',
                 text: 'All'
                 }],
                 inputEnabled: false,
                 selected: 0
                 },*/
                title: {
                    text: 'Live temperature data'
                },

                xAxis: {
                    type: 'datetime',
                    tickPixelInterval: 150,
                    maxZoom: 20 * 1000
                },

                series: [{
                    name: 'Temperature',
                    data: []
                }]
            }),

            aqiChart: Highcharts.chart({
                chart: {
                    renderTo: 'aqiChartDiv',
                    defaultSeriesType: 'spline',
                    events: {
                        load: loadData
                    }
                },
                title: {
                    text: 'Live AQI data'
                },

                xAxis: {
                    type: 'datetime',
                    tickPixelInterval: 150,
                    maxZoom: 20 * 1000
                },

                series: [
                    {
                        name: 'Carbon Monoxide',
                        data: []
                    },
                    {
                        name: 'Carbon Dioxide',
                        data: []
                    }
                ]
            }),
            humidityChart: Highcharts.chart({
                chart: {
                    renderTo: 'humidityChartDiv',
                    defaultSeriesType: 'spline',
                    events: {
                        load: loadData
                    }
                },
                title: {
                    text: 'Live humidity data'
                },

                xAxis: {
                    type: 'datetime',
                    tickPixelInterval: 150,
                    maxZoom: 20 * 1000
                },

                series: [{
                    name: 'Humidity',
                    data: []
                }]
            }),



            windDirectionChart: Highcharts.chart('windDirectionDiv', {

                chart: {
                    type: 'gauge',
                    plotBackgroundColor: null,
                    plotBackgroundImage: null,
                    plotBorderWidth: 0,
                    plotShadow: false
                },

                title: {
                    text: 'Wind Speedometer'
                },

                pane: {
                    startAngle: -150,
                    endAngle: 150,
                    background: [{
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, '#FFF'],
                                [1, '#333']
                            ]
                        },
                        borderWidth: 0,
                        outerRadius: '109%'
                    }, {
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, '#333'],
                                [1, '#FFF']
                            ]
                        },
                        borderWidth: 1,
                        outerRadius: '107%'
                    }, {
                        // default background
                    }, {
                        backgroundColor: '#DDD',
                        borderWidth: 0,
                        outerRadius: '105%',
                        innerRadius: '103%'
                    }]
                },

                // the value axis
                yAxis: {
                    min: 0,
                    max: 10.0,

                    minorTickInterval: 'auto',
                    minorTickWidth: 1,
                    minorTickLength: 10,
                    minorTickPosition: 'inside',
                    minorTickColor: '#666',

                    tickPixelInterval: 30,
                    tickWidth: 2,
                    tickPosition: 'inside',
                    tickLength: 10,
                    tickColor: '#666',
                    labels: {
                        step: 2,
                        rotation: 'auto'
                    },
                    title: {
                        text: 'km/h'
                    },
                    plotBands: [{
                        from: 0,
                        to: 5,
                        color: '#55BF3B' // green
                    }, {
                        from: 5,
                        to: 8,
                        color: '#DDDF0D' // yellow
                    }, {
                        from: 8,
                        to: 10,
                        color: '#DF5353' // red
                    }]
                },

                series: [{
                    name: 'Speed',
                    data: [5],
                    tooltip: {
                        valueSuffix: ' km/h'
                    }
                }]

            })
        };



        function isJson(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }

        function loadData(){
            setInterval(function () {

                var currentTime = new Date().getTime();
                var shiftValue = 20;
                if($scope.dataArr.length > 0){
                    var currJson = $scope.dataArr.shift();
                    currentTime = new Date(currJson['time']).getTime();

                    //Temperature chart


                    try {
                        var tempShift = $scope.charts.tempChart.series[0].data.length > shiftValue;

                        $scope.charts.tempChart.series[0].addPoint([currentTime, parseFloat(currJson['airTemperature'])], true, tempShift);
                        console.log("Current temperature "+parseFloat(currJson['airTemperature']));

                    } catch (e){
                        console.log("Error found"+ parseFloat(currJson['airTemperature'])+"\n current time "+ currentTime, e);
                    }

                    //AQI chart
                    try {
                        var coShift = $scope.charts.aqiChart.series[0].data.length > shiftValue;
                        $scope.charts.aqiChart.series[0].addPoint([currentTime, parseFloat(currJson['carbonMonoOxide'])], true, coShift);
                        console.log("Current carbonMonoOxide "+parseFloat(currJson['carbonMonoOxide']));

                    } catch (e){
                        console.log("Error found", e);
                    }

                    try{
                        var co2Shift = $scope.charts.aqiChart.series[1].data.length > shiftValue;
                        $scope.charts.aqiChart.series[1].addPoint([currentTime, parseFloat(currJson['carbonDiOxide'])], true, co2Shift);
                        console.log("Current carbonDiOxide "+parseFloat(currJson['carbonDiOxide']));
                    } catch (e){
                        console.log("Error found", e);
                    }
                    //Humidity chart
                    try {
                        var humidityShift = $scope.charts.humidityChart.series[0].data.length > shiftValue;
                        $scope.charts.humidityChart.series[0].addPoint([currentTime, parseFloat(currJson['precipitationAmount'])], true, humidityShift);
                        console.log("Current precipitationAmount "+parseFloat(currJson['precipitationAmount']));
                    } catch (e){
                        console.log("Error found", e);
                    }

                    //Wind speed gauge chart
                    try {
                        var point = $scope.charts.windDirectionChart.series[0].points[0];
                        point.update(parseFloat(currJson['windSpeed']));
                        console.log("Current windSpeed "+parseFloat(currJson['windSpeed']));
                    } catch (e){
                        console.log("Error found", e);
                    }
                }


            }, 1000);
        }

    }
});
