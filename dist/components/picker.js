'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TimePicker = function (_wepy$component) {
  _inherits(TimePicker, _wepy$component);

  function TimePicker() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TimePicker);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TimePicker.__proto__ || Object.getPrototypeOf(TimePicker)).call.apply(_ref, [this].concat(args))), _this), _this.props = {
      time: {
        type: String,
        default: ''
      }
    }, _this.data = {
      years: [],
      months: [],
      days: [],
      hours: [],
      minutes: [],
      second: [],
      multiArray: [], // 选择范围
      multiIndex: [0, 9, 16, 10, 17], // 选中值数组
      choose_year: '',
      yearIndex: 0
      // 设置初始值
    }, _this.methods = {
      // 监听picker的滚动事件
      bindMultiPickerColumnChange: function bindMultiPickerColumnChange(e) {
        // 获取年份
        if (e.detail.column === 0) {
          this.choose_year = this.multiArray[e.detail.column][e.detail.value];
          console.log(this.choose_year);
        }
        // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
        // 设置月份数组
        if (e.detail.column === 1) {
          var num = parseInt(this.multiArray[e.detail.column][e.detail.value]);
          this.multiArray[2] = this.setDays(this.choose_year, num);
        }

        this.multiIndex[e.detail.column] = e.detail.value;
        this.$apply();
      },


      // 获取时间日期
      bindMultiPickerChange: function bindMultiPickerChange(e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        this.multiIndex = e.detail.value;
        var index = this.multiIndex;
        var year = this.multiArray[0][index[0]];
        var month = this.multiArray[1][index[1]];
        var day = this.multiArray[2][index[2]];
        var hour = this.multiArray[3][index[3]];
        var minute = this.multiArray[4][index[4]];
        var second = this.multiArray[5][index[5]];
        // console.log(`${year}-${month}-${day}-${hour}-${minute}`);
        this.time = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        this.$emit('getTime', this.time);
        this.$apply();
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TimePicker, [{
    key: 'setTimeDate',
    value: function setTimeDate() {
      var date = new Date();
      var _yearIndex = 0;
      // 默认设置
      console.info(this.time);
      var _defaultYear = this.time ? this.time.split('-')[0] : 0;
      // 获取年
      for (var i = date.getFullYear(); i <= date.getFullYear() + 5; i++) {
        this.years.push('' + i);
        // 默认设置的年的位置
        if (_defaultYear && i === parseInt(_defaultYear)) {
          this.yearIndex = _yearIndex;
          this.choose_year = _defaultYear;
        }
        _yearIndex = _yearIndex + 1;
      }
      // 获取月份
      for (var _i = 1; _i <= 12; _i++) {
        if (_i < 10) {
          _i = '0' + _i;
        }
        this.months.push('' + _i);
      }
      // 获取日期
      for (var _i2 = 1; _i2 <= 31; _i2++) {
        if (_i2 < 10) {
          _i2 = '0' + _i2;
        }
        this.days.push('' + _i2);
      }
      // 获取小时
      for (var _i3 = 0; _i3 < 24; _i3++) {
        if (_i3 < 10) {
          _i3 = '0' + _i3;
        }
        this.hours.push('' + _i3);
      }
      // 获取分钟
      for (var _i4 = 0; _i4 < 60; _i4++) {
        if (_i4 < 10) {
          _i4 = '0' + _i4;
        }
        this.minutes.push('' + _i4);
      }
      // 获取秒数
      for (var _i5 = 0; _i5 < 60; _i5++) {
        if (_i5 < 10) {
          _i5 = '0' + _i5;
        }
        this.second.push('' + _i5);
      }
    }
    // 返回月份的天数

  }, {
    key: 'setDays',
    value: function setDays(selectYear, selectMonth) {
      var num = selectMonth;
      var temp = [];
      if (num === 1 || num === 3 || num === 5 || num === 7 || num === 8 || num === 10 || num === 12) {
        // 判断31天的月份
        for (var i = 1; i <= 31; i++) {
          if (i < 10) {
            i = '0' + i;
          }
          temp.push('' + i);
        }
      } else if (num === 4 || num === 6 || num === 9 || num === 11) {
        // 判断30天的月份
        for (var _i6 = 1; _i6 <= 30; _i6++) {
          if (_i6 < 10) {
            _i6 = '0' + _i6;
          }
          temp.push('' + _i6);
        }
      } else if (num === 2) {
        // 判断2月份天数
        var year = parseInt(selectYear);
        console.log(year);
        if ((year % 400 === 0 || year % 100 !== 0) && year % 4 === 0) {
          for (var _i7 = 1; _i7 <= 29; _i7++) {
            if (_i7 < 10) {
              _i7 = '0' + _i7;
            }
            temp.push('' + _i7);
          }
        } else {
          for (var _i8 = 1; _i8 <= 28; _i8++) {
            if (_i8 < 10) {
              _i8 = '0' + _i8;
            }
            temp.push('' + _i8);
          }
        }
      }
      return temp;
    }
    // 设置默认值 格式2019-07-10 10:30

  }, {
    key: 'setDefaultTime',
    value: function setDefaultTime() {
      var allDateList = this.time.split(' ');
      // 日期
      var dateList = allDateList[0].split('-');
      var month = parseInt(dateList[1]) - 1;
      var day = parseInt(dateList[2]) - 1;
      // 时间
      var timeList = allDateList[1].split(':');
      this.multiArray[2] = this.setDays(dateList[0], parseInt(dateList[1]));
      this.multiIndex = [this.yearIndex, month, day, timeList[0], timeList[1]];
    }
  }, {
    key: 'onLoad',
    value: function onLoad() {
      this.setTimeDate();
      this.multiArray = [this.years, this.months, this.days, this.hours, this.minutes, this.second];
      this.choose_year = this.multiArray[0][0];
      if (!this.time) {
        // 默认显示当前日期
        var date = new Date();
        var currentMonth = date.getMonth();
        var currentDay = date.getDate() - 1;
        // console.info('月', date.getMonth())
        // console.info('日', date.getDate())
        this.multiArray[2] = this.setDays(this.choose_year, currentMonth + 1);
        this.multiIndex = [0, currentMonth, currentDay, 10, 0];
      } else {
        this.setDefaultTime();
      }

      this.$apply();
    }
  }]);

  return TimePicker;
}(_wepy2.default.component);

exports.default = TimePicker;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpY2tlci5qcyJdLCJuYW1lcyI6WyJUaW1lUGlja2VyIiwicHJvcHMiLCJ0aW1lIiwidHlwZSIsIlN0cmluZyIsImRlZmF1bHQiLCJkYXRhIiwieWVhcnMiLCJtb250aHMiLCJkYXlzIiwiaG91cnMiLCJtaW51dGVzIiwic2Vjb25kIiwibXVsdGlBcnJheSIsIm11bHRpSW5kZXgiLCJjaG9vc2VfeWVhciIsInllYXJJbmRleCIsIm1ldGhvZHMiLCJiaW5kTXVsdGlQaWNrZXJDb2x1bW5DaGFuZ2UiLCJlIiwiZGV0YWlsIiwiY29sdW1uIiwidmFsdWUiLCJjb25zb2xlIiwibG9nIiwibnVtIiwicGFyc2VJbnQiLCJzZXREYXlzIiwiJGFwcGx5IiwiYmluZE11bHRpUGlja2VyQ2hhbmdlIiwiaW5kZXgiLCJ5ZWFyIiwibW9udGgiLCJkYXkiLCJob3VyIiwibWludXRlIiwiJGVtaXQiLCJkYXRlIiwiRGF0ZSIsIl95ZWFySW5kZXgiLCJpbmZvIiwiX2RlZmF1bHRZZWFyIiwic3BsaXQiLCJpIiwiZ2V0RnVsbFllYXIiLCJwdXNoIiwic2VsZWN0WWVhciIsInNlbGVjdE1vbnRoIiwidGVtcCIsImFsbERhdGVMaXN0IiwiZGF0ZUxpc3QiLCJ0aW1lTGlzdCIsInNldFRpbWVEYXRlIiwiY3VycmVudE1vbnRoIiwiZ2V0TW9udGgiLCJjdXJyZW50RGF5IiwiZ2V0RGF0ZSIsInNldERlZmF1bHRUaW1lIiwid2VweSIsImNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBQ3FCQSxVOzs7Ozs7Ozs7Ozs7Ozs4TEFDbkJDLEssR0FBUTtBQUNOQyxZQUFNO0FBQ0pDLGNBQU1DLE1BREY7QUFFSkMsaUJBQVM7QUFGTDtBQURBLEssUUFPUkMsSSxHQUFPO0FBQ0xDLGFBQU8sRUFERjtBQUVMQyxjQUFRLEVBRkg7QUFHTEMsWUFBTSxFQUhEO0FBSUxDLGFBQU8sRUFKRjtBQUtMQyxlQUFTLEVBTEo7QUFNTEMsY0FBUSxFQU5IO0FBT0xD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LEdBQWtCLENBQUMsS0FBS0UsU0FBTixFQUFpQmdCLEtBQWpCLEVBQXdCQyxHQUF4QixFQUE2QmtCLFNBQVMsQ0FBVCxDQUE3QixFQUEwQ0EsU0FBUyxDQUFULENBQTFDLENBQWxCO0FBQ0Q7Ozs2QkFzQ1M7QUFDUixXQUFLQyxXQUFMO0FBQ0EsV0FBS3ZDLFVBQUwsR0FBa0IsQ0FBQyxLQUFLTixLQUFOLEVBQWEsS0FBS0MsTUFBbEIsRUFBMEIsS0FBS0MsSUFBL0IsRUFBcUMsS0FBS0MsS0FBMUMsRUFBaUQsS0FBS0MsT0FBdEQsRUFBK0QsS0FBS0MsTUFBcEUsQ0FBbEI7QUFDQSxXQUFLRyxXQUFMLEdBQW1CLEtBQUtGLFVBQUwsQ0FBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsQ0FBbkI7QUFDQSxVQUFJLENBQUMsS0FBS1gsSUFBVixFQUFnQjtBQUNkO0FBQ0EsWUFBSW1DLE9BQU8sSUFBSUMsSUFBSixFQUFYO0FBQ0EsWUFBSWUsZUFBZWhCLEtBQUtpQixRQUFMLEVBQW5CO0FBQ0EsWUFBSUMsYUFBYWxCLEtBQUttQixPQUFMLEtBQWlCLENBQWxDO0FBQ0E7QUFDQTtBQUNBLGFBQUszQyxVQUFMLENBQWdCLENBQWhCLElBQXFCLEtBQUtjLE9BQUwsQ0FBYSxLQUFLWixXQUFsQixFQUErQnNDLGVBQWUsQ0FBOUMsQ0FBckI7QUFDQSxhQUFLdkMsVUFBTCxHQUFrQixDQUFDLENBQUQsRUFBSXVDLFlBQUosRUFBa0JFLFVBQWxCLEVBQThCLEVBQTlCLEVBQWtDLENBQWxDLENBQWxCO0FBQ0QsT0FURCxNQVNPO0FBQ0wsYUFBS0UsY0FBTDtBQUNEOztBQUVELFdBQUs3QixNQUFMO0FBQ0Q7Ozs7RUFwTHFDOEIsZUFBS0MsUzs7a0JBQXhCM0QsVSIsImZpbGUiOiJwaWNrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSdcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZVBpY2tlciBleHRlbmRzIHdlcHkuY29tcG9uZW50IHtcclxuICBwcm9wcyA9IHtcclxuICAgIHRpbWU6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnJ1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZGF0YSA9IHtcclxuICAgIHllYXJzOiBbXSxcclxuICAgIG1vbnRoczogW10sXHJcbiAgICBkYXlzOiBbXSxcclxuICAgIGhvdXJzOiBbXSxcclxuICAgIG1pbnV0ZXM6IFtdLFxyXG4gICAgc2Vjb25kOiBbXSxcclxuICAgIG11bHRpQXJyYXk6IFtdLCAvLyDpgInmi6nojIPlm7RcclxuICAgIG11bHRpSW5kZXg6IFswLCA5LCAxNiwgMTAsIDE3XSwgLy8g6YCJ5Lit5YC85pWw57uEXHJcbiAgICBjaG9vc2VfeWVhcjogJycsXHJcbiAgICB5ZWFySW5kZXg6IDBcclxuICB9XHJcbiAgLy8g6K6+572u5Yid5aeL5YC8XHJcbiAgc2V0VGltZURhdGUoKSB7XHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKVxyXG4gICAgbGV0IF95ZWFySW5kZXggPSAwXHJcbiAgICAvLyDpu5jorqTorr7nva5cclxuICAgIGNvbnNvbGUuaW5mbyh0aGlzLnRpbWUpXHJcbiAgICBsZXQgX2RlZmF1bHRZZWFyID0gdGhpcy50aW1lID8gdGhpcy50aW1lLnNwbGl0KCctJylbMF0gOiAwXHJcbiAgICAvLyDojrflj5blubRcclxuICAgIGZvciAobGV0IGkgPSBkYXRlLmdldEZ1bGxZZWFyKCk7IGkgPD0gZGF0ZS5nZXRGdWxsWWVhcigpICsgNTsgaSsrKSB7XHJcbiAgICAgIHRoaXMueWVhcnMucHVzaCgnJyArIGkpXHJcbiAgICAgIC8vIOm7mOiupOiuvue9rueahOW5tOeahOS9jee9rlxyXG4gICAgICBpZiAoX2RlZmF1bHRZZWFyICYmIGkgPT09IHBhcnNlSW50KF9kZWZhdWx0WWVhcikpIHtcclxuICAgICAgICB0aGlzLnllYXJJbmRleCA9IF95ZWFySW5kZXhcclxuICAgICAgICB0aGlzLmNob29zZV95ZWFyID0gX2RlZmF1bHRZZWFyXHJcbiAgICAgIH1cclxuICAgICAgX3llYXJJbmRleCA9IF95ZWFySW5kZXggKyAxXHJcbiAgICB9XHJcbiAgICAvLyDojrflj5bmnIjku71cclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDEyOyBpKyspIHtcclxuICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgIGkgPSAnMCcgKyBpXHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5tb250aHMucHVzaCgnJyArIGkpXHJcbiAgICB9XHJcbiAgICAvLyDojrflj5bml6XmnJ9cclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDMxOyBpKyspIHtcclxuICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgIGkgPSAnMCcgKyBpXHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5kYXlzLnB1c2goJycgKyBpKVxyXG4gICAgfVxyXG4gICAgLy8g6I635Y+W5bCP5pe2XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI0OyBpKyspIHtcclxuICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgIGkgPSAnMCcgKyBpXHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5ob3Vycy5wdXNoKCcnICsgaSlcclxuICAgIH1cclxuICAgIC8vIOiOt+WPluWIhumSn1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2MDsgaSsrKSB7XHJcbiAgICAgIGlmIChpIDwgMTApIHtcclxuICAgICAgICBpID0gJzAnICsgaVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMubWludXRlcy5wdXNoKCcnICsgaSlcclxuICAgIH1cclxuICAgIC8vIOiOt+WPluenkuaVsFxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2MDsgaSsrKSB7XHJcbiAgICAgIGlmIChpIDwgMTApIHtcclxuICAgICAgICBpID0gJzAnICsgaVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc2Vjb25kLnB1c2goJycgKyBpKVxyXG4gICAgfVxyXG4gIH1cclxuICAvLyDov5Tlm57mnIjku73nmoTlpKnmlbBcclxuICBzZXREYXlzKHNlbGVjdFllYXIsIHNlbGVjdE1vbnRoKSB7XHJcbiAgICBsZXQgbnVtID0gc2VsZWN0TW9udGhcclxuICAgIGxldCB0ZW1wID0gW11cclxuICAgIGlmIChudW0gPT09IDEgfHwgbnVtID09PSAzIHx8IG51bSA9PT0gNSB8fCBudW0gPT09IDcgfHwgbnVtID09PSA4IHx8IG51bSA9PT0gMTAgfHwgbnVtID09PSAxMikge1xyXG4gICAgICAgIC8vIOWIpOaWrTMx5aSp55qE5pyI5Lu9XHJcbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDMxOyBpKyspIHtcclxuICAgICAgICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgICBpID0gJzAnICsgaVxyXG4gICAgICAgIH1cclxuICAgICAgICB0ZW1wLnB1c2goJycgKyBpKVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKG51bSA9PT0gNCB8fCBudW0gPT09IDYgfHwgbnVtID09PSA5IHx8IG51bSA9PT0gMTEpIHsgLy8g5Yik5patMzDlpKnnmoTmnIjku71cclxuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMzA7IGkrKykge1xyXG4gICAgICAgIGlmIChpIDwgMTApIHtcclxuICAgICAgICAgIGkgPSAnMCcgKyBpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRlbXAucHVzaCgnJyArIGkpXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAobnVtID09PSAyKSB7IC8vIOWIpOaWrTLmnIjku73lpKnmlbBcclxuICAgICAgbGV0IHllYXIgPSBwYXJzZUludChzZWxlY3RZZWFyKVxyXG4gICAgICBjb25zb2xlLmxvZyh5ZWFyKVxyXG4gICAgICBpZiAoKCh5ZWFyICUgNDAwID09PSAwKSB8fCAoeWVhciAlIDEwMCAhPT0gMCkpICYmICh5ZWFyICUgNCA9PT0gMCkpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSAyOTsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgICAgIGkgPSAnMCcgKyBpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0ZW1wLnB1c2goJycgKyBpKVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSAyODsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgICAgIGkgPSAnMCcgKyBpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0ZW1wLnB1c2goJycgKyBpKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRlbXBcclxuICB9XHJcbiAgLy8g6K6+572u6buY6K6k5YC8IOagvOW8jzIwMTktMDctMTAgMTA6MzBcclxuICBzZXREZWZhdWx0VGltZSgpIHtcclxuICAgIGxldCBhbGxEYXRlTGlzdCA9IHRoaXMudGltZS5zcGxpdCgnICcpXHJcbiAgICAvLyDml6XmnJ9cclxuICAgIGxldCBkYXRlTGlzdCA9IGFsbERhdGVMaXN0WzBdLnNwbGl0KCctJylcclxuICAgIGxldCBtb250aCA9IHBhcnNlSW50KGRhdGVMaXN0WzFdKSAtIDFcclxuICAgIGxldCBkYXkgPSBwYXJzZUludChkYXRlTGlzdFsyXSkgLSAxXHJcbiAgICAvLyDml7bpl7RcclxuICAgIGxldCB0aW1lTGlzdCA9IGFsbERhdGVMaXN0WzFdLnNwbGl0KCc6JylcclxuICAgIHRoaXMubXVsdGlBcnJheVsyXSA9IHRoaXMuc2V0RGF5cyhkYXRlTGlzdFswXSwgcGFyc2VJbnQoZGF0ZUxpc3RbMV0pKVxyXG4gICAgdGhpcy5tdWx0aUluZGV4ID0gW3RoaXMueWVhckluZGV4LCBtb250aCwgZGF5LCB0aW1lTGlzdFswXSwgdGltZUxpc3RbMV1dXHJcbiAgfVxyXG5cclxuICBtZXRob2RzID0ge1xyXG4gICAgLy8g55uR5ZCscGlja2Vy55qE5rua5Yqo5LqL5Lu2XHJcbiAgICBiaW5kTXVsdGlQaWNrZXJDb2x1bW5DaGFuZ2UoZSkge1xyXG4gICAgICAvLyDojrflj5blubTku71cclxuICAgICAgaWYgKGUuZGV0YWlsLmNvbHVtbiA9PT0gMCkge1xyXG4gICAgICAgIHRoaXMuY2hvb3NlX3llYXIgPSB0aGlzLm11bHRpQXJyYXlbZS5kZXRhaWwuY29sdW1uXVtlLmRldGFpbC52YWx1ZV1cclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNob29zZV95ZWFyKVxyXG4gICAgICB9XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCfkv67mlLnnmoTliJfkuLonLCBlLmRldGFpbC5jb2x1bW4sICfvvIzlgLzkuLonLCBlLmRldGFpbC52YWx1ZSk7XHJcbiAgICAgIC8vIOiuvue9ruaciOS7veaVsOe7hFxyXG4gICAgICBpZiAoZS5kZXRhaWwuY29sdW1uID09PSAxKSB7XHJcbiAgICAgICAgbGV0IG51bSA9IHBhcnNlSW50KHRoaXMubXVsdGlBcnJheVtlLmRldGFpbC5jb2x1bW5dW2UuZGV0YWlsLnZhbHVlXSlcclxuICAgICAgICB0aGlzLm11bHRpQXJyYXlbMl0gPSB0aGlzLnNldERheXModGhpcy5jaG9vc2VfeWVhciwgbnVtKVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLm11bHRpSW5kZXhbZS5kZXRhaWwuY29sdW1uXSA9IGUuZGV0YWlsLnZhbHVlXHJcbiAgICAgIHRoaXMuJGFwcGx5KClcclxuICAgIH0sXHJcblxyXG4gICAgLy8g6I635Y+W5pe26Ze05pel5pyfXHJcbiAgICBiaW5kTXVsdGlQaWNrZXJDaGFuZ2UoZSkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygncGlja2Vy5Y+R6YCB6YCJ5oup5pS55Y+Y77yM5pC65bim5YC85Li6JywgZS5kZXRhaWwudmFsdWUpXHJcbiAgICAgIHRoaXMubXVsdGlJbmRleCA9IGUuZGV0YWlsLnZhbHVlXHJcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5tdWx0aUluZGV4XHJcbiAgICAgIGNvbnN0IHllYXIgPSB0aGlzLm11bHRpQXJyYXlbMF1baW5kZXhbMF1dXHJcbiAgICAgIGNvbnN0IG1vbnRoID0gdGhpcy5tdWx0aUFycmF5WzFdW2luZGV4WzFdXVxyXG4gICAgICBjb25zdCBkYXkgPSB0aGlzLm11bHRpQXJyYXlbMl1baW5kZXhbMl1dXHJcbiAgICAgIGNvbnN0IGhvdXIgPSB0aGlzLm11bHRpQXJyYXlbM11baW5kZXhbM11dXHJcbiAgICAgIGNvbnN0IG1pbnV0ZSA9IHRoaXMubXVsdGlBcnJheVs0XVtpbmRleFs0XV1cclxuICAgICAgY29uc3Qgc2Vjb25kID0gdGhpcy5tdWx0aUFycmF5WzVdW2luZGV4WzVdXVxyXG4gICAgICAvLyBjb25zb2xlLmxvZyhgJHt5ZWFyfS0ke21vbnRofS0ke2RheX0tJHtob3VyfS0ke21pbnV0ZX1gKTtcclxuICAgICAgdGhpcy50aW1lID0geWVhciArICctJyArIG1vbnRoICsgJy0nICsgZGF5ICsgJyAnICsgaG91ciArICc6JyArIG1pbnV0ZSArICc6JyArIHNlY29uZFxyXG4gICAgICB0aGlzLiRlbWl0KCdnZXRUaW1lJywgdGhpcy50aW1lKVxyXG4gICAgICB0aGlzLiRhcHBseSgpXHJcbiAgICB9XHJcbiAgfVxyXG4gIG9uTG9hZCAoKSB7XHJcbiAgICB0aGlzLnNldFRpbWVEYXRlKClcclxuICAgIHRoaXMubXVsdGlBcnJheSA9IFt0aGlzLnllYXJzLCB0aGlzLm1vbnRocywgdGhpcy5kYXlzLCB0aGlzLmhvdXJzLCB0aGlzLm1pbnV0ZXMsIHRoaXMuc2Vjb25kXVxyXG4gICAgdGhpcy5jaG9vc2VfeWVhciA9IHRoaXMubXVsdGlBcnJheVswXVswXVxyXG4gICAgaWYgKCF0aGlzLnRpbWUpIHtcclxuICAgICAgLy8g6buY6K6k5pi+56S65b2T5YmN5pel5pyfXHJcbiAgICAgIGxldCBkYXRlID0gbmV3IERhdGUoKVxyXG4gICAgICBsZXQgY3VycmVudE1vbnRoID0gZGF0ZS5nZXRNb250aCgpXHJcbiAgICAgIGxldCBjdXJyZW50RGF5ID0gZGF0ZS5nZXREYXRlKCkgLSAxXHJcbiAgICAgIC8vIGNvbnNvbGUuaW5mbygn5pyIJywgZGF0ZS5nZXRNb250aCgpKVxyXG4gICAgICAvLyBjb25zb2xlLmluZm8oJ+aXpScsIGRhdGUuZ2V0RGF0ZSgpKVxyXG4gICAgICB0aGlzLm11bHRpQXJyYXlbMl0gPSB0aGlzLnNldERheXModGhpcy5jaG9vc2VfeWVhciwgY3VycmVudE1vbnRoICsgMSlcclxuICAgICAgdGhpcy5tdWx0aUluZGV4ID0gWzAsIGN1cnJlbnRNb250aCwgY3VycmVudERheSwgMTAsIDBdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNldERlZmF1bHRUaW1lKClcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiRhcHBseSgpXHJcbiAgfVxyXG59XHJcbiJdfQ==