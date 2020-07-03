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
      schoolId: "",
      schoolDetail: [],
      schoolResource: [],
      pageNum1: 1,
      istrue: true,
      totalPage: "",
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
        this.totalPage = "";
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
      console.log("self.currentIndex", this.currentIndex);
      if (this.currentIndex == 1) {
        if (this.istrue == false) {
          wx.showToast({
            title: '已经没有数据啦',
            icon: 'success',
            duration: 2000
          });
          return;
        } else {
          this.pageNum1++;
          console.log("this.pageNum1", this.pageNum1);
          console.log("self.cc", this.currentIndex);
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
      wx.removeStorageSync("video");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjaG9vbF9kZXRhaWwuanMiXSwibmFtZXMiOlsiU2Nob29sRGV0YWlsIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsImRhdGEiLCJpc1NoYWRlIiwiaXNpbnRvciIsImN1cnJlbnRJbmRleCIsInNjaG9vbElkIiwic2Nob29sRGV0YWlsIiwic2Nob29sUmVzb3VyY2UiLCJwYWdlTnVtMSIsImlzdHJ1ZSIsInRvdGFsUGFnZSIsImltZ1VybCIsIm1ldGhvZHMiLCJvdGhlcnNUYXAiLCJlIiwiY29uc29sZSIsImxvZyIsInNlbGYiLCJpZCIsImN1cnJlbnRUYXJnZXQiLCJkYXRhc2V0IiwidHlwZUlkIiwidHlwZWlkIiwiZG93bmxvYWR1cmwiLCJmZXRjaERhdGFQcm9taXNlIiwicmVzb3VyY2VJZCIsInRoZW4iLCIkYXBwbHkiLCJ3eCIsInNldFN0b3JhZ2VTeW5jIiwibmF2aWdhdGVUbyIsInVybCIsInB1c2giLCJwcmV2aWV3SW1hZ2UiLCJjdXJyZW50IiwidXJscyIsImRvd25sb2FkRmlsZSIsInN1Y2Nlc3MiLCJyZXMiLCJmaWxlUGF0aCIsInRlbXBGaWxlUGF0aCIsIm9wZW5Eb2N1bWVudCIsImZhaWwiLCJsb29rIiwiYWRkU2VhcnQiLCJzaG93VG9hc3QiLCJ0aXRsZSIsImljb24iLCJkdXJhdGlvbiIsInRhYkZ1biIsImluZGV4Iiwib250YWJGdW4iLCJzaGFkZSIsImludG9yIiwiaXRlbSIsInBhZ2VOdW1iZXIiLCJwYWdlU2l6ZSIsImkiLCJpdGVtcyIsImxlbmd0aCIsInBhZ2UiLCJyZW1vdmVTdG9yYWdlU3luYyIsIndlcHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0U7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBQ3FCQSxZOzs7Ozs7Ozs7Ozs7OztrTUFDbkJDLE0sR0FBUyxDQUFDQyxjQUFELEMsUUFDVEMsTSxHQUFTO0FBQ1BDLDhCQUF3QjtBQURqQixLLFFBR1RDLEksR0FBTztBQUNM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cnQgd2VweSBmcm9tICd3ZXB5JztcclxuICBpbXBvcnQgUGFnZU1peGluIGZyb20gJy4uL21peGlucy9wYWdlJztcclxuICBleHBvcnQgZGVmYXVsdCBjbGFzcyBTY2hvb2xEZXRhaWwgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gICAgbWl4aW5zID0gW1BhZ2VNaXhpbl07XHJcbiAgICBjb25maWcgPSB7XHJcbiAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICflrabmoKHor6bmg4UnXHJcbiAgICB9O1xyXG4gICAgZGF0YSA9IHtcclxuICAgICAgaXNTaGFkZTogZmFsc2UsXHJcbiAgICAgIGlzaW50b3I6IHRydWUsXHJcbiAgICAgIGN1cnJlbnRJbmRleDogMCxcclxuICAgICAgc2Nob29sSWQ6IFwiXCIsXHJcbiAgICAgIHNjaG9vbERldGFpbDogW10sXHJcbiAgICAgIHNjaG9vbFJlc291cmNlOiBbXSxcclxuICAgICAgcGFnZU51bTE6IDEsXHJcbiAgICAgIGlzdHJ1ZTogdHJ1ZSxcclxuICAgICAgdG90YWxQYWdlOiBcIlwiLFxyXG4gICAgICBpbWdVcmw6IFtdXHJcbiAgICB9O1xyXG4gICAgbWV0aG9kcyA9IHtcclxuICAgICAgb3RoZXJzVGFwKGUpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlKVxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLmlkID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaWQ7XHJcbiAgICAgICAgc2VsZi50eXBlSWQgPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC50eXBlaWQ7XHJcbiAgICAgICAgc2VsZi5kb3dubG9hZHVybCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmRvd25sb2FkdXJsO1xyXG4gICAgICAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3VzZXIvcmVzb3VyY2VJbmZvLmRvJywge1xyXG4gICAgICAgICAgICByZXNvdXJjZUlkOiBzZWxmLmlkLFxyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ+i1sOihl+WPo+S6hiAnLCBkYXRhKTtcclxuICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgaWYgKHNlbGYudHlwZUlkID09PSBcInZpZGVvXCIgfHwgc2VsZi50eXBlSWQgPT09IFwiY2xhc3NcIikge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCIyMjIyXCIpXHJcbiAgICAgICAgICB3eC5zZXRTdG9yYWdlU3luYygndmlkZW8nLCBzZWxmLmRvd25sb2FkdXJsKTtcclxuICAgICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgICAgICB1cmw6ICcvcGFnZXMvbW92aWUnXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoc2VsZi50eXBlSWQgPT09IFwiaW1hZ2VcIikge1xyXG4gICAgICAgICAgc2VsZi5pbWdVcmwucHVzaChzZWxmLmRvd25sb2FkdXJsKVxyXG4gICAgICAgICAgd3gucHJldmlld0ltYWdlKHtcclxuICAgICAgICAgICAgY3VycmVudDogc2VsZi5kb3dubG9hZHVybCxcclxuICAgICAgICAgICAgdXJsczogc2VsZi5pbWdVcmxcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHNlbGYudHlwZUlkID09PSBcInBwdFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJwcHBwcHB0XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZWxmLmRvd25sb2FkdXJsZWVlXCIsIHNlbGYuZG93bmxvYWR1cmwpXHJcbiAgICAgICAgICAgICAgICAgICAgd3guZG93bmxvYWRGaWxlKHvCoFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHNlbGYuZG93bmxvYWR1cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIMKgwqDCoHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZXNzc1wiLCByZXMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmZpbGVQYXRoID0gcmVzLnRlbXBGaWxlUGF0aDvCoMKgwqBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHd4Lm9wZW5Eb2N1bWVudCh7wqDCoMKgwqDCoFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVQYXRoOiBzZWxmLmZpbGVQYXRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge8KgwqDCoMKgwqDCoFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5omT5byA5paH5qGj5oiQ5YqfJywgcmVzKcKgwqDCoMKgwqBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5omT5byA5paH5qGj5aSx6LSlJywgcmVzKcKgwqBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9wqDCoMKgwqBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pwqDCoMKgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH3CoMKgXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICB9LFxyXG4gICAgICBsb29rKCkge1xyXG4gICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgICAgdXJsOiAnL3BhZ2VzL3NjaGVtZV9sb29rJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgICBhZGRTZWFydChlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZSlcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5pZCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmlkO1xyXG4gICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgndXNlci9ibHVlcHJpbnRSZXNvdXJjZUluc2VydC5kbycsIHtcclxuICAgICAgICAgICAgcmVzb3VyY2VJZDogc2VsZi5pZCxcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfotYTmupAgJywgZGF0YSk7XHJcbiAgICAgICAgICAgIC8vIHNlbGYucmVzdExpc3QgPSBkYXRhLml0ZW1zO1xyXG4gICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xyXG4gICAgICAgICAgICAgIHRpdGxlOiAn5re75Yqg5oiQ5YqfJyxcclxuICAgICAgICAgICAgICBpY29uOiAnc3VjY2VzcycsXHJcbiAgICAgICAgICAgICAgZHVyYXRpb246IDIwMDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICB9LFxyXG4gICAgICB0YWJGdW4oaW5kZXgpIHtcclxuICAgICAgICB0aGlzLnBhZ2VOdW0xID0gMVxyXG4gICAgICAgIHRoaXMuaXN0cnVlID0gdHJ1ZVxyXG4gICAgICB0aGlzLnRvdGFsUGFnZSA9IFwiXCJcclxuICAgICAgICBjb25zb2xlLmxvZyhpbmRleClcclxuICAgICAgICB0aGlzLnNjaG9vbFJlc291cmNlID0gW11cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5jdXJyZW50SW5kZXggPSBpbmRleDtcclxuICAgICAgICBzZWxmLm9udGFiRnVuKClcclxuICAgICAgICAvLyBpZiAoc2VsZi5jdXJyZW50SW5kZXggPT0gMCkge1xyXG4gICAgICAgIC8vICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKCdzY2hvb2xJbmZvLmRvJywge1xyXG4gICAgICAgIC8vICAgICAgIGlkOiBzZWxmLnNjaG9vbElkXHJcbiAgICAgICAgLy8gICAgIH0pXHJcbiAgICAgICAgLy8gICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAvLyAgICAgICBzZWxmLnNjaG9vbERldGFpbCA9IGRhdGEuaXRlbTtcclxuICAgICAgICAvLyAgICAgICBjb25zb2xlLmxvZygnc2Nob29sSW5mbycsIHNlbGYuc2Nob29sRGV0YWlsKTtcclxuICAgICAgICAvLyAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgIC8vICAgICB9KVxyXG4gICAgICAgIC8vIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3NjaG9vbFJlc291cmNlLmRvJywge1xyXG4gICAgICAgIC8vICAgICAgIHNjaG9vbElkOiBzZWxmLnNjaG9vbElkLFxyXG4gICAgICAgIC8vICAgICAgIHBhZ2VOdW1iZXI6IHNlbGYucGFnZU51bTEsXHJcbiAgICAgICAgLy8gICAgICAgcGFnZVNpemU6IDEwXHJcbiAgICAgICAgLy8gICAgIH0pXHJcbiAgICAgICAgLy8gICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAvLyAgICAgICAvLyBzZWxmLnNjaG9vbFJlc291cmNlID0gZGF0YS5pdGVtcztcclxuICAgICAgICAvLyAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAvLyAgICAgICAgIHNlbGYuc2Nob29sUmVzb3VyY2UucHVzaChkYXRhLml0ZW1zW2ldKTtcclxuICAgICAgICAvLyAgICAgICB9XHJcbiAgICAgICAgLy8gICAgICAgc2VsZi50b3RhbFBhZ2UgPSBkYXRhLml0ZW1zLnRvdGFsUGFnZTtcclxuICAgICAgICAvLyAgICAgICBpZiAoc2VsZi50b3RhbFBhZ2UgPT09IHNlbGYucGFnZU51bTEpIHtcclxuICAgICAgICAvLyAgICAgICAgIHNlbGYuaXN0cnVlID0gZmFsc2U7XHJcbiAgICAgICAgLy8gICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyAgICAgICAgIHNlbGYuaXN0cnVlID0gdHJ1ZTtcclxuICAgICAgICAvLyAgICAgICB9XHJcbiAgICAgICAgLy8gICAgICAgY29uc29sZS5sb2coJ2RhdGEnLCBkYXRhKTtcclxuICAgICAgICAvLyAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgIC8vICAgICB9KVxyXG4gICAgICAgIC8vIH1cclxuICAgICAgfSxcclxuICAgICAgc2hhZGUoZSkge1xyXG4gICAgICAgIHRoaXMuaXNTaGFkZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5pc2ludG9yID0gZmFsc2U7XHJcbiAgICAgIH0sXHJcbiAgICAgIGludG9yKGUpIHtcclxuICAgICAgICB0aGlzLmlzU2hhZGUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmlzaW50b3IgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgb250YWJGdW4oaW5kZXgpIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICBpZiAoaW5kZXggPT0gMCkge1xyXG4gICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgnc2Nob29sSW5mby5kbycsIHtcclxuICAgICAgICAgICAgaWQ6IHNlbGYuc2Nob29sSWRcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc2Nob29sRGV0YWlsID0gZGF0YS5pdGVtO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc2Nob29sSW5mbycsIHNlbGYuc2Nob29sRGV0YWlsKTtcclxuICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKCdzY2hvb2xJbmZvLmRvJywge1xyXG4gICAgICAgICAgICBpZDogc2VsZi5zY2hvb2xJZFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgc2VsZi5zY2hvb2xEZXRhaWwgPSBkYXRhLml0ZW07XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzY2hvb2xJbmZvJywgc2VsZi5zY2hvb2xEZXRhaWwpO1xyXG4gICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3NjaG9vbFJlc291cmNlLmRvJywge1xyXG4gICAgICAgICAgICBzY2hvb2xJZDogc2VsZi5zY2hvb2xJZCxcclxuICAgICAgICAgICAgcGFnZU51bWJlcjogc2VsZi5wYWdlTnVtMSxcclxuICAgICAgICAgICAgcGFnZVNpemU6IDEwXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAvLyBzZWxmLnNjaG9vbFJlc291cmNlID0gZGF0YS5pdGVtcztcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgc2VsZi5zY2hvb2xSZXNvdXJjZS5wdXNoKGRhdGEuaXRlbXNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNlbGYudG90YWxQYWdlID0gZGF0YS5wYWdlLnRvdGFsUGFnZTtcclxuICAgICAgICAgICAgaWYgKHNlbGYudG90YWxQYWdlID09IHNlbGYucGFnZU51bTEpIHtcclxuICAgICAgICAgICAgICBzZWxmLmlzdHJ1ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHNlbGYuaXN0cnVlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZGF0YScsIGRhdGEpO1xyXG4gICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgb25SZWFjaEJvdHRvbSgpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJzZWxmLmN1cnJlbnRJbmRleFwiLCB0aGlzLmN1cnJlbnRJbmRleClcclxuICAgICAgaWYgKHRoaXMuY3VycmVudEluZGV4ID09IDEpIHtcclxuICAgICAgICBpZiAodGhpcy5pc3RydWUgPT0gZmFsc2UpIHtcclxuICAgICAgICAgIHd4LnNob3dUb2FzdCh7XHJcbiAgICAgICAgICAgIHRpdGxlOiAn5bey57uP5rKh5pyJ5pWw5o2u5ZWmJyxcclxuICAgICAgICAgICAgaWNvbjogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICBkdXJhdGlvbjogMjAwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5wYWdlTnVtMSsrO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJ0aGlzLnBhZ2VOdW0xXCIsIHRoaXMucGFnZU51bTEpXHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcInNlbGYuY2NcIiwgdGhpcy5jdXJyZW50SW5kZXgpXHJcbiAgICAgICAgICB0aGlzLm9udGFiRnVuKHRoaXMuY3VycmVudEluZGV4KVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHt9XHJcbiAgICB9XHJcbiAgICBvbkxvYWQoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlKVxyXG4gICAgICB0aGlzLnNjaG9vbElkID0gZS5pZDtcclxuICAgICAgIHRoaXMuc2Nob29sUmVzb3VyY2U9W11cclxuICAgIH1cclxuICAgIHdoZW5BcHBSZWFkeVNob3coKSB7XHJcbiAgICAgIHd4LnJlbW92ZVN0b3JhZ2VTeW5jKFwidmlkZW9cIilcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICBzZWxmLnNjaG9vbFJlc291cmNlPVtdXHJcbiAgICAgIHNlbGYub250YWJGdW4odGhpcy5jdXJyZW50SW5kZXgpXHJcbiAgICAvLyAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgnc2Nob29sSW5mby5kbycsIHtcclxuICAgIC8vICAgICAgIGlkOiBzZWxmLnNjaG9vbElkXHJcbiAgICAvLyAgICAgfSlcclxuICAgIC8vICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAvLyAgICAgICBzZWxmLnNjaG9vbERldGFpbCA9IGRhdGEuaXRlbTtcclxuICAgIC8vICAgICAgIGNvbnNvbGUubG9nKCdzY2hvb2xJbmZvJywgc2VsZi5zY2hvb2xEZXRhaWwpO1xyXG4gICAgLy8gICAgICAgc2VsZi4kYXBwbHkoKTtcclxuICAgIC8vICAgICB9KVxyXG4gICAgLy8gfVxyXG4gIH1cclxuICB9XHJcbiJdfQ==