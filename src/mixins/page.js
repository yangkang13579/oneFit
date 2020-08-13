/* global wx getCurrentPages */
import wepy from 'wepy';
import app from '../lib/app';
// 每个页面都继承它，可以实现一些公共的方法
export default class PageMixin extends wepy.mixin {
    // 公共的数据
    data = {
        // 公共的一些变量
        loadUser: false,
        user: {}, // 用户信息
        passport: null, // sessionId
        config: {}, // 应用的配置，必须有
        loadOptions: false,
        options: {}, // 个人化参数
    };
    onShow() {
        this.app = app;
        this.checkAppReady();
    }
    checkAppReady() {
        // wx.showLoading({ title: '读取数据...' });
        app
            .checkReady({
                user: this.loadUser,
                config: true,
                userInfo: true,
                refer: true,
                options: this.loadOptions
            })
            .then(data => {
                wx.hideLoading();
                console.log('app data:', data);
                if (data.passportData) {
                    this.user = data.passportData.user;

                    // this.passport = data.passportData.session.id;
                    this.passport = 'rdbbpj4lvzhcbrqqre0asz3cftc45piu'
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
                        this.user.mobile = mobile;
                    }
                    //
                }
                if (data.config) {
                    this.config = data.config;
                }
                if (data.appOptions) {
                    this.options = data.appOptions;
                }
                if (data.refer) {
                    this.whenShared(data.refer);
                }
                this.$apply();
                this.whenAppReady();
            })
            .catch(error => {
                wx.hideLoading();
                this.renderError(error);
            });
    }
    renderError(e) {
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
                complete: function (res) {
                    wx.openSetting({
                        success: res => {
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
                complete: function (res) {
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
                success: function (res) {
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
            success: function (res) {
                // wx.navigateBack();
                wx.hideLoading();
            }
        });
        console.log('Unhandle error:', e);
    }
    wxLogin() {
        var self = this;
        wx.showLoading({ title: '读取用户信息...' });
        app
            .wxLogin()
            .then(data => {
                wx.hideLoading();
                console.log('wxLogin ok:', data);
                self.checkAppReady();
            })
            .catch(e => {
                wx.hideLoading();
                console.log('wxLogin error:');
                self.renderError(e);
            });
    }
    whenAppReady() {
        //

        //
        this.whenAppReadyShow();
    }
    whenAppReadyShow() {
        console.log('whenAppReadyShow...');
    }
    time(timeStr) {
        var dataOne = timeStr.split('T')[0];
        var dataTwo = timeStr.split('T')[1];
        var dataThree = dataTwo.split('+')[0];
        var newTimeStr = dataOne + ' ' + dataThree;
        return newTimeStr;
    }
    /** 当页面发起转发 */
    whenAppShare(options) {
        // 需要微信带上tickets信息
        wx.updateShareMenu({ withShareTicket: true, success() { } });
        var self = this;
        var pages = getCurrentPages(); // 获取加载的页面
        var currentPage = pages[pages.length - 1]; // 获取当前页面的对象
        var currentUserId = '';
        if (this.user != null) {
            currentUserId = this.user.id;
        }
        var query = options.query || '';
        var url =
            '/' +
            currentPage.route +
            '?refererId=' +
            currentUserId +
            '&' +
            query; // 当前页面url
        console.log('url=' + url + ',options=', options);
        return {
            title: options.title || '',
            path: url,
            success: function (res) {
                // 转发成功
                self.whenShared(
                    {
                        url: encodeURIComponent(url),
                        forward: true
                    },
                    true
                );
            },
            fail: function (res) {
                // 转发失败
                self.whenShared(
                    {
                        url: encodeURIComponent(url),
                        forward: false
                    },
                    true
                );
            }
        };
    }
    whenShared(referer, create) {
        if (create) {
            referer.action = 'add';
        } else {
            referer.action = 'look';
        }
        console.log('whenShared:', referer);
        this.fetchDataPromise('restankReferer.do', referer, {
            showLoading: false
        })
            .then(function (data) {
                console.log('referer:', data);
            })
            .catch(function (error) {
                console.log('referer error:', error);
            });
    }
    // --------------- 所有页面的公共函数 ------------
    // 为所有页面提供统一的数据获取方法
    fetchDataPromise(url, params, options = {}) {
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
        return app.fetchDataPromise(url, params, options);
    }
    // 参数错误没有id，跳转到搜索
    whenParamError() {
        console.log('on parameter error');
        wx.redirectTo({ url: '/pages/index' });
    }
    // 对article的格式进行处理
    processArticle(item, options = {}) {
        var defaultOptions = {
            abstractsLength: 100,
            tagsLength: 5,
            titleHTML: false, // 标题是否为HTML格式
            abstractsHTML: false
        };
        options = Object.assign({}, defaultOptions, options);
        // 对标题进行简单的HTML格式化处理
        if (options.titleHTML) {
            let htmlNodes = this._makeHTMLNode(item.title, 0);
            item.titleNodes = htmlNodes;
        }
        // 处理翻译结果
        // item.title_zh = item.title;
        if (item.title_zh && item.title_zh.length > 0) {
            item.title_zh = '译文:' + item.title_zh;
            if (options.titleHTML) {
                let htmlNodes = this._makeHTMLNode(item.title_zh, 0);
                item.titleTranslateNodes = htmlNodes;
            } else {
                item.titleTranslate = item.title_zh;
            }
        }
        // 摘要太多了，只取100个字
        if (item.abstracts) {
            if (options.abstractsHTML) {
                item.abstractsNodes = this._makeHTMLNode(
                    item.abstracts,
                    options.abstractsLength
                );
            } else if (
                options.abstractsLength > 0 &&
                item.abstracts.length > options.abstractsLength
            ) {
                item.abstracts =
                    item.abstracts.substring(0, options.abstractsLength) +
                    '...';
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

        item.titleDesc =
            (item.year && item.year.length > 0 ? item.year + ',' : '') +
            (item.piname && item.piname.length > 0 ? item.piname + ',' : '') +
            (item.orgname && item.orgname.length ? item.orgname + ',' : '');
        // 去掉最后一个，
        item.titleDesc = item.titleDesc.substring(0, item.titleDesc.length - 1);
        item.titleDescNodes = this._makeHTMLNode(
            item.titleDesc,
            0
        );
        // 项目关键字,处理分隔符号，服务器端未做处理
        if (item.keywords && item.keywords.length > 0) {
            var tags = this._makeArrays(item.keywords);
            // -------- console.log("tags is ",tags);
            if (tags.length > 1) {
                tags.forEach(tag => {
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
    formatNumber(n) {
        return n.toFixed(0).replace(/./g, function (c, i, a) {
            return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? ',' + c : c;
        });
    }
    _makeArrays(txt, splits) {
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
    _makeHTMLNode(txt, maxLength) {
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
                        text:
                            text.substring(0, txt.length - length + maxLength) +
                            '...'
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
                    children: [
                        {
                            type: 'text',
                            text: tmp1 + ''
                        }
                    ]
                });
                if (tmp2.length > 0) {
                    length += tmp2.length;
                    if (maxLength > 0 && length > maxLength) {
                        htmlNodes.push({
                            type: 'text',
                            text:
                                tmp2.substring(
                                    tmp2.length - length + maxLength
                                ) + '...'
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
    toLocalDate(iso8601, pattern = 'yyyy-MM-dd') {
        // 试了几个库都不行，在手机上会出错
        return iso8601.substring(0, iso8601.indexOf('T'));
    }
}
