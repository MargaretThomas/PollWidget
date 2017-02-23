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
	})
	.state("error", {
		url: "/errorState/", /* Error handling */
		templateUrl: "templates/errorState.html",
		controller: "loadWidget"
	});
});
app.factory('myFactory', ['$http',
	function($http) {
		// Getting this specific poll.
		var getSpecificPoll = function(callback, pollID) {
			$http({
			method: 'GET',
			url: 'http://pollapi.azurewebsites.net/98b6b223-6849-4c3b-8c50-1f42f26946ed/api/polls/'+pollID,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			},
			}).then(function successCallback(response) {
				callback(response);
			}, function errorCallback(response) {
				callback(response);
			});
		};
		// Getting the total votes for each answer
		var getVoteCounts = function(callback, pollID) {
			$http({
			method: 'GET',
			url: 'http://pollapi.azurewebsites.net/98b6b223-6849-4c3b-8c50-1f42f26946ed/api/AnsResult/Answers/'+pollID,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			},
			}).then(function successCallback(response) {
				callback(response);
			}, function errorCallback(response) {
				callback(response);
			});
		};
		// Votes for this poll.
		var castVote = function(callback, objVote){ 
			$http({
				method: 'POST',
				url: 'http://pollapi.azurewebsites.net/98b6b223-6849-4c3b-8c50-1f42f26946ed/api/AnsResult',
				headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Access-Control-Allow-Origin': '*'
				},
				data: JSON.stringify(objVote)
			}).then(function successCallback(response) {
				callback(response);
			}, function errorCallback(response) {
				callback(response);
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
	// Display start state.
	$state.loadStart = function(){
		$state.go("start");
	}
	// Determine the state of the widget to display.
	$scope.determineState = function(){
		var time = 10000;
		setTimeout(function(){
			alert("Hello"); 
			var poll = localStorage.getItem("poll");
		if(poll){
			console.log("valid local poll");
            var pollDetails = JSON.parse(poll);
			if(pollDetails.poll_guid == $stateParams.pollID){
				console.log("equal guid");
				var pollStatus = pollDetails.status;
				if(pollStatus == "2"){
					console.log("state 2");
					$state.go("second", {pollID: pollDetails.poll_guid});
				} else if(pollStatus == "3"){	
				console.log("state 3");
					$state.go("third", {pollID: pollDetails.poll_guid});
				}else{
					console.log("state 1");
					$state.go("first", $stateParams.pollID);
				}
			}else{
				console.log(" not equal guid");
				$state.go("first", $stateParams.pollID);
				console.log($stateParams.pollID);
			}
		}else{
			console.log("no poll");
				console.log($stateParams.pollID);
			$state.go("first", $stateParams.pollID);
		}
		}, time);
		console.log($stateParams.pollID);		
	}
	// Request data and display in the poll format.
	$scope.loadOpenPoll = function(){
		// Calling from the API.
		var pollID = $stateParams.pollID;
		
		$scope.poll = [];
		$scope.answersID = [];
		$scope.answers = [];
		$scope.answersCount = [];
		$scope.totalVotes = 0;
		// Get the Poll Details.
		myFactory.funcSpecificPoll(function(response){
			if(response.status >= 200 && response.status < 300){
				var data = response.data;
				// Clear any old localStorage.
				window.localStorage.clear();
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
			}else{
				window.localStorage.clear();
				var message = "Unable to retrieve the poll details. Please ensure that the poll exists.";
				localStorage.setItem("errorMessage", message);
				$state.go("error");
			}
		}, pollID);
		
		// Get the Vote Counts for each answer of this poll.
		myFactory.funcVoteCounts(function(response){
			if(response.status >= 200 && response.status < 300){
				var data = response.data;
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
			}else{
				window.localStorage.clear();
				var message = "Unable to retrieve the answer counts. Please ensure that the poll exists.";
				localStorage.setItem("errorMessage", message);
				$state.go("error");
			}
		}, pollID);
	}
	// Load time.
	$scope.loadTime = function(){
		$scope.poll = JSON.parse(localStorage.getItem("poll"));
	}
	// Load the data from local storage.
	$scope.loadState = function(){
		$scope.poll = JSON.parse(localStorage.getItem("poll"));
		if($scope.poll){
			var pollID = $scope.poll.poll_guid;
			$scope.chosenAnswer = localStorage.getItem("chosenAnswer");
			$scope.answersID = JSON.parse(localStorage.getItem("answersID"));
			$scope.answers = JSON.parse(localStorage.getItem("answers"));
			
			myFactory.funcVoteCounts(function(response){
				if(response.status >= 200 && response.status < 300){
					var data = response.data;
					// Totals for each answer.
					$scope.answersCount = [];
					$scope.answersCount.push(data.ans_vote_1);
					$scope.answersCount.push(data.ans_vote_2);
					$scope.answersCount.push(data.ans_vote_3);
					$scope.answersCount.push(data.ans_vote_4);
					// Percentages for each answer.
					$scope.answersPerc = [];
					$scope.answersPerc.push(data.percent1);
					$scope.answersPerc.push(data.percent2);
					$scope.answersPerc.push(data.percent3);
					$scope.answersPerc.push(data.percent4);
					$scope.totalVotes = 0;
					for(var index=0;index<$scope.answersCount.length;index++){
						$scope.totalVotes = $scope.totalVotes + $scope.answersCount[index];
						
					}
					// Store the vote count for each answer.
					localStorage.setItem("answersCount", JSON.stringify($scope.answersCount));
					localStorage.setItem("totalVotes", $scope.totalVotes);
				}else{
					window.localStorage.clear();
					var message = "Unable to get the latest vote counts. Please ensure that the poll exists.";
					localStorage.setItem("errorMessage", message);
					$state.go("error");
				}
			}, pollID);
		}else{
			$state.go("error");
		}
	}
	$scope.loadErrorMessage = function(){
		$scope.errorMessage = localStorage.getItem("errorMessage");
	}
});