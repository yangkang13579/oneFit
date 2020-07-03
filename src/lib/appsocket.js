/* jshint esversion: 6 */
/* global wx */
/* 封装websocket */

/** 用来连接Application的Sockets，主要是用来实现消息推送机制 */
export default class AppScoket {
    constructor(url) {
        this.url = url;
        // 是否重新连接
        this.reconnect = true;
        // 重试的次数
        this.retryTimes = 0;
        // 重试的间隔，秒
        this.retryInteval = 1;
        // 连接的参数
        this.data = {
            passport: ''
        };
        this.valid = false; // 是否第一次连接上
        // 定义回调的接受消息函数
        this.onMessage = function (data) {
            console.log('receive message:', data);
        };
    }
    connect() {
        var self = this;
        if (this.url.indexOf('wss://') !== 0) {
            console.log('小程序只支持wss连接');
            return;
        }
        console.log('connect sockets:', this.url);
        this.open();
        wx.onSocketOpen(function (res) {
            console.log('WebSocket 连接已打开，等待数据！');
            self.valid = true;
        });
        wx.onSocketError(function (res) {
            console.log('WebSocket连接打开失败，请检查配置！');
        });
        wx.onSocketMessage(function (res) {
            console.log('WebSocket收到服务器内容：' + res.data);
            if (self.onMessage) {
                self.onMessage(res.data);
            }
        });
        wx.onSocketClose(function (res) {
            console.log('WebSocket 已关闭！', res);
            if (res.code !== 1000 && self.reconnect) {
                self.retry();
            }
        });
    }
    retry() {
        var self = this;
        if (!self.valid) {
            return;
        }
        console.log('reconnect socket');
        if (self.retryInteval > 0) {
            setTimeout(function () {
                self.open();
            }, self.retryInteval * 1000);
        } else {
            self.open();
        }
    }
    open() {
        var self = this;
        wx.connectSocket({url: self.url, data: self.data, method: 'POST'});
    }
    close() {
        wx.closeSocket({code: 1000, reason: 'close normally'});
    }
}
