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
      currentIndex: 0,
      height: null,
      tit: ["所有会员", "一周未出勤", "一月未出勤"],
      items: []
    }, _this.methods = {
      tabFun: function tabFun(e) {
        this.currentIndex = e.currentTarget.dataset.index;
      },
      detailsFun: function detailsFun(e) {
        wx.navigateTo({
          url: "/pages/user/membersNext?id=" + e.currentTarget.dataset.id
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Course, [{
    key: "whenAppReadyShow",
    value: function whenAppReadyShow() {
      this.getCoach();
    }
  }, {
    key: "getCoach",
    value: function getCoach() {
      var that = this;
      this.fetchDataPromise("page/coach.json", { action: "user" }).then(function (data) {
        that.items = data.items;
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
            text: "我的会员"
          });
        }
      });
    }
  }]);

  return Course;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Course , 'pages/user/members'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lbWJlcnMuanMiXSwibmFtZXMiOlsiQ291cnNlIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsImNvbXBvbmVudHMiLCJoZWFkZXIiLCJkYXRhIiwiY3VycmVudEluZGV4IiwiaGVpZ2h0IiwidGl0IiwiaXRlbXMiLCJtZXRob2RzIiwidGFiRnVuIiwiZSIsImN1cnJlbnRUYXJnZXQiLCJkYXRhc2V0IiwiaW5kZXgiLCJkZXRhaWxzRnVuIiwid3giLCJuYXZpZ2F0ZVRvIiwidXJsIiwiaWQiLCJnZXRDb2FjaCIsInRoYXQiLCJmZXRjaERhdGFQcm9taXNlIiwiYWN0aW9uIiwidGhlbiIsIiRhcHBseSIsImdldFN5c3RlbUluZm8iLCJzdWNjZXNzIiwicmVzIiwic3RhdHVzQmFySGVpZ2h0IiwiJGJyb2FkY2FzdCIsInRleHQiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBSEE7OztJQUlxQkEsTTs7Ozs7Ozs7Ozs7Ozs7c0xBQ25CQyxNLEdBQVMsQ0FBQ0MsY0FBRCxDLFFBQ1RDLE0sR0FBUztBQUNQQyxvQ0FBOEI7QUFEdkIsSyxRQUdUQyxVLEdBQWE7QUFDWEM7QUFEVyxLLFFBR2JDLEksR0FBTztBQUNMQyxvQkFBYyxDQURUO0FBRUxDLGNBQVEsSUFGSDtBQUdMQyxXQUFLLENBQUMsTUFBRCxFQUFTLE9BQVQsRUFBa0IsT0FBbEIsQ0FIQTtBQUlMQyxhQUFPO0FBSkYsSyxRQU1QQyxPLEdBQVU7QUFDUkMsWUFEUSxrQkFDREMsQ0FEQyxFQUNFO0FBQ1IsYUFBS04sWUFBTCxHQUFvQk0sRUFBRUMsYUFBRixDQUFnQkMsT0FBaEIsQ0FBd0JDLEtBQTVDO0FBQ0QsT0FITztBQUlSQyxnQkFKUSxzQkFJR0osQ0FKSCxFQUlNO0FBQ1pLLFdBQUdDLFVBQUgsQ0FBYztBQUNaQyxlQUFLLGdDQUFnQ1AsRUFBRUMsYUFBRixDQUFnQkMsT0FBaEIsQ0FBd0JNO0FBRGpELFNBQWQ7QUFHRDtBQVJPLEs7Ozs7O3VDQVVTO0FBQ2pCLFdBQUtDLFFBQUw7QUFDRDs7OytCQUNVO0FBQ1QsVUFBSUMsT0FBTyxJQUFYO0FBQ0EsV0FBS0MsZ0JBQUwsQ0FBc0IsaUJBQXRCLEVBQXlDLEVBQUVDLFFBQVEsTUFBVixFQUF6QyxFQUE2REMsSUFBN0QsQ0FBa0UsVUFDaEVwQixJQURnRSxFQUVoRTtBQUNBaUIsYUFBS2IsS0FBTCxHQUFhSixLQUFLSSxLQUFsQjtBQUNBYSxhQUFLSSxNQUFMO0FBQ0QsT0FMRDtBQU1EOzs7NkJBQ1E7QUFBQTs7QUFDUFQsU0FBR1UsYUFBSCxDQUFpQjtBQUNmQyxpQkFBUyxzQkFBTztBQUNkLGlCQUFLckIsTUFBTCxHQUFjc0IsSUFBSUMsZUFBbEI7QUFDQSxpQkFBS0MsVUFBTCxDQUFnQixpQkFBaEIsRUFBbUM7QUFDakN4QixvQkFBUSxPQUFLQSxNQURvQjtBQUVqQ3lCLGtCQUFNO0FBRjJCLFdBQW5DO0FBSUQ7QUFQYyxPQUFqQjtBQVNEOzs7O0VBOUNpQ0MsZUFBS0MsSTs7a0JBQXBCcEMsTSIsImZpbGUiOiJtZW1iZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKiBnbG9iYWwgd3ggKi9cbmltcG9ydCB3ZXB5IGZyb20gXCJ3ZXB5XCI7XG5pbXBvcnQgUGFnZU1peGluIGZyb20gXCIuLi8uLi9taXhpbnMvcGFnZVwiO1xuaW1wb3J0IGhlYWRlciBmcm9tIFwiLi4vLi4vY29tcG9uZW50cy9oZWFkZXJzXCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3Vyc2UgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xuICBtaXhpbnMgPSBbUGFnZU1peGluXTtcbiAgY29uZmlnID0ge1xuICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZlwiXG4gIH07XG4gIGNvbXBvbmVudHMgPSB7XG4gICAgaGVhZGVyXG4gIH07XG4gIGRhdGEgPSB7XG4gICAgY3VycmVudEluZGV4OiAwLFxuICAgIGhlaWdodDogbnVsbCxcbiAgICB0aXQ6IFtcIuaJgOacieS8muWRmFwiLCBcIuS4gOWRqOacquWHuuWLpFwiLCBcIuS4gOaciOacquWHuuWLpFwiXSxcbiAgICBpdGVtczogW11cbiAgfTtcbiAgbWV0aG9kcyA9IHtcbiAgICB0YWJGdW4oZSkge1xuICAgICAgdGhpcy5jdXJyZW50SW5kZXggPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleDtcbiAgICB9LFxuICAgIGRldGFpbHNGdW4oZSkge1xuICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgIHVybDogXCIvcGFnZXMvdXNlci9tZW1iZXJzTmV4dD9pZD1cIiArIGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmlkXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gIHdoZW5BcHBSZWFkeVNob3coKSB7XG4gICAgdGhpcy5nZXRDb2FjaCgpO1xuICB9XG4gIGdldENvYWNoKCkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoXCJwYWdlL2NvYWNoLmpzb25cIiwgeyBhY3Rpb246IFwidXNlclwiIH0pLnRoZW4oZnVuY3Rpb24oXG4gICAgICBkYXRhXG4gICAgKSB7XG4gICAgICB0aGF0Lml0ZW1zID0gZGF0YS5pdGVtcztcbiAgICAgIHRoYXQuJGFwcGx5KCk7XG4gICAgfSk7XG4gIH1cbiAgb25TaG93KCkge1xuICAgIHd4LmdldFN5c3RlbUluZm8oe1xuICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSByZXMuc3RhdHVzQmFySGVpZ2h0O1xuICAgICAgICB0aGlzLiRicm9hZGNhc3QoXCJpbmRleC1icm9hZGNhc3RcIiwge1xuICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICAgICAgdGV4dDogXCLmiJHnmoTkvJrlkZhcIlxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19