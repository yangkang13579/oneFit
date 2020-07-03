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
                        self.$emit('toParent3', self.uploadItems);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVwbG9hZDMuanMiXSwibmFtZXMiOlsiVXBsb2FkIiwic2VsZiIsInVwbG9hZGluZyIsImNvbnNvbGUiLCJsb2ciLCJ1cGxvYWRJdGVtIiwiaSIsInVwbG9hZEl0ZW1zIiwibGVuZ3RoIiwiaXRlbSIsInByb2dyZXNzIiwidXBsb2FkRmlsZSIsIiRhcHBseSIsInRoZW4iLCJ1cGxvYWRlZCIsInN0YXJ0VXBsb2FkIiwiY2F0Y2giLCJ1cGxvYWRFcnJvciIsImUiLCJtZXNzYWdlIiwibGlzdGVuZXIiLCJ3eCIsInNob3dMb2FkaW5nIiwidGl0bGUiLCJpbmRleCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiX25ld1VwbG9hZCIsImRhdGEiLCJ1cGxvYWRUb2tlbiIsInRva2VuIiwidXBsb2FkVXJsIiwiX3VwbG9hZEZpbGUiLCJfdXBsb2FkUXVlcnlDaGVjayIsIl91cGxvYWRRdWVyeVJlc3VsdCIsImZpbGVzIiwiaW1hZ2VVcmwiLCJpbWFnZXMiLCJ1cmwiLCIkZW1pdCIsImhpZGVMb2FkaW5nIiwiZXJyb3IiLCJnZXRTdG9yYWdlU3luYyIsInJlcXVlc3QiLCJtZXRob2QiLCJhY3Rpb24iLCJ0eXBlIiwiYXBwSWQiLCJzdWNjZXNzIiwicmVzIiwianNvbiIsImNvZGUiLCJtZXNzYWdlcyIsIkVycm9yIiwibmFtZSIsImZhaWwiLCJlcnJNc2ciLCJ1cGxvYWRUYXNrIiwiZmlsZVBhdGgiLCJmaWxlIiwic3RhdHVzQ29kZSIsIm9uUHJvZ3Jlc3NVcGRhdGUiLCJ0b3RhbEJ5dGVzRXhwZWN0ZWRUb1NlbmQiLCJjaGVja0ZpbmlzaGVkIiwic3RhdHVzIiwic2V0VGltZW91dCIsIndlcHkiLCJwYWdlIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm1peGlucyIsIlBhZ2VNaXhpbiIsInVwbG9hZEluZGV4IiwiaW1nVXBsb2FkIiwiZXZlbnRzIiwiYXJncyIsImltZzEiLCJpbWcyIiwiaW1nMyIsIm1ldGhvZHMiLCJkZWxJbWciLCJzcGxpY2UiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YXNldCIsImNob29zZUltYWdlIiwiY291bnQiLCJzaXplVHlwZSIsInNvdXJjZVR5cGUiLCJ0ZW1wRmlsZVBhdGhzIiwicHVzaCIsInByZXZpZXciLCJldmVudCIsImN1cnJlbnRVcmwiLCJzcmMiLCJwcmV2aWV3SW1hZ2UiLCJjdXJyZW50IiwidXJscyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7OztBQUZBOzs7SUFHcUJBLE07Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeURqQjtzQ0FDYztBQUNWLGdCQUFJQyxPQUFPLElBQVg7QUFDQSxnQkFBSUEsS0FBS0MsU0FBVCxFQUFvQjtBQUNoQkMsd0JBQVFDLEdBQVIsQ0FBWSxjQUFaO0FBQ0E7QUFDSDtBQUNELGdCQUFJQyxhQUFhLElBQWpCO0FBQ0EsaUJBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJTCxLQUFLTSxXQUFMLENBQWlCQyxNQUFyQyxFQUE2Q0YsR0FBN0MsRUFBa0Q7QUFDOUMsb0JBQUlHLE9BQU9SLEtBQUtNLFdBQUwsQ0FBaUJELENBQWpCLENBQVg7QUFDQSxvQkFBSUcsS0FBS0MsUUFBTCxJQUFpQixDQUFyQixFQUF3QjtBQUNwQkwsaUNBQWFJLElBQWI7QUFDQTtBQUNIO0FBQ0o7QUFDRCxnQkFBSUosY0FBYyxJQUFsQixFQUF3QjtBQUNwQkoscUJBQUtDLFNBQUwsR0FBaUIsSUFBakI7QUFDQUQscUJBQ0tVLFVBREwsQ0FDZ0JOLFVBRGhCLEVBQzRCLFVBQVNBLFVBQVQsRUFBb0I7QUFDeENKLHlCQUFLVyxNQUFMO0FBQ0gsaUJBSEwsRUFJS0MsSUFKTCxDQUlVLGdCQUFRO0FBQ1ZaLHlCQUFLQyxTQUFMLEdBQWlCLEtBQWpCO0FBQ0FHLCtCQUFXUyxRQUFYLEdBQXNCLElBQXRCLENBRlUsQ0FFa0I7QUFDNUI7QUFDQWIseUJBQUtXLE1BQUw7QUFDQVgseUJBQUtjLFdBQUw7QUFDSCxpQkFWTCxFQVdLQyxLQVhMLENBV1csYUFBSztBQUNSWCwr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bEJiLGtDQUFNNkIsY0FBY25GLENBQWQsQ0FGWSxFQUVNO0FBQ3hCSSxzQ0FBVSxDQUhRO0FBSWxCSSxzQ0FBVSxLQUpRLEVBSUQ7QUFDakJHLHlDQUFhLEtBTEssRUFLRTtBQUNwQnNCLGlDQUFLLEVBTmEsQ0FNVjtBQU5VLHlCQUF0QjtBQVFIO0FBQ0R0Qyx5QkFBS2MsV0FBTDtBQUNBZCx5QkFBS1csTUFBTDtBQUNILGlCQW5CVTtBQW9CWDRDLG9CQXBCVyxnQkFvQk5kLEtBcEJNLEVBb0JDO0FBQ1J2Qyw0QkFBUUMsR0FBUixDQUFZLGdCQUFaLEVBQThCc0MsS0FBOUI7QUFDSDtBQXRCVSxhQUFmO0FBd0JILFNBOUJLO0FBK0JOaUQsZUEvQk0sbUJBK0JFQyxLQS9CRixFQStCUztBQUNiLGdCQUFJQyxhQUFhRCxNQUFNVCxhQUFOLENBQW9CQyxPQUFwQixDQUE0QlUsR0FBN0M7QUFDQXpFLGVBQUcwRSxZQUFILENBQWdCO0FBQ2RDLHlCQUFTSCxVQURLLEVBQ087QUFDckJJLHNCQUFNLENBQUNKLFVBQUQsQ0FGUSxDQUVLO0FBRkwsYUFBaEI7QUFJRDtBQXJDSyxLOzs7a0JBbEJPN0YsTSIsImZpbGUiOiJ1cGxvYWQzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKiBnbG9iYWwgd3ggKi9cbmltcG9ydCB3ZXB5IGZyb20gJ3dlcHknO1xuaW1wb3J0IFBhZ2VNaXhpbiBmcm9tICcuLi9taXhpbnMvcGFnZSc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVcGxvYWQgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xuICAgIGNvbmZpZyA9IHtcbiAgICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+a1i+ivleS4iuS8oOWbvueJhydcbiAgICB9O1xuICAgIG1peGlucyA9IFtQYWdlTWl4aW5dO1xuICAgIGRhdGEgPSB7XG4gICAgICAgIHVwbG9hZEluZGV4OiAwLCAvL+S4iuS8oOeahOe8luWPt1xuICAgICAgICBpbWdVcGxvYWQ6ICcuLi9pbWFnZXMvYnRuX2FkZF9pbWcucG5nJyxcbiAgICAgICAgdXBsb2FkSXRlbXM6IFtdLCAvL+S4iuS8oOeahOWbvueJh+aVsOe7hFxuICAgICAgICB1cGxvYWRpbmc6IGZhbHNlIC8v5piv5ZCm5q2j5Zyo5LiK5LygXG4gICAgfTtcbiAgICBldmVudHMgPSB7IFxuICAgICAgJ2luZGV4LWJyb2FkY2FzdCc6ICguLi5hcmdzKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGFyZ3NbMF0sICdhcmdzWzBdJylcbiAgICAgICAgY29uc3QgaXRlbSA9IGFyZ3NbMF1bMl1cbiAgICAgICAgdGhpcy51cGxvYWRJdGVtcyA9IFt7aW1hZ2VVcmw6IGl0ZW0uaW1nMSwgdXBsb2FkVXJsOiBpdGVtLmltZzEsIGZpbGU6IGl0ZW0uaW1nMSwgdXBsb2FkZWQ6IHRydWV9LCB7aW1hZ2VVcmw6IGl0ZW0uaW1nMiwgZmlsZTogaXRlbS5pbWcyLCB1cGxvYWRlZDogdHJ1ZSwgdXBsb2FkVXJsOiBpdGVtLmltZzJ9LCB7aW1hZ2VVcmw6IGl0ZW0uaW1nMywgZmlsZTogaXRlbS5pbWczLCB1cGxvYWRlZDogdHJ1ZSwgdXBsb2FkVXJsOiBpdGVtLmltZzN9XVxuICAgICAgfVxuICAgIH1cbiAgICBtZXRob2RzID0ge1xuICAgICAgZGVsSW1nKGUpIHtcbiAgICAgICAgICB0aGlzLnVwbG9hZEl0ZW1zLnNwbGljZShlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleCwgMSlcbiAgICAgICAgfSxcbiAgICAgICAgY2hvb3NlSW1hZ2UoZSkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgd3guY2hvb3NlSW1hZ2Uoe1xuICAgICAgICAgICAgICAgIGNvdW50OiAzLFxuICAgICAgICAgICAgICAgIHNpemVUeXBlOiBbJ29yaWdpbmFsJywgJ2NvbXByZXNzZWQnXSxcbiAgICAgICAgICAgICAgICBzb3VyY2VUeXBlOiBbJ2FsYnVtJywgJ2NhbWVyYSddLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRlbXBGaWxlUGF0aOWPr+S7peS9nOS4umltZ+agh+etvueahHNyY+WxnuaAp+aYvuekuuWbvueJh1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZW1wRmlsZVBhdGhzID0gcmVzLnRlbXBGaWxlUGF0aHM7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGVtcEZpbGVQYXRocy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi51cGxvYWRJdGVtcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogc2VsZi51cGxvYWRJbmRleCsrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IHRlbXBGaWxlUGF0aHNbaV0sIC8v55So5LqO55u05o6l5pi+56S6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3M6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkZWQ6IGZhbHNlLCAvL+aYr+WQpuS4iuS8oOWujOaIkFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEVycm9yOiBmYWxzZSwgLy/kuIrkvKDlpLHotKVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcnIC8v5LiK5Lyg5ZCO55qEVVJMXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZWxmLnN0YXJ0VXBsb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmYWlsKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd1cGxvYWQgZmFpbGVkOicsIGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgcHJldmlldyhldmVudCkge1xuICAgICAgICAgIGxldCBjdXJyZW50VXJsID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LnNyY1xuICAgICAgICAgIHd4LnByZXZpZXdJbWFnZSh7XG4gICAgICAgICAgICBjdXJyZW50OiBjdXJyZW50VXJsLCAvLyDlvZPliY3mmL7npLrlm77niYfnmoRodHRw6ZO+5o6lXG4gICAgICAgICAgICB1cmxzOiBbY3VycmVudFVybF0gLy8g6ZyA6KaB6aKE6KeI55qE5Zu+54mHaHR0cOmTvuaOpeWIl+ihqFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8v5ZCv5Yqo5LiK5Lyg77yM5LiA5Liq5LiA5Liq5LiK5Lyg77yMXG4gICAgc3RhcnRVcGxvYWQoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKHNlbGYudXBsb2FkaW5nKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygndXBsb2FkaW5nLi4uJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHVwbG9hZEl0ZW0gPSBudWxsO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGYudXBsb2FkSXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gc2VsZi51cGxvYWRJdGVtc1tpXTtcbiAgICAgICAgICAgIGlmIChpdGVtLnByb2dyZXNzID09IDApIHtcbiAgICAgICAgICAgICAgICB1cGxvYWRJdGVtID0gaXRlbTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodXBsb2FkSXRlbSAhPSBudWxsKSB7XG4gICAgICAgICAgICBzZWxmLnVwbG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICBzZWxmXG4gICAgICAgICAgICAgICAgLnVwbG9hZEZpbGUodXBsb2FkSXRlbSwgZnVuY3Rpb24odXBsb2FkSXRlbSl7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51cGxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkSXRlbS51cGxvYWRlZCA9IHRydWU7IC8v5qCH6K6w5LiK5Lyg5oiQ5YqfXG4gICAgICAgICAgICAgICAgICAgIC8vdXBsb2FkSXRlbS5pbWFnZVVybCDlsLHmmK/kuIrkvKDlkI7nmoTlgLxcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zdGFydFVwbG9hZCgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLnVwbG9hZEVycm9yID0gZS5tZXNzYWdlO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnVwbG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnN0YXJ0VXBsb2FkKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgIFxuXG4gICAgICAgICAgIC8qKiDmlrDnmoQgZ2VuZXJhdG9yIOWGmeazlVxuICAgICAgICAgICAgdGhpcy5hcHBcbiAgICAgICAgICAgICAgICAudXBsb2FkRmlsZSh1cGxvYWRJdGVtLCBmdW5jdGlvbih1cGxvYWRJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51cGxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkSXRlbS51cGxvYWRlZCA9IHRydWU7IC8v5qCH6K6w5LiK5Lyg5oiQ5YqfXG4gICAgICAgICAgICAgICAgICAgIC8vdXBsb2FkSXRlbS5pbWFnZVVybCDlsLHmmK/kuIrkvKDlkI7nmoTlgLxcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICAgICAvLyBzZWxmLnN0YXJ0VXBsb2FkKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0udXBsb2FkRXJyb3IgPSBlLm1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXBsb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgICAgLy8gc2VsZi5zdGFydFVwbG9hZCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICovXG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tICDkuI7kuIrkvKDmnI3liqHlmajov5vooYzkuqTkupIgLS0tLS0tLS0tLS1cbiAgICAvKiDkvKDnu5/mqKHlvI9wcm9taXNlIOWGmeazlSAqL1xuICAgIHVwbG9hZEZpbGUodXBsb2FkSXRlbSwgbGlzdGVuZXIpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB3eC5zaG93TG9hZGluZyh7XG4gICAgICAgICAgdGl0bGU6ICfkuIrkvKDkuK0uLi4nXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnNvbGUubG9nKCdzdGFydFVwbG9hZDonLCB1cGxvYWRJdGVtLmluZGV4KTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHNlbGZcbiAgICAgICAgICAgICAgICAuX25ld1VwbG9hZCgpXG4gICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCduZXdVcGxvYWQ6JywgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0udXBsb2FkVG9rZW4gPSBkYXRhLnRva2VuO1xuICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLnVwbG9hZFVybCA9IGRhdGEudXBsb2FkVXJsO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fdXBsb2FkRmlsZSh1cGxvYWRJdGVtLCBsaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3VwbG9hZFF1ZXJ5Q2hlY2sodXBsb2FkSXRlbSxsaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3VwbG9hZFF1ZXJ5UmVzdWx0KHVwbG9hZEl0ZW0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5LiK5Lyg57uT5p2fOicsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAvL+S4iuS8oOe7k+adn1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5maWxlcyAmJiBkYXRhLmZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbWFnZVVybCA9IGRhdGEuZmlsZXNbMF0uaW1hZ2VzWzBdLnVybDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfkuIrkvKDnu5Pmnpw6JyArIGltYWdlVXJsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0uaW1hZ2VVcmwgPSBpbWFnZVVybDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodXBsb2FkSXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLiRlbWl0KCd0b1BhcmVudDMnLCBzZWxmLnVwbG9hZEl0ZW1zKVxuICAgICAgICAgICAgICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5LiK5Lyg5aSx6LSlOicsIGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvL+iOt+W+l+S4gOS4quS4iuS8oOWcsOWdgFxuICAgIC8vaHR0cHM6Ly9zdGF0aWNzZXJ2aWNlLmV4dHJlbWV2YWx1ZS5jbi91cGxvYWQuaHRtbD9hcHBJZD1xamRcbiAgICBfbmV3VXBsb2FkKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB2YXIgdXBsb2FkVXJsID0gd3guZ2V0U3RvcmFnZVN5bmMoJ3VwbG9hZFVybCcpICsgJ3VwbG9hZC5kbyc7XG4gICAgICAgICAgICB3eC5yZXF1ZXN0KHtcbiAgICAgICAgICAgICAgICB1cmw6IHVwbG9hZFVybCxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAndXBsb2FkJyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ltYWdlJyxcbiAgICAgICAgICAgICAgICAgICAgYXBwSWQ6IHd4LmdldFN0b3JhZ2VTeW5jKCd1cGxvYWRBcHBJZCcpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdWNjZXNzKHJlcykge1xuICAgICAgICAgICAgICAgICAgICB2YXIganNvbiA9IHJlcy5kYXRhO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnanNvbjExMTExJyxqc29uKVxuICAgICAgICAgICAgICAgICAgICBpZiAoanNvbi5jb2RlID09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShqc29uLm1lc3NhZ2VzLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3IgPSBqc29uLm1lc3NhZ2VzLmVycm9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLm5hbWUgPSBlcnJvci5jb2RlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmYWlsKHJlcykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiAndXBsb2FkX2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHJlcy5lcnJNc2dcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8v5LiK5Lyg5paH5Lu255qE5YW35L2TXG4gICAgX3VwbG9hZEZpbGUodXBsb2FkSXRlbSwgbGlzdGVuZXIpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdXBsb2FkVGFzayA9IHd4LnVwbG9hZEZpbGUoe1xuICAgICAgICAgICAgICAgIHVybDogdXBsb2FkSXRlbS51cGxvYWRVcmwsXG4gICAgICAgICAgICAgICAgZmlsZVBhdGg6IHVwbG9hZEl0ZW0uZmlsZSxcbiAgICAgICAgICAgICAgICBuYW1lOiAnZmlsZScsXG4gICAgICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXNDb2RlICE9IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6ICd1cGxvYWRfZXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdIVFRQ6ZSZ6K+vOicgKyByZXMuc3RhdHVzQ29kZVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5uYW1lID0gZXJyb3IuY29kZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodXBsb2FkSXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZhaWwocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6ICd1cGxvYWRfZXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogcmVzLmVyck1zZ1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgZS5uYW1lID0gZXJyb3IuY29kZTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy/nm5HmjqfkuIrkvKDov5vluqZcbiAgICAgICAgICAgIHVwbG9hZFRhc2sub25Qcm9ncmVzc1VwZGF0ZShyZXMgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0ucHJvZ3Jlc3MgPSByZXMucHJvZ3Jlc3M7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1cGxvYWRJdGVtLnByb2dyZXNzID4gOTkpIHtcbiAgICAgICAgICAgIHVwbG9hZEl0ZW0ucHJvZ3Jlc3MgPSA5OTtcbiAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyKHNlbGYsIHVwbG9hZEl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgIFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfkuIrkvKDov5vluqYnLCByZXMucHJvZ3Jlc3MpO1xuICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCflt7Lnu4/kuIrkvKDnmoTmlbDmja7plb/luqYnLCByZXMudG90YWxCeXRlc1NlbnQpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICAn6aKE5pyf6ZyA6KaB5LiK5Lyg55qE5pWw5o2u5oC76ZW/5bqmJyxcbiAgICAgICAgICAgICAgICAgICAgcmVzLnRvdGFsQnl0ZXNFeHBlY3RlZFRvU2VuZFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vIOehruiupOacjeWKoeWZqOW3sue7j+aUtuWIsOaJgOacieaVsOaNrlxuICBfdXBsb2FkUXVlcnlDaGVjayh1cGxvYWRJdGVtLGxpc3RlbmVyKSB7XG4gICAgdmFyIHVwbG9hZFVybCA9IHVwbG9hZEl0ZW0udXBsb2FkVXJsO1xuICAgIGZ1bmN0aW9uIGNoZWNrRmluaXNoZWQocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB3eC5yZXF1ZXN0KHtcbiAgICAgICAgdXJsOiB1cGxvYWRVcmwsXG4gICAgICAgIG1ldGhvZDogJ2dldCcsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICB2YXIgZGF0YSA9IHJlcy5kYXRhO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2hlY2sgdXBsb2FkIGZpbmlzaGVkOlwiLCBkYXRhKTtcbiAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdmaW5pc2gnKSB7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICB1cGxvYWRJdGVtLnByb2dyZXNzID0gMTAwO1xuICAgICAgICAgICAgICBsaXN0ZW5lcih1cGxvYWRJdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBjaGVja0ZpbmlzaGVkKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGZhaWw6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICB2YXIgZXJyb3IgPSB7XG4gICAgICAgICAgICBjb2RlOiAndXBsb2FkX2Vycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6IHJlcy5lcnJNc2dcbiAgICAgICAgICB9O1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwicXVlcnkgc2VydmVyIGVycm9yLHdpbGwgcmV0cnk6XCIsIGVycm9yKTtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNoZWNrRmluaXNoZWQocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY2hlY2tGaW5pc2hlZChyZXNvbHZlLCByZWplY3QpO1xuICAgIH0pO1xuICB9XG4gIF91cGxvYWRRdWVyeVJlc3VsdCh1cGxvYWRJdGVtKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB2YXIgdXBsb2FkVXJsID0gd3guZ2V0U3RvcmFnZVN5bmMoJ3VwbG9hZFVybCcpICsgJ3VwbG9hZC5kbyc7XG4gICAgICB3eC5yZXF1ZXN0KHtcbiAgICAgICAgdXJsOiB1cGxvYWRVcmwsXG4gICAgICAgIG1ldGhvZDogJ2dldCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBhY3Rpb246ICdxdWVyeScsXG4gICAgICAgICAgdG9rZW46IHVwbG9hZEl0ZW0udXBsb2FkVG9rZW5cbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgIHZhciBqc29uID0gcmVzLmRhdGE7XG4gICAgICAgICAgaWYgKGpzb24uY29kZSA9PT0gMjAwKSB7XG4gICAgICAgICAgICByZXNvbHZlKGpzb24ubWVzc2FnZXMuZGF0YSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGVycm9yID0ganNvbi5tZXNzYWdlcy5lcnJvcjtcbiAgICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgZS5uYW1lID0gZXJyb3IuY29kZTtcbiAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGZhaWw6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICB2YXIgZXJyb3IgPSB7XG4gICAgICAgICAgICBjb2RlOiAndXBsb2FkX2Vycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6IHJlcy5lcnJNc2dcbiAgICAgICAgICB9O1xuICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XG4gICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuIl19