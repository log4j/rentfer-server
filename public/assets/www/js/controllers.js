angular.module('starter.controllers', [])

.controller('DashCtrl', function ($scope, $ionicModal, $ionicLoading, userService) {





})

.controller('MainController', function ($scope, $state, $timeout, userService, keyboardService, messageService) {


    keyboardService.init();

    $scope.change = function (fieldName, value) {
        userService.updateUserAttribute(fieldName, value);
    };

    $scope.getAvatarImage = function (avatar) {
        return host + '/images/avatar/' + avatar;
    };

    $scope.getMarketImage = function (market) {
        return host + '/images/market/' + market;
    };

    if (!userService.user.id) {
        $state.go('login');
    }
    $scope.unreadSize = 0;

    $scope.setUnreadSize = function (size) {
        $scope.unreadSize = size;
    };
    if (userService.user.id) {

        var getUnreadSize = function () {
            messageService.getUnreadMessageSize(userService.user.id)
                .then(function (res) {
                    console.log(res);
                    $scope.unreadSize = res.data;
                    setTimeout(getUnreadSize, 10000);
                });
        }
        getUnreadSize();
    }
})



.controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
        Chats.remove(chat);
    };
})

.controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('LoginCtrl', function ($scope, $stateParams, $state, $ionicLoading, $ionicPopup,
    userService) {


    $scope.type = 'signin';


    userService.loadUsernameAndPassword();
    $scope.loginData = {
        email: userService.user.email,
        password: userService.user.password
    };


    $scope.loginSubmit = function () {
        $ionicLoading.show();
        userService.login($scope.loginData.email, $scope.loginData.password)
            .then(function (res) {

                if (res.result) {
                    userService.getUser(res.data.id)
                        .then(function (userRes) {
                            $ionicLoading.hide();
                            if (userRes.result) {
                                userService.setUser(userRes.data);
                            }
                            $state.go('tab.contact');
                        });


                } else {
                    $ionicLoading.hide();
                    var message;
                    if (res.err == 'ERR_INVALID_USER') {
                        message = 'There is something wrong with the email';
                    } else if (res.err == 'ERR_INVALID_PASSWORD') {
                        message = 'There is something wrong with the password';
                    } else {
                        message = 'There is something wrong with the email or password';
                    }
                    $ionicPopup.alert({
                        title: 'Something wrong!',
                        template: message
                    });
                }
            });
    };


    $scope.signupData = {
        email: '',
        password: ''
    };
    $scope.signupSubmit = function () {
        $ionicLoading.show();
        userService.signup($scope.signupData.email, $scope.signupData.password)
            .then(function (res) {
                $ionicLoading.hide();
                if (res.result) {
                    $ionicPopup.alert({
                        title: 'Welcome!',
                        template: 'Your account have been created!'
                    }).then(function () {
                        $scope.loginData.email = $scope.signupData.email;
                        $scope.loginData.password = $scope.signupData.password;
                        $scope.loginSubmit();
                    });
                } else {
                    var message;
                    if (res.err == 'ERR_EXISTED_EMAIL ') {
                        message = 'The email has already been used!';
                    } else if (res.err == 'ERR_INVALID_PASSWORD') {
                        message = 'There is something wrong with the password';
                    } else {
                        message = 'There is something wrong with the email or password';
                    }
                    $ionicPopup.alert({
                        title: 'Something wrong!',
                        template: message
                    });
                }
            });
    };



})

.controller('AccountCtrl', function ($scope) {
    $scope.settings = {
        enableFriends: true
    };
})

.controller('MeCtrl', function ($scope, $ionicActionSheet, $timeout, $state, $ionicHistory, $ionicLoading, userService, uploadService, imageService) {

    console.log('init meCtrl');

    $scope.profile = userService.user;



    $scope.settings = {
        enableFriends: true
    };

    function getImage(type, callback) {
        // Retrieve image file location from specified source

        //return callback("./img/yangmang.jpg");


        if (navigator.camera) {
            navigator.camera.getPicture(callback, function (message) {
                //('get picture failed');
                callback(null)
            }, {
                quality: 100,
                //                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: type,
                allowEdit: true
            });
        } else {
            callback("./img/yangmang.jpg");
        }
        //type: navigator.camera.PictureSourceType.CAMERA
        //    Camera.PictureSourceType = {
        //      PHOTOLIBRARY : 0,
        //      CAMERA : 1,
        //      SAVEDPHOTOALBUM : 2
        //  };
    };


    var callback = function (imageUrl) {
        if (imageUrl) {
            console.log(imageUrl);
            $ionicLoading.show();

            uploadService.uploadAvatar(imageUrl,
                function (data) {
                    console.log(data);
                },
                function (res) {
                    console.log(res);
                    var response = JSON.parse(res.response)
                    $ionicLoading.hide();
                    $scope.profile.avatar = response.image;
                    $scope.profile.avatar_url = host + '/images/avatar/' + $scope.profile.avatar;
                },
                function (res) {
                    console.log(res);
                }
            );
        } else {}
    };

    $scope.showAvatarSheet = function () {

        // Show the action sheet
        var avatarSheet = $ionicActionSheet.show({
            buttons: [
                {
                    text: 'Choose from Photos'
                },
                {
                    text: 'Take Photo'
                }
                ],
            //            destructiveText: 'Delete',
            titleText: 'Change avatar',
            cancelText: 'Cancel',
            cancel: function () {
                // add cancel code..
            },
            buttonClicked: function (index) {
                console.log(index);
                getImage(index, callback);
                return true;
            }
        });

        // For example's sake, hide the sheet after two seconds
        $timeout(function () {
            //avatarSheet();
        }, 2000);

    };



    $scope.logout = function () {

        $ionicLoading.show();

        userService.logout()
            .then(function () {
                $ionicHistory.clearCache()
                    .then(function () {
                        $ionicHistory.clearHistory();
                        $ionicLoading.hide();
                        $state.go('login');
                    });
            });
    }


    $scope.cacheSize = imageService.formatStorageSize(1025);
    $timeout(function () {
        imageService.getCachedSize(function (size) {
            $scope.cacheSize = imageService.formatStorageSize(size);
            console.log($scope.cacheSize);
        });
    }, 200);

})


.controller('EditCtrl', function ($scope, $state, $stateParams, $timeout, $ionicHistory, editorService) {
    $scope.settings = {
        enableFriends: true
    };


    $scope.$watch(function () {
        return editorService.params;
    }, function () {
        if (editorService.params) {
            $scope.data = editorService.params;
        }
    });


    $scope.cancel = function () {
        $ionicHistory.goBack();
        editorService.setResult(false, "false");
    };


    $scope.submit = function (value) {
        $ionicHistory.goBack();
        console.log('submit', value);
        editorService.setResult(true, value);
    };


    var datePickerCallback = function (val) {
        if (typeof (val) === 'undefined') {
            console.log('No date selected');
        } else {
            console.log('Selected date is : ', val)
        }
    };

    $scope.datepickerObject = {
        titleLabel: 'Title', //Optional
        todayLabel: 'Today', //Optional
        closeLabel: 'Close', //Optional
        setLabel: 'Set', //Optional
        setButtonType: 'button-assertive', //Optional
        todayButtonType: 'button-assertive', //Optional
        closeButtonType: 'button-assertive', //Optional
        inputDate: new Date(), //Optional
        mondayFirst: true, //Optional
        //disabledDates: disabledDates, //Optional
        //weekDaysList: weekDaysList, //Optional
        //monthList: monthList, //Optional
        templateType: 'modal', //Optional
        showTodayButton: 'true', //Optional
        modalHeaderColor: 'bar-positive', //Optional
        modalFooterColor: 'bar-positive', //Optional
        from: new Date(2012, 8, 2), //Optional
        to: new Date(2018, 8, 25), //Optional
        callback: function (val) { //Mandatory
            datePickerCallback(val);
        }
    };

    console.log($stateParams.type);


    $timeout(function () {
        angular.element("input").focus();
    }, 300);

});