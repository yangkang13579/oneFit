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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpY2tlci5qcyJdLCJuYW1lcyI6WyJUaW1lUGlja2VyIiwicHJvcHMiLCJ0aW1lIiwidHlwZSIsIlN0cmluZyIsImRlZmF1bHQiLCJkYXRhIiwieWVhcnMiLCJtb250aHMiLCJkYXlzIiwiaG91cnMiLCJtaW51dGVzIiwic2Vjb25kIiwibXVsdGlBcnJheSIsIm11bHRpSW5kZXgiLCJjaG9vc2VfeWVhciIsInllYXJJbmRleCIsIm1ldGhvZHMiLCJiaW5kTXVsdGlQaWNrZXJDb2x1bW5DaGFuZ2UiLCJlIiwiZGV0YWlsIiwiY29sdW1uIiwidmFsdWUiLCJjb25zb2xlIiwibG9nIiwibnVtIiwicGFyc2VJbnQiLCJzZXREYXlzIiwiJGFwcGx5IiwiYmluZE11bHRpUGlja2VyQ2hhbmdlIiwiaW5kZXgiLCJ5ZWFyIiwibW9udGgiLCJkYXkiLCJob3VyIiwibWludXRlIiwiJGVtaXQiLCJkYXRlIiwiRGF0ZSIsIl95ZWFySW5kZXgiLCJpbmZvIiwiX2RlZmF1bHRZZWFyIiwic3BsaXQiLCJpIiwiZ2V0RnVsbFllYXIiLCJwdXNoIiwic2VsZWN0WWVhciIsInNlbGVjdE1vbnRoIiwidGVtcCIsImFsbERhdGVMaXN0IiwiZGF0ZUxpc3QiLCJ0aW1lTGlzdCIsInNldFRpbWVEYXRlIiwiY3VycmVudE1vbnRoIiwiZ2V0TW9udGgiLCJjdXJyZW50RGF5IiwiZ2V0RGF0ZSIsInNldERlZmF1bHRUaW1lIiwid2VweSIsImNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBQ3FCQSxVOzs7Ozs7Ozs7Ozs7OztrTUFDbkJDLEssR0FBUTtBQUNKQyxrQkFBTTtBQUNGQyxzQkFBTUMsTUFESjtBQUVGQyx5QkFBUztBQUZQO0FBREYsUyxRQU9SQyxJLEdBQU87QUFDSEMsbUJBQU8sRUFESjtBQUVIQyxvQkFBUSxFQUZMO0FBR0hDLGtCQUFNLEVBSEg7QUFJSEMsbUJBQU8sRUFKSjtBQUtIQyxxQkFBUyxFQUxOO0FBTUhDLG9CQUFRLEVBTkw7QUFPSEMsd0JBQVksRUFQVCxFQU9hO0FBQ2hCQyx3QkFBWSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sRUFBUCxFQUFXLEVBQVgsRUFBZSxFQUFmLENBUlQsRUFRNkI7QUFDaENDLHlCQUFhLEVBVFY7QUFVSEMsdUJBQVc7QUFFZjtBQVpPLFMsUUFzSFBDLE8sR0FBVTtBQUNOO0FBQ0FDLHVDQUZNLHVDQUVzQkMsQ0FGdEIsRUFFeUI7QUFDL0I7QUFDSSxvQkFBSUEsRUFBRUMsTUFBRixDQUFTQyxNQUFULEtBQW9CLENBQXhCLEVBQTJCO0FBQ3ZCLHlCQUFLTixXQUFMLEdBQW1CLEtBQUtGLFVBQUwsQ0FBZ0JNLEVBQUVDLE1BQUYsQ0FBU0MsTUFBekIsRUFBaUNGLEVBQUVDLE1BQUYsQ0FBU0UsS0FBMUMsQ0FBbkI7QUFDQUMsNEJBQVFDLEdBQVIsQ0FBWSxLQUFLVCxXQUFqQjtBQUNIO0FBQ0Q7QUFDQTtBQUNBLG9CQUFJSSxFQUFFQyxNQUFGLENBQVNDLE1BQVQsS0FBb0IsQ0FBeEIsRUFBMkI7QUFDdkIsd0JBQUlJLE1BQU1DLFNBQVMsS0FBS2IsVUFBTCxDQUFnQk0sRUFBRUMsTUFBRixDQUFTQyxNQUF6QixFQUFpQ0YsRUFBRUMsTUFBRixDQUFTRSxLQUExQyxDQUFULENBQVY7QUFDQSx5QkFBS1QsVUFBTCxDQUFnQixDQUFoQixJQUFxQixLQUFLYyxPQUFMLENBQWEsS0FBS1osV0FBbEIsRUFBK0JVLEdBQS9CLENBQXJCO0FBQ0g7O0FBRUQscUJBQUtYLFVBQUwsQ0FBZ0JLLEVBQUVDLE1BQUYsQ0FBU0MsTUFBekIsSUFBbUNGLEVBQUVDLE1BQUYsQ0FBU0UsS0FBNUM7QUFDQSxxQkFBS00sTUFBTDtBQUNILGFBakJLOzs7QUFtQk47QUFDQUMsaUNBcEJNLGlDQW9CZ0JWLENBcEJoQixFQW9CbUI7QUFDekI7QUFDSSxxQkFBS0wsVUFBTCxHQUFrQkssRUFBRUMsTUFBRixDQUFTRSxLQUEzQjtBQUNBLG9CQUFNUSxRQUFRLEtBQUtoQixVQUFuQjtBQUNBLG9CQUFNaUIsT0FBTyxLQUFLbEIsVUFBTCxDQUFnQixDQUFoQixFQUFtQmlCLE1BQU0sQ0FBTixDQUFuQixDQUFiO0FBQ0Esb0JBQU1FLFFBQVEsS0FBS25CLFVBQUwsQ0FBZ0IsQ0FBaEIsRUFBbUJpQixNQUFNLENBQU4sQ0FBbkIsQ0FBZDtBQUNBLG9CQUFNRyxNQUFNLEtBQUtwQixVQUFMLENBQWdCLENBQWhCLEVBQW1CaUIsTUFBTSxDQUFOLENBQW5CLENBQVo7QUFDQSxvQkFBTUksT0FBTyxLQUFLckIsVUFBTCxDQUFnQixDQUFoQixFQUFtQmlCLE1BQU0sQ0FBTixDQUFuQixDQUFiO0FBQ0Esb0JBQU1LLFNBQVMsS0FBS3RCLFVBQUwsQ0FBZ0IsQ0FBaEIsRUFBbUJpQixNQUFNLENBQU4sQ0FBbkIsQ0FBZjtBQUNBLG9CQUFNbEIsU0FBUyxLQUFLQyxVQUFMLENBQWdCLENBQWhCLEVBQW1CaUIsTUFBTSxDQUFOLENBQW5CLENBQWY7QUFDQTtBQUNBLHFCQUFLNUIsSUFBTCxHQUFZNkIsT0FBTyxHQUFQLEdBQWFDLEtBQWIsR0FBcUIsR0FBckIsR0FBMkJDLEdBQTNCLEdBQWlDLEdBQWpDLEdBQXVDQyxJQUF2QyxHQUE4QyxHQUE5QyxHQUFvREMsTUFBcEQsR0FBNkQsR0FBN0QsR0FBbUV2QixNQUEvRTtBQUNBLHFCQUFLd0IsS0FBTCxDQUFXLFNBQVgsRUFBc0IsS0FBS2xDLElBQTNCO0FBQ0EscUJBQUswQixNQUFMO0FBQ0g7QUFsQ0ssUzs7Ozs7c0NBekdJO0FBQ1YsZ0JBQU1TLE9BQU8sSUFBSUMsSUFBSixFQUFiO0FBQ0EsZ0JBQUlDLGFBQWEsQ0FBakI7QUFDQTtBQUNBaEIsb0JBQVFpQixJQUFSLENBQWEsS0FBS3RDLElBQWxCO0FBQ0EsZ0JBQUl1QyxlQUFlLEtBQUt2QyxJQUFMLEdBQVksS0FBS0EsSUFBTCxDQUFVd0MsS0FBVixDQUFnQixHQUFoQixFQUFxQixDQUFyQixDQUFaLEdBQXNDLENBQXpEO0FBQ0E7QUFDQSxpQkFBSyxJQUFJQyxJQUFJTixLQUFLTyxXQUFMLEVBQWIsRUFBaUNELEtBQUtOLEtBQUtPLFdBQUwsS0FBcUIsQ0FBM0QsRUFBOERELEdBQTlELEVBQW1FO0FBQy9ELHFCQUFLcEMsS0FBTCxDQUFXc0MsSUFBWCxDQUFnQixLQUFLRixDQUFyQjtBQUNBO0FBQ0Esb0JBQUlGLGdCQUFnQkUsTUFBTWpCLFNBQVNlLFlBQVQsQ0FBMUIsRUFBa0Q7QUFDOUMseUJBQUt6QixTQUFMLEdBQWlCdUIsVUFBakI7QUFDQSx5QkFBS3hCLFdBQUwsR0FBbUIwQixZQUFuQjtBQUNIO0FBQ0RGLDZCQUFhQSxhQUFhLENBQTFCO0FBQ0g7QUFDRDtBQUNBLGlCQUFLLElBQUlJLEtBQUksQ0FBYixFQUFnQkEsTUFBSyxFQUFyQixFQUF5QkEsSUFBekIsRUFBOEI7QUFDMUIsb0JBQUlBLEtBQUksRUFBUixFQUFZO0FBQ1JBLHlCQUFJLE1BQU1BLEVBQVY7QUFDSDtBQUNELHFCQUFLbkMsTUFBTCxDQUFZcUMsSUFBWixDQUFpQixLQUFLRixFQUF0QjtBQUNIO0FBQ0Q7QUFDQSxpQkFBSyxJQUFJQSxNQUFJLENBQWIsRUFBZ0JBLE9BQUssRUFBckIsRUFBeUJBLEtBQXpCLEVBQThCO0FBQzFCLG9CQUFJQSxNQUFJLEVBQVIsRUFBWTtBQUNSQSwwQkFBSSxNQUFNQSxHQUFWO0FBQ0g7QUFDRCxxQkFBS2xDLElBQUwsQ0FBVW9DLElBQVYsQ0FBZSxLQUFLRixHQUFwQjtBQUNIO0FBQ0Q7QUFDQSxpQkFBSyxJQUFJQSxNQUFJLENBQWIsRUFBZ0JBLE1BQUksRUFBcEIsRUFBd0JBLEtBQXhCLEVBQTZCO0FBQ3pCLG9CQUFJQSxNQUFJLEVBQVIsRUFBWTtBQUNSQSwwQkFBSSxNQUFNQSxHQUFWO0FBQ0g7QUFDRCxxQkFBS2pDLEtBQUwsQ0FBV21DLElBQVgsQ0FBZ0IsS0FBS0YsR0FBckI7QUFDSDtBQUNEO0FBQ0EsaUJBQUssSUFBSUEsTUFBSSxDQUFiLEVBQWdCQSxNQUFJLEVBQXBCLEVBQXdCQSxLQUF4QixFQUE2QjtBQUN6QixvQkFBSUEsTUFBSSxFQUFSLEVBQVk7QUFDUkEsMEJBQUksTUFBTUEsR0FBVjtBQUNIO0FBQ0QscUJBQUtoQyxPQUFMLENBQWFrQyxJQUFiLENBQWtCLEtBQUtGLEdBQXZCO0FBQ0g7QUFDRDtBQUNBLGlCQUFLLElBQUlBLE1BQUksQ0FBYixFQUFnQkEsTUFBSSxFQUFwQixFQUF3QkEsS0FBeEIsRUFBNkI7QUFDekIsb0JBQUlBLE1BQUksRUFBUixFQUFZO0FBQ1JBLDBCQUFJLE1BQU1BLEdBQVY7QUFDSDtBQUNELHFCQUFLL0IsTUFBTCxDQUFZaUMsSUFBWixDQUFpQixLQUFLRixHQUF0QjtBQUNIO0FBQ0o7QUFDRDs7OztnQ0FDUUcsVSxFQUFZQyxXLEVBQWE7QUFDN0IsZ0JBQUl0QixNQUFNc0IsV0FBVjtBQUNBLGdCQUFJQyxPQUFPLEVBQVg7QUFDQSxnQkFBSXZCLFFBQVEsQ0FBUixJQUFhQSxRQUFRLENBQXJCLElBQTBCQSxRQUFRLENBQWxDLElBQXVDQSxRQUFRLENBQS9DLElBQW9EQSxRQUFRLENBQTVELElBQWlFQSxRQUFRLEVBQXpFLElBQStFQSxRQUFRLEVBQTNGLEVBQStGO0FBQzNGO0FBQ0EscUJBQUssSUFBSWtCLElBQUksQ0FBYixFQUFnQkEsS0FBSyxFQUFyQixFQUF5QkEsR0FBekIsRUFBOEI7QUFDMUIsd0JBQUlBLElBQUksRUFBUixFQUFZO0FBQ1JBLDRCQUFJLE1BQU1BLENBQVY7QUFDSDtBQUNESyx5QkFBS0gsSUFBTCxDQUFVLEtBQUtGLENBQWY7QUFDSDtBQUNKLGFBUkQsTUFRTyxJQUFJbEIsUUFBUSxDQUFSLElBQWFBLFFBQVEsQ0FBckIsSUFBMEJBLFFBQVEsQ0FBbEMsSUFBdUNBLFFBQVEsRUFBbkQsRUFBdUQ7QUFBRTtBQUM1RCxxQkFBSyxJQUFJa0IsTUFBSSxDQUFiLEVBQWdCQSxPQUFLLEVBQXJCLEVBQXlCQSxLQUF6QixFQUE4QjtBQUMxQix3QkFBSUEsTUFBSSxFQUFSLEVBQVk7QUFDUkEsOEJBQUksTUFBTUEsR0FBVjtBQUNIO0FBQ0RLLHlCQUFLSCxJQUFMLENBQVUsS0FBS0YsR0FBZjtBQUNIO0FBQ0osYUFQTSxNQU9BLElBQUlsQixRQUFRLENBQVosRUFBZTtBQUFFO0FBQ3BCLG9CQUFJTSxPQUFPTCxTQUFTb0IsVUFBVCxDQUFYO0FBQ0F2Qix3QkFBUUMsR0FBUixDQUFZTyxJQUFaO0FBQ0Esb0JBQUksQ0FBRUEsT0FBTyxHQUFQLEtBQWUsQ0FBaEIsSUFBdUJBLE9BQU8sR0FBUCxLQUFlLENBQXZDLEtBQStDQSxPQUFPLENBQVAsS0FBYSxDQUFoRSxFQUFvRTtBQUNoRSx5QkFBSyxJQUFJWSxNQUFJLENBQWIsRUFBZ0JBLE9BQUssRUFBckIsRUFBeUJBLEtBQXpCLEVBQThCO0FBQzFCLDRCQUFJQSxNQUFJLEVBQVIsRUFBWTtBQUNSQSxrQ0FBSSxNQUFNQSxHQUFWO0FBQ0g7QUFDREssNkJBQUtILElBQUwsQ0FBVSxLQUFLRixHQUFmO0FBQ0g7QUFDSixpQkFQRCxNQU9PO0FBQ0gseUJBQUssSUFBSUEsTUFBSSxDQUFiLEVBQWdCQSxPQUFLLEVBQXJCLEVBQXlCQSxLQUF6QixFQUE4QjtBQUMxQiw0QkFBSUEsTUFBSSxFQUFSLEVBQVk7QUFDUkEsa0NBQUksTUFBTUEsR0FBVjtBQUNIO0FBQ0RLLDZCQUFLSCxJQUFMLENBQVUsS0FBS0YsR0FBZjtBQUNIO0FBQ0o7QUFDSjtBQUNELG1CQUFPSyxJQUFQO0FBQ0g7QUFDRDs7Ozt5Q0FDaUI7QUFDYixnQkFBSUMsY0FBYyxLQUFLL0MsSUFBTCxDQUFVd0MsS0FBVixDQUFnQixHQUFoQixDQUFsQjtBQUNBO0FBQ0EsZ0JBQUlRLFdBQVdELFlBQVksQ0FBWixFQUFlUCxLQUFmLENBQXFCLEdBQXJCLENBQWY7QUFDQSxnQkFBSVYsUUFBUU4sU0FBU3dCLFNBQVMsQ0FBVCxDQUFULElBQXdCLENBQXBDO0FBQ0EsZ0JBQUlqQixNQUFNUCxTQUFTd0IsU0FBUyxDQUFULENBQVQsSUFBd0IsQ0FBbEM7QUFDQTtBQUNBLGdCQUFJQyxXQUFXRixZQUFZLENBQVosRUFBZVAsS0FBZixDQUFxQixHQUFyQixDQUFmO0FBQ0EsaUJBQUs3QixVQUFMLENBQWdCLENBQWhCLElBQXFCLEtBQUtjLE9BQUwsQ0FBYXVCLFNBQVMsQ0FBVCxDQUFiLEVBQTBCeEIsU0FBU3dCLFNBQVMsQ0FBVCxDQUFULENBQTFCLENBQXJCO0FBQ0EsaUJBQUtwQyxVQUFMLEdBQWtCLENBQUMsS0FBS0UsU0FBTixFQUFpQmdCLEtBQWpCLEVBQXdCQyxHQUF4QixFQUE2QmtCLFNBQVMsQ0FBVCxDQUE3QixFQUEwQ0EsU0FBUyxDQUFULENBQTFDLENBQWxCO0FBQ0g7OztpQ0FzQ1M7QUFDTixpQkFBS0MsV0FBTDtBQUNBLGlCQUFLdkMsVUFBTCxHQUFrQixDQUFDLEtBQUtOLEtBQU4sRUFBYSxLQUFLQyxNQUFsQixFQUEwQixLQUFLQyxJQUEvQixFQUFxQyxLQUFLQyxLQUExQyxFQUFpRCxLQUFLQyxPQUF0RCxFQUErRCxLQUFLQyxNQUFwRSxDQUFsQjtBQUNBLGlCQUFLRyxXQUFMLEdBQW1CLEtBQUtGLFVBQUwsQ0FBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsQ0FBbkI7QUFDQSxnQkFBSSxDQUFDLEtBQUtYLElBQVYsRUFBZ0I7QUFDaEI7QUFDSSxvQkFBSW1DLE9BQU8sSUFBSUMsSUFBSixFQUFYO0FBQ0Esb0JBQUllLGVBQWVoQixLQUFLaUIsUUFBTCxFQUFuQjtBQUNBLG9CQUFJQyxhQUFhbEIsS0FBS21CLE9BQUwsS0FBaUIsQ0FBbEM7QUFDQTtBQUNBO0FBQ0EscUJBQUszQyxVQUFMLENBQWdCLENBQWhCLElBQXFCLEtBQUtjLE9BQUwsQ0FBYSxLQUFLWixXQUFsQixFQUErQnNDLGVBQWUsQ0FBOUMsQ0FBckI7QUFDQSxxQkFBS3ZDLFVBQUwsR0FBa0IsQ0FBQyxDQUFELEVBQUl1QyxZQUFKLEVBQWtCRSxVQUFsQixFQUE4QixFQUE5QixFQUFrQyxDQUFsQyxDQUFsQjtBQUNILGFBVEQsTUFTTztBQUNILHFCQUFLRSxjQUFMO0FBQ0g7O0FBRUQsaUJBQUs3QixNQUFMO0FBQ0g7Ozs7RUFwTHFDOEIsZUFBS0MsUzs7a0JBQXhCM0QsVSIsImZpbGUiOiJwaWNrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVQaWNrZXIgZXh0ZW5kcyB3ZXB5LmNvbXBvbmVudCB7XHJcbiAgcHJvcHMgPSB7XHJcbiAgICAgIHRpbWU6IHtcclxuICAgICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICAgIGRlZmF1bHQ6ICcnXHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIGRhdGEgPSB7XHJcbiAgICAgIHllYXJzOiBbXSxcclxuICAgICAgbW9udGhzOiBbXSxcclxuICAgICAgZGF5czogW10sXHJcbiAgICAgIGhvdXJzOiBbXSxcclxuICAgICAgbWludXRlczogW10sXHJcbiAgICAgIHNlY29uZDogW10sXHJcbiAgICAgIG11bHRpQXJyYXk6IFtdLCAvLyDpgInmi6nojIPlm7RcclxuICAgICAgbXVsdGlJbmRleDogWzAsIDksIDE2LCAxMCwgMTddLCAvLyDpgInkuK3lgLzmlbDnu4RcclxuICAgICAgY2hvb3NlX3llYXI6ICcnLFxyXG4gICAgICB5ZWFySW5kZXg6IDBcclxuICB9XHJcbiAgLy8g6K6+572u5Yid5aeL5YC8XHJcbiAgc2V0VGltZURhdGUoKSB7XHJcbiAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICBsZXQgX3llYXJJbmRleCA9IDA7XHJcbiAgICAgIC8vIOm7mOiupOiuvue9rlxyXG4gICAgICBjb25zb2xlLmluZm8odGhpcy50aW1lKTtcclxuICAgICAgbGV0IF9kZWZhdWx0WWVhciA9IHRoaXMudGltZSA/IHRoaXMudGltZS5zcGxpdCgnLScpWzBdIDogMDtcclxuICAgICAgLy8g6I635Y+W5bm0XHJcbiAgICAgIGZvciAobGV0IGkgPSBkYXRlLmdldEZ1bGxZZWFyKCk7IGkgPD0gZGF0ZS5nZXRGdWxsWWVhcigpICsgNTsgaSsrKSB7XHJcbiAgICAgICAgICB0aGlzLnllYXJzLnB1c2goJycgKyBpKTtcclxuICAgICAgICAgIC8vIOm7mOiupOiuvue9rueahOW5tOeahOS9jee9rlxyXG4gICAgICAgICAgaWYgKF9kZWZhdWx0WWVhciAmJiBpID09PSBwYXJzZUludChfZGVmYXVsdFllYXIpKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy55ZWFySW5kZXggPSBfeWVhckluZGV4O1xyXG4gICAgICAgICAgICAgIHRoaXMuY2hvb3NlX3llYXIgPSBfZGVmYXVsdFllYXI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBfeWVhckluZGV4ID0gX3llYXJJbmRleCArIDE7XHJcbiAgICAgIH1cclxuICAgICAgLy8g6I635Y+W5pyI5Lu9XHJcbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDEyOyBpKyspIHtcclxuICAgICAgICAgIGlmIChpIDwgMTApIHtcclxuICAgICAgICAgICAgICBpID0gJzAnICsgaTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMubW9udGhzLnB1c2goJycgKyBpKTtcclxuICAgICAgfVxyXG4gICAgICAvLyDojrflj5bml6XmnJ9cclxuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMzE7IGkrKykge1xyXG4gICAgICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgICAgICAgIGkgPSAnMCcgKyBpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5kYXlzLnB1c2goJycgKyBpKTtcclxuICAgICAgfVxyXG4gICAgICAvLyDojrflj5blsI/ml7ZcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyNDsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgICAgICAgaSA9ICcwJyArIGk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLmhvdXJzLnB1c2goJycgKyBpKTtcclxuICAgICAgfVxyXG4gICAgICAvLyDojrflj5bliIbpkp9cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2MDsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgICAgICAgaSA9ICcwJyArIGk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLm1pbnV0ZXMucHVzaCgnJyArIGkpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIOiOt+WPluenkuaVsFxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDYwOyBpKyspIHtcclxuICAgICAgICAgIGlmIChpIDwgMTApIHtcclxuICAgICAgICAgICAgICBpID0gJzAnICsgaTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuc2Vjb25kLnB1c2goJycgKyBpKTtcclxuICAgICAgfVxyXG4gIH1cclxuICAvLyDov5Tlm57mnIjku73nmoTlpKnmlbBcclxuICBzZXREYXlzKHNlbGVjdFllYXIsIHNlbGVjdE1vbnRoKSB7XHJcbiAgICAgIGxldCBudW0gPSBzZWxlY3RNb250aDtcclxuICAgICAgbGV0IHRlbXAgPSBbXTtcclxuICAgICAgaWYgKG51bSA9PT0gMSB8fCBudW0gPT09IDMgfHwgbnVtID09PSA1IHx8IG51bSA9PT0gNyB8fCBudW0gPT09IDggfHwgbnVtID09PSAxMCB8fCBudW0gPT09IDEyKSB7XHJcbiAgICAgICAgICAvLyDliKTmlq0zMeWkqeeahOaciOS7vVxyXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMzE7IGkrKykge1xyXG4gICAgICAgICAgICAgIGlmIChpIDwgMTApIHtcclxuICAgICAgICAgICAgICAgICAgaSA9ICcwJyArIGk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHRlbXAucHVzaCgnJyArIGkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKG51bSA9PT0gNCB8fCBudW0gPT09IDYgfHwgbnVtID09PSA5IHx8IG51bSA9PT0gMTEpIHsgLy8g5Yik5patMzDlpKnnmoTmnIjku71cclxuICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDMwOyBpKyspIHtcclxuICAgICAgICAgICAgICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgICAgICAgICAgIGkgPSAnMCcgKyBpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB0ZW1wLnB1c2goJycgKyBpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChudW0gPT09IDIpIHsgLy8g5Yik5patMuaciOS7veWkqeaVsFxyXG4gICAgICAgICAgbGV0IHllYXIgPSBwYXJzZUludChzZWxlY3RZZWFyKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHllYXIpO1xyXG4gICAgICAgICAgaWYgKCgoeWVhciAlIDQwMCA9PT0gMCkgfHwgKHllYXIgJSAxMDAgIT09IDApKSAmJiAoeWVhciAlIDQgPT09IDApKSB7XHJcbiAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMjk7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBpID0gJzAnICsgaTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB0ZW1wLnB1c2goJycgKyBpKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDI4OyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgaSA9ICcwJyArIGk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgdGVtcC5wdXNoKCcnICsgaSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0ZW1wO1xyXG4gIH1cclxuICAvLyDorr7nva7pu5jorqTlgLwg5qC85byPMjAxOS0wNy0xMCAxMDozMFxyXG4gIHNldERlZmF1bHRUaW1lKCkge1xyXG4gICAgICBsZXQgYWxsRGF0ZUxpc3QgPSB0aGlzLnRpbWUuc3BsaXQoJyAnKTtcclxuICAgICAgLy8g5pel5pyfXHJcbiAgICAgIGxldCBkYXRlTGlzdCA9IGFsbERhdGVMaXN0WzBdLnNwbGl0KCctJyk7XHJcbiAgICAgIGxldCBtb250aCA9IHBhcnNlSW50KGRhdGVMaXN0WzFdKSAtIDE7XHJcbiAgICAgIGxldCBkYXkgPSBwYXJzZUludChkYXRlTGlzdFsyXSkgLSAxO1xyXG4gICAgICAvLyDml7bpl7RcclxuICAgICAgbGV0IHRpbWVMaXN0ID0gYWxsRGF0ZUxpc3RbMV0uc3BsaXQoJzonKTtcclxuICAgICAgdGhpcy5tdWx0aUFycmF5WzJdID0gdGhpcy5zZXREYXlzKGRhdGVMaXN0WzBdLCBwYXJzZUludChkYXRlTGlzdFsxXSkpO1xyXG4gICAgICB0aGlzLm11bHRpSW5kZXggPSBbdGhpcy55ZWFySW5kZXgsIG1vbnRoLCBkYXksIHRpbWVMaXN0WzBdLCB0aW1lTGlzdFsxXV07XHJcbiAgfVxyXG5cclxuICBtZXRob2RzID0ge1xyXG4gICAgICAvLyDnm5HlkKxwaWNrZXLnmoTmu5rliqjkuovku7ZcclxuICAgICAgYmluZE11bHRpUGlja2VyQ29sdW1uQ2hhbmdlKGUpIHtcclxuICAgICAgLy8g6I635Y+W5bm05Lu9XHJcbiAgICAgICAgICBpZiAoZS5kZXRhaWwuY29sdW1uID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5jaG9vc2VfeWVhciA9IHRoaXMubXVsdGlBcnJheVtlLmRldGFpbC5jb2x1bW5dW2UuZGV0YWlsLnZhbHVlXTtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNob29zZV95ZWFyKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCfkv67mlLnnmoTliJfkuLonLCBlLmRldGFpbC5jb2x1bW4sICfvvIzlgLzkuLonLCBlLmRldGFpbC52YWx1ZSk7XHJcbiAgICAgICAgICAvLyDorr7nva7mnIjku73mlbDnu4RcclxuICAgICAgICAgIGlmIChlLmRldGFpbC5jb2x1bW4gPT09IDEpIHtcclxuICAgICAgICAgICAgICBsZXQgbnVtID0gcGFyc2VJbnQodGhpcy5tdWx0aUFycmF5W2UuZGV0YWlsLmNvbHVtbl1bZS5kZXRhaWwudmFsdWVdKTtcclxuICAgICAgICAgICAgICB0aGlzLm11bHRpQXJyYXlbMl0gPSB0aGlzLnNldERheXModGhpcy5jaG9vc2VfeWVhciwgbnVtKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB0aGlzLm11bHRpSW5kZXhbZS5kZXRhaWwuY29sdW1uXSA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIC8vIOiOt+WPluaXtumXtOaXpeacn1xyXG4gICAgICBiaW5kTXVsdGlQaWNrZXJDaGFuZ2UoZSkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygncGlja2Vy5Y+R6YCB6YCJ5oup5pS55Y+Y77yM5pC65bim5YC85Li6JywgZS5kZXRhaWwudmFsdWUpXHJcbiAgICAgICAgICB0aGlzLm11bHRpSW5kZXggPSBlLmRldGFpbC52YWx1ZTtcclxuICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5tdWx0aUluZGV4O1xyXG4gICAgICAgICAgY29uc3QgeWVhciA9IHRoaXMubXVsdGlBcnJheVswXVtpbmRleFswXV07XHJcbiAgICAgICAgICBjb25zdCBtb250aCA9IHRoaXMubXVsdGlBcnJheVsxXVtpbmRleFsxXV07XHJcbiAgICAgICAgICBjb25zdCBkYXkgPSB0aGlzLm11bHRpQXJyYXlbMl1baW5kZXhbMl1dO1xyXG4gICAgICAgICAgY29uc3QgaG91ciA9IHRoaXMubXVsdGlBcnJheVszXVtpbmRleFszXV07XHJcbiAgICAgICAgICBjb25zdCBtaW51dGUgPSB0aGlzLm11bHRpQXJyYXlbNF1baW5kZXhbNF1dO1xyXG4gICAgICAgICAgY29uc3Qgc2Vjb25kID0gdGhpcy5tdWx0aUFycmF5WzVdW2luZGV4WzVdXTtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGAke3llYXJ9LSR7bW9udGh9LSR7ZGF5fS0ke2hvdXJ9LSR7bWludXRlfWApO1xyXG4gICAgICAgICAgdGhpcy50aW1lID0geWVhciArICctJyArIG1vbnRoICsgJy0nICsgZGF5ICsgJyAnICsgaG91ciArICc6JyArIG1pbnV0ZSArICc6JyArIHNlY29uZDtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoJ2dldFRpbWUnLCB0aGlzLnRpbWUpO1xyXG4gICAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgfVxyXG4gIH1cclxuICBvbkxvYWQgKCkge1xyXG4gICAgICB0aGlzLnNldFRpbWVEYXRlKCk7XHJcbiAgICAgIHRoaXMubXVsdGlBcnJheSA9IFt0aGlzLnllYXJzLCB0aGlzLm1vbnRocywgdGhpcy5kYXlzLCB0aGlzLmhvdXJzLCB0aGlzLm1pbnV0ZXMsIHRoaXMuc2Vjb25kXTtcclxuICAgICAgdGhpcy5jaG9vc2VfeWVhciA9IHRoaXMubXVsdGlBcnJheVswXVswXTtcclxuICAgICAgaWYgKCF0aGlzLnRpbWUpIHtcclxuICAgICAgLy8g6buY6K6k5pi+56S65b2T5YmN5pel5pyfXHJcbiAgICAgICAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICBsZXQgY3VycmVudE1vbnRoID0gZGF0ZS5nZXRNb250aCgpO1xyXG4gICAgICAgICAgbGV0IGN1cnJlbnREYXkgPSBkYXRlLmdldERhdGUoKSAtIDE7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmluZm8oJ+aciCcsIGRhdGUuZ2V0TW9udGgoKSlcclxuICAgICAgICAgIC8vIGNvbnNvbGUuaW5mbygn5pelJywgZGF0ZS5nZXREYXRlKCkpXHJcbiAgICAgICAgICB0aGlzLm11bHRpQXJyYXlbMl0gPSB0aGlzLnNldERheXModGhpcy5jaG9vc2VfeWVhciwgY3VycmVudE1vbnRoICsgMSk7XHJcbiAgICAgICAgICB0aGlzLm11bHRpSW5kZXggPSBbMCwgY3VycmVudE1vbnRoLCBjdXJyZW50RGF5LCAxMCwgMF07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnNldERlZmF1bHRUaW1lKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==