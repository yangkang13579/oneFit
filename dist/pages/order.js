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
      navigationBarTitleText: '完善信息',
      navigationBarBackgroundColor: '#fff'
    }, _this.data = {
      goodsAry: [],
      one: ['柑橘', '水稻', '小麦', '玉米', '马铃薯', '棉花', '大豆', '花生', '果蔬类', '苹果', '其他作物'],
      two: [['柑类', '橘类', '杂柑类', '橙类', '柚类', '柠檬'], ['旱直播稻', '水直播稻', '人工抛秧', '机械插秧'], ['春小麦', '冬小麦'], ['夏玉米', '春玉米'], ['春季薯', '夏季薯', '冬季薯'], ['新陆早系列', '新陆中系列', '中字号棉花品种', '鲁棉系列品种', '冀棉系列品种'], ['春大豆', '夏大豆'], ['春花生', '夏花生'], ['番茄', '辣椒', '辣椒', '甜椒', '茄子', '黄瓜', '豇豆', '菜豆', '甘蓝', '冬瓜', '南瓜', '甜瓜', '西瓜', '葱', '姜', '蒜'], ['早熟品种', '中熟品种', '晚熟品种'], ['梨树', '桃树', '荔枝', '樱桃', '芒果', '花卉', '油菜', '茶叶', '葡萄', '烟草']],
      arrayLevel: ['省级经销商', '地市级经销商', '县级经销商', '乡镇/零售经销商'],
      role: null,
      sendBtn: false,
      limitTime: 60,
      disabled: true,
      classifyAry: ['经销商会', '农民会', '观摩会', '促销会', '其他会议'],
      goods: [{ area: '', cropsCategory: '' }],
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
      address: [],
      codeName: '获取验证码'
    }, _this.methods = {
      getIndex: function getIndex(e) {
        this.index = e.currentTarget.dataset.index;
      },

      getarea: function getarea(e) {
        console.log(e);
        var value = e.detail.value;
        this.goods[this.index]["area"] = value;
      },
      getGoods2: function getGoods2(e) {
        var value = e.detail.value;
        console.log(this.goods[this.index].goodsAry[value].length);
        this.goods[this.index]["cropsCategory2"] = this.goods[this.index].goodsAry[value].length > 4 ? this.goods[this.index].goodsAry[value].substring(0, 4) : this.goods[this.index].goodsAry[value];
      },

      getGoods: function getGoods(e) {
        console.log(e);
        var value = e.detail.value;
        this.goods[this.index].goodsAry = this.two[value];
        this.goods[this.index]["cropsCategory1"] = this.one[value];
        this.goods[this.index]["cropsCategory2"] = '';
      },
      addFun: function addFun() {
        if (this.goods.length >= 5) {
          wx.showModal({
            title: '提示',
            content: '种植作物最多5种',
            showCancel: false
          });
          return;
        }
        this.goods.push({ area: '', cropsCategory: '' });
        this.$apply();
      },
      del: function del(e) {
        this.goods.splice(e.currentTarget.dataset.index, 1);
      },

      // 获取验证码
      sendFun: function sendFun() {
        this.getValidCode();
      },
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
      getRemark: function getRemark(e) {
        this.formData.remark = e.detail.value;
      },
      getmobile: function getmobile(e) {
        this.formData.mobile = e.detail.value;
      },
      bindLeverChange: function bindLeverChange(e) {
        console.log(e);
        this.formData.dealerLevel = this.arrayLevel[e.detail.value];
      },
      bindRegionChange: function bindRegionChange(e) {
        this.address = e.detail.value;
        this.formData.address = '';
      },
      changeClassify: function changeClassify(e) {
        console.log(e);
        this.formData.classify = e.detail.value;
      },
      getCode: function getCode(e) {
        console.log(e);
        this.formData.code = e.detail.value;
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
      getphoneNum: function getphoneNum(e) {
        this.formData.phoneNum = e.detail.value;
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
      getcompanyName: function getcompanyName(e) {
        this.formData.companyName = e.detail.value;
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
      submit: function submit() {
        var self = this;
        if (!self.formData.mobile || self.formData.mobile == '') {
          wx.showModal({
            title: '提示',
            content: '手机号必填',
            showCancel: false
          });
          return;
        } else if (this.isPhone(this.formData.mobile) === false) {
          wx.showModal({
            title: '提示',
            content: '手机号格式不正确',
            showCancel: false
          });
          return;
        } else if (!self.formData.code || self.formData.code == '') {
          wx.showModal({
            title: '提示',
            content: '验证码必填',
            showCancel: false
          });
          return;
        }
        this.formData.role = this.role;
        this.fetchDataPromise('wx/updateUserApi.json', this.formData).then(function (data) {
          self.formData = {};
          //返回上一页
          wx.navigateBack({
            delta: 1
          });
          self.$apply();ss;
        });
      },
      save: function save() {
        //保存
        var self = this;
        this.formData.mobile = this.formData.phoneNum;
        if (!self.formData.name || self.formData.name == '') {
          wx.showModal({
            title: '提示',
            content: '姓名必填',
            showCancel: false
          });
          return;
        } else if (self.role === '3' && (!self.formData.companyName || self.formData.companyName == '')) {
          wx.showModal({
            title: '提示',
            content: '公司名称必填',
            showCancel: false
          });
          return;
        } else if (!self.formData.mobile || self.formData.mobile == '') {
          wx.showModal({
            title: '提示',
            content: '手机号必填',
            showCancel: false
          });
          return;
        } else if (this.isPhone(this.formData.mobile) === false) {
          wx.showModal({
            title: '提示',
            content: '手机号格式不正确',
            showCancel: false
          });
          return;
        } else if (!self.formData.code || self.formData.code == '') {
          wx.showModal({
            title: '提示',
            content: '验证码必填',
            showCancel: false
          });
          return;
        } else if (self.role === '3' && (!self.formData.dealerLevel || self.formData.dealerLevel == '')) {
          wx.showModal({
            title: '提示',
            content: '等级必选',
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
        } else if (self.role === '1' && (!self.formData.address || self.formData.address == '')) {
          wx.showModal({
            title: '提示',
            content: '详细地址必填',
            showCancel: false
          });
          return;
        }
        if (self.role === '1') {
          for (var i = 0; i < this.goods.length; i++) {
            if (this.goods[i].area === '' || this.goods.cropsCategory === '') {
              wx.showModal({
                title: '提示',
                content: '种植作物必填',
                showCancel: false
              });
              return;
            }
          }
        }
        this.goods = this.goods.map(function (item) {
          var obj = item;
          obj.cropsCategory = obj.cropsCategory1 + ',' + obj.cropsCategory2;
          return obj;
        });
        this.formData.cropsCategoryAndArea = this.goods;
        this.formData.provinceName = this.address[0];
        this.formData.cityName = this.address[1];
        this.formData.districtName = this.address[2];
        this.formData.role = this.role;
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
          this.fetchDataPromise('wx/updateUserApi.json', this.formData).then(function (data) {
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
  }, {
    key: 'setTime',
    value: function setTime() {
      var that = this;
      if (this.limitTime <= 0) {
        this.limitTime = 60;
        this.sendBtn = false;
        this.codeName = '重新获取';
        this.sendBtn = false;
        clearTimeout(this.clsTimeout);
      } else {
        this.sendBtn = true;
        this.limitTime--;
        this.codeName = this.limitTime + 's重新获取';
        this.clsTimeout = setTimeout(function () {
          that.setTime();
          that.$apply();
        }, 1000);
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
    key: 'isPhone',
    value: function isPhone(str) {
      var reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      return reg.test(str);
    }
  }, {
    key: 'getValidCode',
    value: function getValidCode() {
      var that = this;
      if (this.sendBtn === true) return;
      var mobile;
      if (this.role === '4') {
        mobile = this.formData.mobile;
      } else {
        mobile = this.formData.phoneNum;
      }
      if (this.isPhone(mobile) === false) {
        wx.showModal({
          title: '提示',
          content: '手机号格式不正确',
          showCancel: false
        });
        return;
      }
      try {
        wx.showLoading({
          title: '发送中,请等待...'
        });

        this.fetchDataPromise('wx/sendVerificationCodeApi.json', { phoneNum: mobile }).then(function (data) {
          wx.showToast({
            title: '发送成功请查收' });
          that.sendBtn = true;
          that.$apply();
        });
        this.setTime();
      } catch (e) {
        that.sendBtn = false;
      }
    }
  }, {
    key: 'onShow',
    value: function onShow() {
      clearTimeout(this.clsTimeout);
    }
    // endFun () {
    //   if (this.formData.endDate1) this.times = this.formData.endDate1
    // }
    // startDate () {
    //   if (this.formData.startDate1) this.times = this.formData.startDate1
    // }

  }, {
    key: 'whenAppReadyShow',
    value: function whenAppReadyShow() {}
  }, {
    key: 'onLoad',
    value: function onLoad(options) {
      console.log(111);
      this.codeName = '获取验证码', this.limitTime = 60;
      this.disabled = true;
      clearTimeout(this.clsTimeout);
      var that = this;
      if (options.role) {
        this.role = options.role;
        wx.getStorage({
          key: 'userInfo',
          success: function success(res) {
            var data = JSON.parse(res.data);
            that.formData = data;
            that.formData.name = data.userName;
            that.formData.phoneNum = data.mobile;
            that.goods = that.formData.cropsCategoryAndArea ? that.formData.cropsCategoryAndArea : [{ area: '', cropsCategory: '' }];
            if (!that.formData.latitude) {
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
            }
            that.address = !that.formData.provinceName ? [] : [that.formData.provinceName, that.formData.cityName, that.formData.districtName];
            that.$apply();
          }
        });
        return;
      }

      // 获取经纬度
      this.times = new Date().getFullYear() + '-' + this.timesFun(new Date().getMonth() + 1) + '-' + this.timesFun(new Date().getDate()) + ' ' + '12';
      var that = this;
      // if (options.item) {
      //   wx.setNavigationBarTitle({
      //     title: '编辑会议' 
      //   })
      //   that.type = 'edit'
      //   this.formData = JSON.parse(options.item)
      //   this.formData.startDate1 = this.formData.startDate1.split(' ')[0] + ' ' + this.formData.startDate1.split(' ')[1].split(':')[0]
      //   this.formData.endDate1 = this.formData.endDate1.split(' ')[0] + ' ' + this.formData.startDate1.split(' ')[1].split(':')[0]
      //   this.times = this.formData.startDate1
      // }


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
    // whenAppReadyShow() {
    //   // 每次都刷新
    //   this.$apply()
    // }

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


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(EditAddress , 'pages/order'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVyLmpzIl0sIm5hbWVzIjpbIkVkaXRBZGRyZXNzIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJkYXRhIiwiZ29vZHNBcnkiLCJvbmUiLCJ0d28iLCJhcnJheUxldmVsIiwicm9sZSIsInNlbmRCdG4iLCJsaW1pdFRpbWUiLCJkaXNhYmxlZCIsImNsYXNzaWZ5QXJ5IiwiZ29vZHMiLCJhcmVhIiwiY3JvcHNDYXRlZ29yeSIsInR5cGUiLCJmb3JtRGF0YSIsImRhdGUiLCJ0aW1lcyIsInllYXJzIiwibW9udGhzIiwiZGF5cyIsImhvdXJzIiwibWludXRlcyIsInNlY29uZCIsIm11bHRpQXJyYXkiLCJtdWx0aUluZGV4IiwiY2hvb3NlX3llYXIiLCJ5ZWFySW5kZXgiLCJhZGRyZXNzIiwiY29kZU5hbWUiLCJtZXRob2RzIiwiZ2V0SW5kZXgiLCJlIiwiaW5kZXgiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YXNldCIsImdldGFyZWEiLCJjb25zb2xlIiwibG9nIiwidmFsdWUiLCJkZXRhaWwiLCJnZXRHb29kczIiLCJsZW5ndGgiLCJzdWJzdHJpbmciLCJnZXRHb29kcyIsImFkZEZ1biIsInd4Iiwic2hvd01vZGFsIiwidGl0bGUiLCJjb250ZW50Iiwic2hvd0NhbmNlbCIsInB1c2giLCIkYXBwbHkiLCJkZWwiLCJzcGxpY2UiLCJzZW5kRnVuIiwiZ2V0VmFsaWRDb2RlIiwiY2hvb3NlTG9jYXRpb24iLCJ0aGF0IiwiZ2V0TG9jYXRpb24iLCJzdWNjZXNzIiwicmVzIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJyZXN0IiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRoZW4iLCJwcm92aW5jZU5hbWUiLCJjaXR5TmFtZSIsImRpc3RyaWN0TmFtZSIsImdldFJlbWFyayIsInJlbWFyayIsImdldG1vYmlsZSIsIm1vYmlsZSIsImJpbmRMZXZlckNoYW5nZSIsImRlYWxlckxldmVsIiwiYmluZFJlZ2lvbkNoYW5nZSIsImNoYW5nZUNsYXNzaWZ5IiwiY2xhc3NpZnkiLCJnZXRDb2RlIiwiY29kZSIsImJpbmRNdWx0aVBpY2tlckNvbHVtbkNoYW5nZSIsImNvbHVtbiIsIm51bSIsInBhcnNlSW50Iiwic2V0RGF5cyIsImJpbmRTdGFydENoYW5nZSIsInN0YXJ0RGF0ZTEiLCJQaWNrZXJDaGFuZ2UiLCJiaW5kRW5kQ2hhbmdlIiwiZW5kRGF0ZTEiLCJnZXR0aW1lcyIsInNob3dBZGRyQ2hvc2UiLCJpc1Nob3dBZGRyZXNzQ2hvc2UiLCJjYW5jZWwiLCJmaW5pc2giLCJnZXROYW1lIiwibmFtZSIsImdldHBob25lTnVtIiwicGhvbmVOdW0iLCJnZXRDb250ZW50IiwiZ2V0bGVhZGVyIiwibGVhZGVyIiwiZ2V0Y29tcGFueU5hbWUiLCJjb21wYW55TmFtZSIsImdldGFkZHJlc3MiLCJnZXR1c2VyQ291bnQiLCJ1c2VyQ2FwYWNpdHkiLCJzdWJtaXQiLCJzZWxmIiwiaXNQaG9uZSIsIm5hdmlnYXRlQmFjayIsImRlbHRhIiwic3MiLCJzYXZlIiwiaSIsIm1hcCIsIm9iaiIsIml0ZW0iLCJjcm9wc0NhdGVnb3J5MSIsImNyb3BzQ2F0ZWdvcnkyIiwiY3JvcHNDYXRlZ29yeUFuZEFyZWEiLCJ1c2VyIiwidCIsIkRhdGUiLCJfeWVhckluZGV4IiwiaW5mbyIsIl9kZWZhdWx0WWVhciIsInNwbGl0IiwiZ2V0RnVsbFllYXIiLCJjbGVhclRpbWVvdXQiLCJjbHNUaW1lb3V0Iiwic2V0VGltZW91dCIsInNldFRpbWUiLCJzZWxlY3RZZWFyIiwic2VsZWN0TW9udGgiLCJ0ZW1wIiwieWVhciIsImFsbERhdGVMaXN0IiwiZGF0ZUxpc3QiLCJtb250aCIsImRheSIsInRpbWVzTGlzdCIsImhvdXIiLCJtaW51dGUiLCJzdHIiLCJyZWciLCJ0ZXN0Iiwic2hvd0xvYWRpbmciLCJzaG93VG9hc3QiLCJvcHRpb25zIiwiZ2V0U3RvcmFnZSIsImtleSIsIkpTT04iLCJwYXJzZSIsInVzZXJOYW1lIiwiZmFpbCIsInRpbWVzRnVuIiwiZ2V0TW9udGgiLCJnZXREYXRlIiwic2V0dGltZXNEYXRlIiwiY3VycmVudE1vbnRoIiwiY3VycmVudERheSIsInNldERlZmF1bHR0aW1lcyIsIm9wdGlvbiIsIm5hdGlvbmFsRGF0YSIsInByb3ZpbmNlcyIsInByb3ZpbmNlIiwiem9uZV9uYW1lIiwiY2l0aWVzIiwiY3VycmVudENpdGllcyIsImN1cnJlbnRQcm92aW5jZUluZGV4IiwiY2l0eXMiLCJjaXR5IiwiZGlzdHJpY3RzIiwiY3VycmVudERpc3RyaWN0cyIsImN1cnJlbnRDaXR5SW5kZXgiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDRTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFDcUJBLFc7Ozs7Ozs7Ozs7Ozs7O2dNQUNuQkMsTSxHQUFTLENBQUNDLGNBQUQsQyxRQUNUQyxNLEdBQVM7QUFDUEMsOEJBQXdCLE1BRGpCO0FBRVBDLG9DQUE4QjtBQUZ2QixLLFFBS1RDLEksR0FBTztBQUNMQyxnQkFBVSxFQURMO0FBRURDLFdBQUssQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUIsS0FBekIsRUFBZ0MsSUFBaEMsRUFBc0MsSUFBdEMsRUFBNEMsSUFBNUMsRUFBa0QsS0FBbEQsRUFBeUQsSUFBekQsRUFBK0QsTUFBL0QsQ0FGSjtBQUdQQyxXQUFLLENBQUMsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLEtBQWIsRUFBb0IsSUFBcEIsRUFBMEIsSUFBMUIsRUFBZ0MsSUFBaEMsQ0FBRCxFQUF3QyxDQUFDLE1BQUQsRUFBUyxNQUFULEVBQWlCLE1BQWpCLEVBQXlCLE1BQXpCLENBQXhDLEVBQ1QsQ0FBQyxLQUFELEVBQVEsS0FBUixDQURTLEVBQ08sQ0FBQyxLQUFELEVBQVEsS0FBUixDQURQLEVBRVQsQ0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLEtBQWYsQ0FGUyxFQUdULENBQUMsT0FBRCxFQUFVLE9BQVYsRUFBbUIsU0FBbkIsRUFBOEIs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QkFBaUI1RCxDQUFqQixFQUFvQnFELFNBQW5DO0FBQ0Q7QUFDRjtBQUNELFdBQUtNLFNBQUwsR0FBaUJBLFNBQWpCO0FBQ0EsV0FBSzFILE1BQUw7QUFDRDs7OztFQXJwQnNDNkgsZUFBS0MsSTs7a0JBQXpCdkwsVyIsImZpbGUiOiJvcmRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4gIGltcG9ydCB3ZXB5IGZyb20gJ3dlcHknO1xyXG4gIGltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vbWl4aW5zL3BhZ2UnO1xyXG4gIGV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRBZGRyZXNzIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICAgIG1peGlucyA9IFtQYWdlTWl4aW5dO1xyXG4gICAgY29uZmlnID0ge1xyXG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn5a6M5ZaE5L+h5oGvJyxcclxuICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNmZmYnXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBkYXRhID0ge1xyXG4gICAgICBnb29kc0FyeTogW10sXHJcbiAgICAgICAgICBvbmU6IFsn5p+R5qmYJywgJ+awtOeouycsICflsI/puqYnLCAn546J57GzJywgJ+mprOmTg+iWrycsICfmo4noirEnLCAn5aSn6LGGJywgJ+iKseeUnycsICfmnpzolKznsbsnLCAn6Iu55p6cJywgJ+WFtuS7luS9nOeJqSddLFxyXG4gICAgdHdvOiBbWyfmn5HnsbsnLCAn5qmY57G7JywgJ+adguafkeexuycsICfmqZnnsbsnLCAn5p+a57G7JywgJ+afoOaqrCddLCBbJ+aXseebtOaSreeouycsICfmsLTnm7Tmkq3nqLsnLCAn5Lq65bel5oqb56enJywgJ+acuuaisOaPkuenpyddLCBcclxuWyfmmKXlsI/puqYnLCAn5Yas5bCP6bqmJ10sIFsn5aSP546J57GzJywgJ+aYpeeOieexsyddLFxyXG5bJ+aYpeWto+iWrycsICflpI/lraPolq8nLCAn5Yas5a2j6JavJ10sXHJcblsn5paw6ZmG5pep57O75YiXJywgJ+aWsOmZhuS4reezu+WIlycsICfkuK3lrZflj7fmo4noirHlk4Hnp40nLCAn6bKB5qOJ57O75YiX5ZOB56eNJywgJ+WGgOajieezu+WIl+WTgeenjSddLFxyXG5bJ+aYpeWkp+ixhicsICflpI/lpKfosYYnXSxcclxuWyfmmKXoirHnlJ8nLCAn5aSP6Iqx55SfJ10sXHJcblsn55Wq6IyEJywgJ+i+o+akkicsICfovqPmpJInLCAn55Sc5qSSJywgJ+iMhOWtkCcsICfpu4Tnk5wnLCAn6LGH6LGGJywgJ+iPnOixhicsICfnlJjok50nLCAn5Yas55OcJywgJ+WNl+eTnCcsICfnlJznk5wnLCAn6KW/55OcJywgJ+iRsScsICflp5wnLCAn6JKcJ10sXHJcblsn5pep54af5ZOB56eNJywgJ+S4reeGn+WTgeenjScsICfmmZrnhp/lk4Hnp40nXSxcclxuWyfmoqjmoJEnLCAn5qGD5qCRJywgJ+iNlOaenScsICfmqLHmoYMnLCAn6IqS5p6cJywgJ+iKseWNiScsICfmsrnoj5wnLCAn6Iy25Y+2JywgJ+iRoeiQhCcsICfng5/ojYknXV0sXHJcbiAgICAgIGFycmF5TGV2ZWw6IFsn55yB57qn57uP6ZSA5ZWGJywgJ+WcsOW4gue6p+e7j+mUgOWVhicsICfljr/nuqfnu4/plIDllYYnLCAn5Lmh6ZWHL+mbtuWUrue7j+mUgOWVhiddLFxyXG4gICAgICByb2xlOiBudWxsLFxyXG4gICAgICBzZW5kQnRuOiBmYWxzZSxcclxuICAgICAgbGltaXRUaW1lOiA2MCxcclxuICAgICAgZGlzYWJsZWQ6IHRydWUsXHJcbiAgICAgIGNsYXNzaWZ5QXJ5OiBbXHJcbiAgICAgICAgJ+e7j+mUgOWVhuS8micsXHJcbiAgICAgICAgJ+WGnOawkeS8micsXHJcbiAgICAgICAgJ+inguaRqeS8micsXHJcbiAgICAgICAgJ+S/g+mUgOS8micsXHJcbiAgICAgICAgJ+WFtuS7luS8muiuridcclxuICAgICAgXSxcclxuICAgICAgZ29vZHM6IFt7YXJlYTogJycsIGNyb3BzQ2F0ZWdvcnk6ICcnfV0sXHJcbiAgICAgIHR5cGU6IG51bGwsXHJcbiAgICAgIGZvcm1EYXRhOiB7fSxcclxuICAgICAgZGF0ZTogJzIwMTYtMDktMDEnLFxyXG4gICAgICB0aW1lczogJzIwMjAtMDctMjkgMTI6NTAnLFxyXG4gICAgICAvLyDml7bpl7TpgInmi6nlmajlj4LmlbBcclxuICAgICAgeWVhcnM6IFtdLFxyXG4gICAgICBtb250aHM6IFtdLFxyXG4gICAgICBkYXlzOiBbXSxcclxuICAgICAgaG91cnM6IFtdLFxyXG4gICAgICBtaW51dGVzOiBbXSxcclxuICAgICAgc2Vjb25kOiBbXSxcclxuICAgICAgbXVsdGlBcnJheTogW10sIC8vIOmAieaLqeiMg+WbtFxyXG4gICAgICBtdWx0aUluZGV4OiBbMCwgOSwgMTYsIDEzLCAxN10sIC8vIOmAieS4reWAvOaVsOe7hFxyXG4gICAgICBjaG9vc2VfeWVhcjogJycsXHJcbiAgICAgIHllYXJJbmRleDogMCxcclxuICAgICAgYWRkcmVzczogW10sXHJcbiAgICAgIGNvZGVOYW1lOiAn6I635Y+W6aqM6K+B56CBJyxcclxuICAgIH07XHJcbiAgICAvLyDlt67kuIDkvY3ooaXkvY1cclxuICAgIHRpbWVzRnVuICh0KSB7XHJcbiAgICAgIGlmICh0IDwgMTApIHJldHVybiAnMCcgKyB0XHJcbiAgICAgIGVsc2UgcmV0dXJuIHRcclxuICAgIH1cclxuICAgIC8vIOiuvue9ruWIneWni+WAvFxyXG4gICAgc2V0dGltZXNEYXRlKCkge1xyXG4gICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKVxyXG4gICAgICBsZXQgX3llYXJJbmRleCA9IDBcclxuICAgICAgLy8g6buY6K6k6K6+572uXHJcbiAgICAgIGNvbnNvbGUuaW5mbyh0aGlzLnRpbWVzKVxyXG4gICAgICBsZXQgX2RlZmF1bHRZZWFyID0gdGhpcy50aW1lcyA/IHRoaXMudGltZXMuc3BsaXQoJy0nKVswXSA6IDBcclxuICAgICAgLy8g6I635Y+W5bm0XHJcbiAgICAgIGZvciAobGV0IGkgPSBkYXRlLmdldEZ1bGxZZWFyKCk7IGkgPD0gZGF0ZS5nZXRGdWxsWWVhcigpICsgNTsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy55ZWFycy5wdXNoKCcnICsgaSlcclxuICAgICAgICAvLyDpu5jorqTorr7nva7nmoTlubTnmoTkvY3nva5cclxuICAgICAgICBpZiAoX2RlZmF1bHRZZWFyICYmIGkgPT09IHBhcnNlSW50KF9kZWZhdWx0WWVhcikpIHtcclxuICAgICAgICAgIHRoaXMueWVhckluZGV4ID0gX3llYXJJbmRleFxyXG4gICAgICAgICAgdGhpcy5jaG9vc2VfeWVhciA9IF9kZWZhdWx0WWVhclxyXG4gICAgICAgIH1cclxuICAgICAgICBfeWVhckluZGV4ID0gX3llYXJJbmRleCArIDFcclxuICAgICAgfVxyXG4gICAgICAvLyDojrflj5bmnIjku71cclxuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMTI7IGkrKykge1xyXG4gICAgICAgIGlmIChpIDwgMTApIHtcclxuICAgICAgICAgIGkgPSAnMCcgKyBpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubW9udGhzLnB1c2goJycgKyBpKVxyXG4gICAgICB9XHJcbiAgICAgIC8vIOiOt+WPluaXpeacn1xyXG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSAzMTsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgICAgaSA9ICcwJyArIGlcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kYXlzLnB1c2goJycgKyBpKVxyXG4gICAgICB9XHJcbiAgICAgIC8vIC8vIOiOt+WPluWwj+aXtlxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI0OyBpKyspIHtcclxuICAgICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgICAgIGkgPSAnMCcgKyBpXHJcbiAgICAgICAgIH1cclxuICAgICAgICAgdGhpcy5ob3Vycy5wdXNoKCcnICsgaSlcclxuICAgICAgIH1cclxuICAgICAgLy8gLy8g6I635Y+W5YiG6ZKfXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNjA7IGkrKykge1xyXG4gICAgICAgIGlmIChpIDwgMTApIHtcclxuICAgICAgICAgIGkgPSAnMCcgKyBpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubWludXRlcy5wdXNoKCcnICsgaSlcclxuICAgICAgfVxyXG4gICAgICAvLyAvLyDojrflj5bnp5LmlbBcclxuICAgICAgLy8gZm9yIChsZXQgaSA9IDA7IGkgPCA2MDsgaSsrKSB7XHJcbiAgICAgIC8vICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAvLyAgICAgaSA9ICcwJyArIGlcclxuICAgICAgLy8gICB9XHJcbiAgICAgIC8vICAgdGhpcy5zZWNvbmQucHVzaCgnJyArIGkpXHJcbiAgICAgIC8vIH1cclxuICAgIH1cclxuICAgIHNldFRpbWUgKCkge1xyXG4gICAgICBsZXQgdGhhdCA9IHRoaXNcclxuICAgICAgaWYgKHRoaXMubGltaXRUaW1lIDw9IDApIHtcclxuICAgICAgICB0aGlzLmxpbWl0VGltZSA9IDYwXHJcbiAgICAgICAgdGhpcy5zZW5kQnRuID0gZmFsc2VcclxuICAgICAgICB0aGlzLmNvZGVOYW1lID0gJ+mHjeaWsOiOt+WPlidcclxuICAgICAgICB0aGlzLnNlbmRCdG4gPSBmYWxzZVxyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmNsc1RpbWVvdXQpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5zZW5kQnRuID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMubGltaXRUaW1lLS1cclxuICAgICAgICB0aGlzLmNvZGVOYW1lID0gdGhpcy5saW1pdFRpbWUgKyAnc+mHjeaWsOiOt+WPlidcclxuICAgICAgICB0aGlzLmNsc1RpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHRoYXQuc2V0VGltZSgpXHJcbiAgICAgICAgICB0aGF0LiRhcHBseSgpXHJcbiAgICAgICAgfSwgMTAwMClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8g6L+U5Zue5pyI5Lu955qE5aSp5pWwXHJcbiAgICBzZXREYXlzKHNlbGVjdFllYXIsIHNlbGVjdE1vbnRoKSB7XHJcbiAgICAgIGxldCBudW0gPSBzZWxlY3RNb250aFxyXG4gICAgICBsZXQgdGVtcCA9IFtdXHJcbiAgICAgIGlmIChudW0gPT09IDEgfHwgbnVtID09PSAzIHx8IG51bSA9PT0gNSB8fCBudW0gPT09IDcgfHwgbnVtID09PSA4IHx8IG51bSA9PT0gMTAgfHwgbnVtID09PSAxMikge1xyXG4gICAgICAgICAgLy8g5Yik5patMzHlpKnnmoTmnIjku71cclxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSAzMTsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgICAgIGkgPSAnMCcgKyBpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0ZW1wLnB1c2goJycgKyBpKVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChudW0gPT09IDQgfHwgbnVtID09PSA2IHx8IG51bSA9PT0gOSB8fCBudW0gPT09IDExKSB7IC8vIOWIpOaWrTMw5aSp55qE5pyI5Lu9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMzA7IGkrKykge1xyXG4gICAgICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgICAgICBpID0gJzAnICsgaVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGVtcC5wdXNoKCcnICsgaSlcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAobnVtID09PSAyKSB7IC8vIOWIpOaWrTLmnIjku73lpKnmlbBcclxuICAgICAgICBsZXQgeWVhciA9IHBhcnNlSW50KHNlbGVjdFllYXIpXHJcbiAgICAgICAgY29uc29sZS5sb2coeWVhcilcclxuICAgICAgICBpZiAoKCh5ZWFyICUgNDAwID09PSAwKSB8fCAoeWVhciAlIDEwMCAhPT0gMCkpICYmICh5ZWFyICUgNCA9PT0gMCkpIHtcclxuICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDI5OyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgICAgICAgIGkgPSAnMCcgKyBpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGVtcC5wdXNoKCcnICsgaSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMjg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgICAgICAgaSA9ICcwJyArIGlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0ZW1wLnB1c2goJycgKyBpKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdGVtcFxyXG4gICAgfVxyXG4gICAgLy8g6K6+572u6buY6K6k5YC8IOagvOW8jzIwMTktMDctMTAgMTA6MzBcclxuICAgIHNldERlZmF1bHR0aW1lcygpIHtcclxuICAgICAgbGV0IGFsbERhdGVMaXN0ID0gdGhpcy50aW1lcy5zcGxpdCgnICcpXHJcbiAgICAgIC8vIOaXpeacn1xyXG4gICAgICBsZXQgZGF0ZUxpc3QgPSBhbGxEYXRlTGlzdFswXS5zcGxpdCgnLScpXHJcbiAgICAgIGxldCBtb250aCA9IHBhcnNlSW50KGRhdGVMaXN0WzFdKSAtIDFcclxuICAgICAgbGV0IGRheSA9IHBhcnNlSW50KGRhdGVMaXN0WzJdKSAtIDFcclxuICAgICAgLy8g5pe26Ze0XHJcbiAgICAgIGxldCB0aW1lc0xpc3QgPSBhbGxEYXRlTGlzdFsxXS5zcGxpdCgnOicpXHJcbiAgICAgIHRoaXMubXVsdGlBcnJheVsyXSA9IHRoaXMuc2V0RGF5cyhkYXRlTGlzdFswXSwgcGFyc2VJbnQoZGF0ZUxpc3RbMV0pKVxyXG4gICAgICB0aGlzLm11bHRpSW5kZXggPSBbdGhpcy55ZWFySW5kZXgsIG1vbnRoLCBkYXksIHRpbWVzTGlzdFswXSwgdGltZXNMaXN0WzFdXVxyXG4gICAgfVxyXG4gICAgLy8g6I635Y+W5pe26Ze05pel5pyfXHJcbiAgICBQaWNrZXJDaGFuZ2UoZSkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygncGlja2Vy5Y+R6YCB6YCJ5oup5pS55Y+Y77yM5pC65bim5YC85Li6JywgZS5kZXRhaWwudmFsdWUpXHJcbiAgICAgIHRoaXMubXVsdGlJbmRleCA9IGUuZGV0YWlsLnZhbHVlXHJcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5tdWx0aUluZGV4XHJcbiAgICAgIGNvbnN0IHllYXIgPSB0aGlzLm11bHRpQXJyYXlbMF1baW5kZXhbMF1dXHJcbiAgICAgIGNvbnN0IG1vbnRoID0gdGhpcy5tdWx0aUFycmF5WzFdW2luZGV4WzFdXVxyXG4gICAgICBjb25zdCBkYXkgPSB0aGlzLm11bHRpQXJyYXlbMl1baW5kZXhbMl1dXHJcbiAgICAgIGNvbnN0IGhvdXIgPSB0aGlzLm11bHRpQXJyYXlbM11baW5kZXhbM11dXHJcbiAgICAgIGNvbnN0IG1pbnV0ZSA9IHRoaXMubXVsdGlBcnJheVs0XVtpbmRleFs0XV1cclxuICAgICAgLy8gY29uc3Qgc2Vjb25kID0gdGhpcy5tdWx0aUFycmF5WzVdW2luZGV4WzVdXVxyXG4gICAgICAvLyBjb25zb2xlLmxvZyhgJHt5ZWFyfS0ke21vbnRofS0ke2RheX0tJHtob3VyfS0ke21pbnV0ZX1gKTtcclxuICAgICAgdGhpcy50aW1lcyA9IHllYXIgKyAnLScgKyBtb250aCArICctJyArIGRheSArICcgJyArIGhvdXIgKyAnOicgKyBtaW51dGVcclxuICAgICAgdGhpcy4kYXBwbHkoKVxyXG4gICAgICByZXR1cm4gdGhpcy50aW1lc1xyXG4gICAgfVxyXG4gICAgaXNQaG9uZSAoc3RyKSB7XHJcbiAgICAgIGNvbnN0IHJlZyA9IC9eWzFdWzMsNCw1LDcsOCw5XVswLTldezl9JC9cclxuICAgICAgcmV0dXJuIHJlZy50ZXN0KHN0cilcclxuICAgIH1cclxuICAgIGdldFZhbGlkQ29kZSAoKSB7XHJcbiAgICAgIHZhciB0aGF0ID0gdGhpc1xyXG4gICAgICBpZiAodGhpcy5zZW5kQnRuID09PSB0cnVlKSByZXR1cm5cclxuICAgICAgdmFyIG1vYmlsZVxyXG4gICAgICBpZiAodGhpcy5yb2xlID09PSAnNCcpIHtcclxuICAgICAgICBtb2JpbGUgPSB0aGlzLmZvcm1EYXRhLm1vYmlsZVxyXG4gICAgICB9ICBlbHNlIHtcclxuICAgICAgICBtb2JpbGUgPSB0aGlzLmZvcm1EYXRhLnBob25lTnVtXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMuaXNQaG9uZShtb2JpbGUpID09PSBmYWxzZSkge1xyXG4gICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgICAgICBjb250ZW50OiAn5omL5py65Y+35qC85byP5LiN5q2j56GuJyxcclxuICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuICAgICAgdHJ5IHtcclxuICAgICAgICB3eC5zaG93TG9hZGluZyh7XHJcbiAgICAgICAgICB0aXRsZTogJ+WPkemAgeS4rSzor7fnrYnlvoUuLi4nXHJcbiAgICAgICAgfSlcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3d4L3NlbmRWZXJpZmljYXRpb25Db2RlQXBpLmpzb24nLCB7cGhvbmVOdW06IG1vYmlsZX0pXHJcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgd3guc2hvd1RvYXN0KHtcclxuICAgICAgICAgICAgdGl0bGU6ICflj5HpgIHmiJDlip/or7fmn6XmlLYnfVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgIHRoYXQuc2VuZEJ0biA9IHRydWVcclxuICAgICAgICAgIHRoYXQuJGFwcGx5KCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLnNldFRpbWUoKVxyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgdGhhdC5zZW5kQnRuID0gZmFsc2VcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgbWV0aG9kcyA9IHtcclxuICAgICAgXHJcbiAgICAgICBnZXRJbmRleChlKSB7XHJcbiAgICAgIHRoaXMuaW5kZXggPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleFxyXG4gICAgfSxcclxuICAgIGdldGFyZWE6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZSlcclxuICAgICAgbGV0IHZhbHVlID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgIHRoaXMuZ29vZHNbdGhpcy5pbmRleF1bXCJhcmVhXCJdID0gdmFsdWU7XHJcbiAgICB9LFxyXG4gICBnZXRHb29kczIoZSkge1xyXG4gICAgICBsZXQgdmFsdWUgPSBlLmRldGFpbC52YWx1ZTtcclxuICAgICAgY29uc29sZS5sb2codGhpcy5nb29kc1t0aGlzLmluZGV4XS5nb29kc0FyeVt2YWx1ZV0ubGVuZ3RoKVxyXG4gICAgICB0aGlzLmdvb2RzW3RoaXMuaW5kZXhdW1wiY3JvcHNDYXRlZ29yeTJcIl0gPSAgXHJcbiAgICAgIHRoaXMuZ29vZHNbdGhpcy5pbmRleF0uZ29vZHNBcnlbdmFsdWVdLmxlbmd0aCA+IDQgPyB0aGlzLmdvb2RzW3RoaXMuaW5kZXhdLmdvb2RzQXJ5W3ZhbHVlXS5zdWJzdHJpbmcoMCwgNCk6dGhpcy5nb29kc1t0aGlzLmluZGV4XS5nb29kc0FyeVt2YWx1ZV1cclxuICAgIH0sXHJcbiAgICBnZXRHb29kczogZnVuY3Rpb24oZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlKVxyXG4gICAgICBsZXQgdmFsdWUgPSBlLmRldGFpbC52YWx1ZTtcclxuICAgICB0aGlzLmdvb2RzW3RoaXMuaW5kZXhdLmdvb2RzQXJ5ID0gdGhpcy50d29bdmFsdWVdXHJcbiAgICAgIHRoaXMuZ29vZHNbdGhpcy5pbmRleF1bXCJjcm9wc0NhdGVnb3J5MVwiXSA9IHRoaXMub25lW3ZhbHVlXTtcclxuICAgICAgdGhpcy5nb29kc1t0aGlzLmluZGV4XVtcImNyb3BzQ2F0ZWdvcnkyXCJdID0gJydcclxuICAgIH0sXHJcbiAgICAgYWRkRnVuICgpIHtcclxuICAgICAgIGlmICh0aGlzLmdvb2RzLmxlbmd0aCA+PSA1KSB7XHJcbiAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcclxuICAgICAgICAgICAgY29udGVudDogJ+enjeakjeS9nOeJqeacgOWkmjXnp40nLFxyXG4gICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgIHJldHVyblxyXG4gICAgICAgfVxyXG4gICAgICAgdGhpcy5nb29kcy5wdXNoKHthcmVhOiAnJywgY3JvcHNDYXRlZ29yeTogJyd9KVxyXG4gICAgICAgdGhpcy4kYXBwbHkoKVxyXG4gICAgIH0sXHJcbiAgICAgZGVsKGUpIHtcclxuICAgICAgdGhpcy5nb29kcy5zcGxpY2UoZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXgsIDEpO1xyXG4gICAgfSxcclxuICAgIC8vIOiOt+WPlumqjOivgeeggVxyXG4gICAgc2VuZEZ1biAoKSB7XHJcbiAgICAgIHRoaXMuZ2V0VmFsaWRDb2RlKClcclxuICAgIH0sXHJcbiAgICAgIGNob29zZUxvY2F0aW9uICgpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXNcclxuICAgICAgICB3eC5nZXRMb2NhdGlvbih7XHJcbiAgICAgICAgdHlwZTogJ3dnczg0JyxcclxuICAgICAgICBzdWNjZXNzIChyZXMpIHtcclxuICAgICAgICAgIHd4LmNob29zZUxvY2F0aW9uKHtcclxuICAgICAgICAgICAgbGF0aXR1ZGU6IHJlcy5sYXRpdHVkZSxcclxuICAgICAgICAgICAgbG9uZ2l0dWRlOiByZXMubG9uZ2l0dWRlLFxyXG4gICAgICAgICAgICBzdWNjZXNzIChyZXN0KSB7XHJcbiAgICAgICAgICAgICAgLy/lj5HpgIHor7fmsYLpgJrov4fnu4/nuqzluqblj43mn6XlnLDlnYDkv6Hmga8gIFxyXG4gICAgICAgIMKgIMKgICB0aGF0LmZldGNoRGF0YVByb21pc2UoJ3Jlc29sdmVMb2NhdGlvbkFwaS5qc29uJywge2xhdGl0dWRlOnJlc3QubGF0aXR1ZGUsIGxvbmdpdHVkZTogcmVzdC5sb25naXR1ZGV9KVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgdGhhdC5hZGRyZXNzID0gW2RhdGEucHJvdmluY2VOYW1lLCBkYXRhLmNpdHlOYW1lLCBkYXRhLmRpc3RyaWN0TmFtZV1cclxuICAgICAgICAgICAgICB0aGF0LmZvcm1EYXRhLmFkZHJlc3MgPSBkYXRhLmFkZHJlc3NcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgfSlcclxuICAgICAgIFxyXG4gICAgICB9LFxyXG4gICAgICBnZXRSZW1hcmsgKGUpIHtcclxuICAgICAgICAgdGhpcy5mb3JtRGF0YS5yZW1hcmsgPSBlLmRldGFpbC52YWx1ZVxyXG4gICAgICB9LFxyXG4gICAgICBnZXRtb2JpbGUoZSkge1xyXG4gICAgICAgIHRoaXMuZm9ybURhdGEubW9iaWxlID0gZS5kZXRhaWwudmFsdWVcclxuICAgICAgfSxcclxuICAgICAgYmluZExldmVyQ2hhbmdlIChlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZSlcclxuICAgICAgICB0aGlzLmZvcm1EYXRhLmRlYWxlckxldmVsID0gdGhpcy5hcnJheUxldmVsW2UuZGV0YWlsLnZhbHVlXVxyXG4gICAgICB9LFxyXG4gICAgICBiaW5kUmVnaW9uQ2hhbmdlIChlKSB7XHJcbiAgICAgICAgdGhpcy5hZGRyZXNzID0gZS5kZXRhaWwudmFsdWVcclxuICAgICAgICB0aGlzLmZvcm1EYXRhLmFkZHJlc3MgPSAnJ1xyXG4gICAgICB9LFxyXG4gICAgICBjaGFuZ2VDbGFzc2lmeSAoZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICAgICAgdGhpcy5mb3JtRGF0YS5jbGFzc2lmeSA9IGUuZGV0YWlsLnZhbHVlXHJcbiAgICAgIH0sXHJcbiAgICAgIGdldENvZGUgKGUpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlKVxyXG4gICAgICAgIHRoaXMuZm9ybURhdGEuY29kZSA9IGUuZGV0YWlsLnZhbHVlXHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIOebkeWQrHBpY2tlcueahOa7muWKqOS6i+S7tlxyXG4gICAgICBiaW5kTXVsdGlQaWNrZXJDb2x1bW5DaGFuZ2UoZSkge1xyXG4gICAgICAgIC8vIOiOt+WPluW5tOS7vVxyXG4gICAgICAgIGlmIChlLmRldGFpbC5jb2x1bW4gPT09IDApIHtcclxuICAgICAgICAgIHRoaXMuY2hvb3NlX3llYXIgPSB0aGlzLm11bHRpQXJyYXlbZS5kZXRhaWwuY29sdW1uXVtlLmRldGFpbC52YWx1ZV1cclxuICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY2hvb3NlX3llYXIpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCfkv67mlLnnmoTliJfkuLonLCBlLmRldGFpbC5jb2x1bW4sICfvvIzlgLzkuLonLCBlLmRldGFpbC52YWx1ZSk7XHJcbiAgICAgICAgLy8g6K6+572u5pyI5Lu95pWw57uEXHJcbiAgICAgICAgaWYgKGUuZGV0YWlsLmNvbHVtbiA9PT0gMSkge1xyXG4gICAgICAgICAgbGV0IG51bSA9IHBhcnNlSW50KHRoaXMubXVsdGlBcnJheVtlLmRldGFpbC5jb2x1bW5dW2UuZGV0YWlsLnZhbHVlXSlcclxuICAgICAgICAgIHRoaXMubXVsdGlBcnJheVsyXSA9IHRoaXMuc2V0RGF5cyh0aGlzLmNob29zZV95ZWFyLCBudW0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm11bHRpSW5kZXhbZS5kZXRhaWwuY29sdW1uXSA9IGUuZGV0YWlsLnZhbHVlXHJcbiAgICAgICAgdGhpcy4kYXBwbHkoKVxyXG4gICAgICB9LFxyXG4gICAgICBiaW5kU3RhcnRDaGFuZ2UgKGUpIHtcclxuICAgICAgICB0aGlzLmZvcm1EYXRhLnN0YXJ0RGF0ZTEgPSB0aGlzLlBpY2tlckNoYW5nZShlKVxyXG4gICAgICB9LFxyXG4gICAgICBiaW5kRW5kQ2hhbmdlIChlKSB7XHJcbiAgICAgICAgdGhpcy5mb3JtRGF0YS5lbmREYXRlMSA9IHRoaXMuUGlja2VyQ2hhbmdlKGUpXHJcbiAgICAgIH0sXHJcbiAgICAgIFxyXG4gICAgICAvLyDojrflj5bml7bpl7RcclxuICAgICAgZ2V0dGltZXMgKHRpbWVzKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2codGltZXMpXHJcbiAgICAgIH0sXHJcbiAgICAgIHNob3dBZGRyQ2hvc2UoKSB7IC8v5pi+56S655yB5biC5Yy66IGU5Yqo6YCJ5oup5qGGXHJcbiAgICAgICAgdGhpcy5pc1Nob3dBZGRyZXNzQ2hvc2UgPSAhdGhpcy5kYXRhLmlzU2hvd0FkZHJlc3NDaG9zZVxyXG4gICAgICB9LFxyXG4gICAgICBjYW5jZWwoKSB7IC8v5Y+W5raIXHJcbiAgICAgICAgdGhpcy5pc1Nob3dBZGRyZXNzQ2hvc2UgPSBmYWxzZTtcclxuICAgICAgfSxcclxuICAgICAgZmluaXNoKCkgeyAvL+WujOaIkFxyXG4gICAgICAgIHRoaXMuaXNTaG93QWRkcmVzc0Nob3NlID0gZmFsc2VcclxuICAgICAgfSxcclxuICAgICAgZ2V0TmFtZShlKSB7IC8v6I635b6X5Lya6K6u5ZCN56ewXHJcbiAgICAgICAgdGhpcy5mb3JtRGF0YS5uYW1lID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgdGhpcy4kYXBwbHkoKVxyXG4gICAgICB9LFxyXG4gICAgICBnZXRwaG9uZU51bSAoZSkge1xyXG4gICAgICAgIHRoaXMuZm9ybURhdGEucGhvbmVOdW0gPSBlLmRldGFpbC52YWx1ZVxyXG4gICAgICB9LFxyXG4gICAgICBnZXRDb250ZW50KGUpIHsgLy/ojrflvpflhajpg6jlhoXlrrlcclxuICAgICAgICB0aGlzLmZvcm1EYXRhLmNvbnRlbnQgPSBlLmRldGFpbC52YWx1ZTtcclxuICAgICAgICB0aGlzLiRhcHBseSgpXHJcbiAgICAgIH0sXHJcbiAgICAgIGdldGxlYWRlcihlKSB7IC8v6I635b6X6aKG5a+8XHJcbiAgICAgICAgdGhpcy5mb3JtRGF0YS5sZWFkZXIgPSBlLmRldGFpbC52YWx1ZTtcclxuICAgICAgICB0aGlzLiRhcHBseSgpXHJcbiAgICAgIH0sXHJcbiAgICAgIGdldGNvbXBhbnlOYW1lIChlKSB7XHJcbiAgICAgICAgdGhpcy5mb3JtRGF0YS5jb21wYW55TmFtZSA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICAgIHRoaXMuJGFwcGx5KClcclxuICAgICAgfSxcclxuICAgICAgZ2V0YWRkcmVzcyhlKSB7IC8v6I635b6X6aKG5a+8XHJcbiAgICAgICAgdGhpcy5mb3JtRGF0YS5hZGRyZXNzID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgdGhpcy4kYXBwbHkoKVxyXG4gICAgICB9LFxyXG4gICAgICBnZXR1c2VyQ291bnQoZSkgeyAvL+iOt+W+l+mihuWvvFxyXG4gICAgICAgIHRoaXMuZm9ybURhdGEudXNlckNhcGFjaXR5ID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgdGhpcy4kYXBwbHkoKVxyXG4gICAgICB9LFxyXG4gICAgICBzdWJtaXQgKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpc1xyXG4gICAgICAgICBpZiAoIXNlbGYuZm9ybURhdGEubW9iaWxlIHx8IHNlbGYuZm9ybURhdGEubW9iaWxlID09ICcnKSB7XHJcbiAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6ICfmiYvmnLrlj7flv4XloasnLFxyXG4gICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSAgZWxzZSBpZiAodGhpcy5pc1Bob25lKHRoaXMuZm9ybURhdGEubW9iaWxlKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxyXG4gICAgICAgICAgY29udGVudDogJ+aJi+acuuWPt+agvOW8j+S4jeato+ehricsXHJcbiAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9IGVsc2UgaWYgKCFzZWxmLmZvcm1EYXRhLmNvZGUgfHwgc2VsZi5mb3JtRGF0YS5jb2RlID09ICcnKSB7XHJcbiAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6ICfpqozor4HnoIHlv4XloasnLFxyXG4gICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZm9ybURhdGEucm9sZSA9IHRoaXMucm9sZVxyXG4gICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgnd3gvdXBkYXRlVXNlckFwaS5qc29uJywgdGhpcy5mb3JtRGF0YSlcclxuICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICBzZWxmLmZvcm1EYXRhID0ge31cclxuICAgICAgICAgIC8v6L+U5Zue5LiK5LiA6aG1XHJcbiAgICAgICAgICB3eC5uYXZpZ2F0ZUJhY2soe1xyXG4gICAgICAgICAgICBkZWx0YTogMVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBzZWxmLiRhcHBseSgpO3NzXHJcbiAgICAgICAgfSkgXHJcbiAgICAgIH0sXHJcbiAgICAgIHNhdmUoKSB7IC8v5L+d5a2YXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuZm9ybURhdGEubW9iaWxlID0gdGhpcy5mb3JtRGF0YS5waG9uZU51bVxyXG4gICAgICAgIGlmICghc2VsZi5mb3JtRGF0YS5uYW1lIHx8IHNlbGYuZm9ybURhdGEubmFtZSA9PSAnJykge1xyXG4gICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxyXG4gICAgICAgICAgICBjb250ZW50OiAn5aeT5ZCN5b+F5aGrJyxcclxuICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc2VsZi5yb2xlID09PSAnMycgJiYgKCFzZWxmLmZvcm1EYXRhLmNvbXBhbnlOYW1lIHx8IHNlbGYuZm9ybURhdGEuY29tcGFueU5hbWUgPT0gJycpKSB7XHJcbiAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6ICflhazlj7jlkI3np7Dlv4XloasnLFxyXG4gICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIGlmICghc2VsZi5mb3JtRGF0YS5tb2JpbGUgfHwgc2VsZi5mb3JtRGF0YS5tb2JpbGUgPT0gJycpIHtcclxuICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcclxuICAgICAgICAgICAgY29udGVudDogJ+aJi+acuuWPt+W/heWhqycsXHJcbiAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9ICBlbHNlIGlmICh0aGlzLmlzUGhvbmUodGhpcy5mb3JtRGF0YS5tb2JpbGUpID09PSBmYWxzZSkge1xyXG4gICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgICAgICBjb250ZW50OiAn5omL5py65Y+35qC85byP5LiN5q2j56GuJyxcclxuICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH0gZWxzZSBpZiAoIXNlbGYuZm9ybURhdGEuY29kZSB8fCBzZWxmLmZvcm1EYXRhLmNvZGUgPT0gJycpIHtcclxuICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcclxuICAgICAgICAgICAgY29udGVudDogJ+mqjOivgeeggeW/heWhqycsXHJcbiAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9ICBlbHNlIGlmIChzZWxmLnJvbGUgPT09ICczJyAmJiAoIXNlbGYuZm9ybURhdGEuZGVhbGVyTGV2ZWwgfHwgc2VsZi5mb3JtRGF0YS5kZWFsZXJMZXZlbCA9PSAnJykpIHtcclxuICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcclxuICAgICAgICAgICAgY29udGVudDogJ+etiee6p+W/hemAiScsXHJcbiAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9ICBlbHNlIGlmICghc2VsZi5hZGRyZXNzIHx8IHNlbGYuYWRkcmVzcyA9PSAnJyB8fCAgc2VsZi5hZGRyZXNzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxyXG4gICAgICAgICAgICBjb250ZW50OiAn6K+36YCJ5oup5Zyw5Z2AJyxcclxuICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc2VsZi5yb2xlID09PSAnMScgICYmICghc2VsZi5mb3JtRGF0YS5hZGRyZXNzIHx8IHNlbGYuZm9ybURhdGEuYWRkcmVzcyA9PSAnJykpIHtcclxuICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcclxuICAgICAgICAgICAgY29udGVudDogJ+ivpue7huWcsOWdgOW/heWhqycsXHJcbiAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNlbGYucm9sZSA9PT0gJzEnKSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ29vZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ29vZHNbaV0uYXJlYSA9PT0gJycgfHwgdGhpcy5nb29kcy5jcm9wc0NhdGVnb3J5ID09PSAnJykge1xyXG4gICAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgICAgICAgICAgICBjb250ZW50OiAn56eN5qSN5L2c54mp5b+F5aGrJyxcclxuICAgICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ29vZHMgPSB0aGlzLmdvb2RzLm1hcChpdGVtID0+IHtcclxuICAgICAgICAgIGNvbnN0IG9iaiA9IGl0ZW1cclxuICAgICAgICAgIG9iai5jcm9wc0NhdGVnb3J5ID0gb2JqLmNyb3BzQ2F0ZWdvcnkxICsgJywnICsgb2JqLmNyb3BzQ2F0ZWdvcnkyXHJcbiAgICAgICAgICByZXR1cm4gb2JqXHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLmZvcm1EYXRhLmNyb3BzQ2F0ZWdvcnlBbmRBcmVhID0gdGhpcy5nb29kcztcclxuICAgICAgICAgdGhpcy5mb3JtRGF0YS5wcm92aW5jZU5hbWUgPSB0aGlzLmFkZHJlc3NbMF1cclxuICAgICAgICAgdGhpcy5mb3JtRGF0YS5jaXR5TmFtZSA9IHRoaXMuYWRkcmVzc1sxXVxyXG4gICAgICAgICB0aGlzLmZvcm1EYXRhLmRpc3RyaWN0TmFtZSA9IHRoaXMuYWRkcmVzc1syXVxyXG4gICAgICAgICB0aGlzLmZvcm1EYXRhLnJvbGUgPSB0aGlzLnJvbGVcclxuICAgICAgICBpZiAoc2VsZi50eXBlID09ICdlZGl0Jykge1xyXG4gICAgICAgICAgIHRoaXMuZm9ybURhdGEudXNlciA9IG51bGxcclxuICAgICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgnbWVldGluZy93ZWNoYXQvdXBkYXRlTWVldGluZ0FwaS5qc29uJywgdGhpcy5mb3JtRGF0YSlcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgIHNlbGYuZm9ybURhdGEgPSB7fVxyXG4gICAgICAgICAgICAgIC8v6L+U5Zue5LiK5LiA6aG1XHJcbiAgICAgICAgICAgICAgd3gubmF2aWdhdGVCYWNrKHtcclxuICAgICAgICAgICAgICAgIGRlbHRhOiAxXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3d4L3VwZGF0ZVVzZXJBcGkuanNvbicsIHRoaXMuZm9ybURhdGEpXHJcbiAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybURhdGEgPSB7fVxyXG4gICAgICAgICAgICAvL+i/lOWbnuS4iuS4gOmhtVxyXG4gICAgICAgICAgICB3eC5uYXZpZ2F0ZUJhY2soe1xyXG4gICAgICAgICAgICAgIGRlbHRhOiAxXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICB9XHJcbiAgICBvblNob3cgKCkge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5jbHNUaW1lb3V0KVxyXG4gICAgfVxyXG4gICAgLy8gZW5kRnVuICgpIHtcclxuICAgIC8vICAgaWYgKHRoaXMuZm9ybURhdGEuZW5kRGF0ZTEpIHRoaXMudGltZXMgPSB0aGlzLmZvcm1EYXRhLmVuZERhdGUxXHJcbiAgICAvLyB9XHJcbiAgICAvLyBzdGFydERhdGUgKCkge1xyXG4gICAgLy8gICBpZiAodGhpcy5mb3JtRGF0YS5zdGFydERhdGUxKSB0aGlzLnRpbWVzID0gdGhpcy5mb3JtRGF0YS5zdGFydERhdGUxXHJcbiAgICAvLyB9XHJcbiAgICAgIHdoZW5BcHBSZWFkeVNob3coKSB7XHJcbiAgICAgIFxyXG4gICAgICB9XHJcbiAgICBvbkxvYWQob3B0aW9ucykge1xyXG4gICAgICBjb25zb2xlLmxvZygxMTEpXHJcbiAgICB0aGlzLmNvZGVOYW1lID0gJ+iOt+WPlumqjOivgeeggScsXHJcbiAgICB0aGlzLmxpbWl0VGltZSA9IDYwXHJcbiAgICB0aGlzLmRpc2FibGVkID0gdHJ1ZVxyXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuY2xzVGltZW91dClcclxuICAgIHZhciB0aGF0ID0gdGhpc1xyXG4gICAgaWYgKG9wdGlvbnMucm9sZSkge1xyXG4gICAgICAgIHRoaXMucm9sZSA9IG9wdGlvbnMucm9sZVxyXG4gICAgICB3eC5nZXRTdG9yYWdlKHtcclxuICAgICAga2V5OiAndXNlckluZm8nLFxyXG4gICAgICBzdWNjZXNzIChyZXMpIHtcclxuICAgICAgICBjb25zdCAgZGF0YSA9IEpTT04ucGFyc2UocmVzLmRhdGEpXHJcbiAgICAgICAgICB0aGF0LmZvcm1EYXRhID0gZGF0YVxyXG4gICAgICAgICAgdGhhdC5mb3JtRGF0YS5uYW1lID0gZGF0YS51c2VyTmFtZVxyXG4gICAgICAgICAgdGhhdC5mb3JtRGF0YS5waG9uZU51bSA9IGRhdGEubW9iaWxlXHJcbiAgICAgICAgICB0aGF0Lmdvb2RzID10aGF0LmZvcm1EYXRhLmNyb3BzQ2F0ZWdvcnlBbmRBcmVhID90aGF0LmZvcm1EYXRhLmNyb3BzQ2F0ZWdvcnlBbmRBcmVhIDogW3thcmVhOiAnJywgY3JvcHNDYXRlZ29yeTogJyd9XVxyXG4gICAgICAgICAgICBpZiAoIXRoYXQuZm9ybURhdGEubGF0aXR1ZGUpIHtcclxuICAgICAgICAgICAgd3guZ2V0TG9jYXRpb24oe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2djajAyJyxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKVxyXG4gICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgdGhhdC5mb3JtRGF0YS5sYXRpdHVkZSA9IHJlcy5sYXRpdHVkZVxyXG4gICAgICAgICAgICAgICAgICB0aGF0LmZvcm1EYXRhLmxvbmdpdHVkZSA9IHJlcy5sb25naXR1ZGVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoYXQuYWRkcmVzcyA9ICF0aGF0LmZvcm1EYXRhLnByb3ZpbmNlTmFtZSA/IFtdIDogW3RoYXQuZm9ybURhdGEucHJvdmluY2VOYW1lLCB0aGF0LmZvcm1EYXRhLmNpdHlOYW1lLCB0aGF0LmZvcm1EYXRhLmRpc3RyaWN0TmFtZV1cclxuICAgICAgICAgIHRoYXQuJGFwcGx5KClcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVyblxyXG4gICAgfVxyXG4gIFxyXG4gICAgICAvLyDojrflj5bnu4/nuqzluqZcclxuICAgICAgdGhpcy50aW1lcyA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKSArICctJyArIHRoaXMudGltZXNGdW4obmV3IERhdGUoKS5nZXRNb250aCgpICsgMSkgKyAnLScgKyB0aGlzLnRpbWVzRnVuKG5ldyBEYXRlKCkuZ2V0RGF0ZSgpKSArICcgJyArICcxMidcclxuICAgICAgdmFyIHRoYXQgPSB0aGlzXHJcbiAgICAgIC8vIGlmIChvcHRpb25zLml0ZW0pIHtcclxuICAgICAgLy8gICB3eC5zZXROYXZpZ2F0aW9uQmFyVGl0bGUoe1xyXG4gICAgICAvLyAgICAgdGl0bGU6ICfnvJbovpHkvJrorq4nIFxyXG4gICAgICAvLyAgIH0pXHJcbiAgICAgIC8vICAgdGhhdC50eXBlID0gJ2VkaXQnXHJcbiAgICAgIC8vICAgdGhpcy5mb3JtRGF0YSA9IEpTT04ucGFyc2Uob3B0aW9ucy5pdGVtKVxyXG4gICAgICAvLyAgIHRoaXMuZm9ybURhdGEuc3RhcnREYXRlMSA9IHRoaXMuZm9ybURhdGEuc3RhcnREYXRlMS5zcGxpdCgnICcpWzBdICsgJyAnICsgdGhpcy5mb3JtRGF0YS5zdGFydERhdGUxLnNwbGl0KCcgJylbMV0uc3BsaXQoJzonKVswXVxyXG4gICAgICAvLyAgIHRoaXMuZm9ybURhdGEuZW5kRGF0ZTEgPSB0aGlzLmZvcm1EYXRhLmVuZERhdGUxLnNwbGl0KCcgJylbMF0gKyAnICcgKyB0aGlzLmZvcm1EYXRhLnN0YXJ0RGF0ZTEuc3BsaXQoJyAnKVsxXS5zcGxpdCgnOicpWzBdXHJcbiAgICAgIC8vICAgdGhpcy50aW1lcyA9IHRoaXMuZm9ybURhdGEuc3RhcnREYXRlMVxyXG4gICAgICAvLyB9XHJcblxyXG4gICAgICBcclxuICAgICAgdGhpcy5zZXR0aW1lc0RhdGUoKVxyXG4gICAgICAvLyB0aGlzLm11bHRpQXJyYXkgPSBbdGhpcy55ZWFycywgdGhpcy5tb250aHMsIHRoaXMuZGF5cywgdGhpcy5ob3VycywgdGhpcy5taW51dGVzLCB0aGlzLnNlY29uZF1cclxuICAgICAgdGhpcy5tdWx0aUFycmF5ID0gW3RoaXMueWVhcnMsIHRoaXMubW9udGhzLCB0aGlzLmRheXMsIHRoaXMuaG91cnMsIHRoaXMubWludXRlc11cclxuICAgICAgLy8gdGhpcy5tdWx0aUFycmF5ID0gW3RoaXMueWVhcnMsIHRoaXMubW9udGhzLCB0aGlzLmRheXMsIHRoaXMuaG91cnNdXHJcbiAgICAgIC8vIHRoaXMubXVsdGlBcnJheSA9IFt0aGlzLnllYXJzLCB0aGlzLm1vbnRocywgdGhpcy5kYXlzXVxyXG4gICAgICB0aGlzLmNob29zZV95ZWFyID0gdGhpcy5tdWx0aUFycmF5WzBdWzBdXHJcbiAgICAgIGlmICghdGhpcy50aW1lcykge1xyXG4gICAgICAgIC8vIOm7mOiupOaYvuekuuW9k+WJjeaXpeacn1xyXG4gICAgICAgIGxldCBkYXRlID0gbmV3IERhdGUoKVxyXG4gICAgICAgIGxldCBjdXJyZW50TW9udGggPSBkYXRlLmdldE1vbnRoKClcclxuICAgICAgICBsZXQgY3VycmVudERheSA9IGRhdGUuZ2V0RGF0ZSgpIC0gMVxyXG4gICAgICAgIC8vIGNvbnNvbGUuaW5mbygn5pyIJywgZGF0ZS5nZXRNb250aCgpKVxyXG4gICAgICAgIC8vIGNvbnNvbGUuaW5mbygn5pelJywgZGF0ZS5nZXREYXRlKCkpXHJcbiAgICAgICAgdGhpcy5tdWx0aUFycmF5WzJdID0gdGhpcy5zZXREYXlzKHRoaXMuY2hvb3NlX3llYXIsIGN1cnJlbnRNb250aCArIDEpXHJcbiAgICAgICAgdGhpcy5tdWx0aUluZGV4ID0gWzAsIGN1cnJlbnRNb250aCwgY3VycmVudERheSwgMTAsIDBdXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5zZXREZWZhdWx0dGltZXMoKVxyXG4gICAgICB9XHJcbiAgICAgIC8vIHd4LmdldFN0b3JhZ2Uoe1xyXG4gICAgICAvLyAgIGtleTogJ2l0ZW0nLFxyXG4gICAgICAvLyAgIHN1Y2Nlc3MgKHJlcykge1xyXG4gICAgICAvLyAgICAgY29uc29sZS5sb2cocmVzLmRhdGEpXHJcbiAgICAgIC8vICAgICBzZWxmLmZvcm1EYXRhID0gcmVzLmRhdGFcclxuICAgICAgLy8gICB9XHJcbiAgICAgIC8vIH0pXHJcblxyXG4gICAgICB0aGlzLiRhcHBseSgpXHJcbiAgICB9XHJcbiAgICAvLyB3aGVuQXBwUmVhZHlTaG93KCkge1xyXG4gICAgLy8gICAvLyDmr4/mrKHpg73liLfmlrBcclxuICAgIC8vICAgdGhpcy4kYXBwbHkoKVxyXG4gICAgLy8gfVxyXG4gICAgY2hhbmdlQ3VycmVudERhdGEob3B0aW9uKSB7IC8v5pS55Y+Y5b2T5YmN5pWw5o2uXHJcbiAgICAgIC8v5YWo5Zu95pWw5o2uXHJcbiAgICAgIHZhciBuYXRpb25hbERhdGEgPSB0aGlzLm5hdGlvbmFsRGF0YTtcclxuICAgICAgLy/miYDmnInnnIFcclxuICAgICAgaWYgKHRoaXMucHJvdmluY2VzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgdmFyIHByb3ZpbmNlcyA9IHRoaXMuZGF0YS5wcm92aW5jZXM7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYXRpb25hbERhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIHByb3ZpbmNlcy5wdXNoKHtcclxuICAgICAgICAgICAgaW5kZXg6IGksXHJcbiAgICAgICAgICAgIHByb3ZpbmNlOiBuYXRpb25hbERhdGFbaV0uem9uZV9uYW1lXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wcm92aW5jZXMgPSBwcm92aW5jZXNcclxuICAgICAgfVxyXG4gICAgICAvL+W9k+WJjeaJgOacieW4glxyXG4gICAgICBpZiAob3B0aW9uLnR5cGUgPT0gJ2NpdHknIHx8IG9wdGlvbi50eXBlID09ICdhbGwnKSB7XHJcbiAgICAgICAgLy/muIXnqbrluILmlbDmja5cclxuICAgICAgICB0aGlzLmNpdGllcyA9IFtdXHJcbiAgICAgICAgdmFyIGNpdGllcyA9IHRoaXMuY2l0aWVzO1xyXG4gICAgICAgIHZhciBjdXJyZW50Q2l0aWVzID0gbmF0aW9uYWxEYXRhW29wdGlvbi5jdXJyZW50UHJvdmluY2VJbmRleF0uY2l0eXM7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW50Q2l0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBjaXRpZXMucHVzaCh7XHJcbiAgICAgICAgICAgIGluZGV4OiBpLFxyXG4gICAgICAgICAgICBjaXR5OiBjdXJyZW50Q2l0aWVzW2ldLnpvbmVfbmFtZVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2l0aWVzID0gY2l0aWVzO1xyXG4gICAgICB9XHJcbiAgICAgIC8v5b2T5YmN5omA5pyJ5Yy6XHJcbiAgICAgIC8v5riF56m6IOWMuiDmlbDmja5cclxuICAgICAgdGhpcy5kaXN0cmljdHMgPSBbXTtcclxuICAgICAgdmFyIGRpc3RyaWN0cyA9IHRoaXMuZGlzdHJpY3RzO1xyXG4gICAgICB2YXIgY3VycmVudERpc3RyaWN0cyA9IG5hdGlvbmFsRGF0YVtvcHRpb24uY3VycmVudFByb3ZpbmNlSW5kZXhdLmNpdHlzW29wdGlvbi5jdXJyZW50Q2l0eUluZGV4XS5kaXN0cmljdHM7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VycmVudERpc3RyaWN0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChpICE9IDApIHtcclxuICAgICAgICAgIGRpc3RyaWN0cy5wdXNoKGN1cnJlbnREaXN0cmljdHNbaV0uem9uZV9uYW1lKTtcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuZGlzdHJpY3RzID0gZGlzdHJpY3RzO1xyXG4gICAgICB0aGlzLiRhcHBseSgpXHJcbiAgICB9XHJcbiAgfVxyXG4iXX0=