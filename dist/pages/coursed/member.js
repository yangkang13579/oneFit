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
    }, _this.components = {}, _this.data = {}, _this.methods = {
      goDetail: function goDetail() {
        wx.navigateTo({
          url: 'card'
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
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


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Member , 'pages/coursed/member'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lbWJlci5qcyJdLCJuYW1lcyI6WyJNZW1iZXIiLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IiwibmF2aWdhdGlvblN0eWxlIiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsImNvbXBvbmVudHMiLCJkYXRhIiwibWV0aG9kcyIsImdvRGV0YWlsIiwid3giLCJuYXZpZ2F0ZVRvIiwidXJsIiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRoZW4iLCJ1c2VySW5mbyIsIiRhcHBseSIsInNldFN0b3JhZ2UiLCJrZXkiLCJKU09OIiwic3RyaW5naWZ5IiwiY2F0Y2giLCJlcnJvciIsInJlcyIsImUiLCJjb25zb2xlIiwibG9nIiwidHlwZSIsIm1hcmtlcklkIiwiY29udHJvbElkIiwid2VweSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7QUFGQTs7O0lBR3FCQSxNOzs7Ozs7Ozs7Ozs7OztzTEFFbkJDLE0sR0FBUztBQUNQQyw4QkFBd0IsT0FEakI7QUFFUEMsdUJBQWdCLFNBRlQ7QUFHUEMsb0NBQThCO0FBSHZCLEssUUFLVEMsVSxHQUFhLEUsUUFDYkMsSSxHQUFPLEUsUUFFUEMsTyxHQUFVO0FBQ1RDLGNBRFMsc0JBQ0M7QUFDTkMsV0FBR0MsVUFBSCxDQUFjO0FBQ1hDLGVBQUs7QUFETSxTQUFkO0FBR0g7QUFMUSxLOztBQVRWOzs7OztvQ0FpQmdCLENBQUU7Ozt1Q0FFQztBQUFBOztBQUNqQixXQUFLQyxnQkFBTCxDQUFzQixvQkFBdEIsRUFBNEMsRUFBNUMsRUFDR0MsSUFESCxDQUNRLGdCQUFRO0FBQ1osWUFBTUMsV0FBV1IsSUFBakI7QUFDQSxlQUFLUyxNQUFMO0FBQ0FOLFdBQUdPLFVBQUgsQ0FBYztBQUNaQyxlQUFLLFVBRE87QUFFWlgsZ0JBQU1ZLEtBQUtDLFNBQUwsQ0FBZUwsUUFBZjtBQUZNLFNBQWQ7QUFJRCxPQVJILEVBU0dNLEtBVEgsQ0FTUyxVQUFTQyxLQUFULEVBQWdCLENBQUUsQ0FUM0I7QUFVRDs7OzZCQUNRO0FBQ1A7QUFDRDs7O3NDQUNpQkMsRyxFQUFLLENBQUU7OztpQ0FDWkMsQyxFQUFHO0FBQ2RDLGNBQVFDLEdBQVIsQ0FBWUYsRUFBRUcsSUFBZDtBQUNEOzs7OEJBQ1NILEMsRUFBRztBQUNYQyxjQUFRQyxHQUFSLENBQVlGLEVBQUVJLFFBQWQ7QUFDRDs7OytCQUNVSixDLEVBQUc7QUFDWkMsY0FBUUMsR0FBUixDQUFZRixFQUFFSyxTQUFkO0FBQ0Q7Ozs7RUE1Q2lDQyxlQUFLQyxJOztrQkFBcEI5QixNIiwiZmlsZSI6Im1lbWJlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKiBnbG9iYWwgd3ggKi9cclxuaW1wb3J0IHdlcHkgZnJvbSBcIndlcHlcIjtcclxuaW1wb3J0IFBhZ2VNaXhpbiBmcm9tIFwiLi4vLi4vbWl4aW5zL3BhZ2VcIjtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVtYmVyIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICAvLyBtaXhpbnMgPSBbUGFnZU1peGluXTtcclxuICBjb25maWcgPSB7XHJcbiAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiBcIuS8muWRmOWNoeWIl+ihqFwiLFxyXG4gICAgbmF2aWdhdGlvblN0eWxlOlwiZGVmYXVsdFwiLFxyXG4gICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogXCIjZTg0NjQ0XCJcclxuICB9O1xyXG4gIGNvbXBvbmVudHMgPSB7fTtcclxuICBkYXRhID0ge1xyXG4gIH07XHJcbiAgbWV0aG9kcyA9IHtcclxuICAgZ29EZXRhaWwoKXtcclxuICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgICAgdXJsOiAnY2FyZCdcclxuICAgICAgfSk7XHJcbiAgIH1cclxuICB9O1xyXG5cclxuICBvblJlYWNoQm90dG9tKCkge31cclxuXHJcbiAgd2hlbkFwcFJlYWR5U2hvdygpIHtcclxuICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShcInVzZXIvdXNlckluZm8uanNvblwiLCB7fSlcclxuICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgY29uc3QgdXNlckluZm8gPSBkYXRhO1xyXG4gICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICAgICAgd3guc2V0U3RvcmFnZSh7XHJcbiAgICAgICAgICBrZXk6IFwidXNlckluZm9cIixcclxuICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHVzZXJJbmZvKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHt9KTtcclxuICB9XHJcbiAgb25TaG93KCkge1xyXG4gICAgLy8gd3guaGlkZVRhYkJhcigpXHJcbiAgfVxyXG4gIG9uU2hhcmVBcHBNZXNzYWdlKHJlcykge31cclxuICByZWdpb25jaGFuZ2UoZSkge1xyXG4gICAgY29uc29sZS5sb2coZS50eXBlKTtcclxuICB9XHJcbiAgbWFya2VydGFwKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUubWFya2VySWQpO1xyXG4gIH1cclxuICBjb250cm9sdGFwKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUuY29udHJvbElkKTtcclxuICB9XHJcbn1cclxuIl19