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
      date: []
    }, _this.methods = {
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
      this.returnDate(this.mGetDate((0, _dayjs2.default)().year(), (0, _dayjs2.default)().month()), 0, (0, _dayjs2.default)().month() + 1, (0, _dayjs2.default)().year());
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
      console.log((0, _dayjs2.default)().add(14, 'day').format('YYYY-MM-DD'), (0, _dayjs2.default)().subtract(7, 'day').format('YYYY-MM-DD'), '111');
      for (var i = 1 + date; i <= ary; i++) {
        this.date.push({
          date: i,
          month: month + '月',
          week: '周' + this.returnWeek((0, _dayjs2.default)(year + '-' + month + '-' + i).day()),
          isWeek: (0, _dayjs2.default)(year + '-' + month + '-' + i).valueOf() < (0, _dayjs2.default)().subtract(8, 'day').valueOf() || (0, _dayjs2.default)(year + '-' + month + '-' + i).valueOf() > (0, _dayjs2.default)().add(14, 'day').valueOf() ? false : true
        });
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvdXJzZWQuanMiXSwibmFtZXMiOlsiQ291cnNlIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJjb21wb25lbnRzIiwiZGF0YSIsImxvYWRVc2VyIiwiaXNTaG93Iiwib3BlbiIsInRhYiIsImRhdGUiLCJtZXRob2RzIiwiZ29Db2FjaCIsInd4IiwibmF2aWdhdGVUbyIsInVybCIsInRhcF9jaCIsImNvbnNvbGUiLCJsb2ciLCJidG4iLCIkYXBwbHkiLCJ0YWJzIiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRoZW4iLCJ1c2VySW5mbyIsInNldFN0b3JhZ2UiLCJrZXkiLCJKU09OIiwic3RyaW5naWZ5IiwiY2F0Y2giLCJlcnJvciIsInJldHVybkRhdGUiLCJtR2V0RGF0ZSIsInN1YnRyYWN0IiwieWVhciIsIm1vbnRoIiwiZCIsIkRhdGUiLCJnZXREYXRlIiwiYXJ5IiwiYWRkIiwiZm9ybWF0IiwiaSIsInB1c2giLCJ3ZWVrIiwicmV0dXJuV2VlayIsImRheSIsImlzV2VlayIsInZhbHVlT2YiLCJyZXMiLCJlIiwidHlwZSIsIm1hcmtlcklkIiwiY29udHJvbElkIiwid2VweSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7OztBQUhBOzs7SUFJcUJBLE07Ozs7Ozs7Ozs7Ozs7O3NMQUVuQkMsTSxHQUFTO0FBQ1BDLDhCQUF3QixJQURqQjtBQUVQQyxvQ0FBOEI7QUFGdkIsSyxRQUlUQyxVLEdBQWEsRSxRQUNiQyxJLEdBQU87QUFDTEMsZ0JBQVUsSUFETDtBQUVMQyxjQUFRLElBRkg7QUFHTEMsWUFBSyxLQUhBO0FBSUxDLFdBQUssQ0FKQTtBQUtMQyxZQUFNO0FBTEQsSyxRQU9QQyxPLEdBQVU7QUFDUkMsYUFEUSxxQkFDQztBQUNMQyxXQUFHQyxVQUFILENBQWM7QUFDWkMsZUFBSztBQURPLFNBQWQ7QUFHSCxPQUxPO0FBTVJD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QUNFLGlCQUFPLEdBQVA7QUFDQTtBQXJCSjtBQXVCRDs7O3NDQUNpQkssRyxFQUFLLENBQUU7OztpQ0FDWkMsQyxFQUFHO0FBQ2RqQyxjQUFRQyxHQUFSLENBQVlnQyxFQUFFQyxJQUFkO0FBQ0Q7Ozs4QkFDU0QsQyxFQUFHO0FBQ1hqQyxjQUFRQyxHQUFSLENBQVlnQyxFQUFFRSxRQUFkO0FBQ0Q7OzsrQkFDVUYsQyxFQUFHO0FBQ1pqQyxjQUFRQyxHQUFSLENBQVlnQyxFQUFFRyxTQUFkO0FBQ0Q7Ozs7RUFoSGlDQyxlQUFLQyxJOztrQkFBcEJ2RCxNIiwiZmlsZSI6ImNvdXJzZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyogZ2xvYmFsIHd4ICovXHJcbmltcG9ydCB3ZXB5IGZyb20gXCJ3ZXB5XCI7XHJcbmltcG9ydCBkYXlqcyBmcm9tICdkYXlqcydcclxuaW1wb3J0IFBhZ2VNaXhpbiBmcm9tIFwiLi4vLi4vbWl4aW5zL3BhZ2VcIjtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ291cnNlIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICAvLyBtaXhpbnMgPSBbUGFnZU1peGluXTtcclxuICBjb25maWcgPSB7XHJcbiAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiBcIummlumhtVwiLFxyXG4gICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcclxuICB9O1xyXG4gIGNvbXBvbmVudHMgPSB7fTtcclxuICBkYXRhID0ge1xyXG4gICAgbG9hZFVzZXI6IHRydWUsXHJcbiAgICBpc1Nob3c6IHRydWUsXHJcbiAgICBvcGVuOmZhbHNlLFxyXG4gICAgdGFiOiAxLFxyXG4gICAgZGF0ZTogW11cclxuICB9O1xyXG4gIG1ldGhvZHMgPSB7XHJcbiAgICBnb0NvYWNoKCl7XHJcbiAgICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICB1cmw6ICdjb2FjaCdcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICB0YXBfY2goKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiNzc3XCIpXHJcbiAgICAgIGlmKHRoaXMuZGF0YS5vcGVuKXtcclxuICAgICAgICB0aGlzLm9wZW4gPSBmYWxzZTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICB0aGlzLm9wZW4gPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgYnRuKCkge1xyXG4gICAgICB0aGlzLmlzU2hvdyA9ICF0aGlzLmlzU2hvdztcclxuICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgIH0sXHJcbiAgICB0YWJzKCkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcInRoaXMudGFiXCIsIHRoaXMudGFiKTtcclxuICAgICAgaWYgKHRoaXMudGFiID09IDEpIHtcclxuICAgICAgICB0aGlzLnRhYiA9IDI7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy50YWIgPSAxO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICB9LFxyXG4gIH07XHJcbiAgb25SZWFjaEJvdHRvbSgpIHt9XHJcbiAgd2hlbkFwcFJlYWR5U2hvdygpIHtcclxuICAgIFxyXG4gICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKFwidXNlci91c2VySW5mby5qc29uXCIsIHt9KVxyXG4gICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICBjb25zdCB1c2VySW5mbyA9IGRhdGE7XHJcbiAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgICB3eC5zZXRTdG9yYWdlKHtcclxuICAgICAgICAgIGtleTogXCJ1c2VySW5mb1wiLFxyXG4gICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkodXNlckluZm8pXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge30pO1xyXG4gIH1cclxuICBvblNob3coKSB7XHJcbiAgICB0aGlzLmRhdGUgPSBbXVxyXG4gICAgdGhpcy5yZXR1cm5EYXRlKHRoaXMubUdldERhdGUoZGF5anMoKS5zdWJ0cmFjdCgxLCAnbW9udGgnKS55ZWFyKCksIGRheWpzKCkuc3VidHJhY3QoMSwgJ21vbnRoJykubW9udGgoKSksIGRheWpzKCkuZGF0ZSgpLCBkYXlqcygpLnN1YnRyYWN0KDEsICdtb250aCcpLm1vbnRoKCksIGRheWpzKCkuc3VidHJhY3QoMSwgJ21vbnRoJykueWVhcigpKVxyXG4gICAgdGhpcy5yZXR1cm5EYXRlKHRoaXMubUdldERhdGUoZGF5anMoKS5zdWJ0cmFjdCgwLCAnbW9udGgnKS55ZWFyKCksIGRheWpzKCkuc3VidHJhY3QoMCwgJ21vbnRoJykubW9udGgoKSksIDAsIGRheWpzKCkuc3VidHJhY3QoMCwgJ21vbnRoJykubW9udGgoKSwgZGF5anMoKS5zdWJ0cmFjdCgwLCAnbW9udGgnKS55ZWFyKCkpXHJcbiAgICB0aGlzLnJldHVybkRhdGUodGhpcy5tR2V0RGF0ZShkYXlqcygpLnllYXIoKSwgZGF5anMoKS5tb250aCgpKSwgMCwgZGF5anMoKS5tb250aCgpICsgMSwgZGF5anMoKS55ZWFyKCkpXHJcbiAgfVxyXG4gIG1HZXREYXRlKHllYXIsIG1vbnRoKXtcclxuICAgIHZhciBkID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDApO1xyXG4gICAgcmV0dXJuIGQuZ2V0RGF0ZSgpO1xyXG4gIH1cclxuICByZXR1cm5EYXRlKGFyeSwgZGF0ZSwgbW9udGgsIHllYXIpIHtcclxuICAgIGNvbnNvbGUubG9nKGRheWpzKCkuYWRkKDE0LCAnZGF5JykuZm9ybWF0KCdZWVlZLU1NLUREJyksIGRheWpzKCkuc3VidHJhY3QoNywgJ2RheScpLmZvcm1hdCgnWVlZWS1NTS1ERCcpLCAnMTExJylcclxuICAgIGZvcihsZXQgaSA9IDEgKyBkYXRlOyBpIDw9IGFyeTsgaSsrKSB7IFxyXG4gICAgICB0aGlzLmRhdGUucHVzaCh7XHJcbiAgICAgICAgZGF0ZTogaSxcclxuICAgICAgICBtb250aDogbW9udGggKyAn5pyIJyxcclxuICAgICAgICB3ZWVrOiAn5ZGoJyArIHRoaXMucmV0dXJuV2VlayhkYXlqcyh5ZWFyICsgJy0nICsgbW9udGggKyAnLScgKyBpKS5kYXkoKSksXHJcbiAgICAgICAgaXNXZWVrOiBkYXlqcyh5ZWFyICsgJy0nICsgbW9udGggKyAnLScgKyBpKS52YWx1ZU9mKCkgPCBkYXlqcygpLnN1YnRyYWN0KDgsICdkYXknKS52YWx1ZU9mKClcclxuICAgICAgICB8fCBkYXlqcyh5ZWFyICsgJy0nICsgbW9udGggKyAnLScgKyBpKS52YWx1ZU9mKCkgPiBkYXlqcygpLmFkZCgxNCwgJ2RheScpLnZhbHVlT2YoKSA/IGZhbHNlIDogdHJ1ZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm5XZWVrKHdlZWspIHtcclxuICAgIHN3aXRjaCh3ZWVrKSB7XHJcbiAgICAgY2FzZSAwOlxyXG4gICAgICAgIHJldHVybiAn5pelJ1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgIGNhc2UgMTpcclxuICAgICAgICByZXR1cm4gJ+S4gCdcclxuICAgICAgICBicmVhaztcclxuICAgICBjYXNlIDI6XHJcbiAgICAgICAgcmV0dXJuICfkuownXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgMzpcclxuICAgICAgICByZXR1cm4gJ+S4iSdcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSA0OlxyXG4gICAgICAgIHJldHVybiAn5ZubJ1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIDU6XHJcbiAgICAgICAgcmV0dXJuICfkupQnXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgNjpcclxuICAgICAgICByZXR1cm4gJ+WFrSdcclxuICAgICAgICBicmVhaztcclxuICAgICB9IFxyXG4gIH1cclxuICBvblNoYXJlQXBwTWVzc2FnZShyZXMpIHt9XHJcbiAgcmVnaW9uY2hhbmdlKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUudHlwZSk7XHJcbiAgfVxyXG4gIG1hcmtlcnRhcChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlLm1hcmtlcklkKTtcclxuICB9XHJcbiAgY29udHJvbHRhcChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlLmNvbnRyb2xJZCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==