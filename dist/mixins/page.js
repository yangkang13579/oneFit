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

                    // this.passport = data.passportData.session.id;
                    _this2.passport = 'rdbbpj4lvzhcbrqqre0asz3cftc45piu';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2UuanMiXSwibmFtZXMiOlsiUGFnZU1peGluIiwiZGF0YSIsImxvYWRVc2VyIiwidXNlciIsInBhc3Nwb3J0IiwiY29uZmlnIiwibG9hZE9wdGlvbnMiLCJvcHRpb25zIiwiYXBwIiwiY2hlY2tBcHBSZWFkeSIsImNoZWNrUmVhZHkiLCJ1c2VySW5mbyIsInJlZmVyIiwidGhlbiIsInd4IiwiaGlkZUxvYWRpbmciLCJjb25zb2xlIiwibG9nIiwicGFzc3BvcnREYXRhIiwibW9iaWxlIiwibG9naW5zIiwiaSIsImxlbmd0aCIsImxvZ2luIiwidHlwZSIsImxvZ2luSWQiLCJhcHBPcHRpb25zIiwid2hlblNoYXJlZCIsIiRhcHBseSIsIndoZW5BcHBSZWFkeSIsImNhdGNoIiwicmVuZGVyRXJyb3IiLCJlcnJvciIsImUiLCJuYW1lIiwibmF2aWdhdGVUbyIsInVybCIsInNob3dNb2RhbCIsInRpdGxlIiwiY29udGVudCIsInNob3dDYW5jZWwiLCJjb25maXJtVGV4dCIsImNvbmZpcm1Db2xvciIsImNvbXBsZXRlIiwicmVzIiwib3BlblNldHRpbmciLCJzdWNjZXNzIiwiY2FuY2VsVGV4dCIsInNlbGYiLCJ3eExvZ2luIiwibmF2aWdhdGVCYWNrIiwibWVzc2FnZSIsInNob3dMb2FkaW5nIiwid2hlbkFwcFJlYWR5U2hvdyIsInRpbWVTdHIiLCJkYXRhT25lIiwic3BsaXQiLCJkYXRhVHdvIiwiZGF0YVRocmVlIiwibmV3VGltZVN0ciIsInVwZGF0ZVNoYXJlTWVudSIsIndpdGhTaGFyZVRpY2tldCIsInBhZ2VzIiwiZ2V0Q3VycmVudFBhZ2VzIiwiY3VycmVudFBhZ2UiLCJjdXJyZW50VXNlcklkIiwiaWQiLCJxdWVyeSIsInJvdXRlIiwicGF0aCIsImVuY29kZVVSSUNvbXBvbmVudCIsImZvcndhcmQiLCJmYWlsIiwicmVmZXJlciIsImNyZWF0ZSIsImFjdGlvbiIsImZldGNoRGF0YVByb21pc2UiLCJwYXJhbXMiLCJpbmRleE9mIiwiZGF0YVVybCIsInZlcnNpb25JbmZvIiwiZGV2aWNlIiwicGxhdGZvcm0iLCJ2ZXJzaW9uIiwicmVkaXJlY3RUbyIsIml0ZW0iLCJkZWZhdWx0T3B0aW9ucyIsImFic3RyYWN0c0xlbmd0aCIsInRhZ3NMZW5ndGgiLCJ0aXRsZUhUTUwiLCJhYnN0cmFjdHNIVE1MIiwiT2JqZWN0IiwiYXNzaWduIiwiaHRtbE5vZGVzIiwiX21ha2VIVE1MTm9kZSIsInRpdGxlTm9kZXMiLCJ0aXRsZV96aCIsInRpdGxlVHJhbnNsYXRlTm9kZXMiLCJ0aXRsZVRyYW5zbGF0ZSIsImFic3RyYWN0cyIsImFic3RyYWN0c05vZGVzIiwic3Vic3RyaW5nIiwiYW1vdW50IiwiYW1vdW50RGVzYyIsImZvcm1hdE51bWJlciIsInRpdGxlRGVzYyIsInllYXIiLCJwaW5hbWUiLCJvcmduYW1lIiwidGl0bGVEZXNjTm9kZXMiLCJrZXl3b3JkcyIsInRhZ3MiLCJfbWFrZUFycmF5cyIsImZvckVhY2giLCJ0YWciLCJzbGljZSIsIm4iLCJ0b0ZpeGVkIiwicmVwbGFjZSIsImMiLCJhIiwidHh0Iiwic3BsaXRzIiwicmV0IiwiYXJyYXkiLCJwdXNoIiwibWF4TGVuZ3RoIiwibm9kZXMiLCJ0ZXh0IiwiaW5kZXgiLCJ0bXAxIiwidG1wMiIsImF0dHJzIiwic3R5bGUiLCJjaGlsZHJlbiIsImlzbzg2MDEiLCJwYXR0ZXJuIiwid2VweSIsIm1peGluIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7K2VBRkE7OztBQUdBO0lBQ3FCQSxTOzs7Ozs7Ozs7Ozs7OztnTUFFakJDLEksR0FBTztBQUNIO0FBQ0FDLHNCQUFVLEtBRlA7QUFHSEMsa0JBQU0sRUFISCxFQUdPO0FBQ1ZDLHNCQUFVLElBSlAsRUFJYTtBQUNoQkMsb0JBQVEsRUFMTCxFQUtTO0FBQ1pDLHlCQUFhLEtBTlY7QUFPSEMscUJBQVMsRUFQTixDQU9VO0FBUFYsUzs7QUFEUDs7Ozs7aUNBVVM7QUFDTCxpQkFBS0MsR0FBTCxHQUFXQSxhQUFYO0FBQ0EsaUJBQUtD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QU1FLE9BQU87QUFGakIseUJBRE07QUFMQyxxQkFBZjtBQVlBLHdCQUFJQyxLQUFLN0csTUFBTCxHQUFjLENBQWxCLEVBQXFCO0FBQ2pCQSxrQ0FBVTZHLEtBQUs3RyxNQUFmO0FBQ0EsNEJBQUl3RyxZQUFZLENBQVosSUFBaUJ4RyxTQUFTd0csU0FBOUIsRUFBeUM7QUFDckNqQyxzQ0FBVWdDLElBQVYsQ0FBZTtBQUNYckcsc0NBQU0sTUFESztBQUVYd0csc0NBQ0lHLEtBQUs5QixTQUFMLENBQ0k4QixLQUFLN0csTUFBTCxHQUFjQSxNQUFkLEdBQXVCd0csU0FEM0IsSUFFSTtBQUxHLDZCQUFmO0FBT0gseUJBUkQsTUFRTztBQUNIakMsc0NBQVVnQyxJQUFWLENBQWUsRUFBRXJHLE1BQU0sTUFBUixFQUFnQndHLE1BQU1HLElBQXRCLEVBQWY7QUFDSDtBQUNKO0FBQ0Qsd0JBQUlMLFlBQVksQ0FBWixJQUFpQnhHLFNBQVN3RyxTQUE5QixFQUF5QztBQUNyQ2pDLGtDQUFVZ0MsSUFBVixDQUFlLEVBQUVyRyxNQUFNLE1BQVIsRUFBZ0J3RyxNQUFNLEtBQXRCLEVBQWY7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0EsbUJBQU9uQyxTQUFQO0FBQ0g7OztvQ0FDVzBDLE8sRUFBaUM7QUFBQSxnQkFBeEJDLE9BQXdCLHVFQUFkLFlBQWM7O0FBQ3pDO0FBQ0EsbUJBQU9ELFFBQVFsQyxTQUFSLENBQWtCLENBQWxCLEVBQXFCa0MsUUFBUXpELE9BQVIsQ0FBZ0IsR0FBaEIsQ0FBckIsQ0FBUDtBQUNIOzs7O0VBaGFrQzJELGVBQUtDLEs7O2tCQUF2QjFJLFMiLCJmaWxlIjoicGFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGdsb2JhbCB3eCBnZXRDdXJyZW50UGFnZXMgKi9cclxuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XHJcbmltcG9ydCBhcHAgZnJvbSAnLi4vbGliL2FwcCc7XHJcbi8vIOavj+S4qumhtemdoumDvee7p+aJv+Wug++8jOWPr+S7peWunueOsOS4gOS6m+WFrOWFseeahOaWueazlVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYWdlTWl4aW4gZXh0ZW5kcyB3ZXB5Lm1peGluIHtcclxuICAgIC8vIOWFrOWFseeahOaVsOaNrlxyXG4gICAgZGF0YSA9IHtcclxuICAgICAgICAvLyDlhazlhbHnmoTkuIDkupvlj5jph49cclxuICAgICAgICBsb2FkVXNlcjogZmFsc2UsXHJcbiAgICAgICAgdXNlcjoge30sIC8vIOeUqOaIt+S/oeaBr1xyXG4gICAgICAgIHBhc3Nwb3J0OiBudWxsLCAvLyBzZXNzaW9uSWRcclxuICAgICAgICBjb25maWc6IHt9LCAvLyDlupTnlKjnmoTphY3nva7vvIzlv4XpobvmnIlcclxuICAgICAgICBsb2FkT3B0aW9uczogZmFsc2UsXHJcbiAgICAgICAgb3B0aW9uczoge30sIC8vIOS4quS6uuWMluWPguaVsFxyXG4gICAgfTtcclxuICAgIG9uU2hvdygpIHtcclxuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcclxuICAgICAgICB0aGlzLmNoZWNrQXBwUmVhZHkoKTtcclxuICAgIH1cclxuICAgIGNoZWNrQXBwUmVhZHkoKSB7XHJcbiAgICAgICAgLy8gd3guc2hvd0xvYWRpbmcoeyB0aXRsZTogJ+ivu+WPluaVsOaNri4uLicgfSk7XHJcbiAgICAgICAgYXBwXHJcbiAgICAgICAgICAgIC5jaGVja1JlYWR5KHtcclxuICAgICAgICAgICAgICAgIHVzZXI6IHRoaXMubG9hZFVzZXIsXHJcbiAgICAgICAgICAgICAgICBjb25maWc6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB1c2VySW5mbzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHJlZmVyOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgb3B0aW9uczogdGhpcy5sb2FkT3B0aW9uc1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYXBwIGRhdGE6JywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5wYXNzcG9ydERhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXIgPSBkYXRhLnBhc3Nwb3J0RGF0YS51c2VyO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLnBhc3Nwb3J0ID0gZGF0YS5wYXNzcG9ydERhdGEuc2Vzc2lvbi5pZDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhc3Nwb3J0ID0gJ3JkYmJwajRsdnpoY2JycXFyZTBhc3ozY2Z0YzQ1cGl1J1xyXG4gICAgICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5qOA5p+l5piv5ZCm57uR5a6a5LqG5omL5py6XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1vYmlsZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxvZ2lucyA9IGRhdGEucGFzc3BvcnREYXRhLnVzZXIubG9naW5zO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbG9naW5zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsb2dpbiA9IGxvZ2luc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvZ2luLnR5cGUgPT09ICdtb2JpbGUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2JpbGUgPSBsb2dpbi5sb2dpbklkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vYmlsZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXNlci5tb2JpbGUgPSBtb2JpbGU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5jb25maWcpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZyA9IGRhdGEuY29uZmlnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuYXBwT3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucyA9IGRhdGEuYXBwT3B0aW9ucztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLnJlZmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aGVuU2hhcmVkKGRhdGEucmVmZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMud2hlbkFwcFJlYWR5KCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICB3eC5oaWRlTG9hZGluZygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJFcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyRXJyb3IoZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcjonLCBlKTtcclxuICAgICAgICBpZiAoZS5uYW1lID09PSAndXNlcl9sb2dpbicpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3JlZGlyZWN0IHRvIGxvZ2luIHBhZ2UnKTtcclxuICAgICAgICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvbG9naW4nXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvLyB3eC5uYXZpZ2F0ZVRvKHt1cmw6ICcvcGFnZXMvbG9naW4nfSk7XHJcbiAgICAgICAgICAgIC8vIHRoaXMud3hMb2dpbigpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChlLm5hbWUgPT09ICd1c2VyaW5mb19yZWplY3QnIHx8IGUubmFtZSA9PT0gJ3VzZXJpbmZvX2ZhaWwnKSB7XHJcbiAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ+eZu+W9lemcgOimgeaOiOadgycsXHJcbiAgICAgICAgICAgICAgICBjb250ZW50OiAn5oKo6ZyA6KaB5o6I5p2D5bqU55So6IO96K6/6Zeu55So5oi35L+h5oGvJyxcclxuICAgICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlybVRleHQ6ICfljrvorr7nva4nLFxyXG4gICAgICAgICAgICAgICAgY29uZmlybUNvbG9yOiAnIzAzN2FkOCcsXHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHd4Lm9wZW5TZXR0aW5nKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOS8mumHjeaWsOiwg+eUqG9uU2hvdygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGUubmFtZSA9PT0gJ3Bhc3Nwb3J0IGlzIGludmFsaWQnKSB7XHJcbiAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ+eZu+W9leW3sui/h+acnycsXHJcbiAgICAgICAgICAgICAgICBjb250ZW50OiAn5oKo6ZyA6KaB6YeN5paw5ZCv5Yqo5bCP56iL5bqPJyxcclxuICAgICAgICAgICAgICAgIGNhbmNlbFRleHQ6ICflj5bmtognLFxyXG4gICAgICAgICAgICAgICAgY29uZmlybVRleHQ6ICflpb3nmoQnLFxyXG4gICAgICAgICAgICAgICAgY29uZmlybUNvbG9yOiAnIzAzN2FkOCcsXHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYud3hMb2dpbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZS5uYW1lID09PSAnTkVUV09SS19FUlJPUicpIHtcclxuICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAn572R57uc6L+e5o6lJyxcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICfnvZHnu5zlrZjlnKjpl67popgs5peg5rOV6K+75Y+W5pWw5o2uLOivt+ajgOafpee9kee7nOiuvue9ricsXHJcbiAgICAgICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpcm1UZXh0OiAn6YeN6K+VJyxcclxuICAgICAgICAgICAgICAgIGNvbmZpcm1Db2xvcjogJyMwMzdhZDgnLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHd4Lm5hdmlnYXRlQmFjaygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICB0aXRsZTogJ+WHuumUmeS6hicsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6ICdbJyArIGUubmFtZSArICddJyArIGUubWVzc2FnZSxcclxuICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2UsXHJcbiAgICAgICAgICAgIGNvbmZpcm1UZXh0OiAn6YeN6K+VJyxcclxuICAgICAgICAgICAgY29uZmlybUNvbG9yOiAnIzAzN2FkOCcsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIC8vIHd4Lm5hdmlnYXRlQmFjaygpO1xyXG4gICAgICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdVbmhhbmRsZSBlcnJvcjonLCBlKTtcclxuICAgIH1cclxuICAgIHd4TG9naW4oKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHd4LnNob3dMb2FkaW5nKHsgdGl0bGU6ICfor7vlj5bnlKjmiLfkv6Hmga8uLi4nIH0pO1xyXG4gICAgICAgIGFwcFxyXG4gICAgICAgICAgICAud3hMb2dpbigpXHJcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd3eExvZ2luIG9rOicsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5jaGVja0FwcFJlYWR5KCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChlID0+IHtcclxuICAgICAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnd3hMb2dpbiBlcnJvcjonKTtcclxuICAgICAgICAgICAgICAgIHNlbGYucmVuZGVyRXJyb3IoZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgd2hlbkFwcFJlYWR5KCkge1xyXG4gICAgICAgIC8vXHJcblxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgdGhpcy53aGVuQXBwUmVhZHlTaG93KCk7XHJcbiAgICB9XHJcbiAgICB3aGVuQXBwUmVhZHlTaG93KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCd3aGVuQXBwUmVhZHlTaG93Li4uJyk7XHJcbiAgICB9XHJcbiAgICB0aW1lKHRpbWVTdHIpIHtcclxuICAgICAgICB2YXIgZGF0YU9uZSA9IHRpbWVTdHIuc3BsaXQoJ1QnKVswXTtcclxuICAgICAgICB2YXIgZGF0YVR3byA9IHRpbWVTdHIuc3BsaXQoJ1QnKVsxXTtcclxuICAgICAgICB2YXIgZGF0YVRocmVlID0gZGF0YVR3by5zcGxpdCgnKycpWzBdO1xyXG4gICAgICAgIHZhciBuZXdUaW1lU3RyID0gZGF0YU9uZSArICcgJyArIGRhdGFUaHJlZTtcclxuICAgICAgICByZXR1cm4gbmV3VGltZVN0cjtcclxuICAgIH1cclxuICAgIC8qKiDlvZPpobXpnaLlj5Hotbfovazlj5EgKi9cclxuICAgIHdoZW5BcHBTaGFyZShvcHRpb25zKSB7XHJcbiAgICAgICAgLy8g6ZyA6KaB5b6u5L+h5bim5LiKdGlja2V0c+S/oeaBr1xyXG4gICAgICAgIHd4LnVwZGF0ZVNoYXJlTWVudSh7IHdpdGhTaGFyZVRpY2tldDogdHJ1ZSwgc3VjY2VzcygpIHsgfSB9KTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBhZ2VzID0gZ2V0Q3VycmVudFBhZ2VzKCk7IC8vIOiOt+WPluWKoOi9veeahOmhtemdolxyXG4gICAgICAgIHZhciBjdXJyZW50UGFnZSA9IHBhZ2VzW3BhZ2VzLmxlbmd0aCAtIDFdOyAvLyDojrflj5blvZPliY3pobXpnaLnmoTlr7nosaFcclxuICAgICAgICB2YXIgY3VycmVudFVzZXJJZCA9ICcnO1xyXG4gICAgICAgIGlmICh0aGlzLnVzZXIgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjdXJyZW50VXNlcklkID0gdGhpcy51c2VyLmlkO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcXVlcnkgPSBvcHRpb25zLnF1ZXJ5IHx8ICcnO1xyXG4gICAgICAgIHZhciB1cmwgPVxyXG4gICAgICAgICAgICAnLycgK1xyXG4gICAgICAgICAgICBjdXJyZW50UGFnZS5yb3V0ZSArXHJcbiAgICAgICAgICAgICc/cmVmZXJlcklkPScgK1xyXG4gICAgICAgICAgICBjdXJyZW50VXNlcklkICtcclxuICAgICAgICAgICAgJyYnICtcclxuICAgICAgICAgICAgcXVlcnk7IC8vIOW9k+WJjemhtemdonVybFxyXG4gICAgICAgIGNvbnNvbGUubG9nKCd1cmw9JyArIHVybCArICcsb3B0aW9ucz0nLCBvcHRpb25zKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0aXRsZTogb3B0aW9ucy50aXRsZSB8fCAnJyxcclxuICAgICAgICAgICAgcGF0aDogdXJsLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAvLyDovazlj5HmiJDlip9cclxuICAgICAgICAgICAgICAgIHNlbGYud2hlblNoYXJlZChcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogZW5jb2RlVVJJQ29tcG9uZW50KHVybCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcndhcmQ6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHRydWVcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIC8vIOi9rOWPkeWksei0pVxyXG4gICAgICAgICAgICAgICAgc2VsZi53aGVuU2hhcmVkKFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBlbmNvZGVVUklDb21wb25lbnQodXJsKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yd2FyZDogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHRydWVcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgd2hlblNoYXJlZChyZWZlcmVyLCBjcmVhdGUpIHtcclxuICAgICAgICBpZiAoY3JlYXRlKSB7XHJcbiAgICAgICAgICAgIHJlZmVyZXIuYWN0aW9uID0gJ2FkZCc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVmZXJlci5hY3Rpb24gPSAnbG9vayc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCd3aGVuU2hhcmVkOicsIHJlZmVyZXIpO1xyXG4gICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgncmVzdGFua1JlZmVyZXIuZG8nLCByZWZlcmVyLCB7XHJcbiAgICAgICAgICAgIHNob3dMb2FkaW5nOiBmYWxzZVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncmVmZXJlcjonLCBkYXRhKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3JlZmVyZXIgZXJyb3I6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLSDmiYDmnInpobXpnaLnmoTlhazlhbHlh73mlbAgLS0tLS0tLS0tLS0tXHJcbiAgICAvLyDkuLrmiYDmnInpobXpnaLmj5Dkvpvnu5/kuIDnmoTmlbDmja7ojrflj5bmlrnms5VcclxuICAgIGZldGNoRGF0YVByb21pc2UodXJsLCBwYXJhbXMsIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgICAgIGlmICh1cmwuaW5kZXhPZignaHR0cCcpICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHVybCA9IHRoaXMuY29uZmlnLmRhdGFVcmwgKyB1cmw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8g5Zyo5omA5pyJ6K+35rGC6YeM5Yqg5YWldXNlcklkXHJcbiAgICAgICAgaWYgKHRoaXMucGFzc3BvcnQpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3RoaXMucGFzc3BvcnQnLCB0aGlzLnBhc3Nwb3J0KTtcclxuICAgICAgICAgICAgcGFyYW1zLnBhc3Nwb3J0ID0gdGhpcy5wYXNzcG9ydDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g5aKe5Yqg56iL5bqP5L+h5oGvXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnICYmIHRoaXMuY29uZmlnLnZlcnNpb25JbmZvKSB7XHJcbiAgICAgICAgICAgIHBhcmFtcy5kZXZpY2UgPSB0aGlzLmNvbmZpZy52ZXJzaW9uSW5mby5kZXZpY2U7XHJcbiAgICAgICAgICAgIHBhcmFtcy5wbGF0Zm9ybSA9IHRoaXMuY29uZmlnLnZlcnNpb25JbmZvLnBsYXRmb3JtO1xyXG4gICAgICAgICAgICBwYXJhbXMudmVyc2lvbiA9IHRoaXMuY29uZmlnLnZlcnNpb25JbmZvLnZlcnNpb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOaYvuekuuWKoOi9veaVsOaNruaPkOekulxyXG4gICAgICAgIG9wdGlvbnMuc2hvd0xvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiBhcHAuZmV0Y2hEYXRhUHJvbWlzZSh1cmwsIHBhcmFtcywgb3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICAvLyDlj4LmlbDplJnor6/msqHmnIlpZO+8jOi3s+i9rOWIsOaQnOe0olxyXG4gICAgd2hlblBhcmFtRXJyb3IoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ29uIHBhcmFtZXRlciBlcnJvcicpO1xyXG4gICAgICAgIHd4LnJlZGlyZWN0VG8oeyB1cmw6ICcvcGFnZXMvaW5kZXgnIH0pO1xyXG4gICAgfVxyXG4gICAgLy8g5a+5YXJ0aWNsZeeahOagvOW8j+i/m+ihjOWkhOeQhlxyXG4gICAgcHJvY2Vzc0FydGljbGUoaXRlbSwgb3B0aW9ucyA9IHt9KSB7XHJcbiAgICAgICAgdmFyIGRlZmF1bHRPcHRpb25zID0ge1xyXG4gICAgICAgICAgICBhYnN0cmFjdHNMZW5ndGg6IDEwMCxcclxuICAgICAgICAgICAgdGFnc0xlbmd0aDogNSxcclxuICAgICAgICAgICAgdGl0bGVIVE1MOiBmYWxzZSwgLy8g5qCH6aKY5piv5ZCm5Li6SFRNTOagvOW8j1xyXG4gICAgICAgICAgICBhYnN0cmFjdHNIVE1MOiBmYWxzZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcclxuICAgICAgICAvLyDlr7nmoIfpopjov5vooYznroDljZXnmoRIVE1M5qC85byP5YyW5aSE55CGXHJcbiAgICAgICAgaWYgKG9wdGlvbnMudGl0bGVIVE1MKSB7XHJcbiAgICAgICAgICAgIGxldCBodG1sTm9kZXMgPSB0aGlzLl9tYWtlSFRNTE5vZGUoaXRlbS50aXRsZSwgMCk7XHJcbiAgICAgICAgICAgIGl0ZW0udGl0bGVOb2RlcyA9IGh0bWxOb2RlcztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g5aSE55CG57+76K+R57uT5p6cXHJcbiAgICAgICAgLy8gaXRlbS50aXRsZV96aCA9IGl0ZW0udGl0bGU7XHJcbiAgICAgICAgaWYgKGl0ZW0udGl0bGVfemggJiYgaXRlbS50aXRsZV96aC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGl0ZW0udGl0bGVfemggPSAn6K+R5paHOicgKyBpdGVtLnRpdGxlX3poO1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy50aXRsZUhUTUwpIHtcclxuICAgICAgICAgICAgICAgIGxldCBodG1sTm9kZXMgPSB0aGlzLl9tYWtlSFRNTE5vZGUoaXRlbS50aXRsZV96aCwgMCk7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnRpdGxlVHJhbnNsYXRlTm9kZXMgPSBodG1sTm9kZXM7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnRpdGxlVHJhbnNsYXRlID0gaXRlbS50aXRsZV96aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDmkZjopoHlpKrlpJrkuobvvIzlj6rlj5YxMDDkuKrlrZdcclxuICAgICAgICBpZiAoaXRlbS5hYnN0cmFjdHMpIHtcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuYWJzdHJhY3RzSFRNTCkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5hYnN0cmFjdHNOb2RlcyA9IHRoaXMuX21ha2VIVE1MTm9kZShcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmFic3RyYWN0cyxcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmFic3RyYWN0c0xlbmd0aFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMuYWJzdHJhY3RzTGVuZ3RoID4gMCAmJlxyXG4gICAgICAgICAgICAgICAgaXRlbS5hYnN0cmFjdHMubGVuZ3RoID4gb3B0aW9ucy5hYnN0cmFjdHNMZW5ndGhcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmFic3RyYWN0cyA9XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5hYnN0cmFjdHMuc3Vic3RyaW5nKDAsIG9wdGlvbnMuYWJzdHJhY3RzTGVuZ3RoKSArXHJcbiAgICAgICAgICAgICAgICAgICAgJy4uLic7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5hYnN0cmFjdHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmFic3RyYWN0cyA9ICfmmoLml6DmkZjopoEnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGl0ZW0uYWJzdHJhY3RzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpdGVtLmFic3RyYWN0cyA9ICfmmoLml6DmkZjopoEnO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDpobnnm67ph5Hpop1cclxuICAgICAgICBpZiAoaXRlbS5hbW91bnQgPiAwKSB7XHJcbiAgICAgICAgICAgIGl0ZW0uYW1vdW50RGVzYyA9IHRoaXMuZm9ybWF0TnVtYmVyKGl0ZW0uYW1vdW50IC8gMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdGVtLnRpdGxlRGVzYyA9XHJcbiAgICAgICAgICAgIChpdGVtLnllYXIgJiYgaXRlbS55ZWFyLmxlbmd0aCA+IDAgPyBpdGVtLnllYXIgKyAnLCcgOiAnJykgK1xyXG4gICAgICAgICAgICAoaXRlbS5waW5hbWUgJiYgaXRlbS5waW5hbWUubGVuZ3RoID4gMCA/IGl0ZW0ucGluYW1lICsgJywnIDogJycpICtcclxuICAgICAgICAgICAgKGl0ZW0ub3JnbmFtZSAmJiBpdGVtLm9yZ25hbWUubGVuZ3RoID8gaXRlbS5vcmduYW1lICsgJywnIDogJycpO1xyXG4gICAgICAgIC8vIOWOu+aOieacgOWQjuS4gOS4qu+8jFxyXG4gICAgICAgIGl0ZW0udGl0bGVEZXNjID0gaXRlbS50aXRsZURlc2Muc3Vic3RyaW5nKDAsIGl0ZW0udGl0bGVEZXNjLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgIGl0ZW0udGl0bGVEZXNjTm9kZXMgPSB0aGlzLl9tYWtlSFRNTE5vZGUoXHJcbiAgICAgICAgICAgIGl0ZW0udGl0bGVEZXNjLFxyXG4gICAgICAgICAgICAwXHJcbiAgICAgICAgKTtcclxuICAgICAgICAvLyDpobnnm67lhbPplK7lrZcs5aSE55CG5YiG6ZqU56ym5Y+377yM5pyN5Yqh5Zmo56uv5pyq5YGa5aSE55CGXHJcbiAgICAgICAgaWYgKGl0ZW0ua2V5d29yZHMgJiYgaXRlbS5rZXl3b3Jkcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHZhciB0YWdzID0gdGhpcy5fbWFrZUFycmF5cyhpdGVtLmtleXdvcmRzKTtcclxuICAgICAgICAgICAgLy8gLS0tLS0tLS0gY29uc29sZS5sb2coXCJ0YWdzIGlzIFwiLHRhZ3MpO1xyXG4gICAgICAgICAgICBpZiAodGFncy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICB0YWdzLmZvckVhY2godGFnID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGFnLmxlbmd0aCA+IDEwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZyA9IHRhZy5zdWJzdHJpbmcoMCwgMTApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgLy8g5Y+q5Y+W5YmN5Yeg5LiqXHJcbiAgICAgICAgICAgICAgICB0YWdzID0gdGFncy5zbGljZSgwLCBvcHRpb25zLnRhZ3NMZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgIGlmICh0YWdzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnRhZ3MgPSB0YWdzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJpdGVtIHRhZ3M6XCIsIHRhZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9ybWF0TnVtYmVyKG4pIHtcclxuICAgICAgICByZXR1cm4gbi50b0ZpeGVkKDApLnJlcGxhY2UoLy4vZywgZnVuY3Rpb24gKGMsIGksIGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGkgPiAwICYmIGMgIT09ICcuJyAmJiAoYS5sZW5ndGggLSBpKSAlIDMgPT09IDAgPyAnLCcgKyBjIDogYztcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIF9tYWtlQXJyYXlzKHR4dCwgc3BsaXRzKSB7XHJcbiAgICAgICAgLy8g57uf5LiA6YO96L2s5o2i5oiQ56ys5LiA5Liqc3BsaXTvvIznhLblkI7nu5/kuIBzcGxpdFxyXG4gICAgICAgIHR4dCA9IHR4dC5yZXBsYWNlKC86L2csICc7Jyk7XHJcbiAgICAgICAgdHh0ID0gdHh0LnJlcGxhY2UoL++8my9nLCAnOycpO1xyXG4gICAgICAgIHR4dCA9IHR4dC5yZXBsYWNlKC9eXFxzKnxcXHMqJC9nLCAnJyk7IC8vIOWOu+aOieepuuagvFxyXG4gICAgICAgIHZhciByZXQgPSBbXTtcclxuICAgICAgICB2YXIgYXJyYXkgPSB0eHQuc3BsaXQoJzsnKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChhcnJheVtpXS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXQucHVzaChhcnJheVtpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuICAgIF9tYWtlSFRNTE5vZGUodHh0LCBtYXhMZW5ndGgpIHtcclxuICAgICAgICB2YXIgaHRtbE5vZGVzID0gW107XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IDA7XHJcbiAgICAgICAgdmFyIG5vZGVzID0gdHh0LnNwbGl0KFwiPHNwYW4gY2xhc3M9J3JlZCc+XCIpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHRleHQgPSBub2Rlc1tpXTtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGV4dC5pbmRleE9mKCc8L3NwYW4+Jyk7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA8IDApIHtcclxuICAgICAgICAgICAgICAgIGxlbmd0aCArPSB0ZXh0Lmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGlmIChtYXhMZW5ndGggPiAwICYmIGxlbmd0aCA+IG1heExlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGh0bWxOb2Rlcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dC5zdWJzdHJpbmcoMCwgdHh0Lmxlbmd0aCAtIGxlbmd0aCArIG1heExlbmd0aCkgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJy4uLidcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbE5vZGVzLnB1c2goeyB0eXBlOiAndGV4dCcsIHRleHQ6IHRleHQgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdG1wMSA9IHRleHQuc3Vic3RyaW5nKDAsIGluZGV4KTtcclxuICAgICAgICAgICAgICAgIHZhciB0bXAyID0gdGV4dC5zdWJzdHJpbmcoaW5kZXggKyAnPC9zcGFuPicubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIGxlbmd0aCArPSB0bXAxLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGh0bWxOb2Rlcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnc3BhbicsXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6ICdjb2xvcjogcmVkOydcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IHRtcDEgKyAnJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodG1wMi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoICs9IHRtcDIubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXhMZW5ndGggPiAwICYmIGxlbmd0aCA+IG1heExlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sTm9kZXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndGV4dCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRtcDIuc3Vic3RyaW5nKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bXAyLmxlbmd0aCAtIGxlbmd0aCArIG1heExlbmd0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgKyAnLi4uJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sTm9kZXMucHVzaCh7IHR5cGU6ICd0ZXh0JywgdGV4dDogdG1wMiB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobWF4TGVuZ3RoID4gMCAmJiBsZW5ndGggPiBtYXhMZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBodG1sTm9kZXMucHVzaCh7IHR5cGU6ICd0ZXh0JywgdGV4dDogJy4uLicgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0eHQgaXM6XCIsIHR4dCwgaHRtbE5vZGVzKTtcclxuICAgICAgICByZXR1cm4gaHRtbE5vZGVzO1xyXG4gICAgfVxyXG4gICAgdG9Mb2NhbERhdGUoaXNvODYwMSwgcGF0dGVybiA9ICd5eXl5LU1NLWRkJykge1xyXG4gICAgICAgIC8vIOivleS6huWHoOS4quW6k+mDveS4jeihjO+8jOWcqOaJi+acuuS4iuS8muWHuumUmVxyXG4gICAgICAgIHJldHVybiBpc284NjAxLnN1YnN0cmluZygwLCBpc284NjAxLmluZGV4T2YoJ1QnKSk7XHJcbiAgICB9XHJcbn1cclxuIl19