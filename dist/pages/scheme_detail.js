'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _page = require('./../mixins/page.js');

var _page2 = _interopRequireDefault(_page);

var _app = require('./../lib/app.js');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/* global wx */


// import Tabbar from '../components/tabbar';
var SchemeDetail = function (_wepy$page) {
    _inherits(SchemeDetail, _wepy$page);

    function SchemeDetail() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, SchemeDetail);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SchemeDetail.__proto__ || Object.getPrototypeOf(SchemeDetail)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
            navigationBarBackgroundColor: '#000000',
            navigationBarTitleText: '方案查看'
        }, _this.components = {
            // tabbar: Tabbar
        }, _this.data = {
            blueprintId: '',
            loadUser: true, // 需要登录信息
            showTag: null,
            detailList: [],
            resList: [],
            currentIndex: null,
            resourceId: '',
            passId: '',
            id: '',
            downloadurl: '',
            imgUrl: [],
            dond: '',
            fileType: '',
            typeId: '',
            downloadUrlzone: ''
        }, _this.methods = {
            // 整体方案下载
            onDone: function onDone(e) {
                console.log(e);
                var self = this;
                self.dond = e.currentTarget.dataset.dond;
                this.fetchDataPromise('user/blueprintInfoDownload.do', {
                    blueprintId: self.dond
                }).then(function (data) {
                    console.log('总方案 ', data);
                    self.downloadUrlzone = data.downloadUrl;
                    console.log('xxxxxx', self.downloadUrlzone);
                    wx.downloadFile({
                        url: self.downloadUrlzone,
                        success: function success(res) {
                            console.log('resss', res);
                            self.filePath = res.tempFilePath;
                            wx.openDocument({
                                filePath: self.filePath,
                                success: function success(res) {
                                    console.log('打开文档成功', res);
                                },
                                fail: function fail(res) {
                                    console.log('打开文档失败', res);
                                }
                            });
                        }
                    });
                    // wx.downloadFile({
                    //   url: self.downloadUrlzone,
                    //      success: function(res) {
                    //     console.log("resss", res)
                    //     self.filePath = res.tempFilePath;
                    //     wx.openDocument({
                    //       filePath: self.filePath,
                    //       success: function(res) {
                    //         console.log('打开文档成功', res)
                    //       },
                    //       fail: function(res) {
                    //         console.log('打开文档失败', res)
                    //       }
                    //     })
                    //     wx.saveFile({
                    //       tempFilePath: self.filePath,
                    //       success: function(res) {
                    //         console.log('res', res.savedFilePath)
                    //         wx.showToast({
                    //           title: '方案下载成功',
                    //           icon: 'success',
                    //           duration: 2000
                    //         })
                    //       }
                    //     })
                    //   },
                    //   fail: function(res) {
                    //     console.log('下载文档失败', res)
                    //   }
                    // })
                    self.$apply();
                });
            },

            // 单个下载
            onDown: function onDown(e) {
                var self = this;
                console.log(e);
                self.typeId = e.currentTarget.dataset.typeid;
                self.downloadurl = e.currentTarget.dataset.downloadurl;
                self.fileType = e.currentTarget.dataset.filetype;
                console.log('self.fileType', self.fileType);
                console.log('self.typeId', self.typeId);
                if (self.typeId == 'image') {
                    wx.downloadFile({
                        url: self.downloadurl,
                        success: function success(res) {
                            console.log('ressss', res);
                            wx.saveImageToPhotosAlbum({
                                filePath: res.tempFilePath,
                                success: function success(result) {
                                    console.log(result);
                                }
                            });
                            wx.saveFile({
                                tempFilePath: res.tempFilePath,
                                success: function success(res) {
                                    console.log(res.savedFilePath);
                                    wx.showToast({
                                        title: '图片下载成功',
                                        icon: 'success',
                                        duration: 2000
                                    });
                                }
                            });
                        }
                    });
                } else if (self.typeId == 'class' || self.typeId == 'video') {
                    wx.showToast({
                        title: '视频不支持下载噢',
                        icon: 'success',
                        duration: 2000
                    });
                } else {
                    wx.downloadFile({
                        url: self.downloadurl,
                        success: function success(res) {
                            console.log('ccc', res);
                            self.filePath = res.tempFilePath;
                            wx.saveFile({
                                tempFilePath: res.tempFilePath,
                                success: function success(res) {
                                    console.log(res.savedFilePath);
                                    wx.showToast({
                                        title: '文件下载成功',
                                        icon: 'success',
                                        duration: 2000
                                    });
                                    wx.getSavedFileList({
                                        success: function success(res) {
                                            console.log('zzz', res.fileList);
                                        }
                                    });
                                }
                            });
                            // wx.openDocument({
                            //   filePath: self.filePath,
                            //   fileType: self.fileType,
                            //   success: function(res) {
                            //     console.log('打开文档成功', res)
                            //   },
                            //   fail: function(res) {
                            //     console.log('打开文档失败', res)
                            //   }
                            // })
                        },
                        fail: function fail(res) {
                            console.log('下载文档失败', res);
                        }
                    });
                }
                self.$apply();
            },
            othersTap: function othersTap(e) {
                console.log(e);
                var self = this;
                self.typeId = e.currentTarget.dataset.typeid;
                self.downloadurl = e.currentTarget.dataset.downloadurl;
                self.resourceId = e.currentTarget.dataset.id;
                this.fetchDataPromise('user/resourceInfo.do', {
                    resourceId: self.resourceId
                }).then(function (data) {
                    console.log('预览22 ', data);
                    self.$apply();
                });
                if (self.typeId === 'video' || self.typeId === 'class') {
                    console.log('2222');
                    self.downloadurl = e.currentTarget.dataset.downloadurl;
                    wx.setStorageSync('video', self.downloadurl);
                    wx.navigateTo({
                        url: '/pages/movie'
                    });
                } else if (self.typeId === 'ppt') {
                    console.log('ppppppt');
                    console.log('self.downloadurleee', self.downloadurl);
                    wx.downloadFile({
                        url: self.downloadurl,
                        success: function success(res) {
                            console.log('resss', res);
                            self.filePath = res.tempFilePath;
                            wx.openDocument({
                                filePath: self.filePath,
                                success: function success(res) {
                                    console.log('打开文档成功', res);
                                },
                                fail: function fail(res) {
                                    console.log('打开文档失败', res);
                                }
                            });
                        }
                    });
                } else if (self.typeId === 'image') {
                    self.imgUrl.push(self.downloadurl);
                    wx.previewImage({
                        current: self.downloadurl,
                        urls: self.imgUrl
                    });
                }
                self.$apply();
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(SchemeDetail, [{
        key: 'onLoad',
        value: function onLoad(e) {
            console.log('333', e);
            this.blueprintId = e.blueprintId;
            this.$apply();
        }
    }, {
        key: 'whenAppReadyShow',
        value: function whenAppReadyShow() {
            wx.removeStorageSync('video');
            var self = this;
            this.fetchDataPromise('user/blueprintInfo.do', {
                blueprintId: self.blueprintId
            }).then(function (data) {
                console.log('hao ', data);
                self.detailList = data.blueprint;
                console.log('self.detailList', self.detailList);
                self.passId = data.blueprint.id;
                // self.resList = self.detailList.resources;
                self.$apply();
            });
        }
    }, {
        key: 'onShareAppMessage',
        value: function onShareAppMessage(res) {
            return this.whenAppShare({
                title: '安全教育资源地图'
            });
        }
    }, {
        key: 'onShareAppMessage',
        value: function onShareAppMessage() {
            var self = this;
            return {
                title: self.detailList.catalogName,
                path: 'pages/share?blueprintId=' + self.blueprintId,
                success: function success(res) {
                    // 转发成功
                    console.log('转发成功');
                },
                fail: function fail(res) {
                    // 转发失败
                }
            };
        }
    }, {
        key: 'regionchange',
        value: function regionchange(e) {
            console.log(e.type);
        }
    }, {
        key: 'markertap',
        value: function markertap(e) {
            console.log(e.markerId);
        }
    }, {
        key: 'controltap',
        value: function controltap(e) {
            console.log(e.controlId);
        }
    }]);

    return SchemeDetail;
}(_wepy2.default.page);

exports.default = SchemeDetail;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjaGVtZV9kZXRhaWwuanMiXSwibmFtZXMiOlsiU2NoZW1lRGV0YWlsIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJjb21wb25lbnRzIiwiZGF0YSIsImJsdWVwcmludElkIiwibG9hZFVzZXIiLCJzaG93VGFnIiwiZGV0YWlsTGlzdCIsInJlc0xpc3QiLCJjdXJyZW50SW5kZXgiLCJyZXNvdXJjZUlkIiwicGFzc0lkIiwiaWQiLCJkb3dubG9hZHVybCIsImltZ1VybCIsImRvbmQiLCJmaWxlVHlwZSIsInR5cGVJZCIsImRvd25sb2FkVXJsem9uZSIsIm1ldGhvZHMiLCJvbkRvbmUiLCJlIiwiY29uc29sZSIsImxvZyIsInNlbGYiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YXNldCIsImZldGNoRGF0YVByb21pc2UiLCJ0aGVuIiwiZG93bmxvYWRVcmwiLCJ3eCIsImRvd25sb2FkRmlsZSIsInVybCIsInN1Y2Nlc3MiLCJyZXMiLCJmaWxlUGF0aCIsInRlbXBGaWxlUGF0aCIsIm9wZW5Eb2N1bWVudCIsImZhaWwiLCIkYXBwbHkiLCJvbkRvd24iLCJ0eXBlaWQiLCJmaWxldHlwZSIsInNhdmVJbWFnZVRvUGhvdG9zQWxidW0iLCJyZXN1bHQiLCJzYXZlRmlsZSIsInNhdmVkRmlsZVBhdGgiLCJzaG93VG9hc3QiLCJ0aXRsZSIsImljb24iLCJkdXJhdGlvbiIsImdldFNhdmVkRmlsZUxpc3QiLCJmaWxlTGlzdCIsIm90aGVyc1RhcCIsInNldFN0b3JhZ2VTeW5jIiwibmF2aWdhdGVUbyIsInB1c2giLCJwcmV2aWV3SW1hZ2UiLCJjdXJyZW50IiwidXJscyIsInJlbW92ZVN0b3JhZ2VTeW5jIiwiYmx1ZXByaW50Iiwid2hlbkFwcFNoYXJlIiwiY2F0YWxvZ05hbWUiLCJwYXRoIiwidHlwZSIsIm1hcmtlcklkIiwiY29udHJvbElkIiwid2VweSIsInBh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QVQsRUFBYztBQUNuQjtBQUNBWiw0QkFBUUMsR0FBUixDQUFZLE1BQVo7QUFDSCxpQkFORTtBQU9IZSxzQkFBTSxjQUFTSixHQUFULEVBQWM7QUFDaEI7QUFDSDtBQVRFLGFBQVA7QUFXSDs7O3FDQUNZYixDLEVBQUc7QUFDWkMsb0JBQVFDLEdBQVIsQ0FBWUYsRUFBRTRDLElBQWQ7QUFDSDs7O2tDQUNTNUMsQyxFQUFHO0FBQ1RDLG9CQUFRQyxHQUFSLENBQVlGLEVBQUU2QyxRQUFkO0FBQ0g7OzttQ0FDVTdDLEMsRUFBRztBQUNWQyxvQkFBUUMsR0FBUixDQUFZRixFQUFFOEMsU0FBZDtBQUNIOzs7O0VBdlF1Q0MsZUFBS0MsSTs7a0JBQTFCekUsWSIsImZpbGUiOiJzY2hlbWVfZGV0YWlsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbiAgLyogZ2xvYmFsIHd4ICovXHJcbiAgaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XHJcbiAgaW1wb3J0IFBhZ2VNaXhpbiBmcm9tICcuLi9taXhpbnMvcGFnZSc7XHJcbiAgaW1wb3J0IGFwcCBmcm9tICcuLi9saWIvYXBwJztcclxuICAvLyBpbXBvcnQgVGFiYmFyIGZyb20gJy4uL2NvbXBvbmVudHMvdGFiYmFyJztcclxuICBleHBvcnQgZGVmYXVsdCBjbGFzcyBTY2hlbWVEZXRhaWwgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gICAgbWl4aW5zID0gW1BhZ2VNaXhpbl07XHJcbiAgICBjb25maWcgPSB7XHJcbiAgICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyMwMDAwMDAnLFxyXG4gICAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfmlrnmoYjmn6XnnIsnXHJcbiAgICB9O1xyXG4gICAgY29tcG9uZW50cyA9IHtcclxuICAgICAgICAvLyB0YWJiYXI6IFRhYmJhclxyXG4gICAgfTtcclxuICAgIGRhdGEgPSB7XHJcbiAgICAgICAgYmx1ZXByaW50SWQ6ICcnLFxyXG4gICAgICAgIGxvYWRVc2VyOiB0cnVlLCAvLyDpnIDopoHnmbvlvZXkv6Hmga9cclxuICAgICAgICBzaG93VGFnOiBudWxsLFxyXG4gICAgICAgIGRldGFpbExpc3Q6IFtdLFxyXG4gICAgICAgIHJlc0xpc3Q6IFtdLFxyXG4gICAgICAgIGN1cnJlbnRJbmRleDogbnVsbCxcclxuICAgICAgICByZXNvdXJjZUlkOiAnJyxcclxuICAgICAgICBwYXNzSWQ6ICcnLFxyXG4gICAgICAgIGlkOiAnJyxcclxuICAgICAgICBkb3dubG9hZHVybDogJycsXHJcbiAgICAgICAgaW1nVXJsOiBbXSxcclxuICAgICAgICBkb25kOiAnJyxcclxuICAgICAgICBmaWxlVHlwZTogJycsXHJcbiAgICAgICAgdHlwZUlkOiAnJyxcclxuICAgICAgICBkb3dubG9hZFVybHpvbmU6ICcnXHJcbiAgICB9XHJcbiAgICBtZXRob2RzID0ge1xyXG4gICAgICAgIC8vIOaVtOS9k+aWueahiOS4i+i9vVxyXG4gICAgICAgIG9uRG9uZShlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHNlbGYuZG9uZCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmRvbmQ7XHJcbiAgICAgICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgndXNlci9ibHVlcHJpbnRJbmZvRG93bmxvYWQuZG8nLCB7XHJcbiAgICAgICAgICAgICAgICBibHVlcHJpbnRJZDogc2VsZi5kb25kLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfmgLvmlrnmoYggJywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5kb3dubG9hZFVybHpvbmUgPSBkYXRhLmRvd25sb2FkVXJsO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd4eHh4eHgnLCBzZWxmLmRvd25sb2FkVXJsem9uZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgd3guZG93bmxvYWRGaWxlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBzZWxmLmRvd25sb2FkVXJsem9uZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncmVzc3MnLCByZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5maWxlUGF0aCA9IHJlcy50ZW1wRmlsZVBhdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3eC5vcGVuRG9jdW1lbnQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVQYXRoOiBzZWxmLmZpbGVQYXRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5omT5byA5paH5qGj5oiQ5YqfJywgcmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5omT5byA5paH5qGj5aSx6LSlJywgcmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHd4LmRvd25sb2FkRmlsZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICB1cmw6IHNlbGYuZG93bmxvYWRVcmx6b25lLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgwqDCoMKgc3VjY2VzczogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwicmVzc3NcIiwgcmVzKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBzZWxmLmZpbGVQYXRoID0gcmVzLnRlbXBGaWxlUGF0aDtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgd3gub3BlbkRvY3VtZW50KHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICBmaWxlUGF0aDogc2VsZi5maWxlUGF0aCxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKCfmiZPlvIDmlofmoaPmiJDlip8nLCByZXMpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICBmYWlsOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKCfmiZPlvIDmlofmoaPlpLHotKUnLCByZXMpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICB3eC5zYXZlRmlsZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgdGVtcEZpbGVQYXRoOiBzZWxmLmZpbGVQYXRoLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coJ3JlcycsIHJlcy5zYXZlZEZpbGVQYXRoKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgd3guc2hvd1RvYXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgdGl0bGU6ICfmlrnmoYjkuIvovb3miJDlip8nLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICBpY29uOiAnc3VjY2VzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgIGR1cmF0aW9uOiAyMDAwXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAvLyAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICBmYWlsOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ+S4i+i9veaWh+aho+Wksei0pScsIHJlcylcclxuICAgICAgICAgICAgICAgICAgICAvLyAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyB9KVxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIOWNleS4quS4i+i9vVxyXG4gICAgICAgIG9uRG93bihlKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgICAgIHNlbGYudHlwZUlkID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQudHlwZWlkO1xyXG4gICAgICAgICAgICBzZWxmLmRvd25sb2FkdXJsID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuZG93bmxvYWR1cmw7XHJcbiAgICAgICAgICAgIHNlbGYuZmlsZVR5cGUgPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5maWxldHlwZTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlbGYuZmlsZVR5cGUnLCBzZWxmLmZpbGVUeXBlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlbGYudHlwZUlkJywgc2VsZi50eXBlSWQpO1xyXG4gICAgICAgICAgICBpZiAoc2VsZi50eXBlSWQgPT0gJ2ltYWdlJykge1xyXG4gICAgICAgICAgICAgICAgd3guZG93bmxvYWRGaWxlKHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IHNlbGYuZG93bmxvYWR1cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZXNzc3MnLCByZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3eC5zYXZlSW1hZ2VUb1Bob3Rvc0FsYnVtKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVQYXRoOiByZXMudGVtcEZpbGVQYXRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzcyhyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3guc2F2ZUZpbGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEZpbGVQYXRoOiByZXMudGVtcEZpbGVQYXRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzLnNhdmVkRmlsZVBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5Zu+54mH5LiL6L295oiQ5YqfJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjAwMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxmLnR5cGVJZCA9PSAnY2xhc3MnIHx8IHNlbGYudHlwZUlkID09ICd2aWRlbycpIHtcclxuICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfop4bpopHkuI3mlK/mjIHkuIvovb3lmaInLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb246ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjAwMFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3eC5kb3dubG9hZEZpbGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogc2VsZi5kb3dubG9hZHVybCxcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NjYycsIHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZmlsZVBhdGggPSByZXMudGVtcEZpbGVQYXRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3eC5zYXZlRmlsZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wRmlsZVBhdGg6IHJlcy50ZW1wRmlsZVBhdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMuc2F2ZWRGaWxlUGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfmlofku7bkuIvovb3miJDlip8nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnc3VjY2VzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyMDAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3guZ2V0U2F2ZWRGaWxlTGlzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3p6eicsIHJlcy5maWxlTGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHd4Lm9wZW5Eb2N1bWVudCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgZmlsZVBhdGg6IHNlbGYuZmlsZVBhdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgZmlsZVR5cGU6IHNlbGYuZmlsZVR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZygn5omT5byA5paH5qGj5oiQ5YqfJywgcmVzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgZmFpbDogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZygn5omT5byA5paH5qGj5aSx6LSlJywgcmVzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSlcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5LiL6L295paH5qGj5aSx6LSlJywgcmVzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb3RoZXJzVGFwKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgc2VsZi50eXBlSWQgPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC50eXBlaWQ7XHJcbiAgICAgICAgICAgIHNlbGYuZG93bmxvYWR1cmwgPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5kb3dubG9hZHVybDtcclxuICAgICAgICAgICAgc2VsZi5yZXNvdXJjZUlkID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaWQ7XHJcbiAgICAgICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgndXNlci9yZXNvdXJjZUluZm8uZG8nLCB7XHJcbiAgICAgICAgICAgICAgICByZXNvdXJjZUlkOiBzZWxmLnJlc291cmNlSWQsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+mihOiniDIyICcsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKHNlbGYudHlwZUlkID09PSAndmlkZW8nIHx8IHNlbGYudHlwZUlkID09PSAnY2xhc3MnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnMjIyMicpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5kb3dubG9hZHVybCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmRvd25sb2FkdXJsO1xyXG4gICAgICAgICAgICAgICAgd3guc2V0U3RvcmFnZVN5bmMoJ3ZpZGVvJywgc2VsZi5kb3dubG9hZHVybCk7XHJcbiAgICAgICAgICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvbW92aWUnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxmLnR5cGVJZCA9PT0gJ3BwdCcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwcHBwcHB0Jyk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc2VsZi5kb3dubG9hZHVybGVlZScsIHNlbGYuZG93bmxvYWR1cmwpO1xyXG4gICAgICAgICAgICAgICAgd3guZG93bmxvYWRGaWxlKHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IHNlbGYuZG93bmxvYWR1cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZXNzcycsIHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZmlsZVBhdGggPSByZXMudGVtcEZpbGVQYXRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3eC5vcGVuRG9jdW1lbnQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVBhdGg6IHNlbGYuZmlsZVBhdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5omT5byA5paH5qGj5oiQ5YqfJywgcmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWlsOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5omT5byA5paH5qGj5aSx6LSlJywgcmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZi50eXBlSWQgPT09ICdpbWFnZScpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuaW1nVXJsLnB1c2goc2VsZi5kb3dubG9hZHVybCk7XHJcbiAgICAgICAgICAgICAgICB3eC5wcmV2aWV3SW1hZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnQ6IHNlbGYuZG93bmxvYWR1cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsczogc2VsZi5pbWdVcmxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbiAgICBvbkxvYWQoZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCczMzMnLCBlKTtcclxuICAgICAgICB0aGlzLmJsdWVwcmludElkID0gZS5ibHVlcHJpbnRJZDtcclxuICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgfVxyXG4gICAgd2hlbkFwcFJlYWR5U2hvdygpIHtcclxuICAgICAgICB3eC5yZW1vdmVTdG9yYWdlU3luYygndmlkZW8nKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKCd1c2VyL2JsdWVwcmludEluZm8uZG8nLCB7XHJcbiAgICAgICAgICAgIGJsdWVwcmludElkOiBzZWxmLmJsdWVwcmludElkLFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdoYW8gJywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmRldGFpbExpc3QgPSBkYXRhLmJsdWVwcmludDtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZWxmLmRldGFpbExpc3QnLCBzZWxmLmRldGFpbExpc3QpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wYXNzSWQgPSBkYXRhLmJsdWVwcmludC5pZDtcclxuICAgICAgICAgICAgICAgIC8vIHNlbGYucmVzTGlzdCA9IHNlbGYuZGV0YWlsTGlzdC5yZXNvdXJjZXM7XHJcbiAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIG9uU2hhcmVBcHBNZXNzYWdlKHJlcykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLndoZW5BcHBTaGFyZSh7XHJcbiAgICAgICAgICAgIHRpdGxlOiAn5a6J5YWo5pWZ6IKy6LWE5rqQ5Zyw5Zu+J1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgb25TaGFyZUFwcE1lc3NhZ2UoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHRpdGxlOiBzZWxmLmRldGFpbExpc3QuY2F0YWxvZ05hbWUsXHJcbiAgICAgICAgICAgIHBhdGg6ICdwYWdlcy9zaGFyZT9ibHVlcHJpbnRJZD0nICsgc2VsZi5ibHVlcHJpbnRJZCxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAvLyDovazlj5HmiJDlip9cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfovazlj5HmiJDlip8nKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZmFpbDogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAvLyDovazlj5HlpLHotKVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICByZWdpb25jaGFuZ2UoZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGUudHlwZSk7XHJcbiAgICB9XHJcbiAgICBtYXJrZXJ0YXAoZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGUubWFya2VySWQpO1xyXG4gICAgfVxyXG4gICAgY29udHJvbHRhcChlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZS5jb250cm9sSWQpO1xyXG4gICAgfVxyXG4gIH1cclxuIl19