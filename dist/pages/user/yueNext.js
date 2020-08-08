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
      currentIndex: null,
      height: null,
      array: [1]
    }, _this.methods = {
      details: function details(e) {
        this.currentIndex = e.currentTarget.dataset.index;
        wx.navigateTo({
          url: "/pages/user/teceData"
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Course, [{
    key: "onShow",
    value: function onShow() {
      var _this2 = this;

      wx.getSystemInfo({
        success: function success(res) {
          _this2.height = res.statusBarHeight;
          _this2.$broadcast("index-broadcast", {
            height: _this2.height,
            text: "会员训练计划"
          });
        }
      });
    }
  }]);

  return Course;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Course , 'pages/user/yueNext'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInl1ZU5leHQuanMiXSwibmFtZXMiOlsiQ291cnNlIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsImNvbXBvbmVudHMiLCJoZWFkZXIiLCJkYXRhIiwiY3VycmVudEluZGV4IiwiaGVpZ2h0IiwiYXJyYXkiLCJtZXRob2RzIiwiZGV0YWlscyIsImUiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YXNldCIsImluZGV4Iiwid3giLCJuYXZpZ2F0ZVRvIiwidXJsIiwiZ2V0U3lzdGVtSW5mbyIsInN1Y2Nlc3MiLCJyZXMiLCJzdGF0dXNCYXJIZWlnaHQiLCIkYnJvYWRjYXN0IiwidGV4dCIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7QUFIQTs7O0lBSXFCQSxNOzs7Ozs7Ozs7Ozs7OztzTEFDbkJDLE0sR0FBUyxDQUFDQyxjQUFELEMsUUFDVEMsTSxHQUFTO0FBQ1BDLG9DQUE4QjtBQUR2QixLLFFBR1RDLFUsR0FBYTtBQUNYQztBQURXLEssUUFHYkMsSSxHQUFPO0FBQ0xDLG9CQUFjLElBRFQ7QUFFTEMsY0FBUSxJQUZIO0FBR0xDLGFBQU8sQ0FBQyxDQUFEO0FBSEYsSyxRQUtQQyxPLEdBQVU7QUFDUkMsYUFEUSxtQkFDQUMsQ0FEQSxFQUNHO0FBQ1QsYUFBS0wsWUFBTCxHQUFvQkssRUFBRUMsYUFBRixDQUFnQkMsT0FBaEIsQ0FBd0JDLEtBQTVDO0FBQ0FDLFdBQUdDLFVBQUgsQ0FBYztBQUNaQyxlQUFLO0FBRE8sU0FBZDtBQUdEO0FBTk8sSzs7Ozs7NkJBUUQ7QUFBQTs7QUFDUEYsU0FBR0csYUFBSCxDQUFpQjtBQUNmQyxpQkFBUyxzQkFBTztBQUNkLGlCQUFLWixNQUFMLEdBQWNhLElBQUlDLGVBQWxCO0FBQ0EsaUJBQUtDLFVBQUwsQ0FBZ0IsaUJBQWhCLEVBQW1DO0FBQ2pDZixvQkFBUSxPQUFLQSxNQURvQjtBQUVqQ2dCLGtCQUFNO0FBRjJCLFdBQW5DO0FBSUQ7QUFQYyxPQUFqQjtBQVNEOzs7O0VBL0JpQ0MsZUFBS0MsSTs7a0JBQXBCM0IsTSIsImZpbGUiOiJ5dWVOZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKiBnbG9iYWwgd3ggKi9cbmltcG9ydCB3ZXB5IGZyb20gXCJ3ZXB5XCI7XG5pbXBvcnQgUGFnZU1peGluIGZyb20gXCIuLi8uLi9taXhpbnMvcGFnZVwiO1xuaW1wb3J0IGhlYWRlciBmcm9tIFwiLi4vLi4vY29tcG9uZW50cy9oZWFkZXJzXCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3Vyc2UgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xuICBtaXhpbnMgPSBbUGFnZU1peGluXTtcbiAgY29uZmlnID0ge1xuICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZlwiXG4gIH07XG4gIGNvbXBvbmVudHMgPSB7XG4gICAgaGVhZGVyXG4gIH07XG4gIGRhdGEgPSB7XG4gICAgY3VycmVudEluZGV4OiBudWxsLFxuICAgIGhlaWdodDogbnVsbCxcbiAgICBhcnJheTogWzFdXG4gIH07XG4gIG1ldGhvZHMgPSB7XG4gICAgZGV0YWlscyhlKSB7XG4gICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4O1xuICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgIHVybDogXCIvcGFnZXMvdXNlci90ZWNlRGF0YVwiXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gIG9uU2hvdygpIHtcbiAgICB3eC5nZXRTeXN0ZW1JbmZvKHtcbiAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gcmVzLnN0YXR1c0JhckhlaWdodDtcbiAgICAgICAgdGhpcy4kYnJvYWRjYXN0KFwiaW5kZXgtYnJvYWRjYXN0XCIsIHtcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxuICAgICAgICAgIHRleHQ6IFwi5Lya5ZGY6K6t57uD6K6h5YiSXCJcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==