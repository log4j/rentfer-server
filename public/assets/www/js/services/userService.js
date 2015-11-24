rentferApp.factory('userService', function ($http, $timeout, localStorageService) {

    var userService = this;

    this.user = {};
    this.userUpdated = null;

    this.loadUsernameAndPassword = function () {
        this.user.email = localStorageService.get('email');
        this.user.password = localStorageService.get('password');
    };

    this.saveUsernameAndPassword = function () {
        localStorageService.set('email', this.user.email);
        localStorageService.set('password', this.user.password);
    };

    this.setUser = function (user) {

        this.user.gender = user.gender;
        if (user.avatar)
            this.user.avatar = user.avatar;

        if (user.avatar_url.indexOf('http') != 0) {
            user.avatar_url = host + '/images' + user.avatar_url;
        }

        for (var key in user) {
            this.user[key] = user[key];
        }


        //if (res.result) {
        console.log(userService.user);
        userService.saveUsernameAndPassword();
        //}

        this.userUpdated = new Date();
    };

    this.getUser = function (id) {
        return $http.get(host + '/user/' + id)
            .then(function (res) {
                if (res.data && res.data.data && res.data.data.avatar_url && res.data.data.avatar_url.indexOf('http') != 0) {
                    res.data.data.avatar_url = host + '/images' + res.data.data.avatar_url;
                }
                return commonResponseHandler(res);
            }, errResponseHandler);
    };

    this.updateUser = function (data) {
        return $http.put(host + '/user/' + data.id, data)
            .then(commonResponseHandler, errResponseHandler);
    };

    this.updateUserAttribute = function (fieldName, fieldValue) {
        var data = {
            id: userService.user.id
        };
        data[fieldName] = fieldValue;
        return userService.updateUser(data);
    };


    this.login = function (email, password) {

        return $http.post(host + '/login', {
                email: email,
                password: password
            })
            .then(function (res) {


                userService.user.id = res.data.id;
                return commonResponseHandler(res);
            }, errResponseHandler);
    };

    this.logout = function () {
        return $timeout(function () {
            userService.user = {};
            userService.userUpdated = null;
            return {
                result: true
            };
        }, 500);
    };

    this.signup = function (email, password) {
        return $http.post(host + '/user', {
            email: email,
            password: password
        }).then(commonResponseHandler, errResponseHandler);
    };


    this.getRoommatesList = function (query) {
        return $http.get(host + '/user', query)
            .then(commonResponseHandler, errResponseHandler);
    };



    return this;
});