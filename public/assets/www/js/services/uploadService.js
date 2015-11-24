rentferApp.factory('uploadService', function ($http, $timeout, localStorageService) {


    var uploadService = this;


    this.uploadAvatar = function (fileURL, onProgress, onSuccess, onFail) {
        var options = new FileUploadOptions();
        options.fileKey = "avatar";
        options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        //myApp.alert(options.fileName);
        //        var headers = {
        //            'headerParam': 'headerValue'
        //        };
        //        options.headers = headers;

        var ft = new FileTransfer();
        if (onProgress)
            ft.onprogress = onProgress;

        ft.upload(fileURL, host + '/avatar', onSuccess, onFail, options);
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

    return this;
});