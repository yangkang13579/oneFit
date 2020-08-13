"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _page = require('./../mixins/page.js');

var _page2 = _interopRequireDefault(_page);

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
    }, _this.components = {}, _this.data = {
      loadUser: true // 需要登录信息
    }, _this.methods = {}, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Course, [{
    key: "getUserInfo",
    value: function getUserInfo(callBack) {
      var that = this;
      this.fetchDataPromise("user/userInfo.json", {}).then(function (data) {
        wx.setStorage({
          key: "userInfo",
          data: JSON.stringify(data)
        });
        setTimeout(function () {
          if (data.isCoach) {
            wx.switchTab({
              url: "/pages/doors/doors"
            });
          } else {
            wx.switchTab({
              url: "/pages/home/home1"
            });
          }
        }, 1000);
      });
    }
  }, {
    key: "whenAppReadyShow",
    value: function whenAppReadyShow() {
      this.getUserInfo();
    }
  }]);

  return Course;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(Course , 'pages/loading'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvYWRpbmcuanMiXSwibmFtZXMiOlsiQ291cnNlIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsImNvbXBvbmVudHMiLCJkYXRhIiwibG9hZFVzZXIiLCJtZXRob2RzIiwiY2FsbEJhY2siLCJ0aGF0IiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRoZW4iLCJ3eCIsInNldFN0b3JhZ2UiLCJrZXkiLCJKU09OIiwic3RyaW5naWZ5Iiwic2V0VGltZW91dCIsImlzQ29hY2giLCJzd2l0Y2hUYWIiLCJ1cmwiLCJnZXRVc2VySW5mbyIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBRkE7OztJQUdxQkEsTTs7Ozs7Ozs7Ozs7Ozs7c0xBQ25CQyxNLEdBQVMsQ0FBQ0MsY0FBRCxDLFFBQ1RDLE0sR0FBUztBQUNQQyxvQ0FBOEI7QUFEdkIsSyxRQUdUQyxVLEdBQWEsRSxRQUNiQyxJLEdBQU87QUFDTEMsZ0JBQVUsSUFETCxDQUNVO0FBRFYsSyxRQXVCUEMsTyxHQUFVLEU7Ozs7O2dDQXBCRUMsUSxFQUFVO0FBQ3BCLFVBQUlDLE9BQU8sSUFBWDtBQUNBLFdBQUtDLGdCQUFMLENBQXNCLG9CQUF0QixFQUE0QyxFQUE1QyxFQUFnREMsSUFBaEQsQ0FBcUQsVUFBU04sSUFBVCxFQUFlO0FBQ2xFTyxXQUFHQyxVQUFILENBQWM7QUFDWkMsZUFBSyxVQURPO0FBRVpULGdCQUFNVSxLQUFLQyxTQUFMLENBQWVYLElBQWY7QUFGTSxTQUFkO0FBSUFZLG1CQUFXLFlBQU07QUFDZixjQUFJWixLQUFLYSxPQUFULEVBQWtCO0FBQ2hCTixlQUFHTyxTQUFILENBQWE7QUFDWEMsbUJBQUs7QUFETSxhQUFiO0FBR0QsV0FKRCxNQUlPO0FBQ0xSLGVBQUdPLFNBQUgsQ0FBYTtBQUNYQyxtQkFBSztBQURNLGFBQWI7QUFHRDtBQUNGLFNBVkQsRUFVRyxJQVZIO0FBV0QsT0FoQkQ7QUFpQkQ7Ozt1Q0FFa0I7QUFDakIsV0FBS0MsV0FBTDtBQUNEOzs7O0VBaENpQ0MsZUFBS0MsSTs7a0JBQXBCeEIsTSIsImZpbGUiOiJsb2FkaW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKiBnbG9iYWwgd3ggKi9cbmltcG9ydCB3ZXB5IGZyb20gXCJ3ZXB5XCI7XG5pbXBvcnQgUGFnZU1peGluIGZyb20gXCIuLi9taXhpbnMvcGFnZVwiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ291cnNlIGV4dGVuZHMgd2VweS5wYWdlIHtcbiAgbWl4aW5zID0gW1BhZ2VNaXhpbl07XG4gIGNvbmZpZyA9IHtcbiAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIlxuICB9O1xuICBjb21wb25lbnRzID0ge307XG4gIGRhdGEgPSB7XG4gICAgbG9hZFVzZXI6IHRydWUgLy8g6ZyA6KaB55m75b2V5L+h5oGvXG4gIH07XG4gIGdldFVzZXJJbmZvKGNhbGxCYWNrKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShcInVzZXIvdXNlckluZm8uanNvblwiLCB7fSkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICB3eC5zZXRTdG9yYWdlKHtcbiAgICAgICAga2V5OiBcInVzZXJJbmZvXCIsXG4gICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGRhdGEpXG4gICAgICB9KTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAoZGF0YS5pc0NvYWNoKSB7XG4gICAgICAgICAgd3guc3dpdGNoVGFiKHtcbiAgICAgICAgICAgIHVybDogXCIvcGFnZXMvZG9vcnMvZG9vcnNcIlxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHd4LnN3aXRjaFRhYih7XG4gICAgICAgICAgICB1cmw6IFwiL3BhZ2VzL2hvbWUvaG9tZTFcIlxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LCAxMDAwKTtcbiAgICB9KTtcbiAgfVxuICBtZXRob2RzID0ge307XG4gIHdoZW5BcHBSZWFkeVNob3coKSB7XG4gICAgdGhpcy5nZXRVc2VySW5mbygpO1xuICB9XG59XG4iXX0=