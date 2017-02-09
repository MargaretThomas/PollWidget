var app = angular.module("widgetApp", ["ui.router"])
app.config(function($stateProvider) {
    $stateProvider
    .state("first", {
		url: "/firstState/:pollID",/* Open Poll before voting. */
        templateUrl : "templates/firstState.html", 
		controller: "loadWidget"
    })
	.state("second", {
		url: "/secondState/:pollID",/* Open Poll after voting. */
		templateUrl: "templates/secondState.html",
		controller: "loadWidget"
	})
	.state("third", {
		url: "/thirdState/:pollID",/* Closed Poll. */
		templateUrl: "templates/thirdState.html",
		controller: "loadWidget"
	});
});
app.factory('myFactory', ['$http',
	function($http) {
		// Getting this specific poll.
		var getSpecificPoll = function(callback, pollID) {
			$http({
			method: 'GET',
			url: 'http://pollapi.azurewebsites.net/123/api/polls/'+pollID,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			},
			}).then(function successCallback(response) {
				callback(response.data);
			}, function errorCallback(response) {
				alert("failed");
			});
		};
		// Getting the total votes for each answer
		var getVoteCounts = function(callback, pollID) {
			$http({
			method: 'GET',
			url: 'http://pollapi.azurewebsites.net/123/api/AnsResult/Answers/'+pollID,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			},
			}).then(function successCallback(response) {
				callback(response.data);
			}, function errorCallback(response) {
				alert("failed");
			});
		};
		// Votes for this poll.
		var castVote = function(objVote){
			var req = {
				method: 'POST',
				url: 'http://pollapi.azurewebsites.net/123/api/AnsResult',
				headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Access-Control-Allow-Origin': '*'
				},
				data: JSON.stringify(objVote)
			}
			$http(req).then(function(){
				alert("Voted");
			}, function()
			{
				alert("not Voted");
			});
		}
		return {
			funcSpecificPoll: getSpecificPoll,
			funcVoteCounts: getVoteCounts,
			funcCastVote: castVote
		}
	}
]);
app.controller('loadWidget', function($scope, $state, $stateParams, myFactory){
	// Determine the state of the widget to display.
	$scope.determineState = function(){
		var poll = localStorage.getItem("poll");
		if(poll){
            var pollDetails = JSON.parse(poll);
			var pollStatus = pollDetails.status;
			if(pollStatus == "2"){
				$state.go("second", {pollID: pollDetails.poll_guid});
			} else if(pollStatus == "3"){				
				console.log("here");
				$state.go("third", {pollID: pollDetails.poll_guid});
			}else{
				$state.go("first", "a1b30698-c224-4bbe-af2d-3e2fc8b89b1a");
			}
		}else{
			$state.go("first", "a1b30698-c224-4bbe-af2d-3e2fc8b89b1a");
		}
	}
	// Request data and display in the poll format.
	$scope.loadOpenPoll = function(){
		// Calling from the API.
		var pollID = $stateParams.pollID;
		console.log(pollID);
		$scope.poll = [];
		$scope.answersID = [];
		$scope.answers = [];
		$scope.answersCount = [];
		$scope.totalVotes = 0;
		// Get the Poll Details.
		myFactory.funcSpecificPoll(function(data){
			// Clear any old localStorage.
			localStorage.clear();
			// Get the poll details.
			$scope.poll = data;
			// Store the details in local storage.
			localStorage.setItem("poll", JSON.stringify(data));
			
			// Grab the first 2 answers. They will always be there.
			// Answer 1:
			$scope.answers.push(data.answer.answer); 
			$scope.answersID.push(data.answer.answer_id); 
			// Answer 2:
			$scope.answers.push(data.answer2.answer); 
			$scope.answersID.push(data.answer2.answer_id); 
			// Answer 3:
			// Check if there's an answer 3. If there is, the store in the answers array.
			var ans3 = data.answer3.answer_id;
			if (ans3 != 0){
				$scope.answers.push(data.answer3.answer);
				$scope.answersID.push(data.answer3.answer_id);
			}
			// Answer 4:
			// Check if there's an answer 4. If there is, the store in the answers array.
			var ans4 = data.answer4.answer_id;
			if (ans4 != 0){
				$scope.answers.push(data.answer4.answer);
				$scope.answersID.push(data.answer4.answer_id);
			}
			// Store answers details in localStorage.
			localStorage.setItem("answersID", JSON.stringify($scope.answersID));
			localStorage.setItem("answers", JSON.stringify($scope.answers));
		}, pollID);
		
		// Get the Vote Counts for each answer of this poll.
		myFactory.funcVoteCounts(function(data){
			$scope.answersCount.push(data.ans_vote_1);
			$scope.answersCount.push(data.ans_vote_2);
			$scope.answersCount.push(data.ans_vote_3);
			$scope.answersCount.push(data.ans_vote_4);
			for(var index=0;index<$scope.answersCount.length;index++){
				$scope.totalVotes = $scope.totalVotes + $scope.answersCount[index];
			}
			// Store the vote count for each answer.
			localStorage.setItem("answersCount", JSON.stringify($scope.answersCount));
			localStorage.setItem("totalVotes", $scope.totalVotes);
		}, pollID);
	}
	$scope.loadTime = function(){
		$scope.poll = JSON.parse(localStorage.getItem("poll"));
	}
	// Load the data from local storage.
	$scope.loadState = function(){
		$scope.poll = JSON.parse(localStorage.getItem("poll"));
		$scope.chosenAnswer = localStorage.getItem("chosenAnswer");
		$scope.answersID = JSON.parse(localStorage.getItem("answersID"));
		$scope.answers = JSON.parse(localStorage.getItem("answers"));
		$scope.answersCount = JSON.parse(localStorage.getItem("answersCount"));
		$scope.totalVotes = localStorage.getItem("totalVotes");
	}
	$scope.formatNumber = function(votes) {
		return votes.toFixed(2);
	}
});