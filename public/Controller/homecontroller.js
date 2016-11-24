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
});
