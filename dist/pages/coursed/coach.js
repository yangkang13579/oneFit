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
      navigationBarTitleText: '预约',
      // navigationBarBackgroundColor: '#fff',
      navigationStyle: 'default'
    }, _this.components = {}, _this.data = {
      date: [],
      currentIndex: null,
      times: []
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
      this.returnTimes();
    }
  }, {
    key: 'mGetDate',
    value: function mGetDate(year, month) {
      var d = new Date(year, month, 0);
      return d.getDate();
    }
  }, {
    key: 'returnTimes',
    value: function returnTimes() {
      for (var i = 7; i < 24; i = i + 0.5) {
        this.times.push(this.twoTime(i));
      }
    }
  }, {
    key: 'twoTime',
    value: function twoTime(time) {
      if ((time + '').indexOf('.') === -1) {
        if (time < 10) {
          return '0' + (time + '').split('.')[0] + ':00';
        } else {
          return (time + '').split('.')[0] + ':00';
        }
      } else {
        if (time < 10) {
          return '0' + (time + '').split('.')[0] + ':30';
        } else {
          return (time + '').split('.')[0] + ':30';
        }
      }
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvYWNoLmpzIl0sIm5hbWVzIjpbIkNvYWNoIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm5hdmlnYXRpb25TdHlsZSIsImNvbXBvbmVudHMiLCJkYXRhIiwiZGF0ZSIsImN1cnJlbnRJbmRleCIsInRpbWVzIiwibWV0aG9kcyIsImdvQnV5Iiwid3giLCJuYXZpZ2F0ZVRvIiwidXJsIiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRoZW4iLCJ1c2VySW5mbyIsIiRhcHBseSIsInNldFN0b3JhZ2UiLCJrZXkiLCJKU09OIiwic3RyaW5naWZ5IiwiY2F0Y2giLCJlcnJvciIsInJldHVybkRhdGUiLCJtR2V0RGF0ZSIsInN1YnRyYWN0IiwieWVhciIsIm1vbnRoIiwiYWRkIiwicmV0dXJuVGltZXMiLCJkIiwiRGF0ZSIsImdldERhdGUiLCJpIiwicHVzaCIsInR3b1RpbWUiLCJ0aW1lIiwiaW5kZXhPZiIsInNwbGl0IiwiYXJ5Iiwid2VlayIsInJldHVybldlZWsiLCJkYXkiLCJpc1dlZWsiLCJ2YWx1ZU9mIiwiaXNTYW1lIiwibGVuZ3RoIiwicmVzIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJ0eXBlIiwibWFya2VySWQiLCJjb250cm9sSWQiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBSEE7OztJQUlxQkEsSzs7Ozs7Ozs7Ozs7Ozs7b0xBRW5CQyxNLEdBQVM7QUFDTEMsOEJBQXdCLElBRG5CO0FBRUw7QUFDQUMsdUJBQWdCO0FBSFgsSyxRQUtUQyxVLEdBQWEsRSxRQUNiQyxJLEdBQU87QUFDTEMsWUFBTSxFQUREO0FBRUxDLG9CQUFjLElBRlQ7QUFHTEMsYUFBTztBQUhGLEssUUFLUEMsTyxHQUFVO0FBQ05DLFdBRE0sbUJBQ0U7QUFDSkMsV0FBR0MsVUFBSCxDQUFjO0FBQ1ZDLGVBQUs7QUFESyxTQUFkO0FBR0g7QUFMSyxLOztBQVpWOzs7OztvQ0FvQmdCLENBQUU7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QTJCTSxDQUFqQyxFQUFvQ1ksTUFBcEMsQ0FBMkMscUJBQU0sdUJBQVFuQixJQUFSLEtBQWlCLEdBQWpCLElBQXdCLHVCQUFRQyxLQUFSLEtBQWtCLENBQTFDLElBQStDLEdBQS9DLEdBQXFELHVCQUFRdEIsSUFBUixFQUEzRCxDQUEzQyxDQUFKLEVBQTRIO0FBQzFILGVBQUtDLFlBQUwsR0FBb0IsS0FBS0QsSUFBTCxDQUFVeUMsTUFBVixHQUFtQixDQUF2QztBQUNEO0FBQ0Y7QUFDRjs7OytCQUNVTixJLEVBQU07QUFDZixjQUFPQSxJQUFQO0FBQ0MsYUFBSyxDQUFMO0FBQ0csaUJBQU8sR0FBUDtBQUNBO0FBQ0gsYUFBSyxDQUFMO0FBQ0csaUJBQU8sR0FBUDtBQUNBO0FBQ0gsYUFBSyxDQUFMO0FBQ0csaUJBQU8sR0FBUDtBQUNBO0FBQ0YsYUFBSyxDQUFMO0FBQ0UsaUJBQU8sR0FBUDtBQUNBO0FBQ0YsYUFBSyxDQUFMO0FBQ0UsaUJBQU8sR0FBUDtBQUNBO0FBQ0YsYUFBSyxDQUFMO0FBQ0UsaUJBQU8sR0FBUDtBQUNBO0FBQ0YsYUFBSyxDQUFMO0FBQ0UsaUJBQU8sR0FBUDtBQUNBO0FBckJKO0FBdUJEOzs7c0NBQ2lCTyxHLEVBQUssQ0FBRTs7O2lDQUNaQyxDLEVBQUc7QUFDWkMsY0FBUUMsR0FBUixDQUFZRixFQUFFRyxJQUFkO0FBQ0g7Ozs4QkFDU0gsQyxFQUFHO0FBQ1RDLGNBQVFDLEdBQVIsQ0FBWUYsRUFBRUksUUFBZDtBQUNIOzs7K0JBQ1VKLEMsRUFBRztBQUNWQyxjQUFRQyxHQUFSLENBQVlGLEVBQUVLLFNBQWQ7QUFDSDs7OztFQW5IZ0NDLGVBQUtDLEk7O2tCQUFuQnhELEsiLCJmaWxlIjoiY29hY2guanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyogZ2xvYmFsIHd4ICovXHJcbmltcG9ydCB3ZXB5IGZyb20gJ3dlcHknO1xyXG5pbXBvcnQgZGF5anMgZnJvbSAnZGF5anMnXHJcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vLi4vbWl4aW5zL3BhZ2UnO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb2FjaCBleHRlbmRzIHdlcHkucGFnZSB7XHJcbiAgLy8gbWl4aW5zID0gW1BhZ2VNaXhpbl07XHJcbiAgY29uZmlnID0ge1xyXG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn6aKE57qmJyxcclxuICAgICAgLy8gbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNmZmYnLFxyXG4gICAgICBuYXZpZ2F0aW9uU3R5bGU6J2RlZmF1bHQnXHJcbiAgfTtcclxuICBjb21wb25lbnRzID0ge307XHJcbiAgZGF0YSA9IHtcclxuICAgIGRhdGU6IFtdLFxyXG4gICAgY3VycmVudEluZGV4OiBudWxsLFxyXG4gICAgdGltZXM6IFtdXHJcbiAgfTtcclxuICBtZXRob2RzID0ge1xyXG4gICAgICBnb0J1eSgpIHtcclxuICAgICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgICAgICAgIHVybDogJ21lbWJlcidcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgfTtcclxuXHJcbiAgb25SZWFjaEJvdHRvbSgpIHt9XHJcblxyXG4gIHdoZW5BcHBSZWFkeVNob3coKSB7XHJcbiAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgndXNlci91c2VySW5mby5qc29uJywge30pXHJcbiAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICBjb25zdCB1c2VySW5mbyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICB3eC5zZXRTdG9yYWdlKHtcclxuICAgICAgICAgICAgICAgICAga2V5OiAndXNlckluZm8nLFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh1c2VySW5mbylcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHt9KTtcclxuICB9XHJcbiAgb25TaG93KCkge1xyXG4gICAgdGhpcy5kYXRlID0gW11cclxuICAgIHRoaXMucmV0dXJuRGF0ZSh0aGlzLm1HZXREYXRlKGRheWpzKCkuc3VidHJhY3QoMSwgJ21vbnRoJykueWVhcigpLCBkYXlqcygpLnN1YnRyYWN0KDEsICdtb250aCcpLm1vbnRoKCkpLCBkYXlqcygpLmRhdGUoKSwgZGF5anMoKS5zdWJ0cmFjdCgxLCAnbW9udGgnKS5tb250aCgpLCBkYXlqcygpLnN1YnRyYWN0KDEsICdtb250aCcpLnllYXIoKSlcclxuICAgIHRoaXMucmV0dXJuRGF0ZSh0aGlzLm1HZXREYXRlKGRheWpzKCkuc3VidHJhY3QoMCwgJ21vbnRoJykueWVhcigpLCBkYXlqcygpLnN1YnRyYWN0KDAsICdtb250aCcpLm1vbnRoKCkpLCAwLCBkYXlqcygpLnN1YnRyYWN0KDAsICdtb250aCcpLm1vbnRoKCksIGRheWpzKCkuc3VidHJhY3QoMCwgJ21vbnRoJykueWVhcigpKVxyXG4gICAgdGhpcy5yZXR1cm5EYXRlKHRoaXMubUdldERhdGUoZGF5anMoKS55ZWFyKCksIGRheWpzKCkubW9udGgoKSArIDEpLCAwLCBkYXlqcygpLm1vbnRoKCkgKyAxLCBkYXlqcygpLnllYXIoKSlcclxuICAgIHRoaXMucmV0dXJuRGF0ZSgxLCAwLCBkYXlqcygpLmFkZCgyLCAnbW9udGgnKS5tb250aCgpLCBkYXlqcygpLmFkZCgyLCAnbW9udGgnKS55ZWFyKCkpXHJcbiAgICB0aGlzLnJldHVyblRpbWVzKClcclxuICB9XHJcbiAgbUdldERhdGUoeWVhciwgbW9udGgpe1xyXG4gICAgdmFyIGQgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMCk7XHJcbiAgICByZXR1cm4gZC5nZXREYXRlKCk7XHJcbiAgfVxyXG4gIHJldHVyblRpbWVzKCkge1xyXG4gICAgZm9yIChsZXQgaSA9IDc7IGkgPCAyNDsgaSA9IGkrMC41KSB7XHJcbiAgICAgIHRoaXMudGltZXMucHVzaCh0aGlzLnR3b1RpbWUoaSkpXHJcbiAgICB9XHJcbiAgfVxyXG4gIHR3b1RpbWUodGltZSkge1xyXG4gICAgaWYgKCh0aW1lKycnKS5pbmRleE9mKCcuJykgPT09IC0xKSB7XHJcbiAgICAgIGlmICh0aW1lIDwgMTApIHtcclxuICAgICAgICByZXR1cm4gJzAnICsgKCh0aW1lKycnKS5zcGxpdCgnLicpWzBdKSArICc6MDAnXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuICgodGltZSsnJykuc3BsaXQoJy4nKVswXSkgKyAnOjAwJ1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAodGltZSA8IDEwKSB7XHJcbiAgICAgICAgcmV0dXJuICcwJyArICgodGltZSsnJykuc3BsaXQoJy4nKVswXSkgKyAnOjMwJ1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAoKHRpbWUrJycpLnNwbGl0KCcuJylbMF0pICsgJzozMCdcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm5EYXRlKGFyeSwgZGF0ZSwgbW9udGgsIHllYXIpIHtcclxuICAgIGZvcihsZXQgaSA9IDEgKyBkYXRlOyBpIDw9IGFyeTsgaSsrKSB7IFxyXG4gICAgICB0aGlzLmRhdGUucHVzaCh7XHJcbiAgICAgICAgZGF0ZTogaSxcclxuICAgICAgICBtb250aDogbW9udGggKyAn5pyIJyxcclxuICAgICAgICB3ZWVrOiAn5ZGoJyArIHRoaXMucmV0dXJuV2VlayhkYXlqcyh5ZWFyICsgJy0nICsgbW9udGggKyAnLScgKyBpKS5kYXkoKSksXHJcbiAgICAgICAgaXNXZWVrOiBkYXlqcyh5ZWFyICsgJy0nICsgbW9udGggKyAnLScgKyBpKS52YWx1ZU9mKCkgPCBkYXlqcygpLnN1YnRyYWN0KDgsICdkYXknKS52YWx1ZU9mKClcclxuICAgICAgICB8fCBkYXlqcyh5ZWFyICsgJy0nICsgbW9udGggKyAnLScgKyBpKS52YWx1ZU9mKCkgPiBkYXlqcygpLmFkZCgxNCwgJ2RheScpLnZhbHVlT2YoKSA/IGZhbHNlIDogdHJ1ZVxyXG4gICAgICB9KVxyXG4gICAgICBpZiAoZGF5anMoeWVhciArICctJyArIG1vbnRoICsgJy0nICsgaSkuaXNTYW1lKGRheWpzKGRheWpzKCkueWVhcigpICsgJy0nICsgKGRheWpzKCkubW9udGgoKSArIDEpICsgJy0nICsgZGF5anMoKS5kYXRlKCkpKSkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudEluZGV4ID0gdGhpcy5kYXRlLmxlbmd0aCAtIDFcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm5XZWVrKHdlZWspIHtcclxuICAgIHN3aXRjaCh3ZWVrKSB7XHJcbiAgICAgY2FzZSAwOlxyXG4gICAgICAgIHJldHVybiAn5pelJ1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgIGNhc2UgMTpcclxuICAgICAgICByZXR1cm4gJ+S4gCdcclxuICAgICAgICBicmVhaztcclxuICAgICBjYXNlIDI6XHJcbiAgICAgICAgcmV0dXJuICfkuownXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgMzpcclxuICAgICAgICByZXR1cm4gJ+S4iSdcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSA0OlxyXG4gICAgICAgIHJldHVybiAn5ZubJ1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIDU6XHJcbiAgICAgICAgcmV0dXJuICfkupQnXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgNjpcclxuICAgICAgICByZXR1cm4gJ+WFrSdcclxuICAgICAgICBicmVhaztcclxuICAgICB9IFxyXG4gIH1cclxuICBvblNoYXJlQXBwTWVzc2FnZShyZXMpIHt9XHJcbiAgcmVnaW9uY2hhbmdlKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZS50eXBlKTtcclxuICB9XHJcbiAgbWFya2VydGFwKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZS5tYXJrZXJJZCk7XHJcbiAgfVxyXG4gIGNvbnRyb2x0YXAoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlLmNvbnRyb2xJZCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==