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

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Course.__proto__ || Object.getPrototypeOf(Course)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
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
      // detail(){
      //   wx.navigateTo({
      //     url: 'reserve'
      //   })
      // },
      detail: function detail() {
        wx.navigateTo({
          url: 'coachDetail'
        });
      },
      tolesson: function tolesson() {
        wx.navigateTo({
          url: 'lesson'
        });
      },
      btnTo: function btnTo() {},
      goCoach: function goCoach() {
        wx.navigateTo({
          url: 'coach'
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
      btn: function btn() {
        this.isShow = !this.isShow;
        this.$apply();
      },
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
  // mixins = [PageMixin];


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
      this.returnDate(this.mGetDate((0, _dayjs2.default)().subtract(1, 'month').year(), (0, _dayjs2.default)().subtract(1, 'month').month()), (0, _dayjs2.default)().date(), (0, _dayjs2.default)().subtract(1, 'month').month(), (0, _dayjs2.default)().subtract(1, 'month').year());
      this.returnDate(this.mGetDate((0, _dayjs2.default)().subtract(0, 'month').year(), (0, _dayjs2.default)().subtract(0, 'month').month()), 0, (0, _dayjs2.default)().subtract(0, 'month').month(), (0, _dayjs2.default)().subtract(0, 'month').year());
      this.returnDate(this.mGetDate((0, _dayjs2.default)().year(), (0, _dayjs2.default)().month() + 1), 0, (0, _dayjs2.default)().month() + 1, (0, _dayjs2.default)().year());
      this.returnDate(1, 0, (0, _dayjs2.default)().add(2, 'month').month(), (0, _dayjs2.default)().add(2, 'month').year());
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
          month: month + '月',
          week: '周' + this.returnWeek((0, _dayjs2.default)(year + '-' + month + '-' + i).day()),
          isWeek: (0, _dayjs2.default)(year + '-' + month + '-' + i).valueOf() < (0, _dayjs2.default)().subtract(8, 'day').valueOf() || (0, _dayjs2.default)(year + '-' + month + '-' + i).valueOf() > (0, _dayjs2.default)().add(14, 'day').valueOf() ? false : true
        });
        if ((0, _dayjs2.default)(year + '-' + month + '-' + i).isSame((0, _dayjs2.default)((0, _dayjs2.default)().year() + '-' + ((0, _dayjs2.default)().month() + 1) + '-' + (0, _dayjs2.default)().date()))) {
          this.currentIndex = this.date.length - 1;
        }
      }
    }
  }, {
    key: "returnWeek",
    value: function returnWeek(week) {
      switch (week) {
        case 0:
          return '日';
          break;
        case 1:
          return '一';
          break;
        case 2:
          return '二';
          break;
        case 3:
          return '三';
          break;
        case 4:
          return '四';
          break;
        case 5:
          return '五';
          break;
        case 6:
          return '六';
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvdXJzZWQuanMiXSwibmFtZXMiOlsiQ291cnNlIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJjb21wb25lbnRzIiwiZGF0YSIsImxvYWRVc2VyIiwiaXNTaG93Iiwib3BlbiIsInRhYiIsImRhdGUiLCJjdXJyZW50SW5kZXgiLCJtZXRob2RzIiwiZGV0YWlsIiwid3giLCJuYXZpZ2F0ZVRvIiwidXJsIiwidG9sZXNzb24iLCJidG5UbyIsImdvQ29hY2giLCJ0YXBfY2giLCJjb25zb2xlIiwibG9nIiwiYnRuIiwiJGFwcGx5IiwidGFicyIsImdldERhdGUiLCJlIiwiY3VycmVudFRhcmdldCIsImRhdGFzZXQiLCJpbmRleCIsImZldGNoRGF0YVByb21pc2UiLCJ0aGVuIiwidXNlckluZm8iLCJzZXRTdG9yYWdlIiwia2V5IiwiSlNPTiIsInN0cmluZ2lmeSIsImNhdGNoIiwiZXJyb3IiLCJyZXR1cm5EYXRlIiwibUdldERhdGUiLCJzdWJ0cmFjdCIsInllYXIiLCJtb250aCIsImFkZCIsImQiLCJEYXRlIiwiYXJ5IiwiaSIsInB1c2giLCJ3ZWVrIiwicmV0dXJuV2VlayIsImRheSIsImlzV2VlayIsInZhbHVlT2YiLCJpc1NhbWUiLCJsZW5ndGgiLCJyZXMiLCJ0eXBlIiwibWFya2VySWQiLCJjb250cm9sSWQiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBSEE7OztJQUlxQkEsTTs7Ozs7Ozs7Ozs7Ozs7c0xBRW5CQyxNLEdBQVM7QUFDUEMsOEJBQXdCLElBRGpCO0FBRVBDLG9DQUE4QjtBQUZ2QixLLFFBSVRDLFUsR0FBYSxFLFFBQ2JDLEksR0FBTztBQUNMQyxnQkFBVSxJQURMO0FBRUxDLGNBQVEsSUFGSDtBQUdMQyxZQUFLLEtBSEE7QUFJTEMsV0FBSyxDQUpBO0FBS0xDLFlBQU0sRUFMRDtBQU1M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SWlDQyxlQUFLQyxJOztrQkFBcEIvRCxNIiwiZmlsZSI6ImNvdXJzZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyogZ2xvYmFsIHd4ICovXHJcbmltcG9ydCB3ZXB5IGZyb20gXCJ3ZXB5XCI7XHJcbmltcG9ydCBkYXlqcyBmcm9tICdkYXlqcydcclxuaW1wb3J0IFBhZ2VNaXhpbiBmcm9tIFwiLi4vLi4vbWl4aW5zL3BhZ2VcIjtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ291cnNlIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICAvLyBtaXhpbnMgPSBbUGFnZU1peGluXTtcclxuICBjb25maWcgPSB7XHJcbiAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiBcIummlumhtVwiLFxyXG4gICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcclxuICB9O1xyXG4gIGNvbXBvbmVudHMgPSB7fTtcclxuICBkYXRhID0ge1xyXG4gICAgbG9hZFVzZXI6IHRydWUsXHJcbiAgICBpc1Nob3c6IHRydWUsXHJcbiAgICBvcGVuOmZhbHNlLFxyXG4gICAgdGFiOiAxLFxyXG4gICAgZGF0ZTogW10sXHJcbiAgICBjdXJyZW50SW5kZXg6IG51bGxcclxuICB9O1xyXG4gIG1ldGhvZHMgPSB7XHJcbiAgICAvLyBkZXRhaWwoKXtcclxuICAgIC8vICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAvLyAgICAgdXJsOiAncmVzZXJ2ZSdcclxuICAgIC8vICAgfSlcclxuICAgIC8vIH0sXHJcbiAgICAgZGV0YWlsKCl7XHJcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgIHVybDogJ2NvYWNoRGV0YWlsJ1xyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIHRvbGVzc29uKCl7XHJcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgIHVybDogJ2xlc3NvbidcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBidG5Ubygpe1xyXG5cclxuICAgIH0sXHJcbiAgICBnb0NvYWNoKCl7XHJcbiAgICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICB1cmw6ICdjb2FjaCdcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICB0YXBfY2goKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiNzc3XCIpXHJcbiAgICAgIGlmKHRoaXMuZGF0YS5vcGVuKXtcclxuICAgICAgICB0aGlzLm9wZW4gPSBmYWxzZTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICB0aGlzLm9wZW4gPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgYnRuKCkge1xyXG4gICAgICB0aGlzLmlzU2hvdyA9ICF0aGlzLmlzU2hvdztcclxuICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgIH0sXHJcbiAgICB0YWJzKCkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcInRoaXMudGFiXCIsIHRoaXMudGFiKTtcclxuICAgICAgaWYgKHRoaXMudGFiID09IDEpIHtcclxuICAgICAgICB0aGlzLnRhYiA9IDI7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy50YWIgPSAxO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICB9LFxyXG4gICAgZ2V0RGF0ZShlKSB7XHJcbiAgICAgIHRoaXMuY3VycmVudEluZGV4ID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXhcclxuICAgIH0sXHJcbiAgfTtcclxuICBvblJlYWNoQm90dG9tKCkge31cclxuICB3aGVuQXBwUmVhZHlTaG93KCkge1xyXG4gICAgXHJcbiAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoXCJ1c2VyL3VzZXJJbmZvLmpzb25cIiwge30pXHJcbiAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgIGNvbnN0IHVzZXJJbmZvID0gZGF0YTtcclxuICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICAgIHd4LnNldFN0b3JhZ2Uoe1xyXG4gICAgICAgICAga2V5OiBcInVzZXJJbmZvXCIsXHJcbiAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh1c2VySW5mbylcclxuICAgICAgICB9KTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7fSk7XHJcbiAgfVxyXG4gIG9uU2hvdygpIHtcclxuICAgIHRoaXMuZGF0ZSA9IFtdXHJcbiAgICB0aGlzLnJldHVybkRhdGUodGhpcy5tR2V0RGF0ZShkYXlqcygpLnN1YnRyYWN0KDEsICdtb250aCcpLnllYXIoKSwgZGF5anMoKS5zdWJ0cmFjdCgxLCAnbW9udGgnKS5tb250aCgpKSwgZGF5anMoKS5kYXRlKCksIGRheWpzKCkuc3VidHJhY3QoMSwgJ21vbnRoJykubW9udGgoKSwgZGF5anMoKS5zdWJ0cmFjdCgxLCAnbW9udGgnKS55ZWFyKCkpXHJcbiAgICB0aGlzLnJldHVybkRhdGUodGhpcy5tR2V0RGF0ZShkYXlqcygpLnN1YnRyYWN0KDAsICdtb250aCcpLnllYXIoKSwgZGF5anMoKS5zdWJ0cmFjdCgwLCAnbW9udGgnKS5tb250aCgpKSwgMCwgZGF5anMoKS5zdWJ0cmFjdCgwLCAnbW9udGgnKS5tb250aCgpLCBkYXlqcygpLnN1YnRyYWN0KDAsICdtb250aCcpLnllYXIoKSlcclxuICAgIHRoaXMucmV0dXJuRGF0ZSh0aGlzLm1HZXREYXRlKGRheWpzKCkueWVhcigpLCBkYXlqcygpLm1vbnRoKCkgKyAxKSwgMCwgZGF5anMoKS5tb250aCgpICsgMSwgZGF5anMoKS55ZWFyKCkpXHJcbiAgICB0aGlzLnJldHVybkRhdGUoMSwgMCwgZGF5anMoKS5hZGQoMiwgJ21vbnRoJykubW9udGgoKSwgZGF5anMoKS5hZGQoMiwgJ21vbnRoJykueWVhcigpKVxyXG4gIH1cclxuICBtR2V0RGF0ZSh5ZWFyLCBtb250aCl7XHJcbiAgICB2YXIgZCA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAwKTtcclxuICAgIHJldHVybiBkLmdldERhdGUoKTtcclxuICB9XHJcbiAgcmV0dXJuRGF0ZShhcnksIGRhdGUsIG1vbnRoLCB5ZWFyKSB7XHJcbiAgICBmb3IobGV0IGkgPSAxICsgZGF0ZTsgaSA8PSBhcnk7IGkrKykgeyBcclxuICAgICAgdGhpcy5kYXRlLnB1c2goe1xyXG4gICAgICAgIGRhdGU6IGksXHJcbiAgICAgICAgbW9udGg6IG1vbnRoICsgJ+aciCcsXHJcbiAgICAgICAgd2VlazogJ+WRqCcgKyB0aGlzLnJldHVybldlZWsoZGF5anMoeWVhciArICctJyArIG1vbnRoICsgJy0nICsgaSkuZGF5KCkpLFxyXG4gICAgICAgIGlzV2VlazogZGF5anMoeWVhciArICctJyArIG1vbnRoICsgJy0nICsgaSkudmFsdWVPZigpIDwgZGF5anMoKS5zdWJ0cmFjdCg4LCAnZGF5JykudmFsdWVPZigpXHJcbiAgICAgICAgfHwgZGF5anMoeWVhciArICctJyArIG1vbnRoICsgJy0nICsgaSkudmFsdWVPZigpID4gZGF5anMoKS5hZGQoMTQsICdkYXknKS52YWx1ZU9mKCkgPyBmYWxzZSA6IHRydWVcclxuICAgICAgfSlcclxuICAgICAgaWYgKGRheWpzKHllYXIgKyAnLScgKyBtb250aCArICctJyArIGkpLmlzU2FtZShkYXlqcyhkYXlqcygpLnllYXIoKSArICctJyArIChkYXlqcygpLm1vbnRoKCkgKyAxKSArICctJyArIGRheWpzKCkuZGF0ZSgpKSkpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IHRoaXMuZGF0ZS5sZW5ndGggLSAxXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuV2Vlayh3ZWVrKSB7XHJcbiAgICBzd2l0Y2god2Vlaykge1xyXG4gICAgIGNhc2UgMDpcclxuICAgICAgICByZXR1cm4gJ+aXpSdcclxuICAgICAgICBicmVhaztcclxuICAgICBjYXNlIDE6XHJcbiAgICAgICAgcmV0dXJuICfkuIAnXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgY2FzZSAyOlxyXG4gICAgICAgIHJldHVybiAn5LqMJ1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIDM6XHJcbiAgICAgICAgcmV0dXJuICfkuIknXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgNDpcclxuICAgICAgICByZXR1cm4gJ+WbmydcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSA1OlxyXG4gICAgICAgIHJldHVybiAn5LqUJ1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIDY6XHJcbiAgICAgICAgcmV0dXJuICflha0nXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgfSBcclxuICB9XHJcbiAgb25TaGFyZUFwcE1lc3NhZ2UocmVzKSB7fVxyXG4gIHJlZ2lvbmNoYW5nZShlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlLnR5cGUpO1xyXG4gIH1cclxuICBtYXJrZXJ0YXAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZS5tYXJrZXJJZCk7XHJcbiAgfVxyXG4gIGNvbnRyb2x0YXAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZS5jb250cm9sSWQpO1xyXG4gIH1cclxufVxyXG4iXX0=