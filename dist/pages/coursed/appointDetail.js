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


var AppointDetail = function (_wepy$page) {
  _inherits(AppointDetail, _wepy$page);

  function AppointDetail() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AppointDetail);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AppointDetail.__proto__ || Object.getPrototypeOf(AppointDetail)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
      navigationBarTitleText: '预约详情',
      navigationStyle: 'default',
      navigationBarBackgroundColor: '#e84644'
    }, _this.components = {}, _this.data = {
      list: [{ num: 1 }, { num: 2 }, { num: 3 }, { num: 4 }, { num: 5 }, { num: 6 }, { num: 7 }, { num: 8 }, { num: 9 }, { num: 10 }],
      tab: 1
    }, _this.methods = {
      right: function right() {
        if (this.tab == 1) {
          this.tab = 0;
        } else {
          this.tab = 1;
        }
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }
  // mixins = [PageMixin];


  _createClass(AppointDetail, [{
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
      this.tab = 1;
      var list = this.list;
      list.map(function (item, index) {
        item.check = false;
      });

      console.log('this.tab', this.list);
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

  return AppointDetail;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(AppointDetail , 'pages/coursed/appointDetail'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcG9pbnREZXRhaWwuanMiXSwibmFtZXMiOlsiQXBwb2ludERldGFpbCIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uU3R5bGUiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsImRhdGEiLCJsaXN0IiwibnVtIiwidGFiIiwibWV0aG9kcyIsInJpZ2h0IiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRoZW4iLCJ1c2VySW5mbyIsIiRhcHBseSIsInd4Iiwic2V0U3RvcmFnZSIsImtleSIsIkpTT04iLCJzdHJpbmdpZnkiLCJjYXRjaCIsImVycm9yIiwibWFwIiwiaXRlbSIsImluZGV4IiwiY2hlY2siLCJjb25zb2xlIiwibG9nIiwicmVzIiwiZSIsInR5cGUiLCJtYXJrZXJJZCIsImNvbnRyb2xJZCIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBRkE7OztJQUdxQkEsYTs7Ozs7Ozs7Ozs7Ozs7b01BRW5CQyxNLEdBQVM7QUFDTEMsOEJBQXdCLE1BRG5CO0FBRUxDLHVCQUFpQixTQUZaO0FBR0xDLG9DQUE4QjtBQUh6QixLLFFBS1RDLFUsR0FBYSxFLFFBQ2JDLEksR0FBTztBQUNMQyxZQUFLLENBQ0gsRUFBQ0MsS0FBSSxDQUFMLEVBREcsRUFFSCxFQUFDQSxLQUFJLENBQUwsRUFGRyxFQUdILEVBQUNBLEtBQUksQ0FBTCxFQUhHLEVBSUgsRUFBQ0EsS0FBSSxDQUFMLEVBSkcsRUFLSCxFQUFDQSxLQUFJLENBQUwsRUFMRyxFQU1ILEVBQUNBLEtBQUksQ0FBTCxFQU5HLEVBT0gsRUFBQ0EsS0FBSSxDQUFMLEVBUEcsRUFRSCxFQUFDQSxLQUFJLENBQUwsRUFSRyxFQVNILEVBQUNBLEtBQUksQ0FBTCxFQVRHLEVBVUgsRUFBQ0EsS0FBSSxFQUFMLEVBVkcsQ0FEQTtBQWFMQyxXQUFJO0FBYkMsSyxRQWVQQyxPLEdBQVU7QUFDUkMsV0FEUSxtQkFDRDtBQUNMLFlBQUcsS0FBS0YsR0FBTCxJQUFVLENBQWIsRUFBZTtBQUNiLGVBQUtBLEdBQUwsR0FBVyxDQUFYO0FBQ0QsU0FGRCxNQUVLO0FBQ0gsZUFBS0EsR0FBTCxHQUFXLENBQVg7QUFDRDtBQUNGO0FBUE8sSzs7QUF0QlY7Ozs7O29DQWlDZ0IsQ0FBRTs7O3VDQUVDO0FBQUE7O0FBQ2YsV0FBS0csZ0JBQUwsQ0FBc0Isb0JBQXRCLEVBQTRDLEVBQTVDLEVBQ0tDLElBREwsQ0FDVSxnQkFBUTtBQUNWLFlBQU1DLFdBQVdSLElBQWpCO0FBQ0EsZUFBS1MsTUFBTDtBQUNBQyxXQUFHQyxVQUFILENBQWM7QUFDVkMsZUFBSyxVQURLO0FBRVZaLGdCQUFNYSxLQUFLQyxTQUFMLENBQWVOLFFBQWY7QUFGSSxTQUFkO0FBSUgsT0FSTCxFQVNLTyxLQVRMLENBU1csVUFBU0MsS0FBVCxFQUFnQixDQUFFLENBVDdCO0FBVUg7Ozs2QkFDUTtBQUNQLFdBQUtiLEdBQUwsR0FBVyxDQUFYO0FBQ0EsVUFBSUYsT0FBTyxLQUFLQSxJQUFoQjtBQUNBQSxXQUFLZ0IsR0FBTCxDQUFTLFVBQUNDLElBQUQsRUFBTUMsS0FBTixFQUFjO0FBQ3JCRCxhQUFLRSxLQUFMLEdBQWEsS0FBYjtBQUNELE9BRkQ7O0FBS0FDLGNBQVFDLEdBQVIsQ0FBWSxVQUFaLEVBQXVCLEtBQUtyQixJQUE1QjtBQUNFO0FBQ0g7OztzQ0FDaUJzQixHLEVBQUssQ0FBRTs7O2lDQUNaQyxDLEVBQUc7QUFDWkgsY0FBUUMsR0FBUixDQUFZRSxFQUFFQyxJQUFkO0FBQ0g7Ozs4QkFDU0QsQyxFQUFHO0FBQ1RILGNBQVFDLEdBQVIsQ0FBWUUsRUFBRUUsUUFBZDtBQUNIOzs7K0JBQ1VGLEMsRUFBRztBQUNWSCxjQUFRQyxHQUFSLENBQVlFLEVBQUVHLFNBQWQ7QUFDSDs7OztFQXBFd0NDLGVBQUtDLEk7O2tCQUEzQm5DLGEiLCJmaWxlIjoiYXBwb2ludERldGFpbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKiBnbG9iYWwgd3ggKi9cclxuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XHJcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vLi4vbWl4aW5zL3BhZ2UnO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcHBvaW50RGV0YWlsIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICAvLyBtaXhpbnMgPSBbUGFnZU1peGluXTtcclxuICBjb25maWcgPSB7XHJcbiAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfpooTnuqbor6bmg4UnLFxyXG4gICAgICBuYXZpZ2F0aW9uU3R5bGU6ICdkZWZhdWx0JyxcclxuICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNlODQ2NDQnXHJcbiAgfTtcclxuICBjb21wb25lbnRzID0ge307XHJcbiAgZGF0YSA9IHtcclxuICAgIGxpc3Q6W1xyXG4gICAgICB7bnVtOjF9LFxyXG4gICAgICB7bnVtOjJ9LFxyXG4gICAgICB7bnVtOjN9LFxyXG4gICAgICB7bnVtOjR9LFxyXG4gICAgICB7bnVtOjV9LFxyXG4gICAgICB7bnVtOjZ9LFxyXG4gICAgICB7bnVtOjd9LFxyXG4gICAgICB7bnVtOjh9LFxyXG4gICAgICB7bnVtOjl9LFxyXG4gICAgICB7bnVtOjEwfVxyXG4gICAgXSxcclxuICAgIHRhYjoxLFxyXG4gIH07XHJcbiAgbWV0aG9kcyA9IHtcclxuICAgIHJpZ2h0KCl7XHJcbiAgICAgIGlmKHRoaXMudGFiPT0xKXtcclxuICAgICAgICB0aGlzLnRhYiA9IDA7XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgIHRoaXMudGFiID0gMTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICBcclxuICB9O1xyXG5cclxuICBvblJlYWNoQm90dG9tKCkge31cclxuXHJcbiAgd2hlbkFwcFJlYWR5U2hvdygpIHtcclxuICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKCd1c2VyL3VzZXJJbmZvLmpzb24nLCB7fSlcclxuICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHVzZXJJbmZvID0gZGF0YTtcclxuICAgICAgICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgIHd4LnNldFN0b3JhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICBrZXk6ICd1c2VySW5mbycsXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHVzZXJJbmZvKVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge30pO1xyXG4gIH1cclxuICBvblNob3coKSB7XHJcbiAgICB0aGlzLnRhYiA9IDE7XHJcbiAgICBsZXQgbGlzdCA9IHRoaXMubGlzdDtcclxuICAgIGxpc3QubWFwKChpdGVtLGluZGV4KT0+e1xyXG4gICAgICBpdGVtLmNoZWNrID0gZmFsc2U7XHJcbiAgICB9KVxyXG5cclxuICAgIFxyXG4gICAgY29uc29sZS5sb2coJ3RoaXMudGFiJyx0aGlzLmxpc3QpXHJcbiAgICAgIC8vIHd4LmhpZGVUYWJCYXIoKVxyXG4gIH1cclxuICBvblNoYXJlQXBwTWVzc2FnZShyZXMpIHt9XHJcbiAgcmVnaW9uY2hhbmdlKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZS50eXBlKTtcclxuICB9XHJcbiAgbWFya2VydGFwKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZS5tYXJrZXJJZCk7XHJcbiAgfVxyXG4gIGNvbnRyb2x0YXAoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlLmNvbnRyb2xJZCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==