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


var payMoney = function (_wepy$page) {
	_inherits(payMoney, _wepy$page);

	function payMoney() {
		var _ref;

		var _temp, _this, _ret;

		_classCallCheck(this, payMoney);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = payMoney.__proto__ || Object.getPrototypeOf(payMoney)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
			navigationBarTitleText: '结算支付',
			navigationBarBackgroundColor: '#65ABFF'
		}, _this.components = {}, _this.data = {
			cardPrice: "",
			isCode: false,
			currentIndex: 0,
			isamount: false,
			hasDefaultAddno: false,
			hasDefaultAddyes: true,
			isShowSm: false,
			// hasDefaultAdd:false,
			isHideSm: true,
			isShowYe: true,
			isHideYe: false,
			amount: '',
			totalMoney: '',
			stroeDetail: [],
			defaultAdd: [],
			hopCartItem: [],
			couponId: null, //兑换码Id
			couponCode: null //兑换码
		}, _this.methods = {
			addressPage: function addressPage() {
				//添加或编辑地址
				wx.navigateTo({
					url: 'editAddress?type=add'
				});
			},
			aBookPage: function aBookPage() {
				//地址簿
				wx.navigateTo({
					url: 'addressBook'
				});
			},
			bindKeyInput: function bindKeyInput(e) {
				//兑换卷
				var self = this;
				console.log(e.detail.value);
				if (e.detail.value.length == 6) {
					self.couponCode = e.detail.value;
					// self.couponId = '20181101'
					self.couponId = null;
					console.log(self.couponCode);
					self.check();
				} else if (e.detail.value.length != 6) {
					//如果兑换卷的长度不等于6
					self.isCode = false;
					self.couponCode = null;
					self.couponId = null;
					self.check();
					console.log('sssss');
				}
			},

			// 点击支付
			play: function play() {
				var self = this;
				self.make();
			},
			Shows: function Shows() {
				var self = this;
				console.log("33");
				self.isShowYe = false;
				self.isHideYe = true;
				self.isamount = false;
				self.check();
				self.$apply();
			},
			Hides: function Hides() {
				var self = this;
				self.isShowYe = true;
				self.isHideYe = false;
				self.isamount = true;
				self.check();
				self.$apply();
			}
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(payMoney, [{
		key: 'whenAppReadyShow',
		value: function whenAppReadyShow() {
			this.couponCode = null;
			this.couponId = null;
			this.init();
		}
	}, {
		key: 'wxPay',
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
						url: 'user'
					});
					console.log(res);
				}
			});
		}
	}, {
		key: 'checkOrder',
		value: function checkOrder(option) {
			console.log("optionoption", option);
			var self = this;
			this.fetchDataPromise('data/shop/pay/wxPay.json', {
				action: 'check',
				wxId: self.wxId,
				id: option.orderId
			}).then(function (data) {
				console.log('checkcheck ', data);
				if (data.paid) {
					console.log('支付成功');
					wx.showToast({
						title: "支付成功",
						icon: "success",
						duration: 3000
					});
					setTimeout(function () {
						wx.switchTab({
							url: 'user'
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
				self.$apply();
			}).catch(function (error) {});
		}
	}, {
		key: 'pay',
		value: function pay() {
			var self = this;
			this.fetchDataPromise('data/shop/pay/wxPay.json', {
				action: 'create',
				orderId: self.orderId,
				wxId: self.wxId
			}).then(function (data) {
				console.log('支付支付 ', data);
				if (data.wxPay) {
					//拉起微信支付
					console.log('支付支付44444444444444 ', data);
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
	}, {
		key: 'init',
		value: function init() {
			var self = this;
			this.fetchDataPromise('data/shop/shopOrder.json', {
				action: 'preview',
				shopCartIds: self.hopCartItem.join(",")
			}).then(function (data) {
				console.log('22 ', data);
				self.amount = data.amount;
				if (self.amount == 0) {
					self.isShowYe = false;
					self.isHideYe = false;
				} else {
					self.isShowYe = false;
					self.isHideYe = true;
				}
				self.stroeDetail = data.items;
				for (var i = 0; i < self.stroeDetail.length; i++) {
					for (var j = 0; j < self.stroeDetail[i].products.length; j++) {
						console.log(self.stroeDetail[i].products[j].count + '--' + self.stroeDetail[i].products[j].price);
						self.stroeDetail[i].products[j]['cardPrice'] = (self.stroeDetail[i].products[j].count * self.stroeDetail[i].products[j].price).toFixed(2);
					}
				}
				// 获取地址
				if (data.addresses.length == '') {
					console.log('data.addresses.length', data.addresses.length);
					self.hasDefaultAddno = true;
					self.hasDefaultAddyes = false;
					self.$apply();
				} else {
					data.addresses.map(function (item, index) {
						console.log("index", index);
						if (item.status == 2) {
							self.defaultAdd = item;
							self.addressId = self.defaultAdd.id;
							self.hasDefaultAddyes = true;
							self.hasDefaultAddno = false;
							console.log('self.defaultAdd', self.addressId);
							self.$apply();
						}
					});
				}
				self.check();
			});
		}
		// 检查订单

	}, {
		key: 'check',
		value: function check() {
			var self = this;
			this.fetchDataPromise('data/shop/shopOrder.json', {
				action: 'check',
				shopCartIds: self.hopCartItem.join(","),
				addressId: self.addressId,
				amount: self.amount,
				useAmount: self.isamount,
				couponId: self.couponId,
				couponCode: self.couponCode
			}).then(function (data) {
				console.log('checkcheck ', data);
				if (self.couponCode != null) {
					self.isCode = true;
				} else {
					self.isCode = false;
				}
				self.totalMoney = data.price;
				self.$apply();
				// self.make();
			}).catch(function (error) {
				wx.showToast({
					title: error.message,
					icon: 'success',
					duration: 2000
				});
			});
		}
		// 检查没有错误后生成订单

	}, {
		key: 'make',
		value: function make() {
			var self = this;
			this.fetchDataPromise('data/shop/shopOrder.json', {
				action: 'make',
				shopCartIds: self.hopCartItem.join(","),
				addressId: self.addressId,
				amount: self.amount,
				useAmount: self.isamount,
				couponId: self.couponId,
				couponCode: self.couponCode
			}).then(function (data) {
				console.log('make ', data);
				self.orderId = data.orderId;
				self.losd();
				self.$apply();
			}).catch(function (error) {
				wx.showToast({
					title: error.message,
					icon: 'success',
					duration: 2000
				});
			});
		}
	}, {
		key: 'losd',
		value: function losd() {
			var self = this;
			this.fetchDataPromise('data/shop/shopOrder.json', {
				action: 'pay',
				orderId: self.orderId
			}).then(function (data) {
				console.log('paypaypaypaypay ', data);
				self.wxId = data.pays[0].wxId;
				self.pay();
			}).catch(function (error) {});
		}
	}, {
		key: 'onLoad',
		value: function onLoad(option) {
			console.log('optionoptionoption', option);
			this.hopCartItem = JSON.parse(option.hopCartItem);
			console.log('333', this.hopCartItem);
		}
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

	return payMoney;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(payMoney , 'pages/payMoney'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBheU1vbmV5LmpzIl0sIm5hbWVzIjpbInBheU1vbmV5IiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJjb21wb25lbnRzIiwiZGF0YSIsImNhcmRQcmljZSIsImlzQ29kZSIsImN1cnJlbnRJbmRleCIsImlzYW1vdW50IiwiaGFzRGVmYXVsdEFkZG5vIiwiaGFzRGVmYXVsdEFkZHllcyIsImlzU2hvd1NtIiwiaXNIaWRlU20iLCJpc1Nob3dZZSIsImlzSGlkZVllIiwiYW1vdW50IiwidG90YWxNb25leSIsInN0cm9lRGV0YWlsIiwiZGVmYXVsdEFkZCIsImhvcENhcnRJdGVtIiwiY291cG9uSWQiLCJjb3Vwb25Db2RlIiwibWV0aG9kcyIsImFkZHJlc3NQYWdlIiwid3giLCJuYXZpZ2F0ZVRvIiwidXJsIiwiYUJvb2tQYWdlIiwiYmluZEtleUlucHV0IiwiZSIsInNlbGYiLCJjb25zb2xlIiwibG9nIiwiZGV0YWlsIiwidmFsdWUiLCJsZW5ndGgiLCJjaGVjayIsInBsYXkiLCJtYWtlIiwiU2hvd3MiLCIkYXBwbHkiLCJIaWRlcyIsImluaXQiLCJyZXF1ZXN0UGF5bWVudCIsInRpbWVTdGFtcCIsInRpbWVzdGFtcCIsIm5vbmNlU3RyIiwicGFja2FnZSIsInNpZ25UeXBlIiwicGF5U2lnbiIsInN1Y2Nlc3MiLCJyZXMiLCJjaGVja09yZGVyIiwib3V0X3RyYWRlX25vIiwib3JkZXJJZCIsInR5cGUiLCJmYWlsIiwic3dpdGNoVGFiIiwib3B0aW9uIiwiZmV0Y2hEYXRhUHJvbWlzZSIsImFjdGlvbiIsInd4SWQiLCJpZCIsInRoZW4iLCJwYWlkIiwic2hvd1RvYXN0IiwidGl0bGUiLCJpY29uIiwiZHVyYXRpb24iLCJzZXRUaW1lb3V0Iiwid2FpdGluZyIsInNob3dNb2RhbCIsImNvbnRlbnQiLCJzaG93Q2FuY2VsIiwiY2F0Y2giLCJlcnJvciIsInd4UGF5Iiwic2hvcENhcnRJZHMiLCJqb2luIiwiaXRlbXMiLCJpIiwiaiIsInByb2R1Y3RzIiwiY291bnQiLCJwcmljZSIsInRvRml4ZWQiLCJhZGRyZXNzZXMiLCJtYXAiLCJpdGVtIiwiaW5kZXgiLCJzdGF0dXMiLCJhZGRyZXNzSWQiLCJ1c2VBbW91bnQiLCJtZXNzYWdlIiwibG9zZCIsInBheXMiLCJwYXkiLCJKU09OIiwicGFyc2UiLCJtYXJrZXJJZCIsImNvbnRyb2xJZCIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVDOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBRkE7OztJQUdxQkEsUTs7Ozs7Ozs7Ozs7Ozs7d0xBQ3BCQyxNLEdBQVMsQ0FBQ0MsY0FBRCxDLFFBQ1RDLE0sR0FBUztBQUNSQywyQkFBd0IsTUFEaEI7QUFFUkMsaUNBQThCO0FBRnRCLEcsUUFJVEMsVSxHQUFhLEUsUUFDYkMsSSxHQUFPO0FBQ05DLGNBQVUsRUFESjtBQUVOQyxXQUFRLEtBRkY7QUFHTkMsaUJBQWMsQ0FIUjtBQUlOQyxhQUFVLEtBSko7QUFLTkMsb0JBQWlCLEtBTFg7QUFNTkMscUJBQWtCLElBTlo7QUFPTkMsYUFBVSxLQVBKO0FBUU47QUFDQUMsYUFBVSxJQVRKO0FBVU5DLGFBQVUsSUFWSjtBQVdOQyxhQUFVLEtBWEo7QUFZTkMsV0FBUSxFQVpGO0FBYU5DLGVBQVksRUFiTjtBQWNOQyxnQkFBYSxFQWRQO0FBZU5DLGVBQVksRUFmTjtBQWdCTkMsZ0JBQWEsRUFoQlA7QUFpQk5DLGFBQVUsSUFqQkosRUFpQlU7QUFDaEJDLGVBQVksSUFsQk4sQ0FrQlc7QUFsQlgsRyxRQW9CUEMsTyxHQUFVO0FBQ1RDLGNBRFMseUJBQ0s7QUFBRTtBQUNmQyxPQUFHQyxVQUFILENBQWM7QUFDYkMsVUFBSztBQURRLEtBQWQ7QUFHQSxJQUxRO0FBTVRDLFlBTlMsdUJBTUc7QUFBRTtBQUNiSCxPQUFHQyxVQUFILENBQWM7QUFDYkMsVUFBSztBQURRLEtBQWQ7QUFHQSxJQVZRO0FBV1RFLGVBWFMsd0JB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O0FBU0E7Ozt5QkFDTWpCLE0sRUFBUTtBQUNkM0IsV0FBUUMsR0FBUixDQUFZLG9CQUFaLEVBQWtDMEIsTUFBbEM7QUFDQSxRQUFLdkMsV0FBTCxHQUFtQjhFLEtBQUtDLEtBQUwsQ0FBV3hDLE9BQU92QyxXQUFsQixDQUFuQjtBQUNBWSxXQUFRQyxHQUFSLENBQVksS0FBWixFQUFtQixLQUFLYixXQUF4QjtBQUNBOzs7K0JBQ1lVLEMsRUFBRztBQUNmRSxXQUFRQyxHQUFSLENBQVlILEVBQUUwQixJQUFkO0FBQ0E7Ozs0QkFDUzFCLEMsRUFBRztBQUNaRSxXQUFRQyxHQUFSLENBQVlILEVBQUVzRSxRQUFkO0FBQ0E7Ozs2QkFDVXRFLEMsRUFBRztBQUNiRSxXQUFRQyxHQUFSLENBQVlILEVBQUV1RSxTQUFkO0FBQ0E7Ozs7RUE1U29DQyxlQUFLQyxJOztrQkFBdEJ6RyxRIiwiZmlsZSI6InBheU1vbmV5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcblx0LyogZ2xvYmFsIHd4ICovXHJcblx0aW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XHJcblx0aW1wb3J0IFBhZ2VNaXhpbiBmcm9tICcuLi9taXhpbnMvcGFnZSc7XHJcblx0ZXhwb3J0IGRlZmF1bHQgY2xhc3MgcGF5TW9uZXkgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG5cdFx0bWl4aW5zID0gW1BhZ2VNaXhpbl07XHJcblx0XHRjb25maWcgPSB7XHJcblx0XHRcdG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfnu5PnrpfmlK/ku5gnLFxyXG5cdFx0XHRuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiAnIzY1QUJGRidcclxuXHRcdH07XHJcblx0XHRjb21wb25lbnRzID0ge307XHJcblx0XHRkYXRhID0ge1xyXG5cdFx0XHRjYXJkUHJpY2U6XCJcIixcclxuXHRcdFx0aXNDb2RlOiBmYWxzZSxcclxuXHRcdFx0Y3VycmVudEluZGV4OiAwLFxyXG5cdFx0XHRpc2Ftb3VudDogZmFsc2UsXHJcblx0XHRcdGhhc0RlZmF1bHRBZGRubzogZmFsc2UsXHJcblx0XHRcdGhhc0RlZmF1bHRBZGR5ZXM6IHRydWUsXHJcblx0XHRcdGlzU2hvd1NtOiBmYWxzZSxcclxuXHRcdFx0Ly8gaGFzRGVmYXVsdEFkZDpmYWxzZSxcclxuXHRcdFx0aXNIaWRlU206IHRydWUsXHJcblx0XHRcdGlzU2hvd1llOiB0cnVlLFxyXG5cdFx0XHRpc0hpZGVZZTogZmFsc2UsXHJcblx0XHRcdGFtb3VudDogJycsXHJcblx0XHRcdHRvdGFsTW9uZXk6ICcnLFxyXG5cdFx0XHRzdHJvZURldGFpbDogW10sXHJcblx0XHRcdGRlZmF1bHRBZGQ6IFtdLFxyXG5cdFx0XHRob3BDYXJ0SXRlbTogW10sXHJcblx0XHRcdGNvdXBvbklkOiBudWxsLCAvL+WFkeaNoueggUlkXHJcblx0XHRcdGNvdXBvbkNvZGU6IG51bGwgLy/lhZHmjaLnoIFcclxuXHRcdH1cclxuXHRcdG1ldGhvZHMgPSB7XHJcblx0XHRcdGFkZHJlc3NQYWdlKCkgeyAvL+a3u+WKoOaIlue8lui+keWcsOWdgFxyXG5cdFx0XHRcdHd4Lm5hdmlnYXRlVG8oe1xyXG5cdFx0XHRcdFx0dXJsOiAnZWRpdEFkZHJlc3M/dHlwZT1hZGQnXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGFCb29rUGFnZSgpIHsgLy/lnLDlnYDnsL9cclxuXHRcdFx0XHR3eC5uYXZpZ2F0ZVRvKHtcclxuXHRcdFx0XHRcdHVybDogJ2FkZHJlc3NCb29rJ1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRiaW5kS2V5SW5wdXQoZSkgeyAvL+WFkeaNouWNt1xyXG5cdFx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlLmRldGFpbC52YWx1ZSlcclxuXHRcdFx0XHRpZiAoZS5kZXRhaWwudmFsdWUubGVuZ3RoID09IDYpIHtcclxuXHRcdFx0XHRcdHNlbGYuY291cG9uQ29kZSA9IGUuZGV0YWlsLnZhbHVlO1xyXG5cdFx0XHRcdFx0Ly8gc2VsZi5jb3Vwb25JZCA9ICcyMDE4MTEwMSdcclxuXHRcdFx0XHRcdHNlbGYuY291cG9uSWQgPSBudWxsO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coc2VsZi5jb3Vwb25Db2RlKVxyXG5cdFx0XHRcdFx0c2VsZi5jaGVjaygpXHJcblx0XHRcdFx0fSBlbHNlIGlmIChlLmRldGFpbC52YWx1ZS5sZW5ndGggIT0gNikgeyAvL+WmguaenOWFkeaNouWNt+eahOmVv+W6puS4jeetieS6jjZcclxuXHRcdFx0XHRcdHNlbGYuaXNDb2RlID0gZmFsc2U7XHJcblx0XHRcdFx0XHRzZWxmLmNvdXBvbkNvZGUgPSBudWxsO1xyXG5cdFx0XHRcdFx0c2VsZi5jb3Vwb25JZCA9IG51bGw7XHJcblx0XHRcdFx0XHRzZWxmLmNoZWNrKClcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdzc3NzcycpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHQvLyDngrnlh7vmlK/ku5hcclxuXHRcdFx0cGxheSgpIHtcclxuXHRcdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRcdFx0c2VsZi5tYWtlKCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdFNob3dzKCkge1xyXG5cdFx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIjMzXCIpXHJcblx0XHRcdFx0c2VsZi5pc1Nob3dZZSA9IGZhbHNlO1xyXG5cdFx0XHRcdHNlbGYuaXNIaWRlWWUgPSB0cnVlO1xyXG5cdFx0XHRcdHNlbGYuaXNhbW91bnQgPSBmYWxzZTtcclxuXHRcdFx0XHRzZWxmLmNoZWNrKClcclxuXHRcdFx0XHRzZWxmLiRhcHBseSgpXHJcblx0XHRcdH0sXHJcblx0XHRcdEhpZGVzKCkge1xyXG5cdFx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdFx0XHRzZWxmLmlzU2hvd1llID0gdHJ1ZTtcclxuXHRcdFx0XHRzZWxmLmlzSGlkZVllID0gZmFsc2U7XHJcblx0XHRcdFx0c2VsZi5pc2Ftb3VudCA9IHRydWU7XHJcblx0XHRcdFx0c2VsZi5jaGVjaygpXHJcblx0XHRcdFx0c2VsZi4kYXBwbHkoKVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0d2hlbkFwcFJlYWR5U2hvdygpIHtcclxuXHRcdFx0dGhpcy5jb3Vwb25Db2RlID0gbnVsbDtcclxuXHRcdFx0dGhpcy5jb3Vwb25JZCA9IG51bGw7XHJcblx0XHRcdHRoaXMuaW5pdCgpXHJcblx0XHR9XHJcblx0XHR3eFBheShkYXRhKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwicmVzXCIsIGRhdGEpXHJcblx0XHRcdC8v5ouJ6LW35b6u5L+h5pSv5LuYXHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdFx0Ly8gdmFyIGRhdGEgPSByZXMuZGF0YS5tZXNzYWdlcy5kYXRhO1xyXG5cdFx0XHR3eC5yZXF1ZXN0UGF5bWVudCh7XHJcblx0XHRcdFx0dGltZVN0YW1wOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRub25jZVN0cjogZGF0YS5ub25jZVN0cixcclxuXHRcdFx0XHRwYWNrYWdlOiBkYXRhLnBhY2thZ2UsXHJcblx0XHRcdFx0c2lnblR5cGU6IGRhdGEuc2lnblR5cGUsXHJcblx0XHRcdFx0cGF5U2lnbjogZGF0YS5wYXlTaWduLFxyXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xyXG5cdFx0XHRcdFx0Ly/mlK/ku5jmiJDlip9cclxuXHRcdFx0XHRcdHNlbGYuY2hlY2tPcmRlcih7XHJcblx0XHRcdFx0XHRcdG91dF90cmFkZV9ubzogZGF0YS5vdXRfdHJhZGVfbm8sXHJcblx0XHRcdFx0XHRcdG9yZGVySWQ6IGRhdGEub3JkZXJJZCxcclxuXHRcdFx0XHRcdFx0dHlwZTogXCJ3eF9odG1sXCJcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0ZmFpbDogZnVuY3Rpb24ocmVzKSB7XHJcblx0XHRcdFx0XHQvL+aUr+S7mOWksei0pVxyXG5cdFx0XHRcdFx0d3guc3dpdGNoVGFiKHtcclxuXHRcdFx0XHRcdFx0dXJsOiAndXNlcicsXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHJlcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdGNoZWNrT3JkZXIob3B0aW9uKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwib3B0aW9ub3B0aW9uXCIsIG9wdGlvbilcclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0XHR0aGlzLmZldGNoRGF0YVByb21pc2UoJ2RhdGEvc2hvcC9wYXkvd3hQYXkuanNvbicsIHtcclxuXHRcdFx0XHRcdGFjdGlvbjogJ2NoZWNrJyxcclxuXHRcdFx0XHRcdHd4SWQ6IHNlbGYud3hJZCxcclxuXHRcdFx0XHRcdGlkOiBvcHRpb24ub3JkZXJJZCxcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdjaGVja2NoZWNrICcsIGRhdGEpO1xyXG5cdFx0XHRcdFx0aWYgKGRhdGEucGFpZCkge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygn5pSv5LuY5oiQ5YqfJyk7XHJcblx0XHRcdFx0XHRcdHd4LnNob3dUb2FzdCh7XHJcblx0XHRcdFx0XHRcdFx0dGl0bGU6IFwi5pSv5LuY5oiQ5YqfXCIsXHJcblx0XHRcdFx0XHRcdFx0aWNvbjogXCJzdWNjZXNzXCIsXHJcblx0XHRcdFx0XHRcdFx0ZHVyYXRpb246IDMwMDBcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdHd4LnN3aXRjaFRhYih7XHJcblx0XHRcdFx0XHRcdFx0XHR1cmw6ICd1c2VyJyxcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0fSwgMzAwMCk7XHJcblx0XHRcdFx0XHRcdC8v6Lez6L2s6aaW6aG1XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGRhdGEud2FpdGluZykge1xyXG5cdFx0XHRcdFx0XHRzZWxmLmNoZWNrT3JkZXIoe1xyXG5cdFx0XHRcdFx0XHRcdG91dF90cmFkZV9ubzogb3B0aW9uLm91dF90cmFkZV9ubyxcclxuXHRcdFx0XHRcdFx0XHRvcmRlcklkOiBvcHRpb24ub3JkZXJJZCxcclxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcInd4X2h0bWxcIlxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoIWRhdGEucGFpZCkge1xyXG5cdFx0XHRcdFx0XHR3eC5zaG93TW9kYWwoe1xyXG5cdFx0XHRcdFx0XHRcdHRpdGxlOiAn5o+Q56S6JyxcclxuXHRcdFx0XHRcdFx0XHRjb250ZW50OiAn5pSv5LuY5aSx6LSlLOivt+iBlOezu+WuouacjScsXHJcblx0XHRcdFx0XHRcdFx0c2hvd0NhbmNlbDogZmFsc2VcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRzZWxmLiRhcHBseSgpO1xyXG5cdFx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7fSk7XHJcblx0XHR9XHJcblx0XHRwYXkoKSB7XHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdFx0dGhpcy5mZXRjaERhdGFQcm9taXNlKCdkYXRhL3Nob3AvcGF5L3d4UGF5Lmpzb24nLCB7XHJcblx0XHRcdFx0XHRhY3Rpb246ICdjcmVhdGUnLFxyXG5cdFx0XHRcdFx0b3JkZXJJZDogc2VsZi5vcmRlcklkLFxyXG5cdFx0XHRcdFx0d3hJZDogc2VsZi53eElkXHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygn5pSv5LuY5pSv5LuYICcsIGRhdGEpO1xyXG5cdFx0XHRcdFx0aWYgKGRhdGEud3hQYXkpIHtcclxuXHRcdFx0XHRcdFx0Ly/mi4notbflvq7kv6HmlK/ku5hcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ+aUr+S7mOaUr+S7mDQ0NDQ0NDQ0NDQ0NDQ0ICcsIGRhdGEpO1xyXG5cdFx0XHRcdFx0XHRzZWxmLnd4UGF5KGRhdGEpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly/ml6Dpobvmi4nlj5blvq7kv6HmlK/ku5hcclxuXHRcdFx0XHRcdFx0c2VsZi5jaGVja09yZGVyKHtcclxuXHRcdFx0XHRcdFx0XHRvdXRfdHJhZGVfbm86IGRhdGEub3V0X3RyYWRlX25vLFxyXG5cdFx0XHRcdFx0XHRcdG9yZGVySWQ6IGRhdGEub3JkZXJJZCxcclxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcInd4X2h0bWxcIlxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KS5jYXRjaChmdW5jdGlvbihlcnJvcikge30pO1xyXG5cdFx0fVxyXG5cdFx0aW5pdCgpIHtcclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0XHR0aGlzLmZldGNoRGF0YVByb21pc2UoJ2RhdGEvc2hvcC9zaG9wT3JkZXIuanNvbicsIHtcclxuXHRcdFx0XHRcdGFjdGlvbjogJ3ByZXZpZXcnLFxyXG5cdFx0XHRcdFx0c2hvcENhcnRJZHM6IHNlbGYuaG9wQ2FydEl0ZW0uam9pbihcIixcIiksXHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnMjIgJywgZGF0YSk7XHJcblx0XHRcdFx0XHRzZWxmLmFtb3VudCA9IGRhdGEuYW1vdW50O1xyXG5cdFx0XHRcdFx0aWYgKHNlbGYuYW1vdW50ID09IDApIHtcclxuXHRcdFx0XHRcdFx0c2VsZi5pc1Nob3dZZSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRzZWxmLmlzSGlkZVllID0gZmFsc2U7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0c2VsZi5pc1Nob3dZZSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRzZWxmLmlzSGlkZVllID0gdHJ1ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHNlbGYuc3Ryb2VEZXRhaWwgPSBkYXRhLml0ZW1zO1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzZWxmLnN0cm9lRGV0YWlsLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgc2VsZi5zdHJvZURldGFpbFtpXS5wcm9kdWN0cy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhzZWxmLnN0cm9lRGV0YWlsW2ldLnByb2R1Y3RzW2pdLmNvdW50ICsgJy0tJyArIHNlbGYuc3Ryb2VEZXRhaWxbaV0ucHJvZHVjdHNbal0ucHJpY2UpXHJcblx0XHRcdFx0XHRcdHNlbGYuc3Ryb2VEZXRhaWxbaV0ucHJvZHVjdHNbal1bJ2NhcmRQcmljZSddPSAoc2VsZi5zdHJvZURldGFpbFtpXS5wcm9kdWN0c1tqXS5jb3VudCpzZWxmLnN0cm9lRGV0YWlsW2ldLnByb2R1Y3RzW2pdLnByaWNlKS50b0ZpeGVkKDIpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vIOiOt+WPluWcsOWdgFxyXG5cdFx0XHRcdFx0aWYgKGRhdGEuYWRkcmVzc2VzLmxlbmd0aCA9PSAnJykge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnZGF0YS5hZGRyZXNzZXMubGVuZ3RoJywgZGF0YS5hZGRyZXNzZXMubGVuZ3RoKVxyXG5cdFx0XHRcdFx0XHRzZWxmLmhhc0RlZmF1bHRBZGRubyA9IHRydWU7XHJcblx0XHRcdFx0XHRcdHNlbGYuaGFzRGVmYXVsdEFkZHllcyA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRzZWxmLiRhcHBseSgpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0ZGF0YS5hZGRyZXNzZXMubWFwKChpdGVtLCBpbmRleCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiaW5kZXhcIiwgaW5kZXgpXHJcblx0XHRcdFx0XHRcdFx0aWYgKGl0ZW0uc3RhdHVzID09IDIpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHNlbGYuZGVmYXVsdEFkZCA9IGl0ZW07XHJcblx0XHRcdFx0XHRcdFx0XHRzZWxmLmFkZHJlc3NJZCA9IHNlbGYuZGVmYXVsdEFkZC5pZDtcclxuXHRcdFx0XHRcdFx0XHRcdHNlbGYuaGFzRGVmYXVsdEFkZHllcyA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0XHRzZWxmLmhhc0RlZmF1bHRBZGRubyA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ3NlbGYuZGVmYXVsdEFkZCcsIHNlbGYuYWRkcmVzc0lkKVxyXG5cdFx0XHRcdFx0XHRcdFx0c2VsZi4kYXBwbHkoKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRzZWxmLmNoZWNrKClcclxuXHRcdFx0XHR9KVxyXG5cdFx0fVxyXG5cdFx0Ly8g5qOA5p+l6K6i5Y2VXHJcblx0XHRjaGVjaygpIHtcclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0XHR0aGlzLmZldGNoRGF0YVByb21pc2UoJ2RhdGEvc2hvcC9zaG9wT3JkZXIuanNvbicsIHtcclxuXHRcdFx0XHRcdGFjdGlvbjogJ2NoZWNrJyxcclxuXHRcdFx0XHRcdHNob3BDYXJ0SWRzOiBzZWxmLmhvcENhcnRJdGVtLmpvaW4oXCIsXCIpLFxyXG5cdFx0XHRcdFx0YWRkcmVzc0lkOiBzZWxmLmFkZHJlc3NJZCxcclxuXHRcdFx0XHRcdGFtb3VudDogc2VsZi5hbW91bnQsXHJcblx0XHRcdFx0XHR1c2VBbW91bnQ6IHNlbGYuaXNhbW91bnQsXHJcblx0XHRcdFx0XHRjb3Vwb25JZDogc2VsZi5jb3Vwb25JZCxcclxuXHRcdFx0XHRcdGNvdXBvbkNvZGU6IHNlbGYuY291cG9uQ29kZVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ2NoZWNrY2hlY2sgJywgZGF0YSk7XHJcblx0XHRcdFx0XHRpZiAoc2VsZi5jb3Vwb25Db2RlICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdFx0c2VsZi5pc0NvZGUgPSB0cnVlO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0c2VsZi5pc0NvZGUgPSBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHNlbGYudG90YWxNb25leSA9IGRhdGEucHJpY2U7XHJcblx0XHRcdFx0XHRzZWxmLiRhcHBseSgpO1xyXG5cdFx0XHRcdFx0Ly8gc2VsZi5tYWtlKCk7XHJcblx0XHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcclxuXHRcdFx0XHRcdHd4LnNob3dUb2FzdCh7XHJcblx0XHRcdFx0XHRcdHRpdGxlOiBlcnJvci5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHRpY29uOiAnc3VjY2VzcycsXHJcblx0XHRcdFx0XHRcdGR1cmF0aW9uOiAyMDAwXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0Ly8g5qOA5p+l5rKh5pyJ6ZSZ6K+v5ZCO55Sf5oiQ6K6i5Y2VXHJcblx0XHRtYWtlKCkge1xyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRcdHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgnZGF0YS9zaG9wL3Nob3BPcmRlci5qc29uJywge1xyXG5cdFx0XHRcdFx0YWN0aW9uOiAnbWFrZScsXHJcblx0XHRcdFx0XHRzaG9wQ2FydElkczogc2VsZi5ob3BDYXJ0SXRlbS5qb2luKFwiLFwiKSxcclxuXHRcdFx0XHRcdGFkZHJlc3NJZDogc2VsZi5hZGRyZXNzSWQsXHJcblx0XHRcdFx0XHRhbW91bnQ6IHNlbGYuYW1vdW50LFxyXG5cdFx0XHRcdFx0dXNlQW1vdW50OiBzZWxmLmlzYW1vdW50LFxyXG5cdFx0XHRcdFx0Y291cG9uSWQ6IHNlbGYuY291cG9uSWQsXHJcblx0XHRcdFx0XHRjb3Vwb25Db2RlOiBzZWxmLmNvdXBvbkNvZGVcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdtYWtlICcsIGRhdGEpO1xyXG5cdFx0XHRcdFx0c2VsZi5vcmRlcklkID0gZGF0YS5vcmRlcklkO1xyXG5cdFx0XHRcdFx0c2VsZi5sb3NkKClcclxuXHRcdFx0XHRcdHNlbGYuJGFwcGx5KCk7XHJcblx0XHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcclxuXHRcdFx0XHRcdHd4LnNob3dUb2FzdCh7XHJcblx0XHRcdFx0XHRcdHRpdGxlOiBlcnJvci5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHRpY29uOiAnc3VjY2VzcycsXHJcblx0XHRcdFx0XHRcdGR1cmF0aW9uOiAyMDAwXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0bG9zZCgpIHtcclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0XHR0aGlzLmZldGNoRGF0YVByb21pc2UoJ2RhdGEvc2hvcC9zaG9wT3JkZXIuanNvbicsIHtcclxuXHRcdFx0XHRcdGFjdGlvbjogJ3BheScsXHJcblx0XHRcdFx0XHRvcmRlcklkOiBzZWxmLm9yZGVySWRcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdwYXlwYXlwYXlwYXlwYXkgJywgZGF0YSk7XHJcblx0XHRcdFx0XHRzZWxmLnd4SWQgPSBkYXRhLnBheXNbMF0ud3hJZDtcclxuXHRcdFx0XHRcdHNlbGYucGF5KClcclxuXHRcdFx0XHR9KS5jYXRjaChmdW5jdGlvbihlcnJvcikge30pO1xyXG5cdFx0fVxyXG5cdFx0b25Mb2FkKG9wdGlvbikge1xyXG5cdFx0XHRjb25zb2xlLmxvZygnb3B0aW9ub3B0aW9ub3B0aW9uJywgb3B0aW9uKVxyXG5cdFx0XHR0aGlzLmhvcENhcnRJdGVtID0gSlNPTi5wYXJzZShvcHRpb24uaG9wQ2FydEl0ZW0pO1xyXG5cdFx0XHRjb25zb2xlLmxvZygnMzMzJywgdGhpcy5ob3BDYXJ0SXRlbSlcclxuXHRcdH1cclxuXHRcdHJlZ2lvbmNoYW5nZShlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGUudHlwZSk7XHJcblx0XHR9XHJcblx0XHRtYXJrZXJ0YXAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlLm1hcmtlcklkKTtcclxuXHRcdH1cclxuXHRcdGNvbnRyb2x0YXAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlLmNvbnRyb2xJZCk7XHJcblx0XHR9XHJcblx0fVxyXG4iXX0=