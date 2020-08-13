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
      images: []
    }, _this.methods = {}, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Course, [{
    key: "getUserInfo",
    value: function getUserInfo() {
      var that = this;
      this.fetchDataPromise("user/userInfo.json", { action: "images" }).then(function (data) {
        that.images = data.images;
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
            text: "我的成长之路"
          });
        }
      });
    }
  }]);

  return Course;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Course , 'pages/user/myGroup'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm15R3JvdXAuanMiXSwibmFtZXMiOlsiQ291cnNlIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsImNvbXBvbmVudHMiLCJoZWFkZXIiLCJkYXRhIiwiaGVpZ2h0IiwidGV4dCIsImltYWdlcyIsIm1ldGhvZHMiLCJ0aGF0IiwiZmV0Y2hEYXRhUHJvbWlzZSIsImFjdGlvbiIsInRoZW4iLCIkYXBwbHkiLCJnZXRVc2VySW5mbyIsInd4IiwiZ2V0U3lzdGVtSW5mbyIsInN1Y2Nlc3MiLCJyZXMiLCJzdGF0dXNCYXJIZWlnaHQiLCIkYnJvYWRjYXN0Iiwid2VweSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7OztBQUhBOzs7SUFJcUJBLE07Ozs7Ozs7Ozs7Ozs7O3NMQUNuQkMsTSxHQUFTLENBQUNDLGNBQUQsQyxRQUNUQyxNLEdBQVM7QUFDUEMsb0NBQThCO0FBRHZCLEssUUFHVEMsVSxHQUFhO0FBQ1hDO0FBRFcsSyxRQUdiQyxJLEdBQU87QUFDTEMsY0FBUSxFQURIO0FBRUxDLFlBQU0sRUFGRDtBQUdMQyxjQUFRO0FBSEgsSyxRQUtQQyxPLEdBQVUsRTs7Ozs7a0NBQ0k7QUFDWixVQUFJQyxPQUFPLElBQVg7QUFDQSxXQUFLQyxnQkFBTCxDQUFzQixvQkFBdEIsRUFBNEMsRUFBRUMsUUFBUSxRQUFWLEVBQTVDLEVBQWtFQyxJQUFsRSxDQUNFLFVBQVNSLElBQVQsRUFBZTtBQUNiSyxhQUFLRixNQUFMLEdBQWNILEtBQUtHLE1BQW5CO0FBQ0FFLGFBQUtJLE1BQUw7QUFDRCxPQUpIO0FBTUQ7Ozt1Q0FDa0I7QUFDakIsV0FBS0MsV0FBTDtBQUNEOzs7NkJBQ1E7QUFBQTs7QUFDUEMsU0FBR0MsYUFBSCxDQUFpQjtBQUNmQyxpQkFBUyxzQkFBTztBQUNkLGlCQUFLWixNQUFMLEdBQWNhLElBQUlDLGVBQWxCO0FBQ0EsaUJBQUtDLFVBQUwsQ0FBZ0IsaUJBQWhCLEVBQW1DO0FBQ2pDZixvQkFBUSxPQUFLQSxNQURvQjtBQUVqQ0Msa0JBQU07QUFGMkIsV0FBbkM7QUFJRDtBQVBjLE9BQWpCO0FBU0Q7Ozs7RUFwQ2lDZSxlQUFLQyxJOztrQkFBcEJ6QixNIiwiZmlsZSI6Im15R3JvdXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qIGdsb2JhbCB3eCAqL1xuaW1wb3J0IHdlcHkgZnJvbSBcIndlcHlcIjtcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSBcIi4uLy4uL21peGlucy9wYWdlXCI7XG5pbXBvcnQgaGVhZGVyIGZyb20gXCIuLi8uLi9jb21wb25lbnRzL2hlYWRlcnNcIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvdXJzZSBleHRlbmRzIHdlcHkucGFnZSB7XG4gIG1peGlucyA9IFtQYWdlTWl4aW5dO1xuICBjb25maWcgPSB7XG4gICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcbiAgfTtcbiAgY29tcG9uZW50cyA9IHtcbiAgICBoZWFkZXJcbiAgfTtcbiAgZGF0YSA9IHtcbiAgICBoZWlnaHQ6IFwiXCIsXG4gICAgdGV4dDogXCJcIixcbiAgICBpbWFnZXM6IFtdXG4gIH07XG4gIG1ldGhvZHMgPSB7fTtcbiAgZ2V0VXNlckluZm8oKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShcInVzZXIvdXNlckluZm8uanNvblwiLCB7IGFjdGlvbjogXCJpbWFnZXNcIiB9KS50aGVuKFxuICAgICAgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB0aGF0LmltYWdlcyA9IGRhdGEuaW1hZ2VzO1xuICAgICAgICB0aGF0LiRhcHBseSgpO1xuICAgICAgfVxuICAgICk7XG4gIH1cbiAgd2hlbkFwcFJlYWR5U2hvdygpIHtcbiAgICB0aGlzLmdldFVzZXJJbmZvKCk7XG4gIH1cbiAgb25TaG93KCkge1xuICAgIHd4LmdldFN5c3RlbUluZm8oe1xuICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSByZXMuc3RhdHVzQmFySGVpZ2h0O1xuICAgICAgICB0aGlzLiRicm9hZGNhc3QoXCJpbmRleC1icm9hZGNhc3RcIiwge1xuICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICAgICAgdGV4dDogXCLmiJHnmoTmiJDplb/kuYvot69cIlxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19