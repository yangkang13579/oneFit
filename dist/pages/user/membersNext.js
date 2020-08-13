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
      id: null,
      details: null
    }, _this.methods = {
      goBack: function goBack() {
        wx.navigateBack();
      },
      ticeData: function ticeData() {
        wx.navigateTo({
          url: "/pages/user/membersNext1?id=" + this.id + "&nickName=" + this.details.nickName + "&avatar=" + this.details.avatar
        });
      },
      memberImage: function memberImage() {
        wx.navigateTo({
          url: "/pages/user/membersNext2"
        });
      },
      expressPlan: function expressPlan() {
        wx.navigateTo({
          url: "/pages/user/membersNext3"
        });
      },
      eatPlan: function eatPlan() {
        wx.navigateTo({
          url: "/pages/user/membersNext4"
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Course, [{
    key: "onLoad",
    value: function onLoad(options) {
      this.id = options.id;
    }
  }, {
    key: "whenAppReadyShow",
    value: function whenAppReadyShow() {
      var that = this;
      this.fetchDataPromise("page/coach.json", {
        action: "userFit",
        userId: this.id
      }).then(function (data) {
        that.details = data;
        that.$apply();
      });
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
            text: "会员详情"
          });
        }
      });
    }
  }]);

  return Course;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Course , 'pages/user/membersNext'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lbWJlcnNOZXh0LmpzIl0sIm5hbWVzIjpbIkNvdXJzZSIsIm1peGlucyIsIlBhZ2VNaXhpbiIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJjb21wb25lbnRzIiwiaGVhZGVyIiwiZGF0YSIsImhlaWdodCIsInZhbHVlIiwibW9udGhzIiwiaWQiLCJkZXRhaWxzIiwibWV0aG9kcyIsImdvQmFjayIsInd4IiwibmF2aWdhdGVCYWNrIiwidGljZURhdGEiLCJuYXZpZ2F0ZVRvIiwidXJsIiwibmlja05hbWUiLCJhdmF0YXIiLCJtZW1iZXJJbWFnZSIsImV4cHJlc3NQbGFuIiwiZWF0UGxhbiIsIm9wdGlvbnMiLCJ0aGF0IiwiZmV0Y2hEYXRhUHJvbWlzZSIsImFjdGlvbiIsInVzZXJJZCIsInRoZW4iLCIkYXBwbHkiLCJpIiwicHVzaCIsImdldFN5c3RlbUluZm8iLCJzdWNjZXNzIiwicmVzIiwic3RhdHVzQmFySGVpZ2h0IiwiJGJyb2FkY2FzdCIsInRleHQiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBSEE7OztJQUlxQkEsTTs7Ozs7Ozs7Ozs7Ozs7c0xBQ25CQyxNLEdBQVMsQ0FBQ0MsY0FBRCxDLFFBQ1RDLE0sR0FBUztBQUNQQyxvQ0FBOEI7QUFEdkIsSyxRQUdUQyxVLEdBQWE7QUFDWEM7QUFEVyxLLFFBR2JDLEksR0FBTztBQUNMQyxjQUFRLEVBREg7QUFFTEMsYUFBTyxJQUZGO0FBR0xDLGNBQVEsRUFISDtBQUlMQyxVQUFJLElBSkM7QUFLTEMsZUFBUztBQUxKLEssUUFvQlBDLE8sR0FBVTtBQUNSQyxZQURRLG9CQUNDO0FBQ1BDLFdBQUdDLFlBQUg7QUFDRCxPQUhPO0FBSVJDLGNBSlEsc0JBSUc7QUFDVEYsV0FBR0csVUFBSCxDQUFjO0FBQ1pDLGVBQ0UsaUNBQ0EsS0FBS1IsRUFETCxHQUVBLFlBRkEsR0FHQSxLQUFLQyxPQUFMLENBQWFRLFFBSGIsR0FJQSxVQUpBLEdBS0EsS0FBS1IsT0FBTCxDQUFhUztBQVBILFNBQWQ7QUFTRCxPQWRPO0FBZVJDLGlCQWZRLHlCQWVNO0FBQ1pQLFdBQUdHLFVBQUgsQ0FBYztBQUNaQyxlQUFLO0FBRE8sU0FBZDtBQUdELE9BbkJPO0FBb0JSSSxpQkFwQlEseUJBb0JNO0FBQ1pSLFdBQUdHLFVBQUgsQ0FBYztBQUNaQyxlQUFLO0FBRE8sU0FBZDtBQUdELE9BeEJPO0FBeUJSSyxhQXpCUSxxQkF5QkU7QUFDUlQsV0FBR0csVUFBSCxDQUFjO0FBQ1pDLGVBQUs7QUFETyxTQUFkO0FBR0Q7QUE3Qk8sSzs7Ozs7MkJBYkhNLE8sRUFBUztBQUNkLFdBQUtkLEVBQUwsR0FBVWMsUUFBUWQsRUFBbEI7QUFDRDs7O3VDQUNrQjtBQUNqQixVQUFJZSxPQUFPLElBQVg7QUFDQSxXQUFLQyxnQkFBTCxDQUFzQixpQkFBdEIsRUFBeUM7QUFDdkNDLGdCQUFRLFNBRCtCO0FBRXZDQyxnQkFBUSxLQUFLbEI7QUFGMEIsT0FBekMsRUFHR21CLElBSEgsQ0FHUSxVQUFTdkIsSUFBVCxFQUFlO0FBQ3JCbUIsYUFBS2QsT0FBTCxHQUFlTCxJQUFmO0FBQ0FtQixhQUFLSyxNQUFMO0FBQ0QsT0FORDtBQU9EOzs7NkJBZ0NRO0FBQUE7O0FBQ1AsV0FBS3JCLE1BQUwsR0FBYyxFQUFkO0FBQ0EsV0FBSyxJQUFJc0IsSUFBSSxDQUFiLEVBQWdCQSxLQUFLLEVBQXJCLEVBQXlCQSxHQUF6QixFQUE4QjtBQUM1QixhQUFLdEIsTUFBTCxDQUFZdUIsSUFBWixDQUFpQkQsQ0FBakI7QUFDRDtBQUNEakIsU0FBR21CLGFBQUgsQ0FBaUI7QUFDZkMsaUJBQVMsc0JBQU87QUFDZCxpQkFBSzNCLE1BQUwsR0FBYzRCLElBQUlDLGVBQWxCO0FBQ0EsaUJBQUtDLFVBQUwsQ0FBZ0IsaUJBQWhCLEVBQW1DO0FBQ2pDOUIsb0JBQVEsT0FBS0EsTUFEb0I7QUFFakMrQixrQkFBTTtBQUYyQixXQUFuQztBQUlEO0FBUGMsT0FBakI7QUFTRDs7OztFQXpFaUNDLGVBQUtDLEk7O2tCQUFwQnpDLE0iLCJmaWxlIjoibWVtYmVyc05leHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qIGdsb2JhbCB3eCAqL1xuaW1wb3J0IHdlcHkgZnJvbSBcIndlcHlcIjtcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSBcIi4uLy4uL21peGlucy9wYWdlXCI7XG5pbXBvcnQgaGVhZGVyIGZyb20gXCIuLi8uLi9jb21wb25lbnRzL2hlYWRlcnNcIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvdXJzZSBleHRlbmRzIHdlcHkucGFnZSB7XG4gIG1peGlucyA9IFtQYWdlTWl4aW5dO1xuICBjb25maWcgPSB7XG4gICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcbiAgfTtcbiAgY29tcG9uZW50cyA9IHtcbiAgICBoZWFkZXJcbiAgfTtcbiAgZGF0YSA9IHtcbiAgICBoZWlnaHQ6IFwiXCIsXG4gICAgdmFsdWU6IG51bGwsXG4gICAgbW9udGhzOiBbXSxcbiAgICBpZDogbnVsbCxcbiAgICBkZXRhaWxzOiBudWxsXG4gIH07XG4gIG9uTG9hZChvcHRpb25zKSB7XG4gICAgdGhpcy5pZCA9IG9wdGlvbnMuaWQ7XG4gIH1cbiAgd2hlbkFwcFJlYWR5U2hvdygpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKFwicGFnZS9jb2FjaC5qc29uXCIsIHtcbiAgICAgIGFjdGlvbjogXCJ1c2VyRml0XCIsXG4gICAgICB1c2VySWQ6IHRoaXMuaWRcbiAgICB9KS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHRoYXQuZGV0YWlscyA9IGRhdGE7XG4gICAgICB0aGF0LiRhcHBseSgpO1xuICAgIH0pO1xuICB9XG4gIG1ldGhvZHMgPSB7XG4gICAgZ29CYWNrKCkge1xuICAgICAgd3gubmF2aWdhdGVCYWNrKCk7XG4gICAgfSxcbiAgICB0aWNlRGF0YSgpIHtcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICB1cmw6XG4gICAgICAgICAgXCIvcGFnZXMvdXNlci9tZW1iZXJzTmV4dDE/aWQ9XCIgK1xuICAgICAgICAgIHRoaXMuaWQgK1xuICAgICAgICAgIFwiJm5pY2tOYW1lPVwiICtcbiAgICAgICAgICB0aGlzLmRldGFpbHMubmlja05hbWUgK1xuICAgICAgICAgIFwiJmF2YXRhcj1cIiArXG4gICAgICAgICAgdGhpcy5kZXRhaWxzLmF2YXRhclxuICAgICAgfSk7XG4gICAgfSxcbiAgICBtZW1iZXJJbWFnZSgpIHtcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICB1cmw6IFwiL3BhZ2VzL3VzZXIvbWVtYmVyc05leHQyXCJcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZXhwcmVzc1BsYW4oKSB7XG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgdXJsOiBcIi9wYWdlcy91c2VyL21lbWJlcnNOZXh0M1wiXG4gICAgICB9KTtcbiAgICB9LFxuICAgIGVhdFBsYW4oKSB7XG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgdXJsOiBcIi9wYWdlcy91c2VyL21lbWJlcnNOZXh0NFwiXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gIG9uU2hvdygpIHtcbiAgICB0aGlzLm1vbnRocyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDEyOyBpKyspIHtcbiAgICAgIHRoaXMubW9udGhzLnB1c2goaSk7XG4gICAgfVxuICAgIHd4LmdldFN5c3RlbUluZm8oe1xuICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSByZXMuc3RhdHVzQmFySGVpZ2h0O1xuICAgICAgICB0aGlzLiRicm9hZGNhc3QoXCJpbmRleC1icm9hZGNhc3RcIiwge1xuICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICAgICAgdGV4dDogXCLkvJrlkZjor6bmg4VcIlxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19