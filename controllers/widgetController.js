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
		var poll = localStorage.getItem("poll");
		if(poll === undefined){
			$state.go("first");
		}else{
			var pollDetails = JSON.parse(poll);
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
	}
	// Request data and display in the poll format.
	$scope.loadOpenPoll = function(){
		// Dummy content for now. Here is where the the API request will be made.
		var data = {pollStatus:"Open", pollID:"1", title:"Favourite Vegetable", question:"What is your favourite veggie?", answerCount:3, totalVotes:20, endDate:"2017-01-19T16:30:00Z", thanksMessage:"Thanks for participating in the Favourite Vegetable Poll!!", closedMessage:"The poll is now closed", websiteForSharing:"www.google.com"};
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