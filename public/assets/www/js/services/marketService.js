rentferApp.factory('marketService', function ($http, $timeout, localStorageService) {


    var marketService = this;


    this.createItem = function (data) {
        var postData = {
            title: data.title,
            type: data.type,
            price: data.price,
            location: data.location,
            description: data.description,
            images: []
        };
        for (var i = 0; i < data.images.length; i++) {
            if (data.images[i].imageName) {
                postData.images.push(data.images[i].imageName);
            } else {
                postData.images.push(data.images[i].url);
            }
        }
        return $http.post(host + '/market', postData)
            .then(commonResponseHandler, errResponseHandler);
    };

    this.updateItem = function (data) {
        var postData = {
            title: data.title,
            type: data.type,
            price: data.price,
            location: data.location,
            description: data.description,
            images: []
        };
        for (var i = 0; i < data.images.length; i++) {
            if (data.images[i].imageName) {
                postData.images.push(data.images[i].imageName);
            } else {
                postData.images.push(data.images[i].url);
            }
        }
        return $http.put(host + '/market/' + data._id, postData)
            .then(commonResponseHandler, errResponseHandler);
    };

    this.updateItemSold = function (id, sold) {
        return $http.put(host + '/market/' + id, {
                sold: sold
            })
            .then(commonResponseHandler, errResponseHandler);
    };

    this.deleteItem = function (id) {
        return $http.put(host + '/market/' + id, {
                delete: true
            })
            .then(commonResponseHandler, errResponseHandler);
    };

    this.uploadMarketImage = function (fileURL, onProgress, onSuccess, onFail) {
        var options = new FileUploadOptions();
        options.fileKey = "market";
        options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        var ft = new FileTransfer();
        if (onProgress)
            ft.onprogress = onProgress;
        ft.upload(fileURL, host + '/image/market', onSuccess, onFail, options);
    };


    this.getMarketList = function (start, size, options) {

        var url = host + '/market?start=' + start + "&size=" + size;
        if (options && options.self) {
            url += "&owner=self";
        }
        return $http.get(url).then(function (res) {
            if (res.data.result) {
                for (var i = 0; i < res.data.data.length; i++) {
                    res.data.data[i].borderColor = "border-color-" + (parseInt(Math.random() * 3));
                }
            }

            return commonResponseHandler(res);
        }, errResponseHandler);
    };


    this.getMarketItem = function (id) {
        return $http.get(host + '/market/' + id)
            .then(commonResponseHandler, errResponseHandler);
    };

    return this;
});