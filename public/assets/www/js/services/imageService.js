rentferApp.factory('imageService', function ($http, $timeout, localStorageService, $cordovaFile, $cordovaFileTransfer) {

    var imageService = this;


    this.path = 'NoCloud/images/';

    this.getFreeDiskSpace = function () {
        return $cordovaFile.getFreeDiskSpace()
            .then(function (success) {
                // success in kilobytes
                console.log('SIze:', success);
            }, function (error) {
                // error
            });
    };

    this.getImage = function (image, type, callback, onprogress) {

        if (image == null || image == undefined || image == "") {
            console.log('Image:',image,type);
            return callback("./img/default/avatar.png");
        }

        if (typeof cordova === "undefined") {
            console.log('Image:',image,type);
            if (type === "avatar") {
                return callback(host + "/images/" + type + "/" + image);
            } else {
                return callback(host + "/images/" + type + "/" + image);
            }
        }

        console.log('try to find', cordova.file.documentsDirectory + imageService.path + image);
        $cordovaFile.checkFile(cordova.file.documentsDirectory + imageService.path, image)
            .then(function (result) {
                // success
                console.log(JSON.stringify(result));
                return callback(result.nativeURL);
            }, function (error) {
                // error
                console.log(JSON.stringify(error));
                var targetPath = cordova.file.documentsDirectory + imageService.path + image;
                var url = host + "/images/" + type + "/" + image;
                $cordovaFileTransfer.download(url, targetPath, {}, true)
                    .then(function (result) {
                        console.log('downloaded');
                        return callback(result.nativeURL);
                    }, function (err) {
                        console.log('downloading err', err);
                        // Error
                        return callback(null);
                    }, onprogress);
            });
        return;
    };


    /**
     * get directory size of IMGDIR
     */
    this.getCachedSize = function (callback) {

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {

            fileSystem.root.getDirectory("NoCloud/images", {
                    create: true,
                    exclusive: false
                },
                function (dir) {
                    //加载已缓存图片的记录
                    var dr = dir.createReader();
                    dr.readEntries(function (entries) {
                        var size = 0;
                        var counter = 0;
                        var finished = false;
                        for (var i = 0; i < entries.length; i++) {
                            entries[i].file(function (file) {
                                size += file.size;
                                counter++;
                            });
                        }
                        //waite until [for] finished
                        var id = setInterval(
                            function () {
                                if (counter == entries.length) {
                                    //alert(size+" pid="+id);
                                    clearInterval(id);
                                    callback(size);
                                }
                            }, 200);
                    });
                },
                function () {});
        }, function () {});

        //var dir = new DirectoryEntry();
    };

    var STORAGE_UNIT = ['byte', 'KB', 'MB', 'GB', 'TB', 'PB'];
    this.formatStorageSize = function (size) {
        var count = 0;
        while (size >= 1024) {
            size = size / 1024;
            count++;
        }
        var output = size.toFixed(1);
        return output + STORAGE_UNIT[count];
    }



    /**
     * 清楚缓存文件
     */
    //    this.clearCache = function (callback) {
    //        that.imgDir.removeRecursively(function () {
    //            that.fs.root.getDirectory(that.saveDir, {
    //                    create: true,
    //                    exclusive: false
    //                },
    //                function (dir) {
    //                    that.artUrlMap = [];
    //                    that.imgDir = dir;
    //                    callback();
    //                });
    //        });
    //    };


    return this;
});