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
                        console.log(self.uploadItems, '33');
                        self.$emit('toParent1', self.uploadItems);
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
            var item = args[0][0];
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
    };
};

exports.default = Upload;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVwbG9hZC5qcyJdLCJuYW1lcyI6WyJVcGxvYWQiLCJzZWxmIiwidXBsb2FkaW5nIiwiY29uc29sZSIsImxvZyIsInVwbG9hZEl0ZW0iLCJpIiwidXBsb2FkSXRlbXMiLCJsZW5ndGgiLCJpdGVtIiwicHJvZ3Jlc3MiLCJ1cGxvYWRGaWxlIiwiJGFwcGx5IiwidGhlbiIsInVwbG9hZGVkIiwic3RhcnRVcGxvYWQiLCJjYXRjaCIsInVwbG9hZEVycm9yIiwiZSIsIm1lc3NhZ2UiLCJsaXN0ZW5lciIsInd4Iiwic2hvd0xvYWRpbmciLCJ0aXRsZSIsImluZGV4IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJfbmV3VXBsb2FkIiwiZGF0YSIsInVwbG9hZFRva2VuIiwidG9rZW4iLCJ1cGxvYWRVcmwiLCJfdXBsb2FkRmlsZSIsIl91cGxvYWRRdWVyeUNoZWNrIiwiX3VwbG9hZFF1ZXJ5UmVzdWx0IiwiZmlsZXMiLCJpbWFnZVVybCIsImltYWdlcyIsInVybCIsIiRlbWl0IiwiaGlkZUxvYWRpbmciLCJlcnJvciIsImdldFN0b3JhZ2VTeW5jIiwicmVxdWVzdCIsIm1ldGhvZCIsImFjdGlvbiIsInR5cGUiLCJhcHBJZCIsInN1Y2Nlc3MiLCJyZXMiLCJqc29uIiwiY29kZSIsIm1lc3NhZ2VzIiwiRXJyb3IiLCJuYW1lIiwiZmFpbCIsImVyck1zZyIsInVwbG9hZFRhc2siLCJmaWxlUGF0aCIsImZpbGUiLCJzdGF0dXNDb2RlIiwib25Qcm9ncmVzc1VwZGF0ZSIsInRvdGFsQnl0ZXNFeHBlY3RlZFRvU2VuZCIsImNoZWNrRmluaXNoZWQiLCJzdGF0dXMiLCJzZXRUaW1lb3V0Iiwid2VweSIsInBhZ2UiLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IiwibWl4aW5zIiwiUGFnZU1peGluIiwidXBsb2FkSW5kZXgiLCJpbWdVcGxvYWQiLCJldmVudHMiLCJhcmdzIiwiaW1nMSIsImltZzIiLCJpbWczIiwibWV0aG9kcyIsImRlbEltZyIsInNwbGljZSIsImN1cnJlbnRUYXJnZXQiLCJkYXRhc2V0IiwicHJldmlldyIsImV2ZW50IiwiY3VycmVudFVybCIsInNyYyIsInByZXZpZXdJbWFnZSIsImN1cnJlbnQiLCJ1cmxzIiwiY2hvb3NlSW1hZ2UiLCJjb3VudCIsInNpemVUeXBlIiwic291cmNlVHlwZSIsInRlbXBGaWxlUGF0aHMiLCJwdXNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBRkE7OztJQUdxQkEsTTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE2RGpCO3NDQUNjO0FBQ1YsZ0JBQUlDLE9BQU8sSUFBWDtBQUNBLGdCQUFJQSxLQUFLQyxTQUFULEVBQW9CO0FBQ2hCQyx3QkFBUUMsR0FBUixDQUFZLGNBQVo7QUFDQTtBQUNIO0FBQ0QsZ0JBQUlDLGFBQWEsSUFBakI7QUFDQSxpQkFBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlMLEtBQUtNLFdBQUwsQ0FBaUJDLE1BQXJDLEVBQTZDRixHQUE3QyxFQUFrRDtBQUM5QyxvQkFBSUcsT0FBT1IsS0FBS00sV0FBTCxDQUFpQkQsQ0FBakIsQ0FBWDtBQUNBLG9CQUFJRyxLQUFLQyxRQUFMLElBQWlCLENBQXJCLEVBQXdCO0FBQ3BCTCxpQ0FBYUksSUFBYjtBQUNBO0FBQ0g7QUFDSjtBQUNELGdCQUFJSixjQUFjLElBQWxCLEVBQXdCO0FBQ3BCSixxQkFBS0MsU0FBTCxHQUFpQixJQUFqQjtBQUNBRCxxQkFDS1UsVUFETCxDQUNnQk4sVUFEaEIsRUFDNEIsVUFBU0EsVUFBVCxFQUFxQjtBQUN6Q0oseUJBQUtXLE1BQUw7QUFDSCxpQkFITCxFQUlLQyxJQUpMLENBSVUsZ0JBQVE7QUFDVloseUJBQUtDLFNBQUwsR0FBaUIsS0FBakI7QUFDQUcsK0JBQVdTLFFBQVgsR0FBc0IsSUFBdEIsQ0FGVSxDQUVrQjtBQUM1QjtBQUNBYix5QkFBS1csTUFBTDtBQUNBWCx5QkFBS2MsV0FBTDtBQUNILGlCQVZMLEVBV0tDLEtBWEwsQ0FXVyxhQUFLO0FBQ1JYLCtC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RUFBVSxRQUFWLENBSEQ7QUFJWDlDLHVCQUpXLG1CQUlIQyxHQUpHLEVBSUU7QUFDVDtBQUNBLHdCQUFNOEMsZ0JBQWdCOUMsSUFBSThDLGFBQTFCO0FBQ0EseUJBQUssSUFBSTFGLElBQUksQ0FBYixFQUFnQkEsSUFBSTBGLGNBQWN4RixNQUFsQyxFQUEwQ0YsR0FBMUMsRUFBK0M7QUFDM0NMLDZCQUFLTSxXQUFMLENBQWlCMEYsSUFBakIsQ0FBc0I7QUFDbEJ6RSxtQ0FBT3ZCLEtBQUt3RSxXQUFMLEVBRFc7QUFFbEJiLGtDQUFNb0MsY0FBYzFGLENBQWQsQ0FGWSxFQUVNO0FBQ3hCSSxzQ0FBVSxDQUhRO0FBSWxCSSxzQ0FBVSxLQUpRLEVBSUQ7QUFDakJHLHlDQUFhLEtBTEssRUFLRTtBQUNwQnNCLGlDQUFLLEVBTmEsQ0FNVjtBQU5VLHlCQUF0QjtBQVFIO0FBQ0R0Qyx5QkFBS2MsV0FBTDtBQUNBZCx5QkFBS1csTUFBTDtBQUNILGlCQW5CVTtBQW9CWDRDLG9CQXBCVyxnQkFvQk5kLEtBcEJNLEVBb0JDO0FBQ1J2Qyw0QkFBUUMsR0FBUixDQUFZLGdCQUFaLEVBQThCc0MsS0FBOUI7QUFDSDtBQXRCVSxhQUFmO0FBd0JILFNBckNLO0FBc0NOK0Msb0JBdENNLHdCQXNDT3ZFLENBdENQLEVBc0NVO0FBQ1o7QUFDQTtBQUNIO0FBekNLLEs7OztrQkFsQk9sQixNIiwiZmlsZSI6InVwbG9hZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKiBnbG9iYWwgd3ggKi9cclxuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XHJcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vbWl4aW5zL3BhZ2UnO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVcGxvYWQgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gICAgY29uZmlnID0ge1xyXG4gICAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfmtYvor5XkuIrkvKDlm77niYcnXHJcbiAgICB9O1xyXG4gICAgbWl4aW5zID0gW1BhZ2VNaXhpbl07XHJcbiAgICBkYXRhID0ge1xyXG4gICAgICAgIHVwbG9hZEluZGV4OiAwLCAvLyDkuIrkvKDnmoTnvJblj7dcclxuICAgICAgICBpbWdVcGxvYWQ6ICcuLi9pbWFnZXMvYnRuX2FkZF9pbWcucG5nJyxcclxuICAgICAgICB1cGxvYWRJdGVtczogW10sIC8vIOS4iuS8oOeahOWbvueJh+aVsOe7hFxyXG4gICAgICAgIHVwbG9hZGluZzogZmFsc2UgLy8g5piv5ZCm5q2j5Zyo5LiK5LygXHJcbiAgICB9O1xyXG4gICAgZXZlbnRzID0ge1xyXG4gICAgICAgICdpbmRleC1icm9hZGNhc3QnOiAoLi4uYXJncykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhhcmdzWzBdLCAnYXJnc1swXScpO1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtID0gYXJnc1swXVswXTtcclxuICAgICAgICAgICAgdGhpcy51cGxvYWRJdGVtcyA9IFt7aW1hZ2VVcmw6IGl0ZW0uaW1nMSwgdXBsb2FkVXJsOiBpdGVtLmltZzEsIGZpbGU6IGl0ZW0uaW1nMSwgdXBsb2FkZWQ6IHRydWV9LCB7aW1hZ2VVcmw6IGl0ZW0uaW1nMiwgZmlsZTogaXRlbS5pbWcyLCB1cGxvYWRlZDogdHJ1ZSwgdXBsb2FkVXJsOiBpdGVtLmltZzJ9LCB7aW1hZ2VVcmw6IGl0ZW0uaW1nMywgZmlsZTogaXRlbS5pbWczLCB1cGxvYWRlZDogdHJ1ZSwgdXBsb2FkVXJsOiBpdGVtLmltZzN9XTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBtZXRob2RzID0ge1xyXG4gICAgICAgIGRlbEltZyhlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBsb2FkSXRlbXMuc3BsaWNlKGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4LCAxKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHByZXZpZXcoZXZlbnQpIHtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRVcmwgPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuc3JjO1xyXG4gICAgICAgICAgICB3eC5wcmV2aWV3SW1hZ2Uoe1xyXG4gICAgICAgICAgICAgICAgY3VycmVudDogY3VycmVudFVybCwgLy8g5b2T5YmN5pi+56S65Zu+54mH55qEaHR0cOmTvuaOpVxyXG4gICAgICAgICAgICAgICAgdXJsczogW2N1cnJlbnRVcmxdIC8vIOmcgOimgemihOiniOeahOWbvueJh2h0dHDpk77mjqXliJfooahcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjaG9vc2VJbWFnZShlKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgd3guY2hvb3NlSW1hZ2Uoe1xyXG4gICAgICAgICAgICAgICAgY291bnQ6IDMsXHJcbiAgICAgICAgICAgICAgICBzaXplVHlwZTogWydvcmlnaW5hbCcsICdjb21wcmVzc2VkJ10sXHJcbiAgICAgICAgICAgICAgICBzb3VyY2VUeXBlOiBbJ2FsYnVtJywgJ2NhbWVyYSddLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB0ZW1wRmlsZVBhdGjlj6/ku6XkvZzkuLppbWfmoIfnrb7nmoRzcmPlsZ7mgKfmmL7npLrlm77niYdcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZW1wRmlsZVBhdGhzID0gcmVzLnRlbXBGaWxlUGF0aHM7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZW1wRmlsZVBhdGhzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYudXBsb2FkSXRlbXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogc2VsZi51cGxvYWRJbmRleCsrLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogdGVtcEZpbGVQYXRoc1tpXSwgLy8g55So5LqO55u05o6l5pi+56S6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmVzczogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZGVkOiBmYWxzZSwgLy8g5piv5ZCm5LiK5Lyg5a6M5oiQXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRFcnJvcjogZmFsc2UsIC8vIOS4iuS8oOWksei0pVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnJyAvLyDkuIrkvKDlkI7nmoRVUkxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc3RhcnRVcGxvYWQoKTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZhaWwoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndXBsb2FkIGZhaWxlZDonLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcHJldmlld0ltYWdlKGUpIHtcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy9cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgLy8g5ZCv5Yqo5LiK5Lyg77yM5LiA5Liq5LiA5Liq5LiK5Lyg77yMXHJcbiAgICBzdGFydFVwbG9hZCgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgaWYgKHNlbGYudXBsb2FkaW5nKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd1cGxvYWRpbmcuLi4nKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdXBsb2FkSXRlbSA9IG51bGw7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxmLnVwbG9hZEl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gc2VsZi51cGxvYWRJdGVtc1tpXTtcclxuICAgICAgICAgICAgaWYgKGl0ZW0ucHJvZ3Jlc3MgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdXBsb2FkSXRlbSA9IGl0ZW07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodXBsb2FkSXRlbSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHNlbGYudXBsb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgc2VsZlxyXG4gICAgICAgICAgICAgICAgLnVwbG9hZEZpbGUodXBsb2FkSXRlbSwgZnVuY3Rpb24odXBsb2FkSXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51cGxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLnVwbG9hZGVkID0gdHJ1ZTsgLy8g5qCH6K6w5LiK5Lyg5oiQ5YqfXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBsb2FkSXRlbS5pbWFnZVVybCDlsLHmmK/kuIrkvKDlkI7nmoTlgLxcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc3RhcnRVcGxvYWQoKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkSXRlbS51cGxvYWRFcnJvciA9IGUubWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnVwbG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zdGFydFVwbG9hZCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvKiog5paw55qEIGdlbmVyYXRvciDlhpnms5VcclxuICAgICAgICAgICAgdGhpcy5hcHBcclxuICAgICAgICAgICAgICAgIC51cGxvYWRGaWxlKHVwbG9hZEl0ZW0sIGZ1bmN0aW9uKHVwbG9hZEl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXBsb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkSXRlbS51cGxvYWRlZCA9IHRydWU7IC8v5qCH6K6w5LiK5Lyg5oiQ5YqfXHJcbiAgICAgICAgICAgICAgICAgICAgLy91cGxvYWRJdGVtLmltYWdlVXJsIOWwseaYr+S4iuS8oOWQjueahOWAvFxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAvLyBzZWxmLnN0YXJ0VXBsb2FkKCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0udXBsb2FkRXJyb3IgPSBlLm1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51cGxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgICAgLy8gc2VsZi5zdGFydFVwbG9hZCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIC0tLS0tLS0tLS0tLS0gIOS4juS4iuS8oOacjeWKoeWZqOi/m+ihjOS6pOS6kiAtLS0tLS0tLS0tLVxyXG4gICAgLyog5Lyg57uf5qih5byPcHJvbWlzZSDlhpnms5UgKi9cclxuICAgIHVwbG9hZEZpbGUodXBsb2FkSXRlbSwgbGlzdGVuZXIpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgd3guc2hvd0xvYWRpbmcoe1xyXG4gICAgICAgICAgICB0aXRsZTogJ+S4iuS8oOS4rS4uLidcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zb2xlLmxvZygnc3RhcnRVcGxvYWQ6JywgdXBsb2FkSXRlbS5pbmRleCk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgc2VsZlxyXG4gICAgICAgICAgICAgICAgLl9uZXdVcGxvYWQoKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ25ld1VwbG9hZDonLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLnVwbG9hZFRva2VuID0gZGF0YS50b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLnVwbG9hZFVybCA9IGRhdGEudXBsb2FkVXJsO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl91cGxvYWRGaWxlKHVwbG9hZEl0ZW0sIGxpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fdXBsb2FkUXVlcnlDaGVjayh1cGxvYWRJdGVtLCBsaXN0ZW5lcik7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3VwbG9hZFF1ZXJ5UmVzdWx0KHVwbG9hZEl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfkuIrkvKDnu5PmnZ86JywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5LiK5Lyg57uT5p2fXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmlsZXMgJiYgZGF0YS5maWxlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbWFnZVVybCA9IGRhdGEuZmlsZXNbMF0uaW1hZ2VzWzBdLnVybDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+S4iuS8oOe7k+aenDonICsgaW1hZ2VVcmwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLmltYWdlVXJsID0gaW1hZ2VVcmw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodXBsb2FkSXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYudXBsb2FkSXRlbXMsICczMycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLiRlbWl0KCd0b1BhcmVudDEnLCBzZWxmLnVwbG9hZEl0ZW1zKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5LiK5Lyg5aSx6LSlOicsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLy8g6I635b6X5LiA5Liq5LiK5Lyg5Zyw5Z2AXHJcbiAgICAvLyBodHRwczovL3N0YXRpY3NlcnZpY2UuZXh0cmVtZXZhbHVlLmNuL3VwbG9hZC5odG1sP2FwcElkPXFqZFxyXG4gICAgX25ld1VwbG9hZCgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdmFyIHVwbG9hZFVybCA9IHd4LmdldFN0b3JhZ2VTeW5jKCd1cGxvYWRVcmwnKSArICd1cGxvYWQuZG8nO1xyXG4gICAgICAgICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgIHVybDogdXBsb2FkVXJsLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnZ2V0JyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb246ICd1cGxvYWQnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbWFnZScsXHJcbiAgICAgICAgICAgICAgICAgICAgYXBwSWQ6IHd4LmdldFN0b3JhZ2VTeW5jKCd1cGxvYWRBcHBJZCcpXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIganNvbiA9IHJlcy5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdqc29uMTExMTEnLCBqc29uKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoanNvbi5jb2RlID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGpzb24ubWVzc2FnZXMuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3IgPSBqc29uLm1lc3NhZ2VzLmVycm9yO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5uYW1lID0gZXJyb3IuY29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmYWlsKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogJ3VwbG9hZF9lcnJvcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHJlcy5lcnJNc2dcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8vIOS4iuS8oOaWh+S7tueahOWFt+S9k1xyXG4gICAgX3VwbG9hZEZpbGUodXBsb2FkSXRlbSwgbGlzdGVuZXIpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXBsb2FkVGFzayA9IHd4LnVwbG9hZEZpbGUoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiB1cGxvYWRJdGVtLnVwbG9hZFVybCxcclxuICAgICAgICAgICAgICAgIGZpbGVQYXRoOiB1cGxvYWRJdGVtLmZpbGUsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnZmlsZScsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzQ29kZSAhPSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogJ3VwbG9hZF9lcnJvcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSFRUUOmUmeivrzonICsgcmVzLnN0YXR1c0NvZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHVwbG9hZEl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmYWlsKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogJ3VwbG9hZF9lcnJvcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHJlcy5lcnJNc2dcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy8g55uR5o6n5LiK5Lyg6L+b5bqmXHJcbiAgICAgICAgICAgIHVwbG9hZFRhc2sub25Qcm9ncmVzc1VwZGF0ZShyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLnByb2dyZXNzID0gcmVzLnByb2dyZXNzO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh1cGxvYWRJdGVtLnByb2dyZXNzID4gOTkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkSXRlbS5wcm9ncmVzcyA9IDk5O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcihzZWxmLCB1cGxvYWRJdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5LiK5Lyg6L+b5bqmJywgcmVzLnByb2dyZXNzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygn5bey57uP5LiK5Lyg55qE5pWw5o2u6ZW/5bqmJywgcmVzLnRvdGFsQnl0ZXNTZW50KTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgICAgICAgICAgICfpooTmnJ/pnIDopoHkuIrkvKDnmoTmlbDmja7mgLvplb/luqYnLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlcy50b3RhbEJ5dGVzRXhwZWN0ZWRUb1NlbmRcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8vIOehruiupOacjeWKoeWZqOW3sue7j+aUtuWIsOaJgOacieaVsOaNrlxyXG4gICAgX3VwbG9hZFF1ZXJ5Q2hlY2sodXBsb2FkSXRlbSwgbGlzdGVuZXIpIHtcclxuICAgICAgICB2YXIgdXBsb2FkVXJsID0gdXBsb2FkSXRlbS51cGxvYWRVcmw7XHJcbiAgICAgICAgZnVuY3Rpb24gY2hlY2tGaW5pc2hlZChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgd3gucmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHVwbG9hZFVybCxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2dldCcsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSByZXMuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2hlY2sgdXBsb2FkIGZpbmlzaGVkOicsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gJ2ZpbmlzaCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0ucHJvZ3Jlc3MgPSAxMDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcih1cGxvYWRJdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tGaW5pc2hlZChyZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZmFpbDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogJ3VwbG9hZF9lcnJvcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHJlcy5lcnJNc2dcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdxdWVyeSBzZXJ2ZXIgZXJyb3Isd2lsbCByZXRyeTonLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrRmluaXNoZWQocmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjaGVja0ZpbmlzaGVkKHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBfdXBsb2FkUXVlcnlSZXN1bHQodXBsb2FkSXRlbSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgdXBsb2FkVXJsID0gd3guZ2V0U3RvcmFnZVN5bmMoJ3VwbG9hZFVybCcpICsgJ3VwbG9hZC5kbyc7XHJcbiAgICAgICAgICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiB1cGxvYWRVcmwsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ3F1ZXJ5JyxcclxuICAgICAgICAgICAgICAgICAgICB0b2tlbjogdXBsb2FkSXRlbS51cGxvYWRUb2tlblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIganNvbiA9IHJlcy5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChqc29uLmNvZGUgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGpzb24ubWVzc2FnZXMuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3IgPSBqc29uLm1lc3NhZ2VzLmVycm9yO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5uYW1lID0gZXJyb3IuY29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiAndXBsb2FkX2Vycm9yJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogcmVzLmVyck1zZ1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5uYW1lID0gZXJyb3IuY29kZTtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==