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
            pages: ['pages/home/home', 'pages/coursed/appointDetail', 'pages/coursed/coach', 'pages/coursed/lesson', 'pages/coursed/coachDetail', 'pages/coursed/coursed', 'pages/coursed/reserve', 'pages/user/user', 'pages/coursed/member', 'pages/coursed/card', 'pages/done', 'pages/addRecord', 'pages/createTest', 'pages/addressBook', 'pages/textDetails', 'pages/list', 'pages/editAddress', 'pages/productDetail', 'pages/car', 'pages/user', 'pages/payMoney', 'pages/upload', 'pages/login', 'pages/order', 'pages/sign', 'pages/gitSample', 'pages/sampleDetail', 'pages/form', 'pages/meMaple', 'pages/webview', 'pages/webview1', 'pages/webview2', 'pages/webview3', 'pages/zhonghua'],
            window: {
                backgroundColor: '#fefefe',
                navigationBarBackgroundColor: '#fefefe',
                navigationBarTitleText: '首页',
                navigationBarTextStyle: 'white',
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
            appId: 'wx2597963c30f20afd',
            appType: 'xcx',
            wxId: 'gh_b69825f64e58',
            passportUrl: 'https://onefit-passport.jteam.cn/passport/', // 认证服务器
            dataUrl: 'https://onefit.jteam.cn/data/', // 数据服务器
            uploadUrl: 'https://up.jteam.cn/'
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJjb25maWciLCJwYWdlcyIsIndpbmRvdyIsImJhY2tncm91bmRDb2xvciIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IiwibmF2aWdhdGlvbkJhclRleHRTdHlsZSIsIm5hdmlnYXRpb25TdHlsZSIsInRhYkJhciIsImNvbG9yIiwic2VsZWN0ZWRDb2xvciIsImJvcmRlclN0eWxlIiwibGlzdCIsInBhZ2VQYXRoIiwidGV4dCIsImljb25QYXRoIiwic2VsZWN0ZWRJY29uUGF0aCIsImdsb2JhbERhdGEiLCJhcHBJZCIsImFwcFR5cGUiLCJ3eElkIiwicGFzc3BvcnRVcmwiLCJkYXRhVXJsIiwidXBsb2FkVXJsIiwidXNlIiwib3B0aW9ucyIsImFwcCIsImluaXQiLCJ3ZXB5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUdBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7O0FBSkE7QUFDQTs7Ozs7O0FBNEZFLHNCQUFjO0FBQUE7O0FBQUE7O0FBQUEsY0F0RmRBLE1Bc0ZjLEdBdEZMO0FBQ0xDLG1CQUFPLENBQ0gsaUJBREcsRUFFSCw2QkFGRyxFQUdILHFCQUhHLEVBSUgsc0JBSkcsRUFLSCwyQkFMRyxFQU1ILHVCQU5HLEVBT0gsdUJBUEcsRUFRSCxpQkFSRyxFQVNILHNCQVRHLEVBVUgsb0JBVkcsRUFXSCxZQVhHLEVBWUgsaUJBWkcsRUFhSCxrQkFiRyxFQWNILG1CQWRHLEVBZUgsbUJBZkcsRUFnQkgsWUFoQkcsRUFpQkgsbUJBakJHLEVBa0JILHFCQWxCRyxFQW1CSCxXQW5CRyxFQW9CSCxZQXBCRyxFQXFCSCxnQkFyQkcsRUFzQkgsY0F0QkcsRUF1QkgsYUF2QkcsRUF3QkgsYUF4QkcsRUF5QkgsWUF6QkcsRUEwQkgsaUJBMUJHLEVBMkJILG9CQTNCRyxFQTRCSCxZQTVCRyxFQTZCSCxlQTdCRyxFQThCSCxlQTlCRyxFQStCSCxnQkEvQkcsRUFnQ0gsZ0JBaENHLEVBaUNILGdCQWpDRyxFQWtDSCxnQkFsQ0csQ0FERjtBQXFDTEMsb0JBQVE7QUFDSkMsaUNBQWlCLFNBRGI7QUFFSkMsOENBQThCLFNBRjFCO0FBR0pDLHdDQUF3QixJQUhwQjtBQUlKQyx3Q0FBd0IsT0FKcEI7QUFLSkMsaUNBQWlCO0FBTGIsYUFyQ0g7QUE0Q0xDLG9CQUFRO0FBQ0pDLHVCQUFPLFNBREg7QUFFSkMsK0JBQWUsU0FGWDtBQUdKUCxpQ0FBaUIsU0FIYjtBQUlKUSw2QkFBYSxPQUpUO0FBS0pDLHNCQUFNLENBQ0Y7QUFDSUMsOEJBQVUsaUJBRGQ7QUFFSUMsMEJBQU0sSUFGVjtBQUdJQyw4QkFBVSxpQkFIZDtBQUlJQyxzQ0FBa0I7QUFKdEIsaUJBREUsRUFPRjtBQUNJSCw4QkFBVSx1QkFEZDtBQUVJQywwQkFBTSxJQUZWO0FBR0lDLDhCQUFVLG1CQUhkO0FBSUlDLHNDQUFrQjtBQUp0QixpQkFQRSxFQWFGO0FBQ0lILDhCQUFVLGlCQURkO0FBRUlDLDBCQUFNLElBRlY7QUFHSUMsOEJBQVUsaUJBSGQ7QUFJSUMsc0NBQWtCO0FBSnRCLGlCQWJFO0FBTEYsYUE1Q0g7QUFzRUwsMEJBQWM7QUFDVixzQ0FBc0I7QUFDbEIsNEJBQVE7QUFEVTtBQURaOztBQXRFVCxTQXNGSztBQUFBLGNBVGRDLFVBU2MsR0FURDtBQUNUO0FBQ0FDLG1CQUFPLG9CQUZFO0FBR1RDLHFCQUFTLEtBSEE7QUFJVEMsa0JBQU0saUJBSkc7QUFLVEMseUJBQWEsNENBTEosRUFLa0Q7QUFDM0RDLHFCQUFTLCtCQU5BLEVBTWlDO0FBQzFDQyx1QkFBVztBQVBGLFNBU0M7O0FBRVYsY0FBS0MsR0FBTCxDQUFTLFdBQVQ7QUFGVTtBQUdiOzs7O2lDQUNRQyxPLEVBQVM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBQywwQkFBSUMsSUFBSixDQUFTLEtBQUtWLFVBQWQsRUFBMEJRLE9BQTFCO0FBQ0g7Ozs7RUFqRzBCRyxlQUFLRixHIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKiBnbG9iYWwgd3ggKi9cclxuLy8g5ZyoUGFnZemhtemdouWunuS+i+S4re+8jOWPr+S7pemAmui/h3RoaXMuJHBhcmVudOadpeiuv+mXrkFwcOWunuS+i+OAglxyXG5pbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcclxuaW1wb3J0IGFwcCBmcm9tICcuL2xpYi9hcHAnO1xyXG5pbXBvcnQgJ3dlcHktYXN5bmMtZnVuY3Rpb24nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyB3ZXB5LmFwcCB7XHJcbiAgY29uZmlnID0ge1xyXG4gICAgICBwYWdlczogW1xyXG4gICAgICAgICAgJ3BhZ2VzL2hvbWUvaG9tZScsXHJcbiAgICAgICAgICAncGFnZXMvY291cnNlZC9hcHBvaW50RGV0YWlsJyxcclxuICAgICAgICAgICdwYWdlcy9jb3Vyc2VkL2NvYWNoJyxcclxuICAgICAgICAgICdwYWdlcy9jb3Vyc2VkL2xlc3NvbicsXHJcbiAgICAgICAgICAncGFnZXMvY291cnNlZC9jb2FjaERldGFpbCcsXHJcbiAgICAgICAgICAncGFnZXMvY291cnNlZC9jb3Vyc2VkJyxcclxuICAgICAgICAgICdwYWdlcy9jb3Vyc2VkL3Jlc2VydmUnLFxyXG4gICAgICAgICAgJ3BhZ2VzL3VzZXIvdXNlcicsXHJcbiAgICAgICAgICAncGFnZXMvY291cnNlZC9tZW1iZXInLFxyXG4gICAgICAgICAgJ3BhZ2VzL2NvdXJzZWQvY2FyZCcsXHJcbiAgICAgICAgICAncGFnZXMvZG9uZScsXHJcbiAgICAgICAgICAncGFnZXMvYWRkUmVjb3JkJyxcclxuICAgICAgICAgICdwYWdlcy9jcmVhdGVUZXN0JyxcclxuICAgICAgICAgICdwYWdlcy9hZGRyZXNzQm9vaycsXHJcbiAgICAgICAgICAncGFnZXMvdGV4dERldGFpbHMnLFxyXG4gICAgICAgICAgJ3BhZ2VzL2xpc3QnLFxyXG4gICAgICAgICAgJ3BhZ2VzL2VkaXRBZGRyZXNzJyxcclxuICAgICAgICAgICdwYWdlcy9wcm9kdWN0RGV0YWlsJyxcclxuICAgICAgICAgICdwYWdlcy9jYXInLFxyXG4gICAgICAgICAgJ3BhZ2VzL3VzZXInLFxyXG4gICAgICAgICAgJ3BhZ2VzL3BheU1vbmV5JyxcclxuICAgICAgICAgICdwYWdlcy91cGxvYWQnLFxyXG4gICAgICAgICAgJ3BhZ2VzL2xvZ2luJyxcclxuICAgICAgICAgICdwYWdlcy9vcmRlcicsXHJcbiAgICAgICAgICAncGFnZXMvc2lnbicsXHJcbiAgICAgICAgICAncGFnZXMvZ2l0U2FtcGxlJyxcclxuICAgICAgICAgICdwYWdlcy9zYW1wbGVEZXRhaWwnLFxyXG4gICAgICAgICAgJ3BhZ2VzL2Zvcm0nLFxyXG4gICAgICAgICAgJ3BhZ2VzL21lTWFwbGUnLFxyXG4gICAgICAgICAgJ3BhZ2VzL3dlYnZpZXcnLFxyXG4gICAgICAgICAgJ3BhZ2VzL3dlYnZpZXcxJyxcclxuICAgICAgICAgICdwYWdlcy93ZWJ2aWV3MicsXHJcbiAgICAgICAgICAncGFnZXMvd2VidmlldzMnLFxyXG4gICAgICAgICAgJ3BhZ2VzL3pob25naHVhJ1xyXG4gICAgICBdLFxyXG4gICAgICB3aW5kb3c6IHtcclxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmZWZlZmUnLFxyXG4gICAgICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNmZWZlZmUnLFxyXG4gICAgICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+mmlumhtScsXHJcbiAgICAgICAgICBuYXZpZ2F0aW9uQmFyVGV4dFN0eWxlOiAnd2hpdGUnLFxyXG4gICAgICAgICAgbmF2aWdhdGlvblN0eWxlOiAnY3VzdG9tJyxcclxuICAgICAgfSxcclxuICAgICAgdGFiQmFyOiB7XHJcbiAgICAgICAgICBjb2xvcjogJyM1ZTVlNWUnLFxyXG4gICAgICAgICAgc2VsZWN0ZWRDb2xvcjogJyNlODI1MTEnLFxyXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzM0MzQzNCcsXHJcbiAgICAgICAgICBib3JkZXJTdHlsZTogJ2JsYWNrJyxcclxuICAgICAgICAgIGxpc3Q6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHBhZ2VQYXRoOiAncGFnZXMvaG9tZS9ob21lJyxcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ+mmlumhtScsXHJcbiAgICAgICAgICAgICAgICAgIGljb25QYXRoOiAnaW1hZ2VzL2hvbWUucG5nJyxcclxuICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRJY29uUGF0aDogJ2ltYWdlcy9ob21lX3NlbGVjdC5wbmcnXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHBhZ2VQYXRoOiAncGFnZXMvY291cnNlZC9jb3Vyc2VkJyxcclxuICAgICAgICAgICAgICAgICAgdGV4dDogJ+ivvueoiycsXHJcbiAgICAgICAgICAgICAgICAgIGljb25QYXRoOiAnaW1hZ2VzL2NvdXJzZS5wbmcnLFxyXG4gICAgICAgICAgICAgICAgICBzZWxlY3RlZEljb25QYXRoOiAnaW1hZ2VzL2NvdXJzZV9zZWxlY3QucG5nJ1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICBwYWdlUGF0aDogJ3BhZ2VzL3VzZXIvdXNlcicsXHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICfmiJHnmoQnLFxyXG4gICAgICAgICAgICAgICAgICBpY29uUGF0aDogJ2ltYWdlcy91c2VyLnBuZycsXHJcbiAgICAgICAgICAgICAgICAgIHNlbGVjdGVkSWNvblBhdGg6ICdpbWFnZXMvdXNlcl9zZWxldC5wbmcnXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXVxyXG4gICAgICB9LFxyXG4gICAgICAncGVybWlzc2lvbic6IHtcclxuICAgICAgICAgICdzY29wZS51c2VyTG9jYXRpb24nOiB7XHJcbiAgICAgICAgICAgICAgJ2Rlc2MnOiAn5oKo55qE5L2N572u5L+h5oGv5bCG55So5LqO5a+75om+6ZmE6L+R55qE5qOA5rWL54K5J1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICB9O1xyXG4gIGdsb2JhbERhdGEgPSB7XHJcbiAgICAgIC8vIOS4reWMluS9nOeJqVxyXG4gICAgICBhcHBJZDogJ3d4MjU5Nzk2M2MzMGYyMGFmZCcsXHJcbiAgICAgIGFwcFR5cGU6ICd4Y3gnLFxyXG4gICAgICB3eElkOiAnZ2hfYjY5ODI1ZjY0ZTU4JyxcclxuICAgICAgcGFzc3BvcnRVcmw6ICdodHRwczovL29uZWZpdC1wYXNzcG9ydC5qdGVhbS5jbi9wYXNzcG9ydC8nLCAvLyDorqTor4HmnI3liqHlmahcclxuICAgICAgZGF0YVVybDogJ2h0dHBzOi8vb25lZml0Lmp0ZWFtLmNuL2RhdGEvJywgLy8g5pWw5o2u5pyN5Yqh5ZmoXHJcbiAgICAgIHVwbG9hZFVybDogJ2h0dHBzOi8vdXAuanRlYW0uY24vJyxcclxuICB9O1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICB0aGlzLnVzZSgncHJvbWlzaWZ5Jyk7XHJcbiAgfVxyXG4gIG9uTGF1bmNoKG9wdGlvbnMpIHtcclxuICAgICAgLy8g5Yid5aeL5YyW6YO95piv5byC5q2l55qEXHJcbiAgICAgIC8vICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgLy8gICAgICAgICB1cmw6ICcvcGFnZXMvYW5pbWF0ZSdcclxuICAgICAgLy8gICAgIH0pO1xyXG4gICAgICBhcHAuaW5pdCh0aGlzLmdsb2JhbERhdGEsIG9wdGlvbnMpO1xyXG4gIH1cclxufVxyXG4iXX0=