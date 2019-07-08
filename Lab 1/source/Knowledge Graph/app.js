// 'use strict';

// Declare app level module which depends on views, and components
angular.module('KnownledgeGraph', [])
    .controller('Ctrl', function ($scope, $http) {

        $scope.getResults = function () {
            var searchQuery = document.getElementById("txt_searchQuery").value;

            $scope.resultList = [];

            if (searchQuery != null && searchQuery != "") {

                //This is the API that gives the list of venues based on the place and search query.
                var handler = $http.get("https://kgsearch.googleapis.com/v1/entities:search?query="+ searchQuery +"&key=AIzaSyDddRpJCfqYBuisKshdaC3kMZAZQSvZxhI&limit=1&indent=True");

                handler.success(function (data) {
                    if (data != null) {
                        let name =  data.itemListElement[0].result.name;
                        let image =  data.itemListElement[0].result.image.contentUrl;
                        let description =  data.itemListElement[0].result.description;
                        let detailed =  data.itemListElement[0].result.detailedDescription;
                        let url =  data.itemListElement[0].result.url;
                        $scope.resultList.push({name: name, url: url, image: image, description: description,
                            detailed: detailed});
                    }
                })

                handler.error(function (data) {
                    alert("There was some error processing your request. Please try after some time.");
                });
            }
        }
    });
