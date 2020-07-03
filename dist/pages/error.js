'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/* global wx */


var Error = function (_wepy$page) {
    _inherits(Error, _wepy$page);

    function Error() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Error);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Error.__proto__ || Object.getPrototypeOf(Error)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
            navigationBarTitleText: '出错了'
        }, _this.data = {
            code: 'unknown',
            message: 'unknown'
        }, _this.methods = {
            restart: function restart() {
                // 清除各种缓存
                wx.removeStorageSync('passport');
                wx.clearStorageSync();
                var app = this.$parent;
                app.relogin();
                wx.reLaunch({ url: '/pages/index' });
            },
            cancel: function cancel() {
                wx.navigateBack();
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Error, [{
        key: 'onLoad',
        value: function onLoad(options) {
            console.log('onLoad:', options);
            this.code = options.code || 'unknown';
            this.message = options.message || 'unknown';
            if (this.code.indexOf('userinfo_') === 0) {
                // 微信的授权登录失败，需要重新登录
                wx.redirectTo({ url: 'login_setting' });
            }
            this.$apply();
        }
    }]);

    return Error;
}(_wepy2.default.page);

exports.default = Error;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVycm9yLmpzIl0sIm5hbWVzIjpbIkVycm9yIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsImRhdGEiLCJjb2RlIiwibWVzc2FnZSIsIm1ldGhvZHMiLCJyZXN0YXJ0Iiwid3giLCJyZW1vdmVTdG9yYWdlU3luYyIsImNsZWFyU3RvcmFnZVN5bmMiLCJhcHAiLCIkcGFyZW50IiwicmVsb2dpbiIsInJlTGF1bmNoIiwidXJsIiwiY2FuY2VsIiwibmF2aWdhdGVCYWNrIiwib3B0aW9ucyIsImNvbnNvbGUiLCJsb2ciLCJpbmRleE9mIiwicmVkaXJlY3RUbyIsIiRhcHBseSIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7Ozs7Ozs7OztBQURBOzs7SUFFcUJBLEs7Ozs7Ozs7Ozs7Ozs7O3dMQUNuQkMsTSxHQUFTO0FBQ0xDLG9DQUF3QjtBQURuQixTLFFBR1RDLEksR0FBTztBQUNIQyxrQkFBTSxTQURIO0FBRUhDLHFCQUFTO0FBRk4sUyxRQUlQQyxPLEdBQVU7QUFDTkMsbUJBRE0scUJBQ0k7QUFDVjtBQUNJQyxtQkFBR0MsaUJBQUgsQ0FBcUIsVUFBckI7QUFDQUQsbUJBQUdFLGdCQUFIO0FBQ0Esb0JBQUlDLE1BQU0sS0FBS0MsT0FBZjtBQUNBRCxvQkFBSUUsT0FBSjtBQUNBTCxtQkFBR00sUUFBSCxDQUFZLEVBQUVDLEtBQUssY0FBUCxFQUFaO0FBQ0gsYUFSSztBQVNOQyxrQkFUTSxvQkFTRztBQUNMUixtQkFBR1MsWUFBSDtBQUNIO0FBWEssUzs7Ozs7K0JBYUhDLE8sRUFBUztBQUNaQyxvQkFBUUMsR0FBUixDQUFZLFNBQVosRUFBdUJGLE9BQXZCO0FBQ0EsaUJBQUtkLElBQUwsR0FBWWMsUUFBUWQsSUFBUixJQUFnQixTQUE1QjtBQUNBLGlCQUFLQyxPQUFMLEdBQWVhLFFBQVFiLE9BQVIsSUFBbUIsU0FBbEM7QUFDQSxnQkFBSSxLQUFLRCxJQUFMLENBQVVpQixPQUFWLENBQWtCLFdBQWxCLE1BQW1DLENBQXZDLEVBQTBDO0FBQzFDO0FBQ0liLG1CQUFHYyxVQUFILENBQWMsRUFBRVAsS0FBSyxlQUFQLEVBQWQ7QUFDSDtBQUNELGlCQUFLUSxNQUFMO0FBQ0g7Ozs7RUE5QmdDQyxlQUFLQyxJOztrQkFBbkJ6QixLIiwiZmlsZSI6ImVycm9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8qIGdsb2JhbCB3eCAqL1xyXG5pbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXJyb3IgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gIGNvbmZpZyA9IHtcclxuICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+WHuumUmeS6hidcclxuICB9O1xyXG4gIGRhdGEgPSB7XHJcbiAgICAgIGNvZGU6ICd1bmtub3duJyxcclxuICAgICAgbWVzc2FnZTogJ3Vua25vd24nXHJcbiAgfTtcclxuICBtZXRob2RzID0ge1xyXG4gICAgICByZXN0YXJ0KCkge1xyXG4gICAgICAvLyDmuIXpmaTlkITnp43nvJPlrZhcclxuICAgICAgICAgIHd4LnJlbW92ZVN0b3JhZ2VTeW5jKCdwYXNzcG9ydCcpO1xyXG4gICAgICAgICAgd3guY2xlYXJTdG9yYWdlU3luYygpO1xyXG4gICAgICAgICAgbGV0IGFwcCA9IHRoaXMuJHBhcmVudDtcclxuICAgICAgICAgIGFwcC5yZWxvZ2luKCk7XHJcbiAgICAgICAgICB3eC5yZUxhdW5jaCh7IHVybDogJy9wYWdlcy9pbmRleCcgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGNhbmNlbCgpIHtcclxuICAgICAgICAgIHd4Lm5hdmlnYXRlQmFjaygpO1xyXG4gICAgICB9XHJcbiAgfTtcclxuICBvbkxvYWQob3B0aW9ucykge1xyXG4gICAgICBjb25zb2xlLmxvZygnb25Mb2FkOicsIG9wdGlvbnMpO1xyXG4gICAgICB0aGlzLmNvZGUgPSBvcHRpb25zLmNvZGUgfHwgJ3Vua25vd24nO1xyXG4gICAgICB0aGlzLm1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHwgJ3Vua25vd24nO1xyXG4gICAgICBpZiAodGhpcy5jb2RlLmluZGV4T2YoJ3VzZXJpbmZvXycpID09PSAwKSB7XHJcbiAgICAgIC8vIOW+ruS/oeeahOaOiOadg+eZu+W9leWksei0pe+8jOmcgOimgemHjeaWsOeZu+W9lVxyXG4gICAgICAgICAgd3gucmVkaXJlY3RUbyh7IHVybDogJ2xvZ2luX3NldHRpbmcnIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==