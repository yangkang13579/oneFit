"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _page = require('./../../mixins/page.js');

var _page2 = _interopRequireDefault(_page);

var _headers = require('./../../components/headers.js');

var _headers2 = _interopRequireDefault(_headers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/* global wx */


var Course = function (_wepy$page) {
  _inherits(Course, _wepy$page);

  function Course() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Course);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Course.__proto__ || Object.getPrototypeOf(Course)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
      navigationBarBackgroundColor: "#fff"
    }, _this.components = {
      header: _headers2.default
    }, _this.data = {
      height: "",
      text: "",
      items: []
    }, _this.methods = {
      goBack: function goBack() {
        wx.navigateBack();
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Course, [{
    key: "getUserInfo",
    value: function getUserInfo() {
      var that = this;
      this.fetchDataPromise("user/userInfo.json", { action: "coupon" }).then(function (data) {
        that.items = data.items;
        that.$apply();
      });
    }
  }, {
    key: "whenAppReadyShow",
    value: function whenAppReadyShow() {
      this.getUserInfo();
    }
  }, {
    key: "onShow",
    value: function onShow() {
      var _this2 = this;

      wx.getSystemInfo({
        success: function success(res) {
          _this2.height = res.statusBarHeight;
          _this2.$broadcast("index-broadcast", {
            height: _this2.height,
            text: "我的卡包"
          });
        }
      });
    }
  }]);

  return Course;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Course , 'pages/user/card'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcmQuanMiXSwibmFtZXMiOlsiQ291cnNlIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsImNvbXBvbmVudHMiLCJoZWFkZXIiLCJkYXRhIiwiaGVpZ2h0IiwidGV4dCIsIml0ZW1zIiwibWV0aG9kcyIsImdvQmFjayIsInd4IiwibmF2aWdhdGVCYWNrIiwidGhhdCIsImZldGNoRGF0YVByb21pc2UiLCJhY3Rpb24iLCJ0aGVuIiwiJGFwcGx5IiwiZ2V0VXNlckluZm8iLCJnZXRTeXN0ZW1JbmZvIiwic3VjY2VzcyIsInJlcyIsInN0YXR1c0JhckhlaWdodCIsIiRicm9hZGNhc3QiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBSEE7OztJQUlxQkEsTTs7Ozs7Ozs7Ozs7Ozs7c0xBQ25CQyxNLEdBQVMsQ0FBQ0MsY0FBRCxDLFFBQ1RDLE0sR0FBUztBQUNQQyxvQ0FBOEI7QUFEdkIsSyxRQUdUQyxVLEdBQWE7QUFDWEM7QUFEVyxLLFFBR2JDLEksR0FBTztBQUNMQyxjQUFRLEVBREg7QUFFTEMsWUFBTSxFQUZEO0FBR0xDLGFBQU87QUFIRixLLFFBS1BDLE8sR0FBVTtBQUNSQyxZQURRLG9CQUNDO0FBQ1BDLFdBQUdDLFlBQUg7QUFDRDtBQUhPLEs7Ozs7O2tDQUtJO0FBQ1osVUFBSUMsT0FBTyxJQUFYO0FBQ0EsV0FBS0MsZ0JBQUwsQ0FBc0Isb0JBQXRCLEVBQTRDLEVBQUVDLFFBQVEsUUFBVixFQUE1QyxFQUFrRUMsSUFBbEUsQ0FDRSxVQUFTWCxJQUFULEVBQWU7QUFDYlEsYUFBS0wsS0FBTCxHQUFhSCxLQUFLRyxLQUFsQjtBQUNBSyxhQUFLSSxNQUFMO0FBQ0QsT0FKSDtBQU1EOzs7dUNBQ2tCO0FBQ2pCLFdBQUtDLFdBQUw7QUFDRDs7OzZCQUNRO0FBQUE7O0FBQ1BQLFNBQUdRLGFBQUgsQ0FBaUI7QUFDZkMsaUJBQVMsc0JBQU87QUFDZCxpQkFBS2QsTUFBTCxHQUFjZSxJQUFJQyxlQUFsQjtBQUNBLGlCQUFLQyxVQUFMLENBQWdCLGlCQUFoQixFQUFtQztBQUNqQ2pCLG9CQUFRLE9BQUtBLE1BRG9CO0FBRWpDQyxrQkFBTTtBQUYyQixXQUFuQztBQUlEO0FBUGMsT0FBakI7QUFTRDs7OztFQXhDaUNpQixlQUFLQyxJOztrQkFBcEIzQixNIiwiZmlsZSI6ImNhcmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qIGdsb2JhbCB3eCAqL1xuaW1wb3J0IHdlcHkgZnJvbSBcIndlcHlcIjtcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSBcIi4uLy4uL21peGlucy9wYWdlXCI7XG5pbXBvcnQgaGVhZGVyIGZyb20gXCIuLi8uLi9jb21wb25lbnRzL2hlYWRlcnNcIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvdXJzZSBleHRlbmRzIHdlcHkucGFnZSB7XG4gIG1peGlucyA9IFtQYWdlTWl4aW5dO1xuICBjb25maWcgPSB7XG4gICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcbiAgfTtcbiAgY29tcG9uZW50cyA9IHtcbiAgICBoZWFkZXJcbiAgfTtcbiAgZGF0YSA9IHtcbiAgICBoZWlnaHQ6IFwiXCIsXG4gICAgdGV4dDogXCJcIixcbiAgICBpdGVtczogW11cbiAgfTtcbiAgbWV0aG9kcyA9IHtcbiAgICBnb0JhY2soKSB7XG4gICAgICB3eC5uYXZpZ2F0ZUJhY2soKTtcbiAgICB9XG4gIH07XG4gIGdldFVzZXJJbmZvKCkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoXCJ1c2VyL3VzZXJJbmZvLmpzb25cIiwgeyBhY3Rpb246IFwiY291cG9uXCIgfSkudGhlbihcbiAgICAgIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgdGhhdC5pdGVtcyA9IGRhdGEuaXRlbXM7XG4gICAgICAgIHRoYXQuJGFwcGx5KCk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuICB3aGVuQXBwUmVhZHlTaG93KCkge1xuICAgIHRoaXMuZ2V0VXNlckluZm8oKTtcbiAgfVxuICBvblNob3coKSB7XG4gICAgd3guZ2V0U3lzdGVtSW5mbyh7XG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICB0aGlzLmhlaWdodCA9IHJlcy5zdGF0dXNCYXJIZWlnaHQ7XG4gICAgICAgIHRoaXMuJGJyb2FkY2FzdChcImluZGV4LWJyb2FkY2FzdFwiLCB7XG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgICAgICB0ZXh0OiBcIuaIkeeahOWNoeWMhVwiXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=