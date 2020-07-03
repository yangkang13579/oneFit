"use strict";

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

var one = ["柑橘", "水稻", "小麦", "玉米", "马铃薯", "棉花", "大豆", "花生", "果蔬类", "苹果", "其他作物"];
var two = [["柑类", "橘类", "杂柑类", "橙类", "柚类", "柠檬"], ["旱直播稻", "水直播稻", "人工抛秧", "机械插秧"], ["春小麦", "冬小麦"], ["夏玉米", "春玉米"], ["春季薯", "夏季薯", "冬季薯"], ["新陆早系列", "新陆中系列", "中字号棉花品种", "鲁棉系列品种", "冀棉系列品种"], ["中字号棉花品种", "鲁棉系列品种"], ["春大豆", "夏大豆"], ["春花生", "夏花生"], ["番茄", "辣椒", "辣椒", "甜椒", "茄子", "黄瓜", "豇豆", "菜豆", "甘蓝", "冬瓜", "南瓜", "甜瓜", "西瓜", "葱", "姜", "蒜"], ["早熟品种", "中熟品种", "晚熟品种"], ["梨树", "桃树", "荔枝", "樱桃", "芒果", "花卉", "油菜", "茶叶", "葡萄", "烟草"]];

var Form = function (_wepy$page) {
  _inherits(Form, _wepy$page);

  function Form() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Form);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Form.__proto__ || Object.getPrototypeOf(Form)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
      navigationBarTitleText: "样品申领表单页",
      navigationBarBackgroundColor: "#fff"
    }, _this.data = {
      goodsAry: [],
      one: ["柑橘", "水稻", "小麦", "玉米", "马铃薯", "棉花", "大豆", "花生", "果蔬类", "苹果", "其他作物"],
      two: [["柑类", "橘类", "杂柑类", "橙类", "柚类", "柠檬"], ["旱直播稻", "水直播稻", "人工抛秧", "机械插秧"], ["春小麦", "冬小麦"], ["夏玉米", "春玉米"], ["春季薯", "夏季薯", "冬季薯"], ["新陆早系列", "新陆中系列", "中字号棉花品种", "鲁棉系列品种", "冀棉系列品种"], ["春大豆", "夏大豆"], ["春花生", "夏花生"], ["番茄", "辣椒", "辣椒", "甜椒", "茄子", "黄瓜", "豇豆", "菜豆", "甘蓝", "冬瓜", "南瓜", "甜瓜", "西瓜", "葱", "姜", "蒜"], ["早熟品种", "中熟品种", "晚熟品种"], ["梨树", "桃树", "荔枝", "樱桃", "芒果", "花卉", "油菜", "茶叶", "葡萄", "烟草"]],
      arrayLevel: ["省级经销商", "地市级经销商", "县级经销商", "乡镇/零售经销商"],
      role: null,
      sendBtn: false,
      limitTime: 60,
      disabled: true,
      classifyAry: ["经销商会", "农民会", "观摩会", "促销会", "其他会议"],
      goods: [{ area: "", cropsCategory: "" }],
      type: null,
      formData: {},
      date: "2016-09-01",
      times: "2020-07-29 12:50",
      // 时间选择器参数
      years: [],
      months: [],
      days: [],
      hours: [],
      minutes: [],
      second: [],
      multiArray: [], // 选择范围
      multiIndex: [0, 9, 16, 13, 17], // 选中值数组
      choose_year: "",
      yearIndex: 0,
      address: [],
      codeName: "获取验证码",
      indexs: null
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
        this.goods[this.index]["cropsCategory2"] = "";
      },
      addFun: function addFun() {
        if (this.goods.length >= 5) {
          wx.showModal({
            title: "提示",
            content: "种植作物最多5种",
            showCancel: false
          });
          return;
        }
        this.goods.push({ area: "", cropsCategory: "" });
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
          type: "wgs84",
          success: function success(res) {
            wx.chooseLocation({
              latitude: res.latitude,
              longitude: res.longitude,
              success: function success(rest) {
                //发送请求通过经纬度反查地址信息
                that.fetchDataPromise("resolveLocationApi.json", {
                  latitude: rest.latitude,
                  longitude: rest.longitude
                }).then(function (data) {
                  that.address = [data.provinceName, data.cityName, data.districtName];
                  that.formData.address = data.address;
                });
              }
            });
          }
        });
      },
      getRemark: function getRemark(e) {
        this.formData.applyReason = e.detail.value;
      },
      bindLeverChange: function bindLeverChange(e) {
        console.log(e);
        this.formData.dealerLevel = this.arrayLevel[e.detail.value];
      },
      bindRegionChange: function bindRegionChange(e) {
        this.address = e.detail.value;
        this.formData.address = "";
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
        this.formData.addressee = e.detail.value;
        this.$apply();
      },
      getNumber: function getNumber(e) {
        this.formData.applyCount = e.detail.value;
        this.$apply();
      },
      getphoneNum: function getphoneNum(e) {
        console.log(e.detail.value);
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
      save: function save() {
        //保存
        var self = this;

        this.formData.mobile = this.formData.phoneNum;
        if (!self.formData.addressee || self.formData.addressee == "") {
          wx.showModal({
            title: "提示",
            content: "姓名必填",
            showCancel: false
          });
          return;
        } else if (!self.formData.applyCount || self.formData.applyCount == "") {
          wx.showModal({
            title: "提示",
            content: "申请数量必填",
            showCancel: false
          });
          return;
        } else if (self.role === "3" && (!self.formData.companyName || self.formData.companyName == "")) {
          wx.showModal({
            title: "提示",
            content: "公司名称必填",
            showCancel: false
          });
          return;
        } else if (self.role === "3" && (!self.formData.dealerLevel || self.formData.dealerLevel == "")) {
          wx.showModal({
            title: "提示",
            content: "等级必选",
            showCancel: false
          });
          return;
        } else if (!self.address || self.address == "" || self.address.length === 0) {
          wx.showModal({
            title: "提示",
            content: "请选择地址",
            showCancel: false
          });
          return;
        } else if (!self.formData.address || self.formData.address == "") {
          wx.showModal({
            title: "提示",
            content: "详细地址必填",
            showCancel: false
          });
          return;
        } else if (!self.formData.mobile || self.formData.mobile == "") {
          wx.showModal({
            title: "提示",
            content: "手机号必填",
            showCancel: false
          });
          return;
        } else if (this.isPhone(this.formData.mobile) === false) {
          wx.showModal({
            title: "提示",
            content: "手机号格式不正确",
            showCancel: false
          });
          return;
        } else if (!self.formData.code || self.formData.code == "") {
          wx.showModal({
            title: "提示",
            content: "验证码必填",
            showCancel: false
          });
          return;
        }
        // else if (
        //   !self.formData.applyReason ||
        //   self.formData.applyReason == ""
        // ) {
        //   wx.showModal({
        //     title: "提示",
        //     content: "申请原因必填",
        //     showCancel: false
        //   });
        //   return;
        // }
        if (self.role === "1") {
          for (var i = 0; i < this.goods.length; i++) {
            if (this.goods[i].area === "" || this.goods.cropsCategory === "") {
              wx.showModal({
                title: "提示",
                content: "种植作物必填",
                showCancel: false
              });
              return;
            }
          }
        }
        this.goods = this.goods.map(function (item) {
          var obj = item;
          obj.cropsCategory = obj.cropsCategory1 + "," + obj.cropsCategory2;
          return obj;
        });
        this.formData.cropsCategoryAndArea = this.goods;
        this.formData.provinceName = this.address[0];
        this.formData.cityName = this.address[1];
        this.formData.districtName = this.address[2];
        console.log("this.formData", this.formData);

        this.fetchDataPromise("wx/specimen/applySpecimenApi.json", this.formData).then(function (data) {
          console.log("data", data);
          if (data.result == true) {
            wx.showToast({
              title: "样品申领成功",
              icon: "success",
              duration: 2000
            });
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              });
            }, 2000);
            self.formData = {};
            self.$apply();
          } else {}
        });

        // this.formData.role = this.role;
        // if (self.type == "edit") {
        //   this.formData.user = null;
        //   this.fetchDataPromise(
        //     "meeting/wechat/updateMeetingApi.json",
        //     this.formData
        //   ).then(function(data) {
        //     self.formData = {};
        //     wx.navigateBack({
        //       delta: 1
        //     });
        //     self.$apply();
        //   });
        // } else {
        //   this.fetchDataPromise("wx/updateUserApi.json", this.formData).then(
        //     function(data) {
        //       self.formData = {};
        //       wx.navigateBack({
        //         delta: 1
        //       });
        //       self.$apply();
        //     }
        //   );
        // }
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Form, [{
    key: "timesFun",

    // 差一位补位
    value: function timesFun(t) {
      if (t < 10) return "0" + t;else return t;
    }

    // 设置初始值

  }, {
    key: "settimesDate",
    value: function settimesDate() {
      var date = new Date();
      var _yearIndex = 0;
      // 默认设置
      console.info(this.times);
      var _defaultYear = this.times ? this.times.split("-")[0] : 0;
      // 获取年
      for (var i = date.getFullYear(); i <= date.getFullYear() + 5; i++) {
        this.years.push("" + i);
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
          _i = "0" + _i;
        }
        this.months.push("" + _i);
      }
      // 获取日期
      for (var _i2 = 1; _i2 <= 31; _i2++) {
        if (_i2 < 10) {
          _i2 = "0" + _i2;
        }
        this.days.push("" + _i2);
      }
      // // 获取小时
      for (var _i3 = 0; _i3 < 24; _i3++) {
        if (_i3 < 10) {
          _i3 = "0" + _i3;
        }
        this.hours.push("" + _i3);
      }
      // // 获取分钟
      for (var _i4 = 0; _i4 < 60; _i4++) {
        if (_i4 < 10) {
          _i4 = "0" + _i4;
        }
        this.minutes.push("" + _i4);
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
    key: "setTime",
    value: function setTime() {
      var that = this;
      if (this.limitTime <= 0) {
        this.limitTime = 60;
        this.sendBtn = false;
        this.codeName = "重新获取";
        this.sendBtn = false;
        clearTimeout(this.clsTimeout);
      } else {
        this.sendBtn = true;
        this.limitTime--;
        this.codeName = this.limitTime + "s重新获取";
        this.clsTimeout = setTimeout(function () {
          that.setTime();
          that.$apply();
        }, 1000);
      }
    }
    // 返回月份的天数

  }, {
    key: "setDays",
    value: function setDays(selectYear, selectMonth) {
      var num = selectMonth;
      var temp = [];
      if (num === 1 || num === 3 || num === 5 || num === 7 || num === 8 || num === 10 || num === 12) {
        // 判断31天的月份
        for (var i = 1; i <= 31; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
      } else if (num === 4 || num === 6 || num === 9 || num === 11) {
        // 判断30天的月份
        for (var _i5 = 1; _i5 <= 30; _i5++) {
          if (_i5 < 10) {
            _i5 = "0" + _i5;
          }
          temp.push("" + _i5);
        }
      } else if (num === 2) {
        // 判断2月份天数
        var year = parseInt(selectYear);
        console.log(year);
        if ((year % 400 === 0 || year % 100 !== 0) && year % 4 === 0) {
          for (var _i6 = 1; _i6 <= 29; _i6++) {
            if (_i6 < 10) {
              _i6 = "0" + _i6;
            }
            temp.push("" + _i6);
          }
        } else {
          for (var _i7 = 1; _i7 <= 28; _i7++) {
            if (_i7 < 10) {
              _i7 = "0" + _i7;
            }
            temp.push("" + _i7);
          }
        }
      }
      return temp;
    }
    // 设置默认值 格式2019-07-10 10:30

  }, {
    key: "setDefaulttimes",
    value: function setDefaulttimes() {
      var allDateList = this.times.split(" ");
      // 日期
      var dateList = allDateList[0].split("-");
      var month = parseInt(dateList[1]) - 1;
      var day = parseInt(dateList[2]) - 1;
      // 时间
      var timesList = allDateList[1].split(":");
      this.multiArray[2] = this.setDays(dateList[0], parseInt(dateList[1]));
      this.multiIndex = [this.yearIndex, month, day, timesList[0], timesList[1]];
    }
    // 获取时间日期

  }, {
    key: "PickerChange",
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
      this.times = year + "-" + month + "-" + day + " " + hour + ":" + minute;
      this.$apply();
      return this.times;
    }
  }, {
    key: "isPhone",
    value: function isPhone(str) {
      var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      return reg.test(str);
    }
  }, {
    key: "getValidCode",
    value: function getValidCode() {
      var that = this;
      if (this.sendBtn === true) return;
      if (this.isPhone(this.formData.phoneNum) === false) {
        wx.showModal({
          title: "提示",
          content: "手机号格式不正确",
          showCancel: false
        });
        return;
      }
      try {
        wx.showLoading({
          title: "发送中,请等待..."
        });

        this.fetchDataPromise("wx/sendVerificationCodeApi.json", {
          phoneNum: this.formData.phoneNum
        }).then(function (data) {
          wx.showToast({
            title: "发送成功请查收"
          });
          that.sendBtn = true;
          that.$apply();
        });
        this.setTime();
      } catch (e) {
        that.sendBtn = false;
      }
    }
  }, {
    key: "onShow",
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
    key: "whenAppReadyShow",
    value: function whenAppReadyShow() {}
  }, {
    key: "onLoad",
    value: function onLoad(options) {
      console.log("options", options);
      this.codeName = "获取验证码", this.limitTime = 60;
      this.disabled = true;
      clearTimeout(this.clsTimeout);
      var that = this;
      if (options.id) {
        that.formData.id = options.id;
        console.log("that.formData.id", that.formData.id);
      }
      if (options.role) {
        this.role = options.role;
        wx.getStorage({
          key: "userInfo",
          success: function success(res) {
            var data = JSON.parse(res.data);
            that.formData = data;
            that.formData.name = data.userName;
            that.formData.phoneNum = data.mobile;
            that.goods = that.formData.cropsCategoryAndArea ? that.formData.cropsCategoryAndArea : [{ area: "", cropsCategory: "" }];
            if (!that.formData.latitude) {
              wx.getLocation({
                type: "gcj02",
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
      this.times = new Date().getFullYear() + "-" + this.timesFun(new Date().getMonth() + 1) + "-" + this.timesFun(new Date().getDate()) + " " + "12";
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
    key: "changeCurrentData",
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
      if (option.type == "city" || option.type == "all") {
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
        }
      }
      this.districts = districts;
      this.$apply();
    }
  }]);

  return Form;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(Form , 'pages/form'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvcm0uanMiXSwibmFtZXMiOlsib25lIiwidHdvIiwiRm9ybSIsIm1peGlucyIsIlBhZ2VNaXhpbiIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiZGF0YSIsImdvb2RzQXJ5IiwiYXJyYXlMZXZlbCIsInJvbGUiLCJzZW5kQnRuIiwibGltaXRUaW1lIiwiZGlzYWJsZWQiLCJjbGFzc2lmeUFyeSIsImdvb2RzIiwiYXJlYSIsImNyb3BzQ2F0ZWdvcnkiLCJ0eXBlIiwiZm9ybURhdGEiLCJkYXRlIiwidGltZXMiLCJ5ZWFycyIsIm1vbnRocyIsImRheXMiLCJob3VycyIsIm1pbnV0ZXMiLCJzZWNvbmQiLCJtdWx0aUFycmF5IiwibXVsdGlJbmRleCIsImNob29zZV95ZWFyIiwieWVhckluZGV4IiwiYWRkcmVzcyIsImNvZGVOYW1lIiwiaW5kZXhzIiwibWV0aG9kcyIsImdldEluZGV4IiwiZSIsImluZGV4IiwiY3VycmVudFRhcmdldCIsImRhdGFzZXQiLCJnZXRhcmVhIiwiY29uc29sZSIsImxvZyIsInZhbHVlIiwiZGV0YWlsIiwiZ2V0R29vZHMyIiwibGVuZ3RoIiwic3Vic3RyaW5nIiwiZ2V0R29vZHMiLCJhZGRGdW4iLCJ3eCIsInNob3dNb2RhbCIsInRpdGxlIiwiY29udGVudCIsInNob3dDYW5jZWwiLCJwdXNoIiwiJGFwcGx5IiwiZGVsIiwic3BsaWNlIiwic2VuZEZ1biIsImdldFZhbGlkQ29kZSIsImNob29zZUxvY2F0aW9uIiwidGhhdCIsImdldExvY2F0aW9uIiwic3VjY2VzcyIsInJlcyIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwicmVzdCIsImZldGNoRGF0YVByb21pc2UiLCJ0aGVuIiwicHJvdmluY2VOYW1lIiwiY2l0eU5hbWUiLCJkaXN0cmljdE5hbWUiLCJnZXRSZW1hcmsiLCJhcHBseVJlYXNvbiIsImJpbmRMZXZlckNoYW5nZSIsImRlYWxlckxldmVsIiwiYmluZFJlZ2lvbkNoYW5nZSIsImNoYW5nZUNsYXNzaWZ5IiwiY2xhc3NpZnkiLCJnZXRDb2RlIiwiY29kZSIsImJpbmRNdWx0aVBpY2tlckNvbHVtbkNoYW5nZSIsImNvbHVtbiIsIm51bSIsInBhcnNlSW50Iiwic2V0RGF5cyIsImJpbmRTdGFydENoYW5nZSIsInN0YXJ0RGF0ZTEiLCJQaWNrZXJDaGFuZ2UiLCJiaW5kRW5kQ2hhbmdlIiwiZW5kRGF0ZTEiLCJnZXR0aW1lcyIsInNob3dBZGRyQ2hvc2UiLCJpc1Nob3dBZGRyZXNzQ2hvc2UiLCJjYW5jZWwiLCJmaW5pc2giLCJnZXROYW1lIiwiYWRkcmVzc2VlIiwiZ2V0TnVtYmVyIiwiYXBwbHlDb3VudCIsImdldHBob25lTnVtIiwicGhvbmVOdW0iLCJnZXRDb250ZW50IiwiZ2V0bGVhZGVyIiwibGVhZGVyIiwiZ2V0Y29tcGFueU5hbWUiLCJjb21wYW55TmFtZSIsImdldGFkZHJlc3MiLCJnZXR1c2VyQ291bnQiLCJ1c2VyQ2FwYWNpdHkiLCJzYXZlIiwic2VsZiIsIm1vYmlsZSIsImlzUGhvbmUiLCJpIiwibWFwIiwib2JqIiwiaXRlbSIsImNyb3BzQ2F0ZWdvcnkxIiwiY3JvcHNDYXRlZ29yeTIiLCJjcm9wc0NhdGVnb3J5QW5kQXJlYSIsInJlc3VsdCIsInNob3dUb2FzdCIsImljb24iLCJkdXJhdGlvbiIsInNldFRpbWVvdXQiLCJuYXZpZ2F0ZUJhY2siLCJkZWx0YSIsInQiLCJEYXRlIiwiX3llYXJJbmRleCIsImluZm8iLCJfZGVmYXVsdFllYXIiLCJzcGxpdCIsImdldEZ1bGxZZWFyIiwiY2xlYXJUaW1lb3V0IiwiY2xzVGltZW91dCIsInNldFRpbWUiLCJzZWxlY3RZZWFyIiwic2VsZWN0TW9udGgiLCJ0ZW1wIiwieWVhciIsImFsbERhdGVMaXN0IiwiZGF0ZUxpc3QiLCJtb250aCIsImRheSIsInRpbWVzTGlzdCIsImhvdXIiLCJtaW51dGUiLCJzdHIiLCJyZWciLCJ0ZXN0Iiwic2hvd0xvYWRpbmciLCJvcHRpb25zIiwiaWQiLCJnZXRTdG9yYWdlIiwia2V5IiwiSlNPTiIsInBhcnNlIiwibmFtZSIsInVzZXJOYW1lIiwiZmFpbCIsInRpbWVzRnVuIiwiZ2V0TW9udGgiLCJnZXREYXRlIiwic2V0dGltZXNEYXRlIiwiY3VycmVudE1vbnRoIiwiY3VycmVudERheSIsInNldERlZmF1bHR0aW1lcyIsIm9wdGlvbiIsIm5hdGlvbmFsRGF0YSIsInByb3ZpbmNlcyIsInByb3ZpbmNlIiwiem9uZV9uYW1lIiwiY2l0aWVzIiwiY3VycmVudENpdGllcyIsImN1cnJlbnRQcm92aW5jZUluZGV4IiwiY2l0eXMiLCJjaXR5IiwiZGlzdHJpY3RzIiwiY3VycmVudERpc3RyaWN0cyIsImN1cnJlbnRDaXR5SW5kZXgiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFDQSxJQUFJQSxNQUFNLENBQ1IsSUFEUSxFQUVSLElBRlEsRUFHUixJQUhRLEVBSVIsSUFKUSxFQUtSLEtBTFEsRUFNUixJQU5RLEVBT1IsSUFQUSxFQVFSLElBUlEsRUFTUixLQVRRLEVBVVIsSUFWUSxFQVdSLE1BWFEsQ0FBVjtBQWFBLElBQUlDLE1BQU0sQ0FDUixDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsS0FBYixFQUFvQixJQUFwQixFQUEwQixJQUExQixFQUFnQyxJQUFoQyxDQURRLEVBRVIsQ0FBQyxNQUFELEVBQVMsTUFBVCxFQUFpQixNQUFqQixFQUF5QixNQUF6QixDQUZRLEVBR1IsQ0FBQyxLQUFELEVBQVEsS0FBUixDQUhRLEVBSVIsQ0FBQyxLQUFELEVBQVEsS0FBUixDQUpRLEVBS1IsQ0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLEtBQWYsQ0FMUSxFQU1SLENBQ0UsT0FERixFQUVFLE9BRkYsRUFHRSxTQUhGLEVBSUUsUUFKRixFQUtFLFFBTEYsQ0FOUSxFQWFSLENBQUMsU0FBRCxFQUFZLFFBQVosQ0FiUSxFQWNSLENBQUMsS0FBRCxFQUFRLEtBQVIsQ0FkUSxFQWVSLENBQUMsS0FBRCxFQUFRLEtB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Q0FERztBQUVWZ0Usa0JBQU1ILGNBQWM3RCxDQUFkLEVBQWlCMkQ7QUFGYixXQUFaO0FBSUQ7QUFDRCxhQUFLQyxNQUFMLEdBQWNBLE1BQWQ7QUFDRDtBQUNEO0FBQ0E7QUFDQSxXQUFLSyxTQUFMLEdBQWlCLEVBQWpCO0FBQ0EsVUFBSUEsWUFBWSxLQUFLQSxTQUFyQjtBQUNBLFVBQUlDLG1CQUNGVixhQUFhRCxPQUFPTyxvQkFBcEIsRUFBMENDLEtBQTFDLENBQWdEUixPQUFPWSxnQkFBdkQsRUFDR0YsU0FGTDtBQUdBLFdBQUssSUFBSWpFLElBQUksQ0FBYixFQUFnQkEsSUFBSWtFLGlCQUFpQnhJLE1BQXJDLEVBQTZDc0UsR0FBN0MsRUFBa0Q7QUFDaEQsWUFBSUEsS0FBSyxDQUFULEVBQVk7QUFDVmlFLG9CQUFVOUgsSUFBVixDQUFlK0gsaUJBQWlCbEUsQ0FBakIsRUFBb0IyRCxTQUFuQztBQUNEO0FBQ0Y7QUFDRCxXQUFLTSxTQUFMLEdBQWlCQSxTQUFqQjtBQUNBLFdBQUs3SCxNQUFMO0FBQ0Q7Ozs7RUFyd0IrQmdJLGVBQUtDLEk7O2tCQUFsQnpMLEkiLCJmaWxlIjoiZm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbXBvcnQgd2VweSBmcm9tIFwid2VweVwiO1xyXG5pbXBvcnQgUGFnZU1peGluIGZyb20gXCIuLi9taXhpbnMvcGFnZVwiO1xyXG52YXIgb25lID0gW1xyXG4gIFwi5p+R5qmYXCIsXHJcbiAgXCLmsLTnqLtcIixcclxuICBcIuWwj+m6plwiLFxyXG4gIFwi546J57GzXCIsXHJcbiAgXCLpqazpk4Polq9cIixcclxuICBcIuajieiKsVwiLFxyXG4gIFwi5aSn6LGGXCIsXHJcbiAgXCLoirHnlJ9cIixcclxuICBcIuaenOiUrOexu1wiLFxyXG4gIFwi6Iu55p6cXCIsXHJcbiAgXCLlhbbku5bkvZznialcIlxyXG5dO1xyXG52YXIgdHdvID0gW1xyXG4gIFtcIuafkeexu1wiLCBcIuapmOexu1wiLCBcIuadguafkeexu1wiLCBcIuapmeexu1wiLCBcIuafmuexu1wiLCBcIuafoOaqrFwiXSxcclxuICBbXCLml7Hnm7Tmkq3nqLtcIiwgXCLmsLTnm7Tmkq3nqLtcIiwgXCLkurrlt6Xmipvnp6dcIiwgXCLmnLrmorDmj5Lnp6dcIl0sXHJcbiAgW1wi5pil5bCP6bqmXCIsIFwi5Yas5bCP6bqmXCJdLFxyXG4gIFtcIuWkj+eOieexs1wiLCBcIuaYpeeOieexs1wiXSxcclxuICBbXCLmmKXlraPolq9cIiwgXCLlpI/lraPolq9cIiwgXCLlhqzlraPolq9cIl0sXHJcbiAgW1xyXG4gICAgXCLmlrDpmYbml6nns7vliJdcIixcclxuICAgIFwi5paw6ZmG5Lit57O75YiXXCIsXHJcbiAgICBcIuS4reWtl+WPt+ajieiKseWTgeenjVwiLFxyXG4gICAgXCLpsoHmo4nns7vliJflk4Hnp41cIixcclxuICAgIFwi5YaA5qOJ57O75YiX5ZOB56eNXCJcclxuICBdLFxyXG4gIFtcIuS4reWtl+WPt+ajieiKseWTgeenjVwiLCBcIumygeajieezu+WIl+WTgeenjVwiXSxcclxuICBbXCLmmKXlpKfosYZcIiwgXCLlpI/lpKfosYZcIl0sXHJcbiAgW1wi5pil6Iqx55SfXCIsIFwi5aSP6Iqx55SfXCJdLFxyXG4gIFtcclxuICAgIFwi55Wq6IyEXCIsXHJcbiAgICBcIui+o+akklwiLFxyXG4gICAgXCLovqPmpJJcIixcclxuICAgIFwi55Sc5qSSXCIsXHJcbiAgICBcIuiMhOWtkFwiLFxyXG4gICAgXCLpu4Tnk5xcIixcclxuICAgIFwi6LGH6LGGXCIsXHJcbiAgICBcIuiPnOixhlwiLFxyXG4gICAgXCLnlJjok51cIixcclxuICAgIFwi5Yas55OcXCIsXHJcbiAgICBcIuWNl+eTnFwiLFxyXG4gICAgXCLnlJznk5xcIixcclxuICAgIFwi6KW/55OcXCIsXHJcbiAgICBcIuiRsVwiLFxyXG4gICAgXCLlp5xcIixcclxuICAgIFwi6JKcXCJcclxuICBdLFxyXG4gIFtcIuaXqeeGn+WTgeenjVwiLCBcIuS4reeGn+WTgeenjVwiLCBcIuaZmueGn+WTgeenjVwiXSxcclxuICBbXHJcbiAgICBcIuaiqOagkVwiLFxyXG4gICAgXCLmoYPmoJFcIixcclxuICAgIFwi6I2U5p6dXCIsXHJcbiAgICBcIuaoseahg1wiLFxyXG4gICAgXCLoipLmnpxcIixcclxuICAgIFwi6Iqx5Y2JXCIsXHJcbiAgICBcIuayueiPnFwiLFxyXG4gICAgXCLojLblj7ZcIixcclxuICAgIFwi6JGh6JCEXCIsXHJcbiAgICBcIueDn+iNiVwiXHJcbiAgXVxyXG5dO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGb3JtIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICBtaXhpbnMgPSBbUGFnZU1peGluXTtcclxuICBjb25maWcgPSB7XHJcbiAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiBcIuagt+WTgeeUs+mihuihqOWNlemhtVwiLFxyXG4gICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcclxuICB9O1xyXG4gIGRhdGEgPSB7XHJcbiAgICBnb29kc0FyeTogW10sXHJcbiAgICBvbmU6IFtcclxuICAgICAgXCLmn5HmqZhcIixcclxuICAgICAgXCLmsLTnqLtcIixcclxuICAgICAgXCLlsI/puqZcIixcclxuICAgICAgXCLnjonnsbNcIixcclxuICAgICAgXCLpqazpk4Polq9cIixcclxuICAgICAgXCLmo4noirFcIixcclxuICAgICAgXCLlpKfosYZcIixcclxuICAgICAgXCLoirHnlJ9cIixcclxuICAgICAgXCLmnpzolKznsbtcIixcclxuICAgICAgXCLoi7nmnpxcIixcclxuICAgICAgXCLlhbbku5bkvZznialcIlxyXG4gICAgXSxcclxuICAgIHR3bzogW1xyXG4gICAgICBbXCLmn5HnsbtcIiwgXCLmqZjnsbtcIiwgXCLmnYLmn5HnsbtcIiwgXCLmqZnnsbtcIiwgXCLmn5rnsbtcIiwgXCLmn6DmqqxcIl0sXHJcbiAgICAgIFtcIuaXseebtOaSreeou1wiLCBcIuawtOebtOaSreeou1wiLCBcIuS6uuW3peaKm+enp1wiLCBcIuacuuaisOaPkuenp1wiXSxcclxuICAgICAgW1wi5pil5bCP6bqmXCIsIFwi5Yas5bCP6bqmXCJdLFxyXG4gICAgICBbXCLlpI/njonnsbNcIiwgXCLmmKXnjonnsbNcIl0sXHJcbiAgICAgIFtcIuaYpeWto+iWr1wiLCBcIuWkj+Wto+iWr1wiLCBcIuWGrOWto+iWr1wiXSxcclxuICAgICAgW1xyXG4gICAgICAgIFwi5paw6ZmG5pep57O75YiXXCIsXHJcbiAgICAgICAgXCLmlrDpmYbkuK3ns7vliJdcIixcclxuICAgICAgICBcIuS4reWtl+WPt+ajieiKseWTgeenjVwiLFxyXG4gICAgICAgIFwi6bKB5qOJ57O75YiX5ZOB56eNXCIsXHJcbiAgICAgICAgXCLlhoDmo4nns7vliJflk4Hnp41cIlxyXG4gICAgICBdLFxyXG4gICAgICBbXCLmmKXlpKfosYZcIiwgXCLlpI/lpKfosYZcIl0sXHJcbiAgICAgIFtcIuaYpeiKseeUn1wiLCBcIuWkj+iKseeUn1wiXSxcclxuICAgICAgW1xyXG4gICAgICAgIFwi55Wq6IyEXCIsXHJcbiAgICAgICAgXCLovqPmpJJcIixcclxuICAgICAgICBcIui+o+akklwiLFxyXG4gICAgICAgIFwi55Sc5qSSXCIsXHJcbiAgICAgICAgXCLojITlrZBcIixcclxuICAgICAgICBcIum7hOeTnFwiLFxyXG4gICAgICAgIFwi6LGH6LGGXCIsXHJcbiAgICAgICAgXCLoj5zosYZcIixcclxuICAgICAgICBcIueUmOiTnVwiLFxyXG4gICAgICAgIFwi5Yas55OcXCIsXHJcbiAgICAgICAgXCLljZfnk5xcIixcclxuICAgICAgICBcIueUnOeTnFwiLFxyXG4gICAgICAgIFwi6KW/55OcXCIsXHJcbiAgICAgICAgXCLokbFcIixcclxuICAgICAgICBcIuWnnFwiLFxyXG4gICAgICAgIFwi6JKcXCJcclxuICAgICAgXSxcclxuICAgICAgW1wi5pep54af5ZOB56eNXCIsIFwi5Lit54af5ZOB56eNXCIsIFwi5pma54af5ZOB56eNXCJdLFxyXG4gICAgICBbXHJcbiAgICAgICAgXCLmoqjmoJFcIixcclxuICAgICAgICBcIuahg+agkVwiLFxyXG4gICAgICAgIFwi6I2U5p6dXCIsXHJcbiAgICAgICAgXCLmqLHmoYNcIixcclxuICAgICAgICBcIuiKkuaenFwiLFxyXG4gICAgICAgIFwi6Iqx5Y2JXCIsXHJcbiAgICAgICAgXCLmsrnoj5xcIixcclxuICAgICAgICBcIuiMtuWPtlwiLFxyXG4gICAgICAgIFwi6JGh6JCEXCIsXHJcbiAgICAgICAgXCLng5/ojYlcIlxyXG4gICAgICBdXHJcbiAgICBdLFxyXG4gICAgYXJyYXlMZXZlbDogW1wi55yB57qn57uP6ZSA5ZWGXCIsIFwi5Zyw5biC57qn57uP6ZSA5ZWGXCIsIFwi5Y6/57qn57uP6ZSA5ZWGXCIsIFwi5Lmh6ZWHL+mbtuWUrue7j+mUgOWVhlwiXSxcclxuICAgIHJvbGU6IG51bGwsXHJcbiAgICBzZW5kQnRuOiBmYWxzZSxcclxuICAgIGxpbWl0VGltZTogNjAsXHJcbiAgICBkaXNhYmxlZDogdHJ1ZSxcclxuICAgIGNsYXNzaWZ5QXJ5OiBbXCLnu4/plIDllYbkvJpcIiwgXCLlhpzmsJHkvJpcIiwgXCLop4LmkankvJpcIiwgXCLkv4PplIDkvJpcIiwgXCLlhbbku5bkvJrorq5cIl0sXHJcbiAgICBnb29kczogW3sgYXJlYTogXCJcIiwgY3JvcHNDYXRlZ29yeTogXCJcIiB9XSxcclxuICAgIHR5cGU6IG51bGwsXHJcbiAgICBmb3JtRGF0YToge30sXHJcbiAgICBkYXRlOiBcIjIwMTYtMDktMDFcIixcclxuICAgIHRpbWVzOiBcIjIwMjAtMDctMjkgMTI6NTBcIixcclxuICAgIC8vIOaXtumXtOmAieaLqeWZqOWPguaVsFxyXG4gICAgeWVhcnM6IFtdLFxyXG4gICAgbW9udGhzOiBbXSxcclxuICAgIGRheXM6IFtdLFxyXG4gICAgaG91cnM6IFtdLFxyXG4gICAgbWludXRlczogW10sXHJcbiAgICBzZWNvbmQ6IFtdLFxyXG4gICAgbXVsdGlBcnJheTogW10sIC8vIOmAieaLqeiMg+WbtFxyXG4gICAgbXVsdGlJbmRleDogWzAsIDksIDE2LCAxMywgMTddLCAvLyDpgInkuK3lgLzmlbDnu4RcclxuICAgIGNob29zZV95ZWFyOiBcIlwiLFxyXG4gICAgeWVhckluZGV4OiAwLFxyXG4gICAgYWRkcmVzczogW10sXHJcbiAgICBjb2RlTmFtZTogXCLojrflj5bpqozor4HnoIFcIixcclxuICAgIGluZGV4czogbnVsbFxyXG4gIH07XHJcbiAgLy8g5beu5LiA5L2N6KGl5L2NXHJcbiAgdGltZXNGdW4odCkge1xyXG4gICAgaWYgKHQgPCAxMCkgcmV0dXJuIFwiMFwiICsgdDtcclxuICAgIGVsc2UgcmV0dXJuIHQ7XHJcbiAgfVxyXG5cclxuICAvLyDorr7nva7liJ3lp4vlgLxcclxuICBzZXR0aW1lc0RhdGUoKSB7XHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgIGxldCBfeWVhckluZGV4ID0gMDtcclxuICAgIC8vIOm7mOiupOiuvue9rlxyXG4gICAgY29uc29sZS5pbmZvKHRoaXMudGltZXMpO1xyXG4gICAgbGV0IF9kZWZhdWx0WWVhciA9IHRoaXMudGltZXMgPyB0aGlzLnRpbWVzLnNwbGl0KFwiLVwiKVswXSA6IDA7XHJcbiAgICAvLyDojrflj5blubRcclxuICAgIGZvciAobGV0IGkgPSBkYXRlLmdldEZ1bGxZZWFyKCk7IGkgPD0gZGF0ZS5nZXRGdWxsWWVhcigpICsgNTsgaSsrKSB7XHJcbiAgICAgIHRoaXMueWVhcnMucHVzaChcIlwiICsgaSk7XHJcbiAgICAgIC8vIOm7mOiupOiuvue9rueahOW5tOeahOS9jee9rlxyXG4gICAgICBpZiAoX2RlZmF1bHRZZWFyICYmIGkgPT09IHBhcnNlSW50KF9kZWZhdWx0WWVhcikpIHtcclxuICAgICAgICB0aGlzLnllYXJJbmRleCA9IF95ZWFySW5kZXg7XHJcbiAgICAgICAgdGhpcy5jaG9vc2VfeWVhciA9IF9kZWZhdWx0WWVhcjtcclxuICAgICAgfVxyXG4gICAgICBfeWVhckluZGV4ID0gX3llYXJJbmRleCArIDE7XHJcbiAgICB9XHJcbiAgICAvLyDojrflj5bmnIjku71cclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDEyOyBpKyspIHtcclxuICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgIGkgPSBcIjBcIiArIGk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5tb250aHMucHVzaChcIlwiICsgaSk7XHJcbiAgICB9XHJcbiAgICAvLyDojrflj5bml6XmnJ9cclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDMxOyBpKyspIHtcclxuICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgIGkgPSBcIjBcIiArIGk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5kYXlzLnB1c2goXCJcIiArIGkpO1xyXG4gICAgfVxyXG4gICAgLy8gLy8g6I635Y+W5bCP5pe2XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI0OyBpKyspIHtcclxuICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgIGkgPSBcIjBcIiArIGk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5ob3Vycy5wdXNoKFwiXCIgKyBpKTtcclxuICAgIH1cclxuICAgIC8vIC8vIOiOt+WPluWIhumSn1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2MDsgaSsrKSB7XHJcbiAgICAgIGlmIChpIDwgMTApIHtcclxuICAgICAgICBpID0gXCIwXCIgKyBpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMubWludXRlcy5wdXNoKFwiXCIgKyBpKTtcclxuICAgIH1cclxuICAgIC8vIC8vIOiOt+WPluenkuaVsFxyXG4gICAgLy8gZm9yIChsZXQgaSA9IDA7IGkgPCA2MDsgaSsrKSB7XHJcbiAgICAvLyAgIGlmIChpIDwgMTApIHtcclxuICAgIC8vICAgICBpID0gJzAnICsgaVxyXG4gICAgLy8gICB9XHJcbiAgICAvLyAgIHRoaXMuc2Vjb25kLnB1c2goJycgKyBpKVxyXG4gICAgLy8gfVxyXG4gIH1cclxuICBzZXRUaW1lKCkge1xyXG4gICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgaWYgKHRoaXMubGltaXRUaW1lIDw9IDApIHtcclxuICAgICAgdGhpcy5saW1pdFRpbWUgPSA2MDtcclxuICAgICAgdGhpcy5zZW5kQnRuID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuY29kZU5hbWUgPSBcIumHjeaWsOiOt+WPllwiO1xyXG4gICAgICB0aGlzLnNlbmRCdG4gPSBmYWxzZTtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuY2xzVGltZW91dCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNlbmRCdG4gPSB0cnVlO1xyXG4gICAgICB0aGlzLmxpbWl0VGltZS0tO1xyXG4gICAgICB0aGlzLmNvZGVOYW1lID0gdGhpcy5saW1pdFRpbWUgKyBcInPph43mlrDojrflj5ZcIjtcclxuICAgICAgdGhpcy5jbHNUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGF0LnNldFRpbWUoKTtcclxuICAgICAgICB0aGF0LiRhcHBseSgpO1xyXG4gICAgICB9LCAxMDAwKTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8g6L+U5Zue5pyI5Lu955qE5aSp5pWwXHJcbiAgc2V0RGF5cyhzZWxlY3RZZWFyLCBzZWxlY3RNb250aCkge1xyXG4gICAgbGV0IG51bSA9IHNlbGVjdE1vbnRoO1xyXG4gICAgbGV0IHRlbXAgPSBbXTtcclxuICAgIGlmIChcclxuICAgICAgbnVtID09PSAxIHx8XHJcbiAgICAgIG51bSA9PT0gMyB8fFxyXG4gICAgICBudW0gPT09IDUgfHxcclxuICAgICAgbnVtID09PSA3IHx8XHJcbiAgICAgIG51bSA9PT0gOCB8fFxyXG4gICAgICBudW0gPT09IDEwIHx8XHJcbiAgICAgIG51bSA9PT0gMTJcclxuICAgICkge1xyXG4gICAgICAvLyDliKTmlq0zMeWkqeeahOaciOS7vVxyXG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSAzMTsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgICAgaSA9IFwiMFwiICsgaTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGVtcC5wdXNoKFwiXCIgKyBpKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChudW0gPT09IDQgfHwgbnVtID09PSA2IHx8IG51bSA9PT0gOSB8fCBudW0gPT09IDExKSB7XHJcbiAgICAgIC8vIOWIpOaWrTMw5aSp55qE5pyI5Lu9XHJcbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDMwOyBpKyspIHtcclxuICAgICAgICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgICBpID0gXCIwXCIgKyBpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0ZW1wLnB1c2goXCJcIiArIGkpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKG51bSA9PT0gMikge1xyXG4gICAgICAvLyDliKTmlq0y5pyI5Lu95aSp5pWwXHJcbiAgICAgIGxldCB5ZWFyID0gcGFyc2VJbnQoc2VsZWN0WWVhcik7XHJcbiAgICAgIGNvbnNvbGUubG9nKHllYXIpO1xyXG4gICAgICBpZiAoKHllYXIgJSA0MDAgPT09IDAgfHwgeWVhciAlIDEwMCAhPT0gMCkgJiYgeWVhciAlIDQgPT09IDApIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSAyOTsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgICAgIGkgPSBcIjBcIiArIGk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0ZW1wLnB1c2goXCJcIiArIGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSAyODsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgICAgIGkgPSBcIjBcIiArIGk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0ZW1wLnB1c2goXCJcIiArIGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRlbXA7XHJcbiAgfVxyXG4gIC8vIOiuvue9rum7mOiupOWAvCDmoLzlvI8yMDE5LTA3LTEwIDEwOjMwXHJcbiAgc2V0RGVmYXVsdHRpbWVzKCkge1xyXG4gICAgbGV0IGFsbERhdGVMaXN0ID0gdGhpcy50aW1lcy5zcGxpdChcIiBcIik7XHJcbiAgICAvLyDml6XmnJ9cclxuICAgIGxldCBkYXRlTGlzdCA9IGFsbERhdGVMaXN0WzBdLnNwbGl0KFwiLVwiKTtcclxuICAgIGxldCBtb250aCA9IHBhcnNlSW50KGRhdGVMaXN0WzFdKSAtIDE7XHJcbiAgICBsZXQgZGF5ID0gcGFyc2VJbnQoZGF0ZUxpc3RbMl0pIC0gMTtcclxuICAgIC8vIOaXtumXtFxyXG4gICAgbGV0IHRpbWVzTGlzdCA9IGFsbERhdGVMaXN0WzFdLnNwbGl0KFwiOlwiKTtcclxuICAgIHRoaXMubXVsdGlBcnJheVsyXSA9IHRoaXMuc2V0RGF5cyhkYXRlTGlzdFswXSwgcGFyc2VJbnQoZGF0ZUxpc3RbMV0pKTtcclxuICAgIHRoaXMubXVsdGlJbmRleCA9IFt0aGlzLnllYXJJbmRleCwgbW9udGgsIGRheSwgdGltZXNMaXN0WzBdLCB0aW1lc0xpc3RbMV1dO1xyXG4gIH1cclxuICAvLyDojrflj5bml7bpl7Tml6XmnJ9cclxuICBQaWNrZXJDaGFuZ2UoZSkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3BpY2tlcuWPkemAgemAieaLqeaUueWPmO+8jOaQuuW4puWAvOS4uicsIGUuZGV0YWlsLnZhbHVlKVxyXG4gICAgdGhpcy5tdWx0aUluZGV4ID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICBjb25zdCBpbmRleCA9IHRoaXMubXVsdGlJbmRleDtcclxuICAgIGNvbnN0IHllYXIgPSB0aGlzLm11bHRpQXJyYXlbMF1baW5kZXhbMF1dO1xyXG4gICAgY29uc3QgbW9udGggPSB0aGlzLm11bHRpQXJyYXlbMV1baW5kZXhbMV1dO1xyXG4gICAgY29uc3QgZGF5ID0gdGhpcy5tdWx0aUFycmF5WzJdW2luZGV4WzJdXTtcclxuICAgIGNvbnN0IGhvdXIgPSB0aGlzLm11bHRpQXJyYXlbM11baW5kZXhbM11dO1xyXG4gICAgY29uc3QgbWludXRlID0gdGhpcy5tdWx0aUFycmF5WzRdW2luZGV4WzRdXTtcclxuICAgIC8vIGNvbnN0IHNlY29uZCA9IHRoaXMubXVsdGlBcnJheVs1XVtpbmRleFs1XV1cclxuICAgIC8vIGNvbnNvbGUubG9nKGAke3llYXJ9LSR7bW9udGh9LSR7ZGF5fS0ke2hvdXJ9LSR7bWludXRlfWApO1xyXG4gICAgdGhpcy50aW1lcyA9IHllYXIgKyBcIi1cIiArIG1vbnRoICsgXCItXCIgKyBkYXkgKyBcIiBcIiArIGhvdXIgKyBcIjpcIiArIG1pbnV0ZTtcclxuICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICByZXR1cm4gdGhpcy50aW1lcztcclxuICB9XHJcbiAgaXNQaG9uZShzdHIpIHtcclxuICAgIGNvbnN0IHJlZyA9IC9eWzFdWzMsNCw1LDcsOF1bMC05XXs5fSQvO1xyXG4gICAgcmV0dXJuIHJlZy50ZXN0KHN0cik7XHJcbiAgfVxyXG4gIGdldFZhbGlkQ29kZSgpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIGlmICh0aGlzLnNlbmRCdG4gPT09IHRydWUpIHJldHVybjtcclxuICAgIGlmICh0aGlzLmlzUGhvbmUodGhpcy5mb3JtRGF0YS5waG9uZU51bSkgPT09IGZhbHNlKSB7XHJcbiAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgdGl0bGU6IFwi5o+Q56S6XCIsXHJcbiAgICAgICAgY29udGVudDogXCLmiYvmnLrlj7fmoLzlvI/kuI3mraPnoa5cIixcclxuICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdHJ5IHtcclxuICAgICAgd3guc2hvd0xvYWRpbmcoe1xyXG4gICAgICAgIHRpdGxlOiBcIuWPkemAgeS4rSzor7fnrYnlvoUuLi5cIlxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShcInd4L3NlbmRWZXJpZmljYXRpb25Db2RlQXBpLmpzb25cIiwge1xyXG4gICAgICAgIHBob25lTnVtOiB0aGlzLmZvcm1EYXRhLnBob25lTnVtXHJcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHd4LnNob3dUb2FzdCh7XHJcbiAgICAgICAgICB0aXRsZTogXCLlj5HpgIHmiJDlip/or7fmn6XmlLZcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoYXQuc2VuZEJ0biA9IHRydWU7XHJcbiAgICAgICAgdGhhdC4kYXBwbHkoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMuc2V0VGltZSgpO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICB0aGF0LnNlbmRCdG4gPSBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcbiAgbWV0aG9kcyA9IHtcclxuICAgIGdldEluZGV4KGUpIHtcclxuICAgICAgdGhpcy5pbmRleCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4O1xyXG4gICAgfSxcclxuICAgIGdldGFyZWE6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgIGxldCB2YWx1ZSA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICB0aGlzLmdvb2RzW3RoaXMuaW5kZXhdW1wiYXJlYVwiXSA9IHZhbHVlO1xyXG4gICAgfSxcclxuICAgIGdldEdvb2RzMihlKSB7XHJcbiAgICAgIGxldCB2YWx1ZSA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmdvb2RzW3RoaXMuaW5kZXhdLmdvb2RzQXJ5W3ZhbHVlXS5sZW5ndGgpO1xyXG4gICAgICB0aGlzLmdvb2RzW3RoaXMuaW5kZXhdW1wiY3JvcHNDYXRlZ29yeTJcIl0gPVxyXG4gICAgICAgIHRoaXMuZ29vZHNbdGhpcy5pbmRleF0uZ29vZHNBcnlbdmFsdWVdLmxlbmd0aCA+IDRcclxuICAgICAgICAgID8gdGhpcy5nb29kc1t0aGlzLmluZGV4XS5nb29kc0FyeVt2YWx1ZV0uc3Vic3RyaW5nKDAsIDQpXHJcbiAgICAgICAgICA6IHRoaXMuZ29vZHNbdGhpcy5pbmRleF0uZ29vZHNBcnlbdmFsdWVdO1xyXG4gICAgfSxcclxuICAgIGdldEdvb2RzOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICBsZXQgdmFsdWUgPSBlLmRldGFpbC52YWx1ZTtcclxuICAgICAgdGhpcy5nb29kc1t0aGlzLmluZGV4XS5nb29kc0FyeSA9IHRoaXMudHdvW3ZhbHVlXTtcclxuICAgICAgdGhpcy5nb29kc1t0aGlzLmluZGV4XVtcImNyb3BzQ2F0ZWdvcnkxXCJdID0gdGhpcy5vbmVbdmFsdWVdO1xyXG4gICAgICB0aGlzLmdvb2RzW3RoaXMuaW5kZXhdW1wiY3JvcHNDYXRlZ29yeTJcIl0gPSBcIlwiO1xyXG4gICAgfSxcclxuICAgIGFkZEZ1bigpIHtcclxuICAgICAgaWYgKHRoaXMuZ29vZHMubGVuZ3RoID49IDUpIHtcclxuICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgdGl0bGU6IFwi5o+Q56S6XCIsXHJcbiAgICAgICAgICBjb250ZW50OiBcIuenjeakjeS9nOeJqeacgOWkmjXnp41cIixcclxuICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuZ29vZHMucHVzaCh7IGFyZWE6IFwiXCIsIGNyb3BzQ2F0ZWdvcnk6IFwiXCIgfSk7XHJcbiAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICB9LFxyXG4gICAgZGVsKGUpIHtcclxuICAgICAgdGhpcy5nb29kcy5zcGxpY2UoZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXgsIDEpO1xyXG4gICAgfSxcclxuICAgIC8vIOiOt+WPlumqjOivgeeggVxyXG4gICAgc2VuZEZ1bigpIHtcclxuICAgICAgdGhpcy5nZXRWYWxpZENvZGUoKTtcclxuICAgIH0sXHJcbiAgICBjaG9vc2VMb2NhdGlvbigpIHtcclxuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICB3eC5nZXRMb2NhdGlvbih7XHJcbiAgICAgICAgdHlwZTogXCJ3Z3M4NFwiLFxyXG4gICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICB3eC5jaG9vc2VMb2NhdGlvbih7XHJcbiAgICAgICAgICAgIGxhdGl0dWRlOiByZXMubGF0aXR1ZGUsXHJcbiAgICAgICAgICAgIGxvbmdpdHVkZTogcmVzLmxvbmdpdHVkZSxcclxuICAgICAgICAgICAgc3VjY2VzcyhyZXN0KSB7XHJcbiAgICAgICAgICAgICAgLy/lj5HpgIHor7fmsYLpgJrov4fnu4/nuqzluqblj43mn6XlnLDlnYDkv6Hmga9cclxuICAgICAgICAgICAgICB0aGF0XHJcbiAgICAgICAgICAgICAgICAuZmV0Y2hEYXRhUHJvbWlzZShcInJlc29sdmVMb2NhdGlvbkFwaS5qc29uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgbGF0aXR1ZGU6IHJlc3QubGF0aXR1ZGUsXHJcbiAgICAgICAgICAgICAgICAgIGxvbmdpdHVkZTogcmVzdC5sb25naXR1ZGVcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgIHRoYXQuYWRkcmVzcyA9IFtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLnByb3ZpbmNlTmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLmNpdHlOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuZGlzdHJpY3ROYW1lXHJcbiAgICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICAgIHRoYXQuZm9ybURhdGEuYWRkcmVzcyA9IGRhdGEuYWRkcmVzcztcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGdldFJlbWFyayhlKSB7XHJcbiAgICAgIHRoaXMuZm9ybURhdGEuYXBwbHlSZWFzb24gPSBlLmRldGFpbC52YWx1ZTtcclxuICAgIH0sXHJcbiAgICBiaW5kTGV2ZXJDaGFuZ2UoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgdGhpcy5mb3JtRGF0YS5kZWFsZXJMZXZlbCA9IHRoaXMuYXJyYXlMZXZlbFtlLmRldGFpbC52YWx1ZV07XHJcbiAgICB9LFxyXG4gICAgYmluZFJlZ2lvbkNoYW5nZShlKSB7XHJcbiAgICAgIHRoaXMuYWRkcmVzcyA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICB0aGlzLmZvcm1EYXRhLmFkZHJlc3MgPSBcIlwiO1xyXG4gICAgfSxcclxuICAgIGNoYW5nZUNsYXNzaWZ5KGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgIHRoaXMuZm9ybURhdGEuY2xhc3NpZnkgPSBlLmRldGFpbC52YWx1ZTtcclxuICAgIH0sXHJcbiAgICBnZXRDb2RlKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgIHRoaXMuZm9ybURhdGEuY29kZSA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgfSxcclxuICAgIC8vIOebkeWQrHBpY2tlcueahOa7muWKqOS6i+S7tlxyXG4gICAgYmluZE11bHRpUGlja2VyQ29sdW1uQ2hhbmdlKGUpIHtcclxuICAgICAgLy8g6I635Y+W5bm05Lu9XHJcbiAgICAgIGlmIChlLmRldGFpbC5jb2x1bW4gPT09IDApIHtcclxuICAgICAgICB0aGlzLmNob29zZV95ZWFyID0gdGhpcy5tdWx0aUFycmF5W2UuZGV0YWlsLmNvbHVtbl1bZS5kZXRhaWwudmFsdWVdO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY2hvb3NlX3llYXIpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCfkv67mlLnnmoTliJfkuLonLCBlLmRldGFpbC5jb2x1bW4sICfvvIzlgLzkuLonLCBlLmRldGFpbC52YWx1ZSk7XHJcbiAgICAgIC8vIOiuvue9ruaciOS7veaVsOe7hFxyXG4gICAgICBpZiAoZS5kZXRhaWwuY29sdW1uID09PSAxKSB7XHJcbiAgICAgICAgbGV0IG51bSA9IHBhcnNlSW50KHRoaXMubXVsdGlBcnJheVtlLmRldGFpbC5jb2x1bW5dW2UuZGV0YWlsLnZhbHVlXSk7XHJcbiAgICAgICAgdGhpcy5tdWx0aUFycmF5WzJdID0gdGhpcy5zZXREYXlzKHRoaXMuY2hvb3NlX3llYXIsIG51bSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMubXVsdGlJbmRleFtlLmRldGFpbC5jb2x1bW5dID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICB9LFxyXG4gICAgYmluZFN0YXJ0Q2hhbmdlKGUpIHtcclxuICAgICAgdGhpcy5mb3JtRGF0YS5zdGFydERhdGUxID0gdGhpcy5QaWNrZXJDaGFuZ2UoZSk7XHJcbiAgICB9LFxyXG4gICAgYmluZEVuZENoYW5nZShlKSB7XHJcbiAgICAgIHRoaXMuZm9ybURhdGEuZW5kRGF0ZTEgPSB0aGlzLlBpY2tlckNoYW5nZShlKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8g6I635Y+W5pe26Ze0XHJcbiAgICBnZXR0aW1lcyh0aW1lcykge1xyXG4gICAgICBjb25zb2xlLmxvZyh0aW1lcyk7XHJcbiAgICB9LFxyXG4gICAgc2hvd0FkZHJDaG9zZSgpIHtcclxuICAgICAgLy/mmL7npLrnnIHluILljLrogZTliqjpgInmi6nmoYZcclxuICAgICAgdGhpcy5pc1Nob3dBZGRyZXNzQ2hvc2UgPSAhdGhpcy5kYXRhLmlzU2hvd0FkZHJlc3NDaG9zZTtcclxuICAgIH0sXHJcbiAgICBjYW5jZWwoKSB7XHJcbiAgICAgIC8v5Y+W5raIXHJcbiAgICAgIHRoaXMuaXNTaG93QWRkcmVzc0Nob3NlID0gZmFsc2U7XHJcbiAgICB9LFxyXG4gICAgZmluaXNoKCkge1xyXG4gICAgICAvL+WujOaIkFxyXG4gICAgICB0aGlzLmlzU2hvd0FkZHJlc3NDaG9zZSA9IGZhbHNlO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXROYW1lKGUpIHtcclxuICAgICAgLy/ojrflvpfkvJrorq7lkI3np7BcclxuICAgICAgdGhpcy5mb3JtRGF0YS5hZGRyZXNzZWUgPSBlLmRldGFpbC52YWx1ZTtcclxuICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgIH0sXHJcbiAgICBnZXROdW1iZXIoZSkge1xyXG4gICAgICB0aGlzLmZvcm1EYXRhLmFwcGx5Q291bnQgPSBlLmRldGFpbC52YWx1ZTtcclxuICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgIH0sXHJcbiAgICBnZXRwaG9uZU51bShlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUuZGV0YWlsLnZhbHVlKTtcclxuICAgICAgdGhpcy5mb3JtRGF0YS5waG9uZU51bSA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgfSxcclxuICAgIGdldENvbnRlbnQoZSkge1xyXG4gICAgICAvL+iOt+W+l+WFqOmDqOWGheWuuVxyXG4gICAgICB0aGlzLmZvcm1EYXRhLmNvbnRlbnQgPSBlLmRldGFpbC52YWx1ZTtcclxuICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgIH0sXHJcbiAgICBnZXRsZWFkZXIoZSkge1xyXG4gICAgICAvL+iOt+W+l+mihuWvvFxyXG4gICAgICB0aGlzLmZvcm1EYXRhLmxlYWRlciA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgfSxcclxuICAgIGdldGNvbXBhbnlOYW1lKGUpIHtcclxuICAgICAgdGhpcy5mb3JtRGF0YS5jb21wYW55TmFtZSA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgfSxcclxuICAgIGdldGFkZHJlc3MoZSkge1xyXG4gICAgICAvL+iOt+W+l+mihuWvvFxyXG4gICAgICB0aGlzLmZvcm1EYXRhLmFkZHJlc3MgPSBlLmRldGFpbC52YWx1ZTtcclxuICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgIH0sXHJcbiAgICBnZXR1c2VyQ291bnQoZSkge1xyXG4gICAgICAvL+iOt+W+l+mihuWvvFxyXG4gICAgICB0aGlzLmZvcm1EYXRhLnVzZXJDYXBhY2l0eSA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgfSxcclxuICAgIHNhdmUoKSB7XHJcbiAgICAgIC8v5L+d5a2YXHJcbiAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgIHRoaXMuZm9ybURhdGEubW9iaWxlID0gdGhpcy5mb3JtRGF0YS5waG9uZU51bTtcclxuICAgICAgaWYgKCFzZWxmLmZvcm1EYXRhLmFkZHJlc3NlZSB8fCBzZWxmLmZvcm1EYXRhLmFkZHJlc3NlZSA9PSBcIlwiKSB7XHJcbiAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgIHRpdGxlOiBcIuaPkOekulwiLFxyXG4gICAgICAgICAgY29udGVudDogXCLlp5PlkI3lv4XloatcIixcclxuICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9IGVsc2UgaWYgKCFzZWxmLmZvcm1EYXRhLmFwcGx5Q291bnQgfHwgc2VsZi5mb3JtRGF0YS5hcHBseUNvdW50ID09IFwiXCIpIHtcclxuICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgdGl0bGU6IFwi5o+Q56S6XCIsXHJcbiAgICAgICAgICBjb250ZW50OiBcIueUs+ivt+aVsOmHj+W/heWhq1wiLFxyXG4gICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgc2VsZi5yb2xlID09PSBcIjNcIiAmJlxyXG4gICAgICAgICghc2VsZi5mb3JtRGF0YS5jb21wYW55TmFtZSB8fCBzZWxmLmZvcm1EYXRhLmNvbXBhbnlOYW1lID09IFwiXCIpXHJcbiAgICAgICkge1xyXG4gICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICB0aXRsZTogXCLmj5DnpLpcIixcclxuICAgICAgICAgIGNvbnRlbnQ6IFwi5YWs5Y+45ZCN56ew5b+F5aGrXCIsXHJcbiAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICBzZWxmLnJvbGUgPT09IFwiM1wiICYmXHJcbiAgICAgICAgKCFzZWxmLmZvcm1EYXRhLmRlYWxlckxldmVsIHx8IHNlbGYuZm9ybURhdGEuZGVhbGVyTGV2ZWwgPT0gXCJcIilcclxuICAgICAgKSB7XHJcbiAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgIHRpdGxlOiBcIuaPkOekulwiLFxyXG4gICAgICAgICAgY29udGVudDogXCLnrYnnuqflv4XpgIlcIixcclxuICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9IGVsc2UgaWYgKFxyXG4gICAgICAgICFzZWxmLmFkZHJlc3MgfHxcclxuICAgICAgICBzZWxmLmFkZHJlc3MgPT0gXCJcIiB8fFxyXG4gICAgICAgIHNlbGYuYWRkcmVzcy5sZW5ndGggPT09IDBcclxuICAgICAgKSB7XHJcbiAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgIHRpdGxlOiBcIuaPkOekulwiLFxyXG4gICAgICAgICAgY29udGVudDogXCLor7fpgInmi6nlnLDlnYBcIixcclxuICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9IGVsc2UgaWYgKCFzZWxmLmZvcm1EYXRhLmFkZHJlc3MgfHwgc2VsZi5mb3JtRGF0YS5hZGRyZXNzID09IFwiXCIpIHtcclxuICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgdGl0bGU6IFwi5o+Q56S6XCIsXHJcbiAgICAgICAgICBjb250ZW50OiBcIuivpue7huWcsOWdgOW/heWhq1wiLFxyXG4gICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH0gZWxzZSBpZiAoIXNlbGYuZm9ybURhdGEubW9iaWxlIHx8IHNlbGYuZm9ybURhdGEubW9iaWxlID09IFwiXCIpIHtcclxuICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgdGl0bGU6IFwi5o+Q56S6XCIsXHJcbiAgICAgICAgICBjb250ZW50OiBcIuaJi+acuuWPt+W/heWhq1wiLFxyXG4gICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc1Bob25lKHRoaXMuZm9ybURhdGEubW9iaWxlKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgdGl0bGU6IFwi5o+Q56S6XCIsXHJcbiAgICAgICAgICBjb250ZW50OiBcIuaJi+acuuWPt+agvOW8j+S4jeato+ehrlwiLFxyXG4gICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH0gZWxzZSBpZiAoIXNlbGYuZm9ybURhdGEuY29kZSB8fCBzZWxmLmZvcm1EYXRhLmNvZGUgPT0gXCJcIikge1xyXG4gICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICB0aXRsZTogXCLmj5DnpLpcIixcclxuICAgICAgICAgIGNvbnRlbnQ6IFwi6aqM6K+B56CB5b+F5aGrXCIsXHJcbiAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICAvLyBlbHNlIGlmIChcclxuICAgICAgLy8gICAhc2VsZi5mb3JtRGF0YS5hcHBseVJlYXNvbiB8fFxyXG4gICAgICAvLyAgIHNlbGYuZm9ybURhdGEuYXBwbHlSZWFzb24gPT0gXCJcIlxyXG4gICAgICAvLyApIHtcclxuICAgICAgLy8gICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAvLyAgICAgdGl0bGU6IFwi5o+Q56S6XCIsXHJcbiAgICAgIC8vICAgICBjb250ZW50OiBcIueUs+ivt+WOn+WboOW/heWhq1wiLFxyXG4gICAgICAvLyAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgLy8gICB9KTtcclxuICAgICAgLy8gICByZXR1cm47XHJcbiAgICAgIC8vIH1cclxuICAgICAgaWYgKHNlbGYucm9sZSA9PT0gXCIxXCIpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ29vZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGlmICh0aGlzLmdvb2RzW2ldLmFyZWEgPT09IFwiXCIgfHwgdGhpcy5nb29kcy5jcm9wc0NhdGVnb3J5ID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgdGl0bGU6IFwi5o+Q56S6XCIsXHJcbiAgICAgICAgICAgICAgY29udGVudDogXCLnp43mpI3kvZznianlv4XloatcIixcclxuICAgICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICB0aGlzLmdvb2RzID0gdGhpcy5nb29kcy5tYXAoaXRlbSA9PiB7XHJcbiAgICAgICAgY29uc3Qgb2JqID0gaXRlbTtcclxuICAgICAgICBvYmouY3JvcHNDYXRlZ29yeSA9IG9iai5jcm9wc0NhdGVnb3J5MSArIFwiLFwiICsgb2JqLmNyb3BzQ2F0ZWdvcnkyO1xyXG4gICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLmZvcm1EYXRhLmNyb3BzQ2F0ZWdvcnlBbmRBcmVhID0gdGhpcy5nb29kcztcclxuICAgICAgdGhpcy5mb3JtRGF0YS5wcm92aW5jZU5hbWUgPSB0aGlzLmFkZHJlc3NbMF07XHJcbiAgICAgIHRoaXMuZm9ybURhdGEuY2l0eU5hbWUgPSB0aGlzLmFkZHJlc3NbMV07XHJcbiAgICAgIHRoaXMuZm9ybURhdGEuZGlzdHJpY3ROYW1lID0gdGhpcy5hZGRyZXNzWzJdO1xyXG4gICAgICBjb25zb2xlLmxvZyhcInRoaXMuZm9ybURhdGFcIiwgdGhpcy5mb3JtRGF0YSk7XHJcblxyXG4gICAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoXHJcbiAgICAgICAgXCJ3eC9zcGVjaW1lbi9hcHBseVNwZWNpbWVuQXBpLmpzb25cIixcclxuICAgICAgICB0aGlzLmZvcm1EYXRhXHJcbiAgICAgICkudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJkYXRhXCIsIGRhdGEpO1xyXG4gICAgICAgIGlmIChkYXRhLnJlc3VsdCA9PSB0cnVlKSB7XHJcbiAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xyXG4gICAgICAgICAgICB0aXRsZTogXCLmoLflk4HnlLPpoobmiJDlip9cIixcclxuICAgICAgICAgICAgaWNvbjogXCJzdWNjZXNzXCIsXHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiAyMDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHd4Lm5hdmlnYXRlQmFjayh7XHJcbiAgICAgICAgICAgICAgZGVsdGE6IDFcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9LCAyMDAwKTtcclxuICAgICAgICAgIHNlbGYuZm9ybURhdGEgPSB7fTtcclxuICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gdGhpcy5mb3JtRGF0YS5yb2xlID0gdGhpcy5yb2xlO1xyXG4gICAgICAvLyBpZiAoc2VsZi50eXBlID09IFwiZWRpdFwiKSB7XHJcbiAgICAgIC8vICAgdGhpcy5mb3JtRGF0YS51c2VyID0gbnVsbDtcclxuICAgICAgLy8gICB0aGlzLmZldGNoRGF0YVByb21pc2UoXHJcbiAgICAgIC8vICAgICBcIm1lZXRpbmcvd2VjaGF0L3VwZGF0ZU1lZXRpbmdBcGkuanNvblwiLFxyXG4gICAgICAvLyAgICAgdGhpcy5mb3JtRGF0YVxyXG4gICAgICAvLyAgICkudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgIC8vICAgICBzZWxmLmZvcm1EYXRhID0ge307XHJcbiAgICAgIC8vICAgICB3eC5uYXZpZ2F0ZUJhY2soe1xyXG4gICAgICAvLyAgICAgICBkZWx0YTogMVxyXG4gICAgICAvLyAgICAgfSk7XHJcbiAgICAgIC8vICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAvLyAgIH0pO1xyXG4gICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAvLyAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShcInd4L3VwZGF0ZVVzZXJBcGkuanNvblwiLCB0aGlzLmZvcm1EYXRhKS50aGVuKFxyXG4gICAgICAvLyAgICAgZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAvLyAgICAgICBzZWxmLmZvcm1EYXRhID0ge307XHJcbiAgICAgIC8vICAgICAgIHd4Lm5hdmlnYXRlQmFjayh7XHJcbiAgICAgIC8vICAgICAgICAgZGVsdGE6IDFcclxuICAgICAgLy8gICAgICAgfSk7XHJcbiAgICAgIC8vICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgIC8vICAgICB9XHJcbiAgICAgIC8vICAgKTtcclxuICAgICAgLy8gfVxyXG4gICAgfVxyXG4gIH07XHJcbiAgb25TaG93KCkge1xyXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuY2xzVGltZW91dCk7XHJcbiAgfVxyXG4gIC8vIGVuZEZ1biAoKSB7XHJcbiAgLy8gICBpZiAodGhpcy5mb3JtRGF0YS5lbmREYXRlMSkgdGhpcy50aW1lcyA9IHRoaXMuZm9ybURhdGEuZW5kRGF0ZTFcclxuICAvLyB9XHJcbiAgLy8gc3RhcnREYXRlICgpIHtcclxuICAvLyAgIGlmICh0aGlzLmZvcm1EYXRhLnN0YXJ0RGF0ZTEpIHRoaXMudGltZXMgPSB0aGlzLmZvcm1EYXRhLnN0YXJ0RGF0ZTFcclxuICAvLyB9XHJcbiAgd2hlbkFwcFJlYWR5U2hvdygpIHt9XHJcbiAgb25Mb2FkKG9wdGlvbnMpIHtcclxuICAgIGNvbnNvbGUubG9nKFwib3B0aW9uc1wiLCBvcHRpb25zKTtcclxuICAgICh0aGlzLmNvZGVOYW1lID0gXCLojrflj5bpqozor4HnoIFcIiksICh0aGlzLmxpbWl0VGltZSA9IDYwKTtcclxuICAgIHRoaXMuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuY2xzVGltZW91dCk7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICBpZiAob3B0aW9ucy5pZCkge1xyXG4gICAgICB0aGF0LmZvcm1EYXRhLmlkID0gb3B0aW9ucy5pZDtcclxuICAgICAgY29uc29sZS5sb2coXCJ0aGF0LmZvcm1EYXRhLmlkXCIsIHRoYXQuZm9ybURhdGEuaWQpO1xyXG4gICAgfVxyXG4gICAgaWYgKG9wdGlvbnMucm9sZSkge1xyXG4gICAgICB0aGlzLnJvbGUgPSBvcHRpb25zLnJvbGU7XHJcbiAgICAgIHd4LmdldFN0b3JhZ2Uoe1xyXG4gICAgICAgIGtleTogXCJ1c2VySW5mb1wiLFxyXG4gICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShyZXMuZGF0YSk7XHJcbiAgICAgICAgICB0aGF0LmZvcm1EYXRhID0gZGF0YTtcclxuICAgICAgICAgIHRoYXQuZm9ybURhdGEubmFtZSA9IGRhdGEudXNlck5hbWU7XHJcbiAgICAgICAgICB0aGF0LmZvcm1EYXRhLnBob25lTnVtID0gZGF0YS5tb2JpbGU7XHJcbiAgICAgICAgICB0aGF0Lmdvb2RzID0gdGhhdC5mb3JtRGF0YS5jcm9wc0NhdGVnb3J5QW5kQXJlYVxyXG4gICAgICAgICAgICA/IHRoYXQuZm9ybURhdGEuY3JvcHNDYXRlZ29yeUFuZEFyZWFcclxuICAgICAgICAgICAgOiBbeyBhcmVhOiBcIlwiLCBjcm9wc0NhdGVnb3J5OiBcIlwiIH1dO1xyXG4gICAgICAgICAgaWYgKCF0aGF0LmZvcm1EYXRhLmxhdGl0dWRlKSB7XHJcbiAgICAgICAgICAgIHd4LmdldExvY2F0aW9uKHtcclxuICAgICAgICAgICAgICB0eXBlOiBcImdjajAyXCIsXHJcbiAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoYXQuZm9ybURhdGEubGF0aXR1ZGUgPSByZXMubGF0aXR1ZGU7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmZvcm1EYXRhLmxvbmdpdHVkZSA9IHJlcy5sb25naXR1ZGU7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBmYWlsOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoYXQuYWRkcmVzcyA9ICF0aGF0LmZvcm1EYXRhLnByb3ZpbmNlTmFtZVxyXG4gICAgICAgICAgICA/IFtdXHJcbiAgICAgICAgICAgIDogW1xyXG4gICAgICAgICAgICAgICAgdGhhdC5mb3JtRGF0YS5wcm92aW5jZU5hbWUsXHJcbiAgICAgICAgICAgICAgICB0aGF0LmZvcm1EYXRhLmNpdHlOYW1lLFxyXG4gICAgICAgICAgICAgICAgdGhhdC5mb3JtRGF0YS5kaXN0cmljdE5hbWVcclxuICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgdGhhdC4kYXBwbHkoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6I635Y+W57uP57qs5bqmXHJcbiAgICB0aGlzLnRpbWVzID1cclxuICAgICAgbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpICtcclxuICAgICAgXCItXCIgK1xyXG4gICAgICB0aGlzLnRpbWVzRnVuKG5ldyBEYXRlKCkuZ2V0TW9udGgoKSArIDEpICtcclxuICAgICAgXCItXCIgK1xyXG4gICAgICB0aGlzLnRpbWVzRnVuKG5ldyBEYXRlKCkuZ2V0RGF0ZSgpKSArXHJcbiAgICAgIFwiIFwiICtcclxuICAgICAgXCIxMlwiO1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgLy8gaWYgKG9wdGlvbnMuaXRlbSkge1xyXG4gICAgLy8gICB3eC5zZXROYXZpZ2F0aW9uQmFyVGl0bGUoe1xyXG4gICAgLy8gICAgIHRpdGxlOiAn57yW6L6R5Lya6K6uJ1xyXG4gICAgLy8gICB9KVxyXG4gICAgLy8gICB0aGF0LnR5cGUgPSAnZWRpdCdcclxuICAgIC8vICAgdGhpcy5mb3JtRGF0YSA9IEpTT04ucGFyc2Uob3B0aW9ucy5pdGVtKVxyXG4gICAgLy8gICB0aGlzLmZvcm1EYXRhLnN0YXJ0RGF0ZTEgPSB0aGlzLmZvcm1EYXRhLnN0YXJ0RGF0ZTEuc3BsaXQoJyAnKVswXSArICcgJyArIHRoaXMuZm9ybURhdGEuc3RhcnREYXRlMS5zcGxpdCgnICcpWzFdLnNwbGl0KCc6JylbMF1cclxuICAgIC8vICAgdGhpcy5mb3JtRGF0YS5lbmREYXRlMSA9IHRoaXMuZm9ybURhdGEuZW5kRGF0ZTEuc3BsaXQoJyAnKVswXSArICcgJyArIHRoaXMuZm9ybURhdGEuc3RhcnREYXRlMS5zcGxpdCgnICcpWzFdLnNwbGl0KCc6JylbMF1cclxuICAgIC8vICAgdGhpcy50aW1lcyA9IHRoaXMuZm9ybURhdGEuc3RhcnREYXRlMVxyXG4gICAgLy8gfVxyXG5cclxuICAgIHRoaXMuc2V0dGltZXNEYXRlKCk7XHJcbiAgICAvLyB0aGlzLm11bHRpQXJyYXkgPSBbdGhpcy55ZWFycywgdGhpcy5tb250aHMsIHRoaXMuZGF5cywgdGhpcy5ob3VycywgdGhpcy5taW51dGVzLCB0aGlzLnNlY29uZF1cclxuICAgIHRoaXMubXVsdGlBcnJheSA9IFtcclxuICAgICAgdGhpcy55ZWFycyxcclxuICAgICAgdGhpcy5tb250aHMsXHJcbiAgICAgIHRoaXMuZGF5cyxcclxuICAgICAgdGhpcy5ob3VycyxcclxuICAgICAgdGhpcy5taW51dGVzXHJcbiAgICBdO1xyXG4gICAgLy8gdGhpcy5tdWx0aUFycmF5ID0gW3RoaXMueWVhcnMsIHRoaXMubW9udGhzLCB0aGlzLmRheXMsIHRoaXMuaG91cnNdXHJcbiAgICAvLyB0aGlzLm11bHRpQXJyYXkgPSBbdGhpcy55ZWFycywgdGhpcy5tb250aHMsIHRoaXMuZGF5c11cclxuICAgIHRoaXMuY2hvb3NlX3llYXIgPSB0aGlzLm11bHRpQXJyYXlbMF1bMF07XHJcbiAgICBpZiAoIXRoaXMudGltZXMpIHtcclxuICAgICAgLy8g6buY6K6k5pi+56S65b2T5YmN5pel5pyfXHJcbiAgICAgIGxldCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgbGV0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcclxuICAgICAgbGV0IGN1cnJlbnREYXkgPSBkYXRlLmdldERhdGUoKSAtIDE7XHJcbiAgICAgIC8vIGNvbnNvbGUuaW5mbygn5pyIJywgZGF0ZS5nZXRNb250aCgpKVxyXG4gICAgICAvLyBjb25zb2xlLmluZm8oJ+aXpScsIGRhdGUuZ2V0RGF0ZSgpKVxyXG4gICAgICB0aGlzLm11bHRpQXJyYXlbMl0gPSB0aGlzLnNldERheXModGhpcy5jaG9vc2VfeWVhciwgY3VycmVudE1vbnRoICsgMSk7XHJcbiAgICAgIHRoaXMubXVsdGlJbmRleCA9IFswLCBjdXJyZW50TW9udGgsIGN1cnJlbnREYXksIDEwLCAwXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc2V0RGVmYXVsdHRpbWVzKCk7XHJcbiAgICB9XHJcbiAgICAvLyB3eC5nZXRTdG9yYWdlKHtcclxuICAgIC8vICAga2V5OiAnaXRlbScsXHJcbiAgICAvLyAgIHN1Y2Nlc3MgKHJlcykge1xyXG4gICAgLy8gICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKVxyXG4gICAgLy8gICAgIHNlbGYuZm9ybURhdGEgPSByZXMuZGF0YVxyXG4gICAgLy8gICB9XHJcbiAgICAvLyB9KVxyXG5cclxuICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgfVxyXG4gIC8vIHdoZW5BcHBSZWFkeVNob3coKSB7XHJcbiAgLy8gICAvLyDmr4/mrKHpg73liLfmlrBcclxuICAvLyAgIHRoaXMuJGFwcGx5KClcclxuICAvLyB9XHJcbiAgY2hhbmdlQ3VycmVudERhdGEob3B0aW9uKSB7XHJcbiAgICAvL+aUueWPmOW9k+WJjeaVsOaNrlxyXG4gICAgLy/lhajlm73mlbDmja5cclxuICAgIHZhciBuYXRpb25hbERhdGEgPSB0aGlzLm5hdGlvbmFsRGF0YTtcclxuICAgIC8v5omA5pyJ55yBXHJcbiAgICBpZiAodGhpcy5wcm92aW5jZXMubGVuZ3RoID09IDApIHtcclxuICAgICAgdmFyIHByb3ZpbmNlcyA9IHRoaXMuZGF0YS5wcm92aW5jZXM7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmF0aW9uYWxEYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgcHJvdmluY2VzLnB1c2goe1xyXG4gICAgICAgICAgaW5kZXg6IGksXHJcbiAgICAgICAgICBwcm92aW5jZTogbmF0aW9uYWxEYXRhW2ldLnpvbmVfbmFtZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMucHJvdmluY2VzID0gcHJvdmluY2VzO1xyXG4gICAgfVxyXG4gICAgLy/lvZPliY3miYDmnInluIJcclxuICAgIGlmIChvcHRpb24udHlwZSA9PSBcImNpdHlcIiB8fCBvcHRpb24udHlwZSA9PSBcImFsbFwiKSB7XHJcbiAgICAgIC8v5riF56m65biC5pWw5o2uXHJcbiAgICAgIHRoaXMuY2l0aWVzID0gW107XHJcbiAgICAgIHZhciBjaXRpZXMgPSB0aGlzLmNpdGllcztcclxuICAgICAgdmFyIGN1cnJlbnRDaXRpZXMgPSBuYXRpb25hbERhdGFbb3B0aW9uLmN1cnJlbnRQcm92aW5jZUluZGV4XS5jaXR5cztcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW50Q2l0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY2l0aWVzLnB1c2goe1xyXG4gICAgICAgICAgaW5kZXg6IGksXHJcbiAgICAgICAgICBjaXR5OiBjdXJyZW50Q2l0aWVzW2ldLnpvbmVfbmFtZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuY2l0aWVzID0gY2l0aWVzO1xyXG4gICAgfVxyXG4gICAgLy/lvZPliY3miYDmnInljLpcclxuICAgIC8v5riF56m6IOWMuiDmlbDmja5cclxuICAgIHRoaXMuZGlzdHJpY3RzID0gW107XHJcbiAgICB2YXIgZGlzdHJpY3RzID0gdGhpcy5kaXN0cmljdHM7XHJcbiAgICB2YXIgY3VycmVudERpc3RyaWN0cyA9XHJcbiAgICAgIG5hdGlvbmFsRGF0YVtvcHRpb24uY3VycmVudFByb3ZpbmNlSW5kZXhdLmNpdHlzW29wdGlvbi5jdXJyZW50Q2l0eUluZGV4XVxyXG4gICAgICAgIC5kaXN0cmljdHM7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnREaXN0cmljdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYgKGkgIT0gMCkge1xyXG4gICAgICAgIGRpc3RyaWN0cy5wdXNoKGN1cnJlbnREaXN0cmljdHNbaV0uem9uZV9uYW1lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5kaXN0cmljdHMgPSBkaXN0cmljdHM7XHJcbiAgICB0aGlzLiRhcHBseSgpO1xyXG4gIH1cclxufVxyXG4iXX0=