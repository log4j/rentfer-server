rentferApp.controller('ProfilePersonalController', function ($scope, userService) {

    console.log('ProfilePersonalController init');

    $scope.profile = userService.user;

    $scope.smokingEditor = {
        type: 'select',
        options: [{
                label: 'Non-smoker',
                value: 1
            },
            {
                label: 'Light-smoker',
                value: 2
            },
            {
                label: 'Heavy-smoker',
                value: 3
            }],
        value: $scope.profile.smoking,
        callback: function (value) {
            $scope.profile.smoking = value;
            userService.updateUserAttribute('smoking', value);
        }
    };
    $scope.cookingEditor = {
        type: 'select',
        options: [{
                label: 'Cannot',
                value: 1
            },
            {
                label: 'Beginer',
                value: 2
            },
            {
                label: 'Good',
                value: 3
            },
            {
                label: 'Master',
                value: 4
            }],
        value: $scope.profile.cooking,
        callback: function (value) {
            $scope.profile.cooking = value;
            userService.updateUserAttribute('cooking', value);
        }
    };

    $scope.drinkingEditor = {
        type: 'select',
        options: [{
                label: 'Non-drinking',
                value: 1
            },
            {
                label: 'Social-drinking',
                value: 2
            },
            {
                label: 'Heavy-drinking',
                value: 3
            }],
        value: $scope.profile.drinking,
        callback: function (value) {
            $scope.profile.drinking = value;
            userService.updateUserAttribute('drinking', value);
        }
    };

    $scope.change = function (fieldName, value) {
        userService.updateUserAttribute(fieldName, value);
    };

    $scope.getDisplayName = function (options, value) {
        for (var index in options)
            if (options[index].value == value)
                return options[index].label;
        return '';
    };
});


rentferApp.controller('ProfileGeneralController', function ($scope, userService) {


    $scope.profile = userService.user;


    $scope.firstNameEditor = {
        type: 'text',
        value: $scope.profile.first_name,
        callback: function (value) {
            $scope.profile.first_name = value;
            userService.updateUserAttribute('firstname', value);
        }
    };

    $scope.lastNameEditor = {
        type: 'text',
        value: $scope.profile.last_name,
        callback: function (value) {
            $scope.profile.last_name = value;
            userService.updateUserAttribute('lastname', value);
        }
    };

    $scope.genderEditor = {
        type: 'select',
        options: [{
                label: 'Male',
                value: 'male'
            },
            {
                label: 'Female',
                value: 'female'
            }],
        value: $scope.profile.gender,
        callback: function (value) {
            $scope.profile.gender = value;
            userService.updateUserAttribute('gender', value);
        }
    };

    console.log($scope.profile.birthday);
    console.log(new Date($scope.profile.birthday));

    if (!$scope.profile.birthday) {
        $scope.profile.birthday = new Date();
    }

    $scope.datepickerObject = {
        titleLabel: 'Birthday', //Optional
        closeLabel: 'Close', //Optional
        setLabel: 'Set', //Optional
        setButtonType: 'button-assertive', //Optional
        todayButtonType: 'button-assertive', //Optional
        closeButtonType: 'button-assertive', //Optional
        inputDate: new Date($scope.profile.birthday), //Optional
        mondayFirst: true, //Optional
        //disabledDates: disabledDates, //Optional
        //weekDaysList: weekDaysList, //Optional
        //monthList: monthList, //Optional
        templateType: 'modal', //Optional
        showTodayButton: 'true', //Optional
        modalHeaderColor: 'bar-stable', //Optional
        modalFooterColor: 'bar-stable', //Optional
        //from: new Date(2012, 8, 2), //Optional
        //to: new Date(2018, 8, 25), //Optional
        callback: function (val) { //Mandatory

            if (val) {
                $scope.datepickerObject.inputDate = val;
                $scope.profile.birthday = val;
                userService.updateUserAttribute('birthday', val);
            }
        },

    };

    $scope.settings = {
        enableFriends: true
    };




})


rentferApp.controller('ProfileRentingController', function ($scope, userService) {

    console.log('ProfileRentingController init');

    //    $scope.profile = {
    //        seeking: true,
    //        startDate: new Date(),
    //        rent_duration: 12,
    //        maxRoommateNum: 4
    //    };

    $scope.profile = userService.user;

    $scope.datepickerObject = {
        titleLabel: 'Start Date', //Optional
        closeLabel: 'Close', //Optional
        setLabel: 'Set', //Optional
        setButtonType: 'button-assertive', //Optional
        todayButtonType: 'button-assertive', //Optional
        closeButtonType: 'button-assertive', //Optional
        inputDate: $scope.profile.rent_start ? new Date($scope.profile.rent_start) : new Date(), //Optional
        mondayFirst: true, //Optional
        //disabledDates: disabledDates, //Optional
        //weekDaysList: weekDaysList, //Optional
        //monthList: monthList, //Optional
        templateType: 'modal', //Optional
        showTodayButton: 'true', //Optional
        modalHeaderColor: 'bar-stable', //Optional
        modalFooterColor: 'bar-stable', //Optional
        //from: new Date(2012, 8, 2), //Optional
        //to: new Date(2018, 8, 25), //Optional
        callback: function (val) { //Mandatory
            //datePickerCallback(val);
            if (val) {
                $scope.datepickerObject.inputDate = val;
                $scope.profile.rent_start = val;
                userService.updateUserAttribute('rent_start', val);
            }
        }
    };

    var datePickerCallback = function (val) {
        if (typeof (val) === 'undefined') {
            console.log('No date selected');
        } else {
            console.log('Selected date is : ', val)
        }
    };

    $scope.updateData = function (fieldName, fieldValue) {
        var data = {
            id: userService.user.id
        };
        data[fieldName] = fieldValue;
        userService.updateUser(data)
            .then(function (res) {
                console.log(res);
            });
    };

    $scope.durationEditor = {
        type: 'number',
        value: $scope.profile.rent_duration,
        callback: function (value) {
            console.log('callback', value);
            $scope.profile.rent_duration = value;
            $scope.updateData('rent_duration', value);
        }
    };

    $scope.maxRoommateNumEditor = {
        type: 'number',
        value: $scope.profile.max_roommates,
        callback: function (value) {
            $scope.profile.max_roommates = value;
            $scope.updateData('max_roommates', value);
        }
    };

});



rentferApp.controller('ProfileViewController', function ($scope, $stateParams, userService, labelService) {
    userService.getUser($stateParams.id)
        .then(function (res) {
            $scope.profile = res.data;
            console.log($scope.profile);
        });
    $scope.labels = labelService;
});



rentferApp.controller('FilterController', function ($scope, userService,  $ionicHistory) {



    $scope.rentTypeEditor = {
        type: 'multiselect',
        value: "2B1B,1B1B",
        url:'tab.edit-tab-dash',
        options: [{
                label: '3B2B',
                value: '3B2B'
            },
            {
                label: '2B1B',
                value: '2B1B'
            },
            {
                label: '1B1B',
                value: '1B1B'
            }],
        callback: function (value) {
            //$scope.profile.first_name = value;
            //userService.updateUserAttribute('firstname', value);
        }
    };
    
    $scope.cancel = function () {
                $ionicHistory.goBack();
        
    };
    

    $scope.lastNameEditor = {
        type: 'text',
        value: "",
        options: [{
                label: '3B2B',
                value: '3B2B'
            },
            {
                label: '2B2B',
                value: '2B1B'
            },
            {
                label: '1B1B',
                value: '1B1B'
            }],
        callback: function (value) {
            //$scope.profile.last_name = value;
            //userService.updateUserAttribute('lastname', value);
        }
    };

    $scope.genderEditor = {
        type: 'select',
        options: [{
                label: 'Male',
                value: 'male'
            },
            {
                label: 'Female',
                value: 'female'
            }],
        value: 'male',
        callback: function (value) {
            //$scope.profile.gender = value;
            //userService.updateUserAttribute('gender', value);
        }
    };


    $scope.distanceRange = {
        min : 0,
        max : 20,
        minSelected : 0,
        maxSelected : 5
    }

    $scope.priceRange = {
        min : 100,
        max : 6000,
        minSelected : 100,
        maxSelected : 1000
    }

    
    $scope.settings = {
        enableFriends: true
    };




});