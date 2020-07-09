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
      // navigationBarTitleText: '预约',
      // navigationBarBackgroundColor: '#fff',

    }, _this.components = {}, _this.data = {
      date: [],
      currentIndex: null,
      times: []
    }, _this.methods = {
      back: function back() {
        wx.navigateBack({
          delta: 1
        });
      },
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvYWNoLmpzIl0sIm5hbWVzIjpbIkNvYWNoIiwiY29uZmlnIiwiY29tcG9uZW50cyIsImRhdGEiLCJkYXRlIiwiY3VycmVudEluZGV4IiwidGltZXMiLCJtZXRob2RzIiwiYmFjayIsInd4IiwibmF2aWdhdGVCYWNrIiwiZGVsdGEiLCJnb0J1eSIsIm5hdmlnYXRlVG8iLCJ1cmwiLCJmZXRjaERhdGFQcm9taXNlIiwidGhlbiIsInVzZXJJbmZvIiwiJGFwcGx5Iiwic2V0U3RvcmFnZSIsImtleSIsIkpTT04iLCJzdHJpbmdpZnkiLCJjYXRjaCIsImVycm9yIiwicmV0dXJuRGF0ZSIsIm1HZXREYXRlIiwic3VidHJhY3QiLCJ5ZWFyIiwibW9udGgiLCJhZGQiLCJyZXR1cm5UaW1lcyIsImQiLCJEYXRlIiwiZ2V0RGF0ZSIsImkiLCJwdXNoIiwidHdvVGltZSIsInRpbWUiLCJpbmRleE9mIiwic3BsaXQiLCJhcnkiLCJ3ZWVrIiwicmV0dXJuV2VlayIsImRheSIsImlzV2VlayIsInZhbHVlT2YiLCJpc1NhbWUiLCJsZW5ndGgiLCJyZXMiLCJlIiwiY29uc29sZSIsImxvZyIsInR5cGUiLCJtYXJrZXJJZCIsImNvbnRyb2xJZCIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7QUFIQTs7O0lBSXFCQSxLOzs7Ozs7Ozs7Ozs7OztvTEFFbkJDLE0sR0FBUztBQUNMO0FBQ0E7O0FBRkssSyxRQUtUQyxVLEdBQWEsRSxRQUNiQyxJLEdBQU87QUFDTEMsWUFBTSxFQUREO0FBRUxDLG9CQUFjLElBRlQ7QUFHTEMsYUFBTztBQUhGLEssUUFLUEMsTyxHQUFVO0FBQ1JDLFVBRFEsa0JBQ0Y7QUFDSkMsV0FBR0MsWUFBSCxDQUFnQjtBQUNkQyxpQkFBTztBQURPLFNBQWhCO0FBR0QsT0FMTztBQU1OQyxXQU5NLG1CQU1FO0FBQ0pILFdBQUdJLFVBQUgsQ0FBYztBQUNWQyxlQUFLO0FBREssU0FBZDtB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LE9BQU8sR0FBUCxHQUFhQyxLQUFiLEdBQXFCLEdBQXJCLEdBQTJCTSxDQUFqQyxFQUFvQ1ksTUFBcEMsQ0FBMkMscUJBQU0sdUJBQVFuQixJQUFSLEtBQWlCLEdBQWpCLElBQXdCLHVCQUFRQyxLQUFSLEtBQWtCLENBQTFDLElBQStDLEdBQS9DLEdBQXFELHVCQUFRekIsSUFBUixFQUEzRCxDQUEzQyxDQUFKLEVBQTRIO0FBQzFILGVBQUtDLFlBQUwsR0FBb0IsS0FBS0QsSUFBTCxDQUFVNEMsTUFBVixHQUFtQixDQUF2QztBQUNEO0FBQ0Y7QUFDRjs7OytCQUNVTixJLEVBQU07QUFDZixjQUFPQSxJQUFQO0FBQ0MsYUFBSyxDQUFMO0FBQ0csaUJBQU8sR0FBUDtBQUNBO0FBQ0gsYUFBSyxDQUFMO0FBQ0csaUJBQU8sR0FBUDtBQUNBO0FBQ0gsYUFBSyxDQUFMO0FBQ0csaUJBQU8sR0FBUDtBQUNBO0FBQ0YsYUFBSyxDQUFMO0FBQ0UsaUJBQU8sR0FBUDtBQUNBO0FBQ0YsYUFBSyxDQUFMO0FBQ0UsaUJBQU8sR0FBUDtBQUNBO0FBQ0YsYUFBSyxDQUFMO0FBQ0UsaUJBQU8sR0FBUDtBQUNBO0FBQ0YsYUFBSyxDQUFMO0FBQ0UsaUJBQU8sR0FBUDtBQUNBO0FBckJKO0FBdUJEOzs7c0NBQ2lCTyxHLEVBQUssQ0FBRTs7O2lDQUNaQyxDLEVBQUc7QUFDWkMsY0FBUUMsR0FBUixDQUFZRixFQUFFRyxJQUFkO0FBQ0g7Ozs4QkFDU0gsQyxFQUFHO0FBQ1RDLGNBQVFDLEdBQVIsQ0FBWUYsRUFBRUksUUFBZDtBQUNIOzs7K0JBQ1VKLEMsRUFBRztBQUNWQyxjQUFRQyxHQUFSLENBQVlGLEVBQUVLLFNBQWQ7QUFDSDs7OztFQXhIZ0NDLGVBQUtDLEk7O2tCQUFuQnpELEsiLCJmaWxlIjoiY29hY2guanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyogZ2xvYmFsIHd4ICovXHJcbmltcG9ydCB3ZXB5IGZyb20gJ3dlcHknO1xyXG5pbXBvcnQgZGF5anMgZnJvbSAnZGF5anMnXHJcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vLi4vbWl4aW5zL3BhZ2UnO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb2FjaCBleHRlbmRzIHdlcHkucGFnZSB7XHJcbiAgLy8gbWl4aW5zID0gW1BhZ2VNaXhpbl07XHJcbiAgY29uZmlnID0ge1xyXG4gICAgICAvLyBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn6aKE57qmJyxcclxuICAgICAgLy8gbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNmZmYnLFxyXG5cclxuICB9O1xyXG4gIGNvbXBvbmVudHMgPSB7fTtcclxuICBkYXRhID0ge1xyXG4gICAgZGF0ZTogW10sXHJcbiAgICBjdXJyZW50SW5kZXg6IG51bGwsXHJcbiAgICB0aW1lczogW11cclxuICB9O1xyXG4gIG1ldGhvZHMgPSB7XHJcbiAgICBiYWNrKCl7XHJcbiAgICAgIHd4Lm5hdmlnYXRlQmFjayh7XHJcbiAgICAgICAgZGVsdGE6IDFcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICAgIGdvQnV5KCkge1xyXG4gICAgICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICAgICAgdXJsOiAnbWVtYmVyJ1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICB9O1xyXG5cclxuICBvblJlYWNoQm90dG9tKCkge31cclxuXHJcbiAgd2hlbkFwcFJlYWR5U2hvdygpIHtcclxuICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKCd1c2VyL3VzZXJJbmZvLmpzb24nLCB7fSlcclxuICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHVzZXJJbmZvID0gZGF0YTtcclxuICAgICAgICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgIHd4LnNldFN0b3JhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICBrZXk6ICd1c2VySW5mbycsXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHVzZXJJbmZvKVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge30pO1xyXG4gIH1cclxuICBvblNob3coKSB7XHJcbiAgICB0aGlzLmRhdGUgPSBbXVxyXG4gICAgdGhpcy5yZXR1cm5EYXRlKHRoaXMubUdldERhdGUoZGF5anMoKS5zdWJ0cmFjdCgxLCAnbW9udGgnKS55ZWFyKCksIGRheWpzKCkuc3VidHJhY3QoMSwgJ21vbnRoJykubW9udGgoKSksIGRheWpzKCkuZGF0ZSgpLCBkYXlqcygpLnN1YnRyYWN0KDEsICdtb250aCcpLm1vbnRoKCksIGRheWpzKCkuc3VidHJhY3QoMSwgJ21vbnRoJykueWVhcigpKVxyXG4gICAgdGhpcy5yZXR1cm5EYXRlKHRoaXMubUdldERhdGUoZGF5anMoKS5zdWJ0cmFjdCgwLCAnbW9udGgnKS55ZWFyKCksIGRheWpzKCkuc3VidHJhY3QoMCwgJ21vbnRoJykubW9udGgoKSksIDAsIGRheWpzKCkuc3VidHJhY3QoMCwgJ21vbnRoJykubW9udGgoKSwgZGF5anMoKS5zdWJ0cmFjdCgwLCAnbW9udGgnKS55ZWFyKCkpXHJcbiAgICB0aGlzLnJldHVybkRhdGUodGhpcy5tR2V0RGF0ZShkYXlqcygpLnllYXIoKSwgZGF5anMoKS5tb250aCgpICsgMSksIDAsIGRheWpzKCkubW9udGgoKSArIDEsIGRheWpzKCkueWVhcigpKVxyXG4gICAgdGhpcy5yZXR1cm5EYXRlKDEsIDAsIGRheWpzKCkuYWRkKDIsICdtb250aCcpLm1vbnRoKCksIGRheWpzKCkuYWRkKDIsICdtb250aCcpLnllYXIoKSlcclxuICAgIHRoaXMucmV0dXJuVGltZXMoKVxyXG4gIH1cclxuICBtR2V0RGF0ZSh5ZWFyLCBtb250aCl7XHJcbiAgICB2YXIgZCA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAwKTtcclxuICAgIHJldHVybiBkLmdldERhdGUoKTtcclxuICB9XHJcbiAgcmV0dXJuVGltZXMoKSB7XHJcbiAgICBmb3IgKGxldCBpID0gNzsgaSA8IDI0OyBpID0gaSswLjUpIHtcclxuICAgICAgdGhpcy50aW1lcy5wdXNoKHRoaXMudHdvVGltZShpKSlcclxuICAgIH1cclxuICB9XHJcbiAgdHdvVGltZSh0aW1lKSB7XHJcbiAgICBpZiAoKHRpbWUrJycpLmluZGV4T2YoJy4nKSA9PT0gLTEpIHtcclxuICAgICAgaWYgKHRpbWUgPCAxMCkge1xyXG4gICAgICAgIHJldHVybiAnMCcgKyAoKHRpbWUrJycpLnNwbGl0KCcuJylbMF0pICsgJzowMCdcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gKCh0aW1lKycnKS5zcGxpdCgnLicpWzBdKSArICc6MDAnXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICh0aW1lIDwgMTApIHtcclxuICAgICAgICByZXR1cm4gJzAnICsgKCh0aW1lKycnKS5zcGxpdCgnLicpWzBdKSArICc6MzAnXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuICgodGltZSsnJykuc3BsaXQoJy4nKVswXSkgKyAnOjMwJ1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybkRhdGUoYXJ5LCBkYXRlLCBtb250aCwgeWVhcikge1xyXG4gICAgZm9yKGxldCBpID0gMSArIGRhdGU7IGkgPD0gYXJ5OyBpKyspIHsgXHJcbiAgICAgIHRoaXMuZGF0ZS5wdXNoKHtcclxuICAgICAgICBkYXRlOiBpLFxyXG4gICAgICAgIG1vbnRoOiBtb250aCArICfmnIgnLFxyXG4gICAgICAgIHdlZWs6ICflkagnICsgdGhpcy5yZXR1cm5XZWVrKGRheWpzKHllYXIgKyAnLScgKyBtb250aCArICctJyArIGkpLmRheSgpKSxcclxuICAgICAgICBpc1dlZWs6IGRheWpzKHllYXIgKyAnLScgKyBtb250aCArICctJyArIGkpLnZhbHVlT2YoKSA8IGRheWpzKCkuc3VidHJhY3QoOCwgJ2RheScpLnZhbHVlT2YoKVxyXG4gICAgICAgIHx8IGRheWpzKHllYXIgKyAnLScgKyBtb250aCArICctJyArIGkpLnZhbHVlT2YoKSA+IGRheWpzKCkuYWRkKDE0LCAnZGF5JykudmFsdWVPZigpID8gZmFsc2UgOiB0cnVlXHJcbiAgICAgIH0pXHJcbiAgICAgIGlmIChkYXlqcyh5ZWFyICsgJy0nICsgbW9udGggKyAnLScgKyBpKS5pc1NhbWUoZGF5anMoZGF5anMoKS55ZWFyKCkgKyAnLScgKyAoZGF5anMoKS5tb250aCgpICsgMSkgKyAnLScgKyBkYXlqcygpLmRhdGUoKSkpKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50SW5kZXggPSB0aGlzLmRhdGUubGVuZ3RoIC0gMVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybldlZWsod2Vlaykge1xyXG4gICAgc3dpdGNoKHdlZWspIHtcclxuICAgICBjYXNlIDA6XHJcbiAgICAgICAgcmV0dXJuICfml6UnXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgY2FzZSAxOlxyXG4gICAgICAgIHJldHVybiAn5LiAJ1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgIGNhc2UgMjpcclxuICAgICAgICByZXR1cm4gJ+S6jCdcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAzOlxyXG4gICAgICAgIHJldHVybiAn5LiJJ1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIDQ6XHJcbiAgICAgICAgcmV0dXJuICflm5snXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgNTpcclxuICAgICAgICByZXR1cm4gJ+S6lCdcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSA2OlxyXG4gICAgICAgIHJldHVybiAn5YWtJ1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgIH0gXHJcbiAgfVxyXG4gIG9uU2hhcmVBcHBNZXNzYWdlKHJlcykge31cclxuICByZWdpb25jaGFuZ2UoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlLnR5cGUpO1xyXG4gIH1cclxuICBtYXJrZXJ0YXAoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlLm1hcmtlcklkKTtcclxuICB9XHJcbiAgY29udHJvbHRhcChlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUuY29udHJvbElkKTtcclxuICB9XHJcbn1cclxuIl19