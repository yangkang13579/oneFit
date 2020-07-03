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
            getphoneNum: function getphoneNum(e) {
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
                    // 返回上一页
                    wx.navigateBack({
                        delta: 1
                    });
                    self.$apply();ss;
                });
            },
            save: function save() {
                // 保存
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
                        // 返回上一页
                        wx.navigateBack({
                            delta: 1
                        });
                        self.$apply();
                    });
                } else {
                    this.fetchDataPromise('wx/updateUserApi.json', this.formData).then(function (data) {
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


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(EditAddress , 'pages/order'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVyLmpzIl0sIm5hbWVzIjpbIkVkaXRBZGRyZXNzIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJkYXRhIiwiZ29vZHNBcnkiLCJvbmUiLCJ0d28iLCJhcnJheUxldmVsIiwicm9sZSIsInNlbmRCdG4iLCJsaW1pdFRpbWUiLCJkaXNhYmxlZCIsImNsYXNzaWZ5QXJ5IiwiZ29vZHMiLCJhcmVhIiwiY3JvcHNDYXRlZ29yeSIsInR5cGUiLCJmb3JtRGF0YSIsImRhdGUiLCJ0aW1lcyIsInllYXJzIiwibW9udGhzIiwiZGF5cyIsImhvdXJzIiwibWludXRlcyIsInNlY29uZCIsIm11bHRpQXJyYXkiLCJtdWx0aUluZGV4IiwiY2hvb3NlX3llYXIiLCJ5ZWFySW5kZXgiLCJhZGRyZXNzIiwiY29kZU5hbWUiLCJtZXRob2RzIiwiZ2V0SW5kZXgiLCJlIiwiaW5kZXgiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YXNldCIsImdldGFyZWEiLCJjb25zb2xlIiwibG9nIiwidmFsdWUiLCJkZXRhaWwiLCJnZXRHb29kczIiLCJsZW5ndGgiLCJzdWJzdHJpbmciLCJnZXRHb29kcyIsImFkZEZ1biIsInd4Iiwic2hvd01vZGFsIiwidGl0bGUiLCJjb250ZW50Iiwic2hvd0NhbmNlbCIsInB1c2giLCIkYXBwbHkiLCJkZWwiLCJzcGxpY2UiLCJzZW5kRnVuIiwiZ2V0VmFsaWRDb2RlIiwiY2hvb3NlTG9jYXRpb24iLCJ0aGF0IiwiZ2V0TG9jYXRpb24iLCJzdWNjZXNzIiwicmVzIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJyZXN0IiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRoZW4iLCJwcm92aW5jZU5hbWUiLCJjaXR5TmFtZSIsImRpc3RyaWN0TmFtZSIsImdldFJlbWFyayIsInJlbWFyayIsImdldG1vYmlsZSIsIm1vYmlsZSIsImJpbmRMZXZlckNoYW5nZSIsImRlYWxlckxldmVsIiwiYmluZFJlZ2lvbkNoYW5nZSIsImNoYW5nZUNsYXNzaWZ5IiwiY2xhc3NpZnkiLCJnZXRDb2RlIiwiY29kZSIsImJpbmRNdWx0aVBpY2tlckNvbHVtbkNoYW5nZSIsImNvbHVtbiIsIm51bSIsInBhcnNlSW50Iiwic2V0RGF5cyIsImJpbmRTdGFydENoYW5nZSIsInN0YXJ0RGF0ZTEiLCJQaWNrZXJDaGFuZ2UiLCJiaW5kRW5kQ2hhbmdlIiwiZW5kRGF0ZTEiLCJnZXR0aW1lcyIsInNob3dBZGRyQ2hvc2UiLCJpc1Nob3dBZGRyZXNzQ2hvc2UiLCJjYW5jZWwiLCJmaW5pc2giLCJnZXROYW1lIiwibmFtZSIsImdldHBob25lTnVtIiwicGhvbmVOdW0iLCJnZXRDb250ZW50IiwiZ2V0bGVhZGVyIiwibGVhZGVyIiwiZ2V0Y29tcGFueU5hbWUiLCJjb21wYW55TmFtZSIsImdldGFkZHJlc3MiLCJnZXR1c2VyQ291bnQiLCJ1c2VyQ2FwYWNpdHkiLCJzdWJtaXQiLCJzZWxmIiwiaXNQaG9uZSIsIm5hdmlnYXRlQmFjayIsImRlbHRhIiwic3MiLCJzYXZlIiwiaSIsIm1hcCIsIm9iaiIsIml0ZW0iLCJjcm9wc0NhdGVnb3J5MSIsImNyb3BzQ2F0ZWdvcnkyIiwiY3JvcHNDYXRlZ29yeUFuZEFyZWEiLCJ1c2VyIiwidCIsIkRhdGUiLCJfeWVhckluZGV4IiwiaW5mbyIsIl9kZWZhdWx0WWVhciIsInNwbGl0IiwiZ2V0RnVsbFllYXIiLCJjbGVhclRpbWVvdXQiLCJjbHNUaW1lb3V0Iiwic2V0VGltZW91dCIsInNldFRpbWUiLCJzZWxlY3RZZWFyIiwic2VsZWN0TW9udGgiLCJ0ZW1wIiwieWVhciIsImFsbERhdGVMaXN0IiwiZGF0ZUxpc3QiLCJtb250aCIsImRheSIsInRpbWVzTGlzdCIsImhvdXIiLCJtaW51dGUiLCJzdHIiLCJyZWciLCJ0ZXN0Iiwic2hvd0xvYWRpbmciLCJzaG93VG9hc3QiLCJvcHRpb25zIiwiZ2V0U3RvcmFnZSIsImtleSIsIkpTT04iLCJwYXJzZSIsInVzZXJOYW1lIiwiZmFpbCIsInRpbWVzRnVuIiwiZ2V0TW9udGgiLCJnZXREYXRlIiwic2V0dGltZXNEYXRlIiwiY3VycmVudE1vbnRoIiwiY3VycmVudERheSIsInNldERlZmF1bHR0aW1lcyIsIm9wdGlvbiIsIm5hdGlvbmFsRGF0YSIsInByb3ZpbmNlcyIsInByb3ZpbmNlIiwiem9uZV9uYW1lIiwiY2l0aWVzIiwiY3VycmVudENpdGllcyIsImN1cnJlbnRQcm92aW5jZUluZGV4IiwiY2l0eXMiLCJjaXR5IiwiZGlzdHJpY3RzIiwiY3VycmVudERpc3RyaWN0cyIsImN1cnJlbnRDaXR5SW5kZXgiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDRTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFDcUJBLFc7Ozs7Ozs7Ozs7Ozs7O29NQUNuQkMsTSxHQUFTLENBQUNDLGNBQUQsQyxRQUNUQyxNLEdBQVM7QUFDTEMsb0NBQXdCLE1BRG5CO0FBRUxDLDBDQUE4QjtBQUZ6QixTLFFBS1RDLEksR0FBTztBQUNIQyxzQkFBVSxFQURQO0FBRUhDLGlCQUFLLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLEVBQXlCLEtBQXpCLEVBQWdDLElBQWhDLEVBQXNDLElBQXRDLEVBQTRDLElBQTVDLEVBQWtELEtBQWxELEVBQXlELElBQXpELEVBQStELE1BQS9ELENBRkY7QUFHSEMsaUJBQUssQ0FBQyxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsS0FBYixFQUFvQixJQUFwQixFQUEwQixJQUExQixFQUFnQyxJQUFoQyxDQUFELEVBQXdDLENBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsTUFBakIsRUFBeUIsTUFBekIsQ0FBeEMsRUFDRCxDQUFDLEtBQUQsRUFBUSxLQUFSLENBREMsRUFDZSxDQUFDLEtBQUQsRUFBUSxLQUFSLENBRGYsRUFFRCxDQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWUsS0FBZixDQUZDLEVBR0QsQ0FBQyxPQUFELEVBQVUsT0FBVixFQUFtQixTQUFuQixFQUE4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S0ssU0FBTCxHQUFpQixFQUFqQjtBQUNBLGdCQUFJQSxZQUFZLEtBQUtBLFNBQXJCO0FBQ0EsZ0JBQUlDLG1CQUFtQlYsYUFBYUQsT0FBT08sb0JBQXBCLEVBQTBDQyxLQUExQyxDQUFnRFIsT0FBT1ksZ0JBQXZELEVBQXlFRixTQUFoRztBQUNBLGlCQUFLLElBQUkzRCxJQUFJLENBQWIsRUFBZ0JBLElBQUk0RCxpQkFBaUJySSxNQUFyQyxFQUE2Q3lFLEdBQTdDLEVBQWtEO0FBQzlDLG9CQUFJQSxLQUFLLENBQVQsRUFBWTtBQUNSMkQsOEJBQVUzSCxJQUFWLENBQWU0SCxpQkFBaUI1RCxDQUFqQixFQUFvQnFELFNBQW5DO0FBQ0g7QUFDSjtBQUNELGlCQUFLTSxTQUFMLEdBQWlCQSxTQUFqQjtBQUNBLGlCQUFLMUgsTUFBTDtBQUNIOzs7O0VBbnBCc0M2SCxlQUFLQyxJOztrQkFBekJ2TCxXIiwiZmlsZSI6Im9yZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbiAgaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XHJcbiAgaW1wb3J0IFBhZ2VNaXhpbiBmcm9tICcuLi9taXhpbnMvcGFnZSc7XHJcbiAgZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWRpdEFkZHJlc3MgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gICAgbWl4aW5zID0gW1BhZ2VNaXhpbl07XHJcbiAgICBjb25maWcgPSB7XHJcbiAgICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+WujOWWhOS/oeaBrycsXHJcbiAgICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNmZmYnXHJcbiAgICB9O1xyXG4gIFxyXG4gICAgZGF0YSA9IHtcclxuICAgICAgICBnb29kc0FyeTogW10sXHJcbiAgICAgICAgb25lOiBbJ+afkeapmCcsICfmsLTnqLsnLCAn5bCP6bqmJywgJ+eOieexsycsICfpqazpk4Polq8nLCAn5qOJ6IqxJywgJ+Wkp+ixhicsICfoirHnlJ8nLCAn5p6c6JSs57G7JywgJ+iLueaenCcsICflhbbku5bkvZzniaknXSxcclxuICAgICAgICB0d286IFtbJ+afkeexuycsICfmqZjnsbsnLCAn5p2C5p+R57G7JywgJ+apmeexuycsICfmn5rnsbsnLCAn5p+g5qqsJ10sIFsn5pex55u05pKt56i7JywgJ+awtOebtOaSreeouycsICfkurrlt6Xmipvnp6cnLCAn5py65qKw5o+S56enJ10sXHJcbiAgICAgICAgICAgIFsn5pil5bCP6bqmJywgJ+WGrOWwj+m6piddLCBbJ+Wkj+eOieexsycsICfmmKXnjonnsbMnXSxcclxuICAgICAgICAgICAgWyfmmKXlraPolq8nLCAn5aSP5a2j6JavJywgJ+WGrOWto+iWryddLFxyXG4gICAgICAgICAgICBbJ+aWsOmZhuaXqeezu+WIlycsICfmlrDpmYbkuK3ns7vliJcnLCAn5Lit5a2X5Y+35qOJ6Iqx5ZOB56eNJywgJ+mygeajieezu+WIl+WTgeenjScsICflhoDmo4nns7vliJflk4Hnp40nXSxcclxuICAgICAgICAgICAgWyfmmKXlpKfosYYnLCAn5aSP5aSn6LGGJ10sXHJcbiAgICAgICAgICAgIFsn5pil6Iqx55SfJywgJ+Wkj+iKseeUnyddLFxyXG4gICAgICAgICAgICBbJ+eVquiMhCcsICfovqPmpJInLCAn6L6j5qSSJywgJ+eUnOakkicsICfojITlrZAnLCAn6buE55OcJywgJ+ixh+ixhicsICfoj5zosYYnLCAn55SY6JOdJywgJ+WGrOeTnCcsICfljZfnk5wnLCAn55Sc55OcJywgJ+ilv+eTnCcsICfokbEnLCAn5aecJywgJ+iSnCddLFxyXG4gICAgICAgICAgICBbJ+aXqeeGn+WTgeenjScsICfkuK3nhp/lk4Hnp40nLCAn5pma54af5ZOB56eNJ10sXHJcbiAgICAgICAgICAgIFsn5qKo5qCRJywgJ+ahg+agkScsICfojZTmnp0nLCAn5qix5qGDJywgJ+iKkuaenCcsICfoirHljYknLCAn5rK56I+cJywgJ+iMtuWPticsICfokaHokIQnLCAn54Of6I2JJ11dLFxyXG4gICAgICAgIGFycmF5TGV2ZWw6IFsn55yB57qn57uP6ZSA5ZWGJywgJ+WcsOW4gue6p+e7j+mUgOWVhicsICfljr/nuqfnu4/plIDllYYnLCAn5Lmh6ZWHL+mbtuWUrue7j+mUgOWVhiddLFxyXG4gICAgICAgIHJvbGU6IG51bGwsXHJcbiAgICAgICAgc2VuZEJ0bjogZmFsc2UsXHJcbiAgICAgICAgbGltaXRUaW1lOiA2MCxcclxuICAgICAgICBkaXNhYmxlZDogdHJ1ZSxcclxuICAgICAgICBjbGFzc2lmeUFyeTogW1xyXG4gICAgICAgICAgICAn57uP6ZSA5ZWG5LyaJyxcclxuICAgICAgICAgICAgJ+WGnOawkeS8micsXHJcbiAgICAgICAgICAgICfop4LmkankvJonLFxyXG4gICAgICAgICAgICAn5L+D6ZSA5LyaJyxcclxuICAgICAgICAgICAgJ+WFtuS7luS8muiuridcclxuICAgICAgICBdLFxyXG4gICAgICAgIGdvb2RzOiBbe2FyZWE6ICcnLCBjcm9wc0NhdGVnb3J5OiAnJ31dLFxyXG4gICAgICAgIHR5cGU6IG51bGwsXHJcbiAgICAgICAgZm9ybURhdGE6IHt9LFxyXG4gICAgICAgIGRhdGU6ICcyMDE2LTA5LTAxJyxcclxuICAgICAgICB0aW1lczogJzIwMjAtMDctMjkgMTI6NTAnLFxyXG4gICAgICAgIC8vIOaXtumXtOmAieaLqeWZqOWPguaVsFxyXG4gICAgICAgIHllYXJzOiBbXSxcclxuICAgICAgICBtb250aHM6IFtdLFxyXG4gICAgICAgIGRheXM6IFtdLFxyXG4gICAgICAgIGhvdXJzOiBbXSxcclxuICAgICAgICBtaW51dGVzOiBbXSxcclxuICAgICAgICBzZWNvbmQ6IFtdLFxyXG4gICAgICAgIG11bHRpQXJyYXk6IFtdLCAvLyDpgInmi6nojIPlm7RcclxuICAgICAgICBtdWx0aUluZGV4OiBbMCwgOSwgMTYsIDEzLCAxN10sIC8vIOmAieS4reWAvOaVsOe7hFxyXG4gICAgICAgIGNob29zZV95ZWFyOiAnJyxcclxuICAgICAgICB5ZWFySW5kZXg6IDAsXHJcbiAgICAgICAgYWRkcmVzczogW10sXHJcbiAgICAgICAgY29kZU5hbWU6ICfojrflj5bpqozor4HnoIEnLFxyXG4gICAgfTtcclxuICAgIC8vIOW3ruS4gOS9jeihpeS9jVxyXG4gICAgdGltZXNGdW4gKHQpIHtcclxuICAgICAgICBpZiAodCA8IDEwKSByZXR1cm4gJzAnICsgdDtcclxuICAgICAgICBlbHNlIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgLy8g6K6+572u5Yid5aeL5YC8XHJcbiAgICBzZXR0aW1lc0RhdGUoKSB7XHJcbiAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgbGV0IF95ZWFySW5kZXggPSAwO1xyXG4gICAgICAgIC8vIOm7mOiupOiuvue9rlxyXG4gICAgICAgIGNvbnNvbGUuaW5mbyh0aGlzLnRpbWVzKTtcclxuICAgICAgICBsZXQgX2RlZmF1bHRZZWFyID0gdGhpcy50aW1lcyA/IHRoaXMudGltZXMuc3BsaXQoJy0nKVswXSA6IDA7XHJcbiAgICAgICAgLy8g6I635Y+W5bm0XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IGRhdGUuZ2V0RnVsbFllYXIoKTsgaSA8PSBkYXRlLmdldEZ1bGxZZWFyKCkgKyA1OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy55ZWFycy5wdXNoKCcnICsgaSk7XHJcbiAgICAgICAgICAgIC8vIOm7mOiupOiuvue9rueahOW5tOeahOS9jee9rlxyXG4gICAgICAgICAgICBpZiAoX2RlZmF1bHRZZWFyICYmIGkgPT09IHBhcnNlSW50KF9kZWZhdWx0WWVhcikpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMueWVhckluZGV4ID0gX3llYXJJbmRleDtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hvb3NlX3llYXIgPSBfZGVmYXVsdFllYXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgX3llYXJJbmRleCA9IF95ZWFySW5kZXggKyAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDojrflj5bmnIjku71cclxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSAxMjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpIDwgMTApIHtcclxuICAgICAgICAgICAgICAgIGkgPSAnMCcgKyBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubW9udGhzLnB1c2goJycgKyBpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g6I635Y+W5pel5pyfXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMzE7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgICAgICAgICBpID0gJzAnICsgaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRheXMucHVzaCgnJyArIGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyAvLyDojrflj5blsI/ml7ZcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI0OyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgICAgICAgICAgaSA9ICcwJyArIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5ob3Vycy5wdXNoKCcnICsgaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIC8vIOiOt+WPluWIhumSn1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNjA7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgICAgICAgICBpID0gJzAnICsgaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm1pbnV0ZXMucHVzaCgnJyArIGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyAvLyDojrflj5bnp5LmlbBcclxuICAgICAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8IDYwOyBpKyspIHtcclxuICAgICAgICAvLyAgIGlmIChpIDwgMTApIHtcclxuICAgICAgICAvLyAgICAgaSA9ICcwJyArIGlcclxuICAgICAgICAvLyAgIH1cclxuICAgICAgICAvLyAgIHRoaXMuc2Vjb25kLnB1c2goJycgKyBpKVxyXG4gICAgICAgIC8vIH1cclxuICAgIH1cclxuICAgIHNldFRpbWUgKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICBpZiAodGhpcy5saW1pdFRpbWUgPD0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmxpbWl0VGltZSA9IDYwO1xyXG4gICAgICAgICAgICB0aGlzLnNlbmRCdG4gPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5jb2RlTmFtZSA9ICfph43mlrDojrflj5YnO1xyXG4gICAgICAgICAgICB0aGlzLnNlbmRCdG4gPSBmYWxzZTtcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuY2xzVGltZW91dCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZW5kQnRuID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5saW1pdFRpbWUtLTtcclxuICAgICAgICAgICAgdGhpcy5jb2RlTmFtZSA9IHRoaXMubGltaXRUaW1lICsgJ3Pph43mlrDojrflj5YnO1xyXG4gICAgICAgICAgICB0aGlzLmNsc1RpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuc2V0VGltZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhhdC4kYXBwbHkoKTtcclxuICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8g6L+U5Zue5pyI5Lu955qE5aSp5pWwXHJcbiAgICBzZXREYXlzKHNlbGVjdFllYXIsIHNlbGVjdE1vbnRoKSB7XHJcbiAgICAgICAgbGV0IG51bSA9IHNlbGVjdE1vbnRoO1xyXG4gICAgICAgIGxldCB0ZW1wID0gW107XHJcbiAgICAgICAgaWYgKG51bSA9PT0gMSB8fCBudW0gPT09IDMgfHwgbnVtID09PSA1IHx8IG51bSA9PT0gNyB8fCBudW0gPT09IDggfHwgbnVtID09PSAxMCB8fCBudW0gPT09IDEyKSB7XHJcbiAgICAgICAgICAgIC8vIOWIpOaWrTMx5aSp55qE5pyI5Lu9XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDMxOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChpIDwgMTApIHtcclxuICAgICAgICAgICAgICAgICAgICBpID0gJzAnICsgaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRlbXAucHVzaCgnJyArIGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChudW0gPT09IDQgfHwgbnVtID09PSA2IHx8IG51bSA9PT0gOSB8fCBudW0gPT09IDExKSB7IC8vIOWIpOaWrTMw5aSp55qE5pyI5Lu9XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDMwOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChpIDwgMTApIHtcclxuICAgICAgICAgICAgICAgICAgICBpID0gJzAnICsgaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRlbXAucHVzaCgnJyArIGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChudW0gPT09IDIpIHsgLy8g5Yik5patMuaciOS7veWkqeaVsFxyXG4gICAgICAgICAgICBsZXQgeWVhciA9IHBhcnNlSW50KHNlbGVjdFllYXIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh5ZWFyKTtcclxuICAgICAgICAgICAgaWYgKCgoeWVhciAlIDQwMCA9PT0gMCkgfHwgKHllYXIgJSAxMDAgIT09IDApKSAmJiAoeWVhciAlIDQgPT09IDApKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSAyOTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpID0gJzAnICsgaTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcC5wdXNoKCcnICsgaSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSAyODsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpID0gJzAnICsgaTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcC5wdXNoKCcnICsgaSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRlbXA7XHJcbiAgICB9XHJcbiAgICAvLyDorr7nva7pu5jorqTlgLwg5qC85byPMjAxOS0wNy0xMCAxMDozMFxyXG4gICAgc2V0RGVmYXVsdHRpbWVzKCkge1xyXG4gICAgICAgIGxldCBhbGxEYXRlTGlzdCA9IHRoaXMudGltZXMuc3BsaXQoJyAnKTtcclxuICAgICAgICAvLyDml6XmnJ9cclxuICAgICAgICBsZXQgZGF0ZUxpc3QgPSBhbGxEYXRlTGlzdFswXS5zcGxpdCgnLScpO1xyXG4gICAgICAgIGxldCBtb250aCA9IHBhcnNlSW50KGRhdGVMaXN0WzFdKSAtIDE7XHJcbiAgICAgICAgbGV0IGRheSA9IHBhcnNlSW50KGRhdGVMaXN0WzJdKSAtIDE7XHJcbiAgICAgICAgLy8g5pe26Ze0XHJcbiAgICAgICAgbGV0IHRpbWVzTGlzdCA9IGFsbERhdGVMaXN0WzFdLnNwbGl0KCc6Jyk7XHJcbiAgICAgICAgdGhpcy5tdWx0aUFycmF5WzJdID0gdGhpcy5zZXREYXlzKGRhdGVMaXN0WzBdLCBwYXJzZUludChkYXRlTGlzdFsxXSkpO1xyXG4gICAgICAgIHRoaXMubXVsdGlJbmRleCA9IFt0aGlzLnllYXJJbmRleCwgbW9udGgsIGRheSwgdGltZXNMaXN0WzBdLCB0aW1lc0xpc3RbMV1dO1xyXG4gICAgfVxyXG4gICAgLy8g6I635Y+W5pe26Ze05pel5pyfXHJcbiAgICBQaWNrZXJDaGFuZ2UoZSkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdwaWNrZXLlj5HpgIHpgInmi6nmlLnlj5jvvIzmkLrluKblgLzkuLonLCBlLmRldGFpbC52YWx1ZSlcclxuICAgICAgICB0aGlzLm11bHRpSW5kZXggPSBlLmRldGFpbC52YWx1ZTtcclxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMubXVsdGlJbmRleDtcclxuICAgICAgICBjb25zdCB5ZWFyID0gdGhpcy5tdWx0aUFycmF5WzBdW2luZGV4WzBdXTtcclxuICAgICAgICBjb25zdCBtb250aCA9IHRoaXMubXVsdGlBcnJheVsxXVtpbmRleFsxXV07XHJcbiAgICAgICAgY29uc3QgZGF5ID0gdGhpcy5tdWx0aUFycmF5WzJdW2luZGV4WzJdXTtcclxuICAgICAgICBjb25zdCBob3VyID0gdGhpcy5tdWx0aUFycmF5WzNdW2luZGV4WzNdXTtcclxuICAgICAgICBjb25zdCBtaW51dGUgPSB0aGlzLm11bHRpQXJyYXlbNF1baW5kZXhbNF1dO1xyXG4gICAgICAgIC8vIGNvbnN0IHNlY29uZCA9IHRoaXMubXVsdGlBcnJheVs1XVtpbmRleFs1XV1cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgJHt5ZWFyfS0ke21vbnRofS0ke2RheX0tJHtob3VyfS0ke21pbnV0ZX1gKTtcclxuICAgICAgICB0aGlzLnRpbWVzID0geWVhciArICctJyArIG1vbnRoICsgJy0nICsgZGF5ICsgJyAnICsgaG91ciArICc6JyArIG1pbnV0ZTtcclxuICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRpbWVzO1xyXG4gICAgfVxyXG4gICAgaXNQaG9uZSAoc3RyKSB7XHJcbiAgICAgICAgY29uc3QgcmVnID0gL15bMV1bMyw0LDUsNyw4LDldWzAtOV17OX0kLztcclxuICAgICAgICByZXR1cm4gcmVnLnRlc3Qoc3RyKTtcclxuICAgIH1cclxuICAgIGdldFZhbGlkQ29kZSAoKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIGlmICh0aGlzLnNlbmRCdG4gPT09IHRydWUpIHJldHVybjtcclxuICAgICAgICB2YXIgbW9iaWxlO1xyXG4gICAgICAgIGlmICh0aGlzLnJvbGUgPT09ICc0Jykge1xyXG4gICAgICAgICAgICBtb2JpbGUgPSB0aGlzLmZvcm1EYXRhLm1vYmlsZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBtb2JpbGUgPSB0aGlzLmZvcm1EYXRhLnBob25lTnVtO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc1Bob25lKG1vYmlsZSkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgICAgICAgICAgICBjb250ZW50OiAn5omL5py65Y+35qC85byP5LiN5q2j56GuJyxcclxuICAgICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHd4LnNob3dMb2FkaW5nKHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAn5Y+R6YCB5LitLOivt+etieW+hS4uLidcclxuICAgICAgICAgICAgfSk7XHJcbiAgXHJcbiAgICAgICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgnd3gvc2VuZFZlcmlmaWNhdGlvbkNvZGVBcGkuanNvbicsIHtwaG9uZU51bTogbW9iaWxlfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+WPkemAgeaIkOWKn+ivt+afpeaUtid9XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LnNlbmRCdG4gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5zZXRUaW1lKCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aGF0LnNlbmRCdG4gPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBtZXRob2RzID0ge1xyXG4gIFxyXG4gICAgICAgIGdldEluZGV4KGUpIHtcclxuICAgICAgICAgICAgdGhpcy5pbmRleCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0YXJlYTogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuZ29vZHNbdGhpcy5pbmRleF1bJ2FyZWEnXSA9IHZhbHVlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0R29vZHMyKGUpIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZ29vZHNbdGhpcy5pbmRleF0uZ29vZHNBcnlbdmFsdWVdLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ29vZHNbdGhpcy5pbmRleF1bJ2Nyb3BzQ2F0ZWdvcnkyJ10gPVxyXG4gICAgICB0aGlzLmdvb2RzW3RoaXMuaW5kZXhdLmdvb2RzQXJ5W3ZhbHVlXS5sZW5ndGggPiA0ID8gdGhpcy5nb29kc1t0aGlzLmluZGV4XS5nb29kc0FyeVt2YWx1ZV0uc3Vic3RyaW5nKDAsIDQpIDogdGhpcy5nb29kc1t0aGlzLmluZGV4XS5nb29kc0FyeVt2YWx1ZV07XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRHb29kczogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuZ29vZHNbdGhpcy5pbmRleF0uZ29vZHNBcnkgPSB0aGlzLnR3b1t2YWx1ZV07XHJcbiAgICAgICAgICAgIHRoaXMuZ29vZHNbdGhpcy5pbmRleF1bJ2Nyb3BzQ2F0ZWdvcnkxJ10gPSB0aGlzLm9uZVt2YWx1ZV07XHJcbiAgICAgICAgICAgIHRoaXMuZ29vZHNbdGhpcy5pbmRleF1bJ2Nyb3BzQ2F0ZWdvcnkyJ10gPSAnJztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFkZEZ1biAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdvb2RzLmxlbmd0aCA+PSA1KSB7XHJcbiAgICAgICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiAn56eN5qSN5L2c54mp5pyA5aSaNeenjScsXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZ29vZHMucHVzaCh7YXJlYTogJycsIGNyb3BzQ2F0ZWdvcnk6ICcnfSk7XHJcbiAgICAgICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWwoZSkge1xyXG4gICAgICAgICAgICB0aGlzLmdvb2RzLnNwbGljZShlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleCwgMSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyDojrflj5bpqozor4HnoIFcclxuICAgICAgICBzZW5kRnVuICgpIHtcclxuICAgICAgICAgICAgdGhpcy5nZXRWYWxpZENvZGUoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNob29zZUxvY2F0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgICAgICB3eC5nZXRMb2NhdGlvbih7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnd2dzODQnLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzcyAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd3guY2hvb3NlTG9jYXRpb24oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXRpdHVkZTogcmVzLmxhdGl0dWRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb25naXR1ZGU6IHJlcy5sb25naXR1ZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MgKHJlc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWPkemAgeivt+axgumAmui/h+e7j+e6rOW6puWPjeafpeWcsOWdgOS/oeaBr1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5mZXRjaERhdGFQcm9taXNlKCdyZXNvbHZlTG9jYXRpb25BcGkuanNvbicsIHtsYXRpdHVkZTogcmVzdC5sYXRpdHVkZSwgbG9uZ2l0dWRlOiByZXN0LmxvbmdpdHVkZX0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmFkZHJlc3MgPSBbZGF0YS5wcm92aW5jZU5hbWUsIGRhdGEuY2l0eU5hbWUsIGRhdGEuZGlzdHJpY3ROYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5mb3JtRGF0YS5hZGRyZXNzID0gZGF0YS5hZGRyZXNzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gIFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0UmVtYXJrIChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybURhdGEucmVtYXJrID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRtb2JpbGUoZSkge1xyXG4gICAgICAgICAgICB0aGlzLmZvcm1EYXRhLm1vYmlsZSA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYmluZExldmVyQ2hhbmdlIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgICB0aGlzLmZvcm1EYXRhLmRlYWxlckxldmVsID0gdGhpcy5hcnJheUxldmVsW2UuZGV0YWlsLnZhbHVlXTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJpbmRSZWdpb25DaGFuZ2UgKGUpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRyZXNzID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybURhdGEuYWRkcmVzcyA9ICcnO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2hhbmdlQ2xhc3NpZnkgKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybURhdGEuY2xhc3NpZnkgPSBlLmRldGFpbC52YWx1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldENvZGUgKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybURhdGEuY29kZSA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8g55uR5ZCscGlja2Vy55qE5rua5Yqo5LqL5Lu2XHJcbiAgICAgICAgYmluZE11bHRpUGlja2VyQ29sdW1uQ2hhbmdlKGUpIHtcclxuICAgICAgICAvLyDojrflj5blubTku71cclxuICAgICAgICAgICAgaWYgKGUuZGV0YWlsLmNvbHVtbiA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaG9vc2VfeWVhciA9IHRoaXMubXVsdGlBcnJheVtlLmRldGFpbC5jb2x1bW5dW2UuZGV0YWlsLnZhbHVlXTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY2hvb3NlX3llYXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCfkv67mlLnnmoTliJfkuLonLCBlLmRldGFpbC5jb2x1bW4sICfvvIzlgLzkuLonLCBlLmRldGFpbC52YWx1ZSk7XHJcbiAgICAgICAgICAgIC8vIOiuvue9ruaciOS7veaVsOe7hFxyXG4gICAgICAgICAgICBpZiAoZS5kZXRhaWwuY29sdW1uID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbnVtID0gcGFyc2VJbnQodGhpcy5tdWx0aUFycmF5W2UuZGV0YWlsLmNvbHVtbl1bZS5kZXRhaWwudmFsdWVdKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubXVsdGlBcnJheVsyXSA9IHRoaXMuc2V0RGF5cyh0aGlzLmNob29zZV95ZWFyLCBudW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLm11bHRpSW5kZXhbZS5kZXRhaWwuY29sdW1uXSA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYmluZFN0YXJ0Q2hhbmdlIChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybURhdGEuc3RhcnREYXRlMSA9IHRoaXMuUGlja2VyQ2hhbmdlKGUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYmluZEVuZENoYW5nZSAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLmZvcm1EYXRhLmVuZERhdGUxID0gdGhpcy5QaWNrZXJDaGFuZ2UoZSk7XHJcbiAgICAgICAgfSxcclxuICBcclxuICAgICAgICAvLyDojrflj5bml7bpl7RcclxuICAgICAgICBnZXR0aW1lcyAodGltZXMpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2codGltZXMpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2hvd0FkZHJDaG9zZSgpIHsgLy8g5pi+56S655yB5biC5Yy66IGU5Yqo6YCJ5oup5qGGXHJcbiAgICAgICAgICAgIHRoaXMuaXNTaG93QWRkcmVzc0Nob3NlID0gIXRoaXMuZGF0YS5pc1Nob3dBZGRyZXNzQ2hvc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjYW5jZWwoKSB7IC8vIOWPlua2iFxyXG4gICAgICAgICAgICB0aGlzLmlzU2hvd0FkZHJlc3NDaG9zZSA9IGZhbHNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmluaXNoKCkgeyAvLyDlrozmiJBcclxuICAgICAgICAgICAgdGhpcy5pc1Nob3dBZGRyZXNzQ2hvc2UgPSBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldE5hbWUoZSkgeyAvLyDojrflvpfkvJrorq7lkI3np7BcclxuICAgICAgICAgICAgdGhpcy5mb3JtRGF0YS5uYW1lID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRwaG9uZU51bSAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLmZvcm1EYXRhLnBob25lTnVtID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRDb250ZW50KGUpIHsgLy8g6I635b6X5YWo6YOo5YaF5a65XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybURhdGEuY29udGVudCA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0bGVhZGVyKGUpIHsgLy8g6I635b6X6aKG5a+8XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybURhdGEubGVhZGVyID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRjb21wYW55TmFtZSAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLmZvcm1EYXRhLmNvbXBhbnlOYW1lID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRhZGRyZXNzKGUpIHsgLy8g6I635b6X6aKG5a+8XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybURhdGEuYWRkcmVzcyA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0dXNlckNvdW50KGUpIHsgLy8g6I635b6X6aKG5a+8XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybURhdGEudXNlckNhcGFjaXR5ID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdWJtaXQgKCkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIGlmICghc2VsZi5mb3JtRGF0YS5tb2JpbGUgfHwgc2VsZi5mb3JtRGF0YS5tb2JpbGUgPT0gJycpIHtcclxuICAgICAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICfmiYvmnLrlj7flv4XloasnLFxyXG4gICAgICAgICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzUGhvbmUodGhpcy5mb3JtRGF0YS5tb2JpbGUpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogJ+aJi+acuuWPt+agvOW8j+S4jeato+ehricsXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzZWxmLmZvcm1EYXRhLmNvZGUgfHwgc2VsZi5mb3JtRGF0YS5jb2RlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiAn6aqM6K+B56CB5b+F5aGrJyxcclxuICAgICAgICAgICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5mb3JtRGF0YS5yb2xlID0gdGhpcy5yb2xlO1xyXG4gICAgICAgICAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3d4L3VwZGF0ZVVzZXJBcGkuanNvbicsIHRoaXMuZm9ybURhdGEpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5mb3JtRGF0YSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOi/lOWbnuS4iuS4gOmhtVxyXG4gICAgICAgICAgICAgICAgICAgIHd4Lm5hdmlnYXRlQmFjayh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbHRhOiAxXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTsgc3M7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNhdmUoKSB7IC8vIOS/neWtmFxyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybURhdGEubW9iaWxlID0gdGhpcy5mb3JtRGF0YS5waG9uZU51bTtcclxuICAgICAgICAgICAgaWYgKCFzZWxmLmZvcm1EYXRhLm5hbWUgfHwgc2VsZi5mb3JtRGF0YS5uYW1lID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiAn5aeT5ZCN5b+F5aGrJyxcclxuICAgICAgICAgICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZi5yb2xlID09PSAnMycgJiYgKCFzZWxmLmZvcm1EYXRhLmNvbXBhbnlOYW1lIHx8IHNlbGYuZm9ybURhdGEuY29tcGFueU5hbWUgPT0gJycpKSB7XHJcbiAgICAgICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiAn5YWs5Y+45ZCN56ew5b+F5aGrJyxcclxuICAgICAgICAgICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXNlbGYuZm9ybURhdGEubW9iaWxlIHx8IHNlbGYuZm9ybURhdGEubW9iaWxlID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiAn5omL5py65Y+35b+F5aGrJyxcclxuICAgICAgICAgICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc1Bob25lKHRoaXMuZm9ybURhdGEubW9iaWxlKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICfmiYvmnLrlj7fmoLzlvI/kuI3mraPnoa4nLFxyXG4gICAgICAgICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICghc2VsZi5mb3JtRGF0YS5jb2RlIHx8IHNlbGYuZm9ybURhdGEuY29kZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogJ+mqjOivgeeggeW/heWhqycsXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNlbGYucm9sZSA9PT0gJzMnICYmICghc2VsZi5mb3JtRGF0YS5kZWFsZXJMZXZlbCB8fCBzZWxmLmZvcm1EYXRhLmRlYWxlckxldmVsID09ICcnKSkge1xyXG4gICAgICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogJ+etiee6p+W/hemAiScsXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzZWxmLmFkZHJlc3MgfHwgc2VsZi5hZGRyZXNzID09ICcnIHx8IHNlbGYuYWRkcmVzcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICfor7fpgInmi6nlnLDlnYAnLFxyXG4gICAgICAgICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxmLnJvbGUgPT09ICcxJyAmJiAoIXNlbGYuZm9ybURhdGEuYWRkcmVzcyB8fCBzZWxmLmZvcm1EYXRhLmFkZHJlc3MgPT0gJycpKSB7XHJcbiAgICAgICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiAn6K+m57uG5Zyw5Z2A5b+F5aGrJyxcclxuICAgICAgICAgICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHNlbGYucm9sZSA9PT0gJzEnKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ29vZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5nb29kc1tpXS5hcmVhID09PSAnJyB8fCB0aGlzLmdvb2RzLmNyb3BzQ2F0ZWdvcnkgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiAn56eN5qSN5L2c54mp5b+F5aGrJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZ29vZHMgPSB0aGlzLmdvb2RzLm1hcChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9iaiA9IGl0ZW07XHJcbiAgICAgICAgICAgICAgICBvYmouY3JvcHNDYXRlZ29yeSA9IG9iai5jcm9wc0NhdGVnb3J5MSArICcsJyArIG9iai5jcm9wc0NhdGVnb3J5MjtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmZvcm1EYXRhLmNyb3BzQ2F0ZWdvcnlBbmRBcmVhID0gdGhpcy5nb29kcztcclxuICAgICAgICAgICAgdGhpcy5mb3JtRGF0YS5wcm92aW5jZU5hbWUgPSB0aGlzLmFkZHJlc3NbMF07XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybURhdGEuY2l0eU5hbWUgPSB0aGlzLmFkZHJlc3NbMV07XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybURhdGEuZGlzdHJpY3ROYW1lID0gdGhpcy5hZGRyZXNzWzJdO1xyXG4gICAgICAgICAgICB0aGlzLmZvcm1EYXRhLnJvbGUgPSB0aGlzLnJvbGU7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnR5cGUgPT0gJ2VkaXQnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1EYXRhLnVzZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKCdtZWV0aW5nL3dlY2hhdC91cGRhdGVNZWV0aW5nQXBpLmpzb24nLCB0aGlzLmZvcm1EYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5mb3JtRGF0YSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDov5Tlm57kuIrkuIDpobVcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3gubmF2aWdhdGVCYWNrKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbHRhOiAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKCd3eC91cGRhdGVVc2VyQXBpLmpzb24nLCB0aGlzLmZvcm1EYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5mb3JtRGF0YSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDov5Tlm57kuIrkuIDpobVcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3gubmF2aWdhdGVCYWNrKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbHRhOiAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgIH1cclxuICAgIG9uU2hvdyAoKSB7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuY2xzVGltZW91dCk7XHJcbiAgICB9XHJcbiAgICAvLyBlbmRGdW4gKCkge1xyXG4gICAgLy8gICBpZiAodGhpcy5mb3JtRGF0YS5lbmREYXRlMSkgdGhpcy50aW1lcyA9IHRoaXMuZm9ybURhdGEuZW5kRGF0ZTFcclxuICAgIC8vIH1cclxuICAgIC8vIHN0YXJ0RGF0ZSAoKSB7XHJcbiAgICAvLyAgIGlmICh0aGlzLmZvcm1EYXRhLnN0YXJ0RGF0ZTEpIHRoaXMudGltZXMgPSB0aGlzLmZvcm1EYXRhLnN0YXJ0RGF0ZTFcclxuICAgIC8vIH1cclxuICAgIHdoZW5BcHBSZWFkeVNob3coKSB7XHJcbiAgXHJcbiAgICB9XHJcbiAgICBvbkxvYWQob3B0aW9ucykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKDExMSk7XHJcbiAgICAgICAgdGhpcy5jb2RlTmFtZSA9ICfojrflj5bpqozor4HnoIEnLFxyXG4gICAgICAgIHRoaXMubGltaXRUaW1lID0gNjA7XHJcbiAgICAgICAgdGhpcy5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuY2xzVGltZW91dCk7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIGlmIChvcHRpb25zLnJvbGUpIHtcclxuICAgICAgICAgICAgdGhpcy5yb2xlID0gb3B0aW9ucy5yb2xlO1xyXG4gICAgICAgICAgICB3eC5nZXRTdG9yYWdlKHtcclxuICAgICAgICAgICAgICAgIGtleTogJ3VzZXJJbmZvJyxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3MgKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKHJlcy5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LmZvcm1EYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LmZvcm1EYXRhLm5hbWUgPSBkYXRhLnVzZXJOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuZm9ybURhdGEucGhvbmVOdW0gPSBkYXRhLm1vYmlsZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0Lmdvb2RzID0gdGhhdC5mb3JtRGF0YS5jcm9wc0NhdGVnb3J5QW5kQXJlYSA/IHRoYXQuZm9ybURhdGEuY3JvcHNDYXRlZ29yeUFuZEFyZWEgOiBbe2FyZWE6ICcnLCBjcm9wc0NhdGVnb3J5OiAnJ31dO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhhdC5mb3JtRGF0YS5sYXRpdHVkZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3eC5nZXRMb2NhdGlvbih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ2NqMDInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XHJcbiAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5mb3JtRGF0YS5sYXRpdHVkZSA9IHJlcy5sYXRpdHVkZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmZvcm1EYXRhLmxvbmdpdHVkZSA9IHJlcy5sb25naXR1ZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFpbDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGF0LmFkZHJlc3MgPSAhdGhhdC5mb3JtRGF0YS5wcm92aW5jZU5hbWUgPyBbXSA6IFt0aGF0LmZvcm1EYXRhLnByb3ZpbmNlTmFtZSwgdGhhdC5mb3JtRGF0YS5jaXR5TmFtZSwgdGhhdC5mb3JtRGF0YS5kaXN0cmljdE5hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIC8vIOiOt+WPlue7j+e6rOW6plxyXG4gICAgICAgIHRoaXMudGltZXMgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCkgKyAnLScgKyB0aGlzLnRpbWVzRnVuKG5ldyBEYXRlKCkuZ2V0TW9udGgoKSArIDEpICsgJy0nICsgdGhpcy50aW1lc0Z1bihuZXcgRGF0ZSgpLmdldERhdGUoKSkgKyAnICcgKyAnMTInO1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICAvLyBpZiAob3B0aW9ucy5pdGVtKSB7XHJcbiAgICAgICAgLy8gICB3eC5zZXROYXZpZ2F0aW9uQmFyVGl0bGUoe1xyXG4gICAgICAgIC8vICAgICB0aXRsZTogJ+e8lui+keS8muiuridcclxuICAgICAgICAvLyAgIH0pXHJcbiAgICAgICAgLy8gICB0aGF0LnR5cGUgPSAnZWRpdCdcclxuICAgICAgICAvLyAgIHRoaXMuZm9ybURhdGEgPSBKU09OLnBhcnNlKG9wdGlvbnMuaXRlbSlcclxuICAgICAgICAvLyAgIHRoaXMuZm9ybURhdGEuc3RhcnREYXRlMSA9IHRoaXMuZm9ybURhdGEuc3RhcnREYXRlMS5zcGxpdCgnICcpWzBdICsgJyAnICsgdGhpcy5mb3JtRGF0YS5zdGFydERhdGUxLnNwbGl0KCcgJylbMV0uc3BsaXQoJzonKVswXVxyXG4gICAgICAgIC8vICAgdGhpcy5mb3JtRGF0YS5lbmREYXRlMSA9IHRoaXMuZm9ybURhdGEuZW5kRGF0ZTEuc3BsaXQoJyAnKVswXSArICcgJyArIHRoaXMuZm9ybURhdGEuc3RhcnREYXRlMS5zcGxpdCgnICcpWzFdLnNwbGl0KCc6JylbMF1cclxuICAgICAgICAvLyAgIHRoaXMudGltZXMgPSB0aGlzLmZvcm1EYXRhLnN0YXJ0RGF0ZTFcclxuICAgICAgICAvLyB9XHJcbiAgXHJcbiAgICAgICAgdGhpcy5zZXR0aW1lc0RhdGUoKTtcclxuICAgICAgICAvLyB0aGlzLm11bHRpQXJyYXkgPSBbdGhpcy55ZWFycywgdGhpcy5tb250aHMsIHRoaXMuZGF5cywgdGhpcy5ob3VycywgdGhpcy5taW51dGVzLCB0aGlzLnNlY29uZF1cclxuICAgICAgICB0aGlzLm11bHRpQXJyYXkgPSBbdGhpcy55ZWFycywgdGhpcy5tb250aHMsIHRoaXMuZGF5cywgdGhpcy5ob3VycywgdGhpcy5taW51dGVzXTtcclxuICAgICAgICAvLyB0aGlzLm11bHRpQXJyYXkgPSBbdGhpcy55ZWFycywgdGhpcy5tb250aHMsIHRoaXMuZGF5cywgdGhpcy5ob3Vyc11cclxuICAgICAgICAvLyB0aGlzLm11bHRpQXJyYXkgPSBbdGhpcy55ZWFycywgdGhpcy5tb250aHMsIHRoaXMuZGF5c11cclxuICAgICAgICB0aGlzLmNob29zZV95ZWFyID0gdGhpcy5tdWx0aUFycmF5WzBdWzBdO1xyXG4gICAgICAgIGlmICghdGhpcy50aW1lcykge1xyXG4gICAgICAgIC8vIOm7mOiupOaYvuekuuW9k+WJjeaXpeacn1xyXG4gICAgICAgICAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50TW9udGggPSBkYXRlLmdldE1vbnRoKCk7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50RGF5ID0gZGF0ZS5nZXREYXRlKCkgLSAxO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmluZm8oJ+aciCcsIGRhdGUuZ2V0TW9udGgoKSlcclxuICAgICAgICAgICAgLy8gY29uc29sZS5pbmZvKCfml6UnLCBkYXRlLmdldERhdGUoKSlcclxuICAgICAgICAgICAgdGhpcy5tdWx0aUFycmF5WzJdID0gdGhpcy5zZXREYXlzKHRoaXMuY2hvb3NlX3llYXIsIGN1cnJlbnRNb250aCArIDEpO1xyXG4gICAgICAgICAgICB0aGlzLm11bHRpSW5kZXggPSBbMCwgY3VycmVudE1vbnRoLCBjdXJyZW50RGF5LCAxMCwgMF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZXREZWZhdWx0dGltZXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gd3guZ2V0U3RvcmFnZSh7XHJcbiAgICAgICAgLy8gICBrZXk6ICdpdGVtJyxcclxuICAgICAgICAvLyAgIHN1Y2Nlc3MgKHJlcykge1xyXG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YSlcclxuICAgICAgICAvLyAgICAgc2VsZi5mb3JtRGF0YSA9IHJlcy5kYXRhXHJcbiAgICAgICAgLy8gICB9XHJcbiAgICAgICAgLy8gfSlcclxuXHJcbiAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgIH1cclxuICAgIC8vIHdoZW5BcHBSZWFkeVNob3coKSB7XHJcbiAgICAvLyAgIC8vIOavj+asoemDveWIt+aWsFxyXG4gICAgLy8gICB0aGlzLiRhcHBseSgpXHJcbiAgICAvLyB9XHJcbiAgICBjaGFuZ2VDdXJyZW50RGF0YShvcHRpb24pIHsgLy8g5pS55Y+Y5b2T5YmN5pWw5o2uXHJcbiAgICAgICAgLy8g5YWo5Zu95pWw5o2uXHJcbiAgICAgICAgdmFyIG5hdGlvbmFsRGF0YSA9IHRoaXMubmF0aW9uYWxEYXRhO1xyXG4gICAgICAgIC8vIOaJgOacieecgVxyXG4gICAgICAgIGlmICh0aGlzLnByb3ZpbmNlcy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvdmluY2VzID0gdGhpcy5kYXRhLnByb3ZpbmNlcztcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYXRpb25hbERhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHByb3ZpbmNlcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleDogaSxcclxuICAgICAgICAgICAgICAgICAgICBwcm92aW5jZTogbmF0aW9uYWxEYXRhW2ldLnpvbmVfbmFtZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5wcm92aW5jZXMgPSBwcm92aW5jZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOW9k+WJjeaJgOacieW4glxyXG4gICAgICAgIGlmIChvcHRpb24udHlwZSA9PSAnY2l0eScgfHwgb3B0aW9uLnR5cGUgPT0gJ2FsbCcpIHtcclxuICAgICAgICAvLyDmuIXnqbrluILmlbDmja5cclxuICAgICAgICAgICAgdGhpcy5jaXRpZXMgPSBbXTtcclxuICAgICAgICAgICAgdmFyIGNpdGllcyA9IHRoaXMuY2l0aWVzO1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudENpdGllcyA9IG5hdGlvbmFsRGF0YVtvcHRpb24uY3VycmVudFByb3ZpbmNlSW5kZXhdLmNpdHlzO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnRDaXRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNpdGllcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleDogaSxcclxuICAgICAgICAgICAgICAgICAgICBjaXR5OiBjdXJyZW50Q2l0aWVzW2ldLnpvbmVfbmFtZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jaXRpZXMgPSBjaXRpZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOW9k+WJjeaJgOacieWMulxyXG4gICAgICAgIC8vIOa4heepuiDljLog5pWw5o2uXHJcbiAgICAgICAgdGhpcy5kaXN0cmljdHMgPSBbXTtcclxuICAgICAgICB2YXIgZGlzdHJpY3RzID0gdGhpcy5kaXN0cmljdHM7XHJcbiAgICAgICAgdmFyIGN1cnJlbnREaXN0cmljdHMgPSBuYXRpb25hbERhdGFbb3B0aW9uLmN1cnJlbnRQcm92aW5jZUluZGV4XS5jaXR5c1tvcHRpb24uY3VycmVudENpdHlJbmRleF0uZGlzdHJpY3RzO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VycmVudERpc3RyaWN0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaSAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICBkaXN0cmljdHMucHVzaChjdXJyZW50RGlzdHJpY3RzW2ldLnpvbmVfbmFtZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZGlzdHJpY3RzID0gZGlzdHJpY3RzO1xyXG4gICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICB9XHJcbiAgfVxyXG4iXX0=