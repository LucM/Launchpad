'use strict';

/**
 * Main Controller
 */
angular.module('YouLaunchpadApp')
.controller('MainCtrl', ['$scope', 'Samples', 'LaunchpadPlayer', function ($scope, Samples, LaunchpadPlayer) {
	/**
	 * Initialization scope
	 */
	$scope.samples = Samples.getList();

	/**
	 * Events
	 */
	$('body').unbind('keydown').bind('keydown', LaunchpadPlayer.keyDown);
	$('body').unbind('keyup').bind('keyup', LaunchpadPlayer.keyUp);
}]);
