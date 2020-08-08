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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJBcHAiLCJjb25maWciLCJ2ZXJzaW9uSW5mbyIsImRldmljZSIsInBsYXRmb3JtIiwidmVyc2lvbiIsImxhdW5jaE9wdGlvbiIsInBhc3Nwb3J0RGF0YSIsImdlb0RhdGEiLCJhcHBPcHRpb25zIiwic3RhdGUiLCJzb2NrZXQiLCJtZXNzYWdlQ2FsbGJhY2siLCJpbml0IiwiZ2xvYmFsT3B0aW9ucyIsInd4T3B0aW9ucyIsIkVycm9yIiwiY29uc29sZSIsImxvZyIsInByZWxvYWQiLCJ0eXBlIiwiZGF0YSIsInVybCIsInd4IiwicmVxdWVzdCIsInN1Y2Nlc3MiLCJyZXMiLCJmYWlsIiwiZXJyb3IiLCJjYWNoZUtleSIsImtleSIsImRhdGFDYWNoZSIsInZhbHVlIiwic2V0U3RvcmFnZVN5bmMiLCJlIiwiZmV0Y2hEYXRhIiwicGFyYW1zIiwiY2FsbGJhY2siLCJmZXRjaE9wdGlvbnMiLCJkZWZhdWx0T3B0aW9ucyIsInNob3dMb2FkaW5nIiwibWV0aG9kIiwic2hvd0xvYWRpbmdUaXRsZSIsInVzZUNhY2hlIiwiZXhwaXJlVGltZSIsIm9wdGlvbnMiLCJjYWNoZSIsImdldFN0b3JhZ2VTeW5jIiwibGVuZ3RoIiwiSlNPTiIsInBhcnNlIiwibm93IiwiRGF0ZSIsImdldFRpbWUiLCJpc05hTiIsImV4cGlyZWQiLCJyZW1vdmVTdG9yYWdlU3luYyIsIm1lc3NhZ2UiLCJoZWFkZXIiLCJjYWNoZVN0cmluZyIsInN0cmluZ2lmeSIsImhpZGVMb2FkaW5nIiwiZXJyT2JqIiwiY29kZSIsIm1lc3NhZ2VzIiwiZXJyTXNnIiwiZmV0Y2hEYXRhUHJvbWlzZSIsInNlbGYiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImpzb24iLCJ0aHJvd0Vycm9yIiwiY2hlY2tSZWFkeSIsImNoZWNrT3B0aW9uIiwidXNlciIsInVzZXJJbmZvIiwiZ2VvIiwicmVmZXIiLCJfY2hlY2tHZW5lcmF0b3IiLCJpbml0R2xvYmFsQ29uZmlnIiwiX2dldFd4Q29kZSIsImluaXRQYXNzcG9ydCIsImluaXRBcHBTb2NrZXQiLCJpbml0QXBwT3B0aW9ucyIsIl9nZXRSZWZlcmVySW5mbyIsImNvbmZpZ1VybCIsInRpbWVzdGFtcCIsInRpbWUiLCJ0aGVuIiwiZ2xvYmFsIiwiY2F0Y2giLCJvcHRpb25TdHIiLCJpbmRleE9mIiwidXBkYXRlT3B0aW9uIiwic2V0U3RvcmFnZSIsImNoZWNrU1NPUHJvbWlzZSIsImNoZWNrU2Vzc2lvbiIsInBhc3Nwb3J0IiwiY2hlY2tTU09VcmwiLCJwYXNzcG9ydFVybCIsImNoZWNrU1NPUGFyYW1zIiwiaWQiLCJzcGxpdCIsImFwcFNvY2tldFVybCIsInNvY2tldFVybCIsInNlc3Npb24iLCJBcHBTb2NrZXQiLCJvbk1lc3NhZ2UiLCJjb25uZWN0Iiwid2VweSIsInNob3dNb2RhbCIsInRpdGxlIiwiY29udGVudCIsInNob3dDYW5jZWwiLCJjb25maXJtIiwiY2FuY2VsIiwibmFtZSIsIl93eExvZ2luR2VuZXJhdG9yIiwiaXYiLCJlbmNyeXB0ZWREYXRhIiwiX2xvZ2luUGFzc3BvcnQiLCJsb2dpbldYIiwid3hDb2RlIiwibG9naW4iLCJjbGllbnRUeXBlIiwiYXBwVHlwZSIsImNsaWVudElkIiwiYXBwSWQiLCJhY3Rpb24iLCJfZ2V0VXNlckluZm8iLCJnZXRVc2VySW5mbyIsImxhbmciLCJnZXRTZXR0aW5nIiwiYXV0aFNldHRpbmciLCJhdXRob3JpemUiLCJzY29wZSIsImVuY3J5cHRlZElWIiwicmVtZW1iZXIiLCJyZWZlcmVySWQiLCJxdWVyeSIsImNvbXBsZXRlIiwicmVmZXJlckNvZGUiLCJzZWNlbmUiLCJzY2VuZSIsInBhdGgiLCJsaXN0ZW5NZXNzYWdlIiwiYmluZE1vYmlsZVByb21pc2UiLCJwYXNzcG9ydFNlc3Npb25JZCIsImxvZ2luVHlwZSIsImxpbmsiLCJjb3VudHJ5IiwibGlua0ZvcmNlIiwidXBsb2FkRmlsZSIsInVwbG9hZEl0ZW0iLCJsaXN0ZW5lciIsIl93eFVwbG9hZEZpbGUiLCJpbmRleCIsIl9uZXdVcGxvYWQiLCJ1cGxvYWRUb2tlbiIsInRva2VuIiwidXBsb2FkVXJsIiwiX3VwbG9hZEZpbGUiLCJfdXBsb2FkUXVlcnlDaGVjayIsIl91cGxvYWRRdWVyeVJlc3VsdCIsImZpbGVzIiwiaW1hZ2VVcmwiLCJpbWFnZXMiLCJ1cGxvYWRBcHBJZCIsInVwbG9hZFRhc2siLCJmaWxlUGF0aCIsImZpbGUiLCJzdGF0dXNDb2RlIiwib25Qcm9ncmVzc1VwZGF0ZSIsInByb2dyZXNzIiwiY2hlY2tGaW5pc2hlZCIsInN0YXR1cyIsInNldFRpbWVvdXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBO0FBQ0E7QUFDQSxJQUFJQSxNQUFNO0FBQ05DLFlBQVE7QUFDSkMscUJBQWE7QUFDVEMsb0JBQVEsT0FEQztBQUVUQyxzQkFBVSxRQUZEO0FBR1RDLHFCQUFTLFdBSEEsQ0FHWTtBQUhaO0FBRFQsS0FERjtBQVFOQyxrQkFBYyxFQVJSLEVBUVk7QUFDbEJDLGtCQUFjLElBVFIsRUFTYztBQUNwQkMsYUFBUyxJQVZILEVBVVM7QUFDZkMsZ0JBQVksSUFYTjtBQVlOQyxXQUFPLE1BWkQ7QUFhTkMsWUFBUSxJQWJGLEVBYVE7QUFDZEMscUJBQWlCLElBZFgsRUFjaUI7QUFDdkJDLFFBZk0sZ0JBZURDLGFBZkMsRUFlY0MsU0FmZCxFQWV5QjtBQUMzQixZQUFJLEtBQUtMLEtBQUwsS0FBZSxNQUFuQixFQUEyQjtBQUN2QixrQkFBTSxJQUFJTSxLQUFKLENBQVUsbUNBQVYsQ0FBTjtBQUNIO0FBQ0QsYUFBS1YsWUFBTCxHQUFvQlMsU0FBcEI7QUFDQSxhQUFLZCxNQUFMLGdCQUNPLEtBQUtBLE1BRFosRUFFT2EsYUFGUDtBQUlBRyxnQkFBUUMsR0FBUixDQUFZLGFBQVosRUFBMkIsS0FBS2pCLE1BQWhDLEVBQXdDLEtBQUtLLFlBQTdDO0FBQ0EsYUFBS0ksS0FBTCxHQUFhLFFBQWI7QUFDSCxLQTFCSztBQTJCTlMsV0EzQk0sbUJB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QUFVWSxNQUFNNkIsT0FBaEIsQ0FBUjtBQUNBdkIsMEJBQUVtRixJQUFGLEdBQVN6RixNQUFNbUMsSUFBZjtBQUNBTywrQkFBT3BDLENBQVA7QUFDSDtBQUNKLGlCQWpCTTtBQWtCUFAsc0JBQU0sY0FBVUQsR0FBVixFQUFlO0FBQ2pCLHdCQUFJRSxRQUFRO0FBQ1JtQyw4QkFBTSxjQURFO0FBRVJOLGlDQUFTL0IsSUFBSXVDO0FBRkwscUJBQVo7QUFJQSx3QkFBSS9CLElBQUksSUFBSWxCLEtBQUosQ0FBVVksTUFBTTZCLE9BQWhCLENBQVI7QUFDQXZCLHNCQUFFbUYsSUFBRixHQUFTekYsTUFBTW1DLElBQWY7QUFDQU8sMkJBQU9wQyxDQUFQO0FBQ0g7QUExQk0sYUFBWDtBQTRCSCxTQTlCTSxDQUFQO0FBK0JIO0FBN3hCSyxDQUFWOztrQkFneUJlbEMsRyIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXBwU29ja2V0IGZyb20gJy4vYXBwc29ja2V0JztcclxuaW1wb3J0IG1kNSBmcm9tICdtZDUnO1xyXG5pbXBvcnQgJ3dlcHktYXN5bmMtZnVuY3Rpb24nO1xyXG5pbXBvcnQgY28gZnJvbSAnY28nO1xyXG5pbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcclxuXHJcbi8qIEFQUCDlkK/liqjmtYHnqIvvvIzkuIDkuKrlupTnlKjlj6rmnInkuIDkuKphcHDlrp7kvovvvIzooqvmr4/kuKrpobXpnaLosIPnlKggKi9cclxuLyoqIOeuoeeQhuaJgOacieeahOaVsOaNrkNhY2hlICAqL1xyXG52YXIgQXBwID0ge1xyXG4gICAgY29uZmlnOiB7XHJcbiAgICAgICAgdmVyc2lvbkluZm86IHtcclxuICAgICAgICAgICAgZGV2aWNlOiAncGhvbmUnLFxyXG4gICAgICAgICAgICBwbGF0Zm9ybTogJ3d4X3hjeCcsXHJcbiAgICAgICAgICAgIHZlcnNpb246ICdfVkVSU0lPTl8nIC8vIOeJiOacrOWPt++8jHZlcnNpb24uanMg5Lya5Zyo57yW6K+R5LmL5ZCO5pu/5o2iXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGxhdW5jaE9wdGlvbjoge30sIC8vIOWQr+WKqOaXtuWAmeeahOWPguaVsO+8jOWvueS6juWIhuS6q1xyXG4gICAgcGFzc3BvcnREYXRhOiBudWxsLCAvLyDnlKjmiLfkv6Hmga9cclxuICAgIGdlb0RhdGE6IG51bGwsIC8vIEdFT+S/oeaBr1xyXG4gICAgYXBwT3B0aW9uczogbnVsbCxcclxuICAgIHN0YXRlOiAnaW5pdCcsXHJcbiAgICBzb2NrZXQ6IG51bGwsIC8vIOi/nuaOpeeahGFwcHNvY2tldFxyXG4gICAgbWVzc2FnZUNhbGxiYWNrOiBudWxsLCAvLyDov57mjqXnmoTmtojmga/lm57osINcclxuICAgIGluaXQoZ2xvYmFsT3B0aW9ucywgd3hPcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT09ICdpbml0Jykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FwcC5pbml0IGNhbiBiZSBpbnZva2VkIG9ubHkgb25jZScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxhdW5jaE9wdGlvbiA9IHd4T3B0aW9ucztcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IHtcclxuICAgICAgICAgICAgLi4udGhpcy5jb25maWcsXHJcbiAgICAgICAgICAgIC4uLmdsb2JhbE9wdGlvbnNcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdBcHAgSW5pdGVkOicsIHRoaXMuY29uZmlnLCB0aGlzLmxhdW5jaE9wdGlvbik7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdpbml0ZWQnO1xyXG4gICAgfSxcclxuICAgIHByZWxvYWQodHlwZSwgZGF0YSkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlID09PSAndXJsJykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHVybCA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZmFpbDogZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwcmVsb2FkIGZhaWxlZDonLCB1cmwsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnY2FjaGUnKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FjaGVLZXkgPSBtZDUoZGF0YS5rZXkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhQ2FjaGVbY2FjaGVLZXldID0gZGF0YS52YWx1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnc3RvcmFnZScpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjYWNoZUtleSA9IG1kNShkYXRhLmtleSk7XHJcbiAgICAgICAgICAgICAgICB3eC5zZXRTdG9yYWdlU3luYygnY2FjaGVfJyArIGNhY2hlS2V5LCBkYXRhLnZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3ByZWxvYWQgZXJyb3I6JywgdHlwZSwgZGF0YSwgZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIOe7n+S4gOeahOaVsOaNruiuv+mXruaOpeWPo1xyXG4gICAgZmV0Y2hEYXRhKHVybCwgcGFyYW1zLCBjYWxsYmFjaywgZmV0Y2hPcHRpb25zID0ge30pIHtcclxuICAgICAgICB2YXIgZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHNob3dMb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgc2hvd0xvYWRpbmdUaXRsZTogJ+ato+WcqOWKoOi9veaVsOaNri4uLicsXHJcbiAgICAgICAgICAgIHVzZUNhY2hlOiBmYWxzZSwgLy8g5L2/55So5byA5ZCv57yT5a2Y77yM5aaC5p6c5piv5YiZ5Lya5oqK5pWw5o2u57yT5a2Y5Yiwc3RvcmFnZVxyXG4gICAgICAgICAgICBleHBpcmVUaW1lOiA2MCAvLyDpu5jorqTnvJPlrZjml7bpl7Q2MOenku+8jOWmguaenOiuvue9ruS4ujDvvIznq4vljbPlpLHmlYhcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIC4uLmRlZmF1bHRPcHRpb25zLFxyXG4gICAgICAgICAgICAuLi5mZXRjaE9wdGlvbnNcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciBjYWNoZUtleSA9IG51bGw7XHJcbiAgICAgICAgdmFyIGNhY2hlID0gbnVsbDtcclxuICAgICAgICBpZiAob3B0aW9ucy51c2VDYWNoZSkge1xyXG4gICAgICAgICAgICBjYWNoZUtleSA9XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLmNhY2hlS2V5IHx8XHJcbiAgICAgICAgICAgICAgICBtZDUodGhpcy5jb25maWcudmVyc2lvbkluZm8udmVyc2lvbiArICdfJyArIHVybCk7IC8vIOi3n+S4gOS4queJiOacrOWPt1xyXG4gICAgICAgICAgICBjYWNoZSA9IHd4LmdldFN0b3JhZ2VTeW5jKCdjYWNoZV8nICsgY2FjaGVLZXkpO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhY2hlID09PSAnJyB8fCBjYWNoZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWNoZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FjaGUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlID0gSlNPTi5wYXJzZShjYWNoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNOYU4oY2FjaGUuZXhwaXJlZCkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm93ID4gY2FjaGUuZXhwaXJlZCB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmV4cGlyZVRpbWUgPT09IDBcclxuICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NhY2hlIGV4cGlyZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3gucmVtb3ZlU3RvcmFnZVN5bmMoY2FjaGVLZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUgPSBjYWNoZS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2ludmFsaWQgY2FjaGU6JyArIGNhY2hlS2V5ICsgJywnICsgZS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY2FjaGUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgLy8g5bey57uP5ZG95LitLOaXoOmcgOaYvuekuui/m+W6plxyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5zaG93TG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvcHRpb25zLnNob3dMb2FkaW5nKSB7XHJcbiAgICAgICAgICAgIC8vIHd4LnNob3dMb2FkaW5nKHtcclxuICAgICAgICAgICAgLy8gICB0aXRsZTogb3B0aW9ucy5zaG93TG9hZGluZ1RpdGxlXHJcbiAgICAgICAgICAgIC8vIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY2FjaGUgIT0gbnVsbCAmJiBvcHRpb25zLnVzZUNhY2hlKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGNhY2hlKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgIGhlYWRlcjoge1xyXG4gICAgICAgICAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIC8vIOm7mOiupOWAvFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBtZXRob2Q6IG9wdGlvbnMubWV0aG9kLFxyXG4gICAgICAgICAgICBkYXRhOiBwYXJhbXMsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnVzZUNhY2hlICYmIG9wdGlvbnMuZXhwaXJlVGltZSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FjaGVTdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGlyZWQ6IG5vdyArIG9wdGlvbnMuZXhwaXJlVGltZSAqIDEwMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHJlcy5kYXRhXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgd3guc2V0U3RvcmFnZVN5bmMoJ2NhY2hlXycgKyBjYWNoZUtleSwgY2FjaGVTdHJpbmcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2socmVzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2hvd0xvYWRpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICB3eC5oaWRlTG9hZGluZygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKDExMTExMTExMTExMSk7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5zaG93TG9hZGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZmV0Y2hEYXRhIGVycm9yOicsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgIGlmIChjYWNoZSAhPT0gbnVsbCAmJiBjYWNoZUtleSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5peg6aG75pu05paw57yT5a2YXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVyck9iaiA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogNTAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiAnTkVUV09SS19FUlJPUicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB8fCBlcnJvci5lcnJNc2dcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyT2JqKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGZldGNoRGF0YVByb21pc2UodXJsLCBwYXJhbXMsIG9wdGlvbnMpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImZlY3RjaERhdGEgZnJvbSBcIiArIHVybCArIFwiLHBhcmFtcz1cIiwgcGFyYW1zKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgc2VsZi5mZXRjaERhdGEoXHJcbiAgICAgICAgICAgICAgICB1cmwsXHJcbiAgICAgICAgICAgICAgICBwYXJhbXMsXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoanNvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChqc29uLmNvZGUgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGpzb24ubWVzc2FnZXMuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0ganNvbi5tZXNzYWdlcy5lcnJvcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHNlbGYudGhyb3dFcnJvcihlcnJvcikpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgLy8g5qOA5p+l5piv5ZCm5YeG5aSH77yM55Sx6aG16Z2i6Ieq5bex6LCD55SoXHJcbiAgICBjaGVja1JlYWR5KGNoZWNrT3B0aW9uKSB7XHJcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgLi4ue1xyXG4gICAgICAgICAgICAgICAgdXNlcjogZmFsc2UsIC8vIOajgOafpeeUqOaIt++8jOWmguaenOayoeacieeZu+W9le+8jOinpuWPkeW8guW4uFxyXG4gICAgICAgICAgICAgICAgdXNlckluZm86IGZhbHNlLCAvLyDku4Xku4XmmK/liqDovb3nlKjmiLfvvIzogIzkuI3op6blj5HnmbvlvZXlvILluLhcclxuICAgICAgICAgICAgICAgIGdlbzogZmFsc2UsIC8vIOiOt+W+l0dFT+aVsOaNrlxyXG4gICAgICAgICAgICAgICAgb3B0aW9uczogZmFsc2UsIC8vIOiOt+W+l+S4quaAp+mAiemhuVxyXG4gICAgICAgICAgICAgICAgY29uZmlnOiBmYWxzZSwgLy8g6I635b6XIOWFqOWxgOmFjee9rlxyXG4gICAgICAgICAgICAgICAgcmVmZXI6IGZhbHNlIC8vIOiOt+W+l+WIhuS6q+S/oeaBr1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAuLi5jaGVja09wdGlvblxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NoZWNrT3B0aW9uczonLCBvcHRpb25zKTtcclxuICAgICAgICByZXR1cm4gY28odGhpcy5fY2hlY2tHZW5lcmF0b3Iob3B0aW9ucykpO1xyXG4gICAgfSxcclxuICAgICogX2NoZWNrR2VuZXJhdG9yKG9wdGlvbnMpIHtcclxuICAgICAgICBsZXQgZGF0YSA9IHt9O1xyXG4gICAgICAgIC8vIOWFqOWxgOWPguaVsCzlj6rkvJrliJ3lp4vljJbkuIDmrKFcclxuICAgICAgICB5aWVsZCB0aGlzLmluaXRHbG9iYWxDb25maWcoKTtcclxuICAgICAgICAvLyDliJ3lp4vljJYg55So5oi3XHJcbiAgICAgICAgLy8g5Yi35LiA5LiLd3hDb2RlXHJcbiAgICAgICAgeWllbGQgdGhpcy5fZ2V0V3hDb2RlKHRydWUpO1xyXG4gICAgICAgIGlmICh0aGlzLnBhc3Nwb3J0RGF0YSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhc3Nwb3J0RGF0YSA9IHlpZWxkIHRoaXMuaW5pdFBhc3Nwb3J0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvcHRpb25zLnVzZXIpIHtcclxuICAgICAgICAgICAgY29uc3QgZXJyb3IgPSB7XHJcbiAgICAgICAgICAgICAgICBjb2RlOiAndXNlcl9sb2dpbicsXHJcbiAgICAgICAgICAgICAgICAvLyBtZXNzYWdlOiAnJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wYXNzcG9ydERhdGEgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IHRoaXMudGhyb3dFcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8g5aaC5p6c55m75b2V5oiQ5Yqf77yM5Yid5aeL5YyWQXBwU29ja2V0XHJcbiAgICAgICAgICAgIHlpZWxkIHRoaXMuaW5pdEFwcFNvY2tldCh0aGlzLnBhc3Nwb3J0RGF0YSk7XHJcbiAgICAgICAgICAgIGRhdGEucGFzc3BvcnREYXRhID0gdGhpcy5wYXNzcG9ydERhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvcHRpb25zLnVzZXJJbmZvICYmIHRoaXMucGFzc3BvcnREYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgZGF0YS5wYXNzcG9ydERhdGEgPSB0aGlzLnBhc3Nwb3J0RGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wdGlvbnMub3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5hcHBPcHRpb25zID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFwcE9wdGlvbnMgPSB0aGlzLmluaXRBcHBPcHRpb25zKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGF0YS5hcHBPcHRpb25zID0gdGhpcy5hcHBPcHRpb25zO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob3B0aW9ucy5jb25maWcpIHtcclxuICAgICAgICAgICAgZGF0YS5jb25maWcgPSB0aGlzLmNvbmZpZztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wdGlvbnMucmVmZXIgJiYgdGhpcy5sYXVuY2hPcHRpb24gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBkYXRhLnJlZmVyID0geWllbGQgdGhpcy5fZ2V0UmVmZXJlckluZm8odGhpcy5sYXVuY2hPcHRpb24pO1xyXG4gICAgICAgICAgICB0aGlzLmxhdW5jaE9wdGlvbiA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfSxcclxuICAgIGluaXRHbG9iYWxDb25maWcoKSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBjb25maWdVcmxcclxuICAgICAgICB9ID0gdGhpcy5jb25maWc7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGlmIChjb25maWdVcmwgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaW5pdEdsb2JhbENvbmZpZy4uLicpO1xyXG4gICAgICAgICAgICB2YXIgdGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZWFkIGNvbmZpZ3VyYXRpb24gZnJvbTonICsgY29uZmlnVXJsKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShjb25maWdVcmwsIHtcclxuICAgICAgICAgICAgICAgIHRpbWU6IHRpbWVzdGFtcFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZ2xvYmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWQiOW5tmdsb2JhbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbmZpZyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnNlbGYuY29uZmlnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uZGF0YS5nbG9iYWxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndXBkYXRlIGdsb2JhbDonICsgSlNPTi5zdHJpbmdpZnkodGhpcy5nbG9iYWwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOmBv+WFjeWkmuasoeWIneWni+WMllxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5jb25maWdVcmwgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9LFxyXG4gICAgaW5pdEFwcE9wdGlvbnMoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdmFyIG9wdGlvblN0ciA9IHd4LmdldFN0b3JhZ2VTeW5jKCdzZXR0aW5nc19vcHRpb25zJyk7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25TdHIgIT0gbnVsbCAmJiBvcHRpb25TdHIuaW5kZXhPZigneycpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IEpTT04ucGFyc2Uob3B0aW9uU3RyKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdMb2FkIEFwcE9wdGlvbnM6Jywgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3B0aW9ucztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2xvYWRPcHRpb25zIGZhaWxlZCcsIGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge307XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlT3B0aW9uKGtleSwgdmFsdWUpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLmFwcE9wdGlvbnNba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB3eC5zZXRTdG9yYWdlKHtcclxuICAgICAgICAgICAgICAgIGtleTogJ3NldHRpbmdzX29wdGlvbnMnLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkodGhpcy5hcHBPcHRpb25zKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd1cGRhdGVPcHRpb25zIGZhaWxlZCcsIGUpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyDliJ3lp4vljJbnlKjmiLfns7vnu59cclxuICAgIGluaXRQYXNzcG9ydCgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgZnVuY3Rpb24gY2hlY2tTU09Qcm9taXNlKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaW5pdFBhc3Nwb3J0Li4uJyk7XHJcbiAgICAgICAgICAgIHd4LmNoZWNrU2Vzc2lvbih7XHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhc3Nwb3J0ID0gd3guZ2V0U3RvcmFnZVN5bmMoJ3Bhc3Nwb3J0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhc3Nwb3J0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjaGVja1NTT1VybCA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbmZpZy5wYXNzcG9ydFVybCArICdjaGVja1NTTy5kbyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjaGVja1NTT1BhcmFtcyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3Nwb3J0OiBwYXNzcG9ydFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmZldGNoRGF0YVByb21pc2UoY2hlY2tTU09VcmwsIGNoZWNrU1NPUGFyYW1zKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEudXNlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS51c2VyLmlkLmluZGV4T2YoJ18nKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEudXNlci5pZCA9IGRhdGEudXNlci5pZC5zcGxpdCgnXycpWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZmFpbDogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2hlY2tTZXNzaW9uOicsIGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjaGVja1NTT1Byb21pc2UocmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBpbml0QXBwU29ja2V0KHBhc3Nwb3J0RGF0YSkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5hcHBTb2NrZXRVcmwgJiYgcGFzc3BvcnREYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdmFyIHNvY2tldFVybCA9IHRoaXMuY29uZmlnLmFwcFNvY2tldFVybDtcclxuICAgICAgICAgICAgc29ja2V0VXJsICs9ICc/dXNlcklkPScgKyBwYXNzcG9ydERhdGEuc2Vzc2lvbi5pZDtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2luaXQgYXBwc29ja2V0OicsIHNvY2tldFVybCk7XHJcbiAgICAgICAgICAgIHNlbGYuc29ja2V0ID0gbmV3IEFwcFNvY2tldChzb2NrZXRVcmwpO1xyXG4gICAgICAgICAgICBzZWxmLnNvY2tldC5vbk1lc3NhZ2UgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIganNvbiA9IEpTT04ucGFyc2UoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5vbk1lc3NhZ2UoanNvbik7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ29uTWVzc2FnZSBlcnJvcicsIGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBzZWxmLnNvY2tldC5jb25uZWN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH0sXHJcbiAgICB0aHJvd0Vycm9yKGVycm9yKSB7XHJcbiAgICAgICAgd2VweS5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IGVycm9yLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlLFxyXG4gICAgICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcy5jb25maXJtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+eUqOaIt+eCueWHu+ehruWumicpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXMuY2FuY2VsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+eUqOaIt+eCueWHu+WPlua2iCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgZS5uYW1lID0gZXJyb3IuY29kZTtcclxuICAgICAgICByZXR1cm4gZTtcclxuICAgIH0sXHJcbiAgICAqIF93eExvZ2luR2VuZXJhdG9yKGl2LCBlbmNyeXB0ZWREYXRhKSB7XHJcbiAgICAgICAgY29uc3QgY29kZSA9IHlpZWxkIHRoaXMuX2dldFd4Q29kZShmYWxzZSk7IC8vIOS4jeiDveeUqOe8k+WtmO+8jOS8muWvvOiHtOWHuumUme+8jOS4jeefpemBk+S4uuS7gOS5iO+8n1xyXG4gICAgICAgIGNvbnN0IHBhc3Nwb3J0RGF0YSA9IHlpZWxkIHRoaXMuX2xvZ2luUGFzc3BvcnQoY29kZSwgZW5jcnlwdGVkRGF0YSwgaXYpO1xyXG4gICAgICAgIC8vIOWGmeWFpeWIsHN0b3JhZ2VcclxuICAgICAgICB3eC5zZXRTdG9yYWdlU3luYygncGFzc3BvcnQnLCBwYXNzcG9ydERhdGEuc2Vzc2lvbi5pZCk7XHJcbiAgICAgICAgdGhpcy5wYXNzcG9ydERhdGEgPSBwYXNzcG9ydERhdGE7XHJcbiAgICAgICAgcmV0dXJuIHBhc3Nwb3J0RGF0YTtcclxuICAgIH0sXHJcbiAgICBsb2dpbldYKGl2LCBlbmNyeXB0ZWREYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuIGNvKHRoaXMuX3d4TG9naW5HZW5lcmF0b3IoaXYsIGVuY3J5cHRlZERhdGEpKTtcclxuICAgIH0sXHJcbiAgICAvLyBodHRwczovL21wLndlaXhpbi5xcS5jb20vZGVidWcvd3hhZG9jL2Rldi9hcGkvYXBpLWxvZ2luLmh0bWwjd3hjaGVja3Nlc3Npb25vYmplY3RcclxuICAgIC8vICDmr4/mrKHpg73ojrflvpfkuIDkuKrmlrDnmoRDb2RlXHJcbiAgICBfZ2V0V3hDb2RlKHVzZUNhY2hlID0gZmFsc2UpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdmFyIGNvZGUgPSB3eC5nZXRTdG9yYWdlU3luYygnd3hfY29kZScpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gd3hDb2RlKCkge1xyXG4gICAgICAgICAgICAgICAgd3gubG9naW4oe1xyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NvZGUnLCBjb2RlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlID0gcmVzLmNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3eC5zZXRTdG9yYWdlU3luYyhcImNvZGVzXCIsIGNvZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGpzb24gPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24uY2xpZW50VHlwZSA9IHNlbGYuY29uZmlnLmFwcFR5cGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uLmNsaWVudElkID0gc2VsZi5jb25maWcuYXBwSWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uLmNvZGUgPSBjb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbi5hY3Rpb24gPSAnY29kZTRrZXknO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5qC55o2u5b2T5YmNY29kZeeUn+aIkOS4gOS4qnNlc3Npb25LZXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZmV0Y2hEYXRhUHJvbWlzZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbmZpZy5wYXNzcG9ydFVybCArICdsb2dpblhDWC5kbycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganNvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlID0gZGF0YS5rZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHd4LnNldFN0b3JhZ2VTeW5jKCd3eF9jb2RlJywgY29kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY29kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coMjIyMjIyMjIyMjIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3IgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogJ3d4X2xvZ2luX2Vycm9yJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiByZXMuZXJyTXNnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHNlbGYudGhyb3dFcnJvcihlcnJvcikpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvZGUgJiYgdXNlQ2FjaGUpIHtcclxuICAgICAgICAgICAgICAgIHd4LmNoZWNrU2Vzc2lvbih7XHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNvZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZmFpbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3eENvZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHd4Q29kZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgX2dldFVzZXJJbmZvKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiB1c2VySW5mbygpIHtcclxuICAgICAgICAgICAgICAgIHd4LmdldFVzZXJJbmZvKHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB3aXRoQ3JlZGVudGlhbHM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbGFuZzogJ3poX0NOJyxcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdnZXRVc2VySW5mbz0nLCByZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6ICd1c2VyaW5mb19lcnJvcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiByZXMuZXJyTXNnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChzZWxmLnRocm93RXJyb3IoZXJyb3IpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyDmo4Dmn6XnlKjmiLforr7nva5cclxuICAgICAgICAgICAgd3guZ2V0U2V0dGluZyh7XHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVzLmF1dGhTZXR0aW5nWydzY29wZS51c2VySW5mbyddKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHd4LmF1dGhvcml6ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZTogJ3Njb3BlLnVzZXJJbmZvJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlckluZm8oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWlsKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogJ3VzZXJpbmZvX3JlamVjdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfnlKjmiLflj5bmtojmjojmnYMnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3Qoc2VsZi50aHJvd0Vycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJbmZvKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZhaWwoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiAndXNlcmluZm9fZmFpbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfor7vlj5bnlKjmiLforr7nva7lpLHotKUnXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3Qoc2VsZi50aHJvd0Vycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIF9sb2dpblBhc3Nwb3J0KGNvZGUsIGVuY3J5cHRlZERhdGEsIGl2KSB7XHJcbiAgICAgICAgdmFyIGpzb24gPSB7fTtcclxuICAgICAgICBqc29uLmNsaWVudFR5cGUgPSB0aGlzLmNvbmZpZy5hcHBUeXBlO1xyXG4gICAgICAgIGpzb24uY2xpZW50SWQgPSB0aGlzLmNvbmZpZy5hcHBJZDtcclxuICAgICAgICBqc29uLmtleSA9IGNvZGU7XHJcbiAgICAgICAganNvbi5hY3Rpb24gPSAnbG9naW5EYXRhJztcclxuICAgICAgICBqc29uLmVuY3J5cHRlZERhdGEgPSBlbmNyeXB0ZWREYXRhO1xyXG4gICAgICAgIGpzb24uZW5jcnlwdGVkSVYgPSBpdjtcclxuICAgICAgICBqc29uLnJlbWVtYmVyID0gMzY1OyAvLyAzNjXlpKlcclxuICAgICAgICBjb25zb2xlLmxvZygnZW5jcnlwdGVkRGF0YT0nICsgZW5jcnlwdGVkRGF0YSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2VuY3J5cHRlZElWPScgKyBpdik7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NvZGU9JyArIGNvZGUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoRGF0YVByb21pc2UoXHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnBhc3Nwb3J0VXJsICsgJ2xvZ2luWENYLmRvJyxcclxuICAgICAgICAgICAganNvblxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG4gICAgLy8gIOWPquacieWIhuS6q+WIsOe+pOaJjeaciSBzaGFyZVRpY2tldO+8jCDliIbkuqvliLDkuKrkurrmmK/msqHmnInnmoRcclxuICAgIF9nZXRSZWZlcmVySW5mbyhvcHRpb25zKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ19nZXRSZWZlcmVySW5mbzonLCBvcHRpb25zKTtcclxuICAgICAgICB2YXIgcmVmZXJlcklkID0gb3B0aW9ucy5xdWVyeS5yZWZlcmVySWQ7XHJcbiAgICAgICAgaWYgKHJlZmVyZXJJZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgd3gubG9naW4oe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwid3hMb2dpbjpcIiwgcmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWZlcmVySWQ6IHJlZmVyZXJJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWZlcmVyQ29kZTogcmVzLmNvZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VjZW5lOiBvcHRpb25zLnNjZW5lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IG9wdGlvbnMucGF0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xyXG4gICAgfSxcclxuICAgIG9uTWVzc2FnZShkYXRhKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3JlY2VpdmUgYXBwIG1lc3NhZ2UnLCBkYXRhKTtcclxuICAgICAgICBpZiAodGhpcy5tZXNzYWdlQ2FsbGJhY2sgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VDYWxsYmFjayhkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgbGlzdGVuTWVzc2FnZShjYWxsYmFjaykge1xyXG4gICAgICAgIHRoaXMubWVzc2FnZUNhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICB9LFxyXG4gICAgLy8gRTQ3QjIxMTUzRjk2REU5NjNBQzA0RTNGMjI0NzNFMTkyOEJDRDJCNDk3QTA2NkU0RDk4NjdFNTY2MjY5NEFBQVxyXG4gICAgLy8gYmluZE1vYmlsZVByb21pc2UoaXYsIGVuY3J5cHRlZERhdGEsIHBhc3Nwb3J0U2Vzc2lvbklkKSB7XHJcbiAgICAvLyAgICAgLy8g5omL5py657uR5a6aXHJcbiAgICAvLyAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgLy8gICAgIHZhciBjb2RlID0gbnVsbDtcclxuICAgIC8vICAgICAvLyDnmbvlvZXkuqTmjaJwYXNzcG9ydElkXHJcbiAgICAvLyAgICAgZnVuY3Rpb24gbG9naW5Nb2JpbGUocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAvLyAgICAgICAgIHZhciBqc29uID0ge307XHJcbiAgICAvLyAgICAgICAgIGpzb24uY2xpZW50VHlwZSA9IHNlbGYuY29uZmlnLmFwcFR5cGU7XHJcbiAgICAvLyAgICAgICAgIGpzb24uY2xpZW50SWQgPSBzZWxmLmNvbmZpZy5hcHBJZDtcclxuICAgIC8vICAgICAgICAganNvbi5rZXkgPSBjb2RlO1xyXG4gICAgLy8gICAgICAgICBqc29uLmVuY3J5cHRlZERhdGEgPSBlbmNyeXB0ZWREYXRhO1xyXG4gICAgLy8gICAgICAgICBqc29uLmVuY3J5cHRlZElWID0gaXY7XHJcbiAgICAvLyAgICAgICAgIGpzb24ubG9naW5UeXBlID0gJ21vYmlsZSc7XHJcbiAgICAvLyAgICAgICAgIGpzb24ubGluayA9IHRydWU7XHJcbiAgICAvLyAgICAgICAgIGpzb24ubGlua0ZvcmNlID0gdHJ1ZTtcclxuICAgIC8vICAgICAgICAganNvbi5yZW1lbWJlciA9IDM2NTtcclxuICAgIC8vICAgICAgICAgLy8g57uR5a6a5Yiw5b2T5YmN55So5oi3XHJcbiAgICAvLyAgICAgICAgIGpzb24ucGFzc3BvcnQgPSBwYXNzcG9ydFNlc3Npb25JZDtcclxuICAgIC8vICAgICAgICAgLyoqICAqL1xyXG4gICAgLy8gICAgICAgICBzZWxmLmZldGNoRGF0YShcclxuICAgIC8vICAgICAgICAgICAgIHNlbGYuY29uZmlnLnBhc3Nwb3J0VXJsICsgJ2xvZ2luTW9iaWxlLmRvJyxcclxuICAgIC8vICAgICAgICAgICAgIGpzb24sXHJcbiAgICAvLyAgICAgICAgICAgICBmdW5jdGlvbihqc29uKSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgaWYgKGpzb24uY29kZSA9PT0gMjAwKSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdsb2dpblBhc3Nwb3J0PScgKyBKU09OLnN0cmluZ2lmeShqc29uKSlcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gd3guc2V0U3RvcmFnZVN5bmMoXCJwYXNzcG9ydFwiLCBqc29uLm1lc3NhZ2VzLmRhdGEuc2Vzc2lvbi5pZCk7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoanNvbi5tZXNzYWdlcy5kYXRhKTtcclxuICAgIC8vICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICByZWplY3QoanNvbi5tZXNzYWdlcy5lcnJvcik7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICApO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgLy8gICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAvLyAgICAgICAgICAgICBzZWxmLl9nZXRXeENvZGUocmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgIC8vICAgICAgICAgfSlcclxuICAgIC8vICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICBjb2RlID0gZGF0YTtcclxuICAgIC8vICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBsb2dpbk1vYmlsZShyZXNvbHZlLCByZWplY3QpO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgLy8gICAgICAgICAgICAgfSlcclxuICAgIC8vICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHBhc3Nwb3J0RGF0YSkge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHJlc29sdmUocGFzc3BvcnREYXRhKTtcclxuICAgIC8vICAgICAgICAgICAgIH0pXHJcbiAgICAvLyAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24ocmVhc29uKSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgcmVqZWN0KHJlYXNvbik7XHJcbiAgICAvLyAgICAgICAgICAgICB9KTtcclxuICAgIC8vICAgICB9KTtcclxuICAgIC8vIH0sXHJcbiAgICBiaW5kTW9iaWxlUHJvbWlzZShpdiwgZW5jcnlwdGVkRGF0YSwgcGFzc3BvcnRTZXNzaW9uSWQpIHtcclxuICAgICAgICAvLyDmiYvmnLrnu5HlrppcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGNvZGUgPSBudWxsO1xyXG4gICAgICAgIC8vIOeZu+W9leS6pOaNonBhc3Nwb3J0SWRcclxuICAgICAgICB3eC5sb2dpbih7XHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZXMnLCByZXMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcy5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGpzb24gPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICBqc29uLmtleSA9IHd4LmdldFN0b3JhZ2VTeW5jKCd3eF9jb2RlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAganNvbi5jbGllbnRUeXBlID0gc2VsZi5jb25maWcuYXBwVHlwZTtcclxuICAgICAgICAgICAgICAgICAgICBqc29uLmNsaWVudElkID0gc2VsZi5jb25maWcuYXBwSWQ7XHJcbiAgICAgICAgICAgICAgICAgICAganNvbi5lbmNyeXB0ZWREYXRhID0gZW5jcnlwdGVkRGF0YTtcclxuICAgICAgICAgICAgICAgICAgICBqc29uLmVuY3J5cHRlZElWID0gaXY7XHJcbiAgICAgICAgICAgICAgICAgICAganNvbi5sb2dpblR5cGUgPSAnbW9iaWxlJztcclxuICAgICAgICAgICAgICAgICAgICBqc29uLmxpbmsgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGpzb24uY291bnRyeSA9ICdDTic7XHJcbiAgICAgICAgICAgICAgICAgICAganNvbi5saW5rRm9yY2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGpzb24ucmVtZW1iZXIgPSAzNjU7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g57uR5a6a5Yiw5b2T5YmN55So5oi3XHJcbiAgICAgICAgICAgICAgICAgICAganNvbi5wYXNzcG9ydCA9IHBhc3Nwb3J0U2Vzc2lvbklkO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi5Lyg5YC8XCIsIGpzb24pXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qKiAgKi9cclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmZldGNoRGF0YShcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25maWcucGFzc3BvcnRVcmwgKyAnbG9naW5Nb2JpbGUuZG8nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoanNvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJqc29uXCIsIGpzb24pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoanNvbi5jb2RlID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnbG9naW5QYXNzcG9ydD0nICsgSlNPTi5zdHJpbmdpZnkoanNvbikpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd3guc2V0U3RvcmFnZVN5bmMoXCJwYXNzcG9ydFwiLCBqc29uLm1lc3NhZ2VzLmRhdGEuc2Vzc2lvbi5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShqc29uLm1lc3NhZ2VzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoanNvbi5tZXNzYWdlcy5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcbiAgICB1cGxvYWRGaWxlKHVwbG9hZEl0ZW0sIGxpc3RlbmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIGNvKHRoaXMuX3d4VXBsb2FkRmlsZSh1cGxvYWRJdGVtLCBsaXN0ZW5lcikpO1xyXG4gICAgfSxcclxuICAgIC8vIOS4iuS8oOWbvueJh1xyXG4gICAgKiBfd3hVcGxvYWRGaWxlKHVwbG9hZEl0ZW0sIGxpc3RlbmVyKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdzdGFydFVwbG9hZDonLCB1cGxvYWRJdGVtLmluZGV4KTtcclxuICAgICAgICB2YXIgZGF0YSA9IHlpZWxkIHNlbGYuX25ld1VwbG9hZCgpO1xyXG4gICAgICAgIHVwbG9hZEl0ZW0udXBsb2FkVG9rZW4gPSBkYXRhLnRva2VuO1xyXG4gICAgICAgIHVwbG9hZEl0ZW0udXBsb2FkVXJsID0gZGF0YS51cGxvYWRVcmw7XHJcbiAgICAgICAgeWllbGQgc2VsZi5fdXBsb2FkRmlsZSh1cGxvYWRJdGVtLCBsaXN0ZW5lcik7XHJcbiAgICAgICAgeWllbGQgc2VsZi5fdXBsb2FkUXVlcnlDaGVjayh1cGxvYWRJdGVtLCBsaXN0ZW5lcik7XHJcbiAgICAgICAgdmFyIHF1ZXJ5ID0geWllbGQgc2VsZi5fdXBsb2FkUXVlcnlSZXN1bHQodXBsb2FkSXRlbSk7XHJcbiAgICAgICAgaWYgKHF1ZXJ5LmZpbGVzICYmIHF1ZXJ5LmZpbGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdmFyIGltYWdlVXJsID0gcXVlcnkuZmlsZXNbMF0uaW1hZ2VzWzBdLnVybDtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ+S4iuS8oOe7k+aenDonICsgaW1hZ2VVcmwpO1xyXG4gICAgICAgICAgICB1cGxvYWRJdGVtLmltYWdlVXJsID0gaW1hZ2VVcmw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1cGxvYWRJdGVtO1xyXG4gICAgfSxcclxuICAgIF9uZXdVcGxvYWQoKSB7XHJcbiAgICAgICAgLy8g6I635b6X5LiA5Liq5LiK5Lyg5Zyw5Z2AXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHZhciB1cGxvYWRVcmwgPSBzZWxmLmNvbmZpZy51cGxvYWRVcmwgKyAndXBsb2FkLmRvJztcclxuICAgICAgICAgICAgd3gucmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHVwbG9hZFVybCxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2dldCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAndXBsb2FkJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW1hZ2UnLFxyXG4gICAgICAgICAgICAgICAgICAgIGFwcElkOiBzZWxmLmNvbmZpZy51cGxvYWRBcHBJZFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGpzb24gPSByZXMuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoanNvbi5jb2RlID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShqc29uLm1lc3NhZ2VzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yID0ganNvbi5tZXNzYWdlcy5lcnJvcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUubmFtZSA9IGVycm9yLmNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZmFpbChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6ICd1cGxvYWRfZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiByZXMuZXJyTXNnXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICBlLm5hbWUgPSBlcnJvci5jb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgLy8g5LiK5Lyg5paH5Lu255qE5YW35L2TXHJcbiAgICBfdXBsb2FkRmlsZSh1cGxvYWRJdGVtLCBsaXN0ZW5lcikge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVwbG9hZFRhc2sgPSB3eC51cGxvYWRGaWxlKHtcclxuICAgICAgICAgICAgICAgIHVybDogdXBsb2FkSXRlbS51cGxvYWRVcmwsXHJcbiAgICAgICAgICAgICAgICBmaWxlUGF0aDogdXBsb2FkSXRlbS5maWxlLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2ZpbGUnLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1c0NvZGUgIT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiAndXBsb2FkX2Vycm9yJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdIVFRQ6ZSZ6K+vOicgKyByZXMuc3RhdHVzQ29kZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5uYW1lID0gZXJyb3IuY29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodXBsb2FkSXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZhaWwocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiAndXBsb2FkX2Vycm9yJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogcmVzLmVyck1zZ1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5uYW1lID0gZXJyb3IuY29kZTtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvLyDnm5HmjqfkuIrkvKDov5vluqZcclxuICAgICAgICAgICAgdXBsb2FkVGFzay5vblByb2dyZXNzVXBkYXRlKHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZEl0ZW0ucHJvZ3Jlc3MgPSByZXMucHJvZ3Jlc3M7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVwbG9hZEl0ZW0ucHJvZ3Jlc3MgPiA5OSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLnByb2dyZXNzID0gOTk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyKHVwbG9hZEl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+S4iuS8oOi/m+W6picsIHJlcy5wcm9ncmVzcyk7XHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ+W3sue7j+S4iuS8oOeahOaVsOaNrumVv+W6picsIHJlcy50b3RhbEJ5dGVzU2VudCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXHJcbiAgICAgICAgICAgICfpooTmnJ/pnIDopoHkuIrkvKDnmoTmlbDmja7mgLvplb/luqYnLFxyXG4gICAgICAgICAgICByZXMudG90YWxCeXRlc0V4cGVjdGVkVG9TZW5kXHJcbiAgICAgICAgKTtcclxuICAgICAgICAqL1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICAvLyDnoa7orqTmnI3liqHlmajlt7Lnu4/mlLbliLDmiYDmnInmlbDmja5cclxuICAgIF91cGxvYWRRdWVyeUNoZWNrKHVwbG9hZEl0ZW0sIGxpc3RlbmVyKSB7XHJcbiAgICAgICAgdmFyIHVwbG9hZFVybCA9IHVwbG9hZEl0ZW0udXBsb2FkVXJsO1xyXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrRmluaXNoZWQocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiB1cGxvYWRVcmwsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gcmVzLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NoZWNrIHVwbG9hZCBmaW5pc2hlZDonLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdmaW5pc2gnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lciAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRJdGVtLnByb2dyZXNzID0gMTAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIodXBsb2FkSXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrRmluaXNoZWQocmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6ICd1cGxvYWRfZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiByZXMuZXJyTXNnXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncXVlcnkgc2VydmVyIGVycm9yLHdpbGwgcmV0cnk6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja0ZpbmlzaGVkKHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY2hlY2tGaW5pc2hlZChyZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIF91cGxvYWRRdWVyeVJlc3VsdCh1cGxvYWRJdGVtKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHZhciB1cGxvYWRVcmwgPSBzZWxmLmNvbmZpZy51cGxvYWRVcmwgKyAndXBsb2FkLmRvJztcclxuICAgICAgICAgICAgd3gucmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHVwbG9hZFVybCxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2dldCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAncXVlcnknLFxyXG4gICAgICAgICAgICAgICAgICAgIHRva2VuOiB1cGxvYWRJdGVtLnVwbG9hZFRva2VuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBqc29uID0gcmVzLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGpzb24uY29kZSA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoanNvbi5tZXNzYWdlcy5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvciA9IGpzb24ubWVzc2FnZXMuZXJyb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLm5hbWUgPSBlcnJvci5jb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6ICd1cGxvYWRfZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiByZXMuZXJyTXNnXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICBlLm5hbWUgPSBlcnJvci5jb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBBcHA7XHJcbiJdfQ==