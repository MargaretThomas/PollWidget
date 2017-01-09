angular.module("widgetApp", ["ngRoute"])
.config(function($routeProvider) {
    $routeProvider
    .when("/firstState", {
        templateUrl : "partials/firstState.html"
    })
	.when("/secondState", {
		templateUrl: "partials/secondState.html"
	})
	.when("/thirdState", {
		templateUrl: "partials/thirdState.html"
	})
	.otherwise("/firstState", {
        templateUrl : "partials/firstState.html"
    });
});