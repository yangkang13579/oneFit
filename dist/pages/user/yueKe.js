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
      list: []
    }, _this.methods = {
      details: function details(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
          url: "/pages/user/yuekeNext?id=" + id
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Course, [{
    key: "whenAppReadyShow",
    value: function whenAppReadyShow() {
      var that = this;
      this.fetchDataPromise("page/coach.json", {
        action: "userReserve"
      }).then(function (data) {
        that.list = data.items;
        that.$apply();
      });
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
            text: "我的约课"
          });
        }
      });
    }
  }]);

  return Course;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Course , 'pages/user/yueKe'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInl1ZUtlLmpzIl0sIm5hbWVzIjpbIkNvdXJzZSIsIm1peGlucyIsIlBhZ2VNaXhpbiIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJjb21wb25lbnRzIiwiaGVhZGVyIiwiZGF0YSIsImN1cnJlbnRJbmRleCIsImhlaWdodCIsImxpc3QiLCJtZXRob2RzIiwiZGV0YWlscyIsImUiLCJpZCIsImN1cnJlbnRUYXJnZXQiLCJkYXRhc2V0Iiwid3giLCJuYXZpZ2F0ZVRvIiwidXJsIiwidGhhdCIsImZldGNoRGF0YVByb21pc2UiLCJhY3Rpb24iLCJ0aGVuIiwiaXRlbXMiLCIkYXBwbHkiLCJnZXRTeXN0ZW1JbmZvIiwic3VjY2VzcyIsInJlcyIsInN0YXR1c0JhckhlaWdodCIsIiRicm9hZGNhc3QiLCJ0ZXh0Iiwid2VweSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7OztBQUhBOzs7SUFJcUJBLE07Ozs7Ozs7Ozs7Ozs7O3NMQUNuQkMsTSxHQUFTLENBQUNDLGNBQUQsQyxRQUNUQyxNLEdBQVM7QUFDUEMsb0NBQThCO0FBRHZCLEssUUFHVEMsVSxHQUFhO0FBQ1hDO0FBRFcsSyxRQUdiQyxJLEdBQU87QUFDTEMsb0JBQWMsSUFEVDtBQUVMQyxjQUFRLElBRkg7QUFHTEMsWUFBTTtBQUhELEssUUFLUEMsTyxHQUFVO0FBQ1JDLGFBRFEsbUJBQ0FDLENBREEsRUFDRztBQUNULFlBQU1DLEtBQUtELEVBQUVFLGFBQUYsQ0FBZ0JDLE9BQWhCLENBQXdCRixFQUFuQztBQUNBRyxXQUFHQyxVQUFILENBQWM7QUFDWkMsZUFBSyw4QkFBOEJMO0FBRHZCLFNBQWQ7QUFHRDtBQU5PLEs7Ozs7O3VDQVFTO0FBQ2pCLFVBQUlNLE9BQU8sSUFBWDtBQUNBLFdBQUtDLGdCQUFMLENBQXNCLGlCQUF0QixFQUF5QztBQUN2Q0MsZ0JBQVE7QUFEK0IsT0FBekMsRUFFR0MsSUFGSCxDQUVRLFVBQVNoQixJQUFULEVBQWU7QUFDckJhLGFBQUtWLElBQUwsR0FBWUgsS0FBS2lCLEtBQWpCO0FBQ0FKLGFBQUtLLE1BQUw7QUFDRCxPQUxEO0FBTUQ7Ozs2QkFDUTtBQUFBOztBQUNQUixTQUFHUyxhQUFILENBQWlCO0FBQ2ZDLGlCQUFTLHNCQUFPO0FBQ2QsaUJBQUtsQixNQUFMLEdBQWNtQixJQUFJQyxlQUFsQjtBQUNBLGlCQUFLQyxVQUFMLENBQWdCLGlCQUFoQixFQUFtQztBQUNqQ3JCLG9CQUFRLE9BQUtBLE1BRG9CO0FBRWpDc0Isa0JBQU07QUFGMkIsV0FBbkM7QUFJRDtBQVBjLE9BQWpCO0FBU0Q7Ozs7RUF4Q2lDQyxlQUFLQyxJOztrQkFBcEJqQyxNIiwiZmlsZSI6Inl1ZUtlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKiBnbG9iYWwgd3ggKi9cbmltcG9ydCB3ZXB5IGZyb20gXCJ3ZXB5XCI7XG5pbXBvcnQgUGFnZU1peGluIGZyb20gXCIuLi8uLi9taXhpbnMvcGFnZVwiO1xuaW1wb3J0IGhlYWRlciBmcm9tIFwiLi4vLi4vY29tcG9uZW50cy9oZWFkZXJzXCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3Vyc2UgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xuICBtaXhpbnMgPSBbUGFnZU1peGluXTtcbiAgY29uZmlnID0ge1xuICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZlwiXG4gIH07XG4gIGNvbXBvbmVudHMgPSB7XG4gICAgaGVhZGVyXG4gIH07XG4gIGRhdGEgPSB7XG4gICAgY3VycmVudEluZGV4OiBudWxsLFxuICAgIGhlaWdodDogbnVsbCxcbiAgICBsaXN0OiBbXVxuICB9O1xuICBtZXRob2RzID0ge1xuICAgIGRldGFpbHMoZSkge1xuICAgICAgY29uc3QgaWQgPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pZDtcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICB1cmw6IFwiL3BhZ2VzL3VzZXIveXVla2VOZXh0P2lkPVwiICsgaWRcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbiAgd2hlbkFwcFJlYWR5U2hvdygpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKFwicGFnZS9jb2FjaC5qc29uXCIsIHtcbiAgICAgIGFjdGlvbjogXCJ1c2VyUmVzZXJ2ZVwiXG4gICAgfSkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICB0aGF0Lmxpc3QgPSBkYXRhLml0ZW1zO1xuICAgICAgdGhhdC4kYXBwbHkoKTtcbiAgICB9KTtcbiAgfVxuICBvblNob3coKSB7XG4gICAgd3guZ2V0U3lzdGVtSW5mbyh7XG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICB0aGlzLmhlaWdodCA9IHJlcy5zdGF0dXNCYXJIZWlnaHQ7XG4gICAgICAgIHRoaXMuJGJyb2FkY2FzdChcImluZGV4LWJyb2FkY2FzdFwiLCB7XG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgICAgICB0ZXh0OiBcIuaIkeeahOe6puivvlwiXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=