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
        socket.on('aggregationData', function(data) {

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
                    text: 'Live Pollutants data'
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
                    },
                    {
                        name: 'Nitrous Oxide',
                        data: []
                    },
                    {
                        name: 'Ozone',
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

        function loadData(){
            setInterval(function () {

                var currentTime = new Date().getTime();
                var shiftValue = 20;
                if($scope.dataArr.length > 0){
                    var currJson = $scope.dataArr.shift();
                    //currentTime = new Date(currJson.time).getTime();
                    currentTime = new Date().getTime();
                    //Temperature chart


                    try {
                        var tempShift = $scope.charts.tempChart.series[0].data.length > shiftValue;

                        $scope.charts.tempChart.series[0].addPoint([currentTime, parseFloat(currJson.temperature)], true, tempShift);
                        console.log("Current temperature "+parseFloat(currJson.temperature));

                    } catch (e){
                        console.log("Error found"+ parseFloat(currJson.temperature)+"\n current time "+ currentTime, e);
                    }

                    //AQI chart
                    try {
                        var coShift = $scope.charts.aqiChart.series[0].data.length > shiftValue;
                        $scope.charts.aqiChart.series[0].addPoint([currentTime, parseFloat(currJson.CO)], true, coShift);
                        console.log("Current carbonMonoOxide "+parseFloat(currJson.CO));

                    } catch (e){
                        console.log("Error found", e);
                    }

                    try{
                        var co2Shift = $scope.charts.aqiChart.series[1].data.length > shiftValue;
                        $scope.charts.aqiChart.series[1].addPoint([currentTime, parseFloat(currJson.CO2)], true, co2Shift);
                        console.log("Current carbonDiOxide "+parseFloat(currJson.CO2));
                    } catch (e){
                        console.log("Error found", e);
                    }

                    try{
                        var noShift = $scope.charts.aqiChart.series[2].data.length > shiftValue;
                        $scope.charts.aqiChart.series[2].addPoint([currentTime, parseFloat(currJson.NO)], true, noShift);
                        console.log("Current Nitrous Oxide "+parseFloat(currJson.NO));
                    } catch (e){
                        console.log("Error found", e);
                    }

                    try{
                        var o3Shift = $scope.charts.aqiChart.series[3].data.length > shiftValue;
                        $scope.charts.aqiChart.series[3].addPoint([currentTime, parseFloat(currJson.O3)], true, o3Shift);
                        console.log("Current Ozone "+parseFloat(currJson.O3));
                    } catch (e){
                        console.log("Error found", e);
                    }
                    //Humidity chart
                    try {
                        var humidityShift = $scope.charts.humidityChart.series[0].data.length > shiftValue;
                        $scope.charts.humidityChart.series[0].addPoint([currentTime, parseFloat(currJson.precipitation)], true, humidityShift);
                        console.log("Current precipitationAmount "+parseFloat(currJson.precipitation));
                    } catch (e){
                        console.log("Error found", e);
                    }

                    //Wind speed gauge chart
                    try {
                        var point = $scope.charts.windDirectionChart.series[0].points[0];
                        point.update(parseFloat(currJson.windSpeed));
                        console.log("Current windSpeed "+parseFloat(currJson.windSpeed));
                    } catch (e){
                        console.log("Error found", e);
                    }
                }


            }, 1000);
        }

    };

    $scope.getAnomalyData = function () {

        var map = null;
        var icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png (1KB)";

        //markers array
        $scope.markers = {};
        $scope.markerHtml = {};

        socket.on('anomalyData', function(data) {

            if(isJson(data)){
                var jsonObj = JSON.parse(data);
                console.log("Data received on channel 'anomalyData'"+data);

                //TODO Filter out the client's location instead of 'San Francisco'
                if(jsonObj.data['city'] == 'San Fransisco'){

                    var sensorId = jsonObj['sensorId'];
                    if(!$scope.markers.hasOwnProperty(sensorId.toString())){
                        //Create a new marker
                        $scope.markers[sensorId.toString()] = {
                            'latitude': jsonObj['data']['latitude'],
                            'longitude': jsonObj['data']['longitude'],
                            'markerObject': new google.maps.Marker(
                                {
                                    map: $scope.map,
                                    position: new google.maps.LatLng(jsonObj['data']['latitude'], jsonObj['data']['longitude'])

                                }
                            ),
                            'infoWindow': new google.maps.InfoWindow({
                                content: "",
                                maxWidth: 320
                            }),
                            'data': [],
                            'htmlContent': ""
                        };

                        //Display this marker with its content on the map
                        $scope.markers[sensorId.toString()].infoWindow.open($scope.map,
                            $scope.markers[sensorId.toString()].markerObject);

                    }

                    $scope.markers[sensorId.toString()].data.push(jsonObj);
                }

            } else {
                console.log("String : "+ data);
            }

        });

        initMap();

        function initMap() {
            $scope.map = new google.maps.Map(document.getElementById('map'), {
                zoom: 14,
                center: new google.maps.LatLng(0.0, 0.0)
            });
        }

        var counter = 100;

        function loadData(){
            setInterval(function () {
                //Iterate over the markers
                for (var sensorId in $scope.markers) {
                    if ($scope.markers.hasOwnProperty(sensorId) && $scope.markers[sensorId]['data'].length > 0) {
                        var marker = $scope.markers[sensorId];
                        //marker.infoWindow.setContent("<b>"+(counter++)+"</b>");
                        //TODO update the marker's content with the data
                        if(marker.data.length > 0){
                            marker.infoWindow.setContent(generateHtmlContent(marker.data.shift()));
                        }
                    }
                }

            }, 1000);
        }

        loadData();

        function generateHtmlContent(dataJson) {
            var anomalyName = "";
            var temperature, co2, co, no, o3, precipitation, windDirection, windSpeed, divHeader;
            temperature = dataJson.data.temperature;
            co2 = dataJson.data.CO2;
            co = dataJson.data.CO;
            no = dataJson.data.NO;
            o3 = dataJson.data.O3;
            precipitation = dataJson.data.precipitation;
            windDirection = dataJson.data.windDirection;
            windSpeed = dataJson.data.windSpeed;
            divHeader = "<div>";
            if(dataJson.detectedAnomaly != null){
                divHeader = "<div style=\"color: red;\">";
                anomalyName = "<b>"+dataJson.detectedAnomaly.toString().toUpperCase()+" ALERT!!</b>"
                    +appendImageUrl(dataJson.detectedAnomaly);
                if(anomalyName == "fire"){
                    temperature = generateRedTextHtml(dataJson.data.temperature);
                    co2 = generateRedTextHtml(dataJson.data.CO2);
                    co = generateRedTextHtml(dataJson.data.CO);
                    no = generateRedTextHtml(dataJson.data.NO);
                    o3 = generateRedTextHtml(dataJson.data.O3);
                } else if(anomalyName == "cyclone"){
                    precipitation = generateRedTextHtml(dataJson.data.precipitation);
                    windSpeed = generateRedTextHtml(dataJson.data.windSpeed);
                    windDirection = generateRedTextHtml(dataJson.data.windDirection);
                }
            }
            var htmlArr = [
                divHeader,
                "<i>Sensor Name: "+dataJson.sensorName+"</i>",
                "<i>Sensor ID: "+dataJson.sensorId+"</i>",
                anomalyName,
                "Date & time: "+dataJson.timestamp,
                "Temperature:"+temperature+" °C",
                "Carbon Dioxide level:"+co2+" ppm",
                "Carbon Monoxide level:"+co+" ppm",
                "Nitric Oxide level:"+no+" ppm",
                "Ozone level:"+o3+" ppm",
                "Precipitation:"+precipitation+" mm",
                "Wind direction:"+windDirection+" Degrees",
                "Wind speed:"+windSpeed+" km/hr",
                "</div>"
            ];


            return htmlArr.join("<br>");
        }

        function generateRedTextHtml(text) {
            return "<p style=\"color:red\" >"+text+"</p>";
        }

        function appendImageUrl(anomalyType) {
            if(anomalyType == "cyclone"){
                return "<img src=\"http://emojipedia-us.s3.amazonaws.com/cache/d3/a8/d3a818e14ae276f8d987209997fadf0f.png\" width=\"25\" height=\"25\" >";
            } else if(anomalyType == "fire")
                return "<img src=\"http://emojipedia-us.s3.amazonaws.com/cache/31/21/3121d7c3bebb2fa09d66a3f72b41026a.png\" width=\"25\" height=\"25\" >";
        }


    };

    function isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

});
