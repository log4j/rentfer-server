// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var rentferApp = angular.module('starter', ['ionic', 'ionic-material', 'ngIOS9UIWebViewPatch', 'ionic-datepicker', 'starter.controllers', 'starter.services', 'LocalStorageModule','ngCordova','tenzen-ionic-rangeSlider']);
var host = 'http://rentfer.com:3000';
//var host = 'http://localhost:3000';
//var host = 'http://192.168.99.112:3000';
rentferApp.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }

        //cordova.plugins.Keyboard.disableScroll(false);



    });
});

rentferApp.config(['$ionicConfigProvider', function ($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom'); // other values: top
    $ionicConfigProvider.form.toggle('small');
    //$ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.backButton.previousTitleText(false).text('');
}]);

rentferApp.constant('$ionicLoadingConfig', {
    template: '<div class="loader"><svg class="circular">' +
        '<circle class="path" cx="50" cy="50" r="20" fill="none"' +
        ' stroke-width="2" stroke-miterlimit="10"/></svg></div>'
});

rentferApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    }]);

rentferApp.config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    });
    $stateProvider.state('uploadSecondhand', {
        url: '/uploadSecondhand',
        templateUrl: 'templates/secondhand-upload.html',
        controller: 'LoginCtrl'
    });
    // setup an abstract state for the s directive
    $stateProvider.state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: 'MainController'
    });

    // Each tab has its own nav history stack:

    $stateProvider.state('tab.dash', {
        url: '/dash',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-dash.html',
                controller: 'DashCtrl'
            }
        }
    });

    $stateProvider.state('tab.contact', {
        url: '/contact',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-contact/tab-contact.html',
                controller: 'ContactController'
            }
        }
    });

    $stateProvider.state('tab.message', {
        url: '/chat/:user',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-contact/tab-message.html',
                controller: 'MessageController'
            }
        }
    });
    
    $stateProvider.state('tab.apt', {
        url: '/apt',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-contact/tab-apt-detail.html',
                controller: 'AptDetailController'
            }
        }
    });
    
    $stateProvider.state('tab.filter', {
        url: '/filter',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-contact/tab-filter.html',
                controller: 'FilterController'
            }
        }
    });

    $stateProvider.state('tab.roomie', {
        url: '/roomie',
        views: {
            'tab-roomie': {
                templateUrl: 'templates/tab-roomie.html',
                controller: 'RoomieController'
            }
        }
    });

    $stateProvider.state('tab.profile', {
        url: '/profile',
        views: {
            'tab-roomie': {
                templateUrl: 'templates/tab-profile.html',
                controller: 'ProfileViewController'
            }
        },
        params: {
            id: null
        }
    });

    $stateProvider.state('tab.me', {
        url: '/me',
        views: {
            'tab-me': {
                templateUrl: 'templates/tab-me/tab-me.html',
                controller: 'MeCtrl'
            }
        }
    });

    $stateProvider.state('tab.me-general', {
        url: '/me/general',
        views: {
            'tab-me': {
                templateUrl: 'templates/tab-me/me-general.html',
                controller: 'ProfileGeneralController'
            }
        }
    });

    $stateProvider.state('tab.me-personal', {
        url: '/me/personal',
        views: {
            'tab-me': {
                templateUrl: 'templates/tab-me/me-personal.html',
                controller: 'ProfilePersonalController'
            }
        }
    });

    $stateProvider.state('tab.me-renting', {
        url: '/me/renting',
        views: {
            'tab-me': {
                templateUrl: 'templates/tab-me/me-renting.html',
                controller: 'ProfileRentingController'
            }
        }
    });


    $stateProvider.state('tab.edit-tab-me', {
        url: '/edit-tab-me/:type',
        views: {
            'tab-me': {
                templateUrl: 'templates/tab-edit.html',
                controller: 'EditCtrl'
            }
        }
    });
    
    $stateProvider.state('tab.edit-tab-dash', {
        url: '/edit-tab-dash/:type',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-edit.html',
                controller: 'EditCtrl'
            }
        }
    });

    $stateProvider.state('tab.edit-tab-market', {
        url: '/edit-tab-market/:type',
        views: {
            'tab-market': {
                templateUrl: 'templates/tab-edit.html',
                controller: 'EditCtrl'
            }
        }
    });

    $stateProvider.state('tab.market', {
        url: '/market',
        views: {
            'tab-market': {
                templateUrl: 'templates/tab-market/tab-market.html',
                controller: 'MarketController'
            }
        }
    });
    $stateProvider.state('tab.market-new', {
        url: '/market-new',
        views: {
            'tab-market': {
                templateUrl: 'templates/tab-market/tab-market-new.html',
                controller: 'MarketCreateAndEditController'
            }
        }
    });
    $stateProvider.state('tab.market-edit', {
        url: '/market-edit/:id',
        views: {
            'tab-market': {
                templateUrl: 'templates/tab-market/tab-market-new.html',
                controller: 'MarketCreateAndEditController'
            }
        }
    });
    $stateProvider.state('tab.market-view', {
        url: '/market/:id',
        views: {
            'tab-market': {
                templateUrl: 'templates/tab-market/tab-market-view.html',
                controller: 'MarketViewController'
            }
        }
    });

    $stateProvider.state('tab.market-manage', {
        url: '/market-manage',
        views: {
            'tab-market': {
                templateUrl: 'templates/tab-market/tab-market-mylist.html',
                controller: 'MarketMyItemsController'
            }
        }
    });


    $stateProvider.state('tab.chats', {
        url: '/chats',
        views: {
            'tab-chats': {
                templateUrl: 'templates/tab-chats.html',
                controller: 'ChatsCtrl'
            }
        }
    });


    $stateProvider.state('tab.chat-detail', {
        url: '/chats/:chatId',
        views: {
            'tab-chats': {
                templateUrl: 'templates/chat-detail.html',
                controller: 'ChatDetailCtrl'
            }
        }
    });

    $stateProvider.state('tab.account', {
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            }
        }
    });



    $stateProvider.state('tab.tip', {
        url: '/tip',
        views: {
            'tab-tip': {
                templateUrl: 'templates/tab-tip/tab-tip.html',
                controller: 'TipController'
            }
        }
    });


    $stateProvider.state('tab.tip-list', {
        url: '/tip-list',
        views: {
            'tab-tip': {
                templateUrl: 'templates/tab-tip/tab-tip-list.html',
                controller: 'TipListController'
            }
        }
    });

    $stateProvider.state('tab.tip-view', {
        url: '/tip-view/:id',
        views: {
            'tab-tip': {
                templateUrl: 'templates/tab-tip/tab-tip-view.html',
                controller: 'TipViewController'
            }
        }
    });



    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

});