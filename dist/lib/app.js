'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _appsocket = require('./appsocket.js');

var _appsocket2 = _interopRequireDefault(_appsocket);

var _md = require('./../npm/md5/md5.js');

var _md2 = _interopRequireDefault(_md);

require('./../npm/wepy-async-function/index.js');

var _co = require('./../npm/co/index.js');

var _co2 = _interopRequireDefault(_co);

var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* APP 启动流程，一个应用只有一个app实例，被每个页面调用 */
/** 管理所有的数据Cache  */
var App = {
    config: {
        versionInfo: {
            device: 'phone',
            platform: 'wx_xcx',
            version: '_VERSION_' // 版本号，version.js 会在编译之后替换
        }
    },
    launchOption: {}, // 启动时候的参数，对于分享
    passportData: null, // 用户信息
    geoData: null, // GEO信息
    appOptions: null,
    state: 'init',
    socket: null, // 连接的appsocket
    messageCallback: null, // 连接的消息回调
    init: function init(globalOptions, wxOptions) {
        if (this.state !== 'init') {
            throw new Error('app.init can be invoked only once');
        }
        this.launchOption = wxOptions;
        this.config = _extends({}, this.config, globalOptions);
        console.log('App Inited:', this.config, this.launchOption);
        this.state = 'inited';
    },
    preload: function preload(type, data) {
        try {
            if (type === 'url') {
                var url = data;
                wx.request({
                    url: url,
                    success: function success(res) {},
                    fail: function fail(error) {
                        console.log('preload failed:', url, error);
                    }
                });
            } else if (type === 'cache') {
                var cacheKey = (0, _md2.default)(data.key);
                this.dataCache[cacheKey] = data.value;
            } else if (type === 'storage') {
                var _cacheKey = (0, _md2.default)(data.key);
                wx.setStorageSync('cache_' + _cacheKey, data.value);
            }
        } catch (e) {
            console.log('preload error:', type, data, e);
        }
    },

    // 统一的数据访问接口
    fetchData: function fetchData(url, params, callback) {
        var fetchOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

        var defaultOptions = {
            showLoading: false,
            method: 'GET',
            showLoadingTitle: '正在加载数据...',
            useCache: false, // 使用开启缓存，如果是则会把数据缓存到storage
            expireTime: 60 // 默认缓存时间60秒，如果设置为0，立即失效
        };
        var options = _extends({}, defaultOptions, fetchOptions);
        var cacheKey = null;
        var cache = null;
        if (options.useCache) {
            cacheKey = options.cacheKey || (0, _md2.default)(this.config.versionInfo.version + '_' + url); // 跟一个版本号
            cache = wx.getStorageSync('cache_' + cacheKey);
            try {
                if (cache === '' || cache.length === 0) {
                    cache = null;
                }
                if (cache != null) {
                    cache = JSON.parse(cache);
                    var now = new Date().getTime();
                    if (isNaN(cache.expired) || now > cache.expired || options.expireTime === 0) {
                        console.log('cache expired');
                        wx.removeStorageSync(cacheKey);
                        cache = null;
                    } else {
                        cache = cache.data;
                    }
                }
            } catch (e) {
                console.log('invalid cache:' + cacheKey + ',' + e.message);
            }
            if (cache != null) {
                // 已经命中,无需显示进度
                options.showLoading = false;
            }
        }
        if (options.showLoading) {
            // wx.showLoading({
            //   title: options.showLoadingTitle
            // });
        }
        if (cache != null && options.useCache) {
            callback(cache);
            return;
        }
        wx.request({
            url: url,
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: options.method,
            data: params,
            success: function success(res) {
                if (options.useCache && options.expireTime > 0) {
                    var _now = new Date().getTime();
                    var cacheString = JSON.stringify({
                        expired: _now + options.expireTime * 1000,
                        data: res.data
                    });
                    wx.setStorageSync('cache_' + cacheKey, cacheString);
                }
                callback(res.data);
                if (options.showLoading) {
                    wx.hideLoading();
                }
            },
            fail: function fail(error) {
                console.log(111111111111);
                if (options.showLoading) {
                    wx.hideLoading();
                }
                console.log('fetchData error:', error);
                if (cache !== null && cacheKey != null) {
                    // 无须更新缓存
                } else {
                    var errObj = {
                        code: 500,
                        messages: {
                            error: {
                                code: 'NETWORK_ERROR',
                                message: error.message || error.errMsg
                            }
                        }
                    };
                    callback(errObj);
                }
            }
        });
    },
    fetchDataPromise: function fetchDataPromise(url, params, options) {
        // console.log("fectchData from " + url + ",params=", params);
        var self = this;
        return new Promise(function (resolve, reject) {
            self.fetchData(url, params, function (json) {
                if (json.code === 200) {
                    resolve(json.messages.data);
                } else {
                    var error = json.messages.error;
                    reject(self.throwError(error));
                }
            }, options);
        });
    },

    // 检查是否准备，由页面自己调用
    checkReady: function checkReady(checkOption) {
        var options = _extends({
            user: false, // 检查用户，如果没有登录，触发异常
            userInfo: false, // 仅仅是加载用户，而不触发登录异常
            geo: false, // 获得GEO数据
            options: false, // 获得个性选项
            config: false, // 获得 全局配置
            refer: false // 获得分享信息
        }, checkOption);
        console.log('checkOptions:', options);
        return (0, _co2.default)(this._checkGenerator(options));
    },
    _checkGenerator: /*#__PURE__*/regeneratorRuntime.mark(function _checkGenerator(options) {
        var data, error;
        return regeneratorRuntime.wrap(function _checkGenerator$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        data = {};
                        // 全局参数,只会初始化一次

                        _context.next = 3;
                        return this.initGlobalConfig();

                    case 3:
                        _context.next = 5;
                        return this._getWxCode(true);

                    case 5:
                        if (!(this.passportData === null)) {
                            _context.next = 9;
                            break;
                        }

                        _context.next = 8;
                        return this.initPassport();

                    case 8:
                        this.passportData = _context.sent;

                    case 9:
                        if (!options.user) {
                            _context.next = 16;
                            break;
                        }

                        error = {
                            code: 'user_login'
                            // message: ''
                        };

                        if (!(this.passportData === null)) {
                            _context.next = 13;
                            break;
                        }

                        throw this.throwError(error);

                    case 13:
                        _context.next = 15;
                        return this.initAppSocket(this.passportData);

                    case 15:
                        data.passportData = this.passportData;

                    case 16:
                        if (options.userInfo && this.passportData != null) {
                            data.passportData = this.passportData;
                        }
                        if (options.options) {
                            if (this.appOptions === null) {
                                this.appOptions = this.initAppOptions();
                            }
                            data.appOptions = this.appOptions;
                        }
                        if (options.config) {
                            data.config = this.config;
                        }

                        if (!(options.refer && this.launchOption != null)) {
                            _context.next = 24;
                            break;
                        }

                        _context.next = 22;
                        return this._getRefererInfo(this.launchOption);

                    case 22:
                        data.refer = _context.sent;

                        this.launchOption = null;

                    case 24:
                        return _context.abrupt('return', data);

                    case 25:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _checkGenerator, this);
    }),
    initGlobalConfig: function initGlobalConfig() {
        var _this = this;

        var configUrl = this.config.configUrl;

        var self = this;
        if (configUrl != null) {
            console.log('initGlobalConfig...');
            var timestamp = new Date().getTime();
            console.log('Read configuration from:' + configUrl);
            return this.fetchDataPromise(configUrl, {
                time: timestamp
            }).then(function (data) {
                if (data.global) {
                    // 合并global
                    self.config = _extends({}, self.config, data.global);
                    console.log('update global:' + JSON.stringify(_this.global));
                    // 避免多次初始化
                    _this.config.configUrl = null;
                }
            }).catch(function (e) {
                throw e;
            });
        }
        return Promise.resolve();
    },
    initAppOptions: function initAppOptions() {
        try {
            var optionStr = wx.getStorageSync('settings_options');
            if (optionStr != null && optionStr.indexOf('{') === 0) {
                var options = JSON.parse(optionStr);
                console.log('Load AppOptions:', options);
                return options;
            }
        } catch (e) {
            console.log('loadOptions failed', e);
        }
        return {};
    },
    updateOption: function updateOption(key, value) {
        try {
            this.appOptions[key] = value;
            wx.setStorage({
                key: 'settings_options',
                data: JSON.stringify(this.appOptions)
            });
        } catch (e) {
            console.log('updateOptions failed', e);
        }
    },

    // 初始化用户系统
    initPassport: function initPassport() {
        var self = this;
        function checkSSOPromise(resolve, reject) {
            console.log('initPassport...');
            wx.checkSession({
                success: function success() {
                    var passport = wx.getStorageSync('passport');
                    if (passport) {
                        var checkSSOUrl = self.config.passportUrl + 'checkSSO.do';
                        var checkSSOParams = {
                            passport: passport
                        };
                        self.fetchDataPromise(checkSSOUrl, checkSSOParams).then(function (data) {
                            if (data.user) {
                                if (data.user.id.indexOf('_') !== -1) {
                                    data.user.id = data.user.id.split('_')[1];
                                }
                                resolve(data);
                            } else {
                                resolve(null);
                            }
                        });
                    } else {
                        resolve(null);
                    }
                },
                fail: function fail(e) {
                    console.log('checkSession:', e);
                    resolve(null);
                }
            });
        }
        return new Promise(function (resolve, reject) {
            checkSSOPromise(resolve, reject);
        });
    },
    initAppSocket: function initAppSocket(passportData) {
        if (this.config.appSocketUrl && passportData != null) {
            var socketUrl = this.config.appSocketUrl;
            socketUrl += '?userId=' + passportData.session.id;
            console.log('init appsocket:', socketUrl);
            self.socket = new _appsocket2.default(socketUrl);
            self.socket.onMessage = function (data) {
                try {
                    var json = JSON.parse(data);
                    self.onMessage(json);
                } catch (e) {
                    console.log('onMessage error', e);
                }
            };
            self.socket.connect();
        }
        return Promise.resolve();
    },
    throwError: function throwError(error) {
        _wepy2.default.showModal({
            title: '提示',
            content: error.message,
            showCancel: false,
            success: function success(res) {
                if (res.confirm) {
                    console.log('用户点击确定');
                } else if (res.cancel) {
                    console.log('用户点击取消');
                }
            }
        });
        var e = new Error(error.message);
        e.name = error.code;
        return e;
    },
    _wxLoginGenerator: /*#__PURE__*/regeneratorRuntime.mark(function _wxLoginGenerator(iv, encryptedData) {
        var code, passportData;
        return regeneratorRuntime.wrap(function _wxLoginGenerator$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return this._getWxCode(false);

                    case 2:
                        code = _context2.sent;
                        _context2.next = 5;
                        return this._loginPassport(code, encryptedData, iv);

                    case 5:
                        passportData = _context2.sent;

                        // 写入到storage
                        wx.setStorageSync('passport', passportData.session.id);
                        this.passportData = passportData;
                        return _context2.abrupt('return', passportData);

                    case 9:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _wxLoginGenerator, this);
    }),
    loginWX: function loginWX(iv, encryptedData) {
        return (0, _co2.default)(this._wxLoginGenerator(iv, encryptedData));
    },

    // https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html#wxchecksessionobject
    //  每次都获得一个新的Code
    _getWxCode: function _getWxCode() {
        var useCache = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var self = this;
        return new Promise(function (resolve, reject) {
            var code = wx.getStorageSync('wx_code');

            function wxCode() {
                wx.login({
                    success: function success(res) {
                        console.log('code', code);
                        if (res.code) {
                            code = res.code;
                            wx.setStorageSync("codes", code);
                            var json = {};
                            json.clientType = self.config.appType;
                            json.clientId = self.config.appId;
                            json.code = code;
                            json.action = 'code4key';
                            // 根据当前code生成一个sessionKey
                            self.fetchDataPromise(self.config.passportUrl + 'loginXCX.do', json).then(function (data) {
                                code = data.key;
                                wx.setStorageSync('wx_code', code);
                                resolve(code);
                            }).catch(function (error) {
                                reject(error);
                            });
                        } else {
                            console.log(22222222222);
                            var error = {
                                code: 'wx_login_error',
                                message: res.errMsg
                            };
                            reject(self.throwError(error));
                        }
                    }
                });
            }
            if (code && useCache) {
                wx.checkSession({
                    success: function success() {
                        resolve(code);
                    },
                    fail: function fail() {
                        wxCode();
                    }
                });
            } else {
                wxCode();
            }
        });
    },
    _getUserInfo: function _getUserInfo() {
        var self = this;
        return new Promise(function (resolve, reject) {
            function userInfo() {
                wx.getUserInfo({
                    // withCredentials: true,
                    lang: 'zh_CN',
                    success: function success(res) {
                        console.log('getUserInfo=', res);
                        resolve(res);
                    },
                    fail: function fail(res) {
                        var error = {
                            code: 'userinfo_error',
                            message: res.errMsg
                        };
                        reject(self.throwError(error));
                    }
                });
            }
            // 检查用户设置
            wx.getSetting({
                success: function success(res) {
                    if (!res.authSetting['scope.userInfo']) {
                        wx.authorize({
                            scope: 'scope.userInfo',
                            success: function success() {
                                userInfo();
                            },
                            fail: function fail() {
                                var error = {
                                    code: 'userinfo_reject',
                                    message: '用户取消授权'
                                };
                                reject(self.throwError(error));
                            }
                        });
                    } else {
                        userInfo();
                    }
                },
                fail: function fail() {
                    var error = {
                        code: 'userinfo_fail',
                        message: '读取用户设置失败'
                    };
                    reject(self.throwError(error));
                }
            });
        });
    },
    _loginPassport: function _loginPassport(code, encryptedData, iv) {
        var json = {};
        json.clientType = this.config.appType;
        json.clientId = this.config.appId;
        json.key = code;
        json.action = 'loginData';
        json.encryptedData = encryptedData;
        json.encryptedIV = iv;
        json.remember = 365; // 365天
        console.log('encryptedData=' + encryptedData);
        console.log('encryptedIV=' + iv);
        console.log('code=' + code);
        return this.fetchDataPromise(this.config.passportUrl + 'loginXCX.do', json);
    },

    //  只有分享到群才有 shareTicket， 分享到个人是没有的
    _getRefererInfo: function _getRefererInfo(options) {
        console.log('_getRefererInfo:', options);
        var refererId = options.query.refererId;
        if (refererId) {
            return new Promise(function (resolve, reject) {
                wx.login({
                    complete: function complete(res) {
                        // console.log("wxLogin:", res);
                        if (res.code) {
                            resolve({
                                refererId: refererId,
                                refererCode: res.code,
                                secene: options.scene,
                                path: options.path
                            });
                        } else {
                            resolve(null);
                        }
                    }
                });
            });
        }
        return Promise.resolve(null);
    },
    onMessage: function onMessage(data) {
        console.log('receive app message', data);
        if (this.messageCallback != null) {
            this.messageCallback(data);
        }
    },
    listenMessage: function listenMessage(callback) {
        this.messageCallback = callback;
    },

    // E47B21153F96DE963AC04E3F22473E1928BCD2B497A066E4D9867E5662694AAA
    // bindMobilePromise(iv, encryptedData, passportSessionId) {
    //     // 手机绑定
    //     var self = this;
    //     var code = null;
    //     // 登录交换passportId
    //     function loginMobile(resolve, reject) {
    //         var json = {};
    //         json.clientType = self.config.appType;
    //         json.clientId = self.config.appId;
    //         json.key = code;
    //         json.encryptedData = encryptedData;
    //         json.encryptedIV = iv;
    //         json.loginType = 'mobile';
    //         json.link = true;
    //         json.linkForce = true;
    //         json.remember = 365;
    //         // 绑定到当前用户
    //         json.passport = passportSessionId;
    //         /**  */
    //         self.fetchData(
    //             self.config.passportUrl + 'loginMobile.do',
    //             json,
    //             function(json) {
    //                 if (json.code === 200) {
    //                     // console.log('loginPassport=' + JSON.stringify(json))
    //                     // wx.setStorageSync("passport", json.messages.data.session.id);
    //                     resolve(json.messages.data);
    //                 } else {
    //                     reject(json.messages.error);
    //                 }
    //             }
    //         );
    //     }
    //     return new Promise((resolve, reject) => {
    //         new Promise((resolve, reject) => {
    //             self._getWxCode(resolve, reject);
    //         })
    //             .then(function(data) {
    //                 code = data;
    //                 return new Promise((resolve, reject) => {
    //                     loginMobile(resolve, reject);
    //                 });
    //             })
    //             .then(function(passportData) {
    //                 resolve(passportData);
    //             })
    //             .catch(function(reason) {
    //                 reject(reason);
    //             });
    //     });
    // },
    bindMobilePromise: function bindMobilePromise(iv, encryptedData, passportSessionId) {
        // 手机绑定
        var self = this;
        var code = null;
        // 登录交换passportId
        wx.login({
            success: function success(res) {
                console.log('res', res);
                if (res.code) {
                    var json = {};
                    json.key = wx.getStorageSync('wx_code');
                    json.clientType = self.config.appType;
                    json.clientId = self.config.appId;
                    json.encryptedData = encryptedData;
                    json.encryptedIV = iv;
                    json.loginType = 'mobile';
                    json.link = true;
                    json.country = 'CN';
                    json.linkForce = true;
                    json.remember = 365;
                    // 绑定到当前用户
                    json.passport = passportSessionId;
                    console.log("传值", json);

                    /**  */
                    self.fetchData(self.config.passportUrl + 'loginMobile.do', json, function (json) {
                        console.log("json", json);
                        if (json.code === 200) {
                            // console.log('loginPassport=' + JSON.stringify(json))
                            // wx.setStorageSync("passport", json.messages.data.session.id);
                            resolve(json.messages.data);
                        } else {
                            reject(json.messages.error);
                        }
                    });
                }
            }
        });
    },
    uploadFile: function uploadFile(uploadItem, listener) {
        return (0, _co2.default)(this._wxUploadFile(uploadItem, listener));
    },

    // 上传图片
    _wxUploadFile: /*#__PURE__*/regeneratorRuntime.mark(function _wxUploadFile(uploadItem, listener) {
        var self, data, query, imageUrl;
        return regeneratorRuntime.wrap(function _wxUploadFile$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        self = this;

                        console.log('startUpload:', uploadItem.index);
                        _context3.next = 4;
                        return self._newUpload();

                    case 4:
                        data = _context3.sent;

                        uploadItem.uploadToken = data.token;
                        uploadItem.uploadUrl = data.uploadUrl;
                        _context3.next = 9;
                        return self._uploadFile(uploadItem, listener);

                    case 9:
                        _context3.next = 11;
                        return self._uploadQueryCheck(uploadItem, listener);

                    case 11:
                        _context3.next = 13;
                        return self._uploadQueryResult(uploadItem);

                    case 13:
                        query = _context3.sent;

                        if (query.files && query.files.length > 0) {
                            imageUrl = query.files[0].images[0].url;

                            console.log('上传结果:' + imageUrl);
                            uploadItem.imageUrl = imageUrl;
                        }
                        return _context3.abrupt('return', uploadItem);

                    case 16:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _wxUploadFile, this);
    }),
    _newUpload: function _newUpload() {
        // 获得一个上传地址
        var self = this;
        return new Promise(function (resolve, reject) {
            var uploadUrl = self.config.uploadUrl + 'upload.do';
            wx.request({
                url: uploadUrl,
                method: 'get',
                data: {
                    action: 'upload',
                    type: 'image',
                    appId: self.config.uploadAppId
                },
                success: function success(res) {
                    var json = res.data;
                    if (json.code === 200) {
                        resolve(json.messages.data);
                    } else {
                        var error = json.messages.error;
                        var e = new Error(error.message);
                        e.name = error.code;
                        reject(e);
                    }
                },
                fail: function fail(res) {
                    var error = {
                        code: 'upload_error',
                        message: res.errMsg
                    };
                    var e = new Error(error.message);
                    e.name = error.code;
                    reject(e);
                }
            });
        });
    },

    // 上传文件的具体
    _uploadFile: function _uploadFile(uploadItem, listener) {
        return new Promise(function (resolve, reject) {
            var uploadTask = wx.uploadFile({
                url: uploadItem.uploadUrl,
                filePath: uploadItem.file,
                name: 'file',
                success: function success(res) {
                    if (res.statusCode !== 200) {
                        var error = {
                            code: 'upload_error',
                            message: 'HTTP错误:' + res.statusCode
                        };
                        var e = new Error(error.message);
                        e.name = error.code;
                        reject(e);
                    } else {
                        resolve(uploadItem);
                    }
                },
                fail: function fail(res) {
                    var error = {
                        code: 'upload_error',
                        message: res.errMsg
                    };
                    var e = new Error(error.message);
                    e.name = error.code;
                    reject(e);
                }
            });
            // 监控上传进度
            uploadTask.onProgressUpdate(function (res) {
                if (listener != null) {
                    uploadItem.progress = res.progress;
                    if (uploadItem.progress > 99) {
                        uploadItem.progress = 99;
                    }
                    listener(uploadItem);
                }
                console.log('上传进度', res.progress);
                /*
                //console.log('已经上传的数据长度', res.totalBytesSent);
                console.log(
                '预期需要上传的数据总长度',
                res.totalBytesExpectedToSend
                );
                */
            });
        });
    },

    // 确认服务器已经收到所有数据
    _uploadQueryCheck: function _uploadQueryCheck(uploadItem, listener) {
        var uploadUrl = uploadItem.uploadUrl;
        function checkFinished(resolve, reject) {
            wx.request({
                url: uploadUrl,
                method: 'get',
                success: function success(res) {
                    var data = res.data;
                    console.log('check upload finished:', data);
                    if (data.status === 'finish') {
                        if (listener != null) {
                            uploadItem.progress = 100;
                            listener(uploadItem);
                        }
                        resolve(data);
                    } else {
                        setTimeout(function () {
                            checkFinished(resolve, reject);
                        }, 1000);
                    }
                },
                fail: function fail(res) {
                    var error = {
                        code: 'upload_error',
                        message: res.errMsg
                    };
                    console.log('query server error,will retry:', error);
                    setTimeout(function () {
                        checkFinished(resolve, reject);
                    }, 1000);
                }
            });
        };
        return new Promise(function (resolve, reject) {
            checkFinished(resolve, reject);
        });
    },
    _uploadQueryResult: function _uploadQueryResult(uploadItem) {
        var self = this;
        return new Promise(function (resolve, reject) {
            var uploadUrl = self.config.uploadUrl + 'upload.do';
            wx.request({
                url: uploadUrl,
                method: 'get',
                data: {
                    action: 'query',
                    token: uploadItem.uploadToken
                },
                success: function success(res) {
                    var json = res.data;
                    if (json.code === 200) {
                        resolve(json.messages.data);
                    } else {
                        var error = json.messages.error;
                        var e = new Error(error.message);
                        e.name = error.code;
                        reject(e);
                    }
                },
                fail: function fail(res) {
                    var error = {
                        code: 'upload_error',
                        message: res.errMsg
                    };
                    var e = new Error(error.message);
                    e.name = error.code;
                    reject(e);
                }
            });
        });
    }
};

exports.default = App;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJBcHAiLCJjb25maWciLCJ2ZXJzaW9uSW5mbyIsImRldmljZSIsInBsYXRmb3JtIiwidmVyc2lvbiIsImxhdW5jaE9wdGlvbiIsInBhc3Nwb3J0RGF0YSIsImdlb0RhdGEiLCJhcHBPcHRpb25zIiwic3RhdGUiLCJzb2NrZXQiLCJtZXNzYWdlQ2FsbGJhY2siLCJpbml0IiwiZ2xvYmFsT3B0aW9ucyIsInd4T3B0aW9ucyIsIkVycm9yIiwiY29uc29sZSIsImxvZyIsInByZWxvYWQiLCJ0eXBlIiwiZGF0YSIsInVybCIsInd4IiwicmVxdWVzdCIsInN1Y2Nlc3MiLCJyZXMiLCJmYWlsIiwiZXJyb3IiLCJjYWNoZUtleSIsImtleSIsImRhdGFDYWNoZSIsInZhbHVlIiwic2V0U3RvcmFnZVN5bmMiLCJlIiwiZmV0Y2hEYXRhIiwicGFyYW1zIiwiY2FsbGJhY2siLCJmZXRjaE9wdGlvbnMiLCJkZWZhdWx0T3B0aW9ucyIsInNob3dMb2FkaW5nIiwibWV0aG9kIiwic2hvd0xvYWRpbmdUaXRsZSIsInVzZUNhY2hlIiwiZXhwaXJlVGltZSIsIm9wdGlvbnMiLCJjYWNoZSIsImdldFN0b3JhZ2VTeW5jIiwibGVuZ3RoIiwiSlNPTiIsInBhcnNlIiwibm93IiwiRGF0ZSIsImdldFRpbWUiLCJpc05hTiIsImV4cGlyZWQiLCJyZW1vdmVTdG9yYWdlU3luYyIsIm1lc3NhZ2UiLCJoZWFkZXIiLCJjYWNoZVN0cmluZyIsInN0cmluZ2lmeSIsImhpZGVMb2FkaW5nIiwiZXJyT2JqIiwiY29kZSIsIm1lc3NhZ2VzIiwiZXJyTXNnIiwiZmV0Y2hEYXRhUHJvbWlzZSIsInNlbGYiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImpzb24iLCJ0aHJvd0Vycm9yIiwiY2hlY2tSZWFkeSIsImNoZWNrT3B0aW9uIiwidXNlciIsInVzZXJJbmZvIiwiZ2VvIiwicmVmZXIiLCJfY2hlY2tHZW5lcmF0b3IiLCJpbml0R2xvYmFsQ29uZmlnIiwiX2dldFd4Q29kZSIsImluaXRQYXNzcG9ydCIsImluaXRBcHBTb2NrZXQiLCJpbml0QXBwT3B0aW9ucyIsIl9nZXRSZWZlcmVySW5mbyIsImNvbmZpZ1VybCIsInRpbWVzdGFtcCIsInRpbWUiLCJ0aGVuIiwiZ2xvYmFsIiwiY2F0Y2giLCJvcHRpb25TdHIiLCJpbmRleE9mIiwidXBkYXRlT3B0aW9uIiwic2V0U3RvcmFnZSIsImNoZWNrU1NPUHJvbWlzZSIsImNoZWNrU2Vzc2lvbiIsInBhc3Nwb3J0IiwiY2hlY2tTU09VcmwiLCJwYXNzcG9ydFVybCIsImNoZWNrU1NPUGFyYW1zIiwiaWQiLCJzcGxpdCIsImFwcFNvY2tldFVybCIsInNvY2tldFVybCIsInNlc3Npb24iLCJBcHBTb2NrZXQiLCJvbk1lc3NhZ2UiLCJjb25uZWN0Iiwid2VweSIsInNob3dNb2RhbCIsInRpdGxlIiwiY29udGVudCIsInNob3dDYW5jZWwiLCJjb25maXJtIiwiY2FuY2VsIiwibmFtZSIsIl93eExvZ2luR2VuZXJhdG9yIiwiaXYiLCJlbmNyeXB0ZWREYXRhIiwiX2xvZ2luUGFzc3BvcnQiLCJsb2dpbldYIiwid3hDb2RlIiwibG9naW4iLCJjbGllbnRUeXBlIiwiYXBwVHlwZSIsImNsaWVudElkIiwiYXBwSWQiLCJhY3Rpb24iLCJfZ2V0VXNlckluZm8iLCJnZXRVc2VySW5mbyIsImxhbmciLCJnZXRTZXR0aW5nIiwiYXV0aFNldHRpbmciLCJhdXRob3JpemUiLCJzY29wZSIsImVuY3J5cHRlZElWIiwicmVtZW1iZXIiLCJyZWZlcmVySWQiLCJxdWVyeSIsImNvbXBsZXRlIiwicmVmZXJlckNvZGUiLCJzZWNlbmUiLCJzY2VuZSIsInBhdGgiLCJsaXN0ZW5NZXNzYWdlIiwiYmluZE1vYmlsZVByb21pc2UiLCJwYXNzcG9ydFNlc3Npb25JZCIsImxvZ2luVHlwZSIsImxpbmsiLCJjb3VudHJ5IiwibGlua0ZvcmNlIiwidXBsb2FkRmlsZSIsInVwbG9hZEl0ZW0iLCJsaXN0ZW5lciIsIl93eFVwbG9hZEZpbGUiLCJpbmRleCIsIl9uZXdVcGxvYWQiLCJ1cGxvYWRUb2tlbiIsInRva2VuIiwidXBsb2FkVXJsIiwiX3VwbG9hZEZpbGUiLCJfdXBsb2FkUXVlcnlDaGVjayIsIl91cGxvYWRRdWVyeVJlc3VsdCIsImZpbGVzIiwiaW1hZ2VVcmwiLCJpbWFnZXMiLCJ1cGxvYWRBcHBJZCIsInVwbG9hZFRhc2siLCJmaWxlUGF0aCIsImZpbGUiLCJzdGF0dXNDb2RlIiwib25Qcm9ncmVzc1VwZGF0ZSIsInByb2dyZXNzIiwiY2hlY2tGaW5pc2hlZCIsInN0YXR1cyIsInNldFRpbWVvdXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBO0FBQ0E7QUFDQSxJQUFJQSxNQUFNO0FBQ05DLFlBQVE7QUFDSkMscUJBQWE7QUFDVEMsb0JBQVEsT0FEQztBQUVUQyxzQkFBVSxRQUZEO0FBR1RDLHFCQUFTLFdBSEEsQ0FHWTtBQUhaO0FBRFQsS0FERjtBQVFOQyxrQkFBYyxFQVJSLEVBUVk7QUFDbEJDLGtCQUFjLElBVFIsRUFTYztBQUNwQkMsYUFBUyxJQVZILEVBVVM7QUFDZkMsZ0JBQVksSUFYTjtBQVlOQyxXQUFPLE1BWkQ7QUFhTkMsWUFBUSxJQWJGLEVBYVE7QUFDZEMscUJBQWlCLElBZFgsRUFjaUI7QUFDdkJDLFFBZk0sZ0JBZURDLGFBZkMsRUFlY0MsU0FmZCxFQWV5QjtBQUMzQixZQUFJLEtBQUtMLEtBQUwsS0FBZSxNQUFuQixFQUEyQjtBQUN2QixrQkFBTSxJQUFJTSxLQUFKLENBQVUsbUNBQVYsQ0FBTjtBQUNIO0FBQ0QsYUFBS1YsWUFBTCxHQUFvQlMsU0FBcEI7QUFDQSxhQUFLZCxNQUFMLGdCQUFtQixLQUFLQSxNQUF4QixFQUNPYSxhQURQO0FBR0FHLGdCQUFRQyxHQUFSLENBQVksYUFBWixFQUEyQixLQUFLakIsTUFBaEMsRUFBd0MsS0FBS0ssWUFBN0M7QUFDQSxhQUFLSSxLQUFMLEdBQWEsUUFBYjtBQUNILEtBekJLO0FBMEJOUyxXQTFCTSxt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LENBQVVZLE1BQU02QixPQUFoQixDQUFSO0FBQ0F2QiwwQkFBRW1GLElBQUYsR0FBU3pGLE1BQU1tQyxJQUFmO0FBQ0FPLCtCQUFPcEMsQ0FBUDtBQUNIO0FBQ0osaUJBakJNO0FBa0JQUCxzQkFBTSxjQUFVRCxHQUFWLEVBQWU7QUFDakIsd0JBQUlFLFFBQVE7QUFDUm1DLDhCQUFNLGNBREU7QUFFUk4saUNBQVMvQixJQUFJdUM7QUFGTCxxQkFBWjtBQUlBLHdCQUFJL0IsSUFBSSxJQUFJbEIsS0FBSixDQUFVWSxNQUFNNkIsT0FBaEIsQ0FBUjtBQUNBdkIsc0JBQUVtRixJQUFGLEdBQVN6RixNQUFNbUMsSUFBZjtBQUNBTywyQkFBT3BDLENBQVA7QUFDSDtBQTFCTSxhQUFYO0FBNEJILFNBOUJNLENBQVA7QUErQkg7QUExeEJLLENBQVY7O2tCQTZ4QmVsQyxHIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBcHBTb2NrZXQgZnJvbSAnLi9hcHBzb2NrZXQnO1xyXG5pbXBvcnQgbWQ1IGZyb20gJ21kNSc7XHJcbmltcG9ydCAnd2VweS1hc3luYy1mdW5jdGlvbic7XHJcbmltcG9ydCBjbyBmcm9tICdjbyc7XHJcbmltcG9ydCB3ZXB5IGZyb20gJ3dlcHknO1xyXG5cclxuLyogQVBQIOWQr+WKqOa1geeoi++8jOS4gOS4quW6lOeUqOWPquacieS4gOS4qmFwcOWunuS+i++8jOiiq+avj+S4qumhtemdouiwg+eUqCAqL1xyXG4vKiog566h55CG5omA5pyJ55qE5pWw5o2uQ2FjaGUgICovXHJcbnZhciBBcHAgPSB7XHJcbiAgICBjb25maWc6IHtcclxuICAgICAgICB2ZXJzaW9uSW5mbzoge1xyXG4gICAgICAgICAgICBkZXZpY2U6ICdwaG9uZScsXHJcbiAgICAgICAgICAgIHBsYXRmb3JtOiAnd3hfeGN4JyxcclxuICAgICAgICAgICAgdmVyc2lvbjogJ19WRVJTSU9OXycgLy8g54mI5pys5Y+377yMdmVyc2lvbi5qcyDkvJrlnKjnvJbor5HkuYvlkI7mm7/mjaJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgbGF1bmNoT3B0aW9uOiB7fSwgLy8g5ZCv5Yqo5pe25YCZ55qE5Y+C5pWw77yM5a+55LqO5YiG5LqrXHJcbiAgICBwYXNzcG9ydERhdGE6IG51bGwsIC8vIOeUqOaIt+S/oeaBr1xyXG4gICAgZ2VvRGF0YTogbnVsbCwgLy8gR0VP5L+h5oGvXHJcbiAgICBhcHBPcHRpb25zOiBudWxsLFxyXG4gICAgc3RhdGU6ICdpbml0JyxcclxuICAgIHNvY2tldDogbnVsbCwgLy8g6L+e5o6l55qEYXBwc29ja2V0XHJcbiAgICBtZXNzYWdlQ2FsbGJhY2s6IG51bGwsIC8vIOi/nuaOpeeahOa2iOaBr+Wbnuiwg1xyXG4gICAgaW5pdChnbG9iYWxPcHRpb25zLCB3eE9wdGlvbnMpIHtcclxuICAgICAgICBpZiAodGhpcy5zdGF0ZSAhPT0gJ2luaXQnKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignYXBwLmluaXQgY2FuIGJlIGludm9rZWQgb25seSBvbmNlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubGF1bmNoT3B0aW9uID0gd3hPcHRpb25zO1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0geyAuLi50aGlzLmNvbmZpZyxcclxuICAgICAgICAgICAgLi4uZ2xvYmFsT3B0aW9uc1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0FwcCBJbml0ZWQ6JywgdGhpcy5jb25maWcsIHRoaXMubGF1bmNoT3B0aW9uKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0gJ2luaXRlZCc7XHJcbiAgICB9LFxyXG4gICAgcHJlbG9hZCh0eXBlLCBkYXRhKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHR5cGUgPT09ICd1cmwnKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdXJsID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHt9LFxyXG4gICAgICAgICAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncHJlbG9hZCBmYWlsZWQ6JywgdXJsLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2NhY2hlJykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhY2hlS2V5ID0gbWQ1KGRhdGEua2V5KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YUNhY2hlW2NhY2hlS2V5XSA9IGRhdGEudmFsdWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0b3JhZ2UnKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FjaGVLZXkgPSBtZDUoZGF0YS5rZXkpO1xyXG4gICAgICAgICAgICAgICAgd3guc2V0U3RvcmFnZVN5bmMoJ2NhY2hlXycgKyBjYWNoZUtleSwgZGF0YS52YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwcmVsb2FkIGVycm9yOicsIHR5cGUsIGRhdGEsIGUpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyDnu5/kuIDnmoTmlbDmja7orr/pl67mjqXlj6NcclxuICAgIGZldGNoRGF0YSh1cmwsIHBhcmFtcywgY2FsbGJhY2ssIGZldGNoT3B0aW9ucyA9IHt9KSB7XHJcbiAgICAgICAgdmFyIGRlZmF1bHRPcHRpb25zID0ge1xyXG4gICAgICAgICAgICBzaG93TG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgIHNob3dMb2FkaW5nVGl0bGU6ICfmraPlnKjliqDovb3mlbDmja4uLi4nLFxyXG4gICAgICAgICAgICB1c2VDYWNoZTogZmFsc2UsIC8vIOS9v+eUqOW8gOWQr+e8k+WtmO+8jOWmguaenOaYr+WImeS8muaKiuaVsOaNrue8k+WtmOWIsHN0b3JhZ2VcclxuICAgICAgICAgICAgZXhwaXJlVGltZTogNjAgLy8g6buY6K6k57yT5a2Y5pe26Ze0NjDnp5LvvIzlpoLmnpzorr7nva7kuLow77yM56uL5Y2z5aSx5pWIXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0T3B0aW9ucyxcclxuICAgICAgICAgICAgLi4uZmV0Y2hPcHRpb25zXHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgY2FjaGVLZXkgPSBudWxsO1xyXG4gICAgICAgIHZhciBjYWNoZSA9IG51bGw7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMudXNlQ2FjaGUpIHtcclxuICAgICAgICAgICAgY2FjaGVLZXkgPVxyXG4gICAgICAgIG9wdGlvbnMuY2FjaGVLZXkgfHxcclxuICAgICAgICBtZDUodGhpcy5jb25maWcudmVyc2lvbkluZm8udmVyc2lvbiArICdfJyArIHVybCk7IC8vIOi3n+S4gOS4queJiOacrOWPt1xyXG4gICAgICAgICAgICBjYWNoZSA9IHd4LmdldFN0b3JhZ2VTeW5jKCdjYWNoZV8nICsgY2FjaGVLZXkpO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhY2hlID09PSAnJyB8fCBjYWNoZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWNoZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FjaGUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlID0gSlNPTi5wYXJzZShjYWNoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNOYU4oY2FjaGUuZXhwaXJlZCkgfHxcclxuICAgICAgICAgICAgbm93ID4gY2FjaGUuZXhwaXJlZCB8fFxyXG4gICAgICAgICAgICBvcHRpb25zLmV4cGlyZVRpbWUgPT09IDBcclxuICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NhY2hlIGV4cGlyZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3gucmVtb3ZlU3RvcmFnZVN5bmMoY2FjaGVLZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUgPSBjYWNoZS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2ludmFsaWQgY2FjaGU6JyArIGNhY2hlS2V5ICsgJywnICsgZS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY2FjaGUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgLy8g5bey57uP5ZG95LitLOaXoOmcgOaYvuekuui/m+W6plxyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5zaG93TG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvcHRpb25zLnNob3dMb2FkaW5nKSB7XHJcbiAgICAgICAgICAgIC8vIHd4LnNob3dMb2FkaW5nKHtcclxuICAgICAgICAgICAgLy8gICB0aXRsZTogb3B0aW9ucy5zaG93TG9hZGluZ1RpdGxlXHJcbiAgICAgICAgICAgIC8vIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY2FjaGUgIT0gbnVsbCAmJiBvcHRpb25zLnVzZUNhY2hlKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGNhY2hlKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgIGhlYWRlcjoge1xyXG4gICAgICAgICAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIC8vIOm7mOiupOWAvFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBtZXRob2Q6IG9wdGlvbnMubWV0aG9kLFxyXG4gICAgICAgICAgICBkYXRhOiBwYXJhbXMsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnVzZUNhY2hlICYmIG9wdGlvbnMuZXhwaXJlVGltZSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FjaGVTdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGlyZWQ6IG5vdyArIG9wdGlvbnMuZXhwaXJlVGltZSAqIDEwMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHJlcy5kYXRhXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgd3guc2V0U3RvcmFnZVN5bmMoJ2NhY2hlXycgKyBjYWNoZUtleSwgY2FjaGVTdHJpbmcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2socmVzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2hvd0xvYWRpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICB3eC5oaWRlTG9hZGluZygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKDExMTExMTExMTExMSk7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5zaG93TG9hZGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZmV0Y2hEYXRhIGVycm9yOicsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgIGlmIChjYWNoZSAhPT0gbnVsbCAmJiBjYWNoZUtleSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5peg6aG75pu05paw57yT5a2YXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVyck9iaiA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogNTAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiAnTkVUV09SS19FUlJPUicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB8fCBlcnJvci5lcnJNc2dcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyT2JqKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGZldGNoRGF0YVByb21pc2UodXJsLCBwYXJhbXMsIG9wdGlvbnMpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKFwiZmVjdGNoRGF0YSBmcm9tIFwiICsgdXJsICsgXCIscGFyYW1zPVwiLCBwYXJhbXMpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBzZWxmLmZldGNoRGF0YShcclxuICAgICAgICAgICAgICAgIHVybCxcclxuICAgICAgICAgICAgICAgIHBhcmFtcyxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChqc29uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGpzb24uY29kZSA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoanNvbi5tZXNzYWdlcy5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSBqc29uLm1lc3NhZ2VzLmVycm9yO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3Qoc2VsZi50aHJvd0Vycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG9wdGlvbnNcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICAvLyDmo4Dmn6XmmK/lkKblh4blpIfvvIznlLHpobXpnaLoh6rlt7HosIPnlKhcclxuICAgIGNoZWNrUmVhZHkoY2hlY2tPcHRpb24pIHtcclxuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAuLi57XHJcbiAgICAgICAgICAgICAgICB1c2VyOiBmYWxzZSwgLy8g5qOA5p+l55So5oi377yM5aaC5p6c5rKh5pyJ55m75b2V77yM6Kem5Y+R5byC5bi4XHJcbiAgICAgICAgICAgICAgICB1c2VySW5mbzogZmFsc2UsIC8vIOS7heS7heaYr+WKoOi9veeUqOaIt++8jOiAjOS4jeinpuWPkeeZu+W9leW8guW4uFxyXG4gICAgICAgICAgICAgICAgZ2VvOiBmYWxzZSwgLy8g6I635b6XR0VP5pWw5o2uXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zOiBmYWxzZSwgLy8g6I635b6X5Liq5oCn6YCJ6aG5XHJcbiAgICAgICAgICAgICAgICBjb25maWc6IGZhbHNlLCAvLyDojrflvpcg5YWo5bGA6YWN572uXHJcbiAgICAgICAgICAgICAgICByZWZlcjogZmFsc2UgLy8g6I635b6X5YiG5Lqr5L+h5oGvXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC4uLmNoZWNrT3B0aW9uXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zb2xlLmxvZygnY2hlY2tPcHRpb25zOicsIG9wdGlvbnMpO1xyXG4gICAgICAgIHJldHVybiBjbyh0aGlzLl9jaGVja0dlbmVyYXRvcihvcHRpb25zKSk7XHJcbiAgICB9LFxyXG4gICAgKiBfY2hlY2tHZW5lcmF0b3Iob3B0aW9ucykge1xyXG4gICAgICAgIGxldCBkYXRhID0ge307XHJcbiAgICAgICAgLy8g5YWo5bGA5Y+C5pWwLOWPquS8muWIneWni+WMluS4gOasoVxyXG4gICAgICAgIHlpZWxkIHRoaXMuaW5pdEdsb2JhbENvbmZpZygpO1xyXG4gICAgICAgIC8vIOWIneWni+WMliDnlKjmiLdcclxuICAgICAgICAvLyDliLfkuIDkuIt3eENvZGVcclxuICAgICAgICB5aWVsZCB0aGlzLl9nZXRXeENvZGUodHJ1ZSk7XHJcbiAgICAgICAgaWYgKHRoaXMucGFzc3BvcnREYXRhID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFzc3BvcnREYXRhID0geWllbGQgdGhpcy5pbml0UGFzc3BvcnQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wdGlvbnMudXNlcikge1xyXG4gICAgICAgICAgICBjb25zdCBlcnJvciA9IHtcclxuICAgICAgICAgICAgICAgIGNvZGU6ICd1c2VyX2xvZ2luJyxcclxuICAgICAgICAgICAgICAgIC8vIG1lc3NhZ2U6ICcnXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhc3Nwb3J0RGF0YSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgdGhpcy50aHJvd0Vycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyDlpoLmnpznmbvlvZXmiJDlip/vvIzliJ3lp4vljJZBcHBTb2NrZXRcclxuICAgICAgICAgICAgeWllbGQgdGhpcy5pbml0QXBwU29ja2V0KHRoaXMucGFzc3BvcnREYXRhKTtcclxuICAgICAgICAgICAgZGF0YS5wYXNzcG9ydERhdGEgPSB0aGlzLnBhc3Nwb3J0RGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wdGlvbnMudXNlckluZm8gJiYgdGhpcy5wYXNzcG9ydERhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBkYXRhLnBhc3Nwb3J0RGF0YSA9IHRoaXMucGFzc3BvcnREYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob3B0aW9ucy5vcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmFwcE9wdGlvbnMgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXBwT3B0aW9ucyA9IHRoaXMuaW5pdEFwcE9wdGlvbnMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkYXRhLmFwcE9wdGlvbnMgPSB0aGlzLmFwcE9wdGlvbnM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvcHRpb25zLmNvbmZpZykge1xyXG4gICAgICAgICAgICBkYXRhLmNvbmZpZyA9IHRoaXMuY29uZmlnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob3B0aW9ucy5yZWZlciAmJiB0aGlzLmxhdW5jaE9wdGlvbiAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGRhdGEucmVmZXIgPSB5aWVsZCB0aGlzLl9nZXRSZWZlcmVySW5mbyh0aGlzLmxhdW5jaE9wdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMubGF1bmNoT3B0aW9uID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9LFxyXG4gICAgaW5pdEdsb2JhbENvbmZpZygpIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIGNvbmZpZ1VybFxyXG4gICAgICAgIH0gPSB0aGlzLmNvbmZpZztcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgaWYgKGNvbmZpZ1VybCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbml0R2xvYmFsQ29uZmlnLi4uJyk7XHJcbiAgICAgICAgICAgIHZhciB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1JlYWQgY29uZmlndXJhdGlvbiBmcm9tOicgKyBjb25maWdVcmwpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mZXRjaERhdGFQcm9taXNlKGNvbmZpZ1VybCwge1xyXG4gICAgICAgICAgICAgICAgdGltZTogdGltZXN0YW1wXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5nbG9iYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5ZCI5bm2Z2xvYmFsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29uZmlnID0geyAuLi5zZWxmLmNvbmZpZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmRhdGEuZ2xvYmFsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3VwZGF0ZSBnbG9iYWw6JyArIEpTT04uc3RyaW5naWZ5KHRoaXMuZ2xvYmFsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDpgb/lhY3lpJrmrKHliJ3lp4vljJZcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWcuY29uZmlnVXJsID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IGU7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfSxcclxuICAgIGluaXRBcHBPcHRpb25zKCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25TdHIgPSB3eC5nZXRTdG9yYWdlU3luYygnc2V0dGluZ3Nfb3B0aW9ucycpO1xyXG4gICAgICAgICAgICBpZiAob3B0aW9uU3RyICE9IG51bGwgJiYgb3B0aW9uU3RyLmluZGV4T2YoJ3snKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBKU09OLnBhcnNlKG9wdGlvblN0cik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTG9hZCBBcHBPcHRpb25zOicsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdsb2FkT3B0aW9ucyBmYWlsZWQnLCBlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHt9O1xyXG4gICAgfSxcclxuICAgIHVwZGF0ZU9wdGlvbihrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5hcHBPcHRpb25zW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgd3guc2V0U3RvcmFnZSh7XHJcbiAgICAgICAgICAgICAgICBrZXk6ICdzZXR0aW5nc19vcHRpb25zJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHRoaXMuYXBwT3B0aW9ucylcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygndXBkYXRlT3B0aW9ucyBmYWlsZWQnLCBlKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8g5Yid5aeL5YyW55So5oi357O757ufXHJcbiAgICBpbml0UGFzc3BvcnQoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrU1NPUHJvbWlzZShyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2luaXRQYXNzcG9ydC4uLicpO1xyXG4gICAgICAgICAgICB3eC5jaGVja1Nlc3Npb24oe1xyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXNzcG9ydCA9IHd4LmdldFN0b3JhZ2VTeW5jKCdwYXNzcG9ydCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXNzcG9ydCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2hlY2tTU09VcmwgPVxyXG4gICAgICAgICAgICAgIHNlbGYuY29uZmlnLnBhc3Nwb3J0VXJsICsgJ2NoZWNrU1NPLmRvJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNoZWNrU1NPUGFyYW1zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFzc3BvcnQ6IHBhc3Nwb3J0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZmV0Y2hEYXRhUHJvbWlzZShjaGVja1NTT1VybCwgY2hlY2tTU09QYXJhbXMpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS51c2VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnVzZXIuaWQuaW5kZXhPZignXycpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS51c2VyLmlkID0gZGF0YS51c2VyLmlkLnNwbGl0KCdfJylbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjaGVja1Nlc3Npb246JywgZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNoZWNrU1NPUHJvbWlzZShyZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGluaXRBcHBTb2NrZXQocGFzc3BvcnREYXRhKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmFwcFNvY2tldFVybCAmJiBwYXNzcG9ydERhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB2YXIgc29ja2V0VXJsID0gdGhpcy5jb25maWcuYXBwU29ja2V0VXJsO1xyXG4gICAgICAgICAgICBzb2NrZXRVcmwgKz0gJz91c2VySWQ9JyArIHBhc3Nwb3J0RGF0YS5zZXNzaW9uLmlkO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaW5pdCBhcHBzb2NrZXQ6Jywgc29ja2V0VXJsKTtcclxuICAgICAgICAgICAgc2VsZi5zb2NrZXQgPSBuZXcgQXBwU29ja2V0KHNvY2tldFVybCk7XHJcbiAgICAgICAgICAgIHNlbGYuc29ja2V0Lm9uTWVzc2FnZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBqc29uID0gSlNPTi5wYXJzZShkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLm9uTWVzc2FnZShqc29uKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnb25NZXNzYWdlIGVycm9yJywgZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHNlbGYuc29ja2V0LmNvbm5lY3QoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfSxcclxuICAgIHRocm93RXJyb3IoZXJyb3IpIHtcclxuICAgICAgICB3ZXB5LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcclxuICAgICAgICAgICAgY29udGVudDogZXJyb3IubWVzc2FnZSxcclxuICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzLmNvbmZpcm0pIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn55So5oi354K55Ye756Gu5a6aJyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlcy5jYW5jZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn55So5oi354K55Ye75Y+W5raIJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICBlLm5hbWUgPSBlcnJvci5jb2RlO1xyXG4gICAgICAgIHJldHVybiBlO1xyXG4gICAgfSxcclxuICAgICogX3d4TG9naW5HZW5lcmF0b3IoaXYsIGVuY3J5cHRlZERhdGEpIHtcclxuICAgICAgICBjb25zdCBjb2RlID0geWllbGQgdGhpcy5fZ2V0V3hDb2RlKGZhbHNlKTsgLy8g5LiN6IO955So57yT5a2Y77yM5Lya5a+86Ie05Ye66ZSZ77yM5LiN55+l6YGT5Li65LuA5LmI77yfXHJcbiAgICAgICAgY29uc3QgcGFzc3BvcnREYXRhID0geWllbGQgdGhpcy5fbG9naW5QYXNzcG9ydChjb2RlLCBlbmNyeXB0ZWREYXRhLCBpdik7XHJcbiAgICAgICAgLy8g5YaZ5YWl5Yiwc3RvcmFnZVxyXG4gICAgICAgIHd4LnNldFN0b3JhZ2VTeW5jKCdwYXNzcG9ydCcsIHBhc3Nwb3J0RGF0YS5zZXNzaW9uLmlkKTtcclxuICAgICAgICB0aGlzLnBhc3Nwb3J0RGF0YSA9IHBhc3Nwb3J0RGF0YTtcclxuICAgICAgICByZXR1cm4gcGFzc3BvcnREYXRhO1xyXG4gICAgfSxcclxuICAgIGxvZ2luV1goaXYsIGVuY3J5cHRlZERhdGEpIHtcclxuICAgICAgICByZXR1cm4gY28odGhpcy5fd3hMb2dpbkdlbmVyYXRvcihpdiwgZW5jcnlwdGVkRGF0YSkpO1xyXG4gICAgfSxcclxuICAgIC8vIGh0dHBzOi8vbXAud2VpeGluLnFxLmNvbS9kZWJ1Zy93eGFkb2MvZGV2L2FwaS9hcGktbG9naW4uaHRtbCN3eGNoZWNrc2Vzc2lvbm9iamVjdFxyXG4gICAgLy8gIOavj+asoemDveiOt+W+l+S4gOS4quaWsOeahENvZGVcclxuICAgIF9nZXRXeENvZGUodXNlQ2FjaGUgPSBmYWxzZSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgY29kZSA9IHd4LmdldFN0b3JhZ2VTeW5jKCd3eF9jb2RlJyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmdW5jdGlvbiB3eENvZGUoKSB7XHJcbiAgICAgICAgICAgICAgICB3eC5sb2dpbih7XHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY29kZScsIGNvZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUgPSByZXMuY29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHd4LnNldFN0b3JhZ2VTeW5jKFwiY29kZXNcIiwgY29kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIganNvbiA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbi5jbGllbnRUeXBlID0gc2VsZi5jb25maWcuYXBwVHlwZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24uY2xpZW50SWQgPSBzZWxmLmNvbmZpZy5hcHBJZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24uY29kZSA9IGNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uLmFjdGlvbiA9ICdjb2RlNGtleSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmoLnmja7lvZPliY1jb2Rl55Sf5oiQ5LiA5Liqc2Vzc2lvbktleVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5mZXRjaERhdGFQcm9taXNlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29uZmlnLnBhc3Nwb3J0VXJsICsgJ2xvZ2luWENYLmRvJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUgPSBkYXRhLmtleTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3guc2V0U3RvcmFnZVN5bmMoJ3d4X2NvZGUnLCBjb2RlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjb2RlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygyMjIyMjIyMjIyMik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvciA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiAnd3hfbG9naW5fZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHJlcy5lcnJNc2dcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3Qoc2VsZi50aHJvd0Vycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY29kZSAmJiB1c2VDYWNoZSkge1xyXG4gICAgICAgICAgICAgICAgd3guY2hlY2tTZXNzaW9uKHtcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY29kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHd4Q29kZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgd3hDb2RlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBfZ2V0VXNlckluZm8oKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHVzZXJJbmZvKCkge1xyXG4gICAgICAgICAgICAgICAgd3guZ2V0VXNlckluZm8oe1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBsYW5nOiAnemhfQ04nLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2dldFVzZXJJbmZvPScsIHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogJ3VzZXJpbmZvX2Vycm9yJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHJlcy5lcnJNc2dcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHNlbGYudGhyb3dFcnJvcihlcnJvcikpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIOajgOafpeeUqOaIt+iuvue9rlxyXG4gICAgICAgICAgICB3eC5nZXRTZXR0aW5nKHtcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXMuYXV0aFNldHRpbmdbJ3Njb3BlLnVzZXJJbmZvJ10pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3guYXV0aG9yaXplKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlOiAnc2NvcGUudXNlckluZm8nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzcygpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VySW5mbygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhaWwoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiAndXNlcmluZm9fcmVqZWN0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ+eUqOaIt+WPlua2iOaOiOadgydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChzZWxmLnRocm93RXJyb3IoZXJyb3IpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlckluZm8oKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZmFpbCgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6ICd1c2VyaW5mb19mYWlsJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ+ivu+WPlueUqOaIt+iuvue9ruWksei0pSdcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChzZWxmLnRocm93RXJyb3IoZXJyb3IpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgX2xvZ2luUGFzc3BvcnQoY29kZSwgZW5jcnlwdGVkRGF0YSwgaXYpIHtcclxuICAgICAgICB2YXIganNvbiA9IHt9O1xyXG4gICAgICAgIGpzb24uY2xpZW50VHlwZSA9IHRoaXMuY29uZmlnLmFwcFR5cGU7XHJcbiAgICAgICAganNvbi5jbGllbnRJZCA9IHRoaXMuY29uZmlnLmFwcElkO1xyXG4gICAgICAgIGpzb24ua2V5ID0gY29kZTtcclxuICAgICAgICBqc29uLmFjdGlvbiA9ICdsb2dpbkRhdGEnO1xyXG4gICAgICAgIGpzb24uZW5jcnlwdGVkRGF0YSA9IGVuY3J5cHRlZERhdGE7XHJcbiAgICAgICAganNvbi5lbmNyeXB0ZWRJViA9IGl2O1xyXG4gICAgICAgIGpzb24ucmVtZW1iZXIgPSAzNjU7IC8vIDM2NeWkqVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdlbmNyeXB0ZWREYXRhPScgKyBlbmNyeXB0ZWREYXRhKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnZW5jcnlwdGVkSVY9JyArIGl2KTtcclxuICAgICAgICBjb25zb2xlLmxvZygnY29kZT0nICsgY29kZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShcclxuICAgICAgICAgICAgdGhpcy5jb25maWcucGFzc3BvcnRVcmwgKyAnbG9naW5YQ1guZG8nLFxyXG4gICAgICAgICAgICBqc29uXHJcbiAgICAgICAgKTtcclxuICAgIH0sXHJcbiAgICAvLyAg5Y+q5pyJ5YiG5Lqr5Yiw576k5omN5pyJIHNoYXJlVGlja2V077yMIOWIhuS6q+WIsOS4quS6uuaYr+ayoeacieeahFxyXG4gICAgX2dldFJlZmVyZXJJbmZvKG9wdGlvbnMpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnX2dldFJlZmVyZXJJbmZvOicsIG9wdGlvbnMpO1xyXG4gICAgICAgIHZhciByZWZlcmVySWQgPSBvcHRpb25zLnF1ZXJ5LnJlZmVyZXJJZDtcclxuICAgICAgICBpZiAocmVmZXJlcklkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB3eC5sb2dpbih7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ3eExvZ2luOlwiLCByZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZmVyZXJJZDogcmVmZXJlcklkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZmVyZXJDb2RlOiByZXMuY29kZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWNlbmU6IG9wdGlvbnMuc2NlbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogb3B0aW9ucy5wYXRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XHJcbiAgICB9LFxyXG4gICAgb25NZXNzYWdlKGRhdGEpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygncmVjZWl2ZSBhcHAgbWVzc2FnZScsIGRhdGEpO1xyXG4gICAgICAgIGlmICh0aGlzLm1lc3NhZ2VDYWxsYmFjayAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZUNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBsaXN0ZW5NZXNzYWdlKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5tZXNzYWdlQ2FsbGJhY2sgPSBjYWxsYmFjaztcclxuICAgIH0sXHJcbiAgICAvLyBFNDdCMjExNTNGOTZERTk2M0FDMDRFM0YyMjQ3M0UxOTI4QkNEMkI0OTdBMDY2RTREOTg2N0U1NjYyNjk0QUFBXHJcbiAgICAvLyBiaW5kTW9iaWxlUHJvbWlzZShpdiwgZW5jcnlwdGVkRGF0YSwgcGFzc3BvcnRTZXNzaW9uSWQpIHtcclxuICAgIC8vICAgICAvLyDmiYvmnLrnu5HlrppcclxuICAgIC8vICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAvLyAgICAgdmFyIGNvZGUgPSBudWxsO1xyXG4gICAgLy8gICAgIC8vIOeZu+W9leS6pOaNonBhc3Nwb3J0SWRcclxuICAgIC8vICAgICBmdW5jdGlvbiBsb2dpbk1vYmlsZShyZXNvbHZlLCByZWplY3QpIHtcclxuICAgIC8vICAgICAgICAgdmFyIGpzb24gPSB7fTtcclxuICAgIC8vICAgICAgICAganNvbi5jbGllbnRUeXBlID0gc2VsZi5jb25maWcuYXBwVHlwZTtcclxuICAgIC8vICAgICAgICAganNvbi5jbGllbnRJZCA9IHNlbGYuY29uZmlnLmFwcElkO1xyXG4gICAgLy8gICAgICAgICBqc29uLmtleSA9IGNvZGU7XHJcbiAgICAvLyAgICAgICAgIGpzb24uZW5jcnlwdGVkRGF0YSA9IGVuY3J5cHRlZERhdGE7XHJcbiAgICAvLyAgICAgICAgIGpzb24uZW5jcnlwdGVkSVYgPSBpdjtcclxuICAgIC8vICAgICAgICAganNvbi5sb2dpblR5cGUgPSAnbW9iaWxlJztcclxuICAgIC8vICAgICAgICAganNvbi5saW5rID0gdHJ1ZTtcclxuICAgIC8vICAgICAgICAganNvbi5saW5rRm9yY2UgPSB0cnVlO1xyXG4gICAgLy8gICAgICAgICBqc29uLnJlbWVtYmVyID0gMzY1O1xyXG4gICAgLy8gICAgICAgICAvLyDnu5HlrprliLDlvZPliY3nlKjmiLdcclxuICAgIC8vICAgICAgICAganNvbi5wYXNzcG9ydCA9IHBhc3Nwb3J0U2Vzc2lvbklkO1xyXG4gICAgLy8gICAgICAgICAvKiogICovXHJcbiAgICAvLyAgICAgICAgIHNlbGYuZmV0Y2hEYXRhKFxyXG4gICAgLy8gICAgICAgICAgICAgc2VsZi5jb25maWcucGFzc3BvcnRVcmwgKyAnbG9naW5Nb2JpbGUuZG8nLFxyXG4gICAgLy8gICAgICAgICAgICAganNvbixcclxuICAgIC8vICAgICAgICAgICAgIGZ1bmN0aW9uKGpzb24pIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICBpZiAoanNvbi5jb2RlID09PSAyMDApIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2xvZ2luUGFzc3BvcnQ9JyArIEpTT04uc3RyaW5naWZ5KGpzb24pKVxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyB3eC5zZXRTdG9yYWdlU3luYyhcInBhc3Nwb3J0XCIsIGpzb24ubWVzc2FnZXMuZGF0YS5zZXNzaW9uLmlkKTtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShqc29uLm1lc3NhZ2VzLmRhdGEpO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHJlamVjdChqc29uLm1lc3NhZ2VzLmVycm9yKTtcclxuICAgIC8vICAgICAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgICk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAvLyAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgIC8vICAgICAgICAgICAgIHNlbGYuX2dldFd4Q29kZShyZXNvbHZlLCByZWplY3QpO1xyXG4gICAgLy8gICAgICAgICB9KVxyXG4gICAgLy8gICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIGNvZGUgPSBkYXRhO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGxvZ2luTW9iaWxlKHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAvLyAgICAgICAgICAgICB9KVxyXG4gICAgLy8gICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocGFzc3BvcnREYXRhKSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgcmVzb2x2ZShwYXNzcG9ydERhdGEpO1xyXG4gICAgLy8gICAgICAgICAgICAgfSlcclxuICAgIC8vICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihyZWFzb24pIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICByZWplY3QocmVhc29uKTtcclxuICAgIC8vICAgICAgICAgICAgIH0pO1xyXG4gICAgLy8gICAgIH0pO1xyXG4gICAgLy8gfSxcclxuICAgIGJpbmRNb2JpbGVQcm9taXNlKGl2LCBlbmNyeXB0ZWREYXRhLCBwYXNzcG9ydFNlc3Npb25JZCkge1xyXG4gICAgLy8g5omL5py657uR5a6aXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBjb2RlID0gbnVsbDtcclxuICAgICAgICAvLyDnmbvlvZXkuqTmjaJwYXNzcG9ydElkXHJcbiAgICAgICAgICAgIHd4LmxvZ2luKHtcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncmVzJywgcmVzKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGpzb24gPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAganNvbi5rZXkgPSAgd3guZ2V0U3RvcmFnZVN5bmMoJ3d4X2NvZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAganNvbi5jbGllbnRUeXBlID0gc2VsZi5jb25maWcuYXBwVHlwZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAganNvbi5jbGllbnRJZCA9IHNlbGYuY29uZmlnLmFwcElkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uLmVuY3J5cHRlZERhdGEgPSBlbmNyeXB0ZWREYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uLmVuY3J5cHRlZElWID0gaXY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb24ubG9naW5UeXBlID0gJ21vYmlsZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb24ubGluayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb24uY291bnRyeT0gJ0NOJztcclxuICAgICAgICAgICAgICAgICAgICAgICAganNvbi5saW5rRm9yY2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uLnJlbWVtYmVyID0gMzY1O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDnu5HlrprliLDlvZPliY3nlKjmiLdcclxuICAgICAgICAgICAgICAgICAgICAgICAganNvbi5wYXNzcG9ydCA9IHBhc3Nwb3J0U2Vzc2lvbklkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuS8oOWAvFwiLGpzb24pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiogICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZmV0Y2hEYXRhKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25maWcucGFzc3BvcnRVcmwgKyAnbG9naW5Nb2JpbGUuZG8nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChqc29uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJqc29uXCIsanNvbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoanNvbi5jb2RlID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2xvZ2luUGFzc3BvcnQ9JyArIEpTT04uc3RyaW5naWZ5KGpzb24pKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3eC5zZXRTdG9yYWdlU3luYyhcInBhc3Nwb3J0XCIsIGpzb24ubWVzc2FnZXMuZGF0YS5zZXNzaW9uLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShqc29uLm1lc3NhZ2VzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChqc29uLm1lc3NhZ2VzLmVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgdXBsb2FkRmlsZSh1cGxvYWRJdGVtLCBsaXN0ZW5lcikge1xyXG4gICAgICAgIHJldHVybiBjbyh0aGlzLl93eFVwbG9hZEZpbGUodXBsb2FkSXRlbSwgbGlzdGVuZXIpKTtcclxuICAgIH0sXHJcbiAgICAvLyDkuIrkvKDlm77niYdcclxuICAgICogX3d4VXBsb2FkRmlsZSh1cGxvYWRJdGVtLCBsaXN0ZW5lcikge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBjb25zb2xlLmxvZygnc3RhcnRVcGxvYWQ6JywgdXBsb2FkSXRlbS5pbmRleCk7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB5aWVsZCBzZWxmLl9uZXdVcGxvYWQoKTtcclxuICAgICAgICB1cGxvYWRJdGVtLnVwbG9hZFRva2VuID0gZGF0YS50b2tlbjtcclxuICAgICAgICB1cGxvYWRJdGVtLnVwbG9hZFVybCA9IGRhdGEudXBsb2FkVXJsO1xyXG4gICAgICAgIHlpZWxkIHNlbGYuX3VwbG9hZEZpbGUodXBsb2FkSXRlbSwgbGlzdGVuZXIpO1xyXG4gICAgICAgIHlpZWxkIHNlbGYuX3VwbG9hZFF1ZXJ5Q2hlY2sodXBsb2FkSXRlbSwgbGlzdGVuZXIpO1xyXG4gICAgICAgIHZhciBxdWVyeSA9IHlpZWxkIHNlbGYuX3VwbG9hZFF1ZXJ5UmVzdWx0KHVwbG9hZEl0ZW0pO1xyXG4gICAgICAgIGlmIChxdWVyeS5maWxlcyAmJiBxdWVyeS5maWxlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHZhciBpbWFnZVVybCA9IHF1ZXJ5LmZpbGVzWzBdLmltYWdlc1swXS51cmw7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfkuIrkvKDnu5Pmnpw6JyArIGltYWdlVXJsKTtcclxuICAgICAgICAgICAgdXBsb2FkSXRlbS5pbWFnZVVybCA9IGltYWdlVXJsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdXBsb2FkSXRlbTtcclxuICAgIH0sXHJcbiAgICBfbmV3VXBsb2FkKCkge1xyXG4gICAgLy8g6I635b6X5LiA5Liq5LiK5Lyg5Zyw5Z2AXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHZhciB1cGxvYWRVcmwgPSBzZWxmLmNvbmZpZy51cGxvYWRVcmwgKyAndXBsb2FkLmRvJztcclxuICAgICAgICAgICAgd3gucmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHVwbG9hZFVybCxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2dldCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAndXBsb2FkJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW1hZ2UnLFxyXG4gICAgICAgICAgICAgICAgICAgIGFwcElkOiBzZWxmLmNvbmZpZy51cGxvYWRBcHBJZFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGpzb24gPSByZXMuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoanNvbi5jb2RlID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShqc29uLm1lc3NhZ2VzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yID0ganNvbi5tZXNzYWdlcy5lcnJvcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZmFpbChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6ICd1cGxvYWRfZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiByZXMuZXJyTXNnXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICBlLm5hbWUgPSBlcnJvci5jb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgLy8g5LiK5Lyg5paH5Lu255qE5YW35L2TXHJcbiAgICBfdXBsb2FkRmlsZSh1cGxvYWRJdGVtLCBsaXN0ZW5lcikge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVwbG9hZFRhc2sgPSB3eC51cGxvYWRGaWxlKHtcclxuICAgICAgICAgICAgICAgIHVybDogdXBsb2FkSXRlbS51cGxvYWRVcmwsXHJcbiAgICAgICAgICAgICAgICBmaWxlUGF0aDogdXBsb2FkSXRlbS5maWxlLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2ZpbGUnLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1c0NvZGUgIT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiAndXBsb2FkX2Vycm9yJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdIVFRQ6ZSZ6K+vOicgKyByZXMuc3RhdHVzQ29kZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5uYW1lID0gZXJyb3IuY29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodXBsb2FkSXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZhaWwocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiAndXBsb2FkX2Vycm9yJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogcmVzLmVyck1zZ1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5uYW1lID0gZXJyb3IuY29kZTtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvLyDnm5HmjqfkuIrkvKDov5vluqZcclxuICAgICAgICAgICAgdXBsb2FkVGFzay5vblByb2dyZXNzVXBkYXRlKHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0ucHJvZ3Jlc3MgPSByZXMucHJvZ3Jlc3M7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVwbG9hZEl0ZW0ucHJvZ3Jlc3MgPiA5OSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLnByb2dyZXNzID0gOTk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyKHVwbG9hZEl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+S4iuS8oOi/m+W6picsIHJlcy5wcm9ncmVzcyk7XHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ+W3sue7j+S4iuS8oOeahOaVsOaNrumVv+W6picsIHJlcy50b3RhbEJ5dGVzU2VudCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXHJcbiAgICAgICAgICAgICfpooTmnJ/pnIDopoHkuIrkvKDnmoTmlbDmja7mgLvplb/luqYnLFxyXG4gICAgICAgICAgICByZXMudG90YWxCeXRlc0V4cGVjdGVkVG9TZW5kXHJcbiAgICAgICAgKTtcclxuICAgICAgICAqL1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICAvLyDnoa7orqTmnI3liqHlmajlt7Lnu4/mlLbliLDmiYDmnInmlbDmja5cclxuICAgIF91cGxvYWRRdWVyeUNoZWNrKHVwbG9hZEl0ZW0sIGxpc3RlbmVyKSB7XHJcbiAgICAgICAgdmFyIHVwbG9hZFVybCA9IHVwbG9hZEl0ZW0udXBsb2FkVXJsO1xyXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrRmluaXNoZWQocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiB1cGxvYWRVcmwsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gcmVzLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NoZWNrIHVwbG9hZCBmaW5pc2hlZDonLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdmaW5pc2gnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lciAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLnByb2dyZXNzID0gMTAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIodXBsb2FkSXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrRmluaXNoZWQocmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6ICd1cGxvYWRfZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiByZXMuZXJyTXNnXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncXVlcnkgc2VydmVyIGVycm9yLHdpbGwgcmV0cnk6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja0ZpbmlzaGVkKHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY2hlY2tGaW5pc2hlZChyZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIF91cGxvYWRRdWVyeVJlc3VsdCh1cGxvYWRJdGVtKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHZhciB1cGxvYWRVcmwgPSBzZWxmLmNvbmZpZy51cGxvYWRVcmwgKyAndXBsb2FkLmRvJztcclxuICAgICAgICAgICAgd3gucmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHVwbG9hZFVybCxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2dldCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAncXVlcnknLFxyXG4gICAgICAgICAgICAgICAgICAgIHRva2VuOiB1cGxvYWRJdGVtLnVwbG9hZFRva2VuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBqc29uID0gcmVzLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGpzb24uY29kZSA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoanNvbi5tZXNzYWdlcy5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvciA9IGpzb24ubWVzc2FnZXMuZXJyb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLm5hbWUgPSBlcnJvci5jb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6ICd1cGxvYWRfZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiByZXMuZXJyTXNnXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICBlLm5hbWUgPSBlcnJvci5jb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBBcHA7XHJcbiJdfQ==