"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _headers = require('./../../components/headers.js');

var _headers2 = _interopRequireDefault(_headers);

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

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Course.__proto__ || Object.getPrototypeOf(Course)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
      navigationBarBackgroundColor: "#fff"
    }, _this.components = {
      header: _headers2.default
    }, _this.data = {
      height: "",
      branchId: null,
      cardId: null,
      coachId: null,
      content: {}
    }, _this.methods = {
      // 线下支付
      payOut: function payOut() {
        wx.showLoading({
          title: "等待确认..."
        });
        var self = this;
        console.log(this.$parent.globalData.wxId);
        this.fetchDataPromise("pay/wxPay.json", {
          action: "check",
          type: "offline",
          payId: this.content.payId
        }).then(function (data) {
          self.time();
        });
      },

      // 授权支付
      payInt: function payInt() {
        var self = this;
        console.log(this.$parent.globalData.wxId);
        this.fetchDataPromise("pay/wxPay.json", {
          action: "create",
          id: this.content.payId,
          wxId: this.$parent.globalData.wxId
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
      console.log("res", data);
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
    key: "whenAppReadyShow",
    value: function whenAppReadyShow(options) {
      var _this2 = this;

      var that = this;
      this.fetchDataPromise("user/userFit.json", {
        action: "pay",
        branchId: this.branchId,
        cardId: this.cardId,
        coachId: this.coachId
      }).then(function (data) {
        _this2.content = data;
        _this2.content.totalPrice = data.price * data.validCount;
        _this2.$apply();
      });
    }
  }, {
    key: "onLoad",
    value: function onLoad(options) {
      this.branchId = options.branchId;
      this.cardId = options.cardId;
      this.coachId = options.coachId;
    }
    // 轮询线下支付

  }, {
    key: "time",
    value: function time() {
      var _this3 = this;

      setTimeout(function () {
        _this3.fetchDataPromise("pay/wxPay.json", {
          action: "check",
          payId: _this3.content.payId
        }).then(function (data) {});
      }, 1000);
    }
  }, {
    key: "onShow",
    value: function onShow() {
      var _this4 = this;

      wx.getSystemInfo({
        success: function success(res) {
          _this4.height = res.statusBarHeight;
          _this4.$broadcast("index-broadcast", {
            height: _this4.height,
            text: "OneFit健身"
          });
        }
      });
    }
  }]);

  return Course;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Course , 'pages/home/buyMoney'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1eU1vbmV5LmpzIl0sIm5hbWVzIjpbIkNvdXJzZSIsIm1peGlucyIsIlBhZ2VNaXhpbiIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJjb21wb25lbnRzIiwiaGVhZGVyIiwiZGF0YSIsImhlaWdodCIsImJyYW5jaElkIiwiY2FyZElkIiwiY29hY2hJZCIsImNvbnRlbnQiLCJtZXRob2RzIiwicGF5T3V0Iiwid3giLCJzaG93TG9hZGluZyIsInRpdGxlIiwic2VsZiIsImNvbnNvbGUiLCJsb2ciLCIkcGFyZW50IiwiZ2xvYmFsRGF0YSIsInd4SWQiLCJmZXRjaERhdGFQcm9taXNlIiwiYWN0aW9uIiwidHlwZSIsInBheUlkIiwidGhlbiIsInRpbWUiLCJwYXlJbnQiLCJpZCIsInd4UGF5IiwiY2hlY2tPcmRlciIsIm91dF90cmFkZV9ubyIsIm9yZGVySWQiLCJjYXRjaCIsImVycm9yIiwicmVxdWVzdFBheW1lbnQiLCJ0aW1lU3RhbXAiLCJ0aW1lc3RhbXAiLCJub25jZVN0ciIsInBhY2thZ2UiLCJzaWduVHlwZSIsInBheVNpZ24iLCJzdWNjZXNzIiwicmVzIiwiZmFpbCIsInN3aXRjaFRhYiIsInVybCIsIm9wdGlvbiIsInBhaWQiLCJzaG93VG9hc3QiLCJpY29uIiwiZHVyYXRpb24iLCJzZXRUaW1lb3V0Iiwid2FpdGluZyIsInNob3dNb2RhbCIsInNob3dDYW5jZWwiLCIkYXBwbHkiLCJvcHRpb25zIiwidGhhdCIsInRvdGFsUHJpY2UiLCJwcmljZSIsInZhbGlkQ291bnQiLCJnZXRTeXN0ZW1JbmZvIiwic3RhdHVzQmFySGVpZ2h0IiwiJGJyb2FkY2FzdCIsInRleHQiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBSEE7OztJQUlxQkEsTTs7Ozs7Ozs7Ozs7Ozs7c0xBQ25CQyxNLEdBQVMsQ0FBQ0MsY0FBRCxDLFFBQ1RDLE0sR0FBUztBQUNQ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R2lCLElBTEgsQ0FLUSxnQkFBUTtBQUNkLGVBQUtoQixPQUFMLEdBQWVMLElBQWY7QUFDQSxlQUFLSyxPQUFMLENBQWFrRCxVQUFiLEdBQTBCdkQsS0FBS3dELEtBQUwsR0FBYXhELEtBQUt5RCxVQUE1QztBQUNBLGVBQUtMLE1BQUw7QUFDRCxPQVREO0FBVUQ7OzsyQkFDTUMsTyxFQUFTO0FBQ2QsV0FBS25ELFFBQUwsR0FBZ0JtRCxRQUFRbkQsUUFBeEI7QUFDQSxXQUFLQyxNQUFMLEdBQWNrRCxRQUFRbEQsTUFBdEI7QUFDQSxXQUFLQyxPQUFMLEdBQWVpRCxRQUFRakQsT0FBdkI7QUFDRDtBQUNEOzs7OzJCQUNPO0FBQUE7O0FBQ0w0QyxpQkFBVyxZQUFNO0FBQ2YsZUFBSy9CLGdCQUFMLENBQXNCLGdCQUF0QixFQUF3QztBQUN0Q0Msa0JBQVEsT0FEOEI7QUFFdENFLGlCQUFPLE9BQUtmLE9BQUwsQ0FBYWU7QUFGa0IsU0FBeEMsRUFHR0MsSUFISCxDQUdRLFVBQVNyQixJQUFULEVBQWUsQ0FBRSxDQUh6QjtBQUlELE9BTEQsRUFLRyxJQUxIO0FBTUQ7Ozs2QkE0Q1E7QUFBQTs7QUFDUFEsU0FBR2tELGFBQUgsQ0FBaUI7QUFDZnBCLGlCQUFTLHNCQUFPO0FBQ2QsaUJBQUtyQyxNQUFMLEdBQWNzQyxJQUFJb0IsZUFBbEI7QUFDQSxpQkFBS0MsVUFBTCxDQUFnQixpQkFBaEIsRUFBbUM7QUFDakMzRCxvQkFBUSxPQUFLQSxNQURvQjtBQUVqQzRELGtCQUFNO0FBRjJCLFdBQW5DO0FBSUQ7QUFQYyxPQUFqQjtBQVNEOzs7O0VBbktpQ0MsZUFBS0MsSTs7a0JBQXBCdEUsTSIsImZpbGUiOiJidXlNb25leS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyogZ2xvYmFsIHd4ICovXG5pbXBvcnQgd2VweSBmcm9tIFwid2VweVwiO1xuaW1wb3J0IGhlYWRlciBmcm9tIFwiLi4vLi4vY29tcG9uZW50cy9oZWFkZXJzXCI7XG5pbXBvcnQgUGFnZU1peGluIGZyb20gXCIuLi8uLi9taXhpbnMvcGFnZVwiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ291cnNlIGV4dGVuZHMgd2VweS5wYWdlIHtcbiAgbWl4aW5zID0gW1BhZ2VNaXhpbl07XG4gIGNvbmZpZyA9IHtcbiAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIlxuICB9O1xuICBjb21wb25lbnRzID0ge1xuICAgIGhlYWRlclxuICB9O1xuICBkYXRhID0ge1xuICAgIGhlaWdodDogXCJcIixcbiAgICBicmFuY2hJZDogbnVsbCxcbiAgICBjYXJkSWQ6IG51bGwsXG4gICAgY29hY2hJZDogbnVsbCxcbiAgICBjb250ZW50OiB7fVxuICB9O1xuICB3eFBheShkYXRhKSB7XG4gICAgY29uc29sZS5sb2coXCJyZXNcIiwgZGF0YSk7XG4gICAgLy/mi4notbflvq7kv6HmlK/ku5hcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgLy8gdmFyIGRhdGEgPSByZXMuZGF0YS5tZXNzYWdlcy5kYXRhO1xuICAgIHd4LnJlcXVlc3RQYXltZW50KHtcbiAgICAgIHRpbWVTdGFtcDogZGF0YS50aW1lc3RhbXAsXG4gICAgICBub25jZVN0cjogZGF0YS5ub25jZVN0cixcbiAgICAgIHBhY2thZ2U6IGRhdGEucGFja2FnZSxcbiAgICAgIHNpZ25UeXBlOiBkYXRhLnNpZ25UeXBlLFxuICAgICAgcGF5U2lnbjogZGF0YS5wYXlTaWduLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgIC8v5pSv5LuY5oiQ5YqfXG4gICAgICAgIHNlbGYuY2hlY2tPcmRlcih7XG4gICAgICAgICAgb3V0X3RyYWRlX25vOiBkYXRhLm91dF90cmFkZV9ubyxcbiAgICAgICAgICBvcmRlcklkOiBkYXRhLm9yZGVySWQsXG4gICAgICAgICAgdHlwZTogXCJ3eF9odG1sXCJcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgZmFpbDogZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgIC8v5pSv5LuY5aSx6LSlXG4gICAgICAgIHd4LnN3aXRjaFRhYih7XG4gICAgICAgICAgdXJsOiBcInVzZXJcIlxuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBjaGVja09yZGVyKG9wdGlvbikge1xuICAgIGNvbnNvbGUubG9nKFwib3B0aW9ub3B0aW9uXCIsIG9wdGlvbik7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShcInBheS93eFBheS5qc29uXCIsIHtcbiAgICAgIGFjdGlvbjogXCJjaGVja1wiLFxuICAgICAgd3hJZDogdGhpcy4kcGFyZW50Lmdsb2JhbERhdGEud3hJZCxcbiAgICAgIGlkOiBvcHRpb24ub3JkZXJJZFxuICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiY2hlY2tjaGVjayBcIiwgZGF0YSk7XG4gICAgICAgIGlmIChkYXRhLnBhaWQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIuaUr+S7mOaIkOWKn1wiKTtcbiAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgdGl0bGU6IFwi5pSv5LuY5oiQ5YqfXCIsXG4gICAgICAgICAgICBpY29uOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgICAgIGR1cmF0aW9uOiAzMDAwXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB3eC5zd2l0Y2hUYWIoe1xuICAgICAgICAgICAgICB1cmw6IFwiLi4vdXNlci91c2VyXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sIDMwMDApO1xuICAgICAgICAgIC8v6Lez6L2s6aaW6aG1XG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YS53YWl0aW5nKSB7XG4gICAgICAgICAgc2VsZi5jaGVja09yZGVyKHtcbiAgICAgICAgICAgIG91dF90cmFkZV9ubzogb3B0aW9uLm91dF90cmFkZV9ubyxcbiAgICAgICAgICAgIG9yZGVySWQ6IG9wdGlvbi5vcmRlcklkLFxuICAgICAgICAgICAgdHlwZTogXCJ3eF9odG1sXCJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmICghZGF0YS5wYWlkKSB7XG4gICAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgIHRpdGxlOiBcIuaPkOekulwiLFxuICAgICAgICAgICAgY29udGVudDogXCLmlK/ku5jlpLHotKUs6K+36IGU57O75a6i5pyNXCIsXG4gICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuJGFwcGx5KCk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7fSk7XG4gIH1cbiAgd2hlbkFwcFJlYWR5U2hvdyhvcHRpb25zKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZShcInVzZXIvdXNlckZpdC5qc29uXCIsIHtcbiAgICAgIGFjdGlvbjogXCJwYXlcIixcbiAgICAgIGJyYW5jaElkOiB0aGlzLmJyYW5jaElkLFxuICAgICAgY2FyZElkOiB0aGlzLmNhcmRJZCxcbiAgICAgIGNvYWNoSWQ6IHRoaXMuY29hY2hJZFxuICAgIH0pLnRoZW4oZGF0YSA9PiB7XG4gICAgICB0aGlzLmNvbnRlbnQgPSBkYXRhO1xuICAgICAgdGhpcy5jb250ZW50LnRvdGFsUHJpY2UgPSBkYXRhLnByaWNlICogZGF0YS52YWxpZENvdW50O1xuICAgICAgdGhpcy4kYXBwbHkoKTtcbiAgICB9KTtcbiAgfVxuICBvbkxvYWQob3B0aW9ucykge1xuICAgIHRoaXMuYnJhbmNoSWQgPSBvcHRpb25zLmJyYW5jaElkO1xuICAgIHRoaXMuY2FyZElkID0gb3B0aW9ucy5jYXJkSWQ7XG4gICAgdGhpcy5jb2FjaElkID0gb3B0aW9ucy5jb2FjaElkO1xuICB9XG4gIC8vIOi9ruivoue6v+S4i+aUr+S7mFxuICB0aW1lKCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKFwicGF5L3d4UGF5Lmpzb25cIiwge1xuICAgICAgICBhY3Rpb246IFwiY2hlY2tcIixcbiAgICAgICAgcGF5SWQ6IHRoaXMuY29udGVudC5wYXlJZFxuICAgICAgfSkudGhlbihmdW5jdGlvbihkYXRhKSB7fSk7XG4gICAgfSwgMTAwMCk7XG4gIH1cbiAgbWV0aG9kcyA9IHtcbiAgICAvLyDnur/kuIvmlK/ku5hcbiAgICBwYXlPdXQoKSB7XG4gICAgICB3eC5zaG93TG9hZGluZyh7XG4gICAgICAgIHRpdGxlOiBcIuetieW+heehruiupC4uLlwiXG4gICAgICB9KTtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuJHBhcmVudC5nbG9iYWxEYXRhLnd4SWQpO1xuICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKFwicGF5L3d4UGF5Lmpzb25cIiwge1xuICAgICAgICBhY3Rpb246IFwiY2hlY2tcIixcbiAgICAgICAgdHlwZTogXCJvZmZsaW5lXCIsXG4gICAgICAgIHBheUlkOiB0aGlzLmNvbnRlbnQucGF5SWRcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBzZWxmLnRpbWUoKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgLy8g5o6I5p2D5pSv5LuYXG4gICAgcGF5SW50KCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgY29uc29sZS5sb2codGhpcy4kcGFyZW50Lmdsb2JhbERhdGEud3hJZCk7XG4gICAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoXCJwYXkvd3hQYXkuanNvblwiLCB7XG4gICAgICAgIGFjdGlvbjogXCJjcmVhdGVcIixcbiAgICAgICAgaWQ6IHRoaXMuY29udGVudC5wYXlJZCxcbiAgICAgICAgd3hJZDogdGhpcy4kcGFyZW50Lmdsb2JhbERhdGEud3hJZFxuICAgICAgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwi5pSv5LuY5pSv5LuYIFwiLCBkYXRhKTtcbiAgICAgICAgICBpZiAoZGF0YS53eFBheSkge1xuICAgICAgICAgICAgLy/mi4notbflvq7kv6HmlK/ku5hcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi5pSv5LuY5pSv5LuYNDQ0NDQ0NDQ0NDQ0NDQgXCIsIGRhdGEpO1xuICAgICAgICAgICAgc2VsZi53eFBheShkYXRhKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy/ml6Dpobvmi4nlj5blvq7kv6HmlK/ku5hcbiAgICAgICAgICAgIHNlbGYuY2hlY2tPcmRlcih7XG4gICAgICAgICAgICAgIG91dF90cmFkZV9ubzogZGF0YS5vdXRfdHJhZGVfbm8sXG4gICAgICAgICAgICAgIG9yZGVySWQ6IGRhdGEub3JkZXJJZCxcbiAgICAgICAgICAgICAgdHlwZTogXCJ3eF9odG1sXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7fSk7XG4gICAgfVxuICB9O1xuICBvblNob3coKSB7XG4gICAgd3guZ2V0U3lzdGVtSW5mbyh7XG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICB0aGlzLmhlaWdodCA9IHJlcy5zdGF0dXNCYXJIZWlnaHQ7XG4gICAgICAgIHRoaXMuJGJyb2FkY2FzdChcImluZGV4LWJyb2FkY2FzdFwiLCB7XG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgICAgICB0ZXh0OiBcIk9uZUZpdOWBpei6q1wiXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=