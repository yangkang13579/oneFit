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
      boxImg: ["../../images/4.jpg", "../../images/5.jpg", "../../images/9.jpg", "../../images/7.jpg", "../../images/8.jpg"],
      loadUser: true,
      indicatorDots: true,
      vertical: false,
      autoplay: false,
      interval: 2000,
      duration: 500,
      clientHeight: ""
    }, _this.methods = {
      more: function more() {
        wx.switchTab({
          url: '/pages/coursed/coursed'
        });
      },
      goto: function goto() {
        wx.switchTab({
          url: '/pages/coursed/coursed'
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }
  // mixins = [PageMixin];


  _createClass(Home, [{
    key: "onReachBottom",
    value: function onReachBottom() {}
  }, {
    key: "whenAppReadyShow",
    value: function whenAppReadyShow() {
      console.log("9999999");

      //   this.$apply();
    }
  }, {
    key: "onLoad",
    value: function onLoad() {
      console.log("88888888");
    }
  }, {
    key: "onShow",
    value: function onShow() {
      var that = this;
      wx.getSystemInfo({
        success: function success(res) {
          console.log("res", res);
          that.clientHeight = res.windowHeight;
          that.$apply();
          console.log("this.clientHeight", that.clientHeight);
        }
      });
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUuanMiXSwibmFtZXMiOlsiSG9tZSIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsImRhdGEiLCJpbWdVcmxzIiwiYm94SW1nIiwibG9hZFVzZXIiLCJpbmRpY2F0b3JEb3RzIiwidmVydGljYWwiLCJhdXRvcGxheSIsImludGVydmFsIiwiZHVyYXRpb24iLCJjbGllbnRIZWlnaHQiLCJtZXRob2RzIiwibW9yZSIsInd4Iiwic3dpdGNoVGFiIiwidXJsIiwiZ290byIsImNvbnNvbGUiLCJsb2ciLCJ0aGF0IiwiZ2V0U3lzdGVtSW5mbyIsInN1Y2Nlc3MiLCJyZXMiLCJ3aW5kb3dIZWlnaHQiLCIkYXBwbHkiLCJlIiwidHlwZSIsIm1hcmtlcklkIiwiY29udHJvbElkIiwid2VweSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7QUFGQTs7O0lBR3FCQSxJOzs7Ozs7Ozs7Ozs7OztrTEFFbkJDLE0sR0FBUztBQUNQQyw4QkFBd0IsY0FEakI7QUFFUEMsb0NBQThCO0FBRnZCLEssUUFJVEMsVSxHQUFhLEUsUUFDYkMsSSxHQUFPO0FBQ0xDLGVBQVMsQ0FBQyxvQkFBRCxFQUF1QixvQkFBdkIsRUFBNkMsb0JBQTdDLENBREo7QUFFTEMsY0FBUSxDQUNOLG9CQURNLEVBRU4sb0JBRk0sRUFHTixvQkFITSxFQUlOLG9CQUpNLEVBS04sb0JBTE0sQ0FGSDtBQVNMQyxnQkFBVSxJQVRMO0FBVUxDLHFCQUFlLElBVlY7QUFXTEMsZ0JBQVUsS0FYTDtBQVlMQyxnQkFBVSxLQVpMO0FBYUxDLGdCQUFVLElBYkw7QUFjTEMsZ0JBQVUsR0FkTDtBQWVMQyxvQkFBYztBQWZULEssUUFpQlBDLE8sR0FBVTtBQUNSQyxVQURRLGtCQUNGO0FBQ0pDLFdBQUdDLFNBQUgsQ0FBYTtBQUNWQyxlQUFLO0FBREssU0FBYjtBQUdELE9BTE87QUFNUkMsVUFOUSxrQkFNRjtBQUNKSCxXQUFHQyxTQUFILENBQWE7QUFDVkMsZUFBSztBQURLLFNBQWI7QUFHRDtBQVZPLEs7O0FBdkJWOzs7OztvQ0FvQ2dCLENBQUU7Ozt1Q0FFQztBQUNqQkUsY0FBUUMsR0FBUixDQUFZLFNBQVo7O0FBRUE7QUFDRDs7OzZCQUNRO0FBQ1BELGNBQVFDLEdBQVIsQ0FBWSxVQUFaO0FBQ0Q7Ozs2QkFDUTtBQUNQLFVBQUlDLE9BQU8sSUFBWDtBQUNBTixTQUFHTyxhQUFILENBQWlCO0FBQ2ZDLGlCQUFTLGlCQUFTQyxHQUFULEVBQWM7QUFDckJMLGtCQUFRQyxHQUFSLENBQVksS0FBWixFQUFtQkksR0FBbkI7QUFDQUgsZUFBS1QsWUFBTCxHQUFvQlksSUFBSUMsWUFBeEI7QUFDQUosZUFBS0ssTUFBTDtBQUNBUCxrQkFBUUMsR0FBUixDQUFZLG1CQUFaLEVBQWlDQyxLQUFLVCxZQUF0QztBQUNEO0FBTmMsT0FBakI7QUFRRDs7O3NDQUNpQlksRyxFQUFLLENBQUU7OztpQ0FDWkcsQyxFQUFHO0FBQ2RSLGNBQVFDLEdBQVIsQ0FBWU8sRUFBRUMsSUFBZDtBQUNEOzs7OEJBQ1NELEMsRUFBRztBQUNYUixjQUFRQyxHQUFSLENBQVlPLEVBQUVFLFFBQWQ7QUFDRDs7OytCQUNVRixDLEVBQUc7QUFDWlIsY0FBUUMsR0FBUixDQUFZTyxFQUFFRyxTQUFkO0FBQ0Q7Ozs7RUFuRStCQyxlQUFLQyxJOztrQkFBbEJsQyxJIiwiZmlsZSI6ImhvbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyogZ2xvYmFsIHd4ICovXHJcbmltcG9ydCB3ZXB5IGZyb20gXCJ3ZXB5XCI7XHJcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSBcIi4uLy4uL21peGlucy9wYWdlXCI7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhvbWUgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gIC8vIG1peGlucyA9IFtQYWdlTWl4aW5dO1xyXG4gIGNvbmZpZyA9IHtcclxuICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6IFwiT25lRml06L+Q5Yqo6K6t57uD5Lit5b+DXCIsXHJcbiAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiBcIiMwMDBcIlxyXG4gIH07XHJcbiAgY29tcG9uZW50cyA9IHt9O1xyXG4gIGRhdGEgPSB7XHJcbiAgICBpbWdVcmxzOiBbXCIuLi8uLi9pbWFnZXMvMS5qcGdcIiwgXCIuLi8uLi9pbWFnZXMvMi5qcGdcIiwgXCIuLi8uLi9pbWFnZXMvMy5qcGdcIl0sXHJcbiAgICBib3hJbWc6IFtcclxuICAgICAgXCIuLi8uLi9pbWFnZXMvNC5qcGdcIixcclxuICAgICAgXCIuLi8uLi9pbWFnZXMvNS5qcGdcIixcclxuICAgICAgXCIuLi8uLi9pbWFnZXMvOS5qcGdcIixcclxuICAgICAgXCIuLi8uLi9pbWFnZXMvNy5qcGdcIixcclxuICAgICAgXCIuLi8uLi9pbWFnZXMvOC5qcGdcIlxyXG4gICAgXSxcclxuICAgIGxvYWRVc2VyOiB0cnVlLFxyXG4gICAgaW5kaWNhdG9yRG90czogdHJ1ZSxcclxuICAgIHZlcnRpY2FsOiBmYWxzZSxcclxuICAgIGF1dG9wbGF5OiBmYWxzZSxcclxuICAgIGludGVydmFsOiAyMDAwLFxyXG4gICAgZHVyYXRpb246IDUwMCxcclxuICAgIGNsaWVudEhlaWdodDogXCJcIlxyXG4gIH07XHJcbiAgbWV0aG9kcyA9IHtcclxuICAgIG1vcmUoKXtcclxuICAgICAgd3guc3dpdGNoVGFiKHtcclxuICAgICAgICAgdXJsOiAnL3BhZ2VzL2NvdXJzZWQvY291cnNlZCdcclxuICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGdvdG8oKXtcclxuICAgICAgd3guc3dpdGNoVGFiKHtcclxuICAgICAgICAgdXJsOiAnL3BhZ2VzL2NvdXJzZWQvY291cnNlZCdcclxuICAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIG9uUmVhY2hCb3R0b20oKSB7fVxyXG5cclxuICB3aGVuQXBwUmVhZHlTaG93KCkge1xyXG4gICAgY29uc29sZS5sb2coXCI5OTk5OTk5XCIpO1xyXG5cclxuICAgIC8vICAgdGhpcy4kYXBwbHkoKTtcclxuICB9XHJcbiAgb25Mb2FkKCkge1xyXG4gICAgY29uc29sZS5sb2coXCI4ODg4ODg4OFwiKTtcclxuICB9XHJcbiAgb25TaG93KCkge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgd3guZ2V0U3lzdGVtSW5mbyh7XHJcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicmVzXCIsIHJlcyk7XHJcbiAgICAgICAgdGhhdC5jbGllbnRIZWlnaHQgPSByZXMud2luZG93SGVpZ2h0O1xyXG4gICAgICAgIHRoYXQuJGFwcGx5KCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJ0aGlzLmNsaWVudEhlaWdodFwiLCB0aGF0LmNsaWVudEhlaWdodCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBvblNoYXJlQXBwTWVzc2FnZShyZXMpIHt9XHJcbiAgcmVnaW9uY2hhbmdlKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUudHlwZSk7XHJcbiAgfVxyXG4gIG1hcmtlcnRhcChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlLm1hcmtlcklkKTtcclxuICB9XHJcbiAgY29udHJvbHRhcChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlLmNvbnRyb2xJZCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==