'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _page = require('./../mixins/page.js');

var _page2 = _interopRequireDefault(_page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/* global wx */


var Home = function (_wepy$page) {
  _inherits(Home, _wepy$page);

  function Home() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Home);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Home.__proto__ || Object.getPrototypeOf(Home)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
      navigationBarTitleText: '首页',
      navigationBarBackgroundColor: '#fff'
    }, _this.components = {}, _this.data = {
      loadUser: true

    }, _this.methods = {}, _temp), _possibleConstructorReturn(_this, _ret);
  }
  // mixins = [PageMixin];


  _createClass(Home, [{
    key: 'onReachBottom',
    value: function onReachBottom() {}
  }, {
    key: 'whenAppReadyShow',
    value: function whenAppReadyShow() {
      var _this2 = this;

      this.fetchDataPromise("user/userInfo.json", {}).then(function (data) {
        var userInfo = data;
        _this2.$apply();
        wx.setStorage({
          key: "userInfo",
          data: JSON.stringify(userInfo)
        });
      }).catch(function (error) {});
      wx.hideTabBar();
      // console.log('this.currentIndex', this.currentIndex)
      // this.tabFunSecah(this.currentIndex)
      this.initData();
      this.init();
      this.$apply();
      this.it();
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

  return Home;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(Home , 'pages/home'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUuanMiXSwibmFtZXMiOlsiSG9tZSIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsImRhdGEiLCJsb2FkVXNlciIsIm1ldGhvZHMiLCJmZXRjaERhdGFQcm9taXNlIiwidGhlbiIsInVzZXJJbmZvIiwiJGFwcGx5Iiwid3giLCJzZXRTdG9yYWdlIiwia2V5IiwiSlNPTiIsInN0cmluZ2lmeSIsImNhdGNoIiwiZXJyb3IiLCJoaWRlVGFiQmFyIiwiaW5pdERhdGEiLCJpbml0IiwiaXQiLCJyZXMiLCJlIiwiY29uc29sZSIsImxvZyIsInR5cGUiLCJtYXJrZXJJZCIsImNvbnRyb2xJZCIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVFOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBRkE7OztJQUdxQkEsSTs7Ozs7Ozs7Ozs7Ozs7a0xBRW5CQyxNLEdBQVM7QUFDUEMsOEJBQXdCLElBRGpCO0FBRVBDLG9DQUE4QjtBQUZ2QixLLFFBSVRDLFUsR0FBYSxFLFFBQ2JDLEksR0FBTztBQUNMQyxnQkFBVTs7QUFETCxLLFFBSVBDLE8sR0FBVSxFOztBQVZWOzs7OztvQ0FlZSxDQUNmOzs7dUNBR21CO0FBQUE7O0FBQ2pCLFdBQUtDLGdCQUFMLENBQXNCLG9CQUF0QixFQUE0QyxFQUE1QyxFQUNDQyxJQURELENBQ00sZ0JBQVE7QUFDWixZQUFNQyxXQUFXTCxJQUFqQjtBQUNBLGVBQUtNLE1BQUw7QUFDQUMsV0FBR0MsVUFBSCxDQUFjO0FBQ1pDLGVBQUksVUFEUTtBQUVaVCxnQkFBS1UsS0FBS0MsU0FBTCxDQUFlTixRQUFmO0FBRk8sU0FBZDtBQUlELE9BUkQsRUFTQ08sS0FURCxDQVNPLFVBQVNDLEtBQVQsRUFBZ0IsQ0FBRSxDQVR6QjtBQVVBTixTQUFHTyxVQUFIO0FBQ0E7QUFDQTtBQUNBLFdBQUtDLFFBQUw7QUFDRCxXQUFLQyxJQUFMO0FBQ0MsV0FBS1YsTUFBTDtBQUNBLFdBQUtXLEVBQUw7QUFDRDs7OzZCQUNTO0FBQ1I7QUFDRDs7O3NDQUNpQkMsRyxFQUFLLENBQUU7OztpQ0FDWkMsQyxFQUFHO0FBQ2RDLGNBQVFDLEdBQVIsQ0FBWUYsRUFBRUcsSUFBZDtBQUNEOzs7OEJBQ1NILEMsRUFBRztBQUNYQyxjQUFRQyxHQUFSLENBQVlGLEVBQUVJLFFBQWQ7QUFDRDs7OytCQUNVSixDLEVBQUc7QUFDWkMsY0FBUUMsR0FBUixDQUFZRixFQUFFSyxTQUFkO0FBQ0Q7Ozs7RUFuRCtCQyxlQUFLQyxJOztrQkFBbEIvQixJIiwiZmlsZSI6ImhvbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuICAvKiBnbG9iYWwgd3ggKi9cclxuICBpbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcclxuICBpbXBvcnQgUGFnZU1peGluIGZyb20gJy4uL21peGlucy9wYWdlJztcclxuICBleHBvcnQgZGVmYXVsdCBjbGFzcyBIb21lIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICAgIC8vIG1peGlucyA9IFtQYWdlTWl4aW5dO1xyXG4gICAgY29uZmlnID0ge1xyXG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn6aaW6aG1JyxcclxuICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNmZmYnXHJcbiAgICB9O1xyXG4gICAgY29tcG9uZW50cyA9IHt9O1xyXG4gICAgZGF0YSA9IHtcclxuICAgICAgbG9hZFVzZXI6IHRydWUsXHJcbiAgICAgXHJcbiAgICB9XHJcbiAgICBtZXRob2RzID0ge1xyXG5cclxuICAgIFxyXG4gICAgfTtcclxuXHJcbiAgIG9uUmVhY2hCb3R0b20oKSB7XHJcbiAgIH1cclxuICAgIFxyXG5cclxuICAgIHdoZW5BcHBSZWFkeVNob3coKSB7XHJcbiAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShcInVzZXIvdXNlckluZm8uanNvblwiLCB7fSlcclxuICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgY29uc3QgdXNlckluZm8gPSBkYXRhXHJcbiAgICAgICAgdGhpcy4kYXBwbHkoKVxyXG4gICAgICAgIHd4LnNldFN0b3JhZ2Uoe1xyXG4gICAgICAgICAga2V5OlwidXNlckluZm9cIixcclxuICAgICAgICAgIGRhdGE6SlNPTi5zdHJpbmdpZnkodXNlckluZm8pXHJcbiAgICAgICAgfSlcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7fSk7XHJcbiAgICAgIHd4LmhpZGVUYWJCYXIoKVxyXG4gICAgICAvLyBjb25zb2xlLmxvZygndGhpcy5jdXJyZW50SW5kZXgnLCB0aGlzLmN1cnJlbnRJbmRleClcclxuICAgICAgLy8gdGhpcy50YWJGdW5TZWNhaCh0aGlzLmN1cnJlbnRJbmRleClcclxuICAgICAgdGhpcy5pbml0RGF0YSgpO1xyXG4gICAgIHRoaXMuaW5pdCgpXHJcbiAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICAgIHRoaXMuaXQoKVxyXG4gICAgfVxyXG4gICAgb25TaG93ICgpIHtcclxuICAgICAgLy8gd3guaGlkZVRhYkJhcigpXHJcbiAgICB9XHJcbiAgICBvblNoYXJlQXBwTWVzc2FnZShyZXMpIHt9XHJcbiAgICByZWdpb25jaGFuZ2UoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlLnR5cGUpO1xyXG4gICAgfVxyXG4gICAgbWFya2VydGFwKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZS5tYXJrZXJJZCk7XHJcbiAgICB9XHJcbiAgICBjb250cm9sdGFwKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZS5jb250cm9sSWQpO1xyXG4gICAgfVxyXG4gIH1cclxuIl19