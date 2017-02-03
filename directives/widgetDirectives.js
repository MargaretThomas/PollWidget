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
				poll.status = "2";
				var answers = JSON.parse(localStorage.getItem("answers"));
				var answersCount = JSON.parse(localStorage.getItem("answersCount"));
				var totalVotes = 0;
				for(var item in answers){
					var singleAnswer = answers[item];
					if(singleAnswer == scope.data){
						answersCount[item]++;
					}
				}
				for(var index=0;index<answersCount.length;index++){
					totalVotes = totalVotes + answersCount[index];
				}
				localStorage.setItem("totalVotes", totalVotes);
				localStorage.setItem("poll", JSON.stringify(poll));
				localStorage.setItem("answers", JSON.stringify(answers));
				localStorage.setItem("answersCount", JSON.stringify(answersCount));
				localStorage.setItem("chosenAnswer", scope.data);
				localStorage.setItem("totalVotes", totalVotes);
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
		var endDate = new Date(poll.end_date);
		var endDateStr = endDate.toString();
		var actualEndDate;
		var extraHours;
		var hoursInMinutes;
		// Extract the time difference.
		if(endDateStr.indexOf("+") != -1){
			var dateParts = endDateStr.split("+");
			actualEndDate = dateParts[0];
			extraHours = parseInt(dateParts[1].substring(0,2));
		} else{
			var dateParts = endDateStr.split("-");
			actualEndDate = dateParts[0];
			extraHours = parseInt(dateParts[1].substring(0,2));
		}
		function updateTime() {
			var currentDate = new Date();
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