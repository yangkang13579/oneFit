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
      height: "",
      branchId: null,
      list: {},
      cardId: null
    }, _this.methods = {
      currentFun: function currentFun(e) {
        this.currentIndex = e.currentTarget.dataset.index;
      },
      next: function next() {
        wx.navigateTo({
          url: "/pages/home/buyMoney?cardId=" + this.cardId + "&branchId=" + this.branchId + "&coachId=" + this.list.items[this.currentIndex].id
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Course, [{
    key: "whenAppReadyShow",
    value: function whenAppReadyShow(options) {
      var _this2 = this;

      var that = this;
      this.fetchDataPromise("user/userFit.json", {
        action: "coachs",
        branchId: this.branchId
      }).then(function (data) {
        _this2.list = data;
        for (var i = 0; i < _this2.list.items.length; i++) {
          if (_this2.list.items[i].id === _this2.list.current.id) {
            _this2.currentIndex = i;
            _this2.coachId = _this2.list.items[i].id;
          }
        }
        _this2.$apply();
      });
    }
  }, {
    key: "onLoad",
    value: function onLoad(options) {
      console.log(options, "options");
      this.branchId = options.branchId;
      this.cardId = options.carId;
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


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Course , 'pages/home/buyNext'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1eU5leHQuanMiXSwibmFtZXMiOlsiQ291cnNlIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsImNvbXBvbmVudHMiLCJoZWFkZXIiLCJkYXRhIiwiY3VycmVudEluZGV4IiwiaGVpZ2h0IiwiYnJhbmNoSWQiLCJsaXN0IiwiY2FyZElkIiwibWV0aG9kcyIsImN1cnJlbnRGdW4iLCJlIiwiY3VycmVudFRhcmdldCIsImRhdGFzZXQiLCJpbmRleCIsIm5leHQiLCJ3eCIsIm5hdmlnYXRlVG8iLCJ1cmwiLCJpdGVtcyIsImlkIiwib3B0aW9ucyIsInRoYXQiLCJmZXRjaERhdGFQcm9taXNlIiwiYWN0aW9uIiwidGhlbiIsImkiLCJsZW5ndGgiLCJjdXJyZW50IiwiY29hY2hJZCIsIiRhcHBseSIsImNvbnNvbGUiLCJsb2ciLCJjYXJJZCIsImdldFN5c3RlbUluZm8iLCJzdWNjZXNzIiwicmVzIiwic3RhdHVzQmFySGVpZ2h0IiwiJGJyb2FkY2FzdCIsInRleHQiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBSEE7OztJQUlxQkEsTTs7Ozs7Ozs7Ozs7Ozs7c0xBQ25CQyxNLEdBQVMsQ0FBQ0MsY0FBRCxDLFFBQ1RDLE0sR0FBUztBQUNQQyxvQ0FBOEI7QUFEdkIsSyxRQUdUQyxVLEdBQWE7QUFDWEM7QUFEVyxLLFFBR2JDLEksR0FBTztBQUNMQyxvQkFBYyxJQURUO0FBRUxDLGNBQVEsRUFGSDtBQUdMQyxnQkFBVSxJQUhMO0FBSUxDLFlBQU0sRUFKRDtBQUtMQyxjQUFRO0FBTEgsSyxRQXVCUEMsTyxHQUFVO0FBQ1JDLGdCQURRLHNCQUNHQyxDQURILEVBQ007QUFDWixhQUFLUCxZQUFMLEdBQW9CTyxFQUFFQyxhQUFGLENBQWdCQyxPQUFoQixDQUF3QkMsS0FBNUM7QUFDRCxPQUhPO0FBSVJDLFVBSlEsa0JBSUQ7QUFDTEMsV0FBR0MsVUFBSCxDQUFjO0FBQ1pDLGVBQ0UsaUNBQ0EsS0FBS1YsTUFETCxHQUVBLFlBRkEsR0FHQSxLQUFLRixRQUhMLEdBSUEsV0FKQSxHQUtBLEtBQUtDLElBQUwsQ0FBVVksS0FBVixDQUFnQixLQUFLZixZQUFyQixFQUFtQ2dCO0FBUHpCLFNBQWQ7QUFTRDtBQWRPLEs7Ozs7O3FDQWhCT0MsTyxFQUFTO0FBQUE7O0FBQ3hCLFVBQUlDLE9BQU8sSUFBWDtBQUNBLFdBQUtDLGdCQUFMLENBQXNCLG1CQUF0QixFQUEyQztBQUN6Q0MsZ0JBQVEsUUFEaUM7QUFFekNsQixrQkFBVSxLQUFLQTtBQUYwQixPQUEzQyxFQUdHbUIsSUFISCxDQUdRLGdCQUFRO0FBQ2QsZUFBS2xCLElBQUwsR0FBWUosSUFBWjtBQUNBLGFBQUssSUFBSXVCLElBQUksQ0FBYixFQUFnQkEsSUFBSSxPQUFLbkIsSUFBTCxDQUFVWSxLQUFWLENBQWdCUSxNQUFwQyxFQUE0Q0QsR0FBNUMsRUFBaUQ7QUFDL0MsY0FBSSxPQUFLbkIsSUFBTCxDQUFVWSxLQUFWLENBQWdCTyxDQUFoQixFQUFtQk4sRUFBbkIsS0FBMEIsT0FBS2IsSUFBTCxDQUFVcUIsT0FBVixDQUFrQlIsRUFBaEQsRUFBb0Q7QUFDbEQsbUJBQUtoQixZQUFMLEdBQW9Cc0IsQ0FBcEI7QUFDQSxtQkFBS0csT0FBTCxHQUFlLE9BQUt0QixJQUFMLENBQVVZLEtBQVYsQ0FBZ0JPLENBQWhCLEVBQW1CTixFQUFsQztBQUNEO0FBQ0Y7QUFDRCxlQUFLVSxNQUFMO0FBQ0QsT0FaRDtBQWFEOzs7MkJBaUJNVCxPLEVBQVM7QUFDZFUsY0FBUUMsR0FBUixDQUFZWCxPQUFaLEVBQXFCLFNBQXJCO0FBQ0EsV0FBS2YsUUFBTCxHQUFnQmUsUUFBUWYsUUFBeEI7QUFDQSxXQUFLRSxNQUFMLEdBQWNhLFFBQVFZLEtBQXRCO0FBQ0Q7Ozs2QkFDUTtBQUFBOztBQUNQakIsU0FBR2tCLGFBQUgsQ0FBaUI7QUFDZkMsaUJBQVMsc0JBQU87QUFDZCxpQkFBSzlCLE1BQUwsR0FBYytCLElBQUlDLGVBQWxCO0FBQ0EsaUJBQUtDLFVBQUwsQ0FBZ0IsaUJBQWhCLEVBQW1DO0FBQ2pDakMsb0JBQVEsT0FBS0EsTUFEb0I7QUFFakNrQyxrQkFBTTtBQUYyQixXQUFuQztBQUlEO0FBUGMsT0FBakI7QUFTRDs7OztFQTlEaUNDLGVBQUtDLEk7O2tCQUFwQjdDLE0iLCJmaWxlIjoiYnV5TmV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyogZ2xvYmFsIHd4ICovXG5pbXBvcnQgd2VweSBmcm9tIFwid2VweVwiO1xuaW1wb3J0IFBhZ2VNaXhpbiBmcm9tIFwiLi4vLi4vbWl4aW5zL3BhZ2VcIjtcbmltcG9ydCBoZWFkZXIgZnJvbSBcIi4uLy4uL2NvbXBvbmVudHMvaGVhZGVyc1wiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ291cnNlIGV4dGVuZHMgd2VweS5wYWdlIHtcbiAgbWl4aW5zID0gW1BhZ2VNaXhpbl07XG4gIGNvbmZpZyA9IHtcbiAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIlxuICB9O1xuICBjb21wb25lbnRzID0ge1xuICAgIGhlYWRlclxuICB9O1xuICBkYXRhID0ge1xuICAgIGN1cnJlbnRJbmRleDogbnVsbCxcbiAgICBoZWlnaHQ6IFwiXCIsXG4gICAgYnJhbmNoSWQ6IG51bGwsXG4gICAgbGlzdDoge30sXG4gICAgY2FyZElkOiBudWxsXG4gIH07XG4gIHdoZW5BcHBSZWFkeVNob3cob3B0aW9ucykge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoXCJ1c2VyL3VzZXJGaXQuanNvblwiLCB7XG4gICAgICBhY3Rpb246IFwiY29hY2hzXCIsXG4gICAgICBicmFuY2hJZDogdGhpcy5icmFuY2hJZFxuICAgIH0pLnRoZW4oZGF0YSA9PiB7XG4gICAgICB0aGlzLmxpc3QgPSBkYXRhO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxpc3QuaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMubGlzdC5pdGVtc1tpXS5pZCA9PT0gdGhpcy5saXN0LmN1cnJlbnQuaWQpIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IGk7XG4gICAgICAgICAgdGhpcy5jb2FjaElkID0gdGhpcy5saXN0Lml0ZW1zW2ldLmlkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLiRhcHBseSgpO1xuICAgIH0pO1xuICB9XG4gIG1ldGhvZHMgPSB7XG4gICAgY3VycmVudEZ1bihlKSB7XG4gICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4O1xuICAgIH0sXG4gICAgbmV4dCgpIHtcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICB1cmw6XG4gICAgICAgICAgXCIvcGFnZXMvaG9tZS9idXlNb25leT9jYXJkSWQ9XCIgK1xuICAgICAgICAgIHRoaXMuY2FyZElkICtcbiAgICAgICAgICBcIiZicmFuY2hJZD1cIiArXG4gICAgICAgICAgdGhpcy5icmFuY2hJZCArXG4gICAgICAgICAgXCImY29hY2hJZD1cIiArXG4gICAgICAgICAgdGhpcy5saXN0Lml0ZW1zW3RoaXMuY3VycmVudEluZGV4XS5pZFxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICBvbkxvYWQob3B0aW9ucykge1xuICAgIGNvbnNvbGUubG9nKG9wdGlvbnMsIFwib3B0aW9uc1wiKTtcbiAgICB0aGlzLmJyYW5jaElkID0gb3B0aW9ucy5icmFuY2hJZDtcbiAgICB0aGlzLmNhcmRJZCA9IG9wdGlvbnMuY2FySWQ7XG4gIH1cbiAgb25TaG93KCkge1xuICAgIHd4LmdldFN5c3RlbUluZm8oe1xuICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSByZXMuc3RhdHVzQmFySGVpZ2h0O1xuICAgICAgICB0aGlzLiRicm9hZGNhc3QoXCJpbmRleC1icm9hZGNhc3RcIiwge1xuICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICAgICAgdGV4dDogXCJPbmVGaXTlgaXouqtcIlxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19