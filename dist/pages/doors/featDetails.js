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

var _common = require('./../../components/common.js');

var _common2 = _interopRequireDefault(_common);

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
      header: _headers2.default,
      common: _common2.default
    }, _this.data = {
      height: "",
      datas: [1, 2, 3, 4],
      details: null,
      coachId: null,
      branchId: null
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
      this.coachId = options.coachId;
    }
  }, {
    key: "whenAppReadyShow",
    value: function whenAppReadyShow() {
      var _this2 = this;

      var that = this;
      this.fetchDataPromise("page/branch.json", {
        action: "coach",
        branchId: this.branchId,
        coachId: this.coachId
      }).then(function (data) {
        _this2.details = data;
        wx.getStorage({
          key: "userInfo",
          success: function success(res) {
            that.$broadcast("index-broadcast", {
              coachInfo: data,
              user: JSON.parse(res.data)
            });
          }
        });
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


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Course , 'pages/doors/featDetails'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZlYXREZXRhaWxzLmpzIl0sIm5hbWVzIjpbIkNvdXJzZSIsIm1peGlucyIsIlBhZ2VNaXhpbiIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJjb21wb25lbnRzIiwiaGVhZGVyIiwiY29tbW9uIiwiZGF0YSIsImhlaWdodCIsImRhdGFzIiwiZGV0YWlscyIsImNvYWNoSWQiLCJicmFuY2hJZCIsIm1ldGhvZHMiLCJidXkiLCJ3eCIsIm5hdmlnYXRlVG8iLCJ1cmwiLCJvcHRpb25zIiwidGhhdCIsImZldGNoRGF0YVByb21pc2UiLCJhY3Rpb24iLCJ0aGVuIiwiZ2V0U3RvcmFnZSIsImtleSIsInN1Y2Nlc3MiLCJyZXMiLCIkYnJvYWRjYXN0IiwiY29hY2hJbmZvIiwidXNlciIsIkpTT04iLCJwYXJzZSIsIiRhcHBseSIsImdldFN5c3RlbUluZm8iLCJzdGF0dXNCYXJIZWlnaHQiLCJ0ZXh0Iiwid2VweSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBSkE7OztJQUtxQkEsTTs7Ozs7Ozs7Ozs7Ozs7c0xBQ25CQyxNLEdBQVMsQ0FBQ0MsY0FBRCxDLFFBQ1RDLE0sR0FBUztBQUNQQyxvQ0FBOEI7QUFEdkIsSyxRQUdUQyxVLEdBQWE7QUFDWEMsK0JBRFc7QUFFWEM7QUFGVyxLLFFBSWJDLEksR0FBTztBQUNMQyxjQUFRLEVBREg7QUFFTEMsYUFBTyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsQ0FGRjtBQUdMQyxlQUFTLElBSEo7QUFJTEMsZUFBUyxJQUpKO0FBS0xDLGdCQUFVO0FBTEwsSyxRQVdQQyxPLEdBQVU7QUFDUkMsU0FEUSxpQkFDRjtBQUNKQyxXQUFHQyxVQUFILENBQWM7QUFDWkMsZUFBSyw4QkFBOEIsS0FBS0w7QUFENUIsU0FBZDtBQUdEO0FBTE8sSzs7Ozs7MkJBSkhNLE8sRUFBUztBQUNkLFdBQUtOLFFBQUwsR0FBZ0JNLFFBQVFOLFFBQXhCO0FBQ0EsV0FBS0QsT0FBTCxHQUFlTyxRQUFRUCxPQUF2QjtBQUNEOzs7dUNBUWtCO0FBQUE7O0FBQ2pCLFVBQUlRLE9BQU8sSUFBWDtBQUNBLFdBQUtDLGdCQUFMLENBQXNCLGtCQUF0QixFQUEwQztBQUN4Q0MsZ0JBQVEsT0FEZ0M7QUFFeENULGtCQUFVLEtBQUtBLFFBRnlCO0FBR3hDRCxpQkFBUyxLQUFLQTtBQUgwQixPQUExQyxFQUlHVyxJQUpILENBSVEsZ0JBQVE7QUFDZCxlQUFLWixPQUFMLEdBQWVILElBQWY7QUFDQVEsV0FBR1EsVUFBSCxDQUFjO0FBQ1pDLGVBQUssVUFETztBQUVaQyxpQkFGWSxtQkFFSkMsR0FGSSxFQUVDO0FBQ1hQLGlCQUFLUSxVQUFMLENBQWdCLGlCQUFoQixFQUFtQztBQUNqQ0MseUJBQVdyQixJQURzQjtBQUVqQ3NCLG9CQUFNQyxLQUFLQyxLQUFMLENBQVdMLElBQUluQixJQUFmO0FBRjJCLGFBQW5DO0FBSUQ7QUFQVyxTQUFkO0FBU0EsZUFBS3lCLE1BQUw7QUFDRCxPQWhCRDtBQWlCRDs7OzZCQUNRO0FBQUE7O0FBQ1BqQixTQUFHa0IsYUFBSCxDQUFpQjtBQUNmUixpQkFBUyxzQkFBTztBQUNkLGlCQUFLakIsTUFBTCxHQUFja0IsSUFBSVEsZUFBbEI7QUFDQSxpQkFBS1AsVUFBTCxDQUFnQixpQkFBaEIsRUFBbUM7QUFDakNuQixvQkFBUSxPQUFLQSxNQURvQjtBQUVqQzJCLGtCQUFNO0FBRjJCLFdBQW5DO0FBSUQ7QUFQYyxPQUFqQjtBQVNEOzs7O0VBekRpQ0MsZUFBS0MsSTs7a0JBQXBCdEMsTSIsImZpbGUiOiJmZWF0RGV0YWlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyogZ2xvYmFsIHd4ICovXG5pbXBvcnQgd2VweSBmcm9tIFwid2VweVwiO1xuaW1wb3J0IFBhZ2VNaXhpbiBmcm9tIFwiLi4vLi4vbWl4aW5zL3BhZ2VcIjtcbmltcG9ydCBoZWFkZXIgZnJvbSBcIi4uLy4uL2NvbXBvbmVudHMvaGVhZGVyc1wiO1xuaW1wb3J0IGNvbW1vbiBmcm9tIFwiLi4vLi4vY29tcG9uZW50cy9jb21tb25cIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvdXJzZSBleHRlbmRzIHdlcHkucGFnZSB7XG4gIG1peGlucyA9IFtQYWdlTWl4aW5dO1xuICBjb25maWcgPSB7XG4gICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcbiAgfTtcbiAgY29tcG9uZW50cyA9IHtcbiAgICBoZWFkZXIsXG4gICAgY29tbW9uXG4gIH07XG4gIGRhdGEgPSB7XG4gICAgaGVpZ2h0OiBcIlwiLFxuICAgIGRhdGFzOiBbMSwgMiwgMywgNF0sXG4gICAgZGV0YWlsczogbnVsbCxcbiAgICBjb2FjaElkOiBudWxsLFxuICAgIGJyYW5jaElkOiBudWxsXG4gIH07XG4gIG9uTG9hZChvcHRpb25zKSB7XG4gICAgdGhpcy5icmFuY2hJZCA9IG9wdGlvbnMuYnJhbmNoSWQ7XG4gICAgdGhpcy5jb2FjaElkID0gb3B0aW9ucy5jb2FjaElkO1xuICB9XG4gIG1ldGhvZHMgPSB7XG4gICAgYnV5KCkge1xuICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgIHVybDogXCIvcGFnZXMvaG9tZS9idXk/YnJhbmNoSWQ9XCIgKyB0aGlzLmJyYW5jaElkXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gIHdoZW5BcHBSZWFkeVNob3coKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShcInBhZ2UvYnJhbmNoLmpzb25cIiwge1xuICAgICAgYWN0aW9uOiBcImNvYWNoXCIsXG4gICAgICBicmFuY2hJZDogdGhpcy5icmFuY2hJZCxcbiAgICAgIGNvYWNoSWQ6IHRoaXMuY29hY2hJZFxuICAgIH0pLnRoZW4oZGF0YSA9PiB7XG4gICAgICB0aGlzLmRldGFpbHMgPSBkYXRhO1xuICAgICAgd3guZ2V0U3RvcmFnZSh7XG4gICAgICAgIGtleTogXCJ1c2VySW5mb1wiLFxuICAgICAgICBzdWNjZXNzKHJlcykge1xuICAgICAgICAgIHRoYXQuJGJyb2FkY2FzdChcImluZGV4LWJyb2FkY2FzdFwiLCB7XG4gICAgICAgICAgICBjb2FjaEluZm86IGRhdGEsXG4gICAgICAgICAgICB1c2VyOiBKU09OLnBhcnNlKHJlcy5kYXRhKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuJGFwcGx5KCk7XG4gICAgfSk7XG4gIH1cbiAgb25TaG93KCkge1xuICAgIHd4LmdldFN5c3RlbUluZm8oe1xuICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSByZXMuc3RhdHVzQmFySGVpZ2h0O1xuICAgICAgICB0aGlzLiRicm9hZGNhc3QoXCJpbmRleC1icm9hZGNhc3RcIiwge1xuICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICAgICAgdGV4dDogXCJPbmVGaXTlgaXouqtcIlxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19