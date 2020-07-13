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


var Login = function (_wepy$page) {
    _inherits(Login, _wepy$page);

    function Login() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Login);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Login.__proto__ || Object.getPrototypeOf(Login)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
            navigationBarBackgroundColor: '#e84644'
        }, _this.data = {
            code: 'unknown',
            message: 'unknown'
        }, _this.methods = {
            wxLogin: function wxLogin(e) {
                if (e.detail.iv && e.detail.encryptedData) {
                    wx.showLoading({
                        title: '正在登录...'
                    });
                    var self = this;
                    console.log('self.app', self.app.loginWX);
                    self.app.loginWX(e.detail.iv, e.detail.encryptedData).then(function (data) {
                        wx.showToast({
                            title: '登录成功',
                            icon: 'success',
                            duration: 2000
                        });

                        setTimeout(function () {
                            wx.navigateBack();
                        }, 500);
                    }).catch(function (error) {
                        console.log('登录失败:', error);
                        wx.showToast({
                            title: '登录失败,请重试！' + error.message,
                            icon: 'success',
                            duration: 2000
                        });
                    });
                } else {
                    wx.switchTab({
                        url: '/pages/list'
                    });
                }
            },
            cancel: function cancel() {
                wx.switchTab({
                    url: '/pages/home/home'
                });
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Login, [{
        key: 'onLoad',
        value: function onLoad() {}
    }]);

    return Login;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(Login , 'pages/login'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2luLmpzIl0sIm5hbWVzIjpbIkxvZ2luIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsImRhdGEiLCJjb2RlIiwibWVzc2FnZSIsIm1ldGhvZHMiLCJ3eExvZ2luIiwiZSIsImRldGFpbCIsIml2IiwiZW5jcnlwdGVkRGF0YSIsInd4Iiwic2hvd0xvYWRpbmciLCJ0aXRsZSIsInNlbGYiLCJjb25zb2xlIiwibG9nIiwiYXBwIiwibG9naW5XWCIsInRoZW4iLCJzaG93VG9hc3QiLCJpY29uIiwiZHVyYXRpb24iLCJzZXRUaW1lb3V0IiwibmF2aWdhdGVCYWNrIiwiY2F0Y2giLCJlcnJvciIsInN3aXRjaFRhYiIsInVybCIsImNhbmNlbCIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVJOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBRkE7OztJQUdxQkEsSzs7Ozs7Ozs7Ozs7Ozs7d0xBQ2pCQyxNLEdBQVMsQ0FBQ0MsY0FBRCxDLFFBQ1RDLE0sR0FBUztBQUNMQywwQ0FBOEI7QUFEekIsUyxRQUdUQyxJLEdBQU87QUFDSEMsa0JBQU0sU0FESDtBQUVIQyxxQkFBUztBQUZOLFMsUUFJUEMsTyxHQUFVO0FBQ05DLG1CQURNLG1CQUNFQyxDQURGLEVBQ0s7QUFDUCxvQkFBSUEsRUFBRUMsTUFBRixDQUFTQyxFQUFULElBQWVGLEVBQUVDLE1BQUYsQ0FBU0UsYUFBNUIsRUFBMkM7QUFDdkNDLHVCQUFHQyxXQUFILENBQWU7QUFDWEMsK0JBQU87QUFESSxxQkFBZjtBQUdBLHdCQUFJQyxPQUFPLElBQVg7QUFDQUMsNEJBQVFDLEdBQVIsQ0FBWSxVQUFaLEVBQXVCRixLQUFLRyxHQUFMLENBQVNDLE9BQWhDO0FBQ0FKLHlCQUFLRyxHQUFMLENBQ0tDLE9BREwsQ0FDYVgsRUFBRUMsTUFBRixDQUFTQyxFQUR0QixFQUMwQkYsRUFBRUMsTUFBRixDQUFTRSxhQURuQyxFQUVLUyxJQUZMLENBRVUsVUFBU2pCLElBQVQsRUFBZTtBQUNqQlMsMkJBQUdTLFNBQUgsQ0FBYTtBQUNUUCxtQ0FBTyxNQURFO0FBRVRRLGtDQUFNLFNBRkc7QUFHVEMsc0NBQVU7QUFIRCx5QkFBYjs7QUFNQUMsbUNBQVcsWUFBVztBQUNsQlosK0JBQUdhLFlBQUg7QUFDSCx5QkFGRCxFQUVHLEdBRkg7QUFHSCxxQkFaTCxFQWFLQyxLQWJMLENBYVcsVUFBU0MsS0FBVCxFQUFnQjtBQUNuQlgsZ0NBQVFDLEdBQVIsQ0FBWSxPQUFaLEVBQXFCVSxLQUFyQjtBQUNBZiwyQkFBR1MsU0FBSCxDQUFhO0FBQ1RQLG1DQUFPLGNBQWNhLE1BQU10QixPQURsQjtBQUVUaUIsa0NBQU0sU0FGRztBQUdUQyxzQ0FBVTtBQUhELHlCQUFiO0FBS0gscUJBcEJMO0FBcUJILGlCQTNCRCxNQTJCTztBQUNIWCx1QkFBR2dCLFNBQUgsQ0FBYTtBQUNUQyw2QkFBSztBQURJLHFCQUFiO0FBR0g7QUFDSixhQWxDSztBQW1DTkMsa0JBbkNNLG9CQW1DRztBQUNMbEIsbUJBQUdnQixTQUFILENBQWE7QUFDVEMseUJBQUs7QUFESSxpQkFBYjtBQUdIO0FBdkNLLFM7Ozs7O2lDQXlDRCxDQUFFOzs7O0VBbERvQkUsZUFBS0MsSTs7a0JBQW5CbEMsSyIsImZpbGUiOiJsb2dpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4gICAgLyogZ2xvYmFsIHd4ICovXHJcbiAgICBpbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcclxuICAgIGltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vbWl4aW5zL3BhZ2UnO1xyXG4gICAgZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9naW4gZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gICAgICAgIG1peGlucyA9IFtQYWdlTWl4aW5dO1xyXG4gICAgICAgIGNvbmZpZyA9IHtcclxuICAgICAgICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNlODQ2NDQnXHJcbiAgICAgICAgfTtcclxuICAgICAgICBkYXRhID0ge1xyXG4gICAgICAgICAgICBjb2RlOiAndW5rbm93bicsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6ICd1bmtub3duJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgbWV0aG9kcyA9IHtcclxuICAgICAgICAgICAgd3hMb2dpbihlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZS5kZXRhaWwuaXYgJiYgZS5kZXRhaWwuZW5jcnlwdGVkRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHd4LnNob3dMb2FkaW5nKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfmraPlnKjnmbvlvZUuLi4nXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZWxmLmFwcCcsc2VsZi5hcHAubG9naW5XWClcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmFwcFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAubG9naW5XWChlLmRldGFpbC5pdiwgZS5kZXRhaWwuZW5jcnlwdGVkRGF0YSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+eZu+W9leaIkOWKnycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyMDAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3eC5uYXZpZ2F0ZUJhY2soKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+eZu+W9leWksei0pTonLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn55m75b2V5aSx6LSlLOivt+mHjeivle+8gScgKyBlcnJvci5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjAwMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB3eC5zd2l0Y2hUYWIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvbGlzdCdcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2FuY2VsKCkge1xyXG4gICAgICAgICAgICAgICAgd3guc3dpdGNoVGFiKHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvaG9tZS9ob21lJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIG9uTG9hZCgpIHt9XHJcbiAgICB9XHJcbiJdfQ==