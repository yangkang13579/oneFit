"use strict";

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


var List = function (_wepy$page) {
  _inherits(List, _wepy$page);

  function List() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, List);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = List.__proto__ || Object.getPrototypeOf(List)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
      navigationBarTitleText: "我的",
      navigationBarBackgroundColor: "#fff"
    }, _this.components = {}, _this.data = {
      userInfo: null,
      currentIndex: 0,
      isUser: '',
      products: [],
      productsTwo: [],
      array: ['种植户', '经销商', '中化作物员工']
    }, _this.methods = {
      shangchuan: function shangchuan() {
        wx.navigateTo({
          url: "/pages/upload"
        });
      },
      zhonghua: function zhonghua() {
        wx.navigateTo({
          url: "/pages/zhonghua"
        });
      },
      navFun: function navFun() {
        wx.switchTab({
          url: '/pages/home'
        });
      },
      bindPickerChange: function bindPickerChange(e) {
        var role = e.detail.value === '0' ? 1 : e.detail.value === '1' ? 3 : 4;
        console.log(role);
        wx.navigateTo({
          url: "/pages/order?role=" + role
        });
      },

      // 敬请期待
      alert: function alert() {
        _wepy2.default.showModal({
          title: "提示",
          content: "敬请期待",
          showCancel: false,
          success: function success(res) {
            if (res.confirm) {
              console.log("用户点击确定");
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      },
      lianxi: function lianxi() {
        wx.navigateTo({
          url: "/pages/webview1"
        });
      },

      // 会议管理
      mettingManage: function mettingManage() {
        wx.navigateTo({
          url: "/pages/addressBook"
        });
      },

      // 我的会议
      mySign: function mySign() {
        wx.navigateTo({
          url: "/pages/car"
        });
      },

      // 我的样品申领
      mySample: function mySample() {
        wx.navigateTo({
          url: "/pages/meMaple"
        });
      },


      // 创建会议
      addMeeting: function addMeeting() {
        wx.navigateTo({
          url: "/pages/editAddress"
        });
      },
      navTo: function navTo() {
        wx.navigateTo({
          url: "/pages/order?role=" + this.userInfo.role
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(List, [{
    key: "onLoad",
    value: function onLoad() {}
  }, {
    key: "whenAppReadyShow",
    value: function whenAppReadyShow() {
      var _this2 = this;

      this.fetchDataPromise("user/userInfo.json", {}).then(function (data) {
        _this2.isUser = data.userType;
        _this2.userInfo = data;
        _this2.$apply();
        wx.setStorage({
          key: "userInfo",
          data: JSON.stringify(_this2.userInfo)
        });
      }).catch(function (error) {});
    }
  }, {
    key: "onShareAppMessage",
    value: function onShareAppMessage(res) {}
  }, {
    key: "regionchange",
    value: function regionchange(e) {
      // console.log(e.type);
    }
  }, {
    key: "markertap",
    value: function markertap(e) {
      // console.log(e.markerId);
    }
  }, {
    key: "controltap",
    value: function controltap(e) {
      // console.log(e.controlId);
    }
  }]);

  return List;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(List , 'pages/list'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpc3QuanMiXSwibmFtZXMiOlsiTGlzdCIsIm1peGlucyIsIlBhZ2VNaXhpbiIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsImRhdGEiLCJ1c2VySW5mbyIsImN1cnJlbnRJbmRleCIsImlzVXNlciIsInByb2R1Y3RzIiwicHJvZHVjdHNUd28iLCJhcnJheSIsIm1ldGhvZHMiLCJzaGFuZ2NodWFuIiwid3giLCJuYXZpZ2F0ZVRvIiwidXJsIiwiemhvbmdodWEiLCJuYXZGdW4iLCJzd2l0Y2hUYWIiLCJiaW5kUGlja2VyQ2hhbmdlIiwiZSIsInJvbGUiLCJkZXRhaWwiLCJ2YWx1ZSIsImNvbnNvbGUiLCJsb2ciLCJhbGVydCIsIndlcHkiLCJzaG93TW9kYWwiLCJ0aXRsZSIsImNvbnRlbnQiLCJzaG93Q2FuY2VsIiwic3VjY2VzcyIsInJlcyIsImNvbmZpcm0iLCJjYW5jZWwiLCJsaWFueGkiLCJtZXR0aW5nTWFuYWdlIiwibXlTaWduIiwibXlTYW1wbGUiLCJhZGRNZWV0aW5nIiwibmF2VG8iLCJmZXRjaERhdGFQcm9taXNlIiwidGhlbiIsInVzZXJUeXBlIiwiJGFwcGx5Iiwic2V0U3RvcmFnZSIsImtleSIsIkpTT04iLCJzdHJpbmdpZnkiLCJjYXRjaCIsImVycm9yIiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7OztBQUZBOzs7SUFHcUJBLEk7Ozs7Ozs7Ozs7Ozs7O2tMQUNuQkMsTSxHQUFTLENBQUNDLGNBQUQsQyxRQUNUQyxNLEdBQVM7QUFDUEMsOEJBQXdCLElBRGpCO0FBRVBDLG9DQUE4QjtBQUZ2QixLLFFBSVRDLFUsR0FBYSxFLFFBQ2JDLEksR0FBTztBQUNMQyxnQkFBVSxJQURMO0FBRUxDLG9CQUFjLENBRlQ7QUFHTEMsY0FBTyxFQUhGO0FBSUxDLGdCQUFVLEVBSkw7QUFLTEMsbUJBQWEsRUFMUjtB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LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8qIGdsb2JhbCB3eCAqL1xyXG5pbXBvcnQgd2VweSBmcm9tIFwid2VweVwiO1xyXG5pbXBvcnQgUGFnZU1peGluIGZyb20gXCIuLi9taXhpbnMvcGFnZVwiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaXN0IGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICBtaXhpbnMgPSBbUGFnZU1peGluXTtcclxuICBjb25maWcgPSB7XHJcbiAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiBcIuaIkeeahFwiLFxyXG4gICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcclxuICB9O1xyXG4gIGNvbXBvbmVudHMgPSB7fTtcclxuICBkYXRhID0ge1xyXG4gICAgdXNlckluZm86IG51bGwsXHJcbiAgICBjdXJyZW50SW5kZXg6IDAsXHJcbiAgICBpc1VzZXI6JycsXHJcbiAgICBwcm9kdWN0czogW10sXHJcbiAgICBwcm9kdWN0c1R3bzogW10sXHJcbiAgICBhcnJheTogWyfnp43mpI3miLcnLCAn57uP6ZSA5ZWGJywgJ+S4reWMluS9nOeJqeWRmOW3pSddXHJcbiAgfTtcclxuICBtZXRob2RzID0ge1xyXG4gICAgc2hhbmdjaHVhbigpe1xyXG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICB1cmw6IFwiL3BhZ2VzL3VwbG9hZFwiXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHpob25naHVhKCl7XHJcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgIHVybDogXCIvcGFnZXMvemhvbmdodWFcIlxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBuYXZGdW4gKCkge1xyXG4gICAgICB3eC5zd2l0Y2hUYWIoe1xyXG4gICAgICAgIHVybDogJy9wYWdlcy9ob21lJ1xyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGJpbmRQaWNrZXJDaGFuZ2UgKGUpIHtcclxuICAgICAgdmFyIHJvbGUgPSAgZS5kZXRhaWwudmFsdWUgPT09ICcwJyA/IDEgOiAgZS5kZXRhaWwudmFsdWUgPT09ICcxJyA/IDMgOiA0XHJcbiAgICAgIGNvbnNvbGUubG9nKHJvbGUpXHJcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgIHVybDogXCIvcGFnZXMvb3JkZXI/cm9sZT1cIiArIHJvbGVcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgLy8g5pWs6K+35pyf5b6FXHJcbiAgICBhbGVydCgpIHtcclxuICAgICAgd2VweS5zaG93TW9kYWwoe1xyXG4gICAgICAgIHRpdGxlOiBcIuaPkOekulwiLFxyXG4gICAgICAgIGNvbnRlbnQ6IFwi5pWs6K+35pyf5b6FXCIsXHJcbiAgICAgICAgc2hvd0NhbmNlbDogZmFsc2UsXHJcbiAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgIGlmIChyZXMuY29uZmlybSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIueUqOaIt+eCueWHu+ehruWumlwiKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAocmVzLmNhbmNlbCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIueUqOaIt+eCueWHu+WPlua2iFwiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGxpYW54aSgpe1xyXG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICB1cmw6IFwiL3BhZ2VzL3dlYnZpZXcxXCJcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgLy8g5Lya6K6u566h55CGXHJcbiAgICBtZXR0aW5nTWFuYWdlKCkge1xyXG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICB1cmw6IFwiL3BhZ2VzL2FkZHJlc3NCb29rXCJcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgLy8g5oiR55qE5Lya6K6uXHJcbiAgICBteVNpZ24oKSB7XHJcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgIHVybDogXCIvcGFnZXMvY2FyXCJcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgLy8g5oiR55qE5qC35ZOB55Sz6aKGXHJcbiAgICBteVNhbXBsZSgpe1xyXG4gICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgIHVybDogXCIvcGFnZXMvbWVNYXBsZVwiXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyDliJvlu7rkvJrorq5cclxuICAgIGFkZE1lZXRpbmcoKSB7XHJcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgIHVybDogXCIvcGFnZXMvZWRpdEFkZHJlc3NcIlxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBuYXZUbyAoKSB7XHJcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgIHVybDogXCIvcGFnZXMvb3JkZXI/cm9sZT1cIiArIHRoaXMudXNlckluZm8ucm9sZVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9O1xyXG4gIG9uTG9hZCgpIHtcclxuICB9XHJcbiAgd2hlbkFwcFJlYWR5U2hvdygpIHtcclxuICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShcInVzZXIvdXNlckluZm8uanNvblwiLCB7fSlcclxuICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgdGhpcy5pc1VzZXIgPSBkYXRhLnVzZXJUeXBlO1xyXG4gICAgICAgIHRoaXMudXNlckluZm8gPSBkYXRhXHJcbiAgICAgICAgdGhpcy4kYXBwbHkoKVxyXG4gICAgICAgIHd4LnNldFN0b3JhZ2Uoe1xyXG4gICAgICAgICAga2V5OlwidXNlckluZm9cIixcclxuICAgICAgICAgIGRhdGE6SlNPTi5zdHJpbmdpZnkodGhpcy51c2VySW5mbylcclxuICAgICAgICB9KVxyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHt9KTtcclxuICB9XHJcbiAgb25TaGFyZUFwcE1lc3NhZ2UocmVzKSB7fVxyXG4gIHJlZ2lvbmNoYW5nZShlKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhlLnR5cGUpO1xyXG4gIH1cclxuICBtYXJrZXJ0YXAoZSkge1xyXG4gICAgLy8gY29uc29sZS5sb2coZS5tYXJrZXJJZCk7XHJcbiAgfVxyXG4gIGNvbnRyb2x0YXAoZSkge1xyXG4gICAgLy8gY29uc29sZS5sb2coZS5jb250cm9sSWQpO1xyXG4gIH1cclxufVxyXG4iXX0=