"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _dayjs = require('./../../npm/dayjs/dayjs.min.js');

var _dayjs2 = _interopRequireDefault(_dayjs);

var _page = require('./../../mixins/page.js');

var _page2 = _interopRequireDefault(_page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/* global wx */


var Course = function (_wepy$page) {
  _inherits(Course, _wepy$page);

  function Course() {
    var _ref, _this$data;

    var _temp, _this, _ret;

    _classCallCheck(this, Course);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Course.__proto__ || Object.getPrototypeOf(Course)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
      navigationBarBackgroundColor: "#fff"
    }, _this.components = {}, _this.data = (_this$data = {
      loadUser: true, // 需要登录信息
      height: "",
      current: null
    }, _defineProperty(_this$data, "loadUser", true), _defineProperty(_this$data, "isShow", true), _defineProperty(_this$data, "date", []), _defineProperty(_this$data, "currentIndex", null), _defineProperty(_this$data, "timeIndex", null), _defineProperty(_this$data, "leftData", [{ name: "00:00-09:00", id: 1 }, { name: "09:00-15:00", id: 2 }, { name: "15:00-18:00", id: 3 }, { name: "18:00-21:00", id: 4 }, { name: "21:00-24:00", id: 5 }]), _this$data), _this.methods = {
      // 确认选择
      sureFun: function sureFun() {
        if (this.current === "1") {
          console.log(this.doorsIndex, "this.doorsIndex");
          this.branchId = this.leftData[this.doorsIndex].id;
          this.getDeatils(this.branchId);
          this.getCourse("info");
        }
        this.isLeftShow = false;
        console.log(this.branchItem, "branchItem");
      },

      // 重置
      resetFun: function resetFun() {
        if (this.current === "1") {} else if (this.current === "2") {} else {}
      },
      courseFun: function courseFun(e) {
        this.courseIndex = e.currentTarget.dataset.index;
      },
      doorsFun: function doorsFun(e) {
        this.doorsIndex = e.currentTarget.dataset.index;
      },
      timeFun: function timeFun(e) {
        this.timeIndex = e.currentTarget.dataset.index;
      },
      isHidden: function isHidden() {
        this.isLeftShow = false;
      },
      go: function go() {
        wx.navigateTo({
          url: "appointDetail"
        });
      },

      //跳转预约页面
      goReserve: function goReserve() {
        wx.navigateTo({
          url: "reserve"
        });
      },

      //跳转教练详情
      godetail: function godetail() {
        wx.navigateTo({
          url: "coachDetail"
        });
      },

      //跳转模板选择
      tolesson: function tolesson() {
        wx.navigateTo({
          url: "lesson"
        });
      },
      btnTo: function btnTo() {},
      goCoach: function goCoach() {
        wx.navigateTo({
          url: "coach"
        });
      },
      tap_ch: function tap_ch(e) {
        this.current = e.currentTarget.dataset.index;
        var that = this;
        if (e.currentTarget.dataset.index === "1") {
          this.leftData = JSON.parse(wx.getStorageSync("branchs"));
          this.isLeftShow = true;
          this.$apply();
          return;
        } else if (e.currentTarget.dataset.index === "2") {
          that.leftData = [{ name: "全部课程" }].concat(this.branchDetails.courses);
        } else {
          that.leftData = [{ name: "全部时段", id: 0 }, { name: "00:00-09:00", id: 1 }, { name: "09:00-15:00", id: 2 }, { name: "15:00-18:00", id: 3 }, { name: "18:00-21:00", id: 4 }, { name: "21:00-24:00", id: 5 }];
        }
        this.isLeftShow = true;
      },

      // 显示下拉框
      btn: function btn() {
        this.isShow = !this.isShow;
        this.$apply();
      },

      // 顶部导航栏切换
      tabs: function tabs() {
        console.log("this.tab", this.tab);
        if (this.tab == 1) {
          this.tab = 2;
        } else {
          this.tab = 1;
        }
        this.getCourse("reserve");
        this.$apply();
      },
      getDate: function getDate(e) {
        var _this2 = this;

        this.currentIndex = e.currentTarget.dataset.index;
        console.log(this.date[this.currentIndex]);
        if (this.tab === 2) {
          this.fetchDataPromise("page/calendar.json", {
            date: this.date[this.currentIndex].dates,
            action: "info"
          }).then(function (res) {
            _this2.$apply();
          });
        } else {
          this.getCourse("info");
        }
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Course, [{
    key: "getCourse",

    // 查询教练和课程
    value: function getCourse(type) {
      var _this3 = this;

      this.fetchDataPromise("page/calendar.json", {
        action: type,
        branchId: this.branchId ? this.branchId : 6,
        date: this.date[this.currentIndex].dates,
        time: this.timeIndex
      }).then(function (res) {
        console.log(res);
        _this3.courseList = res.items.map(function (item) {
          var obj = item;
          obj.times = obj.time === 1 ? "00:00-09:00" : obj.time === 2 ? "09:00-15:00" : obj.time === 3 ? "15:00-18:00" : obj.time === 4 ? "18:00-21:00" : obj.time === 5 ? "21:00-24:00" : "";
          return obj;
        });
        _this3.$apply();
      });
    }
    // 根据门店场馆id查询场馆详情

  }, {
    key: "getDeatils",
    value: function getDeatils(id, callBack) {
      var _this4 = this;

      wx.request({
        url: this.$parent.globalData.dataUrl + "page/branch.json",
        data: {
          branchId: id
        },
        header: {
          "content-type": "application/x-www-form-urlencoded" // 默认值
        },
        success: function success(res) {
          if (callBack) callBack();
          _this4.branchDetails = res.data.messages.data;
          _this4.$apply();
        },
        fail: function fail(error) {}
      });
    }
  }, {
    key: "onReachBottom",
    value: function onReachBottom() {}
  }, {
    key: "whenAppReadyShow",
    value: function whenAppReadyShow() {}
  }, {
    key: "onShow",
    value: function onShow() {
      var _this5 = this;

      wx.getSystemInfo({
        success: function success(res) {
          _this5.height = res.statusBarHeight;
        }
      });
      this.date = [];
      this.returnDate(this.mGetDate((0, _dayjs2.default)().subtract(1, "month").year(), (0, _dayjs2.default)().subtract(1, "month").month()), (0, _dayjs2.default)().date(), (0, _dayjs2.default)().subtract(1, "month").month(), (0, _dayjs2.default)().subtract(1, "month").year());
      this.returnDate(this.mGetDate((0, _dayjs2.default)().subtract(0, "month").year(), (0, _dayjs2.default)().subtract(0, "month").month()), 0, (0, _dayjs2.default)().subtract(0, "month").month(), (0, _dayjs2.default)().subtract(0, "month").year());
      this.returnDate(this.mGetDate((0, _dayjs2.default)().year(), (0, _dayjs2.default)().month() + 1), 0, (0, _dayjs2.default)().month() + 1, (0, _dayjs2.default)().year());
      this.returnDate(1, 0, (0, _dayjs2.default)().add(2, "month").month(), (0, _dayjs2.default)().add(2, "month").year());
    }
  }, {
    key: "mGetDate",
    value: function mGetDate(year, month) {
      var d = new Date(year, month, 0);
      return d.getDate();
    }
  }, {
    key: "returnDate",
    value: function returnDate(ary, date, month, year) {
      for (var i = 1 + date; i <= ary; i++) {
        this.date.push({
          dates: year + "-" + (month < 10 ? "0" + month : month) + "-" + (i < 10 ? "0" + i : i),
          date: i,
          month: month,
          week: this.returnWeek((0, _dayjs2.default)(year + "-" + month + "-" + i).day()),
          isWeek: (0, _dayjs2.default)(year + "-" + month + "-" + i).valueOf() < (0, _dayjs2.default)().subtract(8, "day").valueOf() || (0, _dayjs2.default)(year + "-" + month + "-" + i).valueOf() > (0, _dayjs2.default)().add(14, "day").valueOf() ? false : true
        });
        if ((0, _dayjs2.default)(year + "-" + month + "-" + i).isSame((0, _dayjs2.default)((0, _dayjs2.default)().year() + "-" + ((0, _dayjs2.default)().month() + 1) + "-" + (0, _dayjs2.default)().date()))) {
          this.currentIndex = this.date.length - 1;
        }
      }
    }
  }, {
    key: "returnWeek",
    value: function returnWeek(week) {
      switch (week) {
        case 0:
          return "日";
          break;
        case 1:
          return "一";
          break;
        case 2:
          return "二";
          break;
        case 3:
          return "三";
          break;
        case 4:
          return "四";
          break;
        case 5:
          return "五";
          break;
        case 6:
          return "六";
          break;
      }
    }
  }, {
    key: "onShareAppMessage",
    value: function onShareAppMessage(res) {}
  }, {
    key: "regionchange",
    value: function regionchange(e) {
      console.log(e.type);
    }
  }, {
    key: "markertap",
    value: function markertap(e) {
      console.log(e.markerId);
    }
  }, {
    key: "controltap",
    value: function controltap(e) {
      console.log(e.controlId);
    }
  }]);

  return Course;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Course , 'pages/home/home'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUuanMiXSwibmFtZXMiOlsiQ291cnNlIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsImNvbXBvbmVudHMiLCJkYXRhIiwibG9hZFVzZXIiLCJoZWlnaHQiLCJjdXJyZW50IiwibmFtZSIsImlkIiwibWV0aG9kcyIsInN1cmVGdW4iLCJjb25zb2xlIiwibG9nIiwiZG9vcnNJbmRleCIsImJyYW5jaElkIiwibGVmdERhdGEiLCJnZXREZWF0aWxzIiwiZ2V0Q291cnNlIiwiaXNMZWZ0U2hvdyIsImJyYW5jaEl0ZW0iLCJyZXNldEZ1biIsImNvdXJzZUZ1biIsImUiLCJjb3Vyc2VJbmRleCIsImN1cnJlbnRUYXJnZXQiLCJkYXRhc2V0IiwiaW5kZXgiLCJkb29yc0Z1biIsInRpbWVGdW4iLCJ0aW1lSW5kZXgiLCJpc0hpZGRlbiIsImdvIiwid3giLCJuYXZpZ2F0ZVRvIiwidXJsIiwiZ29SZXNlcnZlIiwiZ29kZXRhaWwiLCJ0b2xlc3NvbiIsImJ0blRvIiwiZ29Db2FjaCIsInRhcF9jaCIsInRoYXQiLCJKU09OIiwicGFyc2UiLCJnZXRTdG9yYWdlU3luYyIsIiRhcHBseSIsImNvbmNhdCIsImJyYW5jaERldGFpbHMiLCJjb3Vyc2VzIiwiYnRuIiwiaXNTaG93IiwidGFicyIsInRhYiIsImdldERhdGUiLCJjdXJyZW50SW5kZXgiLCJkYXRlIiwiZmV0Y2hEYXRhUHJvbWlzZSIsImRhdGVzIiwiYWN0aW9uIiwidGhlbiIsInR5cGUiLCJ0aW1lIiwicmVzIiwiY291cnNlTGlzdCIsIml0ZW1zIiwibWFwIiwib2JqIiwiaXRlbSIsInRpbWVzIiwiY2FsbEJhY2siLCJyZXF1ZXN0IiwiJHBhcmVudCIsImdsb2JhbERhdGEiLCJkYXRhVXJsIiwiaGVhZGVyIiwic3VjY2VzcyIsIm1lc3NhZ2VzIiwiZmFpbCIsImVycm9yIiwiZ2V0U3lzdGVtSW5mbyIsInN0YXR1c0JhckhlaWdodCIsInJldHVybkRhdGUiLCJtR2V0RGF0ZSIsInN1YnRyYWN0IiwieWVhciIsIm1vbnRoIiwiYWRkIiwiZCIsIkRhdGUiLCJhcnkiLCJpIiwicHVzaCIsIndlZWsiLCJyZXR1cm5XZWVrIiwiZGF5IiwiaXNXZWVrIiwidmFsdWVPZiIsImlzU2FtZSIsImxlbmd0aCIsIm1hcmtlcklkIiwiY29udHJvbElkIiwid2VweSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7O0FBSEE7OztJQUlxQkEsTTs7Ozs7Ozs7Ozs7Ozs7c0xBQ25CQyxNLEdBQVMsQ0FBQ0MsY0FBRCxDLFFBQ1RDLE0sR0FBUztBQUNQQyxvQ0FBOEI7QUFEdkIsSyxRQUdUQyxVLEdBQWEsRSxRQUNiQyxJO0FBQ0VDLGdCQUFVLEksRUFBTTtBQUNoQkMsY0FBUSxFO0FBQ1JDLGVBQVM7K0NBQ0MsSSx5Q0FDRixJLHVDQUNGLEUsK0NBQ1EsSSw0Q0FDSCxJLDJDQUNELENBQ1IsRUFBRUMsTUFBTSxhQUFSLEVBQXVCQyxJQUFJLENBQTNCLEVBRFEsRUFFUixFQUFFRCxNQUFNLGFBQVIsRUFBdUJDLElBQUksQ0FBM0IsRUFGUSxFQUdSLEVBQUVELE1BQU0sYUFBUixFQUF1QkMsSUFBSSxDQUEzQixFQUhRLEVBSVIsRUFBRUQsTUFBTSxhQUFSLEVBQXVCQyxJQUFJLENBQTNCLEVBSlEsRUFLUixFQUFFRCxNQUFNLGFBQVIsRUFBdUJDLElBQUksQ0FBM0IsRUFMUSxDLHNCQVFaQyxPLEdBQVU7QUFDUjtBQUNBQyxhQUZRLHFCQUVFO0FBQ1IsWUFBSSxLQUFLSixPQUFMLEtBQWlCLEdBQXJCLEVBQTBCO0FBQ3hCSyxrQkFBUUMsR0FBUixDQUFZLEtBQUtDLFVBQWpCLEVBQTZCLGlCQUE3QjtBQUNBLGVBQUtDLFFBQUwsR0FBZ0IsS0FBS0MsUUFBTCxDQUFjLEtBQUtGLFVBQW5CLEVBQStCTCxFQUEvQztBQUNBLGVBQUtRLFVBQUwsQ0FBZ0IsS0FBS0YsUUFBckI7QUFDQSxlQUFLRyxTQUFMLENBQWUs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XG4vKiBnbG9iYWwgd3ggKi9cclxuaW1wb3J0IHdlcHkgZnJvbSBcIndlcHlcIjtcclxuaW1wb3J0IGRheWpzIGZyb20gXCJkYXlqc1wiO1xyXG5pbXBvcnQgUGFnZU1peGluIGZyb20gXCIuLi8uLi9taXhpbnMvcGFnZVwiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3Vyc2UgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gIG1peGlucyA9IFtQYWdlTWl4aW5dO1xyXG4gIGNvbmZpZyA9IHtcclxuICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZlwiXHJcbiAgfTtcclxuICBjb21wb25lbnRzID0ge307XHJcbiAgZGF0YSA9IHtcclxuICAgIGxvYWRVc2VyOiB0cnVlLCAvLyDpnIDopoHnmbvlvZXkv6Hmga9cclxuICAgIGhlaWdodDogXCJcIixcclxuICAgIGN1cnJlbnQ6IG51bGwsXHJcbiAgICBsb2FkVXNlcjogdHJ1ZSxcclxuICAgIGlzU2hvdzogdHJ1ZSxcclxuICAgIGRhdGU6IFtdLFxyXG4gICAgY3VycmVudEluZGV4OiBudWxsLFxyXG4gICAgdGltZUluZGV4OiBudWxsLFxyXG4gICAgbGVmdERhdGE6IFtcclxuICAgICAgeyBuYW1lOiBcIjAwOjAwLTA5OjAwXCIsIGlkOiAxIH0sXHJcbiAgICAgIHsgbmFtZTogXCIwOTowMC0xNTowMFwiLCBpZDogMiB9LFxyXG4gICAgICB7IG5hbWU6IFwiMTU6MDAtMTg6MDBcIiwgaWQ6IDMgfSxcclxuICAgICAgeyBuYW1lOiBcIjE4OjAwLTIxOjAwXCIsIGlkOiA0IH0sXHJcbiAgICAgIHsgbmFtZTogXCIyMTowMC0yNDowMFwiLCBpZDogNSB9XHJcbiAgICBdXHJcbiAgfTtcclxuICBtZXRob2RzID0ge1xyXG4gICAgLy8g56Gu6K6k6YCJ5oupXHJcbiAgICBzdXJlRnVuKCkge1xyXG4gICAgICBpZiAodGhpcy5jdXJyZW50ID09PSBcIjFcIikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZG9vcnNJbmRleCwgXCJ0aGlzLmRvb3JzSW5kZXhcIik7XHJcbiAgICAgICAgdGhpcy5icmFuY2hJZCA9IHRoaXMubGVmdERhdGFbdGhpcy5kb29yc0luZGV4XS5pZDtcclxuICAgICAgICB0aGlzLmdldERlYXRpbHModGhpcy5icmFuY2hJZCk7XHJcbiAgICAgICAgdGhpcy5nZXRDb3Vyc2UoXCJpbmZvXCIpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuaXNMZWZ0U2hvdyA9IGZhbHNlO1xyXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmJyYW5jaEl0ZW0sIFwiYnJhbmNoSXRlbVwiKTtcclxuICAgIH0sXHJcbiAgICAvLyDph43nva5cclxuICAgIHJlc2V0RnVuKCkge1xyXG4gICAgICBpZiAodGhpcy5jdXJyZW50ID09PSBcIjFcIikge1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudCA9PT0gXCIyXCIpIHtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNvdXJzZUZ1bihlKSB7XHJcbiAgICAgIHRoaXMuY291cnNlSW5kZXggPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleDtcclxuICAgIH0sXHJcbiAgICBkb29yc0Z1bihlKSB7XHJcbiAgICAgIHRoaXMuZG9vcnNJbmRleCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4O1xyXG4gICAgfSxcclxuICAgIHRpbWVGdW4oZSkge1xyXG4gICAgICB0aGlzLnRpbWVJbmRleCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4O1xyXG4gICAgfSxcclxuICAgIGlzSGlkZGVuKCkge1xyXG4gICAgICB0aGlzLmlzTGVmdFNob3cgPSBmYWxzZTtcclxuICAgIH0sXHJcbiAgICBnbygpIHtcclxuICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgdXJsOiBcImFwcG9pbnREZXRhaWxcIlxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICAvL+i3s+i9rOmihOe6pumhtemdolxyXG4gICAgZ29SZXNlcnZlKCkge1xyXG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICB1cmw6IFwicmVzZXJ2ZVwiXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIC8v6Lez6L2s5pWZ57uD6K+m5oOFXHJcbiAgICBnb2RldGFpbCgpIHtcclxuICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgdXJsOiBcImNvYWNoRGV0YWlsXCJcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgLy/ot7PovazmqKHmnb/pgInmi6lcclxuICAgIHRvbGVzc29uKCkge1xyXG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICB1cmw6IFwibGVzc29uXCJcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgYnRuVG8oKSB7fSxcclxuICAgIGdvQ29hY2goKSB7XHJcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgIHVybDogXCJjb2FjaFwiXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHRhcF9jaChlKSB7XHJcbiAgICAgIHRoaXMuY3VycmVudCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4O1xyXG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgIGlmIChlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleCA9PT0gXCIxXCIpIHtcclxuICAgICAgICB0aGlzLmxlZnREYXRhID0gSlNPTi5wYXJzZSh3eC5nZXRTdG9yYWdlU3luYyhcImJyYW5jaHNcIikpO1xyXG4gICAgICAgIHRoaXMuaXNMZWZ0U2hvdyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH0gZWxzZSBpZiAoZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXggPT09IFwiMlwiKSB7XHJcbiAgICAgICAgdGhhdC5sZWZ0RGF0YSA9IFt7IG5hbWU6IFwi5YWo6YOo6K++56iLXCIgfV0uY29uY2F0KFxyXG4gICAgICAgICAgdGhpcy5icmFuY2hEZXRhaWxzLmNvdXJzZXNcclxuICAgICAgICApO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoYXQubGVmdERhdGEgPSBbXHJcbiAgICAgICAgICB7IG5hbWU6IFwi5YWo6YOo5pe25q61XCIsIGlkOiAwIH0sXHJcbiAgICAgICAgICB7IG5hbWU6IFwiMDA6MDAtMDk6MDBcIiwgaWQ6IDEgfSxcclxuICAgICAgICAgIHsgbmFtZTogXCIwOTowMC0xNTowMFwiLCBpZDogMiB9LFxyXG4gICAgICAgICAgeyBuYW1lOiBcIjE1OjAwLTE4OjAwXCIsIGlkOiAzIH0sXHJcbiAgICAgICAgICB7IG5hbWU6IFwiMTg6MDAtMjE6MDBcIiwgaWQ6IDQgfSxcclxuICAgICAgICAgIHsgbmFtZTogXCIyMTowMC0yNDowMFwiLCBpZDogNSB9XHJcbiAgICAgICAgXTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmlzTGVmdFNob3cgPSB0cnVlO1xyXG4gICAgfSxcclxuICAgIC8vIOaYvuekuuS4i+aLieahhlxyXG4gICAgYnRuKCkge1xyXG4gICAgICB0aGlzLmlzU2hvdyA9ICF0aGlzLmlzU2hvdztcclxuICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgIH0sXHJcbiAgICAvLyDpobbpg6jlr7zoiKrmoI/liIfmjaJcclxuICAgIHRhYnMoKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwidGhpcy50YWJcIiwgdGhpcy50YWIpO1xyXG4gICAgICBpZiAodGhpcy50YWIgPT0gMSkge1xyXG4gICAgICAgIHRoaXMudGFiID0gMjtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnRhYiA9IDE7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5nZXRDb3Vyc2UoXCJyZXNlcnZlXCIpO1xyXG4gICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgfSxcclxuICAgIGdldERhdGUoZSkge1xyXG4gICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4O1xyXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmRhdGVbdGhpcy5jdXJyZW50SW5kZXhdKTtcclxuICAgICAgaWYgKHRoaXMudGFiID09PSAyKSB7XHJcbiAgICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKFwicGFnZS9jYWxlbmRhci5qc29uXCIsIHtcclxuICAgICAgICAgIGRhdGU6IHRoaXMuZGF0ZVt0aGlzLmN1cnJlbnRJbmRleF0uZGF0ZXMsXHJcbiAgICAgICAgICBhY3Rpb246IFwiaW5mb1wiXHJcbiAgICAgICAgfSkudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmdldENvdXJzZShcImluZm9cIik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG4gIC8vIOafpeivouaVmee7g+WSjOivvueoi1xyXG4gIGdldENvdXJzZSh0eXBlKSB7XHJcbiAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoXCJwYWdlL2NhbGVuZGFyLmpzb25cIiwge1xyXG4gICAgICBhY3Rpb246IHR5cGUsXHJcbiAgICAgIGJyYW5jaElkOiB0aGlzLmJyYW5jaElkID8gdGhpcy5icmFuY2hJZCA6IDYsXHJcbiAgICAgIGRhdGU6IHRoaXMuZGF0ZVt0aGlzLmN1cnJlbnRJbmRleF0uZGF0ZXMsXHJcbiAgICAgIHRpbWU6IHRoaXMudGltZUluZGV4XHJcbiAgICB9KS50aGVuKHJlcyA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcyk7XHJcbiAgICAgIHRoaXMuY291cnNlTGlzdCA9IHJlcy5pdGVtcy5tYXAoaXRlbSA9PiB7XHJcbiAgICAgICAgY29uc3Qgb2JqID0gaXRlbTtcclxuICAgICAgICBvYmoudGltZXMgPVxyXG4gICAgICAgICAgb2JqLnRpbWUgPT09IDFcclxuICAgICAgICAgICAgPyBcIjAwOjAwLTA5OjAwXCJcclxuICAgICAgICAgICAgOiBvYmoudGltZSA9PT0gMlxyXG4gICAgICAgICAgICAgID8gXCIwOTowMC0xNTowMFwiXHJcbiAgICAgICAgICAgICAgOiBvYmoudGltZSA9PT0gM1xyXG4gICAgICAgICAgICAgICAgPyBcIjE1OjAwLTE4OjAwXCJcclxuICAgICAgICAgICAgICAgIDogb2JqLnRpbWUgPT09IDRcclxuICAgICAgICAgICAgICAgICAgPyBcIjE4OjAwLTIxOjAwXCJcclxuICAgICAgICAgICAgICAgICAgOiBvYmoudGltZSA9PT0gNSA/IFwiMjE6MDAtMjQ6MDBcIiA6IFwiXCI7XHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgLy8g5qC55o2u6Zeo5bqX5Zy66aaGaWTmn6Xor6LlnLrppobor6bmg4VcclxuICBnZXREZWF0aWxzKGlkLCBjYWxsQmFjaykge1xyXG4gICAgd3gucmVxdWVzdCh7XHJcbiAgICAgIHVybDogdGhpcy4kcGFyZW50Lmdsb2JhbERhdGEuZGF0YVVybCArIFwicGFnZS9icmFuY2guanNvblwiLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgYnJhbmNoSWQ6IGlkXHJcbiAgICAgIH0sXHJcbiAgICAgIGhlYWRlcjoge1xyXG4gICAgICAgIFwiY29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIgLy8g6buY6K6k5YC8XHJcbiAgICAgIH0sXHJcbiAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XHJcbiAgICAgICAgaWYgKGNhbGxCYWNrKSBjYWxsQmFjaygpO1xyXG4gICAgICAgIHRoaXMuYnJhbmNoRGV0YWlscyA9IHJlcy5kYXRhLm1lc3NhZ2VzLmRhdGE7XHJcbiAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgfSxcclxuICAgICAgZmFpbDogZnVuY3Rpb24oZXJyb3IpIHt9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgb25SZWFjaEJvdHRvbSgpIHt9XHJcbiAgd2hlbkFwcFJlYWR5U2hvdygpIHt9XHJcbiAgb25TaG93KCkge1xyXG4gICAgd3guZ2V0U3lzdGVtSW5mbyh7XHJcbiAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSByZXMuc3RhdHVzQmFySGVpZ2h0O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHRoaXMuZGF0ZSA9IFtdO1xyXG4gICAgdGhpcy5yZXR1cm5EYXRlKFxyXG4gICAgICB0aGlzLm1HZXREYXRlKFxyXG4gICAgICAgIGRheWpzKClcclxuICAgICAgICAgIC5zdWJ0cmFjdCgxLCBcIm1vbnRoXCIpXHJcbiAgICAgICAgICAueWVhcigpLFxyXG4gICAgICAgIGRheWpzKClcclxuICAgICAgICAgIC5zdWJ0cmFjdCgxLCBcIm1vbnRoXCIpXHJcbiAgICAgICAgICAubW9udGgoKVxyXG4gICAgICApLFxyXG4gICAgICBkYXlqcygpLmRhdGUoKSxcclxuICAgICAgZGF5anMoKVxyXG4gICAgICAgIC5zdWJ0cmFjdCgxLCBcIm1vbnRoXCIpXHJcbiAgICAgICAgLm1vbnRoKCksXHJcbiAgICAgIGRheWpzKClcclxuICAgICAgICAuc3VidHJhY3QoMSwgXCJtb250aFwiKVxyXG4gICAgICAgIC55ZWFyKClcclxuICAgICk7XHJcbiAgICB0aGlzLnJldHVybkRhdGUoXHJcbiAgICAgIHRoaXMubUdldERhdGUoXHJcbiAgICAgICAgZGF5anMoKVxyXG4gICAgICAgICAgLnN1YnRyYWN0KDAsIFwibW9udGhcIilcclxuICAgICAgICAgIC55ZWFyKCksXHJcbiAgICAgICAgZGF5anMoKVxyXG4gICAgICAgICAgLnN1YnRyYWN0KDAsIFwibW9udGhcIilcclxuICAgICAgICAgIC5tb250aCgpXHJcbiAgICAgICksXHJcbiAgICAgIDAsXHJcbiAgICAgIGRheWpzKClcclxuICAgICAgICAuc3VidHJhY3QoMCwgXCJtb250aFwiKVxyXG4gICAgICAgIC5tb250aCgpLFxyXG4gICAgICBkYXlqcygpXHJcbiAgICAgICAgLnN1YnRyYWN0KDAsIFwibW9udGhcIilcclxuICAgICAgICAueWVhcigpXHJcbiAgICApO1xyXG4gICAgdGhpcy5yZXR1cm5EYXRlKFxyXG4gICAgICB0aGlzLm1HZXREYXRlKGRheWpzKCkueWVhcigpLCBkYXlqcygpLm1vbnRoKCkgKyAxKSxcclxuICAgICAgMCxcclxuICAgICAgZGF5anMoKS5tb250aCgpICsgMSxcclxuICAgICAgZGF5anMoKS55ZWFyKClcclxuICAgICk7XHJcbiAgICB0aGlzLnJldHVybkRhdGUoXHJcbiAgICAgIDEsXHJcbiAgICAgIDAsXHJcbiAgICAgIGRheWpzKClcclxuICAgICAgICAuYWRkKDIsIFwibW9udGhcIilcclxuICAgICAgICAubW9udGgoKSxcclxuICAgICAgZGF5anMoKVxyXG4gICAgICAgIC5hZGQoMiwgXCJtb250aFwiKVxyXG4gICAgICAgIC55ZWFyKClcclxuICAgICk7XHJcbiAgfVxyXG4gIG1HZXREYXRlKHllYXIsIG1vbnRoKSB7XHJcbiAgICB2YXIgZCA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAwKTtcclxuICAgIHJldHVybiBkLmdldERhdGUoKTtcclxuICB9XHJcbiAgcmV0dXJuRGF0ZShhcnksIGRhdGUsIG1vbnRoLCB5ZWFyKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMSArIGRhdGU7IGkgPD0gYXJ5OyBpKyspIHtcclxuICAgICAgdGhpcy5kYXRlLnB1c2goe1xyXG4gICAgICAgIGRhdGVzOlxyXG4gICAgICAgICAgeWVhciArXHJcbiAgICAgICAgICBcIi1cIiArXHJcbiAgICAgICAgICAobW9udGggPCAxMCA/IFwiMFwiICsgbW9udGggOiBtb250aCkgK1xyXG4gICAgICAgICAgXCItXCIgK1xyXG4gICAgICAgICAgKGkgPCAxMCA/IFwiMFwiICsgaSA6IGkpLFxyXG4gICAgICAgIGRhdGU6IGksXHJcbiAgICAgICAgbW9udGg6IG1vbnRoLFxyXG4gICAgICAgIHdlZWs6IHRoaXMucmV0dXJuV2VlayhkYXlqcyh5ZWFyICsgXCItXCIgKyBtb250aCArIFwiLVwiICsgaSkuZGF5KCkpLFxyXG4gICAgICAgIGlzV2VlazpcclxuICAgICAgICAgIGRheWpzKHllYXIgKyBcIi1cIiArIG1vbnRoICsgXCItXCIgKyBpKS52YWx1ZU9mKCkgPFxyXG4gICAgICAgICAgICBkYXlqcygpXHJcbiAgICAgICAgICAgICAgLnN1YnRyYWN0KDgsIFwiZGF5XCIpXHJcbiAgICAgICAgICAgICAgLnZhbHVlT2YoKSB8fFxyXG4gICAgICAgICAgZGF5anMoeWVhciArIFwiLVwiICsgbW9udGggKyBcIi1cIiArIGkpLnZhbHVlT2YoKSA+XHJcbiAgICAgICAgICAgIGRheWpzKClcclxuICAgICAgICAgICAgICAuYWRkKDE0LCBcImRheVwiKVxyXG4gICAgICAgICAgICAgIC52YWx1ZU9mKClcclxuICAgICAgICAgICAgPyBmYWxzZVxyXG4gICAgICAgICAgICA6IHRydWVcclxuICAgICAgfSk7XHJcbiAgICAgIGlmIChcclxuICAgICAgICBkYXlqcyh5ZWFyICsgXCItXCIgKyBtb250aCArIFwiLVwiICsgaSkuaXNTYW1lKFxyXG4gICAgICAgICAgZGF5anMoXHJcbiAgICAgICAgICAgIGRheWpzKCkueWVhcigpICsgXCItXCIgKyAoZGF5anMoKS5tb250aCgpICsgMSkgKyBcIi1cIiArIGRheWpzKCkuZGF0ZSgpXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgKVxyXG4gICAgICApIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IHRoaXMuZGF0ZS5sZW5ndGggLSAxO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybldlZWsod2Vlaykge1xyXG4gICAgc3dpdGNoICh3ZWVrKSB7XHJcbiAgICAgIGNhc2UgMDpcclxuICAgICAgICByZXR1cm4gXCLml6VcIjtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAxOlxyXG4gICAgICAgIHJldHVybiBcIuS4gFwiO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIDI6XHJcbiAgICAgICAgcmV0dXJuIFwi5LqMXCI7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgMzpcclxuICAgICAgICByZXR1cm4gXCLkuIlcIjtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSA0OlxyXG4gICAgICAgIHJldHVybiBcIuWbm1wiO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIDU6XHJcbiAgICAgICAgcmV0dXJuIFwi5LqUXCI7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgNjpcclxuICAgICAgICByZXR1cm4gXCLlha1cIjtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgb25TaGFyZUFwcE1lc3NhZ2UocmVzKSB7fVxyXG4gIHJlZ2lvbmNoYW5nZShlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlLnR5cGUpO1xyXG4gIH1cclxuICBtYXJrZXJ0YXAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZS5tYXJrZXJJZCk7XHJcbiAgfVxyXG4gIGNvbnRyb2x0YXAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZS5jb250cm9sSWQpO1xyXG4gIH1cclxufVxyXG4iXX0=