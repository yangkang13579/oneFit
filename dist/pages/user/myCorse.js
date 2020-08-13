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
      value: null,
      months: [],
      items: {},
      userInfo: {}
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
      this.fetchDataPromise("user/userInfo.json", { action: "stat" }).then(function (data) {
        wx.getStorage({
          key: "userInfo",
          success: function success(res) {
            that.userInfo = JSON.parse(res.data);
            that.$apply();
          }
        });
        that.items = data;
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

      this.months = [];
      for (var i = 1; i <= 12; i++) {
        this.months.push(i);
      }
      wx.getSystemInfo({
        success: function success(res) {
          _this2.height = res.statusBarHeight;
          _this2.$broadcast("index-broadcast", {
            height: _this2.height,
            text: "我的课程"
          });
        }
      });
    }
  }]);

  return Course;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Course , 'pages/user/myCorse'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm15Q29yc2UuanMiXSwibmFtZXMiOlsiQ291cnNlIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsImNvbXBvbmVudHMiLCJoZWFkZXIiLCJkYXRhIiwiaGVpZ2h0IiwidmFsdWUiLCJtb250aHMiLCJpdGVtcyIsInVzZXJJbmZvIiwibWV0aG9kcyIsImdvQmFjayIsInd4IiwibmF2aWdhdGVCYWNrIiwidGhhdCIsImZldGNoRGF0YVByb21pc2UiLCJhY3Rpb24iLCJ0aGVuIiwiZ2V0U3RvcmFnZSIsImtleSIsInN1Y2Nlc3MiLCJyZXMiLCJKU09OIiwicGFyc2UiLCIkYXBwbHkiLCJnZXRVc2VySW5mbyIsImkiLCJwdXNoIiwiZ2V0U3lzdGVtSW5mbyIsInN0YXR1c0JhckhlaWdodCIsIiRicm9hZGNhc3QiLCJ0ZXh0Iiwid2VweSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7OztBQUhBOzs7SUFJcUJBLE07Ozs7Ozs7Ozs7Ozs7O3NMQUNuQkMsTSxHQUFTLENBQUNDLGNBQUQsQyxRQUNUQyxNLEdBQVM7QUFDUEMsb0NBQThCO0FBRHZCLEssUUFHVEMsVSxHQUFhO0FBQ1hDO0FBRFcsSyxRQUdiQyxJLEdBQU87QUFDTEMsY0FBUSxFQURIO0FBRUxDLGFBQU8sSUFGRjtBQUdMQyxjQUFRLEVBSEg7QUFJTEMsYUFBTyxFQUpGO0FBS0xDLGdCQUFVO0FBTEwsSyxRQU9QQyxPLEdBQVU7QUFDUkMsWUFEUSxvQkFDQztBQUNQQyxXQUFHQyxZQUFIO0FBQ0Q7QUFITyxLOzs7OztrQ0FLSTtBQUNaLFVBQUlDLE9BQU8sSUFBWDtBQUNBLFdBQUtDLGdCQUFMLENBQXNCLG9CQUF0QixFQUE0QyxFQUFFQyxRQUFRLE1BQVYsRUFBNUMsRUFBZ0VDLElBQWhFLENBQ0UsZ0JBQVE7QUFDTkwsV0FBR00sVUFBSCxDQUFjO0FBQ1pDLGVBQUssVUFETztBQUVaQyxpQkFGWSxtQkFFSkMsR0FGSSxFQUVDO0FBQ1hQLGlCQUFLTCxRQUFMLEdBQWdCYSxLQUFLQyxLQUFMLENBQVdGLElBQUlqQixJQUFmLENBQWhCO0FBQ0FVLGlCQUFLVSxNQUFMO0FBQ0Q7QUFMVyxTQUFkO0FBT0FWLGFBQUtOLEtBQUwsR0FBYUosSUFBYjtBQUNBVSxhQUFLVSxNQUFMO0FBQ0QsT0FYSDtBQWFEOzs7dUNBQ2tCO0FBQ2pCLFdBQUtDLFdBQUw7QUFDRDs7OzZCQUNRO0FBQUE7O0FBQ1AsV0FBS2xCLE1BQUwsR0FBYyxFQUFkO0FBQ0EsV0FBSyxJQUFJbUIsSUFBSSxDQUFiLEVBQWdCQSxLQUFLLEVBQXJCLEVBQXlCQSxHQUF6QixFQUE4QjtBQUM1QixhQUFLbkIsTUFBTCxDQUFZb0IsSUFBWixDQUFpQkQsQ0FBakI7QUFDRDtBQUNEZCxTQUFHZ0IsYUFBSCxDQUFpQjtBQUNmUixpQkFBUyxzQkFBTztBQUNkLGlCQUFLZixNQUFMLEdBQWNnQixJQUFJUSxlQUFsQjtBQUNBLGlCQUFLQyxVQUFMLENBQWdCLGlCQUFoQixFQUFtQztBQUNqQ3pCLG9CQUFRLE9BQUtBLE1BRG9CO0FBRWpDMEIsa0JBQU07QUFGMkIsV0FBbkM7QUFJRDtBQVBjLE9BQWpCO0FBU0Q7Ozs7RUFyRGlDQyxlQUFLQyxJOztrQkFBcEJwQyxNIiwiZmlsZSI6Im15Q29yc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qIGdsb2JhbCB3eCAqL1xuaW1wb3J0IHdlcHkgZnJvbSBcIndlcHlcIjtcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSBcIi4uLy4uL21peGlucy9wYWdlXCI7XG5pbXBvcnQgaGVhZGVyIGZyb20gXCIuLi8uLi9jb21wb25lbnRzL2hlYWRlcnNcIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvdXJzZSBleHRlbmRzIHdlcHkucGFnZSB7XG4gIG1peGlucyA9IFtQYWdlTWl4aW5dO1xuICBjb25maWcgPSB7XG4gICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcbiAgfTtcbiAgY29tcG9uZW50cyA9IHtcbiAgICBoZWFkZXJcbiAgfTtcbiAgZGF0YSA9IHtcbiAgICBoZWlnaHQ6IFwiXCIsXG4gICAgdmFsdWU6IG51bGwsXG4gICAgbW9udGhzOiBbXSxcbiAgICBpdGVtczoge30sXG4gICAgdXNlckluZm86IHt9XG4gIH07XG4gIG1ldGhvZHMgPSB7XG4gICAgZ29CYWNrKCkge1xuICAgICAgd3gubmF2aWdhdGVCYWNrKCk7XG4gICAgfVxuICB9O1xuICBnZXRVc2VySW5mbygpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKFwidXNlci91c2VySW5mby5qc29uXCIsIHsgYWN0aW9uOiBcInN0YXRcIiB9KS50aGVuKFxuICAgICAgZGF0YSA9PiB7XG4gICAgICAgIHd4LmdldFN0b3JhZ2Uoe1xuICAgICAgICAgIGtleTogXCJ1c2VySW5mb1wiLFxuICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XG4gICAgICAgICAgICB0aGF0LnVzZXJJbmZvID0gSlNPTi5wYXJzZShyZXMuZGF0YSk7XG4gICAgICAgICAgICB0aGF0LiRhcHBseSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoYXQuaXRlbXMgPSBkYXRhO1xuICAgICAgICB0aGF0LiRhcHBseSgpO1xuICAgICAgfVxuICAgICk7XG4gIH1cbiAgd2hlbkFwcFJlYWR5U2hvdygpIHtcbiAgICB0aGlzLmdldFVzZXJJbmZvKCk7XG4gIH1cbiAgb25TaG93KCkge1xuICAgIHRoaXMubW9udGhzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMTI7IGkrKykge1xuICAgICAgdGhpcy5tb250aHMucHVzaChpKTtcbiAgICB9XG4gICAgd3guZ2V0U3lzdGVtSW5mbyh7XG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICB0aGlzLmhlaWdodCA9IHJlcy5zdGF0dXNCYXJIZWlnaHQ7XG4gICAgICAgIHRoaXMuJGJyb2FkY2FzdChcImluZGV4LWJyb2FkY2FzdFwiLCB7XG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgICAgICB0ZXh0OiBcIuaIkeeahOivvueoi1wiXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=