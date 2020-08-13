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
      currentIndex2: 1,
      details: null,
      branchId: null
    }, _this.methods = {
      change: function change(e) {
        this.currentIndex2 = e.detail.current + 1 === this.datas.length ? 0 : e.detail.current + 1;
        console.log(this.currentIndex2);
      },
      buyFeat: function buyFeat(e) {
        wx.navigateTo({
          url: "/pages/doors/featDetails?coachId=" + e.currentTarget.dataset.item.id + "&branchId=" + this.branchId
        });
      },
      buyCorse: function buyCorse(e) {
        wx.navigateTo({
          url: "/pages/doors/corseDetails?courseId=" + e.currentTarget.dataset.item.id + "&branchId=" + this.branchId
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Course, [{
    key: "onLoad",
    value: function onLoad(options) {
      this.branchId = options.id;
    }
  }, {
    key: "whenAppReadyShow",
    value: function whenAppReadyShow() {
      var _this2 = this;

      var that = this;
      this.fetchDataPromise("page/branch.json", {
        action: "detail",
        branchId: this.branchId
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


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Course , 'pages/doors/doorsDetails'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvb3JzRGV0YWlscy5qcyJdLCJuYW1lcyI6WyJDb3Vyc2UiLCJtaXhpbnMiLCJQYWdlTWl4aW4iLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsImhlYWRlciIsImRhdGEiLCJoZWlnaHQiLCJkYXRhcyIsImN1cnJlbnRJbmRleCIsImN1cnJlbnRJbmRleDIiLCJkZXRhaWxzIiwiYnJhbmNoSWQiLCJtZXRob2RzIiwiY2hhbmdlIiwiZSIsImRldGFpbCIsImN1cnJlbnQiLCJsZW5ndGgiLCJjb25zb2xlIiwibG9nIiwiYnV5RmVhdCIsInd4IiwibmF2aWdhdGVUbyIsInVybCIsImN1cnJlbnRUYXJnZXQiLCJkYXRhc2V0IiwiaXRlbSIsImlkIiwiYnV5Q29yc2UiLCJvcHRpb25zIiwidGhhdCIsImZldGNoRGF0YVByb21pc2UiLCJhY3Rpb24iLCJ0aGVuIiwiJGFwcGx5IiwiZ2V0U3lzdGVtSW5mbyIsInN1Y2Nlc3MiLCJyZXMiLCJzdGF0dXNCYXJIZWlnaHQiLCIkYnJvYWRjYXN0IiwidGV4dCIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7QUFIQTs7O0lBSXFCQSxNOzs7Ozs7Ozs7Ozs7OztzTEFDbkJDLE0sR0FBUyxDQUFDQyxjQUFELEMsUUFDVEMsTSxHQUFTO0FBQ1BDLG9DQUE4QjtBQUR2QixLLFFBR1RDLFUsR0FBYTtBQUNYQztBQURXLEssUUFHYkMsSSxHQUFPO0FBQ0xDLGNBQVEsRUFESDtBQUVMQyxhQUFPLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixDQUZGO0FBR0xDLG9CQUFjLENBSFQ7QUFJTEMscUJBQWUsQ0FKVjtBQUtMQyxlQUFTLElBTEo7QUFNTEMsZ0JBQVU7QUFOTCxLLFFBUVBDLE8sR0FBVTtBQUNSQyxZQURRLGtCQUNEQyxDQURDLEVBQ0U7QUFDUixhQUFLTCxhQUFMLEdBQ0VLLEVBQUVDLE1BQUYsQ0FBU0MsT0FBVCxHQUFtQixDQUFuQixLQUF5QixLQUFLVCxLQUFMLENBQVdVLE1BQXBDLEdBQTZDLENBQTdDLEdBQWlESCxFQUFFQyxNQUFGLENBQVNDLE9BQVQsR0FBbUIsQ0FEdEU7QUFFQUUsZ0JBQVFDLEdBQVIsQ0FBWSxLQUFLVixhQUFqQjtBQUNELE9BTE87QUFNUlcsYUFOUSxtQkFNQU4sQ0FOQSxFQU1HO0FBQ1RPLFdBQUdDLFVBQUgsQ0FBYztBQUNaQyxlQUNFLHNDQUNBVCxFQUFFVSxhQUFGLENBQWdCQyxPQUFoQixDQUF3QkMsSUFBeEIsQ0FBNkJDLEVBRDdCLEdBRUEsWUFGQSxHQUdBLEtBQUtoQjtBQUxLLFNBQWQ7QUFPRCxPQWRPO0FBZVJpQixjQWZRLG9CQWVDZCxDQWZELEVBZUk7QUFDVk8sV0FBR0MsVUFBSCxDQUFjO0FBQ1pDLGVBQ0Usd0NBQ0FULEVBQUVVLGFBQUYsQ0FBZ0JDLE9BQWhCLENBQXdCQyxJQUF4QixDQUE2QkMsRUFEN0IsR0FFQSxZQUZBLEdBR0EsS0FBS2hCO0FBTEssU0FBZDtBQU9EO0FBdkJPLEs7Ozs7OzJCQXlCSGtCLE8sRUFBUztBQUNkLFdBQUtsQixRQUFMLEdBQWdCa0IsUUFBUUYsRUFBeEI7QUFDRDs7O3VDQUNrQjtBQUFBOztBQUNqQixVQUFJRyxPQUFPLElBQVg7QUFDQSxXQUFLQyxnQkFBTCxDQUFzQixrQkFBdEIsRUFBMEM7QUFDeENDLGdCQUFRLFFBRGdDO0FBRXhDckIsa0JBQVUsS0FBS0E7QUFGeUIsT0FBMUMsRUFHR3NCLElBSEgsQ0FHUSxnQkFBUTtBQUNkLGVBQUt2QixPQUFMLEdBQWVMLElBQWY7QUFDQSxlQUFLNkIsTUFBTDtBQUNELE9BTkQ7QUFPRDs7OzZCQUNRO0FBQUE7O0FBQ1BiLFNBQUdjLGFBQUgsQ0FBaUI7QUFDZkMsaUJBQVMsc0JBQU87QUFDZCxpQkFBSzlCLE1BQUwsR0FBYytCLElBQUlDLGVBQWxCO0FBQ0EsaUJBQUtDLFVBQUwsQ0FBZ0IsaUJBQWhCLEVBQW1DO0FBQ2pDakMsb0JBQVEsT0FBS0EsTUFEb0I7QUFFakNrQyxrQkFBTTtBQUYyQixXQUFuQztBQUlEO0FBUGMsT0FBakI7QUFTRDs7OztFQWhFaUNDLGVBQUtDLEk7O2tCQUFwQjVDLE0iLCJmaWxlIjoiZG9vcnNEZXRhaWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKiBnbG9iYWwgd3ggKi9cbmltcG9ydCB3ZXB5IGZyb20gXCJ3ZXB5XCI7XG5pbXBvcnQgUGFnZU1peGluIGZyb20gXCIuLi8uLi9taXhpbnMvcGFnZVwiO1xuaW1wb3J0IGhlYWRlciBmcm9tIFwiLi4vLi4vY29tcG9uZW50cy9oZWFkZXJzXCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3Vyc2UgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xuICBtaXhpbnMgPSBbUGFnZU1peGluXTtcbiAgY29uZmlnID0ge1xuICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZlwiXG4gIH07XG4gIGNvbXBvbmVudHMgPSB7XG4gICAgaGVhZGVyXG4gIH07XG4gIGRhdGEgPSB7XG4gICAgaGVpZ2h0OiBcIlwiLFxuICAgIGRhdGFzOiBbMSwgMiwgMywgNF0sXG4gICAgY3VycmVudEluZGV4OiAwLFxuICAgIGN1cnJlbnRJbmRleDI6IDEsXG4gICAgZGV0YWlsczogbnVsbCxcbiAgICBicmFuY2hJZDogbnVsbFxuICB9O1xuICBtZXRob2RzID0ge1xuICAgIGNoYW5nZShlKSB7XG4gICAgICB0aGlzLmN1cnJlbnRJbmRleDIgPVxuICAgICAgICBlLmRldGFpbC5jdXJyZW50ICsgMSA9PT0gdGhpcy5kYXRhcy5sZW5ndGggPyAwIDogZS5kZXRhaWwuY3VycmVudCArIDE7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRJbmRleDIpO1xuICAgIH0sXG4gICAgYnV5RmVhdChlKSB7XG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgdXJsOlxuICAgICAgICAgIFwiL3BhZ2VzL2Rvb3JzL2ZlYXREZXRhaWxzP2NvYWNoSWQ9XCIgK1xuICAgICAgICAgIGUuY3VycmVudFRhcmdldC5kYXRhc2V0Lml0ZW0uaWQgK1xuICAgICAgICAgIFwiJmJyYW5jaElkPVwiICtcbiAgICAgICAgICB0aGlzLmJyYW5jaElkXG4gICAgICB9KTtcbiAgICB9LFxuICAgIGJ1eUNvcnNlKGUpIHtcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICB1cmw6XG4gICAgICAgICAgXCIvcGFnZXMvZG9vcnMvY29yc2VEZXRhaWxzP2NvdXJzZUlkPVwiICtcbiAgICAgICAgICBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pdGVtLmlkICtcbiAgICAgICAgICBcIiZicmFuY2hJZD1cIiArXG4gICAgICAgICAgdGhpcy5icmFuY2hJZFxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICBvbkxvYWQob3B0aW9ucykge1xuICAgIHRoaXMuYnJhbmNoSWQgPSBvcHRpb25zLmlkO1xuICB9XG4gIHdoZW5BcHBSZWFkeVNob3coKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShcInBhZ2UvYnJhbmNoLmpzb25cIiwge1xuICAgICAgYWN0aW9uOiBcImRldGFpbFwiLFxuICAgICAgYnJhbmNoSWQ6IHRoaXMuYnJhbmNoSWRcbiAgICB9KS50aGVuKGRhdGEgPT4ge1xuICAgICAgdGhpcy5kZXRhaWxzID0gZGF0YTtcbiAgICAgIHRoaXMuJGFwcGx5KCk7XG4gICAgfSk7XG4gIH1cbiAgb25TaG93KCkge1xuICAgIHd4LmdldFN5c3RlbUluZm8oe1xuICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSByZXMuc3RhdHVzQmFySGVpZ2h0O1xuICAgICAgICB0aGlzLiRicm9hZGNhc3QoXCJpbmRleC1icm9hZGNhc3RcIiwge1xuICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICAgICAgdGV4dDogXCJPbmVGaXTlgaXouqtcIlxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19