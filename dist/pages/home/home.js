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
            navigationBarTitleText: 'OneFit运动训练中心',
            navigationBarBackgroundColor: '#000'
        }, _this.components = {}, _this.data = {
            imgUrls: ['../../images/1.jpg', '../../images/2.jpg', '../../images/3.jpg'],
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


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Home , 'pages/home/home'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUuanMiXSwibmFtZXMiOlsiSG9tZSIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsImRhdGEiLCJpbWdVcmxzIiwiYm94SW1nIiwibG9hZFVzZXIiLCJpbmRpY2F0b3JEb3RzIiwidmVydGljYWwiLCJhdXRvcGxheSIsImludGVydmFsIiwiZHVyYXRpb24iLCJtZXRob2RzIiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRoZW4iLCJ1c2VySW5mbyIsIiRhcHBseSIsInd4Iiwic2V0U3RvcmFnZSIsImtleSIsIkpTT04iLCJzdHJpbmdpZnkiLCJjYXRjaCIsImVycm9yIiwiaGlkZVRhYkJhciIsImluaXREYXRhIiwiaW5pdCIsIml0IiwicmVzIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJ0eXBlIiwibWFya2VySWQiLCJjb250cm9sSWQiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7OztBQUZBOzs7SUFHcUJBLEk7Ozs7Ozs7Ozs7Ozs7O3NMQUVuQkMsTSxHQUFTO0FBQ0xDLG9DQUF3QixjQURuQjtBQUVMQywwQ0FBOEI7QUFGekIsUyxRQUlUQyxVLEdBQWEsRSxRQUNiQyxJLEdBQU87QUFDSEMscUJBQVMsQ0FBQyxvQkFBRCxFQUF1QixvQkFBdkIsRUFBNkMsb0JBQTdDLENBRE47QUFFSEMsb0JBQVEsQ0FDSixvQkFESSxFQUVKLG9CQUZJLEVBR0osb0JBSEksRUFJSixvQkFKSSxFQUtKLG9CQUxJLENBRkw7QUFTSEMsc0JBQVUsSUFUUDtBQVVIQywyQkFBZSxJQVZaO0FBV0hDLHNCQUFVLEtBWFA7QUFZSEMsc0JBQVUsS0FaUDtBQWFIQyxzQkFBVSxJQWJQO0FBY0hDLHNCQUFVO0FBZFAsUyxRQWdCUEMsTyxHQUFVLEU7O0FBdEJWOzs7Ozt3Q0F3QmdCLENBQUU7OzsyQ0FFQztBQUFBOztBQUNmLGlCQUFLQyxnQkFBTCxDQUFzQixvQkFBdEIsRUFBNEMsRUFBNUMsRUFDS0MsSUFETCxDQUNVLGdCQUFRO0FBQ1Ysb0JBQU1DLFdBQVdaLElBQWpCO0FBQ0EsdUJBQUthLE1BQUw7QUFDQUMsbUJBQUdDLFVBQUgsQ0FBYztBQUNWQyx5QkFBSyxVQURLO0FBRVZoQiwwQkFBTWlCLEtBQUtDLFNBQUwsQ0FBZU4sUUFBZjtBQUZJLGlCQUFkO0FBSUgsYUFSTCxFQVNLTyxLQVRMLENBU1csVUFBU0MsS0FBVCxFQUFnQixDQUFFLENBVDdCO0FBVUFOLGVBQUdPLFVBQUg7QUFDQTtBQUNBO0FBQ0EsaUJBQUtDLFFBQUw7QUFDQSxpQkFBS0MsSUFBTDtBQUNBLGlCQUFLVixNQUFMO0FBQ0EsaUJBQUtXLEVBQUw7QUFDSDs7O2lDQUNRO0FBQ0w7QUFDSDs7OzBDQUNpQkMsRyxFQUFLLENBQUU7OztxQ0FDWkMsQyxFQUFHO0FBQ1pDLG9CQUFRQyxHQUFSLENBQVlGLEVBQUVHLElBQWQ7QUFDSDs7O2tDQUNTSCxDLEVBQUc7QUFDVEMsb0JBQVFDLEdBQVIsQ0FBWUYsRUFBRUksUUFBZDtBQUNIOzs7bUNBQ1VKLEMsRUFBRztBQUNWQyxvQkFBUUMsR0FBUixDQUFZRixFQUFFSyxTQUFkO0FBQ0g7Ozs7RUExRCtCQyxlQUFLQyxJOztrQkFBbEJ0QyxJIiwiZmlsZSI6ImhvbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyogZ2xvYmFsIHd4ICovXHJcbmltcG9ydCB3ZXB5IGZyb20gJ3dlcHknO1xyXG5pbXBvcnQgUGFnZU1peGluIGZyb20gJy4uLy4uL21peGlucy9wYWdlJztcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSG9tZSBleHRlbmRzIHdlcHkucGFnZSB7XHJcbiAgLy8gbWl4aW5zID0gW1BhZ2VNaXhpbl07XHJcbiAgY29uZmlnID0ge1xyXG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAnT25lRml06L+Q5Yqo6K6t57uD5Lit5b+DJyxcclxuICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyMwMDAnXHJcbiAgfTtcclxuICBjb21wb25lbnRzID0ge307XHJcbiAgZGF0YSA9IHtcclxuICAgICAgaW1nVXJsczogWycuLi8uLi9pbWFnZXMvMS5qcGcnLCAnLi4vLi4vaW1hZ2VzLzIuanBnJywgJy4uLy4uL2ltYWdlcy8zLmpwZyddLFxyXG4gICAgICBib3hJbWc6IFtcclxuICAgICAgICAgICcuLi8uLi9pbWFnZXMvNC5qcGcnLFxyXG4gICAgICAgICAgJy4uLy4uL2ltYWdlcy81LmpwZycsXHJcbiAgICAgICAgICAnLi4vLi4vaW1hZ2VzLzkuanBnJyxcclxuICAgICAgICAgICcuLi8uLi9pbWFnZXMvNy5qcGcnLFxyXG4gICAgICAgICAgJy4uLy4uL2ltYWdlcy84LmpwZydcclxuICAgICAgXSxcclxuICAgICAgbG9hZFVzZXI6IHRydWUsXHJcbiAgICAgIGluZGljYXRvckRvdHM6IHRydWUsXHJcbiAgICAgIHZlcnRpY2FsOiBmYWxzZSxcclxuICAgICAgYXV0b3BsYXk6IGZhbHNlLFxyXG4gICAgICBpbnRlcnZhbDogMjAwMCxcclxuICAgICAgZHVyYXRpb246IDUwMFxyXG4gIH07XHJcbiAgbWV0aG9kcyA9IHt9O1xyXG5cclxuICBvblJlYWNoQm90dG9tKCkge31cclxuXHJcbiAgd2hlbkFwcFJlYWR5U2hvdygpIHtcclxuICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKCd1c2VyL3VzZXJJbmZvLmpzb24nLCB7fSlcclxuICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHVzZXJJbmZvID0gZGF0YTtcclxuICAgICAgICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgIHd4LnNldFN0b3JhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICBrZXk6ICd1c2VySW5mbycsXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHVzZXJJbmZvKVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge30pO1xyXG4gICAgICB3eC5oaWRlVGFiQmFyKCk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd0aGlzLmN1cnJlbnRJbmRleCcsIHRoaXMuY3VycmVudEluZGV4KVxyXG4gICAgICAvLyB0aGlzLnRhYkZ1blNlY2FoKHRoaXMuY3VycmVudEluZGV4KVxyXG4gICAgICB0aGlzLmluaXREYXRhKCk7XHJcbiAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICB0aGlzLml0KCk7XHJcbiAgfVxyXG4gIG9uU2hvdygpIHtcclxuICAgICAgLy8gd3guaGlkZVRhYkJhcigpXHJcbiAgfVxyXG4gIG9uU2hhcmVBcHBNZXNzYWdlKHJlcykge31cclxuICByZWdpb25jaGFuZ2UoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlLnR5cGUpO1xyXG4gIH1cclxuICBtYXJrZXJ0YXAoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlLm1hcmtlcklkKTtcclxuICB9XHJcbiAgY29udHJvbHRhcChlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUuY29udHJvbElkKTtcclxuICB9XHJcbn1cclxuIl19