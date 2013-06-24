'use strict';

/**
 * Launchpad Player
 *		- On the main view, we can control the sample using the keyboard
 *		- Launchpad Player service is used to manage keyboard events and play/repease/pause sample
 */
angular.module('YouLaunchpadApp')
  .factory('LaunchpadPlayer', ['Samples', function (Samples, $timeout) {
	  
	// KeyCodeManager, hashtable (key=keyBoardCode) of the samples 
	var KeyCodeManager = Samples.getKeyCodeManager();

    // Public API here
    return {
    	// Parameters
    	repeat: false,
    	pause: false,
    	
    	keyDown: function(e) {
			var keyCode = e.keyCode;
			
    		// Enter : 13 - repeat
    		if(keyCode == 13) {
    			this.repeat = true; 
    		}
    		
    		// Maj : 16 - stop
    		if(keyCode == 16) {
    			this.pause = true;
    		}
    		
    		// If no sample associated, do nothing
			if(!KeyCodeManager[e.keyCode]) {
				return null;
			} 
			
			// Sample associated to the keyCode
			var Sample = KeyCodeManager[keyCode];
			
			if(!this.pause)
				Sample.play();
			else
				Sample.pause();
			
			if(this.repeat) 
				Sample.setRepeat(true);
    	},
    	
    	keyUp: function(e) {
			var keyCode = e.keyCode;

    		// Enter : 13 - repeat
    		if(keyCode == 13) {
    			this.repeat = false;
    		}
    		
    		// Maj : 16 - stop
    		if(keyCode == 16) {
    			this.pause = false;
    		}
    		
    	}
    };
  }]);
