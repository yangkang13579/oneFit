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

var CreateTest = function (_wepy$page) {
  _inherits(CreateTest, _wepy$page);

  function CreateTest() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, CreateTest);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CreateTest.__proto__ || Object.getPrototypeOf(CreateTest)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
      navigationBarTitleText: '创建实验',
      navigationBarBackgroundColor: '#fff'
    }, _this.data = {
      showToast: false,
      error: '',
      one: ["柑橘", "水稻", "小麦", "玉米", "马铃薯", "棉花", "大豆", "花生", "果蔬类", "苹果", "其他作物"],
      two: [["柑类", "橘类", "杂柑类", "橙类", "柚类", "柠檬"], ["旱直播稻", "水直播稻", "人工抛秧", "机械插秧"], ["春小麦", "冬小麦"], ["夏玉米", "春玉米"], ["春季薯", "夏季薯", "冬季薯"], ["新陆早系列", "新陆中系列", "中字号棉花品种", "鲁棉系列品种", "冀棉系列品种"], ["春大豆", "夏大豆"], ["春花生", "夏花生"], ["番茄", "辣椒", "辣椒", "甜椒", "茄子", "黄瓜", "豇豆", "菜豆", "甘蓝", "冬瓜", "南瓜", "甜瓜", "西瓜", "葱", "姜", "蒜"], ["早熟品种", "中熟品种", "晚熟品种"], ["梨树", "桃树", "荔枝", "樱桃", "芒果", "花卉", "油菜", "茶叶", "葡萄", "烟草"]],
      classifyAry: ['探究型', '验证型'],
      testAry: ['除草剂', '杀虫/螨剂', '杀菌剂', '植物营养', '种衣剂', '助剂及植物生长调节剂'],
      goodsAry: [],
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
      id: null,
      address: []
    }, _this.methods = {
      // 刪除
      delFun: function delFun() {
        var that = this;
        wx.showModal({
          title: '提示',
          content: '是否确认删除该实验?',
          success: function success() {
            that.fetchDataPromise('wx/experiment/deleteExperimentApi.json', { id: that.formData.id }).then(function (data) {
              wx.showToast({
                title: '删除成功'
              });
              setTimeout(function () {
                wx.navigateBack({
                  delta: 2
                });
                that.$apply();
              }, 1000);
            });
          }
        });
      },
      getGoods2: function getGoods2(e) {
        var value = e.detail.value;
        this.formData.goods2 = this.goodsAry[value];
      },

      getGoods: function getGoods(e) {
        console.log(e);
        var value = e.detail.value;
        this.goodsAry = this.two[value];
        this.formData.goods1 = this.one[value];
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
                  that.formData.location = data.address;
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
        this.formData.classify = e.detail.value;
      },
      changetestAry: function changetestAry(e) {
        this.formData.classify2 = e.detail.value;
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
        this.formData.startDate = this.PickerChange(e);
      },
      bindEndChange: function bindEndChange(e) {
        this.formData.endDate = this.PickerChange(e);
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
      getleader: function getleader(e) {
        this.formData.leader = e.detail.value;
        this.$apply();
      },
      getmobile: function getmobile(e) {
        this.formData.mobile = e.detail.value;
        this.$apply();
      },
      getpurpose: function getpurpose(e) {
        this.formData.purpose = e.detail.value;
        this.$apply();
      },
      getcompareProduct: function getcompareProduct(e) {
        //获得全部内容
        this.formData.compareProduct = e.detail.value;
        this.$apply();
      },
      getRemark: function getRemark(e) {
        this.formData.remark = e.detail.value;
        this.$apply();
      },
      getproductName: function getproductName(e) {
        this.formData.productName = e.detail.value;
        this.$apply();
      },
      getarea: function getarea(e) {
        this.formData.area = e.detail.value;
        this.$apply();
      },
      getResult: function getResult(e) {
        this.formData.result = e.detail.value;
        this.$apply();
      },
      save: function save() {
        //保存
        var self = this;
        console.log(this.formData);
        if (!self.formData.name || self.formData.name == '') {
          wx.showModal({
            title: '提示',
            content: '实验名称必填',
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
        } else if (!self.formData.mobile || self.formData.mobile == '') {
          wx.showModal({
            title: '提示',
            content: '手机号必填',
            showCancel: false
          });
          return;
        } else if (this.isPhone(this.formData.mobile) === false) {
          wx.showModal({
            title: "提示",
            content: "手机号格式不正确",
            showCancel: false
          });
        } else if (!self.formData.purpose || self.formData.purpose == '') {
          wx.showModal({
            title: '提示',
            content: '实验目标必填',
            showCancel: false
          });
          return;
        } else if (!self.formData.classify || self.formData.classify == '') {
          wx.showModal({
            title: '提示',
            content: '实验类型必填',
            showCancel: false
          });
          return;
        } else if (!self.formData.startDate || self.formData.startDate == '') {
          wx.showModal({
            title: '提示',
            content: '实验起始日期必填',
            showCancel: false
          });
          return;
        } else if (!self.formData.endDate || self.formData.endDate == '') {
          wx.showModal({
            title: '提示',
            content: '实验起始日期必填',
            showCancel: false
          });
          return;
        } else if (new Date(self.formData.endDate) < new Date(self.formData.startDate)) {
          wx.showModal({
            title: '提示',
            content: '实验起始日期不能大于结束时期',
            showCancel: false
          });
          return;
        } else if (!self.formData.classify2 || self.formData.classify2 == '') {
          wx.showModal({
            title: '提示',
            content: '产品类型必填',
            showCancel: false
          });
          return;
        } else if (!self.formData.compareProduct || self.formData.compareProduct == '') {
          wx.showModal({
            title: '提示',
            content: '对标产品必填',
            showCancel: false
          });
          return;
        } else if (!self.formData.location || self.formData.location == '') {
          wx.showModal({
            title: '提示',
            content: '实验位置必填',
            showCancel: false
          });
          return;
        } else if (!self.formData.area || self.formData.area == '') {
          wx.showModal({
            title: '提示',
            content: '实验面积必填',
            showCancel: false
          });
          return;
        } else if (!self.formData.goods1 || self.formData.goods1 == '' || !self.formData.goods2 || self.formData.goods2 == '') {
          wx.showModal({
            title: '提示',
            content: '产品名称必填',
            showCancel: false
          });
          return;
        }
        this.formData.type = this.classifyAry[this.formData.classify];
        this.formData.productType = this.testAry[this.formData.classify2];
        this.formData.productName = this.formData.goods1 + ',' + this.formData.goods2;
        //  this.formData.provinceName = this.address[0]
        //  this.formData.cityName = this.address[1]
        //  this.formData.districtName = this.address[2]
        if (self.formData.id || self.formData.id === 0) {
          this.formData.user = null;
          this.fetchDataPromise('wx/experiment/updateExperimentApi.json', this.formData).then(function (data) {
            self.formData = {};
            //返回上上一页
            wx.showToast({
              title: '編輯成功'
            });
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              });
              self.$apply();
            }, 1000);
          });
        } else {
          this.fetchDataPromise('wx/experiment/createExperimentApi.json', this.formData).then(function (data) {
            self.formData = {};
            //返回上一页
            wx.showToast({
              title: '新增成功'
            });
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              });
              self.$apply();
            }, 1000);
          });
        }
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(CreateTest, [{
    key: 'timesFun',

    // 差一位补位
    value: function timesFun(t) {
      if (t < 10) return '0' + t;else return t;
    }
  }, {
    key: 'isPhone',
    value: function isPhone(str) {
      var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      return reg.test(str);
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
    }
    // 获取时间日期

  }, {
    key: 'PickerChange',
    value: function PickerChange(e) {
      this.multiIndex = e.detail.value;
      var index = this.multiIndex;
      var year = this.multiArray[0][index[0]];
      var month = this.multiArray[1][index[1]];
      var day = this.multiArray[2][index[2]];
      this.times = year + '-' + month + '-' + day;
      this.$apply();
      return this.times;
    }
  }, {
    key: 'toast',
    value: function toast(error) {
      this.showToast = true;
      this.error = error;
      var that = this;
      setTimeout(function () {
        that.showToast = false;
      }, 2000);
    }
  }, {
    key: 'isType',
    value: function isType(ary, type) {
      for (var i = 0; i < ary.length; i++) {
        var item = ary[i];
        if (item === type) {
          return i;
        }
      }
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
      var that = this;
      if (options.item) {
        this.formData = JSON.parse(options.item);
        wx.setNavigationBarTitle({
          title: '编辑实验'
        });
        if (that.formData.startDate) that.formData.startDate = that.formData.startDate.split('T')[0];
        if (that.formData.endDate) that.formData.endDate = that.formData.endDate.split('T')[0];
        that.formData.classify = that.isType(that.classifyAry, that.formData.type) + '';
        that.formData.classify2 = that.isType(that.testAry, that.formData.productType) + '';
        this.formData.goods1 = that.formData.productName.split(',')[0];
        this.formData.goods2 = that.formData.productName.split(',')[1];
        console.log(this.formData.goodsindex1);
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
      this.multiArray = [this.years, this.months, this.days];
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
  }]);

  return CreateTest;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(CreateTest , 'pages/createTest'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNyZWF0ZVRlc3QuanMiXSwibmFtZXMiOlsiQ3JlYXRlVGVzdCIsIm1peGlucyIsIlBhZ2VNaXhpbiIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiZGF0YSIsInNob3dUb2FzdCIsImVycm9yIiwib25lIiwidHdvIiwiY2xhc3NpZnlBcnkiLCJ0ZXN0QXJ5IiwiZ29vZHNBcnkiLCJ0eXBlIiwiZm9ybURhdGEiLCJkYXRlIiwidGltZXMiLCJ5ZWFycyIsIm1vbnRocyIsImRheXMiLCJob3VycyIsIm1pbnV0ZXMiLCJzZWNvbmQiLCJtdWx0aUFycmF5IiwibXVsdGlJbmRleCIsImNob29zZV95ZWFyIiwieWVhckluZGV4IiwiaWQiLCJhZGRyZXNzIiwibWV0aG9kcyIsImRlbEZ1biIsInRoYXQiLCJ3eCIsInNob3dNb2RhbCIsInRpdGxlIiwiY29udGVudCIsInN1Y2Nlc3MiLCJmZXRjaERhdGFQcm9taXNlIiwidGhlbiIsInNldFRpbWVvdXQiLCJuYXZpZ2F0ZUJhY2siLCJkZWx0YSIsIiRhcHBseSIsImdldEdvb2RzMiIsImUiLCJ2YWx1ZSIsImRldGFpbCIsImdvb2RzMiIsImdldEdvb2RzIiwiY29uc29sZSIsImxvZyIsImdvb2RzMSIsImNob29zZUxvY2F0aW9uIiwiZ2V0TG9jYXRpb24iLCJyZXMiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsInJlc3QiLCJwcm92aW5jZU5hbWUiLCJjaXR5TmFtZSIsImRpc3RyaWN0TmFtZSIsImxvY2F0aW9uIiwiYmluZFJlZ2lvbkNoYW5nZSIsImNoYW5nZUNsYXNzaWZ5IiwiY2xhc3NpZnkiLCJjaGFuZ2V0ZXN0QXJ5IiwiY2xhc3NpZnkyIiwiYmluZE11bHRpUGlja2VyQ29sdW1uQ2hhbmdlIiwiY29sdW1uIiwibnVtIiwicGFyc2VJbnQiLCJzZXREYXlzIiwiYmluZFN0YXJ0Q2hhbmdlIiwic3RhcnREYXRlIiwiUGlja2VyQ2hhbmdlIiwiYmluZEVuZENoYW5nZSIsImVuZERhdGUiLCJnZXR0aW1lcyIsInNob3dBZGRyQ2hvc2UiLCJpc1Nob3dBZGRyZXNzQ2hvc2UiLCJjYW5jZWwiLCJmaW5pc2giLCJnZXROYW1lIiwibmFtZSIsImdldGxlYWRlciIsImxlYWRlciIsImdldG1vYmlsZSIsIm1vYmlsZSIsImdldHB1cnBvc2UiLCJwdXJwb3NlIiwiZ2V0Y29tcGFyZVByb2R1Y3QiLCJjb21wYXJlUHJvZHVjdCIsImdldFJlbWFyayIsInJlbWFyayIsImdldHByb2R1Y3ROYW1lIiwicHJvZHVjdE5hbWUiLCJnZXRhcmVhIiwiYXJlYSIsImdldFJlc3VsdCIsInJlc3VsdCIsInNhdmUiLCJzZWxmIiwic2hvd0NhbmNlbCIsImlzUGhvbmUiLCJEYXRlIiwicHJvZHVjdFR5cGUiLCJ1c2VyIiwidCIsInN0ciIsInJlZyIsInRlc3QiLCJfeWVhckluZGV4IiwiaW5mbyIsIl9kZWZhdWx0WWVhciIsInNwbGl0IiwiaSIsImdldEZ1bGxZZWFyIiwicHVzaCIsInNlbGVjdFllYXIiLCJzZWxlY3RNb250aCIsInRlbXAiLCJ5ZWFyIiwiYWxsRGF0ZUxpc3QiLCJkYXRlTGlzdCIsIm1vbnRoIiwiZGF5IiwidGltZXNMaXN0IiwiaW5kZXgiLCJhcnkiLCJsZW5ndGgiLCJpdGVtIiwib3B0aW9ucyIsIkpTT04iLCJwYXJzZSIsInNldE5hdmlnYXRpb25CYXJUaXRsZSIsImlzVHlwZSIsImdvb2RzaW5kZXgxIiwiZmFpbCIsInNldHRpbWVzRGF0ZSIsImN1cnJlbnRNb250aCIsImdldE1vbnRoIiwiY3VycmVudERheSIsImdldERhdGUiLCJzZXREZWZhdWx0dGltZXMiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDRTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFDcUJBLFU7Ozs7Ozs7Ozs7Ozs7OzhMQUNuQkMsTSxHQUFTLENBQUNDLGNBQUQsQyxRQUNUQyxNLEdBQVM7QUFDUEMsOEJBQXdCLE1BRGpCO0FBRVBDLG9DQUE4QjtBQUZ2QixL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Q0FBQyxLQUFLUCxLQUFWLEVBQWlCO0FBQ2Y7QUFDQSxZQUFJRCxPQUFPLElBQUl5RixJQUFKLEVBQVg7QUFDQSxZQUFJbUMsZUFBZTVILEtBQUs2SCxRQUFMLEVBQW5CO0FBQ0EsWUFBSUMsYUFBYTlILEtBQUsrSCxPQUFMLEtBQWlCLENBQWxDO0FBQ0E7QUFDQTtBQUNBLGFBQUt2SCxVQUFMLENBQWdCLENBQWhCLElBQXFCLEtBQUtnRCxPQUFMLENBQWEsS0FBSzlDLFdBQWxCLEVBQStCa0gsZUFBZSxDQUE5QyxDQUFyQjtBQUNBLGFBQUtuSCxVQUFMLEdBQWtCLENBQUMsQ0FBRCxFQUFJbUgsWUFBSixFQUFrQkUsVUFBbEIsRUFBOEIsRUFBOUIsRUFBa0MsQ0FBbEMsQ0FBbEI7QUFDRCxPQVRELE1BU087QUFDTCxhQUFLRSxlQUFMO0FBQ0Q7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFLckcsTUFBTDtBQUNEOzs7dUNBQ2tCO0FBQ2pCO0FBQ0EsV0FBS0EsTUFBTDtBQUNEOzs7O0VBcmtCcUNzRyxlQUFLQyxJOztrQkFBeEJsSixVIiwiZmlsZSI6ImNyZWF0ZVRlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbiAgaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XG4gIGltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vbWl4aW5zL3BhZ2UnO1xuICBleHBvcnQgZGVmYXVsdCBjbGFzcyBDcmVhdGVUZXN0IGV4dGVuZHMgd2VweS5wYWdlIHtcbiAgICBtaXhpbnMgPSBbUGFnZU1peGluXTtcbiAgICBjb25maWcgPSB7XG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn5Yib5bu65a6e6aqMJyxcbiAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJ1xuICAgIH07XG4gICAgZGF0YSA9IHtcbiAgICAgIHNob3dUb2FzdDogZmFsc2UsXG4gICAgICBlcnJvcjogJycsXG4gICAgICBvbmU6IFtcbiAgICAgICAgXCLmn5HmqZhcIixcbiAgICAgICAgXCLmsLTnqLtcIixcbiAgICAgICAgXCLlsI/puqZcIixcbiAgICAgICAgXCLnjonnsbNcIixcbiAgICAgICAgXCLpqazpk4Polq9cIixcbiAgICAgICAgXCLmo4noirFcIixcbiAgICAgICAgXCLlpKfosYZcIixcbiAgICAgICAgXCLoirHnlJ9cIixcbiAgICAgICAgXCLmnpzolKznsbtcIixcbiAgICAgICAgXCLoi7nmnpxcIixcbiAgICAgICAgXCLlhbbku5bkvZznialcIlxuICAgICAgXSxcbiAgICAgIHR3bzogW1xuICAgICAgICBbXCLmn5HnsbtcIiwgXCLmqZjnsbtcIiwgXCLmnYLmn5HnsbtcIiwgXCLmqZnnsbtcIiwgXCLmn5rnsbtcIiwgXCLmn6DmqqxcIl0sXG4gICAgICAgIFtcIuaXseebtOaSreeou1wiLCBcIuawtOebtOaSreeou1wiLCBcIuS6uuW3peaKm+enp1wiLCBcIuacuuaisOaPkuenp1wiXSxcbiAgICAgICAgW1wi5pil5bCP6bqmXCIsIFwi5Yas5bCP6bqmXCJdLFxuICAgICAgICBbXCLlpI/njonnsbNcIiwgXCLmmKXnjonnsbNcIl0sXG4gICAgICAgIFtcIuaYpeWto+iWr1wiLCBcIuWkj+Wto+iWr1wiLCBcIuWGrOWto+iWr1wiXSxcbiAgICAgICAgW1xuICAgICAgICAgIFwi5paw6ZmG5pep57O75YiXXCIsXG4gICAgICAgICAgXCLmlrDpmYbkuK3ns7vliJdcIixcbiAgICAgICAgICBcIuS4reWtl+WPt+ajieiKseWTgeenjVwiLFxuICAgICAgICAgIFwi6bKB5qOJ57O75YiX5ZOB56eNXCIsXG4gICAgICAgICAgXCLlhoDmo4nns7vliJflk4Hnp41cIlxuICAgICAgICBdLFxuICAgICAgICBbXCLmmKXlpKfosYZcIiwgXCLlpI/lpKfosYZcIl0sXG4gICAgICAgIFtcIuaYpeiKseeUn1wiLCBcIuWkj+iKseeUn1wiXSxcbiAgICAgICAgW1xuICAgICAgICAgIFwi55Wq6IyEXCIsXG4gICAgICAgICAgXCLovqPmpJJcIixcbiAgICAgICAgICBcIui+o+akklwiLFxuICAgICAgICAgIFwi55Sc5qSSXCIsXG4gICAgICAgICAgXCLojITlrZBcIixcbiAgICAgICAgICBcIum7hOeTnFwiLFxuICAgICAgICAgIFwi6LGH6LGGXCIsXG4gICAgICAgICAgXCLoj5zosYZcIixcbiAgICAgICAgICBcIueUmOiTnVwiLFxuICAgICAgICAgIFwi5Yas55OcXCIsXG4gICAgICAgICAgXCLljZfnk5xcIixcbiAgICAgICAgICBcIueUnOeTnFwiLFxuICAgICAgICAgIFwi6KW/55OcXCIsXG4gICAgICAgICAgXCLokbFcIixcbiAgICAgICAgICBcIuWnnFwiLFxuICAgICAgICAgIFwi6JKcXCJcbiAgICAgICAgXSxcbiAgICAgICAgW1wi5pep54af5ZOB56eNXCIsIFwi5Lit54af5ZOB56eNXCIsIFwi5pma54af5ZOB56eNXCJdLFxuICAgICAgICBbXG4gICAgICAgICAgXCLmoqjmoJFcIixcbiAgICAgICAgICBcIuahg+agkVwiLFxuICAgICAgICAgIFwi6I2U5p6dXCIsXG4gICAgICAgICAgXCLmqLHmoYNcIixcbiAgICAgICAgICBcIuiKkuaenFwiLFxuICAgICAgICAgIFwi6Iqx5Y2JXCIsXG4gICAgICAgICAgXCLmsrnoj5xcIixcbiAgICAgICAgICBcIuiMtuWPtlwiLFxuICAgICAgICAgIFwi6JGh6JCEXCIsXG4gICAgICAgICAgXCLng5/ojYlcIlxuICAgICAgICBdXG4gICAgICBdLFxuICAgICAgY2xhc3NpZnlBcnk6IFtcbiAgICAgICAgJ+aOoueptuWeiycsXG4gICAgICAgICfpqozor4HlnosnXG4gICAgICBdLFxuICAgICAgdGVzdEFyeTogW1xuICAgICAgJ+mZpOiNieWJgicsXG4gICAgICAn5p2A6JmrL+ieqOWJgicsXG4gICAgICAn5p2A6I+M5YmCJyxcbiAgICAgICfmpI3nianokKXlhbsnLFxuICAgICAgJ+enjeiho+WJgicsXG4gICAgICAn5Yqp5YmC5Y+K5qSN54mp55Sf6ZW/6LCD6IqC5YmCJ1xuICAgICAgXSxcbiAgICAgIGdvb2RzQXJ5OiBbXSxcbiAgICAgIHR5cGU6IG51bGwsXG4gICAgICBmb3JtRGF0YToge30sXG4gICAgICBkYXRlOiAnMjAxNi0wOS0wMScsXG4gICAgICB0aW1lczogJzIwMjAtMDctMjkgMTI6NTAnLFxuICAgICAgLy8g5pe26Ze06YCJ5oup5Zmo5Y+C5pWwXG4gICAgICB5ZWFyczogW10sXG4gICAgICBtb250aHM6IFtdLFxuICAgICAgZGF5czogW10sXG4gICAgICBob3VyczogW10sXG4gICAgICBtaW51dGVzOiBbXSxcbiAgICAgIHNlY29uZDogW10sXG4gICAgICBtdWx0aUFycmF5OiBbXSwgLy8g6YCJ5oup6IyD5Zu0XG4gICAgICBtdWx0aUluZGV4OiBbMCwgOSwgMTYsIDEzLCAxN10sIC8vIOmAieS4reWAvOaVsOe7hFxuICAgICAgY2hvb3NlX3llYXI6ICcnLFxuICAgICAgeWVhckluZGV4OiAwLFxuICAgICAgaWQ6IG51bGwsXG4gICAgICBhZGRyZXNzOiBbXVxuICAgIH07XG4gICAgLy8g5beu5LiA5L2N6KGl5L2NXG4gICAgdGltZXNGdW4gKHQpIHtcbiAgICAgIGlmICh0IDwgMTApIHJldHVybiAnMCcgKyB0XG4gICAgICBlbHNlIHJldHVybiB0XG4gICAgfVxuICAgIGlzUGhvbmUoc3RyKSB7XG4gICAgICBjb25zdCByZWcgPSAvXlsxXVszLDQsNSw3LDhdWzAtOV17OX0kLztcbiAgICAgIHJldHVybiByZWcudGVzdChzdHIpO1xuICAgIH1cbiAgICAvLyDorr7nva7liJ3lp4vlgLxcbiAgICBzZXR0aW1lc0RhdGUoKSB7XG4gICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKVxuICAgICAgbGV0IF95ZWFySW5kZXggPSAwXG4gICAgICAvLyDpu5jorqTorr7nva5cbiAgICAgIGNvbnNvbGUuaW5mbyh0aGlzLnRpbWVzKVxuICAgICAgbGV0IF9kZWZhdWx0WWVhciA9IHRoaXMudGltZXMgPyB0aGlzLnRpbWVzLnNwbGl0KCctJylbMF0gOiAwXG4gICAgICAvLyDojrflj5blubRcbiAgICAgIGZvciAobGV0IGkgPSBkYXRlLmdldEZ1bGxZZWFyKCk7IGkgPD0gZGF0ZS5nZXRGdWxsWWVhcigpICsgNTsgaSsrKSB7XG4gICAgICAgIHRoaXMueWVhcnMucHVzaCgnJyArIGkpXG4gICAgICAgIC8vIOm7mOiupOiuvue9rueahOW5tOeahOS9jee9rlxuICAgICAgICBpZiAoX2RlZmF1bHRZZWFyICYmIGkgPT09IHBhcnNlSW50KF9kZWZhdWx0WWVhcikpIHtcbiAgICAgICAgICB0aGlzLnllYXJJbmRleCA9IF95ZWFySW5kZXhcbiAgICAgICAgICB0aGlzLmNob29zZV95ZWFyID0gX2RlZmF1bHRZZWFyXG4gICAgICAgIH1cbiAgICAgICAgX3llYXJJbmRleCA9IF95ZWFySW5kZXggKyAxXG4gICAgICB9XG4gICAgICAvLyDojrflj5bmnIjku71cbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDEyOyBpKyspIHtcbiAgICAgICAgaWYgKGkgPCAxMCkge1xuICAgICAgICAgIGkgPSAnMCcgKyBpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tb250aHMucHVzaCgnJyArIGkpXG4gICAgICB9XG4gICAgICAvLyDojrflj5bml6XmnJ9cbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDMxOyBpKyspIHtcbiAgICAgICAgaWYgKGkgPCAxMCkge1xuICAgICAgICAgIGkgPSAnMCcgKyBpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kYXlzLnB1c2goJycgKyBpKVxuICAgICAgfVxuICAgICAgLy8gLy8g6I635Y+W5bCP5pe2XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI0OyBpKyspIHtcbiAgICAgICAgIGlmIChpIDwgMTApIHtcbiAgICAgICAgICAgaSA9ICcwJyArIGlcbiAgICAgICAgIH1cbiAgICAgICAgIHRoaXMuaG91cnMucHVzaCgnJyArIGkpXG4gICAgICAgfVxuICAgICAgLy8gLy8g6I635Y+W5YiG6ZKfXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDYwOyBpKyspIHtcbiAgICAgICAgaWYgKGkgPCAxMCkge1xuICAgICAgICAgIGkgPSAnMCcgKyBpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5taW51dGVzLnB1c2goJycgKyBpKVxuICAgICAgfVxuICAgICAgLy8gLy8g6I635Y+W56eS5pWwXG4gICAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8IDYwOyBpKyspIHtcbiAgICAgIC8vICAgaWYgKGkgPCAxMCkge1xuICAgICAgLy8gICAgIGkgPSAnMCcgKyBpXG4gICAgICAvLyAgIH1cbiAgICAgIC8vICAgdGhpcy5zZWNvbmQucHVzaCgnJyArIGkpXG4gICAgICAvLyB9XG4gICAgfVxuICAgIC8vIOi/lOWbnuaciOS7veeahOWkqeaVsFxuICAgIHNldERheXMoc2VsZWN0WWVhciwgc2VsZWN0TW9udGgpIHtcbiAgICAgIGxldCBudW0gPSBzZWxlY3RNb250aFxuICAgICAgbGV0IHRlbXAgPSBbXVxuICAgICAgaWYgKG51bSA9PT0gMSB8fCBudW0gPT09IDMgfHwgbnVtID09PSA1IHx8IG51bSA9PT0gNyB8fCBudW0gPT09IDggfHwgbnVtID09PSAxMCB8fCBudW0gPT09IDEyKSB7XG4gICAgICAgICAgLy8g5Yik5patMzHlpKnnmoTmnIjku71cbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMzE7IGkrKykge1xuICAgICAgICAgIGlmIChpIDwgMTApIHtcbiAgICAgICAgICAgIGkgPSAnMCcgKyBpXG4gICAgICAgICAgfVxuICAgICAgICAgIHRlbXAucHVzaCgnJyArIGkpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAobnVtID09PSA0IHx8IG51bSA9PT0gNiB8fCBudW0gPT09IDkgfHwgbnVtID09PSAxMSkgeyAvLyDliKTmlq0zMOWkqeeahOaciOS7vVxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSAzMDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGkgPCAxMCkge1xuICAgICAgICAgICAgaSA9ICcwJyArIGlcbiAgICAgICAgICB9XG4gICAgICAgICAgdGVtcC5wdXNoKCcnICsgaSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChudW0gPT09IDIpIHsgLy8g5Yik5patMuaciOS7veWkqeaVsFxuICAgICAgICBsZXQgeWVhciA9IHBhcnNlSW50KHNlbGVjdFllYXIpXG4gICAgICAgIGNvbnNvbGUubG9nKHllYXIpXG4gICAgICAgIGlmICgoKHllYXIgJSA0MDAgPT09IDApIHx8ICh5ZWFyICUgMTAwICE9PSAwKSkgJiYgKHllYXIgJSA0ID09PSAwKSkge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDI5OyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpIDwgMTApIHtcbiAgICAgICAgICAgICAgaSA9ICcwJyArIGlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlbXAucHVzaCgnJyArIGkpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDI4OyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpIDwgMTApIHtcbiAgICAgICAgICAgICAgaSA9ICcwJyArIGlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlbXAucHVzaCgnJyArIGkpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGVtcFxuICAgIH1cbiAgICAvLyDorr7nva7pu5jorqTlgLwg5qC85byPMjAxOS0wNy0xMCAxMDozMFxuICAgIHNldERlZmF1bHR0aW1lcygpIHtcbiAgICAgIGxldCBhbGxEYXRlTGlzdCA9IHRoaXMudGltZXMuc3BsaXQoJyAnKVxuICAgICAgLy8g5pel5pyfXG4gICAgICBsZXQgZGF0ZUxpc3QgPSBhbGxEYXRlTGlzdFswXS5zcGxpdCgnLScpXG4gICAgICBsZXQgbW9udGggPSBwYXJzZUludChkYXRlTGlzdFsxXSkgLSAxXG4gICAgICBsZXQgZGF5ID0gcGFyc2VJbnQoZGF0ZUxpc3RbMl0pIC0gMVxuICAgICAgLy8g5pe26Ze0XG4gICAgICBsZXQgdGltZXNMaXN0ID0gYWxsRGF0ZUxpc3RbMV0uc3BsaXQoJzonKVxuICAgICAgdGhpcy5tdWx0aUFycmF5WzJdID0gdGhpcy5zZXREYXlzKGRhdGVMaXN0WzBdLCBwYXJzZUludChkYXRlTGlzdFsxXSkpXG4gICAgfVxuICAgIC8vIOiOt+WPluaXtumXtOaXpeacn1xuICAgIFBpY2tlckNoYW5nZShlKSB7XG4gICAgICB0aGlzLm11bHRpSW5kZXggPSBlLmRldGFpbC52YWx1ZVxuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLm11bHRpSW5kZXhcbiAgICAgIGNvbnN0IHllYXIgPSB0aGlzLm11bHRpQXJyYXlbMF1baW5kZXhbMF1dXG4gICAgICBjb25zdCBtb250aCA9IHRoaXMubXVsdGlBcnJheVsxXVtpbmRleFsxXV1cbiAgICAgIGNvbnN0IGRheSA9IHRoaXMubXVsdGlBcnJheVsyXVtpbmRleFsyXV1cbiAgICAgIHRoaXMudGltZXMgPSB5ZWFyICsgJy0nICsgbW9udGggKyAnLScgKyBkYXlcbiAgICAgIHRoaXMuJGFwcGx5KClcbiAgICAgIHJldHVybiB0aGlzLnRpbWVzXG4gICAgfVxuICAgIHRvYXN0KGVycm9yKSB7XG4gICAgICB0aGlzLnNob3dUb2FzdCA9IHRydWU7XG4gICAgICB0aGlzLmVycm9yID0gZXJyb3I7XG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhhdC5zaG93VG9hc3QgPSBmYWxzZTtcbiAgICAgIH0sIDIwMDApO1xuICAgIH1cbiAgICBpc1R5cGUoYXJ5LCB0eXBlKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyeS5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBpdGVtID0gYXJ5W2ldXG4gICAgICAgIGlmIChpdGVtID09PSB0eXBlKSB7XG4gICAgICAgICAgcmV0dXJuIGlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBtZXRob2RzID0ge1xuICAgICAvLyDliKrpmaRcbiAgICAgZGVsRnVuKCkge1xuICAgICAgIHZhciB0aGF0ID0gdGhpc1xuICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcbiAgICAgICAgY29udGVudDogJ+aYr+WQpuehruiupOWIoOmZpOivpeWunumqjD8nLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aGF0LmZldGNoRGF0YVByb21pc2UoJ3d4L2V4cGVyaW1lbnQvZGVsZXRlRXhwZXJpbWVudEFwaS5qc29uJywge2lkOiB0aGF0LmZvcm1EYXRhLmlkfSlcbiAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgIHRpdGxlOiAn5Yig6Zmk5oiQ5YqfJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgd3gubmF2aWdhdGVCYWNrKHtcbiAgICAgICAgICAgICAgICBkZWx0YTogMlxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgdGhhdC4kYXBwbHkoKTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICB9KTtcbiAgICAgfSxcbiAgICAgZ2V0R29vZHMyKGUpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gZS5kZXRhaWwudmFsdWU7XG4gICAgICAgIHRoaXMuZm9ybURhdGEuZ29vZHMyID0gdGhpcy5nb29kc0FyeVt2YWx1ZV1cbiAgICAgfSxcbiAgICAgZ2V0R29vZHM6IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgbGV0IHZhbHVlID0gZS5kZXRhaWwudmFsdWU7XG4gICAgICB0aGlzLmdvb2RzQXJ5ID0gdGhpcy50d29bdmFsdWVdO1xuICAgICAgdGhpcy5mb3JtRGF0YS5nb29kczEgPSB0aGlzLm9uZVt2YWx1ZV1cbiAgICAgfSxcbiAgICAgIGNob29zZUxvY2F0aW9uICgpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgICAgIHd4LmdldExvY2F0aW9uKHtcbiAgICAgICAgdHlwZTogJ3dnczg0JyxcbiAgICAgICAgc3VjY2VzcyAocmVzKSB7XG4gICAgICAgICAgd3guY2hvb3NlTG9jYXRpb24oe1xuICAgICAgICAgICAgbGF0aXR1ZGU6IHJlcy5sYXRpdHVkZSxcbiAgICAgICAgICAgIGxvbmdpdHVkZTogcmVzLmxvbmdpdHVkZSxcbiAgICAgICAgICAgIHN1Y2Nlc3MgKHJlc3QpIHtcbiAgICAgICAgICAgICAgLy/lj5HpgIHor7fmsYLpgJrov4fnu4/nuqzluqblj43mn6XlnLDlnYDkv6Hmga8gIFxuICAgICAgICDCoCDCoCAgdGhhdC5mZXRjaERhdGFQcm9taXNlKCdyZXNvbHZlTG9jYXRpb25BcGkuanNvbicsIHtsYXRpdHVkZTpyZXN0LmxhdGl0dWRlLCBsb25naXR1ZGU6IHJlc3QubG9uZ2l0dWRlfSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgdGhhdC5hZGRyZXNzID0gW2RhdGEucHJvdmluY2VOYW1lLCBkYXRhLmNpdHlOYW1lLCBkYXRhLmRpc3RyaWN0TmFtZV1cbiAgICAgICAgICAgICAgdGhhdC5mb3JtRGF0YS5sb2NhdGlvbiA9IGRhdGEuYWRkcmVzc1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgIH0pXG4gICAgICAgXG4gICAgICB9LFxuICAgICAgYmluZFJlZ2lvbkNoYW5nZSAoZSkge1xuICAgICAgICB0aGlzLmFkZHJlc3MgPSBlLmRldGFpbC52YWx1ZVxuICAgICAgICB0aGlzLmZvcm1EYXRhLmFkZHJlc3MgPSAnJ1xuICAgICAgfSxcbiAgICAgIGNoYW5nZUNsYXNzaWZ5IChlKSB7XG4gICAgICAgIHRoaXMuZm9ybURhdGEuY2xhc3NpZnkgPSBlLmRldGFpbC52YWx1ZVxuICAgICAgfSxcbiAgICAgIGNoYW5nZXRlc3RBcnkoZSkge1xuICAgICAgICB0aGlzLmZvcm1EYXRhLmNsYXNzaWZ5MiA9IGUuZGV0YWlsLnZhbHVlXG4gICAgICB9LFxuICAgICAgLy8g55uR5ZCscGlja2Vy55qE5rua5Yqo5LqL5Lu2XG4gICAgICBiaW5kTXVsdGlQaWNrZXJDb2x1bW5DaGFuZ2UoZSkge1xuICAgICAgICAvLyDojrflj5blubTku71cbiAgICAgICAgaWYgKGUuZGV0YWlsLmNvbHVtbiA9PT0gMCkge1xuICAgICAgICAgIHRoaXMuY2hvb3NlX3llYXIgPSB0aGlzLm11bHRpQXJyYXlbZS5kZXRhaWwuY29sdW1uXVtlLmRldGFpbC52YWx1ZV1cbiAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNob29zZV95ZWFyKVxuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCfkv67mlLnnmoTliJfkuLonLCBlLmRldGFpbC5jb2x1bW4sICfvvIzlgLzkuLonLCBlLmRldGFpbC52YWx1ZSk7XG4gICAgICAgIC8vIOiuvue9ruaciOS7veaVsOe7hFxuICAgICAgICBpZiAoZS5kZXRhaWwuY29sdW1uID09PSAxKSB7XG4gICAgICAgICAgbGV0IG51bSA9IHBhcnNlSW50KHRoaXMubXVsdGlBcnJheVtlLmRldGFpbC5jb2x1bW5dW2UuZGV0YWlsLnZhbHVlXSlcbiAgICAgICAgICB0aGlzLm11bHRpQXJyYXlbMl0gPSB0aGlzLnNldERheXModGhpcy5jaG9vc2VfeWVhciwgbnVtKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tdWx0aUluZGV4W2UuZGV0YWlsLmNvbHVtbl0gPSBlLmRldGFpbC52YWx1ZVxuICAgICAgICB0aGlzLiRhcHBseSgpXG4gICAgICB9LFxuICAgICAgYmluZFN0YXJ0Q2hhbmdlIChlKSB7XG4gICAgICAgIHRoaXMuZm9ybURhdGEuc3RhcnREYXRlID0gdGhpcy5QaWNrZXJDaGFuZ2UoZSlcbiAgICAgIH0sXG4gICAgICBiaW5kRW5kQ2hhbmdlIChlKSB7XG4gICAgICAgIHRoaXMuZm9ybURhdGEuZW5kRGF0ZSA9IHRoaXMuUGlja2VyQ2hhbmdlKGUpXG4gICAgICB9LFxuICAgICAgXG4gICAgICAvLyDojrflj5bml7bpl7RcbiAgICAgIGdldHRpbWVzICh0aW1lcykge1xuICAgICAgICBjb25zb2xlLmxvZyh0aW1lcylcbiAgICAgIH0sXG4gICAgICBzaG93QWRkckNob3NlKCkgeyAvL+aYvuekuuecgeW4guWMuuiBlOWKqOmAieaLqeahhlxuICAgICAgICB0aGlzLmlzU2hvd0FkZHJlc3NDaG9zZSA9ICF0aGlzLmRhdGEuaXNTaG93QWRkcmVzc0Nob3NlXG4gICAgICB9LFxuICAgICAgY2FuY2VsKCkgeyAvL+WPlua2iFxuICAgICAgICB0aGlzLmlzU2hvd0FkZHJlc3NDaG9zZSA9IGZhbHNlO1xuICAgICAgfSxcbiAgICAgIGZpbmlzaCgpIHsgLy/lrozmiJBcbiAgICAgICAgdGhpcy5pc1Nob3dBZGRyZXNzQ2hvc2UgPSBmYWxzZVxuICAgICAgfSxcbiAgICAgIGdldE5hbWUoZSkgeyAvL+iOt+W+l+S8muiuruWQjeensFxuICAgICAgICB0aGlzLmZvcm1EYXRhLm5hbWUgPSBlLmRldGFpbC52YWx1ZTtcbiAgICAgICAgdGhpcy4kYXBwbHkoKVxuICAgICAgfSxcbiAgICAgIGdldGxlYWRlcihlKSB7XG4gICAgICAgIHRoaXMuZm9ybURhdGEubGVhZGVyID0gZS5kZXRhaWwudmFsdWU7XG4gICAgICAgIHRoaXMuJGFwcGx5KClcbiAgICAgIH0sXG4gICAgICBnZXRtb2JpbGUoZSkge1xuICAgICAgICB0aGlzLmZvcm1EYXRhLm1vYmlsZSA9IGUuZGV0YWlsLnZhbHVlO1xuICAgICAgICB0aGlzLiRhcHBseSgpXG4gICAgICB9LFxuICAgICAgZ2V0cHVycG9zZShlKSB7XG4gICAgICAgIHRoaXMuZm9ybURhdGEucHVycG9zZSA9IGUuZGV0YWlsLnZhbHVlO1xuICAgICAgICB0aGlzLiRhcHBseSgpXG4gICAgICB9LFxuICAgICAgZ2V0Y29tcGFyZVByb2R1Y3QoZSkgeyAvL+iOt+W+l+WFqOmDqOWGheWuuVxuICAgICAgICB0aGlzLmZvcm1EYXRhLmNvbXBhcmVQcm9kdWN0ID0gZS5kZXRhaWwudmFsdWU7XG4gICAgICAgIHRoaXMuJGFwcGx5KClcbiAgICAgIH0sXG4gICAgICBnZXRSZW1hcmsoZSkge1xuICAgICAgICB0aGlzLmZvcm1EYXRhLnJlbWFyayA9IGUuZGV0YWlsLnZhbHVlO1xuICAgICAgICB0aGlzLiRhcHBseSgpXG4gICAgICB9LFxuICAgICAgZ2V0cHJvZHVjdE5hbWUoZSkge1xuICAgICAgICB0aGlzLmZvcm1EYXRhLnByb2R1Y3ROYW1lID0gZS5kZXRhaWwudmFsdWU7XG4gICAgICAgIHRoaXMuJGFwcGx5KClcbiAgICAgIH0sXG4gICAgICBnZXRhcmVhKGUpIHtcbiAgICAgICAgdGhpcy5mb3JtRGF0YS5hcmVhID0gZS5kZXRhaWwudmFsdWU7XG4gICAgICAgIHRoaXMuJGFwcGx5KClcbiAgICAgIH0sXG4gICAgICBnZXRSZXN1bHQoZSkge1xuICAgICAgICB0aGlzLmZvcm1EYXRhLnJlc3VsdCA9IGUuZGV0YWlsLnZhbHVlO1xuICAgICAgICB0aGlzLiRhcHBseSgpXG4gICAgICB9LFxuICAgICAgc2F2ZSgpIHsgLy/kv53lrZhcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmZvcm1EYXRhKVxuICAgICAgICBpZiAoIXNlbGYuZm9ybURhdGEubmFtZSB8fCBzZWxmLmZvcm1EYXRhLm5hbWUgPT0gJycpIHtcbiAgICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxuICAgICAgICAgICAgY29udGVudDogJ+WunumqjOWQjeensOW/heWhqycsXG4gICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmICghc2VsZi5mb3JtRGF0YS5sZWFkZXIgfHwgc2VsZi5mb3JtRGF0YS5sZWFkZXIgPT0gJycpIHtcbiAgICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxuICAgICAgICAgICAgY29udGVudDogJ+i0n+i0o+S6uuW/heWhqycsXG4gICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmICghc2VsZi5mb3JtRGF0YS5tb2JpbGUgfHwgc2VsZi5mb3JtRGF0YS5tb2JpbGUgPT0gJycpIHtcbiAgICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxuICAgICAgICAgICAgY29udGVudDogJ+aJi+acuuWPt+W/heWhqycsXG4gICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSAgZWxzZSBpZiAodGhpcy5pc1Bob25lKHRoaXMuZm9ybURhdGEubW9iaWxlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgICAgIHRpdGxlOiBcIuaPkOekulwiLFxuICAgICAgICAgICAgICBjb250ZW50OiBcIuaJi+acuuWPt+agvOW8j+S4jeato+ehrlwiLFxuICAgICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoIXNlbGYuZm9ybURhdGEucHVycG9zZSB8fCBzZWxmLmZvcm1EYXRhLnB1cnBvc2UgPT0gJycpIHtcbiAgICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxuICAgICAgICAgICAgY29udGVudDogJ+WunumqjOebruagh+W/heWhqycsXG4gICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmICghc2VsZi5mb3JtRGF0YS5jbGFzc2lmeSB8fCBzZWxmLmZvcm1EYXRhLmNsYXNzaWZ5ID09ICcnKSB7XG4gICAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcbiAgICAgICAgICAgIGNvbnRlbnQ6ICflrp7pqoznsbvlnovlv4XloasnLFxuICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAoIXNlbGYuZm9ybURhdGEuc3RhcnREYXRlIHx8IHNlbGYuZm9ybURhdGEuc3RhcnREYXRlID09ICcnKSB7XG4gICAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcbiAgICAgICAgICAgIGNvbnRlbnQ6ICflrp7pqozotbflp4vml6XmnJ/lv4XloasnLFxuICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAoIXNlbGYuZm9ybURhdGEuZW5kRGF0ZSB8fCBzZWxmLmZvcm1EYXRhLmVuZERhdGUgPT0gJycpIHtcbiAgICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxuICAgICAgICAgICAgY29udGVudDogJ+WunumqjOi1t+Wni+aXpeacn+W/heWhqycsXG4gICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSAgZWxzZSBpZiAobmV3IERhdGUoc2VsZi5mb3JtRGF0YS5lbmREYXRlKSA8IG5ldyBEYXRlKHNlbGYuZm9ybURhdGEuc3RhcnREYXRlKSkge1xuICAgICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXG4gICAgICAgICAgICBjb250ZW50OiAn5a6e6aqM6LW35aeL5pel5pyf5LiN6IO95aSn5LqO57uT5p2f5pe25pyfJyxcbiAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9ICBlbHNlIGlmICghc2VsZi5mb3JtRGF0YS5jbGFzc2lmeTIgfHwgc2VsZi5mb3JtRGF0YS5jbGFzc2lmeTIgPT0gJycpIHtcbiAgICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxuICAgICAgICAgICAgY29udGVudDogJ+S6p+WTgeexu+Wei+W/heWhqycsXG4gICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmICghc2VsZi5mb3JtRGF0YS5jb21wYXJlUHJvZHVjdCB8fCBzZWxmLmZvcm1EYXRhLmNvbXBhcmVQcm9kdWN0ID09ICcnKSB7XG4gICAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcbiAgICAgICAgICAgIGNvbnRlbnQ6ICflr7nmoIfkuqflk4Hlv4XloasnLFxuICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAoIXNlbGYuZm9ybURhdGEubG9jYXRpb24gfHwgc2VsZi5mb3JtRGF0YS5sb2NhdGlvbiA9PSAnJykge1xuICAgICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXG4gICAgICAgICAgICBjb250ZW50OiAn5a6e6aqM5L2N572u5b+F5aGrJyxcbiAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKCFzZWxmLmZvcm1EYXRhLmFyZWEgfHwgc2VsZi5mb3JtRGF0YS5hcmVhID09ICcnKSB7XG4gICAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcbiAgICAgICAgICAgIGNvbnRlbnQ6ICflrp7pqozpnaLnp6/lv4XloasnLFxuICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAoIXNlbGYuZm9ybURhdGEuZ29vZHMxIHx8IHNlbGYuZm9ybURhdGEuZ29vZHMxID09ICcnIHx8ICFzZWxmLmZvcm1EYXRhLmdvb2RzMiB8fCBzZWxmLmZvcm1EYXRhLmdvb2RzMiA9PSAnJykge1xuICAgICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXG4gICAgICAgICAgICBjb250ZW50OiAn5Lqn5ZOB5ZCN56ew5b+F5aGrJyxcbiAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZm9ybURhdGEudHlwZSA9IHRoaXMuY2xhc3NpZnlBcnlbdGhpcy5mb3JtRGF0YS5jbGFzc2lmeV1cbiAgICAgICAgdGhpcy5mb3JtRGF0YS5wcm9kdWN0VHlwZSA9IHRoaXMudGVzdEFyeVt0aGlzLmZvcm1EYXRhLmNsYXNzaWZ5Ml1cbiAgICAgICAgdGhpcy5mb3JtRGF0YS5wcm9kdWN0TmFtZSA9IHRoaXMuZm9ybURhdGEuZ29vZHMxICsgJywnICsgdGhpcy5mb3JtRGF0YS5nb29kczJcbiAgICAgICAgLy8gIHRoaXMuZm9ybURhdGEucHJvdmluY2VOYW1lID0gdGhpcy5hZGRyZXNzWzBdXG4gICAgICAgIC8vICB0aGlzLmZvcm1EYXRhLmNpdHlOYW1lID0gdGhpcy5hZGRyZXNzWzFdXG4gICAgICAgIC8vICB0aGlzLmZvcm1EYXRhLmRpc3RyaWN0TmFtZSA9IHRoaXMuYWRkcmVzc1syXVxuICAgICAgICBpZiAoc2VsZi5mb3JtRGF0YS5pZCB8fCBzZWxmLmZvcm1EYXRhLmlkID09PSAwKSB7XG4gICAgICAgICAgIHRoaXMuZm9ybURhdGEudXNlciA9IG51bGxcbiAgICAgICAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3d4L2V4cGVyaW1lbnQvdXBkYXRlRXhwZXJpbWVudEFwaS5qc29uJywgdGhpcy5mb3JtRGF0YSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5mb3JtRGF0YSA9IHt9XG4gICAgICAgICAgICAgIC8v6L+U5Zue5LiK5LiK5LiA6aG1XG4gICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICfnt6jovK/miJDlip8nXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICB3eC5uYXZpZ2F0ZUJhY2soe1xuICAgICAgICAgICAgICAgICAgZGVsdGE6IDFcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xuICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKCd3eC9leHBlcmltZW50L2NyZWF0ZUV4cGVyaW1lbnRBcGkuanNvbicsIHRoaXMuZm9ybURhdGEpXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgc2VsZi5mb3JtRGF0YSA9IHt9XG4gICAgICAgICAgICAvL+i/lOWbnuS4iuS4gOmhtVxuICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICfmlrDlop7miJDlip8nXG4gICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgd3gubmF2aWdhdGVCYWNrKHtcbiAgICAgICAgICAgICAgICBkZWx0YTogMVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfVxuICAgIC8vIGVuZEZ1biAoKSB7XG4gICAgLy8gICBpZiAodGhpcy5mb3JtRGF0YS5lbmREYXRlMSkgdGhpcy50aW1lcyA9IHRoaXMuZm9ybURhdGEuZW5kRGF0ZTFcbiAgICAvLyB9XG4gICAgLy8gc3RhcnREYXRlICgpIHtcbiAgICAvLyAgIGlmICh0aGlzLmZvcm1EYXRhLnN0YXJ0RGF0ZTEpIHRoaXMudGltZXMgPSB0aGlzLmZvcm1EYXRhLnN0YXJ0RGF0ZTFcbiAgICAvLyB9XG4gICAgb25Mb2FkKG9wdGlvbnMpIHtcbiAgICAgIC8vIOiOt+WPlue7j+e6rOW6plxuICAgICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgICBpZiAob3B0aW9ucy5pdGVtKSB7XG4gICAgICAgIHRoaXMuZm9ybURhdGEgPSBKU09OLnBhcnNlKG9wdGlvbnMuaXRlbSlcbiAgICAgICAgd3guc2V0TmF2aWdhdGlvbkJhclRpdGxlKHtcbiAgICAgICAgICB0aXRsZTogJ+e8lui+keWunumqjCcgXG4gICAgICAgIH0pXG4gICAgICAgIGlmICh0aGF0LmZvcm1EYXRhLnN0YXJ0RGF0ZSkgdGhhdC5mb3JtRGF0YS5zdGFydERhdGUgPSB0aGF0LmZvcm1EYXRhLnN0YXJ0RGF0ZS5zcGxpdCgnVCcpWzBdXG4gICAgICAgIGlmICh0aGF0LmZvcm1EYXRhLmVuZERhdGUpIHRoYXQuZm9ybURhdGEuZW5kRGF0ZSA9IHRoYXQuZm9ybURhdGEuZW5kRGF0ZS5zcGxpdCgnVCcpWzBdXG4gICAgICAgIHRoYXQuZm9ybURhdGEuY2xhc3NpZnkgPSB0aGF0LmlzVHlwZSh0aGF0LmNsYXNzaWZ5QXJ5LCB0aGF0LmZvcm1EYXRhLnR5cGUpICsgJydcbiAgICAgICAgdGhhdC5mb3JtRGF0YS5jbGFzc2lmeTIgPSB0aGF0LmlzVHlwZSh0aGF0LnRlc3RBcnksIHRoYXQuZm9ybURhdGEucHJvZHVjdFR5cGUpICsgJydcbiAgICAgICAgdGhpcy5mb3JtRGF0YS5nb29kczEgPSB0aGF0LmZvcm1EYXRhLnByb2R1Y3ROYW1lLnNwbGl0KCcsJylbMF1cbiAgICAgICAgdGhpcy5mb3JtRGF0YS5nb29kczIgPSB0aGF0LmZvcm1EYXRhLnByb2R1Y3ROYW1lLnNwbGl0KCcsJylbMV1cbiAgICAgICAgY29uc29sZS5sb2codGhpcy5mb3JtRGF0YS5nb29kc2luZGV4MSlcbiAgICAgIH1cbiAgICAgIHd4LmdldExvY2F0aW9uKHtcbiAgICAgICAgdHlwZTogJ2djajAyJyxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlcylcbiAgICAgICAgICBcbiAgICAgICAgICB0aGF0LmZvcm1EYXRhLmxhdGl0dWRlID0gcmVzLmxhdGl0dWRlXG4gICAgICAgICAgdGhhdC5mb3JtRGF0YS5sb25naXR1ZGUgPSByZXMubG9uZ2l0dWRlXG4gICAgICAgIH0sXG4gICAgICAgIGZhaWw6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgdGhpcy5zZXR0aW1lc0RhdGUoKVxuICAgICAgdGhpcy5tdWx0aUFycmF5ID0gW3RoaXMueWVhcnMsIHRoaXMubW9udGhzLCB0aGlzLmRheXNdXG4gICAgICB0aGlzLmNob29zZV95ZWFyID0gdGhpcy5tdWx0aUFycmF5WzBdWzBdXG4gICAgICBpZiAoIXRoaXMudGltZXMpIHtcbiAgICAgICAgLy8g6buY6K6k5pi+56S65b2T5YmN5pel5pyfXG4gICAgICAgIGxldCBkYXRlID0gbmV3IERhdGUoKVxuICAgICAgICBsZXQgY3VycmVudE1vbnRoID0gZGF0ZS5nZXRNb250aCgpXG4gICAgICAgIGxldCBjdXJyZW50RGF5ID0gZGF0ZS5nZXREYXRlKCkgLSAxXG4gICAgICAgIC8vIGNvbnNvbGUuaW5mbygn5pyIJywgZGF0ZS5nZXRNb250aCgpKVxuICAgICAgICAvLyBjb25zb2xlLmluZm8oJ+aXpScsIGRhdGUuZ2V0RGF0ZSgpKVxuICAgICAgICB0aGlzLm11bHRpQXJyYXlbMl0gPSB0aGlzLnNldERheXModGhpcy5jaG9vc2VfeWVhciwgY3VycmVudE1vbnRoICsgMSlcbiAgICAgICAgdGhpcy5tdWx0aUluZGV4ID0gWzAsIGN1cnJlbnRNb250aCwgY3VycmVudERheSwgMTAsIDBdXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldERlZmF1bHR0aW1lcygpXG4gICAgICB9XG4gICAgICAvLyB3eC5nZXRTdG9yYWdlKHtcbiAgICAgIC8vICAga2V5OiAnaXRlbScsXG4gICAgICAvLyAgIHN1Y2Nlc3MgKHJlcykge1xuICAgICAgLy8gICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKVxuICAgICAgLy8gICAgIHNlbGYuZm9ybURhdGEgPSByZXMuZGF0YVxuICAgICAgLy8gICB9XG4gICAgICAvLyB9KVxuXG4gICAgICB0aGlzLiRhcHBseSgpXG4gICAgfVxuICAgIHdoZW5BcHBSZWFkeVNob3coKSB7XG4gICAgICAvLyDmr4/mrKHpg73liLfmlrBcbiAgICAgIHRoaXMuJGFwcGx5KClcbiAgICB9XG4gIH1cbiJdfQ==