'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _page = require('./../mixins/page.js');

var _page2 = _interopRequireDefault(_page);

var _upload = require('./../components/upload.js');

var _upload2 = _interopRequireDefault(_upload);

var _upload3 = require('./../components/upload2.js');

var _upload4 = _interopRequireDefault(_upload3);

var _upload5 = require('./../components/upload3.js');

var _upload6 = _interopRequireDefault(_upload5);

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

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CreateTest.__proto__ || Object.getPrototypeOf(CreateTest)).call.apply(_ref, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), _possibleConstructorReturn(_this, _ret);
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
    //接收$emit传过来的数据

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
      if (options.id) {
        this.id = options.id;
      }
      if (options.record) {
        this.edit = true;
        this.formData = JSON.parse(options.record);
        this.formData.detail = [{}, {}, {}];
        this.formData.detail[0].description = this.formData.detailEntityList[0].description;
        this.formData.detail[1].description = this.formData.detailEntityList[1].description;
        this.formData.detail[2].description = this.formData.detailEntityList[2].description;
        var item = this.formData.detailEntityList;
        this.imgs1 = [item[0].img1, item[0].img2, item[0].img3];
        this.imgs2 = [item[1].img1, item[1].img2, item[1].img3];
        this.imgs3 = [item[2].img1, item[2].img2, item[2].img3];
        this.$broadcast('index-broadcast', this.formData.detailEntityList);
        wx.setNavigationBarTitle({
          title: '编辑实验数据'
        });
      }
      this.settimesDate();
      this.multiArray = [this.years, this.months, this.days];
      this.$apply();
    }
  }, {
    key: 'whenAppReadyShow',
    value: function whenAppReadyShow() {
      // 每次都刷新
      wx.setStorageSync('uploadAppId', this.config.uploadAppId);
      wx.setStorageSync('uploadUrl', this.config.uploadUrl);
      this.$apply();
    }
  }]);

  return CreateTest;
}(_wepy2.default.page);

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.mixins = [_page2.default];
  this.config = {
    navigationBarTitleText: '创建实验',
    navigationBarBackgroundColor: '#fff'
  };
  this.components = {
    upload: _upload2.default,
    upload2: _upload4.default,
    upload3: _upload6.default
  };
  this.data = {
    edit: false,
    showToast: false,
    error: '',
    formData: {
      detail: [{}, {}, {}]
    },
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
    imgs1: [],
    imgs2: [],
    imgs3: []
  };
  this.events = {
    'toParent1': function toParent1() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      _this2.imgs1 = args[0].map(function (i) {
        return i.imageUrl;
      });
    },
    'toParent2': function toParent2() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      _this2.imgs2 = args[0].map(function (i) {
        return i.imageUrl;
      });
      console.log(_this2.imgs2, 'this.imgs2');
    },
    'toParent3': function toParent3() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      _this2.imgs3 = args[0].map(function (i) {
        return i.imageUrl;
      });
    }
  };
  this.methods = {
    // 删除
    delFun: function delFun(e) {
      var self = this;
      wx.showModal({
        title: "提示",
        content: "是否确认删除当前实验数据?",
        cancelText: "取消",
        confirmText: "确认",
        success: function success(res) {
          if (res.confirm) {
            self.fetchDataPromise('wx/experiment/deleteExperimentRecordApi.json', { id: self.formData.id }).then(function (data) {
              self.formData = {};
              //返回上上一页
              wx.showToast({
                title: '删除成功'
              });
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                });
                self.$apply();
              }, 1000);
            });
          }
        },
        fail: function fail(err) {}
      });
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
      this.formData.recordDate = this.PickerChange(e);
    },
    getName: function getName(e) {
      //获得会议名称
      this.formData.recordUser = e.detail.value;
      this.$apply();
    },
    getDis1: function getDis1(e) {
      this.formData.detail[1].description = e.detail.value;
      this.$apply();
    },
    getDis: function getDis(e) {
      this.formData.detail[0].description = e.detail.value;
      this.$apply();
    },
    getDis2: function getDis2(e) {
      this.formData.detail[2].description = e.detail.value;
      this.$apply();
    },
    getpurpose: function getpurpose(e) {
      this.formData.temperature = e.detail.value;
      this.$apply();
    },
    getwindDirection: function getwindDirection(e) {
      //获得全部内容
      this.formData.windDirection = e.detail.value;
      this.$apply();
    },
    getweather: function getweather(e) {
      this.formData.weather = e.detail.value;
      this.$apply();
    },
    save: function save() {
      //保存
      var self = this;
      console.log(self.imgs1.length);
      if (!self.formData.recordUser || self.formData.recordUser == '') {
        wx.showModal({
          title: '提示',
          content: '记录者必填',
          showCancel: false
        });
        return;
      } else if (!self.formData.recordDate || self.formData.recordDate == '') {
        wx.showModal({
          title: '提示',
          content: '日期必填',
          showCancel: false
        });
        return;
      } else if (!self.formData.temperature || self.formData.temperature == '') {
        wx.showModal({
          title: '提示',
          content: '温度必填',
          showCancel: false
        });
        return;
      } else if (!self.formData.windDirection || self.formData.windDirection == '') {
        wx.showModal({
          title: '提示',
          content: '风向必填',
          showCancel: false
        });
        return;
      } else if (!self.formData.weather || self.formData.weather == '') {
        wx.showModal({
          title: '提示',
          content: '天气必填',
          showCancel: false
        });
        return;
      } else if (!self.formData.detail[0].description || self.formData.detail[0].description == '') {
        wx.showModal({
          title: '提示',
          content: '实验数据简介01描述必填',
          showCancel: false
        });
        return;
      } else if (!self.formData.detail[1].description || self.formData.detail[1].description == '') {
        wx.showModal({
          title: '提示',
          content: '实验数据简介02描述必填',
          showCancel: false
        });
        return;
      } else if (!self.formData.detail[2].description || self.formData.detail[2].description == '') {
        wx.showModal({
          title: '提示',
          content: '实验数据简介03描述必填',
          showCancel: false
        });
        return;
      } else if (this.imgs1.length !== 3) {
        wx.showModal({
          title: '提示',
          content: '实验数据01固定3张图片',
          showCancel: false
        });
        return;
      } else if (this.imgs2.length !== 3) {
        wx.showModal({
          title: '提示',
          content: '实验数据02固定3张图片',
          showCancel: false
        });
        return;
      } else if (this.imgs3.length !== 3) {
        wx.showModal({
          title: '提示',
          content: '实验数据03固定3张图片',
          showCancel: false
        });
        return;
      }
      self.formData.detail[0].img1 = this.imgs1[0];
      self.formData.detail[0].img2 = this.imgs1[1];
      self.formData.detail[0].img3 = this.imgs1[2];
      self.formData.detail[1].img1 = this.imgs2[0];
      self.formData.detail[1].img2 = this.imgs2[1];
      self.formData.detail[1].img3 = this.imgs2[2];
      self.formData.detail[2].img1 = this.imgs3[0];
      self.formData.detail[2].img2 = this.imgs3[1];
      self.formData.detail[2].img3 = this.imgs3[2];
      this.formData.experimentId = this.id;
      if (self.edit) {
        this.formData.user = null;
        this.fetchDataPromise('wx/experiment/updateExperimentRecordApi.json', this.formData).then(function (data) {
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
        this.fetchDataPromise('wx/experiment/createExperimentRecordApi.json', this.formData).then(function (data) {
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
  };
};


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(CreateTest , 'pages/addRecord'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkZFJlY29yZC5qcyJdLCJuYW1lcyI6WyJDcmVhdGVUZXN0IiwidCIsInN0ciIsInJlZyIsInRlc3QiLCJkYXRlIiwiRGF0ZSIsIl95ZWFySW5kZXgiLCJjb25zb2xlIiwiaW5mbyIsInRpbWVzIiwiX2RlZmF1bHRZZWFyIiwic3BsaXQiLCJpIiwiZ2V0RnVsbFllYXIiLCJ5ZWFycyIsInB1c2giLCJwYXJzZUludCIsInllYXJJbmRleCIsImNob29zZV95ZWFyIiwibW9udGhzIiwiZGF5cyIsImhvdXJzIiwibWludXRlcyIsInNlbGVjdFllYXIiLCJzZWxlY3RNb250aCIsIm51bSIsInRlbXAiLCJ5ZWFyIiwibG9nIiwiYWxsRGF0ZUxpc3QiLCJkYXRlTGlzdCIsIm1vbnRoIiwiZGF5IiwidGltZXNMaXN0IiwibXVsdGlBcnJheSIsInNldERheXMiLCJlIiwibXVsdGlJbmRleCIsImRldGFpbCIsInZhbHVlIiwiaW5kZXgiLCIkYXBwbHkiLCJlcnJvciIsInNob3dUb2FzdCIsInRoYXQiLCJzZXRUaW1lb3V0IiwiYXJ5IiwidHlwZSIsImxlbmd0aCIsIml0ZW0iLCJvcHRpb25zIiwiaWQiLCJyZWNvcmQiLCJlZGl0IiwiZm9ybURhdGEiLCJKU09OIiwicGFyc2UiLCJkZXNjcmlwdGlvbiIsImRldGFpbEVudGl0eUxpc3QiLCJpbWdzMSIsImltZzEiLCJpbWcyIiwiaW1nMyIsImltZ3MyIiwiaW1nczMiLCIkYnJvYWRjYXN0Iiwid3giLCJzZXROYXZpZ2F0aW9uQmFyVGl0bGUiLCJ0aXRsZSIsInNldHRpbWVzRGF0ZSIsInNldFN0b3JhZ2VTeW5jIiwiY29uZmlnIiwidXBsb2FkQXBwSWQiLCJ1cGxvYWRVcmwiLCJ3ZXB5IiwicGFnZSIsIm1peGlucyIsIlBhZ2VNaXhpbiIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsInVwbG9hZCIsInVwbG9hZDIiLCJ1cGxvYWQzIiwiZGF0YSIsInNlY29uZCIsImV2ZW50cyIsImFyZ3MiLCJtYXAiLCJpbWFnZVVybCIsIm1ldGhvZHMiLCJkZWxGdW4iLCJzZWxmIiwic2hvd01vZGFsIiwiY29udGVudCIsImNhbmNlbFRleHQiLCJjb25maXJtVGV4dCIsInN1Y2Nlc3MiLCJyZXMiLCJjb25maXJtIiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRoZW4iLCJuYXZpZ2F0ZUJhY2siLCJkZWx0YSIsImZhaWwiLCJlcnIiLCJiaW5kTXVsdGlQaWNrZXJDb2x1bW5DaGFuZ2UiLCJjb2x1bW4iLCJiaW5kU3RhcnRDaGFuZ2UiLCJyZWNvcmREYXRlIiwiUGlja2VyQ2hhbmdlIiwiZ2V0TmFtZSIsInJlY29yZFVzZXIiLCJnZXREaXMxIiwiZ2V0RGlzIiwiZ2V0RGlzMiIsImdldHB1cnBvc2UiLCJ0ZW1wZXJhdHVyZSIsImdldHdpbmREaXJlY3Rpb24iLCJ3aW5kRGlyZWN0aW9uIiwiZ2V0d2VhdGhlciIsIndlYXRoZXIiLCJzYXZlIiwic2hvd0NhbmNlbCIsImV4cGVyaW1lbnRJZCIsInVzZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0U7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBQ3FCQSxVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9DbkI7NkJBQ1VDLEMsRUFBRztBQUNYLFVBQUlBLElBQUksRUFBUixFQUFZLE9BQU8sTUFBTUEsQ0FBYixDQUFaLEtBQ0ssT0FBT0EsQ0FBUDtBQUNOOzs7NEJBQ09DLEcsRUFBSztBQUNYLFVBQU1DLE1BQU0sMEJBQVo7QUFDQSxhQUFPQSxJQUFJQyxJQUFKLENBQVNGLEdBQVQsQ0FBUDtBQUNEO0FBQ0Q7Ozs7bUNBQ2U7QUFDYixVQUFNRyxPQUFPLElBQUlDLElBQUosRUFBYjtBQUNBLFVBQUlDLGFBQWEsQ0FBakI7QUFDQTtBQUNBQyxjQUFRQyxJQUFSLENBQWEsS0FBS0MsS0FBbEI7QUFDQSxVQUFJQyxlQUFlLEtBQUtELEtBQUwsR0FBYSxLQUFLQSxLQUFMLENBQVdFLEtBQVgs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QWNELE9BaEJELE1BaUJLO0FBQ0gsYUFBSzJELGdCQUFMLENBQXNCLDhDQUF0QixFQUFzRSxLQUFLOUMsUUFBM0UsRUFDQytDLElBREQsQ0FDTSxVQUFTakIsSUFBVCxFQUFlO0FBQ25CUSxlQUFLdEMsUUFBTCxHQUFnQixFQUFoQjtBQUNBO0FBQ0NZLGFBQUd2QixTQUFILENBQWE7QUFDVnlCLG1CQUFPO0FBREcsV0FBYjtBQUdEdkIscUJBQVcsWUFBTTtBQUNmcUIsZUFBR29DLFlBQUgsQ0FBZ0I7QUFDZEMscUJBQU87QUFETyxhQUFoQjtBQUdBWCxpQkFBS25ELE1BQUw7QUFDRCxXQUxELEVBS0csSUFMSDtBQU1ELFNBYkQ7QUFjRDtBQUNGO0FBMU1PLEc7OztrQkE3TFMxQyxVIiwiZmlsZSI6ImFkZFJlY29yZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuICBpbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcbiAgaW1wb3J0IFBhZ2VNaXhpbiBmcm9tICcuLi9taXhpbnMvcGFnZSc7XG4gIGltcG9ydCB1cGxvYWQgZnJvbSAnLi4vY29tcG9uZW50cy91cGxvYWQnXG4gIGltcG9ydCB1cGxvYWQyIGZyb20gJy4uL2NvbXBvbmVudHMvdXBsb2FkMidcbiAgaW1wb3J0IHVwbG9hZDMgZnJvbSAnLi4vY29tcG9uZW50cy91cGxvYWQzJ1xuICBleHBvcnQgZGVmYXVsdCBjbGFzcyBDcmVhdGVUZXN0IGV4dGVuZHMgd2VweS5wYWdlIHtcbiAgICBtaXhpbnMgPSBbUGFnZU1peGluXTtcbiAgICBjb25maWcgPSB7XG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn5Yib5bu65a6e6aqMJyxcbiAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJ1xuICAgIH07XG4gICAgY29tcG9uZW50cz17XG4gICAgIHVwbG9hZCxcbiAgICAgdXBsb2FkMixcbiAgICAgdXBsb2FkM1xuXHRcdH1cbiAgICBkYXRhID0ge1xuICAgICAgZWRpdDogZmFsc2UsXG4gICAgICBzaG93VG9hc3Q6IGZhbHNlLFxuICAgICAgZXJyb3I6ICcnLFxuICAgICAgZm9ybURhdGE6IHtcbiAgICAgICAgZGV0YWlsOiBbe30sIHt9LCB7fV1cbiAgICAgIH0sXG4gICAgICBkYXRlOiAnMjAxNi0wOS0wMScsXG4gICAgICB0aW1lczogJzIwMjAtMDctMjkgMTI6NTAnLFxuICAgICAgLy8g5pe26Ze06YCJ5oup5Zmo5Y+C5pWwXG4gICAgICB5ZWFyczogW10sXG4gICAgICBtb250aHM6IFtdLFxuICAgICAgZGF5czogW10sXG4gICAgICBob3VyczogW10sXG4gICAgICBtaW51dGVzOiBbXSxcbiAgICAgIHNlY29uZDogW10sXG4gICAgICBtdWx0aUFycmF5OiBbXSwgLy8g6YCJ5oup6IyD5Zu0XG4gICAgICBtdWx0aUluZGV4OiBbMCwgOSwgMTYsIDEzLCAxN10sIC8vIOmAieS4reWAvOaVsOe7hFxuICAgICAgY2hvb3NlX3llYXI6ICcnLFxuICAgICAgeWVhckluZGV4OiAwLFxuICAgICAgaWQ6IG51bGwsXG4gICAgICBpbWdzMTpbXSxcbiAgICAgIGltZ3MyOiBbXSxcbiAgICAgIGltZ3MzOiBbXVxuICAgIH07XG4gICAgLy8g5beu5LiA5L2N6KGl5L2NXG4gICAgdGltZXNGdW4gKHQpIHtcbiAgICAgIGlmICh0IDwgMTApIHJldHVybiAnMCcgKyB0XG4gICAgICBlbHNlIHJldHVybiB0XG4gICAgfVxuICAgIGlzUGhvbmUoc3RyKSB7XG4gICAgICBjb25zdCByZWcgPSAvXlsxXVszLDQsNSw3LDhdWzAtOV17OX0kLztcbiAgICAgIHJldHVybiByZWcudGVzdChzdHIpO1xuICAgIH1cbiAgICAvLyDorr7nva7liJ3lp4vlgLxcbiAgICBzZXR0aW1lc0RhdGUoKSB7XG4gICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKVxuICAgICAgbGV0IF95ZWFySW5kZXggPSAwXG4gICAgICAvLyDpu5jorqTorr7nva5cbiAgICAgIGNvbnNvbGUuaW5mbyh0aGlzLnRpbWVzKVxuICAgICAgbGV0IF9kZWZhdWx0WWVhciA9IHRoaXMudGltZXMgPyB0aGlzLnRpbWVzLnNwbGl0KCctJylbMF0gOiAwXG4gICAgICAvLyDojrflj5blubRcbiAgICAgIGZvciAobGV0IGkgPSBkYXRlLmdldEZ1bGxZZWFyKCk7IGkgPD0gZGF0ZS5nZXRGdWxsWWVhcigpICsgNTsgaSsrKSB7XG4gICAgICAgIHRoaXMueWVhcnMucHVzaCgnJyArIGkpXG4gICAgICAgIC8vIOm7mOiupOiuvue9rueahOW5tOeahOS9jee9rlxuICAgICAgICBpZiAoX2RlZmF1bHRZZWFyICYmIGkgPT09IHBhcnNlSW50KF9kZWZhdWx0WWVhcikpIHtcbiAgICAgICAgICB0aGlzLnllYXJJbmRleCA9IF95ZWFySW5kZXhcbiAgICAgICAgICB0aGlzLmNob29zZV95ZWFyID0gX2RlZmF1bHRZZWFyXG4gICAgICAgIH1cbiAgICAgICAgX3llYXJJbmRleCA9IF95ZWFySW5kZXggKyAxXG4gICAgICB9XG4gICAgICAvLyDojrflj5bmnIjku71cbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDEyOyBpKyspIHtcbiAgICAgICAgaWYgKGkgPCAxMCkge1xuICAgICAgICAgIGkgPSAnMCcgKyBpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tb250aHMucHVzaCgnJyArIGkpXG4gICAgICB9XG4gICAgICAvLyDojrflj5bml6XmnJ9cbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDMxOyBpKyspIHtcbiAgICAgICAgaWYgKGkgPCAxMCkge1xuICAgICAgICAgIGkgPSAnMCcgKyBpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kYXlzLnB1c2goJycgKyBpKVxuICAgICAgfVxuICAgICAgLy8gLy8g6I635Y+W5bCP5pe2XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI0OyBpKyspIHtcbiAgICAgICAgIGlmIChpIDwgMTApIHtcbiAgICAgICAgICAgaSA9ICcwJyArIGlcbiAgICAgICAgIH1cbiAgICAgICAgIHRoaXMuaG91cnMucHVzaCgnJyArIGkpXG4gICAgICAgfVxuICAgICAgLy8gLy8g6I635Y+W5YiG6ZKfXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDYwOyBpKyspIHtcbiAgICAgICAgaWYgKGkgPCAxMCkge1xuICAgICAgICAgIGkgPSAnMCcgKyBpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5taW51dGVzLnB1c2goJycgKyBpKVxuICAgICAgfVxuICAgICAgLy8gLy8g6I635Y+W56eS5pWwXG4gICAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8IDYwOyBpKyspIHtcbiAgICAgIC8vICAgaWYgKGkgPCAxMCkge1xuICAgICAgLy8gICAgIGkgPSAnMCcgKyBpXG4gICAgICAvLyAgIH1cbiAgICAgIC8vICAgdGhpcy5zZWNvbmQucHVzaCgnJyArIGkpXG4gICAgICAvLyB9XG4gICAgfVxuICAgIC8vIOi/lOWbnuaciOS7veeahOWkqeaVsFxuICAgIHNldERheXMoc2VsZWN0WWVhciwgc2VsZWN0TW9udGgpIHtcbiAgICAgIGxldCBudW0gPSBzZWxlY3RNb250aFxuICAgICAgbGV0IHRlbXAgPSBbXVxuICAgICAgaWYgKG51bSA9PT0gMSB8fCBudW0gPT09IDMgfHwgbnVtID09PSA1IHx8IG51bSA9PT0gNyB8fCBudW0gPT09IDggfHwgbnVtID09PSAxMCB8fCBudW0gPT09IDEyKSB7XG4gICAgICAgICAgLy8g5Yik5patMzHlpKnnmoTmnIjku71cbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMzE7IGkrKykge1xuICAgICAgICAgIGlmIChpIDwgMTApIHtcbiAgICAgICAgICAgIGkgPSAnMCcgKyBpXG4gICAgICAgICAgfVxuICAgICAgICAgIHRlbXAucHVzaCgnJyArIGkpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAobnVtID09PSA0IHx8IG51bSA9PT0gNiB8fCBudW0gPT09IDkgfHwgbnVtID09PSAxMSkgeyAvLyDliKTmlq0zMOWkqeeahOaciOS7vVxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSAzMDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGkgPCAxMCkge1xuICAgICAgICAgICAgaSA9ICcwJyArIGlcbiAgICAgICAgICB9XG4gICAgICAgICAgdGVtcC5wdXNoKCcnICsgaSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChudW0gPT09IDIpIHsgLy8g5Yik5patMuaciOS7veWkqeaVsFxuICAgICAgICBsZXQgeWVhciA9IHBhcnNlSW50KHNlbGVjdFllYXIpXG4gICAgICAgIGNvbnNvbGUubG9nKHllYXIpXG4gICAgICAgIGlmICgoKHllYXIgJSA0MDAgPT09IDApIHx8ICh5ZWFyICUgMTAwICE9PSAwKSkgJiYgKHllYXIgJSA0ID09PSAwKSkge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDI5OyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpIDwgMTApIHtcbiAgICAgICAgICAgICAgaSA9ICcwJyArIGlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlbXAucHVzaCgnJyArIGkpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDI4OyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpIDwgMTApIHtcbiAgICAgICAgICAgICAgaSA9ICcwJyArIGlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlbXAucHVzaCgnJyArIGkpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGVtcFxuICAgIH1cbiAgICAvLyDorr7nva7pu5jorqTlgLwg5qC85byPMjAxOS0wNy0xMCAxMDozMFxuICAgIHNldERlZmF1bHR0aW1lcygpIHtcbiAgICAgIGxldCBhbGxEYXRlTGlzdCA9IHRoaXMudGltZXMuc3BsaXQoJyAnKVxuICAgICAgLy8g5pel5pyfXG4gICAgICBsZXQgZGF0ZUxpc3QgPSBhbGxEYXRlTGlzdFswXS5zcGxpdCgnLScpXG4gICAgICBsZXQgbW9udGggPSBwYXJzZUludChkYXRlTGlzdFsxXSkgLSAxXG4gICAgICBsZXQgZGF5ID0gcGFyc2VJbnQoZGF0ZUxpc3RbMl0pIC0gMVxuICAgICAgLy8g5pe26Ze0XG4gICAgICBsZXQgdGltZXNMaXN0ID0gYWxsRGF0ZUxpc3RbMV0uc3BsaXQoJzonKVxuICAgICAgdGhpcy5tdWx0aUFycmF5WzJdID0gdGhpcy5zZXREYXlzKGRhdGVMaXN0WzBdLCBwYXJzZUludChkYXRlTGlzdFsxXSkpXG4gICAgfVxuICAgIC8vIOiOt+WPluaXtumXtOaXpeacn1xuICAgIFBpY2tlckNoYW5nZShlKSB7XG4gICAgICB0aGlzLm11bHRpSW5kZXggPSBlLmRldGFpbC52YWx1ZVxuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLm11bHRpSW5kZXhcbiAgICAgIGNvbnN0IHllYXIgPSB0aGlzLm11bHRpQXJyYXlbMF1baW5kZXhbMF1dXG4gICAgICBjb25zdCBtb250aCA9IHRoaXMubXVsdGlBcnJheVsxXVtpbmRleFsxXV1cbiAgICAgIGNvbnN0IGRheSA9IHRoaXMubXVsdGlBcnJheVsyXVtpbmRleFsyXV1cbiAgICAgIHRoaXMudGltZXMgPSB5ZWFyICsgJy0nICsgbW9udGggKyAnLScgKyBkYXlcbiAgICAgIHRoaXMuJGFwcGx5KClcbiAgICAgIHJldHVybiB0aGlzLnRpbWVzXG4gICAgfVxuICAgIHRvYXN0KGVycm9yKSB7XG4gICAgICB0aGlzLnNob3dUb2FzdCA9IHRydWU7XG4gICAgICB0aGlzLmVycm9yID0gZXJyb3I7XG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhhdC5zaG93VG9hc3QgPSBmYWxzZTtcbiAgICAgIH0sIDIwMDApO1xuICAgIH1cbiAgICBpc1R5cGUoYXJ5LCB0eXBlKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyeS5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBpdGVtID0gYXJ5W2ldXG4gICAgICAgIGlmIChpdGVtID09PSB0eXBlKSB7XG4gICAgICAgICAgcmV0dXJuIGlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvL+aOpeaUtiRlbWl05Lyg6L+H5p2l55qE5pWw5o2uXG5cdFx0ZXZlbnRzID0ge1xuXHRcdCAgJ3RvUGFyZW50MSc6KC4uLmFyZ3MpID0+IHtcbiAgICAgICAgdGhpcy5pbWdzMSA9IGFyZ3NbMF0ubWFwKGkgPT4gaS5pbWFnZVVybClcbiAgICAgIH0sXG4gICAgICAndG9QYXJlbnQyJzooLi4uYXJncykgPT4ge1xuICAgICAgICB0aGlzLmltZ3MyID0gYXJnc1swXS5tYXAoaSA9PiBpLmltYWdlVXJsKVxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmltZ3MyLCAndGhpcy5pbWdzMicpXG4gICAgICB9LFxuICAgICAgJ3RvUGFyZW50Myc6KC4uLmFyZ3MpID0+IHtcbiAgICAgICAgdGhpcy5pbWdzMyA9IGFyZ3NbMF0ubWFwKGkgPT4gaS5pbWFnZVVybClcblx0XHQgIH1cblx0XHR9XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgICAgICAvLyDliKDpmaRcbiAgICBkZWxGdW4oZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICB0aXRsZTogXCLmj5DnpLpcIixcbiAgICAgICAgICBjb250ZW50OiBcIuaYr+WQpuehruiupOWIoOmZpOW9k+WJjeWunumqjOaVsOaNrj9cIixcbiAgICAgICAgICBjYW5jZWxUZXh0OiBcIuWPlua2iFwiLFxuICAgICAgICAgIGNvbmZpcm1UZXh0OiBcIuehruiupFwiLFxuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgaWYgKHJlcy5jb25maXJtKSB7XG4gICAgICAgICAgICAgIHNlbGYuZmV0Y2hEYXRhUHJvbWlzZSgnd3gvZXhwZXJpbWVudC9kZWxldGVFeHBlcmltZW50UmVjb3JkQXBpLmpzb24nLCB7aWQ6IHNlbGYuZm9ybURhdGEuaWR9KVxuICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5mb3JtRGF0YSA9IHt9XG4gICAgICAgICAgICAgICAgLy/ov5Tlm57kuIrkuIrkuIDpobVcbiAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgdGl0bGU6ICfliKDpmaTmiJDlip8nXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICB3eC5uYXZpZ2F0ZUJhY2soe1xuICAgICAgICAgICAgICAgICAgICBkZWx0YTogMVxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZmFpbDogZnVuY3Rpb24oZXJyKSB7fVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICAvLyDnm5HlkKxwaWNrZXLnmoTmu5rliqjkuovku7ZcbiAgICAgIGJpbmRNdWx0aVBpY2tlckNvbHVtbkNoYW5nZShlKSB7XG4gICAgICAgIC8vIOiOt+WPluW5tOS7vVxuICAgICAgICBpZiAoZS5kZXRhaWwuY29sdW1uID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5jaG9vc2VfeWVhciA9IHRoaXMubXVsdGlBcnJheVtlLmRldGFpbC5jb2x1bW5dW2UuZGV0YWlsLnZhbHVlXVxuICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY2hvb3NlX3llYXIpXG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2coJ+S/ruaUueeahOWIl+S4uicsIGUuZGV0YWlsLmNvbHVtbiwgJ++8jOWAvOS4uicsIGUuZGV0YWlsLnZhbHVlKTtcbiAgICAgICAgLy8g6K6+572u5pyI5Lu95pWw57uEXG4gICAgICAgIGlmIChlLmRldGFpbC5jb2x1bW4gPT09IDEpIHtcbiAgICAgICAgICBsZXQgbnVtID0gcGFyc2VJbnQodGhpcy5tdWx0aUFycmF5W2UuZGV0YWlsLmNvbHVtbl1bZS5kZXRhaWwudmFsdWVdKVxuICAgICAgICAgIHRoaXMubXVsdGlBcnJheVsyXSA9IHRoaXMuc2V0RGF5cyh0aGlzLmNob29zZV95ZWFyLCBudW0pXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm11bHRpSW5kZXhbZS5kZXRhaWwuY29sdW1uXSA9IGUuZGV0YWlsLnZhbHVlXG4gICAgICAgIHRoaXMuJGFwcGx5KClcbiAgICAgIH0sXG4gICAgICBiaW5kU3RhcnRDaGFuZ2UgKGUpIHtcbiAgICAgICAgdGhpcy5mb3JtRGF0YS5yZWNvcmREYXRlID0gdGhpcy5QaWNrZXJDaGFuZ2UoZSlcbiAgICAgIH0sXG4gICAgICBnZXROYW1lKGUpIHsgLy/ojrflvpfkvJrorq7lkI3np7BcbiAgICAgICAgdGhpcy5mb3JtRGF0YS5yZWNvcmRVc2VyID0gZS5kZXRhaWwudmFsdWU7XG4gICAgICAgIHRoaXMuJGFwcGx5KClcbiAgICAgIH0sXG4gICAgICBnZXREaXMxKGUpIHtcbiAgICAgICAgdGhpcy5mb3JtRGF0YS5kZXRhaWxbMV0uZGVzY3JpcHRpb24gPSBlLmRldGFpbC52YWx1ZTtcbiAgICAgICAgdGhpcy4kYXBwbHkoKVxuICAgICAgfSxcbiAgICAgIGdldERpcyhlKSB7XG4gICAgICAgIHRoaXMuZm9ybURhdGEuZGV0YWlsWzBdLmRlc2NyaXB0aW9uID0gZS5kZXRhaWwudmFsdWU7XG4gICAgICAgIHRoaXMuJGFwcGx5KClcbiAgICAgIH0sXG4gICAgICBnZXREaXMyKGUpIHtcbiAgICAgICAgdGhpcy5mb3JtRGF0YS5kZXRhaWxbMl0uZGVzY3JpcHRpb24gPSBlLmRldGFpbC52YWx1ZTtcbiAgICAgICAgdGhpcy4kYXBwbHkoKVxuICAgICAgfSxcbiAgICAgIGdldHB1cnBvc2UoZSkge1xuICAgICAgICB0aGlzLmZvcm1EYXRhLnRlbXBlcmF0dXJlID0gZS5kZXRhaWwudmFsdWU7XG4gICAgICAgIHRoaXMuJGFwcGx5KClcbiAgICAgIH0sXG4gICAgICBnZXR3aW5kRGlyZWN0aW9uKGUpIHsgLy/ojrflvpflhajpg6jlhoXlrrlcbiAgICAgICAgdGhpcy5mb3JtRGF0YS53aW5kRGlyZWN0aW9uID0gZS5kZXRhaWwudmFsdWU7XG4gICAgICAgIHRoaXMuJGFwcGx5KClcbiAgICAgIH0sXG4gICAgICBnZXR3ZWF0aGVyKGUpIHtcbiAgICAgICAgdGhpcy5mb3JtRGF0YS53ZWF0aGVyID0gZS5kZXRhaWwudmFsdWU7XG4gICAgICAgIHRoaXMuJGFwcGx5KClcbiAgICAgIH0sXG4gICAgICBzYXZlKCkgeyAvL+S/neWtmFxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNvbnNvbGUubG9nKHNlbGYuaW1nczEubGVuZ3RoKVxuICAgICAgICBpZiAoIXNlbGYuZm9ybURhdGEucmVjb3JkVXNlciB8fCBzZWxmLmZvcm1EYXRhLnJlY29yZFVzZXIgPT0gJycpIHtcbiAgICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxuICAgICAgICAgICAgY29udGVudDogJ+iusOW9leiAheW/heWhqycsXG4gICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmICghc2VsZi5mb3JtRGF0YS5yZWNvcmREYXRlIHx8IHNlbGYuZm9ybURhdGEucmVjb3JkRGF0ZSA9PSAnJykge1xuICAgICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXG4gICAgICAgICAgICBjb250ZW50OiAn5pel5pyf5b+F5aGrJyxcbiAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKCFzZWxmLmZvcm1EYXRhLnRlbXBlcmF0dXJlIHx8IHNlbGYuZm9ybURhdGEudGVtcGVyYXR1cmUgPT0gJycpIHtcbiAgICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxuICAgICAgICAgICAgY29udGVudDogJ+a4qeW6puW/heWhqycsXG4gICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmICghc2VsZi5mb3JtRGF0YS53aW5kRGlyZWN0aW9uIHx8IHNlbGYuZm9ybURhdGEud2luZERpcmVjdGlvbiA9PSAnJykge1xuICAgICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXG4gICAgICAgICAgICBjb250ZW50OiAn6aOO5ZCR5b+F5aGrJyxcbiAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKCFzZWxmLmZvcm1EYXRhLndlYXRoZXIgfHwgc2VsZi5mb3JtRGF0YS53ZWF0aGVyID09ICcnKSB7XG4gICAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcbiAgICAgICAgICAgIGNvbnRlbnQ6ICflpKnmsJTlv4XloasnLFxuICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gIGVsc2UgaWYgKCFzZWxmLmZvcm1EYXRhLmRldGFpbFswXS5kZXNjcmlwdGlvbiB8fCBzZWxmLmZvcm1EYXRhLmRldGFpbFswXS5kZXNjcmlwdGlvbiA9PSAnJykge1xuICAgICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXG4gICAgICAgICAgICBjb250ZW50OiAn5a6e6aqM5pWw5o2u566A5LuLMDHmj4/ov7Dlv4XloasnLFxuICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gIGVsc2UgaWYgKCFzZWxmLmZvcm1EYXRhLmRldGFpbFsxXS5kZXNjcmlwdGlvbiB8fCBzZWxmLmZvcm1EYXRhLmRldGFpbFsxXS5kZXNjcmlwdGlvbiA9PSAnJykge1xuICAgICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXG4gICAgICAgICAgICBjb250ZW50OiAn5a6e6aqM5pWw5o2u566A5LuLMDLmj4/ov7Dlv4XloasnLFxuICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gIGVsc2UgaWYgKCFzZWxmLmZvcm1EYXRhLmRldGFpbFsyXS5kZXNjcmlwdGlvbiB8fCBzZWxmLmZvcm1EYXRhLmRldGFpbFsyXS5kZXNjcmlwdGlvbiA9PSAnJykge1xuICAgICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXG4gICAgICAgICAgICBjb250ZW50OiAn5a6e6aqM5pWw5o2u566A5LuLMDPmj4/ov7Dlv4XloasnLFxuICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pbWdzMS5sZW5ndGggIT09IDMpIHtcbiAgICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxuICAgICAgICAgICAgY29udGVudDogJ+WunumqjOaVsOaNrjAx5Zu65a6aM+W8oOWbvueJhycsXG4gICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSAgZWxzZSBpZiAodGhpcy5pbWdzMi5sZW5ndGggIT09IDMpIHtcbiAgICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxuICAgICAgICAgICAgY29udGVudDogJ+WunumqjOaVsOaNrjAy5Zu65a6aM+W8oOWbvueJhycsXG4gICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSAgZWxzZSBpZiAodGhpcy5pbWdzMy5sZW5ndGggIT09IDMpIHtcbiAgICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxuICAgICAgICAgICAgY29udGVudDogJ+WunumqjOaVsOaNrjAz5Zu65a6aM+W8oOWbvueJhycsXG4gICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLmZvcm1EYXRhLmRldGFpbFswXS5pbWcxID0gdGhpcy5pbWdzMVswXVxuICAgICAgICBzZWxmLmZvcm1EYXRhLmRldGFpbFswXS5pbWcyID0gdGhpcy5pbWdzMVsxXVxuICAgICAgICBzZWxmLmZvcm1EYXRhLmRldGFpbFswXS5pbWczID0gdGhpcy5pbWdzMVsyXVxuICAgICAgICBzZWxmLmZvcm1EYXRhLmRldGFpbFsxXS5pbWcxID0gdGhpcy5pbWdzMlswXVxuICAgICAgICBzZWxmLmZvcm1EYXRhLmRldGFpbFsxXS5pbWcyID0gdGhpcy5pbWdzMlsxXVxuICAgICAgICBzZWxmLmZvcm1EYXRhLmRldGFpbFsxXS5pbWczID0gdGhpcy5pbWdzMlsyXVxuICAgICAgICBzZWxmLmZvcm1EYXRhLmRldGFpbFsyXS5pbWcxID0gdGhpcy5pbWdzM1swXVxuICAgICAgICBzZWxmLmZvcm1EYXRhLmRldGFpbFsyXS5pbWcyID0gdGhpcy5pbWdzM1sxXVxuICAgICAgICBzZWxmLmZvcm1EYXRhLmRldGFpbFsyXS5pbWczID0gdGhpcy5pbWdzM1syXVxuICAgICAgICB0aGlzLmZvcm1EYXRhLmV4cGVyaW1lbnRJZCA9IHRoaXMuaWRcbiAgICAgICAgaWYgKHNlbGYuZWRpdCkge1xuICAgICAgICAgICB0aGlzLmZvcm1EYXRhLnVzZXIgPSBudWxsXG4gICAgICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKCd3eC9leHBlcmltZW50L3VwZGF0ZUV4cGVyaW1lbnRSZWNvcmRBcGkuanNvbicsIHRoaXMuZm9ybURhdGEpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgIHNlbGYuZm9ybURhdGEgPSB7fVxuICAgICAgICAgICAgICAvL+i/lOWbnuS4iuS4iuS4gOmhtVxuICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgIHRpdGxlOiAn57eo6Lyv5oiQ5YqfJ1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgd3gubmF2aWdhdGVCYWNrKHtcbiAgICAgICAgICAgICAgICAgIGRlbHRhOiAxXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgnd3gvZXhwZXJpbWVudC9jcmVhdGVFeHBlcmltZW50UmVjb3JkQXBpLmpzb24nLCB0aGlzLmZvcm1EYXRhKVxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHNlbGYuZm9ybURhdGEgPSB7fVxuICAgICAgICAgICAgLy/ov5Tlm57kuIrkuIDpobVcbiAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgIHRpdGxlOiAn5paw5aKe5oiQ5YqfJ1xuICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIHd4Lm5hdmlnYXRlQmFjayh7XG4gICAgICAgICAgICAgICAgZGVsdGE6IDFcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH1cbiAgICAvLyBlbmRGdW4gKCkge1xuICAgIC8vICAgaWYgKHRoaXMuZm9ybURhdGEuZW5kRGF0ZTEpIHRoaXMudGltZXMgPSB0aGlzLmZvcm1EYXRhLmVuZERhdGUxXG4gICAgLy8gfVxuICAgIC8vIHN0YXJ0RGF0ZSAoKSB7XG4gICAgLy8gICBpZiAodGhpcy5mb3JtRGF0YS5zdGFydERhdGUxKSB0aGlzLnRpbWVzID0gdGhpcy5mb3JtRGF0YS5zdGFydERhdGUxXG4gICAgLy8gfVxuICAgIG9uTG9hZChvcHRpb25zKSB7XG4gICAgICAvLyDojrflj5bnu4/nuqzluqZcbiAgICAgIHZhciB0aGF0ID0gdGhpc1xuICAgICAgaWYgKG9wdGlvbnMuaWQpIHtcbiAgICAgICAgdGhpcy5pZCA9IG9wdGlvbnMuaWRcbiAgICAgIH0gXG4gICAgICBpZiAob3B0aW9ucy5yZWNvcmQpIHtcbiAgICAgICAgdGhpcy5lZGl0ID0gdHJ1ZVxuICAgICAgICB0aGlzLmZvcm1EYXRhID0gSlNPTi5wYXJzZShvcHRpb25zLnJlY29yZClcbiAgICAgICAgdGhpcy5mb3JtRGF0YS5kZXRhaWwgPSBbe30sIHt9LCB7fV1cbiAgICAgICAgdGhpcy5mb3JtRGF0YS5kZXRhaWxbMF0uZGVzY3JpcHRpb24gPSB0aGlzLmZvcm1EYXRhLmRldGFpbEVudGl0eUxpc3RbMF0uZGVzY3JpcHRpb25cbiAgICAgICAgdGhpcy5mb3JtRGF0YS5kZXRhaWxbMV0uZGVzY3JpcHRpb24gPSB0aGlzLmZvcm1EYXRhLmRldGFpbEVudGl0eUxpc3RbMV0uZGVzY3JpcHRpb25cbiAgICAgICAgdGhpcy5mb3JtRGF0YS5kZXRhaWxbMl0uZGVzY3JpcHRpb24gPSB0aGlzLmZvcm1EYXRhLmRldGFpbEVudGl0eUxpc3RbMl0uZGVzY3JpcHRpb25cbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuZm9ybURhdGEuZGV0YWlsRW50aXR5TGlzdFxuICAgICAgICB0aGlzLmltZ3MxID0gW2l0ZW1bMF0uaW1nMSwgaXRlbVswXS5pbWcyLCBpdGVtWzBdLmltZzNdXG4gICAgICAgIHRoaXMuaW1nczIgPSBbaXRlbVsxXS5pbWcxLCBpdGVtWzFdLmltZzIsIGl0ZW1bMV0uaW1nM11cbiAgICAgICAgdGhpcy5pbWdzMyA9IFtpdGVtWzJdLmltZzEsIGl0ZW1bMl0uaW1nMiwgaXRlbVsyXS5pbWczXVxuICAgICAgICB0aGlzLiRicm9hZGNhc3QoJ2luZGV4LWJyb2FkY2FzdCcsdGhpcy5mb3JtRGF0YS5kZXRhaWxFbnRpdHlMaXN0KVxuICAgICAgICB3eC5zZXROYXZpZ2F0aW9uQmFyVGl0bGUoe1xuICAgICAgICAgIHRpdGxlOiAn57yW6L6R5a6e6aqM5pWw5o2uJyBcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0dGltZXNEYXRlKClcbiAgICAgIHRoaXMubXVsdGlBcnJheSA9IFt0aGlzLnllYXJzLCB0aGlzLm1vbnRocywgdGhpcy5kYXlzXVxuICAgICAgdGhpcy4kYXBwbHkoKVxuICAgIH1cbiAgICB3aGVuQXBwUmVhZHlTaG93KCkge1xuICAgICAgLy8g5q+P5qyh6YO95Yi35pawXG4gICAgICB3eC5zZXRTdG9yYWdlU3luYygndXBsb2FkQXBwSWQnLCB0aGlzLmNvbmZpZy51cGxvYWRBcHBJZCk7XG4gICAgICB3eC5zZXRTdG9yYWdlU3luYygndXBsb2FkVXJsJywgdGhpcy5jb25maWcudXBsb2FkVXJsKTtcbiAgICAgIHRoaXMuJGFwcGx5KClcbiAgICB9XG4gIH1cbiJdfQ==