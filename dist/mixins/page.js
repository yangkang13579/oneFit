'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _app = require('./../lib/app.js');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global wx getCurrentPages */


// 每个页面都继承它，可以实现一些公共的方法
var PageMixin = function (_wepy$mixin) {
    _inherits(PageMixin, _wepy$mixin);

    function PageMixin() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, PageMixin);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = PageMixin.__proto__ || Object.getPrototypeOf(PageMixin)).call.apply(_ref, [this].concat(args))), _this), _this.data = {
            // 公共的一些变量
            loadUser: false,
            user: {}, // 用户信息
            passport: null, // sessionId
            config: {}, // 应用的配置，必须有
            loadOptions: false,
            options: {} // 个人化参数
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }
    // 公共的数据


    _createClass(PageMixin, [{
        key: 'onShow',
        value: function onShow() {
            this.app = _app2.default;
            this.checkAppReady();
        }
    }, {
        key: 'checkAppReady',
        value: function checkAppReady() {
            var _this2 = this;

            // wx.showLoading({ title: '读取数据...' });
            _app2.default.checkReady({
                user: this.loadUser,
                config: true,
                userInfo: true,
                refer: true,
                options: this.loadOptions
            }).then(function (data) {
                wx.hideLoading();
                console.log('app data:', data);
                if (data.passportData) {
                    _this2.user = data.passportData.user;
                    _this2.passport = data.passportData.session.id;
                    //
                    // 检查是否绑定了手机
                    var mobile = null;
                    var logins = data.passportData.user.logins;
                    for (var i = 0; i < logins.length; i++) {
                        var login = logins[i];
                        if (login.type === 'mobile') {
                            mobile = login.loginId;
                            break;
                        }
                    }
                    if (mobile != null) {
                        _this2.user.mobile = mobile;
                    }
                    //
                }
                if (data.config) {
                    _this2.config = data.config;
                }
                if (data.appOptions) {
                    _this2.options = data.appOptions;
                }
                if (data.refer) {
                    _this2.whenShared(data.refer);
                }
                _this2.$apply();
                _this2.whenAppReady();
            }).catch(function (error) {
                wx.hideLoading();
                _this2.renderError(error);
            });
        }
    }, {
        key: 'renderError',
        value: function renderError(e) {
            console.log('error:', e);
            if (e.name === 'user_login') {
                console.log('redirect to login page');
                wx.navigateTo({
                    url: '/pages/login'
                });
                // wx.navigateTo({url: '/pages/login'});
                // this.wxLogin();
                return;
                //
            }
            if (e.name === 'userinfo_reject' || e.name === 'userinfo_fail') {
                wx.showModal({
                    title: '登录需要授权',
                    content: '您需要授权应用能访问用户信息',
                    showCancel: false,
                    confirmText: '去设置',
                    confirmColor: '#037ad8',
                    complete: function complete(res) {
                        wx.openSetting({
                            success: function success(res) {
                                // 会重新调用onShow()
                            }
                        });
                    }
                });
                return;
            }
            if (e.name === 'passport is invalid') {
                wx.showModal({
                    title: '登录已过期',
                    content: '您需要重新启动小程序',
                    cancelText: '取消',
                    confirmText: '好的',
                    confirmColor: '#037ad8',
                    complete: function complete(res) {
                        self.wxLogin();
                    }
                });
                return;
            }
            if (e.name === 'NETWORK_ERROR') {
                wx.showModal({
                    title: '网络连接',
                    content: '网络存在问题,无法读取数据,请检查网络设置',
                    showCancel: false,
                    confirmText: '重试',
                    confirmColor: '#037ad8',
                    success: function success(res) {
                        wx.navigateBack();
                    }
                });
                return;
            }
            wx.showModal({
                title: '出错了',
                content: '[' + e.name + ']' + e.message,
                showCancel: false,
                confirmText: '重试',
                confirmColor: '#037ad8',
                success: function success(res) {
                    // wx.navigateBack();
                    wx.hideLoading();
                }
            });
            console.log('Unhandle error:', e);
        }
    }, {
        key: 'wxLogin',
        value: function wxLogin() {
            var self = this;
            wx.showLoading({ title: '读取用户信息...' });
            _app2.default.wxLogin().then(function (data) {
                wx.hideLoading();
                console.log('wxLogin ok:', data);
                self.checkAppReady();
            }).catch(function (e) {
                wx.hideLoading();
                console.log('wxLogin error:');
                self.renderError(e);
            });
        }
    }, {
        key: 'whenAppReady',
        value: function whenAppReady() {
            //

            //
            this.whenAppReadyShow();
        }
    }, {
        key: 'whenAppReadyShow',
        value: function whenAppReadyShow() {
            console.log('whenAppReadyShow...');
        }
    }, {
        key: 'time',
        value: function time(timeStr) {
            var dataOne = timeStr.split('T')[0];
            var dataTwo = timeStr.split('T')[1];
            var dataThree = dataTwo.split('+')[0];
            var newTimeStr = dataOne + ' ' + dataThree;
            return newTimeStr;
        }
        /** 当页面发起转发 */

    }, {
        key: 'whenAppShare',
        value: function whenAppShare(options) {
            // 需要微信带上tickets信息
            wx.updateShareMenu({ withShareTicket: true, success: function success() {}
            });
            var self = this;
            var pages = getCurrentPages(); // 获取加载的页面
            var currentPage = pages[pages.length - 1]; // 获取当前页面的对象
            var currentUserId = '';
            if (this.user != null) {
                currentUserId = this.user.id;
            }
            var query = options.query || '';
            var url = '/' + currentPage.route + '?refererId=' + currentUserId + '&' + query; // 当前页面url
            console.log('url=' + url + ',options=', options);
            return {
                title: options.title || '',
                path: url,
                success: function success(res) {
                    // 转发成功
                    self.whenShared({
                        url: encodeURIComponent(url),
                        forward: true
                    }, true);
                },
                fail: function fail(res) {
                    // 转发失败
                    self.whenShared({
                        url: encodeURIComponent(url),
                        forward: false
                    }, true);
                }
            };
        }
    }, {
        key: 'whenShared',
        value: function whenShared(referer, create) {
            if (create) {
                referer.action = 'add';
            } else {
                referer.action = 'look';
            }
            console.log('whenShared:', referer);
            this.fetchDataPromise('restankReferer.do', referer, {
                showLoading: false
            }).then(function (data) {
                console.log('referer:', data);
            }).catch(function (error) {
                console.log('referer error:', error);
            });
        }
        // --------------- 所有页面的公共函数 ------------
        // 为所有页面提供统一的数据获取方法

    }, {
        key: 'fetchDataPromise',
        value: function fetchDataPromise(url, params) {
            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            if (url.indexOf('http') !== 0) {
                url = this.config.dataUrl + url;
            }
            //
            // 在所有请求里加入userId
            if (this.passport) {
                console.log('this.passport', this.passport);
                params.passport = this.passport;
            }
            // 增加程序信息
            if (this.config && this.config.versionInfo) {
                params.device = this.config.versionInfo.device;
                params.platform = this.config.versionInfo.platform;
                params.version = this.config.versionInfo.version;
            }
            // 显示加载数据提示
            options.showLoading = true;
            return _app2.default.fetchDataPromise(url, params, options);
        }
        // 参数错误没有id，跳转到搜索

    }, {
        key: 'whenParamError',
        value: function whenParamError() {
            console.log('on parameter error');
            wx.redirectTo({ url: '/pages/index' });
        }
        // 对article的格式进行处理

    }, {
        key: 'processArticle',
        value: function processArticle(item) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var defaultOptions = {
                abstractsLength: 100,
                tagsLength: 5,
                titleHTML: false, // 标题是否为HTML格式
                abstractsHTML: false
            };
            options = Object.assign({}, defaultOptions, options);
            // 对标题进行简单的HTML格式化处理
            if (options.titleHTML) {
                var htmlNodes = this._makeHTMLNode(item.title, 0);
                item.titleNodes = htmlNodes;
            }
            // 处理翻译结果
            // item.title_zh = item.title;
            if (item.title_zh && item.title_zh.length > 0) {
                item.title_zh = '译文:' + item.title_zh;
                if (options.titleHTML) {
                    var _htmlNodes = this._makeHTMLNode(item.title_zh, 0);
                    item.titleTranslateNodes = _htmlNodes;
                } else {
                    item.titleTranslate = item.title_zh;
                }
            }
            // 摘要太多了，只取100个字
            if (item.abstracts) {
                if (options.abstractsHTML) {
                    item.abstractsNodes = this._makeHTMLNode(item.abstracts, options.abstractsLength);
                } else if (options.abstractsLength > 0 && item.abstracts.length > options.abstractsLength) {
                    item.abstracts = item.abstracts.substring(0, options.abstractsLength) + '...';
                } else if (item.abstracts.length === 0) {
                    item.abstracts = '暂无摘要';
                }
                // console.log(item.abstracts);
            } else {
                item.abstracts = '暂无摘要';
            }
            // 项目金额
            if (item.amount > 0) {
                item.amountDesc = this.formatNumber(item.amount / 1);
            }

            item.titleDesc = (item.year && item.year.length > 0 ? item.year + ',' : '') + (item.piname && item.piname.length > 0 ? item.piname + ',' : '') + (item.orgname && item.orgname.length ? item.orgname + ',' : '');
            // 去掉最后一个，
            item.titleDesc = item.titleDesc.substring(0, item.titleDesc.length - 1);
            item.titleDescNodes = this._makeHTMLNode(item.titleDesc, 0);
            // 项目关键字,处理分隔符号，服务器端未做处理
            if (item.keywords && item.keywords.length > 0) {
                var tags = this._makeArrays(item.keywords);
                // -------- console.log("tags is ",tags);
                if (tags.length > 1) {
                    tags.forEach(function (tag) {
                        if (tag.length > 10) {
                            tag = tag.substring(0, 10);
                        }
                    });
                    // 只取前几个
                    tags = tags.slice(0, options.tagsLength);
                    //
                    if (tags.length > 0) {
                        item.tags = tags;
                    }
                    // console.log("item tags:", tags);
                }
            }
        }
    }, {
        key: 'formatNumber',
        value: function formatNumber(n) {
            return n.toFixed(0).replace(/./g, function (c, i, a) {
                return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? ',' + c : c;
            });
        }
    }, {
        key: '_makeArrays',
        value: function _makeArrays(txt, splits) {
            // 统一都转换成第一个split，然后统一split
            txt = txt.replace(/:/g, ';');
            txt = txt.replace(/；/g, ';');
            txt = txt.replace(/^\s*|\s*$/g, ''); // 去掉空格
            var ret = [];
            var array = txt.split(';');
            for (var i = 0; i < array.length; i++) {
                if (array[i].length > 0) {
                    ret.push(array[i]);
                }
            }
            return ret;
        }
    }, {
        key: '_makeHTMLNode',
        value: function _makeHTMLNode(txt, maxLength) {
            var htmlNodes = [];
            var length = 0;
            var nodes = txt.split("<span class='red'>");
            for (var i = 0; i < nodes.length; i++) {
                var text = nodes[i];
                var index = text.indexOf('</span>');
                if (index < 0) {
                    length += text.length;
                    if (maxLength > 0 && length > maxLength) {
                        htmlNodes.push({
                            type: 'text',
                            text: text.substring(0, txt.length - length + maxLength) + '...'
                        });
                    } else {
                        htmlNodes.push({ type: 'text', text: text });
                    }
                } else {
                    var tmp1 = text.substring(0, index);
                    var tmp2 = text.substring(index + '</span>'.length);
                    length += tmp1.length;
                    htmlNodes.push({
                        name: 'span',
                        attrs: {
                            style: 'color: red;'
                        },
                        children: [{
                            type: 'text',
                            text: tmp1 + ''
                        }]
                    });
                    if (tmp2.length > 0) {
                        length += tmp2.length;
                        if (maxLength > 0 && length > maxLength) {
                            htmlNodes.push({
                                type: 'text',
                                text: tmp2.substring(tmp2.length - length + maxLength) + '...'
                            });
                        } else {
                            htmlNodes.push({ type: 'text', text: tmp2 });
                        }
                    }
                    if (maxLength > 0 && length > maxLength) {
                        htmlNodes.push({ type: 'text', text: '...' });
                        break;
                    }
                }
            }
            // console.log("txt is:", txt, htmlNodes);
            return htmlNodes;
        }
    }, {
        key: 'toLocalDate',
        value: function toLocalDate(iso8601) {
            var pattern = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'yyyy-MM-dd';

            // 试了几个库都不行，在手机上会出错
            return iso8601.substring(0, iso8601.indexOf('T'));
        }
    }]);

    return PageMixin;
}(_wepy2.default.mixin);

exports.default = PageMixin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2UuanMiXSwibmFtZXMiOlsiUGFnZU1peGluIiwiZGF0YSIsImxvYWRVc2VyIiwidXNlciIsInBhc3Nwb3J0IiwiY29uZmlnIiwibG9hZE9wdGlvbnMiLCJvcHRpb25zIiwiYXBwIiwiY2hlY2tBcHBSZWFkeSIsImNoZWNrUmVhZHkiLCJ1c2VySW5mbyIsInJlZmVyIiwidGhlbiIsInd4IiwiaGlkZUxvYWRpbmciLCJjb25zb2xlIiwibG9nIiwicGFzc3BvcnREYXRhIiwic2Vzc2lvbiIsImlkIiwibW9iaWxlIiwibG9naW5zIiwiaSIsImxlbmd0aCIsImxvZ2luIiwidHlwZSIsImxvZ2luSWQiLCJhcHBPcHRpb25zIiwid2hlblNoYXJlZCIsIiRhcHBseSIsIndoZW5BcHBSZWFkeSIsImNhdGNoIiwicmVuZGVyRXJyb3IiLCJlcnJvciIsImUiLCJuYW1lIiwibmF2aWdhdGVUbyIsInVybCIsInNob3dNb2RhbCIsInRpdGxlIiwiY29udGVudCIsInNob3dDYW5jZWwiLCJjb25maXJtVGV4dCIsImNvbmZpcm1Db2xvciIsImNvbXBsZXRlIiwicmVzIiwib3BlblNldHRpbmciLCJzdWNjZXNzIiwiY2FuY2VsVGV4dCIsInNlbGYiLCJ3eExvZ2luIiwibmF2aWdhdGVCYWNrIiwibWVzc2FnZSIsInNob3dMb2FkaW5nIiwid2hlbkFwcFJlYWR5U2hvdyIsInRpbWVTdHIiLCJkYXRhT25lIiwic3BsaXQiLCJkYXRhVHdvIiwiZGF0YVRocmVlIiwibmV3VGltZVN0ciIsInVwZGF0ZVNoYXJlTWVudSIsIndpdGhTaGFyZVRpY2tldCIsInBhZ2VzIiwiZ2V0Q3VycmVudFBhZ2VzIiwiY3VycmVudFBhZ2UiLCJjdXJyZW50VXNlcklkIiwicXVlcnkiLCJyb3V0ZSIsInBhdGgiLCJlbmNvZGVVUklDb21wb25lbnQiLCJmb3J3YXJkIiwiZmFpbCIsInJlZmVyZXIiLCJjcmVhdGUiLCJhY3Rpb24iLCJmZXRjaERhdGFQcm9taXNlIiwicGFyYW1zIiwiaW5kZXhPZiIsImRhdGFVcmwiLCJ2ZXJzaW9uSW5mbyIsImRldmljZSIsInBsYXRmb3JtIiwidmVyc2lvbiIsInJlZGlyZWN0VG8iLCJpdGVtIiwiZGVmYXVsdE9wdGlvbnMiLCJhYnN0cmFjdHNMZW5ndGgiLCJ0YWdzTGVuZ3RoIiwidGl0bGVIVE1MIiwiYWJzdHJhY3RzSFRNTCIsIk9iamVjdCIsImFzc2lnbiIsImh0bWxOb2RlcyIsIl9tYWtlSFRNTE5vZGUiLCJ0aXRsZU5vZGVzIiwidGl0bGVfemgiLCJ0aXRsZVRyYW5zbGF0ZU5vZGVzIiwidGl0bGVUcmFuc2xhdGUiLCJhYnN0cmFjdHMiLCJhYnN0cmFjdHNOb2RlcyIsInN1YnN0cmluZyIsImFtb3VudCIsImFtb3VudERlc2MiLCJmb3JtYXROdW1iZXIiLCJ0aXRsZURlc2MiLCJ5ZWFyIiwicGluYW1lIiwib3JnbmFtZSIsInRpdGxlRGVzY05vZGVzIiwia2V5d29yZHMiLCJ0YWdzIiwiX21ha2VBcnJheXMiLCJmb3JFYWNoIiwidGFnIiwic2xpY2UiLCJuIiwidG9GaXhlZCIsInJlcGxhY2UiLCJjIiwiYSIsInR4dCIsInNwbGl0cyIsInJldCIsImFycmF5IiwicHVzaCIsIm1heExlbmd0aCIsIm5vZGVzIiwidGV4dCIsImluZGV4IiwidG1wMSIsInRtcDIiLCJhdHRycyIsInN0eWxlIiwiY2hpbGRyZW4iLCJpc284NjAxIiwicGF0dGVybiIsIndlcHkiLCJtaXhpbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7OytlQUZBOzs7QUFHQTtJQUNxQkEsUzs7Ozs7Ozs7Ozs7Ozs7Z01BRWpCQyxJLEdBQU87QUFDSDtBQUNBQyxzQkFBVSxLQUZQO0FBR0hDLGtCQUFNLEVBSEgsRUFHTztBQUNWQyxzQkFBVSxJQUpQLEVBSWE7QUFDaEJDLG9CQUFRLEVBTEwsRUFLUztBQUNaQyx5QkFBYSxLQU5WO0FBT0hDLHFCQUFTLEVBUE4sQ0FPVTtBQVBWLFM7O0FBRFA7Ozs7O2lDQVVTO0FBQ0wsaUJBQUtDLEdBQUwsR0FBV0EsYUFBWDtB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QUFVLENBQ047QUFDSTdHLGtDQUFNLE1BRFY7QUFFSXVHLGtDQUFNRSxPQUFPO0FBRmpCLHlCQURNO0FBTEMscUJBQWY7QUFZQSx3QkFBSUMsS0FBSzVHLE1BQUwsR0FBYyxDQUFsQixFQUFxQjtBQUNqQkEsa0NBQVU0RyxLQUFLNUcsTUFBZjtBQUNBLDRCQUFJdUcsWUFBWSxDQUFaLElBQWlCdkcsU0FBU3VHLFNBQTlCLEVBQXlDO0FBQ3JDakMsc0NBQVVnQyxJQUFWLENBQWU7QUFDWHBHLHNDQUFNLE1BREs7QUFFWHVHLHNDQUNJRyxLQUFLOUIsU0FBTCxDQUNJOEIsS0FBSzVHLE1BQUwsR0FBY0EsTUFBZCxHQUF1QnVHLFNBRDNCLElBRUk7QUFMRyw2QkFBZjtBQU9ILHlCQVJELE1BUU87QUFDSGpDLHNDQUFVZ0MsSUFBVixDQUFlLEVBQUVwRyxNQUFNLE1BQVIsRUFBZ0J1RyxNQUFNRyxJQUF0QixFQUFmO0FBQ0g7QUFDSjtBQUNELHdCQUFJTCxZQUFZLENBQVosSUFBaUJ2RyxTQUFTdUcsU0FBOUIsRUFBeUM7QUFDckNqQyxrQ0FBVWdDLElBQVYsQ0FBZSxFQUFFcEcsTUFBTSxNQUFSLEVBQWdCdUcsTUFBTSxLQUF0QixFQUFmO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNBLG1CQUFPbkMsU0FBUDtBQUNIOzs7b0NBQ1cwQyxPLEVBQWlDO0FBQUEsZ0JBQXhCQyxPQUF3Qix1RUFBZCxZQUFjOztBQUN6QztBQUNBLG1CQUFPRCxRQUFRbEMsU0FBUixDQUFrQixDQUFsQixFQUFxQmtDLFFBQVF6RCxPQUFSLENBQWdCLEdBQWhCLENBQXJCLENBQVA7QUFDSDs7OztFQTlaa0MyRCxlQUFLQyxLOztrQkFBdkIzSSxTIiwiZmlsZSI6InBhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgd3ggZ2V0Q3VycmVudFBhZ2VzICovXHJcbmltcG9ydCB3ZXB5IGZyb20gJ3dlcHknO1xyXG5pbXBvcnQgYXBwIGZyb20gJy4uL2xpYi9hcHAnO1xyXG4vLyDmr4/kuKrpobXpnaLpg73nu6fmib/lroPvvIzlj6/ku6Xlrp7njrDkuIDkupvlhazlhbHnmoTmlrnms5VcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFnZU1peGluIGV4dGVuZHMgd2VweS5taXhpbiB7XHJcbiAgICAvLyDlhazlhbHnmoTmlbDmja5cclxuICAgIGRhdGEgPSB7XHJcbiAgICAgICAgLy8g5YWs5YWx55qE5LiA5Lqb5Y+Y6YePXHJcbiAgICAgICAgbG9hZFVzZXI6IGZhbHNlLFxyXG4gICAgICAgIHVzZXI6IHt9LCAvLyDnlKjmiLfkv6Hmga9cclxuICAgICAgICBwYXNzcG9ydDogbnVsbCwgLy8gc2Vzc2lvbklkXHJcbiAgICAgICAgY29uZmlnOiB7fSwgLy8g5bqU55So55qE6YWN572u77yM5b+F6aG75pyJXHJcbiAgICAgICAgbG9hZE9wdGlvbnM6IGZhbHNlLFxyXG4gICAgICAgIG9wdGlvbnM6IHt9LCAvLyDkuKrkurrljJblj4LmlbBcclxuICAgIH07XHJcbiAgICBvblNob3coKSB7XHJcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XHJcbiAgICAgICAgdGhpcy5jaGVja0FwcFJlYWR5KCk7XHJcbiAgICB9XHJcbiAgICBjaGVja0FwcFJlYWR5KCkge1xyXG4gICAgICAgIC8vIHd4LnNob3dMb2FkaW5nKHsgdGl0bGU6ICfor7vlj5bmlbDmja4uLi4nIH0pO1xyXG4gICAgICAgIGFwcFxyXG4gICAgICAgICAgICAuY2hlY2tSZWFkeSh7XHJcbiAgICAgICAgICAgICAgICB1c2VyOiB0aGlzLmxvYWRVc2VyLFxyXG4gICAgICAgICAgICAgICAgY29uZmlnOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdXNlckluZm86IHRydWUsXHJcbiAgICAgICAgICAgICAgICByZWZlcjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IHRoaXMubG9hZE9wdGlvbnNcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICB3eC5oaWRlTG9hZGluZygpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2FwcCBkYXRhOicsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEucGFzc3BvcnREYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51c2VyID0gZGF0YS5wYXNzcG9ydERhdGEudXNlcjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhc3Nwb3J0ID0gZGF0YS5wYXNzcG9ydERhdGEuc2Vzc2lvbi5pZDtcclxuICAgICAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOajgOafpeaYr+WQpue7keWumuS6huaJi+aculxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtb2JpbGUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsb2dpbnMgPSBkYXRhLnBhc3Nwb3J0RGF0YS51c2VyLmxvZ2lucztcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxvZ2lucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbG9naW4gPSBsb2dpbnNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb2dpbi50eXBlID09PSAnbW9iaWxlJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9iaWxlID0gbG9naW4ubG9naW5JZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtb2JpbGUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXIubW9iaWxlID0gbW9iaWxlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWcgPSBkYXRhLmNvbmZpZztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmFwcE9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBkYXRhLmFwcE9wdGlvbnM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5yZWZlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2hlblNoYXJlZChkYXRhLnJlZmVyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndoZW5BcHBSZWFkeSgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyRXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJlbmRlckVycm9yKGUpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnZXJyb3I6JywgZSk7XHJcbiAgICAgICAgaWYgKGUubmFtZSA9PT0gJ3VzZXJfbG9naW4nKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZWRpcmVjdCB0byBsb2dpbiBwYWdlJyk7XHJcbiAgICAgICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3BhZ2VzL2xvZ2luJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy8gd3gubmF2aWdhdGVUbyh7dXJsOiAnL3BhZ2VzL2xvZ2luJ30pO1xyXG4gICAgICAgICAgICAvLyB0aGlzLnd4TG9naW4oKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZS5uYW1lID09PSAndXNlcmluZm9fcmVqZWN0JyB8fCBlLm5hbWUgPT09ICd1c2VyaW5mb19mYWlsJykge1xyXG4gICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICfnmbvlvZXpnIDopoHmjojmnYMnLFxyXG4gICAgICAgICAgICAgICAgY29udGVudDogJ+aCqOmcgOimgeaOiOadg+W6lOeUqOiDveiuv+mXrueUqOaIt+S/oeaBrycsXHJcbiAgICAgICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpcm1UZXh0OiAn5Y676K6+572uJyxcclxuICAgICAgICAgICAgICAgIGNvbmZpcm1Db2xvcjogJyMwMzdhZDgnLFxyXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHd4Lm9wZW5TZXR0aW5nKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOS8mumHjeaWsOiwg+eUqG9uU2hvdygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGUubmFtZSA9PT0gJ3Bhc3Nwb3J0IGlzIGludmFsaWQnKSB7XHJcbiAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ+eZu+W9leW3sui/h+acnycsXHJcbiAgICAgICAgICAgICAgICBjb250ZW50OiAn5oKo6ZyA6KaB6YeN5paw5ZCv5Yqo5bCP56iL5bqPJyxcclxuICAgICAgICAgICAgICAgIGNhbmNlbFRleHQ6ICflj5bmtognLFxyXG4gICAgICAgICAgICAgICAgY29uZmlybVRleHQ6ICflpb3nmoQnLFxyXG4gICAgICAgICAgICAgICAgY29uZmlybUNvbG9yOiAnIzAzN2FkOCcsXHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi53eExvZ2luKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChlLm5hbWUgPT09ICdORVRXT1JLX0VSUk9SJykge1xyXG4gICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICfnvZHnu5zov57mjqUnLFxyXG4gICAgICAgICAgICAgICAgY29udGVudDogJ+e9kee7nOWtmOWcqOmXrumimCzml6Dms5Xor7vlj5bmlbDmja4s6K+35qOA5p+l572R57uc6K6+572uJyxcclxuICAgICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlybVRleHQ6ICfph43or5UnLFxyXG4gICAgICAgICAgICAgICAgY29uZmlybUNvbG9yOiAnIzAzN2FkOCcsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB3eC5uYXZpZ2F0ZUJhY2soKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgdGl0bGU6ICflh7rplJnkuoYnLFxyXG4gICAgICAgICAgICBjb250ZW50OiAnWycgKyBlLm5hbWUgKyAnXScgKyBlLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlLFxyXG4gICAgICAgICAgICBjb25maXJtVGV4dDogJ+mHjeivlScsXHJcbiAgICAgICAgICAgIGNvbmZpcm1Db2xvcjogJyMwMzdhZDgnLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgIC8vIHd4Lm5hdmlnYXRlQmFjaygpO1xyXG4gICAgICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdVbmhhbmRsZSBlcnJvcjonLCBlKTtcclxuICAgIH1cclxuICAgIHd4TG9naW4oKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHd4LnNob3dMb2FkaW5nKHsgdGl0bGU6ICfor7vlj5bnlKjmiLfkv6Hmga8uLi4nIH0pO1xyXG4gICAgICAgIGFwcFxyXG4gICAgICAgICAgICAud3hMb2dpbigpXHJcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd3eExvZ2luIG9rOicsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5jaGVja0FwcFJlYWR5KCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChlID0+IHtcclxuICAgICAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnd3hMb2dpbiBlcnJvcjonKTtcclxuICAgICAgICAgICAgICAgIHNlbGYucmVuZGVyRXJyb3IoZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgd2hlbkFwcFJlYWR5KCkge1xyXG4gICAgICAgIC8vXHJcblxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgdGhpcy53aGVuQXBwUmVhZHlTaG93KCk7XHJcbiAgICB9XHJcbiAgICB3aGVuQXBwUmVhZHlTaG93KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCd3aGVuQXBwUmVhZHlTaG93Li4uJyk7XHJcbiAgICB9XHJcbiAgICB0aW1lKHRpbWVTdHIpIHtcclxuICAgICAgICB2YXIgZGF0YU9uZSA9IHRpbWVTdHIuc3BsaXQoJ1QnKVswXTtcclxuICAgICAgICB2YXIgZGF0YVR3byA9IHRpbWVTdHIuc3BsaXQoJ1QnKVsxXTtcclxuICAgICAgICB2YXIgZGF0YVRocmVlID0gZGF0YVR3by5zcGxpdCgnKycpWzBdO1xyXG4gICAgICAgIHZhciBuZXdUaW1lU3RyID0gZGF0YU9uZSArICcgJyArIGRhdGFUaHJlZTtcclxuICAgICAgICByZXR1cm4gbmV3VGltZVN0cjtcclxuICAgIH1cclxuICAgIC8qKiDlvZPpobXpnaLlj5Hotbfovazlj5EgKi9cclxuICAgIHdoZW5BcHBTaGFyZShvcHRpb25zKSB7XHJcbiAgICAgICAgLy8g6ZyA6KaB5b6u5L+h5bim5LiKdGlja2V0c+S/oeaBr1xyXG4gICAgICAgIHd4LnVwZGF0ZVNoYXJlTWVudSh7IHdpdGhTaGFyZVRpY2tldDogdHJ1ZSwgc3VjY2VzcygpIHt9IH0pO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGFnZXMgPSBnZXRDdXJyZW50UGFnZXMoKTsgLy8g6I635Y+W5Yqg6L2955qE6aG16Z2iXHJcbiAgICAgICAgdmFyIGN1cnJlbnRQYWdlID0gcGFnZXNbcGFnZXMubGVuZ3RoIC0gMV07IC8vIOiOt+WPluW9k+WJjemhtemdoueahOWvueixoVxyXG4gICAgICAgIHZhciBjdXJyZW50VXNlcklkID0gJyc7XHJcbiAgICAgICAgaWYgKHRoaXMudXNlciAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRVc2VySWQgPSB0aGlzLnVzZXIuaWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBxdWVyeSA9IG9wdGlvbnMucXVlcnkgfHwgJyc7XHJcbiAgICAgICAgdmFyIHVybCA9XHJcbiAgICAgICAgICAgICcvJyArXHJcbiAgICAgICAgICAgIGN1cnJlbnRQYWdlLnJvdXRlICtcclxuICAgICAgICAgICAgJz9yZWZlcmVySWQ9JyArXHJcbiAgICAgICAgICAgIGN1cnJlbnRVc2VySWQgK1xyXG4gICAgICAgICAgICAnJicgK1xyXG4gICAgICAgICAgICBxdWVyeTsgLy8g5b2T5YmN6aG16Z2idXJsXHJcbiAgICAgICAgY29uc29sZS5sb2coJ3VybD0nICsgdXJsICsgJyxvcHRpb25zPScsIG9wdGlvbnMpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHRpdGxlOiBvcHRpb25zLnRpdGxlIHx8ICcnLFxyXG4gICAgICAgICAgICBwYXRoOiB1cmwsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgICAgICAgICAgLy8g6L2s5Y+R5oiQ5YqfXHJcbiAgICAgICAgICAgICAgICBzZWxmLndoZW5TaGFyZWQoXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGVuY29kZVVSSUNvbXBvbmVudCh1cmwpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3J3YXJkOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB0cnVlXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmYWlsOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgIC8vIOi9rOWPkeWksei0pVxyXG4gICAgICAgICAgICAgICAgc2VsZi53aGVuU2hhcmVkKFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBlbmNvZGVVUklDb21wb25lbnQodXJsKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yd2FyZDogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHRydWVcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgd2hlblNoYXJlZChyZWZlcmVyLCBjcmVhdGUpIHtcclxuICAgICAgICBpZiAoY3JlYXRlKSB7XHJcbiAgICAgICAgICAgIHJlZmVyZXIuYWN0aW9uID0gJ2FkZCc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVmZXJlci5hY3Rpb24gPSAnbG9vayc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCd3aGVuU2hhcmVkOicsIHJlZmVyZXIpO1xyXG4gICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgncmVzdGFua1JlZmVyZXIuZG8nLCByZWZlcmVyLCB7XHJcbiAgICAgICAgICAgIHNob3dMb2FkaW5nOiBmYWxzZVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZWZlcmVyOicsIGRhdGEpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZWZlcmVyIGVycm9yOicsIGVycm9yKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0g5omA5pyJ6aG16Z2i55qE5YWs5YWx5Ye95pWwIC0tLS0tLS0tLS0tLVxyXG4gICAgLy8g5Li65omA5pyJ6aG16Z2i5o+Q5L6b57uf5LiA55qE5pWw5o2u6I635Y+W5pa55rOVXHJcbiAgICBmZXRjaERhdGFQcm9taXNlKHVybCwgcGFyYW1zLCBvcHRpb25zID0ge30pIHtcclxuICAgICAgICBpZiAodXJsLmluZGV4T2YoJ2h0dHAnKSAhPT0gMCkge1xyXG4gICAgICAgICAgICB1cmwgPSB0aGlzLmNvbmZpZy5kYXRhVXJsICsgdXJsO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIOWcqOaJgOacieivt+axgumHjOWKoOWFpXVzZXJJZFxyXG4gICAgICAgIGlmICh0aGlzLnBhc3Nwb3J0KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGlzLnBhc3Nwb3J0JywgdGhpcy5wYXNzcG9ydCk7XHJcbiAgICAgICAgICAgIHBhcmFtcy5wYXNzcG9ydCA9IHRoaXMucGFzc3BvcnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOWinuWKoOeoi+W6j+S/oeaBr1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZyAmJiB0aGlzLmNvbmZpZy52ZXJzaW9uSW5mbykge1xyXG4gICAgICAgICAgICBwYXJhbXMuZGV2aWNlID0gdGhpcy5jb25maWcudmVyc2lvbkluZm8uZGV2aWNlO1xyXG4gICAgICAgICAgICBwYXJhbXMucGxhdGZvcm0gPSB0aGlzLmNvbmZpZy52ZXJzaW9uSW5mby5wbGF0Zm9ybTtcclxuICAgICAgICAgICAgcGFyYW1zLnZlcnNpb24gPSB0aGlzLmNvbmZpZy52ZXJzaW9uSW5mby52ZXJzaW9uO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDmmL7npLrliqDovb3mlbDmja7mj5DnpLpcclxuICAgICAgICBvcHRpb25zLnNob3dMb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gYXBwLmZldGNoRGF0YVByb21pc2UodXJsLCBwYXJhbXMsIG9wdGlvbnMpO1xyXG4gICAgfVxyXG4gICAgLy8g5Y+C5pWw6ZSZ6K+v5rKh5pyJaWTvvIzot7PovazliLDmkJzntKJcclxuICAgIHdoZW5QYXJhbUVycm9yKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdvbiBwYXJhbWV0ZXIgZXJyb3InKTtcclxuICAgICAgICB3eC5yZWRpcmVjdFRvKHsgdXJsOiAnL3BhZ2VzL2luZGV4JyB9KTtcclxuICAgIH1cclxuICAgIC8vIOWvuWFydGljbGXnmoTmoLzlvI/ov5vooYzlpITnkIZcclxuICAgIHByb2Nlc3NBcnRpY2xlKGl0ZW0sIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgICAgIHZhciBkZWZhdWx0T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgYWJzdHJhY3RzTGVuZ3RoOiAxMDAsXHJcbiAgICAgICAgICAgIHRhZ3NMZW5ndGg6IDUsXHJcbiAgICAgICAgICAgIHRpdGxlSFRNTDogZmFsc2UsIC8vIOagh+mimOaYr+WQpuS4ukhUTUzmoLzlvI9cclxuICAgICAgICAgICAgYWJzdHJhY3RzSFRNTDogZmFsc2VcclxuICAgICAgICB9O1xyXG4gICAgICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XHJcbiAgICAgICAgLy8g5a+55qCH6aKY6L+b6KGM566A5Y2V55qESFRNTOagvOW8j+WMluWkhOeQhlxyXG4gICAgICAgIGlmIChvcHRpb25zLnRpdGxlSFRNTCkge1xyXG4gICAgICAgICAgICBsZXQgaHRtbE5vZGVzID0gdGhpcy5fbWFrZUhUTUxOb2RlKGl0ZW0udGl0bGUsIDApO1xyXG4gICAgICAgICAgICBpdGVtLnRpdGxlTm9kZXMgPSBodG1sTm9kZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOWkhOeQhue/u+ivkee7k+aenFxyXG4gICAgICAgIC8vIGl0ZW0udGl0bGVfemggPSBpdGVtLnRpdGxlO1xyXG4gICAgICAgIGlmIChpdGVtLnRpdGxlX3poICYmIGl0ZW0udGl0bGVfemgubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBpdGVtLnRpdGxlX3poID0gJ+ivkeaWhzonICsgaXRlbS50aXRsZV96aDtcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMudGl0bGVIVE1MKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaHRtbE5vZGVzID0gdGhpcy5fbWFrZUhUTUxOb2RlKGl0ZW0udGl0bGVfemgsIDApO1xyXG4gICAgICAgICAgICAgICAgaXRlbS50aXRsZVRyYW5zbGF0ZU5vZGVzID0gaHRtbE5vZGVzO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbS50aXRsZVRyYW5zbGF0ZSA9IGl0ZW0udGl0bGVfemg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g5pGY6KaB5aSq5aSa5LqG77yM5Y+q5Y+WMTAw5Liq5a2XXHJcbiAgICAgICAgaWYgKGl0ZW0uYWJzdHJhY3RzKSB7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmFic3RyYWN0c0hUTUwpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uYWJzdHJhY3RzTm9kZXMgPSB0aGlzLl9tYWtlSFRNTE5vZGUoXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5hYnN0cmFjdHMsXHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5hYnN0cmFjdHNMZW5ndGhcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLmFic3RyYWN0c0xlbmd0aCA+IDAgJiZcclxuICAgICAgICAgICAgICAgIGl0ZW0uYWJzdHJhY3RzLmxlbmd0aCA+IG9wdGlvbnMuYWJzdHJhY3RzTGVuZ3RoXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5hYnN0cmFjdHMgPVxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uYWJzdHJhY3RzLnN1YnN0cmluZygwLCBvcHRpb25zLmFic3RyYWN0c0xlbmd0aCkgK1xyXG4gICAgICAgICAgICAgICAgICAgICcuLi4nO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0uYWJzdHJhY3RzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5hYnN0cmFjdHMgPSAn5pqC5peg5pGY6KaBJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpdGVtLmFic3RyYWN0cyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaXRlbS5hYnN0cmFjdHMgPSAn5pqC5peg5pGY6KaBJztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g6aG555uu6YeR6aKdXHJcbiAgICAgICAgaWYgKGl0ZW0uYW1vdW50ID4gMCkge1xyXG4gICAgICAgICAgICBpdGVtLmFtb3VudERlc2MgPSB0aGlzLmZvcm1hdE51bWJlcihpdGVtLmFtb3VudCAvIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXRlbS50aXRsZURlc2MgPVxyXG4gICAgICAgICAgICAoaXRlbS55ZWFyICYmIGl0ZW0ueWVhci5sZW5ndGggPiAwID8gaXRlbS55ZWFyICsgJywnIDogJycpICtcclxuICAgICAgICAgICAgKGl0ZW0ucGluYW1lICYmIGl0ZW0ucGluYW1lLmxlbmd0aCA+IDAgPyBpdGVtLnBpbmFtZSArICcsJyA6ICcnKSArXHJcbiAgICAgICAgICAgIChpdGVtLm9yZ25hbWUgJiYgaXRlbS5vcmduYW1lLmxlbmd0aCA/IGl0ZW0ub3JnbmFtZSArICcsJyA6ICcnKTtcclxuICAgICAgICAvLyDljrvmjonmnIDlkI7kuIDkuKrvvIxcclxuICAgICAgICBpdGVtLnRpdGxlRGVzYyA9IGl0ZW0udGl0bGVEZXNjLnN1YnN0cmluZygwLCBpdGVtLnRpdGxlRGVzYy5sZW5ndGggLSAxKTtcclxuICAgICAgICBpdGVtLnRpdGxlRGVzY05vZGVzID0gdGhpcy5fbWFrZUhUTUxOb2RlKFxyXG4gICAgICAgICAgICBpdGVtLnRpdGxlRGVzYyxcclxuICAgICAgICAgICAgMFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgLy8g6aG555uu5YWz6ZSu5a2XLOWkhOeQhuWIhumalOespuWPt++8jOacjeWKoeWZqOerr+acquWBmuWkhOeQhlxyXG4gICAgICAgIGlmIChpdGVtLmtleXdvcmRzICYmIGl0ZW0ua2V5d29yZHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB2YXIgdGFncyA9IHRoaXMuX21ha2VBcnJheXMoaXRlbS5rZXl3b3Jkcyk7XHJcbiAgICAgICAgICAgIC8vIC0tLS0tLS0tIGNvbnNvbGUubG9nKFwidGFncyBpcyBcIix0YWdzKTtcclxuICAgICAgICAgICAgaWYgKHRhZ3MubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgdGFncy5mb3JFYWNoKHRhZyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhZy5sZW5ndGggPiAxMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWcgPSB0YWcuc3Vic3RyaW5nKDAsIDEwKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vIOWPquWPluWJjeWHoOS4qlxyXG4gICAgICAgICAgICAgICAgdGFncyA9IHRhZ3Muc2xpY2UoMCwgb3B0aW9ucy50YWdzTGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICBpZiAodGFncy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS50YWdzID0gdGFncztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaXRlbSB0YWdzOlwiLCB0YWdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZvcm1hdE51bWJlcihuKSB7XHJcbiAgICAgICAgcmV0dXJuIG4udG9GaXhlZCgwKS5yZXBsYWNlKC8uL2csIGZ1bmN0aW9uKGMsIGksIGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGkgPiAwICYmIGMgIT09ICcuJyAmJiAoYS5sZW5ndGggLSBpKSAlIDMgPT09IDAgPyAnLCcgKyBjIDogYztcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIF9tYWtlQXJyYXlzKHR4dCwgc3BsaXRzKSB7XHJcbiAgICAgICAgLy8g57uf5LiA6YO96L2s5o2i5oiQ56ys5LiA5Liqc3BsaXTvvIznhLblkI7nu5/kuIBzcGxpdFxyXG4gICAgICAgIHR4dCA9IHR4dC5yZXBsYWNlKC86L2csICc7Jyk7XHJcbiAgICAgICAgdHh0ID0gdHh0LnJlcGxhY2UoL++8my9nLCAnOycpO1xyXG4gICAgICAgIHR4dCA9IHR4dC5yZXBsYWNlKC9eXFxzKnxcXHMqJC9nLCAnJyk7IC8vIOWOu+aOieepuuagvFxyXG4gICAgICAgIHZhciByZXQgPSBbXTtcclxuICAgICAgICB2YXIgYXJyYXkgPSB0eHQuc3BsaXQoJzsnKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChhcnJheVtpXS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXQucHVzaChhcnJheVtpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuICAgIF9tYWtlSFRNTE5vZGUodHh0LCBtYXhMZW5ndGgpIHtcclxuICAgICAgICB2YXIgaHRtbE5vZGVzID0gW107XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IDA7XHJcbiAgICAgICAgdmFyIG5vZGVzID0gdHh0LnNwbGl0KFwiPHNwYW4gY2xhc3M9J3JlZCc+XCIpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHRleHQgPSBub2Rlc1tpXTtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGV4dC5pbmRleE9mKCc8L3NwYW4+Jyk7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA8IDApIHtcclxuICAgICAgICAgICAgICAgIGxlbmd0aCArPSB0ZXh0Lmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGlmIChtYXhMZW5ndGggPiAwICYmIGxlbmd0aCA+IG1heExlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGh0bWxOb2Rlcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dC5zdWJzdHJpbmcoMCwgdHh0Lmxlbmd0aCAtIGxlbmd0aCArIG1heExlbmd0aCkgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJy4uLidcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbE5vZGVzLnB1c2goeyB0eXBlOiAndGV4dCcsIHRleHQ6IHRleHQgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdG1wMSA9IHRleHQuc3Vic3RyaW5nKDAsIGluZGV4KTtcclxuICAgICAgICAgICAgICAgIHZhciB0bXAyID0gdGV4dC5zdWJzdHJpbmcoaW5kZXggKyAnPC9zcGFuPicubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIGxlbmd0aCArPSB0bXAxLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGh0bWxOb2Rlcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnc3BhbicsXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6ICdjb2xvcjogcmVkOydcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IHRtcDEgKyAnJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodG1wMi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoICs9IHRtcDIubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXhMZW5ndGggPiAwICYmIGxlbmd0aCA+IG1heExlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sTm9kZXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndGV4dCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRtcDIuc3Vic3RyaW5nKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bXAyLmxlbmd0aCAtIGxlbmd0aCArIG1heExlbmd0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgKyAnLi4uJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sTm9kZXMucHVzaCh7IHR5cGU6ICd0ZXh0JywgdGV4dDogdG1wMiB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobWF4TGVuZ3RoID4gMCAmJiBsZW5ndGggPiBtYXhMZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBodG1sTm9kZXMucHVzaCh7IHR5cGU6ICd0ZXh0JywgdGV4dDogJy4uLicgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0eHQgaXM6XCIsIHR4dCwgaHRtbE5vZGVzKTtcclxuICAgICAgICByZXR1cm4gaHRtbE5vZGVzO1xyXG4gICAgfVxyXG4gICAgdG9Mb2NhbERhdGUoaXNvODYwMSwgcGF0dGVybiA9ICd5eXl5LU1NLWRkJykge1xyXG4gICAgICAgIC8vIOivleS6huWHoOS4quW6k+mDveS4jeihjO+8jOWcqOaJi+acuuS4iuS8muWHuumUmVxyXG4gICAgICAgIHJldHVybiBpc284NjAxLnN1YnN0cmluZygwLCBpc284NjAxLmluZGV4T2YoJ1QnKSk7XHJcbiAgICB9XHJcbn1cclxuIl19