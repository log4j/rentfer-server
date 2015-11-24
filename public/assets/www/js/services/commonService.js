var commonResponseHandler = function (res) {



    if (res.data.result == false) {
        return {
            result: false,
            err: res.data.err
        }
    }

    if (res.data.data || res.data.data == 0) {
        return res.data;
    }

    return {
        result: true,
        data: res.data
    };

    //return res.data;
};

var errResponseHandler = function (res) {
    return {
        result: false,
        err: 'Server error:' + res.status
    };
};


rentferApp.factory('labelService', function ($http, $timeout, localStorageService) {

    var labelService = this;

    this.smoking = ['', 'Non-smoker', 'Light-smoker', 'Heavy-smoker'];
    this.drinking = ['', 'Non-drinking', 'Social-drinking', 'Heavy-drinking'];
    this.cooking = ['', 'Cannot', 'Beginer', 'Good', 'Master'];

    return this;
});

rentferApp.service('keyboardService', function ($http, $timeout, localStorageService) {

    var keyboardService = this;


    this.keyboard = 0;
    this.lastUpdated = null;

    this.inited = false;

    this.init = function () {
        if (!this.inited) {
            window.addEventListener('native.keyboardshow', function (e) {
                console.log('Keyboard height is: ' + e.keyboardHeight);
                keyboardService.keyboard = e.keyboardHeight;
                keyboardService.lastUpdated = new Date();
            });
            window.addEventListener('native.keyboardhide', function (e) {
                console.log('Keyboard closed ');
                keyboardService.keyboard = 0;
                keyboardService.lastUpdated = new Date();
            });
            this.inited = true;
        }
    }


    this.show = function () {
        if (typeof (cordova) !== 'undefined')
            cordova.plugins.Keyboard.show();
    }

    return this;
});