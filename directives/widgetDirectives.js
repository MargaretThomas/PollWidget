// Creates a button for each answers of the poll.
app.directive("answers", function($state) {
    return {
		restrict: "E",
		scope:{
			data: "=" // Current answer.
		},
        templateUrl: "templates/button.html",
		link: function(scope, elem, attrs){
			elem.bind('click', function(){
				// Save poll information once the user has voted.
				var poll = JSON.parse(localStorage.getItem("poll"));
				poll.totalVotes++;
				poll.pollStatus = "Open And Voted";
				var answers = JSON.parse(localStorage.getItem("answers"));
				for(var item in answers){
					var singleAnswer = answers[item];
					if(singleAnswer[0] == scope.data){
						singleAnswer[1]++;
					}
				}
				
				localStorage.setItem("poll", JSON.stringify(poll));
				localStorage.setItem("answers", JSON.stringify(answers));
				localStorage.setItem("chosenAnswer", scope.data);
				
				$state.go("second");
			});
		}
    };
});
// Creates a directive for the time remaining.
app.directive('timeLeft', ['$interval', 'dateFilter', '$state', function($interval, dateFilter, $state) {
  return {
	restrict: "E",
	link: function (scope, elem, attrs) {
		var format = "dd/MM/yyyy h:mm:ss a";
		var timeoutId;
		
		var poll = JSON.parse(localStorage.getItem("poll"));
		var endDate = new Date(poll.endDate);
		
		function updateTime() {
			var currentDate = new Date();
			var extraHours = Math.abs(currentDate.getTimezoneOffset()/60);
			currentDate.setHours(currentDate.getHours() + extraHours);
			// Calculate the difference in milliseconds
			var difference_ms = endDate.getTime() - currentDate.getTime();
			if(difference_ms <= 0){
				poll.pollStatus = "Closed";
				localStorage.setItem("poll", JSON.stringify(poll));
				$state.go("third");
			}else{
				//take out milliseconds
				difference_ms = difference_ms/1000;
				var seconds = Math.floor(difference_ms % 60);
				difference_ms = difference_ms/60; 
				var minutes = Math.floor(difference_ms % 60);
				difference_ms = difference_ms/60; 
				var hours = Math.floor(difference_ms % 24);  
				var days = Math.floor(difference_ms/24);
				elem.text(days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds');
			}
		}
	
		elem.on('$destroy', function() {
			$interval.cancel(timeoutId);
		});
	
		// start the UI update process; save the timeoutId for canceling
		timeoutId = $interval(function() {
			updateTime(); // update DOM
		}, 1000);
	}
  };
}]);