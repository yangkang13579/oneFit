'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* jshint esversion: 6 */
/* global wx */
/* 封装websocket */

/** 用来连接Application的Sockets，主要是用来实现消息推送机制 */
var AppScoket = function () {
    function AppScoket(url) {
        _classCallCheck(this, AppScoket);

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

    _createClass(AppScoket, [{
        key: 'connect',
        value: function connect() {
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
    }, {
        key: 'retry',
        value: function retry() {
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
    }, {
        key: 'open',
        value: function open() {
            var self = this;
            wx.connectSocket({ url: self.url, data: self.data, method: 'POST' });
        }
    }, {
        key: 'close',
        value: function close() {
            wx.closeSocket({ code: 1000, reason: 'close normally' });
        }
    }]);

    return AppScoket;
}();

exports.default = AppScoket;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcHNvY2tldC5qcyJdLCJuYW1lcyI6WyJBcHBTY29rZXQiLCJ1cmwiLCJyZWNvbm5lY3QiLCJyZXRyeVRpbWVzIiwicmV0cnlJbnRldmFsIiwiZGF0YSIsInBhc3Nwb3J0IiwidmFsaWQiLCJvbk1lc3NhZ2UiLCJjb25zb2xlIiwibG9nIiwic2VsZiIsImluZGV4T2YiLCJvcGVuIiwid3giLCJvblNvY2tldE9wZW4iLCJyZXMiLCJvblNvY2tldEVycm9yIiwib25Tb2NrZXRNZXNzYWdlIiwib25Tb2NrZXRDbG9zZSIsImNvZGUiLCJyZXRyeSIsInNldFRpbWVvdXQiLCJjb25uZWN0U29ja2V0IiwibWV0aG9kIiwiY2xvc2VTb2NrZXQiLCJyZWFzb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7O0FBRUE7SUFDcUJBLFM7QUFDakIsdUJBQVlDLEdBQVosRUFBaUI7QUFBQTs7QUFDYixhQUFLQSxHQUFMLEdBQVdBLEdBQVg7QUFDQTtBQUNBLGFBQUtDLFNBQUwsR0FBaUIsSUFBakI7QUFDQTtBQUNBLGFBQUtDLFVBQUwsR0FBa0IsQ0FBbEI7QUFDQTtBQUNBLGFBQUtDLFlBQUwsR0FBb0IsQ0FBcEI7QUFDQTtBQUNBLGFBQUtDLElBQUwsR0FBWTtBQUNSQyxzQkFBVTtBQURGLFNBQVo7QUFHQSxhQUFLQyxLQUFMLEdBQWEsS0FBYixDQVphLENBWU87QUFDcEI7QUFDQSxhQUFLQyxTQUFMLEdBQWlCLFVBQVVILElBQVYsRUFBZ0I7QUFDN0JJLG9CQUFRQyxHQUFSLENBQVksa0JBQVosRUFBZ0NMLElBQWhDO0FBQ0gsU0FGRDtBQUdIOzs7O2tDQUNTO0FBQ04sZ0JBQUlNLE9BQU8sSUFBWDtBQUNBLGdCQUFJLEtBQUtWLEdBQUwsQ0FBU1csT0FBVCxDQUFpQixRQUFqQixNQUErQixDQUFuQyxFQUFzQztBQUNsQ0gsd0JBQVFDLEdBQVIsQ0FBWSxhQUFaO0FBQ0E7QUFDSDtBQUNERCxvQkFBUUMsR0FBUixDQUFZLGtCQUFaLEVBQWdDLEtBQUtULEdBQXJDO0FBQ0EsaUJBQUtZLElBQUw7QUFDQUMsZUFBR0MsWUFBSCxDQUFnQixVQUFVQyxHQUFWLEVBQWU7QUFDM0JQLHdCQUFRQyxHQUFSLENBQVksdUJBQVo7QUFDQUMscUJBQUtKLEtBQUwsR0FBYSxJQUFiO0FBQ0gsYUFIRDtBQUlBTyxlQUFHRyxhQUFILENBQWlCLFVBQVVELEdBQVYsRUFBZTtBQUM1QlAsd0JBQVFDLEdBQVIsQ0FBWSx3QkFBWjtBQUNILGFBRkQ7QUFHQUksZUFBR0ksZUFBSCxDQUFtQixVQUFVRixHQUFWLEVBQWU7QUFDOUJQLHdCQUFRQyxHQUFSLENBQVksc0JBQXNCTSxJQUFJWCxJQUF0QztBQUNBLG9CQUFJTSxLQUFLSCxTQUFULEVBQW9CO0FBQ2hCRyx5QkFBS0gsU0FBTCxDQUFlUSxJQUFJWCxJQUFuQjtBQUNIO0FBQ0osYUFMRDtBQU1BUyxlQUFHSyxhQUFILENBQWlCLFVBQVVILEdBQVYsRUFBZTtBQUM1QlAsd0JBQVFDLEdBQVIsQ0FBWSxnQkFBWixFQUE4Qk0sR0FBOUI7QUFDQSxvQkFBSUEsSUFBSUksSUFBSixLQUFhLElBQWIsSUFBcUJULEtBQUtULFNBQTlCLEVBQXlDO0FBQ3JDUyx5QkFBS1UsS0FBTDtBQUNIO0FBQ0osYUFMRDtBQU1IOzs7Z0NBQ087QUFDSixnQkFBSVYsT0FBTyxJQUFYO0FBQ0EsZ0JBQUksQ0FBQ0EsS0FBS0osS0FBVixFQUFpQjtBQUNiO0FBQ0g7QUFDREUsb0JBQVFDLEdBQVIsQ0FBWSxrQkFBWjtBQUNBLGdCQUFJQyxLQUFLUCxZQUFMLEdBQW9CLENBQXhCLEVBQTJCO0FBQ3ZCa0IsMkJBQVcsWUFBWTtBQUNuQlgseUJBQUtFLElBQUw7QUFDSCxpQkFGRCxFQUVHRixLQUFLUCxZQUFMLEdBQW9CLElBRnZCO0FBR0gsYUFKRCxNQUlPO0FBQ0hPLHFCQUFLRSxJQUFMO0FBQ0g7QUFDSjs7OytCQUNNO0FBQ0gsZ0JBQUlGLE9BQU8sSUFBWDtBQUNBRyxlQUFHUyxhQUFILENBQWlCLEVBQUN0QixLQUFLVSxLQUFLVixHQUFYLEVBQWdCSSxNQUFNTSxLQUFLTixJQUEzQixFQUFpQ21CLFFBQVEsTUFBekMsRUFBakI7QUFDSDs7O2dDQUNPO0FBQ0pWLGVBQUdXLFdBQUgsQ0FBZSxFQUFDTCxNQUFNLElBQVAsRUFBYU0sUUFBUSxnQkFBckIsRUFBZjtBQUNIOzs7Ozs7a0JBbkVnQjFCLFMiLCJmaWxlIjoiYXBwc29ja2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xyXG4vKiBnbG9iYWwgd3ggKi9cclxuLyog5bCB6KOFd2Vic29ja2V0ICovXHJcblxyXG4vKiog55So5p2l6L+e5o6lQXBwbGljYXRpb27nmoRTb2NrZXRz77yM5Li76KaB5piv55So5p2l5a6e546w5raI5oGv5o6o6YCB5py65Yi2ICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFwcFNjb2tldCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih1cmwpIHtcclxuICAgICAgICB0aGlzLnVybCA9IHVybDtcclxuICAgICAgICAvLyDmmK/lkKbph43mlrDov57mjqVcclxuICAgICAgICB0aGlzLnJlY29ubmVjdCA9IHRydWU7XHJcbiAgICAgICAgLy8g6YeN6K+V55qE5qyh5pWwXHJcbiAgICAgICAgdGhpcy5yZXRyeVRpbWVzID0gMDtcclxuICAgICAgICAvLyDph43or5XnmoTpl7TpmpTvvIznp5JcclxuICAgICAgICB0aGlzLnJldHJ5SW50ZXZhbCA9IDE7XHJcbiAgICAgICAgLy8g6L+e5o6l55qE5Y+C5pWwXHJcbiAgICAgICAgdGhpcy5kYXRhID0ge1xyXG4gICAgICAgICAgICBwYXNzcG9ydDogJydcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudmFsaWQgPSBmYWxzZTsgLy8g5piv5ZCm56ys5LiA5qyh6L+e5o6l5LiKXHJcbiAgICAgICAgLy8g5a6a5LmJ5Zue6LCD55qE5o6l5Y+X5raI5oGv5Ye95pWwXHJcbiAgICAgICAgdGhpcy5vbk1lc3NhZ2UgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygncmVjZWl2ZSBtZXNzYWdlOicsIGRhdGEpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBjb25uZWN0KCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBpZiAodGhpcy51cmwuaW5kZXhPZignd3NzOi8vJykgIT09IDApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ+Wwj+eoi+W6j+WPquaUr+aMgXdzc+i/nuaOpScpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjb25uZWN0IHNvY2tldHM6JywgdGhpcy51cmwpO1xyXG4gICAgICAgIHRoaXMub3BlbigpO1xyXG4gICAgICAgIHd4Lm9uU29ja2V0T3BlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdXZWJTb2NrZXQg6L+e5o6l5bey5omT5byA77yM562J5b6F5pWw5o2u77yBJyk7XHJcbiAgICAgICAgICAgIHNlbGYudmFsaWQgPSB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHd4Lm9uU29ja2V0RXJyb3IoZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnV2ViU29ja2V06L+e5o6l5omT5byA5aSx6LSl77yM6K+35qOA5p+l6YWN572u77yBJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgd3gub25Tb2NrZXRNZXNzYWdlKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1dlYlNvY2tldOaUtuWIsOacjeWKoeWZqOWGheWuue+8micgKyByZXMuZGF0YSk7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLm9uTWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5vbk1lc3NhZ2UocmVzLmRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgd3gub25Tb2NrZXRDbG9zZShmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdXZWJTb2NrZXQg5bey5YWz6Zet77yBJywgcmVzKTtcclxuICAgICAgICAgICAgaWYgKHJlcy5jb2RlICE9PSAxMDAwICYmIHNlbGYucmVjb25uZWN0KSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnJldHJ5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHJ5KCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBpZiAoIXNlbGYudmFsaWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZygncmVjb25uZWN0IHNvY2tldCcpO1xyXG4gICAgICAgIGlmIChzZWxmLnJldHJ5SW50ZXZhbCA+IDApIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLm9wZW4oKTtcclxuICAgICAgICAgICAgfSwgc2VsZi5yZXRyeUludGV2YWwgKiAxMDAwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZWxmLm9wZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBvcGVuKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB3eC5jb25uZWN0U29ja2V0KHt1cmw6IHNlbGYudXJsLCBkYXRhOiBzZWxmLmRhdGEsIG1ldGhvZDogJ1BPU1QnfSk7XHJcbiAgICB9XHJcbiAgICBjbG9zZSgpIHtcclxuICAgICAgICB3eC5jbG9zZVNvY2tldCh7Y29kZTogMTAwMCwgcmVhc29uOiAnY2xvc2Ugbm9ybWFsbHknfSk7XHJcbiAgICB9XHJcbn1cclxuIl19