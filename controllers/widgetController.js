var app = angular.module("widgetApp", ["ui.router"])
app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/firstState');
    $stateProvider
    .state("first", {
		url: "/firstState",
        templateUrl : "templates/firstState.html"
    })
	.state("second", {
		url: "/secondState",
		templateUrl: "templates/secondState.html"
	})
	.state("third", {
		url: "/thirdState",
		templateUrl: "templates/thirdState.html"
	});
});

app.controller('loadWidget', function($scope){
	// Determine the state to display for the current user.
	$scope.determineState = function(){
		
	}
	// Request data and display in the poll format.
	$scope.loadOpenPoll = function(){
		// Dummy content for now. Here is where the the API request will be made.
		var data = new Array("Open", "1", "Favourite Vegetable", "What is your favourite veggie?", 3,new Array(new Array("Carrots", 10), new Array("Kale", 6), new Array("Cabbage", 4)), 20, "24:00", "Thanks for participating in the Favourite Vegetable Poll!!", "The poll is now closed", "www.google.com");
		
		// Load stuff from dummy API.
		$scope.pollStatus = data[0];
		$scope.pollID = data[1];
		$scope.pollTitle = data[2];
		$scope.pollQuestion = data[3];
		$scope.answerCount = data[4];
		$scope.totalVotes = data[6];
		$scope.timeLeft = data[7];
		$scope.thanksMessage = data[8];
		$scope.closedMessage = data[9];
		$scope.websiteForSharing = data[10];
		
		// Let's get each possible answer and the answer
		var arrayOfAnswers = data[5];
		var allAnswers = [];
		var allAnswersCounts = [];
		
		for(i=0;i<arrayOfAnswers.length;i++){
			var arr = arrayOfAnswers[i];
			allAnswers.push(arr[0]);
			allAnswersCounts.push(arr[1]);
		}
		/*
		// Load answers into the DOM.
		// Loop through for each answer.
		for(i=0;i<$scope.answerCount;i++){
			var btnAnswer = document.createElement("button");
			var text = document.createTextNode($scope.)
		}
		*/
	}
	// Save poll information once the user has voted.
	$scope.castVote = function(answer){
		$scope.totalVotes = $scope.totalVotes + 1;
		if(answer != null){
			$scope.chosenAnswer = answer;
		}else{
			$scope.chosenAnswer = "Nothing";
		}
		document.cookie = "status="+$scope.pollStatus; 
		document.cookie = "id="+$scope.pollID;
		document.cookie = "title="+$scope.pollTitle; 
		document.cookie = "question="+$scope.pollQuestion; 
		document.cookie = "chosenAnswer="+$scope.chosenAnswer;
		document.cookie = "count="+$scope.answerCount;
		document.cookie = "totalVotes="+$scope.totalVotes;
		document.cookie = "timeLeft="+$scope.timeLeft;
		document.cookie = "thanks="+$scope.thanksMessage;
		document.cookie = "closed="+$scope.closedMessage;
		document.cookie = "website="+$scope.websiteForSharing;
	}
	// Load the data from the cookies for the second state.
	$scope.loadSecondState = function(){
		$scope.readVote();
		// Display the chosen answer.
		//document.getElementById(answer).backgroundColor = pink;
	}
	// Load the data from the cookies for the third state.
	$scope.loadThirdState = function(){
		$scope.readVote();
		// Display the chosen answer.
		//document.getElementById(answer).backgroundColor = pink;
	}
	// Read stuff from the coooookie.
	$scope.readVote = function(){
		// Check if there is a status cookie.
		if(document.cookie.indexOf("status") != -1){
			$scope.pollStatus = $scope.getCookie("status");
			$scope.pollID = $scope.getCookie("id");
			$scope.pollTitle = $scope.getCookie("title");
			$scope.pollQuestion = $scope.getCookie("question");
			$scope.chosenAnswer = $scope.getCookie("chosenAnswer");
			$scope.answerCount = $scope.getCookie("count");
			$scope.totalVotes = $scope.getCookie("totalVotes");
			$scope.timeLeft = $scope.getCookie("timeLeft");
			$scope.thanksMessage = $scope.getCookie("thanks");
			$scope.closedMessage = $scope.getCookie("closed");
			$scope.websiteForSharing = $scope.getCookie("website");
		}
		// Set chosen answer.
		//console.log($scope.chosenAnswer);
		/*var btn = document.getElementById($scope.chosenAnswer);
		btn.style.backgroundColor = "#E6E6E6";*/
	}
	
	$scope.getCookie = function(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i <ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}
});