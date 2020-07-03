"use strict";

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


var GitSample = function (_wepy$page) {
  _inherits(GitSample, _wepy$page);

  function GitSample() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, GitSample);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = GitSample.__proto__ || Object.getPrototypeOf(GitSample)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
      navigationBarTitleText: "样品申领",
      navigationBarBackgroundColor: "#fff"
    }, _this.components = {}, _this.data = {
      list: [],
      userInfo: []
    }, _this.methods = {
      toFrom: function toFrom(e) {
        console.log("e", e);
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
          url: '/pages/form?id=' + id
        });
      },

      // 我的样品申领
      mySamples: function mySamples() {
        wx.navigateTo({
          url: "/pages/meMaple"
        });
      },
      goDetails: function goDetails(e) {
        console.log("e11", e);
        var id = e.currentTarget.dataset.id;
        console.log(id);
        wx.navigateTo({
          url: '/pages/sampleDetail?id=' + id
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(GitSample, [{
    key: "onLoad",
    value: function onLoad() {}
  }, {
    key: "init",
    value: function init() {
      var _this2 = this;

      this.fetchDataPromise("user/userInfo.json", {}).then(function (data) {
        console.log("6677", data);
        _this2.userInfo = data;
        _this2.$apply();
      }).catch(function (error) {});
    }
  }, {
    key: "whenAppReadyShow",
    value: function whenAppReadyShow() {
      var _this3 = this;

      this.fetchDataPromise("wx/specimen/querySpecimenApi.json", {}).then(function (data) {
        console.log("11 ", data);
        _this3.list = data.list;
        _this3.init();
        _this3.$apply();
      }).catch(function (error) {});
    }
  }]);

  return GitSample;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(GitSample , 'pages/gitSample'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdpdFNhbXBsZS5qcyJdLCJuYW1lcyI6WyJHaXRTYW1wbGUiLCJtaXhpbnMiLCJQYWdlTWl4aW4iLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsImNvbXBvbmVudHMiLCJkYXRhIiwibGlzdCIsInVzZXJJbmZvIiwibWV0aG9kcyIsInRvRnJvbSIsImUiLCJjb25zb2xlIiwibG9nIiwiaWQiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YXNldCIsInd4IiwibmF2aWdhdGVUbyIsInVybCIsIm15U2FtcGxlcyIsImdvRGV0YWlscyIsImZldGNoRGF0YVByb21pc2UiLCJ0aGVuIiwiJGFwcGx5IiwiY2F0Y2giLCJlcnJvciIsImluaXQiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7OztBQUZBOzs7SUFHcUJBLFM7Ozs7Ozs7Ozs7Ozs7OzRMQUNuQkMsTSxHQUFTLENBQUNDLGNBQUQsQyxRQUNUQyxNLEdBQVM7QUFDUEMsOEJBQXdCLE1BRGpCO0FBRVBDLG9DQUE4QjtBQUZ2QixLLFFBSVRDLFUsR0FBYSxFLFFBQ2JDLEksR0FBTztBQUNMQyxZQUFLLEVBREE7QUFFTEMsZ0JBQVM7QUFGSixLLFFBSVBDLE8sR0FBVTtBQUNSQyxZQURRLGtCQUNEQyxDQURDLEVBQ0M7QUFDUEMsZ0JBQVFDLEdBQVIsQ0FBWSxHQUFaLEVBQWdCRixDQUFoQjtBQUNBLFlBQUlHLEtBQUtILEVBQUVJLGFBQUYsQ0FBZ0JDLE9BQWhCLENBQXdCRixFQUFqQztBQUNBRyxXQUFHQyxVQUFILENBQWM7QUFDVkMsZUFBSyxvQkFBb0JMO0FBRGYsU0FBZDtBQUdELE9BUE87O0FBUUw7QUFDSE0sZUFUUSx1QkFTRztBQUNWSCxXQUFHQyxVQUFILENBQWM7QUFDWEMsZUFBSztBQURNLFNBQWQ7QUFHQSxPQWJPO0FBZVRFLGVBZlMscUJBZUNWLENBZkQsRUFlRztBQUNUQyxnQkFBUUMsR0FBUixDQUFZLEtBQVosRUFBa0JGLENBQWxCO0FBQ0YsWUFBSUcsS0FBS0gsRUFBRUksYUFBRixDQUFnQkMsT0FBaEIsQ0FBd0JGLEVBQWpDO0FBQ0FGLGdCQUFRQyxHQUFSLENBQVlDLEVBQVo7QUFDQ0csV0FBR0MsVUFBSCxDQUFjO0FBQ1hDLGVBQUssNEJBQTRCTDtBQUR0QixTQUFkO0FBSUQ7QUF2QlEsSzs7Ozs7NkJBeUJGLENBQ1A7OzsyQkFDTTtBQUFBOztBQUNILFdBQUtRLGdCQUFMLENBQXNCLG9CQUF0QixFQUE0QyxFQUE1QyxFQUNHQyxJQURILENBQ1EsZ0JBQVE7QUFDWlgsZ0JBQVFDLEdBQVIsQ0FBWSxNQUFaLEVBQW1CUCxJQUFuQjtBQUNBLGVBQUtFLFFBQUwsR0FBZ0JGLElBQWhCO0FBQ0EsZUFBS2tCLE1BQUw7QUFDRCxPQUxILEVBTUdDLEtBTkgsQ0FNUyxVQUFTQyxLQUFULEVBQWdCLENBQUUsQ0FOM0I7QUFPRDs7O3VDQUNnQjtBQUFBOztBQUNqQixXQUFLSixnQkFBTCxDQUFzQixtQ0FBdEIsRUFBMkQsRUFBM0QsRUFDR0MsSUFESCxDQUNRLGdCQUFRO0FBQ1pYLGdCQUFRQyxHQUFSLENBQVksS0FBWixFQUFtQlAsSUFBbkI7QUFDQSxlQUFLQyxJQUFMLEdBQVlELEtBQUtDLElBQWpCO0FBQ0EsZUFBS29CLElBQUw7QUFDQSxlQUFLSCxNQUFMO0FBQ0QsT0FOSCxFQU9HQyxLQVBILENBT1MsVUFBU0MsS0FBVCxFQUFnQixDQUFFLENBUDNCO0FBVUQ7Ozs7RUExRG9DRSxlQUFLQyxJOztrQkFBdkI5QixTIiwiZmlsZSI6ImdpdFNhbXBsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyogZ2xvYmFsIHd4ICovXG5pbXBvcnQgd2VweSBmcm9tIFwid2VweVwiO1xuaW1wb3J0IFBhZ2VNaXhpbiBmcm9tIFwiLi4vbWl4aW5zL3BhZ2VcIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdFNhbXBsZSBleHRlbmRzIHdlcHkucGFnZSB7XG4gIG1peGlucyA9IFtQYWdlTWl4aW5dO1xuICBjb25maWcgPSB7XG4gICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogXCLmoLflk4HnlLPpooZcIixcbiAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIlxuICB9O1xuICBjb21wb25lbnRzID0ge307XG4gIGRhdGEgPSB7XG4gICAgbGlzdDpbXSxcbiAgICB1c2VySW5mbzpbXVxuICB9O1xuICBtZXRob2RzID0ge1xuICAgIHRvRnJvbShlKXtcbiAgICAgIGNvbnNvbGUubG9nKFwiZVwiLGUpXG4gICAgICBsZXQgaWQgPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pZDtcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICAgIHVybDogJy9wYWdlcy9mb3JtP2lkPScgKyBpZFxuICAgICAgfSk7XG4gICAgfSxcbiAgICAgICAvLyDmiJHnmoTmoLflk4HnlLPpooZcbiAgICBteVNhbXBsZXMoKXtcbiAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgIHVybDogXCIvcGFnZXMvbWVNYXBsZVwiXG4gICAgICB9KTtcbiAgICB9LFxuICAgIFxuICAgZ29EZXRhaWxzKGUpe1xuICAgICAgY29uc29sZS5sb2coXCJlMTFcIixlKVxuICAgIGxldCBpZCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmlkO1xuICAgIGNvbnNvbGUubG9nKGlkKVxuICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgdXJsOiAnL3BhZ2VzL3NhbXBsZURldGFpbD9pZD0nICsgaWRcbiAgICAgfSk7XG4gICAgXG4gICB9XG4gIH1cbiAgb25Mb2FkKCl7XG4gIH1cbiAgIGluaXQoKXtcbiAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShcInVzZXIvdXNlckluZm8uanNvblwiLCB7fSlcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCI2Njc3XCIsZGF0YSlcbiAgICAgICAgICB0aGlzLnVzZXJJbmZvID0gZGF0YVxuICAgICAgICAgIHRoaXMuJGFwcGx5KClcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7fSk7XG4gICAgfVxuICB3aGVuQXBwUmVhZHlTaG93KCkge1xuICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShcInd4L3NwZWNpbWVuL3F1ZXJ5U3BlY2ltZW5BcGkuanNvblwiLCB7fSlcbiAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIjExIFwiLCBkYXRhKTtcbiAgICAgICAgdGhpcy5saXN0ID0gZGF0YS5saXN0O1xuICAgICAgICB0aGlzLmluaXQoKVxuICAgICAgICB0aGlzLiRhcHBseSgpXG4gICAgICB9KVxuICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7fSk7XG4gICAgICBcbiAgICAgIFxuICB9XG59XG4iXX0=