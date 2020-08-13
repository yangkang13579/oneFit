"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _page = require('./../../mixins/page.js');

var _page2 = _interopRequireDefault(_page);

var _tabBar = require('./../../components/tabBar.js');

var _tabBar2 = _interopRequireDefault(_tabBar);

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

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = User.__proto__ || Object.getPrototypeOf(User)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
      navigationBarTitleText: "我的"
    }, _this.components = {
      tabBar: _tabBar2.default
    }, _this.data = {
      height: "",
      userInfo: {}
    }, _this.methods = {
      goCard: function goCard() {
        wx.navigateTo({
          url: "/pages/user/card"
        });
      },
      goGroup: function goGroup() {
        wx.navigateTo({
          url: "/pages/user/myGroup"
        });
      },
      goCorse: function goCorse() {
        wx.navigateTo({
          url: "/pages/user/myCorse"
        });
      },
      goTice: function goTice() {
        wx.navigateTo({
          url: "/pages/user/myTice"
        });
      },
      goDoors: function goDoors() {
        wx.navigateTo({
          url: "/pages/user/changeFeat"
        });
      },
      goInfos: function goInfos() {
        wx.navigateTo({
          url: "/pages/user/myInfo"
        });
      },
      goYueKe: function goYueKe() {
        wx.navigateTo({
          url: "/pages/user/yueKe"
        });
      },
      myMembers: function myMembers() {
        wx.navigateTo({
          url: "/pages/user/members"
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(User, [{
    key: "onShow",
    value: function onShow() {
      wx.hideTabBar();
    }
  }, {
    key: "onLoad",
    value: function onLoad() {
      var _this2 = this;

      var that = this;
      wx.getStorage({
        key: "userInfo",
        success: function success(res) {
          that.userInfo = JSON.parse(res.data);
          that.$broadcast("tab", {
            current: 2,
            userInfo: that.userInfo
          });
        }
      });
      wx.getSystemInfo({
        success: function success(res) {
          _this2.height = res.statusBarHeight;
        }
      });
    }
  }, {
    key: "whenAppReadyShow",
    value: function whenAppReadyShow() {}
  }, {
    key: "onShareAppMessage",
    value: function onShareAppMessage(res) {}
  }, {
    key: "regionchange",
    value: function regionchange(e) {}
  }, {
    key: "markertap",
    value: function markertap(e) {}
  }, {
    key: "controltap",
    value: function controltap(e) {}
  }]);

  return User;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(User , 'pages/user/user'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVzZXIuanMiXSwibmFtZXMiOlsiVXNlciIsIm1peGlucyIsIlBhZ2VNaXhpbiIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJjb21wb25lbnRzIiwidGFiQmFyIiwiZGF0YSIsImhlaWdodCIsInVzZXJJbmZvIiwibWV0aG9kcyIsImdvQ2FyZCIsInd4IiwibmF2aWdhdGVUbyIsInVybCIsImdvR3JvdXAiLCJnb0NvcnNlIiwiZ29UaWNlIiwiZ29Eb29ycyIsImdvSW5mb3MiLCJnb1l1ZUtlIiwibXlNZW1iZXJzIiwiaGlkZVRhYkJhciIsInRoYXQiLCJnZXRTdG9yYWdlIiwia2V5Iiwic3VjY2VzcyIsInJlcyIsIkpTT04iLCJwYXJzZSIsIiRicm9hZGNhc3QiLCJjdXJyZW50IiwiZ2V0U3lzdGVtSW5mbyIsInN0YXR1c0JhckhlaWdodCIsImUiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBSEE7OztJQUlxQkEsSTs7Ozs7Ozs7Ozs7Ozs7a0xBQ25CQyxNLEdBQVMsQ0FBQ0MsY0FBRCxDLFFBQ1RDLE0sR0FBUztBQUNQQyw4QkFBd0I7QUFEakIsSyxRQUdUQyxVLEdBQWE7QUFDWEM7QUFEVyxLLFFBR2JDLEksR0FBTztBQUNMQyxjQUFRLEVBREg7QUFFTEMsZ0JBQVU7QUFGTCxLLFFBSVBDLE8sR0FBVTtBQUNSQyxZQURRLG9CQUNDO0FBQ1BDLFdBQUdDLFVBQUgsQ0FBYztBQUNaQyxlQUFLO0FBRE8sU0FBZDtBQUdELE9BTE87QUFNUkMsYUFOUSxxQkFNRTtBQUNSSCxXQUFHQyxVQUFILENBQWM7QUFDWkMsZUFBSztBQURPLFNBQWQ7QUFHRCxPQVZPO0FBV1JFLGFBWFEscUJBV0U7QUFDUkosV0FBR0MsVUFBSCxDQUFjO0FBQ1pDLGVBQUs7QUFETyxTQUFkO0FBR0QsT0FmTztBQWdCUkcsWUFoQlEsb0JBZ0JDO0FBQ1BMLFdBQUdDLFVBQUgsQ0FBYztBQUNaQyxlQUFLO0FBRE8sU0FBZDtBQUdELE9BcEJPO0FBcUJSSSxhQXJCUSxxQkFxQkU7QUFDUk4sV0FBR0MsVUFBSCxDQUFjO0FBQ1pDLGVBQUs7QUFETyxTQUFkO0FBR0QsT0F6Qk87QUEwQlJLLGFBMUJRLHFCQTBCRTtBQUNSUCxXQUFHQyxVQUFILENBQWM7QUFDWkMsZUFBSztBQURPLFNBQWQ7QUFHRCxPQTlCTztBQStCUk0sYUEvQlEscUJBK0JFO0FBQ1JSLFdBQUdDLFVBQUgsQ0FBYztBQUNaQyxlQUFLO0FBRE8sU0FBZDtBQUdELE9BbkNPO0FBb0NSTyxlQXBDUSx1QkFvQ0k7QUFDVlQsV0FBR0MsVUFBSCxDQUFjO0FBQ1pDLGVBQUs7QUFETyxTQUFkO0FBR0Q7QUF4Q08sSzs7Ozs7NkJBMENEO0FBQ1BGLFNBQUdVLFVBQUg7QUFDRDs7OzZCQUNRO0FBQUE7O0FBQ1AsVUFBSUMsT0FBTyxJQUFYO0FBQ0FYLFNBQUdZLFVBQUgsQ0FBYztBQUNaQyxhQUFLLFVBRE87QUFFWkMsZUFGWSxtQkFFSkMsR0FGSSxFQUVDO0FBQ1hKLGVBQUtkLFFBQUwsR0FBZ0JtQixLQUFLQyxLQUFMLENBQVdGLElBQUlwQixJQUFmLENBQWhCO0FBQ0FnQixlQUFLTyxVQUFMLENBQWdCLEtBQWhCLEVBQXVCO0FBQ3JCQyxxQkFBUyxDQURZO0FBRXJCdEIsc0JBQVVjLEtBQUtkO0FBRk0sV0FBdkI7QUFJRDtBQVJXLE9BQWQ7QUFVQUcsU0FBR29CLGFBQUgsQ0FBaUI7QUFDZk4saUJBQVMsc0JBQU87QUFDZCxpQkFBS2xCLE1BQUwsR0FBY21CLElBQUlNLGVBQWxCO0FBQ0Q7QUFIYyxPQUFqQjtBQUtEOzs7dUNBQ2tCLENBQUU7OztzQ0FDSE4sRyxFQUFLLENBQUU7OztpQ0FDWk8sQyxFQUFHLENBQUU7Ozs4QkFDUkEsQyxFQUFHLENBQUU7OzsrQkFDSkEsQyxFQUFHLENBQUU7Ozs7RUEvRWdCQyxlQUFLQyxJOztrQkFBbEJwQyxJIiwiZmlsZSI6InVzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyogZ2xvYmFsIHd4ICovXHJcbmltcG9ydCB3ZXB5IGZyb20gXCJ3ZXB5XCI7XHJcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSBcIi4uLy4uL21peGlucy9wYWdlXCI7XHJcbmltcG9ydCB0YWJCYXIgZnJvbSBcIi4uLy4uL2NvbXBvbmVudHMvdGFiQmFyXCI7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVzZXIgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gIG1peGlucyA9IFtQYWdlTWl4aW5dO1xyXG4gIGNvbmZpZyA9IHtcclxuICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6IFwi5oiR55qEXCJcclxuICB9O1xyXG4gIGNvbXBvbmVudHMgPSB7XHJcbiAgICB0YWJCYXJcclxuICB9O1xyXG4gIGRhdGEgPSB7XHJcbiAgICBoZWlnaHQ6IFwiXCIsXHJcbiAgICB1c2VySW5mbzoge31cclxuICB9O1xyXG4gIG1ldGhvZHMgPSB7XHJcbiAgICBnb0NhcmQoKSB7XHJcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgIHVybDogXCIvcGFnZXMvdXNlci9jYXJkXCJcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZ29Hcm91cCgpIHtcclxuICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgdXJsOiBcIi9wYWdlcy91c2VyL215R3JvdXBcIlxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBnb0NvcnNlKCkge1xyXG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICB1cmw6IFwiL3BhZ2VzL3VzZXIvbXlDb3JzZVwiXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGdvVGljZSgpIHtcclxuICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgdXJsOiBcIi9wYWdlcy91c2VyL215VGljZVwiXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGdvRG9vcnMoKSB7XHJcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgIHVybDogXCIvcGFnZXMvdXNlci9jaGFuZ2VGZWF0XCJcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZ29JbmZvcygpIHtcclxuICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgdXJsOiBcIi9wYWdlcy91c2VyL215SW5mb1wiXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGdvWXVlS2UoKSB7XHJcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgIHVybDogXCIvcGFnZXMvdXNlci95dWVLZVwiXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIG15TWVtYmVycygpIHtcclxuICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgdXJsOiBcIi9wYWdlcy91c2VyL21lbWJlcnNcIlxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9O1xyXG4gIG9uU2hvdygpIHtcclxuICAgIHd4LmhpZGVUYWJCYXIoKTtcclxuICB9XHJcbiAgb25Mb2FkKCkge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgd3guZ2V0U3RvcmFnZSh7XHJcbiAgICAgIGtleTogXCJ1c2VySW5mb1wiLFxyXG4gICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgIHRoYXQudXNlckluZm8gPSBKU09OLnBhcnNlKHJlcy5kYXRhKTtcclxuICAgICAgICB0aGF0LiRicm9hZGNhc3QoXCJ0YWJcIiwge1xyXG4gICAgICAgICAgY3VycmVudDogMixcclxuICAgICAgICAgIHVzZXJJbmZvOiB0aGF0LnVzZXJJbmZvXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgd3guZ2V0U3lzdGVtSW5mbyh7XHJcbiAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSByZXMuc3RhdHVzQmFySGVpZ2h0O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgd2hlbkFwcFJlYWR5U2hvdygpIHt9XHJcbiAgb25TaGFyZUFwcE1lc3NhZ2UocmVzKSB7fVxyXG4gIHJlZ2lvbmNoYW5nZShlKSB7fVxyXG4gIG1hcmtlcnRhcChlKSB7fVxyXG4gIGNvbnRyb2x0YXAoZSkge31cclxufVxyXG4iXX0=