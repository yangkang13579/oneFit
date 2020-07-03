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


var Coach = function (_wepy$page) {
  _inherits(Coach, _wepy$page);

  function Coach() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Coach);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Coach.__proto__ || Object.getPrototypeOf(Coach)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
      navigationBarTitleText: "首页",
      navigationBarBackgroundColor: "#fff"
    }, _this.components = {}, _this.data = {}, _this.methods = {
      goBuy: function goBuy() {
        wx.navigateTo({
          url: 'member'
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }
  // mixins = [PageMixin];


  _createClass(Coach, [{
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

  return Coach;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Coach , 'pages/coursed/coach'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvYWNoLmpzIl0sIm5hbWVzIjpbIkNvYWNoIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJjb21wb25lbnRzIiwiZGF0YSIsIm1ldGhvZHMiLCJnb0J1eSIsInd4IiwibmF2aWdhdGVUbyIsInVybCIsImZldGNoRGF0YVByb21pc2UiLCJ0aGVuIiwidXNlckluZm8iLCIkYXBwbHkiLCJzZXRTdG9yYWdlIiwia2V5IiwiSlNPTiIsInN0cmluZ2lmeSIsImNhdGNoIiwiZXJyb3IiLCJyZXMiLCJlIiwiY29uc29sZSIsImxvZyIsInR5cGUiLCJtYXJrZXJJZCIsImNvbnRyb2xJZCIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBRkE7OztJQUdxQkEsSzs7Ozs7Ozs7Ozs7Ozs7b0xBRW5CQyxNLEdBQVM7QUFDUEMsOEJBQXdCLElBRGpCO0FBRVBDLG9DQUE4QjtBQUZ2QixLLFFBSVRDLFUsR0FBYSxFLFFBQ2JDLEksR0FBTyxFLFFBRVBDLE8sR0FBVTtBQUNUQyxXQURTLG1CQUNGO0FBQ0pDLFdBQUdDLFVBQUgsQ0FBYztBQUNWQyxlQUFLO0FBREssU0FBZDtBQUdGO0FBTFEsSzs7QUFSVjs7Ozs7b0NBZ0JnQixDQUFFOzs7dUNBRUM7QUFBQTs7QUFDakIsV0FBS0MsZ0JBQUwsQ0FBc0Isb0JBQXRCLEVBQTRDLEVBQTVDLEVBQ0dDLElBREgsQ0FDUSxnQkFBUTtBQUNaLFlBQU1DLFdBQVdSLElBQWpCO0FBQ0EsZUFBS1MsTUFBTDtBQUNBTixXQUFHTyxVQUFILENBQWM7QUFDWkMsZUFBSyxVQURPO0FBRVpYLGdCQUFNWSxLQUFLQyxTQUFMLENBQWVMLFFBQWY7QUFGTSxTQUFkO0FBSUQsT0FSSCxFQVNHTSxLQVRILENBU1MsVUFBU0MsS0FBVCxFQUFnQixDQUFFLENBVDNCO0FBVUQ7Ozs2QkFDUTtBQUNQO0FBQ0Q7OztzQ0FDaUJDLEcsRUFBSyxDQUFFOzs7aUNBQ1pDLEMsRUFBRztBQUNkQyxjQUFRQyxHQUFSLENBQVlGLEVBQUVHLElBQWQ7QUFDRDs7OzhCQUNTSCxDLEVBQUc7QUFDWEMsY0FBUUMsR0FBUixDQUFZRixFQUFFSSxRQUFkO0FBQ0Q7OzsrQkFDVUosQyxFQUFHO0FBQ1pDLGNBQVFDLEdBQVIsQ0FBWUYsRUFBRUssU0FBZDtBQUNEOzs7O0VBM0NnQ0MsZUFBS0MsSTs7a0JBQW5CN0IsSyIsImZpbGUiOiJjb2FjaC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKiBnbG9iYWwgd3ggKi9cclxuaW1wb3J0IHdlcHkgZnJvbSBcIndlcHlcIjtcclxuaW1wb3J0IFBhZ2VNaXhpbiBmcm9tIFwiLi4vLi4vbWl4aW5zL3BhZ2VcIjtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29hY2ggZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gIC8vIG1peGlucyA9IFtQYWdlTWl4aW5dO1xyXG4gIGNvbmZpZyA9IHtcclxuICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6IFwi6aaW6aG1XCIsXHJcbiAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIlxyXG4gIH07XHJcbiAgY29tcG9uZW50cyA9IHt9O1xyXG4gIGRhdGEgPSB7XHJcbiAgfTtcclxuICBtZXRob2RzID0ge1xyXG4gICBnb0J1eSgpe1xyXG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICAgIHVybDogJ21lbWJlcidcclxuICAgICAgfSk7XHJcbiAgIH1cclxuICB9O1xyXG5cclxuICBvblJlYWNoQm90dG9tKCkge31cclxuXHJcbiAgd2hlbkFwcFJlYWR5U2hvdygpIHtcclxuICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShcInVzZXIvdXNlckluZm8uanNvblwiLCB7fSlcclxuICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgY29uc3QgdXNlckluZm8gPSBkYXRhO1xyXG4gICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICAgICAgd3guc2V0U3RvcmFnZSh7XHJcbiAgICAgICAgICBrZXk6IFwidXNlckluZm9cIixcclxuICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHVzZXJJbmZvKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHt9KTtcclxuICB9XHJcbiAgb25TaG93KCkge1xyXG4gICAgLy8gd3guaGlkZVRhYkJhcigpXHJcbiAgfVxyXG4gIG9uU2hhcmVBcHBNZXNzYWdlKHJlcykge31cclxuICByZWdpb25jaGFuZ2UoZSkge1xyXG4gICAgY29uc29sZS5sb2coZS50eXBlKTtcclxuICB9XHJcbiAgbWFya2VydGFwKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUubWFya2VySWQpO1xyXG4gIH1cclxuICBjb250cm9sdGFwKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUuY29udHJvbElkKTtcclxuICB9XHJcbn1cclxuIl19