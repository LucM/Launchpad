'use strict';

/**
 * Search Controller
 * 		- Search a video using the Youtube Data API
 * 		- Cut a video, and create a new sample
 * 
 */
angular.module('YouLaunchpadApp')
.controller('SearchCtrl', ['$scope', '$window', 'Samples', '$location', '$timeout', 
                           function ($scope, $window, Samples, $location, $timeout) {
	/**
	 * Initialization scope
	 */
	$scope.search = '';
	$scope.results = [];
	$scope.videoSelectedBoolean = false;
	
	// Unbind keyevents
	$('body').unbind('keydown').unbind('keyup');
	
	/**
	 * actions
	 */
	
	/**
	 * Search youtube video, once the form submit, a request to the youtube API is made
	 */
	$scope.searchYoutubeVideo = function() {
		var request = gapi.client.youtube.search.list({
			part: 'snippet',
			q: $scope.search,
			maxResults: 30
		});

		request.execute(function(response) {
			$scope.$apply(function() {
				// Empty old results
				$scope.results.splice(0, $scope.results.length);
				// Add new results
				var items = response.items;
				for(var i in items) {
					$scope.results.push(response.items[i]);
				}  
			});			  
		});  
	};
	
	/**
	 * Set a new video in the player
	 */
	$scope.setVideo = function(videoId) {
		$scope.videoId = videoId;
		$scope.videoSelectedBoolean = true;
		$scope.ytplayer = document.getElementById('videoSelectedWrapper');
		$scope.ytplayer.cueVideoById(videoId);
		$scope.ytplayer.setVolume(100);
		$scope.checkEnd();
	}
	
	/**
	 * When the sample is playing, check if it is the end of the sample according to scope.end,
	 *  if repeat = true, repeat the video
	 */
	$scope.checkEnd = function() {
		if($scope.end != '' && $scope.end < $scope.ytplayer.getCurrentTime()) {
			if($scope.start != '') 
				$scope.ytplayer.seekTo($scope.start);

			if(!$scope.repeat)
				$scope.ytplayer.pauseVideo();
		}

		$timeout($scope.checkEnd, 100);
	};

	/**
	 * Create a new sample and redirection to the main view
	 */
	$scope.submitSample = function() {

		var obj = {
				youtubeId:  $scope.videoId,
				keyCode: $scope.keyCode,
				controlChar: $scope.controlChar,
				title: $scope.title,
				start: $scope.start,
				end: $scope.end,
		};
		Samples.add(obj);	

		$location.path( '/' );
	}


	/**
	 * TODO: create a ng-keyup directive
	 */
	$('#char').on('keyup',  function(e) {
		if(!Samples.isKeyCodeExist(e.keyCode))
			$scope.keyCode = e.keyCode;
		else  {
			alert($(this).val() + ' is already used');
			$(this).val('');
		}
	});



	/**
	 * Initialization YouTube Player
	 */
	// Lets Flash from another domain call JavaScript
	var params = { allowScriptAccess: 'always'};
	// The element id of the Flash embed
	var atts = { id: 'videoSelectedWrapper' };
	// All of the magic handled by SWFObject (http://code.google.com/p/swfobject/)
	swfobject.embedSWF("http://www.youtube.com/apiplayer?" +
			"version=3&enablejsapi=1&playerapiid=videoSelectedWrapper", 
			"videoSelectedWrapper" , "300", "300", "9", null, null, params, atts);

}]);
