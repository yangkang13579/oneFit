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


var SearchResult = function (_wepy$page) {
    _inherits(SearchResult, _wepy$page);

    function SearchResult() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, SearchResult);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SearchResult.__proto__ || Object.getPrototypeOf(SearchResult)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
            navigationBarTitleText: '搜索结果'
        }, _this.components = {
            // tabbar: Tabbar
        }, _this.data = {
            currentIndex: 0,
            loadUser: true, // 需要登录信息
            inputData: "",
            schoolId: "",
            id: '',
            catalogId: '',
            filePath: "",
            blueprintId: "",
            downloadurl: "",
            pageNumber1: 1,
            pageNumber2: 1,
            lastPage1: false,
            lastPage2: false,
            restList: [],
            schoolList: [],
            imgUrl: []
        }, _this.methods = {
            othersTap: function othersTap(e) {
                console.log(e);
                var self = this;
                self.typeId = e.currentTarget.dataset.typeid;
                self.downloadurl = e.currentTarget.dataset.downloadurl;
                self.blueprintId = e.currentTarget.dataset.id;
                this.fetchDataPromise('user/resourceInfo.do', {
                    resourceId: self.blueprintId
                }).then(function (data) {
                    console.log('预览22 ', data);
                    self.$apply();
                });
                if (self.typeId === "video" || self.typeId === "class") {
                    console.log("2222");
                    wx.setStorageSync('video', self.downloadurl);
                    wx.navigateTo({
                        url: '/pages/movie'
                    });
                } else if (self.typeId === "image") {
                    self.imgUrl.push(self.downloadurl);
                    wx.previewImage({
                        current: self.downloadurl,
                        urls: self.imgUrl
                    });
                } else if (self.typeId === "ppt") {
                    console.log("ppppppt");
                    console.log("self.downloadurleee", self.downloadurl);
                    wx.downloadFile({
                        url: self.downloadurl,
                        success: function success(res) {
                            console.log("resss", res);
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
            schoolDetail: function schoolDetail(e) {
                var self = this;
                console.log(e);
                var self = this;
                console.log(e);
                self.id = e.currentTarget.dataset.id;
                wx.navigateTo({
                    url: '/pages/school_detail?id=' + self.id
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
            look: function look(e) {
                // console.log(e)
                // var self = this;
                // self.resourceId = e.currentTarget.dataset.id;
                // wx.navigateTo({
                //     url: '/pages/scheme_look?resourceId=' + self.resourceId
                // });
                wx.navigateTo({
                    url: '/pages/scheme_look'
                });
            },
            tabFun: function tabFun(index) {
                console.log(index + '=========================');
                this.pageNumber1 = 1;
                this.pageNumber2 = 1;
                this.lastPage1 = false;
                this.lastPage2 = false;
                this.restList = [];
                this.schoolList = [];
                var self = this;
                self.currentIndex = index;
                console.log(self.currentIndex);
                self.searchFun(self.currentIndex);
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(SearchResult, [{
        key: 'searchFun',
        value: function searchFun(index) {
            var self = this;

            if (index == 0) {

                console.log(self.pageNumber1);
                this.fetchDataPromise('schoolSearch.do', {
                    k: self.inputData,
                    pageNumber: self.pageNumber1,
                    pageSize: 10,
                    catalogId: self.catalogId
                }).then(function (data) {
                    for (var i = 0; i < data.items.length; i++) {
                        self.schoolList.push(data.items[i]);
                    }
                    console.log(self.schoolList);
                    self.$apply();
                    if (data.page.totalPage === self.pageNumber1) self.lastPage1 = true;
                    // self.schoolList = data.items;
                });
            } else {
                this.fetchDataPromise('resourceSearch.do', {
                    k: self.inputData,
                    pageNumber: self.pageNumber2,
                    pageSize: 10,
                    catalogId: self.catalogId
                }).then(function (data) {
                    console.log('资源 ', data);
                    for (var i = 0; i < data.items.length; i++) {
                        self.restList.push(data.items[i]);
                    }
                    if (data.page.totalPage === self.pageNumber2) self.lastPage2 = true;
                    // self.schoolList = data.items;
                    self.$apply();
                });
            }
        }
    }, {
        key: 'onLoad',
        value: function onLoad(e) {
            console.log(e);
            this.inputData = e.k;
            this.catalogId = e.catalogId;
            this.pageNumber1 = 1;
            this.pageNumber2 = 1;
            this.lastPage1 = false;
            this.lastPage2 = false;
            this.restList = [];
            this.schoolList = [];
        }
    }, {
        key: 'onReachBottom',
        value: function onReachBottom() {
            console.log(this.pageNumber1 + '-------------------');
            if (this.currentIndex === 0 || this.currentIndex === '0') {
                this.pageNumber1++;
                if (this.lastPage1 === false) this.searchFun(this.currentIndex);
            } else {
                this.pageNumber2++;
                if (this.lastPage2 === false) this.searchFun(this.currentIndex);
            }
        }
    }, {
        key: 'whenAppReadyShow',
        value: function whenAppReadyShow() {

            this.pageNumber1 = 1;
            this.pageNumber2 = 1;
            this.lastPage1 = false;
            this.lastPage2 = false;
            this.restList = [];
            this.schoolList = [];
            wx.removeStorageSync("video");
            wx.removeStorageSync("inputvalue");
            wx.removeStorageSync("showTag");
            var self = this;
            if (self.inputData === null) {
                self.whenParamError();
                return;
            } else {
                this.searchFun(this.currentIndex);
            }
        }
    }]);

    return SearchResult;
}(_wepy2.default.page);

exports.default = SearchResult;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlYXJjaF9yZXN1bHQuanMiXSwibmFtZXMiOlsiU2VhcmNoUmVzdWx0IiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsImNvbXBvbmVudHMiLCJkYXRhIiwiY3VycmVudEluZGV4IiwibG9hZFVzZXIiLCJpbnB1dERhdGEiLCJzY2hvb2xJZCIsImlkIiwiY2F0YWxvZ0lkIiwiZmlsZVBhdGgiLCJibHVlcHJpbnRJZCIsImRvd25sb2FkdXJsIiwicGFnZU51bWJlcjEiLCJwYWdlTnVtYmVyMiIsImxhc3RQYWdlMSIsImxhc3RQYWdlMiIsInJlc3RMaXN0Iiwic2Nob29sTGlzdCIsImltZ1VybCIsIm1ldGhvZHMiLCJvdGhlcnNUYXAiLCJlIiwiY29uc29sZSIsImxvZyIsInNlbGYiLCJ0eXBlSWQiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YXNldCIsInR5cGVpZCIsImZldGNoRGF0YVByb21pc2UiLCJyZXNvdXJjZUlkIiwidGhlbiIsIiRhcHBseSIsInd4Iiwic2V0U3RvcmFnZVN5bmMiLCJuYXZpZ2F0ZVRvIiwidXJsIiwicHVzaCIsInByZXZpZXdJbWFnZSIsImN1cnJlbnQiLCJ1cmxzIiwiZG93bmxvYWRGaWxlIiwic3VjY2VzcyIsInJlcyIsInRlbXBGaWxlUGF0aCIsIm9wZW5Eb2N1bWVudCIsImZhaWwiLCJzY2hvb2xEZXRhaWwiLCJhZGRTZWFydCIsInNob3dUb2FzdCIsInRpdGxlIiwiaWNvbiIsImR1cmF0aW9uIiwibG9vayIsInRhYkZ1biIsImluZGV4Iiwic2VhcmNoRnVuIiwiayIsInBhZ2VOdW1iZXIiLCJwYWdlU2l6ZSIsImkiLCJpdGVtcyIsImxlbmd0aCIsInBhZ2UiLCJ0b3RhbFBhZ2UiLCJyZW1vdmVTdG9yYWdlU3luYyIsIndoZW5QYXJhbUVycm9yIiwid2VweSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFSTs7OztBQUNBOzs7Ozs7Ozs7OztBQUZBOzs7SUFHcUJBLFk7Ozs7Ozs7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LFdBQUwsR0FBbUIscUJBQS9CO0FBQ0EsZ0JBQUksS0FBS1QsWUFBTCxLQUFzQixDQUF0QixJQUEyQixLQUFLQSxZQUFMLEtBQXNCLEdBQXJELEVBQTBEO0FBQ3RELHFCQUFLUyxXQUFMO0FBQ0ksb0JBQUksS0FBS0UsU0FBTCxLQUFtQixLQUF2QixFQUE4QixLQUFLMEMsU0FBTCxDQUFlLEtBQUtyRCxZQUFwQjtBQUNyQyxhQUhELE1BR087QUFDSCxxQkFBS1UsV0FBTDtBQUNJLG9CQUFJLEtBQUtFLFNBQUwsS0FBbUIsS0FBdkIsRUFBOEIsS0FBS3lDLFNBQUwsQ0FBZSxLQUFLckQsWUFBcEI7QUFDckM7QUFDSjs7OzJDQUNrQjs7QUFFZixpQkFBS1MsV0FBTCxHQUFtQixDQUFuQjtBQUNBLGlCQUFLQyxXQUFMLEdBQW1CLENBQW5CO0FBQ0EsaUJBQUtDLFNBQUwsR0FBaUIsS0FBakI7QUFDQSxpQkFBS0MsU0FBTCxHQUFpQixLQUFqQjtBQUNBLGlCQUFLQyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0EsaUJBQUtDLFVBQUwsR0FBa0IsRUFBbEI7QUFDQWdCLGVBQUdnQyxpQkFBSCxDQUFxQixPQUFyQjtBQUNBaEMsZUFBR2dDLGlCQUFILENBQXFCLFlBQXJCO0FBQ0FoQyxlQUFHZ0MsaUJBQUgsQ0FBcUIsU0FBckI7QUFDQSxnQkFBSXpDLE9BQU8sSUFBWDtBQUNBLGdCQUFJQSxLQUFLbkIsU0FBTCxLQUFtQixJQUF2QixFQUE2QjtBQUN6Qm1CLHFCQUFLMEMsY0FBTDtBQUNBO0FBQ0gsYUFIRCxNQUdPO0FBQ0gscUJBQUtWLFNBQUwsQ0FBZSxLQUFLckQsWUFBcEI7QUFDSDtBQUNKOzs7O0VBN01xQ2dFLGVBQUtKLEk7O2tCQUExQm5FLFkiLCJmaWxlIjoic2VhcmNoX3Jlc3VsdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4gICAgLyogZ2xvYmFsIHd4ICovXHJcbiAgICBpbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcclxuICAgIGltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vbWl4aW5zL3BhZ2UnO1xyXG4gICAgZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VhcmNoUmVzdWx0IGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICAgICAgICBtaXhpbnMgPSBbUGFnZU1peGluXTtcclxuICAgICAgICBjb25maWcgPSB7XHJcbiAgICAgICAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfmkJzntKLnu5PmnpwnLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29tcG9uZW50cyA9IHtcclxuICAgICAgICAgICAgLy8gdGFiYmFyOiBUYWJiYXJcclxuICAgICAgICB9O1xyXG4gICAgICAgIGRhdGEgPSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleDogMCxcclxuICAgICAgICAgICAgbG9hZFVzZXI6IHRydWUsIC8vIOmcgOimgeeZu+W9leS/oeaBr1xyXG4gICAgICAgICAgICBpbnB1dERhdGE6IFwiXCIsXHJcbiAgICAgICAgICAgIHNjaG9vbElkOiBcIlwiLFxyXG4gICAgICAgICAgICBpZDogJycsXHJcbiAgICAgICAgICAgIGNhdGFsb2dJZDogJycsXHJcbiAgICAgICAgICAgIGZpbGVQYXRoOiBcIlwiLFxyXG4gICAgICAgICAgICBibHVlcHJpbnRJZDogXCJcIixcclxuICAgICAgICAgICAgZG93bmxvYWR1cmw6IFwiXCIsXHJcbiAgICAgICAgICAgIHBhZ2VOdW1iZXIxOiAxLFxyXG4gICAgICAgICAgICBwYWdlTnVtYmVyMjogMSxcclxuICAgICAgICAgICAgbGFzdFBhZ2UxOiBmYWxzZSxcclxuICAgICAgICAgICAgbGFzdFBhZ2UyOiBmYWxzZSxcclxuICAgICAgICAgICAgcmVzdExpc3Q6IFtdLFxyXG4gICAgICAgICAgICBzY2hvb2xMaXN0OiBbXSxcclxuICAgICAgICAgICAgaW1nVXJsOiBbXVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgbWV0aG9kcyA9IHtcclxuICAgICAgICAgICAgb3RoZXJzVGFwKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnR5cGVJZCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LnR5cGVpZDtcclxuICAgICAgICAgICAgICAgIHNlbGYuZG93bmxvYWR1cmwgPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5kb3dubG9hZHVybDtcclxuICAgICAgICAgICAgICAgIHNlbGYuYmx1ZXByaW50SWQgPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgndXNlci9yZXNvdXJjZUluZm8uZG8nLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlSWQ6IHNlbGYuYmx1ZXByaW50SWQsXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfpooTop4gyMiAnLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYudHlwZUlkID09PSBcInZpZGVvXCIgfHwgc2VsZi50eXBlSWQgPT09IFwiY2xhc3NcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiMjIyMlwiKVxyXG4gICAgICAgICAgICAgICAgICAgIHd4LnNldFN0b3JhZ2VTeW5jKCd2aWRlbycsIHNlbGYuZG93bmxvYWR1cmwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvbW92aWUnXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNlbGYudHlwZUlkID09PSBcImltYWdlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmltZ1VybC5wdXNoKHNlbGYuZG93bmxvYWR1cmwpXHJcbiAgICAgICAgICAgICAgICAgICAgd3gucHJldmlld0ltYWdlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudDogc2VsZi5kb3dubG9hZHVybCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsczogc2VsZi5pbWdVcmxcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxmLnR5cGVJZCA9PT0gXCJwcHRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicHBwcHBwdFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2VsZi5kb3dubG9hZHVybGVlZVwiLCBzZWxmLmRvd25sb2FkdXJsKVxyXG4gICAgICAgICAgICAgICAgICAgIHd4LmRvd25sb2FkRmlsZSh7wqBcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBzZWxmLmRvd25sb2FkdXJsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICDCoMKgwqBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVzc3NcIiwgcmVzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5maWxlUGF0aCA9IHJlcy50ZW1wRmlsZVBhdGg7wqDCoMKgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3eC5vcGVuRG9jdW1lbnQoe8KgwqDCoMKgwqBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlUGF0aDogc2VsZi5maWxlUGF0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHvCoMKgwqDCoMKgwqBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+aJk+W8gOaWh+aho+aIkOWKnycsIHJlcynCoMKgwqDCoMKgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWlsOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+aJk+W8gOaWh+aho+Wksei0pScsIHJlcynCoMKgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfcKgwqDCoMKgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KcKgwqDCoFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9wqDCoFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzY2hvb2xEZXRhaWwoZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSlcclxuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICAgICAgICAgICAgICBzZWxmLmlkID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaWQ7XHJcbiAgICAgICAgICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvc2Nob29sX2RldGFpbD9pZD0nICsgc2VsZi5pZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFkZFNlYXJ0KGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmlkID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3VzZXIvYmx1ZXByaW50UmVzb3VyY2VJbnNlcnQuZG8nLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlSWQ6IHNlbGYuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfotYTmupAgJywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNlbGYucmVzdExpc3QgPSBkYXRhLml0ZW1zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfmt7vliqDmiJDlip8nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDIwMDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbG9vayhlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhlKVxyXG4gICAgICAgICAgICAgICAgLy8gdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgLy8gc2VsZi5yZXNvdXJjZUlkID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaWQ7XHJcbiAgICAgICAgICAgICAgICAvLyB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICAgICAgICAgIC8vICAgICB1cmw6ICcvcGFnZXMvc2NoZW1lX2xvb2s/cmVzb3VyY2VJZD0nICsgc2VsZi5yZXNvdXJjZUlkXHJcbiAgICAgICAgICAgICAgICAvLyB9KTtcclxuICAgICAgICAgICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9wYWdlcy9zY2hlbWVfbG9vaydcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0YWJGdW4oaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGluZGV4Kyc9PT09PT09PT09PT09PT09PT09PT09PT09JylcclxuICAgICAgICAgICAgICAgIHRoaXMucGFnZU51bWJlcjEgPSAxXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2VOdW1iZXIyID0gMVxyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0UGFnZTEgPSBmYWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0UGFnZTIgPSBmYWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXN0TGlzdCA9IFtdXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjaG9vbExpc3QgPSBbXVxyXG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzXHJcbiAgICAgICAgICAgICAgICBzZWxmLmN1cnJlbnRJbmRleCA9IGluZGV4O1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5jdXJyZW50SW5kZXgpXHJcbiAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaEZ1bihzZWxmLmN1cnJlbnRJbmRleClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgc2VhcmNoRnVuKGluZGV4KSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKGluZGV4ID09IDApIHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5wYWdlTnVtYmVyMSlcclxuICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgnc2Nob29sU2VhcmNoLmRvJywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrOiBzZWxmLmlucHV0RGF0YSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZU51bWJlcjogc2VsZi5wYWdlTnVtYmVyMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZVNpemU6IDEwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRhbG9nSWQ6IHNlbGYuY2F0YWxvZ0lkXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5pdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zY2hvb2xMaXN0LnB1c2goZGF0YS5pdGVtc1tpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5zY2hvb2xMaXN0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5wYWdlLnRvdGFsUGFnZSA9PT0gc2VsZi5wYWdlTnVtYmVyMSkgc2VsZi5sYXN0UGFnZTEgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNlbGYuc2Nob29sTGlzdCA9IGRhdGEuaXRlbXM7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgncmVzb3VyY2VTZWFyY2guZG8nLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGs6IHNlbGYuaW5wdXREYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlTnVtYmVyOiBzZWxmLnBhZ2VOdW1iZXIyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlU2l6ZTogMTAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGFsb2dJZDogc2VsZi5jYXRhbG9nSWRcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+i1hOa6kCAnLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnJlc3RMaXN0LnB1c2goZGF0YS5pdGVtc1tpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEucGFnZS50b3RhbFBhZ2UgPT09IHNlbGYucGFnZU51bWJlcjIpIHNlbGYubGFzdFBhZ2UyID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZWxmLnNjaG9vbExpc3QgPSBkYXRhLml0ZW1zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgb25Mb2FkKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZSlcclxuICAgICAgICAgICAgdGhpcy5pbnB1dERhdGEgPSBlLms7XHJcbiAgICAgICAgICAgIHRoaXMuY2F0YWxvZ0lkID0gZS5jYXRhbG9nSWQ7XHJcbiAgICAgICAgICAgIHRoaXMucGFnZU51bWJlcjEgPSAxXHJcbiAgICAgICAgICAgIHRoaXMucGFnZU51bWJlcjIgPSAxXHJcbiAgICAgICAgICAgIHRoaXMubGFzdFBhZ2UxID0gZmFsc2VcclxuICAgICAgICAgICAgdGhpcy5sYXN0UGFnZTIgPSBmYWxzZVxyXG4gICAgICAgICAgICB0aGlzLnJlc3RMaXN0ID0gW11cclxuICAgICAgICAgICAgdGhpcy5zY2hvb2xMaXN0ID0gW11cclxuICAgICAgICB9XHJcbiAgICAgICAgb25SZWFjaEJvdHRvbSgpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5wYWdlTnVtYmVyMSArICctLS0tLS0tLS0tLS0tLS0tLS0tJylcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudEluZGV4ID09PSAwIHx8IHRoaXMuY3VycmVudEluZGV4ID09PSAnMCcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFnZU51bWJlcjErK1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmxhc3RQYWdlMSA9PT0gZmFsc2UpIHRoaXMuc2VhcmNoRnVuKHRoaXMuY3VycmVudEluZGV4KVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYWdlTnVtYmVyMisrXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubGFzdFBhZ2UyID09PSBmYWxzZSkgdGhpcy5zZWFyY2hGdW4odGhpcy5jdXJyZW50SW5kZXgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgd2hlbkFwcFJlYWR5U2hvdygpIHtcclxuICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5wYWdlTnVtYmVyMSA9IDFcclxuICAgICAgICAgICAgdGhpcy5wYWdlTnVtYmVyMiA9IDFcclxuICAgICAgICAgICAgdGhpcy5sYXN0UGFnZTEgPSBmYWxzZVxyXG4gICAgICAgICAgICB0aGlzLmxhc3RQYWdlMiA9IGZhbHNlXHJcbiAgICAgICAgICAgIHRoaXMucmVzdExpc3QgPSBbXVxyXG4gICAgICAgICAgICB0aGlzLnNjaG9vbExpc3QgPSBbXVxyXG4gICAgICAgICAgICB3eC5yZW1vdmVTdG9yYWdlU3luYyhcInZpZGVvXCIpXHJcbiAgICAgICAgICAgIHd4LnJlbW92ZVN0b3JhZ2VTeW5jKFwiaW5wdXR2YWx1ZVwiKVxyXG4gICAgICAgICAgICB3eC5yZW1vdmVTdG9yYWdlU3luYyhcInNob3dUYWdcIilcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5pbnB1dERhdGEgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYud2hlblBhcmFtRXJyb3IoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoRnVuKHRoaXMuY3VycmVudEluZGV4KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4iXX0=