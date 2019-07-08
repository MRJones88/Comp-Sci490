const myapp = angular.module('app', []);

myapp.run(function ($http) {
    // Sends this header with any AJAX request
    $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    // Send this header only in post requests. Specifies you are sending a JSON object
    $http.defaults.headers.post['dataType'] = 'json'
});

myapp.controller('Ctrl',function($scope,$http,$compile){
    $scope.subjectList = [];
    $scope.focusList = [];
    $scope.courseList = [];
    $scope.courseData = {};

    $scope.orderLists = [];

    $scope.navList = [];

    $scope.ordersDiv = $("#orders");
    $scope.subjectDiv = $("#subject_list");
    $scope.focusDiv = $("#focus_list");
    $scope.courseDiv = $("#course_list");
    $scope.courseItemDiv = $("#course_item");

    $scope.navigation = $("#navigation");

    $scope.homeNav = $("#home_nav");
    $scope.subjectNav = $("#subject_nav");
    $scope.focusNav = $("#focus_nav");
    $scope.courseNav = $("#course_nav");

    $scope.noSubjectsDiv = $("#no_subjects");
    $scope.noFocusesDiv = $("#no_focus_areas");
    $scope.noCoursesDiv = $("#no_courses");

    $scope.drop = $("#drop");
    $scope.enroll = $("#enroll");
    $scope.complete = $("#complete");
    $scope.info = $("#info");

    $scope.getOrders = function(){
        const req = $http.get('http://localhost:8081/getOrders');
        req.success(function(data, status, headers, config) {
            showAndHide(-1, null);
            $scope.orderLists = data;

        });
        req.error(function(data, status, headers, config) {
            alert( "failure message: " + JSON.stringify({data: data}));
        });
    };

    $scope.getSubjects = function(){
        const req = $http.get('http://localhost:8081/getSubjects');
        req.success(function(data, status, headers, config) {
            showAndHide(0, null);
            $scope.subjectList = data;

            if ($scope.subjectList.length === 0) {
                $scope.noSubjectsDiv.removeClass('hidden');
            } else {
                $scope.noSubjectsDiv.addClass('hidden');
            }
        });
        req.error(function(data, status, headers, config) {
            alert( "failure message: " + JSON.stringify({data: data}));
        });
    };

    $scope.showSubject = function (id, name) {
        const req = $http.get('http://localhost:8081/getSubject/'+id);
        req.success(function(data, status, headers, config) {
            showAndHide(1, {id: id, name: name});
            $scope.focusList = data;

            if ($scope.focusList.length === 0) {
                $scope.noFocusesDiv.removeClass('hidden');
            } else {
                $scope.noFocusesDiv.addClass('hidden');
            }
        });
        req.error(function(data, status, headers, config) {
            alert( "failure message: " + JSON.stringify({data: data}));
        });
    }

    $scope.showFocus = function (id, name) {
        const req = $http.get('http://localhost:8081/getFocus/'+id);
        req.success(function(data, status, headers, config) {
            showAndHide(2, {id: id, name: name});
            $scope.courseList = data;

            if ($scope.courseList.length === 0) {
                $scope.noCoursesDiv.removeClass('hidden');
            } else {
                $scope.noCoursesDiv.addClass('hidden');
            }
        });
        req.error(function(data, status, headers, config) {
            alert( "failure message: " + JSON.stringify({data: data}));
        });
    }

    $scope.showCourse = function (id, name, isOrder) {
        const req = $http.get('http://localhost:8081/getCourse/'+id);
        req.success(function(data, status, headers, config) {
            if (isOrder) {
                $scope.ordersDiv.addClass("hidden");
                $scope.courseItemDiv.removeClass("hidden");
            } else {
                showAndHide(3, {id: id, name: name});
            }
            $scope.courseData = data;

            if (data.CourseStatus === 'none') {
                if (data.CanEnroll) {
                    updateBtns(true, false, false, false);
                } else {
                    updateBtns(false, false, false, true);
                }

            } else if (data.CourseStatus === 'enrolled') {
                updateBtns(false, true, false, false);

            }  else if (data.CourseStatus === 'completed') {
                updateBtns(false, false, true, false);
            }
        });
        req.error(function(data, status, headers, config) {
            alert( "failure message: " + JSON.stringify({data: data}));
        });
    }

    $scope.enrollInCourse = function (id) {
        const req = $http.post('http://localhost:8081/enroll/'+id);
        req.success(function(data, status, headers, config) {
            updateBtns(false, true, false, false);
        });
        req.error(function(data, status, headers, config) {
            alert( "failure message: " + JSON.stringify({data: data}));
        });
    }

    $scope.dropCourse = function (id) {
        const req = $http.post('http://localhost:8081/drop/'+id);
        req.success(function(data, status, headers, config) {
            if ($scope.courseData.CourseStatus === 'none') {
                if ($scope.courseData.CanEnroll) {
                    updateBtns(true, false, false, false);
                } else {
                    updateBtns(false, false, false, true);
                }
            } else if ($scope.courseData.CourseStatus === 'enrolled') {
                updateBtns(true, false, false, false);
            }
        });
        req.error(function(data, status, headers, config) {
            alert( "failure message: " + JSON.stringify({data: data}));
        });
    }

    //shows if true
    function updateBtns(enroll, drop, complete, cantEnroll) {
        if (enroll) {
            $scope.enroll.removeClass('hidden');
        } else {
            $scope.enroll.addClass('hidden');
        }
        if (drop) {
            $scope.drop.removeClass('hidden');
        } else {
            $scope.drop.addClass('hidden');
        }
        if (complete) {
            $scope.complete.removeClass('hidden');
        } else {
            $scope.complete.addClass('hidden');
        }
        if (cantEnroll) {
            $scope.info.removeClass('hidden');
        } else {
            $scope.info.addClass('hidden');
        }
    }

    function showAndHide(indexToShow, navItem) {
        //clear all lists
        $scope.orderLists = [];
        $scope.subjectList = [];
        $scope.focusList = [];
        $scope.courseList = [];
        $scope.courseItem = {};

        //hide all except indexToShow
        if (indexToShow !== -1) {
            $scope.ordersDiv.addClass("hidden");
        }
        if (indexToShow !== 0) {
            $scope.subjectDiv.addClass("hidden");
        }
        if (indexToShow !== 1) {
            $scope.focusDiv.addClass("hidden");
        }
        if (indexToShow !== 2) {
            $scope.courseDiv.addClass("hidden");
        }
        if (indexToShow !== 3) {
            $scope.courseItemDiv.addClass("hidden");
        }

        //show indexToShow and update navigation bar
        if (indexToShow === -1) {
            $scope.ordersDiv.removeClass("hidden");
            while ($scope.navList.length > 0) {
                $scope.navList.pop();
            }
            $scope.navigation.addClass("hidden");

        } else {
            $scope.navigation.removeClass("hidden");
            while ($scope.navList.length > indexToShow) {
                $scope.navList.pop();
            }

            if (navItem != null) {
                $scope.navList.push(navItem);
            }

            if (indexToShow === 0) {
                $scope.subjectDiv.removeClass("hidden");

                //hide all nav bar items after home
                $scope.subjectNav.addClass("hidden");
                $scope.focusNav.addClass("hidden");
                $scope.courseNav.addClass("hidden");

            } else if (indexToShow === 1) {
                $scope.focusDiv.removeClass("hidden");

                //show/style subject nav bar item
                $scope.subjectNav.removeClass("hidden");
                $scope.subjectNav.find(".navBtn").html(navItem.name);

                //have to compile element to get ng-click to work when added in with jquery
                $scope.subjectNav.attr('ng-click','showSubject('+ navItem.id +', "'+ navItem.name +'")');
                $compile($scope.subjectNav)($scope);
                $scope.focusNav.addClass("hidden");
                $scope.courseNav.addClass("hidden");

            } else if (indexToShow === 2) {
                $scope.courseDiv.removeClass("hidden");
                $scope.focusNav.removeClass("hidden");
                $scope.focusNav.find(".navBtn").html(navItem.name);

                $scope.focusNav.attr('ng-click','showFocus('+ navItem.id +', "'+ navItem.name +'")');
                $compile($scope.focusNav)($scope);
                $scope.courseNav.addClass("hidden");

            } else if (indexToShow === 3) {
                $scope.courseItemDiv.removeClass("hidden");
                $scope.courseNav.removeClass("hidden");
                $scope.courseNav.find(".navBtn").html(navItem.name);

                $scope.courseNav.attr('ng-click','showCourse('+ navItem.id +', "'+ navItem.name +'")');
                $compile($scope.courseNav)($scope);

            }
        }
    }
});