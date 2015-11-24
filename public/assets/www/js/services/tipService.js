rentferApp.factory('tipService', function ($http, $timeout, localStorageService) {

    var tipService = this;


    this.getTipList = function () {
        return $http.get(host + '/tip')
            .then(commonResponseHandler, errResponseHandler);
    };

    this.getTip = function (id) {
        return $http.get(host + '/tip/' + id)
            .then(commonResponseHandler, errResponseHandler);
    };
    
    this.getTipAmount = function () {
        
    };

    return tipService;
});