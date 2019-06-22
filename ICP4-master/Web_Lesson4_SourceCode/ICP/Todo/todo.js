var angularTodo = angular.module('angularTodo', []);

angularTodo.controller('angularTodoC', ['$scope', function ($scope) {
    // define list of items
    $scope.items = [];

    // Write code to push new item

    $scope.submitNewItem = function () {

    };

    // Write code to complete item
    $scope.completeItem = function (index) {

    };

    // Write code to delete item

    $scope.deleteItem = function (index) {

    };
}]);