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

exports.default = Member;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lbWJlci4xLmpzIl0sIm5hbWVzIjpbIk1lbWJlciIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uU3R5bGUiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsImRhdGEiLCJtZXRob2RzIiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRoZW4iLCJ1c2VySW5mbyIsIiRhcHBseSIsInd4Iiwic2V0U3RvcmFnZSIsImtleSIsIkpTT04iLCJzdHJpbmdpZnkiLCJjYXRjaCIsImVycm9yIiwicmVzIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJ0eXBlIiwibWFya2VySWQiLCJjb250cm9sSWQiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7OztBQUZBOzs7SUFHcUJBLE07Ozs7Ozs7Ozs7Ozs7O3NMQUVuQkMsTSxHQUFTO0FBQ1BDLDhCQUF3QixPQURqQjtBQUVQQyx1QkFBZ0IsU0FGVDtBQUdQQyxvQ0FBOEI7QUFIdkIsSyxRQUtUQyxVLEdBQWEsRSxRQUNiQyxJLEdBQU8sRSxRQUVQQyxPLEdBQVUsRTs7QUFUVjs7Ozs7b0NBYWdCLENBQUU7Ozt1Q0FFQztBQUFBOztBQUNqQixXQUFLQyxnQkFBTCxDQUFzQixvQkFBdEIsRUFBNEMsRUFBNUMsRUFDR0MsSUFESCxDQUNRLGdCQUFRO0FBQ1osWUFBTUMsV0FBV0osSUFBakI7QUFDQSxlQUFLSyxNQUFMO0FBQ0FDLFdBQUdDLFVBQUgsQ0FBYztBQUNaQyxlQUFLLFVBRE87QUFFWlIsZ0JBQU1TLEtBQUtDLFNBQUwsQ0FBZU4sUUFBZjtBQUZNLFNBQWQ7QUFJRCxPQVJILEVBU0dPLEtBVEgsQ0FTUyxVQUFTQyxLQUFULEVBQWdCLENBQUUsQ0FUM0I7QUFVRDs7OzZCQUNRO0FBQ1A7QUFDRDs7O3NDQUNpQkMsRyxFQUFLLENBQUU7OztpQ0FDWkMsQyxFQUFHO0FBQ2RDLGNBQVFDLEdBQVIsQ0FBWUYsRUFBRUcsSUFBZDtBQUNEOzs7OEJBQ1NILEMsRUFBRztBQUNYQyxjQUFRQyxHQUFSLENBQVlGLEVBQUVJLFFBQWQ7QUFDRDs7OytCQUNVSixDLEVBQUc7QUFDWkMsY0FBUUMsR0FBUixDQUFZRixFQUFFSyxTQUFkO0FBQ0Q7Ozs7RUF4Q2lDQyxlQUFLQyxJOztrQkFBcEIzQixNIiwiZmlsZSI6Im1lbWJlci4xLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8qIGdsb2JhbCB3eCAqL1xyXG5pbXBvcnQgd2VweSBmcm9tIFwid2VweVwiO1xyXG5pbXBvcnQgUGFnZU1peGluIGZyb20gXCIuLi8uLi9taXhpbnMvcGFnZVwiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZW1iZXIgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gIC8vIG1peGlucyA9IFtQYWdlTWl4aW5dO1xyXG4gIGNvbmZpZyA9IHtcclxuICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6IFwi5Lya5ZGY5Y2h5YiX6KGoXCIsXHJcbiAgICBuYXZpZ2F0aW9uU3R5bGU6XCJkZWZhdWx0XCIsXHJcbiAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiBcIiNlODQ2NDRcIlxyXG4gIH07XHJcbiAgY29tcG9uZW50cyA9IHt9O1xyXG4gIGRhdGEgPSB7XHJcbiAgfTtcclxuICBtZXRob2RzID0ge1xyXG4gICBcclxuICB9O1xyXG5cclxuICBvblJlYWNoQm90dG9tKCkge31cclxuXHJcbiAgd2hlbkFwcFJlYWR5U2hvdygpIHtcclxuICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShcInVzZXIvdXNlckluZm8uanNvblwiLCB7fSlcclxuICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgY29uc3QgdXNlckluZm8gPSBkYXRhO1xyXG4gICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICAgICAgd3guc2V0U3RvcmFnZSh7XHJcbiAgICAgICAgICBrZXk6IFwidXNlckluZm9cIixcclxuICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHVzZXJJbmZvKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHt9KTtcclxuICB9XHJcbiAgb25TaG93KCkge1xyXG4gICAgLy8gd3guaGlkZVRhYkJhcigpXHJcbiAgfVxyXG4gIG9uU2hhcmVBcHBNZXNzYWdlKHJlcykge31cclxuICByZWdpb25jaGFuZ2UoZSkge1xyXG4gICAgY29uc29sZS5sb2coZS50eXBlKTtcclxuICB9XHJcbiAgbWFya2VydGFwKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUubWFya2VySWQpO1xyXG4gIH1cclxuICBjb250cm9sdGFwKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUuY29udHJvbElkKTtcclxuICB9XHJcbn1cclxuIl19