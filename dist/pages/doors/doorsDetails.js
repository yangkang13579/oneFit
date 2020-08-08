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
      currentIndex: 0,
      currentIndex2: 1
    }, _this.methods = {
      change: function change(e) {
        this.currentIndex2 = e.detail.current + 1 === this.datas.length ? 0 : e.detail.current + 1;
        console.log(this.currentIndex2);
      },
      buyFeat: function buyFeat() {
        wx.navigateTo({
          url: "/pages/doors/featDetails"
        });
      },
      buyCorse: function buyCorse() {
        wx.navigateTo({
          url: "/pages/doors/corseDetails"
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
            text: "OneFit健身"
          });
        }
      });
    }
  }]);

  return Course;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Course , 'pages/doors/doorsDetails'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvb3JzRGV0YWlscy5qcyJdLCJuYW1lcyI6WyJDb3Vyc2UiLCJtaXhpbnMiLCJQYWdlTWl4aW4iLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsImhlYWRlciIsImRhdGEiLCJoZWlnaHQiLCJkYXRhcyIsImN1cnJlbnRJbmRleCIsImN1cnJlbnRJbmRleDIiLCJtZXRob2RzIiwiY2hhbmdlIiwiZSIsImRldGFpbCIsImN1cnJlbnQiLCJsZW5ndGgiLCJjb25zb2xlIiwibG9nIiwiYnV5RmVhdCIsInd4IiwibmF2aWdhdGVUbyIsInVybCIsImJ1eUNvcnNlIiwiZ2V0U3lzdGVtSW5mbyIsInN1Y2Nlc3MiLCJyZXMiLCJzdGF0dXNCYXJIZWlnaHQiLCIkYnJvYWRjYXN0IiwidGV4dCIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7QUFIQTs7O0lBSXFCQSxNOzs7Ozs7Ozs7Ozs7OztzTEFDbkJDLE0sR0FBUyxDQUFDQyxjQUFELEMsUUFDVEMsTSxHQUFTO0FBQ1BDLG9DQUE4QjtBQUR2QixLLFFBR1RDLFUsR0FBYTtBQUNYQztBQURXLEssUUFHYkMsSSxHQUFPO0FBQ0xDLGNBQVEsRUFESDtBQUVMQyxhQUFPLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixDQUZGO0FBR0xDLG9CQUFjLENBSFQ7QUFJTEMscUJBQWU7QUFKVixLLFFBTVBDLE8sR0FBVTtBQUNSQyxZQURRLGtCQUNEQyxDQURDLEVBQ0U7QUFDUixhQUFLSCxhQUFMLEdBQ0VHLEVBQUVDLE1BQUYsQ0FBU0MsT0FBVCxHQUFtQixDQUFuQixLQUF5QixLQUFLUCxLQUFMLENBQVdRLE1BQXBDLEdBQTZDLENBQTdDLEdBQWlESCxFQUFFQyxNQUFGLENBQVNDLE9BQVQsR0FBbUIsQ0FEdEU7QUFFQUUsZ0JBQVFDLEdBQVIsQ0FBWSxLQUFLUixhQUFqQjtBQUNELE9BTE87QUFNUlMsYUFOUSxxQkFNRTtBQUNSQyxXQUFHQyxVQUFILENBQWM7QUFDWkMsZUFBSztBQURPLFNBQWQ7QUFHRCxPQVZPO0FBV1JDLGNBWFEsc0JBV0c7QUFDVEgsV0FBR0MsVUFBSCxDQUFjO0FBQ1pDLGVBQUs7QUFETyxTQUFkO0FBR0Q7QUFmTyxLOzs7Ozs2QkFpQkQ7QUFBQTs7QUFDUEYsU0FBR0ksYUFBSCxDQUFpQjtBQUNmQyxpQkFBUyxzQkFBTztBQUNkLGlCQUFLbEIsTUFBTCxHQUFjbUIsSUFBSUMsZUFBbEI7QUFDQSxpQkFBS0MsVUFBTCxDQUFnQixpQkFBaEIsRUFBbUM7QUFDakNyQixvQkFBUSxPQUFLQSxNQURvQjtBQUVqQ3NCLGtCQUFNO0FBRjJCLFdBQW5DO0FBSUQ7QUFQYyxPQUFqQjtBQVNEOzs7O0VBekNpQ0MsZUFBS0MsSTs7a0JBQXBCaEMsTSIsImZpbGUiOiJkb29yc0RldGFpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qIGdsb2JhbCB3eCAqL1xuaW1wb3J0IHdlcHkgZnJvbSBcIndlcHlcIjtcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSBcIi4uLy4uL21peGlucy9wYWdlXCI7XG5pbXBvcnQgaGVhZGVyIGZyb20gXCIuLi8uLi9jb21wb25lbnRzL2hlYWRlcnNcIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvdXJzZSBleHRlbmRzIHdlcHkucGFnZSB7XG4gIG1peGlucyA9IFtQYWdlTWl4aW5dO1xuICBjb25maWcgPSB7XG4gICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcbiAgfTtcbiAgY29tcG9uZW50cyA9IHtcbiAgICBoZWFkZXJcbiAgfTtcbiAgZGF0YSA9IHtcbiAgICBoZWlnaHQ6IFwiXCIsXG4gICAgZGF0YXM6IFsxLCAyLCAzLCA0XSxcbiAgICBjdXJyZW50SW5kZXg6IDAsXG4gICAgY3VycmVudEluZGV4MjogMVxuICB9O1xuICBtZXRob2RzID0ge1xuICAgIGNoYW5nZShlKSB7XG4gICAgICB0aGlzLmN1cnJlbnRJbmRleDIgPVxuICAgICAgICBlLmRldGFpbC5jdXJyZW50ICsgMSA9PT0gdGhpcy5kYXRhcy5sZW5ndGggPyAwIDogZS5kZXRhaWwuY3VycmVudCArIDE7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRJbmRleDIpO1xuICAgIH0sXG4gICAgYnV5RmVhdCgpIHtcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICB1cmw6IFwiL3BhZ2VzL2Rvb3JzL2ZlYXREZXRhaWxzXCJcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgYnV5Q29yc2UoKSB7XG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgdXJsOiBcIi9wYWdlcy9kb29ycy9jb3JzZURldGFpbHNcIlxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICBvblNob3coKSB7XG4gICAgd3guZ2V0U3lzdGVtSW5mbyh7XG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICB0aGlzLmhlaWdodCA9IHJlcy5zdGF0dXNCYXJIZWlnaHQ7XG4gICAgICAgIHRoaXMuJGJyb2FkY2FzdChcImluZGV4LWJyb2FkY2FzdFwiLCB7XG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgICAgICB0ZXh0OiBcIk9uZUZpdOWBpei6q1wiXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=