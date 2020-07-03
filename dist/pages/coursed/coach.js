'use strict';

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


var Coach = function (_wepy$page) {
  _inherits(Coach, _wepy$page);

  function Coach() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Coach);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Coach.__proto__ || Object.getPrototypeOf(Coach)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
      navigationBarTitleText: '首页',
      navigationBarBackgroundColor: '#fff'
    }, _this.components = {}, _this.data = {
      date: [],
      currentIndex: null
    }, _this.methods = {
      goBuy: function goBuy() {
        wx.navigateTo({
          url: 'member'
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }
  // mixins = [PageMixin];


  _createClass(Coach, [{
    key: 'onReachBottom',
    value: function onReachBottom() {}
  }, {
    key: 'whenAppReadyShow',
    value: function whenAppReadyShow() {
      var _this2 = this;

      this.fetchDataPromise('user/userInfo.json', {}).then(function (data) {
        var userInfo = data;
        _this2.$apply();
        wx.setStorage({
          key: 'userInfo',
          data: JSON.stringify(userInfo)
        });
      }).catch(function (error) {});
    }
  }, {
    key: 'onShow',
    value: function onShow() {
      this.date = [];
      this.returnDate(this.mGetDate((0, _dayjs2.default)().subtract(1, 'month').year(), (0, _dayjs2.default)().subtract(1, 'month').month()), (0, _dayjs2.default)().date(), (0, _dayjs2.default)().subtract(1, 'month').month(), (0, _dayjs2.default)().subtract(1, 'month').year());
      this.returnDate(this.mGetDate((0, _dayjs2.default)().subtract(0, 'month').year(), (0, _dayjs2.default)().subtract(0, 'month').month()), 0, (0, _dayjs2.default)().subtract(0, 'month').month(), (0, _dayjs2.default)().subtract(0, 'month').year());
      this.returnDate(this.mGetDate((0, _dayjs2.default)().year(), (0, _dayjs2.default)().month() + 1), 0, (0, _dayjs2.default)().month() + 1, (0, _dayjs2.default)().year());
      this.returnDate(1, 0, (0, _dayjs2.default)().add(2, 'month').month(), (0, _dayjs2.default)().add(2, 'month').year());
    }
  }, {
    key: 'mGetDate',
    value: function mGetDate(year, month) {
      var d = new Date(year, month, 0);
      return d.getDate();
    }
  }, {
    key: 'returnDate',
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
    key: 'returnWeek',
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
    key: 'onShareAppMessage',
    value: function onShareAppMessage(res) {}
  }, {
    key: 'regionchange',
    value: function regionchange(e) {
      console.log(e.type);
    }
  }, {
    key: 'markertap',
    value: function markertap(e) {
      console.log(e.markerId);
    }
  }, {
    key: 'controltap',
    value: function controltap(e) {
      console.log(e.controlId);
    }
  }]);

  return Coach;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Coach , 'pages/coursed/coach'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvYWNoLmpzIl0sIm5hbWVzIjpbIkNvYWNoIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJjb21wb25lbnRzIiwiZGF0YSIsImRhdGUiLCJjdXJyZW50SW5kZXgiLCJtZXRob2RzIiwiZ29CdXkiLCJ3eCIsIm5hdmlnYXRlVG8iLCJ1cmwiLCJmZXRjaERhdGFQcm9taXNlIiwidGhlbiIsInVzZXJJbmZvIiwiJGFwcGx5Iiwic2V0U3RvcmFnZSIsImtleSIsIkpTT04iLCJzdHJpbmdpZnkiLCJjYXRjaCIsImVycm9yIiwicmV0dXJuRGF0ZSIsIm1HZXREYXRlIiwic3VidHJhY3QiLCJ5ZWFyIiwibW9udGgiLCJhZGQiLCJkIiwiRGF0ZSIsImdldERhdGUiLCJhcnkiLCJpIiwicHVzaCIsIndlZWsiLCJyZXR1cm5XZWVrIiwiZGF5IiwiaXNXZWVrIiwidmFsdWVPZiIsImlzU2FtZSIsImxlbmd0aCIsInJlcyIsImUiLCJjb25zb2xlIiwibG9nIiwidHlwZSIsIm1hcmtlcklkIiwiY29udHJvbElkIiwid2VweSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7OztBQUhBOzs7SUFJcUJBLEs7Ozs7Ozs7Ozs7Ozs7O29MQUVuQkMsTSxHQUFTO0FBQ0xDLDhCQUF3QixJQURuQjtBQUVMQyxvQ0FBOEI7QUFGekIsSyxRQUlUQyxVLEdBQWEsRSxRQUNiQyxJLEdBQU87QUFDTEMsWUFBTSxFQUREO0FBRUxDLG9CQUFjO0FBRlQsSyxRQUlQQyxPLEdBQVU7QUFDTkMsV0FETSxtQkFDRTtBQUNKQyxXQUFHQyxVQUFILENBQWM7QUFDVkMsZUFBSztBQURLLFNBQWQ7QUFHSDtBQUxLLEs7O0FBVlY7Ozs7O29DQWtCZ0IsQ0FBRTs7O3VDQUVDO0FBQUE7O0FBQ2YsV0FBS0MsZ0JBQUwsQ0FBc0Isb0JBQXRCLEVBQTRDLEVBQTVDLEVBQ0tDLElB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IGdsb2JhbCB3eCAqL1xyXG5pbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcclxuaW1wb3J0IGRheWpzIGZyb20gJ2RheWpzJ1xyXG5pbXBvcnQgUGFnZU1peGluIGZyb20gJy4uLy4uL21peGlucy9wYWdlJztcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29hY2ggZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gIC8vIG1peGlucyA9IFtQYWdlTWl4aW5dO1xyXG4gIGNvbmZpZyA9IHtcclxuICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+mmlumhtScsXHJcbiAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJ1xyXG4gIH07XHJcbiAgY29tcG9uZW50cyA9IHt9O1xyXG4gIGRhdGEgPSB7XHJcbiAgICBkYXRlOiBbXSxcclxuICAgIGN1cnJlbnRJbmRleDogbnVsbFxyXG4gIH07XHJcbiAgbWV0aG9kcyA9IHtcclxuICAgICAgZ29CdXkoKSB7XHJcbiAgICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICAgICAgICB1cmw6ICdtZW1iZXInXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gIH07XHJcblxyXG4gIG9uUmVhY2hCb3R0b20oKSB7fVxyXG5cclxuICB3aGVuQXBwUmVhZHlTaG93KCkge1xyXG4gICAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3VzZXIvdXNlckluZm8uanNvbicsIHt9KVxyXG4gICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3QgdXNlckluZm8gPSBkYXRhO1xyXG4gICAgICAgICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgd3guc2V0U3RvcmFnZSh7XHJcbiAgICAgICAgICAgICAgICAgIGtleTogJ3VzZXJJbmZvJyxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkodXNlckluZm8pXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7fSk7XHJcbiAgfVxyXG4gIG9uU2hvdygpIHtcclxuICAgIHRoaXMuZGF0ZSA9IFtdXHJcbiAgICB0aGlzLnJldHVybkRhdGUodGhpcy5tR2V0RGF0ZShkYXlqcygpLnN1YnRyYWN0KDEsICdtb250aCcpLnllYXIoKSwgZGF5anMoKS5zdWJ0cmFjdCgxLCAnbW9udGgnKS5tb250aCgpKSwgZGF5anMoKS5kYXRlKCksIGRheWpzKCkuc3VidHJhY3QoMSwgJ21vbnRoJykubW9udGgoKSwgZGF5anMoKS5zdWJ0cmFjdCgxLCAnbW9udGgnKS55ZWFyKCkpXHJcbiAgICB0aGlzLnJldHVybkRhdGUodGhpcy5tR2V0RGF0ZShkYXlqcygpLnN1YnRyYWN0KDAsICdtb250aCcpLnllYXIoKSwgZGF5anMoKS5zdWJ0cmFjdCgwLCAnbW9udGgnKS5tb250aCgpKSwgMCwgZGF5anMoKS5zdWJ0cmFjdCgwLCAnbW9udGgnKS5tb250aCgpLCBkYXlqcygpLnN1YnRyYWN0KDAsICdtb250aCcpLnllYXIoKSlcclxuICAgIHRoaXMucmV0dXJuRGF0ZSh0aGlzLm1HZXREYXRlKGRheWpzKCkueWVhcigpLCBkYXlqcygpLm1vbnRoKCkgKyAxKSwgMCwgZGF5anMoKS5tb250aCgpICsgMSwgZGF5anMoKS55ZWFyKCkpXHJcbiAgICB0aGlzLnJldHVybkRhdGUoMSwgMCwgZGF5anMoKS5hZGQoMiwgJ21vbnRoJykubW9udGgoKSwgZGF5anMoKS5hZGQoMiwgJ21vbnRoJykueWVhcigpKVxyXG4gIH1cclxuICBtR2V0RGF0ZSh5ZWFyLCBtb250aCl7XHJcbiAgICB2YXIgZCA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAwKTtcclxuICAgIHJldHVybiBkLmdldERhdGUoKTtcclxuICB9XHJcbiAgcmV0dXJuRGF0ZShhcnksIGRhdGUsIG1vbnRoLCB5ZWFyKSB7XHJcbiAgICBmb3IobGV0IGkgPSAxICsgZGF0ZTsgaSA8PSBhcnk7IGkrKykgeyBcclxuICAgICAgdGhpcy5kYXRlLnB1c2goe1xyXG4gICAgICAgIGRhdGU6IGksXHJcbiAgICAgICAgbW9udGg6IG1vbnRoICsgJ+aciCcsXHJcbiAgICAgICAgd2VlazogJ+WRqCcgKyB0aGlzLnJldHVybldlZWsoZGF5anMoeWVhciArICctJyArIG1vbnRoICsgJy0nICsgaSkuZGF5KCkpLFxyXG4gICAgICAgIGlzV2VlazogZGF5anMoeWVhciArICctJyArIG1vbnRoICsgJy0nICsgaSkudmFsdWVPZigpIDwgZGF5anMoKS5zdWJ0cmFjdCg4LCAnZGF5JykudmFsdWVPZigpXHJcbiAgICAgICAgfHwgZGF5anMoeWVhciArICctJyArIG1vbnRoICsgJy0nICsgaSkudmFsdWVPZigpID4gZGF5anMoKS5hZGQoMTQsICdkYXknKS52YWx1ZU9mKCkgPyBmYWxzZSA6IHRydWVcclxuICAgICAgfSlcclxuICAgICAgaWYgKGRheWpzKHllYXIgKyAnLScgKyBtb250aCArICctJyArIGkpLmlzU2FtZShkYXlqcyhkYXlqcygpLnllYXIoKSArICctJyArIChkYXlqcygpLm1vbnRoKCkgKyAxKSArICctJyArIGRheWpzKCkuZGF0ZSgpKSkpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IHRoaXMuZGF0ZS5sZW5ndGggLSAxXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuV2Vlayh3ZWVrKSB7XHJcbiAgICBzd2l0Y2god2Vlaykge1xyXG4gICAgIGNhc2UgMDpcclxuICAgICAgICByZXR1cm4gJ+aXpSdcclxuICAgICAgICBicmVhaztcclxuICAgICBjYXNlIDE6XHJcbiAgICAgICAgcmV0dXJuICfkuIAnXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgY2FzZSAyOlxyXG4gICAgICAgIHJldHVybiAn5LqMJ1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIDM6XHJcbiAgICAgICAgcmV0dXJuICfkuIknXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgNDpcclxuICAgICAgICByZXR1cm4gJ+WbmydcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSA1OlxyXG4gICAgICAgIHJldHVybiAn5LqUJ1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIDY6XHJcbiAgICAgICAgcmV0dXJuICflha0nXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgfSBcclxuICB9XHJcbiAgb25TaGFyZUFwcE1lc3NhZ2UocmVzKSB7fVxyXG4gIHJlZ2lvbmNoYW5nZShlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUudHlwZSk7XHJcbiAgfVxyXG4gIG1hcmtlcnRhcChlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUubWFya2VySWQpO1xyXG4gIH1cclxuICBjb250cm9sdGFwKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZS5jb250cm9sSWQpO1xyXG4gIH1cclxufVxyXG4iXX0=