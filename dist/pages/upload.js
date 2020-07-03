'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _page = require('./../mixins/page.js');

var _page2 = _interopRequireDefault(_page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/* global wx */


var Upload = function (_wepy$page) {
    _inherits(Upload, _wepy$page);

    function Upload() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Upload);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Upload.__proto__ || Object.getPrototypeOf(Upload)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
            navigationBarTitleText: '测试上传图片'
        }, _this.mixins = [_page2.default], _this.data = {
            uploadIndex: 0, // 上传的编号
            uploadItems: [], // 上传的图片数组
            uploading: false // 是否正在上传
        }, _this.methods = {
            chooseImage: function chooseImage(e) {
                var self = this;
                wx.chooseImage({
                    count: 2,
                    sizeType: ['original', 'compressed'],
                    sourceType: ['album', 'camera'],
                    success: function success(res) {
                        // tempFilePath可以作为img标签的src属性显示图片
                        var tempFilePaths = res.tempFilePaths;
                        for (var i = 0; i < tempFilePaths.length; i++) {
                            self.uploadItems.push({
                                index: self.uploadIndex++,
                                file: tempFilePaths[i], // 用于直接显示
                                progress: 0,
                                uploaded: false, // 是否上传完成
                                uploadError: false, // 上传失败
                                url: '' // 上传后的URL
                            });
                        }
                        self.startUpload();
                        self.$apply();
                    },
                    fail: function fail(error) {
                        console.log('upload failed:', error);
                    }
                });
            },
            previewImage: function previewImage(e) {
                //
                //
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Upload, [{
        key: 'startUpload',

        // 启动上传，一个一个上传，
        value: function startUpload() {
            var self = this;
            if (self.uploading) {
                console.log('uploading...');
                return;
            }
            var uploadItem = null;
            for (var i = 0; i < self.uploadItems.length; i++) {
                var item = self.uploadItems[i];
                if (item.progress == 0) {
                    uploadItem = item;
                    break;
                }
            }
            if (uploadItem != null) {
                self.uploading = true;
                self.uploadFile(uploadItem, function (uploadItem) {
                    self.$apply();
                }).then(function (data) {
                    self.uploading = false;
                    uploadItem.uploaded = true; // 标记上传成功
                    // uploadItem.imageUrl 就是上传后的值
                    self.$apply();
                    self.startUpload();
                }).catch(function (e) {
                    uploadItem.uploadError = e.message;
                    self.uploading = false;
                    self.$apply();
                    self.startUpload();
                });

                /** 新的 generator 写法
                this.app
                    .uploadFile(uploadItem, function(uploadItem) {
                        self.$apply();
                    })
                    .then(data => {
                        self.uploading = false;
                        uploadItem.uploaded = true; //标记上传成功
                        //uploadItem.imageUrl 就是上传后的值
                        self.$apply();
                       // self.startUpload();
                    })
                    .catch(e => {
                        uploadItem.uploadError = e.message;
                        self.uploading = false;
                        self.$apply();
                       // self.startUpload();
                    });
                 */
            }
        }
        // -------------  与上传服务器进行交互 -----------
        /* 传统模式promise 写法 */

    }, {
        key: 'uploadFile',
        value: function uploadFile(uploadItem, listener) {
            var self = this;
            console.log('startUpload:', uploadItem.index);
            return new Promise(function (resolve, reject) {
                self._newUpload().then(function (data) {
                    console.log('newUpload:', data);
                    uploadItem.uploadToken = data.token;
                    uploadItem.uploadUrl = data.uploadUrl;
                    return self._uploadFile(uploadItem, listener);
                }).then(function (data) {
                    return self._uploadQueryCheck(uploadItem, listener);
                }).then(function (data) {
                    return self._uploadQueryResult(uploadItem);
                }).then(function (data) {
                    console.log('上传结束:', data);
                    // 上传结束
                    if (data.files && data.files.length > 0) {
                        var imageUrl = data.files[0].images[0].url;
                        console.log('上传结果:' + imageUrl);
                        uploadItem.imageUrl = imageUrl;
                        resolve(uploadItem);
                    }
                }).catch(function (error) {
                    console.log('上传失败:', error);
                });
                //
            });
        }
        // 获得一个上传地址
        // https://staticservice.extremevalue.cn/upload.html?appId=qjd

    }, {
        key: '_newUpload',
        value: function _newUpload() {
            var self = this;
            return new Promise(function (resolve, reject) {
                var uploadUrl = self.config.uploadUrl + 'upload.do';
                wx.request({
                    url: uploadUrl,
                    method: 'get',
                    data: {
                        action: 'upload',
                        type: 'image',
                        appId: self.config.uploadAppId
                    },
                    success: function success(res) {
                        var json = res.data;
                        console.log('json', json);
                        if (json.code == 200) {
                            resolve(json.messages.data);
                        } else {
                            var error = json.messages.error;
                            var e = new Error(error.message);
                            e.name = error.code;
                            reject(e);
                        }
                    },
                    fail: function fail(res) {
                        var error = {
                            code: 'upload_error',
                            message: res.errMsg
                        };
                        var e = new Error(error.message);
                        e.name = error.code;
                        reject(e);
                    }
                });
            });
        }
        // 上传文件的具体

    }, {
        key: '_uploadFile',
        value: function _uploadFile(uploadItem, listener) {
            var self = this;
            return new Promise(function (resolve, reject) {
                var uploadTask = wx.uploadFile({
                    url: uploadItem.uploadUrl,
                    filePath: uploadItem.file,
                    name: 'file',
                    success: function success(res) {
                        if (res.statusCode != 200) {
                            var error = {
                                code: 'upload_error',
                                message: 'HTTP错误:' + res.statusCode
                            };
                            var e = new Error(error.message);
                            e.name = error.code;
                            reject(e);
                        } else {
                            resolve(uploadItem);
                        }
                    },
                    fail: function fail(res) {
                        var error = {
                            code: 'upload_error',
                            message: res.errMsg
                        };
                        var e = new Error(error.message);
                        e.name = error.code;
                        reject(e);
                    }
                });
                // 监控上传进度
                uploadTask.onProgressUpdate(function (res) {
                    if (listener != null) {
                        uploadItem.progress = res.progress;
                        if (uploadItem.progress > 99) {
                            uploadItem.progress = 99;
                        }
                        listener(self, uploadItem);
                    }

                    console.log('上传进度', res.progress);

                    // console.log('已经上传的数据长度', res.totalBytesSent);
                    console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend);
                });
            });
        }
        // 确认服务器已经收到所有数据

    }, {
        key: '_uploadQueryCheck',
        value: function _uploadQueryCheck(uploadItem, listener) {
            var uploadUrl = uploadItem.uploadUrl;
            function checkFinished(resolve, reject) {
                wx.request({
                    url: uploadUrl,
                    method: 'get',
                    success: function success(res) {
                        var data = res.data;
                        console.log('check upload finished:', data);
                        if (data.status === 'finish') {
                            if (listener != null) {
                                uploadItem.progress = 100;
                                listener(uploadItem);
                            }
                            resolve(data);
                        } else {
                            setTimeout(function () {
                                checkFinished(resolve, reject);
                            }, 1000);
                        }
                    },
                    fail: function fail(res) {
                        var error = {
                            code: 'upload_error',
                            message: res.errMsg
                        };
                        console.log('query server error,will retry:', error);
                        setTimeout(function () {
                            checkFinished(resolve, reject);
                        }, 1000);
                    }
                });
            };
            return new Promise(function (resolve, reject) {
                checkFinished(resolve, reject);
            });
        }
    }, {
        key: '_uploadQueryResult',
        value: function _uploadQueryResult(uploadItem) {
            var self = this;
            return new Promise(function (resolve, reject) {
                var uploadUrl = self.config.uploadUrl + 'upload.do';
                wx.request({
                    url: uploadUrl,
                    method: 'get',
                    data: {
                        action: 'query',
                        token: uploadItem.uploadToken
                    },
                    success: function success(res) {
                        var json = res.data;
                        if (json.code === 200) {
                            resolve(json.messages.data);
                        } else {
                            var error = json.messages.error;
                            var e = new Error(error.message);
                            e.name = error.code;
                            reject(e);
                        }
                    },
                    fail: function fail(res) {
                        var error = {
                            code: 'upload_error',
                            message: res.errMsg
                        };
                        var e = new Error(error.message);
                        e.name = error.code;
                        reject(e);
                    }
                });
            });
        }
    }]);

    return Upload;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(Upload , 'pages/upload'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVwbG9hZC5qcyJdLCJuYW1lcyI6WyJVcGxvYWQiLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IiwibWl4aW5zIiwiUGFnZU1peGluIiwiZGF0YSIsInVwbG9hZEluZGV4IiwidXBsb2FkSXRlbXMiLCJ1cGxvYWRpbmciLCJtZXRob2RzIiwiY2hvb3NlSW1hZ2UiLCJlIiwic2VsZiIsInd4IiwiY291bnQiLCJzaXplVHlwZSIsInNvdXJjZVR5cGUiLCJzdWNjZXNzIiwicmVzIiwidGVtcEZpbGVQYXRocyIsImkiLCJsZW5ndGgiLCJwdXNoIiwiaW5kZXgiLCJmaWxlIiwicHJvZ3Jlc3MiLCJ1cGxvYWRlZCIsInVwbG9hZEVycm9yIiwidXJsIiwic3RhcnRVcGxvYWQiLCIkYXBwbHkiLCJmYWlsIiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwicHJldmlld0ltYWdlIiwidXBsb2FkSXRlbSIsIml0ZW0iLCJ1cGxvYWRGaWxlIiwidGhlbiIsImNhdGNoIiwibWVzc2FnZSIsImxpc3RlbmVyIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJfbmV3VXBsb2FkIiwidXBsb2FkVG9rZW4iLCJ0b2tlbiIsInVwbG9hZFVybCIsIl91cGxvYWRGaWxlIiwiX3VwbG9hZFF1ZXJ5Q2hlY2siLCJfdXBsb2FkUXVlcnlSZXN1bHQiLCJmaWxlcyIsImltYWdlVXJsIiwiaW1hZ2VzIiwicmVxdWVzdCIsIm1ldGhvZCIsImFjdGlvbiIsInR5cGUiLCJhcHBJZCIsInVwbG9hZEFwcElkIiwianNvbiIsImNvZGUiLCJtZXNzYWdlcyIsIkVycm9yIiwibmFtZSIsImVyck1zZyIsInVwbG9hZFRhc2siLCJmaWxlUGF0aCIsInN0YXR1c0NvZGUiLCJvblByb2dyZXNzVXBkYXRlIiwidG90YWxCeXRlc0V4cGVjdGVkVG9TZW5kIiwiY2hlY2tGaW5pc2hlZCIsInN0YXR1cyIsInNldFRpbWVvdXQiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFF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Q0g7QUFDSixxQkFqQk07QUFrQlBvQiwwQkFBTSxjQUFVYixHQUFWLEVBQWU7QUFDakIsNEJBQUljLFFBQVE7QUFDUitCLGtDQUFNLGNBREU7QUFFUnRCLHFDQUFTdkIsSUFBSWlEO0FBRkwseUJBQVo7QUFJQSw0QkFBSXhELElBQUksSUFBSXNELEtBQUosQ0FBVWpDLE1BQU1TLE9BQWhCLENBQVI7QUFDQTlCLDBCQUFFdUQsSUFBRixHQUFTbEMsTUFBTStCLElBQWY7QUFDQWxCLCtCQUFPbEMsQ0FBUDtBQUNIO0FBMUJNLGlCQUFYO0FBNEJILGFBOUJNLENBQVA7QUErQkg7Ozs7RUF4UytCaUUsZUFBS0MsSTs7a0JBQXBCN0UsTSIsImZpbGUiOiJ1cGxvYWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyogZ2xvYmFsIHd4ICovXHJcbmltcG9ydCB3ZXB5IGZyb20gJ3dlcHknO1xyXG5pbXBvcnQgUGFnZU1peGluIGZyb20gJy4uL21peGlucy9wYWdlJztcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXBsb2FkIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICAgIGNvbmZpZyA9IHtcclxuICAgICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn5rWL6K+V5LiK5Lyg5Zu+54mHJ1xyXG4gICAgfTtcclxuICAgIG1peGlucyA9IFtQYWdlTWl4aW5dO1xyXG4gICAgZGF0YSA9IHtcclxuICAgICAgICB1cGxvYWRJbmRleDogMCwgLy8g5LiK5Lyg55qE57yW5Y+3XHJcbiAgICAgICAgdXBsb2FkSXRlbXM6IFtdLCAvLyDkuIrkvKDnmoTlm77niYfmlbDnu4RcclxuICAgICAgICB1cGxvYWRpbmc6IGZhbHNlIC8vIOaYr+WQpuato+WcqOS4iuS8oFxyXG4gICAgfTtcclxuICAgIG1ldGhvZHMgPSB7XHJcbiAgICAgICAgY2hvb3NlSW1hZ2UoZSkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHd4LmNob29zZUltYWdlKHtcclxuICAgICAgICAgICAgICAgIGNvdW50OiAyLFxyXG4gICAgICAgICAgICAgICAgc2l6ZVR5cGU6IFsnb3JpZ2luYWwnLCAnY29tcHJlc3NlZCddLFxyXG4gICAgICAgICAgICAgICAgc291cmNlVHlwZTogWydhbGJ1bScsICdjYW1lcmEnXSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGVtcEZpbGVQYXRo5Y+v5Lul5L2c5Li6aW1n5qCH562+55qEc3Jj5bGe5oCn5pi+56S65Zu+54mHXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVtcEZpbGVQYXRocyA9IHJlcy50ZW1wRmlsZVBhdGhzO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGVtcEZpbGVQYXRocy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnVwbG9hZEl0ZW1zLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IHNlbGYudXBsb2FkSW5kZXgrKyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IHRlbXBGaWxlUGF0aHNbaV0sIC8vIOeUqOS6juebtOaOpeaYvuekulxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3M6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRlZDogZmFsc2UsIC8vIOaYr+WQpuS4iuS8oOWujOaIkFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkRXJyb3I6IGZhbHNlLCAvLyDkuIrkvKDlpLHotKVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJycgLy8g5LiK5Lyg5ZCO55qEVVJMXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnN0YXJ0VXBsb2FkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmYWlsKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3VwbG9hZCBmYWlsZWQ6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHByZXZpZXdJbWFnZShlKSB7XHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8vIOWQr+WKqOS4iuS8oO+8jOS4gOS4quS4gOS4quS4iuS8oO+8jFxyXG4gICAgc3RhcnRVcGxvYWQoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGlmIChzZWxmLnVwbG9hZGluZykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygndXBsb2FkaW5nLi4uJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHVwbG9hZEl0ZW0gPSBudWxsO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZi51cGxvYWRJdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHNlbGYudXBsb2FkSXRlbXNbaV07XHJcbiAgICAgICAgICAgIGlmIChpdGVtLnByb2dyZXNzID09IDApIHtcclxuICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0gPSBpdGVtO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHVwbG9hZEl0ZW0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBzZWxmLnVwbG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIHNlbGZcclxuICAgICAgICAgICAgICAgIC51cGxvYWRGaWxlKHVwbG9hZEl0ZW0sIGZ1bmN0aW9uKHVwbG9hZEl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXBsb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkSXRlbS51cGxvYWRlZCA9IHRydWU7IC8vIOagh+iusOS4iuS8oOaIkOWKn1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwbG9hZEl0ZW0uaW1hZ2VVcmwg5bCx5piv5LiK5Lyg5ZCO55qE5YC8XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnN0YXJ0VXBsb2FkKCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0udXBsb2FkRXJyb3IgPSBlLm1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51cGxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc3RhcnRVcGxvYWQoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLyoqIOaWsOeahCBnZW5lcmF0b3Ig5YaZ5rOVXHJcbiAgICAgICAgICAgIHRoaXMuYXBwXHJcbiAgICAgICAgICAgICAgICAudXBsb2FkRmlsZSh1cGxvYWRJdGVtLCBmdW5jdGlvbih1cGxvYWRJdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnVwbG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0udXBsb2FkZWQgPSB0cnVlOyAvL+agh+iusOS4iuS8oOaIkOWKn1xyXG4gICAgICAgICAgICAgICAgICAgIC8vdXBsb2FkSXRlbS5pbWFnZVVybCDlsLHmmK/kuIrkvKDlkI7nmoTlgLxcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgICAgLy8gc2VsZi5zdGFydFVwbG9hZCgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLnVwbG9hZEVycm9yID0gZS5tZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXBsb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgICAgIC8vIHNlbGYuc3RhcnRVcGxvYWQoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tICDkuI7kuIrkvKDmnI3liqHlmajov5vooYzkuqTkupIgLS0tLS0tLS0tLS1cclxuICAgIC8qIOS8oOe7n+aooeW8j3Byb21pc2Ug5YaZ5rOVICovXHJcbiAgICB1cGxvYWRGaWxlKHVwbG9hZEl0ZW0sIGxpc3RlbmVyKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdzdGFydFVwbG9hZDonLCB1cGxvYWRJdGVtLmluZGV4KTtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBzZWxmXHJcbiAgICAgICAgICAgICAgICAuX25ld1VwbG9hZCgpXHJcbiAgICAgICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbmV3VXBsb2FkOicsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0udXBsb2FkVG9rZW4gPSBkYXRhLnRva2VuO1xyXG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0udXBsb2FkVXJsID0gZGF0YS51cGxvYWRVcmw7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3VwbG9hZEZpbGUodXBsb2FkSXRlbSwgbGlzdGVuZXIpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl91cGxvYWRRdWVyeUNoZWNrKHVwbG9hZEl0ZW0sIGxpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fdXBsb2FkUXVlcnlSZXN1bHQodXBsb2FkSXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+S4iuS8oOe7k+adnzonLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyDkuIrkvKDnu5PmnZ9cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5maWxlcyAmJiBkYXRhLmZpbGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGltYWdlVXJsID0gZGF0YS5maWxlc1swXS5pbWFnZXNbMF0udXJsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5LiK5Lyg57uT5p6cOicgKyBpbWFnZVVybCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0uaW1hZ2VVcmwgPSBpbWFnZVVybDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh1cGxvYWRJdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5LiK5Lyg5aSx6LSlOicsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLy8g6I635b6X5LiA5Liq5LiK5Lyg5Zyw5Z2AXHJcbiAgICAvLyBodHRwczovL3N0YXRpY3NlcnZpY2UuZXh0cmVtZXZhbHVlLmNuL3VwbG9hZC5odG1sP2FwcElkPXFqZFxyXG4gICAgX25ld1VwbG9hZCgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdmFyIHVwbG9hZFVybCA9IHNlbGYuY29uZmlnLnVwbG9hZFVybCArICd1cGxvYWQuZG8nO1xyXG4gICAgICAgICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgIHVybDogdXBsb2FkVXJsLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnZ2V0JyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb246ICd1cGxvYWQnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbWFnZScsXHJcbiAgICAgICAgICAgICAgICAgICAgYXBwSWQ6IHNlbGYuY29uZmlnLnVwbG9hZEFwcElkXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIganNvbiA9IHJlcy5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdqc29uJywganNvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGpzb24uY29kZSA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShqc29uLm1lc3NhZ2VzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yID0ganNvbi5tZXNzYWdlcy5lcnJvcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZmFpbChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6ICd1cGxvYWRfZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiByZXMuZXJyTXNnXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICBlLm5hbWUgPSBlcnJvci5jb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvLyDkuIrkvKDmlofku7bnmoTlhbfkvZNcclxuICAgIF91cGxvYWRGaWxlKHVwbG9hZEl0ZW0sIGxpc3RlbmVyKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVwbG9hZFRhc2sgPSB3eC51cGxvYWRGaWxlKHtcclxuICAgICAgICAgICAgICAgIHVybDogdXBsb2FkSXRlbS51cGxvYWRVcmwsXHJcbiAgICAgICAgICAgICAgICBmaWxlUGF0aDogdXBsb2FkSXRlbS5maWxlLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2ZpbGUnLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1c0NvZGUgIT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6ICd1cGxvYWRfZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0hUVFDplJnor686JyArIHJlcy5zdGF0dXNDb2RlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLm5hbWUgPSBlcnJvci5jb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh1cGxvYWRJdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZmFpbChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6ICd1cGxvYWRfZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiByZXMuZXJyTXNnXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICBlLm5hbWUgPSBlcnJvci5jb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vIOebkeaOp+S4iuS8oOi/m+W6plxyXG4gICAgICAgICAgICB1cGxvYWRUYXNrLm9uUHJvZ3Jlc3NVcGRhdGUocmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lciAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkSXRlbS5wcm9ncmVzcyA9IHJlcy5wcm9ncmVzcztcclxuICAgICAgICAgICAgICAgICAgICBpZiAodXBsb2FkSXRlbS5wcm9ncmVzcyA+IDk5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0ucHJvZ3Jlc3MgPSA5OTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIoc2VsZiwgdXBsb2FkSXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+S4iuS8oOi/m+W6picsIHJlcy5wcm9ncmVzcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ+W3sue7j+S4iuS8oOeahOaVsOaNrumVv+W6picsIHJlcy50b3RhbEJ5dGVzU2VudCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcclxuICAgICAgICAgICAgICAgICAgICAn6aKE5pyf6ZyA6KaB5LiK5Lyg55qE5pWw5o2u5oC76ZW/5bqmJyxcclxuICAgICAgICAgICAgICAgICAgICByZXMudG90YWxCeXRlc0V4cGVjdGVkVG9TZW5kXHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvLyDnoa7orqTmnI3liqHlmajlt7Lnu4/mlLbliLDmiYDmnInmlbDmja5cclxuICAgIF91cGxvYWRRdWVyeUNoZWNrKHVwbG9hZEl0ZW0sIGxpc3RlbmVyKSB7XHJcbiAgICAgICAgdmFyIHVwbG9hZFVybCA9IHVwbG9hZEl0ZW0udXBsb2FkVXJsO1xyXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrRmluaXNoZWQocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiB1cGxvYWRVcmwsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gcmVzLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NoZWNrIHVwbG9hZCBmaW5pc2hlZDonLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdmaW5pc2gnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lciAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLnByb2dyZXNzID0gMTAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIodXBsb2FkSXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrRmluaXNoZWQocmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6ICd1cGxvYWRfZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiByZXMuZXJyTXNnXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncXVlcnkgc2VydmVyIGVycm9yLHdpbGwgcmV0cnk6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja0ZpbmlzaGVkKHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY2hlY2tGaW5pc2hlZChyZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgX3VwbG9hZFF1ZXJ5UmVzdWx0KHVwbG9hZEl0ZW0pIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdmFyIHVwbG9hZFVybCA9IHNlbGYuY29uZmlnLnVwbG9hZFVybCArICd1cGxvYWQuZG8nO1xyXG4gICAgICAgICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgIHVybDogdXBsb2FkVXJsLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnZ2V0JyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb246ICdxdWVyeScsXHJcbiAgICAgICAgICAgICAgICAgICAgdG9rZW46IHVwbG9hZEl0ZW0udXBsb2FkVG9rZW5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGpzb24gPSByZXMuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoanNvbi5jb2RlID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShqc29uLm1lc3NhZ2VzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yID0ganNvbi5tZXNzYWdlcy5lcnJvcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZmFpbDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogJ3VwbG9hZF9lcnJvcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHJlcy5lcnJNc2dcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iXX0=