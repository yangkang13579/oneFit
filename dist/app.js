'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _app = require('./lib/app.js');

var _app2 = _interopRequireDefault(_app);

require('./npm/wepy-async-function/index.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/* global wx */
// 在Page页面实例中，可以通过this.$parent来访问App实例。


var _class = function (_wepy$app) {
  _inherits(_class, _wepy$app);

  function _class() {
    _classCallCheck(this, _class);

    var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this));

    _this.config = {
      pages: ['pages/home/home', 'pages/user/user', 'pages/coursed/coursed', 'pages/coursed/coach', 'pages/coursed/member', 'pages/coursed/card', 'pages/done', 'pages/addRecord', 'pages/createTest', 'pages/addressBook', 'pages/textDetails', 'pages/list', 'pages/editAddress', 'pages/productDetail', 'pages/car', 'pages/user', 'pages/payMoney', 'pages/upload', 'pages/login', 'pages/order', 'pages/sign', 'pages/gitSample', 'pages/sampleDetail', 'pages/form', 'pages/meMaple', 'pages/webview', 'pages/webview1', 'pages/webview2', 'pages/webview3', 'pages/zhonghua'],
      window: {
        backgroundColor: '#fefefe',
        navigationBarBackgroundColor: '#fefefe',
        navigationBarTitleText: '首页',
        navigationBarTextStyle: 'black',
        navigationStyle: "custom"
      },
      tabBar: {
        color: "#5e5e5e",
        selectedColor: "#e82511",
        backgroundColor: "#343434",
        borderStyle: "black",
        list: [{
          pagePath: "pages/home/home",
          text: "首页",
          iconPath: "images/home.png",
          selectedIconPath: "images/home_select.png"
        }, {
          pagePath: "pages/coursed/coursed",
          text: "课程",
          iconPath: "images/course.png",
          selectedIconPath: "images/course_select.png"
        }, {
          pagePath: "pages/user/user",
          text: "我的",
          iconPath: "images/user.png",
          selectedIconPath: "images/user_selet.png"
        }]
      },
      "permission": {
        "scope.userLocation": {
          "desc": "您的位置信息将用于寻找附近的检测点"
        }
      }

    };
    _this.globalData = {
      //中化作物
      appId: 'wx59fd07ac9d84ef04',
      appType: 'sinochem_xcx',
      wxId: 'gh_3d0d25c141db',
      passportUrl: 'https://passport.lingtaodata.com/passport/', // 认证服务器
      dataUrl: 'https://sinochem.lingtaodata.com/data/', // 数据服务器
      uploadUrl: "https://www.lingtaodata.com/"

      //灵韬作物
      // appId: 'wx5cef6b57858f3941',
      // appType: 'qr_xcx',
      // wxId: 'gh_db8177eb7a0b',
      // passportUrl: 'https://passport.lingtaodata.com/passport/', // 认证服务器
      // dataUrl: 'https://dev.lingtaodata.com/data/', // 数据服务器
      // uploadUrl: "https://www.lingtaodata.com/",
    };

    _this.use('promisify');
    return _this;
  }

  _createClass(_class, [{
    key: 'onLaunch',
    value: function onLaunch(options) {
      // 初始化都是异步的
      //  wx.navigateTo({
      //         url: '/pages/animate'
      //     });
      _app2.default.init(this.globalData, options);
    }
  }]);

  return _class;
}(_wepy2.default.app);


App(require('./npm/wepy/lib/wepy.js').default.$createApp(_class, {}));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJjb25maWciLCJwYWdlcyIsIndpbmRvdyIsImJhY2tncm91bmRDb2xvciIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IiwibmF2aWdhdGlvbkJhclRleHRTdHlsZSIsIm5hdmlnYXRpb25TdHlsZSIsInRhYkJhciIsImNvbG9yIiwic2VsZWN0ZWRDb2xvciIsImJvcmRlclN0eWxlIiwibGlzdCIsInBhZ2VQYXRoIiwidGV4dCIsImljb25QYXRoIiwic2VsZWN0ZWRJY29uUGF0aCIsImdsb2JhbERhdGEiLCJhcHBJZCIsImFwcFR5cGUiLCJ3eElkIiwicGFzc3BvcnRVcmwiLCJkYXRhVXJsIiwidXBsb2FkVXJsIiwidXNlIiwib3B0aW9ucyIsImFwcCIsImluaXQiLCJ3ZXB5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUdBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7O0FBSkE7QUFDQTs7Ozs7O0FBZ0dFLG9CQUFjO0FBQUE7O0FBQUE7O0FBQUEsVUExRmRBLE1BMEZjLEdBMUZMO0FBQ0xDLGFBQU8sQ0FDSCxpQkFERyxFQUVILGlCQUZHLEVBR0gsdUJBSEcsRUFJSCxxQkFKRyxFQUtILHNCQUxHLEVBTUgsb0JBTkcsRUFPSCxZQVBHLEVBUUgsaUJBUkcsRUFTSCxrQkFURyxFQVVILG1CQVZHLEVBV0gsbUJBWEcsRUFZSCxZQVpHLEVBYUgsbUJBYkcsRUFjSCxxQkFkRyxFQWVILFdBZkcsRUFnQkgsWUFoQkcsRUFpQkgsZ0JBakJHLEVBa0JILGNBbEJHLEVBbUJILGFBbkJHLEVBb0JILGFBcEJHLEVBcUJILFlBckJHLEVBc0JILGlCQXRCRyxFQXVCSCxvQkF2QkcsRUF3QkgsWUF4QkcsRUF5QkgsZUF6QkcsRUEwQkgsZUExQkcsRUEyQkgsZ0JBM0JHLEVBNEJILGdCQTVCRyxFQTZCSCxnQkE3QkcsRUE4QkgsZ0JBOUJHLENBREY7QUFpQ0xDLGNBQVE7QUFDSkMseUJBQWlCLFNBRGI7QUFFSkMsc0NBQThCLFNBRjFCO0FBR0pDLGdDQUF3QixJQUhwQjtBQUlKQyxnQ0FBd0IsT0FKcEI7QUFLSkMseUJBQWlCO0FBTGIsT0FqQ0g7QUF3Q0pDLGNBQVE7QUFDUEMsZUFBTyxTQURBO0FBRVBDLHVCQUFlLFNBRlI7QUFHUFAseUJBQWlCLFNBSFY7QUFJUFEscUJBQWEsT0FKTjtBQUtQQyxjQUFNLENBQ0o7QUFDRUMsb0JBQVUsaUJBRFo7QUFFRUMsZ0JBQU0sSUFGUjtBQUdFQyxvQkFBVSxpQkFIWjtBQUlFQyw0QkFBa0I7QUFKcEIsU0FESSxFQU9KO0FBQ0VILG9CQUFVLHVCQURaO0FBRUVDLGdCQUFNLElBRlI7QUFHRUMsb0JBQVUsbUJBSFo7QUFJRUMsNEJBQWtCO0FBSnBCLFNBUEksRUFhSjtBQUNFSCxvQkFBVSxpQkFEWjtBQUVFQyxnQkFBTSxJQUZSO0FBR0VDLG9CQUFVLGlCQUhaO0FBSUVDLDRCQUFrQjtBQUpwQixTQWJJO0FBTEMsT0F4Q0o7QUFrRVAsb0JBQWM7QUFDWiw4QkFBc0I7QUFDcEIsa0JBQVE7QUFEWTtBQURWOztBQWxFUCxLQTBGSztBQUFBLFVBakJkQyxVQWlCYyxHQWpCRDtBQUNUO0FBQ0FDLGFBQU8sb0JBRkU7QUFHVEMsZUFBUyxjQUhBO0FBSVRDLFlBQU0saUJBSkc7QUFLVEMsbUJBQWEsNENBTEosRUFLa0Q7QUFDM0RDLGVBQVMsd0NBTkEsRUFNMEM7QUFDbkRDLGlCQUFXOztBQUVYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBZlMsS0FpQkM7O0FBRVYsVUFBS0MsR0FBTCxDQUFTLFdBQVQ7QUFGVTtBQUdiOzs7OzZCQUNRQyxPLEVBQVM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBQyxvQkFBSUMsSUFBSixDQUFTLEtBQUtWLFVBQWQsRUFBMEJRLE9BQTFCO0FBQ0g7Ozs7RUFyRzBCRyxlQUFLRixHIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKiBnbG9iYWwgd3ggKi9cclxuLy8g5ZyoUGFnZemhtemdouWunuS+i+S4re+8jOWPr+S7pemAmui/h3RoaXMuJHBhcmVudOadpeiuv+mXrkFwcOWunuS+i+OAglxyXG5pbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcclxuaW1wb3J0IGFwcCBmcm9tICcuL2xpYi9hcHAnO1xyXG5pbXBvcnQgJ3dlcHktYXN5bmMtZnVuY3Rpb24nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyB3ZXB5LmFwcCB7XHJcbiAgY29uZmlnID0ge1xyXG4gICAgICBwYWdlczogW1xyXG4gICAgICAgICAgJ3BhZ2VzL2hvbWUvaG9tZScsXHJcbiAgICAgICAgICAncGFnZXMvdXNlci91c2VyJyxcclxuICAgICAgICAgICdwYWdlcy9jb3Vyc2VkL2NvdXJzZWQnLFxyXG4gICAgICAgICAgJ3BhZ2VzL2NvdXJzZWQvY29hY2gnLFxyXG4gICAgICAgICAgJ3BhZ2VzL2NvdXJzZWQvbWVtYmVyJyxcclxuICAgICAgICAgICdwYWdlcy9jb3Vyc2VkL2NhcmQnLFxyXG4gICAgICAgICAgJ3BhZ2VzL2RvbmUnLFxyXG4gICAgICAgICAgJ3BhZ2VzL2FkZFJlY29yZCcsXHJcbiAgICAgICAgICAncGFnZXMvY3JlYXRlVGVzdCcsXHJcbiAgICAgICAgICAncGFnZXMvYWRkcmVzc0Jvb2snLFxyXG4gICAgICAgICAgJ3BhZ2VzL3RleHREZXRhaWxzJyxcclxuICAgICAgICAgICdwYWdlcy9saXN0JyxcclxuICAgICAgICAgICdwYWdlcy9lZGl0QWRkcmVzcycsXHJcbiAgICAgICAgICAncGFnZXMvcHJvZHVjdERldGFpbCcsXHJcbiAgICAgICAgICAncGFnZXMvY2FyJyxcclxuICAgICAgICAgICdwYWdlcy91c2VyJyxcclxuICAgICAgICAgICdwYWdlcy9wYXlNb25leScsXHJcbiAgICAgICAgICAncGFnZXMvdXBsb2FkJyxcclxuICAgICAgICAgICdwYWdlcy9sb2dpbicsXHJcbiAgICAgICAgICAncGFnZXMvb3JkZXInLFxyXG4gICAgICAgICAgJ3BhZ2VzL3NpZ24nLFxyXG4gICAgICAgICAgJ3BhZ2VzL2dpdFNhbXBsZScsXHJcbiAgICAgICAgICAncGFnZXMvc2FtcGxlRGV0YWlsJyxcclxuICAgICAgICAgICdwYWdlcy9mb3JtJyxcclxuICAgICAgICAgICdwYWdlcy9tZU1hcGxlJyxcclxuICAgICAgICAgICdwYWdlcy93ZWJ2aWV3JyxcclxuICAgICAgICAgICdwYWdlcy93ZWJ2aWV3MScsXHJcbiAgICAgICAgICAncGFnZXMvd2VidmlldzInLFxyXG4gICAgICAgICAgJ3BhZ2VzL3dlYnZpZXczJyxcclxuICAgICAgICAgICdwYWdlcy96aG9uZ2h1YSdcclxuICAgICAgXSxcclxuICAgICAgd2luZG93OiB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmVmZWZlJyxcclxuICAgICAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjZmVmZWZlJyxcclxuICAgICAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfpppbpobUnLFxyXG4gICAgICAgICAgbmF2aWdhdGlvbkJhclRleHRTdHlsZTogJ2JsYWNrJyxcclxuICAgICAgICAgIG5hdmlnYXRpb25TdHlsZTogXCJjdXN0b21cIixcclxuICAgICAgfSxcclxuICAgICAgIHRhYkJhcjoge1xyXG4gICAgICAgIGNvbG9yOiBcIiM1ZTVlNWVcIixcclxuICAgICAgICBzZWxlY3RlZENvbG9yOiBcIiNlODI1MTFcIixcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiIzM0MzQzNFwiLFxyXG4gICAgICAgIGJvcmRlclN0eWxlOiBcImJsYWNrXCIsXHJcbiAgICAgICAgbGlzdDogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBwYWdlUGF0aDogXCJwYWdlcy9ob21lL2hvbWVcIixcclxuICAgICAgICAgICAgdGV4dDogXCLpppbpobVcIixcclxuICAgICAgICAgICAgaWNvblBhdGg6IFwiaW1hZ2VzL2hvbWUucG5nXCIsXHJcbiAgICAgICAgICAgIHNlbGVjdGVkSWNvblBhdGg6IFwiaW1hZ2VzL2hvbWVfc2VsZWN0LnBuZ1wiXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBwYWdlUGF0aDogXCJwYWdlcy9jb3Vyc2VkL2NvdXJzZWRcIixcclxuICAgICAgICAgICAgdGV4dDogXCLor77nqItcIixcclxuICAgICAgICAgICAgaWNvblBhdGg6IFwiaW1hZ2VzL2NvdXJzZS5wbmdcIixcclxuICAgICAgICAgICAgc2VsZWN0ZWRJY29uUGF0aDogXCJpbWFnZXMvY291cnNlX3NlbGVjdC5wbmdcIlxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgcGFnZVBhdGg6IFwicGFnZXMvdXNlci91c2VyXCIsXHJcbiAgICAgICAgICAgIHRleHQ6IFwi5oiR55qEXCIsXHJcbiAgICAgICAgICAgIGljb25QYXRoOiBcImltYWdlcy91c2VyLnBuZ1wiLFxyXG4gICAgICAgICAgICBzZWxlY3RlZEljb25QYXRoOiBcImltYWdlcy91c2VyX3NlbGV0LnBuZ1wiXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuICAgIFwicGVybWlzc2lvblwiOiB7XHJcbiAgICAgIFwic2NvcGUudXNlckxvY2F0aW9uXCI6IHtcclxuICAgICAgICBcImRlc2NcIjogXCLmgqjnmoTkvY3nva7kv6Hmga/lsIbnlKjkuo7lr7vmib7pmYTov5HnmoTmo4DmtYvngrlcIlxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICBcclxuICB9OyBcclxuICBnbG9iYWxEYXRhID0geyBcclxuICAgICAgLy/kuK3ljJbkvZznialcclxuICAgICAgYXBwSWQ6ICd3eDU5ZmQwN2FjOWQ4NGVmMDQnLFxyXG4gICAgICBhcHBUeXBlOiAnc2lub2NoZW1feGN4JyxcclxuICAgICAgd3hJZDogJ2doXzNkMGQyNWMxNDFkYicsXHJcbiAgICAgIHBhc3Nwb3J0VXJsOiAnaHR0cHM6Ly9wYXNzcG9ydC5saW5ndGFvZGF0YS5jb20vcGFzc3BvcnQvJywgLy8g6K6k6K+B5pyN5Yqh5ZmoXHJcbiAgICAgIGRhdGFVcmw6ICdodHRwczovL3Npbm9jaGVtLmxpbmd0YW9kYXRhLmNvbS9kYXRhLycsIC8vIOaVsOaNruacjeWKoeWZqFxyXG4gICAgICB1cGxvYWRVcmw6IFwiaHR0cHM6Ly93d3cubGluZ3Rhb2RhdGEuY29tL1wiLFxyXG5cclxuICAgICAgLy/ngbXpn6zkvZznialcclxuICAgICAgLy8gYXBwSWQ6ICd3eDVjZWY2YjU3ODU4ZjM5NDEnLFxyXG4gICAgICAvLyBhcHBUeXBlOiAncXJfeGN4JyxcclxuICAgICAgLy8gd3hJZDogJ2doX2RiODE3N2ViN2EwYicsXHJcbiAgICAgIC8vIHBhc3Nwb3J0VXJsOiAnaHR0cHM6Ly9wYXNzcG9ydC5saW5ndGFvZGF0YS5jb20vcGFzc3BvcnQvJywgLy8g6K6k6K+B5pyN5Yqh5ZmoXHJcbiAgICAgIC8vIGRhdGFVcmw6ICdodHRwczovL2Rldi5saW5ndGFvZGF0YS5jb20vZGF0YS8nLCAvLyDmlbDmja7mnI3liqHlmahcclxuICAgICAgLy8gdXBsb2FkVXJsOiBcImh0dHBzOi8vd3d3Lmxpbmd0YW9kYXRhLmNvbS9cIixcclxuICB9O1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICB0aGlzLnVzZSgncHJvbWlzaWZ5Jyk7IFxyXG4gIH1cclxuICBvbkxhdW5jaChvcHRpb25zKSB7XHJcbiAgICAgIC8vIOWIneWni+WMlumDveaYr+W8guatpeeahFxyXG4gICAgICAvLyAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgIC8vICAgICAgICAgdXJsOiAnL3BhZ2VzL2FuaW1hdGUnXHJcbiAgICAgIC8vICAgICB9KTtcclxuICAgICAgYXBwLmluaXQodGhpcy5nbG9iYWxEYXRhLCBvcHRpb25zKTtcclxuICB9XHJcbn1cclxuIl19