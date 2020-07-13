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

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Reserve.__proto__ || Object.getPrototypeOf(Reserve)).call.apply(_ref, [this].concat(args))), _this), _this.config = {}, _this.components = {}, _this.data = {}, _this.methods = {
      btnbuy: function btnbuy() {
        wx.navigateTo({
          url: "member"
        });
      },
      back: function back() {
        wx.navigateBack({
          delta: 1
        });
      },

      //跳转支付页面
      btnres: function btnres() {
        wx.navigateTo({
          url: "appointDetail"
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc2VydmUuanMiXSwibmFtZXMiOlsiUmVzZXJ2ZSIsImNvbmZpZyIsImNvbXBvbmVudHMiLCJkYXRhIiwibWV0aG9kcyIsImJ0bmJ1eSIsInd4IiwibmF2aWdhdGVUbyIsInVybCIsImJhY2siLCJuYXZpZ2F0ZUJhY2siLCJkZWx0YSIsImJ0bnJlcyIsImZldGNoRGF0YVByb21pc2UiLCJ0aGVuIiwidXNlckluZm8iLCIkYXBwbHkiLCJzZXRTdG9yYWdlIiwia2V5IiwiSlNPTiIsInN0cmluZ2lmeSIsImNhdGNoIiwiZXJyb3IiLCJyZXMiLCJlIiwiY29uc29sZSIsImxvZyIsInR5cGUiLCJtYXJrZXJJZCIsImNvbnRyb2xJZCIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBRkE7OztJQUdxQkEsTzs7Ozs7Ozs7Ozs7Ozs7d0xBRW5CQyxNLEdBQVMsRSxRQUdUQyxVLEdBQWEsRSxRQUNiQyxJLEdBQU8sRSxRQUVQQyxPLEdBQVU7QUFDUkMsWUFEUSxvQkFDQTtBQUNOQyxXQUFHQyxVQUFILENBQWM7QUFDWkMsZUFBSztBQURPLFNBQWQ7QUFHRCxPQUxPO0FBTVJDLFVBTlEsa0JBTUY7QUFDSkgsV0FBR0ksWUFBSCxDQUFnQjtBQUNkQyxpQkFBTztBQURPLFNBQWhCO0FBR0QsT0FWTzs7QUFXUjtBQUNBQyxZQVpRLG9CQVlBO0FBQ05OLFdBQUdDLFVBQUgsQ0FBYztBQUNaQyxlQUFLO0FBRE8sU0FBZDtBQUdEO0FBaEJPLEs7O0FBUFY7Ozs7O29DQTBCZ0IsQ0FBRTs7O3VDQUVDO0FBQUE7O0FBQ2YsV0FBS0ssZ0JBQUwsQ0FBc0Isb0JBQXRCLEVBQTRDLEVBQTVDLEVBQ0tDLElBREwsQ0FDVSxnQkFBUTtBQUNWLFlBQU1DLFdBQVdaLElBQWpCO0FBQ0EsZUFBS2EsTUFBTDtBQUNBVixXQUFHVyxVQUFILENBQWM7QUFDVkMsZUFBSyxVQURLO0FBRVZmLGdCQUFNZ0IsS0FBS0MsU0FBTCxDQUFlTCxRQUFmO0FBRkksU0FBZDtBQUlILE9BUkwsRUFTS00sS0FUTCxDQVNXLFVBQVNDLEtBQVQsRUFBZ0IsQ0FBRSxDQVQ3QjtBQVVIOzs7NkJBQ1E7QUFDTDtBQUNIOzs7c0NBQ2lCQyxHLEVBQUssQ0FBRTs7O2lDQUNaQyxDLEVBQUc7QUFDWkMsY0FBUUMsR0FBUixDQUFZRixFQUFFRyxJQUFkO0FBQ0g7Ozs4QkFDU0gsQyxFQUFHO0FBQ1RDLGNBQVFDLEdBQVIsQ0FBWUYsRUFBRUksUUFBZDtBQUNIOzs7K0JBQ1VKLEMsRUFBRztBQUNWQyxjQUFRQyxHQUFSLENBQVlGLEVBQUVLLFNBQWQ7QUFDSDs7OztFQXJEa0NDLGVBQUtDLEk7O2tCQUFyQi9CLE8iLCJmaWxlIjoicmVzZXJ2ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKiBnbG9iYWwgd3ggKi9cclxuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XHJcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vLi4vbWl4aW5zL3BhZ2UnO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXNlcnZlIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICAvLyBtaXhpbnMgPSBbUGFnZU1peGluXTtcclxuICBjb25maWcgPSB7XHJcbiAgXHJcbiAgfTtcclxuICBjb21wb25lbnRzID0ge307XHJcbiAgZGF0YSA9IHtcclxuICB9O1xyXG4gIG1ldGhvZHMgPSB7XHJcbiAgICBidG5idXkoKXtcclxuICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgdXJsOiBcIm1lbWJlclwiXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGJhY2soKXtcclxuICAgICAgd3gubmF2aWdhdGVCYWNrKHtcclxuICAgICAgICBkZWx0YTogMVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIC8v6Lez6L2s5pSv5LuY6aG16Z2iXHJcbiAgICBidG5yZXMoKXtcclxuICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgdXJsOiBcImFwcG9pbnREZXRhaWxcIlxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBvblJlYWNoQm90dG9tKCkge31cclxuXHJcbiAgd2hlbkFwcFJlYWR5U2hvdygpIHtcclxuICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKCd1c2VyL3VzZXJJbmZvLmpzb24nLCB7fSlcclxuICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHVzZXJJbmZvID0gZGF0YTtcclxuICAgICAgICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgIHd4LnNldFN0b3JhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICBrZXk6ICd1c2VySW5mbycsXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHVzZXJJbmZvKVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge30pO1xyXG4gIH1cclxuICBvblNob3coKSB7XHJcbiAgICAgIC8vIHd4LmhpZGVUYWJCYXIoKVxyXG4gIH1cclxuICBvblNoYXJlQXBwTWVzc2FnZShyZXMpIHt9XHJcbiAgcmVnaW9uY2hhbmdlKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZS50eXBlKTtcclxuICB9XHJcbiAgbWFya2VydGFwKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZS5tYXJrZXJJZCk7XHJcbiAgfVxyXG4gIGNvbnRyb2x0YXAoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlLmNvbnRyb2xJZCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==