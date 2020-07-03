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
      navigationBarTitleText: '个人中心',
      navigationBarBackgroundColor: '#65ABFF'
    }, _this.components = {
      // tabbar: Tabbar
    }, _this.data = {
      loadUser: true, // 需要登录信息
      userAvatar: 'https://www.jteam.cn/images/9321/0426/1898/8a75ea37e87804f8a6f57da0f3a6b0ed_2_80x80.jpg'
    }, _this.methods = {
      userNew: function userNew() {
        wx.navigateTo({
          url: '/pages/user_scheme'
        });
      },
      call: function call() {
        wx.makePhoneCall({
          phoneNumber: '4008210178' //仅为示例，并非真实的电话号码
        });
      },
      toMyCommunity: function toMyCommunity() {
        wx.navigateTo({
          url: '/pages/order'
        });
      },
      set: function set() {
        wx.navigateTo({
          url: '/pages/addressBook'
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(User, [{
    key: 'whenAppReadyShow',
    value: function whenAppReadyShow() {
      // 每次都刷新
    }
  }]);

  return User;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(User , 'pages/user'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVzZXIuanMiXSwibmFtZXMiOlsiVXNlciIsIm1peGlucyIsIlBhZ2VNaXhpbiIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsImRhdGEiLCJsb2FkVXNlciIsInVzZXJBdmF0YXIiLCJtZXRob2RzIiwidXNlck5ldyIsInd4IiwibmF2aWdhdGVUbyIsInVybCIsImNhbGwiLCJtYWtlUGhvbmVDYWxsIiwicGhvbmVOdW1iZXIiLCJ0b015Q29tbXVuaXR5Iiwic2V0Iiwid2VweSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0U7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBQ3FCQSxJOzs7Ozs7Ozs7Ozs7OztrTEFDbkJDLE0sR0FBUyxDQUFDQyxjQUFELEMsUUFDVEMsTSxHQUFTO0FBQ1BDLDhCQUF3QixNQURqQjtBQUVQQyxvQ0FBOEI7QUFGdkIsSyxRQUlUQyxVLEdBQWE7QUFDWDtBQURXLEssUUFHYkMsSSxHQUFPO0FBQ0xDLGdCQUFVLElBREwsRUFDVztBQUNoQkMsa0JBQVk7QUFGUCxLLFFBSVBDLE8sR0FBVTtBQUNSQyxhQURRLHFCQUNFO0FBQ1JDLFdBQUdDLFVBQUgsQ0FBYztBQUNaQyxlQUFLO0FBRE8sU0FBZDtBQUdELE9BTE87QUFNUkMsVUFOUSxrQkFNRDtBQUNMSCxXQUFHSSxhQUFILENBQWlCO0FBQ2ZDLHVCQUFhLFlBREUsQ0FDVztBQURYLFNBQWpCO0FBR0QsT0FWTztBQVdSQyxtQkFYUSwyQkFXTztBQUNaTixXQUFHQyxVQUFILENBQWM7QUFDYkMsZUFBSztBQURRLFNBQWQ7QUFHRixPQWZPO0FBZ0JSSyxTQWhCUSxpQkFnQkY7QUFDSlAsV0FBR0MsVUFBSCxDQUFjO0FBQ1pDLGVBQUs7QUFETyxTQUFkO0FBR0Q7QUFwQk8sSzs7Ozs7dUNBc0JTO0FBQ2pCO0FBQ0Q7Ozs7RUFyQytCTSxlQUFLQyxJOztrQkFBbEJyQixJIiwiZmlsZSI6InVzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuICBpbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcclxuICBpbXBvcnQgUGFnZU1peGluIGZyb20gJy4uL21peGlucy9wYWdlJztcclxuICBleHBvcnQgZGVmYXVsdCBjbGFzcyBVc2VyIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICAgIG1peGlucyA9IFtQYWdlTWl4aW5dO1xyXG4gICAgY29uZmlnID0ge1xyXG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn5Liq5Lq65Lit5b+DJyxcclxuICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyM2NUFCRkYnXHJcbiAgICB9O1xyXG4gICAgY29tcG9uZW50cyA9IHtcclxuICAgICAgLy8gdGFiYmFyOiBUYWJiYXJcclxuICAgIH07XHJcbiAgICBkYXRhID0ge1xyXG4gICAgICBsb2FkVXNlcjogdHJ1ZSwgLy8g6ZyA6KaB55m75b2V5L+h5oGvXHJcbiAgICAgIHVzZXJBdmF0YXI6ICdodHRwczovL3d3dy5qdGVhbS5jbi9pbWFnZXMvOTMyMS8wNDI2LzE4OTgvOGE3NWVhMzdlODc4MDRmOGE2ZjU3ZGEwZjNhNmIwZWRfMl84MHg4MC5qcGcnXHJcbiAgICB9O1xyXG4gICAgbWV0aG9kcyA9IHtcclxuICAgICAgdXNlck5ldygpIHtcclxuICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICAgIHVybDogJy9wYWdlcy91c2VyX3NjaGVtZSdcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgY2FsbCgpIHtcclxuICAgICAgICB3eC5tYWtlUGhvbmVDYWxsKHtcclxuICAgICAgICAgIHBob25lTnVtYmVyOiAnNDAwODIxMDE3OCcgLy/ku4XkuLrnpLrkvovvvIzlubbpnZ7nnJ/lrp7nmoTnlLXor53lj7fnoIFcclxuICAgICAgICB9KVxyXG4gICAgICB9LFxyXG4gICAgICB0b015Q29tbXVuaXR5KCl7XHJcbiAgICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgICAgdXJsOiAnL3BhZ2VzL29yZGVyJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgICBzZXQoKSB7XHJcbiAgICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICB1cmw6ICcvcGFnZXMvYWRkcmVzc0Jvb2snXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICB3aGVuQXBwUmVhZHlTaG93KCkge1xyXG4gICAgICAvLyDmr4/mrKHpg73liLfmlrBcclxuICAgIH1cclxuICB9XHJcbiJdfQ==