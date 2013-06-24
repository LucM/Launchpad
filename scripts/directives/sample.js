'use strict';

angular.module('YouLaunchpadApp')
  .directive('sample', ['$timeout', function ($timeout) {
    return {
      template: '<li>'+
      				'<header>{{mySample.title}}</header>'+
					'<div class="video"><div id="wrapper{{mySample.id}}"></div>'	+
					'</div>'+
					'<footer>'+
						'<div class="controlChar"> {{mySample.controlChar}} </div> ' +
						'<input type="checkbox" ng-model="mySample.repeat" /> Repeat'+
					'</footer>'+
				'</li>',
      restrict: 'E',
      replace: true,
	  scope: {
			'mySample': '='
	  },
      link: function postLink(scope, element, attrs) {
    	 // Load player - $timeout used to wait the construction of the DOM
    	 $timeout(function() { scope.mySample.loadPlayer(); }, 0);
      }
    };
  }]);
