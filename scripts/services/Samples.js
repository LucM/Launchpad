'use strict';

/**
 * Samples: collection of Sample
 * 
 */
angular.module('YouLaunchpadApp')
.factory('Samples', ['$window', '$timeout', '$rootScope', function ($window, $timeout, $rootScope) {
	  
	// To create ID
	var inc = 0;
	
	// Faster access to the sample using a key code
	var KeyCodeManager = {};
	
	// Sample List
	var sampleList = [];
	
	// get Sample
	var smGetSample = function(id) {
		for(var i in sampleList) {
			if(sampleList[i].id == id)
				return sampleList[i];
		}
		return null;
	};

	/**
	 * Constructor of Sample
	 */
	function Sample(obj) {
		this.youtubeId = obj.youtubeId;
		this.keyCode = obj.keyCode;
		this.start = obj.start;
		this.end = obj.end;
		this.duration = this.end - this.start;
		this.repeat = false;
		this.isPlaying = false;
		this.controlChar = obj.controlChar;
		
		// Add the sample to the keycode manager
		KeyCodeManager[this.keyCode] = this;
		this.id = "Sample" + inc;
		this.title = obj.title;
		inc++;
	}
	
	/**
	 * Load Youtube Player
	 */
	Sample.prototype.loadPlayer = function() {
		// Lets Flash from another domain call JavaScript
	    var params = { allowScriptAccess: "always" };
	    // The element id of the Flash embed
	    var atts = { id: this.id };
	    // All of the magic handled by SWFObject (http://code.google.com/p/swfobject/)
	    swfobject.embedSWF("http://www.youtube.com/apiplayer?" +
	                       "version=3&enablejsapi=1&playerapiid=" + this.id + "&start=" + this.start +"&end=" + this.end, 
	                       "wrapper" + this.id  , "200", "150", "9", null, null, params, atts);
	}
	
	 // Once the player is load, onYoutubePlayerReady is automatically called. let's load the video at this time!
	 $window.onYouTubePlayerReady = function (id) {
		  smGetSample(id).loadVideo();
	 }
	
	/**
	 *  Load the video and play it with no sound 
	 */
	Sample.prototype.loadVideo = function() {
		this.ytplayer = document.getElementById(this.id);
		this.ytplayer.loadVideoById({videoId: this.youtubeId, startSeconds: this.start, endSeconds: this.end, suggestedQuality:"small"});
		this.ytplayer.setVolume(0);
		this.ytplayer.addEventListener("onStateChange", "onPlayerStateChange");

	}
	
	/**
	 * Player return a state, we don't know which one, we have to find it and then
	 *  check if we have to repeat the sample
	 */
	$window.onPlayerStateChange = function(e) {
		if(e===0) {
			for(var i in sampleList) {
				var sample = sampleList[i];
				if(sample.isPlaying) {
					sample.setIsPlaying(false);
					if(sample.repeat)
						sample.play();
				}	
			}
		}
	};
	
	/**
	 * Play the video
	 */
	Sample.prototype.play = function() {
		this.ytplayer.setVolume(100);
		this.ytplayer.seekTo(this.start, true);
		this.ytplayer.playVideo();
		this.isPlaying = true;
	}
	
	/**
	 * Pause the video
	 */
	Sample.prototype.pause = function() {
		this.isPlaying = false;
		this.ytplayer.pauseVideo();
	}
	
	/**
	 * Set repeat
	 */
	Sample.prototype.setRepeat = function(b) {
		var that = this;
		$rootScope.$apply(function() {
			that.repeat = b;
		});
	}	
	
	/**
	 * setIsPlaying
	 */
	Sample.prototype.setIsPlaying = function(b) {
		var that = this;
		$rootScope.$apply(function() {
			that.isPlaying = b;
		});
	}	
	
	// Public API here
	return {
		// Create a new Sample
		add: function(obj) {
			sampleList.push(new Sample(obj));
		},
		
		// Get a sample, parameter: keyCode
		getSample: smGetSample,
		
		// Return the list of sample
		getList: function() {
			return sampleList;
		},
		
		// Return the hashtable of sample
		getKeyCodeManager: function() {
			return KeyCodeManager;
		},
		
		// Verify if a couple keyCode/sample exists.
		isKeyCodeExist: function(keyCode) {
			return !(KeyCodeManager[keyCode] == null);
		}
	};
}]);
