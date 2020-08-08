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
      navigationBarBackgroundColor: "#e84644"
    }, _this.data = {
      code: "unknown",
      message: "unknown",
      height: null
    }, _this.methods = {
      wxLogin: function wxLogin(e) {
        if (e.detail.iv && e.detail.encryptedData) {
          wx.showLoading({
            title: "正在登录..."
          });
          var self = this;
          console.log("self.app", self.app.loginWX);
          self.app.loginWX(e.detail.iv, e.detail.encryptedData).then(function (data) {
            wx.showToast({
              title: "登录成功",
              icon: "success",
              duration: 2000
            });

            setTimeout(function () {
              wx.navigateBack();
            }, 500);
          }).catch(function (error) {
            console.log("登录失败:", error);
            wx.showToast({
              title: "登录失败,请重试！" + error.message,
              icon: "success",
              duration: 2000
            });
          });
        } else {
          wx.switchTab({
            url: "/pages/list"
          });
        }
      },
      cancel: function cancel() {
        wx.switchTab({
          url: "/pages/home/home"
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Login, [{
    key: "onLoad",
    value: function onLoad() {
      var _this2 = this;

      wx.getSystemInfo({
        success: function success(res) {
          _this2.height = res.statusBarHeight;
        }
      });
    }
  }]);

  return Login;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(Login , 'pages/login'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2luLmpzIl0sIm5hbWVzIjpbIkxvZ2luIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsImRhdGEiLCJjb2RlIiwibWVzc2FnZSIsImhlaWdodCIsIm1ldGhvZHMiLCJ3eExvZ2luIiwiZSIsImRldGFpbCIsIml2IiwiZW5jcnlwdGVkRGF0YSIsInd4Iiwic2hvd0xvYWRpbmciLCJ0aXRsZSIsInNlbGYiLCJjb25zb2xlIiwibG9nIiwiYXBwIiwibG9naW5XWCIsInRoZW4iLCJzaG93VG9hc3QiLCJpY29uIiwiZHVyYXRpb24iLCJzZXRUaW1lb3V0IiwibmF2aWdhdGVCYWNrIiwiY2F0Y2giLCJlcnJvciIsInN3aXRjaFRhYiIsInVybCIsImNhbmNlbCIsImdldFN5c3RlbUluZm8iLCJzdWNjZXNzIiwicmVzIiwic3RhdHVzQmFySGVpZ2h0Iiwid2VweSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7QUFGQTs7O0lBR3FCQSxLOzs7Ozs7Ozs7Ozs7OztvTEFDbkJDLE0sR0FBUyxDQUFDQyxjQUFELEMsUUFDVEMsTSxHQUFTO0FBQ1BDLG9DQUE4QjtBQUR2QixLLFFBR1RDLEksR0FBTztBQUNMQyxZQUFNLFNBREQ7QUFFTEMsZUFBUyxTQUZKO0FBR0xDLGNBQVE7QUFISCxLLFFBS1BDLE8sR0FBVTtBQUNSQyxhQURRLG1CQUNBQyxDQURBLEVBQ0c7QUFDVCxZQUFJQSxFQUFFQyxNQUFGLENBQVNDLEVBQVQsSUFBZUYsRUFBRUMsTUFBRixDQUFTRSxhQUE1QixFQUEyQztBQUN6Q0MsYUFBR0MsV0FBSCxDQUFlO0FBQ2JDLG1CQUFPO0FBRE0sV0FBZjtBQUdBLGNBQUlDLE9BQU8sSUFBWDtBQUNBQyxrQkFBUUMsR0FBUixDQUFZLFVBQVosRUFBd0JGLEtBQUtHLEdBQUwsQ0FBU0MsT0FBakM7QUFDQUosZUFBS0csR0FBTCxDQUNHQyxPQURILENBQ1dYLEVBQUVDLE1BQUYsQ0FBU0MsRUFEcEIsRUFDd0JGLEVBQUVDLE1BQUYsQ0FBU0UsYUFEakMsRUFFR1MsSUFGSCxDQUVRLFVBQVNsQixJQUFULEVBQWU7QUFDbkJVLGVBQUdTLFNBQUgsQ0FBYTtBQUNYUCxxQkFBTyxNQURJO0FBRVhRLG9CQUFNLFNBRks7QUFHWEMsd0JBQVU7QUFIQyxhQUFiOztBQU1BQyx1QkFBVyxZQUFXO0FBQ3BCWixpQkFBR2EsWUFBSDtBQUNELGFBRkQsRUFFRyxHQUZIO0FBR0QsV0FaSCxFQWFHQyxLQWJILENBYVMsVUFBU0MsS0FBVCxFQUFnQjtBQUNyQlgsb0JBQVFDLEdBQVIsQ0FBWSxPQUFaLEVBQXFCVSxLQUFyQjtBQUNBZixlQUFHUyxTQUFILENBQWE7QUFDWFAscUJBQU8sY0FBY2EsTUFBTXZCLE9BRGhCO0FBRVhrQixvQkFBTSxTQUZLO0FBR1hDLHdCQUFVO0FBSEMsYUFBYjtBQUtELFdBcEJIO0FBcUJELFNBM0JELE1BMkJPO0FBQ0xYLGFBQUdnQixTQUFILENBQWE7QUFDWEMsaUJBQUs7QUFETSxXQUFiO0FBR0Q7QUFDRixPQWxDTztBQW1DUkMsWUFuQ1Esb0JBbUNDO0FBQ1BsQixXQUFHZ0IsU0FBSCxDQUFhO0FBQ1hDLGVBQUs7QUFETSxTQUFiO0FBR0Q7QUF2Q08sSzs7Ozs7NkJBeUNEO0FBQUE7O0FBQ1BqQixTQUFHbUIsYUFBSCxDQUFpQjtBQUNmQyxpQkFBUyxzQkFBTztBQUNkLGlCQUFLM0IsTUFBTCxHQUFjNEIsSUFBSUMsZUFBbEI7QUFDRDtBQUhjLE9BQWpCO0FBS0Q7Ozs7RUF6RGdDQyxlQUFLQyxJOztrQkFBbkJ2QyxLIiwiZmlsZSI6ImxvZ2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8qIGdsb2JhbCB3eCAqL1xyXG5pbXBvcnQgd2VweSBmcm9tIFwid2VweVwiO1xyXG5pbXBvcnQgUGFnZU1peGluIGZyb20gXCIuLi9taXhpbnMvcGFnZVwiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dpbiBleHRlbmRzIHdlcHkucGFnZSB7XHJcbiAgbWl4aW5zID0gW1BhZ2VNaXhpbl07XHJcbiAgY29uZmlnID0ge1xyXG4gICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogXCIjZTg0NjQ0XCJcclxuICB9O1xyXG4gIGRhdGEgPSB7XHJcbiAgICBjb2RlOiBcInVua25vd25cIixcclxuICAgIG1lc3NhZ2U6IFwidW5rbm93blwiLFxyXG4gICAgaGVpZ2h0OiBudWxsXHJcbiAgfTtcclxuICBtZXRob2RzID0ge1xyXG4gICAgd3hMb2dpbihlKSB7XHJcbiAgICAgIGlmIChlLmRldGFpbC5pdiAmJiBlLmRldGFpbC5lbmNyeXB0ZWREYXRhKSB7XHJcbiAgICAgICAgd3guc2hvd0xvYWRpbmcoe1xyXG4gICAgICAgICAgdGl0bGU6IFwi5q2j5Zyo55m75b2VLi4uXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJzZWxmLmFwcFwiLCBzZWxmLmFwcC5sb2dpbldYKTtcclxuICAgICAgICBzZWxmLmFwcFxyXG4gICAgICAgICAgLmxvZ2luV1goZS5kZXRhaWwuaXYsIGUuZGV0YWlsLmVuY3J5cHRlZERhdGEpXHJcbiAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XHJcbiAgICAgICAgICAgICAgdGl0bGU6IFwi55m75b2V5oiQ5YqfXCIsXHJcbiAgICAgICAgICAgICAgaWNvbjogXCJzdWNjZXNzXCIsXHJcbiAgICAgICAgICAgICAgZHVyYXRpb246IDIwMDBcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHd4Lm5hdmlnYXRlQmFjaygpO1xyXG4gICAgICAgICAgICB9LCA1MDApO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIueZu+W9leWksei0pTpcIiwgZXJyb3IpO1xyXG4gICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xyXG4gICAgICAgICAgICAgIHRpdGxlOiBcIueZu+W9leWksei0pSzor7fph43or5XvvIFcIiArIGVycm9yLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgaWNvbjogXCJzdWNjZXNzXCIsXHJcbiAgICAgICAgICAgICAgZHVyYXRpb246IDIwMDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB3eC5zd2l0Y2hUYWIoe1xyXG4gICAgICAgICAgdXJsOiBcIi9wYWdlcy9saXN0XCJcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNhbmNlbCgpIHtcclxuICAgICAgd3guc3dpdGNoVGFiKHtcclxuICAgICAgICB1cmw6IFwiL3BhZ2VzL2hvbWUvaG9tZVwiXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgb25Mb2FkKCkge1xyXG4gICAgd3guZ2V0U3lzdGVtSW5mbyh7XHJcbiAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSByZXMuc3RhdHVzQmFySGVpZ2h0O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19