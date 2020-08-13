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
      datas: [1, 2, 3, 4],
      courseId: null,
      branchId: null,
      details: null
    }, _this.methods = {
      buy: function buy() {
        wx.navigateTo({
          url: "/pages/home/buy?branchId=" + this.branchId
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Course, [{
    key: "onLoad",
    value: function onLoad(options) {
      this.branchId = options.branchId;
      this.courseId = options.courseId;
    }
  }, {
    key: "whenAppReadyShow",
    value: function whenAppReadyShow() {
      var _this2 = this;

      var that = this;
      this.fetchDataPromise("page/branch.json", {
        action: "course",
        branchId: this.branchId,
        courseId: this.courseId
      }).then(function (data) {
        _this2.details = data;
        _this2.$apply();
      });
    }
  }, {
    key: "onShow",
    value: function onShow() {
      var _this3 = this;

      wx.getSystemInfo({
        success: function success(res) {
          _this3.height = res.statusBarHeight;
          _this3.$broadcast("index-broadcast", {
            height: _this3.height,
            text: "OneFit健身"
          });
        }
      });
    }
  }]);

  return Course;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Course , 'pages/doors/corseDetails'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcnNlRGV0YWlscy5qcyJdLCJuYW1lcyI6WyJDb3Vyc2UiLCJtaXhpbnMiLCJQYWdlTWl4aW4iLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsImhlYWRlciIsImRhdGEiLCJoZWlnaHQiLCJkYXRhcyIsImNvdXJzZUlkIiwiYnJhbmNoSWQiLCJkZXRhaWxzIiwibWV0aG9kcyIsImJ1eSIsInd4IiwibmF2aWdhdGVUbyIsInVybCIsIm9wdGlvbnMiLCJ0aGF0IiwiZmV0Y2hEYXRhUHJvbWlzZSIsImFjdGlvbiIsInRoZW4iLCIkYXBwbHkiLCJnZXRTeXN0ZW1JbmZvIiwic3VjY2VzcyIsInJlcyIsInN0YXR1c0JhckhlaWdodCIsIiRicm9hZGNhc3QiLCJ0ZXh0Iiwid2VweSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7OztBQUhBOzs7SUFJcUJBLE07Ozs7Ozs7Ozs7Ozs7O3NMQUNuQkMsTSxHQUFTLENBQUNDLGNBQUQsQyxRQUNUQyxNLEdBQVM7QUFDUEMsb0NBQThCO0FBRHZCLEssUUFHVEMsVSxHQUFhO0FBQ1hDO0FBRFcsSyxRQUdiQyxJLEdBQU87QUFDTEMsY0FBUSxFQURIO0FBRUxDLGFBQU8sQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWLENBRkY7QUFHTEMsZ0JBQVUsSUFITDtBQUlMQyxnQkFBVSxJQUpMO0FBS0xDLGVBQVM7QUFMSixLLFFBV1BDLE8sR0FBVTtBQUNSQyxTQURRLGlCQUNGO0FBQ0pDLFdBQUdDLFVBQUgsQ0FBYztBQUNaQyxlQUFLLDhCQUE4QixLQUFLTjtBQUQ1QixTQUFkO0FBR0Q7QUFMTyxLOzs7OzsyQkFKSE8sTyxFQUFTO0FBQ2QsV0FBS1AsUUFBTCxHQUFnQk8sUUFBUVAsUUFBeEI7QUFDQSxXQUFLRCxRQUFMLEdBQWdCUSxRQUFRUixRQUF4QjtBQUNEOzs7dUNBUWtCO0FBQUE7O0FBQ2pCLFVBQUlTLE9BQU8sSUFBWDtBQUNBLFdBQUtDLGdCQUFMLENBQXNCLGtCQUF0QixFQUEwQztBQUN4Q0MsZ0JBQVEsUUFEZ0M7QUFFeENWLGtCQUFVLEtBQUtBLFFBRnlCO0FBR3hDRCxrQkFBVSxLQUFLQTtBQUh5QixPQUExQyxFQUlHWSxJQUpILENBSVEsZ0JBQVE7QUFDZCxlQUFLVixPQUFMLEdBQWVMLElBQWY7QUFDQSxlQUFLZ0IsTUFBTDtBQUNELE9BUEQ7QUFRRDs7OzZCQUNRO0FBQUE7O0FBQ1BSLFNBQUdTLGFBQUgsQ0FBaUI7QUFDZkMsaUJBQVMsc0JBQU87QUFDZCxpQkFBS2pCLE1BQUwsR0FBY2tCLElBQUlDLGVBQWxCO0FBQ0EsaUJBQUtDLFVBQUwsQ0FBZ0IsaUJBQWhCLEVBQW1DO0FBQ2pDcEIsb0JBQVEsT0FBS0EsTUFEb0I7QUFFakNxQixrQkFBTTtBQUYyQixXQUFuQztBQUlEO0FBUGMsT0FBakI7QUFTRDs7OztFQS9DaUNDLGVBQUtDLEk7O2tCQUFwQi9CLE0iLCJmaWxlIjoiY29yc2VEZXRhaWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKiBnbG9iYWwgd3ggKi9cbmltcG9ydCB3ZXB5IGZyb20gXCJ3ZXB5XCI7XG5pbXBvcnQgUGFnZU1peGluIGZyb20gXCIuLi8uLi9taXhpbnMvcGFnZVwiO1xuaW1wb3J0IGhlYWRlciBmcm9tIFwiLi4vLi4vY29tcG9uZW50cy9oZWFkZXJzXCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3Vyc2UgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xuICBtaXhpbnMgPSBbUGFnZU1peGluXTtcbiAgY29uZmlnID0ge1xuICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZlwiXG4gIH07XG4gIGNvbXBvbmVudHMgPSB7XG4gICAgaGVhZGVyXG4gIH07XG4gIGRhdGEgPSB7XG4gICAgaGVpZ2h0OiBcIlwiLFxuICAgIGRhdGFzOiBbMSwgMiwgMywgNF0sXG4gICAgY291cnNlSWQ6IG51bGwsXG4gICAgYnJhbmNoSWQ6IG51bGwsXG4gICAgZGV0YWlsczogbnVsbFxuICB9O1xuICBvbkxvYWQob3B0aW9ucykge1xuICAgIHRoaXMuYnJhbmNoSWQgPSBvcHRpb25zLmJyYW5jaElkO1xuICAgIHRoaXMuY291cnNlSWQgPSBvcHRpb25zLmNvdXJzZUlkO1xuICB9XG4gIG1ldGhvZHMgPSB7XG4gICAgYnV5KCkge1xuICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgIHVybDogXCIvcGFnZXMvaG9tZS9idXk/YnJhbmNoSWQ9XCIgKyB0aGlzLmJyYW5jaElkXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gIHdoZW5BcHBSZWFkeVNob3coKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShcInBhZ2UvYnJhbmNoLmpzb25cIiwge1xuICAgICAgYWN0aW9uOiBcImNvdXJzZVwiLFxuICAgICAgYnJhbmNoSWQ6IHRoaXMuYnJhbmNoSWQsXG4gICAgICBjb3Vyc2VJZDogdGhpcy5jb3Vyc2VJZFxuICAgIH0pLnRoZW4oZGF0YSA9PiB7XG4gICAgICB0aGlzLmRldGFpbHMgPSBkYXRhO1xuICAgICAgdGhpcy4kYXBwbHkoKTtcbiAgICB9KTtcbiAgfVxuICBvblNob3coKSB7XG4gICAgd3guZ2V0U3lzdGVtSW5mbyh7XG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICB0aGlzLmhlaWdodCA9IHJlcy5zdGF0dXNCYXJIZWlnaHQ7XG4gICAgICAgIHRoaXMuJGJyb2FkY2FzdChcImluZGV4LWJyb2FkY2FzdFwiLCB7XG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgICAgICB0ZXh0OiBcIk9uZUZpdOWBpei6q1wiXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=