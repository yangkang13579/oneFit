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
      passId: "",
      id: '',
      downloadurl: "",
      imgUrl: [],
      dond: '',
      fileType: "",
      typeId: "",
      downloadUrlzone: ""
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
          console.log("xxxxxx", self.downloadUrlzone);
          wx.downloadFile({
            url: self.downloadUrlzone,
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
        console.log("self.fileType", self.fileType);
        console.log("self.typeId", self.typeId);
        if (self.typeId == "image") {
          wx.downloadFile({
            url: self.downloadurl,
            success: function success(res) {
              console.log("ressss", res);
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
        } else if (self.typeId == "class" || self.typeId == "video") {
          wx.showToast({
            title: '视频不支持下载噢',
            icon: 'success',
            duration: 2000
          });
        } else {
          wx.downloadFile({
            url: self.downloadurl,
            success: function success(res) {
              console.log("ccc", res);
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
        if (self.typeId === "video" || self.typeId === "class") {
          console.log("2222");
          self.downloadurl = e.currentTarget.dataset.downloadurl;
          wx.setStorageSync('video', self.downloadurl);
          wx.navigateTo({
            url: '/pages/movie'
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
        } else if (self.typeId === "image") {
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
      wx.removeStorageSync("video");
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
        path: "pages/share?blueprintId=" + self.blueprintId,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjaGVtZV9kZXRhaWwuanMiXSwibmFtZXMiOlsiU2NoZW1lRGV0YWlsIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJjb21wb25lbnRzIiwiZGF0YSIsImJsdWVwcmludElkIiwibG9hZFVzZXIiLCJzaG93VGFnIiwiZGV0YWlsTGlzdCIsInJlc0xpc3QiLCJjdXJyZW50SW5kZXgiLCJyZXNvdXJjZUlkIiwicGFzc0lkIiwiaWQiLCJkb3dubG9hZHVybCIsImltZ1VybCIsImRvbmQiLCJmaWxlVHlwZSIsInR5cGVJZCIsImRvd25sb2FkVXJsem9uZSIsIm1ldGhvZHMiLCJvbkRvbmUiLCJlIiwiY29uc29sZSIsImxvZyIsInNlbGYiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YXNldCIsImZldGNoRGF0YVByb21pc2UiLCJ0aGVuIiwiZG93bmxvYWRVcmwiLCJ3eCIsImRvd25sb2FkRmlsZSIsInVybCIsInN1Y2Nlc3MiLCJyZXMiLCJmaWxlUGF0aCIsInRlbXBGaWxlUGF0aCIsIm9wZW5Eb2N1bWVudCIsImZhaWwiLCIkYXBwbHkiLCJvbkRvd24iLCJ0eXBlaWQiLCJmaWxldHlwZSIsInNhdmVJbWFnZVRvUGhvdG9zQWxidW0iLCJyZXN1bHQiLCJzYXZlRmlsZSIsInNhdmVkRmlsZVBhdGgiLCJzaG93VG9hc3QiLCJ0aXRsZSIsImljb24iLCJkdXJhdGlvbiIsImdldFNhdmVkRmlsZUxpc3QiLCJmaWxlTGlzdCIsIm90aGVyc1RhcCIsInNldFN0b3JhZ2VTeW5jIiwibmF2aWdhdGVUbyIsInB1c2giLCJwcmV2aWV3SW1hZ2UiLCJjdXJyZW50IiwidXJscyIsInJlbW92ZVN0b3JhZ2VTeW5jIiwiYmx1ZXByaW50Iiwid2hlbkFwcFNoYXJlIiwiY2F0YWxvZ05hbWUiLCJwYXRoIiwidHlwZSIsIm1hcmtlcklkIiwiY29udHJvbElkIiwid2VweSIsInBh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R0FBVCxFQUFjO0FBQ2xCO0FBQ0Q7QUFUSSxPQUFQO0FBV0Q7OztpQ0FDWWIsQyxFQUFHO0FBQ2RDLGNBQVFDLEdBQVIsQ0FBWUYsRUFBRTRDLElBQWQ7QUFDRDs7OzhCQUNTNUMsQyxFQUFHO0FBQ1hDLGNBQVFDLEdBQVIsQ0FBWUYsRUFBRTZDLFFBQWQ7QUFDRDs7OytCQUNVN0MsQyxFQUFHO0FBQ1pDLGNBQVFDLEdBQVIsQ0FBWUYsRUFBRThDLFNBQWQ7QUFDRDs7OztFQXZRdUNDLGVBQUtDLEk7O2tCQUExQnpFLFkiLCJmaWxlIjoic2NoZW1lX2RldGFpbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4gIC8qIGdsb2JhbCB3eCAqL1xyXG4gIGltcG9ydCB3ZXB5IGZyb20gJ3dlcHknO1xyXG4gIGltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vbWl4aW5zL3BhZ2UnO1xyXG4gIGltcG9ydCBhcHAgZnJvbSAnLi4vbGliL2FwcCc7XHJcbiAgLy8gaW1wb3J0IFRhYmJhciBmcm9tICcuLi9jb21wb25lbnRzL3RhYmJhcic7XHJcbiAgZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NoZW1lRGV0YWlsIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICAgIG1peGlucyA9IFtQYWdlTWl4aW5dO1xyXG4gICAgY29uZmlnID0ge1xyXG4gICAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiAnIzAwMDAwMCcsXHJcbiAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfmlrnmoYjmn6XnnIsnXHJcbiAgICB9O1xyXG4gICAgY29tcG9uZW50cyA9IHtcclxuICAgICAgLy8gdGFiYmFyOiBUYWJiYXJcclxuICAgIH07XHJcbiAgICBkYXRhID0ge1xyXG4gICAgICBibHVlcHJpbnRJZDogJycsXHJcbiAgICAgIGxvYWRVc2VyOiB0cnVlLCAvLyDpnIDopoHnmbvlvZXkv6Hmga9cclxuICAgICAgc2hvd1RhZzogbnVsbCxcclxuICAgICAgZGV0YWlsTGlzdDogW10sXHJcbiAgICAgIHJlc0xpc3Q6IFtdLFxyXG4gICAgICBjdXJyZW50SW5kZXg6IG51bGwsXHJcbiAgICAgIHJlc291cmNlSWQ6ICcnLFxyXG4gICAgICBwYXNzSWQ6IFwiXCIsXHJcbiAgICAgIGlkOiAnJyxcclxuICAgICAgZG93bmxvYWR1cmw6IFwiXCIsXHJcbiAgICAgIGltZ1VybDogW10sXHJcbiAgICAgIGRvbmQ6ICcnLFxyXG4gICAgICBmaWxlVHlwZTogXCJcIixcclxuICAgICAgdHlwZUlkOiBcIlwiLFxyXG4gICAgICBkb3dubG9hZFVybHpvbmU6IFwiXCJcclxuICAgIH1cclxuICAgIG1ldGhvZHMgPSB7XHJcbiAgICAgIC8vIOaVtOS9k+aWueahiOS4i+i9vVxyXG4gICAgICBvbkRvbmUoZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYuZG9uZCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmRvbmQ7XHJcbiAgICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKCd1c2VyL2JsdWVwcmludEluZm9Eb3dubG9hZC5kbycsIHtcclxuICAgICAgICAgICAgYmx1ZXByaW50SWQ6IHNlbGYuZG9uZCxcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfmgLvmlrnmoYggJywgZGF0YSk7XHJcbiAgICAgICAgICAgIHNlbGYuZG93bmxvYWRVcmx6b25lID0gZGF0YS5kb3dubG9hZFVybDtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ4eHh4eHhcIiwgc2VsZi5kb3dubG9hZFVybHpvbmUpXHJcbiAgICAgICAgICAgIHd4LmRvd25sb2FkRmlsZSh7wqBcclxuICAgICAgICAgICAgICB1cmw6IHNlbGYuZG93bmxvYWRVcmx6b25lLFxyXG4gICAgICAgICAgICAgIMKgwqDCoHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZXNzc1wiLCByZXMpXHJcbiAgICAgICAgICAgICAgICBzZWxmLmZpbGVQYXRoID0gcmVzLnRlbXBGaWxlUGF0aDvCoMKgwqBcclxuICAgICAgICAgICAgICAgIHd4Lm9wZW5Eb2N1bWVudCh7wqDCoMKgwqDCoFxyXG4gICAgICAgICAgICAgICAgICBmaWxlUGF0aDogc2VsZi5maWxlUGF0aCxcclxuICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKSB7wqDCoMKgwqDCoMKgXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+aJk+W8gOaWh+aho+aIkOWKnycsIHJlcynCoMKgwqDCoMKgXHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfmiZPlvIDmlofmoaPlpLHotKUnLCByZXMpwqDCoFxyXG4gICAgICAgICAgICAgICAgICB9wqDCoMKgwqBcclxuICAgICAgICAgICAgICAgIH0pwqDCoMKgXHJcbiAgICAgICAgICAgICAgfcKgwqBcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLy8gd3guZG93bmxvYWRGaWxlKHvCoFxyXG4gICAgICAgICAgICAvLyAgIHVybDogc2VsZi5kb3dubG9hZFVybHpvbmUsXHJcbiAgICAgICAgICAgIC8vICAgwqDCoMKgc3VjY2VzczogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcInJlc3NzXCIsIHJlcylcclxuICAgICAgICAgICAgLy8gICAgIHNlbGYuZmlsZVBhdGggPSByZXMudGVtcEZpbGVQYXRoO8KgwqDCoFxyXG4gICAgICAgICAgICAvLyAgICAgd3gub3BlbkRvY3VtZW50KHvCoMKgwqDCoMKgXHJcbiAgICAgICAgICAgIC8vICAgICAgIGZpbGVQYXRoOiBzZWxmLmZpbGVQYXRoLFxyXG4gICAgICAgICAgICAvLyAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHvCoMKgwqDCoMKgwqBcclxuICAgICAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZygn5omT5byA5paH5qGj5oiQ5YqfJywgcmVzKcKgwqDCoMKgwqBcclxuICAgICAgICAgICAgLy8gICAgICAgfSxcclxuICAgICAgICAgICAgLy8gICAgICAgZmFpbDogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coJ+aJk+W8gOaWh+aho+Wksei0pScsIHJlcynCoMKgXHJcbiAgICAgICAgICAgIC8vICAgICAgIH3CoMKgwqDCoFxyXG4gICAgICAgICAgICAvLyAgICAgfSnCoMKgwqBcclxuICAgICAgICAgICAgLy8gICAgIHd4LnNhdmVGaWxlKHtcclxuICAgICAgICAgICAgLy8gICAgICAgdGVtcEZpbGVQYXRoOiBzZWxmLmZpbGVQYXRoLFxyXG4gICAgICAgICAgICAvLyAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZygncmVzJywgcmVzLnNhdmVkRmlsZVBhdGgpXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgd3guc2hvd1RvYXN0KHtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgIHRpdGxlOiAn5pa55qGI5LiL6L295oiQ5YqfJyxcclxuICAgICAgICAgICAgLy8gICAgICAgICAgIGljb246ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgLy8gICAgICAgICAgIGR1cmF0aW9uOiAyMDAwXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgfSlcclxuICAgICAgICAgICAgLy8gICAgICAgfVxyXG4gICAgICAgICAgICAvLyAgICAgfSlcclxuICAgICAgICAgICAgLy8gICB9LFxyXG4gICAgICAgICAgICAvLyAgIGZhaWw6IGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ+S4i+i9veaWh+aho+Wksei0pScsIHJlcynCoMKgXHJcbiAgICAgICAgICAgIC8vICAgfcKgwqBcclxuICAgICAgICAgICAgLy8gfSlcclxuICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIOWNleS4quS4i+i9vVxyXG4gICAgICBvbkRvd24oZSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBjb25zb2xlLmxvZyhlKVxyXG4gICAgICAgIHNlbGYudHlwZUlkID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQudHlwZWlkO1xyXG4gICAgICAgIHNlbGYuZG93bmxvYWR1cmwgPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5kb3dubG9hZHVybDtcclxuICAgICAgICBzZWxmLmZpbGVUeXBlID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuZmlsZXR5cGU7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJzZWxmLmZpbGVUeXBlXCIsIHNlbGYuZmlsZVR5cGUpXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJzZWxmLnR5cGVJZFwiLCBzZWxmLnR5cGVJZClcclxuICAgICAgICBpZiAoc2VsZi50eXBlSWQgPT0gXCJpbWFnZVwiKSB7XHJcbiAgICAgICAgICB3eC5kb3dubG9hZEZpbGUoe1xyXG4gICAgICAgICAgICB1cmw6IHNlbGYuZG93bmxvYWR1cmwsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVzc3NzXCIsIHJlcylcclxuICAgICAgICAgICAgICB3eC5zYXZlSW1hZ2VUb1Bob3Rvc0FsYnVtKHtcclxuICAgICAgICAgICAgICAgIGZpbGVQYXRoOiByZXMudGVtcEZpbGVQYXRoLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzcyhyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgd3guc2F2ZUZpbGUoe1xyXG4gICAgICAgICAgICAgICAgdGVtcEZpbGVQYXRoOiByZXMudGVtcEZpbGVQYXRoLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5zYXZlZEZpbGVQYXRoKVxyXG4gICAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5Zu+54mH5LiL6L295oiQ5YqfJyxcclxuICAgICAgICAgICAgICAgICAgICBpY29uOiAnc3VjY2VzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDIwMDBcclxuICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0gZWxzZSBpZiAoc2VsZi50eXBlSWQgPT0gXCJjbGFzc1wiIHx8IHNlbGYudHlwZUlkID09IFwidmlkZW9cIikge1xyXG4gICAgICAgICAgd3guc2hvd1RvYXN0KHtcclxuICAgICAgICAgICAgdGl0bGU6ICfop4bpopHkuI3mlK/mjIHkuIvovb3lmaInLFxyXG4gICAgICAgICAgICBpY29uOiAnc3VjY2VzcycsXHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiAyMDAwXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB3eC5kb3dubG9hZEZpbGUoe8KgXHJcbiAgICAgICAgICAgIHVybDogc2VsZi5kb3dubG9hZHVybCxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjY2NcIiwgcmVzKVxyXG4gICAgICAgICAgICAgIHNlbGYuZmlsZVBhdGggPSByZXMudGVtcEZpbGVQYXRoO8KgwqBcclxuICAgICAgICAgICAgICB3eC5zYXZlRmlsZSh7XHJcbiAgICAgICAgICAgICAgICB0ZW1wRmlsZVBhdGg6IHJlcy50ZW1wRmlsZVBhdGgsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzLnNhdmVkRmlsZVBhdGgpXHJcbiAgICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfmlofku7bkuIvovb3miJDlip8nLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb246ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjAwMFxyXG4gICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICB3eC5nZXRTYXZlZEZpbGVMaXN0KHtcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd6enonLCByZXMuZmlsZUxpc3QpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pwqBcclxuICAgICAgICAgICAgICAvLyB3eC5vcGVuRG9jdW1lbnQoe8KgwqDCoMKgwqBcclxuICAgICAgICAgICAgICAvLyAgIGZpbGVQYXRoOiBzZWxmLmZpbGVQYXRoLFxyXG4gICAgICAgICAgICAgIC8vICAgZmlsZVR5cGU6IHNlbGYuZmlsZVR5cGUsXHJcbiAgICAgICAgICAgICAgLy8gICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHvCoMKgwqDCoMKgwqBcclxuICAgICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ+aJk+W8gOaWh+aho+aIkOWKnycsIHJlcynCoMKgwqDCoMKgXHJcbiAgICAgICAgICAgICAgLy8gICB9LFxyXG4gICAgICAgICAgICAgIC8vICAgZmFpbDogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCfmiZPlvIDmlofmoaPlpLHotKUnLCByZXMpwqDCoFxyXG4gICAgICAgICAgICAgIC8vICAgfcKgwqDCoMKgXHJcbiAgICAgICAgICAgICAgLy8gfSnCoMKgwqBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZmFpbDogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+S4i+i9veaWh+aho+Wksei0pScsIHJlcynCoMKgXHJcbiAgICAgICAgICAgIH3CoMKgXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICB9LFxyXG4gICAgICBvdGhlcnNUYXAoZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYudHlwZUlkID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQudHlwZWlkO1xyXG4gICAgICAgIHNlbGYuZG93bmxvYWR1cmwgPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5kb3dubG9hZHVybDtcclxuICAgICAgICBzZWxmLnJlc291cmNlSWQgPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pZDtcclxuICAgICAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3VzZXIvcmVzb3VyY2VJbmZvLmRvJywge1xyXG4gICAgICAgICAgICByZXNvdXJjZUlkOiBzZWxmLnJlc291cmNlSWQsXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygn6aKE6KeIMjIgJywgZGF0YSk7XHJcbiAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIGlmIChzZWxmLnR5cGVJZCA9PT0gXCJ2aWRlb1wiIHx8IHNlbGYudHlwZUlkID09PSBcImNsYXNzXCIpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiMjIyMlwiKVxyXG4gICAgICAgICAgc2VsZi5kb3dubG9hZHVybCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmRvd25sb2FkdXJsO1xyXG4gICAgICAgICAgd3guc2V0U3RvcmFnZVN5bmMoJ3ZpZGVvJywgc2VsZi5kb3dubG9hZHVybCk7XHJcbiAgICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICAgICAgdXJsOiAnL3BhZ2VzL21vdmllJ1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzZWxmLnR5cGVJZCA9PT0gXCJwcHRcIikge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJwcHBwcHB0XCIpXHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcInNlbGYuZG93bmxvYWR1cmxlZWVcIiwgc2VsZi5kb3dubG9hZHVybClcclxuICAgICAgICAgIHd4LmRvd25sb2FkRmlsZSh7wqBcclxuICAgICAgICAgICAgdXJsOiBzZWxmLmRvd25sb2FkdXJsLFxyXG4gICAgICAgICAgICDCoMKgwqBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInJlc3NzXCIsIHJlcylcclxuICAgICAgICAgICAgICBzZWxmLmZpbGVQYXRoID0gcmVzLnRlbXBGaWxlUGF0aDvCoMKgwqBcclxuICAgICAgICAgICAgICB3eC5vcGVuRG9jdW1lbnQoe8KgwqDCoMKgwqBcclxuICAgICAgICAgICAgICAgIGZpbGVQYXRoOiBzZWxmLmZpbGVQYXRoLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKSB7wqDCoMKgwqDCoMKgXHJcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfmiZPlvIDmlofmoaPmiJDlip8nLCByZXMpwqDCoMKgwqDCoFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5omT5byA5paH5qGj5aSx6LSlJywgcmVzKcKgwqBcclxuICAgICAgICAgICAgICAgIH3CoMKgwqDCoFxyXG4gICAgICAgICAgICAgIH0pwqDCoMKgXHJcbiAgICAgICAgICAgIH3CoMKgXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0gZWxzZSBpZiAoc2VsZi50eXBlSWQgPT09IFwiaW1hZ2VcIikge1xyXG4gICAgICAgICAgc2VsZi5pbWdVcmwucHVzaChzZWxmLmRvd25sb2FkdXJsKVxyXG4gICAgICAgICAgd3gucHJldmlld0ltYWdlKHtcclxuICAgICAgICAgICAgY3VycmVudDogc2VsZi5kb3dubG9hZHVybCxcclxuICAgICAgICAgICAgdXJsczogc2VsZi5pbWdVcmxcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgIH0sXHJcbiAgICB9O1xyXG4gICAgb25Mb2FkKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coJzMzMycsIGUpXHJcbiAgICAgIHRoaXMuYmx1ZXByaW50SWQgPSBlLmJsdWVwcmludElkO1xyXG4gICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgfVxyXG4gICAgd2hlbkFwcFJlYWR5U2hvdygpIHtcclxuICAgICAgd3gucmVtb3ZlU3RvcmFnZVN5bmMoXCJ2aWRlb1wiKVxyXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgndXNlci9ibHVlcHJpbnRJbmZvLmRvJywge1xyXG4gICAgICAgICAgYmx1ZXByaW50SWQ6IHNlbGYuYmx1ZXByaW50SWQsXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnaGFvICcsIGRhdGEpO1xyXG4gICAgICAgICAgc2VsZi5kZXRhaWxMaXN0ID0gZGF0YS5ibHVlcHJpbnQ7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnc2VsZi5kZXRhaWxMaXN0Jywgc2VsZi5kZXRhaWxMaXN0KVxyXG4gICAgICAgICAgc2VsZi5wYXNzSWQgPSBkYXRhLmJsdWVwcmludC5pZFxyXG4gICAgICAgICAgLy8gc2VsZi5yZXNMaXN0ID0gc2VsZi5kZXRhaWxMaXN0LnJlc291cmNlcztcclxuICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIG9uU2hhcmVBcHBNZXNzYWdlKHJlcykge1xyXG4gICAgICByZXR1cm4gdGhpcy53aGVuQXBwU2hhcmUoe1xyXG4gICAgICAgIHRpdGxlOiAn5a6J5YWo5pWZ6IKy6LWE5rqQ5Zyw5Zu+J1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIG9uU2hhcmVBcHBNZXNzYWdlKCkge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdGl0bGU6IHNlbGYuZGV0YWlsTGlzdC5jYXRhbG9nTmFtZSxcclxuICAgICAgICBwYXRoOiBcInBhZ2VzL3NoYXJlP2JsdWVwcmludElkPVwiICsgc2VsZi5ibHVlcHJpbnRJZCxcclxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgIC8vIOi9rOWPkeaIkOWKn1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ+i9rOWPkeaIkOWKnycpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmFpbDogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgICAvLyDovazlj5HlpLHotKVcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJlZ2lvbmNoYW5nZShlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUudHlwZSk7XHJcbiAgICB9XHJcbiAgICBtYXJrZXJ0YXAoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlLm1hcmtlcklkKTtcclxuICAgIH1cclxuICAgIGNvbnRyb2x0YXAoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlLmNvbnRyb2xJZCk7XHJcbiAgICB9XHJcbiAgfVxyXG4iXX0=