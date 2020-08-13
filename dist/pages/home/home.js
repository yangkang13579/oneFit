"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _dayjs = require('./../../npm/dayjs/dayjs.min.js');

var _dayjs2 = _interopRequireDefault(_dayjs);

var _headers = require('./../../components/headers.js');

var _headers2 = _interopRequireDefault(_headers);

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
    }, _this.components = {
      header: _headers2.default
    }, _this.data = (_this$data = {
      tabIndex: 0,
      datas: [],
      branchId: null,
      loadUser: true, // 需要登录信息
      height: "",
      current: null
    }, _defineProperty(_this$data, "loadUser", true), _defineProperty(_this$data, "isShow", true), _defineProperty(_this$data, "date", []), _defineProperty(_this$data, "currentIndex", null), _defineProperty(_this$data, "timeIndex", null), _defineProperty(_this$data, "leftData", []), _defineProperty(_this$data, "formDatatime", null), _defineProperty(_this$data, "formDate", null), _this$data), _this.methods = {
      getTime: function getTime(e) {
        this.formDatatime = e.currentTarget.dataset.item.id;
      },
      yuyueFun: function yuyueFun(e) {
        this.checkFun(e);
      },

      // 立即约课
      tabFun: function tabFun() {
        this.checkFun();
      },
      tabFuns: function tabFuns() {
        this.tabIndex = 1;
      },

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
      getDate: function getDate(e) {
        this.currentIndex = e.currentTarget.dataset.index;
        this.formDate = this.date[this.currentIndex];
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Course, [{
    key: "checkFun",
    value: function checkFun(e) {
      var _this2 = this;

      if (!this.formDatatime) {
        wx.showToast({
          icon: "none",
          title: "请选择预约时间段"
        });
        return;
      }
      this.fetchDataPromise("calendar.json", {
        coachId: this.tabIndex === 0 ? this.datas.current.id : e.currentTarget.dataset.id,
        branchId: this.branchId,
        time: this.formDatatime,
        date: this.formDate.dates,
        action: "reserve"
      }).then(function (data) {
        if (data.ret) {
          wx.showToast({
            title: "预约成功"
          });
        }
        _this2.$apply();
      });
    }
  }, {
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
    value: function whenAppReadyShow() {
      var _this5 = this;

      for (var i = 9; i <= 22; i++) {
        this.leftData.push({
          name: i + ":00",
          id: i
        });
      }
      this.fetchDataPromise("page/calendar.json", {
        action: "coachs",
        branchId: this.branchId
      }).then(function (data) {
        _this5.datas = data;
        _this5.$apply();
      });
    }
  }, {
    key: "onLoad",
    value: function onLoad(options) {
      this.branchId = options.branchId;
    }
  }, {
    key: "onShow",
    value: function onShow() {
      var _this6 = this;

      wx.getSystemInfo({
        success: function success(res) {
          _this6.height = res.statusBarHeight;
          _this6.$broadcast("index-broadcast", {
            height: _this6.height,
            text: "OneFit健身"
          });
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
          this.formDate = this.date[this.currentIndex];
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUuanMiXSwibmFtZXMiOlsiQ291cnNlIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsImNvbXBvbmVudHMiLCJoZWFkZXIiLCJkYXRhIiwidGFiSW5kZXgiLCJkYXRhcyIsImJyYW5jaElkIiwibG9hZFVzZXIiLCJoZWlnaHQiLCJjdXJyZW50IiwibWV0aG9kcyIsImdldFRpbWUiLCJlIiwiZm9ybURhdGF0aW1lIiwiY3VycmVudFRhcmdldCIsImRhdGFzZXQiLCJpdGVtIiwiaWQiLCJ5dXl1ZUZ1biIsImNoZWNrRnVuIiwidGFiRnVuIiwidGFiRnVucyIsInN1cmVGdW4iLCJjb25zb2xlIiwibG9nIiwiZG9vcnNJbmRleCIsImxlZnREYXRhIiwiZ2V0RGVhdGlscyIsImdldENvdXJzZSIsImlzTGVmdFNob3ciLCJicmFuY2hJdGVtIiwicmVzZXRGdW4iLCJjb3Vyc2VGdW4iLCJjb3Vyc2VJbmRleCIsImluZGV4IiwiZG9vcnNGdW4iLCJ0aW1lRnVuIiwidGltZUluZGV4IiwiaXNIaWRkZW4iLCJnbyIsInd4IiwibmF2aWdhdGVUbyIsInVybCIsImdvUmVzZXJ2ZSIsImdvZGV0YWlsIiwidG9sZXNzb24iLCJidG5UbyIsImdvQ29hY2giLCJ0YXBfY2giLCJ0aGF0IiwiSlNPTiIsInBhcnNlIiwiZ2V0U3RvcmFnZVN5bmMiLCIkYXBwbHkiLCJuYW1lIiwiY29uY2F0IiwiYnJhbmNoRGV0YWlscyIsImNvdXJzZXMiLCJidG4iLCJpc1Nob3ciLCJnZXREYXRlIiwiY3VycmVudEluZGV4IiwiZm9ybURhdGUiLCJkYXRlIiwic2hvd1RvYXN0IiwiaWNvbiIsInRpdGxlIiwiZmV0Y2hEYXRhUHJvbWlzZSIsImNvYWNoSWQiLCJ0aW1lIiwiZGF0ZXMiLCJhY3Rpb24iLCJ0aGVuIiwicmV0IiwidHlwZSIsInJlcyIsImNvdXJzZUxpc3QiLCJpdGVtcyIsIm1hcCIsIm9iaiIsInRpbWVzIiwiY2FsbEJhY2siLCJyZXF1ZXN0IiwiJHBhcmVudCIsImdsb2JhbERhdGEiLCJkYXRhVXJsIiwic3VjY2VzcyIsIm1lc3NhZ2VzIiwiZmFpbCIsImVycm9yIiwiaSIsInB1c2giLCJvcHRpb25zIiwiZ2V0U3lzdGVtSW5mbyIsInN0YXR1c0JhckhlaWdodCIsIiRicm9hZGNhc3QiLCJ0ZXh0IiwicmV0dXJuRGF0ZSIsIm1HZXREYXRlIiwic3VidHJhY3QiLCJ5ZWFyIiwibW9udGgiLCJhZGQiLCJkIiwiRGF0ZSIsImFyeSIsIndlZWsiLCJyZXR1cm5XZWVrIiwiZGF5IiwiaXNXZWVrIiwidmFsdWVPZiIsImlzU2FtZSIsImxlbmd0aCIsIm1hcmtlcklkIiwiY29udHJvbElkIiwid2VweSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUFKQTs7O0lBS3FCQSxNOzs7Ozs7Ozs7Ozs7OztzTEFDbkJDLE0sR0FBUyxDQUFDQyxjQUFELEMsUUFDVEMsTSxHQUFTO0FBQ1BDLG9DQUE4QjtBQUR2QixLLFFBR1RDLFUsR0FBYTtBQUNYQztBQURXLEssUUFHYkMsSTtBQUNFQyxnQkFBVSxDO0FBQ1ZDLGFBQU8sRTtBQUNQQyxnQkFBVSxJO0FBQ1ZDLGdCQUFVLEksRUFBTTtBQUNoQkMsY0FBUSxFO0FBQ1JDLGVBQVM7K0NBQ0MsSSx5Q0FDRixJLHVDQUNGLEUsK0NBQ1EsSSw0Q0FDSCxJLDJDQUNELEUsK0NBQ0ksSSwyQ0FDSixJLHNCQTRCWkMsTyxHQUFVO0FBQ1JDLGFBRFEsbUJBQ0FDLENBREEsRUFDRztBQUNULGFBQUtDLFlBQUwsR0FBb0JELEVBQUVFLGFBQUYsQ0FBZ0JDLE9BQWhCLENBQXdCQyxJQUF4QixDQUE2QkMsRUFBakQ7QUFDRCxPQUhPO0FBSVJDLGNBSlEsb0JBSUNOLENBSkQsRUFJSTtBQUNWLGFBQUtPLFFBQUwsQ0FBY1AsQ0FBZDtBQUNELE9BTk87O0FBT1I7QUFDQVEsWUFSUSxvQkFRQztBQUNQLGFBQUtELFFBQUw7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ZW50IjpbIlxyXG4vKiBnbG9iYWwgd3ggKi9cclxuaW1wb3J0IHdlcHkgZnJvbSBcIndlcHlcIjtcclxuaW1wb3J0IGRheWpzIGZyb20gXCJkYXlqc1wiO1xyXG5pbXBvcnQgaGVhZGVyIGZyb20gXCIuLi8uLi9jb21wb25lbnRzL2hlYWRlcnNcIjtcclxuaW1wb3J0IFBhZ2VNaXhpbiBmcm9tIFwiLi4vLi4vbWl4aW5zL3BhZ2VcIjtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ291cnNlIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICBtaXhpbnMgPSBbUGFnZU1peGluXTtcclxuICBjb25maWcgPSB7XHJcbiAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIlxyXG4gIH07XHJcbiAgY29tcG9uZW50cyA9IHtcclxuICAgIGhlYWRlclxyXG4gIH07XHJcbiAgZGF0YSA9IHtcclxuICAgIHRhYkluZGV4OiAwLFxyXG4gICAgZGF0YXM6IFtdLFxyXG4gICAgYnJhbmNoSWQ6IG51bGwsXHJcbiAgICBsb2FkVXNlcjogdHJ1ZSwgLy8g6ZyA6KaB55m75b2V5L+h5oGvXHJcbiAgICBoZWlnaHQ6IFwiXCIsXHJcbiAgICBjdXJyZW50OiBudWxsLFxyXG4gICAgbG9hZFVzZXI6IHRydWUsXHJcbiAgICBpc1Nob3c6IHRydWUsXHJcbiAgICBkYXRlOiBbXSxcclxuICAgIGN1cnJlbnRJbmRleDogbnVsbCxcclxuICAgIHRpbWVJbmRleDogbnVsbCxcclxuICAgIGxlZnREYXRhOiBbXSxcclxuICAgIGZvcm1EYXRhdGltZTogbnVsbCxcclxuICAgIGZvcm1EYXRlOiBudWxsXHJcbiAgfTtcclxuICBjaGVja0Z1bihlKSB7XHJcbiAgICBpZiAoIXRoaXMuZm9ybURhdGF0aW1lKSB7XHJcbiAgICAgIHd4LnNob3dUb2FzdCh7XHJcbiAgICAgICAgaWNvbjogXCJub25lXCIsXHJcbiAgICAgICAgdGl0bGU6IFwi6K+36YCJ5oup6aKE57qm5pe26Ze05q61XCJcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShcImNhbGVuZGFyLmpzb25cIiwge1xyXG4gICAgICBjb2FjaElkOlxyXG4gICAgICAgIHRoaXMudGFiSW5kZXggPT09IDBcclxuICAgICAgICAgID8gdGhpcy5kYXRhcy5jdXJyZW50LmlkXHJcbiAgICAgICAgICA6IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmlkLFxyXG4gICAgICBicmFuY2hJZDogdGhpcy5icmFuY2hJZCxcclxuICAgICAgdGltZTogdGhpcy5mb3JtRGF0YXRpbWUsXHJcbiAgICAgIGRhdGU6IHRoaXMuZm9ybURhdGUuZGF0ZXMsXHJcbiAgICAgIGFjdGlvbjogXCJyZXNlcnZlXCJcclxuICAgIH0pLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgIGlmIChkYXRhLnJldCkge1xyXG4gICAgICAgIHd4LnNob3dUb2FzdCh7XHJcbiAgICAgICAgICB0aXRsZTogXCLpooTnuqbmiJDlip9cIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgbWV0aG9kcyA9IHtcclxuICAgIGdldFRpbWUoZSkge1xyXG4gICAgICB0aGlzLmZvcm1EYXRhdGltZSA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0Lml0ZW0uaWQ7XHJcbiAgICB9LFxyXG4gICAgeXV5dWVGdW4oZSkge1xyXG4gICAgICB0aGlzLmNoZWNrRnVuKGUpO1xyXG4gICAgfSxcclxuICAgIC8vIOeri+WNs+e6puivvlxyXG4gICAgdGFiRnVuKCkge1xyXG4gICAgICB0aGlzLmNoZWNrRnVuKCk7XHJcbiAgICB9LFxyXG4gICAgdGFiRnVucygpIHtcclxuICAgICAgdGhpcy50YWJJbmRleCA9IDE7XHJcbiAgICB9LFxyXG4gICAgLy8g56Gu6K6k6YCJ5oupXHJcbiAgICBzdXJlRnVuKCkge1xyXG4gICAgICBpZiAodGhpcy5jdXJyZW50ID09PSBcIjFcIikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZG9vcnNJbmRleCwgXCJ0aGlzLmRvb3JzSW5kZXhcIik7XHJcbiAgICAgICAgdGhpcy5icmFuY2hJZCA9IHRoaXMubGVmdERhdGFbdGhpcy5kb29yc0luZGV4XS5pZDtcclxuICAgICAgICB0aGlzLmdldERlYXRpbHModGhpcy5icmFuY2hJZCk7XHJcbiAgICAgICAgdGhpcy5nZXRDb3Vyc2UoXCJpbmZvXCIpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuaXNMZWZ0U2hvdyA9IGZhbHNlO1xyXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmJyYW5jaEl0ZW0sIFwiYnJhbmNoSXRlbVwiKTtcclxuICAgIH0sXHJcbiAgICAvLyDph43nva5cclxuICAgIHJlc2V0RnVuKCkge1xyXG4gICAgICBpZiAodGhpcy5jdXJyZW50ID09PSBcIjFcIikge1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudCA9PT0gXCIyXCIpIHtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNvdXJzZUZ1bihlKSB7XHJcbiAgICAgIHRoaXMuY291cnNlSW5kZXggPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleDtcclxuICAgIH0sXHJcbiAgICBkb29yc0Z1bihlKSB7XHJcbiAgICAgIHRoaXMuZG9vcnNJbmRleCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4O1xyXG4gICAgfSxcclxuICAgIHRpbWVGdW4oZSkge1xyXG4gICAgICB0aGlzLnRpbWVJbmRleCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4O1xyXG4gICAgfSxcclxuICAgIGlzSGlkZGVuKCkge1xyXG4gICAgICB0aGlzLmlzTGVmdFNob3cgPSBmYWxzZTtcclxuICAgIH0sXHJcbiAgICBnbygpIHtcclxuICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgdXJsOiBcImFwcG9pbnREZXRhaWxcIlxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICAvL+i3s+i9rOmihOe6pumhtemdolxyXG4gICAgZ29SZXNlcnZlKCkge1xyXG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICB1cmw6IFwicmVzZXJ2ZVwiXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIC8v6Lez6L2s5pWZ57uD6K+m5oOFXHJcbiAgICBnb2RldGFpbCgpIHtcclxuICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgdXJsOiBcImNvYWNoRGV0YWlsXCJcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgLy/ot7PovazmqKHmnb/pgInmi6lcclxuICAgIHRvbGVzc29uKCkge1xyXG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICB1cmw6IFwibGVzc29uXCJcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgYnRuVG8oKSB7fSxcclxuICAgIGdvQ29hY2goKSB7XHJcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgIHVybDogXCJjb2FjaFwiXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHRhcF9jaChlKSB7XHJcbiAgICAgIHRoaXMuY3VycmVudCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4O1xyXG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgIGlmIChlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleCA9PT0gXCIxXCIpIHtcclxuICAgICAgICB0aGlzLmxlZnREYXRhID0gSlNPTi5wYXJzZSh3eC5nZXRTdG9yYWdlU3luYyhcImJyYW5jaHNcIikpO1xyXG4gICAgICAgIHRoaXMuaXNMZWZ0U2hvdyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH0gZWxzZSBpZiAoZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXggPT09IFwiMlwiKSB7XHJcbiAgICAgICAgdGhhdC5sZWZ0RGF0YSA9IFt7IG5hbWU6IFwi5YWo6YOo6K++56iLXCIgfV0uY29uY2F0KFxyXG4gICAgICAgICAgdGhpcy5icmFuY2hEZXRhaWxzLmNvdXJzZXNcclxuICAgICAgICApO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoYXQubGVmdERhdGEgPSBbXHJcbiAgICAgICAgICB7IG5hbWU6IFwi5YWo6YOo5pe25q61XCIsIGlkOiAwIH0sXHJcbiAgICAgICAgICB7IG5hbWU6IFwiMDA6MDAtMDk6MDBcIiwgaWQ6IDEgfSxcclxuICAgICAgICAgIHsgbmFtZTogXCIwOTowMC0xNTowMFwiLCBpZDogMiB9LFxyXG4gICAgICAgICAgeyBuYW1lOiBcIjE1OjAwLTE4OjAwXCIsIGlkOiAzIH0sXHJcbiAgICAgICAgICB7IG5hbWU6IFwiMTg6MDAtMjE6MDBcIiwgaWQ6IDQgfSxcclxuICAgICAgICAgIHsgbmFtZTogXCIyMTowMC0yNDowMFwiLCBpZDogNSB9XHJcbiAgICAgICAgXTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmlzTGVmdFNob3cgPSB0cnVlO1xyXG4gICAgfSxcclxuICAgIC8vIOaYvuekuuS4i+aLieahhlxyXG4gICAgYnRuKCkge1xyXG4gICAgICB0aGlzLmlzU2hvdyA9ICF0aGlzLmlzU2hvdztcclxuICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgIH0sXHJcbiAgICBnZXREYXRlKGUpIHtcclxuICAgICAgdGhpcy5jdXJyZW50SW5kZXggPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleDtcclxuICAgICAgdGhpcy5mb3JtRGF0ZSA9IHRoaXMuZGF0ZVt0aGlzLmN1cnJlbnRJbmRleF07XHJcbiAgICB9XHJcbiAgfTtcclxuICAvLyDmn6Xor6LmlZnnu4Plkozor77nqItcclxuICBnZXRDb3Vyc2UodHlwZSkge1xyXG4gICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKFwicGFnZS9jYWxlbmRhci5qc29uXCIsIHtcclxuICAgICAgYWN0aW9uOiB0eXBlLFxyXG4gICAgICBicmFuY2hJZDogdGhpcy5icmFuY2hJZCA/IHRoaXMuYnJhbmNoSWQgOiA2LFxyXG4gICAgICBkYXRlOiB0aGlzLmRhdGVbdGhpcy5jdXJyZW50SW5kZXhdLmRhdGVzLFxyXG4gICAgICB0aW1lOiB0aGlzLnRpbWVJbmRleFxyXG4gICAgfSkudGhlbihyZXMgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhyZXMpO1xyXG4gICAgICB0aGlzLmNvdXJzZUxpc3QgPSByZXMuaXRlbXMubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgIGNvbnN0IG9iaiA9IGl0ZW07XHJcbiAgICAgICAgb2JqLnRpbWVzID1cclxuICAgICAgICAgIG9iai50aW1lID09PSAxXHJcbiAgICAgICAgICAgID8gXCIwMDowMC0wOTowMFwiXHJcbiAgICAgICAgICAgIDogb2JqLnRpbWUgPT09IDJcclxuICAgICAgICAgICAgICA/IFwiMDk6MDAtMTU6MDBcIlxyXG4gICAgICAgICAgICAgIDogb2JqLnRpbWUgPT09IDNcclxuICAgICAgICAgICAgICAgID8gXCIxNTowMC0xODowMFwiXHJcbiAgICAgICAgICAgICAgICA6IG9iai50aW1lID09PSA0XHJcbiAgICAgICAgICAgICAgICAgID8gXCIxODowMC0yMTowMFwiXHJcbiAgICAgICAgICAgICAgICAgIDogb2JqLnRpbWUgPT09IDUgPyBcIjIxOjAwLTI0OjAwXCIgOiBcIlwiO1xyXG4gICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIC8vIOagueaNrumXqOW6l+Wcuummhmlk5p+l6K+i5Zy66aaG6K+m5oOFXHJcbiAgZ2V0RGVhdGlscyhpZCwgY2FsbEJhY2spIHtcclxuICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICB1cmw6IHRoaXMuJHBhcmVudC5nbG9iYWxEYXRhLmRhdGFVcmwgKyBcInBhZ2UvYnJhbmNoLmpzb25cIixcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgIGJyYW5jaElkOiBpZFxyXG4gICAgICB9LFxyXG4gICAgICBoZWFkZXI6IHtcclxuICAgICAgICBcImNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiIC8vIOm7mOiupOWAvFxyXG4gICAgICB9LFxyXG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xyXG4gICAgICAgIGlmIChjYWxsQmFjaykgY2FsbEJhY2soKTtcclxuICAgICAgICB0aGlzLmJyYW5jaERldGFpbHMgPSByZXMuZGF0YS5tZXNzYWdlcy5kYXRhO1xyXG4gICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGZhaWw6IGZ1bmN0aW9uKGVycm9yKSB7fVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIG9uUmVhY2hCb3R0b20oKSB7fVxyXG4gIHdoZW5BcHBSZWFkeVNob3coKSB7XHJcbiAgICBmb3IgKGxldCBpID0gOTsgaSA8PSAyMjsgaSsrKSB7XHJcbiAgICAgIHRoaXMubGVmdERhdGEucHVzaCh7XHJcbiAgICAgICAgbmFtZTogaSArIFwiOjAwXCIsXHJcbiAgICAgICAgaWQ6IGlcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoXCJwYWdlL2NhbGVuZGFyLmpzb25cIiwge1xyXG4gICAgICBhY3Rpb246IFwiY29hY2hzXCIsXHJcbiAgICAgIGJyYW5jaElkOiB0aGlzLmJyYW5jaElkXHJcbiAgICB9KS50aGVuKGRhdGEgPT4ge1xyXG4gICAgICB0aGlzLmRhdGFzID0gZGF0YTtcclxuICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBvbkxvYWQob3B0aW9ucykge1xyXG4gICAgdGhpcy5icmFuY2hJZCA9IG9wdGlvbnMuYnJhbmNoSWQ7XHJcbiAgfVxyXG4gIG9uU2hvdygpIHtcclxuICAgIHd4LmdldFN5c3RlbUluZm8oe1xyXG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gcmVzLnN0YXR1c0JhckhlaWdodDtcclxuICAgICAgICB0aGlzLiRicm9hZGNhc3QoXCJpbmRleC1icm9hZGNhc3RcIiwge1xyXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcclxuICAgICAgICAgIHRleHQ6IFwiT25lRml05YGl6LqrXCJcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICB0aGlzLmRhdGUgPSBbXTtcclxuICAgIHRoaXMucmV0dXJuRGF0ZShcclxuICAgICAgdGhpcy5tR2V0RGF0ZShcclxuICAgICAgICBkYXlqcygpXHJcbiAgICAgICAgICAuc3VidHJhY3QoMSwgXCJtb250aFwiKVxyXG4gICAgICAgICAgLnllYXIoKSxcclxuICAgICAgICBkYXlqcygpXHJcbiAgICAgICAgICAuc3VidHJhY3QoMSwgXCJtb250aFwiKVxyXG4gICAgICAgICAgLm1vbnRoKClcclxuICAgICAgKSxcclxuICAgICAgZGF5anMoKS5kYXRlKCksXHJcbiAgICAgIGRheWpzKClcclxuICAgICAgICAuc3VidHJhY3QoMSwgXCJtb250aFwiKVxyXG4gICAgICAgIC5tb250aCgpLFxyXG4gICAgICBkYXlqcygpXHJcbiAgICAgICAgLnN1YnRyYWN0KDEsIFwibW9udGhcIilcclxuICAgICAgICAueWVhcigpXHJcbiAgICApO1xyXG4gICAgdGhpcy5yZXR1cm5EYXRlKFxyXG4gICAgICB0aGlzLm1HZXREYXRlKFxyXG4gICAgICAgIGRheWpzKClcclxuICAgICAgICAgIC5zdWJ0cmFjdCgwLCBcIm1vbnRoXCIpXHJcbiAgICAgICAgICAueWVhcigpLFxyXG4gICAgICAgIGRheWpzKClcclxuICAgICAgICAgIC5zdWJ0cmFjdCgwLCBcIm1vbnRoXCIpXHJcbiAgICAgICAgICAubW9udGgoKVxyXG4gICAgICApLFxyXG4gICAgICAwLFxyXG4gICAgICBkYXlqcygpXHJcbiAgICAgICAgLnN1YnRyYWN0KDAsIFwibW9udGhcIilcclxuICAgICAgICAubW9udGgoKSxcclxuICAgICAgZGF5anMoKVxyXG4gICAgICAgIC5zdWJ0cmFjdCgwLCBcIm1vbnRoXCIpXHJcbiAgICAgICAgLnllYXIoKVxyXG4gICAgKTtcclxuICAgIHRoaXMucmV0dXJuRGF0ZShcclxuICAgICAgdGhpcy5tR2V0RGF0ZShkYXlqcygpLnllYXIoKSwgZGF5anMoKS5tb250aCgpICsgMSksXHJcbiAgICAgIDAsXHJcbiAgICAgIGRheWpzKCkubW9udGgoKSArIDEsXHJcbiAgICAgIGRheWpzKCkueWVhcigpXHJcbiAgICApO1xyXG4gICAgdGhpcy5yZXR1cm5EYXRlKFxyXG4gICAgICAxLFxyXG4gICAgICAwLFxyXG4gICAgICBkYXlqcygpXHJcbiAgICAgICAgLmFkZCgyLCBcIm1vbnRoXCIpXHJcbiAgICAgICAgLm1vbnRoKCksXHJcbiAgICAgIGRheWpzKClcclxuICAgICAgICAuYWRkKDIsIFwibW9udGhcIilcclxuICAgICAgICAueWVhcigpXHJcbiAgICApO1xyXG4gIH1cclxuICBtR2V0RGF0ZSh5ZWFyLCBtb250aCkge1xyXG4gICAgdmFyIGQgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMCk7XHJcbiAgICByZXR1cm4gZC5nZXREYXRlKCk7XHJcbiAgfVxyXG4gIHJldHVybkRhdGUoYXJ5LCBkYXRlLCBtb250aCwgeWVhcikge1xyXG4gICAgZm9yIChsZXQgaSA9IDEgKyBkYXRlOyBpIDw9IGFyeTsgaSsrKSB7XHJcbiAgICAgIHRoaXMuZGF0ZS5wdXNoKHtcclxuICAgICAgICBkYXRlczpcclxuICAgICAgICAgIHllYXIgK1xyXG4gICAgICAgICAgXCItXCIgK1xyXG4gICAgICAgICAgKG1vbnRoIDwgMTAgPyBcIjBcIiArIG1vbnRoIDogbW9udGgpICtcclxuICAgICAgICAgIFwiLVwiICtcclxuICAgICAgICAgIChpIDwgMTAgPyBcIjBcIiArIGkgOiBpKSxcclxuICAgICAgICBkYXRlOiBpLFxyXG4gICAgICAgIG1vbnRoOiBtb250aCxcclxuICAgICAgICB3ZWVrOiB0aGlzLnJldHVybldlZWsoZGF5anMoeWVhciArIFwiLVwiICsgbW9udGggKyBcIi1cIiArIGkpLmRheSgpKSxcclxuICAgICAgICBpc1dlZWs6XHJcbiAgICAgICAgICBkYXlqcyh5ZWFyICsgXCItXCIgKyBtb250aCArIFwiLVwiICsgaSkudmFsdWVPZigpIDxcclxuICAgICAgICAgICAgZGF5anMoKVxyXG4gICAgICAgICAgICAgIC5zdWJ0cmFjdCg4LCBcImRheVwiKVxyXG4gICAgICAgICAgICAgIC52YWx1ZU9mKCkgfHxcclxuICAgICAgICAgIGRheWpzKHllYXIgKyBcIi1cIiArIG1vbnRoICsgXCItXCIgKyBpKS52YWx1ZU9mKCkgPlxyXG4gICAgICAgICAgICBkYXlqcygpXHJcbiAgICAgICAgICAgICAgLmFkZCgxNCwgXCJkYXlcIilcclxuICAgICAgICAgICAgICAudmFsdWVPZigpXHJcbiAgICAgICAgICAgID8gZmFsc2VcclxuICAgICAgICAgICAgOiB0cnVlXHJcbiAgICAgIH0pO1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgZGF5anMoeWVhciArIFwiLVwiICsgbW9udGggKyBcIi1cIiArIGkpLmlzU2FtZShcclxuICAgICAgICAgIGRheWpzKFxyXG4gICAgICAgICAgICBkYXlqcygpLnllYXIoKSArIFwiLVwiICsgKGRheWpzKCkubW9udGgoKSArIDEpICsgXCItXCIgKyBkYXlqcygpLmRhdGUoKVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgIClcclxuICAgICAgKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50SW5kZXggPSB0aGlzLmRhdGUubGVuZ3RoIC0gMTtcclxuICAgICAgICB0aGlzLmZvcm1EYXRlID0gdGhpcy5kYXRlW3RoaXMuY3VycmVudEluZGV4XTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm5XZWVrKHdlZWspIHtcclxuICAgIHN3aXRjaCAod2Vlaykge1xyXG4gICAgICBjYXNlIDA6XHJcbiAgICAgICAgcmV0dXJuIFwi5pelXCI7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgMTpcclxuICAgICAgICByZXR1cm4gXCLkuIBcIjtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAyOlxyXG4gICAgICAgIHJldHVybiBcIuS6jFwiO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIDM6XHJcbiAgICAgICAgcmV0dXJuIFwi5LiJXCI7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgNDpcclxuICAgICAgICByZXR1cm4gXCLlm5tcIjtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSA1OlxyXG4gICAgICAgIHJldHVybiBcIuS6lFwiO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIDY6XHJcbiAgICAgICAgcmV0dXJuIFwi5YWtXCI7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG4gIG9uU2hhcmVBcHBNZXNzYWdlKHJlcykge31cclxuICByZWdpb25jaGFuZ2UoZSkge1xyXG4gICAgY29uc29sZS5sb2coZS50eXBlKTtcclxuICB9XHJcbiAgbWFya2VydGFwKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUubWFya2VySWQpO1xyXG4gIH1cclxuICBjb250cm9sdGFwKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUuY29udHJvbElkKTtcclxuICB9XHJcbn1cclxuIl19