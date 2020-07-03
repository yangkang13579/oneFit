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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVwbG9hZC5qcyJdLCJuYW1lcyI6WyJVcGxvYWQiLCJzZWxmIiwidXBsb2FkaW5nIiwiY29uc29sZSIsImxvZyIsInVwbG9hZEl0ZW0iLCJpIiwidXBsb2FkSXRlbXMiLCJsZW5ndGgiLCJpdGVtIiwicHJvZ3Jlc3MiLCJ1cGxvYWRGaWxlIiwiJGFwcGx5IiwidGhlbiIsInVwbG9hZGVkIiwic3RhcnRVcGxvYWQiLCJjYXRjaCIsInVwbG9hZEVycm9yIiwiZSIsIm1lc3NhZ2UiLCJsaXN0ZW5lciIsInd4Iiwic2hvd0xvYWRpbmciLCJ0aXRsZSIsImluZGV4IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJfbmV3VXBsb2FkIiwiZGF0YSIsInVwbG9hZFRva2VuIiwidG9rZW4iLCJ1cGxvYWRVcmwiLCJfdXBsb2FkRmlsZSIsIl91cGxvYWRRdWVyeUNoZWNrIiwiX3VwbG9hZFF1ZXJ5UmVzdWx0IiwiZmlsZXMiLCJpbWFnZVVybCIsImltYWdlcyIsInVybCIsIiRlbWl0IiwiaGlkZUxvYWRpbmciLCJlcnJvciIsImdldFN0b3JhZ2VTeW5jIiwicmVxdWVzdCIsIm1ldGhvZCIsImFjdGlvbiIsInR5cGUiLCJhcHBJZCIsInN1Y2Nlc3MiLCJyZXMiLCJqc29uIiwiY29kZSIsIm1lc3NhZ2VzIiwiRXJyb3IiLCJuYW1lIiwiZmFpbCIsImVyck1zZyIsInVwbG9hZFRhc2siLCJmaWxlUGF0aCIsImZpbGUiLCJzdGF0dXNDb2RlIiwib25Qcm9ncmVzc1VwZGF0ZSIsInRvdGFsQnl0ZXNFeHBlY3RlZFRvU2VuZCIsImNoZWNrRmluaXNoZWQiLCJzdGF0dXMiLCJzZXRUaW1lb3V0Iiwid2VweSIsInBhZ2UiLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IiwibWl4aW5zIiwiUGFnZU1peGluIiwidXBsb2FkSW5kZXgiLCJpbWdVcGxvYWQiLCJldmVudHMiLCJhcmdzIiwiaW1nMSIsImltZzIiLCJpbWczIiwibWV0aG9kcyIsImRlbEltZyIsInNwbGljZSIsImN1cnJlbnRUYXJnZXQiLCJkYXRhc2V0IiwicHJldmlldyIsImV2ZW50IiwiY3VycmVudFVybCIsInNyYyIsInByZXZpZXdJbWFnZSIsImN1cnJlbnQiLCJ1cmxzIiwiY2hvb3NlSW1hZ2UiLCJjb3VudCIsInNpemVUeXBlIiwic291cmNlVHlwZSIsInRlbXBGaWxlUGF0aHMiLCJwdXNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBRkE7OztJQUdxQkEsTTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE2RGpCO3NDQUNjO0FBQ1YsZ0JBQUlDLE9BQU8sSUFBWDtBQUNBLGdCQUFJQSxLQUFLQyxTQUFULEVBQW9CO0FBQ2hCQyx3QkFBUUMsR0FBUixDQUFZLGNBQVo7QUFDQTtBQUNIO0FBQ0QsZ0JBQUlDLGFBQWEsSUFBakI7QUFDQSxpQkFBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlMLEtBQUtNLFdBQUwsQ0FBaUJDLE1BQXJDLEVBQTZDRixHQUE3QyxFQUFrRDtBQUM5QyxvQkFBSUcsT0FBT1IsS0FBS00sV0FBTCxDQUFpQkQsQ0FBakIsQ0FBWDtBQUNBLG9CQUFJRyxLQUFLQyxRQUFMLElBQWlCLENBQXJCLEVBQXdCO0FBQ3BCTCxpQ0FBYUksSUFBYjtBQUNBO0FBQ0g7QUFDSjtBQUNELGdCQUFJSixjQUFjLElBQWxCLEVBQXdCO0FBQ3BCSixxQkFBS0MsU0FBTCxHQUFpQixJQUFqQjtBQUNBRCxxQkFDS1UsVUFETCxDQUNnQk4sVUFEaEIsRUFDNEIsVUFBU0EsVUFBVCxFQUFvQjtBQUN4Q0oseUJBQUtXLE1BQUw7QUFDSCxpQkFITCxFQUlLQyxJQUpMLENBSVUsZ0JBQVE7QUFDVloseUJBQUtDLFNBQUwsR0FBaUIsS0FBakI7QUFDQUcsK0JBQVdTLFFBQVgsR0FBc0IsSUFBdEIsQ0FGVSxDQUVrQjtBQUM1QjtBQUNBYix5QkFBS1csTUFBTDtBQUNBWCx5QkFBS2MsV0FBTDtBQUNILGlCQVZMLEVBV0tDLEtBWEwsQ0FXVyxhQUFLO0FBQ1JYLCtC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QUFVLFFBQVYsQ0FIRDtBQUlYOUMsdUJBSlcsbUJBSUhDLEdBSkcsRUFJRTtBQUNUO0FBQ0Esd0JBQU04QyxnQkFBZ0I5QyxJQUFJOEMsYUFBMUI7QUFDQSx5QkFBSyxJQUFJMUYsSUFBSSxDQUFiLEVBQWdCQSxJQUFJMEYsY0FBY3hGLE1BQWxDLEVBQTBDRixHQUExQyxFQUErQztBQUMzQ0wsNkJBQUtNLFdBQUwsQ0FBaUIwRixJQUFqQixDQUFzQjtBQUNsQnpFLG1DQUFPdkIsS0FBS3dFLFdBQUwsRUFEVztBQUVsQmIsa0NBQU1vQyxjQUFjMUYsQ0FBZCxDQUZZLEVBRU07QUFDeEJJLHNDQUFVLENBSFE7QUFJbEJJLHNDQUFVLEtBSlEsRUFJRDtBQUNqQkcseUNBQWEsS0FMSyxFQUtFO0FBQ3BCc0IsaUNBQUssRUFOYSxDQU1WO0FBTlUseUJBQXRCO0FBUUg7QUFDRHRDLHlCQUFLYyxXQUFMO0FBQ0FkLHlCQUFLVyxNQUFMO0FBQ0gsaUJBbkJVO0FBb0JYNEMsb0JBcEJXLGdCQW9CTmQsS0FwQk0sRUFvQkM7QUFDUnZDLDRCQUFRQyxHQUFSLENBQVksZ0JBQVosRUFBOEJzQyxLQUE5QjtBQUNIO0FBdEJVLGFBQWY7QUF3QkgsU0FyQ0s7QUFzQ04rQyxvQkF0Q00sd0JBc0NPdkUsQ0F0Q1AsRUFzQ1U7QUFDWjtBQUNBO0FBQ0g7QUF6Q0ssSzs7O2tCQWxCT2xCLE0iLCJmaWxlIjoidXBsb2FkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKiBnbG9iYWwgd3ggKi9cbmltcG9ydCB3ZXB5IGZyb20gJ3dlcHknO1xuaW1wb3J0IFBhZ2VNaXhpbiBmcm9tICcuLi9taXhpbnMvcGFnZSc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVcGxvYWQgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xuICAgIGNvbmZpZyA9IHtcbiAgICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+a1i+ivleS4iuS8oOWbvueJhydcbiAgICB9O1xuICAgIG1peGlucyA9IFtQYWdlTWl4aW5dO1xuICAgIGRhdGEgPSB7XG4gICAgICAgIHVwbG9hZEluZGV4OiAwLCAvL+S4iuS8oOeahOe8luWPt1xuICAgICAgICBpbWdVcGxvYWQ6ICcuLi9pbWFnZXMvYnRuX2FkZF9pbWcucG5nJyxcbiAgICAgICAgdXBsb2FkSXRlbXM6IFtdLCAvL+S4iuS8oOeahOWbvueJh+aVsOe7hFxuICAgICAgICB1cGxvYWRpbmc6IGZhbHNlIC8v5piv5ZCm5q2j5Zyo5LiK5LygXG4gICAgfTtcbiAgICBldmVudHMgPSB7IFxuICAgICAgJ2luZGV4LWJyb2FkY2FzdCc6ICguLi5hcmdzKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGFyZ3NbMF0sICdhcmdzWzBdJylcbiAgICAgICAgY29uc3QgaXRlbSA9IGFyZ3NbMF1bMF1cbiAgICAgICAgdGhpcy51cGxvYWRJdGVtcyA9IFt7aW1hZ2VVcmw6IGl0ZW0uaW1nMSwgdXBsb2FkVXJsOiBpdGVtLmltZzEsIGZpbGU6IGl0ZW0uaW1nMSwgdXBsb2FkZWQ6IHRydWV9LCB7aW1hZ2VVcmw6IGl0ZW0uaW1nMiwgZmlsZTogaXRlbS5pbWcyLCB1cGxvYWRlZDogdHJ1ZSwgdXBsb2FkVXJsOiBpdGVtLmltZzJ9LCB7aW1hZ2VVcmw6IGl0ZW0uaW1nMywgZmlsZTogaXRlbS5pbWczLCB1cGxvYWRlZDogdHJ1ZSwgdXBsb2FkVXJsOiBpdGVtLmltZzN9XVxuICAgICAgfVxuICAgIH1cbiAgICBtZXRob2RzID0ge1xuICAgICAgICBkZWxJbWcoZSkge1xuICAgICAgICAgIHRoaXMudXBsb2FkSXRlbXMuc3BsaWNlKGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4LCAxKVxuICAgICAgICB9LFxuICAgICAgICBwcmV2aWV3KGV2ZW50KSB7XG4gICAgICAgICAgbGV0IGN1cnJlbnRVcmwgPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuc3JjXG4gICAgICAgICAgd3gucHJldmlld0ltYWdlKHtcbiAgICAgICAgICAgIGN1cnJlbnQ6IGN1cnJlbnRVcmwsIC8vIOW9k+WJjeaYvuekuuWbvueJh+eahGh0dHDpk77mjqVcbiAgICAgICAgICAgIHVybHM6IFtjdXJyZW50VXJsXSAvLyDpnIDopoHpooTop4jnmoTlm77niYdodHRw6ZO+5o6l5YiX6KGoXG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgY2hvb3NlSW1hZ2UoZSkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgd3guY2hvb3NlSW1hZ2Uoe1xuICAgICAgICAgICAgICAgIGNvdW50OiAzLFxuICAgICAgICAgICAgICAgIHNpemVUeXBlOiBbJ29yaWdpbmFsJywgJ2NvbXByZXNzZWQnXSxcbiAgICAgICAgICAgICAgICBzb3VyY2VUeXBlOiBbJ2FsYnVtJywgJ2NhbWVyYSddLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRlbXBGaWxlUGF0aOWPr+S7peS9nOS4umltZ+agh+etvueahHNyY+WxnuaAp+aYvuekuuWbvueJh1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZW1wRmlsZVBhdGhzID0gcmVzLnRlbXBGaWxlUGF0aHM7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGVtcEZpbGVQYXRocy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi51cGxvYWRJdGVtcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogc2VsZi51cGxvYWRJbmRleCsrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IHRlbXBGaWxlUGF0aHNbaV0sIC8v55So5LqO55u05o6l5pi+56S6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3M6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkZWQ6IGZhbHNlLCAvL+aYr+WQpuS4iuS8oOWujOaIkFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEVycm9yOiBmYWxzZSwgLy/kuIrkvKDlpLHotKVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcnIC8v5LiK5Lyg5ZCO55qEVVJMXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZWxmLnN0YXJ0VXBsb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmYWlsKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd1cGxvYWQgZmFpbGVkOicsIGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgcHJldmlld0ltYWdlKGUpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvL1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvL+WQr+WKqOS4iuS8oO+8jOS4gOS4quS4gOS4quS4iuS8oO+8jFxuICAgIHN0YXJ0VXBsb2FkKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmIChzZWxmLnVwbG9hZGluZykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3VwbG9hZGluZy4uLicpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciB1cGxvYWRJdGVtID0gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxmLnVwbG9hZEl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IHNlbGYudXBsb2FkSXRlbXNbaV07XG4gICAgICAgICAgICBpZiAoaXRlbS5wcm9ncmVzcyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgdXBsb2FkSXRlbSA9IGl0ZW07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVwbG9hZEl0ZW0gIT0gbnVsbCkge1xuICAgICAgICAgICAgc2VsZi51cGxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgc2VsZlxuICAgICAgICAgICAgICAgIC51cGxvYWRGaWxlKHVwbG9hZEl0ZW0sIGZ1bmN0aW9uKHVwbG9hZEl0ZW0pe1xuICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXBsb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0udXBsb2FkZWQgPSB0cnVlOyAvL+agh+iusOS4iuS8oOaIkOWKn1xuICAgICAgICAgICAgICAgICAgICAvL3VwbG9hZEl0ZW0uaW1hZ2VVcmwg5bCx5piv5LiK5Lyg5ZCO55qE5YC8XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc3RhcnRVcGxvYWQoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaChlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkSXRlbS51cGxvYWRFcnJvciA9IGUubWVzc2FnZTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51cGxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zdGFydFVwbG9hZCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICBcblxuICAgICAgICAgICAvKiog5paw55qEIGdlbmVyYXRvciDlhpnms5VcbiAgICAgICAgICAgIHRoaXMuYXBwXG4gICAgICAgICAgICAgICAgLnVwbG9hZEZpbGUodXBsb2FkSXRlbSwgZnVuY3Rpb24odXBsb2FkSXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXBsb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0udXBsb2FkZWQgPSB0cnVlOyAvL+agh+iusOS4iuS8oOaIkOWKn1xuICAgICAgICAgICAgICAgICAgICAvL3VwbG9hZEl0ZW0uaW1hZ2VVcmwg5bCx5piv5LiK5Lyg5ZCO55qE5YC8XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgICAgLy8gc2VsZi5zdGFydFVwbG9hZCgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLnVwbG9hZEVycm9yID0gZS5tZXNzYWdlO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnVwbG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgICAgIC8vIHNlbGYuc3RhcnRVcGxvYWQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAqL1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLSAg5LiO5LiK5Lyg5pyN5Yqh5Zmo6L+b6KGM5Lqk5LqSIC0tLS0tLS0tLS0tXG4gICAgLyog5Lyg57uf5qih5byPcHJvbWlzZSDlhpnms5UgKi9cbiAgICB1cGxvYWRGaWxlKHVwbG9hZEl0ZW0sIGxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgd3guc2hvd0xvYWRpbmcoe1xuICAgICAgICAgIHRpdGxlOiAn5LiK5Lyg5LitLi4uJ1xuICAgICAgICB9KVxuICAgICAgICBjb25zb2xlLmxvZygnc3RhcnRVcGxvYWQ6JywgdXBsb2FkSXRlbS5pbmRleCk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBzZWxmXG4gICAgICAgICAgICAgICAgLl9uZXdVcGxvYWQoKVxuICAgICAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbmV3VXBsb2FkOicsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLnVwbG9hZFRva2VuID0gZGF0YS50b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkSXRlbS51cGxvYWRVcmwgPSBkYXRhLnVwbG9hZFVybDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3VwbG9hZEZpbGUodXBsb2FkSXRlbSwgbGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl91cGxvYWRRdWVyeUNoZWNrKHVwbG9hZEl0ZW0sbGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl91cGxvYWRRdWVyeVJlc3VsdCh1cGxvYWRJdGVtKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+S4iuS8oOe7k+adnzonLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgLy/kuIrkvKDnu5PmnZ9cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmlsZXMgJiYgZGF0YS5maWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW1hZ2VVcmwgPSBkYXRhLmZpbGVzWzBdLmltYWdlc1swXS51cmw7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5LiK5Lyg57uT5p6cOicgKyBpbWFnZVVybCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLmltYWdlVXJsID0gaW1hZ2VVcmw7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHVwbG9hZEl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi51cGxvYWRJdGVtcywgJzMzJylcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuJGVtaXQoJ3RvUGFyZW50MScsc2VsZi51cGxvYWRJdGVtcylcbiAgICAgICAgICAgICAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+S4iuS8oOWksei0pTonLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvL1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy/ojrflvpfkuIDkuKrkuIrkvKDlnLDlnYBcbiAgICAvL2h0dHBzOi8vc3RhdGljc2VydmljZS5leHRyZW1ldmFsdWUuY24vdXBsb2FkLmh0bWw/YXBwSWQ9cWpkXG4gICAgX25ld1VwbG9hZCgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdmFyIHVwbG9hZFVybCA9IHd4LmdldFN0b3JhZ2VTeW5jKCd1cGxvYWRVcmwnKSArICd1cGxvYWQuZG8nO1xuICAgICAgICAgICAgd3gucmVxdWVzdCh7XG4gICAgICAgICAgICAgICAgdXJsOiB1cGxvYWRVcmwsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ3VwbG9hZCcsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbWFnZScsXG4gICAgICAgICAgICAgICAgICAgIGFwcElkOiB3eC5nZXRTdG9yYWdlU3luYygndXBsb2FkQXBwSWQnKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGpzb24gPSByZXMuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2pzb24xMTExMScsanNvbilcbiAgICAgICAgICAgICAgICAgICAgaWYgKGpzb24uY29kZSA9PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoanNvbi5tZXNzYWdlcy5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yID0ganNvbi5tZXNzYWdlcy5lcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5uYW1lID0gZXJyb3IuY29kZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmFpbChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogJ3VwbG9hZF9lcnJvcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiByZXMuZXJyTXNnXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICBlLm5hbWUgPSBlcnJvci5jb2RlO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvL+S4iuS8oOaWh+S7tueahOWFt+S9k1xuICAgIF91cGxvYWRGaWxlKHVwbG9hZEl0ZW0sIGxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHVwbG9hZFRhc2sgPSB3eC51cGxvYWRGaWxlKHtcbiAgICAgICAgICAgICAgICB1cmw6IHVwbG9hZEl0ZW0udXBsb2FkVXJsLFxuICAgICAgICAgICAgICAgIGZpbGVQYXRoOiB1cGxvYWRJdGVtLmZpbGUsXG4gICAgICAgICAgICAgICAgbmFtZTogJ2ZpbGUnLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzQ29kZSAhPSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiAndXBsb2FkX2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSFRUUOmUmeivrzonICsgcmVzLnN0YXR1c0NvZGVcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHVwbG9hZEl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmYWlsKHJlcykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiAndXBsb2FkX2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHJlcy5lcnJNc2dcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8v55uR5o6n5LiK5Lyg6L+b5bqmXG4gICAgICAgICAgICB1cGxvYWRUYXNrLm9uUHJvZ3Jlc3NVcGRhdGUocmVzID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLnByb2dyZXNzID0gcmVzLnByb2dyZXNzO1xuICAgICAgICAgICAgICAgICAgICBpZiAodXBsb2FkSXRlbS5wcm9ncmVzcyA+IDk5KSB7XG4gICAgICAgICAgICB1cGxvYWRJdGVtLnByb2dyZXNzID0gOTk7XG4gICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcihzZWxmLCB1cGxvYWRJdGVtKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICBcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5LiK5Lyg6L+b5bqmJywgcmVzLnByb2dyZXNzKTtcbiAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygn5bey57uP5LiK5Lyg55qE5pWw5o2u6ZW/5bqmJywgcmVzLnRvdGFsQnl0ZXNTZW50KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICAgICAgJ+mihOacn+mcgOimgeS4iuS8oOeahOaVsOaNruaAu+mVv+W6picsXG4gICAgICAgICAgICAgICAgICAgIHJlcy50b3RhbEJ5dGVzRXhwZWN0ZWRUb1NlbmRcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyDnoa7orqTmnI3liqHlmajlt7Lnu4/mlLbliLDmiYDmnInmlbDmja5cbiAgX3VwbG9hZFF1ZXJ5Q2hlY2sodXBsb2FkSXRlbSxsaXN0ZW5lcikge1xuICAgIHZhciB1cGxvYWRVcmwgPSB1cGxvYWRJdGVtLnVwbG9hZFVybDtcbiAgICBmdW5jdGlvbiBjaGVja0ZpbmlzaGVkKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgd3gucmVxdWVzdCh7XG4gICAgICAgIHVybDogdXBsb2FkVXJsLFxuICAgICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgdmFyIGRhdGEgPSByZXMuZGF0YTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImNoZWNrIHVwbG9hZCBmaW5pc2hlZDpcIiwgZGF0YSk7XG4gICAgICAgICAgaWYgKGRhdGEuc3RhdHVzID09PSAnZmluaXNoJykge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVyICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgdXBsb2FkSXRlbS5wcm9ncmVzcyA9IDEwMDtcbiAgICAgICAgICAgICAgbGlzdGVuZXIodXBsb2FkSXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgY2hlY2tGaW5pc2hlZChyZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmYWlsOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgdmFyIGVycm9yID0ge1xuICAgICAgICAgICAgY29kZTogJ3VwbG9hZF9lcnJvcicsXG4gICAgICAgICAgICBtZXNzYWdlOiByZXMuZXJyTXNnXG4gICAgICAgICAgfTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcInF1ZXJ5IHNlcnZlciBlcnJvcix3aWxsIHJldHJ5OlwiLCBlcnJvcik7XG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjaGVja0ZpbmlzaGVkKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNoZWNrRmluaXNoZWQocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICB9KTtcbiAgfVxuICBfdXBsb2FkUXVlcnlSZXN1bHQodXBsb2FkSXRlbSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdmFyIHVwbG9hZFVybCA9IHd4LmdldFN0b3JhZ2VTeW5jKCd1cGxvYWRVcmwnKSArICd1cGxvYWQuZG8nO1xuICAgICAgd3gucmVxdWVzdCh7XG4gICAgICAgIHVybDogdXBsb2FkVXJsLFxuICAgICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgYWN0aW9uOiAncXVlcnknLFxuICAgICAgICAgIHRva2VuOiB1cGxvYWRJdGVtLnVwbG9hZFRva2VuXG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICB2YXIganNvbiA9IHJlcy5kYXRhO1xuICAgICAgICAgIGlmIChqc29uLmNvZGUgPT09IDIwMCkge1xuICAgICAgICAgICAgcmVzb2x2ZShqc29uLm1lc3NhZ2VzLmRhdGEpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBlcnJvciA9IGpzb24ubWVzc2FnZXMuZXJyb3I7XG4gICAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XG4gICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmYWlsOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgdmFyIGVycm9yID0ge1xuICAgICAgICAgICAgY29kZTogJ3VwbG9hZF9lcnJvcicsXG4gICAgICAgICAgICBtZXNzYWdlOiByZXMuZXJyTXNnXG4gICAgICAgICAgfTtcbiAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICBlLm5hbWUgPSBlcnJvci5jb2RlO1xuICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==