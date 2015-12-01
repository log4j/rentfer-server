rentferApp.controller('ContactController', function ($scope, $state, userService, messageService) {


    $scope.alls = [
        {
            label: 'Crystal City',
            type: 'living-area'
        },
        {
            label: 'Pentagon City',
            type: 'living-area'
        },
        {
            label: 'Dunn Loring',
            type: 'living-area'
        },
        {
            label: 'H-mart',
            type: 'living-area'
        },
        {
            label: 'Good Fortune',
            type: 'living-area'
        },
        {
            label: 'Great Wall Supermarket',
            type: 'living-area'
        },
        {
            label: 'Rosslyn',
            type: 'metro'
        },
        {
            label: 'Foggy Bottom',
            type: 'metro'
        },
        {
            label: 'Farragut West',
            type: 'metro'
        },
        {
            label: 'Dupont Circle',
            type: 'metro'
        },
        {
            label: 'The George Washington University',
            type: 'university'
        },
        {
            label: 'Georgetown University',
            type: 'university'
        },
        {
            label: 'Maryland University',
            type: 'university'
        },
        {
            label: 'University of Phoenix',
            type: 'university'
        },
        {
            label: 'George Mason University',
            type: 'university'
        },
        {
            label: 'Columbian College of Arts and Sciences',
            type: 'university'
        },
        {
            label: 'Carnegie University',
            type: 'university'
        }
        ];

    $scope.keyword = "";
    $scope.search = function (keyword) {
        $scope.keywords = [];

        if (keyword) {
            for (var i = 0; i < $scope.alls.length; i++) {
                if ($scope.alls[i].label.toLowerCase().indexOf(keyword.toLowerCase()) >= 0) {
                    $scope.keywords.push($scope.alls[i]);
                }
            }
        }
    }

    $scope.showDetail = function () {
        $state.go('tab.message');
    }
});


rentferApp.controller('MessageController', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
                        $ionicModal,$timeout, $stateParams, $ionicScrollDelegate, userService, keyboardService, messageService, $compile, $ionicLoading) {


    $scope.cancel = function () {
        //        $ionicHistory.goBack();
        if($scope.showDetail){
            $scope.showDetail = false;   
            $scope.selectedMall = null;
            $scope.title='Search around'
        }else{
           $state.go('tab.contact'); 
        }
        
    };

    var geocoder;
    var map;

    function initialize() {
        geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'address': "England"
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var mapOptions = {
                    zoom: 15,
                    center: new google.maps.LatLng(-34.397, 150.644),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }

                // Let's draw the map
                map = new google.maps.Map(document.getElementById("map"), mapOptions);

                $scope.map = map;

                map.addListener('dragstart', function () {
                    if($scope.showDetail){
                        $scope.malls=[];
                    }else{
                       $scope.apts = [];
                        $scope.selectedApt = null; 
                    }
                    
                });
                
                map.addListener('dragend', function () {
                    if($scope.showDetail){
                        $ionicLoading.show();
                        $timeout(function(){
                            $scope.randomMall();
                            $ionicLoading.hide();
                        },1000);
                    }else{
                        $ionicLoading.show();
                        $timeout(function(){
                            $scope.randomApartment();
                            $ionicLoading.hide();
                        },1000);
                    }
                    
                });

                $scope.centerOnMe();
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
    }

    initialize();
    $scope.centerOnMe = function () {
        if (!$scope.map) {
            return;
        }

        $scope.loading = $ionicLoading.show({
            content: 'Getting current location...',
            showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function (pos) {
            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            $ionicLoading.hide();
        }, function (error) {
            alert('Unable to get location: ' + error.message);
            $ionicLoading.hide();
        });
    };
    
    $scope.title='Search around';

    var apartmentList = [
        {
            name: 'Crystal Plaza',
            phone: '202-123-1234',
            address: '2111 Jefferson Davis Hwy'
        },
        {
            name: 'RiverHouse Apartment',
            phone: '703-521-7900',
            address: '1400 S Joyce St'
        },

        {
            name: 'Dolley Madison Tower',
            phone: '855-248-2872',
            address: '2300 24th Rd S'
        }
        ,
        {
            name: 'The Harlowe Apartment',
            phone: '571-551-5531',
            address: '2400 S Giebe Rd'
        }
        ,
        {
            name: 'Randolph Tower',
            phone: '571-733-9163',
            address: '4001 9th St. North'
        },
        {
            name: 'Latrobe Apartment',
            phone: '202-741-9260',
            address: '1325 15th St. NW'
        },
        {
            name: '450K',
            phone: '866-375-6301',
            address: '450K St. NW'
        },
        {
            name: 'Takoma Central',
            phone: '202-407-9585',
            address: '235 Carroll St. NW'
        }
        ];
    $scope.randomApartment = function () {
        var size = 2 + parseInt(Math.random() * 6);
        var leftMin = 30;
        var leftMax = 340;
        var topMin = 30;
        var topMax = 300;
        $scope.apts = [];
        for (var i = 0; i < size; i++) {
            var left = leftMin + parseInt(Math.random() * (leftMax - leftMin));
            var top = topMin + parseInt(Math.random() * (topMax - topMin));
            var apt = apartmentList[parseInt(Math.random() * apartmentList.length) % apartmentList.length];
            var rating = 2 + parseInt(Math.random() * 3);
            var obj = {
                left: left,
                top: top,
                name: apt.name,
                phone: apt.phone,
                address: apt.address,
                rating: rating,
                id: (i + 1)
            };

            $scope.apts.push(obj);
        }
    };

    
    var mallList = [
        {
            name: 'Harris Tweeter',
            phone: '202-123-1234',
            address: '2111 Jefferson Davis Hwy',
            distance:'10.1 miles',
            type: 'store'
        },
        {
            name: 'Costco',
            phone: '703-521-7900',
            address: '1400 S Joyce St',
           distance:'1.1 miles',
            type: 'store'
        },
        {
            name: 'Trade Joe’s',
            phone: '703-351-8015',
            address: '1109 N Highland St',
            distance:'2.1 miles',
            type: 'store'
        },
        {
            name: 'Macy’s',
            phone: '202-628-6661',
            address: '1201 G St NW',
            distance:'0.1 miles',
            type: 'store'
        },        
        {
            name: 'Seven Eleven',
            phone: '703-243-4733',
            address: '2525 N.Lee Hwy.',
            distance:'15.1 miles',
            type: 'store'
        },
        {
            name: 'Great Wall Supermarket',
            phone: '703-208-3320',
            address: 'Fairfax Plaza, 2982 Gallows Rd, Falls Church',
            distance:'0.5 miles',
            type: 'store'
        },
        {
            name: 'H Mart',
            phone: '703-914-4222',
            address: '7885 Heritage Dr,Annandale',
            distance:'1.8 miles',
            type: 'store'
        },
        {
            name: 'Whole Foods Market',
            phone: '202-296-1660',
            address: '2201 I St NW',
            distance:'5.1 miles',
            type: 'store'
        },    
        {
            name: 'Crystal City',
            phone: '703-521-7900',
            address: '1400 S Joyce St',
            distance:'3.2 miles',
            type: 'metro'
        },
        {
            name: 'Pentagon City',
            phone: '703-521-7900',
            address: '1400 S Joyce St',
            distance:'4.1 miles',
            type: 'metro'
        },
        {
            name: 'Foggy Bottom',
            phone: '202-521-7900',
            address: '2301 I St NW',
            distance:'1.1 miles',
            type: 'metro'
        },
        {
            name: 'Courthouse',
            phone: '804-497-7100',
            address: '2100 Clarendon Blvd',
            distance:'3.4 miles',
            type: 'metro'
        },
        {
            name: 'Farragut West',
            phone: '202-637-7000',
            address: '900 18th St NW',
            distance:'4.1 miles',
            type: 'metro'
        },
         {
            name: 'UPS',
            phone: '202-543-0850',
            address: '6111 Pennsylvania Ave SE',
            distance:'7.1 miles',
            type: 'post'
        },
        {
            name: 'FedEx',
            phone: '703-302-3415',
            address: '1700 Jefferson Davis Highway',
            distance:'6.1 miles',
            type: 'post'
        },
        {
            name: 'USPS',
            phone: '703-521-7900',
            address: '1400 S Joyce St',
            distance:'5.1 miles',
            type: 'post'
        }];
    
    
    $scope.randomMall = function () {
        var size = 2 + parseInt(Math.random() * 6);
        var leftMin = 30;
        var leftMax = 340;
        var topMin = 30;
        var topMax = 300;
        $scope.malls = [];
        for (var i = 0; i < size; i++) {
            var left = leftMin + parseInt(Math.random() * (leftMax - leftMin));
            var top = topMin + parseInt(Math.random() * (topMax - topMin));
            var mall = mallList[parseInt(Math.random() * mallList.length) % mallList.length];
            var rating = 2 + parseInt(Math.random() * 3);
            var obj = {
                left: left,
                top: top,
                name: mall.name,
                phone: mall.phone,
                address: mall.address,
                type: mall.type,
                rating: rating,
                distance: mall.distance,
                id: (i + 1)
            };

            $scope.malls.push(obj);
        }
    };
    
    
    $scope.range = function (n) {
        return new Array(n);
    };

    $scope.selectApt = function (apt) {

        if ($scope.selectedApt && $scope.selectedApt.id == apt.id) {
            $scope.selectedApt = null;
            apt.selected = false;
            return;
        }

        $scope.selectedApt = apt;
        for (var i = 0; i < $scope.apts.length; i++)
            $scope.apts[i].selected = false;
        apt.selected = true;
    };
    
    $scope.selectMall = function (apt) {

        if ($scope.selectedMall && $scope.selectedMall.id == apt.id) {
            $scope.selectedMall = null;
            apt.selected = false;
            return;
        }

        $scope.selectedMall = apt;
        for (var i = 0; i < $scope.malls.length; i++)
            $scope.malls[i].selected = false;
        apt.selected = true;
    };

    $scope.randomApartment();

    $scope.clickTest = function () {
        alert('Example of infowindow with ng-click')
    };
    
    
    $scope.viewAptDetail = function(){
        
        $ionicLoading.show();
        $timeout(function(){
            $scope.showDetail = true;
            $scope.randomMall();
            $scope.title='Around '+$scope.selectedApt.name;
            $ionicLoading.hide();
        },300);
        //$state.go('tab.apt');   
    }

    
    
    
    $ionicModal.fromTemplateUrl('templates/modal/modal-required-infor.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
    
    
      $scope.openModal = function() {
        $scope.modal.show();
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };
      //Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });
      // Execute action on hide modal
      $scope.$on('modal.hidden', function() {
        // Execute action
      });
      // Execute action on remove modal
      $scope.$on('modal.removed', function() {
        // Execute action
      });

    
    
    $scope.addToFavor = function(){
        $ionicLoading.show();
        $timeout(function(){
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                 title: 'Rent-App!',
                 template: 'Apartment added into Favorite!'
               });
               alertPopup.then(function(res) {
                 //console.log('Thank you for not eating my delicious ice cream cone');
               });
        },1000);
    };
});


