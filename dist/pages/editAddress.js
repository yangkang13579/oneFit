'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _page = require('./../mixins/page.js');

var _page2 = _interopRequireDefault(_page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EditAddress = function (_wepy$page) {
    _inherits(EditAddress, _wepy$page);

    function EditAddress() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, EditAddress);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = EditAddress.__proto__ || Object.getPrototypeOf(EditAddress)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
            navigationBarTitleText: '创建会议',
            navigationBarBackgroundColor: '#fff'
        }, _this.data = {
            classifyAry: ['经销商会', '农民会', '观摩会', '促销会', '其他会议'],
            type: null,
            formData: {},
            date: '2016-09-01',
            times: '2020-07-29 12:50',
            // 时间选择器参数
            years: [],
            months: [],
            days: [],
            hours: [],
            minutes: [],
            second: [],
            multiArray: [], // 选择范围
            multiIndex: [0, 9, 16, 13, 17], // 选中值数组
            choose_year: '',
            yearIndex: 0,
            address: []
        }, _this.methods = {
            chooseLocation: function chooseLocation() {
                var that = this;
                wx.getLocation({
                    type: 'wgs84',
                    success: function success(res) {
                        wx.chooseLocation({
                            latitude: res.latitude,
                            longitude: res.longitude,
                            success: function success(rest) {
                                // 发送请求通过经纬度反查地址信息
                                that.fetchDataPromise('resolveLocationApi.json', { latitude: rest.latitude, longitude: rest.longitude }).then(function (data) {
                                    that.address = [data.provinceName, data.cityName, data.districtName];
                                    that.formData.address = data.address;
                                });
                            }
                        });
                    }
                });
            },
            bindRegionChange: function bindRegionChange(e) {
                this.address = e.detail.value;
                this.formData.address = '';
            },
            changeClassify: function changeClassify(e) {
                console.log(e);
                this.formData.classify = e.detail.value;
            },

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
            bindStartChange: function bindStartChange(e) {
                this.formData.startDate1 = this.PickerChange(e);
            },
            bindEndChange: function bindEndChange(e) {
                this.formData.endDate1 = this.PickerChange(e);
            },


            // 获取时间
            gettimes: function gettimes(times) {
                console.log(times);
            },
            showAddrChose: function showAddrChose() {
                // 显示省市区联动选择框
                this.isShowAddressChose = !this.data.isShowAddressChose;
            },
            cancel: function cancel() {
                // 取消
                this.isShowAddressChose = false;
            },
            finish: function finish() {
                // 完成
                this.isShowAddressChose = false;
            },
            getName: function getName(e) {
                // 获得会议名称
                this.formData.name = e.detail.value;
                this.$apply();
            },
            getContent: function getContent(e) {
                // 获得全部内容
                this.formData.content = e.detail.value;
                this.$apply();
            },
            getleader: function getleader(e) {
                // 获得领导
                this.formData.leader = e.detail.value;
                this.$apply();
            },
            getaddress: function getaddress(e) {
                // 获得领导
                this.formData.address = e.detail.value;
                this.$apply();
            },
            getuserCount: function getuserCount(e) {
                // 获得领导
                this.formData.userCapacity = e.detail.value;
                this.$apply();
            },
            save: function save() {
                // 保存
                var self = this;
                console.log(this.formData);
                if (!self.formData.name || self.formData.name == '') {
                    wx.showModal({
                        title: '提示',
                        content: '会议名称必填',
                        showCancel: false
                    });
                    return;
                } else if (!self.formData.leader || self.formData.leader == '') {
                    wx.showModal({
                        title: '提示',
                        content: '负责人必填',
                        showCancel: false
                    });
                    return;
                } else if (!self.formData.classify || self.formData.classify == '') {
                    wx.showModal({
                        title: '提示',
                        content: '会议类别必填',
                        showCancel: false
                    });
                    return;
                } else if (!self.address || self.address == '' || self.address.length === 0) {
                    wx.showModal({
                        title: '提示',
                        content: '请选择地址',
                        showCancel: false
                    });
                    return;
                } else if (!self.formData.address || self.formData.address == '') {
                    wx.showModal({
                        title: '提示',
                        content: '详细地址必填',
                        showCancel: false
                    });
                    return;
                } else if (!self.formData.name || self.formData.name == '') {
                    wx.showModal({
                        title: '提示',
                        content: '会议名称必填',
                        showCancel: false
                    });
                    return;
                } else if (!self.formData.name || self.formData.name == '') {
                    wx.showModal({
                        title: '提示',
                        content: '会议名称必填',
                        showCancel: false
                    });
                    return;
                }
                this.formData.meetingType = this.classifyAry[this.formData.classify];
                this.formData.provinceName = this.address[0];
                this.formData.cityName = this.address[1];
                this.formData.districtName = this.address[2];
                this.formData.startDate = this.formData.startDate1 + ':00';
                this.formData.endDate = this.formData.endDate1 + ':59';
                if (self.type == 'edit') {
                    this.formData.user = null;
                    this.fetchDataPromise('meeting/wechat/updateMeetingApi.json', this.formData).then(function (data) {
                        self.formData = {};
                        // 返回上一页
                        wx.navigateBack({
                            delta: 1
                        });
                        self.$apply();
                    });
                } else {
                    this.fetchDataPromise('meeting/wechat/createMeetingApi.json', this.formData).then(function (data) {
                        self.formData = {};
                        // 返回上一页
                        wx.navigateBack({
                            delta: 1
                        });
                        self.$apply();
                    });
                }
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(EditAddress, [{
        key: 'timesFun',

        // 差一位补位
        value: function timesFun(t) {
            if (t < 10) return '0' + t;else return t;
        }
        // 设置初始值

    }, {
        key: 'settimesDate',
        value: function settimesDate() {
            var date = new Date();
            var _yearIndex = 0;
            // 默认设置
            console.info(this.times);
            var _defaultYear = this.times ? this.times.split('-')[0] : 0;
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
            // // 获取小时
            for (var _i3 = 0; _i3 < 24; _i3++) {
                if (_i3 < 10) {
                    _i3 = '0' + _i3;
                }
                this.hours.push('' + _i3);
            }
            // // 获取分钟
            for (var _i4 = 0; _i4 < 60; _i4++) {
                if (_i4 < 10) {
                    _i4 = '0' + _i4;
                }
                this.minutes.push('' + _i4);
            }
            // // 获取秒数
            // for (let i = 0; i < 60; i++) {
            //   if (i < 10) {
            //     i = '0' + i
            //   }
            //   this.second.push('' + i)
            // }
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
                for (var _i5 = 1; _i5 <= 30; _i5++) {
                    if (_i5 < 10) {
                        _i5 = '0' + _i5;
                    }
                    temp.push('' + _i5);
                }
            } else if (num === 2) {
                // 判断2月份天数
                var year = parseInt(selectYear);
                console.log(year);
                if ((year % 400 === 0 || year % 100 !== 0) && year % 4 === 0) {
                    for (var _i6 = 1; _i6 <= 29; _i6++) {
                        if (_i6 < 10) {
                            _i6 = '0' + _i6;
                        }
                        temp.push('' + _i6);
                    }
                } else {
                    for (var _i7 = 1; _i7 <= 28; _i7++) {
                        if (_i7 < 10) {
                            _i7 = '0' + _i7;
                        }
                        temp.push('' + _i7);
                    }
                }
            }
            return temp;
        }
        // 设置默认值 格式2019-07-10 10:30

    }, {
        key: 'setDefaulttimes',
        value: function setDefaulttimes() {
            var allDateList = this.times.split(' ');
            // 日期
            var dateList = allDateList[0].split('-');
            var month = parseInt(dateList[1]) - 1;
            var day = parseInt(dateList[2]) - 1;
            // 时间
            var timesList = allDateList[1].split(':');
            this.multiArray[2] = this.setDays(dateList[0], parseInt(dateList[1]));
            this.multiIndex = [this.yearIndex, month, day, timesList[0], timesList[1]];
        }
        // 获取时间日期

    }, {
        key: 'PickerChange',
        value: function PickerChange(e) {
            // console.log('picker发送选择改变，携带值为', e.detail.value)
            this.multiIndex = e.detail.value;
            var index = this.multiIndex;
            var year = this.multiArray[0][index[0]];
            var month = this.multiArray[1][index[1]];
            var day = this.multiArray[2][index[2]];
            var hour = this.multiArray[3][index[3]];
            var minute = this.multiArray[4][index[4]];
            // const second = this.multiArray[5][index[5]]
            // console.log(`${year}-${month}-${day}-${hour}-${minute}`);
            this.times = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
            this.$apply();
            return this.times;
        }
    }, {
        key: 'onLoad',

        // endFun () {
        //   if (this.formData.endDate1) this.times = this.formData.endDate1
        // }
        // startDate () {
        //   if (this.formData.startDate1) this.times = this.formData.startDate1
        // }
        value: function onLoad(options) {
            // 获取经纬度
            this.times = new Date().getFullYear() + '-' + this.timesFun(new Date().getMonth() + 1) + '-' + this.timesFun(new Date().getDate()) + ' ' + '12';
            var that = this;
            if (options.item) {
                wx.setNavigationBarTitle({
                    title: '编辑会议'
                });
                that.type = 'edit';
                this.formData = JSON.parse(options.item);
                this.formData.startDate1 = this.formData.startDate1.split(' ')[0] + ' ' + this.formData.startDate1.split(' ')[1].split(':')[0];
                this.formData.endDate1 = this.formData.endDate1.split(' ')[0] + ' ' + this.formData.startDate1.split(' ')[1].split(':')[0];
                this.times = this.formData.startDate1;
            }

            wx.getLocation({
                type: 'gcj02',
                success: function success(res) {
                    console.log(res);

                    that.formData.latitude = res.latitude;
                    that.formData.longitude = res.longitude;
                },
                fail: function fail(res) {
                    console.log(res);
                }
            });
            this.settimesDate();
            // this.multiArray = [this.years, this.months, this.days, this.hours, this.minutes, this.second]
            this.multiArray = [this.years, this.months, this.days, this.hours, this.minutes];
            // this.multiArray = [this.years, this.months, this.days, this.hours]
            // this.multiArray = [this.years, this.months, this.days]
            this.choose_year = this.multiArray[0][0];
            if (!this.times) {
                // 默认显示当前日期
                var date = new Date();
                var currentMonth = date.getMonth();
                var currentDay = date.getDate() - 1;
                // console.info('月', date.getMonth())
                // console.info('日', date.getDate())
                this.multiArray[2] = this.setDays(this.choose_year, currentMonth + 1);
                this.multiIndex = [0, currentMonth, currentDay, 10, 0];
            } else {
                this.setDefaulttimes();
            }
            // wx.getStorage({
            //   key: 'item',
            //   success (res) {
            //     console.log(res.data)
            //     self.formData = res.data
            //   }
            // })

            this.$apply();
        }
    }, {
        key: 'whenAppReadyShow',
        value: function whenAppReadyShow() {
            // 每次都刷新
            this.$apply();
        }
    }, {
        key: 'changeCurrentData',
        value: function changeCurrentData(option) {
            // 改变当前数据
            // 全国数据
            var nationalData = this.nationalData;
            // 所有省
            if (this.provinces.length == 0) {
                var provinces = this.data.provinces;
                for (var i = 0; i < nationalData.length; i++) {
                    provinces.push({
                        index: i,
                        province: nationalData[i].zone_name
                    });
                }
                this.provinces = provinces;
            }
            // 当前所有市
            if (option.type == 'city' || option.type == 'all') {
                // 清空市数据
                this.cities = [];
                var cities = this.cities;
                var currentCities = nationalData[option.currentProvinceIndex].citys;
                for (var i = 0; i < currentCities.length; i++) {
                    cities.push({
                        index: i,
                        city: currentCities[i].zone_name
                    });
                }
                this.cities = cities;
            }
            // 当前所有区
            // 清空 区 数据
            this.districts = [];
            var districts = this.districts;
            var currentDistricts = nationalData[option.currentProvinceIndex].citys[option.currentCityIndex].districts;
            for (var i = 0; i < currentDistricts.length; i++) {
                if (i != 0) {
                    districts.push(currentDistricts[i].zone_name);
                };
            }
            this.districts = districts;
            this.$apply();
        }
    }]);

    return EditAddress;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(EditAddress , 'pages/editAddress'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVkaXRBZGRyZXNzLmpzIl0sIm5hbWVzIjpbIkVkaXRBZGRyZXNzIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJkYXRhIiwiY2xhc3NpZnlBcnkiLCJ0eXBlIiwiZm9ybURhdGEiLCJkYXRlIiwidGltZXMiLCJ5ZWFycyIsIm1vbnRocyIsImRheXMiLCJob3VycyIsIm1pbnV0ZXMiLCJzZWNvbmQiLCJtdWx0aUFycmF5IiwibXVsdGlJbmRleCIsImNob29zZV95ZWFyIiwieWVhckluZGV4IiwiYWRkcmVzcyIsIm1ldGhvZHMiLCJjaG9vc2VMb2NhdGlvbiIsInRoYXQiLCJ3eCIsImdldExvY2F0aW9uIiwic3VjY2VzcyIsInJlcyIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwicmVzdCIsImZldGNoRGF0YVByb21pc2UiLCJ0aGVuIiwicHJvdmluY2VOYW1lIiwiY2l0eU5hbWUiLCJkaXN0cmljdE5hbWUiLCJiaW5kUmVnaW9uQ2hhbmdlIiwiZSIsImRldGFpbCIsInZhbHVlIiwiY2hhbmdlQ2xhc3NpZnkiLCJjb25zb2xlIiwibG9nIiwiY2xhc3NpZnkiLCJiaW5kTXVsdGlQaWNrZXJDb2x1bW5DaGFuZ2UiLCJjb2x1bW4iLCJudW0iLCJwYXJzZUludCIsInNldERheXMiLCIkYXBwbHkiLCJiaW5kU3RhcnRDaGFuZ2UiLCJzdGFydERhdGUxIiwiUGlja2VyQ2hhbmdlIiwiYmluZEVuZENoYW5nZSIsImVuZERhdGUxIiwiZ2V0dGltZXMiLCJzaG93QWRkckNob3NlIiwiaXNTaG93QWRkcmVzc0Nob3NlIiwiY2FuY2VsIiwiZmluaXNoIiwiZ2V0TmFtZSIsIm5hbWUiLCJnZXRDb250ZW50IiwiY29udGVudCIsImdldGxlYWRlciIsImxlYWRlciIsImdldGFkZHJlc3MiLCJnZXR1c2VyQ291bnQiLCJ1c2VyQ2FwYWNpdHkiLCJzYXZlIiwic2VsZiIsInNob3dNb2RhbCIsInRpdGxlIiwic2hvd0NhbmNlbCIsImxlbmd0aCIsIm1lZXRpbmdUeXBlIiwic3RhcnREYXRlIiwiZW5kRGF0ZSIsInVzZXIiLCJuYXZpZ2F0ZUJhY2siLCJkZWx0YSIsInQiLCJEYXRlIiwiX3llYXJJbmRleCIsImluZm8iLCJfZGVmYXVsdFllYXIiLCJzcGxpdCIsImkiLCJnZXRGdWxsWWVhciIsInB1c2giLCJzZWxlY3RZZWFyIiwic2VsZWN0TW9udGgiLCJ0ZW1wIiwieWVhciIsImFsbERhdGVMaXN0IiwiZGF0ZUxpc3QiLCJtb250aCIsImRheSIsInRpbWVzTGlzdCIsImluZGV4IiwiaG91ciIsIm1pbnV0ZSIsIm9wdGlvbnMiLCJ0aW1lc0Z1biIsImdldE1vbnRoIiwiZ2V0RGF0ZSIsIml0ZW0iLCJzZXROYXZpZ2F0aW9uQmFyVGl0bGUiLCJKU09OIiwicGFyc2UiLCJmYWlsIiwic2V0dGltZXNEYXRlIiwiY3VycmVudE1vbnRoIiwiY3VycmVudERheSIsInNldERlZmF1bHR0aW1lcyIsIm9wdGlvbiIsIm5hdGlvbmFsRGF0YSIsInByb3ZpbmNlcyIsInByb3ZpbmNlIiwiem9uZV9uYW1lIiwiY2l0aWVzIiwiY3VycmVudENpdGllcyIsImN1cnJlbnRQcm92aW5jZUluZGV4IiwiY2l0eXMiLCJjaXR5IiwiZGlzdHJpY3RzIiwiY3VycmVudERpc3RyaWN0cyIsImN1cnJlbnRDaXR5SW5kZXgiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDRTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFDcUJBLFc7Ozs7Ozs7Ozs7Ozs7O29NQUNuQkMsTSxHQUFTLENBQUNDLGNBQUQsQyxRQUNUQyxNLEdBQVM7QUFDTEMsb0NBQXdCLE1BRG5CO0FBRUxDLDBDQUE4QjtBQUZ6QixTLFFBSVRDLEksR0FBTztBQUNIQyx5QkFBYSxDQUNULE1BRFMsRUFFVCxLQUZTLEVBR1QsS0FIUyxFQUlULEtBSlMsRUFLVCxNQUxTLENBRFY7QUFRSEMsa0JBQU0sSUFSSDtBQVNIQyxzQkFBVSxFQVRQO0FBVUhDLGtCQUFNLFlBVkg7QUFXSEMsbUJBQU8sa0JBWEo7QUFZSDtBQUNBQyxtQkFBTyxFQWJKO0FBY0hDLG9CQUFRLEVBZEw7QUFlSEMsa0JBQU0sRUFmSDtBQWdCSEMsbUJBQU8sRUFoQko7QUFpQkhDLHFCQUFTLEVBakJOO0FBa0JIQyxvQkFBUSxFQWxCTDtBQW1CSEMsd0JBQVksRUFuQlQsRUFtQmE7QUFDaEJDLHdCQUFZLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxFQUFQLEVBQVcsRUFBWCxFQUFlLEVBQWYsQ0FwQlQsRUFvQjZCO0FBQ2hDQyx5QkFBYSxFQXJCVjtBQXNCSEMsdUJBQVcsQ0F0QlI7QUF1QkhDLHFCQUFTO0FBdkJOLFMsUUF1SlBDLE8sR0FBVTtBQUNOQywwQkFETSw0QkFDWTtBQUNkLG9CQUFJQyxPQUFPLElBQVg7QUFDQUMsbUJBQUdDLFdBQUgsQ0FBZTtBQUNYbkIsMEJBQU0sT0FESztBQUVYb0IsMkJBRlcsbUJBRUZDLEdBRkUsRUFFRztBQUNWSCwyQkFBR0YsY0FBSCxDQUFrQjtBQUNkTSxzQ0FBVUQsSUFBSUMsUUFEQTtBQUVkQyx1Q0FBV0YsSUFBSUUsU0FGRDtBQUdkSCxtQ0FIYyxtQkFHTEksSUFISyxFQUdDO0FBQ1g7QUFDQVAscUNBQUtRLGdCQUFMLENBQXNCLHlCQUF0QixFQUFpRCxFQUFDSCxVQUFVRSxLQUFLRixRQUFoQixFQUEwQkMsV0FBV0MsS0FBS0QsU0FBMUMsRUFBakQsRUFDS0csSUFETCxDQUNVLFVBQVM1QixJQUFULEVBQWU7QUFDakJtQix5Q0FBS0gsT0FBTCxHQUFlLENBQUNoQixLQUFLNkIsWUFBTixFQUFvQjdCLEtBQUs4QixRQUF6QixFQUFtQzlCLEtBQUsrQixZQUF4QyxDQUFmO0FBQ0FaLHlDQUFLaEIsUUFBTCxDQUFjYSxPQUFkLEdBQXdCaEIsS0FBS2dCLE9BQTdCO0FBQ0gsaUNBSkw7QUFLSDtBQVZhLHlCQUFsQjtBQVlIO0FBZlUsaUJBQWY7QUFrQkgsYUFyQks7QUFzQk5nQiw0QkF0Qk0sNEJBc0JZQyxDQXRCWixFQXNCZTtBQUNqQixxQkFBS2pCLE9BQUwsR0FBZWlCLEVBQUVDLE1BQUYsQ0FBU0MsS0FBeEI7QUFDQSxxQkFBS2hDLFFBQUwsQ0FBY2EsT0FBZCxHQUF3QixFQUF4QjtBQUNILGFBekJLO0FBMEJOb0IsMEJBMUJNLDBCQTBCVUgsQ0ExQlYsRUEwQmE7QUFDZkksd0JBQVFDLEdBQVIsQ0FBWUwsQ0FBWjtBQUNBLHFCQUFLOUIsUUFBTCxDQUFjb0MsUUFBZCxHQUF5Qk4sRUFBRUMsTUFBRixDQUFTQyxLQUFsQztBQUNILGFBN0JLOztBQThCTjtBQUNBSyx1Q0EvQk0sdUNBK0JzQlAsQ0EvQnRCLEVBK0J5QjtBQUMvQjtBQUNJLG9CQUFJQSxFQUFFQyxNQUFGLENBQVNPLE1BQVQsS0FBb0IsQ0FBeEIsRUFBMkI7QUFDdkIseUJBQUszQixXQUFMLEdBQW1CLEtBQUtGLFVBQUwsQ0FBZ0JxQixFQUFFQyxNQUFGLENBQVNPLE1BQXpCLEVBQWlDUixFQUFFQyxNQUFGLENBQVNDLEtBQTFDLENBQW5CO0FBQ0FFLDRCQUFRQyxHQUFSLENBQVksS0FBS3hCLFdBQWpCO0FBQ0g7QUFDRDtBQUNBO0FBQ0Esb0JBQUltQixFQUFFQyxNQUFGLENBQVNPLE1BQVQsS0FBb0IsQ0FBeEIsRUFBMkI7QUFDdkIsd0JBQUlDLE1BQU1DLFNBQVMsS0FBSy9CLFVBQUwsQ0FBZ0JxQixFQUFFQyxNQUFGLENBQVNPLE1BQXpCLEVBQWlDUixFQUFFQyxNQUFGLENBQVNDLEtBQTFDLENBQVQsQ0FBVjtBQUNBLHlCQUFLdkIsVUFBTCxDQUFnQixDQUFoQixJQUFxQixLQUFLZ0MsT0FBTCxDQUFhLEtBQUs5QixXQUFsQixFQUErQjRCLEdBQS9CLENBQXJCO0FBQ0g7O0FBRUQscUJBQUs3QixVQUFMLENBQWdCb0IsRUFBRUMsTUFBRixDQUFTTyxNQUF6QixJQUFtQ1IsRUFBRUMsTUFBRixDQUFTQyxLQUE1QztBQUNBLHFCQUFLVSxNQUFMO0FBQ0gsYUE5Q0s7QUErQ05DLDJCQS9DTSwyQkErQ1diLENBL0NYLEVBK0NjO0FBQ2hCLHFCQUFLOUIsUUFBTCxDQUFjNEMsVUFBZCxHQUEyQixLQUFLQyxZQUFMLENBQWtCZixDQUFsQixDQUEzQjtBQUNILGFBakRLO0FBa0ROZ0IseUJBbERNLHlCQWtEU2hCLENBbERULEVBa0RZO0FBQ2QscUJBQUs5QixRQUFMLENBQWMrQyxRQUFkLEdBQXlCLEtBQUtGLFlBQUwsQ0FBa0JmLENBQWxCLENBQXpCO0FBQ0gsYUFwREs7OztBQXNETjtBQUNBa0Isb0JBdkRNLG9CQXVESTlDLEtBdkRKLEVBdURXO0FBQ2JnQyx3QkFBUUMsR0FBUixDQUFZakMsS0FBWjtBQUNILGFBekRLO0FBMEROK0MseUJBMURNLDJCQTBEVTtBQUFFO0FBQ2QscUJBQUtDLGtCQUFMLEdBQTBCLENBQUMsS0FBS3JELElBQUwsQ0FBVXFELGtCQUFyQztBQUNILGFBNURLO0FBNkROQyxrQkE3RE0sb0JBNkRHO0FBQUU7QUFDUCxxQkFBS0Qsa0JBQUwsR0FBMEIsS0FBMUI7QUFDSCxhQS9ESztBQWdFTkUsa0JBaEVNLG9CQWdFRztBQUFFO0FBQ1AscUJBQUtGLGtCQUFMLEdBQTBCLEtBQTFCO0FBQ0gsYUFsRUs7QUFtRU5HLG1CQW5FTSxtQkFtRUV2QixDQW5FRixFQW1FSztBQUFFO0FBQ1QscUJBQUs5QixRQUFMLENBQWNzRCxJQUFkLEdBQXFCeEIsRUFBRUMsTUFBRixDQUFTQyxLQUE5QjtBQUNBLHFCQUFLVSxNQUFMO0FBQ0gsYUF0RUs7QUF1RU5hLHNCQXZFTSxzQkF1RUt6QixDQXZFTCxFQXVFUTtBQUFFO0FBQ1oscUJBQUs5QixRQUFMLENBQWN3RCxPQUFkLEdBQXdCMUIsRUFBRUMsTUFBRixDQUFTQyxLQUFqQztBQUNBLHFCQUFLVSxNQUFMO0FBQ0gsYUExRUs7QUEyRU5lLHFCQTNFTSxxQkEyRUkzQixDQTNFSixFQTJFTztBQUFFO0FBQ1gscUJBQUs5QixRQUFMLENBQWMwRCxNQUFkLEdBQXVCNUIsRUFBRUMsTUFBRixDQUFTQyxLQUFoQztBQUNBLHFCQUFLVSxNQUFMO0FBQ0gsYUE5RUs7QUErRU5pQixzQkEvRU0sc0JBK0VLN0IsQ0EvRUwsRUErRVE7QUFBRTtBQUNaLHFCQUFLOUIsUUFBTCxDQUFjYSxPQUFkLEdBQXdCaUIsRUFBRUMsTUFBRixDQUFTQyxLQUFqQztBQUNBLHFCQUFLVSxNQUFMO0FBQ0gsYUFsRks7QUFtRk5rQix3QkFuRk0sd0JBbUZPOUIsQ0FuRlAsRUFtRlU7QUFBRTtBQUNkLHFCQUFLOUIsUUFBTCxDQUFjNkQsWUFBZCxHQUE2Qi9CLEVBQUVDLE1BQUYsQ0FBU0MsS0FBdEM7QUFDQSxxQkFBS1UsTUFBTDtBQUNILGFBdEZLO0FBdUZOb0IsZ0JBdkZNLGtCQXVGQztBQUFFO0FBQ0wsb0JBQUlDLE9BQU8sSUFBWDtBQUNBN0Isd0JBQVFDLEdBQVIsQ0FBWSxLQUFLbkMsUUFBakI7QUFDQSxvQkFBSSxDQUFDK0QsS0FBSy9ELFFBQUwsQ0FBY3NELElBQWYsSUFBdUJTLEtBQUsvRCxRQUFMLENBQWNzRCxJQUFkLElBQXNCLEVBQWpELEVBQXFEO0FBQ2pEckMsdUJBQUcrQyxTQUFILENBQWE7QUFDVEMsK0JBQU8sSUFERTtBQUVUVCxpQ0FBUyxRQUZBO0FBR1RVLG9DQUFZO0FBSEgscUJBQWI7QUFLQTtBQUNILGlCQVBELE1BT08sSUFBSSxDQUFDSCxLQUFLL0QsUUFBTCxDQUFjMEQsTUFBZixJQUF5QkssS0FBSy9ELFFBQUwsQ0FBYzBELE1BQWQsSUFBd0IsRUFBckQsRUFBeUQ7QUFDNUR6Qyx1QkFBRytDLFNBQUgsQ0FBYTtBQUNUQywrQkFBTyxJQURFO0FBRVRULGlDQUFTLE9BRkE7QUFHVFUsb0NBQVk7QUFISCxxQkFBYjtBQUtBO0FBQ0gsaUJBUE0sTUFPQSxJQUFJLENBQUNILEtBQUsvRCxRQUFMLENBQWNvQyxRQUFmLElBQTJCMkIsS0FBSy9ELFFBQUwsQ0FBY29DLFFBQWQsSUFBMEIsRUFBekQsRUFBNkQ7QUFDaEVuQix1QkFBRytDLFNBQUgsQ0FBYTtBQUNUQywrQkFBTyxJQURFO0FBRVRULGlDQUFTLFFBRkE7QUFHVFUsb0NBQVk7QUFISCxxQkFBYjtBQUtBO0FBQ0gsaUJBUE0sTUFPQSxJQUFJLENBQUNILEtBQUtsRCxPQUFOLElBQWlCa0QsS0FBS2xELE9BQUwsSUFBZ0IsRUFBakMsSUFBdUNrRCxLQUFLbEQsT0FBTCxDQUFhc0QsTUFBYixLQUF3QixDQUFuRSxFQUFzRTtBQUN6RWxELHVCQUFHK0MsU0FBSCxDQUFhO0FBQ1RDLCtCQUFPLElBREU7QUFFVFQsaUNBQVMsT0FGQTtBQUdUVSxvQ0FBWTtBQUhILHFCQUFiO0FBS0E7QUFDSCxpQkFQTSxNQU9BLElBQUksQ0FBQ0gsS0FBSy9ELFFBQUwsQ0FBY2EsT0FBZixJQUEwQmtELEtBQUsvRCxRQUFMLENBQWNhLE9BQWQsSUFBeUIsRUFBdkQsRUFBMkQ7QUFDOURJLHVCQUFHK0MsU0FBSCxDQUFhO0FBQ1RDLCtCQUFPLElBREU7QUFFVFQsaUNBQVMsUUFGQTtBQUdUVSxvQ0FBWTtBQUhILHFCQUFiO0FBS0E7QUFDSCxpQkFQTSxNQU9BLElBQUksQ0FBQ0gsS0FBSy9ELFFBQUwsQ0FBY3NELElBQWYsSUFBdUJTLEtBQUsvRCxRQUFMLENBQWNzRCxJQUFkLElBQXNCLEVBQWpELEVBQXFEO0FBQ3hEckMsdUJBQUcrQyxTQUFILENBQWE7QUFDVEMsK0JBQU8sSUFERTtBQUVUVCxpQ0FBUyxRQUZBO0FBR1RVLG9DQUFZO0FBSEgscUJBQWI7QUFLQTtBQUNILGlCQVBNLE1BT0EsSUFBSSxDQUFDSCxLQUFLL0QsUUFBTCxDQUFjc0QsSUFBZixJQUF1QlMsS0FBSy9ELFFBQUwsQ0FBY3NELElBQWQsSUFBc0IsRUFBakQsRUFBcUQ7QUFDeERyQyx1QkFBRytDLFNBQUgsQ0FBYTtBQUNUQywrQkFBTyxJQURFO0FBRVRULGlDQUFTLFFBRkE7QUFHVFUsb0NBQVk7QUFISCxxQkFBYjtBQUtBO0FBQ0g7QUFDRCxxQkFBS2xFLFFBQUwsQ0FBY29FLFdBQWQsR0FBNEIsS0FBS3RFLFdBQUwsQ0FBaUIsS0FBS0UsUUFBTCxDQUFjb0MsUUFBL0IsQ0FBNUI7QUFDQSxxQkFBS3BDLFFBQUwsQ0FBYzBCLFlBQWQsR0FBNkIsS0FBS2IsT0FBTCxDQUFhLENBQWIsQ0FBN0I7QUFDQSxxQkFBS2IsUUFBTCxDQUFjMkIsUUFBZCxHQUF5QixLQUFLZCxPQUFMLENBQWEsQ0FBYixDQUF6QjtBQUNBLHFCQUFLYixRQUFMLENBQWM0QixZQUFkLEdBQTZCLEtBQUtmLE9BQUwsQ0FBYSxDQUFiLENBQTdCO0FBQ0EscUJBQUtiLFFBQUwsQ0FBY3FFLFNBQWQsR0FBMEIsS0FBS3JFLFFBQUwsQ0FBYzRDLFVBQWQsR0FBMkIsS0FBckQ7QUFDQSxxQkFBSzVDLFFBQUwsQ0FBY3NFLE9BQWQsR0FBd0IsS0FBS3RFLFFBQUwsQ0FBYytDLFFBQWQsR0FBeUIsS0FBakQ7QUFDQSxvQkFBSWdCLEtBQUtoRSxJQUFMLElBQWEsTUFBakIsRUFBeUI7QUFDckIseUJBQUtDLFFBQUwsQ0FBY3VFLElBQWQsR0FBcUIsSUFBckI7QUFDQSx5QkFBSy9DLGdCQUFMLENBQXNCLHNDQUF0QixFQUE4RCxLQUFLeEIsUUFBbkUsRUFDS3lCLElBREwsQ0FDVSxVQUFTNUIsSUFBVCxFQUFlO0FBQ2pCa0UsNkJBQUsvRCxRQUFMLEdBQWdCLEVBQWhCO0FBQ0E7QUFDQWlCLDJCQUFHdUQsWUFBSCxDQUFnQjtBQUNaQyxtQ0FBTztBQURLLHlCQUFoQjtBQUdBViw2QkFBS3JCLE1BQUw7QUFDSCxxQkFSTDtBQVNILGlCQVhELE1BV087QUFDSCx5QkFBS2xCLGdCQUFMLENBQXNCLHNDQUF0QixFQUE4RCxLQUFLeEIsUUFBbkUsRUFDS3lCLElBREwsQ0FDVSxVQUFTNUIsSUFBVCxFQUFlO0FBQ2pCa0UsNkJBQUsvRCxRQUFMLEdBQWdCLEVBQWhCO0FBQ0E7QUFDQWlCLDJCQUFHdUQsWUFBSCxDQUFnQjtBQUNaQyxtQ0FBTztBQURLLHlCQUFoQjtBQUdBViw2QkFBS3JCLE1BQUw7QUFDSCxxQkFSTDtBQVNIO0FBQ0o7QUF4S0ssUzs7Ozs7O0FBOUhWO2lDQUNVZ0MsQyxFQUFHO0FBQ1QsZ0JBQUlBLElBQUksRUFBUixFQUFZLE9BQU8sTUFBTUEsQ0FBYixDQUFaLEtBQ0ssT0FBT0EsQ0FBUDtBQUNSO0FBQ0Q7Ozs7dUNBQ2U7QUFDWCxnQkFBTXpFLE9BQU8sSUFBSTBFLElBQUosRUFBYjtBQUNBLGdCQUFJQyxhQUFhLENBQWpCO0FBQ0E7QUFDQTFDLG9CQUFRMkMsSUFBUixDQUFhLEtBQUszRSxLQUFsQjtBQUNBLGdCQUFJNEUsZUFBZSxLQUFLNUUsS0FBTCxHQUFhLEtBQUtBLEtBQUwsQ0FBVzZFLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsQ0FBdEIsQ0FBYixHQUF3QyxDQUEzRDtBQUNBO0FBQ0EsaUJBQUssSUFBSUMsSUFBSS9FLEtBQUtnRixXQUFMLEVBQWIsRUFBaUNELEtBQUsvRSxLQUFLZ0YsV0FBTCxLQUFxQixDQUEzRCxFQUE4REQsR0FBOUQsRUFBbUU7QUFDL0QscUJBQUs3RSxLQUFMLENBQVcrRSxJQUFYLENBQWdCLEtBQUtGLENBQXJCO0FBQ0E7QUFDQSxvQkFBSUYsZ0JBQWdCRSxNQUFNeEMsU0FBU3NDLFlBQVQsQ0FBMUIsRUFBa0Q7QUFDOUMseUJBQUtsRSxTQUFMLEdBQWlCZ0UsVUFBakI7QUFDQSx5QkFBS2pFLFdBQUwsR0FBbUJtRSxZQUFuQjtBQUNIO0FBQ0RGLDZCQUFhQSxhQUFhLENBQTFCO0FBQ0g7QUFDRDtBQUNBLGlCQUFLLElBQUlJLEtBQUksQ0FBYixFQUFnQkEsTUFBSyxFQUFyQixFQUF5QkEsSUFBekIsRUFBOEI7QUFDMUIsb0JBQUlBLEtBQUksRUFBUixFQUFZO0FBQ1JBLHlCQUFJLE1BQU1BLEVBQVY7QUFDSDtBQUNELHFCQUFLNUUsTUFBTCxDQUFZOEUsSUFBWixDQUFpQixLQUFLRixFQUF0QjtBQUNIO0FBQ0Q7QUFDQSxpQkFBSyxJQUFJQSxNQUFJLENBQWIsRUFBZ0JBLE9BQUssRUFBckIsRUFBeUJBLEtBQXpCLEVBQThCO0FBQzFCLG9CQUFJQSxNQUFJLEVBQVIsRUFBWTtBQUNSQSwwQkFBSSxNQUFNQSxHQUFWO0FBQ0g7QUFDRCxxQkFBSzNFLElBQUwsQ0FBVTZFLElBQVYsQ0FBZSxLQUFLRixHQUFwQjtBQUNIO0FBQ0Q7QUFDQSxpQkFBSyxJQUFJQSxNQUFJLENBQWIsRUFBZ0JBLE1BQUksRUFBcEIsRUFBd0JBLEtBQXhCLEVBQTZCO0FBQ3pCLG9CQUFJQSxNQUFJLEVBQVIsRUFBWTtBQUNSQSwwQkFBSSxNQUFNQSxHQUFWO0FBQ0g7QUFDRCxxQkFBSzFFLEtBQUwsQ0FBVzRFLElBQVgsQ0FBZ0IsS0FBS0YsR0FBckI7QUFDSDtBQUNEO0FBQ0EsaUJBQUssSUFBSUEsTUFBSSxDQUFiLEVBQWdCQSxNQUFJLEVBQXBCLEVBQXdCQSxLQUF4QixFQUE2QjtBQUN6QixvQkFBSUEsTUFBSSxFQUFSLEVBQVk7QUFDUkEsMEJBQUksTUFBTUEsR0FBVjtBQUNIO0FBQ0QscUJBQUt6RSxPQUFMLENBQWEyRSxJQUFiLENBQWtCLEtBQUtGLEdBQXZCO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7Ozs7Z0NBQ1FHLFUsRUFBWUMsVyxFQUFhO0FBQzdCLGdCQUFJN0MsTUFBTTZDLFdBQVY7QUFDQSxnQkFBSUMsT0FBTyxFQUFYO0FBQ0EsZ0JBQUk5QyxRQUFRLENBQVIsSUFBYUEsUUFBUSxDQUFyQixJQUEwQkEsUUFBUSxDQUFsQyxJQUF1Q0EsUUFBUSxDQUEvQyxJQUFvREEsUUFBUSxDQUE1RCxJQUFpRUEsUUFBUSxFQUF6RSxJQUErRUEsUUFBUSxFQUEzRixFQUErRjtBQUMzRjtBQUNBLHFCQUFLLElBQUl5QyxJQUFJLENBQWIsRUFBZ0JBLEtBQUssRUFBckIsRUFBeUJBLEdBQXpCLEVBQThCO0FBQzFCLHdCQUFJQSxJQUFJLEVBQVIsRUFBWTtBQUNSQSw0QkFBSSxNQUFNQSxDQUFWO0FBQ0g7QUFDREsseUJBQUtILElBQUwsQ0FBVSxLQUFLRixDQUFmO0FBQ0g7QUFDSixhQVJELE1BUU8sSUFBSXpDLFFBQVEsQ0FBUixJQUFhQSxRQUFRLENBQXJCLElBQTBCQSxRQUFRLENBQWxDLElBQXVDQSxRQUFRLEVBQW5ELEVBQXVEO0FBQUU7QUFDNUQscUJBQUssSUFBSXlDLE1BQUksQ0FBYixFQUFnQkEsT0FBSyxFQUFyQixFQUF5QkEsS0FBekIsRUFBOEI7QUFDMUIsd0JBQUlBLE1BQUksRUFBUixFQUFZO0FBQ1JBLDhCQUFJLE1BQU1BLEdBQVY7QUFDSDtBQUNESyx5QkFBS0gsSUFBTCxDQUFVLEtBQUtGLEdBQWY7QUFDSDtBQUNKLGFBUE0sTUFPQSxJQUFJekMsUUFBUSxDQUFaLEVBQWU7QUFBRTtBQUNwQixvQkFBSStDLE9BQU85QyxTQUFTMkMsVUFBVCxDQUFYO0FBQ0FqRCx3QkFBUUMsR0FBUixDQUFZbUQsSUFBWjtBQUNBLG9CQUFJLENBQUVBLE9BQU8sR0FBUCxLQUFlLENBQWhCLElBQXVCQSxPQUFPLEdBQVAsS0FBZSxDQUF2QyxLQUErQ0EsT0FBTyxDQUFQLEtBQWEsQ0FBaEUsRUFBb0U7QUFDaEUseUJBQUssSUFBSU4sTUFBSSxDQUFiLEVBQWdCQSxPQUFLLEVBQXJCLEVBQXlCQSxLQUF6QixFQUE4QjtBQUMxQiw0QkFBSUEsTUFBSSxFQUFSLEVBQVk7QUFDUkEsa0NBQUksTUFBTUEsR0FBVjtBQUNIO0FBQ0RLLDZCQUFLSCxJQUFMLENBQVUsS0FBS0YsR0FBZjtBQUNIO0FBQ0osaUJBUEQsTUFPTztBQUNILHlCQUFLLElBQUlBLE1BQUksQ0FBYixFQUFnQkEsT0FBSyxFQUFyQixFQUF5QkEsS0FBekIsRUFBOEI7QUFDMUIsNEJBQUlBLE1BQUksRUFBUixFQUFZO0FBQ1JBLGtDQUFJLE1BQU1BLEdBQVY7QUFDSDtBQUNESyw2QkFBS0gsSUFBTCxDQUFVLEtBQUtGLEdBQWY7QUFDSDtBQUNKO0FBQ0o7QUFDRCxtQkFBT0ssSUFBUDtBQUNIO0FBQ0Q7Ozs7MENBQ2tCO0FBQ2QsZ0JBQUlFLGNBQWMsS0FBS3JGLEtBQUwsQ0FBVzZFLEtBQVgsQ0FBaUIsR0FBakIsQ0FBbEI7QUFDQTtBQUNBLGdCQUFJUyxXQUFXRCxZQUFZLENBQVosRUFBZVIsS0FBZixDQUFxQixHQUFyQixDQUFmO0FBQ0EsZ0JBQUlVLFFBQVFqRCxTQUFTZ0QsU0FBUyxDQUFULENBQVQsSUFBd0IsQ0FBcEM7QUFDQSxnQkFBSUUsTUFBTWxELFNBQVNnRCxTQUFTLENBQVQsQ0FBVCxJQUF3QixDQUFsQztBQUNBO0FBQ0EsZ0JBQUlHLFlBQVlKLFlBQVksQ0FBWixFQUFlUixLQUFmLENBQXFCLEdBQXJCLENBQWhCO0FBQ0EsaUJBQUt0RSxVQUFMLENBQWdCLENBQWhCLElBQXFCLEtBQUtnQyxPQUFMLENBQWErQyxTQUFTLENBQVQsQ0FBYixFQUEwQmhELFNBQVNnRCxTQUFTLENBQVQsQ0FBVCxDQUExQixDQUFyQjtBQUNBLGlCQUFLOUUsVUFBTCxHQUFrQixDQUFDLEtBQUtFLFNBQU4sRUFBaUI2RSxLQUFqQixFQUF3QkMsR0FBeEIsRUFBNkJDLFVBQVUsQ0FBVixDQUE3QixFQUEyQ0EsVUFBVSxDQUFWLENBQTNDLENBQWxCO0FBQ0g7QUFDRDs7OztxQ0FDYTdELEMsRUFBRztBQUNaO0FBQ0EsaUJBQUtwQixVQUFMLEdBQWtCb0IsRUFBRUMsTUFBRixDQUFTQyxLQUEzQjtBQUNBLGdCQUFNNEQsUUFBUSxLQUFLbEYsVUFBbkI7QUFDQSxnQkFBTTRFLE9BQU8sS0FBSzdFLFVBQUwsQ0FBZ0IsQ0FBaEIsRUFBbUJtRixNQUFNLENBQU4sQ0FBbkIsQ0FBYjtBQUNBLGdCQUFNSCxRQUFRLEtBQUtoRixVQUFMLENBQWdCLENBQWhCLEVBQW1CbUYsTUFBTSxDQUFOLENBQW5CLENBQWQ7QUFDQSxnQkFBTUYsTUFBTSxLQUFLakYsVUFBTCxDQUFnQixDQUFoQixFQUFtQm1GLE1BQU0sQ0FBTixDQUFuQixDQUFaO0FBQ0EsZ0JBQU1DLE9BQU8sS0FBS3BGLFVBQUwsQ0FBZ0IsQ0FBaEIsRUFBbUJtRixNQUFNLENBQU4sQ0FBbkIsQ0FBYjtBQUNBLGdCQUFNRSxTQUFTLEtBQUtyRixVQUFMLENBQWdCLENBQWhCLEVBQW1CbUYsTUFBTSxDQUFOLENBQW5CLENBQWY7QUFDQTtBQUNBO0FBQ0EsaUJBQUsxRixLQUFMLEdBQWFvRixPQUFPLEdBQVAsR0FBYUcsS0FBYixHQUFxQixHQUFyQixHQUEyQkMsR0FBM0IsR0FBaUMsR0FBakMsR0FBdUNHLElBQXZDLEdBQThDLEdBQTlDLEdBQW9EQyxNQUFqRTtBQUNBLGlCQUFLcEQsTUFBTDtBQUNBLG1CQUFPLEtBQUt4QyxLQUFaO0FBQ0g7Ozs7QUEyS0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOytCQUNPNkYsTyxFQUFTO0FBQ1o7QUFDQSxpQkFBSzdGLEtBQUwsR0FBYSxJQUFJeUUsSUFBSixHQUFXTSxXQUFYLEtBQTJCLEdBQTNCLEdBQWlDLEtBQUtlLFFBQUwsQ0FBYyxJQUFJckIsSUFBSixHQUFXc0IsUUFBWCxLQUF3QixDQUF0QyxDQUFqQyxHQUE0RSxHQUE1RSxHQUFrRixLQUFLRCxRQUFMLENBQWMsSUFBSXJCLElBQUosR0FBV3VCLE9BQVgsRUFBZCxDQUFsRixHQUF3SCxHQUF4SCxHQUE4SCxJQUEzSTtBQUNBLGdCQUFJbEYsT0FBTyxJQUFYO0FBQ0EsZ0JBQUkrRSxRQUFRSSxJQUFaLEVBQWtCO0FBQ2RsRixtQkFBR21GLHFCQUFILENBQXlCO0FBQ3JCbkMsMkJBQU87QUFEYyxpQkFBekI7QUFHQWpELHFCQUFLakIsSUFBTCxHQUFZLE1BQVo7QUFDQSxxQkFBS0MsUUFBTCxHQUFnQnFHLEtBQUtDLEtBQUwsQ0FBV1AsUUFBUUksSUFBbkIsQ0FBaEI7QUFDQSxxQkFBS25HLFFBQUwsQ0FBYzRDLFVBQWQsR0FBMkIsS0FBSzVDLFFBQUwsQ0FBYzRDLFVBQWQsQ0FBeUJtQyxLQUF6QixDQUErQixHQUEvQixFQUFvQyxDQUFwQyxJQUF5QyxHQUF6QyxHQUErQyxLQUFLL0UsUUFBTCxDQUFjNEMsVUFBZCxDQUF5Qm1DLEtBQXpCLENBQStCLEdBQS9CLEVBQW9DLENBQXBDLEVBQXVDQSxLQUF2QyxDQUE2QyxHQUE3QyxFQUFrRCxDQUFsRCxDQUExRTtBQUNBLHFCQUFLL0UsUUFBTCxDQUFjK0MsUUFBZCxHQUF5QixLQUFLL0MsUUFBTCxDQUFjK0MsUUFBZCxDQUF1QmdDLEtBQXZCLENBQTZCLEdBQTdCLEVBQWtDLENBQWxDLElBQXVDLEdBQXZDLEdBQTZDLEtBQUsvRSxRQUFMLENBQWM0QyxVQUFkLENBQXlCbUMsS0FBekIsQ0FBK0IsR0FBL0IsRUFBb0MsQ0FBcEMsRUFBdUNBLEtBQXZDLENBQTZDLEdBQTdDLEVBQWtELENBQWxELENBQXRFO0FBQ0EscUJBQUs3RSxLQUFMLEdBQWEsS0FBS0YsUUFBTCxDQUFjNEMsVUFBM0I7QUFDSDs7QUFFRDNCLGVBQUdDLFdBQUgsQ0FBZTtBQUNYbkIsc0JBQU0sT0FESztBQUVYb0IseUJBQVMsaUJBQVVDLEdBQVYsRUFBZTtBQUNwQmMsNEJBQVFDLEdBQVIsQ0FBWWYsR0FBWjs7QUFFQUoseUJBQUtoQixRQUFMLENBQWNxQixRQUFkLEdBQXlCRCxJQUFJQyxRQUE3QjtBQUNBTCx5QkFBS2hCLFFBQUwsQ0FBY3NCLFNBQWQsR0FBMEJGLElBQUlFLFNBQTlCO0FBQ0gsaUJBUFU7QUFRWGlGLHNCQUFNLGNBQVVuRixHQUFWLEVBQWU7QUFDakJjLDRCQUFRQyxHQUFSLENBQVlmLEdBQVo7QUFDSDtBQVZVLGFBQWY7QUFZQSxpQkFBS29GLFlBQUw7QUFDQTtBQUNBLGlCQUFLL0YsVUFBTCxHQUFrQixDQUFDLEtBQUtOLEtBQU4sRUFBYSxLQUFLQyxNQUFsQixFQUEwQixLQUFLQyxJQUEvQixFQUFxQyxLQUFLQyxLQUExQyxFQUFpRCxLQUFLQyxPQUF0RCxDQUFsQjtBQUNBO0FBQ0E7QUFDQSxpQkFBS0ksV0FBTCxHQUFtQixLQUFLRixVQUFMLENBQWdCLENBQWhCLEVBQW1CLENBQW5CLENBQW5CO0FBQ0EsZ0JBQUksQ0FBQyxLQUFLUCxLQUFWLEVBQWlCO0FBQ2pCO0FBQ0ksb0JBQUlELE9BQU8sSUFBSTBFLElBQUosRUFBWDtBQUNBLG9CQUFJOEIsZUFBZXhHLEtBQUtnRyxRQUFMLEVBQW5CO0FBQ0Esb0JBQUlTLGFBQWF6RyxLQUFLaUcsT0FBTCxLQUFpQixDQUFsQztBQUNBO0FBQ0E7QUFDQSxxQkFBS3pGLFVBQUwsQ0FBZ0IsQ0FBaEIsSUFBcUIsS0FBS2dDLE9BQUwsQ0FBYSxLQUFLOUIsV0FBbEIsRUFBK0I4RixlQUFlLENBQTlDLENBQXJCO0FBQ0EscUJBQUsvRixVQUFMLEdBQWtCLENBQUMsQ0FBRCxFQUFJK0YsWUFBSixFQUFrQkMsVUFBbEIsRUFBOEIsRUFBOUIsRUFBa0MsQ0FBbEMsQ0FBbEI7QUFDSCxhQVRELE1BU087QUFDSCxxQkFBS0MsZUFBTDtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQUtqRSxNQUFMO0FBQ0g7OzsyQ0FDa0I7QUFDZjtBQUNBLGlCQUFLQSxNQUFMO0FBQ0g7OzswQ0FDaUJrRSxNLEVBQVE7QUFBRTtBQUN4QjtBQUNBLGdCQUFJQyxlQUFlLEtBQUtBLFlBQXhCO0FBQ0E7QUFDQSxnQkFBSSxLQUFLQyxTQUFMLENBQWUzQyxNQUFmLElBQXlCLENBQTdCLEVBQWdDO0FBQzVCLG9CQUFJMkMsWUFBWSxLQUFLakgsSUFBTCxDQUFVaUgsU0FBMUI7QUFDQSxxQkFBSyxJQUFJOUIsSUFBSSxDQUFiLEVBQWdCQSxJQUFJNkIsYUFBYTFDLE1BQWpDLEVBQXlDYSxHQUF6QyxFQUE4QztBQUMxQzhCLDhCQUFVNUIsSUFBVixDQUFlO0FBQ1hVLCtCQUFPWixDQURJO0FBRVgrQixrQ0FBVUYsYUFBYTdCLENBQWIsRUFBZ0JnQztBQUZmLHFCQUFmO0FBSUg7QUFDRCxxQkFBS0YsU0FBTCxHQUFpQkEsU0FBakI7QUFDSDtBQUNEO0FBQ0EsZ0JBQUlGLE9BQU83RyxJQUFQLElBQWUsTUFBZixJQUF5QjZHLE9BQU83RyxJQUFQLElBQWUsS0FBNUMsRUFBbUQ7QUFDbkQ7QUFDSSxxQkFBS2tILE1BQUwsR0FBYyxFQUFkO0FBQ0Esb0JBQUlBLFNBQVMsS0FBS0EsTUFBbEI7QUFDQSxvQkFBSUMsZ0JBQWdCTCxhQUFhRCxPQUFPTyxvQkFBcEIsRUFBMENDLEtBQTlEO0FBQ0EscUJBQUssSUFBSXBDLElBQUksQ0FBYixFQUFnQkEsSUFBSWtDLGNBQWMvQyxNQUFsQyxFQUEwQ2EsR0FBMUMsRUFBK0M7QUFDM0NpQywyQkFBTy9CLElBQVAsQ0FBWTtBQUNSVSwrQkFBT1osQ0FEQztBQUVScUMsOEJBQU1ILGNBQWNsQyxDQUFkLEVBQWlCZ0M7QUFGZixxQkFBWjtBQUlIO0FBQ0QscUJBQUtDLE1BQUwsR0FBY0EsTUFBZDtBQUNIO0FBQ0Q7QUFDQTtBQUNBLGlCQUFLSyxTQUFMLEdBQWlCLEVBQWpCO0FBQ0EsZ0JBQUlBLFlBQVksS0FBS0EsU0FBckI7QUFDQSxnQkFBSUMsbUJBQW1CVixhQUFhRCxPQUFPTyxvQkFBcEIsRUFBMENDLEtBQTFDLENBQWdEUixPQUFPWSxnQkFBdkQsRUFBeUVGLFNBQWhHO0FBQ0EsaUJBQUssSUFBSXRDLElBQUksQ0FBYixFQUFnQkEsSUFBSXVDLGlCQUFpQnBELE1BQXJDLEVBQTZDYSxHQUE3QyxFQUFrRDtBQUM5QyxvQkFBSUEsS0FBSyxDQUFULEVBQVk7QUFDUnNDLDhCQUFVcEMsSUFBVixDQUFlcUMsaUJBQWlCdkMsQ0FBakIsRUFBb0JnQyxTQUFuQztBQUNIO0FBQ0o7QUFDRCxpQkFBS00sU0FBTCxHQUFpQkEsU0FBakI7QUFDQSxpQkFBSzVFLE1BQUw7QUFDSDs7OztFQWhic0MrRSxlQUFLQyxJOztrQkFBekJuSSxXIiwiZmlsZSI6ImVkaXRBZGRyZXNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbiAgaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XHJcbiAgaW1wb3J0IFBhZ2VNaXhpbiBmcm9tICcuLi9taXhpbnMvcGFnZSc7XHJcbiAgZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWRpdEFkZHJlc3MgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gICAgbWl4aW5zID0gW1BhZ2VNaXhpbl07XHJcbiAgICBjb25maWcgPSB7XHJcbiAgICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+WIm+W7uuS8muiuricsXHJcbiAgICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNmZmYnXHJcbiAgICB9O1xyXG4gICAgZGF0YSA9IHtcclxuICAgICAgICBjbGFzc2lmeUFyeTogW1xyXG4gICAgICAgICAgICAn57uP6ZSA5ZWG5LyaJyxcclxuICAgICAgICAgICAgJ+WGnOawkeS8micsXHJcbiAgICAgICAgICAgICfop4LmkankvJonLFxyXG4gICAgICAgICAgICAn5L+D6ZSA5LyaJyxcclxuICAgICAgICAgICAgJ+WFtuS7luS8muiuridcclxuICAgICAgICBdLFxyXG4gICAgICAgIHR5cGU6IG51bGwsXHJcbiAgICAgICAgZm9ybURhdGE6IHt9LFxyXG4gICAgICAgIGRhdGU6ICcyMDE2LTA5LTAxJyxcclxuICAgICAgICB0aW1lczogJzIwMjAtMDctMjkgMTI6NTAnLFxyXG4gICAgICAgIC8vIOaXtumXtOmAieaLqeWZqOWPguaVsFxyXG4gICAgICAgIHllYXJzOiBbXSxcclxuICAgICAgICBtb250aHM6IFtdLFxyXG4gICAgICAgIGRheXM6IFtdLFxyXG4gICAgICAgIGhvdXJzOiBbXSxcclxuICAgICAgICBtaW51dGVzOiBbXSxcclxuICAgICAgICBzZWNvbmQ6IFtdLFxyXG4gICAgICAgIG11bHRpQXJyYXk6IFtdLCAvLyDpgInmi6nojIPlm7RcclxuICAgICAgICBtdWx0aUluZGV4OiBbMCwgOSwgMTYsIDEzLCAxN10sIC8vIOmAieS4reWAvOaVsOe7hFxyXG4gICAgICAgIGNob29zZV95ZWFyOiAnJyxcclxuICAgICAgICB5ZWFySW5kZXg6IDAsXHJcbiAgICAgICAgYWRkcmVzczogW11cclxuICAgIH07XHJcbiAgICAvLyDlt67kuIDkvY3ooaXkvY1cclxuICAgIHRpbWVzRnVuICh0KSB7XHJcbiAgICAgICAgaWYgKHQgPCAxMCkgcmV0dXJuICcwJyArIHQ7XHJcbiAgICAgICAgZWxzZSByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIC8vIOiuvue9ruWIneWni+WAvFxyXG4gICAgc2V0dGltZXNEYXRlKCkge1xyXG4gICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGxldCBfeWVhckluZGV4ID0gMDtcclxuICAgICAgICAvLyDpu5jorqTorr7nva5cclxuICAgICAgICBjb25zb2xlLmluZm8odGhpcy50aW1lcyk7XHJcbiAgICAgICAgbGV0IF9kZWZhdWx0WWVhciA9IHRoaXMudGltZXMgPyB0aGlzLnRpbWVzLnNwbGl0KCctJylbMF0gOiAwO1xyXG4gICAgICAgIC8vIOiOt+WPluW5tFxyXG4gICAgICAgIGZvciAobGV0IGkgPSBkYXRlLmdldEZ1bGxZZWFyKCk7IGkgPD0gZGF0ZS5nZXRGdWxsWWVhcigpICsgNTsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMueWVhcnMucHVzaCgnJyArIGkpO1xyXG4gICAgICAgICAgICAvLyDpu5jorqTorr7nva7nmoTlubTnmoTkvY3nva5cclxuICAgICAgICAgICAgaWYgKF9kZWZhdWx0WWVhciAmJiBpID09PSBwYXJzZUludChfZGVmYXVsdFllYXIpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnllYXJJbmRleCA9IF95ZWFySW5kZXg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNob29zZV95ZWFyID0gX2RlZmF1bHRZZWFyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF95ZWFySW5kZXggPSBfeWVhckluZGV4ICsgMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g6I635Y+W5pyI5Lu9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMTI7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgICAgICAgICBpID0gJzAnICsgaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm1vbnRocy5wdXNoKCcnICsgaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOiOt+WPluaXpeacn1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDMxOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgICAgICAgICAgaSA9ICcwJyArIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5kYXlzLnB1c2goJycgKyBpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gLy8g6I635Y+W5bCP5pe2XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyNDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpIDwgMTApIHtcclxuICAgICAgICAgICAgICAgIGkgPSAnMCcgKyBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaG91cnMucHVzaCgnJyArIGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyAvLyDojrflj5bliIbpkp9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDYwOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgICAgICAgICAgaSA9ICcwJyArIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5taW51dGVzLnB1c2goJycgKyBpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gLy8g6I635Y+W56eS5pWwXHJcbiAgICAgICAgLy8gZm9yIChsZXQgaSA9IDA7IGkgPCA2MDsgaSsrKSB7XHJcbiAgICAgICAgLy8gICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgLy8gICAgIGkgPSAnMCcgKyBpXHJcbiAgICAgICAgLy8gICB9XHJcbiAgICAgICAgLy8gICB0aGlzLnNlY29uZC5wdXNoKCcnICsgaSlcclxuICAgICAgICAvLyB9XHJcbiAgICB9XHJcbiAgICAvLyDov5Tlm57mnIjku73nmoTlpKnmlbBcclxuICAgIHNldERheXMoc2VsZWN0WWVhciwgc2VsZWN0TW9udGgpIHtcclxuICAgICAgICBsZXQgbnVtID0gc2VsZWN0TW9udGg7XHJcbiAgICAgICAgbGV0IHRlbXAgPSBbXTtcclxuICAgICAgICBpZiAobnVtID09PSAxIHx8IG51bSA9PT0gMyB8fCBudW0gPT09IDUgfHwgbnVtID09PSA3IHx8IG51bSA9PT0gOCB8fCBudW0gPT09IDEwIHx8IG51bSA9PT0gMTIpIHtcclxuICAgICAgICAgICAgLy8g5Yik5patMzHlpKnnmoTmnIjku71cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMzE7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGkgPSAnMCcgKyBpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGVtcC5wdXNoKCcnICsgaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKG51bSA9PT0gNCB8fCBudW0gPT09IDYgfHwgbnVtID09PSA5IHx8IG51bSA9PT0gMTEpIHsgLy8g5Yik5patMzDlpKnnmoTmnIjku71cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMzA7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGkgPSAnMCcgKyBpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGVtcC5wdXNoKCcnICsgaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKG51bSA9PT0gMikgeyAvLyDliKTmlq0y5pyI5Lu95aSp5pWwXHJcbiAgICAgICAgICAgIGxldCB5ZWFyID0gcGFyc2VJbnQoc2VsZWN0WWVhcik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHllYXIpO1xyXG4gICAgICAgICAgICBpZiAoKCh5ZWFyICUgNDAwID09PSAwKSB8fCAoeWVhciAlIDEwMCAhPT0gMCkpICYmICh5ZWFyICUgNCA9PT0gMCkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDI5OyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgPSAnMCcgKyBpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0ZW1wLnB1c2goJycgKyBpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDI4OyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgPSAnMCcgKyBpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0ZW1wLnB1c2goJycgKyBpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGVtcDtcclxuICAgIH1cclxuICAgIC8vIOiuvue9rum7mOiupOWAvCDmoLzlvI8yMDE5LTA3LTEwIDEwOjMwXHJcbiAgICBzZXREZWZhdWx0dGltZXMoKSB7XHJcbiAgICAgICAgbGV0IGFsbERhdGVMaXN0ID0gdGhpcy50aW1lcy5zcGxpdCgnICcpO1xyXG4gICAgICAgIC8vIOaXpeacn1xyXG4gICAgICAgIGxldCBkYXRlTGlzdCA9IGFsbERhdGVMaXN0WzBdLnNwbGl0KCctJyk7XHJcbiAgICAgICAgbGV0IG1vbnRoID0gcGFyc2VJbnQoZGF0ZUxpc3RbMV0pIC0gMTtcclxuICAgICAgICBsZXQgZGF5ID0gcGFyc2VJbnQoZGF0ZUxpc3RbMl0pIC0gMTtcclxuICAgICAgICAvLyDml7bpl7RcclxuICAgICAgICBsZXQgdGltZXNMaXN0ID0gYWxsRGF0ZUxpc3RbMV0uc3BsaXQoJzonKTtcclxuICAgICAgICB0aGlzLm11bHRpQXJyYXlbMl0gPSB0aGlzLnNldERheXMoZGF0ZUxpc3RbMF0sIHBhcnNlSW50KGRhdGVMaXN0WzFdKSk7XHJcbiAgICAgICAgdGhpcy5tdWx0aUluZGV4ID0gW3RoaXMueWVhckluZGV4LCBtb250aCwgZGF5LCB0aW1lc0xpc3RbMF0sIHRpbWVzTGlzdFsxXV07XHJcbiAgICB9XHJcbiAgICAvLyDojrflj5bml7bpl7Tml6XmnJ9cclxuICAgIFBpY2tlckNoYW5nZShlKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3BpY2tlcuWPkemAgemAieaLqeaUueWPmO+8jOaQuuW4puWAvOS4uicsIGUuZGV0YWlsLnZhbHVlKVxyXG4gICAgICAgIHRoaXMubXVsdGlJbmRleCA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5tdWx0aUluZGV4O1xyXG4gICAgICAgIGNvbnN0IHllYXIgPSB0aGlzLm11bHRpQXJyYXlbMF1baW5kZXhbMF1dO1xyXG4gICAgICAgIGNvbnN0IG1vbnRoID0gdGhpcy5tdWx0aUFycmF5WzFdW2luZGV4WzFdXTtcclxuICAgICAgICBjb25zdCBkYXkgPSB0aGlzLm11bHRpQXJyYXlbMl1baW5kZXhbMl1dO1xyXG4gICAgICAgIGNvbnN0IGhvdXIgPSB0aGlzLm11bHRpQXJyYXlbM11baW5kZXhbM11dO1xyXG4gICAgICAgIGNvbnN0IG1pbnV0ZSA9IHRoaXMubXVsdGlBcnJheVs0XVtpbmRleFs0XV07XHJcbiAgICAgICAgLy8gY29uc3Qgc2Vjb25kID0gdGhpcy5tdWx0aUFycmF5WzVdW2luZGV4WzVdXVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGAke3llYXJ9LSR7bW9udGh9LSR7ZGF5fS0ke2hvdXJ9LSR7bWludXRlfWApO1xyXG4gICAgICAgIHRoaXMudGltZXMgPSB5ZWFyICsgJy0nICsgbW9udGggKyAnLScgKyBkYXkgKyAnICcgKyBob3VyICsgJzonICsgbWludXRlO1xyXG4gICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGltZXM7XHJcbiAgICB9XHJcbiAgICBtZXRob2RzID0ge1xyXG4gICAgICAgIGNob29zZUxvY2F0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgICAgICB3eC5nZXRMb2NhdGlvbih7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnd2dzODQnLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzcyAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd3guY2hvb3NlTG9jYXRpb24oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXRpdHVkZTogcmVzLmxhdGl0dWRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb25naXR1ZGU6IHJlcy5sb25naXR1ZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MgKHJlc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWPkemAgeivt+axgumAmui/h+e7j+e6rOW6puWPjeafpeWcsOWdgOS/oeaBr1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5mZXRjaERhdGFQcm9taXNlKCdyZXNvbHZlTG9jYXRpb25BcGkuanNvbicsIHtsYXRpdHVkZTogcmVzdC5sYXRpdHVkZSwgbG9uZ2l0dWRlOiByZXN0LmxvbmdpdHVkZX0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmFkZHJlc3MgPSBbZGF0YS5wcm92aW5jZU5hbWUsIGRhdGEuY2l0eU5hbWUsIGRhdGEuZGlzdHJpY3ROYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5mb3JtRGF0YS5hZGRyZXNzID0gZGF0YS5hZGRyZXNzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gIFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYmluZFJlZ2lvbkNoYW5nZSAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZHJlc3MgPSBlLmRldGFpbC52YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5mb3JtRGF0YS5hZGRyZXNzID0gJyc7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjaGFuZ2VDbGFzc2lmeSAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgICAgdGhpcy5mb3JtRGF0YS5jbGFzc2lmeSA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8g55uR5ZCscGlja2Vy55qE5rua5Yqo5LqL5Lu2XHJcbiAgICAgICAgYmluZE11bHRpUGlja2VyQ29sdW1uQ2hhbmdlKGUpIHtcclxuICAgICAgICAvLyDojrflj5blubTku71cclxuICAgICAgICAgICAgaWYgKGUuZGV0YWlsLmNvbHVtbiA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaG9vc2VfeWVhciA9IHRoaXMubXVsdGlBcnJheVtlLmRldGFpbC5jb2x1bW5dW2UuZGV0YWlsLnZhbHVlXTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY2hvb3NlX3llYXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCfkv67mlLnnmoTliJfkuLonLCBlLmRldGFpbC5jb2x1bW4sICfvvIzlgLzkuLonLCBlLmRldGFpbC52YWx1ZSk7XHJcbiAgICAgICAgICAgIC8vIOiuvue9ruaciOS7veaVsOe7hFxyXG4gICAgICAgICAgICBpZiAoZS5kZXRhaWwuY29sdW1uID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbnVtID0gcGFyc2VJbnQodGhpcy5tdWx0aUFycmF5W2UuZGV0YWlsLmNvbHVtbl1bZS5kZXRhaWwudmFsdWVdKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubXVsdGlBcnJheVsyXSA9IHRoaXMuc2V0RGF5cyh0aGlzLmNob29zZV95ZWFyLCBudW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLm11bHRpSW5kZXhbZS5kZXRhaWwuY29sdW1uXSA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYmluZFN0YXJ0Q2hhbmdlIChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybURhdGEuc3RhcnREYXRlMSA9IHRoaXMuUGlja2VyQ2hhbmdlKGUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYmluZEVuZENoYW5nZSAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLmZvcm1EYXRhLmVuZERhdGUxID0gdGhpcy5QaWNrZXJDaGFuZ2UoZSk7XHJcbiAgICAgICAgfSxcclxuICBcclxuICAgICAgICAvLyDojrflj5bml7bpl7RcclxuICAgICAgICBnZXR0aW1lcyAodGltZXMpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2codGltZXMpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2hvd0FkZHJDaG9zZSgpIHsgLy8g5pi+56S655yB5biC5Yy66IGU5Yqo6YCJ5oup5qGGXHJcbiAgICAgICAgICAgIHRoaXMuaXNTaG93QWRkcmVzc0Nob3NlID0gIXRoaXMuZGF0YS5pc1Nob3dBZGRyZXNzQ2hvc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjYW5jZWwoKSB7IC8vIOWPlua2iFxyXG4gICAgICAgICAgICB0aGlzLmlzU2hvd0FkZHJlc3NDaG9zZSA9IGZhbHNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmluaXNoKCkgeyAvLyDlrozmiJBcclxuICAgICAgICAgICAgdGhpcy5pc1Nob3dBZGRyZXNzQ2hvc2UgPSBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldE5hbWUoZSkgeyAvLyDojrflvpfkvJrorq7lkI3np7BcclxuICAgICAgICAgICAgdGhpcy5mb3JtRGF0YS5uYW1lID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRDb250ZW50KGUpIHsgLy8g6I635b6X5YWo6YOo5YaF5a65XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybURhdGEuY29udGVudCA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0bGVhZGVyKGUpIHsgLy8g6I635b6X6aKG5a+8XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybURhdGEubGVhZGVyID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRhZGRyZXNzKGUpIHsgLy8g6I635b6X6aKG5a+8XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybURhdGEuYWRkcmVzcyA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0dXNlckNvdW50KGUpIHsgLy8g6I635b6X6aKG5a+8XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybURhdGEudXNlckNhcGFjaXR5ID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzYXZlKCkgeyAvLyDkv53lrZhcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmZvcm1EYXRhKTtcclxuICAgICAgICAgICAgaWYgKCFzZWxmLmZvcm1EYXRhLm5hbWUgfHwgc2VsZi5mb3JtRGF0YS5uYW1lID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiAn5Lya6K6u5ZCN56ew5b+F5aGrJyxcclxuICAgICAgICAgICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXNlbGYuZm9ybURhdGEubGVhZGVyIHx8IHNlbGYuZm9ybURhdGEubGVhZGVyID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiAn6LSf6LSj5Lq65b+F5aGrJyxcclxuICAgICAgICAgICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXNlbGYuZm9ybURhdGEuY2xhc3NpZnkgfHwgc2VsZi5mb3JtRGF0YS5jbGFzc2lmeSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogJ+S8muiuruexu+WIq+W/heWhqycsXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzZWxmLmFkZHJlc3MgfHwgc2VsZi5hZGRyZXNzID09ICcnIHx8IHNlbGYuYWRkcmVzcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICfor7fpgInmi6nlnLDlnYAnLFxyXG4gICAgICAgICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICghc2VsZi5mb3JtRGF0YS5hZGRyZXNzIHx8IHNlbGYuZm9ybURhdGEuYWRkcmVzcyA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogJ+ivpue7huWcsOWdgOW/heWhqycsXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzZWxmLmZvcm1EYXRhLm5hbWUgfHwgc2VsZi5mb3JtRGF0YS5uYW1lID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiAn5Lya6K6u5ZCN56ew5b+F5aGrJyxcclxuICAgICAgICAgICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXNlbGYuZm9ybURhdGEubmFtZSB8fCBzZWxmLmZvcm1EYXRhLm5hbWUgPT0gJycpIHtcclxuICAgICAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICfkvJrorq7lkI3np7Dlv4XloasnLFxyXG4gICAgICAgICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmZvcm1EYXRhLm1lZXRpbmdUeXBlID0gdGhpcy5jbGFzc2lmeUFyeVt0aGlzLmZvcm1EYXRhLmNsYXNzaWZ5XTtcclxuICAgICAgICAgICAgdGhpcy5mb3JtRGF0YS5wcm92aW5jZU5hbWUgPSB0aGlzLmFkZHJlc3NbMF07XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybURhdGEuY2l0eU5hbWUgPSB0aGlzLmFkZHJlc3NbMV07XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybURhdGEuZGlzdHJpY3ROYW1lID0gdGhpcy5hZGRyZXNzWzJdO1xyXG4gICAgICAgICAgICB0aGlzLmZvcm1EYXRhLnN0YXJ0RGF0ZSA9IHRoaXMuZm9ybURhdGEuc3RhcnREYXRlMSArICc6MDAnO1xyXG4gICAgICAgICAgICB0aGlzLmZvcm1EYXRhLmVuZERhdGUgPSB0aGlzLmZvcm1EYXRhLmVuZERhdGUxICsgJzo1OSc7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnR5cGUgPT0gJ2VkaXQnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1EYXRhLnVzZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKCdtZWV0aW5nL3dlY2hhdC91cGRhdGVNZWV0aW5nQXBpLmpzb24nLCB0aGlzLmZvcm1EYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5mb3JtRGF0YSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDov5Tlm57kuIrkuIDpobVcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3gubmF2aWdhdGVCYWNrKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbHRhOiAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKCdtZWV0aW5nL3dlY2hhdC9jcmVhdGVNZWV0aW5nQXBpLmpzb24nLCB0aGlzLmZvcm1EYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5mb3JtRGF0YSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDov5Tlm57kuIrkuIDpobVcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3gubmF2aWdhdGVCYWNrKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbHRhOiAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgIH1cclxuICAgIC8vIGVuZEZ1biAoKSB7XHJcbiAgICAvLyAgIGlmICh0aGlzLmZvcm1EYXRhLmVuZERhdGUxKSB0aGlzLnRpbWVzID0gdGhpcy5mb3JtRGF0YS5lbmREYXRlMVxyXG4gICAgLy8gfVxyXG4gICAgLy8gc3RhcnREYXRlICgpIHtcclxuICAgIC8vICAgaWYgKHRoaXMuZm9ybURhdGEuc3RhcnREYXRlMSkgdGhpcy50aW1lcyA9IHRoaXMuZm9ybURhdGEuc3RhcnREYXRlMVxyXG4gICAgLy8gfVxyXG4gICAgb25Mb2FkKG9wdGlvbnMpIHtcclxuICAgICAgICAvLyDojrflj5bnu4/nuqzluqZcclxuICAgICAgICB0aGlzLnRpbWVzID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpICsgJy0nICsgdGhpcy50aW1lc0Z1bihuZXcgRGF0ZSgpLmdldE1vbnRoKCkgKyAxKSArICctJyArIHRoaXMudGltZXNGdW4obmV3IERhdGUoKS5nZXREYXRlKCkpICsgJyAnICsgJzEyJztcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuaXRlbSkge1xyXG4gICAgICAgICAgICB3eC5zZXROYXZpZ2F0aW9uQmFyVGl0bGUoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICfnvJbovpHkvJrorq4nXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGF0LnR5cGUgPSAnZWRpdCc7XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybURhdGEgPSBKU09OLnBhcnNlKG9wdGlvbnMuaXRlbSk7XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybURhdGEuc3RhcnREYXRlMSA9IHRoaXMuZm9ybURhdGEuc3RhcnREYXRlMS5zcGxpdCgnICcpWzBdICsgJyAnICsgdGhpcy5mb3JtRGF0YS5zdGFydERhdGUxLnNwbGl0KCcgJylbMV0uc3BsaXQoJzonKVswXTtcclxuICAgICAgICAgICAgdGhpcy5mb3JtRGF0YS5lbmREYXRlMSA9IHRoaXMuZm9ybURhdGEuZW5kRGF0ZTEuc3BsaXQoJyAnKVswXSArICcgJyArIHRoaXMuZm9ybURhdGEuc3RhcnREYXRlMS5zcGxpdCgnICcpWzFdLnNwbGl0KCc6JylbMF07XHJcbiAgICAgICAgICAgIHRoaXMudGltZXMgPSB0aGlzLmZvcm1EYXRhLnN0YXJ0RGF0ZTE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB3eC5nZXRMb2NhdGlvbih7XHJcbiAgICAgICAgICAgIHR5cGU6ICdnY2owMicsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XHJcbiAgXHJcbiAgICAgICAgICAgICAgICB0aGF0LmZvcm1EYXRhLmxhdGl0dWRlID0gcmVzLmxhdGl0dWRlO1xyXG4gICAgICAgICAgICAgICAgdGhhdC5mb3JtRGF0YS5sb25naXR1ZGUgPSByZXMubG9uZ2l0dWRlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zZXR0aW1lc0RhdGUoKTtcclxuICAgICAgICAvLyB0aGlzLm11bHRpQXJyYXkgPSBbdGhpcy55ZWFycywgdGhpcy5tb250aHMsIHRoaXMuZGF5cywgdGhpcy5ob3VycywgdGhpcy5taW51dGVzLCB0aGlzLnNlY29uZF1cclxuICAgICAgICB0aGlzLm11bHRpQXJyYXkgPSBbdGhpcy55ZWFycywgdGhpcy5tb250aHMsIHRoaXMuZGF5cywgdGhpcy5ob3VycywgdGhpcy5taW51dGVzXTtcclxuICAgICAgICAvLyB0aGlzLm11bHRpQXJyYXkgPSBbdGhpcy55ZWFycywgdGhpcy5tb250aHMsIHRoaXMuZGF5cywgdGhpcy5ob3Vyc11cclxuICAgICAgICAvLyB0aGlzLm11bHRpQXJyYXkgPSBbdGhpcy55ZWFycywgdGhpcy5tb250aHMsIHRoaXMuZGF5c11cclxuICAgICAgICB0aGlzLmNob29zZV95ZWFyID0gdGhpcy5tdWx0aUFycmF5WzBdWzBdO1xyXG4gICAgICAgIGlmICghdGhpcy50aW1lcykge1xyXG4gICAgICAgIC8vIOm7mOiupOaYvuekuuW9k+WJjeaXpeacn1xyXG4gICAgICAgICAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50TW9udGggPSBkYXRlLmdldE1vbnRoKCk7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50RGF5ID0gZGF0ZS5nZXREYXRlKCkgLSAxO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmluZm8oJ+aciCcsIGRhdGUuZ2V0TW9udGgoKSlcclxuICAgICAgICAgICAgLy8gY29uc29sZS5pbmZvKCfml6UnLCBkYXRlLmdldERhdGUoKSlcclxuICAgICAgICAgICAgdGhpcy5tdWx0aUFycmF5WzJdID0gdGhpcy5zZXREYXlzKHRoaXMuY2hvb3NlX3llYXIsIGN1cnJlbnRNb250aCArIDEpO1xyXG4gICAgICAgICAgICB0aGlzLm11bHRpSW5kZXggPSBbMCwgY3VycmVudE1vbnRoLCBjdXJyZW50RGF5LCAxMCwgMF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZXREZWZhdWx0dGltZXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gd3guZ2V0U3RvcmFnZSh7XHJcbiAgICAgICAgLy8gICBrZXk6ICdpdGVtJyxcclxuICAgICAgICAvLyAgIHN1Y2Nlc3MgKHJlcykge1xyXG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YSlcclxuICAgICAgICAvLyAgICAgc2VsZi5mb3JtRGF0YSA9IHJlcy5kYXRhXHJcbiAgICAgICAgLy8gICB9XHJcbiAgICAgICAgLy8gfSlcclxuXHJcbiAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgIH1cclxuICAgIHdoZW5BcHBSZWFkeVNob3coKSB7XHJcbiAgICAgICAgLy8g5q+P5qyh6YO95Yi35pawXHJcbiAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgIH1cclxuICAgIGNoYW5nZUN1cnJlbnREYXRhKG9wdGlvbikgeyAvLyDmlLnlj5jlvZPliY3mlbDmja5cclxuICAgICAgICAvLyDlhajlm73mlbDmja5cclxuICAgICAgICB2YXIgbmF0aW9uYWxEYXRhID0gdGhpcy5uYXRpb25hbERhdGE7XHJcbiAgICAgICAgLy8g5omA5pyJ55yBXHJcbiAgICAgICAgaWYgKHRoaXMucHJvdmluY2VzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm92aW5jZXMgPSB0aGlzLmRhdGEucHJvdmluY2VzO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5hdGlvbmFsRGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcHJvdmluY2VzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4OiBpLFxyXG4gICAgICAgICAgICAgICAgICAgIHByb3ZpbmNlOiBuYXRpb25hbERhdGFbaV0uem9uZV9uYW1lXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnByb3ZpbmNlcyA9IHByb3ZpbmNlcztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g5b2T5YmN5omA5pyJ5biCXHJcbiAgICAgICAgaWYgKG9wdGlvbi50eXBlID09ICdjaXR5JyB8fCBvcHRpb24udHlwZSA9PSAnYWxsJykge1xyXG4gICAgICAgIC8vIOa4heepuuW4guaVsOaNrlxyXG4gICAgICAgICAgICB0aGlzLmNpdGllcyA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgY2l0aWVzID0gdGhpcy5jaXRpZXM7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50Q2l0aWVzID0gbmF0aW9uYWxEYXRhW29wdGlvbi5jdXJyZW50UHJvdmluY2VJbmRleF0uY2l0eXM7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VycmVudENpdGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY2l0aWVzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4OiBpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNpdHk6IGN1cnJlbnRDaXRpZXNbaV0uem9uZV9uYW1lXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNpdGllcyA9IGNpdGllcztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g5b2T5YmN5omA5pyJ5Yy6XHJcbiAgICAgICAgLy8g5riF56m6IOWMuiDmlbDmja5cclxuICAgICAgICB0aGlzLmRpc3RyaWN0cyA9IFtdO1xyXG4gICAgICAgIHZhciBkaXN0cmljdHMgPSB0aGlzLmRpc3RyaWN0cztcclxuICAgICAgICB2YXIgY3VycmVudERpc3RyaWN0cyA9IG5hdGlvbmFsRGF0YVtvcHRpb24uY3VycmVudFByb3ZpbmNlSW5kZXhdLmNpdHlzW29wdGlvbi5jdXJyZW50Q2l0eUluZGV4XS5kaXN0cmljdHM7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW50RGlzdHJpY3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpICE9IDApIHtcclxuICAgICAgICAgICAgICAgIGRpc3RyaWN0cy5wdXNoKGN1cnJlbnREaXN0cmljdHNbaV0uem9uZV9uYW1lKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kaXN0cmljdHMgPSBkaXN0cmljdHM7XHJcbiAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgIH1cclxuICB9XHJcbiJdfQ==