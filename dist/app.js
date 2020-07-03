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
<<<<<<< HEAD
            pages: ['pages/home/home', 'pages/coursed/coursed', 'pages/user/user', 'pages/coursed/coach', 'pages/coursed/member', 'pages/coursed/card', 'pages/done', 'pages/addRecord', 'pages/createTest', 'pages/addressBook', 'pages/textDetails', 'pages/list', 'pages/editAddress', 'pages/productDetail', 'pages/car', 'pages/user', 'pages/payMoney', 'pages/upload', 'pages/login', 'pages/order', 'pages/sign', 'pages/gitSample', 'pages/sampleDetail', 'pages/form', 'pages/meMaple', 'pages/webview', 'pages/webview1', 'pages/webview2', 'pages/webview3', 'pages/zhonghua'],
=======
            pages: ['pages/coursed/coach', 'pages/coursed/coursed', 'pages/home/home', 'pages/user/user', 'pages/coursed/member', 'pages/coursed/card', 'pages/done', 'pages/addRecord', 'pages/createTest', 'pages/addressBook', 'pages/textDetails', 'pages/list', 'pages/editAddress', 'pages/productDetail', 'pages/car', 'pages/user', 'pages/payMoney', 'pages/upload', 'pages/login', 'pages/order', 'pages/sign', 'pages/gitSample', 'pages/sampleDetail', 'pages/form', 'pages/meMaple', 'pages/webview', 'pages/webview1', 'pages/webview2', 'pages/webview3', 'pages/zhonghua'],
>>>>>>> d9426b3163d22fb20959d8177d12f5f4da21dc6e
            window: {
                backgroundColor: '#fefefe',
                navigationBarBackgroundColor: '#fefefe',
                navigationBarTitleText: '首页',
                navigationBarTextStyle: 'black',
                navigationStyle: 'custom'
            },
            tabBar: {
                color: '#5e5e5e',
                selectedColor: '#e82511',
                backgroundColor: '#343434',
                borderStyle: 'black',
                list: [{
                    pagePath: 'pages/home/home',
                    text: '首页',
                    iconPath: 'images/home.png',
                    selectedIconPath: 'images/home_select.png'
                }, {
                    pagePath: 'pages/coursed/coursed',
                    text: '课程',
                    iconPath: 'images/course.png',
                    selectedIconPath: 'images/course_select.png'
                }, {
                    pagePath: 'pages/user/user',
                    text: '我的',
                    iconPath: 'images/user.png',
                    selectedIconPath: 'images/user_selet.png'
                }]
            },
            'permission': {
                'scope.userLocation': {
                    'desc': '您的位置信息将用于寻找附近的检测点'
                }
            }

        };
        _this.globalData = {
            // 中化作物
            appId: 'wx59fd07ac9d84ef04',
            appType: 'sinochem_xcx',
            wxId: 'gh_3d0d25c141db',
            passportUrl: 'https://passport.lingtaodata.com/passport/', // 认证服务器
            dataUrl: 'https://sinochem.lingtaodata.com/data/', // 数据服务器
            uploadUrl: 'https://www.lingtaodata.com/'

            // 灵韬作物
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

<<<<<<< HEAD
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJjb25maWciLCJwYWdlcyIsIndpbmRvdyIsImJhY2tncm91bmRDb2xvciIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IiwibmF2aWdhdGlvbkJhclRleHRTdHlsZSIsIm5hdmlnYXRpb25TdHlsZSIsInRhYkJhciIsImNvbG9yIiwic2VsZWN0ZWRDb2xvciIsImJvcmRlclN0eWxlIiwibGlzdCIsInBhZ2VQYXRoIiwidGV4dCIsImljb25QYXRoIiwic2VsZWN0ZWRJY29uUGF0aCIsImdsb2JhbERhdGEiLCJhcHBJZCIsImFwcFR5cGUiLCJ3eElkIiwicGFzc3BvcnRVcmwiLCJkYXRhVXJsIiwidXBsb2FkVXJsIiwidXNlIiwib3B0aW9ucyIsImFwcCIsImluaXQiLCJ3ZXB5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUdBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7O0FBSkE7QUFDQTs7Ozs7O0FBZ0dFLHNCQUFjO0FBQUE7O0FBQUE7O0FBQUEsY0ExRmRBLE1BMEZjLEdBMUZMO0FBQ0xDLG1CQUFPLENBQ0gsaUJBREcsRUFFSCx1QkFGRyxFQUdILGlCQUhHLEVBSUgscUJBSkcsRUFLSCxzQkFMRyxFQU1ILG9CQU5HLEVBT0gsWUFQRyxFQVFILGlCQVJHLEVBU0gsa0JBVEcsRUFVSCxtQkFWRyxFQVdILG1CQVhHLEVBWUgsWUFaRyxFQWFILG1CQWJHLEVBY0gscUJBZEcsRUFlSCxXQWZHLEVBZ0JILFlBaEJHLEVBaUJILGdCQWpCRyxFQWtCSCxjQWxCRyxFQW1CSCxhQW5CRyxFQW9CSCxhQXBCRyxFQXFCSCxZQXJCRyxFQXNCSCxpQkF0QkcsRUF1Qkgsb0JBdkJHLEVBd0JILFlBeEJHLEVBeUJILGVBekJHLEVBMEJILGVBMUJHLEVBMkJILGdCQTNCRyxFQTRCSCxnQkE1QkcsRUE2QkgsZ0JBN0JHLEVBOEJILGdCQTlCRyxDQURGO0FBaUNMQyxvQkFBUTtBQUNKQyxpQ0FBaUIsU0FEYjtBQUVKQyw4Q0FBOEIsU0FGMUI7QUFHSkMsd0NBQXdCLElBSHBCO0FBSUpDLHdDQUF3QixPQUpwQjtBQUtKQyxpQ0FBaUI7QUFMYixhQWpDSDtBQXdDTEMsb0JBQVE7QUFDSkMsdUJBQU8sU0FESDtBQUVKQywrQkFBZSxTQUZYO0FBR0pQLGlDQUFpQixTQUhiO0FBSUpRLDZCQUFhLE9BSlQ7QUFLSkMsc0JBQU0sQ0FDRjtBQUNJQyw4QkFBVSxpQkFEZDtBQUVJQywwQkFBTSxJQUZWO0FBR0lDLDhCQUFVLGlCQUhkO0FBSUlDLHNDQUFrQjtBQUp0QixpQkFERSxFQU9GO0FBQ0lILDhCQUFVLHVCQURkO0FBRUlDLDBCQUFNLElBRlY7QUFHSUMsOEJBQVUsbUJBSGQ7QUFJSUMsc0NBQWtCO0FBSnRCLGlCQVBFLEVBYUY7QUFDSUgsOEJBQVUsaUJBRGQ7QUFFSUMsMEJBQU0sSUFGVjtBQUdJQyw4QkFBVSxpQkFIZDtBQUlJQyxzQ0FBa0I7QUFKdEIsaUJBYkU7QUFMRixhQXhDSDtBQWtFTCwwQkFBYztBQUNWLHNDQUFzQjtBQUNsQiw0QkFBUTtBQURVO0FBRFo7O0FBbEVULFNBMEZLO0FBQUEsY0FqQmRDLFVBaUJjLEdBakJEO0FBQ1Q7QUFDQUMsbUJBQU8sb0JBRkU7QUFHVEMscUJBQVMsY0FIQTtBQUlUQyxrQkFBTSxpQkFKRztBQUtUQyx5QkFBYSw0Q0FMSixFQUtrRDtBQUMzREMscUJBQVMsd0NBTkEsRUFNMEM7QUFDbkRDLHVCQUFXOztBQUVYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBZlMsU0FpQkM7O0FBRVYsY0FBS0MsR0FBTCxDQUFTLFdBQVQ7QUFGVTtBQUdiOzs7O2lDQUNRQyxPLEVBQVM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBQywwQkFBSUMsSUFBSixDQUFTLEtBQUtWLFVBQWQsRUFBMEJRLE9BQTFCO0FBQ0g7Ozs7RUFyRzBCRyxlQUFLRixHIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKiBnbG9iYWwgd3ggKi9cclxuLy8g5ZyoUGFnZemhtemdouWunuS+i+S4re+8jOWPr+S7pemAmui/h3RoaXMuJHBhcmVudOadpeiuv+mXrkFwcOWunuS+i+OAglxyXG5pbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcclxuaW1wb3J0IGFwcCBmcm9tICcuL2xpYi9hcHAnO1xyXG5pbXBvcnQgJ3dlcHktYXN5bmMtZnVuY3Rpb24nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyB3ZXB5LmFwcCB7XHJcbiAgY29uZmlnID0ge1xyXG4gICAgICBwYWdlczogW1xyXG4gICAgICAgICAgJ3BhZ2VzL2hvbWUvaG9tZScsXHJcbiAgICAgICAgICAncGFnZXMvY291cnNlZC9jb3Vyc2VkJyxcclxuICAgICAgICAgICdwYWdlcy91c2VyL3VzZXInLFxyXG4gICAgICAgICAgJ3BhZ2VzL2NvdXJzZWQvY29hY2gnLFxyXG4gICAgICAgICAgJ3BhZ2VzL2NvdXJzZWQvbWVtYmVyJyxcclxuICAgICAgICAgICdwYWdlcy9jb3Vyc2VkL2NhcmQnLFxyXG4gICAgICAgICAgJ3BhZ2VzL2RvbmUnLFxyXG4gICAgICAgICAgJ3BhZ2VzL2FkZFJlY29yZCcsXHJcbiAgICAgICAgICAncGFnZXMvY3JlYXRlVGVzdCcsXHJcbiAgICAgICAgICAncGFnZXMvYWRkcmVzc0Jvb2snLFxyXG4gICAgICAgICAgJ3BhZ2VzL3RleHREZXRhaWxzJyxcclxuICAgICAgICAgICdwYWdlcy9saXN0JyxcclxuICAgICAgICAgICdwYWdlcy9lZGl0QWRkcmVzcycsXHJcbiAgICAgICAgICAncGFnZXMvcHJvZHVjdERldGFpbCcsXHJcbiAgICAgICAgICAncGFnZXMvY2FyJyxcclxuICAgICAgICAgICdwYWdlcy91c2VyJyxcclxuICAgICAgICAgICdwYWdlcy9wYXlNb25leScsXHJcbiAgICAgICAgICAncGFnZXMvdXBsb2FkJyxcclxuICAgICAgICAgICdwYWdlcy9sb2dpbicsXHJcbiAgICAgICAgICAncGFnZXMvb3JkZXInLFxyXG4gICAgICAgICAgJ3BhZ2VzL3NpZ24nLFxyXG4gICAgICAgICAgJ3BhZ2VzL2dpdFNhbXBsZScsXHJcbiAgICAgICAgICAncGFnZXMvc2FtcGxlRGV0YWlsJyxcclxuICAgICAgICAgICdwYWdlcy9mb3JtJyxcclxuICAgICAgICAgICdwYWdlcy9tZU1hcGxlJyxcclxuICAgICAgICAgICdwYWdlcy93ZWJ2aWV3JyxcclxuICAgICAgICAgICdwYWdlcy93ZWJ2aWV3MScsXHJcbiAgICAgICAgICAncGFnZXMvd2VidmlldzInLFxyXG4gICAgICAgICAgJ3BhZ2VzL3dlYnZpZXczJyxcclxuICAgICAgICAgICdwYWdlcy96aG9uZ2h1YSdcclxuICAgICAgXSxcclxuICAgICAgd2luZG93OiB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmVmZWZlJyxcclxuICAgICAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjZmVmZWZlJyxcclxuICAgICAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfpppbpobUnLFxyXG4gICAgICAgICAgbmF2aWdhdGlvbkJhclRleHRTdHlsZTogJ2JsYWNrJyxcclxuICAgICAgICAgIG5hdmlnYXRpb25TdHlsZTogJ2N1c3RvbScsXHJcbiAgICAgIH0sXHJcbiAgICAgIHRhYkJhcjoge1xyXG4gICAgICAgICAgY29sb3I6ICcjNWU1ZTVlJyxcclxuICAgICAgICAgIHNlbGVjdGVkQ29sb3I6ICcjZTgyNTExJyxcclxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyMzNDM0MzQnLFxyXG4gICAgICAgICAgYm9yZGVyU3R5bGU6ICdibGFjaycsXHJcbiAgICAgICAgICBsaXN0OiBbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICBwYWdlUGF0aDogJ3BhZ2VzL2hvbWUvaG9tZScsXHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICfpppbpobUnLFxyXG4gICAgICAgICAgICAgICAgICBpY29uUGF0aDogJ2ltYWdlcy9ob21lLnBuZycsXHJcbiAgICAgICAgICAgICAgICAgIHNlbGVjdGVkSWNvblBhdGg6ICdpbWFnZXMvaG9tZV9zZWxlY3QucG5nJ1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICBwYWdlUGF0aDogJ3BhZ2VzL2NvdXJzZWQvY291cnNlZCcsXHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICfor77nqIsnLFxyXG4gICAgICAgICAgICAgICAgICBpY29uUGF0aDogJ2ltYWdlcy9jb3Vyc2UucG5nJyxcclxuICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRJY29uUGF0aDogJ2ltYWdlcy9jb3Vyc2Vfc2VsZWN0LnBuZydcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgcGFnZVBhdGg6ICdwYWdlcy91c2VyL3VzZXInLFxyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAn5oiR55qEJyxcclxuICAgICAgICAgICAgICAgICAgaWNvblBhdGg6ICdpbWFnZXMvdXNlci5wbmcnLFxyXG4gICAgICAgICAgICAgICAgICBzZWxlY3RlZEljb25QYXRoOiAnaW1hZ2VzL3VzZXJfc2VsZXQucG5nJ1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgfSxcclxuICAgICAgJ3Blcm1pc3Npb24nOiB7XHJcbiAgICAgICAgICAnc2NvcGUudXNlckxvY2F0aW9uJzoge1xyXG4gICAgICAgICAgICAgICdkZXNjJzogJ+aCqOeahOS9jee9ruS/oeaBr+WwhueUqOS6juWvu+aJvumZhOi/keeahOajgOa1i+eCuSdcclxuICAgICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgfTtcclxuICBnbG9iYWxEYXRhID0ge1xyXG4gICAgICAvLyDkuK3ljJbkvZznialcclxuICAgICAgYXBwSWQ6ICd3eDU5ZmQwN2FjOWQ4NGVmMDQnLFxyXG4gICAgICBhcHBUeXBlOiAnc2lub2NoZW1feGN4JyxcclxuICAgICAgd3hJZDogJ2doXzNkMGQyNWMxNDFkYicsXHJcbiAgICAgIHBhc3Nwb3J0VXJsOiAnaHR0cHM6Ly9wYXNzcG9ydC5saW5ndGFvZGF0YS5jb20vcGFzc3BvcnQvJywgLy8g6K6k6K+B5pyN5Yqh5ZmoXHJcbiAgICAgIGRhdGFVcmw6ICdodHRwczovL3Npbm9jaGVtLmxpbmd0YW9kYXRhLmNvbS9kYXRhLycsIC8vIOaVsOaNruacjeWKoeWZqFxyXG4gICAgICB1cGxvYWRVcmw6ICdodHRwczovL3d3dy5saW5ndGFvZGF0YS5jb20vJyxcclxuXHJcbiAgICAgIC8vIOeBtemfrOS9nOeJqVxyXG4gICAgICAvLyBhcHBJZDogJ3d4NWNlZjZiNTc4NThmMzk0MScsXHJcbiAgICAgIC8vIGFwcFR5cGU6ICdxcl94Y3gnLFxyXG4gICAgICAvLyB3eElkOiAnZ2hfZGI4MTc3ZWI3YTBiJyxcclxuICAgICAgLy8gcGFzc3BvcnRVcmw6ICdodHRwczovL3Bhc3Nwb3J0Lmxpbmd0YW9kYXRhLmNvbS9wYXNzcG9ydC8nLCAvLyDorqTor4HmnI3liqHlmahcclxuICAgICAgLy8gZGF0YVVybDogJ2h0dHBzOi8vZGV2Lmxpbmd0YW9kYXRhLmNvbS9kYXRhLycsIC8vIOaVsOaNruacjeWKoeWZqFxyXG4gICAgICAvLyB1cGxvYWRVcmw6IFwiaHR0cHM6Ly93d3cubGluZ3Rhb2RhdGEuY29tL1wiLFxyXG4gIH07XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIHRoaXMudXNlKCdwcm9taXNpZnknKTtcclxuICB9XHJcbiAgb25MYXVuY2gob3B0aW9ucykge1xyXG4gICAgICAvLyDliJ3lp4vljJbpg73mmK/lvILmraXnmoRcclxuICAgICAgLy8gIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAvLyAgICAgICAgIHVybDogJy9wYWdlcy9hbmltYXRlJ1xyXG4gICAgICAvLyAgICAgfSk7XHJcbiAgICAgIGFwcC5pbml0KHRoaXMuZ2xvYmFsRGF0YSwgb3B0aW9ucyk7XHJcbiAgfVxyXG59XHJcbiJdfQ==
=======
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJjb25maWciLCJwYWdlcyIsIndpbmRvdyIsImJhY2tncm91bmRDb2xvciIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IiwibmF2aWdhdGlvbkJhclRleHRTdHlsZSIsIm5hdmlnYXRpb25TdHlsZSIsInRhYkJhciIsImNvbG9yIiwic2VsZWN0ZWRDb2xvciIsImJvcmRlclN0eWxlIiwibGlzdCIsInBhZ2VQYXRoIiwidGV4dCIsImljb25QYXRoIiwic2VsZWN0ZWRJY29uUGF0aCIsImdsb2JhbERhdGEiLCJhcHBJZCIsImFwcFR5cGUiLCJ3eElkIiwicGFzc3BvcnRVcmwiLCJkYXRhVXJsIiwidXBsb2FkVXJsIiwidXNlIiwib3B0aW9ucyIsImFwcCIsImluaXQiLCJ3ZXB5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUdBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7O0FBSkE7QUFDQTs7Ozs7O0FBZ0dFLHNCQUFjO0FBQUE7O0FBQUE7O0FBQUEsY0ExRmRBLE1BMEZjLEdBMUZMO0FBQ0xDLG1CQUFPLENBQ0gscUJBREcsRUFFSCx1QkFGRyxFQUdILGlCQUhHLEVBSUgsaUJBSkcsRUFLSCxzQkFMRyxFQU1ILG9CQU5HLEVBT0gsWUFQRyxFQVFILGlCQVJHLEVBU0gsa0JBVEcsRUFVSCxtQkFWRyxFQVdILG1CQVhHLEVBWUgsWUFaRyxFQWFILG1CQWJHLEVBY0gscUJBZEcsRUFlSCxXQWZHLEVBZ0JILFlBaEJHLEVBaUJILGdCQWpCRyxFQWtCSCxjQWxCRyxFQW1CSCxhQW5CRyxFQW9CSCxhQXBCRyxFQXFCSCxZQXJCRyxFQXNCSCxpQkF0QkcsRUF1Qkgsb0JBdkJHLEVBd0JILFlBeEJHLEVBeUJILGVBekJHLEVBMEJILGVBMUJHLEVBMkJILGdCQTNCRyxFQTRCSCxnQkE1QkcsRUE2QkgsZ0JBN0JHLEVBOEJILGdCQTlCRyxDQURGO0FBaUNMQyxvQkFBUTtBQUNKQyxpQ0FBaUIsU0FEYjtBQUVKQyw4Q0FBOEIsU0FGMUI7QUFHSkMsd0NBQXdCLElBSHBCO0FBSUpDLHdDQUF3QixPQUpwQjtBQUtKQyxpQ0FBaUI7QUFMYixhQWpDSDtBQXdDTEMsb0JBQVE7QUFDSkMsdUJBQU8sU0FESDtBQUVKQywrQkFBZSxTQUZYO0FBR0pQLGlDQUFpQixTQUhiO0FBSUpRLDZCQUFhLE9BSlQ7QUFLSkMsc0JBQU0sQ0FDRjtBQUNJQyw4QkFBVSxpQkFEZDtBQUVJQywwQkFBTSxJQUZWO0FBR0lDLDhCQUFVLGlCQUhkO0FBSUlDLHNDQUFrQjtBQUp0QixpQkFERSxFQU9GO0FBQ0lILDhCQUFVLHVCQURkO0FBRUlDLDBCQUFNLElBRlY7QUFHSUMsOEJBQVUsbUJBSGQ7QUFJSUMsc0NBQWtCO0FBSnRCLGlCQVBFLEVBYUY7QUFDSUgsOEJBQVUsaUJBRGQ7QUFFSUMsMEJBQU0sSUFGVjtBQUdJQyw4QkFBVSxpQkFIZDtBQUlJQyxzQ0FBa0I7QUFKdEIsaUJBYkU7QUFMRixhQXhDSDtBQWtFTCwwQkFBYztBQUNWLHNDQUFzQjtBQUNsQiw0QkFBUTtBQURVO0FBRFo7O0FBbEVULFNBMEZLO0FBQUEsY0FqQmRDLFVBaUJjLEdBakJEO0FBQ1Q7QUFDQUMsbUJBQU8sb0JBRkU7QUFHVEMscUJBQVMsY0FIQTtBQUlUQyxrQkFBTSxpQkFKRztBQUtUQyx5QkFBYSw0Q0FMSixFQUtrRDtBQUMzREMscUJBQVMsd0NBTkEsRUFNMEM7QUFDbkRDLHVCQUFXOztBQUVYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBZlMsU0FpQkM7O0FBRVYsY0FBS0MsR0FBTCxDQUFTLFdBQVQ7QUFGVTtBQUdiOzs7O2lDQUNRQyxPLEVBQVM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBQywwQkFBSUMsSUFBSixDQUFTLEtBQUtWLFVBQWQsRUFBMEJRLE9BQTFCO0FBQ0g7Ozs7RUFyRzBCRyxlQUFLRixHIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKiBnbG9iYWwgd3ggKi9cclxuLy8g5ZyoUGFnZemhtemdouWunuS+i+S4re+8jOWPr+S7pemAmui/h3RoaXMuJHBhcmVudOadpeiuv+mXrkFwcOWunuS+i+OAglxyXG5pbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcclxuaW1wb3J0IGFwcCBmcm9tICcuL2xpYi9hcHAnO1xyXG5pbXBvcnQgJ3dlcHktYXN5bmMtZnVuY3Rpb24nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyB3ZXB5LmFwcCB7XHJcbiAgY29uZmlnID0ge1xyXG4gICAgICBwYWdlczogW1xyXG4gICAgICAgICAgJ3BhZ2VzL2NvdXJzZWQvY29hY2gnLFxyXG4gICAgICAgICAgJ3BhZ2VzL2NvdXJzZWQvY291cnNlZCcsXHJcbiAgICAgICAgICAncGFnZXMvaG9tZS9ob21lJyxcclxuICAgICAgICAgICdwYWdlcy91c2VyL3VzZXInLFxyXG4gICAgICAgICAgJ3BhZ2VzL2NvdXJzZWQvbWVtYmVyJyxcclxuICAgICAgICAgICdwYWdlcy9jb3Vyc2VkL2NhcmQnLFxyXG4gICAgICAgICAgJ3BhZ2VzL2RvbmUnLFxyXG4gICAgICAgICAgJ3BhZ2VzL2FkZFJlY29yZCcsXHJcbiAgICAgICAgICAncGFnZXMvY3JlYXRlVGVzdCcsXHJcbiAgICAgICAgICAncGFnZXMvYWRkcmVzc0Jvb2snLFxyXG4gICAgICAgICAgJ3BhZ2VzL3RleHREZXRhaWxzJyxcclxuICAgICAgICAgICdwYWdlcy9saXN0JyxcclxuICAgICAgICAgICdwYWdlcy9lZGl0QWRkcmVzcycsXHJcbiAgICAgICAgICAncGFnZXMvcHJvZHVjdERldGFpbCcsXHJcbiAgICAgICAgICAncGFnZXMvY2FyJyxcclxuICAgICAgICAgICdwYWdlcy91c2VyJyxcclxuICAgICAgICAgICdwYWdlcy9wYXlNb25leScsXHJcbiAgICAgICAgICAncGFnZXMvdXBsb2FkJyxcclxuICAgICAgICAgICdwYWdlcy9sb2dpbicsXHJcbiAgICAgICAgICAncGFnZXMvb3JkZXInLFxyXG4gICAgICAgICAgJ3BhZ2VzL3NpZ24nLFxyXG4gICAgICAgICAgJ3BhZ2VzL2dpdFNhbXBsZScsXHJcbiAgICAgICAgICAncGFnZXMvc2FtcGxlRGV0YWlsJyxcclxuICAgICAgICAgICdwYWdlcy9mb3JtJyxcclxuICAgICAgICAgICdwYWdlcy9tZU1hcGxlJyxcclxuICAgICAgICAgICdwYWdlcy93ZWJ2aWV3JyxcclxuICAgICAgICAgICdwYWdlcy93ZWJ2aWV3MScsXHJcbiAgICAgICAgICAncGFnZXMvd2VidmlldzInLFxyXG4gICAgICAgICAgJ3BhZ2VzL3dlYnZpZXczJyxcclxuICAgICAgICAgICdwYWdlcy96aG9uZ2h1YSdcclxuICAgICAgXSxcclxuICAgICAgd2luZG93OiB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmVmZWZlJyxcclxuICAgICAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjZmVmZWZlJyxcclxuICAgICAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfpppbpobUnLFxyXG4gICAgICAgICAgbmF2aWdhdGlvbkJhclRleHRTdHlsZTogJ2JsYWNrJyxcclxuICAgICAgICAgIG5hdmlnYXRpb25TdHlsZTogJ2N1c3RvbScsXHJcbiAgICAgIH0sXHJcbiAgICAgIHRhYkJhcjoge1xyXG4gICAgICAgICAgY29sb3I6ICcjNWU1ZTVlJyxcclxuICAgICAgICAgIHNlbGVjdGVkQ29sb3I6ICcjZTgyNTExJyxcclxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyMzNDM0MzQnLFxyXG4gICAgICAgICAgYm9yZGVyU3R5bGU6ICdibGFjaycsXHJcbiAgICAgICAgICBsaXN0OiBbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICBwYWdlUGF0aDogJ3BhZ2VzL2hvbWUvaG9tZScsXHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICfpppbpobUnLFxyXG4gICAgICAgICAgICAgICAgICBpY29uUGF0aDogJ2ltYWdlcy9ob21lLnBuZycsXHJcbiAgICAgICAgICAgICAgICAgIHNlbGVjdGVkSWNvblBhdGg6ICdpbWFnZXMvaG9tZV9zZWxlY3QucG5nJ1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICBwYWdlUGF0aDogJ3BhZ2VzL2NvdXJzZWQvY291cnNlZCcsXHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICfor77nqIsnLFxyXG4gICAgICAgICAgICAgICAgICBpY29uUGF0aDogJ2ltYWdlcy9jb3Vyc2UucG5nJyxcclxuICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRJY29uUGF0aDogJ2ltYWdlcy9jb3Vyc2Vfc2VsZWN0LnBuZydcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgcGFnZVBhdGg6ICdwYWdlcy91c2VyL3VzZXInLFxyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiAn5oiR55qEJyxcclxuICAgICAgICAgICAgICAgICAgaWNvblBhdGg6ICdpbWFnZXMvdXNlci5wbmcnLFxyXG4gICAgICAgICAgICAgICAgICBzZWxlY3RlZEljb25QYXRoOiAnaW1hZ2VzL3VzZXJfc2VsZXQucG5nJ1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgfSxcclxuICAgICAgJ3Blcm1pc3Npb24nOiB7XHJcbiAgICAgICAgICAnc2NvcGUudXNlckxvY2F0aW9uJzoge1xyXG4gICAgICAgICAgICAgICdkZXNjJzogJ+aCqOeahOS9jee9ruS/oeaBr+WwhueUqOS6juWvu+aJvumZhOi/keeahOajgOa1i+eCuSdcclxuICAgICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgfTtcclxuICBnbG9iYWxEYXRhID0ge1xyXG4gICAgICAvLyDkuK3ljJbkvZznialcclxuICAgICAgYXBwSWQ6ICd3eDU5ZmQwN2FjOWQ4NGVmMDQnLFxyXG4gICAgICBhcHBUeXBlOiAnc2lub2NoZW1feGN4JyxcclxuICAgICAgd3hJZDogJ2doXzNkMGQyNWMxNDFkYicsXHJcbiAgICAgIHBhc3Nwb3J0VXJsOiAnaHR0cHM6Ly9wYXNzcG9ydC5saW5ndGFvZGF0YS5jb20vcGFzc3BvcnQvJywgLy8g6K6k6K+B5pyN5Yqh5ZmoXHJcbiAgICAgIGRhdGFVcmw6ICdodHRwczovL3Npbm9jaGVtLmxpbmd0YW9kYXRhLmNvbS9kYXRhLycsIC8vIOaVsOaNruacjeWKoeWZqFxyXG4gICAgICB1cGxvYWRVcmw6ICdodHRwczovL3d3dy5saW5ndGFvZGF0YS5jb20vJyxcclxuXHJcbiAgICAgIC8vIOeBtemfrOS9nOeJqVxyXG4gICAgICAvLyBhcHBJZDogJ3d4NWNlZjZiNTc4NThmMzk0MScsXHJcbiAgICAgIC8vIGFwcFR5cGU6ICdxcl94Y3gnLFxyXG4gICAgICAvLyB3eElkOiAnZ2hfZGI4MTc3ZWI3YTBiJyxcclxuICAgICAgLy8gcGFzc3BvcnRVcmw6ICdodHRwczovL3Bhc3Nwb3J0Lmxpbmd0YW9kYXRhLmNvbS9wYXNzcG9ydC8nLCAvLyDorqTor4HmnI3liqHlmahcclxuICAgICAgLy8gZGF0YVVybDogJ2h0dHBzOi8vZGV2Lmxpbmd0YW9kYXRhLmNvbS9kYXRhLycsIC8vIOaVsOaNruacjeWKoeWZqFxyXG4gICAgICAvLyB1cGxvYWRVcmw6IFwiaHR0cHM6Ly93d3cubGluZ3Rhb2RhdGEuY29tL1wiLFxyXG4gIH07XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIHRoaXMudXNlKCdwcm9taXNpZnknKTtcclxuICB9XHJcbiAgb25MYXVuY2gob3B0aW9ucykge1xyXG4gICAgICAvLyDliJ3lp4vljJbpg73mmK/lvILmraXnmoRcclxuICAgICAgLy8gIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAvLyAgICAgICAgIHVybDogJy9wYWdlcy9hbmltYXRlJ1xyXG4gICAgICAvLyAgICAgfSk7XHJcbiAgICAgIGFwcC5pbml0KHRoaXMuZ2xvYmFsRGF0YSwgb3B0aW9ucyk7XHJcbiAgfVxyXG59XHJcbiJdfQ==
>>>>>>> d9426b3163d22fb20959d8177d12f5f4da21dc6e
