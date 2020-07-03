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
        // 接收$emit传过来的数据

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
                title: '提示',
                content: '是否确认删除当前实验数据?',
                cancelText: '取消',
                confirmText: '确认',
                success: function success(res) {
                    if (res.confirm) {
                        self.fetchDataPromise('wx/experiment/deleteExperimentRecordApi.json', { id: self.formData.id }).then(function (data) {
                            self.formData = {};
                            // 返回上上一页
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
            // 获得会议名称
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
            // 获得全部内容
            this.formData.windDirection = e.detail.value;
            this.$apply();
        },
        getweather: function getweather(e) {
            this.formData.weather = e.detail.value;
            this.$apply();
        },
        save: function save() {
            // 保存
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
                    // 返回上上一页
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
                    // 返回上一页
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkZFJlY29yZC5qcyJdLCJuYW1lcyI6WyJDcmVhdGVUZXN0IiwidCIsInN0ciIsInJlZyIsInRlc3QiLCJkYXRlIiwiRGF0ZSIsIl95ZWFySW5kZXgiLCJjb25zb2xlIiwiaW5mbyIsInRpbWVzIiwiX2RlZmF1bHRZZWFyIiwic3BsaXQiLCJpIiwiZ2V0RnVsbFllYXIiLCJ5ZWFycyIsInB1c2giLCJwYXJzZUludCIsInllYXJJbmRleCIsImNob29zZV95ZWFyIiwibW9udGhzIiwiZGF5cyIsImhvdXJzIiwibWludXRlcyIsInNlbGVjdFllYXIiLCJzZWxlY3RNb250aCIsIm51bSIsInRlbXAiLCJ5ZWFyIiwibG9nIiwiYWxsRGF0ZUxpc3QiLCJkYXRlTGlzdCIsIm1vbnRoIiwiZGF5IiwidGltZXNMaXN0IiwibXVsdGlBcnJheSIsInNldERheXMiLCJlIiwibXVsdGlJbmRleCIsImRldGFpbCIsInZhbHVlIiwiaW5kZXgiLCIkYXBwbHkiLCJlcnJvciIsInNob3dUb2FzdCIsInRoYXQiLCJzZXRUaW1lb3V0IiwiYXJ5IiwidHlwZSIsImxlbmd0aCIsIml0ZW0iLCJvcHRpb25zIiwiaWQiLCJyZWNvcmQiLCJlZGl0IiwiZm9ybURhdGEiLCJKU09OIiwicGFyc2UiLCJkZXNjcmlwdGlvbiIsImRldGFpbEVudGl0eUxpc3QiLCJpbWdzMSIsImltZzEiLCJpbWcyIiwiaW1nMyIsImltZ3MyIiwiaW1nczMiLCIkYnJvYWRjYXN0Iiwid3giLCJzZXROYXZpZ2F0aW9uQmFyVGl0bGUiLCJ0aXRsZSIsInNldHRpbWVzRGF0ZSIsInNldFN0b3JhZ2VTeW5jIiwiY29uZmlnIiwidXBsb2FkQXBwSWQiLCJ1cGxvYWRVcmwiLCJ3ZXB5IiwicGFnZSIsIm1peGlucyIsIlBhZ2VNaXhpbiIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsInVwbG9hZCIsInVwbG9hZDIiLCJ1cGxvYWQzIiwiZGF0YSIsInNlY29uZCIsImV2ZW50cyIsImFyZ3MiLCJtYXAiLCJpbWFnZVVybCIsIm1ldGhvZHMiLCJkZWxGdW4iLCJzZWxmIiwic2hvd01vZGFsIiwiY29udGVudCIsImNhbmNlbFRleHQiLCJjb25maXJtVGV4dCIsInN1Y2Nlc3MiLCJyZXMiLCJjb25maXJtIiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRoZW4iLCJuYXZpZ2F0ZUJhY2siLCJkZWx0YSIsImZhaWwiLCJlcnIiLCJiaW5kTXVsdGlQaWNrZXJDb2x1bW5DaGFuZ2UiLCJjb2x1bW4iLCJiaW5kU3RhcnRDaGFuZ2UiLCJyZWNvcmREYXRlIiwiUGlja2VyQ2hhbmdlIiwiZ2V0TmFtZSIsInJlY29yZFVzZXIiLCJnZXREaXMxIiwiZ2V0RGlzIiwiZ2V0RGlzMiIsImdldHB1cnBvc2UiLCJ0ZW1wZXJhdHVyZSIsImdldHdpbmREaXJlY3Rpb24iLCJ3aW5kRGlyZWN0aW9uIiwiZ2V0d2VhdGhlciIsIndlYXRoZXIiLCJzYXZlIiwic2hvd0NhbmNlbCIsImV4cGVyaW1lbnRJZCIsInVzZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0U7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBQ3FCQSxVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9DbkI7aUNBQ1VDLEMsRUFBRztBQUNULGdCQUFJQSxJQUFJLEVBQVIsRUFBWSxPQUFPLE1BQU1BLENBQWIsQ0FBWixLQUNLLE9BQU9BLENBQVA7QUFDUjs7O2dDQUNPQyxHLEVBQUs7QUFDVCxnQkFBTUMsTUFBTSwwQkFBWjtBQUNBLG1CQUFPQSxJQUFJQyxJQUFKLENBQVNGLEdBQVQsQ0FBUDtBQUNIO0FBQ0Q7Ozs7dUNBQ2U7QUFDWCxnQkFBTUcsT0FBTyxJQUFJQyxJQUFKLEVBQWI7QUFDQSxnQkFBSUMsYUFBYSxDQUFqQjtBQUNBO0FBQ0FDLG9CQUFRQyxJQUFSLENBQWEsS0FBS0MsS0FBbEI7QUFDQSxnQkFBSUMsZUFBZSxLQUFLRCxLQUFMLEdBQWEsS0FBS0EsS0FBTCxDQUFX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Q0E7QUFDQVksdUJBQUd2QixTQUFILENBQWE7QUFDVHlCLCtCQUFPO0FBREUscUJBQWI7QUFHQXZCLCtCQUFXLFlBQU07QUFDYnFCLDJCQUFHb0MsWUFBSCxDQUFnQjtBQUNaQyxtQ0FBTztBQURLLHlCQUFoQjtBQUdBWCw2QkFBS25ELE1BQUw7QUFDSCxxQkFMRCxFQUtHLElBTEg7QUFNSCxpQkFiTDtBQWNILGFBaEJELE1BZ0JPO0FBQ0gscUJBQUsyRCxnQkFBTCxDQUFzQiw4Q0FBdEIsRUFBc0UsS0FBSzlDLFFBQTNFLEVBQ0srQyxJQURMLENBQ1UsVUFBU2pCLElBQVQsRUFBZTtBQUNqQlEseUJBQUt0QyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0E7QUFDQVksdUJBQUd2QixTQUFILENBQWE7QUFDVHlCLCtCQUFPO0FBREUscUJBQWI7QUFHQXZCLCtCQUFXLFlBQU07QUFDYnFCLDJCQUFHb0MsWUFBSCxDQUFnQjtBQUNaQyxtQ0FBTztBQURLLHlCQUFoQjtBQUdBWCw2QkFBS25ELE1BQUw7QUFDSCxxQkFMRCxFQUtHLElBTEg7QUFNSCxpQkFiTDtBQWNIO0FBQ0o7QUF6TUssSzs7O2tCQTdMUzFDLFUiLCJmaWxlIjoiYWRkUmVjb3JkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbiAgaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XHJcbiAgaW1wb3J0IFBhZ2VNaXhpbiBmcm9tICcuLi9taXhpbnMvcGFnZSc7XHJcbiAgaW1wb3J0IHVwbG9hZCBmcm9tICcuLi9jb21wb25lbnRzL3VwbG9hZCc7XHJcbiAgaW1wb3J0IHVwbG9hZDIgZnJvbSAnLi4vY29tcG9uZW50cy91cGxvYWQyJztcclxuICBpbXBvcnQgdXBsb2FkMyBmcm9tICcuLi9jb21wb25lbnRzL3VwbG9hZDMnO1xyXG4gIGV4cG9ydCBkZWZhdWx0IGNsYXNzIENyZWF0ZVRlc3QgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gICAgbWl4aW5zID0gW1BhZ2VNaXhpbl07XHJcbiAgICBjb25maWcgPSB7XHJcbiAgICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+WIm+W7uuWunumqjCcsXHJcbiAgICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNmZmYnXHJcbiAgICB9O1xyXG4gICAgY29tcG9uZW50cz17XHJcbiAgICAgICAgdXBsb2FkLFxyXG4gICAgICAgIHVwbG9hZDIsXHJcbiAgICAgICAgdXBsb2FkM1xyXG4gIH1cclxuICAgIGRhdGEgPSB7XHJcbiAgICAgICAgZWRpdDogZmFsc2UsXHJcbiAgICAgICAgc2hvd1RvYXN0OiBmYWxzZSxcclxuICAgICAgICBlcnJvcjogJycsXHJcbiAgICAgICAgZm9ybURhdGE6IHtcclxuICAgICAgICAgICAgZGV0YWlsOiBbe30sIHt9LCB7fV1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGRhdGU6ICcyMDE2LTA5LTAxJyxcclxuICAgICAgICB0aW1lczogJzIwMjAtMDctMjkgMTI6NTAnLFxyXG4gICAgICAgIC8vIOaXtumXtOmAieaLqeWZqOWPguaVsFxyXG4gICAgICAgIHllYXJzOiBbXSxcclxuICAgICAgICBtb250aHM6IFtdLFxyXG4gICAgICAgIGRheXM6IFtdLFxyXG4gICAgICAgIGhvdXJzOiBbXSxcclxuICAgICAgICBtaW51dGVzOiBbXSxcclxuICAgICAgICBzZWNvbmQ6IFtdLFxyXG4gICAgICAgIG11bHRpQXJyYXk6IFtdLCAvLyDpgInmi6nojIPlm7RcclxuICAgICAgICBtdWx0aUluZGV4OiBbMCwgOSwgMTYsIDEzLCAxN10sIC8vIOmAieS4reWAvOaVsOe7hFxyXG4gICAgICAgIGNob29zZV95ZWFyOiAnJyxcclxuICAgICAgICB5ZWFySW5kZXg6IDAsXHJcbiAgICAgICAgaWQ6IG51bGwsXHJcbiAgICAgICAgaW1nczE6IFtdLFxyXG4gICAgICAgIGltZ3MyOiBbXSxcclxuICAgICAgICBpbWdzMzogW11cclxuICAgIH07XHJcbiAgICAvLyDlt67kuIDkvY3ooaXkvY1cclxuICAgIHRpbWVzRnVuICh0KSB7XHJcbiAgICAgICAgaWYgKHQgPCAxMCkgcmV0dXJuICcwJyArIHQ7XHJcbiAgICAgICAgZWxzZSByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIGlzUGhvbmUoc3RyKSB7XHJcbiAgICAgICAgY29uc3QgcmVnID0gL15bMV1bMyw0LDUsNyw4XVswLTldezl9JC87XHJcbiAgICAgICAgcmV0dXJuIHJlZy50ZXN0KHN0cik7XHJcbiAgICB9XHJcbiAgICAvLyDorr7nva7liJ3lp4vlgLxcclxuICAgIHNldHRpbWVzRGF0ZSgpIHtcclxuICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICBsZXQgX3llYXJJbmRleCA9IDA7XHJcbiAgICAgICAgLy8g6buY6K6k6K6+572uXHJcbiAgICAgICAgY29uc29sZS5pbmZvKHRoaXMudGltZXMpO1xyXG4gICAgICAgIGxldCBfZGVmYXVsdFllYXIgPSB0aGlzLnRpbWVzID8gdGhpcy50aW1lcy5zcGxpdCgnLScpWzBdIDogMDtcclxuICAgICAgICAvLyDojrflj5blubRcclxuICAgICAgICBmb3IgKGxldCBpID0gZGF0ZS5nZXRGdWxsWWVhcigpOyBpIDw9IGRhdGUuZ2V0RnVsbFllYXIoKSArIDU7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnllYXJzLnB1c2goJycgKyBpKTtcclxuICAgICAgICAgICAgLy8g6buY6K6k6K6+572u55qE5bm055qE5L2N572uXHJcbiAgICAgICAgICAgIGlmIChfZGVmYXVsdFllYXIgJiYgaSA9PT0gcGFyc2VJbnQoX2RlZmF1bHRZZWFyKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy55ZWFySW5kZXggPSBfeWVhckluZGV4O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaG9vc2VfeWVhciA9IF9kZWZhdWx0WWVhcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBfeWVhckluZGV4ID0gX3llYXJJbmRleCArIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOiOt+WPluaciOS7vVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDEyOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgICAgICAgICAgaSA9ICcwJyArIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5tb250aHMucHVzaCgnJyArIGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDojrflj5bml6XmnJ9cclxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSAzMTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpIDwgMTApIHtcclxuICAgICAgICAgICAgICAgIGkgPSAnMCcgKyBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZGF5cy5wdXNoKCcnICsgaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIC8vIOiOt+WPluWwj+aXtlxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjQ7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgICAgICAgICBpID0gJzAnICsgaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmhvdXJzLnB1c2goJycgKyBpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gLy8g6I635Y+W5YiG6ZKfXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2MDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpIDwgMTApIHtcclxuICAgICAgICAgICAgICAgIGkgPSAnMCcgKyBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubWludXRlcy5wdXNoKCcnICsgaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIC8vIOiOt+WPluenkuaVsFxyXG4gICAgICAgIC8vIGZvciAobGV0IGkgPSAwOyBpIDwgNjA7IGkrKykge1xyXG4gICAgICAgIC8vICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgIC8vICAgICBpID0gJzAnICsgaVxyXG4gICAgICAgIC8vICAgfVxyXG4gICAgICAgIC8vICAgdGhpcy5zZWNvbmQucHVzaCgnJyArIGkpXHJcbiAgICAgICAgLy8gfVxyXG4gICAgfVxyXG4gICAgLy8g6L+U5Zue5pyI5Lu955qE5aSp5pWwXHJcbiAgICBzZXREYXlzKHNlbGVjdFllYXIsIHNlbGVjdE1vbnRoKSB7XHJcbiAgICAgICAgbGV0IG51bSA9IHNlbGVjdE1vbnRoO1xyXG4gICAgICAgIGxldCB0ZW1wID0gW107XHJcbiAgICAgICAgaWYgKG51bSA9PT0gMSB8fCBudW0gPT09IDMgfHwgbnVtID09PSA1IHx8IG51bSA9PT0gNyB8fCBudW0gPT09IDggfHwgbnVtID09PSAxMCB8fCBudW0gPT09IDEyKSB7XHJcbiAgICAgICAgICAgIC8vIOWIpOaWrTMx5aSp55qE5pyI5Lu9XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDMxOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChpIDwgMTApIHtcclxuICAgICAgICAgICAgICAgICAgICBpID0gJzAnICsgaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRlbXAucHVzaCgnJyArIGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChudW0gPT09IDQgfHwgbnVtID09PSA2IHx8IG51bSA9PT0gOSB8fCBudW0gPT09IDExKSB7IC8vIOWIpOaWrTMw5aSp55qE5pyI5Lu9XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDMwOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChpIDwgMTApIHtcclxuICAgICAgICAgICAgICAgICAgICBpID0gJzAnICsgaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRlbXAucHVzaCgnJyArIGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChudW0gPT09IDIpIHsgLy8g5Yik5patMuaciOS7veWkqeaVsFxyXG4gICAgICAgICAgICBsZXQgeWVhciA9IHBhcnNlSW50KHNlbGVjdFllYXIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh5ZWFyKTtcclxuICAgICAgICAgICAgaWYgKCgoeWVhciAlIDQwMCA9PT0gMCkgfHwgKHllYXIgJSAxMDAgIT09IDApKSAmJiAoeWVhciAlIDQgPT09IDApKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSAyOTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpID0gJzAnICsgaTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcC5wdXNoKCcnICsgaSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSAyODsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpID0gJzAnICsgaTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcC5wdXNoKCcnICsgaSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRlbXA7XHJcbiAgICB9XHJcbiAgICAvLyDorr7nva7pu5jorqTlgLwg5qC85byPMjAxOS0wNy0xMCAxMDozMFxyXG4gICAgc2V0RGVmYXVsdHRpbWVzKCkge1xyXG4gICAgICAgIGxldCBhbGxEYXRlTGlzdCA9IHRoaXMudGltZXMuc3BsaXQoJyAnKTtcclxuICAgICAgICAvLyDml6XmnJ9cclxuICAgICAgICBsZXQgZGF0ZUxpc3QgPSBhbGxEYXRlTGlzdFswXS5zcGxpdCgnLScpO1xyXG4gICAgICAgIGxldCBtb250aCA9IHBhcnNlSW50KGRhdGVMaXN0WzFdKSAtIDE7XHJcbiAgICAgICAgbGV0IGRheSA9IHBhcnNlSW50KGRhdGVMaXN0WzJdKSAtIDE7XHJcbiAgICAgICAgLy8g5pe26Ze0XHJcbiAgICAgICAgbGV0IHRpbWVzTGlzdCA9IGFsbERhdGVMaXN0WzFdLnNwbGl0KCc6Jyk7XHJcbiAgICAgICAgdGhpcy5tdWx0aUFycmF5WzJdID0gdGhpcy5zZXREYXlzKGRhdGVMaXN0WzBdLCBwYXJzZUludChkYXRlTGlzdFsxXSkpO1xyXG4gICAgfVxyXG4gICAgLy8g6I635Y+W5pe26Ze05pel5pyfXHJcbiAgICBQaWNrZXJDaGFuZ2UoZSkge1xyXG4gICAgICAgIHRoaXMubXVsdGlJbmRleCA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5tdWx0aUluZGV4O1xyXG4gICAgICAgIGNvbnN0IHllYXIgPSB0aGlzLm11bHRpQXJyYXlbMF1baW5kZXhbMF1dO1xyXG4gICAgICAgIGNvbnN0IG1vbnRoID0gdGhpcy5tdWx0aUFycmF5WzFdW2luZGV4WzFdXTtcclxuICAgICAgICBjb25zdCBkYXkgPSB0aGlzLm11bHRpQXJyYXlbMl1baW5kZXhbMl1dO1xyXG4gICAgICAgIHRoaXMudGltZXMgPSB5ZWFyICsgJy0nICsgbW9udGggKyAnLScgKyBkYXk7XHJcbiAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy50aW1lcztcclxuICAgIH1cclxuICAgIHRvYXN0KGVycm9yKSB7XHJcbiAgICAgICAgdGhpcy5zaG93VG9hc3QgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZXJyb3IgPSBlcnJvcjtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoYXQuc2hvd1RvYXN0ID0gZmFsc2U7XHJcbiAgICAgICAgfSwgMjAwMCk7XHJcbiAgICB9XHJcbiAgICBpc1R5cGUoYXJ5LCB0eXBlKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgaXRlbSA9IGFyeVtpXTtcclxuICAgICAgICAgICAgaWYgKGl0ZW0gPT09IHR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8g5o6l5pS2JGVtaXTkvKDov4fmnaXnmoTmlbDmja5cclxuXHRcdGV2ZW50cyA9IHtcclxuXHRcdCAgJ3RvUGFyZW50MSc6ICguLi5hcmdzKSA9PiB7XHJcbiAgXHRcdCAgICAgICAgdGhpcy5pbWdzMSA9IGFyZ3NbMF0ubWFwKGkgPT4gaS5pbWFnZVVybCk7XHJcbiAgXHRcdCAgICB9LFxyXG4gIFx0XHQgICAgJ3RvUGFyZW50Mic6ICguLi5hcmdzKSA9PiB7XHJcbiAgXHRcdCAgICAgICAgdGhpcy5pbWdzMiA9IGFyZ3NbMF0ubWFwKGkgPT4gaS5pbWFnZVVybCk7XHJcbiAgXHRcdCAgICAgICAgY29uc29sZS5sb2codGhpcy5pbWdzMiwgJ3RoaXMuaW1nczInKTtcclxuICBcdFx0ICAgIH0sXHJcbiAgXHRcdCAgICAndG9QYXJlbnQzJzogKC4uLmFyZ3MpID0+IHtcclxuICBcdFx0ICAgICAgICB0aGlzLmltZ3MzID0gYXJnc1swXS5tYXAoaSA9PiBpLmltYWdlVXJsKTtcclxuXHRcdCAgfVxyXG5cdFx0fVxyXG4gICAgbWV0aG9kcyA9IHtcclxuICAgICAgICAvLyDliKDpmaRcclxuICAgICAgICBkZWxGdW4oZSkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgICAgICAgICAgICBjb250ZW50OiAn5piv5ZCm56Gu6K6k5Yig6Zmk5b2T5YmN5a6e6aqM5pWw5o2uPycsXHJcbiAgICAgICAgICAgICAgICBjYW5jZWxUZXh0OiAn5Y+W5raIJyxcclxuICAgICAgICAgICAgICAgIGNvbmZpcm1UZXh0OiAn56Gu6K6kJyxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuY29uZmlybSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmZldGNoRGF0YVByb21pc2UoJ3d4L2V4cGVyaW1lbnQvZGVsZXRlRXhwZXJpbWVudFJlY29yZEFwaS5qc29uJywge2lkOiBzZWxmLmZvcm1EYXRhLmlkfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmZvcm1EYXRhID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6L+U5Zue5LiK5LiK5LiA6aG1XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfliKDpmaTmiJDlip8nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHd4Lm5hdmlnYXRlQmFjayh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWx0YTogMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmYWlsOiBmdW5jdGlvbihlcnIpIHt9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8g55uR5ZCscGlja2Vy55qE5rua5Yqo5LqL5Lu2XHJcbiAgICAgICAgYmluZE11bHRpUGlja2VyQ29sdW1uQ2hhbmdlKGUpIHtcclxuICAgICAgICAvLyDojrflj5blubTku71cclxuICAgICAgICAgICAgaWYgKGUuZGV0YWlsLmNvbHVtbiA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaG9vc2VfeWVhciA9IHRoaXMubXVsdGlBcnJheVtlLmRldGFpbC5jb2x1bW5dW2UuZGV0YWlsLnZhbHVlXTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY2hvb3NlX3llYXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCfkv67mlLnnmoTliJfkuLonLCBlLmRldGFpbC5jb2x1bW4sICfvvIzlgLzkuLonLCBlLmRldGFpbC52YWx1ZSk7XHJcbiAgICAgICAgICAgIC8vIOiuvue9ruaciOS7veaVsOe7hFxyXG4gICAgICAgICAgICBpZiAoZS5kZXRhaWwuY29sdW1uID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbnVtID0gcGFyc2VJbnQodGhpcy5tdWx0aUFycmF5W2UuZGV0YWlsLmNvbHVtbl1bZS5kZXRhaWwudmFsdWVdKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubXVsdGlBcnJheVsyXSA9IHRoaXMuc2V0RGF5cyh0aGlzLmNob29zZV95ZWFyLCBudW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLm11bHRpSW5kZXhbZS5kZXRhaWwuY29sdW1uXSA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYmluZFN0YXJ0Q2hhbmdlIChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybURhdGEucmVjb3JkRGF0ZSA9IHRoaXMuUGlja2VyQ2hhbmdlKGUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0TmFtZShlKSB7IC8vIOiOt+W+l+S8muiuruWQjeensFxyXG4gICAgICAgICAgICB0aGlzLmZvcm1EYXRhLnJlY29yZFVzZXIgPSBlLmRldGFpbC52YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldERpczEoZSkge1xyXG4gICAgICAgICAgICB0aGlzLmZvcm1EYXRhLmRldGFpbFsxXS5kZXNjcmlwdGlvbiA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0RGlzKGUpIHtcclxuICAgICAgICAgICAgdGhpcy5mb3JtRGF0YS5kZXRhaWxbMF0uZGVzY3JpcHRpb24gPSBlLmRldGFpbC52YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldERpczIoZSkge1xyXG4gICAgICAgICAgICB0aGlzLmZvcm1EYXRhLmRldGFpbFsyXS5kZXNjcmlwdGlvbiA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0cHVycG9zZShlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybURhdGEudGVtcGVyYXR1cmUgPSBlLmRldGFpbC52YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldHdpbmREaXJlY3Rpb24oZSkgeyAvLyDojrflvpflhajpg6jlhoXlrrlcclxuICAgICAgICAgICAgdGhpcy5mb3JtRGF0YS53aW5kRGlyZWN0aW9uID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXR3ZWF0aGVyKGUpIHtcclxuICAgICAgICAgICAgdGhpcy5mb3JtRGF0YS53ZWF0aGVyID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzYXZlKCkgeyAvLyDkv53lrZhcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLmltZ3MxLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIGlmICghc2VsZi5mb3JtRGF0YS5yZWNvcmRVc2VyIHx8IHNlbGYuZm9ybURhdGEucmVjb3JkVXNlciA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogJ+iusOW9leiAheW/heWhqycsXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzZWxmLmZvcm1EYXRhLnJlY29yZERhdGUgfHwgc2VsZi5mb3JtRGF0YS5yZWNvcmREYXRlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiAn5pel5pyf5b+F5aGrJyxcclxuICAgICAgICAgICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXNlbGYuZm9ybURhdGEudGVtcGVyYXR1cmUgfHwgc2VsZi5mb3JtRGF0YS50ZW1wZXJhdHVyZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogJ+a4qeW6puW/heWhqycsXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzZWxmLmZvcm1EYXRhLndpbmREaXJlY3Rpb24gfHwgc2VsZi5mb3JtRGF0YS53aW5kRGlyZWN0aW9uID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiAn6aOO5ZCR5b+F5aGrJyxcclxuICAgICAgICAgICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXNlbGYuZm9ybURhdGEud2VhdGhlciB8fCBzZWxmLmZvcm1EYXRhLndlYXRoZXIgPT0gJycpIHtcclxuICAgICAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICflpKnmsJTlv4XloasnLFxyXG4gICAgICAgICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICghc2VsZi5mb3JtRGF0YS5kZXRhaWxbMF0uZGVzY3JpcHRpb24gfHwgc2VsZi5mb3JtRGF0YS5kZXRhaWxbMF0uZGVzY3JpcHRpb24gPT0gJycpIHtcclxuICAgICAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICflrp7pqozmlbDmja7nroDku4swMeaPj+i/sOW/heWhqycsXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzZWxmLmZvcm1EYXRhLmRldGFpbFsxXS5kZXNjcmlwdGlvbiB8fCBzZWxmLmZvcm1EYXRhLmRldGFpbFsxXS5kZXNjcmlwdGlvbiA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogJ+WunumqjOaVsOaNrueugOS7izAy5o+P6L+w5b+F5aGrJyxcclxuICAgICAgICAgICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXNlbGYuZm9ybURhdGEuZGV0YWlsWzJdLmRlc2NyaXB0aW9uIHx8IHNlbGYuZm9ybURhdGEuZGV0YWlsWzJdLmRlc2NyaXB0aW9uID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiAn5a6e6aqM5pWw5o2u566A5LuLMDPmj4/ov7Dlv4XloasnLFxyXG4gICAgICAgICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmltZ3MxLmxlbmd0aCAhPT0gMykge1xyXG4gICAgICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogJ+WunumqjOaVsOaNrjAx5Zu65a6aM+W8oOWbvueJhycsXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW1nczIubGVuZ3RoICE9PSAzKSB7XHJcbiAgICAgICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiAn5a6e6aqM5pWw5o2uMDLlm7rlrpoz5byg5Zu+54mHJyxcclxuICAgICAgICAgICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pbWdzMy5sZW5ndGggIT09IDMpIHtcclxuICAgICAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICflrp7pqozmlbDmja4wM+WbuuWumjPlvKDlm77niYcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZWxmLmZvcm1EYXRhLmRldGFpbFswXS5pbWcxID0gdGhpcy5pbWdzMVswXTtcclxuICAgICAgICAgICAgc2VsZi5mb3JtRGF0YS5kZXRhaWxbMF0uaW1nMiA9IHRoaXMuaW1nczFbMV07XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybURhdGEuZGV0YWlsWzBdLmltZzMgPSB0aGlzLmltZ3MxWzJdO1xyXG4gICAgICAgICAgICBzZWxmLmZvcm1EYXRhLmRldGFpbFsxXS5pbWcxID0gdGhpcy5pbWdzMlswXTtcclxuICAgICAgICAgICAgc2VsZi5mb3JtRGF0YS5kZXRhaWxbMV0uaW1nMiA9IHRoaXMuaW1nczJbMV07XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybURhdGEuZGV0YWlsWzFdLmltZzMgPSB0aGlzLmltZ3MyWzJdO1xyXG4gICAgICAgICAgICBzZWxmLmZvcm1EYXRhLmRldGFpbFsyXS5pbWcxID0gdGhpcy5pbWdzM1swXTtcclxuICAgICAgICAgICAgc2VsZi5mb3JtRGF0YS5kZXRhaWxbMl0uaW1nMiA9IHRoaXMuaW1nczNbMV07XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybURhdGEuZGV0YWlsWzJdLmltZzMgPSB0aGlzLmltZ3MzWzJdO1xyXG4gICAgICAgICAgICB0aGlzLmZvcm1EYXRhLmV4cGVyaW1lbnRJZCA9IHRoaXMuaWQ7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmVkaXQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybURhdGEudXNlciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3d4L2V4cGVyaW1lbnQvdXBkYXRlRXhwZXJpbWVudFJlY29yZEFwaS5qc29uJywgdGhpcy5mb3JtRGF0YSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZm9ybURhdGEgPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g6L+U5Zue5LiK5LiK5LiA6aG1XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+e3qOi8r+aIkOWKnydcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd3gubmF2aWdhdGVCYWNrKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWx0YTogMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgnd3gvZXhwZXJpbWVudC9jcmVhdGVFeHBlcmltZW50UmVjb3JkQXBpLmpzb24nLCB0aGlzLmZvcm1EYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5mb3JtRGF0YSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDov5Tlm57kuIrkuIDpobVcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5paw5aKe5oiQ5YqfJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3eC5uYXZpZ2F0ZUJhY2soe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbHRhOiAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgIH1cclxuICAgIC8vIGVuZEZ1biAoKSB7XHJcbiAgICAvLyAgIGlmICh0aGlzLmZvcm1EYXRhLmVuZERhdGUxKSB0aGlzLnRpbWVzID0gdGhpcy5mb3JtRGF0YS5lbmREYXRlMVxyXG4gICAgLy8gfVxyXG4gICAgLy8gc3RhcnREYXRlICgpIHtcclxuICAgIC8vICAgaWYgKHRoaXMuZm9ybURhdGEuc3RhcnREYXRlMSkgdGhpcy50aW1lcyA9IHRoaXMuZm9ybURhdGEuc3RhcnREYXRlMVxyXG4gICAgLy8gfVxyXG4gICAgb25Mb2FkKG9wdGlvbnMpIHtcclxuICAgICAgICAvLyDojrflj5bnu4/nuqzluqZcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuaWQpIHtcclxuICAgICAgICAgICAgdGhpcy5pZCA9IG9wdGlvbnMuaWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvcHRpb25zLnJlY29yZCkge1xyXG4gICAgICAgICAgICB0aGlzLmVkaXQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmZvcm1EYXRhID0gSlNPTi5wYXJzZShvcHRpb25zLnJlY29yZCk7XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybURhdGEuZGV0YWlsID0gW3t9LCB7fSwge31dO1xyXG4gICAgICAgICAgICB0aGlzLmZvcm1EYXRhLmRldGFpbFswXS5kZXNjcmlwdGlvbiA9IHRoaXMuZm9ybURhdGEuZGV0YWlsRW50aXR5TGlzdFswXS5kZXNjcmlwdGlvbjtcclxuICAgICAgICAgICAgdGhpcy5mb3JtRGF0YS5kZXRhaWxbMV0uZGVzY3JpcHRpb24gPSB0aGlzLmZvcm1EYXRhLmRldGFpbEVudGl0eUxpc3RbMV0uZGVzY3JpcHRpb247XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybURhdGEuZGV0YWlsWzJdLmRlc2NyaXB0aW9uID0gdGhpcy5mb3JtRGF0YS5kZXRhaWxFbnRpdHlMaXN0WzJdLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5mb3JtRGF0YS5kZXRhaWxFbnRpdHlMaXN0O1xyXG4gICAgICAgICAgICB0aGlzLmltZ3MxID0gW2l0ZW1bMF0uaW1nMSwgaXRlbVswXS5pbWcyLCBpdGVtWzBdLmltZzNdO1xyXG4gICAgICAgICAgICB0aGlzLmltZ3MyID0gW2l0ZW1bMV0uaW1nMSwgaXRlbVsxXS5pbWcyLCBpdGVtWzFdLmltZzNdO1xyXG4gICAgICAgICAgICB0aGlzLmltZ3MzID0gW2l0ZW1bMl0uaW1nMSwgaXRlbVsyXS5pbWcyLCBpdGVtWzJdLmltZzNdO1xyXG4gICAgICAgICAgICB0aGlzLiRicm9hZGNhc3QoJ2luZGV4LWJyb2FkY2FzdCcsIHRoaXMuZm9ybURhdGEuZGV0YWlsRW50aXR5TGlzdCk7XHJcbiAgICAgICAgICAgIHd4LnNldE5hdmlnYXRpb25CYXJUaXRsZSh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ+e8lui+keWunumqjOaVsOaNridcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2V0dGltZXNEYXRlKCk7XHJcbiAgICAgICAgdGhpcy5tdWx0aUFycmF5ID0gW3RoaXMueWVhcnMsIHRoaXMubW9udGhzLCB0aGlzLmRheXNdO1xyXG4gICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICB9XHJcbiAgICB3aGVuQXBwUmVhZHlTaG93KCkge1xyXG4gICAgICAgIC8vIOavj+asoemDveWIt+aWsFxyXG4gICAgICAgIHd4LnNldFN0b3JhZ2VTeW5jKCd1cGxvYWRBcHBJZCcsIHRoaXMuY29uZmlnLnVwbG9hZEFwcElkKTtcclxuICAgICAgICB3eC5zZXRTdG9yYWdlU3luYygndXBsb2FkVXJsJywgdGhpcy5jb25maWcudXBsb2FkVXJsKTtcclxuICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgfVxyXG4gIH1cclxuIl19