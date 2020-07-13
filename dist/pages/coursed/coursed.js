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
      navigationBarTitleText: "首页",
      navigationBarBackgroundColor: "#fff"
    }, _this.components = {}, _this.data = {
      loadUser: true,
      isShow: true,
      open: false,
      tab: 1,
      date: [],
      currentIndex: null
    }, _this.methods = {
      //跳转预约页面
      goReserve: function goReserve() {
        wx.navigateTo({
          url: 'reserve'
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
      tap_ch: function tap_ch() {
        console.log("777");
        if (this.data.open) {
          this.open = false;
        } else {
          this.open = true;
        }
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
        this.$apply();
      },
      getDate: function getDate(e) {
        this.currentIndex = e.currentTarget.dataset.index;
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Course, [{
    key: "onReachBottom",
    value: function onReachBottom() {}
  }, {
    key: "whenAppReadyShow",
    value: function whenAppReadyShow() {
      var _this2 = this;

      this.fetchDataPromise("user/userInfo.json", {}).then(function (data) {
        var userInfo = data;
        _this2.$apply();
        wx.setStorage({
          key: "userInfo",
          data: JSON.stringify(userInfo)
        });
      }).catch(function (error) {});
    }
  }, {
    key: "onShow",
    value: function onShow() {
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
          date: i,
          month: month + "月",
          week: "周" + this.returnWeek((0, _dayjs2.default)(year + "-" + month + "-" + i).day()),
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


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Course , 'pages/coursed/coursed'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvdXJzZWQuanMiXSwibmFtZXMiOlsiQ291cnNlIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJjb21wb25lbnRzIiwiZGF0YSIsImxvYWRVc2VyIiwiaXNTaG93Iiwib3BlbiIsInRhYiIsImRhdGUiLCJjdXJyZW50SW5kZXgiLCJtZXRob2RzIiwiZ29SZXNlcnZlIiwid3giLCJuYXZpZ2F0ZVRvIiwidXJsIiwiZ29kZXRhaWwiLCJ0b2xlc3NvbiIsImJ0blRvIiwiZ29Db2FjaCIsInRhcF9jaCIsImNvbnNvbGUiLCJsb2ciLCJidG4iLCIkYXBwbHkiLCJ0YWJzIiwiZ2V0RGF0ZSIsImUiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YXNldCIsImluZGV4IiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRoZW4iLCJ1c2VySW5mbyIsInNldFN0b3JhZ2UiLCJrZXkiLCJKU09OIiwic3RyaW5naWZ5IiwiY2F0Y2giLCJlcnJvciIsInJldHVybkRhdGUiLCJtR2V0RGF0ZSIsInN1YnRyYWN0IiwieWVhciIsIm1vbnRoIiwiYWRkIiwiZCIsIkRhdGUiLCJhcnkiLCJpIiwicHVzaCIsIndlZWsiLCJyZXR1cm5XZWVrIiwiZGF5IiwiaXNXZWVrIiwidmFsdWVPZiIsImlzU2FtZSIsImxlbmd0aCIsInJlcyIsInR5cGUiLCJtYXJrZXJJZCIsImNvbnRyb2xJZCIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7QUFIQTs7O0lBSXFCQSxNOzs7Ozs7Ozs7Ozs7OztzTEFDbkJDLE0sR0FBUyxDQUFDQyxjQUFELEMsUUFDVEMsTSxHQUFTO0FBQ1BDLDhCQUF3QixJQURqQjtBQUVQQyxvQ0FBOEI7QUFGdkIsSyxRQUlUQyxVLEdBQWEsRSxRQUNiQyxJLEdBQU87QUFDTEMsZ0JBQVUsSUFETDtBQUVMQyxj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SyxFQUFFa0MsU0FBZDtBQUNEOzs7O0VBeE1pQ0MsZUFBS0MsSTs7a0JBQXBCbEUsTSIsImZpbGUiOiJjb3Vyc2VkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8qIGdsb2JhbCB3eCAqL1xyXG5pbXBvcnQgd2VweSBmcm9tIFwid2VweVwiO1xyXG5pbXBvcnQgZGF5anMgZnJvbSBcImRheWpzXCI7XHJcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSBcIi4uLy4uL21peGlucy9wYWdlXCI7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvdXJzZSBleHRlbmRzIHdlcHkucGFnZSB7XHJcbiAgbWl4aW5zID0gW1BhZ2VNaXhpbl07XHJcbiAgY29uZmlnID0ge1xyXG4gICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogXCLpppbpobVcIixcclxuICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZlwiXHJcbiAgfTtcclxuICBjb21wb25lbnRzID0ge307XHJcbiAgZGF0YSA9IHtcclxuICAgIGxvYWRVc2VyOiB0cnVlLFxyXG4gICAgaXNTaG93OiB0cnVlLFxyXG4gICAgb3BlbjogZmFsc2UsXHJcbiAgICB0YWI6IDEsXHJcbiAgICBkYXRlOiBbXSxcclxuICAgIGN1cnJlbnRJbmRleDogbnVsbFxyXG4gIH07XHJcbiAgbWV0aG9kcyA9IHtcclxuICAgIC8v6Lez6L2s6aKE57qm6aG16Z2iXHJcbiAgICBnb1Jlc2VydmUoKXtcclxuICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgdXJsOiAncmVzZXJ2ZSdcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICAvL+i3s+i9rOaVmee7g+ivpuaDhVxyXG4gICAgZ29kZXRhaWwoKSB7XHJcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgIHVybDogXCJjb2FjaERldGFpbFwiXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgICAvL+i3s+i9rOaooeadv+mAieaLqVxyXG4gICAgdG9sZXNzb24oKSB7XHJcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgIHVybDogXCJsZXNzb25cIlxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBidG5UbygpIHt9LFxyXG4gICAgZ29Db2FjaCgpIHtcclxuICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgdXJsOiBcImNvYWNoXCJcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgdGFwX2NoKCkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIjc3N1wiKTtcclxuICAgICAgaWYgKHRoaXMuZGF0YS5vcGVuKSB7XHJcbiAgICAgICAgdGhpcy5vcGVuID0gZmFsc2U7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5vcGVuID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIOaYvuekuuS4i+aLieahhlxyXG4gICAgYnRuKCkge1xyXG4gICAgICB0aGlzLmlzU2hvdyA9ICF0aGlzLmlzU2hvdztcclxuICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgIH0sXHJcbiAgICAvLyDpobbpg6jlr7zoiKrmoI/liIfmjaJcclxuICAgIHRhYnMoKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwidGhpcy50YWJcIiwgdGhpcy50YWIpO1xyXG4gICAgICBpZiAodGhpcy50YWIgPT0gMSkge1xyXG4gICAgICAgIHRoaXMudGFiID0gMjtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnRhYiA9IDE7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgIH0sXHJcbiAgICBnZXREYXRlKGUpIHtcclxuICAgICAgdGhpcy5jdXJyZW50SW5kZXggPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleDtcclxuICAgIH1cclxuICB9O1xyXG4gIG9uUmVhY2hCb3R0b20oKSB7fVxyXG4gIHdoZW5BcHBSZWFkeVNob3coKSB7XHJcbiAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoXCJ1c2VyL3VzZXJJbmZvLmpzb25cIiwge30pXHJcbiAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgIGNvbnN0IHVzZXJJbmZvID0gZGF0YTtcclxuICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICAgIHd4LnNldFN0b3JhZ2Uoe1xyXG4gICAgICAgICAga2V5OiBcInVzZXJJbmZvXCIsXHJcbiAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh1c2VySW5mbylcclxuICAgICAgICB9KTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7fSk7XHJcbiAgfVxyXG4gIG9uU2hvdygpIHtcclxuICAgIHRoaXMuZGF0ZSA9IFtdO1xyXG4gICAgdGhpcy5yZXR1cm5EYXRlKFxyXG4gICAgICB0aGlzLm1HZXREYXRlKFxyXG4gICAgICAgIGRheWpzKClcclxuICAgICAgICAgIC5zdWJ0cmFjdCgxLCBcIm1vbnRoXCIpXHJcbiAgICAgICAgICAueWVhcigpLFxyXG4gICAgICAgIGRheWpzKClcclxuICAgICAgICAgIC5zdWJ0cmFjdCgxLCBcIm1vbnRoXCIpXHJcbiAgICAgICAgICAubW9udGgoKVxyXG4gICAgICApLFxyXG4gICAgICBkYXlqcygpLmRhdGUoKSxcclxuICAgICAgZGF5anMoKVxyXG4gICAgICAgIC5zdWJ0cmFjdCgxLCBcIm1vbnRoXCIpXHJcbiAgICAgICAgLm1vbnRoKCksXHJcbiAgICAgIGRheWpzKClcclxuICAgICAgICAuc3VidHJhY3QoMSwgXCJtb250aFwiKVxyXG4gICAgICAgIC55ZWFyKClcclxuICAgICk7XHJcbiAgICB0aGlzLnJldHVybkRhdGUoXHJcbiAgICAgIHRoaXMubUdldERhdGUoXHJcbiAgICAgICAgZGF5anMoKVxyXG4gICAgICAgICAgLnN1YnRyYWN0KDAsIFwibW9udGhcIilcclxuICAgICAgICAgIC55ZWFyKCksXHJcbiAgICAgICAgZGF5anMoKVxyXG4gICAgICAgICAgLnN1YnRyYWN0KDAsIFwibW9udGhcIilcclxuICAgICAgICAgIC5tb250aCgpXHJcbiAgICAgICksXHJcbiAgICAgIDAsXHJcbiAgICAgIGRheWpzKClcclxuICAgICAgICAuc3VidHJhY3QoMCwgXCJtb250aFwiKVxyXG4gICAgICAgIC5tb250aCgpLFxyXG4gICAgICBkYXlqcygpXHJcbiAgICAgICAgLnN1YnRyYWN0KDAsIFwibW9udGhcIilcclxuICAgICAgICAueWVhcigpXHJcbiAgICApO1xyXG4gICAgdGhpcy5yZXR1cm5EYXRlKFxyXG4gICAgICB0aGlzLm1HZXREYXRlKGRheWpzKCkueWVhcigpLCBkYXlqcygpLm1vbnRoKCkgKyAxKSxcclxuICAgICAgMCxcclxuICAgICAgZGF5anMoKS5tb250aCgpICsgMSxcclxuICAgICAgZGF5anMoKS55ZWFyKClcclxuICAgICk7XHJcbiAgICB0aGlzLnJldHVybkRhdGUoXHJcbiAgICAgIDEsXHJcbiAgICAgIDAsXHJcbiAgICAgIGRheWpzKClcclxuICAgICAgICAuYWRkKDIsIFwibW9udGhcIilcclxuICAgICAgICAubW9udGgoKSxcclxuICAgICAgZGF5anMoKVxyXG4gICAgICAgIC5hZGQoMiwgXCJtb250aFwiKVxyXG4gICAgICAgIC55ZWFyKClcclxuICAgICk7XHJcbiAgfVxyXG4gIG1HZXREYXRlKHllYXIsIG1vbnRoKSB7XHJcbiAgICB2YXIgZCA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAwKTtcclxuICAgIHJldHVybiBkLmdldERhdGUoKTtcclxuICB9XHJcbiAgcmV0dXJuRGF0ZShhcnksIGRhdGUsIG1vbnRoLCB5ZWFyKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMSArIGRhdGU7IGkgPD0gYXJ5OyBpKyspIHtcclxuICAgICAgdGhpcy5kYXRlLnB1c2goe1xyXG4gICAgICAgIGRhdGU6IGksXHJcbiAgICAgICAgbW9udGg6IG1vbnRoICsgXCLmnIhcIixcclxuICAgICAgICB3ZWVrOiBcIuWRqFwiICsgdGhpcy5yZXR1cm5XZWVrKGRheWpzKHllYXIgKyBcIi1cIiArIG1vbnRoICsgXCItXCIgKyBpKS5kYXkoKSksXHJcbiAgICAgICAgaXNXZWVrOlxyXG4gICAgICAgICAgZGF5anMoeWVhciArIFwiLVwiICsgbW9udGggKyBcIi1cIiArIGkpLnZhbHVlT2YoKSA8XHJcbiAgICAgICAgICAgIGRheWpzKClcclxuICAgICAgICAgICAgICAuc3VidHJhY3QoOCwgXCJkYXlcIilcclxuICAgICAgICAgICAgICAudmFsdWVPZigpIHx8XHJcbiAgICAgICAgICBkYXlqcyh5ZWFyICsgXCItXCIgKyBtb250aCArIFwiLVwiICsgaSkudmFsdWVPZigpID5cclxuICAgICAgICAgICAgZGF5anMoKVxyXG4gICAgICAgICAgICAgIC5hZGQoMTQsIFwiZGF5XCIpXHJcbiAgICAgICAgICAgICAgLnZhbHVlT2YoKVxyXG4gICAgICAgICAgICA/IGZhbHNlXHJcbiAgICAgICAgICAgIDogdHJ1ZVxyXG4gICAgICB9KTtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIGRheWpzKHllYXIgKyBcIi1cIiArIG1vbnRoICsgXCItXCIgKyBpKS5pc1NhbWUoXHJcbiAgICAgICAgICBkYXlqcyhcclxuICAgICAgICAgICAgZGF5anMoKS55ZWFyKCkgKyBcIi1cIiArIChkYXlqcygpLm1vbnRoKCkgKyAxKSArIFwiLVwiICsgZGF5anMoKS5kYXRlKClcclxuICAgICAgICAgIClcclxuICAgICAgICApXHJcbiAgICAgICkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudEluZGV4ID0gdGhpcy5kYXRlLmxlbmd0aCAtIDE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuV2Vlayh3ZWVrKSB7XHJcbiAgICBzd2l0Y2ggKHdlZWspIHtcclxuICAgICAgY2FzZSAwOlxyXG4gICAgICAgIHJldHVybiBcIuaXpVwiO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIDE6XHJcbiAgICAgICAgcmV0dXJuIFwi5LiAXCI7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgMjpcclxuICAgICAgICByZXR1cm4gXCLkuoxcIjtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAzOlxyXG4gICAgICAgIHJldHVybiBcIuS4iVwiO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIDQ6XHJcbiAgICAgICAgcmV0dXJuIFwi5ZubXCI7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgNTpcclxuICAgICAgICByZXR1cm4gXCLkupRcIjtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSA2OlxyXG4gICAgICAgIHJldHVybiBcIuWFrVwiO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuICBvblNoYXJlQXBwTWVzc2FnZShyZXMpIHt9XHJcbiAgcmVnaW9uY2hhbmdlKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUudHlwZSk7XHJcbiAgfVxyXG4gIG1hcmtlcnRhcChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlLm1hcmtlcklkKTtcclxuICB9XHJcbiAgY29udHJvbHRhcChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlLmNvbnRyb2xJZCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==