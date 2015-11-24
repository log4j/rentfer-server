rentferApp.controller('RoomieController', function ($scope, $state, $ionicActionSheet, $timeout, $ionicLoading, userService, uploadService, labelService) {

    $scope.searchRoommates = function () {
        userService.getRoommatesList({})
            .then(function (res) {
                $scope.roomies = res.data;
            });
    };

    $scope.showAvatar = function (avatar) {
        return host + '/images/avatar/' + avatar;
    };

    $scope.showProfile = function (roomie) {
        $state.go('tab.profile', {
            id: roomie._id
        });
    };

    $scope.$watch(function () {
        return userService.userUpdated;
    }, function () {
        if (userService.userUpdated) {
            $scope.searchRoommates();
        }
    });


    $scope.doRoomieRefresh = function () {
        userService.getRoommatesList({})
            .then(function (res) {
                $scope.roomies = res.data;
                $scope.$broadcast('scroll.refreshComplete');
            });

    };

    $scope.labels = labelService;

});