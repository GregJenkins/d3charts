angular.module('ScatterPlotModule', [])
.controller('scatterPlotCtrl', ['$scope', function($scope){
    $scope.data = [
       {'isactive7days_mean_lift' : 1.25,
        'acceptrate': 0.58,
        'target_count': 43080,
        'strategyid': '14'},
        {'isactive7days_mean_lift' : -0.98,
        'acceptrate': 0.23,
        'target_count': 33010,
        'strategyid': '19'},
        {'isactive7days_mean_lift' : 0.25,
        'acceptrate': 0.67,
        'target_count': 32410,
        'strategyid': '20'},
        {'isactive7days_mean_lift' : 1.98,
        'acceptrate': 0.42,
        'target_count': 41570,
        'strategyid': '45'},
        {'isactive7days_mean_lift' : 0.23,
        'acceptrate': 0.68,
        'target_count': 40580,
        'strategyid': '62'},
        {'isactive7days_mean_lift' : -1.47,
        'acceptrate': 0.92,
        'target_count': 35205,
        'strategyid': '72'},
        {'isactive7days_mean_lift' : -0.56,
        'acceptrate': -0.24,
        'target_count': 34129,
        'strategyid': '21'},
        {'isactive7days_mean_lift' : 1.73,
        'acceptrate': 0.88,
        'target_count': 29120,
        'strategyid': '87'}
    ];

    var options = {};
    options.margin = {
        top: 30, 
        right: 10, 
        bottom: 20, 
        left: 80
    };
    
    options.width = 960;
    options.height = 500; 
    options.colorScale = function(val){
        var colors = ['#9d3d38','#c5653a','#f9b743','#9bd6d7'];
        if (val > 0.8) {
            return colors[0];
        } else if (val > 0.7) {
            return colors[1];
        } else if (val > 0.5) {
            return colors[2];
        } else {
            return colors[3];
        }
    };
    
    options.format = function (d) {
        return Math.round(d * 100) / 100;
    };
    options.xAttribute = 'isactive7days_mean_lift'; 
    options.yAttribute = 'acceptrate';
    options.sizeAttribute = 'target_count';
    $scope.options =  options; 
    
}]); 
