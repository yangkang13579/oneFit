"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _page = require('./../../mixins/page.js');

var _page2 = _interopRequireDefault(_page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/* global wx */


var User = function (_wepy$page) {
  _inherits(User, _wepy$page);

  function User() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, User);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = User.__proto__ || Object.getPrototypeOf(User)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
      navigationBarTitleText: "我的",
      navigationBarBackgroundColor: "#fff"
    }, _this.components = {}, _this.data = {
      userInfo: null
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
          url: "/pages/home"
        });
      },
      bindPickerChange: function bindPickerChange(e) {
        var role = e.detail.value === "0" ? 1 : e.detail.value === "1" ? 3 : 4;
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
  // mixins = [PageMixin];


  _createClass(User, [{
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

  return User;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(User , 'pages/user/user'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVzZXIuanMiXSwibmFtZXMiOlsiVXNlciIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsImRhdGEiLCJ1c2VySW5mbyIsIm1ldGhvZHMiLCJzaGFuZ2NodWFuIiwid3giLCJuYXZpZ2F0ZVRvIiwidXJsIiwiemhvbmdodWEiLCJuYXZGdW4iLCJzd2l0Y2hUYWIiLCJiaW5kUGlja2VyQ2hhbmdlIiwiZSIsInJvbGUiLCJkZXRhaWwiLCJ2YWx1ZSIsImNvbnNvbGUiLCJsb2ciLCJhbGVydCIsIndlcHkiLCJzaG93TW9kYWwiLCJ0aXRsZSIsImNvbnRlbnQiLCJzaG93Q2FuY2VsIiwic3VjY2VzcyIsInJlcyIsImNvbmZpcm0iLCJjYW5jZWwiLCJsaWFueGkiLCJtZXR0aW5nTWFuYWdlIiwibXlTaWduIiwibXlTYW1wbGUiLCJhZGRNZWV0aW5nIiwibmF2VG8iLCJmZXRjaERhdGFQcm9taXNlIiwidGhlbiIsImlzVXNlciIsInVzZXJUeXBlIiwiJGFwcGx5Iiwic2V0U3RvcmFnZSIsImtleSIsIkpTT04iLCJzdHJpbmdpZnkiLCJjYXRjaCIsImVycm9yIiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7OztBQUZBOzs7SUFHcUJBLEk7Ozs7Ozs7Ozs7Ozs7O2tMQUVuQkMsTSxHQUFTO0FBQ1BDLDhCQUF3QixJQURqQjtBQUVQQyxvQ0FBOEI7QUFGdkIsSyxRQUlUQyxVLEdBQWEsRSxRQUNiQyxJLEdBQU87QUFDTEMsZ0JBQVU7QUFETCxLLFFBR1BDLE8sR0FBVTtBQUNSQyxnQkFEUSx3QkFDSztBQUNYQyxXQUFHQyxVQUFILENBQWM7QUFDWkMsZUFBSztBQURPLFNBQWQ7QUFHRCxPQUxPO0FBTVJDLGNBTlEsc0JBTUc7QUFDVEgsV0FBR0MsVUFBSCxDQUFjO0FBQ1pDLGVBQUs7QUFETyxTQUFkO0FBR0QsT0FWTztBQVdSRSxZQVhRLG9CQVdDO0FBQ1BKLFdBQUdLLFNBQUgsQ0FBYTtBQUNYSCxlQUFLO0FBRE0sU0FBYjtBQUdELE9BZk87QUFnQlJJLHNCQWhCUSw0QkFnQlNDLENBaEJULEVBZ0JZO0FBQ2xCLFlBQUlDLE9BQU9ELEVBQUVFLE1BQUYsQ0FBU0MsS0FBVCxLQUFtQixHQUFuQixHQUF5QixDQUF6QixHQUE2QkgsRUFBRUUsTUFBRixDQUFTQyxLQUFULEtBQW1CLEdBQW5CLEdBQXlCLENBQXpCLEdBQTZCLENBQXJFO0FBQ0FDLGdCQUFRQyxHQUFSLENBQVlKLElBQVo7QUFDQVIsV0FBR0MsVUFBSCxDQUFjO0FBQ1pDLGVBQUssdUJBQXVCTTtBQURoQixTQUFkO0FBR0QsT0F0Qk87O0FBdUJSO0FBQ0FLLFdBeEJRLG1CQXdCQTtBQUNOQyx1QkFBS0MsU0FBTCxDQUFlO0FBQ2JDLGlCQUFPLElBRE07QUFFYkMsbUJBQVMsTUFGSTtBQUdiQyxzQkFBWSxLQUhDO0FBSWJDLGlCQUphLG1CQUlMQyxHQUpLLEVBSUE7QUFDWCxnQkFBSUEsSUFBSUMsT0FBUixFQUFpQjtBQUNmVixzQkFBUUMsR0FBUixDQUFZLFFBQVo7QUFDRCxhQUZELE1BRU8sSUFBSVEsSUFBSUUsTUFBUixFQUFnQjtBQUNyQlgsc0JBQVFDLEdBQVIsQ0FBWSxRQUFaO0FBQ0Q7QUFDRjtBQVZZLFNBQWY7QUFZRCxPQXJDTztBQXNDUlcsWUF0Q1Esb0JBc0NDO0FBQ1B2QixXQUFHQyxVQUFILENBQWM7QUFDWkMsZUFBSztBQURPLFNBQWQ7QUFHRCxPQTFDTzs7QUEyQ1I7QUFDQXNCLG1CQTVDUSwyQkE0Q1E7QUFDZHhCLFdBQUdDLFVBQUgsQ0FBYztBQUNaQyxlQUFLO0FBRE8sU0FBZDtBQUdELE9BaERPOztBQWlEUjtBQUNBdUIsWUFsRFEsb0JBa0RDO0FBQ1B6QixXQUFHQyxVQUFILENBQWM7QUFDWkMsZUFBSztBQURPLFNBQWQ7QUFHRCxPQXRETzs7QUF1RFI7QUFDQXdCLGNBeERRLHNCQXdERztBQUNUMUIsV0FBR0MsVUFBSCxDQUFjO0FBQ1pDLGVBQUs7QUFETyxTQUFkO0FBR0QsT0E1RE87OztBQThEUjtBQUNBeUIsZ0JBL0RRLHdCQStESztBQUNYM0IsV0FBR0MsVUFBSCxDQUFjO0FBQ1pDLGVBQUs7QUFETyxTQUFkO0FBR0QsT0FuRU87QUFvRVIwQixXQXBFUSxtQkFvRUE7QUFDTjVCLFdBQUdDLFVBQUgsQ0FBYztBQUNaQyxlQUFLLHVCQUF1QixLQUFLTCxRQUFMLENBQWNXO0FBRDlCLFNBQWQ7QUFHRDtBQXhFTyxLOztBQVRWOzs7Ozs2QkFtRlMsQ0FBRTs7O3VDQUNRO0FBQUE7O0FBQ2pCLFdBQUtxQixnQkFBTCxDQUFzQixvQkFBdEIsRUFBNEMsRUFBNUMsRUFDR0MsSUFESCxDQUNRLGdCQUFRO0FBQ1osZUFBS0MsTUFBTCxHQUFjbkMsS0FBS29DLFFBQW5CO0FBQ0EsZUFBS25DLFFBQUwsR0FBZ0JELElBQWhCO0FBQ0EsZUFBS3FDLE1BQUw7QUFDQWpDLFdBQUdrQyxVQUFILENBQWM7QUFDWkMsZUFBSyxVQURPO0FBRVp2QyxnQkFBTXdDLEtBQUtDLFNBQUwsQ0FBZSxPQUFLeEMsUUFBcEI7QUFGTSxTQUFkO0FBSUQsT0FUSCxFQVVHeUMsS0FWSCxDQVVTLFVBQVNDLEtBQVQsRUFBZ0IsQ0FBRSxDQVYzQjtBQVdEOzs7c0NBQ2lCbkIsRyxFQUFLLENBQUU7OztpQ0FDWmIsQyxFQUFHO0FBQ2Q7QUFDRDs7OzhCQUNTQSxDLEVBQUc7QUFDWDtBQUNEOzs7K0JBQ1VBLEMsRUFBRztBQUNaO0FBQ0Q7Ozs7RUEzRytCTyxlQUFLMEIsSTs7a0JBQWxCakQsSSIsImZpbGUiOiJ1c2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8qIGdsb2JhbCB3eCAqL1xyXG5pbXBvcnQgd2VweSBmcm9tIFwid2VweVwiO1xyXG5pbXBvcnQgUGFnZU1peGluIGZyb20gXCIuLi8uLi9taXhpbnMvcGFnZVwiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVc2VyIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICAvLyBtaXhpbnMgPSBbUGFnZU1peGluXTtcclxuICBjb25maWcgPSB7XHJcbiAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiBcIuaIkeeahFwiLFxyXG4gICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcclxuICB9O1xyXG4gIGNvbXBvbmVudHMgPSB7fTtcclxuICBkYXRhID0ge1xyXG4gICAgdXNlckluZm86IG51bGxcclxuICB9O1xyXG4gIG1ldGhvZHMgPSB7XHJcbiAgICBzaGFuZ2NodWFuKCkge1xyXG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICB1cmw6IFwiL3BhZ2VzL3VwbG9hZFwiXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHpob25naHVhKCkge1xyXG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICB1cmw6IFwiL3BhZ2VzL3pob25naHVhXCJcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgbmF2RnVuKCkge1xyXG4gICAgICB3eC5zd2l0Y2hUYWIoe1xyXG4gICAgICAgIHVybDogXCIvcGFnZXMvaG9tZVwiXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGJpbmRQaWNrZXJDaGFuZ2UoZSkge1xyXG4gICAgICB2YXIgcm9sZSA9IGUuZGV0YWlsLnZhbHVlID09PSBcIjBcIiA/IDEgOiBlLmRldGFpbC52YWx1ZSA9PT0gXCIxXCIgPyAzIDogNDtcclxuICAgICAgY29uc29sZS5sb2cocm9sZSk7XHJcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgIHVybDogXCIvcGFnZXMvb3JkZXI/cm9sZT1cIiArIHJvbGVcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgLy8g5pWs6K+35pyf5b6FXHJcbiAgICBhbGVydCgpIHtcclxuICAgICAgd2VweS5zaG93TW9kYWwoe1xyXG4gICAgICAgIHRpdGxlOiBcIuaPkOekulwiLFxyXG4gICAgICAgIGNvbnRlbnQ6IFwi5pWs6K+35pyf5b6FXCIsXHJcbiAgICAgICAgc2hvd0NhbmNlbDogZmFsc2UsXHJcbiAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgIGlmIChyZXMuY29uZmlybSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIueUqOaIt+eCueWHu+ehruWumlwiKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAocmVzLmNhbmNlbCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIueUqOaIt+eCueWHu+WPlua2iFwiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGxpYW54aSgpIHtcclxuICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgdXJsOiBcIi9wYWdlcy93ZWJ2aWV3MVwiXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIC8vIOS8muiurueuoeeQhlxyXG4gICAgbWV0dGluZ01hbmFnZSgpIHtcclxuICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgdXJsOiBcIi9wYWdlcy9hZGRyZXNzQm9va1wiXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIC8vIOaIkeeahOS8muiurlxyXG4gICAgbXlTaWduKCkge1xyXG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICB1cmw6IFwiL3BhZ2VzL2NhclwiXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIC8vIOaIkeeahOagt+WTgeeUs+mihlxyXG4gICAgbXlTYW1wbGUoKSB7XHJcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgIHVybDogXCIvcGFnZXMvbWVNYXBsZVwiXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyDliJvlu7rkvJrorq5cclxuICAgIGFkZE1lZXRpbmcoKSB7XHJcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgIHVybDogXCIvcGFnZXMvZWRpdEFkZHJlc3NcIlxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBuYXZUbygpIHtcclxuICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgdXJsOiBcIi9wYWdlcy9vcmRlcj9yb2xlPVwiICsgdGhpcy51c2VySW5mby5yb2xlXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgb25Mb2FkKCkge31cclxuICB3aGVuQXBwUmVhZHlTaG93KCkge1xyXG4gICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKFwidXNlci91c2VySW5mby5qc29uXCIsIHt9KVxyXG4gICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICB0aGlzLmlzVXNlciA9IGRhdGEudXNlclR5cGU7XHJcbiAgICAgICAgdGhpcy51c2VySW5mbyA9IGRhdGE7XHJcbiAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgICB3eC5zZXRTdG9yYWdlKHtcclxuICAgICAgICAgIGtleTogXCJ1c2VySW5mb1wiLFxyXG4gICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkodGhpcy51c2VySW5mbylcclxuICAgICAgICB9KTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7fSk7XHJcbiAgfVxyXG4gIG9uU2hhcmVBcHBNZXNzYWdlKHJlcykge31cclxuICByZWdpb25jaGFuZ2UoZSkge1xyXG4gICAgLy8gY29uc29sZS5sb2coZS50eXBlKTtcclxuICB9XHJcbiAgbWFya2VydGFwKGUpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKGUubWFya2VySWQpO1xyXG4gIH1cclxuICBjb250cm9sdGFwKGUpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKGUuY29udHJvbElkKTtcclxuICB9XHJcbn1cclxuIl19