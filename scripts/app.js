'use strict';

/**
 * Router
 */
angular.module('YouLaunchpadApp', [])
.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'views/main.html',
		controller: 'MainCtrl'
	})
	.when('/search', {
		templateUrl: 'views/search.html',
		controller: 'SearchCtrl'
	})
	.otherwise({
		redirectTo: '/'
	});
}]);
