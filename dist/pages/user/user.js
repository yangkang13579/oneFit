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

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = User.__proto__ || Object.getPrototypeOf(User)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
      navigationBarTitleText: "我的"
    }, _this.components = {}, _this.data = {
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
    key: "onLoad",
    value: function onLoad() {
      var _this2 = this;

      var that = this;
      wx.getStorage({
        key: "userInfo",
        success: function success(res) {
          that.userInfo = JSON.parse(res.data);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVzZXIuanMiXSwibmFtZXMiOlsiVXNlciIsIm1peGlucyIsIlBhZ2VNaXhpbiIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJjb21wb25lbnRzIiwiZGF0YSIsImhlaWdodCIsInVzZXJJbmZvIiwibWV0aG9kcyIsImdvQ2FyZCIsInd4IiwibmF2aWdhdGVUbyIsInVybCIsImdvR3JvdXAiLCJnb0NvcnNlIiwiZ29UaWNlIiwiZ29Eb29ycyIsImdvSW5mb3MiLCJnb1l1ZUtlIiwibXlNZW1iZXJzIiwidGhhdCIsImdldFN0b3JhZ2UiLCJrZXkiLCJzdWNjZXNzIiwicmVzIiwiSlNPTiIsInBhcnNlIiwiZ2V0U3lzdGVtSW5mbyIsInN0YXR1c0JhckhlaWdodCIsImUiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7OztBQUZBOzs7SUFHcUJBLEk7Ozs7Ozs7Ozs7Ozs7O2tMQUNuQkMsTSxHQUFTLENBQUNDLGNBQUQsQyxRQUNUQyxNLEdBQVM7QUFDUEMsOEJBQXdCO0FBRGpCLEssUUFHVEMsVSxHQUFhLEUsUUFDYkMsSSxHQUFPO0FBQ0xDLGNBQVEsRUFESDtBQUVMQyxnQkFBVTtBQUZMLEssUUFJUEMsTyxHQUFVO0FBQ1JDLFlBRFEsb0JBQ0M7QUFDUEMsV0FBR0MsVUFBSCxDQUFjO0FBQ1pDLGVBQUs7QUFETyxTQUFkO0FBR0QsT0FMTztBQU1SQyxhQU5RLHFCQU1FO0FBQ1JILFdBQUdDLFVBQUgsQ0FBYztBQUNaQyxlQUFLO0FBRE8sU0FBZDtBQUdELE9BVk87QUFXUkUsYUFYUSxxQkFXRTtBQUNSSixXQUFHQyxVQUFILENBQWM7QUFDWkMsZUFBSztBQURPLFNBQWQ7QUFHRCxPQWZPO0FBZ0JSRyxZQWhCUSxvQkFnQkM7QUFDUEwsV0FBR0MsVUFBSCxDQUFjO0FBQ1pDLGVBQUs7QUFETyxTQUFkO0FBR0QsT0FwQk87QUFxQlJJLGFBckJRLHFCQXFCRTtBQUNSTixXQUFHQyxVQUFILENBQWM7QUFDWkMsZUFBSztBQURPLFNBQWQ7QUFHRCxPQXpCTztBQTBCUkssYUExQlEscUJBMEJFO0FBQ1JQLFdBQUdDLFVBQUgsQ0FBYztBQUNaQyxlQUFLO0FBRE8sU0FBZDtBQUdELE9BOUJPO0FBK0JSTSxhQS9CUSxxQkErQkU7QUFDUlIsV0FBR0MsVUFBSCxDQUFjO0FBQ1pDLGVBQUs7QUFETyxTQUFkO0FBR0QsT0FuQ087QUFvQ1JPLGVBcENRLHVCQW9DSTtBQUNWVCxXQUFHQyxVQUFILENBQWM7QUFDWkMsZUFBSztBQURPLFNBQWQ7QUFHRDtBQXhDTyxLOzs7Ozs2QkEwQ0Q7QUFBQTs7QUFDUCxVQUFJUSxPQUFPLElBQVg7QUFDQVYsU0FBR1csVUFBSCxDQUFjO0FBQ1pDLGFBQUssVUFETztBQUVaQyxlQUZZLG1CQUVKQyxHQUZJLEVBRUM7QUFDWEosZUFBS2IsUUFBTCxHQUFnQmtCLEtBQUtDLEtBQUwsQ0FBV0YsSUFBSW5CLElBQWYsQ0FBaEI7QUFDRDtBQUpXLE9BQWQ7QUFNQUssU0FBR2lCLGFBQUgsQ0FBaUI7QUFDZkosaUJBQVMsc0JBQU87QUFDZCxpQkFBS2pCLE1BQUwsR0FBY2tCLElBQUlJLGVBQWxCO0FBQ0Q7QUFIYyxPQUFqQjtBQUtEOzs7dUNBQ2tCLENBQUU7OztzQ0FDSEosRyxFQUFLLENBQUU7OztpQ0FDWkssQyxFQUFHLENBQUU7Ozs4QkFDUkEsQyxFQUFHLENBQUU7OzsrQkFDSkEsQyxFQUFHLENBQUU7Ozs7RUF0RWdCQyxlQUFLQyxJOztrQkFBbEJoQyxJIiwiZmlsZSI6InVzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyogZ2xvYmFsIHd4ICovXHJcbmltcG9ydCB3ZXB5IGZyb20gXCJ3ZXB5XCI7XHJcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSBcIi4uLy4uL21peGlucy9wYWdlXCI7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVzZXIgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gIG1peGlucyA9IFtQYWdlTWl4aW5dO1xyXG4gIGNvbmZpZyA9IHtcclxuICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6IFwi5oiR55qEXCJcclxuICB9O1xyXG4gIGNvbXBvbmVudHMgPSB7fTtcclxuICBkYXRhID0ge1xyXG4gICAgaGVpZ2h0OiBcIlwiLFxyXG4gICAgdXNlckluZm86IHt9XHJcbiAgfTtcclxuICBtZXRob2RzID0ge1xyXG4gICAgZ29DYXJkKCkge1xyXG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICB1cmw6IFwiL3BhZ2VzL3VzZXIvY2FyZFwiXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGdvR3JvdXAoKSB7XHJcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgIHVybDogXCIvcGFnZXMvdXNlci9teUdyb3VwXCJcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZ29Db3JzZSgpIHtcclxuICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgdXJsOiBcIi9wYWdlcy91c2VyL215Q29yc2VcIlxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBnb1RpY2UoKSB7XHJcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgIHVybDogXCIvcGFnZXMvdXNlci9teVRpY2VcIlxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBnb0Rvb3JzKCkge1xyXG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICB1cmw6IFwiL3BhZ2VzL3VzZXIvY2hhbmdlRmVhdFwiXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGdvSW5mb3MoKSB7XHJcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgIHVybDogXCIvcGFnZXMvdXNlci9teUluZm9cIlxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBnb1l1ZUtlKCkge1xyXG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICB1cmw6IFwiL3BhZ2VzL3VzZXIveXVlS2VcIlxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBteU1lbWJlcnMoKSB7XHJcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgIHVybDogXCIvcGFnZXMvdXNlci9tZW1iZXJzXCJcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfTtcclxuICBvbkxvYWQoKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICB3eC5nZXRTdG9yYWdlKHtcclxuICAgICAga2V5OiBcInVzZXJJbmZvXCIsXHJcbiAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgdGhhdC51c2VySW5mbyA9IEpTT04ucGFyc2UocmVzLmRhdGEpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHd4LmdldFN5c3RlbUluZm8oe1xyXG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gcmVzLnN0YXR1c0JhckhlaWdodDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHdoZW5BcHBSZWFkeVNob3coKSB7fVxyXG4gIG9uU2hhcmVBcHBNZXNzYWdlKHJlcykge31cclxuICByZWdpb25jaGFuZ2UoZSkge31cclxuICBtYXJrZXJ0YXAoZSkge31cclxuICBjb250cm9sdGFwKGUpIHt9XHJcbn1cclxuIl19