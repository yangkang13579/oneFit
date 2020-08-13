"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _page = require('./../../mixins/page.js');

var _page2 = _interopRequireDefault(_page);

var _headers = require('./../../components/headers.js');

var _headers2 = _interopRequireDefault(_headers);

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

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Course.__proto__ || Object.getPrototypeOf(Course)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
      navigationBarBackgroundColor: "#fff"
    }, _this.components = {
      header: _headers2.default
    }, _this.data = {
      height: "",
      branchId: null,
      cardId: null,
      coachId: null,
      content: {},
      isCheck: false,
      paying: false
    }, _this.methods = {
      goText: function goText() {
        wx.navigateTo({
          url: "/pages/home/text"
        });
      },
      checkFun: function checkFun() {
        this.isCheck = !this.isCheck;
      },
      payOut: function payOut() {
        if (!this.isCheck) {
          wx.showToast({
            title: "请勾选免责声明",
            icon: "none"
          });
          return;
        }
        var that = this;
        this.paying = true;
        console.log(this.$parent.globalData.wxId);
        this.fetchDataPromise("pay/wxPay.json", {
          action: "check",
          type: "offline",
          payId: this.content.payId
        }).then(function (data) {
          setInterval(function () {
            that.time();
          }, 1000);
        });
      },

      // 授权支付
      payInt: function payInt() {
        if (!this.isCheck) {
          wx.showToast({
            title: "请勾选免责声明",
            icon: "none"
          });
          return;
        }
        var self = this;
        console.log(this.$parent.globalData.wxId);
        this.fetchDataPromise("pay/wxPay.json", {
          action: "create",
          payId: self.content.payId,
          type: "wx_html"
        }).then(function (data) {
          console.log("支付支付 ", data);
          if (data.wxPay) {
            //拉起微信支付
            console.log("支付支付44444444444444 ", data);
            self.wxPay(data);
          } else {
            //无须拉取微信支付
            self.checkOrder({
              out_trade_no: data.out_trade_no,
              orderId: data.orderId,
              type: "wx_html"
            });
          }
        }).catch(function (error) {});
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Course, [{
    key: "wxPay",
    value: function wxPay(data) {
      //拉起微信支付
      var self = this;
      // var data = res.data.messages.data;
      wx.requestPayment({
        timeStamp: data.timestamp,
        nonceStr: data.nonceStr,
        package: data.package,
        signType: data.signType,
        paySign: data.paySign,
        success: function success(res) {
          //支付成功
          self.checkOrder({
            out_trade_no: data.out_trade_no,
            orderId: data.orderId,
            type: "wx_html"
          });
        },
        fail: function fail(res) {
          //支付失败
          wx.switchTab({
            url: "user"
          });
          console.log(res);
        }
      });
    }
  }, {
    key: "checkOrder",
    value: function checkOrder(option) {
      console.log("optionoption", option);
      var self = this;
      this.fetchDataPromise("pay/wxPay.json", {
        action: "check",
        wxId: this.$parent.globalData.wxId,
        id: option.orderId
      }).then(function (data) {
        console.log("checkcheck ", data);
        if (data.paid) {
          console.log("支付成功");
          wx.showToast({
            title: "支付成功",
            icon: "success",
            duration: 3000
          });
          setTimeout(function () {
            wx.switchTab({
              url: "../user/user"
            });
          }, 3000);
          //跳转首页
        } else if (data.waiting) {
          self.checkOrder({
            out_trade_no: option.out_trade_no,
            orderId: option.orderId,
            type: "wx_html"
          });
        } else if (!data.paid) {
          wx.showModal({
            title: "提示",
            content: "支付失败,请联系客服",
            showCancel: false
          });
        }
        self.$apply();
      }).catch(function (error) {});
    }
  }, {
    key: "time",
    value: function time() {
      var _this2 = this;

      this.fetchDataPromise("pay/wxPay.json", {
        action: "check",
        payId: this.content.payId
      }).then(function (data) {
        if (data.paid) {
          _this2.paying = false;
        }
      });
    }
  }, {
    key: "onLoad",
    value: function onLoad(options) {
      this.branchId = options.branchId;
      this.cardId = options.cardId;
      this.coachId = options.coachId;
    }
  }, {
    key: "whenAppReadyShow",
    value: function whenAppReadyShow(options) {
      var that = this;
      this.fetchDataPromise("user/userFit.json", {
        action: "pay",
        branchId: this.branchId,
        cardId: this.cardId,
        coachId: this.coachId
      }).then(function (data) {
        that.content = data;
        that.content.totalPrice = data.price * data.validCount;
        that.$apply();
      });
    }
  }, {
    key: "onShow",
    value: function onShow() {
      var _this3 = this;

      wx.getSystemInfo({
        success: function success(res) {
          _this3.height = res.statusBarHeight;
          _this3.$broadcast("index-broadcast", {
            height: _this3.height,
            text: "OneFit健身"
          });
        }
      });
    }
  }]);

  return Course;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Course , 'pages/home/buyMoney'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1eU1vbmV5LmpzIl0sIm5hbWVzIjpbIkNvdXJzZSIsIm1peGlucyIsIlBhZ2VNaXhpbiIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJjb21wb25lbnRzIiwiaGVhZGVyIiwiZGF0YSIsImhlaWdodCIsImJyYW5jaElkIiwiY2FyZElkIiwiY29hY2hJZCIsImNvbnRlbnQiLCJpc0NoZWNrIiwicGF5aW5nIiwibWV0aG9kcyIsImdvVGV4dCIsInd4IiwibmF2aWdhdGVUbyIsInVybCIsImNoZWNrRnVuIiwicGF5T3V0Iiwic2hvd1RvYXN0IiwidGl0bGUiLCJpY29uIiwidGhhdCIsImNvbnNvbGUiLCJsb2ciLCIkcGFyZW50IiwiZ2xvYmFsRGF0YSIsInd4SWQiLCJmZXRjaERhdGFQcm9taXNlIiwiYWN0aW9uIiwidHlwZSIsInBheUlkIiwidGhlbiIsInNldEludGVydmFsIiwidGltZSIsInBheUludCIsInNlbGYiLCJ3eFBheSIsImNoZWNrT3JkZXIiLCJvdXRfdHJhZGVfbm8iLCJvcmRlcklkIiwiY2F0Y2giLCJlcnJvciIsInJlcXVlc3RQYXltZW50IiwidGltZVN0YW1wIiwidGltZXN0YW1wIiwibm9uY2VTdHIiLCJwYWNrYWdlIiwic2lnblR5cGUiLCJwYXlTaWduIiwic3VjY2VzcyIsInJlcyIsImZhaWwiLCJzd2l0Y2hUYWIiLCJvcHRpb24iLCJpZCIsInBhaWQiLCJkdXJhdGlvbiIsInNldFRpbWVvdXQiLCJ3YWl0aW5nIiwic2hvd01vZGFsIiwic2hvd0NhbmNlbCIsIiRhcHBseSIsIm9wdGlvbnMiLCJ0b3RhbFByaWNlIiwicHJpY2UiLCJ2YWxpZENvdW50IiwiZ2V0U3lzdGVtSW5mbyIsInN0YXR1c0JhckhlaWdodCIsIiRicm9hZGNhc3QiLCJ0ZXh0Iiwid2VweSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7OztBQUhBOzs7SUFJcUJBLE07Ozs7Ozs7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QUE7O0FBQ1BoRCxTQUFHcUQsYUFBSCxDQUFpQjtBQUNmakIsaUJBQVMsc0JBQU87QUFDZCxpQkFBSzdDLE1BQUwsR0FBYzhDLElBQUlpQixlQUFsQjtBQUNBLGlCQUFLQyxVQUFMLENBQWdCLGlCQUFoQixFQUFtQztBQUNqQ2hFLG9CQUFRLE9BQUtBLE1BRG9CO0FBRWpDaUUsa0JBQU07QUFGMkIsV0FBbkM7QUFJRDtBQVBjLE9BQWpCO0FBU0Q7Ozs7RUExTGlDQyxlQUFLQyxJOztrQkFBcEIzRSxNIiwiZmlsZSI6ImJ1eU1vbmV5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKiBnbG9iYWwgd3ggKi9cbmltcG9ydCB3ZXB5IGZyb20gXCJ3ZXB5XCI7XG5pbXBvcnQgUGFnZU1peGluIGZyb20gXCIuLi8uLi9taXhpbnMvcGFnZVwiO1xuaW1wb3J0IGhlYWRlciBmcm9tIFwiLi4vLi4vY29tcG9uZW50cy9oZWFkZXJzXCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3Vyc2UgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xuICBtaXhpbnMgPSBbUGFnZU1peGluXTtcbiAgY29uZmlnID0ge1xuICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZlwiXG4gIH07XG4gIGNvbXBvbmVudHMgPSB7XG4gICAgaGVhZGVyXG4gIH07XG4gIGRhdGEgPSB7XG4gICAgaGVpZ2h0OiBcIlwiLFxuICAgIGJyYW5jaElkOiBudWxsLFxuICAgIGNhcmRJZDogbnVsbCxcbiAgICBjb2FjaElkOiBudWxsLFxuICAgIGNvbnRlbnQ6IHt9LFxuICAgIGlzQ2hlY2s6IGZhbHNlLFxuICAgIHBheWluZzogZmFsc2VcbiAgfTtcbiAgd3hQYXkoZGF0YSkge1xuICAgIC8v5ouJ6LW35b6u5L+h5pSv5LuYXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIC8vIHZhciBkYXRhID0gcmVzLmRhdGEubWVzc2FnZXMuZGF0YTtcbiAgICB3eC5yZXF1ZXN0UGF5bWVudCh7XG4gICAgICB0aW1lU3RhbXA6IGRhdGEudGltZXN0YW1wLFxuICAgICAgbm9uY2VTdHI6IGRhdGEubm9uY2VTdHIsXG4gICAgICBwYWNrYWdlOiBkYXRhLnBhY2thZ2UsXG4gICAgICBzaWduVHlwZTogZGF0YS5zaWduVHlwZSxcbiAgICAgIHBheVNpZ246IGRhdGEucGF5U2lnbixcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAvL+aUr+S7mOaIkOWKn1xuICAgICAgICBzZWxmLmNoZWNrT3JkZXIoe1xuICAgICAgICAgIG91dF90cmFkZV9ubzogZGF0YS5vdXRfdHJhZGVfbm8sXG4gICAgICAgICAgb3JkZXJJZDogZGF0YS5vcmRlcklkLFxuICAgICAgICAgIHR5cGU6IFwid3hfaHRtbFwiXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGZhaWw6IGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAvL+aUr+S7mOWksei0pVxuICAgICAgICB3eC5zd2l0Y2hUYWIoe1xuICAgICAgICAgIHVybDogXCJ1c2VyXCJcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgbWV0aG9kcyA9IHtcbiAgICBnb1RleHQoKSB7XG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgdXJsOiBcIi9wYWdlcy9ob21lL3RleHRcIlxuICAgICAgfSk7XG4gICAgfSxcbiAgICBjaGVja0Z1bigpIHtcbiAgICAgIHRoaXMuaXNDaGVjayA9ICF0aGlzLmlzQ2hlY2s7XG4gICAgfSxcbiAgICBwYXlPdXQoKSB7XG4gICAgICBpZiAoIXRoaXMuaXNDaGVjaykge1xuICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgIHRpdGxlOiBcIuivt+WLvumAieWFjei0o+WjsOaYjlwiLFxuICAgICAgICAgIGljb246IFwibm9uZVwiXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICB0aGlzLnBheWluZyA9IHRydWU7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLiRwYXJlbnQuZ2xvYmFsRGF0YS53eElkKTtcbiAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShcInBheS93eFBheS5qc29uXCIsIHtcbiAgICAgICAgYWN0aW9uOiBcImNoZWNrXCIsXG4gICAgICAgIHR5cGU6IFwib2ZmbGluZVwiLFxuICAgICAgICBwYXlJZDogdGhpcy5jb250ZW50LnBheUlkXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgIHRoYXQudGltZSgpO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgLy8g5o6I5p2D5pSv5LuYXG4gICAgcGF5SW50KCkge1xuICAgICAgaWYgKCF0aGlzLmlzQ2hlY2spIHtcbiAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICB0aXRsZTogXCLor7fli77pgInlhY3otKPlo7DmmI5cIixcbiAgICAgICAgICBpY29uOiBcIm5vbmVcIlxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgY29uc29sZS5sb2codGhpcy4kcGFyZW50Lmdsb2JhbERhdGEud3hJZCk7XG4gICAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoXCJwYXkvd3hQYXkuanNvblwiLCB7XG4gICAgICAgIGFjdGlvbjogXCJjcmVhdGVcIixcbiAgICAgICAgcGF5SWQ6IHNlbGYuY29udGVudC5wYXlJZCxcbiAgICAgICAgdHlwZTogXCJ3eF9odG1sXCJcbiAgICAgIH0pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIuaUr+S7mOaUr+S7mCBcIiwgZGF0YSk7XG4gICAgICAgICAgaWYgKGRhdGEud3hQYXkpIHtcbiAgICAgICAgICAgIC8v5ouJ6LW35b6u5L+h5pSv5LuYXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIuaUr+S7mOaUr+S7mDQ0NDQ0NDQ0NDQ0NDQ0IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIHNlbGYud3hQYXkoZGF0YSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8v5peg6aG75ouJ5Y+W5b6u5L+h5pSv5LuYXG4gICAgICAgICAgICBzZWxmLmNoZWNrT3JkZXIoe1xuICAgICAgICAgICAgICBvdXRfdHJhZGVfbm86IGRhdGEub3V0X3RyYWRlX25vLFxuICAgICAgICAgICAgICBvcmRlcklkOiBkYXRhLm9yZGVySWQsXG4gICAgICAgICAgICAgIHR5cGU6IFwid3hfaHRtbFwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge30pO1xuICAgIH1cbiAgfTtcbiAgY2hlY2tPcmRlcihvcHRpb24pIHtcbiAgICBjb25zb2xlLmxvZyhcIm9wdGlvbm9wdGlvblwiLCBvcHRpb24pO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoXCJwYXkvd3hQYXkuanNvblwiLCB7XG4gICAgICBhY3Rpb246IFwiY2hlY2tcIixcbiAgICAgIHd4SWQ6IHRoaXMuJHBhcmVudC5nbG9iYWxEYXRhLnd4SWQsXG4gICAgICBpZDogb3B0aW9uLm9yZGVySWRcbiAgICB9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImNoZWNrY2hlY2sgXCIsIGRhdGEpO1xuICAgICAgICBpZiAoZGF0YS5wYWlkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCLmlK/ku5jmiJDlip9cIik7XG4gICAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgIHRpdGxlOiBcIuaUr+S7mOaIkOWKn1wiLFxuICAgICAgICAgICAgaWNvbjogXCJzdWNjZXNzXCIsXG4gICAgICAgICAgICBkdXJhdGlvbjogMzAwMFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgd3guc3dpdGNoVGFiKHtcbiAgICAgICAgICAgICAgdXJsOiBcIi4uL3VzZXIvdXNlclwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LCAzMDAwKTtcbiAgICAgICAgICAvL+i3s+i9rOmmlumhtVxuICAgICAgICB9IGVsc2UgaWYgKGRhdGEud2FpdGluZykge1xuICAgICAgICAgIHNlbGYuY2hlY2tPcmRlcih7XG4gICAgICAgICAgICBvdXRfdHJhZGVfbm86IG9wdGlvbi5vdXRfdHJhZGVfbm8sXG4gICAgICAgICAgICBvcmRlcklkOiBvcHRpb24ub3JkZXJJZCxcbiAgICAgICAgICAgIHR5cGU6IFwid3hfaHRtbFwiXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoIWRhdGEucGFpZCkge1xuICAgICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgICB0aXRsZTogXCLmj5DnpLpcIixcbiAgICAgICAgICAgIGNvbnRlbnQ6IFwi5pSv5LuY5aSx6LSlLOivt+iBlOezu+WuouacjVwiLFxuICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLiRhcHBseSgpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge30pO1xuICB9XG4gIHRpbWUoKSB7XG4gICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKFwicGF5L3d4UGF5Lmpzb25cIiwge1xuICAgICAgYWN0aW9uOiBcImNoZWNrXCIsXG4gICAgICBwYXlJZDogdGhpcy5jb250ZW50LnBheUlkXG4gICAgfSkudGhlbihkYXRhID0+IHtcbiAgICAgIGlmIChkYXRhLnBhaWQpIHtcbiAgICAgICAgdGhpcy5wYXlpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBvbkxvYWQob3B0aW9ucykge1xuICAgIHRoaXMuYnJhbmNoSWQgPSBvcHRpb25zLmJyYW5jaElkO1xuICAgIHRoaXMuY2FyZElkID0gb3B0aW9ucy5jYXJkSWQ7XG4gICAgdGhpcy5jb2FjaElkID0gb3B0aW9ucy5jb2FjaElkO1xuICB9XG4gIHdoZW5BcHBSZWFkeVNob3cob3B0aW9ucykge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoXCJ1c2VyL3VzZXJGaXQuanNvblwiLCB7XG4gICAgICBhY3Rpb246IFwicGF5XCIsXG4gICAgICBicmFuY2hJZDogdGhpcy5icmFuY2hJZCxcbiAgICAgIGNhcmRJZDogdGhpcy5jYXJkSWQsXG4gICAgICBjb2FjaElkOiB0aGlzLmNvYWNoSWRcbiAgICB9KS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHRoYXQuY29udGVudCA9IGRhdGE7XG4gICAgICB0aGF0LmNvbnRlbnQudG90YWxQcmljZSA9IGRhdGEucHJpY2UgKiBkYXRhLnZhbGlkQ291bnQ7XG4gICAgICB0aGF0LiRhcHBseSgpO1xuICAgIH0pO1xuICB9XG4gIG9uU2hvdygpIHtcbiAgICB3eC5nZXRTeXN0ZW1JbmZvKHtcbiAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gcmVzLnN0YXR1c0JhckhlaWdodDtcbiAgICAgICAgdGhpcy4kYnJvYWRjYXN0KFwiaW5kZXgtYnJvYWRjYXN0XCIsIHtcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxuICAgICAgICAgIHRleHQ6IFwiT25lRml05YGl6LqrXCJcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==