'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _page = require('./../../mixins/page.js');

var _page2 = _interopRequireDefault(_page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/* global wx */


var Reserve = function (_wepy$page) {
    _inherits(Reserve, _wepy$page);

    function Reserve() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Reserve);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Reserve.__proto__ || Object.getPrototypeOf(Reserve)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
            navigationBarTitleText: '预约详情',
            navigationStyle: 'default',
            navigationBarBackgroundColor: '#e84644'
        }, _this.components = {}, _this.data = {}, _this.methods = {}, _temp), _possibleConstructorReturn(_this, _ret);
    }
    // mixins = [PageMixin];


    _createClass(Reserve, [{
        key: 'onReachBottom',
        value: function onReachBottom() {}
    }, {
        key: 'whenAppReadyShow',
        value: function whenAppReadyShow() {
            var _this2 = this;

            this.fetchDataPromise('user/userInfo.json', {}).then(function (data) {
                var userInfo = data;
                _this2.$apply();
                wx.setStorage({
                    key: 'userInfo',
                    data: JSON.stringify(userInfo)
                });
            }).catch(function (error) {});
        }
    }, {
        key: 'onShow',
        value: function onShow() {
            // wx.hideTabBar()
        }
    }, {
        key: 'onShareAppMessage',
        value: function onShareAppMessage(res) {}
    }, {
        key: 'regionchange',
        value: function regionchange(e) {
            console.log(e.type);
        }
    }, {
        key: 'markertap',
        value: function markertap(e) {
            console.log(e.markerId);
        }
    }, {
        key: 'controltap',
        value: function controltap(e) {
            console.log(e.controlId);
        }
    }]);

    return Reserve;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Reserve , 'pages/coursed/reserve'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc2VydmUuanMiXSwibmFtZXMiOlsiUmVzZXJ2ZSIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uU3R5bGUiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsImRhdGEiLCJtZXRob2RzIiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRoZW4iLCJ1c2VySW5mbyIsIiRhcHBseSIsInd4Iiwic2V0U3RvcmFnZSIsImtleSIsIkpTT04iLCJzdHJpbmdpZnkiLCJjYXRjaCIsImVycm9yIiwicmVzIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJ0eXBlIiwibWFya2VySWQiLCJjb250cm9sSWQiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7OztBQUZBOzs7SUFHcUJBLE87Ozs7Ozs7Ozs7Ozs7OzRMQUVuQkMsTSxHQUFTO0FBQ0xDLG9DQUF3QixNQURuQjtBQUVMQyw2QkFBaUIsU0FGWjtBQUdMQywwQ0FBOEI7QUFIekIsUyxRQUtUQyxVLEdBQWEsRSxRQUNiQyxJLEdBQU8sRSxRQUVQQyxPLEdBQVUsRTs7QUFUVjs7Ozs7d0NBYWdCLENBQUU7OzsyQ0FFQztBQUFBOztBQUNmLGlCQUFLQyxnQkFBTCxDQUFzQixvQkFBdEIsRUFBNEMsRUFBNUMsRUFDS0MsSUFETCxDQUNVLGdCQUFRO0FBQ1Ysb0JBQU1DLFdBQVdKLElBQWpCO0FBQ0EsdUJBQUtLLE1BQUw7QUFDQUMsbUJBQUdDLFVBQUgsQ0FBYztBQUNWQyx5QkFBSyxVQURLO0FBRVZSLDBCQUFNUyxLQUFLQyxTQUFMLENBQWVOLFFBQWY7QUFGSSxpQkFBZDtBQUlILGFBUkwsRUFTS08sS0FUTCxDQVNXLFVBQVNDLEtBQVQsRUFBZ0IsQ0FBRSxDQVQ3QjtBQVVIOzs7aUNBQ1E7QUFDTDtBQUNIOzs7MENBQ2lCQyxHLEVBQUssQ0FBRTs7O3FDQUNaQyxDLEVBQUc7QUFDWkMsb0JBQVFDLEdBQVIsQ0FBWUYsRUFBRUcsSUFBZDtBQUNIOzs7a0NBQ1NILEMsRUFBRztBQUNUQyxvQkFBUUMsR0FBUixDQUFZRixFQUFFSSxRQUFkO0FBQ0g7OzttQ0FDVUosQyxFQUFHO0FBQ1ZDLG9CQUFRQyxHQUFSLENBQVlGLEVBQUVLLFNBQWQ7QUFDSDs7OztFQXhDa0NDLGVBQUtDLEk7O2tCQUFyQjNCLE8iLCJmaWxlIjoicmVzZXJ2ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKiBnbG9iYWwgd3ggKi9cclxuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XHJcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vLi4vbWl4aW5zL3BhZ2UnO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXNlcnZlIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICAvLyBtaXhpbnMgPSBbUGFnZU1peGluXTtcclxuICBjb25maWcgPSB7XHJcbiAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfpooTnuqbor6bmg4UnLFxyXG4gICAgICBuYXZpZ2F0aW9uU3R5bGU6ICdkZWZhdWx0JyxcclxuICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNlODQ2NDQnXHJcbiAgfTtcclxuICBjb21wb25lbnRzID0ge307XHJcbiAgZGF0YSA9IHtcclxuICB9O1xyXG4gIG1ldGhvZHMgPSB7XHJcblxyXG4gIH07XHJcblxyXG4gIG9uUmVhY2hCb3R0b20oKSB7fVxyXG5cclxuICB3aGVuQXBwUmVhZHlTaG93KCkge1xyXG4gICAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3VzZXIvdXNlckluZm8uanNvbicsIHt9KVxyXG4gICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3QgdXNlckluZm8gPSBkYXRhO1xyXG4gICAgICAgICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgd3guc2V0U3RvcmFnZSh7XHJcbiAgICAgICAgICAgICAgICAgIGtleTogJ3VzZXJJbmZvJyxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkodXNlckluZm8pXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7fSk7XHJcbiAgfVxyXG4gIG9uU2hvdygpIHtcclxuICAgICAgLy8gd3guaGlkZVRhYkJhcigpXHJcbiAgfVxyXG4gIG9uU2hhcmVBcHBNZXNzYWdlKHJlcykge31cclxuICByZWdpb25jaGFuZ2UoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlLnR5cGUpO1xyXG4gIH1cclxuICBtYXJrZXJ0YXAoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlLm1hcmtlcklkKTtcclxuICB9XHJcbiAgY29udHJvbHRhcChlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUuY29udHJvbElkKTtcclxuICB9XHJcbn1cclxuIl19