"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _wepyComToast = require('./../npm/wepy-com-toast/toast.js');

var _wepyComToast2 = _interopRequireDefault(_wepyComToast);

var _page = require('./../mixins/page.js');

var _page2 = _interopRequireDefault(_page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Mine = function (_wepy$page) {
  _inherits(Mine, _wepy$page);

  function Mine() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Mine);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Mine.__proto__ || Object.getPrototypeOf(Mine)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
      backgroundTextStyle: "light",
      navigationBarTitleText: "我的",
      navigationBarBackgroundColor: "#a42a29",
      navigationBarTextStyle: "white"
    }, _this.components = {
      toast: _wepyComToast2.default
    }, _this.data = {
      isShowOne: true,
      isShowTwo: false,
      dataType: 1
    }, _this.methods = {
      //支付
      pay: function pay() {
        var self = this;
        wx.request({
          url: this.$parent.globalData.saas_ctx + "/gameOrderPay.do",
          data: {
            passport: this.$parent.globalData.passportSession.id,
            wxId: this.$parent.globalData.wxId,
            cardId: self.dataType,
            action: "create"
          },
          header: {
            "content-type": "application/x-www-form-urlencoded" // 默认值
          },
          success: function success(res) {
            console.log(res);
            if (res.code == 500) {
              wx.showToast({
                title: res.messages.error.message
              });
              return;
            }
            var data = res.data.messages.data;
            if (data.wxPay) {
              //拉起微信支付
              self.wxPay(res);
            } else {
              //无须拉取微信支付
              self.checkOrder({
                out_trade_no: data.out_trade_no,
                orderId: data.orderId,
                type: "wx_html"
              });
            }
          },
          fail: function fail(error) {
            // console.log(error);
          }
        });
      },
      day: function day(event) {
        var self = this;
        console.log(event);
        var dataType = event.currentTarget.dataset.type;
        self.dataType = dataType;
        self.isShowOne = true;
        self.isShowTwo = false;
        console.log(self.dataType);
      },
      month: function month(event) {
        var self = this;
        var dataType = event.currentTarget.dataset.type;
        self.dataType = dataType;
        self.isShowOne = false;
        self.isShowTwo = true;
        console.log(self.dataType);
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Mine, [{
    key: "wxPay",
    value: function wxPay(res) {
      //拉起微信支付
      var self = this;
      var data = res.data.messages.data;
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
          console.log(res);
        }
      });
    }
  }, {
    key: "checkOrder",
    value: function checkOrder(option) {
      var self = this;
      //type 值要修改
      wx.request({
        url: self.$parent.globalData.saas_ctx + '/gameOrderPay.do',
        data: {
          action: "check",
          orderId: option.orderId,
          out_trade_no: option.out_trade_no,
          type: option.type,
          wxId: this.$parent.globalData.wxId,
          passport: this.$parent.globalData.passportSession.id
        },
        success: function success(res) {
          console.log(res);
          var data = res.data.messages.data;
          if (data.paid) {
            console.log('支付成功');
            wx.showToast({
              title: "支付成功",
              icon: "success",
              duration: 3000
            });
            setTimeout(function () {
              wx.switchTab({
                url: 'cool'
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
              title: '提示',
              content: '支付失败,请联系客服',
              showCancel: false
            });
          }
        }
      });
    }
  }, {
    key: "onLoad",
    value: function onLoad(params) {
      console.log(this.dataType);
      console.log(this.$parent.globalData.wxId);
      console.log("index页面加载");
    }
  }]);

  return Mine;
}(_wepy2.default.page);

exports.default = Mine;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBheS5qcyJdLCJuYW1lcyI6WyJNaW5lIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwiYmFja2dyb3VuZFRleHRTdHlsZSIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwibmF2aWdhdGlvbkJhclRleHRTdHlsZSIsImNvbXBvbmVudHMiLCJ0b2FzdCIsIlRvYXN0IiwiZGF0YSIsImlzU2hvd09uZSIsImlzU2hvd1R3byIsImRhdGFUeXBlIiwibWV0aG9kcyIsInBheSIsInNlbGYiLCJ3eCIsInJlcXVlc3QiLCJ1cmwiLCIkcGFyZW50IiwiZ2xvYmFsRGF0YSIsInNhYXNfY3R4IiwicGFzc3BvcnQiLCJwYXNzcG9ydFNlc3Npb24iLCJpZCIsInd4SWQiLCJjYXJkSWQiLCJhY3Rpb24iLCJoZWFkZXIiLCJzdWNjZXNzIiwicmVzIiwiY29uc29sZSIsImxvZyIsImNvZGUiLCJzaG93VG9hc3QiLCJ0aXRsZSIsIm1lc3NhZ2VzIiwiZXJyb3IiLCJtZXNzYWdlIiwid3hQYXkiLCJjaGVja09yZGVyIiwib3V0X3RyYWRlX25vIiwib3JkZXJJZCIsInR5cGUiLCJmYWlsIiwiZGF5IiwiZXZlbnQiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YXNldCIsIm1vbnRoIiwicmVxdWVzdFBheW1lbnQiLCJ0aW1lU3RhbXAiLCJ0aW1lc3RhbXAiLCJub25jZVN0ciIsInBhY2thZ2UiLCJzaWduVHlwZSIsInBheVNpZ24iLCJvcHRpb24iLCJwYWlkIiwiaWNvbiIsImR1cmF0aW9uIiwic2V0VGltZW91dCIsInN3aXRjaFRhYiIsIndhaXRpbmciLCJzaG93TW9kYWwiLCJjb250ZW50Iiwic2hvd0NhbmNlbCIsInBhcmFtcyIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNFOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBQ3FCQSxJOzs7Ozs7Ozs7Ozs7OztrTEFDbkJDLE0sR0FBUyxDQUFD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QyxpQkFBRzhDLFNBQUgsQ0FBYTtBQUNYNUMscUJBQUs7QUFETSxlQUFiO0FBR0QsYUFKRCxFQUlHLElBSkg7QUFLQTtBQUNELFdBYkQsTUFhTyxJQUFJVCxLQUFLc0QsT0FBVCxFQUFrQjtBQUN2QmhELGlCQUFLeUIsVUFBTCxDQUFnQjtBQUNkQyw0QkFBY2dCLE9BQU9oQixZQURQO0FBRWRDLHVCQUFTZSxPQUFPZixPQUZGO0FBR2RDLG9CQUFNO0FBSFEsYUFBaEI7QUFLRCxXQU5NLE1BTUEsSUFBSSxDQUFDbEMsS0FBS2lELElBQVYsRUFBZ0I7QUFDckIxQyxlQUFHZ0QsU0FBSCxDQUFhO0FBQ1g3QixxQkFBTyxJQURJO0FBRVg4Qix1QkFBUyxZQUZFO0FBR1hDLDBCQUFZO0FBSEQsYUFBYjtBQUtEO0FBQ0Y7QUF2Q1EsT0FBWDtBQXlDRDs7OzJCQTRETUMsTSxFQUFRO0FBQ2JwQyxjQUFRQyxHQUFSLENBQVksS0FBS3BCLFFBQWpCO0FBQ0FtQixjQUFRQyxHQUFSLENBQVksS0FBS2IsT0FBTCxDQUFhQyxVQUFiLENBQXdCSyxJQUFwQztBQUNBTSxjQUFRQyxHQUFSLENBQVksV0FBWjtBQUNEOzs7O0VBcEorQm9DLGVBQUtDLEk7O2tCQUFsQnZFLEkiLCJmaWxlIjoicGF5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbiAgaW1wb3J0IHdlcHkgZnJvbSBcIndlcHlcIjtcclxuICBpbXBvcnQgVG9hc3QgZnJvbSBcIndlcHktY29tLXRvYXN0XCI7XHJcbiAgaW1wb3J0IFBhZ2VNaXhpbiBmcm9tIFwiLi4vbWl4aW5zL3BhZ2VcIjtcclxuICBleHBvcnQgZGVmYXVsdCBjbGFzcyBNaW5lIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICAgIG1peGlucyA9IFtQYWdlTWl4aW5dO1xyXG4gICAgY29uZmlnID0ge1xyXG4gICAgICBiYWNrZ3JvdW5kVGV4dFN0eWxlOiBcImxpZ2h0XCIsXHJcbiAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6IFwi5oiR55qEXCIsXHJcbiAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6IFwiI2E0MmEyOVwiLFxyXG4gICAgICBuYXZpZ2F0aW9uQmFyVGV4dFN0eWxlOiBcIndoaXRlXCJcclxuICAgIH07XHJcbiAgICBjb21wb25lbnRzID0ge1xyXG4gICAgICB0b2FzdDogVG9hc3RcclxuICAgIH07XHJcbiAgICBkYXRhID0ge1xyXG4gICAgICBpc1Nob3dPbmU6IHRydWUsXHJcbiAgICAgIGlzU2hvd1R3bzogZmFsc2UsXHJcbiAgICAgIGRhdGFUeXBlOiAxXHJcbiAgICB9O1xyXG4gICAgd3hQYXkocmVzKSB7XHJcbiAgICAgIC8v5ouJ6LW35b6u5L+h5pSv5LuYXHJcbiAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgdmFyIGRhdGEgPSByZXMuZGF0YS5tZXNzYWdlcy5kYXRhO1xyXG4gICAgICB3eC5yZXF1ZXN0UGF5bWVudCh7XHJcbiAgICAgICAgdGltZVN0YW1wOiBkYXRhLnRpbWVzdGFtcCxcclxuICAgICAgICBub25jZVN0cjogZGF0YS5ub25jZVN0cixcclxuICAgICAgICBwYWNrYWdlOiBkYXRhLnBhY2thZ2UsXHJcbiAgICAgICAgc2lnblR5cGU6IGRhdGEuc2lnblR5cGUsXHJcbiAgICAgICAgcGF5U2lnbjogZGF0YS5wYXlTaWduLFxyXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgICAgLy/mlK/ku5jmiJDlip9cclxuICAgICAgICAgIHNlbGYuY2hlY2tPcmRlcih7XHJcbiAgICAgICAgICAgIG91dF90cmFkZV9ubzogZGF0YS5vdXRfdHJhZGVfbm8sXHJcbiAgICAgICAgICAgIG9yZGVySWQ6IGRhdGEub3JkZXJJZCxcclxuICAgICAgICAgICAgdHlwZTogXCJ3eF9odG1sXCJcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmFpbDogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgICAvL+aUr+S7mOWksei0pVxyXG4gICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY2hlY2tPcmRlcihvcHRpb24pIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAvL3R5cGUg5YC86KaB5L+u5pS5XHJcbiAgICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICAgIHVybDogc2VsZi4kcGFyZW50Lmdsb2JhbERhdGEuc2Fhc19jdHggKyAnL2dhbWVPcmRlclBheS5kbycsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgYWN0aW9uOiBcImNoZWNrXCIsXHJcbiAgICAgICAgICBvcmRlcklkOiBvcHRpb24ub3JkZXJJZCxcclxuICAgICAgICAgIG91dF90cmFkZV9ubzogb3B0aW9uLm91dF90cmFkZV9ubyxcclxuICAgICAgICAgIHR5cGU6IG9wdGlvbi50eXBlLFxyXG4gICAgICAgICAgd3hJZDogdGhpcy4kcGFyZW50Lmdsb2JhbERhdGEud3hJZCxcclxuICAgICAgICAgIHBhc3Nwb3J0OiB0aGlzLiRwYXJlbnQuZ2xvYmFsRGF0YS5wYXNzcG9ydFNlc3Npb24uaWQsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHJlcylcclxuICAgICAgICAgIHZhciBkYXRhID0gcmVzLmRhdGEubWVzc2FnZXMuZGF0YTtcclxuICAgICAgICAgIGlmIChkYXRhLnBhaWQpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ+aUr+S7mOaIkOWKnycpO1xyXG4gICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xyXG4gICAgICAgICAgICAgIHRpdGxlOiBcIuaUr+S7mOaIkOWKn1wiLFxyXG4gICAgICAgICAgICAgIGljb246IFwic3VjY2Vzc1wiLFxyXG4gICAgICAgICAgICAgIGR1cmF0aW9uOiAzMDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICB3eC5zd2l0Y2hUYWIoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnY29vbCcsXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sIDMwMDApO1xyXG4gICAgICAgICAgICAvL+i3s+i9rOmmlumhtVxyXG4gICAgICAgICAgfSBlbHNlIGlmIChkYXRhLndhaXRpbmcpIHtcclxuICAgICAgICAgICAgc2VsZi5jaGVja09yZGVyKHtcclxuICAgICAgICAgICAgICBvdXRfdHJhZGVfbm86IG9wdGlvbi5vdXRfdHJhZGVfbm8sXHJcbiAgICAgICAgICAgICAgb3JkZXJJZDogb3B0aW9uLm9yZGVySWQsXHJcbiAgICAgICAgICAgICAgdHlwZTogXCJ3eF9odG1sXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKCFkYXRhLnBhaWQpIHtcclxuICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgICAgICAgICAgY29udGVudDogJ+aUr+S7mOWksei0pSzor7fogZTns7vlrqLmnI0nLFxyXG4gICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBtZXRob2RzID0ge1xyXG4gICAgICAvL+aUr+S7mFxyXG4gICAgICBwYXkoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICAgICAgdXJsOiB0aGlzLiRwYXJlbnQuZ2xvYmFsRGF0YS5zYWFzX2N0eCArIFwiL2dhbWVPcmRlclBheS5kb1wiLFxyXG4gICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICBwYXNzcG9ydDogdGhpcy4kcGFyZW50Lmdsb2JhbERhdGEucGFzc3BvcnRTZXNzaW9uLmlkLFxyXG4gICAgICAgICAgICB3eElkOiB0aGlzLiRwYXJlbnQuZ2xvYmFsRGF0YS53eElkLFxyXG4gICAgICAgICAgICBjYXJkSWQ6IHNlbGYuZGF0YVR5cGUsXHJcbiAgICAgICAgICAgIGFjdGlvbjogXCJjcmVhdGVcIlxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGhlYWRlcjoge1xyXG4gICAgICAgICAgICBcImNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiIC8vIOm7mOiupOWAvFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xyXG4gICAgICAgICAgICBpZiAocmVzLmNvZGUgPT0gNTAwKSB7XHJcbiAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiByZXMubWVzc2FnZXMuZXJyb3IubWVzc2FnZVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHJlcy5kYXRhLm1lc3NhZ2VzLmRhdGE7XHJcbiAgICAgICAgICAgIGlmIChkYXRhLnd4UGF5KSB7XHJcbiAgICAgICAgICAgICAgLy/mi4notbflvq7kv6HmlK/ku5hcclxuICAgICAgICAgICAgICBzZWxmLnd4UGF5KHJlcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgLy/ml6Dpobvmi4nlj5blvq7kv6HmlK/ku5hcclxuICAgICAgICAgICAgICBzZWxmLmNoZWNrT3JkZXIoe1xyXG4gICAgICAgICAgICAgICAgb3V0X3RyYWRlX25vOiBkYXRhLm91dF90cmFkZV9ubyxcclxuICAgICAgICAgICAgICAgIG9yZGVySWQ6IGRhdGEub3JkZXJJZCxcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwid3hfaHRtbFwiXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmYWlsOiBmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGRheShldmVudCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBjb25zb2xlLmxvZyhldmVudCk7XHJcbiAgICAgICAgdmFyIGRhdGFUeXBlID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LnR5cGU7XHJcbiAgICAgICAgc2VsZi5kYXRhVHlwZSA9IGRhdGFUeXBlO1xyXG4gICAgICAgIHNlbGYuaXNTaG93T25lID0gdHJ1ZTtcclxuICAgICAgICBzZWxmLmlzU2hvd1R3byA9IGZhbHNlO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHNlbGYuZGF0YVR5cGUpO1xyXG4gICAgICB9LFxyXG4gICAgICBtb250aChldmVudCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgZGF0YVR5cGUgPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQudHlwZTtcclxuICAgICAgICBzZWxmLmRhdGFUeXBlID0gZGF0YVR5cGU7XHJcbiAgICAgICAgc2VsZi5pc1Nob3dPbmUgPSBmYWxzZTtcclxuICAgICAgICBzZWxmLmlzU2hvd1R3byA9IHRydWU7XHJcbiAgICAgICAgY29uc29sZS5sb2coc2VsZi5kYXRhVHlwZSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICBvbkxvYWQocGFyYW1zKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuZGF0YVR5cGUpO1xyXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLiRwYXJlbnQuZ2xvYmFsRGF0YS53eElkKTtcclxuICAgICAgY29uc29sZS5sb2coXCJpbmRleOmhtemdouWKoOi9vVwiKTtcclxuICAgIH1cclxuICB9XHJcbiJdfQ==