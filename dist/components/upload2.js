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

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Upload.__proto__ || Object.getPrototypeOf(Upload)).call.apply(_ref, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), _possibleConstructorReturn(_this, _ret);
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
            wx.showLoading({
                title: '上传中...'
            });
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
                        self.$emit('toParent2', self.uploadItems);
                        wx.hideLoading();
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
                var uploadUrl = wx.getStorageSync('uploadUrl') + 'upload.do';
                wx.request({
                    url: uploadUrl,
                    method: 'get',
                    data: {
                        action: 'upload',
                        type: 'image',
                        appId: wx.getStorageSync('uploadAppId')
                    },
                    success: function success(res) {
                        var json = res.data;
                        console.log('json11111', json);
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
                var uploadUrl = wx.getStorageSync('uploadUrl') + 'upload.do';
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

var _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this.config = {
        navigationBarTitleText: '测试上传图片'
    };
    this.mixins = [_page2.default];
    this.data = {
        uploadIndex: 0, //上传的编号
        imgUpload: '../images/btn_add_img.png',
        uploadItems: [], //上传的图片数组
        uploading: false //是否正在上传
    };
    this.events = {
        'index-broadcast': function indexBroadcast() {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            console.log(args[0], 'args[0]');
            var item = args[0][1];
            _this2.uploadItems = [{ imageUrl: item.img1, uploadUrl: item.img1, file: item.img1, uploaded: true }, { imageUrl: item.img2, file: item.img2, uploaded: true, uploadUrl: item.img2 }, { imageUrl: item.img3, file: item.img3, uploaded: true, uploadUrl: item.img3 }];
        }
    };
    this.methods = {
        delImg: function delImg(e) {
            this.uploadItems.splice(e.currentTarget.dataset.index, 1);
        },
        preview: function preview(event) {
            var currentUrl = event.currentTarget.dataset.src;
            wx.previewImage({
                current: currentUrl, // 当前显示图片的http链接
                urls: [currentUrl] // 需要预览的图片http链接列表
            });
        },
        chooseImage: function chooseImage(e) {
            var self = this;
            wx.chooseImage({
                count: 3,
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
    };
};

exports.default = Upload;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVwbG9hZDIuanMiXSwibmFtZXMiOlsiVXBsb2FkIiwic2VsZiIsInVwbG9hZGluZyIsImNvbnNvbGUiLCJsb2ciLCJ1cGxvYWRJdGVtIiwiaSIsInVwbG9hZEl0ZW1zIiwibGVuZ3RoIiwiaXRlbSIsInByb2dyZXNzIiwidXBsb2FkRmlsZSIsIiRhcHBseSIsInRoZW4iLCJ1cGxvYWRlZCIsInN0YXJ0VXBsb2FkIiwiY2F0Y2giLCJ1cGxvYWRFcnJvciIsImUiLCJtZXNzYWdlIiwibGlzdGVuZXIiLCJ3eCIsInNob3dMb2FkaW5nIiwidGl0bGUiLCJpbmRleCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiX25ld1VwbG9hZCIsImRhdGEiLCJ1cGxvYWRUb2tlbiIsInRva2VuIiwidXBsb2FkVXJsIiwiX3VwbG9hZEZpbGUiLCJfdXBsb2FkUXVlcnlDaGVjayIsIl91cGxvYWRRdWVyeVJlc3VsdCIsImZpbGVzIiwiaW1hZ2VVcmwiLCJpbWFnZXMiLCJ1cmwiLCIkZW1pdCIsImhpZGVMb2FkaW5nIiwiZXJyb3IiLCJnZXRTdG9yYWdlU3luYyIsInJlcXVlc3QiLCJtZXRob2QiLCJhY3Rpb24iLCJ0eXBlIiwiYXBwSWQiLCJzdWNjZXNzIiwicmVzIiwianNvbiIsImNvZGUiLCJtZXNzYWdlcyIsIkVycm9yIiwibmFtZSIsImZhaWwiLCJlcnJNc2ciLCJ1cGxvYWRUYXNrIiwiZmlsZVBhdGgiLCJmaWxlIiwic3RhdHVzQ29kZSIsIm9uUHJvZ3Jlc3NVcGRhdGUiLCJ0b3RhbEJ5dGVzRXhwZWN0ZWRUb1NlbmQiLCJjaGVja0ZpbmlzaGVkIiwic3RhdHVzIiwic2V0VGltZW91dCIsIndlcHkiLCJwYWdlIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm1peGlucyIsIlBhZ2VNaXhpbiIsInVwbG9hZEluZGV4IiwiaW1nVXBsb2FkIiwiZXZlbnRzIiwiYXJncyIsImltZzEiLCJpbWcyIiwiaW1nMyIsIm1ldGhvZHMiLCJkZWxJbWciLCJzcGxpY2UiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YXNldCIsInByZXZpZXciLCJldmVudCIsImN1cnJlbnRVcmwiLCJzcmMiLCJwcmV2aWV3SW1hZ2UiLCJjdXJyZW50IiwidXJscyIsImNob29zZUltYWdlIiwiY291bnQiLCJzaXplVHlwZSIsInNvdXJjZVR5cGUiLCJ0ZW1wRmlsZVBhdGhzIiwicHVzaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7OztBQUZBOzs7SUFHcUJBLE07Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNkRqQjtzQ0FDYztBQUNWLGdCQUFJQyxPQUFPLElBQVg7QUFDQSxnQkFBSUEsS0FBS0MsU0FBVCxFQUFvQjtBQUNoQkMsd0JBQVFDLEdBQVIsQ0FBWSxjQUFaO0FBQ0E7QUFDSDtBQUNELGdCQUFJQyxhQUFhLElBQWpCO0FBQ0EsaUJBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJTCxLQUFLTSxXQUFMLENBQWlCQyxNQUFyQyxFQUE2Q0YsR0FBN0MsRUFBa0Q7QUFDOUMsb0JBQUlHLE9BQU9SLEtBQUtNLFdBQUwsQ0FBaUJELENBQWpCLENBQVg7QUFDQSxvQkFBSUcsS0FBS0MsUUFBTCxJQUFpQixDQUFyQixFQUF3QjtBQUNwQkwsaUNBQWFJLElBQWI7QUFDQTtBQUNIO0FBQ0o7QUFDRCxnQkFBSUosY0FBYyxJQUFsQixFQUF3QjtBQUNwQkoscUJBQUtDLFNBQUwsR0FBaUIsSUFBakI7QUFDQUQscUJBQ0tVLFVBREwsQ0FDZ0JOLFVBRGhCLEVBQzRCLFVBQVNBLFVBQVQsRUFBb0I7QUFDeENKLHlCQUFLVyxNQUFMO0FBQ0gsaUJBSEwsRUFJS0MsSUFKTCxDQUlVLGdCQUFRO0FBQ1ZaLHlCQUFLQyxTQUFMLEdBQWlCLEtBQWpCO0FBQ0FHLCtCQUFXUyxRQUFYLEdBQXNCLElBQXRCLENBRlUsQ0FFa0I7QUFDNUI7QUFDQWIseUJBQUtXLE1BQUw7QUFDQVgseUJBQUtjLFdBQUw7QUFDSCxpQkFWTCxFQVdLQyxLQVhMLENBV1csYUFBSztBQUNSWCwr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VDtBQUNBLHdCQUFNOEMsZ0JBQWdCOUMsSUFBSThDLGFBQTFCO0FBQ0EseUJBQUssSUFBSTFGLElBQUksQ0FBYixFQUFnQkEsSUFBSTBGLGNBQWN4RixNQUFsQyxFQUEwQ0YsR0FBMUMsRUFBK0M7QUFDM0NMLDZCQUFLTSxXQUFMLENBQWlCMEYsSUFBakIsQ0FBc0I7QUFDbEJ6RSxtQ0FBT3ZCLEtBQUt3RSxXQUFMLEVBRFc7QUFFbEJiLGtDQUFNb0MsY0FBYzFGLENBQWQsQ0FGWSxFQUVNO0FBQ3hCSSxzQ0FBVSxDQUhRO0FBSWxCSSxzQ0FBVSxLQUpRLEVBSUQ7QUFDakJHLHlDQUFhLEtBTEssRUFLRTtBQUNwQnNCLGlDQUFLLEVBTmEsQ0FNVjtBQU5VLHlCQUF0QjtBQVFIO0FBQ0R0Qyx5QkFBS2MsV0FBTDtBQUNBZCx5QkFBS1csTUFBTDtBQUNILGlCQW5CVTtBQW9CWDRDLG9CQXBCVyxnQkFvQk5kLEtBcEJNLEVBb0JDO0FBQ1J2Qyw0QkFBUUMsR0FBUixDQUFZLGdCQUFaLEVBQThCc0MsS0FBOUI7QUFDSDtBQXRCVSxhQUFmO0FBd0JILFNBckNLO0FBc0NOK0Msb0JBdENNLHdCQXNDT3ZFLENBdENQLEVBc0NVO0FBQ1o7QUFDQTtBQUNIO0FBekNLLEs7OztrQkFsQk9sQixNIiwiZmlsZSI6InVwbG9hZDIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qIGdsb2JhbCB3eCAqL1xuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XG5pbXBvcnQgUGFnZU1peGluIGZyb20gJy4uL21peGlucy9wYWdlJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVwbG9hZCBleHRlbmRzIHdlcHkucGFnZSB7XG4gICAgY29uZmlnID0ge1xuICAgICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn5rWL6K+V5LiK5Lyg5Zu+54mHJ1xuICAgIH07XG4gICAgbWl4aW5zID0gW1BhZ2VNaXhpbl07XG4gICAgZGF0YSA9IHtcbiAgICAgICAgdXBsb2FkSW5kZXg6IDAsIC8v5LiK5Lyg55qE57yW5Y+3XG4gICAgICAgIGltZ1VwbG9hZDogJy4uL2ltYWdlcy9idG5fYWRkX2ltZy5wbmcnLFxuICAgICAgICB1cGxvYWRJdGVtczogW10sIC8v5LiK5Lyg55qE5Zu+54mH5pWw57uEXG4gICAgICAgIHVwbG9hZGluZzogZmFsc2UgLy/mmK/lkKbmraPlnKjkuIrkvKBcbiAgICB9O1xuICAgIGV2ZW50cyA9IHsgXG4gICAgICAnaW5kZXgtYnJvYWRjYXN0JzogKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coYXJnc1swXSwgJ2FyZ3NbMF0nKVxuICAgICAgICBjb25zdCBpdGVtID0gYXJnc1swXVsxXVxuICAgICAgICB0aGlzLnVwbG9hZEl0ZW1zID0gW3tpbWFnZVVybDogaXRlbS5pbWcxLCB1cGxvYWRVcmw6IGl0ZW0uaW1nMSwgZmlsZTogaXRlbS5pbWcxLCB1cGxvYWRlZDogdHJ1ZX0sIHtpbWFnZVVybDogaXRlbS5pbWcyLCBmaWxlOiBpdGVtLmltZzIsIHVwbG9hZGVkOiB0cnVlLCB1cGxvYWRVcmw6IGl0ZW0uaW1nMn0sIHtpbWFnZVVybDogaXRlbS5pbWczLCBmaWxlOiBpdGVtLmltZzMsIHVwbG9hZGVkOiB0cnVlLCB1cGxvYWRVcmw6IGl0ZW0uaW1nM31dXG4gICAgICB9XG4gICAgfVxuICAgIG1ldGhvZHMgPSB7XG4gICAgICBkZWxJbWcoZSkge1xuICAgICAgICAgIHRoaXMudXBsb2FkSXRlbXMuc3BsaWNlKGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4LCAxKVxuICAgICAgICB9LFxuICAgICAgICBwcmV2aWV3KGV2ZW50KSB7XG4gICAgICAgICAgbGV0IGN1cnJlbnRVcmwgPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuc3JjXG4gICAgICAgICAgd3gucHJldmlld0ltYWdlKHtcbiAgICAgICAgICAgIGN1cnJlbnQ6IGN1cnJlbnRVcmwsIC8vIOW9k+WJjeaYvuekuuWbvueJh+eahGh0dHDpk77mjqVcbiAgICAgICAgICAgIHVybHM6IFtjdXJyZW50VXJsXSAvLyDpnIDopoHpooTop4jnmoTlm77niYdodHRw6ZO+5o6l5YiX6KGoXG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgY2hvb3NlSW1hZ2UoZSkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgd3guY2hvb3NlSW1hZ2Uoe1xuICAgICAgICAgICAgICAgIGNvdW50OiAzLFxuICAgICAgICAgICAgICAgIHNpemVUeXBlOiBbJ29yaWdpbmFsJywgJ2NvbXByZXNzZWQnXSxcbiAgICAgICAgICAgICAgICBzb3VyY2VUeXBlOiBbJ2FsYnVtJywgJ2NhbWVyYSddLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRlbXBGaWxlUGF0aOWPr+S7peS9nOS4umltZ+agh+etvueahHNyY+WxnuaAp+aYvuekuuWbvueJh1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZW1wRmlsZVBhdGhzID0gcmVzLnRlbXBGaWxlUGF0aHM7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGVtcEZpbGVQYXRocy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi51cGxvYWRJdGVtcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogc2VsZi51cGxvYWRJbmRleCsrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IHRlbXBGaWxlUGF0aHNbaV0sIC8v55So5LqO55u05o6l5pi+56S6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3M6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkZWQ6IGZhbHNlLCAvL+aYr+WQpuS4iuS8oOWujOaIkFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEVycm9yOiBmYWxzZSwgLy/kuIrkvKDlpLHotKVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcnIC8v5LiK5Lyg5ZCO55qEVVJMXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZWxmLnN0YXJ0VXBsb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmYWlsKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd1cGxvYWQgZmFpbGVkOicsIGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgcHJldmlld0ltYWdlKGUpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvL1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvL+WQr+WKqOS4iuS8oO+8jOS4gOS4quS4gOS4quS4iuS8oO+8jFxuICAgIHN0YXJ0VXBsb2FkKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmIChzZWxmLnVwbG9hZGluZykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3VwbG9hZGluZy4uLicpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciB1cGxvYWRJdGVtID0gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxmLnVwbG9hZEl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IHNlbGYudXBsb2FkSXRlbXNbaV07XG4gICAgICAgICAgICBpZiAoaXRlbS5wcm9ncmVzcyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgdXBsb2FkSXRlbSA9IGl0ZW07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVwbG9hZEl0ZW0gIT0gbnVsbCkge1xuICAgICAgICAgICAgc2VsZi51cGxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgc2VsZlxuICAgICAgICAgICAgICAgIC51cGxvYWRGaWxlKHVwbG9hZEl0ZW0sIGZ1bmN0aW9uKHVwbG9hZEl0ZW0pe1xuICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXBsb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0udXBsb2FkZWQgPSB0cnVlOyAvL+agh+iusOS4iuS8oOaIkOWKn1xuICAgICAgICAgICAgICAgICAgICAvL3VwbG9hZEl0ZW0uaW1hZ2VVcmwg5bCx5piv5LiK5Lyg5ZCO55qE5YC8XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc3RhcnRVcGxvYWQoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaChlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkSXRlbS51cGxvYWRFcnJvciA9IGUubWVzc2FnZTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51cGxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zdGFydFVwbG9hZCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICBcblxuICAgICAgICAgICAvKiog5paw55qEIGdlbmVyYXRvciDlhpnms5VcbiAgICAgICAgICAgIHRoaXMuYXBwXG4gICAgICAgICAgICAgICAgLnVwbG9hZEZpbGUodXBsb2FkSXRlbSwgZnVuY3Rpb24odXBsb2FkSXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXBsb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0udXBsb2FkZWQgPSB0cnVlOyAvL+agh+iusOS4iuS8oOaIkOWKn1xuICAgICAgICAgICAgICAgICAgICAvL3VwbG9hZEl0ZW0uaW1hZ2VVcmwg5bCx5piv5LiK5Lyg5ZCO55qE5YC8XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgICAgLy8gc2VsZi5zdGFydFVwbG9hZCgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLnVwbG9hZEVycm9yID0gZS5tZXNzYWdlO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnVwbG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgICAgIC8vIHNlbGYuc3RhcnRVcGxvYWQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAqL1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLSAg5LiO5LiK5Lyg5pyN5Yqh5Zmo6L+b6KGM5Lqk5LqSIC0tLS0tLS0tLS0tXG4gICAgLyog5Lyg57uf5qih5byPcHJvbWlzZSDlhpnms5UgKi9cbiAgICB1cGxvYWRGaWxlKHVwbG9hZEl0ZW0sIGxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgd3guc2hvd0xvYWRpbmcoe1xuICAgICAgICAgIHRpdGxlOiAn5LiK5Lyg5LitLi4uJ1xuICAgICAgICB9KVxuICAgICAgICBjb25zb2xlLmxvZygnc3RhcnRVcGxvYWQ6JywgdXBsb2FkSXRlbS5pbmRleCk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBzZWxmXG4gICAgICAgICAgICAgICAgLl9uZXdVcGxvYWQoKVxuICAgICAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbmV3VXBsb2FkOicsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLnVwbG9hZFRva2VuID0gZGF0YS50b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkSXRlbS51cGxvYWRVcmwgPSBkYXRhLnVwbG9hZFVybDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3VwbG9hZEZpbGUodXBsb2FkSXRlbSwgbGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl91cGxvYWRRdWVyeUNoZWNrKHVwbG9hZEl0ZW0sbGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl91cGxvYWRRdWVyeVJlc3VsdCh1cGxvYWRJdGVtKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+S4iuS8oOe7k+adnzonLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgLy/kuIrkvKDnu5PmnZ9cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmlsZXMgJiYgZGF0YS5maWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW1hZ2VVcmwgPSBkYXRhLmZpbGVzWzBdLmltYWdlc1swXS51cmw7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5LiK5Lyg57uT5p6cOicgKyBpbWFnZVVybCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLmltYWdlVXJsID0gaW1hZ2VVcmw7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHVwbG9hZEl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi4kZW1pdCgndG9QYXJlbnQyJywgc2VsZi51cGxvYWRJdGVtcylcbiAgICAgICAgICAgICAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+S4iuS8oOWksei0pTonLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvL1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy/ojrflvpfkuIDkuKrkuIrkvKDlnLDlnYBcbiAgICAvL2h0dHBzOi8vc3RhdGljc2VydmljZS5leHRyZW1ldmFsdWUuY24vdXBsb2FkLmh0bWw/YXBwSWQ9cWpkXG4gICAgX25ld1VwbG9hZCgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdmFyIHVwbG9hZFVybCA9IHd4LmdldFN0b3JhZ2VTeW5jKCd1cGxvYWRVcmwnKSArICd1cGxvYWQuZG8nO1xuICAgICAgICAgICAgd3gucmVxdWVzdCh7XG4gICAgICAgICAgICAgICAgdXJsOiB1cGxvYWRVcmwsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ3VwbG9hZCcsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbWFnZScsXG4gICAgICAgICAgICAgICAgICAgIGFwcElkOiB3eC5nZXRTdG9yYWdlU3luYygndXBsb2FkQXBwSWQnKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGpzb24gPSByZXMuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2pzb24xMTExMScsanNvbilcbiAgICAgICAgICAgICAgICAgICAgaWYgKGpzb24uY29kZSA9PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoanNvbi5tZXNzYWdlcy5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yID0ganNvbi5tZXNzYWdlcy5lcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5uYW1lID0gZXJyb3IuY29kZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmFpbChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogJ3VwbG9hZF9lcnJvcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiByZXMuZXJyTXNnXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICBlLm5hbWUgPSBlcnJvci5jb2RlO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvL+S4iuS8oOaWh+S7tueahOWFt+S9k1xuICAgIF91cGxvYWRGaWxlKHVwbG9hZEl0ZW0sIGxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHVwbG9hZFRhc2sgPSB3eC51cGxvYWRGaWxlKHtcbiAgICAgICAgICAgICAgICB1cmw6IHVwbG9hZEl0ZW0udXBsb2FkVXJsLFxuICAgICAgICAgICAgICAgIGZpbGVQYXRoOiB1cGxvYWRJdGVtLmZpbGUsXG4gICAgICAgICAgICAgICAgbmFtZTogJ2ZpbGUnLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzQ29kZSAhPSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiAndXBsb2FkX2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSFRUUOmUmeivrzonICsgcmVzLnN0YXR1c0NvZGVcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHVwbG9hZEl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmYWlsKHJlcykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiAndXBsb2FkX2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHJlcy5lcnJNc2dcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8v55uR5o6n5LiK5Lyg6L+b5bqmXG4gICAgICAgICAgICB1cGxvYWRUYXNrLm9uUHJvZ3Jlc3NVcGRhdGUocmVzID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLnByb2dyZXNzID0gcmVzLnByb2dyZXNzO1xuICAgICAgICAgICAgICAgICAgICBpZiAodXBsb2FkSXRlbS5wcm9ncmVzcyA+IDk5KSB7XG4gICAgICAgICAgICB1cGxvYWRJdGVtLnByb2dyZXNzID0gOTk7XG4gICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcihzZWxmLCB1cGxvYWRJdGVtKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICBcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5LiK5Lyg6L+b5bqmJywgcmVzLnByb2dyZXNzKTtcbiAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygn5bey57uP5LiK5Lyg55qE5pWw5o2u6ZW/5bqmJywgcmVzLnRvdGFsQnl0ZXNTZW50KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICAgICAgJ+mihOacn+mcgOimgeS4iuS8oOeahOaVsOaNruaAu+mVv+W6picsXG4gICAgICAgICAgICAgICAgICAgIHJlcy50b3RhbEJ5dGVzRXhwZWN0ZWRUb1NlbmRcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyDnoa7orqTmnI3liqHlmajlt7Lnu4/mlLbliLDmiYDmnInmlbDmja5cbiAgX3VwbG9hZFF1ZXJ5Q2hlY2sodXBsb2FkSXRlbSxsaXN0ZW5lcikge1xuICAgIHZhciB1cGxvYWRVcmwgPSB1cGxvYWRJdGVtLnVwbG9hZFVybDtcbiAgICBmdW5jdGlvbiBjaGVja0ZpbmlzaGVkKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgd3gucmVxdWVzdCh7XG4gICAgICAgIHVybDogdXBsb2FkVXJsLFxuICAgICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgdmFyIGRhdGEgPSByZXMuZGF0YTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImNoZWNrIHVwbG9hZCBmaW5pc2hlZDpcIiwgZGF0YSk7XG4gICAgICAgICAgaWYgKGRhdGEuc3RhdHVzID09PSAnZmluaXNoJykge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVyICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgdXBsb2FkSXRlbS5wcm9ncmVzcyA9IDEwMDtcbiAgICAgICAgICAgICAgbGlzdGVuZXIodXBsb2FkSXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgY2hlY2tGaW5pc2hlZChyZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmYWlsOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgdmFyIGVycm9yID0ge1xuICAgICAgICAgICAgY29kZTogJ3VwbG9hZF9lcnJvcicsXG4gICAgICAgICAgICBtZXNzYWdlOiByZXMuZXJyTXNnXG4gICAgICAgICAgfTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcInF1ZXJ5IHNlcnZlciBlcnJvcix3aWxsIHJldHJ5OlwiLCBlcnJvcik7XG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjaGVja0ZpbmlzaGVkKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNoZWNrRmluaXNoZWQocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICB9KTtcbiAgfVxuICBfdXBsb2FkUXVlcnlSZXN1bHQodXBsb2FkSXRlbSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdmFyIHVwbG9hZFVybCA9IHd4LmdldFN0b3JhZ2VTeW5jKCd1cGxvYWRVcmwnKSArICd1cGxvYWQuZG8nO1xuICAgICAgd3gucmVxdWVzdCh7XG4gICAgICAgIHVybDogdXBsb2FkVXJsLFxuICAgICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgYWN0aW9uOiAncXVlcnknLFxuICAgICAgICAgIHRva2VuOiB1cGxvYWRJdGVtLnVwbG9hZFRva2VuXG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICB2YXIganNvbiA9IHJlcy5kYXRhO1xuICAgICAgICAgIGlmIChqc29uLmNvZGUgPT09IDIwMCkge1xuICAgICAgICAgICAgcmVzb2x2ZShqc29uLm1lc3NhZ2VzLmRhdGEpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBlcnJvciA9IGpzb24ubWVzc2FnZXMuZXJyb3I7XG4gICAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XG4gICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmYWlsOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgdmFyIGVycm9yID0ge1xuICAgICAgICAgICAgY29kZTogJ3VwbG9hZF9lcnJvcicsXG4gICAgICAgICAgICBtZXNzYWdlOiByZXMuZXJyTXNnXG4gICAgICAgICAgfTtcbiAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICBlLm5hbWUgPSBlcnJvci5jb2RlO1xuICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==