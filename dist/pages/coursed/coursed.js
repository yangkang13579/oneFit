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


var Course = function (_wepy$page) {
  _inherits(Course, _wepy$page);

  function Course() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Course);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Course.__proto__ || Object.getPrototypeOf(Course)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
      navigationBarTitleText: "首页",
      navigationBarBackgroundColor: "#fff"
    }, _this.components = {}, _this.data = {
      loadUser: true,
      isShow: true,
      open: false,
      tab: 1
    }, _this.methods = {
      goCoach: function goCoach() {
        wx.navigateTo({
          url: 'coach'
        });
      },
      tap_ch: function tap_ch() {
        console.log("777");
        if (this.data.open) {
          this.open = false;
        } else {
          this.open = true;
        }
      },
      btn: function btn() {
        this.isShow = !this.isShow;
        this.$apply();
      },
      tabs: function tabs() {
        console.log("this.tab", this.tab);
        if (this.tab == 1) {
          this.tab = 2;
        } else {
          this.tab = 1;
        }
        this.$apply();
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }
  // mixins = [PageMixin];


  _createClass(Course, [{
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

  return Course;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Course , 'pages/coursed/coursed'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvdXJzZWQuanMiXSwibmFtZXMiOlsiQ291cnNlIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJjb21wb25lbnRzIiwiZGF0YSIsImxvYWRVc2VyIiwiaXNTaG93Iiwib3BlbiIsInRhYiIsIm1ldGhvZHMiLCJnb0NvYWNoIiwid3giLCJuYXZpZ2F0ZVRvIiwidXJsIiwidGFwX2NoIiwiY29uc29sZSIsImxvZyIsImJ0biIsIiRhcHBseSIsInRhYnMiLCJmZXRjaERhdGFQcm9taXNlIiwidGhlbiIsInVzZXJJbmZvIiwic2V0U3RvcmFnZSIsImtleSIsIkpTT04iLCJzdHJpbmdpZnkiLCJjYXRjaCIsImVycm9yIiwicmVzIiwiZSIsInR5cGUiLCJtYXJrZXJJZCIsImNvbnRyb2xJZCIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBRkE7OztJQUdxQkEsTTs7Ozs7Ozs7Ozs7Ozs7c0xBRW5CQyxNLEdBQVM7QUFDUEMsOEJBQXdCLElBRGpCO0FBRVBDLG9DQUE4QjtBQUZ2QixLLFFBSVRDLFUsR0FBYSxFLFFBQ2JDLEksR0FBTztBQUNMQyxnQkFBVSxJQURMO0FBRUxDLGNBQVEsSUFGSDtBQUdMQyxZQUFLLEtBSEE7QUFJTEMsV0FBSztBQUpBLEssUUFNUEMsTyxHQUFVO0FBQ1JDLGFBRFEscUJBQ0M7QUFDTEMsV0FBR0MsVUFBSCxDQUFjO0FBQ1pDLGVBQUs7QUFETyxTQUFkO0FBR0gsT0FMTztBQU1SQyxZQU5RLG9CQU1DO0FBQ1BDLGdCQUFRQyxHQUFSLENBQVksS0FBWjtBQUNBLFlBQUcsS0FBS1osSUFBTCxDQUFVRyxJQUFiLEVBQWtCO0FBQ2hCLGVBQUtBLElBQUwsR0FBWSxLQUFaO0FBQ0QsU0FGRCxNQUVLO0FBQ0osZUFBS0EsSUFBTCxHQUFZLElBQVo7QUFDQTtBQUNKLE9BYlM7QUFjUlUsU0FkUSxpQkFjRjtBQUNKLGFBQUtYLE1BQUwsR0FBYyxDQUFDLEtBQUtBLE1BQXBCO0FBQ0EsYUFBS1ksTUFBTDtBQUNELE9BakJPO0FBa0JSQyxVQWxCUSxrQkFrQkQ7QUFDTEosZ0JBQVFDLEdBQVIsQ0FBWSxVQUFaLEVBQXdCLEtBQUtSLEdBQTdCO0FBQ0EsWUFBSSxLQUFLQSxHQUFMLElBQVksQ0FBaEIsRUFBbUI7QUFDakIsZUFBS0EsR0FBTCxHQUFXLENBQVg7QUFDRCxTQUZELE1BRU87QUFDTCxlQUFLQSxHQUFMLEdBQVcsQ0FBWDtBQUNEO0FBQ0QsYUFBS1UsTUFBTDtBQUNEO0FBMUJPLEs7O0FBWlY7Ozs7O29DQXlDZ0IsQ0FBRTs7O3VDQUVDO0FBQUE7O0FBQ2pCLFdBQUtFLGdCQUFMLENBQXNCLG9CQUF0QixFQUE0QyxFQUE1QyxFQUNHQyxJQURILENBQ1EsZ0JBQVE7QUFDWixZQUFNQyxXQUFXbEIsSUFBakI7QUFDQSxlQUFLYyxNQUFMO0FBQ0FQLFdBQUdZLFVBQUgsQ0FBYztBQUNaQyxlQUFLLFVBRE87QUFFWnBCLGdCQUFNcUIsS0FBS0MsU0FBTCxDQUFlSixRQUFmO0FBRk0sU0FBZDtBQUlELE9BUkgsRUFTR0ssS0FUSCxDQVNTLFVBQVNDLEtBQVQsRUFBZ0IsQ0FBRSxDQVQzQjtBQVVEOzs7NkJBQ1E7QUFDUDtBQUNEOzs7c0NBQ2lCQyxHLEVBQUssQ0FBRTs7O2lDQUNaQyxDLEVBQUc7QUFDZGYsY0FBUUMsR0FBUixDQUFZYyxFQUFFQyxJQUFkO0FBQ0Q7Ozs4QkFDU0QsQyxFQUFHO0FBQ1hmLGNBQVFDLEdBQVIsQ0FBWWMsRUFBRUUsUUFBZDtBQUNEOzs7K0JBQ1VGLEMsRUFBRztBQUNaZixjQUFRQyxHQUFSLENBQVljLEVBQUVHLFNBQWQ7QUFDRDs7OztFQXBFaUNDLGVBQUtDLEk7O2tCQUFwQnBDLE0iLCJmaWxlIjoiY291cnNlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKiBnbG9iYWwgd3ggKi9cclxuaW1wb3J0IHdlcHkgZnJvbSBcIndlcHlcIjtcclxuaW1wb3J0IFBhZ2VNaXhpbiBmcm9tIFwiLi4vLi4vbWl4aW5zL3BhZ2VcIjtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ291cnNlIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICAvLyBtaXhpbnMgPSBbUGFnZU1peGluXTtcclxuICBjb25maWcgPSB7XHJcbiAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiBcIummlumhtVwiLFxyXG4gICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcclxuICB9O1xyXG4gIGNvbXBvbmVudHMgPSB7fTtcclxuICBkYXRhID0ge1xyXG4gICAgbG9hZFVzZXI6IHRydWUsXHJcbiAgICBpc1Nob3c6IHRydWUsXHJcbiAgICBvcGVuOmZhbHNlLFxyXG4gICAgdGFiOiAxXHJcbiAgfTtcclxuICBtZXRob2RzID0ge1xyXG4gICAgZ29Db2FjaCgpe1xyXG4gICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgICAgdXJsOiAnY29hY2gnXHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgdGFwX2NoKCkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIjc3N1wiKVxyXG4gICAgICBpZih0aGlzLmRhdGEub3Blbil7XHJcbiAgICAgICAgdGhpcy5vcGVuID0gZmFsc2U7XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgdGhpcy5vcGVuID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gIH0sXHJcbiAgICBidG4oKSB7XHJcbiAgICAgIHRoaXMuaXNTaG93ID0gIXRoaXMuaXNTaG93O1xyXG4gICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgfSxcclxuICAgIHRhYnMoKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwidGhpcy50YWJcIiwgdGhpcy50YWIpO1xyXG4gICAgICBpZiAodGhpcy50YWIgPT0gMSkge1xyXG4gICAgICAgIHRoaXMudGFiID0gMjtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnRhYiA9IDE7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBvblJlYWNoQm90dG9tKCkge31cclxuXHJcbiAgd2hlbkFwcFJlYWR5U2hvdygpIHtcclxuICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShcInVzZXIvdXNlckluZm8uanNvblwiLCB7fSlcclxuICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgY29uc3QgdXNlckluZm8gPSBkYXRhO1xyXG4gICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICAgICAgd3guc2V0U3RvcmFnZSh7XHJcbiAgICAgICAgICBrZXk6IFwidXNlckluZm9cIixcclxuICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHVzZXJJbmZvKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHt9KTtcclxuICB9XHJcbiAgb25TaG93KCkge1xyXG4gICAgLy8gd3guaGlkZVRhYkJhcigpXHJcbiAgfVxyXG4gIG9uU2hhcmVBcHBNZXNzYWdlKHJlcykge31cclxuICByZWdpb25jaGFuZ2UoZSkge1xyXG4gICAgY29uc29sZS5sb2coZS50eXBlKTtcclxuICB9XHJcbiAgbWFya2VydGFwKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUubWFya2VySWQpO1xyXG4gIH1cclxuICBjb250cm9sdGFwKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUuY29udHJvbElkKTtcclxuICB9XHJcbn1cclxuIl19