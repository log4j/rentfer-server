// services
rentferApp.factory('messageService', function ($http, $q) {

    var messageService = this;

    this.sendMessage = function (message) {
        return $http.post(host + '/message', message)
            .then(commonResponseHandler, errResponseHandler);
    };

    this.getContactList = function (id) {
        return $http.get(host + '/message/contact/' + id)
            .then(commonResponseHandler, errResponseHandler);
    };

    this.getMessageWith = function (id, target, startDate) {
        var url = host + '/message?self=' + id + '&target=' + target;
        if (startDate)
            url += '&date=' + startDate;
        return $http.get(url)
            .then(commonResponseHandler, errResponseHandler);
    };


    this.getUnreadMessageSize = function (id) {
        return $http.get(host + '/message/unread/' + id)
            .then(commonResponseHandler, errResponseHandler);
    };

    return messageService;
});