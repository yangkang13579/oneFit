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
                //发送请求通过经纬度反查地址信息  
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
        //显示省市区联动选择框
        this.isShowAddressChose = !this.data.isShowAddressChose;
      },
      cancel: function cancel() {
        //取消
        this.isShowAddressChose = false;
      },
      finish: function finish() {
        //完成
        this.isShowAddressChose = false;
      },
      getName: function getName(e) {
        //获得会议名称
        this.formData.name = e.detail.value;
        this.$apply();
      },
      getContent: function getContent(e) {
        //获得全部内容
        this.formData.content = e.detail.value;
        this.$apply();
      },
      getleader: function getleader(e) {
        //获得领导
        this.formData.leader = e.detail.value;
        this.$apply();
      },
      getaddress: function getaddress(e) {
        //获得领导
        this.formData.address = e.detail.value;
        this.$apply();
      },
      getuserCount: function getuserCount(e) {
        //获得领导
        this.formData.userCapacity = e.detail.value;
        this.$apply();
      },
      save: function save() {
        //保存
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
            //返回上一页
            wx.navigateBack({
              delta: 1
            });
            self.$apply();
          });
        } else {
          this.fetchDataPromise('meeting/wechat/createMeetingApi.json', this.formData).then(function (data) {
            self.formData = {};
            //返回上一页
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
      //改变当前数据
      //全国数据
      var nationalData = this.nationalData;
      //所有省
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
      //当前所有市
      if (option.type == 'city' || option.type == 'all') {
        //清空市数据
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
      //当前所有区
      //清空 区 数据
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVkaXRBZGRyZXNzLmpzIl0sIm5hbWVzIjpbIkVkaXRBZGRyZXNzIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJkYXRhIiwiY2xhc3NpZnlBcnkiLCJ0eXBlIiwiZm9ybURhdGEiLCJkYXRlIiwidGltZXMiLCJ5ZWFycyIsIm1vbnRocyIsImRheXMiLCJob3VycyIsIm1pbnV0ZXMiLCJzZWNvbmQiLCJtdWx0aUFycmF5IiwibXVsdGlJbmRleCIsImNob29zZV95ZWFyIiwieWVhckluZGV4IiwiYWRkcmVzcyIsIm1ldGhvZHMiLCJjaG9vc2VMb2NhdGlvbiIsInRoYXQiLCJ3eCIsImdldExvY2F0aW9uIiwic3VjY2VzcyIsInJlcyIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwicmVzdCIsImZldGNoRGF0YVByb21pc2UiLCJ0aGVuIiwicHJvdmluY2VOYW1lIiwiY2l0eU5hbWUiLCJkaXN0cmljdE5hbWUiLCJiaW5kUmVnaW9uQ2hhbmdlIiwiZSIsImRldGFpbCIsInZhbHVlIiwiY2hhbmdlQ2xhc3NpZnkiLCJjb25zb2xlIiwibG9nIiwiY2xhc3NpZnkiLCJiaW5kTXVsdGlQaWNrZXJDb2x1bW5DaGFuZ2UiLCJjb2x1bW4iLCJudW0iLCJwYXJzZUludCIsInNldERheXMiLCIkYXBwbHkiLCJiaW5kU3RhcnRDaGFuZ2UiLCJzdGFydERhdGUxIiwiUGlja2VyQ2hhbmdlIiwiYmluZEVuZENoYW5nZSIsImVuZERhdGUxIiwiZ2V0dGltZXMiLCJzaG93QWRkckNob3NlIiwiaXNTaG93QWRkcmVzc0Nob3NlIiwiY2FuY2VsIiwiZmluaXNoIiwiZ2V0TmFtZSIsIm5hbWUiLCJnZXRDb250ZW50IiwiY29udGVudCIsImdldGxlYWRlciIsImxlYWRlciIsImdldGFkZHJlc3MiLCJnZXR1c2VyQ291bnQiLCJ1c2VyQ2FwYWNpdHkiLCJzYXZlIiwic2VsZiIsInNob3dNb2RhbCIsInRpdGxlIiwic2hvd0NhbmNlbCIsImxlbmd0aCIsIm1lZXRpbmdUeXBlIiwic3RhcnREYXRlIiwiZW5kRGF0ZSIsInVzZXIiLCJuYXZpZ2F0ZUJhY2siLCJkZWx0YSIsInQiLCJEYXRlIiwiX3llYXJJbmRleCIsImluZm8iLCJfZGVmYXVsdFllYXIiLCJzcGxpdCIsImkiLCJnZXRGdWxsWWVhciIsInB1c2giLCJzZWxlY3RZZWFyIiwic2VsZWN0TW9udGgiLCJ0ZW1wIiwieWVhciIsImFsbERhdGVMaXN0IiwiZGF0ZUxpc3QiLCJtb250aCIsImRheSIsInRpbWVzTGlzdCIsImluZGV4IiwiaG91ciIsIm1pbnV0ZSIsIm9wdGlvbnMiLCJ0aW1lc0Z1biIsImdldE1vbnRoIiwiZ2V0RGF0ZSIsIml0ZW0iLCJzZXROYXZpZ2F0aW9uQmFyVGl0bGUiLCJKU09OIiwicGFyc2UiLCJmYWlsIiwic2V0dGltZXNEYXRlIiwiY3VycmVudE1vbnRoIiwiY3VycmVudERheSIsInNldERlZmF1bHR0aW1lcyIsIm9wdGlvbiIsIm5hdGlvbmFsRGF0YSIsInByb3ZpbmNlcyIsInByb3ZpbmNlIiwiem9uZV9uYW1lIiwiY2l0aWVzIiwiY3VycmVudENpdGllcyIsImN1cnJlbnRQcm92aW5jZUluZGV4IiwiY2l0eXMiLCJjaXR5IiwiZGlzdHJpY3RzIiwiY3VycmVudERpc3RyaWN0cyIsImN1cnJlbnRDaXR5SW5kZXgiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDRTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFDcUJBLFc7Ozs7Ozs7Ozs7Ozs7O2dNQUNuQkMsTSxHQUFTLENBQUNDLGNBQUQsQyxRQUNUQyxNLEdBQVM7QUFDUEMsOEJBQXdCLE1BRGpCO0FBRVBDLG9DQUE4QjtBQUZ2QixLLFFBSVRDLEksR0FBTztBQUNMQyxtQkFBYSxDQUNYLE1BRFcsRUFFWCxLQUZXLEVBR1gsS0FIVyxFQUlYLEtBSlcsRUFLWCxNQUxXLENBRFI7QUFRTEMsWUFBTSxJQVJEO0FBU0xDLGdCQUFV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QUFPWSxnQkFBdkQsRUFBeUVGLFNBQWhHO0FBQ0EsV0FBSyxJQUFJdEMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJdUMsaUJBQWlCcEQsTUFBckMsRUFBNkNhLEdBQTdDLEVBQWtEO0FBQ2hELFlBQUlBLEtBQUssQ0FBVCxFQUFZO0FBQ1ZzQyxvQkFBVXBDLElBQVYsQ0FBZXFDLGlCQUFpQnZDLENBQWpCLEVBQW9CZ0MsU0FBbkM7QUFDRDtBQUNGO0FBQ0QsV0FBS00sU0FBTCxHQUFpQkEsU0FBakI7QUFDQSxXQUFLNUUsTUFBTDtBQUNEOzs7O0VBamJzQytFLGVBQUtDLEk7O2tCQUF6Qm5JLFciLCJmaWxlIjoiZWRpdEFkZHJlc3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuICBpbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcclxuICBpbXBvcnQgUGFnZU1peGluIGZyb20gJy4uL21peGlucy9wYWdlJztcclxuICBleHBvcnQgZGVmYXVsdCBjbGFzcyBFZGl0QWRkcmVzcyBleHRlbmRzIHdlcHkucGFnZSB7XHJcbiAgICBtaXhpbnMgPSBbUGFnZU1peGluXTtcclxuICAgIGNvbmZpZyA9IHtcclxuICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+WIm+W7uuS8muiuricsXHJcbiAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJ1xyXG4gICAgfTtcclxuICAgIGRhdGEgPSB7XHJcbiAgICAgIGNsYXNzaWZ5QXJ5OiBbXHJcbiAgICAgICAgJ+e7j+mUgOWVhuS8micsXHJcbiAgICAgICAgJ+WGnOawkeS8micsXHJcbiAgICAgICAgJ+inguaRqeS8micsXHJcbiAgICAgICAgJ+S/g+mUgOS8micsXHJcbiAgICAgICAgJ+WFtuS7luS8muiuridcclxuICAgICAgXSxcclxuICAgICAgdHlwZTogbnVsbCxcclxuICAgICAgZm9ybURhdGE6IHt9LFxyXG4gICAgICBkYXRlOiAnMjAxNi0wOS0wMScsXHJcbiAgICAgIHRpbWVzOiAnMjAyMC0wNy0yOSAxMjo1MCcsXHJcbiAgICAgIC8vIOaXtumXtOmAieaLqeWZqOWPguaVsFxyXG4gICAgICB5ZWFyczogW10sXHJcbiAgICAgIG1vbnRoczogW10sXHJcbiAgICAgIGRheXM6IFtdLFxyXG4gICAgICBob3VyczogW10sXHJcbiAgICAgIG1pbnV0ZXM6IFtdLFxyXG4gICAgICBzZWNvbmQ6IFtdLFxyXG4gICAgICBtdWx0aUFycmF5OiBbXSwgLy8g6YCJ5oup6IyD5Zu0XHJcbiAgICAgIG11bHRpSW5kZXg6IFswLCA5LCAxNiwgMTMsIDE3XSwgLy8g6YCJ5Lit5YC85pWw57uEXHJcbiAgICAgIGNob29zZV95ZWFyOiAnJyxcclxuICAgICAgeWVhckluZGV4OiAwLFxyXG4gICAgICBhZGRyZXNzOiBbXVxyXG4gICAgfTtcclxuICAgIC8vIOW3ruS4gOS9jeihpeS9jVxyXG4gICAgdGltZXNGdW4gKHQpIHtcclxuICAgICAgaWYgKHQgPCAxMCkgcmV0dXJuICcwJyArIHRcclxuICAgICAgZWxzZSByZXR1cm4gdFxyXG4gICAgfVxyXG4gICAgLy8g6K6+572u5Yid5aeL5YC8XHJcbiAgICBzZXR0aW1lc0RhdGUoKSB7XHJcbiAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpXHJcbiAgICAgIGxldCBfeWVhckluZGV4ID0gMFxyXG4gICAgICAvLyDpu5jorqTorr7nva5cclxuICAgICAgY29uc29sZS5pbmZvKHRoaXMudGltZXMpXHJcbiAgICAgIGxldCBfZGVmYXVsdFllYXIgPSB0aGlzLnRpbWVzID8gdGhpcy50aW1lcy5zcGxpdCgnLScpWzBdIDogMFxyXG4gICAgICAvLyDojrflj5blubRcclxuICAgICAgZm9yIChsZXQgaSA9IGRhdGUuZ2V0RnVsbFllYXIoKTsgaSA8PSBkYXRlLmdldEZ1bGxZZWFyKCkgKyA1OyBpKyspIHtcclxuICAgICAgICB0aGlzLnllYXJzLnB1c2goJycgKyBpKVxyXG4gICAgICAgIC8vIOm7mOiupOiuvue9rueahOW5tOeahOS9jee9rlxyXG4gICAgICAgIGlmIChfZGVmYXVsdFllYXIgJiYgaSA9PT0gcGFyc2VJbnQoX2RlZmF1bHRZZWFyKSkge1xyXG4gICAgICAgICAgdGhpcy55ZWFySW5kZXggPSBfeWVhckluZGV4XHJcbiAgICAgICAgICB0aGlzLmNob29zZV95ZWFyID0gX2RlZmF1bHRZZWFyXHJcbiAgICAgICAgfVxyXG4gICAgICAgIF95ZWFySW5kZXggPSBfeWVhckluZGV4ICsgMVxyXG4gICAgICB9XHJcbiAgICAgIC8vIOiOt+WPluaciOS7vVxyXG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSAxMjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgICAgaSA9ICcwJyArIGlcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5tb250aHMucHVzaCgnJyArIGkpXHJcbiAgICAgIH1cclxuICAgICAgLy8g6I635Y+W5pel5pyfXHJcbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDMxOyBpKyspIHtcclxuICAgICAgICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgICBpID0gJzAnICsgaVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRheXMucHVzaCgnJyArIGkpXHJcbiAgICAgIH1cclxuICAgICAgLy8gLy8g6I635Y+W5bCP5pe2XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjQ7IGkrKykge1xyXG4gICAgICAgICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgICAgaSA9ICcwJyArIGlcclxuICAgICAgICAgfVxyXG4gICAgICAgICB0aGlzLmhvdXJzLnB1c2goJycgKyBpKVxyXG4gICAgICAgfVxyXG4gICAgICAvLyAvLyDojrflj5bliIbpkp9cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2MDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgICAgaSA9ICcwJyArIGlcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5taW51dGVzLnB1c2goJycgKyBpKVxyXG4gICAgICB9XHJcbiAgICAgIC8vIC8vIOiOt+WPluenkuaVsFxyXG4gICAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8IDYwOyBpKyspIHtcclxuICAgICAgLy8gICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgIC8vICAgICBpID0gJzAnICsgaVxyXG4gICAgICAvLyAgIH1cclxuICAgICAgLy8gICB0aGlzLnNlY29uZC5wdXNoKCcnICsgaSlcclxuICAgICAgLy8gfVxyXG4gICAgfVxyXG4gICAgLy8g6L+U5Zue5pyI5Lu955qE5aSp5pWwXHJcbiAgICBzZXREYXlzKHNlbGVjdFllYXIsIHNlbGVjdE1vbnRoKSB7XHJcbiAgICAgIGxldCBudW0gPSBzZWxlY3RNb250aFxyXG4gICAgICBsZXQgdGVtcCA9IFtdXHJcbiAgICAgIGlmIChudW0gPT09IDEgfHwgbnVtID09PSAzIHx8IG51bSA9PT0gNSB8fCBudW0gPT09IDcgfHwgbnVtID09PSA4IHx8IG51bSA9PT0gMTAgfHwgbnVtID09PSAxMikge1xyXG4gICAgICAgICAgLy8g5Yik5patMzHlpKnnmoTmnIjku71cclxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSAzMTsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgICAgIGkgPSAnMCcgKyBpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0ZW1wLnB1c2goJycgKyBpKVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChudW0gPT09IDQgfHwgbnVtID09PSA2IHx8IG51bSA9PT0gOSB8fCBudW0gPT09IDExKSB7IC8vIOWIpOaWrTMw5aSp55qE5pyI5Lu9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMzA7IGkrKykge1xyXG4gICAgICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgICAgICBpID0gJzAnICsgaVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGVtcC5wdXNoKCcnICsgaSlcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAobnVtID09PSAyKSB7IC8vIOWIpOaWrTLmnIjku73lpKnmlbBcclxuICAgICAgICBsZXQgeWVhciA9IHBhcnNlSW50KHNlbGVjdFllYXIpXHJcbiAgICAgICAgY29uc29sZS5sb2coeWVhcilcclxuICAgICAgICBpZiAoKCh5ZWFyICUgNDAwID09PSAwKSB8fCAoeWVhciAlIDEwMCAhPT0gMCkpICYmICh5ZWFyICUgNCA9PT0gMCkpIHtcclxuICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDI5OyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgICAgICAgIGkgPSAnMCcgKyBpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGVtcC5wdXNoKCcnICsgaSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMjg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgICAgICAgaSA9ICcwJyArIGlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0ZW1wLnB1c2goJycgKyBpKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdGVtcFxyXG4gICAgfVxyXG4gICAgLy8g6K6+572u6buY6K6k5YC8IOagvOW8jzIwMTktMDctMTAgMTA6MzBcclxuICAgIHNldERlZmF1bHR0aW1lcygpIHtcclxuICAgICAgbGV0IGFsbERhdGVMaXN0ID0gdGhpcy50aW1lcy5zcGxpdCgnICcpXHJcbiAgICAgIC8vIOaXpeacn1xyXG4gICAgICBsZXQgZGF0ZUxpc3QgPSBhbGxEYXRlTGlzdFswXS5zcGxpdCgnLScpXHJcbiAgICAgIGxldCBtb250aCA9IHBhcnNlSW50KGRhdGVMaXN0WzFdKSAtIDFcclxuICAgICAgbGV0IGRheSA9IHBhcnNlSW50KGRhdGVMaXN0WzJdKSAtIDFcclxuICAgICAgLy8g5pe26Ze0XHJcbiAgICAgIGxldCB0aW1lc0xpc3QgPSBhbGxEYXRlTGlzdFsxXS5zcGxpdCgnOicpXHJcbiAgICAgIHRoaXMubXVsdGlBcnJheVsyXSA9IHRoaXMuc2V0RGF5cyhkYXRlTGlzdFswXSwgcGFyc2VJbnQoZGF0ZUxpc3RbMV0pKVxyXG4gICAgICB0aGlzLm11bHRpSW5kZXggPSBbdGhpcy55ZWFySW5kZXgsIG1vbnRoLCBkYXksIHRpbWVzTGlzdFswXSwgdGltZXNMaXN0WzFdXVxyXG4gICAgfVxyXG4gICAgLy8g6I635Y+W5pe26Ze05pel5pyfXHJcbiAgICBQaWNrZXJDaGFuZ2UoZSkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygncGlja2Vy5Y+R6YCB6YCJ5oup5pS55Y+Y77yM5pC65bim5YC85Li6JywgZS5kZXRhaWwudmFsdWUpXHJcbiAgICAgIHRoaXMubXVsdGlJbmRleCA9IGUuZGV0YWlsLnZhbHVlXHJcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5tdWx0aUluZGV4XHJcbiAgICAgIGNvbnN0IHllYXIgPSB0aGlzLm11bHRpQXJyYXlbMF1baW5kZXhbMF1dXHJcbiAgICAgIGNvbnN0IG1vbnRoID0gdGhpcy5tdWx0aUFycmF5WzFdW2luZGV4WzFdXVxyXG4gICAgICBjb25zdCBkYXkgPSB0aGlzLm11bHRpQXJyYXlbMl1baW5kZXhbMl1dXHJcbiAgICAgIGNvbnN0IGhvdXIgPSB0aGlzLm11bHRpQXJyYXlbM11baW5kZXhbM11dXHJcbiAgICAgIGNvbnN0IG1pbnV0ZSA9IHRoaXMubXVsdGlBcnJheVs0XVtpbmRleFs0XV1cclxuICAgICAgLy8gY29uc3Qgc2Vjb25kID0gdGhpcy5tdWx0aUFycmF5WzVdW2luZGV4WzVdXVxyXG4gICAgICAvLyBjb25zb2xlLmxvZyhgJHt5ZWFyfS0ke21vbnRofS0ke2RheX0tJHtob3VyfS0ke21pbnV0ZX1gKTtcclxuICAgICAgdGhpcy50aW1lcyA9IHllYXIgKyAnLScgKyBtb250aCArICctJyArIGRheSArICcgJyArIGhvdXIgKyAnOicgKyBtaW51dGVcclxuICAgICAgdGhpcy4kYXBwbHkoKVxyXG4gICAgICByZXR1cm4gdGhpcy50aW1lc1xyXG4gICAgfVxyXG4gICAgbWV0aG9kcyA9IHtcclxuICAgICAgY2hvb3NlTG9jYXRpb24gKCkge1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpc1xyXG4gICAgICAgIHd4LmdldExvY2F0aW9uKHtcclxuICAgICAgICB0eXBlOiAnd2dzODQnLFxyXG4gICAgICAgIHN1Y2Nlc3MgKHJlcykge1xyXG4gICAgICAgICAgd3guY2hvb3NlTG9jYXRpb24oe1xyXG4gICAgICAgICAgICBsYXRpdHVkZTogcmVzLmxhdGl0dWRlLFxyXG4gICAgICAgICAgICBsb25naXR1ZGU6IHJlcy5sb25naXR1ZGUsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3MgKHJlc3QpIHtcclxuICAgICAgICAgICAgICAvL+WPkemAgeivt+axgumAmui/h+e7j+e6rOW6puWPjeafpeWcsOWdgOS/oeaBryAgXHJcbiAgICAgICAgwqAgwqAgIHRoYXQuZmV0Y2hEYXRhUHJvbWlzZSgncmVzb2x2ZUxvY2F0aW9uQXBpLmpzb24nLCB7bGF0aXR1ZGU6cmVzdC5sYXRpdHVkZSwgbG9uZ2l0dWRlOiByZXN0LmxvbmdpdHVkZX0pXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICB0aGF0LmFkZHJlc3MgPSBbZGF0YS5wcm92aW5jZU5hbWUsIGRhdGEuY2l0eU5hbWUsIGRhdGEuZGlzdHJpY3ROYW1lXVxyXG4gICAgICAgICAgICAgIHRoYXQuZm9ybURhdGEuYWRkcmVzcyA9IGRhdGEuYWRkcmVzc1xyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICB9KVxyXG4gICAgICAgXHJcbiAgICAgIH0sXHJcbiAgICAgIGJpbmRSZWdpb25DaGFuZ2UgKGUpIHtcclxuICAgICAgICB0aGlzLmFkZHJlc3MgPSBlLmRldGFpbC52YWx1ZVxyXG4gICAgICAgIHRoaXMuZm9ybURhdGEuYWRkcmVzcyA9ICcnXHJcbiAgICAgIH0sXHJcbiAgICAgIGNoYW5nZUNsYXNzaWZ5IChlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZSlcclxuICAgICAgICB0aGlzLmZvcm1EYXRhLmNsYXNzaWZ5ID0gZS5kZXRhaWwudmFsdWVcclxuICAgICAgfSxcclxuICAgICAgLy8g55uR5ZCscGlja2Vy55qE5rua5Yqo5LqL5Lu2XHJcbiAgICAgIGJpbmRNdWx0aVBpY2tlckNvbHVtbkNoYW5nZShlKSB7XHJcbiAgICAgICAgLy8g6I635Y+W5bm05Lu9XHJcbiAgICAgICAgaWYgKGUuZGV0YWlsLmNvbHVtbiA9PT0gMCkge1xyXG4gICAgICAgICAgdGhpcy5jaG9vc2VfeWVhciA9IHRoaXMubXVsdGlBcnJheVtlLmRldGFpbC5jb2x1bW5dW2UuZGV0YWlsLnZhbHVlXVxyXG4gICAgICAgICAgY29uc29sZS5sb2codGhpcy5jaG9vc2VfeWVhcilcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ+S/ruaUueeahOWIl+S4uicsIGUuZGV0YWlsLmNvbHVtbiwgJ++8jOWAvOS4uicsIGUuZGV0YWlsLnZhbHVlKTtcclxuICAgICAgICAvLyDorr7nva7mnIjku73mlbDnu4RcclxuICAgICAgICBpZiAoZS5kZXRhaWwuY29sdW1uID09PSAxKSB7XHJcbiAgICAgICAgICBsZXQgbnVtID0gcGFyc2VJbnQodGhpcy5tdWx0aUFycmF5W2UuZGV0YWlsLmNvbHVtbl1bZS5kZXRhaWwudmFsdWVdKVxyXG4gICAgICAgICAgdGhpcy5tdWx0aUFycmF5WzJdID0gdGhpcy5zZXREYXlzKHRoaXMuY2hvb3NlX3llYXIsIG51bSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubXVsdGlJbmRleFtlLmRldGFpbC5jb2x1bW5dID0gZS5kZXRhaWwudmFsdWVcclxuICAgICAgICB0aGlzLiRhcHBseSgpXHJcbiAgICAgIH0sXHJcbiAgICAgIGJpbmRTdGFydENoYW5nZSAoZSkge1xyXG4gICAgICAgIHRoaXMuZm9ybURhdGEuc3RhcnREYXRlMSA9IHRoaXMuUGlja2VyQ2hhbmdlKGUpXHJcbiAgICAgIH0sXHJcbiAgICAgIGJpbmRFbmRDaGFuZ2UgKGUpIHtcclxuICAgICAgICB0aGlzLmZvcm1EYXRhLmVuZERhdGUxID0gdGhpcy5QaWNrZXJDaGFuZ2UoZSlcclxuICAgICAgfSxcclxuICAgICAgXHJcbiAgICAgIC8vIOiOt+WPluaXtumXtFxyXG4gICAgICBnZXR0aW1lcyAodGltZXMpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aW1lcylcclxuICAgICAgfSxcclxuICAgICAgc2hvd0FkZHJDaG9zZSgpIHsgLy/mmL7npLrnnIHluILljLrogZTliqjpgInmi6nmoYZcclxuICAgICAgICB0aGlzLmlzU2hvd0FkZHJlc3NDaG9zZSA9ICF0aGlzLmRhdGEuaXNTaG93QWRkcmVzc0Nob3NlXHJcbiAgICAgIH0sXHJcbiAgICAgIGNhbmNlbCgpIHsgLy/lj5bmtohcclxuICAgICAgICB0aGlzLmlzU2hvd0FkZHJlc3NDaG9zZSA9IGZhbHNlO1xyXG4gICAgICB9LFxyXG4gICAgICBmaW5pc2goKSB7IC8v5a6M5oiQXHJcbiAgICAgICAgdGhpcy5pc1Nob3dBZGRyZXNzQ2hvc2UgPSBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICBnZXROYW1lKGUpIHsgLy/ojrflvpfkvJrorq7lkI3np7BcclxuICAgICAgICB0aGlzLmZvcm1EYXRhLm5hbWUgPSBlLmRldGFpbC52YWx1ZTtcclxuICAgICAgICB0aGlzLiRhcHBseSgpXHJcbiAgICAgIH0sXHJcbiAgICAgIGdldENvbnRlbnQoZSkgeyAvL+iOt+W+l+WFqOmDqOWGheWuuVxyXG4gICAgICAgIHRoaXMuZm9ybURhdGEuY29udGVudCA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICAgIHRoaXMuJGFwcGx5KClcclxuICAgICAgfSxcclxuICAgICAgZ2V0bGVhZGVyKGUpIHsgLy/ojrflvpfpooblr7xcclxuICAgICAgICB0aGlzLmZvcm1EYXRhLmxlYWRlciA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICAgIHRoaXMuJGFwcGx5KClcclxuICAgICAgfSxcclxuICAgICAgZ2V0YWRkcmVzcyhlKSB7IC8v6I635b6X6aKG5a+8XHJcbiAgICAgICAgdGhpcy5mb3JtRGF0YS5hZGRyZXNzID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgdGhpcy4kYXBwbHkoKVxyXG4gICAgICB9LFxyXG4gICAgICBnZXR1c2VyQ291bnQoZSkgeyAvL+iOt+W+l+mihuWvvFxyXG4gICAgICAgIHRoaXMuZm9ybURhdGEudXNlckNhcGFjaXR5ID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgdGhpcy4kYXBwbHkoKVxyXG4gICAgICB9LFxyXG4gICAgICBzYXZlKCkgeyAvL+S/neWtmFxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmZvcm1EYXRhKVxyXG4gICAgICAgIGlmICghc2VsZi5mb3JtRGF0YS5uYW1lIHx8IHNlbGYuZm9ybURhdGEubmFtZSA9PSAnJykge1xyXG4gICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxyXG4gICAgICAgICAgICBjb250ZW50OiAn5Lya6K6u5ZCN56ew5b+F5aGrJyxcclxuICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIXNlbGYuZm9ybURhdGEubGVhZGVyIHx8IHNlbGYuZm9ybURhdGEubGVhZGVyID09ICcnKSB7XHJcbiAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6ICfotJ/otKPkurrlv4XloasnLFxyXG4gICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIGlmICghc2VsZi5mb3JtRGF0YS5jbGFzc2lmeSB8fCBzZWxmLmZvcm1EYXRhLmNsYXNzaWZ5ID09ICcnKSB7XHJcbiAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6ICfkvJrorq7nsbvliKvlv4XloasnLFxyXG4gICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIGlmICghc2VsZi5hZGRyZXNzIHx8IHNlbGYuYWRkcmVzcyA9PSAnJyB8fCAgc2VsZi5hZGRyZXNzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxyXG4gICAgICAgICAgICBjb250ZW50OiAn6K+36YCJ5oup5Zyw5Z2AJyxcclxuICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIXNlbGYuZm9ybURhdGEuYWRkcmVzcyB8fCBzZWxmLmZvcm1EYXRhLmFkZHJlc3MgPT0gJycpIHtcclxuICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcclxuICAgICAgICAgICAgY29udGVudDogJ+ivpue7huWcsOWdgOW/heWhqycsXHJcbiAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2UgaWYgKCFzZWxmLmZvcm1EYXRhLm5hbWUgfHwgc2VsZi5mb3JtRGF0YS5uYW1lID09ICcnKSB7XHJcbiAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6ICfkvJrorq7lkI3np7Dlv4XloasnLFxyXG4gICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIGlmICghc2VsZi5mb3JtRGF0YS5uYW1lIHx8IHNlbGYuZm9ybURhdGEubmFtZSA9PSAnJykge1xyXG4gICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxyXG4gICAgICAgICAgICBjb250ZW50OiAn5Lya6K6u5ZCN56ew5b+F5aGrJyxcclxuICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmZvcm1EYXRhLm1lZXRpbmdUeXBlID0gdGhpcy5jbGFzc2lmeUFyeVt0aGlzLmZvcm1EYXRhLmNsYXNzaWZ5XVxyXG4gICAgICAgICB0aGlzLmZvcm1EYXRhLnByb3ZpbmNlTmFtZSA9IHRoaXMuYWRkcmVzc1swXVxyXG4gICAgICAgICB0aGlzLmZvcm1EYXRhLmNpdHlOYW1lID0gdGhpcy5hZGRyZXNzWzFdXHJcbiAgICAgICAgIHRoaXMuZm9ybURhdGEuZGlzdHJpY3ROYW1lID0gdGhpcy5hZGRyZXNzWzJdXHJcbiAgICAgICAgdGhpcy5mb3JtRGF0YS5zdGFydERhdGUgPSB0aGlzLmZvcm1EYXRhLnN0YXJ0RGF0ZTEgKyAnOjAwJ1xyXG4gICAgICAgIHRoaXMuZm9ybURhdGEuZW5kRGF0ZSA9IHRoaXMuZm9ybURhdGEuZW5kRGF0ZTEgKyAnOjU5J1xyXG4gICAgICAgIGlmIChzZWxmLnR5cGUgPT0gJ2VkaXQnKSB7XHJcbiAgICAgICAgICAgdGhpcy5mb3JtRGF0YS51c2VyID0gbnVsbFxyXG4gICAgICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKCdtZWV0aW5nL3dlY2hhdC91cGRhdGVNZWV0aW5nQXBpLmpzb24nLCB0aGlzLmZvcm1EYXRhKVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgc2VsZi5mb3JtRGF0YSA9IHt9XHJcbiAgICAgICAgICAgICAgLy/ov5Tlm57kuIrkuIDpobVcclxuICAgICAgICAgICAgICB3eC5uYXZpZ2F0ZUJhY2soe1xyXG4gICAgICAgICAgICAgICAgZGVsdGE6IDFcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgnbWVldGluZy93ZWNoYXQvY3JlYXRlTWVldGluZ0FwaS5qc29uJywgdGhpcy5mb3JtRGF0YSlcclxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtRGF0YSA9IHt9XHJcbiAgICAgICAgICAgIC8v6L+U5Zue5LiK5LiA6aG1XHJcbiAgICAgICAgICAgIHd4Lm5hdmlnYXRlQmFjayh7XHJcbiAgICAgICAgICAgICAgZGVsdGE6IDFcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgIH1cclxuICAgIC8vIGVuZEZ1biAoKSB7XHJcbiAgICAvLyAgIGlmICh0aGlzLmZvcm1EYXRhLmVuZERhdGUxKSB0aGlzLnRpbWVzID0gdGhpcy5mb3JtRGF0YS5lbmREYXRlMVxyXG4gICAgLy8gfVxyXG4gICAgLy8gc3RhcnREYXRlICgpIHtcclxuICAgIC8vICAgaWYgKHRoaXMuZm9ybURhdGEuc3RhcnREYXRlMSkgdGhpcy50aW1lcyA9IHRoaXMuZm9ybURhdGEuc3RhcnREYXRlMVxyXG4gICAgLy8gfVxyXG4gICAgb25Mb2FkKG9wdGlvbnMpIHtcclxuICAgICAgLy8g6I635Y+W57uP57qs5bqmXHJcbiAgICAgIHRoaXMudGltZXMgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCkgKyAnLScgKyB0aGlzLnRpbWVzRnVuKG5ldyBEYXRlKCkuZ2V0TW9udGgoKSArIDEpICsgJy0nICsgdGhpcy50aW1lc0Z1bihuZXcgRGF0ZSgpLmdldERhdGUoKSkgKyAnICcgKyAnMTInXHJcbiAgICAgIHZhciB0aGF0ID0gdGhpc1xyXG4gICAgICBpZiAob3B0aW9ucy5pdGVtKSB7XHJcbiAgICAgICAgd3guc2V0TmF2aWdhdGlvbkJhclRpdGxlKHtcclxuICAgICAgICAgIHRpdGxlOiAn57yW6L6R5Lya6K6uJyBcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoYXQudHlwZSA9ICdlZGl0J1xyXG4gICAgICAgIHRoaXMuZm9ybURhdGEgPSBKU09OLnBhcnNlKG9wdGlvbnMuaXRlbSlcclxuICAgICAgICB0aGlzLmZvcm1EYXRhLnN0YXJ0RGF0ZTEgPSB0aGlzLmZvcm1EYXRhLnN0YXJ0RGF0ZTEuc3BsaXQoJyAnKVswXSArICcgJyArIHRoaXMuZm9ybURhdGEuc3RhcnREYXRlMS5zcGxpdCgnICcpWzFdLnNwbGl0KCc6JylbMF1cclxuICAgICAgICB0aGlzLmZvcm1EYXRhLmVuZERhdGUxID0gdGhpcy5mb3JtRGF0YS5lbmREYXRlMS5zcGxpdCgnICcpWzBdICsgJyAnICsgdGhpcy5mb3JtRGF0YS5zdGFydERhdGUxLnNwbGl0KCcgJylbMV0uc3BsaXQoJzonKVswXVxyXG4gICAgICAgIHRoaXMudGltZXMgPSB0aGlzLmZvcm1EYXRhLnN0YXJ0RGF0ZTFcclxuICAgICAgfVxyXG5cclxuICAgICAgd3guZ2V0TG9jYXRpb24oe1xyXG4gICAgICAgIHR5cGU6ICdnY2owMicsXHJcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgY29uc29sZS5sb2cocmVzKVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICB0aGF0LmZvcm1EYXRhLmxhdGl0dWRlID0gcmVzLmxhdGl0dWRlXHJcbiAgICAgICAgICB0aGF0LmZvcm1EYXRhLmxvbmdpdHVkZSA9IHJlcy5sb25naXR1ZGVcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZhaWw6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICB0aGlzLnNldHRpbWVzRGF0ZSgpXHJcbiAgICAgIC8vIHRoaXMubXVsdGlBcnJheSA9IFt0aGlzLnllYXJzLCB0aGlzLm1vbnRocywgdGhpcy5kYXlzLCB0aGlzLmhvdXJzLCB0aGlzLm1pbnV0ZXMsIHRoaXMuc2Vjb25kXVxyXG4gICAgICB0aGlzLm11bHRpQXJyYXkgPSBbdGhpcy55ZWFycywgdGhpcy5tb250aHMsIHRoaXMuZGF5cywgdGhpcy5ob3VycywgdGhpcy5taW51dGVzXVxyXG4gICAgICAvLyB0aGlzLm11bHRpQXJyYXkgPSBbdGhpcy55ZWFycywgdGhpcy5tb250aHMsIHRoaXMuZGF5cywgdGhpcy5ob3Vyc11cclxuICAgICAgLy8gdGhpcy5tdWx0aUFycmF5ID0gW3RoaXMueWVhcnMsIHRoaXMubW9udGhzLCB0aGlzLmRheXNdXHJcbiAgICAgIHRoaXMuY2hvb3NlX3llYXIgPSB0aGlzLm11bHRpQXJyYXlbMF1bMF1cclxuICAgICAgaWYgKCF0aGlzLnRpbWVzKSB7XHJcbiAgICAgICAgLy8g6buY6K6k5pi+56S65b2T5YmN5pel5pyfXHJcbiAgICAgICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpXHJcbiAgICAgICAgbGV0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKVxyXG4gICAgICAgIGxldCBjdXJyZW50RGF5ID0gZGF0ZS5nZXREYXRlKCkgLSAxXHJcbiAgICAgICAgLy8gY29uc29sZS5pbmZvKCfmnIgnLCBkYXRlLmdldE1vbnRoKCkpXHJcbiAgICAgICAgLy8gY29uc29sZS5pbmZvKCfml6UnLCBkYXRlLmdldERhdGUoKSlcclxuICAgICAgICB0aGlzLm11bHRpQXJyYXlbMl0gPSB0aGlzLnNldERheXModGhpcy5jaG9vc2VfeWVhciwgY3VycmVudE1vbnRoICsgMSlcclxuICAgICAgICB0aGlzLm11bHRpSW5kZXggPSBbMCwgY3VycmVudE1vbnRoLCBjdXJyZW50RGF5LCAxMCwgMF1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnNldERlZmF1bHR0aW1lcygpXHJcbiAgICAgIH1cclxuICAgICAgLy8gd3guZ2V0U3RvcmFnZSh7XHJcbiAgICAgIC8vICAga2V5OiAnaXRlbScsXHJcbiAgICAgIC8vICAgc3VjY2VzcyAocmVzKSB7XHJcbiAgICAgIC8vICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YSlcclxuICAgICAgLy8gICAgIHNlbGYuZm9ybURhdGEgPSByZXMuZGF0YVxyXG4gICAgICAvLyAgIH1cclxuICAgICAgLy8gfSlcclxuXHJcbiAgICAgIHRoaXMuJGFwcGx5KClcclxuICAgIH1cclxuICAgIHdoZW5BcHBSZWFkeVNob3coKSB7XHJcbiAgICAgIC8vIOavj+asoemDveWIt+aWsFxyXG4gICAgICB0aGlzLiRhcHBseSgpXHJcbiAgICB9XHJcbiAgICBjaGFuZ2VDdXJyZW50RGF0YShvcHRpb24pIHsgLy/mlLnlj5jlvZPliY3mlbDmja5cclxuICAgICAgLy/lhajlm73mlbDmja5cclxuICAgICAgdmFyIG5hdGlvbmFsRGF0YSA9IHRoaXMubmF0aW9uYWxEYXRhO1xyXG4gICAgICAvL+aJgOacieecgVxyXG4gICAgICBpZiAodGhpcy5wcm92aW5jZXMubGVuZ3RoID09IDApIHtcclxuICAgICAgICB2YXIgcHJvdmluY2VzID0gdGhpcy5kYXRhLnByb3ZpbmNlcztcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5hdGlvbmFsRGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgcHJvdmluY2VzLnB1c2goe1xyXG4gICAgICAgICAgICBpbmRleDogaSxcclxuICAgICAgICAgICAgcHJvdmluY2U6IG5hdGlvbmFsRGF0YVtpXS56b25lX25hbWVcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnByb3ZpbmNlcyA9IHByb3ZpbmNlc1xyXG4gICAgICB9XHJcbiAgICAgIC8v5b2T5YmN5omA5pyJ5biCXHJcbiAgICAgIGlmIChvcHRpb24udHlwZSA9PSAnY2l0eScgfHwgb3B0aW9uLnR5cGUgPT0gJ2FsbCcpIHtcclxuICAgICAgICAvL+a4heepuuW4guaVsOaNrlxyXG4gICAgICAgIHRoaXMuY2l0aWVzID0gW11cclxuICAgICAgICB2YXIgY2l0aWVzID0gdGhpcy5jaXRpZXM7XHJcbiAgICAgICAgdmFyIGN1cnJlbnRDaXRpZXMgPSBuYXRpb25hbERhdGFbb3B0aW9uLmN1cnJlbnRQcm92aW5jZUluZGV4XS5jaXR5cztcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnRDaXRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGNpdGllcy5wdXNoKHtcclxuICAgICAgICAgICAgaW5kZXg6IGksXHJcbiAgICAgICAgICAgIGNpdHk6IGN1cnJlbnRDaXRpZXNbaV0uem9uZV9uYW1lXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jaXRpZXMgPSBjaXRpZXM7XHJcbiAgICAgIH1cclxuICAgICAgLy/lvZPliY3miYDmnInljLpcclxuICAgICAgLy/muIXnqbog5Yy6IOaVsOaNrlxyXG4gICAgICB0aGlzLmRpc3RyaWN0cyA9IFtdO1xyXG4gICAgICB2YXIgZGlzdHJpY3RzID0gdGhpcy5kaXN0cmljdHM7XHJcbiAgICAgIHZhciBjdXJyZW50RGlzdHJpY3RzID0gbmF0aW9uYWxEYXRhW29wdGlvbi5jdXJyZW50UHJvdmluY2VJbmRleF0uY2l0eXNbb3B0aW9uLmN1cnJlbnRDaXR5SW5kZXhdLmRpc3RyaWN0cztcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW50RGlzdHJpY3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGkgIT0gMCkge1xyXG4gICAgICAgICAgZGlzdHJpY3RzLnB1c2goY3VycmVudERpc3RyaWN0c1tpXS56b25lX25hbWUpO1xyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5kaXN0cmljdHMgPSBkaXN0cmljdHM7XHJcbiAgICAgIHRoaXMuJGFwcGx5KClcclxuICAgIH1cclxuICB9XHJcbiJdfQ==