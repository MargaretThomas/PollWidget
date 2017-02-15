// Creates a button for each answers of the poll.
app.directive("answers", function($state, $stateParams, myFactory) {
    return {
		restrict: "E",
		scope:{
			data: "="
		},
        templateUrl: "templates/button.html",
		link: function(scope, elem, attrs){
			elem.bind('click', function(){
				// Save poll information once the user has voted.
				var poll = JSON.parse(localStorage.getItem("poll"));
				poll.status = "2";
				
				localStorage.setItem("poll", JSON.stringify(poll));
				var ansID = 0;
				var answers = JSON.parse(localStorage.getItem("answers"));
				for(var index = 0; index < answers.length; index++){
					if(answers[index] == scope.data){
						ansID = index + 1;
					}
				}
				console.log(ansID);
				// Post vote.
				var currentDateVoted = new Date();
				var obj = {"pollGuid": poll.poll_guid,"ansId": ansID,"os_type": "Widget","location": "Durban","manufacturer": navigator.product,"device_model": navigator.appCodeName,"os_version": navigator.platform, "user_name": "000Widget", "user_id": "Anonymous", "date_voted": currentDateVoted};
				myFactory.funcCastVote(obj);
				$state.go("second", {pollID: poll.poll_guid});
			});
		}
    };
});
// Creates a directive for the time remaining.
app.directive('timeLeft', ['$interval', 'dateFilter', '$state', function($interval, dateFilter, $state) {
  return {
	restrict: "E",
	scope:{
		endDate: "=" // End Date of the poll.
	},
	link: function (scope, elem, attrs) {
		var format = "dd/MM/yyyy h:mm:ss a";
		var timeoutId;
		var poll = JSON.parse(localStorage.getItem("poll"));
		if(poll){
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
				console.log("here");
					$state.go("third", {pollID: poll.poll_guid});
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
	}
  };
}]);