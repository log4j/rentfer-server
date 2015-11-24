rentferApp.controller('TipController', function ($scope, $state, $ionicActionSheet, $ionicModal, $timeout, $ionicLoading, userService, uploadService, ionicMaterialMotion) {


    $scope.types = [
        {
            label: 'All',
            type: -1,
            total: 12,
            image: './img/types/type-all.jpg'
        },
        {
            label: 'Housing',
            type: 1,
            total: 12,
            image: './img/types/type-housing.jpg'
        },
        {
            label: 'Food',
            type: 2,
            total: 12,
            image: './img/types/type-food.jpg'
        },
        {
            label: 'Gaming',
            type: 3,
            total: 12,
            image: './img/types/type-gaming.jpg'
        }
        ];


    $scope.showTipList = function (type) {
        $state.go('tab.tip-list');
    };

    $timeout(function () {
        ionicMaterialMotion.ripple();
    }, 200);


    $scope.$watch(function () {
        return userService.userUpdated;
    }, function () {
        if (userService.userUpdated) {
            $scope.profile = userService.user;
            if (!$scope.profile.first_name) {

                $scope.basicSubmit = function () {
                    $ionicLoading.show();
                    userService.updateUser({
                        id: $scope.profile.id,
                        'firstname': $scope.profile.first_name,
                        'lastname': $scope.profile.last_name
                    }).then(function (res) {
                        $ionicLoading.hide();
                        if (res.result) {
                            $scope.modal.hide();
                        } else {

                        }
                    });
                };

                $ionicModal.fromTemplateUrl('templates/modal/modal-required-infor.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope.modal = modal;
                    $scope.openModal();
                });

            }
        }
    });



    $scope.openModal = function () {
        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        //        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        // Execute action
    });

});


rentferApp.controller('TipListController', function ($scope, $state, $ionicActionSheet, $timeout, $ionicLoading, userService, tipService, uploadService) {

    tipService.getTipList()
        .then(function (res) {
            if (res.result) {
                $scope.list = res.data;
                console.log($scope.list);
            }
        });


    $scope.getTipImage = function (url) {
        return host + '/images/tip/' + url;
    }
});


rentferApp.controller('TipViewController', function ($scope, $state, $stateParams, $ionicActionSheet, $ionicScrollDelegate, $timeout, $ionicLoading, userService, tipService, uploadService) {


    $scope.id = $stateParams.id;
    tipService.getTip($scope.id)
        .then(function (res) {
            if (res.result) {
                $scope.tip = res.data;
                console.log($scope.tip);
                $scope.createParas($scope.tip);
            }
        });

    $scope.createParas = function (data) {
        var list = [];

        data.sections = [];
        data.sectionTitleParas = [];
        var sectionSize = -1;
        for (var j = 0; j < data.paras.length; j++) {
            if (data.paras[j].type == "image") {
                data.paras[j].isImage = true;
                data.paras[j].content = data.paras[j].content;

                var newpara = {
                    isImage: true,
                    content: data.paras[j].content
                };
                if (data.sections.length > 0) {
                    data.sections[data.sections.length - 1].paras.push(newpara);
                } else {
                    data.sectionTitleParas.push(newpara);
                }
            } else {
                data.paras[j].isText = true;

                //split content via <h3>
                var ct = data.paras[j].content;
                var idx = ct.indexOf("<h3>");
                while (idx >= 0) {
                    var end = ct.indexOf("</h3>");

                    if (idx > 0) {
                        //there are some words before <h3>, put them into current section
                        var para = {
                            isText: true,
                            content: ct.substring(0, idx)
                        };

                        if (data.sections.length > 0) {
                            data.sections[data.sections.length - 1].paras.push(para);
                        } else {
                            data.sectionTitleParas.push(para);
                        }

                    }

                    //get the title
                    var h3_title = ct.substring(idx + 4, end);
                    //create new section in data.sections
                    var sec = {
                        title: h3_title,
                        paras: []
                    };
                    data.sections.push(sec);
                    //sectionSize++


                    //remove title from ct
                    ct = ct.substring(end + 5);

                    idx = ct.indexOf("<h3>");

                }

                var newpara = {
                    isText: true,
                    content: ct
                };
                if (data.sections.length > 0) {
                    data.sections[data.sections.length - 1].paras.push(newpara);
                } else {
                    data.sectionTitleParas.push(newpara);
                }


            }
        }


        console.log(data);
    }


    $scope.toggleGroup = function (group) {
        group.show = !group.show;

        $ionicScrollDelegate.resize();
    };
    $scope.isGroupShown = function (group) {
        return group.show;
    };

    $scope.getTipImage = function (url) {
        return host + '/images/tip/' + url;
    }
});