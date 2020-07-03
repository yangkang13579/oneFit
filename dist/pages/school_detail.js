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

var SchoolDetail = function (_wepy$page) {
    _inherits(SchoolDetail, _wepy$page);

    function SchoolDetail() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, SchoolDetail);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SchoolDetail.__proto__ || Object.getPrototypeOf(SchoolDetail)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
            navigationBarTitleText: '学校详情'
        }, _this.data = {
            isShade: false,
            isintor: true,
            currentIndex: 0,
            schoolId: '',
            schoolDetail: [],
            schoolResource: [],
            pageNum1: 1,
            istrue: true,
            totalPage: '',
            imgUrl: []
        }, _this.methods = {
            othersTap: function othersTap(e) {
                console.log(e);
                var self = this;
                self.id = e.currentTarget.dataset.id;
                self.typeId = e.currentTarget.dataset.typeid;
                self.downloadurl = e.currentTarget.dataset.downloadurl;
                this.fetchDataPromise('user/resourceInfo.do', {
                    resourceId: self.id

                }).then(function (data) {
                    console.log('走街口了 ', data);
                    self.$apply();
                });
                if (self.typeId === 'video' || self.typeId === 'class') {
                    console.log('2222');
                    wx.setStorageSync('video', self.downloadurl);
                    wx.navigateTo({
                        url: '/pages/movie'
                    });
                } else if (self.typeId === 'image') {
                    self.imgUrl.push(self.downloadurl);
                    wx.previewImage({
                        current: self.downloadurl,
                        urls: self.imgUrl
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
                }
                self.$apply();
            },
            look: function look() {
                wx.navigateTo({
                    url: '/pages/scheme_look'
                });
            },
            addSeart: function addSeart(e) {
                console.log(e);
                var self = this;
                self.id = e.currentTarget.dataset.id;
                this.fetchDataPromise('user/blueprintResourceInsert.do', {
                    resourceId: self.id
                }).then(function (data) {
                    console.log('资源 ', data);
                    // self.restList = data.items;
                    wx.showToast({
                        title: '添加成功',
                        icon: 'success',
                        duration: 2000
                    });
                    self.$apply();
                });
            },
            tabFun: function tabFun(index) {
                this.pageNum1 = 1;
                this.istrue = true;
                this.totalPage = '';
                console.log(index);
                this.schoolResource = [];
                var self = this;
                self.currentIndex = index;
                self.ontabFun();
                // if (self.currentIndex == 0) {
                //   this.fetchDataPromise('schoolInfo.do', {
                //       id: self.schoolId
                //     })
                //     .then(function(data) {
                //       self.schoolDetail = data.item;
                //       console.log('schoolInfo', self.schoolDetail);
                //       self.$apply();
                //     })
                // } else {
                //   this.fetchDataPromise('schoolResource.do', {
                //       schoolId: self.schoolId,
                //       pageNumber: self.pageNum1,
                //       pageSize: 10
                //     })
                //     .then(function(data) {
                //       // self.schoolResource = data.items;
                //       for (var i = 0; i < data.items.length; i++) {
                //         self.schoolResource.push(data.items[i]);
                //       }
                //       self.totalPage = data.items.totalPage;
                //       if (self.totalPage === self.pageNum1) {
                //         self.istrue = false;
                //       } else {
                //         self.istrue = true;
                //       }
                //       console.log('data', data);
                //       self.$apply();
                //     })
                // }
            },
            shade: function shade(e) {
                this.isShade = true;
                this.isintor = false;
            },
            intor: function intor(e) {
                this.isShade = false;
                this.isintor = true;
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(SchoolDetail, [{
        key: 'ontabFun',
        value: function ontabFun(index) {
            var self = this;
            if (index == 0) {
                this.fetchDataPromise('schoolInfo.do', {
                    id: self.schoolId
                }).then(function (data) {
                    self.schoolDetail = data.item;
                    console.log('schoolInfo', self.schoolDetail);
                    self.$apply();
                });
            } else {
                this.fetchDataPromise('schoolInfo.do', {
                    id: self.schoolId
                }).then(function (data) {
                    self.schoolDetail = data.item;
                    console.log('schoolInfo', self.schoolDetail);
                    self.$apply();
                });
                this.fetchDataPromise('schoolResource.do', {
                    schoolId: self.schoolId,
                    pageNumber: self.pageNum1,
                    pageSize: 10
                }).then(function (data) {
                    // self.schoolResource = data.items;
                    for (var i = 0; i < data.items.length; i++) {
                        self.schoolResource.push(data.items[i]);
                    }
                    self.totalPage = data.page.totalPage;
                    if (self.totalPage == self.pageNum1) {
                        self.istrue = false;
                    } else {
                        self.istrue = true;
                    }
                    console.log('data', data);
                    self.$apply();
                });
            }
        }
    }, {
        key: 'onReachBottom',
        value: function onReachBottom() {
            console.log('self.currentIndex', this.currentIndex);
            if (this.currentIndex == 1) {
                if (this.istrue == false) {
                    wx.showToast({
                        title: '已经没有数据啦',
                        icon: 'success',
                        duration: 2000
                    });
                } else {
                    this.pageNum1++;
                    console.log('this.pageNum1', this.pageNum1);
                    console.log('self.cc', this.currentIndex);
                    this.ontabFun(this.currentIndex);
                }
            } else {}
        }
    }, {
        key: 'onLoad',
        value: function onLoad(e) {
            console.log(e);
            this.schoolId = e.id;
            this.schoolResource = [];
        }
    }, {
        key: 'whenAppReadyShow',
        value: function whenAppReadyShow() {
            wx.removeStorageSync('video');
            var self = this;
            self.schoolResource = [];
            self.ontabFun(this.currentIndex);
            //   this.fetchDataPromise('schoolInfo.do', {
            //       id: self.schoolId
            //     })
            //     .then(function(data) {
            //       self.schoolDetail = data.item;
            //       console.log('schoolInfo', self.schoolDetail);
            //       self.$apply();
            //     })
            // }
        }
    }]);

    return SchoolDetail;
}(_wepy2.default.page);

exports.default = SchoolDetail;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjaG9vbF9kZXRhaWwuanMiXSwibmFtZXMiOlsiU2Nob29sRGV0YWlsIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsImRhdGEiLCJpc1NoYWRlIiwiaXNpbnRvciIsImN1cnJlbnRJbmRleCIsInNjaG9vbElkIiwic2Nob29sRGV0YWlsIiwic2Nob29sUmVzb3VyY2UiLCJwYWdlTnVtMSIsImlzdHJ1ZSIsInRvdGFsUGFnZSIsImltZ1VybCIsIm1ldGhvZHMiLCJvdGhlcnNUYXAiLCJlIiwiY29uc29sZSIsImxvZyIsInNlbGYiLCJpZCIsImN1cnJlbnRUYXJnZXQiLCJkYXRhc2V0IiwidHlwZUlkIiwidHlwZWlkIiwiZG93bmxvYWR1cmwiLCJmZXRjaERhdGFQcm9taXNlIiwicmVzb3VyY2VJZCIsInRoZW4iLCIkYXBwbHkiLCJ3eCIsInNldFN0b3JhZ2VTeW5jIiwibmF2aWdhdGVUbyIsInVybCIsInB1c2giLCJwcmV2aWV3SW1hZ2UiLCJjdXJyZW50IiwidXJscyIsImRvd25sb2FkRmlsZSIsInN1Y2Nlc3MiLCJyZXMiLCJmaWxlUGF0aCIsInRlbXBGaWxlUGF0aCIsIm9wZW5Eb2N1bWVudCIsImZhaWwiLCJsb29rIiwiYWRkU2VhcnQiLCJzaG93VG9hc3QiLCJ0aXRsZSIsImljb24iLCJkdXJhdGlvbiIsInRhYkZ1biIsImluZGV4Iiwib250YWJGdW4iLCJzaGFkZSIsImludG9yIiwiaXRlbSIsInBhZ2VOdW1iZXIiLCJwYWdlU2l6ZSIsImkiLCJpdGVtcyIsImxlbmd0aCIsInBhZ2UiLCJyZW1vdmVTdG9yYWdlU3luYyIsIndlcHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0U7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBQ3FCQSxZOzs7Ozs7Ozs7Ozs7OztzTUFDbkJDLE0sR0FBUyxDQUFDQyxjQUFELEMsUUFDVEMsTSxHQUFTO0FBQ0xDLG9DQUF3QjtBQURuQixTLFFBR1RDLEksR0FBTztBQUNI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eE55QzBELGVBQUtGLEk7O2tCQUExQmhFLFkiLCJmaWxlIjoic2Nob29sX2RldGFpbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4gIGltcG9ydCB3ZXB5IGZyb20gJ3dlcHknO1xyXG4gIGltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vbWl4aW5zL3BhZ2UnO1xyXG4gIGV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjaG9vbERldGFpbCBleHRlbmRzIHdlcHkucGFnZSB7XHJcbiAgICBtaXhpbnMgPSBbUGFnZU1peGluXTtcclxuICAgIGNvbmZpZyA9IHtcclxuICAgICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn5a2m5qCh6K+m5oOFJ1xyXG4gICAgfTtcclxuICAgIGRhdGEgPSB7XHJcbiAgICAgICAgaXNTaGFkZTogZmFsc2UsXHJcbiAgICAgICAgaXNpbnRvcjogdHJ1ZSxcclxuICAgICAgICBjdXJyZW50SW5kZXg6IDAsXHJcbiAgICAgICAgc2Nob29sSWQ6ICcnLFxyXG4gICAgICAgIHNjaG9vbERldGFpbDogW10sXHJcbiAgICAgICAgc2Nob29sUmVzb3VyY2U6IFtdLFxyXG4gICAgICAgIHBhZ2VOdW0xOiAxLFxyXG4gICAgICAgIGlzdHJ1ZTogdHJ1ZSxcclxuICAgICAgICB0b3RhbFBhZ2U6ICcnLFxyXG4gICAgICAgIGltZ1VybDogW11cclxuICAgIH07XHJcbiAgICBtZXRob2RzID0ge1xyXG4gICAgICAgIG90aGVyc1RhcChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHNlbGYuaWQgPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pZDtcclxuICAgICAgICAgICAgc2VsZi50eXBlSWQgPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC50eXBlaWQ7XHJcbiAgICAgICAgICAgIHNlbGYuZG93bmxvYWR1cmwgPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5kb3dubG9hZHVybDtcclxuICAgICAgICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKCd1c2VyL3Jlc291cmNlSW5mby5kbycsIHtcclxuICAgICAgICAgICAgICAgIHJlc291cmNlSWQ6IHNlbGYuaWQsXHJcbiAgXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+i1sOihl+WPo+S6hiAnLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnR5cGVJZCA9PT0gJ3ZpZGVvJyB8fCBzZWxmLnR5cGVJZCA9PT0gJ2NsYXNzJykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJzIyMjInKTtcclxuICAgICAgICAgICAgICAgIHd4LnNldFN0b3JhZ2VTeW5jKCd2aWRlbycsIHNlbGYuZG93bmxvYWR1cmwpO1xyXG4gICAgICAgICAgICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL3BhZ2VzL21vdmllJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZi50eXBlSWQgPT09ICdpbWFnZScpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuaW1nVXJsLnB1c2goc2VsZi5kb3dubG9hZHVybCk7XHJcbiAgICAgICAgICAgICAgICB3eC5wcmV2aWV3SW1hZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnQ6IHNlbGYuZG93bmxvYWR1cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsczogc2VsZi5pbWdVcmxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNlbGYudHlwZUlkID09PSAncHB0Jykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3BwcHBwcHQnKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZWxmLmRvd25sb2FkdXJsZWVlJywgc2VsZi5kb3dubG9hZHVybCk7XHJcbiAgICAgICAgICAgICAgICB3eC5kb3dubG9hZEZpbGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogc2VsZi5kb3dubG9hZHVybCxcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3Jlc3NzJywgcmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5maWxlUGF0aCA9IHJlcy50ZW1wRmlsZVBhdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHd4Lm9wZW5Eb2N1bWVudCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlUGF0aDogc2VsZi5maWxlUGF0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfmiZPlvIDmlofmoaPmiJDlip8nLCByZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfmiZPlvIDmlofmoaPlpLHotKUnLCByZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbG9vaygpIHtcclxuICAgICAgICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvc2NoZW1lX2xvb2snXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYWRkU2VhcnQoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBzZWxmLmlkID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaWQ7XHJcbiAgICAgICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgndXNlci9ibHVlcHJpbnRSZXNvdXJjZUluc2VydC5kbycsIHtcclxuICAgICAgICAgICAgICAgIHJlc291cmNlSWQ6IHNlbGYuaWQsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+i1hOa6kCAnLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzZWxmLnJlc3RMaXN0ID0gZGF0YS5pdGVtcztcclxuICAgICAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+a3u+WKoOaIkOWKnycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDIwMDBcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICB0YWJGdW4oaW5kZXgpIHtcclxuICAgICAgICAgICAgdGhpcy5wYWdlTnVtMSA9IDE7XHJcbiAgICAgICAgICAgIHRoaXMuaXN0cnVlID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy50b3RhbFBhZ2UgPSAnJztcclxuICAgICAgICAgICAgY29uc29sZS5sb2coaW5kZXgpO1xyXG4gICAgICAgICAgICB0aGlzLnNjaG9vbFJlc291cmNlID0gW107XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgc2VsZi5jdXJyZW50SW5kZXggPSBpbmRleDtcclxuICAgICAgICAgICAgc2VsZi5vbnRhYkZ1bigpO1xyXG4gICAgICAgIC8vIGlmIChzZWxmLmN1cnJlbnRJbmRleCA9PSAwKSB7XHJcbiAgICAgICAgLy8gICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3NjaG9vbEluZm8uZG8nLCB7XHJcbiAgICAgICAgLy8gICAgICAgaWQ6IHNlbGYuc2Nob29sSWRcclxuICAgICAgICAvLyAgICAgfSlcclxuICAgICAgICAvLyAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIC8vICAgICAgIHNlbGYuc2Nob29sRGV0YWlsID0gZGF0YS5pdGVtO1xyXG4gICAgICAgIC8vICAgICAgIGNvbnNvbGUubG9nKCdzY2hvb2xJbmZvJywgc2VsZi5zY2hvb2xEZXRhaWwpO1xyXG4gICAgICAgIC8vICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgLy8gICAgIH0pXHJcbiAgICAgICAgLy8gfSBlbHNlIHtcclxuICAgICAgICAvLyAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgnc2Nob29sUmVzb3VyY2UuZG8nLCB7XHJcbiAgICAgICAgLy8gICAgICAgc2Nob29sSWQ6IHNlbGYuc2Nob29sSWQsXHJcbiAgICAgICAgLy8gICAgICAgcGFnZU51bWJlcjogc2VsZi5wYWdlTnVtMSxcclxuICAgICAgICAvLyAgICAgICBwYWdlU2l6ZTogMTBcclxuICAgICAgICAvLyAgICAgfSlcclxuICAgICAgICAvLyAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIC8vICAgICAgIC8vIHNlbGYuc2Nob29sUmVzb3VyY2UgPSBkYXRhLml0ZW1zO1xyXG4gICAgICAgIC8vICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5pdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIC8vICAgICAgICAgc2VsZi5zY2hvb2xSZXNvdXJjZS5wdXNoKGRhdGEuaXRlbXNbaV0pO1xyXG4gICAgICAgIC8vICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICBzZWxmLnRvdGFsUGFnZSA9IGRhdGEuaXRlbXMudG90YWxQYWdlO1xyXG4gICAgICAgIC8vICAgICAgIGlmIChzZWxmLnRvdGFsUGFnZSA9PT0gc2VsZi5wYWdlTnVtMSkge1xyXG4gICAgICAgIC8vICAgICAgICAgc2VsZi5pc3RydWUgPSBmYWxzZTtcclxuICAgICAgICAvLyAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vICAgICAgICAgc2VsZi5pc3RydWUgPSB0cnVlO1xyXG4gICAgICAgIC8vICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICBjb25zb2xlLmxvZygnZGF0YScsIGRhdGEpO1xyXG4gICAgICAgIC8vICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgLy8gICAgIH0pXHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2hhZGUoZSkge1xyXG4gICAgICAgICAgICB0aGlzLmlzU2hhZGUgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmlzaW50b3IgPSBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGludG9yKGUpIHtcclxuICAgICAgICAgICAgdGhpcy5pc1NoYWRlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuaXNpbnRvciA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIG9udGFiRnVuKGluZGV4KSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGlmIChpbmRleCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgnc2Nob29sSW5mby5kbycsIHtcclxuICAgICAgICAgICAgICAgIGlkOiBzZWxmLnNjaG9vbElkXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zY2hvb2xEZXRhaWwgPSBkYXRhLml0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3NjaG9vbEluZm8nLCBzZWxmLnNjaG9vbERldGFpbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgnc2Nob29sSW5mby5kbycsIHtcclxuICAgICAgICAgICAgICAgIGlkOiBzZWxmLnNjaG9vbElkXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zY2hvb2xEZXRhaWwgPSBkYXRhLml0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3NjaG9vbEluZm8nLCBzZWxmLnNjaG9vbERldGFpbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3NjaG9vbFJlc291cmNlLmRvJywge1xyXG4gICAgICAgICAgICAgICAgc2Nob29sSWQ6IHNlbGYuc2Nob29sSWQsXHJcbiAgICAgICAgICAgICAgICBwYWdlTnVtYmVyOiBzZWxmLnBhZ2VOdW0xLFxyXG4gICAgICAgICAgICAgICAgcGFnZVNpemU6IDEwXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2VsZi5zY2hvb2xSZXNvdXJjZSA9IGRhdGEuaXRlbXM7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2Nob29sUmVzb3VyY2UucHVzaChkYXRhLml0ZW1zW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi50b3RhbFBhZ2UgPSBkYXRhLnBhZ2UudG90YWxQYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLnRvdGFsUGFnZSA9PSBzZWxmLnBhZ2VOdW0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaXN0cnVlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pc3RydWUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZGF0YScsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBvblJlYWNoQm90dG9tKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdzZWxmLmN1cnJlbnRJbmRleCcsIHRoaXMuY3VycmVudEluZGV4KTtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50SW5kZXggPT0gMSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc3RydWUgPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICflt7Lnu4/msqHmnInmlbDmja7llaYnLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb246ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjAwMFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2VOdW0xKys7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGhpcy5wYWdlTnVtMScsIHRoaXMucGFnZU51bTEpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlbGYuY2MnLCB0aGlzLmN1cnJlbnRJbmRleCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9udGFiRnVuKHRoaXMuY3VycmVudEluZGV4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7fVxyXG4gIH1cclxuICAgIG9uTG9hZChlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgdGhpcy5zY2hvb2xJZCA9IGUuaWQ7XHJcbiAgICAgICAgdGhpcy5zY2hvb2xSZXNvdXJjZSA9IFtdO1xyXG4gICAgfVxyXG4gICAgd2hlbkFwcFJlYWR5U2hvdygpIHtcclxuICAgICAgICB3eC5yZW1vdmVTdG9yYWdlU3luYygndmlkZW8nKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5zY2hvb2xSZXNvdXJjZSA9IFtdO1xyXG4gICAgICAgIHNlbGYub250YWJGdW4odGhpcy5jdXJyZW50SW5kZXgpO1xyXG4gICAgLy8gICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3NjaG9vbEluZm8uZG8nLCB7XHJcbiAgICAvLyAgICAgICBpZDogc2VsZi5zY2hvb2xJZFxyXG4gICAgLy8gICAgIH0pXHJcbiAgICAvLyAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgLy8gICAgICAgc2VsZi5zY2hvb2xEZXRhaWwgPSBkYXRhLml0ZW07XHJcbiAgICAvLyAgICAgICBjb25zb2xlLmxvZygnc2Nob29sSW5mbycsIHNlbGYuc2Nob29sRGV0YWlsKTtcclxuICAgIC8vICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAvLyAgICAgfSlcclxuICAgIC8vIH1cclxuICB9XHJcbiAgfVxyXG4iXX0=