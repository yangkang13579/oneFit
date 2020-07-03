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

var one = ['柑橘', '水稻', '小麦', '玉米', '马铃薯', '棉花', '大豆', '花生', '果蔬类', '苹果', '其他作物'];
var two = [['柑类', '橘类', '杂柑类', '橙类', '柚类', '柠檬'], ['旱直播稻', '水直播稻', '人工抛秧', '机械插秧'], ['春小麦', '冬小麦'], ['夏玉米', '春玉米'], ['春季薯', '夏季薯', '冬季薯'], ['新陆早系列', '新陆中系列', '中字号棉花品种', '鲁棉系列品种', '冀棉系列品种'], ['中字号棉花品种', '鲁棉系列品种'], ['春大豆', '夏大豆'], ['春花生', '夏花生'], ['番茄', '辣椒', '辣椒', '甜椒', '茄子', '黄瓜', '豇豆', '菜豆', '甘蓝', '冬瓜', '南瓜', '甜瓜', '西瓜', '葱', '姜', '蒜'], ['早熟品种', '中熟品种', '晚熟品种'], ['梨树', '桃树', '荔枝', '樱桃', '芒果', '花卉', '油菜', '茶叶', '葡萄', '烟草']];

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
            navigationBarTitleText: '样品申领表单页',
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
            codeName: '获取验证码',
            indexs: null
        }, _this.methods = {
            getIndex: function getIndex(e) {
                this.index = e.currentTarget.dataset.index;
            },

            getarea: function getarea(e) {
                console.log(e);
                var value = e.detail.value;
                this.goods[this.index]['area'] = value;
            },
            getGoods2: function getGoods2(e) {
                var value = e.detail.value;
                console.log(this.goods[this.index].goodsAry[value].length);
                this.goods[this.index]['cropsCategory2'] = this.goods[this.index].goodsAry[value].length > 4 ? this.goods[this.index].goodsAry[value].substring(0, 4) : this.goods[this.index].goodsAry[value];
            },

            getGoods: function getGoods(e) {
                console.log(e);
                var value = e.detail.value;
                this.goods[this.index].goodsAry = this.two[value];
                this.goods[this.index]['cropsCategory1'] = this.one[value];
                this.goods[this.index]['cropsCategory2'] = '';
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
                                // 发送请求通过经纬度反查地址信息
                                that.fetchDataPromise('resolveLocationApi.json', {
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
                // 获得全部内容
                this.formData.content = e.detail.value;
                this.$apply();
            },
            getleader: function getleader(e) {
                // 获得领导
                this.formData.leader = e.detail.value;
                this.$apply();
            },
            getcompanyName: function getcompanyName(e) {
                this.formData.companyName = e.detail.value;
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

                this.formData.mobile = this.formData.phoneNum;
                if (!self.formData.addressee || self.formData.addressee == '') {
                    wx.showModal({
                        title: '提示',
                        content: '姓名必填',
                        showCancel: false
                    });
                    return;
                } else if (!self.formData.applyCount || self.formData.applyCount == '') {
                    wx.showModal({
                        title: '提示',
                        content: '申请数量必填',
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
                } else if (!self.formData.address || self.formData.address == '') {
                    wx.showModal({
                        title: '提示',
                        content: '详细地址必填',
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
                console.log('this.formData', this.formData);

                this.fetchDataPromise('wx/specimen/applySpecimenApi.json', this.formData).then(function (data) {
                    console.log('data', data);
                    if (data.result == true) {
                        wx.showToast({
                            title: '样品申领成功',
                            icon: 'success',
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
            var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
            return reg.test(str);
        }
    }, {
        key: 'getValidCode',
        value: function getValidCode() {
            var that = this;
            if (this.sendBtn === true) return;
            if (this.isPhone(this.formData.phoneNum) === false) {
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

                this.fetchDataPromise('wx/sendVerificationCodeApi.json', {
                    phoneNum: this.formData.phoneNum
                }).then(function (data) {
                    wx.showToast({
                        title: '发送成功请查收'
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
            console.log('options', options);
            this.codeName = '获取验证码', this.limitTime = 60;
            this.disabled = true;
            clearTimeout(this.clsTimeout);
            var that = this;
            if (options.id) {
                that.formData.id = options.id;
                console.log('that.formData.id', that.formData.id);
            }
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
                }
            }
            this.districts = districts;
            this.$apply();
        }
    }]);

    return Form;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(Form , 'pages/form'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvcm0uanMiXSwibmFtZXMiOlsib25lIiwidHdvIiwiRm9ybSIsIm1peGlucyIsIlBhZ2VNaXhpbiIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiZGF0YSIsImdvb2RzQXJ5IiwiYXJyYXlMZXZlbCIsInJvbGUiLCJzZW5kQnRuIiwibGltaXRUaW1lIiwiZGlzYWJsZWQiLCJjbGFzc2lmeUFyeSIsImdvb2RzIiwiYXJlYSIsImNyb3BzQ2F0ZWdvcnkiLCJ0eXBlIiwiZm9ybURhdGEiLCJkYXRlIiwidGltZXMiLCJ5ZWFycyIsIm1vbnRocyIsImRheXMiLCJob3VycyIsIm1pbnV0ZXMiLCJzZWNvbmQiLCJtdWx0aUFycmF5IiwibXVsdGlJbmRleCIsImNob29zZV95ZWFyIiwieWVhckluZGV4IiwiYWRkcmVzcyIsImNvZGVOYW1lIiwiaW5kZXhzIiwibWV0aG9kcyIsImdldEluZGV4IiwiZSIsImluZGV4IiwiY3VycmVudFRhcmdldCIsImRhdGFzZXQiLCJnZXRhcmVhIiwiY29uc29sZSIsImxvZyIsInZhbHVlIiwiZGV0YWlsIiwiZ2V0R29vZHMyIiwibGVuZ3RoIiwic3Vic3RyaW5nIiwiZ2V0R29vZHMiLCJhZGRGdW4iLCJ3eCIsInNob3dNb2RhbCIsInRpdGxlIiwiY29udGVudCIsInNob3dDYW5jZWwiLCJwdXNoIiwiJGFwcGx5IiwiZGVsIiwic3BsaWNlIiwic2VuZEZ1biIsImdldFZhbGlkQ29kZSIsImNob29zZUxvY2F0aW9uIiwidGhhdCIsImdldExvY2F0aW9uIiwic3VjY2VzcyIsInJlcyIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwicmVzdCIsImZldGNoRGF0YVByb21pc2UiLCJ0aGVuIiwicHJvdmluY2VOYW1lIiwiY2l0eU5hbWUiLCJkaXN0cmljdE5hbWUiLCJnZXRSZW1hcmsiLCJhcHBseVJlYXNvbiIsImJpbmRMZXZlckNoYW5nZSIsImRlYWxlckxldmVsIiwiYmluZFJlZ2lvbkNoYW5nZSIsImNoYW5nZUNsYXNzaWZ5IiwiY2xhc3NpZnkiLCJnZXRDb2RlIiwiY29kZSIsImJpbmRNdWx0aVBpY2tlckNvbHVtbkNoYW5nZSIsImNvbHVtbiIsIm51bSIsInBhcnNlSW50Iiwic2V0RGF5cyIsImJpbmRTdGFydENoYW5nZSIsInN0YXJ0RGF0ZTEiLCJQaWNrZXJDaGFuZ2UiLCJiaW5kRW5kQ2hhbmdlIiwiZW5kRGF0ZTEiLCJnZXR0aW1lcyIsInNob3dBZGRyQ2hvc2UiLCJpc1Nob3dBZGRyZXNzQ2hvc2UiLCJjYW5jZWwiLCJmaW5pc2giLCJnZXROYW1lIiwiYWRkcmVzc2VlIiwiZ2V0TnVtYmVyIiwiYXBwbHlDb3VudCIsImdldHBob25lTnVtIiwicGhvbmVOdW0iLCJnZXRDb250ZW50IiwiZ2V0bGVhZGVyIiwibGVhZGVyIiwiZ2V0Y29tcGFueU5hbWUiLCJjb21wYW55TmFtZSIsImdldGFkZHJlc3MiLCJnZXR1c2VyQ291bnQiLCJ1c2VyQ2FwYWNpdHkiLCJzYXZlIiwic2VsZiIsIm1vYmlsZSIsImlzUGhvbmUiLCJpIiwibWFwIiwib2JqIiwiaXRlbSIsImNyb3BzQ2F0ZWdvcnkxIiwiY3JvcHNDYXRlZ29yeTIiLCJjcm9wc0NhdGVnb3J5QW5kQXJlYSIsInJlc3VsdCIsInNob3dUb2FzdCIsImljb24iLCJkdXJhdGlvbiIsInNldFRpbWVvdXQiLCJuYXZpZ2F0ZUJhY2siLCJkZWx0YSIsInQiLCJEYXRlIiwiX3llYXJJbmRleCIsImluZm8iLCJfZGVmYXVsdFllYXIiLCJzcGxpdCIsImdldEZ1bGxZZWFyIiwiY2xlYXJUaW1lb3V0IiwiY2xzVGltZW91dCIsInNldFRpbWUiLCJzZWxlY3RZZWFyIiwic2VsZWN0TW9udGgiLCJ0ZW1wIiwieWVhciIsImFsbERhdGVMaXN0IiwiZGF0ZUxpc3QiLCJtb250aCIsImRheSIsInRpbWVzTGlzdCIsImhvdXIiLCJtaW51dGUiLCJzdHIiLCJyZWciLCJ0ZXN0Iiwic2hvd0xvYWRpbmciLCJvcHRpb25zIiwiaWQiLCJnZXRTdG9yYWdlIiwia2V5IiwiSlNPTiIsInBhcnNlIiwibmFtZSIsInVzZXJOYW1lIiwiZmFpbCIsInRpbWVzRnVuIiwiZ2V0TW9udGgiLCJnZXREYXRlIiwic2V0dGltZXNEYXRlIiwiY3VycmVudE1vbnRoIiwiY3VycmVudERheSIsInNldERlZmF1bHR0aW1lcyIsIm9wdGlvbiIsIm5hdGlvbmFsRGF0YSIsInByb3ZpbmNlcyIsInByb3ZpbmNlIiwiem9uZV9uYW1lIiwiY2l0aWVzIiwiY3VycmVudENpdGllcyIsImN1cnJlbnRQcm92aW5jZUluZGV4IiwiY2l0eXMiLCJjaXR5IiwiZGlzdHJpY3RzIiwiY3VycmVudERpc3RyaWN0cyIsImN1cnJlbnRDaXR5SW5kZXgiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFDQSxJQUFJQSxNQUFNLENBQ04sSUFETSxFQUVOLElBRk0sRUFHTixJQUhNLEVBSU4sSUFKTSxFQUtOLEtBTE0sRUFNTixJQU5NLEVBT04sSUFQTSxFQVFOLElBUk0sRUFTTixLQVRNLEVBVU4sSUFWTSxFQVdOLE1BWE0sQ0FBVjtBQWFBLElBQUlDLE1BQU0sQ0FDTixDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsS0FBYixFQUFvQixJQUFwQixFQUEwQixJQUExQixFQUFnQyxJQUFoQyxDQURNLEVBRU4sQ0FBQyxNQUFELEVBQVMsTUFBVCxFQUFpQixNQUFqQixFQUF5QixNQUF6QixDQUZNLEVBR04sQ0FBQyxLQUFELEVBQVEsS0FBUixDQUhNLEVBSU4sQ0FBQyxLQUFELEVBQVEsS0FBUixDQUpNLEVBS04sQ0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLEtBQWYsQ0FMTSxFQU1OLENBQ0ksT0FESixFQUVJLE9BRkosRUFHSSxTQUhKLEVBSUksUUFKSixFQUtJLFFBTEosQ0FOTSxFQWFOLENBQUMsU0FBRCxFQUFZLFFBQVosQ0FiTSxFQWNOLENBQUMsS0FBRCxFQUFRLEtBQVIsQ0FkTSxFQWVOLENBQUMsS0FBRCxFQUFRLEtB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QTVDLEVBQW1EO0FBQ25EO0FBQ0kscUJBQUsrSixNQUFMLEdBQWMsRUFBZDtBQUNBLG9CQUFJQSxTQUFTLEtBQUtBLE1BQWxCO0FBQ0Esb0JBQUlDLGdCQUFnQkwsYUFBYUQsT0FBT08sb0JBQXBCLEVBQTBDQyxLQUE5RDtBQUNBLHFCQUFLLElBQUkvRCxJQUFJLENBQWIsRUFBZ0JBLElBQUk2RCxjQUFjbkksTUFBbEMsRUFBMENzRSxHQUExQyxFQUErQztBQUMzQzRELDJCQUFPekgsSUFBUCxDQUFZO0FBQ1JsQiwrQkFBTytFLENBREM7QUFFUmdFLDhCQUFNSCxjQUFjN0QsQ0FBZCxFQUFpQjJEO0FBRmYscUJBQVo7QUFJSDtBQUNELHFCQUFLQyxNQUFMLEdBQWNBLE1BQWQ7QUFDSDtBQUNEO0FBQ0E7QUFDQSxpQkFBS0ssU0FBTCxHQUFpQixFQUFqQjtBQUNBLGdCQUFJQSxZQUFZLEtBQUtBLFNBQXJCO0FBQ0EsZ0JBQUlDLG1CQUNKVixhQUFhRCxPQUFPTyxvQkFBcEIsRUFBMENDLEtBQTFDLENBQWdEUixPQUFPWSxnQkFBdkQsRUFDS0YsU0FGTDtBQUdBLGlCQUFLLElBQUlqRSxJQUFJLENBQWIsRUFBZ0JBLElBQUlrRSxpQkFBaUJ4SSxNQUFyQyxFQUE2Q3NFLEdBQTdDLEVBQWtEO0FBQzlDLG9CQUFJQSxLQUFLLENBQVQsRUFBWTtBQUNSaUUsOEJBQVU5SCxJQUFWLENBQWUrSCxpQkFBaUJsRSxDQUFqQixFQUFvQjJELFNBQW5DO0FBQ0g7QUFDSjtBQUNELGlCQUFLTSxTQUFMLEdBQWlCQSxTQUFqQjtBQUNBLGlCQUFLN0gsTUFBTDtBQUNIOzs7O0VBcndCK0JnSSxlQUFLQyxJOztrQkFBbEJ6TCxJIiwiZmlsZSI6ImZvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XHJcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vbWl4aW5zL3BhZ2UnO1xyXG52YXIgb25lID0gW1xyXG4gICAgJ+afkeapmCcsXHJcbiAgICAn5rC056i7JyxcclxuICAgICflsI/puqYnLFxyXG4gICAgJ+eOieexsycsXHJcbiAgICAn6ams6ZOD6JavJyxcclxuICAgICfmo4noirEnLFxyXG4gICAgJ+Wkp+ixhicsXHJcbiAgICAn6Iqx55SfJyxcclxuICAgICfmnpzolKznsbsnLFxyXG4gICAgJ+iLueaenCcsXHJcbiAgICAn5YW25LuW5L2c54mpJ1xyXG5dO1xyXG52YXIgdHdvID0gW1xyXG4gICAgWyfmn5HnsbsnLCAn5qmY57G7JywgJ+adguafkeexuycsICfmqZnnsbsnLCAn5p+a57G7JywgJ+afoOaqrCddLFxyXG4gICAgWyfml7Hnm7Tmkq3nqLsnLCAn5rC055u05pKt56i7JywgJ+S6uuW3peaKm+enpycsICfmnLrmorDmj5Lnp6cnXSxcclxuICAgIFsn5pil5bCP6bqmJywgJ+WGrOWwj+m6piddLFxyXG4gICAgWyflpI/njonnsbMnLCAn5pil546J57GzJ10sXHJcbiAgICBbJ+aYpeWto+iWrycsICflpI/lraPolq8nLCAn5Yas5a2j6JavJ10sXHJcbiAgICBbXHJcbiAgICAgICAgJ+aWsOmZhuaXqeezu+WIlycsXHJcbiAgICAgICAgJ+aWsOmZhuS4reezu+WIlycsXHJcbiAgICAgICAgJ+S4reWtl+WPt+ajieiKseWTgeenjScsXHJcbiAgICAgICAgJ+mygeajieezu+WIl+WTgeenjScsXHJcbiAgICAgICAgJ+WGgOajieezu+WIl+WTgeenjSdcclxuICAgIF0sXHJcbiAgICBbJ+S4reWtl+WPt+ajieiKseWTgeenjScsICfpsoHmo4nns7vliJflk4Hnp40nXSxcclxuICAgIFsn5pil5aSn6LGGJywgJ+Wkj+Wkp+ixhiddLFxyXG4gICAgWyfmmKXoirHnlJ8nLCAn5aSP6Iqx55SfJ10sXHJcbiAgICBbXHJcbiAgICAgICAgJ+eVquiMhCcsXHJcbiAgICAgICAgJ+i+o+akkicsXHJcbiAgICAgICAgJ+i+o+akkicsXHJcbiAgICAgICAgJ+eUnOakkicsXHJcbiAgICAgICAgJ+iMhOWtkCcsXHJcbiAgICAgICAgJ+m7hOeTnCcsXHJcbiAgICAgICAgJ+ixh+ixhicsXHJcbiAgICAgICAgJ+iPnOixhicsXHJcbiAgICAgICAgJ+eUmOiTnScsXHJcbiAgICAgICAgJ+WGrOeTnCcsXHJcbiAgICAgICAgJ+WNl+eTnCcsXHJcbiAgICAgICAgJ+eUnOeTnCcsXHJcbiAgICAgICAgJ+ilv+eTnCcsXHJcbiAgICAgICAgJ+iRsScsXHJcbiAgICAgICAgJ+WnnCcsXHJcbiAgICAgICAgJ+iSnCdcclxuICAgIF0sXHJcbiAgICBbJ+aXqeeGn+WTgeenjScsICfkuK3nhp/lk4Hnp40nLCAn5pma54af5ZOB56eNJ10sXHJcbiAgICBbXHJcbiAgICAgICAgJ+aiqOagkScsXHJcbiAgICAgICAgJ+ahg+agkScsXHJcbiAgICAgICAgJ+iNlOaenScsXHJcbiAgICAgICAgJ+aoseahgycsXHJcbiAgICAgICAgJ+iKkuaenCcsXHJcbiAgICAgICAgJ+iKseWNiScsXHJcbiAgICAgICAgJ+ayueiPnCcsXHJcbiAgICAgICAgJ+iMtuWPticsXHJcbiAgICAgICAgJ+iRoeiQhCcsXHJcbiAgICAgICAgJ+eDn+iNiSdcclxuICAgIF1cclxuXTtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRm9ybSBleHRlbmRzIHdlcHkucGFnZSB7XHJcbiAgbWl4aW5zID0gW1BhZ2VNaXhpbl07XHJcbiAgY29uZmlnID0ge1xyXG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn5qC35ZOB55Sz6aKG6KGo5Y2V6aG1JyxcclxuICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNmZmYnXHJcbiAgfTtcclxuICBkYXRhID0ge1xyXG4gICAgICBnb29kc0FyeTogW10sXHJcbiAgICAgIG9uZTogW1xyXG4gICAgICAgICAgJ+afkeapmCcsXHJcbiAgICAgICAgICAn5rC056i7JyxcclxuICAgICAgICAgICflsI/puqYnLFxyXG4gICAgICAgICAgJ+eOieexsycsXHJcbiAgICAgICAgICAn6ams6ZOD6JavJyxcclxuICAgICAgICAgICfmo4noirEnLFxyXG4gICAgICAgICAgJ+Wkp+ixhicsXHJcbiAgICAgICAgICAn6Iqx55SfJyxcclxuICAgICAgICAgICfmnpzolKznsbsnLFxyXG4gICAgICAgICAgJ+iLueaenCcsXHJcbiAgICAgICAgICAn5YW25LuW5L2c54mpJ1xyXG4gICAgICBdLFxyXG4gICAgICB0d286IFtcclxuICAgICAgICAgIFsn5p+R57G7JywgJ+apmOexuycsICfmnYLmn5HnsbsnLCAn5qmZ57G7JywgJ+afmuexuycsICfmn6DmqqwnXSxcclxuICAgICAgICAgIFsn5pex55u05pKt56i7JywgJ+awtOebtOaSreeouycsICfkurrlt6Xmipvnp6cnLCAn5py65qKw5o+S56enJ10sXHJcbiAgICAgICAgICBbJ+aYpeWwj+m6picsICflhqzlsI/puqYnXSxcclxuICAgICAgICAgIFsn5aSP546J57GzJywgJ+aYpeeOieexsyddLFxyXG4gICAgICAgICAgWyfmmKXlraPolq8nLCAn5aSP5a2j6JavJywgJ+WGrOWto+iWryddLFxyXG4gICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICfmlrDpmYbml6nns7vliJcnLFxyXG4gICAgICAgICAgICAgICfmlrDpmYbkuK3ns7vliJcnLFxyXG4gICAgICAgICAgICAgICfkuK3lrZflj7fmo4noirHlk4Hnp40nLFxyXG4gICAgICAgICAgICAgICfpsoHmo4nns7vliJflk4Hnp40nLFxyXG4gICAgICAgICAgICAgICflhoDmo4nns7vliJflk4Hnp40nXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgWyfmmKXlpKfosYYnLCAn5aSP5aSn6LGGJ10sXHJcbiAgICAgICAgICBbJ+aYpeiKseeUnycsICflpI/oirHnlJ8nXSxcclxuICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAn55Wq6IyEJyxcclxuICAgICAgICAgICAgICAn6L6j5qSSJyxcclxuICAgICAgICAgICAgICAn6L6j5qSSJyxcclxuICAgICAgICAgICAgICAn55Sc5qSSJyxcclxuICAgICAgICAgICAgICAn6IyE5a2QJyxcclxuICAgICAgICAgICAgICAn6buE55OcJyxcclxuICAgICAgICAgICAgICAn6LGH6LGGJyxcclxuICAgICAgICAgICAgICAn6I+c6LGGJyxcclxuICAgICAgICAgICAgICAn55SY6JOdJyxcclxuICAgICAgICAgICAgICAn5Yas55OcJyxcclxuICAgICAgICAgICAgICAn5Y2X55OcJyxcclxuICAgICAgICAgICAgICAn55Sc55OcJyxcclxuICAgICAgICAgICAgICAn6KW/55OcJyxcclxuICAgICAgICAgICAgICAn6JGxJyxcclxuICAgICAgICAgICAgICAn5aecJyxcclxuICAgICAgICAgICAgICAn6JKcJ1xyXG4gICAgICAgICAgXSxcclxuICAgICAgICAgIFsn5pep54af5ZOB56eNJywgJ+S4reeGn+WTgeenjScsICfmmZrnhp/lk4Hnp40nXSxcclxuICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAn5qKo5qCRJyxcclxuICAgICAgICAgICAgICAn5qGD5qCRJyxcclxuICAgICAgICAgICAgICAn6I2U5p6dJyxcclxuICAgICAgICAgICAgICAn5qix5qGDJyxcclxuICAgICAgICAgICAgICAn6IqS5p6cJyxcclxuICAgICAgICAgICAgICAn6Iqx5Y2JJyxcclxuICAgICAgICAgICAgICAn5rK56I+cJyxcclxuICAgICAgICAgICAgICAn6Iy25Y+2JyxcclxuICAgICAgICAgICAgICAn6JGh6JCEJyxcclxuICAgICAgICAgICAgICAn54Of6I2JJ1xyXG4gICAgICAgICAgXVxyXG4gICAgICBdLFxyXG4gICAgICBhcnJheUxldmVsOiBbJ+ecgee6p+e7j+mUgOWVhicsICflnLDluILnuqfnu4/plIDllYYnLCAn5Y6/57qn57uP6ZSA5ZWGJywgJ+S5oemVhy/pm7bllK7nu4/plIDllYYnXSxcclxuICAgICAgcm9sZTogbnVsbCxcclxuICAgICAgc2VuZEJ0bjogZmFsc2UsXHJcbiAgICAgIGxpbWl0VGltZTogNjAsXHJcbiAgICAgIGRpc2FibGVkOiB0cnVlLFxyXG4gICAgICBjbGFzc2lmeUFyeTogWyfnu4/plIDllYbkvJonLCAn5Yac5rCR5LyaJywgJ+inguaRqeS8micsICfkv4PplIDkvJonLCAn5YW25LuW5Lya6K6uJ10sXHJcbiAgICAgIGdvb2RzOiBbeyBhcmVhOiAnJywgY3JvcHNDYXRlZ29yeTogJycgfV0sXHJcbiAgICAgIHR5cGU6IG51bGwsXHJcbiAgICAgIGZvcm1EYXRhOiB7fSxcclxuICAgICAgZGF0ZTogJzIwMTYtMDktMDEnLFxyXG4gICAgICB0aW1lczogJzIwMjAtMDctMjkgMTI6NTAnLFxyXG4gICAgICAvLyDml7bpl7TpgInmi6nlmajlj4LmlbBcclxuICAgICAgeWVhcnM6IFtdLFxyXG4gICAgICBtb250aHM6IFtdLFxyXG4gICAgICBkYXlzOiBbXSxcclxuICAgICAgaG91cnM6IFtdLFxyXG4gICAgICBtaW51dGVzOiBbXSxcclxuICAgICAgc2Vjb25kOiBbXSxcclxuICAgICAgbXVsdGlBcnJheTogW10sIC8vIOmAieaLqeiMg+WbtFxyXG4gICAgICBtdWx0aUluZGV4OiBbMCwgOSwgMTYsIDEzLCAxN10sIC8vIOmAieS4reWAvOaVsOe7hFxyXG4gICAgICBjaG9vc2VfeWVhcjogJycsXHJcbiAgICAgIHllYXJJbmRleDogMCxcclxuICAgICAgYWRkcmVzczogW10sXHJcbiAgICAgIGNvZGVOYW1lOiAn6I635Y+W6aqM6K+B56CBJyxcclxuICAgICAgaW5kZXhzOiBudWxsXHJcbiAgfTtcclxuICAvLyDlt67kuIDkvY3ooaXkvY1cclxuICB0aW1lc0Z1bih0KSB7XHJcbiAgICAgIGlmICh0IDwgMTApIHJldHVybiAnMCcgKyB0O1xyXG4gICAgICBlbHNlIHJldHVybiB0O1xyXG4gIH1cclxuXHJcbiAgLy8g6K6+572u5Yid5aeL5YC8XHJcbiAgc2V0dGltZXNEYXRlKCkge1xyXG4gICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgbGV0IF95ZWFySW5kZXggPSAwO1xyXG4gICAgICAvLyDpu5jorqTorr7nva5cclxuICAgICAgY29uc29sZS5pbmZvKHRoaXMudGltZXMpO1xyXG4gICAgICBsZXQgX2RlZmF1bHRZZWFyID0gdGhpcy50aW1lcyA/IHRoaXMudGltZXMuc3BsaXQoJy0nKVswXSA6IDA7XHJcbiAgICAgIC8vIOiOt+WPluW5tFxyXG4gICAgICBmb3IgKGxldCBpID0gZGF0ZS5nZXRGdWxsWWVhcigpOyBpIDw9IGRhdGUuZ2V0RnVsbFllYXIoKSArIDU7IGkrKykge1xyXG4gICAgICAgICAgdGhpcy55ZWFycy5wdXNoKCcnICsgaSk7XHJcbiAgICAgICAgICAvLyDpu5jorqTorr7nva7nmoTlubTnmoTkvY3nva5cclxuICAgICAgICAgIGlmIChfZGVmYXVsdFllYXIgJiYgaSA9PT0gcGFyc2VJbnQoX2RlZmF1bHRZZWFyKSkge1xyXG4gICAgICAgICAgICAgIHRoaXMueWVhckluZGV4ID0gX3llYXJJbmRleDtcclxuICAgICAgICAgICAgICB0aGlzLmNob29zZV95ZWFyID0gX2RlZmF1bHRZZWFyO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgX3llYXJJbmRleCA9IF95ZWFySW5kZXggKyAxO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIOiOt+WPluaciOS7vVxyXG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSAxMjsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgICAgICAgaSA9ICcwJyArIGk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLm1vbnRocy5wdXNoKCcnICsgaSk7XHJcbiAgICAgIH1cclxuICAgICAgLy8g6I635Y+W5pel5pyfXHJcbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDMxOyBpKyspIHtcclxuICAgICAgICAgIGlmIChpIDwgMTApIHtcclxuICAgICAgICAgICAgICBpID0gJzAnICsgaTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuZGF5cy5wdXNoKCcnICsgaSk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gLy8g6I635Y+W5bCP5pe2XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjQ7IGkrKykge1xyXG4gICAgICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgICAgICAgIGkgPSAnMCcgKyBpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5ob3Vycy5wdXNoKCcnICsgaSk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gLy8g6I635Y+W5YiG6ZKfXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNjA7IGkrKykge1xyXG4gICAgICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgICAgICAgIGkgPSAnMCcgKyBpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5taW51dGVzLnB1c2goJycgKyBpKTtcclxuICAgICAgfVxyXG4gICAgICAvLyAvLyDojrflj5bnp5LmlbBcclxuICAgICAgLy8gZm9yIChsZXQgaSA9IDA7IGkgPCA2MDsgaSsrKSB7XHJcbiAgICAgIC8vICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAvLyAgICAgaSA9ICcwJyArIGlcclxuICAgICAgLy8gICB9XHJcbiAgICAgIC8vICAgdGhpcy5zZWNvbmQucHVzaCgnJyArIGkpXHJcbiAgICAgIC8vIH1cclxuICB9XHJcbiAgc2V0VGltZSgpIHtcclxuICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICBpZiAodGhpcy5saW1pdFRpbWUgPD0gMCkge1xyXG4gICAgICAgICAgdGhpcy5saW1pdFRpbWUgPSA2MDtcclxuICAgICAgICAgIHRoaXMuc2VuZEJ0biA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy5jb2RlTmFtZSA9ICfph43mlrDojrflj5YnO1xyXG4gICAgICAgICAgdGhpcy5zZW5kQnRuID0gZmFsc2U7XHJcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5jbHNUaW1lb3V0KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuc2VuZEJ0biA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLmxpbWl0VGltZS0tO1xyXG4gICAgICAgICAgdGhpcy5jb2RlTmFtZSA9IHRoaXMubGltaXRUaW1lICsgJ3Pph43mlrDojrflj5YnO1xyXG4gICAgICAgICAgdGhpcy5jbHNUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICB0aGF0LnNldFRpbWUoKTtcclxuICAgICAgICAgICAgICB0aGF0LiRhcHBseSgpO1xyXG4gICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgIH1cclxuICB9XHJcbiAgLy8g6L+U5Zue5pyI5Lu955qE5aSp5pWwXHJcbiAgc2V0RGF5cyhzZWxlY3RZZWFyLCBzZWxlY3RNb250aCkge1xyXG4gICAgICBsZXQgbnVtID0gc2VsZWN0TW9udGg7XHJcbiAgICAgIGxldCB0ZW1wID0gW107XHJcbiAgICAgIGlmIChcclxuICAgICAgICAgIG51bSA9PT0gMSB8fFxyXG4gICAgICBudW0gPT09IDMgfHxcclxuICAgICAgbnVtID09PSA1IHx8XHJcbiAgICAgIG51bSA9PT0gNyB8fFxyXG4gICAgICBudW0gPT09IDggfHxcclxuICAgICAgbnVtID09PSAxMCB8fFxyXG4gICAgICBudW0gPT09IDEyXHJcbiAgICAgICkge1xyXG4gICAgICAvLyDliKTmlq0zMeWkqeeahOaciOS7vVxyXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMzE7IGkrKykge1xyXG4gICAgICAgICAgICAgIGlmIChpIDwgMTApIHtcclxuICAgICAgICAgICAgICAgICAgaSA9ICcwJyArIGk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHRlbXAucHVzaCgnJyArIGkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKG51bSA9PT0gNCB8fCBudW0gPT09IDYgfHwgbnVtID09PSA5IHx8IG51bSA9PT0gMTEpIHtcclxuICAgICAgLy8g5Yik5patMzDlpKnnmoTmnIjku71cclxuICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDMwOyBpKyspIHtcclxuICAgICAgICAgICAgICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgICAgICAgICAgIGkgPSAnMCcgKyBpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB0ZW1wLnB1c2goJycgKyBpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChudW0gPT09IDIpIHtcclxuICAgICAgLy8g5Yik5patMuaciOS7veWkqeaVsFxyXG4gICAgICAgICAgbGV0IHllYXIgPSBwYXJzZUludChzZWxlY3RZZWFyKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHllYXIpO1xyXG4gICAgICAgICAgaWYgKCh5ZWFyICUgNDAwID09PSAwIHx8IHllYXIgJSAxMDAgIT09IDApICYmIHllYXIgJSA0ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMjk7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBpID0gJzAnICsgaTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB0ZW1wLnB1c2goJycgKyBpKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDI4OyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgaSA9ICcwJyArIGk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgdGVtcC5wdXNoKCcnICsgaSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0ZW1wO1xyXG4gIH1cclxuICAvLyDorr7nva7pu5jorqTlgLwg5qC85byPMjAxOS0wNy0xMCAxMDozMFxyXG4gIHNldERlZmF1bHR0aW1lcygpIHtcclxuICAgICAgbGV0IGFsbERhdGVMaXN0ID0gdGhpcy50aW1lcy5zcGxpdCgnICcpO1xyXG4gICAgICAvLyDml6XmnJ9cclxuICAgICAgbGV0IGRhdGVMaXN0ID0gYWxsRGF0ZUxpc3RbMF0uc3BsaXQoJy0nKTtcclxuICAgICAgbGV0IG1vbnRoID0gcGFyc2VJbnQoZGF0ZUxpc3RbMV0pIC0gMTtcclxuICAgICAgbGV0IGRheSA9IHBhcnNlSW50KGRhdGVMaXN0WzJdKSAtIDE7XHJcbiAgICAgIC8vIOaXtumXtFxyXG4gICAgICBsZXQgdGltZXNMaXN0ID0gYWxsRGF0ZUxpc3RbMV0uc3BsaXQoJzonKTtcclxuICAgICAgdGhpcy5tdWx0aUFycmF5WzJdID0gdGhpcy5zZXREYXlzKGRhdGVMaXN0WzBdLCBwYXJzZUludChkYXRlTGlzdFsxXSkpO1xyXG4gICAgICB0aGlzLm11bHRpSW5kZXggPSBbdGhpcy55ZWFySW5kZXgsIG1vbnRoLCBkYXksIHRpbWVzTGlzdFswXSwgdGltZXNMaXN0WzFdXTtcclxuICB9XHJcbiAgLy8g6I635Y+W5pe26Ze05pel5pyfXHJcbiAgUGlja2VyQ2hhbmdlKGUpIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3BpY2tlcuWPkemAgemAieaLqeaUueWPmO+8jOaQuuW4puWAvOS4uicsIGUuZGV0YWlsLnZhbHVlKVxyXG4gICAgICB0aGlzLm11bHRpSW5kZXggPSBlLmRldGFpbC52YWx1ZTtcclxuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLm11bHRpSW5kZXg7XHJcbiAgICAgIGNvbnN0IHllYXIgPSB0aGlzLm11bHRpQXJyYXlbMF1baW5kZXhbMF1dO1xyXG4gICAgICBjb25zdCBtb250aCA9IHRoaXMubXVsdGlBcnJheVsxXVtpbmRleFsxXV07XHJcbiAgICAgIGNvbnN0IGRheSA9IHRoaXMubXVsdGlBcnJheVsyXVtpbmRleFsyXV07XHJcbiAgICAgIGNvbnN0IGhvdXIgPSB0aGlzLm11bHRpQXJyYXlbM11baW5kZXhbM11dO1xyXG4gICAgICBjb25zdCBtaW51dGUgPSB0aGlzLm11bHRpQXJyYXlbNF1baW5kZXhbNF1dO1xyXG4gICAgICAvLyBjb25zdCBzZWNvbmQgPSB0aGlzLm11bHRpQXJyYXlbNV1baW5kZXhbNV1dXHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKGAke3llYXJ9LSR7bW9udGh9LSR7ZGF5fS0ke2hvdXJ9LSR7bWludXRlfWApO1xyXG4gICAgICB0aGlzLnRpbWVzID0geWVhciArICctJyArIG1vbnRoICsgJy0nICsgZGF5ICsgJyAnICsgaG91ciArICc6JyArIG1pbnV0ZTtcclxuICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgcmV0dXJuIHRoaXMudGltZXM7XHJcbiAgfVxyXG4gIGlzUGhvbmUoc3RyKSB7XHJcbiAgICAgIGNvbnN0IHJlZyA9IC9eWzFdWzMsNCw1LDcsOF1bMC05XXs5fSQvO1xyXG4gICAgICByZXR1cm4gcmVnLnRlc3Qoc3RyKTtcclxuICB9XHJcbiAgZ2V0VmFsaWRDb2RlKCkge1xyXG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgIGlmICh0aGlzLnNlbmRCdG4gPT09IHRydWUpIHJldHVybjtcclxuICAgICAgaWYgKHRoaXMuaXNQaG9uZSh0aGlzLmZvcm1EYXRhLnBob25lTnVtKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6ICfmiYvmnLrlj7fmoLzlvI/kuI3mraPnoa4nLFxyXG4gICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICB0cnkge1xyXG4gICAgICAgICAgd3guc2hvd0xvYWRpbmcoe1xyXG4gICAgICAgICAgICAgIHRpdGxlOiAn5Y+R6YCB5LitLOivt+etieW+hS4uLidcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgnd3gvc2VuZFZlcmlmaWNhdGlvbkNvZGVBcGkuanNvbicsIHtcclxuICAgICAgICAgICAgICBwaG9uZU51bTogdGhpcy5mb3JtRGF0YS5waG9uZU51bVxyXG4gICAgICAgICAgfSkudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcclxuICAgICAgICAgICAgICAgICAgdGl0bGU6ICflj5HpgIHmiJDlip/or7fmn6XmlLYnXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgdGhhdC5zZW5kQnRuID0gdHJ1ZTtcclxuICAgICAgICAgICAgICB0aGF0LiRhcHBseSgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICB0aGlzLnNldFRpbWUoKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgdGhhdC5zZW5kQnRuID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICB9XHJcbiAgbWV0aG9kcyA9IHtcclxuICAgICAgZ2V0SW5kZXgoZSkge1xyXG4gICAgICAgICAgdGhpcy5pbmRleCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4O1xyXG4gICAgICB9LFxyXG4gICAgICBnZXRhcmVhOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgIGxldCB2YWx1ZSA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICAgICAgdGhpcy5nb29kc1t0aGlzLmluZGV4XVsnYXJlYSddID0gdmFsdWU7XHJcbiAgICAgIH0sXHJcbiAgICAgIGdldEdvb2RzMihlKSB7XHJcbiAgICAgICAgICBsZXQgdmFsdWUgPSBlLmRldGFpbC52YWx1ZTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZ29vZHNbdGhpcy5pbmRleF0uZ29vZHNBcnlbdmFsdWVdLmxlbmd0aCk7XHJcbiAgICAgICAgICB0aGlzLmdvb2RzW3RoaXMuaW5kZXhdWydjcm9wc0NhdGVnb3J5MiddID1cclxuICAgICAgICB0aGlzLmdvb2RzW3RoaXMuaW5kZXhdLmdvb2RzQXJ5W3ZhbHVlXS5sZW5ndGggPiA0XHJcbiAgICAgICAgICAgID8gdGhpcy5nb29kc1t0aGlzLmluZGV4XS5nb29kc0FyeVt2YWx1ZV0uc3Vic3RyaW5nKDAsIDQpXHJcbiAgICAgICAgICAgIDogdGhpcy5nb29kc1t0aGlzLmluZGV4XS5nb29kc0FyeVt2YWx1ZV07XHJcbiAgICAgIH0sXHJcbiAgICAgIGdldEdvb2RzOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgIGxldCB2YWx1ZSA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICAgICAgdGhpcy5nb29kc1t0aGlzLmluZGV4XS5nb29kc0FyeSA9IHRoaXMudHdvW3ZhbHVlXTtcclxuICAgICAgICAgIHRoaXMuZ29vZHNbdGhpcy5pbmRleF1bJ2Nyb3BzQ2F0ZWdvcnkxJ10gPSB0aGlzLm9uZVt2YWx1ZV07XHJcbiAgICAgICAgICB0aGlzLmdvb2RzW3RoaXMuaW5kZXhdWydjcm9wc0NhdGVnb3J5MiddID0gJyc7XHJcbiAgICAgIH0sXHJcbiAgICAgIGFkZEZ1bigpIHtcclxuICAgICAgICAgIGlmICh0aGlzLmdvb2RzLmxlbmd0aCA+PSA1KSB7XHJcbiAgICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxyXG4gICAgICAgICAgICAgICAgICBjb250ZW50OiAn56eN5qSN5L2c54mp5pyA5aSaNeenjScsXHJcbiAgICAgICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5nb29kcy5wdXNoKHsgYXJlYTogJycsIGNyb3BzQ2F0ZWdvcnk6ICcnIH0pO1xyXG4gICAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgfSxcclxuICAgICAgZGVsKGUpIHtcclxuICAgICAgICAgIHRoaXMuZ29vZHMuc3BsaWNlKGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4LCAxKTtcclxuICAgICAgfSxcclxuICAgICAgLy8g6I635Y+W6aqM6K+B56CBXHJcbiAgICAgIHNlbmRGdW4oKSB7XHJcbiAgICAgICAgICB0aGlzLmdldFZhbGlkQ29kZSgpO1xyXG4gICAgICB9LFxyXG4gICAgICBjaG9vc2VMb2NhdGlvbigpIHtcclxuICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICAgIHd4LmdldExvY2F0aW9uKHtcclxuICAgICAgICAgICAgICB0eXBlOiAnd2dzODQnLFxyXG4gICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgIHd4LmNob29zZUxvY2F0aW9uKHtcclxuICAgICAgICAgICAgICAgICAgICAgIGxhdGl0dWRlOiByZXMubGF0aXR1ZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICBsb25naXR1ZGU6IHJlcy5sb25naXR1ZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKHJlc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlj5HpgIHor7fmsYLpgJrov4fnu4/nuqzluqblj43mn6XlnLDlnYDkv6Hmga9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5mZXRjaERhdGFQcm9taXNlKCdyZXNvbHZlTG9jYXRpb25BcGkuanNvbicsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhdGl0dWRlOiByZXN0LmxhdGl0dWRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9uZ2l0dWRlOiByZXN0LmxvbmdpdHVkZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmFkZHJlc3MgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5wcm92aW5jZU5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5jaXR5TmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmRpc3RyaWN0TmFtZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuZm9ybURhdGEuYWRkcmVzcyA9IGRhdGEuYWRkcmVzcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgICBnZXRSZW1hcmsoZSkge1xyXG4gICAgICAgICAgdGhpcy5mb3JtRGF0YS5hcHBseVJlYXNvbiA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICB9LFxyXG4gICAgICBiaW5kTGV2ZXJDaGFuZ2UoZSkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgICB0aGlzLmZvcm1EYXRhLmRlYWxlckxldmVsID0gdGhpcy5hcnJheUxldmVsW2UuZGV0YWlsLnZhbHVlXTtcclxuICAgICAgfSxcclxuICAgICAgYmluZFJlZ2lvbkNoYW5nZShlKSB7XHJcbiAgICAgICAgICB0aGlzLmFkZHJlc3MgPSBlLmRldGFpbC52YWx1ZTtcclxuICAgICAgICAgIHRoaXMuZm9ybURhdGEuYWRkcmVzcyA9ICcnO1xyXG4gICAgICB9LFxyXG4gICAgICBjaGFuZ2VDbGFzc2lmeShlKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgIHRoaXMuZm9ybURhdGEuY2xhc3NpZnkgPSBlLmRldGFpbC52YWx1ZTtcclxuICAgICAgfSxcclxuICAgICAgZ2V0Q29kZShlKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgIHRoaXMuZm9ybURhdGEuY29kZSA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICB9LFxyXG4gICAgICAvLyDnm5HlkKxwaWNrZXLnmoTmu5rliqjkuovku7ZcclxuICAgICAgYmluZE11bHRpUGlja2VyQ29sdW1uQ2hhbmdlKGUpIHtcclxuICAgICAgLy8g6I635Y+W5bm05Lu9XHJcbiAgICAgICAgICBpZiAoZS5kZXRhaWwuY29sdW1uID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5jaG9vc2VfeWVhciA9IHRoaXMubXVsdGlBcnJheVtlLmRldGFpbC5jb2x1bW5dW2UuZGV0YWlsLnZhbHVlXTtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNob29zZV95ZWFyKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCfkv67mlLnnmoTliJfkuLonLCBlLmRldGFpbC5jb2x1bW4sICfvvIzlgLzkuLonLCBlLmRldGFpbC52YWx1ZSk7XHJcbiAgICAgICAgICAvLyDorr7nva7mnIjku73mlbDnu4RcclxuICAgICAgICAgIGlmIChlLmRldGFpbC5jb2x1bW4gPT09IDEpIHtcclxuICAgICAgICAgICAgICBsZXQgbnVtID0gcGFyc2VJbnQodGhpcy5tdWx0aUFycmF5W2UuZGV0YWlsLmNvbHVtbl1bZS5kZXRhaWwudmFsdWVdKTtcclxuICAgICAgICAgICAgICB0aGlzLm11bHRpQXJyYXlbMl0gPSB0aGlzLnNldERheXModGhpcy5jaG9vc2VfeWVhciwgbnVtKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB0aGlzLm11bHRpSW5kZXhbZS5kZXRhaWwuY29sdW1uXSA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgfSxcclxuICAgICAgYmluZFN0YXJ0Q2hhbmdlKGUpIHtcclxuICAgICAgICAgIHRoaXMuZm9ybURhdGEuc3RhcnREYXRlMSA9IHRoaXMuUGlja2VyQ2hhbmdlKGUpO1xyXG4gICAgICB9LFxyXG4gICAgICBiaW5kRW5kQ2hhbmdlKGUpIHtcclxuICAgICAgICAgIHRoaXMuZm9ybURhdGEuZW5kRGF0ZTEgPSB0aGlzLlBpY2tlckNoYW5nZShlKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIC8vIOiOt+WPluaXtumXtFxyXG4gICAgICBnZXR0aW1lcyh0aW1lcykge1xyXG4gICAgICAgICAgY29uc29sZS5sb2codGltZXMpO1xyXG4gICAgICB9LFxyXG4gICAgICBzaG93QWRkckNob3NlKCkge1xyXG4gICAgICAvLyDmmL7npLrnnIHluILljLrogZTliqjpgInmi6nmoYZcclxuICAgICAgICAgIHRoaXMuaXNTaG93QWRkcmVzc0Nob3NlID0gIXRoaXMuZGF0YS5pc1Nob3dBZGRyZXNzQ2hvc2U7XHJcbiAgICAgIH0sXHJcbiAgICAgIGNhbmNlbCgpIHtcclxuICAgICAgLy8g5Y+W5raIXHJcbiAgICAgICAgICB0aGlzLmlzU2hvd0FkZHJlc3NDaG9zZSA9IGZhbHNlO1xyXG4gICAgICB9LFxyXG4gICAgICBmaW5pc2goKSB7XHJcbiAgICAgIC8vIOWujOaIkFxyXG4gICAgICAgICAgdGhpcy5pc1Nob3dBZGRyZXNzQ2hvc2UgPSBmYWxzZTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdldE5hbWUoZSkge1xyXG4gICAgICAvLyDojrflvpfkvJrorq7lkI3np7BcclxuICAgICAgICAgIHRoaXMuZm9ybURhdGEuYWRkcmVzc2VlID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICB9LFxyXG4gICAgICBnZXROdW1iZXIoZSkge1xyXG4gICAgICAgICAgdGhpcy5mb3JtRGF0YS5hcHBseUNvdW50ID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICB9LFxyXG4gICAgICBnZXRwaG9uZU51bShlKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhlLmRldGFpbC52YWx1ZSk7XHJcbiAgICAgICAgICB0aGlzLmZvcm1EYXRhLnBob25lTnVtID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgIH0sXHJcbiAgICAgIGdldENvbnRlbnQoZSkge1xyXG4gICAgICAvLyDojrflvpflhajpg6jlhoXlrrlcclxuICAgICAgICAgIHRoaXMuZm9ybURhdGEuY29udGVudCA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgfSxcclxuICAgICAgZ2V0bGVhZGVyKGUpIHtcclxuICAgICAgLy8g6I635b6X6aKG5a+8XHJcbiAgICAgICAgICB0aGlzLmZvcm1EYXRhLmxlYWRlciA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgfSxcclxuICAgICAgZ2V0Y29tcGFueU5hbWUoZSkge1xyXG4gICAgICAgICAgdGhpcy5mb3JtRGF0YS5jb21wYW55TmFtZSA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgfSxcclxuICAgICAgZ2V0YWRkcmVzcyhlKSB7XHJcbiAgICAgIC8vIOiOt+W+l+mihuWvvFxyXG4gICAgICAgICAgdGhpcy5mb3JtRGF0YS5hZGRyZXNzID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICB9LFxyXG4gICAgICBnZXR1c2VyQ291bnQoZSkge1xyXG4gICAgICAvLyDojrflvpfpooblr7xcclxuICAgICAgICAgIHRoaXMuZm9ybURhdGEudXNlckNhcGFjaXR5ID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICB9LFxyXG4gICAgICBzYXZlKCkge1xyXG4gICAgICAvLyDkv53lrZhcclxuICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICB0aGlzLmZvcm1EYXRhLm1vYmlsZSA9IHRoaXMuZm9ybURhdGEucGhvbmVOdW07XHJcbiAgICAgICAgICBpZiAoIXNlbGYuZm9ybURhdGEuYWRkcmVzc2VlIHx8IHNlbGYuZm9ybURhdGEuYWRkcmVzc2VlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxyXG4gICAgICAgICAgICAgICAgICBjb250ZW50OiAn5aeT5ZCN5b+F5aGrJyxcclxuICAgICAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKCFzZWxmLmZvcm1EYXRhLmFwcGx5Q291bnQgfHwgc2VsZi5mb3JtRGF0YS5hcHBseUNvdW50ID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxyXG4gICAgICAgICAgICAgICAgICBjb250ZW50OiAn55Sz6K+35pWw6YeP5b+F5aGrJyxcclxuICAgICAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKFxyXG4gICAgICAgICAgICAgIHNlbGYucm9sZSA9PT0gJzMnICYmXHJcbiAgICAgICAgKCFzZWxmLmZvcm1EYXRhLmNvbXBhbnlOYW1lIHx8IHNlbGYuZm9ybURhdGEuY29tcGFueU5hbWUgPT0gJycpXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICflhazlj7jlkI3np7Dlv4XloasnLFxyXG4gICAgICAgICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgICAgICAgc2VsZi5yb2xlID09PSAnMycgJiZcclxuICAgICAgICAoIXNlbGYuZm9ybURhdGEuZGVhbGVyTGV2ZWwgfHwgc2VsZi5mb3JtRGF0YS5kZWFsZXJMZXZlbCA9PSAnJylcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcclxuICAgICAgICAgICAgICAgICAgY29udGVudDogJ+etiee6p+W/hemAiScsXHJcbiAgICAgICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICAgICAgICAhc2VsZi5hZGRyZXNzIHx8XHJcbiAgICAgICAgc2VsZi5hZGRyZXNzID09ICcnIHx8XHJcbiAgICAgICAgc2VsZi5hZGRyZXNzLmxlbmd0aCA9PT0gMFxyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxyXG4gICAgICAgICAgICAgICAgICBjb250ZW50OiAn6K+36YCJ5oup5Zyw5Z2AJyxcclxuICAgICAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKCFzZWxmLmZvcm1EYXRhLmFkZHJlc3MgfHwgc2VsZi5mb3JtRGF0YS5hZGRyZXNzID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxyXG4gICAgICAgICAgICAgICAgICBjb250ZW50OiAn6K+m57uG5Zyw5Z2A5b+F5aGrJyxcclxuICAgICAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKCFzZWxmLmZvcm1EYXRhLm1vYmlsZSB8fCBzZWxmLmZvcm1EYXRhLm1vYmlsZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcclxuICAgICAgICAgICAgICAgICAgY29udGVudDogJ+aJi+acuuWPt+W/heWhqycsXHJcbiAgICAgICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzUGhvbmUodGhpcy5mb3JtRGF0YS5tb2JpbGUpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcclxuICAgICAgICAgICAgICAgICAgY29udGVudDogJ+aJi+acuuWPt+agvOW8j+S4jeato+ehricsXHJcbiAgICAgICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICghc2VsZi5mb3JtRGF0YS5jb2RlIHx8IHNlbGYuZm9ybURhdGEuY29kZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcclxuICAgICAgICAgICAgICAgICAgY29udGVudDogJ+mqjOivgeeggeW/heWhqycsXHJcbiAgICAgICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gZWxzZSBpZiAoXHJcbiAgICAgICAgICAvLyAgICFzZWxmLmZvcm1EYXRhLmFwcGx5UmVhc29uIHx8XHJcbiAgICAgICAgICAvLyAgIHNlbGYuZm9ybURhdGEuYXBwbHlSZWFzb24gPT0gXCJcIlxyXG4gICAgICAgICAgLy8gKSB7XHJcbiAgICAgICAgICAvLyAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAvLyAgICAgdGl0bGU6IFwi5o+Q56S6XCIsXHJcbiAgICAgICAgICAvLyAgICAgY29udGVudDogXCLnlLPor7fljp/lm6Dlv4XloatcIixcclxuICAgICAgICAgIC8vICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgICAgLy8gICB9KTtcclxuICAgICAgICAgIC8vICAgcmV0dXJuO1xyXG4gICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgaWYgKHNlbGYucm9sZSA9PT0gJzEnKSB7XHJcbiAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdvb2RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmdvb2RzW2ldLmFyZWEgPT09ICcnIHx8IHRoaXMuZ29vZHMuY3JvcHNDYXRlZ29yeSA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICfnp43mpI3kvZznianlv4XloasnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuZ29vZHMgPSB0aGlzLmdvb2RzLm1hcChpdGVtID0+IHtcclxuICAgICAgICAgICAgICBjb25zdCBvYmogPSBpdGVtO1xyXG4gICAgICAgICAgICAgIG9iai5jcm9wc0NhdGVnb3J5ID0gb2JqLmNyb3BzQ2F0ZWdvcnkxICsgJywnICsgb2JqLmNyb3BzQ2F0ZWdvcnkyO1xyXG4gICAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHRoaXMuZm9ybURhdGEuY3JvcHNDYXRlZ29yeUFuZEFyZWEgPSB0aGlzLmdvb2RzO1xyXG4gICAgICAgICAgdGhpcy5mb3JtRGF0YS5wcm92aW5jZU5hbWUgPSB0aGlzLmFkZHJlc3NbMF07XHJcbiAgICAgICAgICB0aGlzLmZvcm1EYXRhLmNpdHlOYW1lID0gdGhpcy5hZGRyZXNzWzFdO1xyXG4gICAgICAgICAgdGhpcy5mb3JtRGF0YS5kaXN0cmljdE5hbWUgPSB0aGlzLmFkZHJlc3NbMl07XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygndGhpcy5mb3JtRGF0YScsIHRoaXMuZm9ybURhdGEpO1xyXG5cclxuICAgICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShcclxuICAgICAgICAgICAgICAnd3gvc3BlY2ltZW4vYXBwbHlTcGVjaW1lbkFwaS5qc29uJyxcclxuICAgICAgICAgICAgICB0aGlzLmZvcm1EYXRhXHJcbiAgICAgICAgICApLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkYXRhJywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgaWYgKGRhdGEucmVzdWx0ID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5qC35ZOB55Sz6aKG5oiQ5YqfJyxcclxuICAgICAgICAgICAgICAgICAgICAgIGljb246ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyMDAwXHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgd3gubmF2aWdhdGVCYWNrKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBkZWx0YTogMVxyXG4gICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgIH0sIDIwMDApO1xyXG4gICAgICAgICAgICAgICAgICBzZWxmLmZvcm1EYXRhID0ge307XHJcbiAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgIC8vIHRoaXMuZm9ybURhdGEucm9sZSA9IHRoaXMucm9sZTtcclxuICAgICAgLy8gaWYgKHNlbGYudHlwZSA9PSBcImVkaXRcIikge1xyXG4gICAgICAvLyAgIHRoaXMuZm9ybURhdGEudXNlciA9IG51bGw7XHJcbiAgICAgIC8vICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKFxyXG4gICAgICAvLyAgICAgXCJtZWV0aW5nL3dlY2hhdC91cGRhdGVNZWV0aW5nQXBpLmpzb25cIixcclxuICAgICAgLy8gICAgIHRoaXMuZm9ybURhdGFcclxuICAgICAgLy8gICApLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAvLyAgICAgc2VsZi5mb3JtRGF0YSA9IHt9O1xyXG4gICAgICAvLyAgICAgd3gubmF2aWdhdGVCYWNrKHtcclxuICAgICAgLy8gICAgICAgZGVsdGE6IDFcclxuICAgICAgLy8gICAgIH0pO1xyXG4gICAgICAvLyAgICAgc2VsZi4kYXBwbHkoKTtcclxuICAgICAgLy8gICB9KTtcclxuICAgICAgLy8gfSBlbHNlIHtcclxuICAgICAgLy8gICB0aGlzLmZldGNoRGF0YVByb21pc2UoXCJ3eC91cGRhdGVVc2VyQXBpLmpzb25cIiwgdGhpcy5mb3JtRGF0YSkudGhlbihcclxuICAgICAgLy8gICAgIGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgLy8gICAgICAgc2VsZi5mb3JtRGF0YSA9IHt9O1xyXG4gICAgICAvLyAgICAgICB3eC5uYXZpZ2F0ZUJhY2soe1xyXG4gICAgICAvLyAgICAgICAgIGRlbHRhOiAxXHJcbiAgICAgIC8vICAgICAgIH0pO1xyXG4gICAgICAvLyAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAvLyAgICAgfVxyXG4gICAgICAvLyAgICk7XHJcbiAgICAgIC8vIH1cclxuICAgICAgfVxyXG4gIH07XHJcbiAgb25TaG93KCkge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5jbHNUaW1lb3V0KTtcclxuICB9XHJcbiAgLy8gZW5kRnVuICgpIHtcclxuICAvLyAgIGlmICh0aGlzLmZvcm1EYXRhLmVuZERhdGUxKSB0aGlzLnRpbWVzID0gdGhpcy5mb3JtRGF0YS5lbmREYXRlMVxyXG4gIC8vIH1cclxuICAvLyBzdGFydERhdGUgKCkge1xyXG4gIC8vICAgaWYgKHRoaXMuZm9ybURhdGEuc3RhcnREYXRlMSkgdGhpcy50aW1lcyA9IHRoaXMuZm9ybURhdGEuc3RhcnREYXRlMVxyXG4gIC8vIH1cclxuICB3aGVuQXBwUmVhZHlTaG93KCkge31cclxuICBvbkxvYWQob3B0aW9ucykge1xyXG4gICAgICBjb25zb2xlLmxvZygnb3B0aW9ucycsIG9wdGlvbnMpO1xyXG4gICAgICAodGhpcy5jb2RlTmFtZSA9ICfojrflj5bpqozor4HnoIEnKSwgKHRoaXMubGltaXRUaW1lID0gNjApO1xyXG4gICAgICB0aGlzLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuY2xzVGltZW91dCk7XHJcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgaWYgKG9wdGlvbnMuaWQpIHtcclxuICAgICAgICAgIHRoYXQuZm9ybURhdGEuaWQgPSBvcHRpb25zLmlkO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ3RoYXQuZm9ybURhdGEuaWQnLCB0aGF0LmZvcm1EYXRhLmlkKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAob3B0aW9ucy5yb2xlKSB7XHJcbiAgICAgICAgICB0aGlzLnJvbGUgPSBvcHRpb25zLnJvbGU7XHJcbiAgICAgICAgICB3eC5nZXRTdG9yYWdlKHtcclxuICAgICAgICAgICAgICBrZXk6ICd1c2VySW5mbycsXHJcbiAgICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UocmVzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICB0aGF0LmZvcm1EYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgdGhhdC5mb3JtRGF0YS5uYW1lID0gZGF0YS51c2VyTmFtZTtcclxuICAgICAgICAgICAgICAgICAgdGhhdC5mb3JtRGF0YS5waG9uZU51bSA9IGRhdGEubW9iaWxlO1xyXG4gICAgICAgICAgICAgICAgICB0aGF0Lmdvb2RzID0gdGhhdC5mb3JtRGF0YS5jcm9wc0NhdGVnb3J5QW5kQXJlYVxyXG4gICAgICAgICAgICAgICAgICAgICAgPyB0aGF0LmZvcm1EYXRhLmNyb3BzQ2F0ZWdvcnlBbmRBcmVhXHJcbiAgICAgICAgICAgICAgICAgICAgICA6IFt7IGFyZWE6ICcnLCBjcm9wc0NhdGVnb3J5OiAnJyB9XTtcclxuICAgICAgICAgICAgICAgICAgaWYgKCF0aGF0LmZvcm1EYXRhLmxhdGl0dWRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB3eC5nZXRMb2NhdGlvbih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2djajAyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuZm9ybURhdGEubGF0aXR1ZGUgPSByZXMubGF0aXR1ZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuZm9ybURhdGEubG9uZ2l0dWRlID0gcmVzLmxvbmdpdHVkZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIHRoYXQuYWRkcmVzcyA9ICF0aGF0LmZvcm1EYXRhLnByb3ZpbmNlTmFtZVxyXG4gICAgICAgICAgICAgICAgICAgICAgPyBbXVxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5mb3JtRGF0YS5wcm92aW5jZU5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5mb3JtRGF0YS5jaXR5TmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmZvcm1EYXRhLmRpc3RyaWN0TmFtZVxyXG4gICAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgICAgdGhhdC4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8g6I635Y+W57uP57qs5bqmXHJcbiAgICAgIHRoaXMudGltZXMgPVxyXG4gICAgICBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCkgK1xyXG4gICAgICAnLScgK1xyXG4gICAgICB0aGlzLnRpbWVzRnVuKG5ldyBEYXRlKCkuZ2V0TW9udGgoKSArIDEpICtcclxuICAgICAgJy0nICtcclxuICAgICAgdGhpcy50aW1lc0Z1bihuZXcgRGF0ZSgpLmdldERhdGUoKSkgK1xyXG4gICAgICAnICcgK1xyXG4gICAgICAnMTInO1xyXG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgIC8vIGlmIChvcHRpb25zLml0ZW0pIHtcclxuICAgICAgLy8gICB3eC5zZXROYXZpZ2F0aW9uQmFyVGl0bGUoe1xyXG4gICAgICAvLyAgICAgdGl0bGU6ICfnvJbovpHkvJrorq4nXHJcbiAgICAgIC8vICAgfSlcclxuICAgICAgLy8gICB0aGF0LnR5cGUgPSAnZWRpdCdcclxuICAgICAgLy8gICB0aGlzLmZvcm1EYXRhID0gSlNPTi5wYXJzZShvcHRpb25zLml0ZW0pXHJcbiAgICAgIC8vICAgdGhpcy5mb3JtRGF0YS5zdGFydERhdGUxID0gdGhpcy5mb3JtRGF0YS5zdGFydERhdGUxLnNwbGl0KCcgJylbMF0gKyAnICcgKyB0aGlzLmZvcm1EYXRhLnN0YXJ0RGF0ZTEuc3BsaXQoJyAnKVsxXS5zcGxpdCgnOicpWzBdXHJcbiAgICAgIC8vICAgdGhpcy5mb3JtRGF0YS5lbmREYXRlMSA9IHRoaXMuZm9ybURhdGEuZW5kRGF0ZTEuc3BsaXQoJyAnKVswXSArICcgJyArIHRoaXMuZm9ybURhdGEuc3RhcnREYXRlMS5zcGxpdCgnICcpWzFdLnNwbGl0KCc6JylbMF1cclxuICAgICAgLy8gICB0aGlzLnRpbWVzID0gdGhpcy5mb3JtRGF0YS5zdGFydERhdGUxXHJcbiAgICAgIC8vIH1cclxuXHJcbiAgICAgIHRoaXMuc2V0dGltZXNEYXRlKCk7XHJcbiAgICAgIC8vIHRoaXMubXVsdGlBcnJheSA9IFt0aGlzLnllYXJzLCB0aGlzLm1vbnRocywgdGhpcy5kYXlzLCB0aGlzLmhvdXJzLCB0aGlzLm1pbnV0ZXMsIHRoaXMuc2Vjb25kXVxyXG4gICAgICB0aGlzLm11bHRpQXJyYXkgPSBbXHJcbiAgICAgICAgICB0aGlzLnllYXJzLFxyXG4gICAgICAgICAgdGhpcy5tb250aHMsXHJcbiAgICAgICAgICB0aGlzLmRheXMsXHJcbiAgICAgICAgICB0aGlzLmhvdXJzLFxyXG4gICAgICAgICAgdGhpcy5taW51dGVzXHJcbiAgICAgIF07XHJcbiAgICAgIC8vIHRoaXMubXVsdGlBcnJheSA9IFt0aGlzLnllYXJzLCB0aGlzLm1vbnRocywgdGhpcy5kYXlzLCB0aGlzLmhvdXJzXVxyXG4gICAgICAvLyB0aGlzLm11bHRpQXJyYXkgPSBbdGhpcy55ZWFycywgdGhpcy5tb250aHMsIHRoaXMuZGF5c11cclxuICAgICAgdGhpcy5jaG9vc2VfeWVhciA9IHRoaXMubXVsdGlBcnJheVswXVswXTtcclxuICAgICAgaWYgKCF0aGlzLnRpbWVzKSB7XHJcbiAgICAgIC8vIOm7mOiupOaYvuekuuW9k+WJjeaXpeacn1xyXG4gICAgICAgICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgbGV0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcclxuICAgICAgICAgIGxldCBjdXJyZW50RGF5ID0gZGF0ZS5nZXREYXRlKCkgLSAxO1xyXG4gICAgICAgICAgLy8gY29uc29sZS5pbmZvKCfmnIgnLCBkYXRlLmdldE1vbnRoKCkpXHJcbiAgICAgICAgICAvLyBjb25zb2xlLmluZm8oJ+aXpScsIGRhdGUuZ2V0RGF0ZSgpKVxyXG4gICAgICAgICAgdGhpcy5tdWx0aUFycmF5WzJdID0gdGhpcy5zZXREYXlzKHRoaXMuY2hvb3NlX3llYXIsIGN1cnJlbnRNb250aCArIDEpO1xyXG4gICAgICAgICAgdGhpcy5tdWx0aUluZGV4ID0gWzAsIGN1cnJlbnRNb250aCwgY3VycmVudERheSwgMTAsIDBdO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5zZXREZWZhdWx0dGltZXMoKTtcclxuICAgICAgfVxyXG4gICAgICAvLyB3eC5nZXRTdG9yYWdlKHtcclxuICAgICAgLy8gICBrZXk6ICdpdGVtJyxcclxuICAgICAgLy8gICBzdWNjZXNzIChyZXMpIHtcclxuICAgICAgLy8gICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKVxyXG4gICAgICAvLyAgICAgc2VsZi5mb3JtRGF0YSA9IHJlcy5kYXRhXHJcbiAgICAgIC8vICAgfVxyXG4gICAgICAvLyB9KVxyXG5cclxuICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICB9XHJcbiAgLy8gd2hlbkFwcFJlYWR5U2hvdygpIHtcclxuICAvLyAgIC8vIOavj+asoemDveWIt+aWsFxyXG4gIC8vICAgdGhpcy4kYXBwbHkoKVxyXG4gIC8vIH1cclxuICBjaGFuZ2VDdXJyZW50RGF0YShvcHRpb24pIHtcclxuICAgICAgLy8g5pS55Y+Y5b2T5YmN5pWw5o2uXHJcbiAgICAgIC8vIOWFqOWbveaVsOaNrlxyXG4gICAgICB2YXIgbmF0aW9uYWxEYXRhID0gdGhpcy5uYXRpb25hbERhdGE7XHJcbiAgICAgIC8vIOaJgOacieecgVxyXG4gICAgICBpZiAodGhpcy5wcm92aW5jZXMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgIHZhciBwcm92aW5jZXMgPSB0aGlzLmRhdGEucHJvdmluY2VzO1xyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYXRpb25hbERhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICBwcm92aW5jZXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgIGluZGV4OiBpLFxyXG4gICAgICAgICAgICAgICAgICBwcm92aW5jZTogbmF0aW9uYWxEYXRhW2ldLnpvbmVfbmFtZVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5wcm92aW5jZXMgPSBwcm92aW5jZXM7XHJcbiAgICAgIH1cclxuICAgICAgLy8g5b2T5YmN5omA5pyJ5biCXHJcbiAgICAgIGlmIChvcHRpb24udHlwZSA9PSAnY2l0eScgfHwgb3B0aW9uLnR5cGUgPT0gJ2FsbCcpIHtcclxuICAgICAgLy8g5riF56m65biC5pWw5o2uXHJcbiAgICAgICAgICB0aGlzLmNpdGllcyA9IFtdO1xyXG4gICAgICAgICAgdmFyIGNpdGllcyA9IHRoaXMuY2l0aWVzO1xyXG4gICAgICAgICAgdmFyIGN1cnJlbnRDaXRpZXMgPSBuYXRpb25hbERhdGFbb3B0aW9uLmN1cnJlbnRQcm92aW5jZUluZGV4XS5jaXR5cztcclxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VycmVudENpdGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgIGNpdGllcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgaW5kZXg6IGksXHJcbiAgICAgICAgICAgICAgICAgIGNpdHk6IGN1cnJlbnRDaXRpZXNbaV0uem9uZV9uYW1lXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLmNpdGllcyA9IGNpdGllcztcclxuICAgICAgfVxyXG4gICAgICAvLyDlvZPliY3miYDmnInljLpcclxuICAgICAgLy8g5riF56m6IOWMuiDmlbDmja5cclxuICAgICAgdGhpcy5kaXN0cmljdHMgPSBbXTtcclxuICAgICAgdmFyIGRpc3RyaWN0cyA9IHRoaXMuZGlzdHJpY3RzO1xyXG4gICAgICB2YXIgY3VycmVudERpc3RyaWN0cyA9XHJcbiAgICAgIG5hdGlvbmFsRGF0YVtvcHRpb24uY3VycmVudFByb3ZpbmNlSW5kZXhdLmNpdHlzW29wdGlvbi5jdXJyZW50Q2l0eUluZGV4XVxyXG4gICAgICAgICAgLmRpc3RyaWN0cztcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW50RGlzdHJpY3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAoaSAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgZGlzdHJpY3RzLnB1c2goY3VycmVudERpc3RyaWN0c1tpXS56b25lX25hbWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuZGlzdHJpY3RzID0gZGlzdHJpY3RzO1xyXG4gICAgICB0aGlzLiRhcHBseSgpO1xyXG4gIH1cclxufVxyXG4iXX0=