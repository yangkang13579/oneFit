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

exports.default = Course;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvdXJzZWQuMS5qcyJdLCJuYW1lcyI6WyJDb3Vyc2UiLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsImNvbXBvbmVudHMiLCJkYXRhIiwibG9hZFVzZXIiLCJpc1Nob3ciLCJvcGVuIiwidGFiIiwibWV0aG9kcyIsInRhcF9jaCIsImNvbnNvbGUiLCJsb2ciLCJidG4iLCIkYXBwbHkiLCJ0YWJzIiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRoZW4iLCJ1c2VySW5mbyIsInd4Iiwic2V0U3RvcmFnZSIsImtleSIsIkpTT04iLCJzdHJpbmdpZnkiLCJjYXRjaCIsImVycm9yIiwicmVzIiwiZSIsInR5cGUiLCJtYXJrZXJJZCIsImNvbnRyb2xJZCIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBRkE7OztJQUdxQkEsTTs7Ozs7Ozs7Ozs7Ozs7c0xBRW5CQyxNLEdBQVM7QUFDUEMsOEJBQXdCLElBRGpCO0FBRVBDLG9DQUE4QjtBQUZ2QixLLFFBSVRDLFUsR0FBYSxFLFFBQ2JDLEksR0FBTztBQUNMQyxnQkFBVSxJQURMO0FBRUxDLGNBQVEsSUFGSDtBQUdMQyxZQUFLLEtBSEE7QUFJTEMsV0FBSztBQUpBLEssUUFNUEMsTyxHQUFVO0FBQ1JDLFlBRFEsb0JBQ0M7QUFDUEMsZ0JBQVFDLEdBQVIsQ0FBWSxLQUFaO0FBQ0EsWUFBRyxLQUFLUixJQUFMLENBQVVHLElBQWIsRUFBa0I7QUFDaEIsZUFBS0EsSUFBTCxHQUFZLEtBQVo7QUFDRCxTQUZELE1BRUs7QUFDSixlQUFLQSxJQUFMLEdBQVksSUFBWjtBQUNBO0FBQ0osT0FSUztBQVNSTSxTQVRRLGlCQVNGO0FBQ0osYUFBS1AsTUFBTCxHQUFjLENBQUMsS0FBS0EsTUFBcEI7QUFDQSxhQUFLUSxNQUFMO0FBQ0QsT0FaTztBQWFSQyxVQWJRLGtCQWFEO0FBQ0xKLGdCQUFRQyxHQUFSLENBQVksVUFBWixFQUF3QixLQUFLSixHQUE3QjtBQUNBLFlBQUksS0FBS0EsR0FBTCxJQUFZLENBQWhCLEVBQW1CO0FBQ2pCLGVBQUtBLEdBQUwsR0FBVyxDQUFYO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsZUFBS0EsR0FBTCxHQUFXLENBQVg7QUFDRDtBQUNELGFBQUtNLE1BQUw7QUFDRDtBQXJCTyxLOztBQVpWOzs7OztvQ0FvQ2dCLENBQUU7Ozt1Q0FFQztBQUFBOztBQUNqQixXQUFLRSxnQkFBTCxDQUFzQixvQkFBdEIsRUFBNEMsRUFBNUMsRUFDR0MsSUFESCxDQUNRLGdCQUFRO0FBQ1osWUFBTUMsV0FBV2QsSUFBakI7QUFDQSxlQUFLVSxNQUFMO0FBQ0FLLFdBQUdDLFVBQUgsQ0FBYztBQUNaQyxlQUFLLFVBRE87QUFFWmpCLGdCQUFNa0IsS0FBS0MsU0FBTCxDQUFlTCxRQUFmO0FBRk0sU0FBZDtBQUlELE9BUkgsRUFTR00sS0FUSCxDQVNTLFVBQVNDLEtBQVQsRUFBZ0IsQ0FBRSxDQVQzQjtBQVVEOzs7NkJBQ1E7QUFDUDtBQUNEOzs7c0NBQ2lCQyxHLEVBQUssQ0FBRTs7O2lDQUNaQyxDLEVBQUc7QUFDZGhCLGNBQVFDLEdBQVIsQ0FBWWUsRUFBRUMsSUFBZDtBQUNEOzs7OEJBQ1NELEMsRUFBRztBQUNYaEIsY0FBUUMsR0FBUixDQUFZZSxFQUFFRSxRQUFkO0FBQ0Q7OzsrQkFDVUYsQyxFQUFHO0FBQ1poQixjQUFRQyxHQUFSLENBQVllLEVBQUVHLFNBQWQ7QUFDRDs7OztFQS9EaUNDLGVBQUtDLEk7O2tCQUFwQmpDLE0iLCJmaWxlIjoiY291cnNlZC4xLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8qIGdsb2JhbCB3eCAqL1xyXG5pbXBvcnQgd2VweSBmcm9tIFwid2VweVwiO1xyXG5pbXBvcnQgUGFnZU1peGluIGZyb20gXCIuLi8uLi9taXhpbnMvcGFnZVwiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3Vyc2UgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gIC8vIG1peGlucyA9IFtQYWdlTWl4aW5dO1xyXG4gIGNvbmZpZyA9IHtcclxuICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6IFwi6aaW6aG1XCIsXHJcbiAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIlxyXG4gIH07XHJcbiAgY29tcG9uZW50cyA9IHt9O1xyXG4gIGRhdGEgPSB7XHJcbiAgICBsb2FkVXNlcjogdHJ1ZSxcclxuICAgIGlzU2hvdzogdHJ1ZSxcclxuICAgIG9wZW46ZmFsc2UsXHJcbiAgICB0YWI6IDFcclxuICB9O1xyXG4gIG1ldGhvZHMgPSB7XHJcbiAgICB0YXBfY2goKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiNzc3XCIpXHJcbiAgICAgIGlmKHRoaXMuZGF0YS5vcGVuKXtcclxuICAgICAgICB0aGlzLm9wZW4gPSBmYWxzZTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICB0aGlzLm9wZW4gPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgfSxcclxuICAgIGJ0bigpIHtcclxuICAgICAgdGhpcy5pc1Nob3cgPSAhdGhpcy5pc1Nob3c7XHJcbiAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICB9LFxyXG4gICAgdGFicygpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJ0aGlzLnRhYlwiLCB0aGlzLnRhYik7XHJcbiAgICAgIGlmICh0aGlzLnRhYiA9PSAxKSB7XHJcbiAgICAgICAgdGhpcy50YWIgPSAyO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMudGFiID0gMTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIG9uUmVhY2hCb3R0b20oKSB7fVxyXG5cclxuICB3aGVuQXBwUmVhZHlTaG93KCkge1xyXG4gICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKFwidXNlci91c2VySW5mby5qc29uXCIsIHt9KVxyXG4gICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICBjb25zdCB1c2VySW5mbyA9IGRhdGE7XHJcbiAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgICB3eC5zZXRTdG9yYWdlKHtcclxuICAgICAgICAgIGtleTogXCJ1c2VySW5mb1wiLFxyXG4gICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkodXNlckluZm8pXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge30pO1xyXG4gIH1cclxuICBvblNob3coKSB7XHJcbiAgICAvLyB3eC5oaWRlVGFiQmFyKClcclxuICB9XHJcbiAgb25TaGFyZUFwcE1lc3NhZ2UocmVzKSB7fVxyXG4gIHJlZ2lvbmNoYW5nZShlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlLnR5cGUpO1xyXG4gIH1cclxuICBtYXJrZXJ0YXAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZS5tYXJrZXJJZCk7XHJcbiAgfVxyXG4gIGNvbnRyb2x0YXAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZS5jb250cm9sSWQpO1xyXG4gIH1cclxufVxyXG4iXX0=