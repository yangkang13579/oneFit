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


// import Tabbar from '../components/tabbar';
var SchemeLook = function (_wepy$page) {
  _inherits(SchemeLook, _wepy$page);

  function SchemeLook() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, SchemeLook);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SchemeLook.__proto__ || Object.getPrototypeOf(SchemeLook)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
      navigationBarBackgroundColor: '#000000',
      navigationBarTitleText: '方案预览'
    }, _this.components = {
      // tabbar: Tabbar
    }, _this.data = {
      inputvalue: '',
      resourceId: "",
      showTag: null,
      catalogs: [],
      resources: [],
      currentIndex: null,
      item: ['日常安全教育', '日常安全教育', '日常安全教育', '日常安全教育', '日常安全教育', '日教育', '日常安全教育', '日常安全教育', '日常安全教育'],
      modal: false,
      countryList: [],
      poId: [],
      id: '',
      blueprintId: "",
      downloadurl: "",
      imgUrl: [],
      disbal: false
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
      },
      closeModal: function closeModal() {
        this.modal = false;
      },
      getSearchContent: function getSearchContent(e) {
        console.log(e);
        this.inputvalue = e.detail.value;
        wx.setStorageSync('inputvalue', this.inputvalue);
        this.$apply();
      },
      save: function save(e) {
        var self = this;
        if (self.inputvalue == "") {
          console.log("33");
          wx.showToast({
            title: '请填写方案名称',
            icon: 'success',
            duration: 2000
          });
        } else if (self.showTag == null) {
          console.log("44");
          wx.showToast({
            title: '请选择方案主题',
            icon: 'success',
            duration: 2000
          });
        } else {
          if (self.disbal == true) {
            return;
          } else {
            console.log('55 ');
            this.fetchDataPromise('user/blueprintSave.do', {
              catalogId: self.showTag.id,
              name: self.inputvalue,
              resourceIds: self.poId.join(",")
            }).then(function (data) {
              console.log("dd", data);
              self.disbal = true;
              wx.showToast({
                title: '方案保存成功',
                icon: 'success',
                duration: 2000
              });
              wx.removeStorageSync("video");
              wx.removeStorageSync("inputvalue");
              setTimeout(function () {
                wx.switchTab({
                  url: '/pages/scheme'
                });
              }, 2000);
            });
          }
        }
      },
      sure: function sure() {
        this.showTag = this.catalogs[this.currentIndex];
        this.modal = false;
        console.log(this.showTag.id);
        wx.setStorageSync('showTag', this.showTag);
      },
      titFun: function titFun(e) {
        console.log(e);
        this.currentIndex = e.currentTarget.dataset.index;
      },
      showModal: function showModal() {
        this.modal = !this.modal;
      },
      reset: function reset() {
        console.log(1);
        // this.modal = false
        this.currentIndex = null;
        this.showTag = null;
      },
      searchClick: function searchClick(e) {
        wx.navigateTo({
          url: '/pages/search'
        });
      },
      ranking: function ranking(e) {
        wx.navigateTo({
          url: '/pages/ranking'
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(SchemeLook, [{
    key: 'delete',
    value: function _delete(e) {
      console.log(e);
      var self = this;
      self.resourceId = e.currentTarget.dataset.id;
      this.fetchDataPromise('user/blueprintResourceDelete.do', {
        resourceId: self.resourceId
      }).then(function (data) {
        console.log('删除 ', data);
        self.whenAppReadyShow();
        setTimeout(function () {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          });
        }, 100);
      });
    }
  }, {
    key: 'onLoad',
    value: function onLoad(e) {
      console.log(e);
      this.resourceId = e.resourceId;
    }
  }, {
    key: 'whenAppReadyShow',
    value: function whenAppReadyShow() {
      wx.removeStorageSync("video");
      var self = this;
      if (!wx.getStorageSync('inputvalue')) {
        self.inputvalue = "";
        self.showTag = null;
        console.log(11111111111111111111111111111);
      } else {
        console.log(22222222222222222222);
        self.inputvalue = wx.getStorageSync('inputvalue');
      }
      if (!wx.getStorageSync('showTag')) {} else {
        self.showTag = wx.getStorageSync('showTag');
      }
      self.$apply();
      // self.inputvalue ="";
      self.poId = [];
      self.resourceId = "";

      this.fetchDataPromise('user/blueprintPreview.do', {}, {}).then(function (data) {
        console.log('data is:', data);
        self.catalogs = data.catalogs;
        self.resources = data.resources;
        for (var i = 0; i < self.resources.length; i++) {
          self.poId.push(self.resources[i].id);
        }
        console.log('self.poId', self.poId);
        self.$apply();
        // 取前6个，增加一个more
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

  return SchemeLook;
}(_wepy2.default.page);

exports.default = SchemeLook;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjaGVtZV9sb29rLmpzIl0sIm5hbWVzIjpbIlNjaGVtZUxvb2siLCJtaXhpbnMiLCJQYWdlTWl4aW4iLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsImNvbXBvbmVudHMiLCJkYXRhIiwiaW5wdXR2YWx1ZSIsInJlc291cmNlSWQiLCJzaG93VGFnIiwiY2F0YWxvZ3MiLCJyZXNvdXJjZXMiLCJjdXJyZW50SW5kZXgiLCJpdGVtIiwibW9kYWwiLCJjb3VudHJ5TGlzdCIsInBvSWQiLCJpZCIsImJsdWVwcmludElkIiwiZG93bmxvYWR1cmwiLCJpbWdVcmwiLCJkaXNiYWwiLCJtZXRob2RzIiwib3RoZXJzVGFwIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJzZWxmIiwidHlwZUlkIiwiY3VycmVudFRhcmdldCIsImRhdGFzZXQiLCJ0eXBlaWQiLCJmZXRjaERhdGFQcm9taXNlIiwidGhlbiIsIiRhcHBseSIsInd4Iiwic2V0U3RvcmFnZVN5bmMiLCJuYXZpZ2F0ZVRvIiwidXJsIiwiZG93bmxvYWRGaWxlIiwic3VjY2VzcyIsInJlcyIsImZpbGVQYXRoIiwidGVtcEZpbGVQYXRoIiwib3BlbkRvY3VtZW50IiwiZmFpbCIsInB1c2giLCJwcmV2aWV3SW1hZ2UiLCJjdXJyZW50IiwidXJscyIsImNsb3NlTW9kYWwiLCJnZXRTZWFyY2hDb250ZW50IiwiZGV0YWlsIiwidmFsdWUiLCJzYXZlIiwic2hvd1RvYXN0IiwidGl0bGUiLCJpY29uIiwiZHVyYXRpb24iLCJjYXRhbG9nSWQiLCJuYW1lIiwicmVzb3VyY2VJZHMiLCJqb2luIiwicmVtb3ZlU3RvcmFnZVN5bmMiLCJzZXRUaW1lb3V0Iiwic3dpdGNoVGFiIiwic3VyZSIsInRpdEZ1biIsImluZGV4Iiwic2hvd01vZGFsIiwicmVzZXQiLCJzZWFyY2hDbGljayIsInJhbmtpbmciLCJ3aGVuQXBwUmVhZHlTaG93IiwiZ2V0U3RvcmFnZVN5bmMiLCJpIiwibGVuZ3RoIiwid2hlbkFwcFNoYXJlIiwidHlwZSIsIm1hcmtlcklkIiwiY29udHJvbElkIiwid2VweSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUU7Ozs7QUFDQTs7Ozs7Ozs7Ozs7QUFGQTs7O0FBR0E7SUFDcUJBLFU7Ozs7Ozs7Ozs7Ozs7OzhMQUNqQkMsTSxHQUFTLENBQUNDLGNBQUQsQyxRQUNUQyxNLEdBQVM7QUFDUEMsb0NBQThCLFNBRHZCO0FBRVBDLDhCQUF3QjtBQUZqQixLLFFBSVRDLFUsR0FBYTtBQUNYO0FBRFcsSyxRQUdiQyxJLEdBQU87QUFDTEMsa0JBQVksRUFEUDtBQUVMQyxrQkFBWSxFQUZQO0FBR0xDLGVBQVMsSUFISjtBQUlMQyxnQkFBVSxFQUpMO0FBS0xDLGlCQUFXLEVBTE47QUFNTEMsb0JBQWMsSUFOVDtBQU9MQyxZQUFNLENBQUMsUUFBRCxFQUFXLFFBQVgsRUFBcUIsUUFBckIsRUFBK0IsUUFBL0IsRUFBeUMsUUFBekMsRUFBbUQsS0FBbkQsRUFBMEQsUUFBMUQsRUFBb0UsUUFBcEUsRUFBOEUsUUFBOUUsQ0FQRDtBQVFMQyxhQUFPLEtBUkY7QUFTTEMsbUJBQWEsRUFUUjtBQVVMQyxZQUFNLEVBVkQ7QUFXTEMsVUFBSSxFQVhDO0FBWUxDLG1CQUFhLEVBWlI7QUFhTEMsbUJBQWEsRUFiUjtBQWNMQyxjQUFRLEVBZEg7QUFlTEMsY0FBUTtBQWZILEssUUFpQlBDLE8sR0FBVTtBQUNSQyxlQURRLHFCQUNFQyxDQURGLEVBQ0s7QUFDWEMsZ0JBQVFDLEdBQVIsQ0FBWUYsQ0FBWjtBQUNBLFlBQUlHLE9BQU8sSUFBWDtBQUNBQSxhQUFLQyxNQUFMLEdBQWNKLEVBQUVLLGFBQUYsQ0FBZ0JDLE9BQWhCLENBQXdCQyxNQUF0QztBQUNBSixhQUFLUixXQUFMLEdBQW1CSyxFQUFFSyxhQUFGLENBQWdCQyxPQUFoQixDQUF3QlgsV0FBM0M7QUFDQVEsYUFBS1QsV0FBTCxHQUFtQk0sRUFBRUssYUFBRixDQUFnQkMsT0FBaEIsQ0FBd0JiLEVBQTNDO0FB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QUFSLENBQVksV0FBWixFQUF5QkMsS0FBS1gsSUFBOUI7QUFDQVcsYUFBS08sTUFBTDtBQUNBO0FBQ0QsT0FWRDtBQVdEOzs7c0NBQ2lCTyxHLEVBQUs7QUFDckIsYUFBTyxLQUFLb0MsWUFBTCxDQUFrQjtBQUN2QnJCLGVBQU87QUFEZ0IsT0FBbEIsQ0FBUDtBQUdEOzs7aUNBQ1loQyxDLEVBQUc7QUFDZEMsY0FBUUMsR0FBUixDQUFZRixFQUFFc0QsSUFBZDtBQUNEOzs7OEJBQ1N0RCxDLEVBQUc7QUFDWEMsY0FBUUMsR0FBUixDQUFZRixFQUFFdUQsUUFBZDtBQUNEOzs7K0JBQ1V2RCxDLEVBQUc7QUFDWkMsY0FBUUMsR0FBUixDQUFZRixFQUFFd0QsU0FBZDtBQUNEOzs7O0VBck91Q0MsZUFBS0MsSTs7a0JBQXhCbkYsVSIsImZpbGUiOiJzY2hlbWVfbG9vay5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4gIC8qIGdsb2JhbCB3eCAqL1xyXG4gIGltcG9ydCB3ZXB5IGZyb20gJ3dlcHknO1xyXG4gIGltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vbWl4aW5zL3BhZ2UnO1xyXG4gIC8vIGltcG9ydCBUYWJiYXIgZnJvbSAnLi4vY29tcG9uZW50cy90YWJiYXInO1xyXG4gIGV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjaGVtZUxvb2sgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gICAgICBtaXhpbnMgPSBbUGFnZU1peGluXTtcclxuICAgICAgY29uZmlnID0ge1xyXG4gICAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjMDAwMDAwJyxcclxuICAgICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn5pa55qGI6aKE6KeIJyxcclxuICAgICAgfTtcclxuICAgICAgY29tcG9uZW50cyA9IHtcclxuICAgICAgICAvLyB0YWJiYXI6IFRhYmJhclxyXG4gICAgICB9O1xyXG4gICAgICBkYXRhID0ge1xyXG4gICAgICAgIGlucHV0dmFsdWU6ICcnLFxyXG4gICAgICAgIHJlc291cmNlSWQ6IFwiXCIsXHJcbiAgICAgICAgc2hvd1RhZzogbnVsbCxcclxuICAgICAgICBjYXRhbG9nczogW10sXHJcbiAgICAgICAgcmVzb3VyY2VzOiBbXSxcclxuICAgICAgICBjdXJyZW50SW5kZXg6IG51bGwsXHJcbiAgICAgICAgaXRlbTogWyfml6XluLjlronlhajmlZnogrInLCAn5pel5bi45a6J5YWo5pWZ6IKyJywgJ+aXpeW4uOWuieWFqOaVmeiCsicsICfml6XluLjlronlhajmlZnogrInLCAn5pel5bi45a6J5YWo5pWZ6IKyJywgJ+aXpeaVmeiCsicsICfml6XluLjlronlhajmlZnogrInLCAn5pel5bi45a6J5YWo5pWZ6IKyJywgJ+aXpeW4uOWuieWFqOaVmeiCsiddLFxyXG4gICAgICAgIG1vZGFsOiBmYWxzZSxcclxuICAgICAgICBjb3VudHJ5TGlzdDogW10sXHJcbiAgICAgICAgcG9JZDogW10sXHJcbiAgICAgICAgaWQ6ICcnLFxyXG4gICAgICAgIGJsdWVwcmludElkOiBcIlwiLFxyXG4gICAgICAgIGRvd25sb2FkdXJsOiBcIlwiLFxyXG4gICAgICAgIGltZ1VybDogW10sXHJcbiAgICAgICAgZGlzYmFsOiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICAgIG1ldGhvZHMgPSB7XHJcbiAgICAgICAgb3RoZXJzVGFwKGUpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICBzZWxmLnR5cGVJZCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LnR5cGVpZDtcclxuICAgICAgICAgIHNlbGYuZG93bmxvYWR1cmwgPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5kb3dubG9hZHVybDtcclxuICAgICAgICAgIHNlbGYuYmx1ZXByaW50SWQgPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pZDtcclxuICAgICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgndXNlci9yZXNvdXJjZUluZm8uZG8nLCB7XHJcbiAgICAgICAgICAgICAgcmVzb3VyY2VJZDogc2VsZi5ibHVlcHJpbnRJZCxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfpooTop4gyMiAnLCBkYXRhKTtcclxuICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgaWYgKHNlbGYudHlwZUlkID09PSBcInZpZGVvXCIgfHwgc2VsZi50eXBlSWQgPT09IFwiY2xhc3NcIikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIjIyMjJcIilcclxuICAgICAgICAgICAgd3guc2V0U3RvcmFnZVN5bmMoJ3ZpZGVvJywgc2VsZi5kb3dubG9hZHVybCk7XHJcbiAgICAgICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgICAgICAgIHVybDogJy9wYWdlcy9tb3ZpZSdcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHNlbGYudHlwZUlkID09PSBcInBwdFwiKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicHBwcHBwdFwiKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNlbGYuZG93bmxvYWR1cmxlZWVcIiwgc2VsZi5kb3dubG9hZHVybClcclxuICAgICAgICAgICAgd3guZG93bmxvYWRGaWxlKHvCoFxyXG4gICAgICAgICAgICAgIHVybDogc2VsZi5kb3dubG9hZHVybCxcclxuICAgICAgICAgICAgICDCoMKgwqBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVzc3NcIiwgcmVzKVxyXG4gICAgICAgICAgICAgICAgc2VsZi5maWxlUGF0aCA9IHJlcy50ZW1wRmlsZVBhdGg7wqDCoMKgXHJcbiAgICAgICAgICAgICAgICB3eC5vcGVuRG9jdW1lbnQoe8KgwqDCoMKgwqBcclxuICAgICAgICAgICAgICAgICAgZmlsZVBhdGg6IHNlbGYuZmlsZVBhdGgsXHJcbiAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge8KgwqDCoMKgwqDCoFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfmiZPlvIDmlofmoaPmiJDlip8nLCByZXMpwqDCoMKgwqDCoFxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBmYWlsOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5omT5byA5paH5qGj5aSx6LSlJywgcmVzKcKgwqBcclxuICAgICAgICAgICAgICAgICAgfcKgwqDCoMKgXHJcbiAgICAgICAgICAgICAgICB9KcKgwqDCoFxyXG4gICAgICAgICAgICAgIH3CoMKgXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHNlbGYudHlwZUlkID09PSBcImltYWdlXCIpIHtcclxuICAgICAgICAgICAgc2VsZi5pbWdVcmwucHVzaChzZWxmLmRvd25sb2FkdXJsKVxyXG4gICAgICAgICAgICB3eC5wcmV2aWV3SW1hZ2Uoe1xyXG4gICAgICAgICAgICAgIGN1cnJlbnQ6IHNlbGYuZG93bmxvYWR1cmwsXHJcbiAgICAgICAgICAgICAgdXJsczogc2VsZi5pbWdVcmxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbG9zZU1vZGFsKCkge1xyXG4gICAgICAgICAgdGhpcy5tb2RhbCA9IGZhbHNlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRTZWFyY2hDb250ZW50KGUpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICAgICAgICB0aGlzLmlucHV0dmFsdWUgPSBlLmRldGFpbC52YWx1ZTtcclxuICAgICAgICAgIHd4LnNldFN0b3JhZ2VTeW5jKCdpbnB1dHZhbHVlJywgdGhpcy5pbnB1dHZhbHVlKTtcclxuICAgICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzYXZlKGUpIHtcclxuICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgIGlmIChzZWxmLmlucHV0dmFsdWUgPT0gXCJcIikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIjMzXCIpXHJcbiAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XHJcbiAgICAgICAgICAgICAgdGl0bGU6ICfor7floavlhpnmlrnmoYjlkI3np7AnLFxyXG4gICAgICAgICAgICAgIGljb246ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgICBkdXJhdGlvbjogMjAwMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZi5zaG93VGFnID09IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCI0NFwiKVxyXG4gICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xyXG4gICAgICAgICAgICAgIHRpdGxlOiAn6K+36YCJ5oup5pa55qGI5Li76aKYJyxcclxuICAgICAgICAgICAgICBpY29uOiAnc3VjY2VzcycsXHJcbiAgICAgICAgICAgICAgZHVyYXRpb246IDIwMDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5kaXNiYWwgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCc1NSAnKTtcclxuICAgICAgICAgICAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3VzZXIvYmx1ZXByaW50U2F2ZS5kbycsIHtcclxuICAgICAgICAgICAgICAgICAgY2F0YWxvZ0lkOiBzZWxmLnNob3dUYWcuaWQsXHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHNlbGYuaW5wdXR2YWx1ZSxcclxuICAgICAgICAgICAgICAgICAgcmVzb3VyY2VJZHM6IHNlbGYucG9JZC5qb2luKFwiLFwiKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkZFwiLCBkYXRhKVxyXG4gICAgICAgICAgICAgICAgICBzZWxmLmRpc2JhbCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfmlrnmoYjkv53lrZjmiJDlip8nLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb246ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjAwMFxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgd3gucmVtb3ZlU3RvcmFnZVN5bmMoXCJ2aWRlb1wiKVxyXG4gICAgICAgICAgICB3eC5yZW1vdmVTdG9yYWdlU3luYyhcImlucHV0dmFsdWVcIilcclxuICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB3eC5zd2l0Y2hUYWIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgdXJsOiAnL3BhZ2VzL3NjaGVtZSdcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICB9LCAyMDAwKTtcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzdXJlKCkge1xyXG4gICAgICB0aGlzLnNob3dUYWcgPSB0aGlzLmNhdGFsb2dzW3RoaXMuY3VycmVudEluZGV4XVxyXG4gICAgICB0aGlzLm1vZGFsID0gZmFsc2VcclxuICAgICAgY29uc29sZS5sb2codGhpcy5zaG93VGFnLmlkKVxyXG4gICAgICB3eC5zZXRTdG9yYWdlU3luYygnc2hvd1RhZycsIHRoaXMuc2hvd1RhZyk7XHJcbiAgICB9LFxyXG4gICAgdGl0RnVuKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZSlcclxuICAgICAgdGhpcy5jdXJyZW50SW5kZXggPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleFxyXG4gICAgfSxcclxuICAgIHNob3dNb2RhbCgpIHtcclxuICAgICAgdGhpcy5tb2RhbCA9ICF0aGlzLm1vZGFsXHJcbiAgICB9LFxyXG4gICAgcmVzZXQoKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKDEpXHJcbiAgICAgIC8vIHRoaXMubW9kYWwgPSBmYWxzZVxyXG4gICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IG51bGxcclxuICAgICAgdGhpcy5zaG93VGFnID0gbnVsbFxyXG4gICAgfSxcclxuICAgIHNlYXJjaENsaWNrKGUpIHtcclxuICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgdXJsOiAnL3BhZ2VzL3NlYXJjaCdcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgcmFua2luZyhlKSB7XHJcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgIHVybDogJy9wYWdlcy9yYW5raW5nJ1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9O1xyXG4gIGRlbGV0ZShlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlKVxyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgc2VsZi5yZXNvdXJjZUlkID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaWQ7XHJcbiAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3VzZXIvYmx1ZXByaW50UmVzb3VyY2VEZWxldGUuZG8nLCB7XHJcbiAgICAgICAgcmVzb3VyY2VJZDogc2VsZi5yZXNvdXJjZUlkXHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygn5Yig6ZmkICcsIGRhdGEpO1xyXG4gICAgICAgIHNlbGYud2hlbkFwcFJlYWR5U2hvdygpXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHd4LnNob3dUb2FzdCh7XHJcbiAgICAgICAgICAgIHRpdGxlOiAn5Yig6Zmk5oiQ5YqfJyxcclxuICAgICAgICAgICAgaWNvbjogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICBkdXJhdGlvbjogMjAwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSwgMTAwKTtcclxuICAgICAgfSlcclxuICB9XHJcbiAgb25Mb2FkKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICB0aGlzLnJlc291cmNlSWQgPSBlLnJlc291cmNlSWQ7XHJcbiAgfVxyXG4gIHdoZW5BcHBSZWFkeVNob3coKSB7XHJcbiAgICB3eC5yZW1vdmVTdG9yYWdlU3luYyhcInZpZGVvXCIpXHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgaWYoIXd4LmdldFN0b3JhZ2VTeW5jKCdpbnB1dHZhbHVlJykpe1xyXG4gICAgICAgc2VsZi5pbnB1dHZhbHVlPVwiXCI7XHJcbiAgICAgICBzZWxmLnNob3dUYWcgPSBudWxsXHJcbiAgICAgICBjb25zb2xlLmxvZygxMTExMTExMTExMTExMTExMTExMTExMTExMTExMSlcclxuICAgICB9ZWxzZXtcclxuICAgICAgIGNvbnNvbGUubG9nKDIyMjIyMjIyMjIyMjIyMjIyMjIyKVxyXG4gICAgICAgIHNlbGYuaW5wdXR2YWx1ZSA9IHd4LmdldFN0b3JhZ2VTeW5jKCdpbnB1dHZhbHVlJyk7XHJcbiAgICAgfVxyXG4gICAgIGlmKCF3eC5nZXRTdG9yYWdlU3luYygnc2hvd1RhZycpKXtcclxuICAgICAgIFxyXG4gICAgIH1lbHNle1xyXG4gICAgICAgIHNlbGYuc2hvd1RhZyA9IHd4LmdldFN0b3JhZ2VTeW5jKCdzaG93VGFnJyk7XHJcblxyXG4gICAgIH1cclxuICAgICAgc2VsZi4kYXBwbHkoKTtcclxuICAgIC8vIHNlbGYuaW5wdXR2YWx1ZSA9XCJcIjtcclxuICAgIHNlbGYucG9JZD1bXTtcclxuICAgIHNlbGYucmVzb3VyY2VJZD1cIlwiO1xyXG4gICAgXHJcbiAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3VzZXIvYmx1ZXByaW50UHJldmlldy5kbycsIHt9LCB7fSkudGhlbihkYXRhID0+IHtcclxuICAgICAgY29uc29sZS5sb2coJ2RhdGEgaXM6JywgZGF0YSk7XHJcbiAgICAgIHNlbGYuY2F0YWxvZ3MgPSBkYXRhLmNhdGFsb2dzXHJcbiAgICAgIHNlbGYucmVzb3VyY2VzID0gZGF0YS5yZXNvdXJjZXM7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZi5yZXNvdXJjZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBzZWxmLnBvSWQucHVzaChzZWxmLnJlc291cmNlc1tpXS5pZClcclxuICAgICAgfVxyXG4gICAgICBjb25zb2xlLmxvZygnc2VsZi5wb0lkJywgc2VsZi5wb0lkKVxyXG4gICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAvLyDlj5bliY025Liq77yM5aKe5Yqg5LiA5LiqbW9yZVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIG9uU2hhcmVBcHBNZXNzYWdlKHJlcykge1xyXG4gICAgcmV0dXJuIHRoaXMud2hlbkFwcFNoYXJlKHtcclxuICAgICAgdGl0bGU6ICflronlhajmlZnogrLotYTmupDlnLDlm74nXHJcbiAgICB9KTtcclxuICB9XHJcbiAgcmVnaW9uY2hhbmdlKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUudHlwZSk7XHJcbiAgfVxyXG4gIG1hcmtlcnRhcChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlLm1hcmtlcklkKTtcclxuICB9XHJcbiAgY29udHJvbHRhcChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlLmNvbnRyb2xJZCk7XHJcbiAgfVxyXG4gIH1cclxuIl19