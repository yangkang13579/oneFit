"use strict";

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
      navigationBarTitleText: "OneFit运动训练中心",
      navigationBarBackgroundColor: "#000"
    }, _this.components = {}, _this.data = {
      imgUrls: ["../../images/1.jpg", "../../images/2.jpg", "../../images/3.jpg"],
      boxImg: ['../../images/4.jpg', '../../images/5.jpg', '../../images/9.jpg', '../../images/7.jpg', '../../images/8.jpg'],
      loadUser: true,
      indicatorDots: true,
      vertical: false,
      autoplay: false,
      interval: 2000,
      duration: 500
    }, _this.methods = {}, _temp), _possibleConstructorReturn(_this, _ret);
  }
  // mixins = [PageMixin];


  _createClass(Home, [{
    key: "onReachBottom",
    value: function onReachBottom() {}
  }, {
    key: "whenAppReadyShow",
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
    key: "onShow",
    value: function onShow() {
      // wx.hideTabBar()
    }
  }, {
    key: "onShareAppMessage",
    value: function onShareAppMessage(res) {}
  }, {
    key: "regionchange",
    value: function regionchange(e) {
      console.log(e.type);
    }
  }, {
    key: "markertap",
    value: function markertap(e) {
      console.log(e.markerId);
    }
  }, {
    key: "controltap",
    value: function controltap(e) {
      console.log(e.controlId);
    }
  }]);

  return Home;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Home , 'pages/home/home'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUuanMiXSwibmFtZXMiOlsiSG9tZSIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsImRhdGEiLCJpbWdVcmxzIiwiYm94SW1nIiwibG9hZFVzZXIiLCJpbmRpY2F0b3JEb3RzIiwidmVydGljYWwiLCJhdXRvcGxheSIsImludGVydmFsIiwiZHVyYXRpb24iLCJtZXRob2RzIiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRoZW4iLCJ1c2VySW5mbyIsIiRhcHBseSIsInd4Iiwic2V0U3RvcmFnZSIsImtleSIsIkpTT04iLCJzdHJpbmdpZnkiLCJjYXRjaCIsImVycm9yIiwiaGlkZVRhYkJhciIsImluaXREYXRhIiwiaW5pdCIsIml0IiwicmVzIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJ0eXBlIiwibWFya2VySWQiLCJjb250cm9sSWQiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7OztBQUZBOzs7SUFHcUJBLEk7Ozs7Ozs7Ozs7Ozs7O2tMQUVuQkMsTSxHQUFTO0FBQ1BDLDhCQUF3QixjQURqQjtBQUVQQyxvQ0FBOEI7QUFGdkIsSyxRQUlUQyxVLEdBQWEsRSxRQUNiQyxJLEdBQU87QUFDTEMsZUFBUyxDQUFDLG9CQUFELEVBQXVCLG9CQUF2QixFQUE2QyxvQkFBN0MsQ0FESjtBQUVMQyxjQUFRLENBQ04sb0JBRE0sRUFFTixvQkFGTSxFQUdOLG9CQUhNLEVBSU4sb0JBSk0sRUFLTixvQkFMTSxDQUZIO0FBU0xDLGdCQUFVLElBVEw7QUFVTEMscUJBQWUsSUFWVjtBQVdMQyxnQkFBVSxLQVhMO0FBWUxDLGdCQUFVLEtBWkw7QUFhTEMsZ0JBQVUsSUFiTDtBQWNMQyxnQkFBVTtBQWRMLEssUUFnQlBDLE8sR0FBVSxFOztBQXRCVjs7Ozs7b0NBd0JnQixDQUFFOzs7dUNBRUM7QUFBQTs7QUFDakIsV0FBS0MsZ0JBQUwsQ0FBc0Isb0JBQXRCLEVBQTRDLEVBQTVDLEVBQ0dDLElBREgsQ0FDUSxnQkFBUTtBQUNaLFlBQU1DLFdBQVdaLElBQWpCO0FBQ0EsZUFBS2EsTUFBTDtBQUNBQyxXQUFHQyxVQUFILENBQWM7QUFDWkMsZUFBSyxVQURPO0FBRVpoQixnQkFBTWlCLEtBQUtDLFNBQUwsQ0FBZU4sUUFBZjtBQUZNLFNBQWQ7QUFJRCxPQVJILEVBU0dPLEtBVEgsQ0FTUyxVQUFTQyxLQUFULEVBQWdCLENBQUUsQ0FUM0I7QUFVQU4sU0FBR08sVUFBSDtBQUNBO0FBQ0E7QUFDQSxXQUFLQyxRQUFMO0FBQ0EsV0FBS0MsSUFBTDtBQUNBLFdBQUtWLE1BQUw7QUFDQSxXQUFLVyxFQUFMO0FBQ0Q7Ozs2QkFDUTtBQUNQO0FBQ0Q7OztzQ0FDaUJDLEcsRUFBSyxDQUFFOzs7aUNBQ1pDLEMsRUFBRztBQUNkQyxjQUFRQyxHQUFSLENBQVlGLEVBQUVHLElBQWQ7QUFDRDs7OzhCQUNTSCxDLEVBQUc7QUFDWEMsY0FBUUMsR0FBUixDQUFZRixFQUFFSSxRQUFkO0FBQ0Q7OzsrQkFDVUosQyxFQUFHO0FBQ1pDLGNBQVFDLEdBQVIsQ0FBWUYsRUFBRUssU0FBZDtBQUNEOzs7O0VBMUQrQkMsZUFBS0MsSTs7a0JBQWxCdEMsSSIsImZpbGUiOiJob21lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8qIGdsb2JhbCB3eCAqL1xyXG5pbXBvcnQgd2VweSBmcm9tIFwid2VweVwiO1xyXG5pbXBvcnQgUGFnZU1peGluIGZyb20gXCIuLi8uLi9taXhpbnMvcGFnZVwiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIb21lIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICAvLyBtaXhpbnMgPSBbUGFnZU1peGluXTtcclxuICBjb25maWcgPSB7XHJcbiAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiBcIk9uZUZpdOi/kOWKqOiuree7g+S4reW/g1wiLFxyXG4gICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogXCIjMDAwXCJcclxuICB9O1xyXG4gIGNvbXBvbmVudHMgPSB7fTtcclxuICBkYXRhID0ge1xyXG4gICAgaW1nVXJsczogW1wiLi4vLi4vaW1hZ2VzLzEuanBnXCIsIFwiLi4vLi4vaW1hZ2VzLzIuanBnXCIsIFwiLi4vLi4vaW1hZ2VzLzMuanBnXCJdLFxyXG4gICAgYm94SW1nOiBbXHJcbiAgICAgICcuLi8uLi9pbWFnZXMvNC5qcGcnLFxyXG4gICAgICAnLi4vLi4vaW1hZ2VzLzUuanBnJyxcclxuICAgICAgJy4uLy4uL2ltYWdlcy85LmpwZycsXHJcbiAgICAgICcuLi8uLi9pbWFnZXMvNy5qcGcnLFxyXG4gICAgICAnLi4vLi4vaW1hZ2VzLzguanBnJ1xyXG4gICAgXSxcclxuICAgIGxvYWRVc2VyOiB0cnVlLFxyXG4gICAgaW5kaWNhdG9yRG90czogdHJ1ZSxcclxuICAgIHZlcnRpY2FsOiBmYWxzZSxcclxuICAgIGF1dG9wbGF5OiBmYWxzZSxcclxuICAgIGludGVydmFsOiAyMDAwLFxyXG4gICAgZHVyYXRpb246IDUwMFxyXG4gIH07XHJcbiAgbWV0aG9kcyA9IHt9O1xyXG5cclxuICBvblJlYWNoQm90dG9tKCkge31cclxuXHJcbiAgd2hlbkFwcFJlYWR5U2hvdygpIHtcclxuICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShcInVzZXIvdXNlckluZm8uanNvblwiLCB7fSlcclxuICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgY29uc3QgdXNlckluZm8gPSBkYXRhO1xyXG4gICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICAgICAgd3guc2V0U3RvcmFnZSh7XHJcbiAgICAgICAgICBrZXk6IFwidXNlckluZm9cIixcclxuICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHVzZXJJbmZvKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHt9KTtcclxuICAgIHd4LmhpZGVUYWJCYXIoKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCd0aGlzLmN1cnJlbnRJbmRleCcsIHRoaXMuY3VycmVudEluZGV4KVxyXG4gICAgLy8gdGhpcy50YWJGdW5TZWNhaCh0aGlzLmN1cnJlbnRJbmRleClcclxuICAgIHRoaXMuaW5pdERhdGEoKTtcclxuICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgdGhpcy4kYXBwbHkoKTtcclxuICAgIHRoaXMuaXQoKTtcclxuICB9XHJcbiAgb25TaG93KCkge1xyXG4gICAgLy8gd3guaGlkZVRhYkJhcigpXHJcbiAgfVxyXG4gIG9uU2hhcmVBcHBNZXNzYWdlKHJlcykge31cclxuICByZWdpb25jaGFuZ2UoZSkge1xyXG4gICAgY29uc29sZS5sb2coZS50eXBlKTtcclxuICB9XHJcbiAgbWFya2VydGFwKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUubWFya2VySWQpO1xyXG4gIH1cclxuICBjb250cm9sdGFwKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUuY29udHJvbElkKTtcclxuICB9XHJcbn1cclxuIl19