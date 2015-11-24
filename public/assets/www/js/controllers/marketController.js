rentferApp.controller('MarketController', function ($scope, $state, $ionicPopup,
    marketService, imageService) {
    $scope.settings = {
        enableFriends: true
    };

    //imageService.getFreeDiskSpace();

//    imageService.getImage("avatar_af7d50222eeec477854031faf30d4e02.jpg", "avatar",
//        function (image) {
//            console.log(image);
//    });

    
    $scope.doMarketRefresh = function () {
        marketService.getMarketList(0, 10)
            .then(function (res) {
                $scope.items = [];
                //$('div.second-item').empty();

                $scope.$broadcast('scroll.refreshComplete');

                $scope.items = res.data;

                //$scope.$apply();
            });
    };

    $scope.doLoadMoreMarket = function () {
        marketService.getMarketList($scope.items.length, 10)
            .then(function (res) {
                for (var i = 0; i < res.data.length; i++) {
                    $scope.items.push(res.data[i]);
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');

                if (res.data.length == 0) {
                    $scope.hasMoreData = false;
                }
            });

    };

    $scope.hasMoreData = true;

    $scope.items = [];
    $scope.uploadItem = function () {
        $state.go('tab.market-new');
    };



    $scope.goView = function (item) {

        $state.go('tab.market-view', {
            id: item._id
        });
    };

    $scope.viewMyItems = function () {
        $state.go('tab.market-manage');
    };

});

rentferApp.controller('MarketMyItemsController', function ($scope, $state, $ionicPopup,
    $ionicActionSheet, $ionicLoading,
    marketService) {

    $scope.doMarketRefresh = function () {
        marketService.getMarketList(0, 10, {
                self: true
            })
            .then(function (res) {
                $scope.items = [];
                $scope.$broadcast('scroll.refreshComplete');
                $scope.items = res.data;
            });
    };

    $scope.doLoadMoreMarket = function () {
        marketService.getMarketList($scope.items.length, 10, {
                self: true
            })
            .then(function (res) {
                for (var i = 0; i < res.data.length; i++) {
                    $scope.items.push(res.data[i]);
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
                if (res.data.length == 0) {
                    $scope.hasMoreData = false;
                }
            });
    };

    $scope.hasMoreData = true;
    $scope.items = [];
    $scope.uploadItem = function () {
        $state.go('tab.market-new');
    };

    $scope.goView = function (item) {
        $state.go('tab.market-manage', {
            id: item._id
        });
    };

    $scope.showOptions = function (item) {
        var actionSheet = $ionicActionSheet.show({
            buttons: [
                {
                    text: 'Edit'
                }
                ],
            //            destructiveText: 'Delete',
            titleText: 'Options',
            cancelText: 'Cancel',
            destructiveText: 'Delete',
            cancel: function () {},
            buttonClicked: function (index) {
                console.log(index);
                //getImage(index, callback);

                if (index == 0) {
                    //show Edit page

                    $state.go('tab.market-edit', {
                        id: item._id
                    });

                } else {
                    //TODO: send delete call
                }



                return true;
            },
            destructiveButtonClicked: function () {
                console.log('delete', item);
                actionSheet();
                $scope.deleteItem(item);
            }
        });
    };

    $scope.updateSoldValue = function (item) {
        marketService.updateItemSold(item._id, item.sold);
    };

    $scope.deleteItem = function (item) {
        $ionicPopup.confirm({
            title: 'Confirm',
            template: 'Are you sure to delete this item?'
        }).then(function (res) {
            if (res) {
                $ionicLoading.show();
                marketService.deleteItem(item._id)
                    .then(function (res) {
                        $ionicLoading.hide();
                        if (res.result) {
                            for (var i = 0; i < $scope.items.length; i++) {
                                if ($scope.items[i]._id === item._id) {
                                    $scope.items.splice(i, 1);
                                    break;
                                }
                            }
                        }
                    });
            }

        });
    };

});


rentferApp.controller('MarketViewController', function ($scope, $state, $stateParams,
    $ionicPopup, $ionicSlideBoxDelegate,
    marketService) {

    $scope.id = $stateParams.id

    console.log($stateParams);


    marketService.getMarketItem($scope.id)
        .then(function (res) {
            console.log(res.data);

            $scope.item = res.data;

            $ionicSlideBoxDelegate.update();

        });


    $scope.contact = function () {
        $state.go("tab.message", {
            user: $scope.item.user._id
        });
    }

});


rentferApp.controller('MarketCreateAndEditController', function ($scope, $state, $ionicPopup,
    $q, $ionicHistory, $ionicActionSheet, $ionicLoading, $stateParams,
    uploadService, marketService) {

    $scope.id = $stateParams.id;
    $scope.item = {
        title: '',
        type: 0,
        images: [],
        price: 0,
        location: '',
        description: ''
    };
    //$scope.initPage();
    if ($scope.id) {
        marketService.getMarketItem($scope.id)
            .then(function (res) {
                if (res.result) {
                    $scope.item = {
                        title: res.data.title,
                        type: res.data.type,
                        images: [],
                        price: res.data.price,
                        location: res.data.location,
                        description: res.data.description
                    }
                    for (var i = 0; i < res.data.images.length; i++) {
                        $scope.item.images.push({
                            imageName: res.data.images[i],
                            unsaved: false
                        });
                    }

                }
            });
    } else {
        $scope.item = {
            title: '',
            type: 0,
            images: [],
            price: 0,
            location: '',
            description: ''
        };
        //$scope.initPage();
    }

    //$scope.initPage = function () {



    $scope.titleEditor = {
        type: 'text',
        url: 'tab.edit-tab-market',
        placeholder: 'Input a title',
        value: $scope.item.title,
        callback: function (value) {
            $scope.item.title = value;
            //userService.updateUserAttribute('title', value);
        }
    };
    $scope.typeEditor = {
        type: 'select',
        url: 'tab.edit-tab-market',
        options: [{
                label: 'Furniture',
                value: 1
            },
            {
                label: 'Books',
                value: 2
            },
            {
                label: 'Digitals',
                value: 2
            },
            {
                label: 'Others',
                value: 0
            }],
        value: $scope.item.type,
        placeholder: 'Choose a type',
        callback: function (value) {
            $scope.item.type = value;
            //userService.updateUserAttribute('gender', value);
        }
    };
    $scope.priceEditor = {
        type: 'price',
        url: 'tab.edit-tab-market',
        value: $scope.item.price,
        callback: function (value) {
            $scope.item.price = value;
            //$scope.updateData('max_roommates', value);
        }
    };
    $scope.locationEditor = {
        type: 'text',
        url: 'tab.edit-tab-market',
        placeholder: 'Input a location',
        value: $scope.item.location,
        callback: function (value) {
            $scope.item.location = value;
        }
    };

    $scope.descriptionEditor = {
        type: 'textarea',
        url: 'tab.edit-tab-market',
        placeholder: 'Input a description',
        value: $scope.item.description,
        callback: function (value) {
            $scope.item.description = value;
        }
    };
    //}

    //type: navigator.camera.PictureSourceType.CAMERA
    //    Camera.PictureSourceType = {
    //      PHOTOLIBRARY : 0,
    //      CAMERA : 1,
    //      SAVEDPHOTOALBUM : 2
    //  };
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
    };

    $scope.showImageUploadSheet = function () {

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
            titleText: 'Upload Image',
            cancelText: 'Cancel',
            cancel: function () {
                // add cancel code..
            },
            buttonClicked: function (index) {
                //console.log(index);
                getImage(index, function (imageUrl) {
                    if (imageUrl) {
                        $scope.item.images.push({
                            url: imageUrl,
                            unsaved: true

                        });
                        $scope.$apply();
                    }

                });
                return true;
            }
        });

        //        // For example's sake, hide the sheet after two seconds
        //        $timeout(function () {
        //            //avatarSheet();
        //        }, 2000);

    };


    $scope.cancel = function () {
        $ionicHistory.goBack();
    };


    var uploadImage = function (index) {
        return $q(function (resolve, reject) {
            uploadService.uploadMarketImage($scope.item.images[index].url, null,
                function (res) {

                    console.log('upload result[OK]', index, JSON.stringify(res.response));

                    var response = JSON.parse(res.response);

                    return resolve({
                        result: response.result,
                        image: response.image,
                        err: response.err,
                        index: index
                    });
                },
                function (res) {
                    console.log('upload result[not OK]', index, JSON.stringify(res));
                    return resolve({
                        result: false
                    });
                });

        });
    }


    $scope.submit = function () {

        $ionicLoading.show();

        //first: upload images
        var uploadList = [];
        for (var i = 0; i < $scope.item.images.length; i++) {
            var image = $scope.item.images[i];
            if (image.unsaved) {
                uploadList.push(uploadImage(i));
            }
        }

        $q.all(uploadList)
            .then(function (values) {
                console.log('submit values:', JSON.stringify(values));

                var successSum = 0;
                for (var i = 0; i < values.length; i++) {
                    var res = values[i];
                    if (res.result) {
                        $scope.item.images[res.index].unsaved = false;
                        $scope.item.images[res.index].imageName = res.image;
                        successSum++;
                    }
                }
                if (successSum == values.length) {
                    //submit form
                    marketService.createItem($scope.item)
                        .then(function (res) {
                            $ionicLoading.hide();

                            if (res.result) {
                                $ionicPopup.alert({
                                        title: 'Congratuation!',
                                        template: 'Item posted!'
                                    })
                                    .then(function () {
                                        $ionicHistory.goBack();
                                    });
                            } else {
                                $ionicPopup.alert({
                                    title: 'Something wrong!',
                                    template: 'Cannot create item!'
                                });
                            }
                        });


                } else {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Something wrong!',
                        template: 'Some photos uploading failed, please click sumbit and try again!'
                    }).then(function () {

                    });
                }

            });

    };

});