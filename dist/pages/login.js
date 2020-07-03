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
            navigationBarTitleText: '用户登录'
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
                    url: '/pages/home'
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2luLmpzIl0sIm5hbWVzIjpbIkxvZ2luIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsImRhdGEiLCJjb2RlIiwibWVzc2FnZSIsIm1ldGhvZHMiLCJ3eExvZ2luIiwiZSIsImRldGFpbCIsIml2IiwiZW5jcnlwdGVkRGF0YSIsInd4Iiwic2hvd0xvYWRpbmciLCJ0aXRsZSIsInNlbGYiLCJhcHAiLCJsb2dpbldYIiwidGhlbiIsInNob3dUb2FzdCIsImljb24iLCJkdXJhdGlvbiIsInNldFRpbWVvdXQiLCJuYXZpZ2F0ZUJhY2siLCJjYXRjaCIsImVycm9yIiwiY29uc29sZSIsImxvZyIsInN3aXRjaFRhYiIsInVybCIsImNhbmNlbCIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVJOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBRkE7OztJQUdxQkEsSzs7Ozs7Ozs7Ozs7Ozs7d0xBQ2pCQyxNLEdBQVMsQ0FBQ0MsY0FBRCxDLFFBQ1RDLE0sR0FBUztBQUNMQyxvQ0FBd0I7QUFEbkIsUyxRQUdUQyxJLEdBQU87QUFDSEMsa0JBQU0sU0FESDtBQUVIQyxxQkFBUztBQUZOLFMsUUFJUEMsTyxHQUFVO0FBQ05DLG1CQURNLG1CQUNFQyxDQURGLEVBQ0s7QUFDUCxvQkFBSUEsRUFBRUMsTUFBRixDQUFTQyxFQUFULElBQWVGLEVBQUVDLE1BQUYsQ0FBU0UsYUFBNUIsRUFBMkM7QUFDdkNDLHVCQUFHQyxXQUFILENBQWU7QUFDWEMsK0JBQU87QUFESSxxQkFBZjtBQUdBLHdCQUFJQyxPQUFPLElBQVg7QUFDQUEseUJBQUtDLEdBQUwsQ0FDS0MsT0FETCxDQUNhVCxFQUFFQyxNQUFGLENBQVNDLEVBRHRCLEVBQzBCRixFQUFFQyxNQUFGLENBQVNFLGFBRG5DLEVBRUtPLElBRkwsQ0FFVSxVQUFTZixJQUFULEVBQWU7QUFDakJTLDJCQUFHTyxTQUFILENBQWE7QUFDVEwsbUNBQU8sTUFERTtBQUVUTSxrQ0FBTSxTQUZHO0FBR1RDLHNDQUFVO0FBSEQseUJBQWI7O0FBTUFDLG1DQUFXLFlBQVc7QUFDbEJWLCtCQUFHVyxZQUFIO0FBQ0gseUJBRkQsRUFFRyxHQUZIO0FBR0gscUJBWkwsRUFhS0MsS0FiTCxDQWFXLFVBQVNDLEtBQVQsRUFBZ0I7QUFDbkJDLGdDQUFRQyxHQUFSLENBQVksT0FBWixFQUFxQkYsS0FBckI7QUFDQWIsMkJBQUdPLFNBQUgsQ0FBYTtBQUNUTCxtQ0FBTyxjQUFjVyxNQUFNcEIsT0FEbEI7QUFFVGUsa0NBQU0sU0FGRztBQUdUQyxzQ0FBVTtBQUhELHlCQUFiO0FBS0gscUJBcEJMO0FBcUJILGlCQTFCRCxNQTBCSztBQUNIVCx1QkFBR2dCLFNBQUgsQ0FBYTtBQUNYQyw2QkFBSztBQURNLHFCQUFiO0FBR0Q7QUFDSixhQWpDSztBQWtDTkMsa0JBbENNLG9CQWtDRztBQUNMbEIsbUJBQUdnQixTQUFILENBQWE7QUFDVEMseUJBQUs7QUFESSxpQkFBYjtBQUdIO0FBdENLLFM7Ozs7O2lDQXdDRCxDQUFFOzs7O0VBakRvQkUsZUFBS0MsSTs7a0JBQW5CbEMsSyIsImZpbGUiOiJsb2dpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4gICAgLyogZ2xvYmFsIHd4ICovXHJcbiAgICBpbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcclxuICAgIGltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vbWl4aW5zL3BhZ2UnO1xyXG4gICAgZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9naW4gZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gICAgICAgIG1peGlucyA9IFtQYWdlTWl4aW5dO1xyXG4gICAgICAgIGNvbmZpZyA9IHtcclxuICAgICAgICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+eUqOaIt+eZu+W9lSdcclxuICAgICAgICB9O1xyXG4gICAgICAgIGRhdGEgPSB7XHJcbiAgICAgICAgICAgIGNvZGU6ICd1bmtub3duJyxcclxuICAgICAgICAgICAgbWVzc2FnZTogJ3Vua25vd24nXHJcbiAgICAgICAgfTtcclxuICAgICAgICBtZXRob2RzID0ge1xyXG4gICAgICAgICAgICB3eExvZ2luKGUpIHsgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKGUuZGV0YWlsLml2ICYmIGUuZGV0YWlsLmVuY3J5cHRlZERhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB3eC5zaG93TG9hZGluZyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5q2j5Zyo55m75b2VLi4uJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmFwcFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAubG9naW5XWChlLmRldGFpbC5pdiwgZS5kZXRhaWwuZW5jcnlwdGVkRGF0YSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+eZu+W9leaIkOWKnycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyMDAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHd4Lm5hdmlnYXRlQmFjaygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn55m75b2V5aSx6LSlOicsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfnmbvlvZXlpLHotKUs6K+36YeN6K+V77yBJyArIGVycm9yLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyMDAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgd3guc3dpdGNoVGFiKHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvbGlzdCdcclxuICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNhbmNlbCgpIHtcclxuICAgICAgICAgICAgICAgIHd4LnN3aXRjaFRhYih7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL3BhZ2VzL2hvbWUnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgb25Mb2FkKCkge31cclxuICAgIH1cclxuIl19