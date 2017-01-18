var app = angular.module("widgetApp", ["ui.router"])
app.config(function($stateProvider) {
    $stateProvider
    .state("first", {
		url: "/firstState",/* Open Poll before voting. */
        templateUrl : "templates/firstState.html"
    })
	.state("second", {
		url: "/secondState",/* Open Poll after voting. */
		templateUrl: "templates/secondState.html"
	})
	.state("third", {
		url: "/thirdState",/* Closed Poll. */
		templateUrl: "templates/thirdState.html"
	});
});
app.controller('loadWidget', function($scope, $state){
	// Determine the state of the widget to display.
	$scope.determineState = function(){
		var pollDetails = JSON.parse(localStorage.getItem("poll"));
		var pollStatus = pollDetails.pollStatus;
		console.log(pollStatus);
		if(pollStatus == "Open And Voted"){
			$state.go("second");
		} else if(pollStatus == "Closed"){
			$state.go("third");
		}else{
			$state.go("first");
		}
	}
	// Request data and display in the poll format.
	$scope.loadOpenPoll = function(){
		// Dummy content for now. Here is where the the API request will be made.
		var data = {pollStatus:"Open", pollID:"1", title:"Favourite Vegetable", question:"What is your favourite veggie?", answerCount:3, totalVotes:20, timeLeft:"24:00", thanksMessage:"Thanks for participating in the Favourite Vegetable Poll!!", closedMessage:"The poll is now closed", websiteForSharing:"www.google.com"};
		var answers = [["Carrots",10], ["Kale",6], ["Cabbage", 4]];
		
		// Load stuff from dummy API.
		$scope.poll = data;
		$scope.ans = [];
		$scope.ansVote = [];
		var index = 0;
		for(var item in answers){
			var singleAnswer = answers[item];
			$scope.ans.push(singleAnswer[0]);
			$scope.ansVote.push(singleAnswer[1]);
		}
		// Write dummy data to local storage.
		localStorage.setItem("poll", JSON.stringify($scope.poll));
		localStorage.setItem("answers", JSON.stringify(answers));
	}
	// Load the data from local storage.
	$scope.loadState = function(){
		$scope.poll = JSON.parse(localStorage.getItem("poll"));
		$scope.chosenAnswer = localStorage.getItem("chosenAnswer");
		$scope.answers = JSON.parse(localStorage.getItem("answers"));
	}
	$scope.formatNumber = function(votes) {
		return Math.round(votes); 
	}
});
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