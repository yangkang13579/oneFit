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
        this.fetchDataPromise("user/userFit.json", {
          action: "coachUpdate",
          coachId: this.coachId,
          branchId: this.branchId
        }).then(function (data) {});
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1eU5leHQuanMiXSwibmFtZXMiOlsiQ291cnNlIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsImNvbXBvbmVudHMiLCJoZWFkZXIiLCJkYXRhIiwiY3VycmVudEluZGV4IiwiaGVpZ2h0IiwiYnJhbmNoSWQiLCJsaXN0IiwiY2FyZElkIiwibWV0aG9kcyIsImN1cnJlbnRGdW4iLCJlIiwiY3VycmVudFRhcmdldCIsImRhdGFzZXQiLCJpbmRleCIsIm5leHQiLCJmZXRjaERhdGFQcm9taXNlIiwiYWN0aW9uIiwiY29hY2hJZCIsInRoZW4iLCJ3eCIsIm5hdmlnYXRlVG8iLCJ1cmwiLCJpdGVtcyIsImlkIiwib3B0aW9ucyIsInRoYXQiLCJpIiwibGVuZ3RoIiwiY3VycmVudCIsIiRhcHBseSIsImNvbnNvbGUiLCJsb2ciLCJjYXJJZCIsImdldFN5c3RlbUluZm8iLCJzdWNjZXNzIiwicmVzIiwic3RhdHVzQmFySGVpZ2h0IiwiJGJyb2FkY2FzdCIsInRleHQiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBSEE7OztJQUlxQkEsTTs7Ozs7Ozs7Ozs7Ozs7c0xBQ25CQyxNLEdBQVMsQ0FBQ0MsY0FBRCxDLFFBQ1RDLE0sR0FBUztBQUNQQyxvQ0FBOEI7QUFEdkIsSyxRQUdUQyxVLEdBQWE7QUFDWEM7QUFEVyxLLFFBR2JDLEksR0FBTztBQUNMQyxvQkFBYyxJQURUO0FBRUxDLGNBQVEsRUFGSDtBQUdMQyxnQkFBVSxJQUhMO0FBSUxDLFlBQU0sRUFKRDtBQUtMQyxjQUFRO0FBTEgsSyxRQXVCUEMsTyxHQUFVO0FBQ1JDLGdCQURRLHNCQUNHQyxDQURILEVBQ007QUFDWixhQUFLUCxZQUFMLEdBQW9CTyxFQUFFQyxhQUFGLENBQWdCQyxPQUFoQixDQUF3QkMsS0FBNUM7QUFDRCxPQUhPO0FBSVJDLFVBSlEsa0JBSUQ7QUFDTCxhQUFLQyxnQkFBTCxDQUFzQixtQkFBdEIsRUFBMkM7QUFDekNDLGtCQUFRLGFBRGlDO0FBRXpDQyxtQkFBUyxLQUFLQSxPQUYyQjtBQUd6Q1osb0JBQVUsS0FBS0E7QUFIMEIsU0FBM0MsRUFJR2EsSUFKSCxDQUlRLGdCQUFRLENBQUUsQ0FKbEI7QUFLQUMsV0FBR0MsVUFBSCxDQUFjO0FBQ1pDLGVBQ0UsaUNBQ0EsS0FBS2QsTUFETCxHQUVBLFlBRkEsR0FHQSxLQUFLRixRQUhMLEdBSUEsV0FKQSxHQUtBLEtBQUtDLElBQUwsQ0FBVWdCLEtBQVYsQ0FBZ0IsS0FBS25CLFlBQXJCLEVBQW1Db0I7QUFQekIsU0FBZDtBQVNEO0FBbkJPLEs7Ozs7O3FDQWhCT0MsTyxFQUFTO0FBQUE7O0FBQ3hCLFVBQUlDLE9BQU8sSUFBWDtBQUNBLFdBQUtWLGdCQUFMLENBQXNCLG1CQUF0QixFQUEyQztBQUN6Q0MsZ0JBQVEsUUFEaUM7QUFFekNYLGtCQUFVLEtBQUtBO0FBRjBCLE9BQTNDLEVBR0dhLElBSEgsQ0FHUSxnQkFBUTtBQUNkLGVBQUtaLElBQUwsR0FBWUosSUFBWjtBQUNBLGFBQUssSUFBSXdCLElBQUksQ0FBYixFQUFnQkEsSUFBSSxPQUFLcEIsSUFBTCxDQUFVZ0IsS0FBVixDQUFnQkssTUFBcEMsRUFBNENELEdBQTVDLEVBQWlEO0FBQy9DLGNBQUksT0FBS3BCLElBQUwsQ0FBVWdCLEtBQVYsQ0FBZ0JJLENBQWhCLEVBQW1CSCxFQUFuQixLQUEwQixPQUFLakIsSUFBTCxDQUFVc0IsT0FBVixDQUFrQkwsRUFBaEQsRUFBb0Q7QUFDbEQsbUJBQUtwQixZQUFMLEdBQW9CdUIsQ0FBcEI7QUFDQSxtQkFBS1QsT0FBTCxHQUFlLE9BQUtYLElBQUwsQ0FBVWdCLEtBQVYsQ0FBZ0JJLENBQWhCLEVBQW1CSCxFQUFsQztBQUNEO0FBQ0Y7QUFDRCxlQUFLTSxNQUFMO0FBQ0QsT0FaRDtBQWFEOzs7MkJBc0JNTCxPLEVBQVM7QUFDZE0sY0FBUUMsR0FBUixDQUFZUCxPQUFaLEVBQXFCLFNBQXJCO0FBQ0EsV0FBS25CLFFBQUwsR0FBZ0JtQixRQUFRbkIsUUFBeEI7QUFDQSxXQUFLRSxNQUFMLEdBQWNpQixRQUFRUSxLQUF0QjtBQUNEOzs7NkJBQ1E7QUFBQTs7QUFDUGIsU0FBR2MsYUFBSCxDQUFpQjtBQUNmQyxpQkFBUyxzQkFBTztBQUNkLGlCQUFLOUIsTUFBTCxHQUFjK0IsSUFBSUMsZUFBbEI7QUFDQSxpQkFBS0MsVUFBTCxDQUFnQixpQkFBaEIsRUFBbUM7QUFDakNqQyxvQkFBUSxPQUFLQSxNQURvQjtBQUVqQ2tDLGtCQUFNO0FBRjJCLFdBQW5DO0FBSUQ7QUFQYyxPQUFqQjtBQVNEOzs7O0VBbkVpQ0MsZUFBS0MsSTs7a0JBQXBCN0MsTSIsImZpbGUiOiJidXlOZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKiBnbG9iYWwgd3ggKi9cbmltcG9ydCB3ZXB5IGZyb20gXCJ3ZXB5XCI7XG5pbXBvcnQgUGFnZU1peGluIGZyb20gXCIuLi8uLi9taXhpbnMvcGFnZVwiO1xuaW1wb3J0IGhlYWRlciBmcm9tIFwiLi4vLi4vY29tcG9uZW50cy9oZWFkZXJzXCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3Vyc2UgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xuICBtaXhpbnMgPSBbUGFnZU1peGluXTtcbiAgY29uZmlnID0ge1xuICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZlwiXG4gIH07XG4gIGNvbXBvbmVudHMgPSB7XG4gICAgaGVhZGVyXG4gIH07XG4gIGRhdGEgPSB7XG4gICAgY3VycmVudEluZGV4OiBudWxsLFxuICAgIGhlaWdodDogXCJcIixcbiAgICBicmFuY2hJZDogbnVsbCxcbiAgICBsaXN0OiB7fSxcbiAgICBjYXJkSWQ6IG51bGxcbiAgfTtcbiAgd2hlbkFwcFJlYWR5U2hvdyhvcHRpb25zKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShcInVzZXIvdXNlckZpdC5qc29uXCIsIHtcbiAgICAgIGFjdGlvbjogXCJjb2FjaHNcIixcbiAgICAgIGJyYW5jaElkOiB0aGlzLmJyYW5jaElkXG4gICAgfSkudGhlbihkYXRhID0+IHtcbiAgICAgIHRoaXMubGlzdCA9IGRhdGE7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGlzdC5pdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5saXN0Lml0ZW1zW2ldLmlkID09PSB0aGlzLmxpc3QuY3VycmVudC5pZCkge1xuICAgICAgICAgIHRoaXMuY3VycmVudEluZGV4ID0gaTtcbiAgICAgICAgICB0aGlzLmNvYWNoSWQgPSB0aGlzLmxpc3QuaXRlbXNbaV0uaWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuJGFwcGx5KCk7XG4gICAgfSk7XG4gIH1cbiAgbWV0aG9kcyA9IHtcbiAgICBjdXJyZW50RnVuKGUpIHtcbiAgICAgIHRoaXMuY3VycmVudEluZGV4ID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXg7XG4gICAgfSxcbiAgICBuZXh0KCkge1xuICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKFwidXNlci91c2VyRml0Lmpzb25cIiwge1xuICAgICAgICBhY3Rpb246IFwiY29hY2hVcGRhdGVcIixcbiAgICAgICAgY29hY2hJZDogdGhpcy5jb2FjaElkLFxuICAgICAgICBicmFuY2hJZDogdGhpcy5icmFuY2hJZFxuICAgICAgfSkudGhlbihkYXRhID0+IHt9KTtcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICB1cmw6XG4gICAgICAgICAgXCIvcGFnZXMvaG9tZS9idXlNb25leT9jYXJkSWQ9XCIgK1xuICAgICAgICAgIHRoaXMuY2FyZElkICtcbiAgICAgICAgICBcIiZicmFuY2hJZD1cIiArXG4gICAgICAgICAgdGhpcy5icmFuY2hJZCArXG4gICAgICAgICAgXCImY29hY2hJZD1cIiArXG4gICAgICAgICAgdGhpcy5saXN0Lml0ZW1zW3RoaXMuY3VycmVudEluZGV4XS5pZFxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICBvbkxvYWQob3B0aW9ucykge1xuICAgIGNvbnNvbGUubG9nKG9wdGlvbnMsIFwib3B0aW9uc1wiKTtcbiAgICB0aGlzLmJyYW5jaElkID0gb3B0aW9ucy5icmFuY2hJZDtcbiAgICB0aGlzLmNhcmRJZCA9IG9wdGlvbnMuY2FySWQ7XG4gIH1cbiAgb25TaG93KCkge1xuICAgIHd4LmdldFN5c3RlbUluZm8oe1xuICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSByZXMuc3RhdHVzQmFySGVpZ2h0O1xuICAgICAgICB0aGlzLiRicm9hZGNhc3QoXCJpbmRleC1icm9hZGNhc3RcIiwge1xuICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICAgICAgdGV4dDogXCJPbmVGaXTlgaXouqtcIlxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19