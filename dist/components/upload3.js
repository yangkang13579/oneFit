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
                    // 上传结束
                    if (data.files && data.files.length > 0) {
                        var imageUrl = data.files[0].images[0].url;
                        console.log('上传结果:' + imageUrl);
                        uploadItem.imageUrl = imageUrl;
                        resolve(uploadItem);
                        self.$emit('toParent3', self.uploadItems);
                        wx.hideLoading();
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
        uploadIndex: 0, // 上传的编号
        imgUpload: '../images/btn_add_img.png',
        uploadItems: [], // 上传的图片数组
        uploading: false // 是否正在上传
    };
    this.events = {
        'index-broadcast': function indexBroadcast() {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            console.log(args[0], 'args[0]');
            var item = args[0][2];
            _this2.uploadItems = [{ imageUrl: item.img1, uploadUrl: item.img1, file: item.img1, uploaded: true }, { imageUrl: item.img2, file: item.img2, uploaded: true, uploadUrl: item.img2 }, { imageUrl: item.img3, file: item.img3, uploaded: true, uploadUrl: item.img3 }];
        }
    };
    this.methods = {
        delImg: function delImg(e) {
            this.uploadItems.splice(e.currentTarget.dataset.index, 1);
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
        preview: function preview(event) {
            var currentUrl = event.currentTarget.dataset.src;
            wx.previewImage({
                current: currentUrl, // 当前显示图片的http链接
                urls: [currentUrl] // 需要预览的图片http链接列表
            });
        }
    };
};

exports.default = Upload;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVwbG9hZDMuanMiXSwibmFtZXMiOlsiVXBsb2FkIiwic2VsZiIsInVwbG9hZGluZyIsImNvbnNvbGUiLCJsb2ciLCJ1cGxvYWRJdGVtIiwiaSIsInVwbG9hZEl0ZW1zIiwibGVuZ3RoIiwiaXRlbSIsInByb2dyZXNzIiwidXBsb2FkRmlsZSIsIiRhcHBseSIsInRoZW4iLCJ1cGxvYWRlZCIsInN0YXJ0VXBsb2FkIiwiY2F0Y2giLCJ1cGxvYWRFcnJvciIsImUiLCJtZXNzYWdlIiwibGlzdGVuZXIiLCJ3eCIsInNob3dMb2FkaW5nIiwidGl0bGUiLCJpbmRleCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiX25ld1VwbG9hZCIsImRhdGEiLCJ1cGxvYWRUb2tlbiIsInRva2VuIiwidXBsb2FkVXJsIiwiX3VwbG9hZEZpbGUiLCJfdXBsb2FkUXVlcnlDaGVjayIsIl91cGxvYWRRdWVyeVJlc3VsdCIsImZpbGVzIiwiaW1hZ2VVcmwiLCJpbWFnZXMiLCJ1cmwiLCIkZW1pdCIsImhpZGVMb2FkaW5nIiwiZXJyb3IiLCJnZXRTdG9yYWdlU3luYyIsInJlcXVlc3QiLCJtZXRob2QiLCJhY3Rpb24iLCJ0eXBlIiwiYXBwSWQiLCJzdWNjZXNzIiwicmVzIiwianNvbiIsImNvZGUiLCJtZXNzYWdlcyIsIkVycm9yIiwibmFtZSIsImZhaWwiLCJlcnJNc2ciLCJ1cGxvYWRUYXNrIiwiZmlsZVBhdGgiLCJmaWxlIiwic3RhdHVzQ29kZSIsIm9uUHJvZ3Jlc3NVcGRhdGUiLCJ0b3RhbEJ5dGVzRXhwZWN0ZWRUb1NlbmQiLCJjaGVja0ZpbmlzaGVkIiwic3RhdHVzIiwic2V0VGltZW91dCIsIndlcHkiLCJwYWdlIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm1peGlucyIsIlBhZ2VNaXhpbiIsInVwbG9hZEluZGV4IiwiaW1nVXBsb2FkIiwiZXZlbnRzIiwiYXJncyIsImltZzEiLCJpbWcyIiwiaW1nMyIsIm1ldGhvZHMiLCJkZWxJbWciLCJzcGxpY2UiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YXNldCIsImNob29zZUltYWdlIiwiY291bnQiLCJzaXplVHlwZSIsInNvdXJjZVR5cGUiLCJ0ZW1wRmlsZVBhdGhzIiwicHVzaCIsInByZXZpZXciLCJldmVudCIsImN1cnJlbnRVcmwiLCJzcmMiLCJwcmV2aWV3SW1hZ2UiLCJjdXJyZW50IiwidXJscyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7OztBQUZBOzs7SUFHcUJBLE07Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeURqQjtzQ0FDYztBQUNWLGdCQUFJQyxPQUFPLElBQVg7QUFDQSxnQkFBSUEsS0FBS0MsU0FBVCxFQUFvQjtBQUNoQkMsd0JBQVFDLEdBQVIsQ0FBWSxjQUFaO0FBQ0E7QUFDSDtBQUNELGdCQUFJQyxhQUFhLElBQWpCO0FBQ0EsaUJBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJTCxLQUFLTSxXQUFMLENBQWlCQyxNQUFyQyxFQUE2Q0YsR0FBN0MsRUFBa0Q7QUFDOUMsb0JBQUlHLE9BQU9SLEtBQUtNLFdBQUwsQ0FBaUJELENBQWpCLENBQVg7QUFDQSxvQkFBSUcsS0FBS0MsUUFBTCxJQUFpQixDQUFyQixFQUF3QjtBQUNwQkwsaUNBQWFJLElBQWI7QUFDQTtBQUNIO0FBQ0o7QUFDRCxnQkFBSUosY0FBYyxJQUFsQixFQUF3QjtBQUNwQkoscUJBQUtDLFNBQUwsR0FBaUIsSUFBakI7QUFDQUQscUJBQ0tVLFVBREwsQ0FDZ0JOLFVBRGhCLEVBQzRCLFVBQVNBLFVBQVQsRUFBcUI7QUFDekNKLHlCQUFLVyxNQUFMO0FBQ0gsaUJBSEwsRUFJS0MsSUFKTCxDQUlVLGdCQUFRO0FBQ1ZaLHlCQUFLQyxTQUFMLEdBQWlCLEtBQWpCO0FBQ0FHLCtCQUFXUyxRQUFYLEdBQXNCLElBQXRCLENBRlUsQ0FFa0I7QUFDNUI7QUFDQWIseUJBQUtXLE1BQUw7QUFDQVgseUJBQUtjLFdBQUw7QUFDSCxpQkFWTCxFQVdLQyxLQVhMLENBV1csYUFBSztBQUNSWCwrQkFBV1ksV0FBWCxHQUF5QkMsRUFBRUMsT0FBM0I7QUFDQWxCLHlCQUFLQyxTQUFMLEdBQWlCLEtBQWpCO0FBQ0FELHlCQUFLVyxNQUFMO0FBQ0FYLHlCQUFLYyxXQUFMO0FBQ0gsaUJBaEJMOztBQWtCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CSDtBQUNKO0FBQ0Q7QUFDQTs7OzttQ0FDV1YsVSxFQUFZZSxRLEVBQVU7QUFDN0IsZ0JBQUluQixPQUFPLElBQVg7QUFDQW9CLGVBQUdDLFdBQUgsQ0FBZTtBQUNYQyx1QkFBTztBQURJLGFBQWY7QUFHQXBCLG9CQUFRQyxHQUFSLENBQVksY0FBWixFQUE0QkMsV0FBV21CLEtBQXZDO0FBQ0EsbUJBQU8sSUFBSUMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUNwQzFCLHFCQUNLMkIsVUFETCxHQUVLZixJQUZMLENBRVUsZ0JBQVE7QUFDVlYsNEJBQVFDLEdBQVIsQ0FBWSxZQUFaLEVBQTBCeUIsSUFBMUI7QUFDQXhCLCtCQUFXeUIsV0FBWCxHQUF5QkQsS0FBS0UsS0FBOUI7QUFDQTFCLCtCQUFXMkIsU0FBWCxHQUF1QkgsS0FBS0csU0FBNUI7QUFDQSwyQkFBTy9CLEtBQUtnQyxXQUFMLENBQWlCNUIsVUFBakIsRUFBNkJlLFFBQTdCLENBQVA7QUFDSCxpQkFQTCxFQVFLUCxJQVJMLENBUVUsZ0JBQVE7QUFDViwyQkFBT1osS0FBS2lDLGlCQUFMLENBQXVCN0IsVUFBdkIsRUFBbUNlLFFBQW5DLENBQVA7QUFDSCxpQkFWTCxFQVdLUCxJQVhMLENBV1UsZ0JBQVE7QUFDViwyQkFBT1osS0FBS2tDLGtCQUFMLENBQXdCOUIsVUFBeEIsQ0FBUDtBQUNILGlCQWJMLEVBY0tRLElBZEwsQ0FjVSxnQkFBUTtBQUNWViw0QkFBUUMsR0FBUixDQUFZLE9BQVosRUFBcUJ5QixJQUFyQjtBQUNBO0FBQ0Esd0JBQUlBLEtBQUtPLEtBQUwsSUFBY1AsS0FBS08sS0FBTCxDQUFXNUIsTUFBWCxHQUFvQixDQUF0QyxFQUF5QztBQUNyQyw0QkFBSTZCLFdBQVdSLEtBQUtPLEtBQUwsQ0FBVyxDQUFYLEVBQWNFLE1BQWQsQ0FBcUIsQ0FBckIsRUFBd0JDLEdBQXZDO0FBQ0FwQyxnQ0FBUUMsR0FBUixDQUFZLFVBQVVpQyxRQUF0QjtBQUNBaEMsbUNBQVdnQyxRQUFYLEdBQXNCQSxRQUF0QjtBQUNBWCxnQ0FBUXJCLFVBQVI7QUFDQUosNkJBQUt1QyxLQUFMLENBQVcsV0FBWCxFQUF3QnZDLEtBQUtNLFdBQTdCO0FBQ0FjLDJCQUFHb0IsV0FBSDtBQUNIO0FBQ0osaUJBekJMLEVBMEJLekIsS0ExQkwsQ0EwQlcsaUJBQVM7QUFDWmIsNEJBQVFDLEdBQVIsQ0FBWSxPQUFaLEVBQXFCc0MsS0FBckI7QUFDSCxpQkE1Qkw7QUE2QkE7QUFDSCxhQS9CTSxDQUFQO0FBZ0NIO0FBQ0Q7QUFDQTs7OztxQ0FDYTtBQUNULGdCQUFJekMsT0FBTyxJQUFYO0FBQ0EsbUJBQU8sSUFBSXdCLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDcEMsb0JBQUlLLFlBQVlYLEdBQUdzQixjQUFILENBQWtCLFdBQWxCLElBQWlDLFdBQWpEO0FBQ0F0QixtQkFBR3VCLE9BQUgsQ0FBVztBQUNQTCx5QkFBS1AsU0FERTtBQUVQYSw0QkFBUSxLQUZEO0FBR1BoQiwwQkFBTTtBQUNGaUIsZ0NBQVEsUUFETjtBQUVGQyw4QkFBTSxPQUZKO0FBR0ZDLCtCQUFPM0IsR0FBR3NCLGNBQUgsQ0FBa0IsYUFBbEI7QUFITCxxQkFIQztBQVFQTSwyQkFSTyxtQkFRQ0MsR0FSRCxFQVFNO0FBQ1QsNEJBQUlDLE9BQU9ELElBQUlyQixJQUFmO0FBQ0ExQixnQ0FBUUMsR0FBUixDQUFZLFdBQVosRUFBeUIrQyxJQUF6QjtBQUNBLDRCQUFJQSxLQUFLQyxJQUFMLElBQWEsR0FBakIsRUFBc0I7QUFDbEIxQixvQ0FBUXlCLEtBQUtFLFFBQUwsQ0FBY3hCLElBQXRCO0FBQ0gseUJBRkQsTUFFTztBQUNILGdDQUFNYSxRQUFRUyxLQUFLRSxRQUFMLENBQWNYLEtBQTVCO0FBQ0EsZ0NBQUl4QixJQUFJLElBQUlvQyxLQUFKLENBQVVaLE1BQU12QixPQUFoQixDQUFSO0FBQ0FELDhCQUFFcUMsSUFBRixHQUFTYixNQUFNVSxJQUFmO0FBQ0F6QixtQ0FBT1QsQ0FBUDtBQUNIO0FBQ0oscUJBbkJNO0FBb0JQc0Msd0JBcEJPLGdCQW9CRk4sR0FwQkUsRUFvQkc7QUFDTiw0QkFBSVIsUUFBUTtBQUNSVSxrQ0FBTSxjQURFO0FBRVJqQyxxQ0FBUytCLElBQUlPO0FBRkwseUJBQVo7QUFJQSw0QkFBSXZDLElBQUksSUFBSW9DLEtBQUosQ0FBVVosTUFBTXZCLE9BQWhCLENBQVI7QUFDQUQsMEJBQUVxQyxJQUFGLEdBQVNiLE1BQU1VLElBQWY7QUFDQXpCLCtCQUFPVCxDQUFQO0FBQ0g7QUE1Qk0saUJBQVg7QUE4QkgsYUFoQ00sQ0FBUDtBQWlDSDtBQUNEOzs7O29DQUNZYixVLEVBQVllLFEsRUFBVTtBQUM5QixnQkFBSW5CLE9BQU8sSUFBWDtBQUNBLG1CQUFPLElBQUl3QixPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3BDLG9CQUFNK0IsYUFBYXJDLEdBQUdWLFVBQUgsQ0FBYztBQUM3QjRCLHlCQUFLbEMsV0FBVzJCLFNBRGE7QUFFN0IyQiw4QkFBVXRELFdBQVd1RCxJQUZRO0FBRzdCTCwwQkFBTSxNQUh1QjtBQUk3Qk4sMkJBSjZCLG1CQUlyQkMsR0FKcUIsRUFJaEI7QUFDVCw0QkFBSUEsSUFBSVcsVUFBSixJQUFrQixHQUF0QixFQUEyQjtBQUN2QixnQ0FBSW5CLFFBQVE7QUFDUlUsc0NBQU0sY0FERTtBQUVSakMseUNBQVMsWUFBWStCLElBQUlXO0FBRmpCLDZCQUFaO0FBSUEsZ0NBQUkzQyxJQUFJLElBQUlvQyxLQUFKLENBQVVaLE1BQU12QixPQUFoQixDQUFSO0FBQ0FELDhCQUFFcUMsSUFBRixHQUFTYixNQUFNVSxJQUFmO0FBQ0F6QixtQ0FBT1QsQ0FBUDtBQUNILHlCQVJELE1BUU87QUFDSFEsb0NBQVFyQixVQUFSO0FBQ0g7QUFDSixxQkFoQjRCO0FBaUI3Qm1ELHdCQWpCNkIsZ0JBaUJ4Qk4sR0FqQndCLEVBaUJuQjtBQUNOLDRCQUFJUixRQUFRO0FBQ1JVLGtDQUFNLGNBREU7QUFFUmpDLHFDQUFTK0IsSUFBSU87QUFGTCx5QkFBWjtBQUlBLDRCQUFJdkMsSUFBSSxJQUFJb0MsS0FBSixDQUFVWixNQUFNdkIsT0FBaEIsQ0FBUjtBQUNBRCwwQkFBRXFDLElBQUYsR0FBU2IsTUFBTVUsSUFBZjtBQUNBekIsK0JBQU9ULENBQVA7QUFDSDtBQXpCNEIsaUJBQWQsQ0FBbkI7QUEyQkE7QUFDQXdDLDJCQUFXSSxnQkFBWCxDQUE0QixlQUFPO0FBQy9CLHdCQUFJMUMsWUFBWSxJQUFoQixFQUFzQjtBQUNsQmYsbUNBQVdLLFFBQVgsR0FBc0J3QyxJQUFJeEMsUUFBMUI7QUFDQSw0QkFBSUwsV0FBV0ssUUFBWCxHQUFzQixFQUExQixFQUE4QjtBQUMxQkwsdUNBQVdLLFFBQVgsR0FBc0IsRUFBdEI7QUFDSDtBQUNEVSxpQ0FBU25CLElBQVQsRUFBZUksVUFBZjtBQUNIOztBQUVERiw0QkFBUUMsR0FBUixDQUFZLE1BQVosRUFBb0I4QyxJQUFJeEMsUUFBeEI7O0FBRUE7QUFDQVAsNEJBQVFDLEdBQVIsQ0FDSSxjQURKLEVBRUk4QyxJQUFJYSx3QkFGUjtBQUtILGlCQWpCRDtBQWtCSCxhQS9DTSxDQUFQO0FBZ0RIO0FBQ0Q7Ozs7MENBQ2tCMUQsVSxFQUFZZSxRLEVBQVU7QUFDcEMsZ0JBQUlZLFlBQVkzQixXQUFXMkIsU0FBM0I7QUFDQSxxQkFBU2dDLGFBQVQsQ0FBdUJ0QyxPQUF2QixFQUFnQ0MsTUFBaEMsRUFBd0M7QUFDcENOLG1CQUFHdUIsT0FBSCxDQUFXO0FBQ1BMLHlCQUFLUCxTQURFO0FBRVBhLDRCQUFRLEtBRkQ7QUFHUEksNkJBQVMsaUJBQVVDLEdBQVYsRUFBZTtBQUNwQiw0QkFBSXJCLE9BQU9xQixJQUFJckIsSUFBZjtBQUNBMUIsZ0NBQVFDLEdBQVIsQ0FBWSx3QkFBWixFQUFzQ3lCLElBQXRDO0FBQ0EsNEJBQUlBLEtBQUtvQyxNQUFMLEtBQWdCLFFBQXBCLEVBQThCO0FBQzFCLGdDQUFJN0MsWUFBWSxJQUFoQixFQUFzQjtBQUNsQmYsMkNBQVdLLFFBQVgsR0FBc0IsR0FBdEI7QUFDQVUseUNBQVNmLFVBQVQ7QUFDSDtBQUNEcUIsb0NBQVFHLElBQVI7QUFDSCx5QkFORCxNQU1PO0FBQ0hxQyx1Q0FBVyxZQUFZO0FBQ25CRiw4Q0FBY3RDLE9BQWQsRUFBdUJDLE1BQXZCO0FBQ0gsNkJBRkQsRUFFRyxJQUZIO0FBR0g7QUFDSixxQkFqQk07QUFrQlA2QiwwQkFBTSxjQUFVTixHQUFWLEVBQWU7QUFDakIsNEJBQUlSLFFBQVE7QUFDUlUsa0NBQU0sY0FERTtBQUVSakMscUNBQVMrQixJQUFJTztBQUZMLHlCQUFaO0FBSUF0RCxnQ0FBUUMsR0FBUixDQUFZLGdDQUFaLEVBQThDc0MsS0FBOUM7QUFDQXdCLG1DQUFXLFlBQVk7QUFDbkJGLDBDQUFjdEMsT0FBZCxFQUF1QkMsTUFBdkI7QUFDSCx5QkFGRCxFQUVHLElBRkg7QUFHSDtBQTNCTSxpQkFBWDtBQTZCSDtBQUNELG1CQUFPLElBQUlGLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDcENxQyw4QkFBY3RDLE9BQWQsRUFBdUJDLE1BQXZCO0FBQ0gsYUFGTSxDQUFQO0FBR0g7OzsyQ0FDa0J0QixVLEVBQVk7QUFDM0IsZ0JBQUlKLE9BQU8sSUFBWDtBQUNBLG1CQUFPLElBQUl3QixPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3BDLG9CQUFJSyxZQUFZWCxHQUFHc0IsY0FBSCxDQUFrQixXQUFsQixJQUFpQyxXQUFqRDtBQUNBdEIsbUJBQUd1QixPQUFILENBQVc7QUFDUEwseUJBQUtQLFNBREU7QUFFUGEsNEJBQVEsS0FGRDtBQUdQaEIsMEJBQU07QUFDRmlCLGdDQUFRLE9BRE47QUFFRmYsK0JBQU8xQixXQUFXeUI7QUFGaEIscUJBSEM7QUFPUG1CLDZCQUFTLGlCQUFVQyxHQUFWLEVBQWU7QUFDcEIsNEJBQUlDLE9BQU9ELElBQUlyQixJQUFmO0FBQ0EsNEJBQUlzQixLQUFLQyxJQUFMLEtBQWMsR0FBbEIsRUFBdUI7QUFDbkIxQixvQ0FBUXlCLEtBQUtFLFFBQUwsQ0FBY3hCLElBQXRCO0FBQ0gseUJBRkQsTUFFTztBQUNILGdDQUFNYSxRQUFRUyxLQUFLRSxRQUFMLENBQWNYLEtBQTVCO0FBQ0EsZ0NBQUl4QixJQUFJLElBQUlvQyxLQUFKLENBQVVaLE1BQU12QixPQUFoQixDQUFSO0FBQ0FELDhCQUFFcUMsSUFBRixHQUFTYixNQUFNVSxJQUFmO0FBQ0F6QixtQ0FBT1QsQ0FBUDtBQUNIO0FBQ0oscUJBakJNO0FBa0JQc0MsMEJBQU0sY0FBVU4sR0FBVixFQUFlO0FBQ2pCLDRCQUFJUixRQUFRO0FBQ1JVLGtDQUFNLGNBREU7QUFFUmpDLHFDQUFTK0IsSUFBSU87QUFGTCx5QkFBWjtBQUlBLDRCQUFJdkMsSUFBSSxJQUFJb0MsS0FBSixDQUFVWixNQUFNdkIsT0FBaEIsQ0FBUjtBQUNBRCwwQkFBRXFDLElBQUYsR0FBU2IsTUFBTVUsSUFBZjtBQUNBekIsK0JBQU9ULENBQVA7QUFDSDtBQTFCTSxpQkFBWDtBQTRCSCxhQTlCTSxDQUFQO0FBK0JIOzs7O0VBM1QrQmlELGVBQUtDLEk7Ozs7O1NBQ3JDQyxNLEdBQVM7QUFDTEMsZ0NBQXdCO0FBRG5CLEs7U0FHVEMsTSxHQUFTLENBQUNDLGNBQUQsQztTQUNUM0MsSSxHQUFPO0FBQ0g0QyxxQkFBYSxDQURWLEVBQ2E7QUFDaEJDLG1CQUFXLDJCQUZSO0FBR0huRSxxQkFBYSxFQUhWLEVBR2M7QUFDakJMLG1CQUFXLEtBSlIsQ0FJYztBQUpkLEs7U0FNUHlFLE0sR0FBUztBQUNMLDJCQUFtQiwwQkFBYTtBQUFBLCtDQUFUQyxJQUFTO0FBQVRBLG9CQUFTO0FBQUE7O0FBQzVCekUsb0JBQVFDLEdBQVIsQ0FBWXdFLEtBQUssQ0FBTCxDQUFaLEVBQXFCLFNBQXJCO0FBQ0EsZ0JBQU1uRSxPQUFPbUUsS0FBSyxDQUFMLEVBQVEsQ0FBUixDQUFiO0FBQ0EsbUJBQUtyRSxXQUFMLEdBQW1CLENBQUMsRUFBQzhCLFVBQVU1QixLQUFLb0UsSUFBaEIsRUFBc0I3QyxXQUFXdkIsS0FBS29FLElBQXRDLEVBQTRDakIsTUFBTW5ELEtBQUtvRSxJQUF2RCxFQUE2RC9ELFVBQVUsSUFBdkUsRUFBRCxFQUErRSxFQUFDdUIsVUFBVTVCLEtBQUtxRSxJQUFoQixFQUFzQmxCLE1BQU1uRCxLQUFLcUUsSUFBakMsRUFBdUNoRSxVQUFVLElBQWpELEVBQXVEa0IsV0FBV3ZCLEtBQUtxRSxJQUF2RSxFQUEvRSxFQUE2SixFQUFDekMsVUFBVTVCLEtBQUtzRSxJQUFoQixFQUFzQm5CLE1BQU1uRCxLQUFLc0UsSUFBakMsRUFBdUNqRSxVQUFVLElBQWpELEVBQXVEa0IsV0FBV3ZCLEtBQUtzRSxJQUF2RSxFQUE3SixDQUFuQjtBQUNIO0FBTEksSztTQU9UQyxPLEdBQVU7QUFDTkMsY0FETSxrQkFDQy9ELENBREQsRUFDSTtBQUNOLGlCQUFLWCxXQUFMLENBQWlCMkUsTUFBakIsQ0FBd0JoRSxFQUFFaUUsYUFBRixDQUFnQkMsT0FBaEIsQ0FBd0I1RCxLQUFoRCxFQUF1RCxDQUF2RDtBQUNILFNBSEs7QUFJTjZELG1CQUpNLHVCQUlNbkUsQ0FKTixFQUlTO0FBQ1gsZ0JBQUlqQixPQUFPLElBQVg7QUFDQW9CLGVBQUdnRSxXQUFILENBQWU7QUFDWEMsdUJBQU8sQ0FESTtBQUVYQywwQkFBVSxDQUFDLFVBQUQsRUFBYSxZQUFiLENBRkM7QUFHWEMsNEJBQVksQ0FBQyxPQUFELEVBQVUsUUFBVixDQUhEO0FBSVh2Qyx1QkFKVyxtQkFJSEMsR0FKRyxFQUlFO0FBQ1Q7QUFDQSx3QkFBTXVDLGdCQUFnQnZDLElBQUl1QyxhQUExQjtBQUNBLHlCQUFLLElBQUluRixJQUFJLENBQWIsRUFBZ0JBLElBQUltRixjQUFjakYsTUFBbEMsRUFBMENGLEdBQTFDLEVBQStDO0FBQzNDTCw2QkFBS00sV0FBTCxDQUFpQm1GLElBQWpCLENBQXNCO0FBQ2xCbEUsbUNBQU92QixLQUFLd0UsV0FBTCxFQURXO0FBRWxCYixrQ0FBTTZCLGNBQWNuRixDQUFkLENBRlksRUFFTTtBQUN4Qkksc0NBQVUsQ0FIUTtBQUlsQkksc0NBQVUsS0FKUSxFQUlEO0FBQ2pCRyx5Q0FBYSxLQUxLLEVBS0U7QUFDcEJzQixpQ0FBSyxFQU5hLENBTVY7QUFOVSx5QkFBdEI7QUFRSDtBQUNEdEMseUJBQUtjLFdBQUw7QUFDQWQseUJBQUtXLE1BQUw7QUFDSCxpQkFuQlU7QUFvQlg0QyxvQkFwQlcsZ0JBb0JOZCxLQXBCTSxFQW9CQztBQUNSdkMsNEJBQVFDLEdBQVIsQ0FBWSxnQkFBWixFQUE4QnNDLEtBQTlCO0FBQ0g7QUF0QlUsYUFBZjtBQXdCSCxTQTlCSztBQStCTmlELGVBL0JNLG1CQStCRUMsS0EvQkYsRUErQlM7QUFDWCxnQkFBSUMsYUFBYUQsTUFBTVQsYUFBTixDQUFvQkMsT0FBcEIsQ0FBNEJVLEdBQTdDO0FBQ0F6RSxlQUFHMEUsWUFBSCxDQUFnQjtBQUNaQyx5QkFBU0gsVUFERyxFQUNTO0FBQ3JCSSxzQkFBTSxDQUFDSixVQUFELENBRk0sQ0FFTztBQUZQLGFBQWhCO0FBSUg7QUFyQ0ssSzs7O2tCQWxCTzdGLE0iLCJmaWxlIjoidXBsb2FkMy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKiBnbG9iYWwgd3ggKi9cclxuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XHJcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vbWl4aW5zL3BhZ2UnO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVcGxvYWQgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gICAgY29uZmlnID0ge1xyXG4gICAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfmtYvor5XkuIrkvKDlm77niYcnXHJcbiAgICB9O1xyXG4gICAgbWl4aW5zID0gW1BhZ2VNaXhpbl07XHJcbiAgICBkYXRhID0ge1xyXG4gICAgICAgIHVwbG9hZEluZGV4OiAwLCAvLyDkuIrkvKDnmoTnvJblj7dcclxuICAgICAgICBpbWdVcGxvYWQ6ICcuLi9pbWFnZXMvYnRuX2FkZF9pbWcucG5nJyxcclxuICAgICAgICB1cGxvYWRJdGVtczogW10sIC8vIOS4iuS8oOeahOWbvueJh+aVsOe7hFxyXG4gICAgICAgIHVwbG9hZGluZzogZmFsc2UgLy8g5piv5ZCm5q2j5Zyo5LiK5LygXHJcbiAgICB9O1xyXG4gICAgZXZlbnRzID0ge1xyXG4gICAgICAgICdpbmRleC1icm9hZGNhc3QnOiAoLi4uYXJncykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhhcmdzWzBdLCAnYXJnc1swXScpO1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtID0gYXJnc1swXVsyXTtcclxuICAgICAgICAgICAgdGhpcy51cGxvYWRJdGVtcyA9IFt7aW1hZ2VVcmw6IGl0ZW0uaW1nMSwgdXBsb2FkVXJsOiBpdGVtLmltZzEsIGZpbGU6IGl0ZW0uaW1nMSwgdXBsb2FkZWQ6IHRydWV9LCB7aW1hZ2VVcmw6IGl0ZW0uaW1nMiwgZmlsZTogaXRlbS5pbWcyLCB1cGxvYWRlZDogdHJ1ZSwgdXBsb2FkVXJsOiBpdGVtLmltZzJ9LCB7aW1hZ2VVcmw6IGl0ZW0uaW1nMywgZmlsZTogaXRlbS5pbWczLCB1cGxvYWRlZDogdHJ1ZSwgdXBsb2FkVXJsOiBpdGVtLmltZzN9XTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBtZXRob2RzID0ge1xyXG4gICAgICAgIGRlbEltZyhlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBsb2FkSXRlbXMuc3BsaWNlKGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4LCAxKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNob29zZUltYWdlKGUpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB3eC5jaG9vc2VJbWFnZSh7XHJcbiAgICAgICAgICAgICAgICBjb3VudDogMyxcclxuICAgICAgICAgICAgICAgIHNpemVUeXBlOiBbJ29yaWdpbmFsJywgJ2NvbXByZXNzZWQnXSxcclxuICAgICAgICAgICAgICAgIHNvdXJjZVR5cGU6IFsnYWxidW0nLCAnY2FtZXJhJ10sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRlbXBGaWxlUGF0aOWPr+S7peS9nOS4umltZ+agh+etvueahHNyY+WxnuaAp+aYvuekuuWbvueJh1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBGaWxlUGF0aHMgPSByZXMudGVtcEZpbGVQYXRocztcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRlbXBGaWxlUGF0aHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi51cGxvYWRJdGVtcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiBzZWxmLnVwbG9hZEluZGV4KyssXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiB0ZW1wRmlsZVBhdGhzW2ldLCAvLyDnlKjkuo7nm7TmjqXmmL7npLpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkZWQ6IGZhbHNlLCAvLyDmmK/lkKbkuIrkvKDlrozmiJBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEVycm9yOiBmYWxzZSwgLy8g5LiK5Lyg5aSx6LSlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcnIC8vIOS4iuS8oOWQjueahFVSTFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zdGFydFVwbG9hZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZmFpbChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd1cGxvYWQgZmFpbGVkOicsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBwcmV2aWV3KGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50VXJsID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LnNyYztcclxuICAgICAgICAgICAgd3gucHJldmlld0ltYWdlKHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQ6IGN1cnJlbnRVcmwsIC8vIOW9k+WJjeaYvuekuuWbvueJh+eahGh0dHDpk77mjqVcclxuICAgICAgICAgICAgICAgIHVybHM6IFtjdXJyZW50VXJsXSAvLyDpnIDopoHpooTop4jnmoTlm77niYdodHRw6ZO+5o6l5YiX6KGoXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvLyDlkK/liqjkuIrkvKDvvIzkuIDkuKrkuIDkuKrkuIrkvKDvvIxcclxuICAgIHN0YXJ0VXBsb2FkKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBpZiAoc2VsZi51cGxvYWRpbmcpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3VwbG9hZGluZy4uLicpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciB1cGxvYWRJdGVtID0gbnVsbDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGYudXBsb2FkSXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBzZWxmLnVwbG9hZEl0ZW1zW2ldO1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5wcm9ncmVzcyA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB1cGxvYWRJdGVtID0gaXRlbTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh1cGxvYWRJdGVtICE9IG51bGwpIHtcclxuICAgICAgICAgICAgc2VsZi51cGxvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICBzZWxmXHJcbiAgICAgICAgICAgICAgICAudXBsb2FkRmlsZSh1cGxvYWRJdGVtLCBmdW5jdGlvbih1cGxvYWRJdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnVwbG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0udXBsb2FkZWQgPSB0cnVlOyAvLyDmoIforrDkuIrkvKDmiJDlip9cclxuICAgICAgICAgICAgICAgICAgICAvLyB1cGxvYWRJdGVtLmltYWdlVXJsIOWwseaYr+S4iuS8oOWQjueahOWAvFxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zdGFydFVwbG9hZCgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLnVwbG9hZEVycm9yID0gZS5tZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXBsb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnN0YXJ0VXBsb2FkKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8qKiDmlrDnmoQgZ2VuZXJhdG9yIOWGmeazlVxyXG4gICAgICAgICAgICB0aGlzLmFwcFxyXG4gICAgICAgICAgICAgICAgLnVwbG9hZEZpbGUodXBsb2FkSXRlbSwgZnVuY3Rpb24odXBsb2FkSXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51cGxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLnVwbG9hZGVkID0gdHJ1ZTsgLy/moIforrDkuIrkvKDmiJDlip9cclxuICAgICAgICAgICAgICAgICAgICAvL3VwbG9hZEl0ZW0uaW1hZ2VVcmwg5bCx5piv5LiK5Lyg5ZCO55qE5YC8XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgICAgIC8vIHNlbGYuc3RhcnRVcGxvYWQoKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkSXRlbS51cGxvYWRFcnJvciA9IGUubWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnVwbG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAvLyBzZWxmLnN0YXJ0VXBsb2FkKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLSAg5LiO5LiK5Lyg5pyN5Yqh5Zmo6L+b6KGM5Lqk5LqSIC0tLS0tLS0tLS0tXHJcbiAgICAvKiDkvKDnu5/mqKHlvI9wcm9taXNlIOWGmeazlSAqL1xyXG4gICAgdXBsb2FkRmlsZSh1cGxvYWRJdGVtLCBsaXN0ZW5lcikge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB3eC5zaG93TG9hZGluZyh7XHJcbiAgICAgICAgICAgIHRpdGxlOiAn5LiK5Lyg5LitLi4uJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdzdGFydFVwbG9hZDonLCB1cGxvYWRJdGVtLmluZGV4KTtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBzZWxmXHJcbiAgICAgICAgICAgICAgICAuX25ld1VwbG9hZCgpXHJcbiAgICAgICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbmV3VXBsb2FkOicsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0udXBsb2FkVG9rZW4gPSBkYXRhLnRva2VuO1xyXG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0udXBsb2FkVXJsID0gZGF0YS51cGxvYWRVcmw7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3VwbG9hZEZpbGUodXBsb2FkSXRlbSwgbGlzdGVuZXIpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl91cGxvYWRRdWVyeUNoZWNrKHVwbG9hZEl0ZW0sIGxpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fdXBsb2FkUXVlcnlSZXN1bHQodXBsb2FkSXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+S4iuS8oOe7k+adnzonLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyDkuIrkvKDnu5PmnZ9cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5maWxlcyAmJiBkYXRhLmZpbGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGltYWdlVXJsID0gZGF0YS5maWxlc1swXS5pbWFnZXNbMF0udXJsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5LiK5Lyg57uT5p6cOicgKyBpbWFnZVVybCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0uaW1hZ2VVcmwgPSBpbWFnZVVybDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh1cGxvYWRJdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi4kZW1pdCgndG9QYXJlbnQzJywgc2VsZi51cGxvYWRJdGVtcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+S4iuS8oOWksei0pTonLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8vIOiOt+W+l+S4gOS4quS4iuS8oOWcsOWdgFxyXG4gICAgLy8gaHR0cHM6Ly9zdGF0aWNzZXJ2aWNlLmV4dHJlbWV2YWx1ZS5jbi91cGxvYWQuaHRtbD9hcHBJZD1xamRcclxuICAgIF9uZXdVcGxvYWQoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHZhciB1cGxvYWRVcmwgPSB3eC5nZXRTdG9yYWdlU3luYygndXBsb2FkVXJsJykgKyAndXBsb2FkLmRvJztcclxuICAgICAgICAgICAgd3gucmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHVwbG9hZFVybCxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2dldCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAndXBsb2FkJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW1hZ2UnLFxyXG4gICAgICAgICAgICAgICAgICAgIGFwcElkOiB3eC5nZXRTdG9yYWdlU3luYygndXBsb2FkQXBwSWQnKVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGpzb24gPSByZXMuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnanNvbjExMTExJywganNvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGpzb24uY29kZSA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShqc29uLm1lc3NhZ2VzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yID0ganNvbi5tZXNzYWdlcy5lcnJvcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZmFpbChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6ICd1cGxvYWRfZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiByZXMuZXJyTXNnXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICBlLm5hbWUgPSBlcnJvci5jb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvLyDkuIrkvKDmlofku7bnmoTlhbfkvZNcclxuICAgIF91cGxvYWRGaWxlKHVwbG9hZEl0ZW0sIGxpc3RlbmVyKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVwbG9hZFRhc2sgPSB3eC51cGxvYWRGaWxlKHtcclxuICAgICAgICAgICAgICAgIHVybDogdXBsb2FkSXRlbS51cGxvYWRVcmwsXHJcbiAgICAgICAgICAgICAgICBmaWxlUGF0aDogdXBsb2FkSXRlbS5maWxlLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2ZpbGUnLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1c0NvZGUgIT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6ICd1cGxvYWRfZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0hUVFDplJnor686JyArIHJlcy5zdGF0dXNDb2RlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLm5hbWUgPSBlcnJvci5jb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh1cGxvYWRJdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZmFpbChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6ICd1cGxvYWRfZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiByZXMuZXJyTXNnXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICBlLm5hbWUgPSBlcnJvci5jb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vIOebkeaOp+S4iuS8oOi/m+W6plxyXG4gICAgICAgICAgICB1cGxvYWRUYXNrLm9uUHJvZ3Jlc3NVcGRhdGUocmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lciAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkSXRlbS5wcm9ncmVzcyA9IHJlcy5wcm9ncmVzcztcclxuICAgICAgICAgICAgICAgICAgICBpZiAodXBsb2FkSXRlbS5wcm9ncmVzcyA+IDk5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0ucHJvZ3Jlc3MgPSA5OTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIoc2VsZiwgdXBsb2FkSXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+S4iuS8oOi/m+W6picsIHJlcy5wcm9ncmVzcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ+W3sue7j+S4iuS8oOeahOaVsOaNrumVv+W6picsIHJlcy50b3RhbEJ5dGVzU2VudCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcclxuICAgICAgICAgICAgICAgICAgICAn6aKE5pyf6ZyA6KaB5LiK5Lyg55qE5pWw5o2u5oC76ZW/5bqmJyxcclxuICAgICAgICAgICAgICAgICAgICByZXMudG90YWxCeXRlc0V4cGVjdGVkVG9TZW5kXHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvLyDnoa7orqTmnI3liqHlmajlt7Lnu4/mlLbliLDmiYDmnInmlbDmja5cclxuICAgIF91cGxvYWRRdWVyeUNoZWNrKHVwbG9hZEl0ZW0sIGxpc3RlbmVyKSB7XHJcbiAgICAgICAgdmFyIHVwbG9hZFVybCA9IHVwbG9hZEl0ZW0udXBsb2FkVXJsO1xyXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrRmluaXNoZWQocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiB1cGxvYWRVcmwsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gcmVzLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NoZWNrIHVwbG9hZCBmaW5pc2hlZDonLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdmaW5pc2gnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lciAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLnByb2dyZXNzID0gMTAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIodXBsb2FkSXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrRmluaXNoZWQocmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6ICd1cGxvYWRfZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiByZXMuZXJyTXNnXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncXVlcnkgc2VydmVyIGVycm9yLHdpbGwgcmV0cnk6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja0ZpbmlzaGVkKHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY2hlY2tGaW5pc2hlZChyZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgX3VwbG9hZFF1ZXJ5UmVzdWx0KHVwbG9hZEl0ZW0pIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdmFyIHVwbG9hZFVybCA9IHd4LmdldFN0b3JhZ2VTeW5jKCd1cGxvYWRVcmwnKSArICd1cGxvYWQuZG8nO1xyXG4gICAgICAgICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgIHVybDogdXBsb2FkVXJsLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnZ2V0JyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb246ICdxdWVyeScsXHJcbiAgICAgICAgICAgICAgICAgICAgdG9rZW46IHVwbG9hZEl0ZW0udXBsb2FkVG9rZW5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGpzb24gPSByZXMuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoanNvbi5jb2RlID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShqc29uLm1lc3NhZ2VzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yID0ganNvbi5tZXNzYWdlcy5lcnJvcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZmFpbDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogJ3VwbG9hZF9lcnJvcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHJlcy5lcnJNc2dcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iXX0=