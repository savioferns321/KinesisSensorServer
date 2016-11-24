var app = angular.module('myApp',['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('SignUp', {
            url: '/SignUp',
            templateUrl: 'ejs/SignUp.ejs'
        })
    	.state('Login',{
    		url:'/',
    		templateUrl:'ejs/login.ejs'
    	});
});