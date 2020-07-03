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


var Member = function (_wepy$page) {
  _inherits(Member, _wepy$page);

  function Member() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Member);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Member.__proto__ || Object.getPrototypeOf(Member)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
      navigationBarTitleText: "会员卡列表",
      navigationStyle: "default",
      navigationBarBackgroundColor: "#e84644"
    }, _this.components = {}, _this.data = {}, _this.methods = {}, _temp), _possibleConstructorReturn(_this, _ret);
  }
  // mixins = [PageMixin];


  _createClass(Member, [{
    key: "onReachBottom",
    value: function onReachBottom() {}
  }, {
    key: "whenAppReadyShow",
    value: function whenAppReadyShow() {
      var _this2 = this;

      this.fetchDataPromise("user/userInfo.json", {}).then(function (data) {
        var userInfo = data;
        _this2.$apply();
        wx.setStorage({
          key: "userInfo",
          data: JSON.stringify(userInfo)
        });
      }).catch(function (error) {});
    }
  }, {
    key: "onShow",
    value: function onShow() {
      // wx.hideTabBar()
    }
  }, {
    key: "onShareAppMessage",
    value: function onShareAppMessage(res) {}
  }, {
    key: "regionchange",
    value: function regionchange(e) {
      console.log(e.type);
    }
  }, {
    key: "markertap",
    value: function markertap(e) {
      console.log(e.markerId);
    }
  }, {
    key: "controltap",
    value: function controltap(e) {
      console.log(e.controlId);
    }
  }]);

  return Member;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Member , 'pages/coursed/card'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcmQuanMiXSwibmFtZXMiOlsiTWVtYmVyIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm5hdmlnYXRpb25TdHlsZSIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJjb21wb25lbnRzIiwiZGF0YSIsIm1ldGhvZHMiLCJmZXRjaERhdGFQcm9taXNlIiwidGhlbiIsInVzZXJJbmZvIiwiJGFwcGx5Iiwid3giLCJzZXRTdG9yYWdlIiwia2V5IiwiSlNPTiIsInN0cmluZ2lmeSIsImNhdGNoIiwiZXJyb3IiLCJyZXMiLCJlIiwiY29uc29sZSIsImxvZyIsInR5cGUiLCJtYXJrZXJJZCIsImNvbnRyb2xJZCIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBRkE7OztJQUdxQkEsTTs7Ozs7Ozs7Ozs7Ozs7c0xBRW5CQyxNLEdBQVM7QUFDUEMsOEJBQXdCLE9BRGpCO0FBRVBDLHVCQUFnQixTQUZUO0FBR1BDLG9DQUE4QjtBQUh2QixLLFFBS1RDLFUsR0FBYSxFLFFBQ2JDLEksR0FBTyxFLFFBRVBDLE8sR0FBVSxFOztBQVRWOzs7OztvQ0FhZ0IsQ0FBRTs7O3VDQUVDO0FBQUE7O0FBQ2pCLFdBQUtDLGdCQUFMLENBQXNCLG9CQUF0QixFQUE0QyxFQUE1QyxFQUNHQyxJQURILENBQ1EsZ0JBQVE7QUFDWixZQUFNQyxXQUFXSixJQUFqQjtBQUNBLGVBQUtLLE1BQUw7QUFDQUMsV0FBR0MsVUFBSCxDQUFjO0FBQ1pDLGVBQUssVUFETztBQUVaUixnQkFBTVMsS0FBS0MsU0FBTCxDQUFlTixRQUFmO0FBRk0sU0FBZDtBQUlELE9BUkgsRUFTR08sS0FUSCxDQVNTLFVBQVNDLEtBQVQsRUFBZ0IsQ0FBRSxDQVQzQjtBQVVEOzs7NkJBQ1E7QUFDUDtBQUNEOzs7c0NBQ2lCQyxHLEVBQUssQ0FBRTs7O2lDQUNaQyxDLEVBQUc7QUFDZEMsY0FBUUMsR0FBUixDQUFZRixFQUFFRyxJQUFkO0FBQ0Q7Ozs4QkFDU0gsQyxFQUFHO0FBQ1hDLGNBQVFDLEdBQVIsQ0FBWUYsRUFBRUksUUFBZDtBQUNEOzs7K0JBQ1VKLEMsRUFBRztBQUNaQyxjQUFRQyxHQUFSLENBQVlGLEVBQUVLLFNBQWQ7QUFDRDs7OztFQXhDaUNDLGVBQUtDLEk7O2tCQUFwQjNCLE0iLCJmaWxlIjoiY2FyZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKiBnbG9iYWwgd3ggKi9cclxuaW1wb3J0IHdlcHkgZnJvbSBcIndlcHlcIjtcclxuaW1wb3J0IFBhZ2VNaXhpbiBmcm9tIFwiLi4vLi4vbWl4aW5zL3BhZ2VcIjtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVtYmVyIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICAvLyBtaXhpbnMgPSBbUGFnZU1peGluXTtcclxuICBjb25maWcgPSB7XHJcbiAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiBcIuS8muWRmOWNoeWIl+ihqFwiLFxyXG4gICAgbmF2aWdhdGlvblN0eWxlOlwiZGVmYXVsdFwiLFxyXG4gICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogXCIjZTg0NjQ0XCJcclxuICB9O1xyXG4gIGNvbXBvbmVudHMgPSB7fTtcclxuICBkYXRhID0ge1xyXG4gIH07XHJcbiAgbWV0aG9kcyA9IHtcclxuICAgXHJcbiAgfTtcclxuXHJcbiAgb25SZWFjaEJvdHRvbSgpIHt9XHJcblxyXG4gIHdoZW5BcHBSZWFkeVNob3coKSB7XHJcbiAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoXCJ1c2VyL3VzZXJJbmZvLmpzb25cIiwge30pXHJcbiAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgIGNvbnN0IHVzZXJJbmZvID0gZGF0YTtcclxuICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICAgIHd4LnNldFN0b3JhZ2Uoe1xyXG4gICAgICAgICAga2V5OiBcInVzZXJJbmZvXCIsXHJcbiAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh1c2VySW5mbylcclxuICAgICAgICB9KTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7fSk7XHJcbiAgfVxyXG4gIG9uU2hvdygpIHtcclxuICAgIC8vIHd4LmhpZGVUYWJCYXIoKVxyXG4gIH1cclxuICBvblNoYXJlQXBwTWVzc2FnZShyZXMpIHt9XHJcbiAgcmVnaW9uY2hhbmdlKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUudHlwZSk7XHJcbiAgfVxyXG4gIG1hcmtlcnRhcChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlLm1hcmtlcklkKTtcclxuICB9XHJcbiAgY29udHJvbHRhcChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlLmNvbnRyb2xJZCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==