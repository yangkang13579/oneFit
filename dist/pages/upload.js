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
            uploadIndex: 0, //上传的编号
            uploadItems: [], //上传的图片数组
            uploading: false //是否正在上传
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
                                file: tempFilePaths[i], //用于直接显示
                                progress: 0,
                                uploaded: false, //是否上传完成
                                uploadError: false, //上传失败
                                url: '' //上传后的URL
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

        //启动上传，一个一个上传，
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
                    uploadItem.uploaded = true; //标记上传成功
                    //uploadItem.imageUrl 就是上传后的值
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
        //-------------  与上传服务器进行交互 -----------
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
                    //上传结束
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
        //获得一个上传地址
        //https://staticservice.extremevalue.cn/upload.html?appId=qjd

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
        //上传文件的具体

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
                //监控上传进度
                uploadTask.onProgressUpdate(function (res) {
                    if (listener != null) {
                        uploadItem.progress = res.progress;
                        if (uploadItem.progress > 99) {
                            uploadItem.progress = 99;
                        }
                        listener(self, uploadItem);
                    }

                    console.log('上传进度', res.progress);

                    //console.log('已经上传的数据长度', res.totalBytesSent);
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
                        console.log("check upload finished:", data);
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
                        console.log("query server error,will retry:", error);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVwbG9hZC5qcyJdLCJuYW1lcyI6WyJVcGxvYWQiLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IiwibWl4aW5zIiwiUGFnZU1peGluIiwiZGF0YSIsInVwbG9hZEluZGV4IiwidXBsb2FkSXRlbXMiLCJ1cGxvYWRpbmciLCJtZXRob2RzIiwiY2hvb3NlSW1hZ2UiLCJlIiwic2VsZiIsInd4IiwiY291bnQiLCJzaXplVHlwZSIsInNvdXJjZVR5cGUiLCJzdWNjZXNzIiwicmVzIiwidGVtcEZpbGVQYXRocyIsImkiLCJsZW5ndGgiLCJwdXNoIiwiaW5kZXgiLCJmaWxlIiwicHJvZ3Jlc3MiLCJ1cGxvYWRlZCIsInVwbG9hZEVycm9yIiwidXJsIiwic3RhcnRVcGxvYWQiLCIkYXBwbHkiLCJmYWlsIiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwicHJldmlld0ltYWdlIiwidXBsb2FkSXRlbSIsIml0ZW0iLCJ1cGxvYWRGaWxlIiwidGhlbiIsImNhdGNoIiwibWVzc2FnZSIsImxpc3RlbmVyIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJfbmV3VXBsb2FkIiwidXBsb2FkVG9rZW4iLCJ0b2tlbiIsInVwbG9hZFVybCIsIl91cGxvYWRGaWxlIiwiX3VwbG9hZFF1ZXJ5Q2hlY2siLCJfdXBsb2FkUXVlcnlSZXN1bHQiLCJmaWxlcyIsImltYWdlVXJsIiwiaW1hZ2VzIiwicmVxdWVzdCIsIm1ldGhvZCIsImFjdGlvbiIsInR5cGUiLCJhcHBJZCIsInVwbG9hZEFwcElkIiwianNvbiIsImNvZGUiLCJtZXNzYWdlcyIsIkVycm9yIiwibmFtZSIsImVyck1zZyIsInVwbG9hZFRhc2siLCJmaWxlUGF0aCIsInN0YXR1c0NvZGUiLCJvblByb2dyZXNzVXBkYXRlIiwidG90YWxCeXRlc0V4cGVjdGVkVG9TZW5kIiwiY2hlY2tGaW5pc2hlZCIsInN0YXR1cyIsInNldFRpbWVvdXQiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFF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RDtBQUNGLHFCQWpCUTtBQWtCVG9CLDBCQUFNLGNBQVViLEdBQVYsRUFBZTtBQUNuQiw0QkFBSWMsUUFBUTtBQUNWK0Isa0NBQU0sY0FESTtBQUVWdEIscUNBQVN2QixJQUFJaUQ7QUFGSCx5QkFBWjtBQUlBLDRCQUFJeEQsSUFBSSxJQUFJc0QsS0FBSixDQUFVakMsTUFBTVMsT0FBaEIsQ0FBUjtBQUNBOUIsMEJBQUV1RCxJQUFGLEdBQVNsQyxNQUFNK0IsSUFBZjtBQUNBbEIsK0JBQU9sQyxDQUFQO0FBQ0Q7QUExQlEsaUJBQVg7QUE0QkQsYUE5Qk0sQ0FBUDtBQStCRDs7OztFQTdTaUNpRSxlQUFLQyxJOztrQkFBcEI3RSxNIiwiZmlsZSI6InVwbG9hZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKiBnbG9iYWwgd3ggKi9cclxuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XHJcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vbWl4aW5zL3BhZ2UnO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVcGxvYWQgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gICAgY29uZmlnID0ge1xyXG4gICAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfmtYvor5XkuIrkvKDlm77niYcnXHJcbiAgICB9O1xyXG4gICAgbWl4aW5zID0gW1BhZ2VNaXhpbl07XHJcbiAgICBkYXRhID0ge1xyXG4gICAgICAgIHVwbG9hZEluZGV4OiAwLCAvL+S4iuS8oOeahOe8luWPt1xyXG4gICAgICAgIHVwbG9hZEl0ZW1zOiBbXSwgLy/kuIrkvKDnmoTlm77niYfmlbDnu4RcclxuICAgICAgICB1cGxvYWRpbmc6IGZhbHNlIC8v5piv5ZCm5q2j5Zyo5LiK5LygXHJcbiAgICB9O1xyXG4gICAgbWV0aG9kcyA9IHtcclxuICAgICAgICBjaG9vc2VJbWFnZShlKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgd3guY2hvb3NlSW1hZ2Uoe1xyXG4gICAgICAgICAgICAgICAgY291bnQ6IDIsXHJcbiAgICAgICAgICAgICAgICBzaXplVHlwZTogWydvcmlnaW5hbCcsICdjb21wcmVzc2VkJ10sXHJcbiAgICAgICAgICAgICAgICBzb3VyY2VUeXBlOiBbJ2FsYnVtJywgJ2NhbWVyYSddLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB0ZW1wRmlsZVBhdGjlj6/ku6XkvZzkuLppbWfmoIfnrb7nmoRzcmPlsZ7mgKfmmL7npLrlm77niYdcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZW1wRmlsZVBhdGhzID0gcmVzLnRlbXBGaWxlUGF0aHM7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZW1wRmlsZVBhdGhzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYudXBsb2FkSXRlbXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogc2VsZi51cGxvYWRJbmRleCsrLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogdGVtcEZpbGVQYXRoc1tpXSwgLy/nlKjkuo7nm7TmjqXmmL7npLpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkZWQ6IGZhbHNlLCAvL+aYr+WQpuS4iuS8oOWujOaIkFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkRXJyb3I6IGZhbHNlLCAvL+S4iuS8oOWksei0pVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnJyAvL+S4iuS8oOWQjueahFVSTFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zdGFydFVwbG9hZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZmFpbChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd1cGxvYWQgZmFpbGVkOicsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBwcmV2aWV3SW1hZ2UoZSkge1xyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvL+WQr+WKqOS4iuS8oO+8jOS4gOS4quS4gOS4quS4iuS8oO+8jFxyXG4gICAgc3RhcnRVcGxvYWQoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGlmIChzZWxmLnVwbG9hZGluZykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygndXBsb2FkaW5nLi4uJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHVwbG9hZEl0ZW0gPSBudWxsO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZi51cGxvYWRJdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHNlbGYudXBsb2FkSXRlbXNbaV07XHJcbiAgICAgICAgICAgIGlmIChpdGVtLnByb2dyZXNzID09IDApIHtcclxuICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0gPSBpdGVtO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHVwbG9hZEl0ZW0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBzZWxmLnVwbG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIHNlbGZcclxuICAgICAgICAgICAgICAgIC51cGxvYWRGaWxlKHVwbG9hZEl0ZW0sIGZ1bmN0aW9uKHVwbG9hZEl0ZW0pe1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51cGxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLnVwbG9hZGVkID0gdHJ1ZTsgLy/moIforrDkuIrkvKDmiJDlip9cclxuICAgICAgICAgICAgICAgICAgICAvL3VwbG9hZEl0ZW0uaW1hZ2VVcmwg5bCx5piv5LiK5Lyg5ZCO55qE5YC8XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnN0YXJ0VXBsb2FkKCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0udXBsb2FkRXJyb3IgPSBlLm1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51cGxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc3RhcnRVcGxvYWQoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAvKiog5paw55qEIGdlbmVyYXRvciDlhpnms5VcclxuICAgICAgICAgICAgdGhpcy5hcHBcclxuICAgICAgICAgICAgICAgIC51cGxvYWRGaWxlKHVwbG9hZEl0ZW0sIGZ1bmN0aW9uKHVwbG9hZEl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXBsb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkSXRlbS51cGxvYWRlZCA9IHRydWU7IC8v5qCH6K6w5LiK5Lyg5oiQ5YqfXHJcbiAgICAgICAgICAgICAgICAgICAgLy91cGxvYWRJdGVtLmltYWdlVXJsIOWwseaYr+S4iuS8oOWQjueahOWAvFxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAvLyBzZWxmLnN0YXJ0VXBsb2FkKCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0udXBsb2FkRXJyb3IgPSBlLm1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51cGxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgICAgLy8gc2VsZi5zdGFydFVwbG9hZCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vLS0tLS0tLS0tLS0tLSAg5LiO5LiK5Lyg5pyN5Yqh5Zmo6L+b6KGM5Lqk5LqSIC0tLS0tLS0tLS0tXHJcbiAgICAvKiDkvKDnu5/mqKHlvI9wcm9taXNlIOWGmeazlSAqL1xyXG4gICAgdXBsb2FkRmlsZSh1cGxvYWRJdGVtLCBsaXN0ZW5lcikge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBjb25zb2xlLmxvZygnc3RhcnRVcGxvYWQ6JywgdXBsb2FkSXRlbS5pbmRleCk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgc2VsZlxyXG4gICAgICAgICAgICAgICAgLl9uZXdVcGxvYWQoKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ25ld1VwbG9hZDonLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLnVwbG9hZFRva2VuID0gZGF0YS50b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLnVwbG9hZFVybCA9IGRhdGEudXBsb2FkVXJsO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl91cGxvYWRGaWxlKHVwbG9hZEl0ZW0sIGxpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fdXBsb2FkUXVlcnlDaGVjayh1cGxvYWRJdGVtLGxpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fdXBsb2FkUXVlcnlSZXN1bHQodXBsb2FkSXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfkuIrkvKDnu5PmnZ86JywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy/kuIrkvKDnu5PmnZ9cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5maWxlcyAmJiBkYXRhLmZpbGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGltYWdlVXJsID0gZGF0YS5maWxlc1swXS5pbWFnZXNbMF0udXJsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5LiK5Lyg57uT5p6cOicgKyBpbWFnZVVybCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0uaW1hZ2VVcmwgPSBpbWFnZVVybDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh1cGxvYWRJdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5LiK5Lyg5aSx6LSlOicsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLy/ojrflvpfkuIDkuKrkuIrkvKDlnLDlnYBcclxuICAgIC8vaHR0cHM6Ly9zdGF0aWNzZXJ2aWNlLmV4dHJlbWV2YWx1ZS5jbi91cGxvYWQuaHRtbD9hcHBJZD1xamRcclxuICAgIF9uZXdVcGxvYWQoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHZhciB1cGxvYWRVcmwgPSBzZWxmLmNvbmZpZy51cGxvYWRVcmwgKyAndXBsb2FkLmRvJztcclxuICAgICAgICAgICAgd3gucmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHVwbG9hZFVybCxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2dldCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAndXBsb2FkJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW1hZ2UnLFxyXG4gICAgICAgICAgICAgICAgICAgIGFwcElkOiBzZWxmLmNvbmZpZy51cGxvYWRBcHBJZFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGpzb24gPSByZXMuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnanNvbicsanNvbilcclxuICAgICAgICAgICAgICAgICAgICBpZiAoanNvbi5jb2RlID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGpzb24ubWVzc2FnZXMuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3IgPSBqc29uLm1lc3NhZ2VzLmVycm9yO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5uYW1lID0gZXJyb3IuY29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmYWlsKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogJ3VwbG9hZF9lcnJvcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHJlcy5lcnJNc2dcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8v5LiK5Lyg5paH5Lu255qE5YW35L2TXHJcbiAgICBfdXBsb2FkRmlsZSh1cGxvYWRJdGVtLCBsaXN0ZW5lcikge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cGxvYWRUYXNrID0gd3gudXBsb2FkRmlsZSh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHVwbG9hZEl0ZW0udXBsb2FkVXJsLFxyXG4gICAgICAgICAgICAgICAgZmlsZVBhdGg6IHVwbG9hZEl0ZW0uZmlsZSxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdmaWxlJyxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXNDb2RlICE9IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiAndXBsb2FkX2Vycm9yJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdIVFRQ6ZSZ6K+vOicgKyByZXMuc3RhdHVzQ29kZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5uYW1lID0gZXJyb3IuY29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodXBsb2FkSXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZhaWwocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiAndXBsb2FkX2Vycm9yJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogcmVzLmVyck1zZ1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5uYW1lID0gZXJyb3IuY29kZTtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvL+ebkeaOp+S4iuS8oOi/m+W6plxyXG4gICAgICAgICAgICB1cGxvYWRUYXNrLm9uUHJvZ3Jlc3NVcGRhdGUocmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lciAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkSXRlbS5wcm9ncmVzcyA9IHJlcy5wcm9ncmVzcztcclxuICAgICAgICAgICAgICAgICAgICBpZiAodXBsb2FkSXRlbS5wcm9ncmVzcyA+IDk5KSB7XHJcbiAgICAgICAgICAgIHVwbG9hZEl0ZW0ucHJvZ3Jlc3MgPSA5OTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcihzZWxmLCB1cGxvYWRJdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICBcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfkuIrkvKDov5vluqYnLCByZXMucHJvZ3Jlc3MpO1xyXG4gICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygn5bey57uP5LiK5Lyg55qE5pWw5o2u6ZW/5bqmJywgcmVzLnRvdGFsQnl0ZXNTZW50KTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgICAgICAgICAgICfpooTmnJ/pnIDopoHkuIrkvKDnmoTmlbDmja7mgLvplb/luqYnLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlcy50b3RhbEJ5dGVzRXhwZWN0ZWRUb1NlbmRcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvLyDnoa7orqTmnI3liqHlmajlt7Lnu4/mlLbliLDmiYDmnInmlbDmja5cclxuICBfdXBsb2FkUXVlcnlDaGVjayh1cGxvYWRJdGVtLGxpc3RlbmVyKSB7XHJcbiAgICB2YXIgdXBsb2FkVXJsID0gdXBsb2FkSXRlbS51cGxvYWRVcmw7XHJcbiAgICBmdW5jdGlvbiBjaGVja0ZpbmlzaGVkKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICB1cmw6IHVwbG9hZFVybCxcclxuICAgICAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgIHZhciBkYXRhID0gcmVzLmRhdGE7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImNoZWNrIHVwbG9hZCBmaW5pc2hlZDpcIiwgZGF0YSk7XHJcbiAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdmaW5pc2gnKSB7XHJcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lciAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgdXBsb2FkSXRlbS5wcm9ncmVzcyA9IDEwMDtcclxuICAgICAgICAgICAgICBsaXN0ZW5lcih1cGxvYWRJdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgY2hlY2tGaW5pc2hlZChyZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGZhaWw6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgIHZhciBlcnJvciA9IHtcclxuICAgICAgICAgICAgY29kZTogJ3VwbG9hZF9lcnJvcicsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IHJlcy5lcnJNc2dcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcInF1ZXJ5IHNlcnZlciBlcnJvcix3aWxsIHJldHJ5OlwiLCBlcnJvcik7XHJcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY2hlY2tGaW5pc2hlZChyZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjaGVja0ZpbmlzaGVkKHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgX3VwbG9hZFF1ZXJ5UmVzdWx0KHVwbG9hZEl0ZW0pIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHZhciB1cGxvYWRVcmwgPSBzZWxmLmNvbmZpZy51cGxvYWRVcmwgKyAndXBsb2FkLmRvJztcclxuICAgICAgd3gucmVxdWVzdCh7XHJcbiAgICAgICAgdXJsOiB1cGxvYWRVcmwsXHJcbiAgICAgICAgbWV0aG9kOiAnZ2V0JyxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICBhY3Rpb246ICdxdWVyeScsXHJcbiAgICAgICAgICB0b2tlbjogdXBsb2FkSXRlbS51cGxvYWRUb2tlblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgdmFyIGpzb24gPSByZXMuZGF0YTtcclxuICAgICAgICAgIGlmIChqc29uLmNvZGUgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXNvbHZlKGpzb24ubWVzc2FnZXMuZGF0YSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBlcnJvciA9IGpzb24ubWVzc2FnZXMuZXJyb3I7XHJcbiAgICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICBlLm5hbWUgPSBlcnJvci5jb2RlO1xyXG4gICAgICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmYWlsOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICB2YXIgZXJyb3IgPSB7XHJcbiAgICAgICAgICAgIGNvZGU6ICd1cGxvYWRfZXJyb3InLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiByZXMuZXJyTXNnXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICBlLm5hbWUgPSBlcnJvci5jb2RlO1xyXG4gICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19