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


var ProductDetail = function (_wepy$page) {
  _inherits(ProductDetail, _wepy$page);

  function ProductDetail() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ProductDetail);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ProductDetail.__proto__ || Object.getPrototypeOf(ProductDetail)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
      navigationBarTitleText: '商品详情',
      navigationBarBackgroundColor: '#65ABFF'
    }, _this.components = {}, _this.data = {
      loadUser: true,
      number: 1,
      productId: '',
      shopId: '',
      product: [],
      isBook: false,
      childs: [],
      productDetail: []
    }, _this.methods = {
      getSearchContent: function getSearchContent(e) {
        this.number = e.detail.value;
        if (this.number == 0) {
          this.change();
        } else {}
      },
      producTopCar: function producTopCar() {
        wx.switchTab({
          url: '/pages/car'
        });
      },
      call: function call() {
        wx.makePhoneCall({
          phoneNumber: '4008210178' //仅为示例，并非真实的电话号码
        });
      },
      bank: function bank() {
        this.isBook = false;
      },
      addBtn: function addBtn() {
        console.log("");
        this.isBook = true;
      },
      produc: function produc(e) {
        console.log('eeeeee', e);
        var self = this;
        self.childId = e.currentTarget.dataset.child;
        this.fetchDataPromise('shop/product.json', {
          shopId: self.shopId,
          productId: self.Id,
          childId: self.childId
        }).then(function (data) {
          console.log("data", data);
          self.childs = data.product.childs;
          self.productDetail = data.product;
          self.$apply();
        });
      },
      sub: function sub() {
        if (this.number == '1') {
          wx.showToast({
            title: '数量最低为1',
            icon: 'success',
            duration: 2000
          });
          return;
        } else {
          this.number--;
        }
      },
      add: function add() {
        this.number++;
      },
      productBtn: function productBtn() {
        var self = this;
        if (self.childId == undefined) {
          console.log("self.childId", self.product.childs[0].id);
        } else {
          console.log("self.childId", self.childId);
        }
        console.log("self.shopId", self.shopId);
        console.log("self.productId", self.Id);
        console.log("self.number", self.number);
        this.fetchDataPromise('shop/shopCart.json', {
          action: 'add',
          shopId: self.shopId,
          productId: self.Id,
          childId: self.childId,
          count: self.number
        }).then(function (data) {
          console.log('22 ', data);
          self.$apply();
          wx.switchTab({
            url: '/pages/car'
          });
        });
        this.isBook = false;
      },
      logs: function logs() {
        wx.navigateTo({
          url: '/pages/upload'
        });
      },
      search: function search() {
        wx.navigateTo({
          url: '/pages/search_result'
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ProductDetail, [{
    key: 'change',
    value: function change() {
      this.number = 1;
      this.$apply();
    }
  }, {
    key: 'onLoad',
    value: function onLoad(e) {
      console.log('e', e);
      this.shopId = e.shopId;
      this.Id = e.Id;
      this.$apply();
    }
  }, {
    key: 'whenAppReadyShow',
    value: function whenAppReadyShow() {
      var self = this;
      self.number = 1;
      this.fetchDataPromise('shop/product.json', {
        shopId: self.shopId,
        productId: self.Id
      }).then(function (data) {
        console.log('22 ', data);
        self.product = data.product;
        self.$apply();
        if (!self.product.childs) {} else {
          self.fetchDataPromise('shop/product.json', {
            shopId: self.shopId,
            productId: self.Id,
            childId: self.product.childs[0].id
          }).then(function (data) {
            console.log('子分类 ', data);
            self.productDetail = data.product;
            self.childs = data.product.childs;
            self.childId = self.product.childs[0].id;
            self.$apply();
          });
        }
      });
    }
  }]);

  return ProductDetail;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(ProductDetail , 'pages/productDetail'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2R1Y3REZXRhaWwuanMiXSwibmFtZXMiOlsiUHJvZHVjdERldGFpbCIsIm1peGlucyIsIlBhZ2VNaXhpbiIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsImRhdGEiLCJsb2FkVXNlciIsIm51bWJlciIsInByb2R1Y3RJZCIsInNob3BJZCIsInByb2R1Y3QiLCJpc0Jvb2siLCJjaGlsZHMiLCJwcm9kdWN0RGV0YWlsIiwibWV0aG9kcyIsImdldFNlYXJjaENvbnRlbnQiLCJlIiwiZGV0YWlsIiwidmFsdWUiLCJjaGFuZ2UiLCJwcm9kdWNUb3BDYXIiLCJ3eCIsInN3aXRjaFRhYiIsInVybCIsImNhbGwiLCJtYWtlUGhvbmVDYWxsIiwicGhvbmVOdW1iZXIiLCJiYW5rIiwiYWRkQnRuIiwiY29uc29sZSIsImxvZyIsInByb2R1YyIsInNlbGYiLCJjaGlsZElkIiwiY3VycmVudFRhcmdldCIsImRhdGFzZXQiLCJjaGlsZCIsImZldGNoRGF0YVByb21pc2UiLCJJZCIsInRoZW4iLCIkYXBwbHkiLCJzdWIiLCJzaG93VG9hc3QiLCJ0aXRsZSIsImljb24iLCJkdXJhdGlvbiIsImFkZCIsInByb2R1Y3RCdG4iLCJ1bmRlZmluZWQiLCJpZCIsImFjdGlvbiIsImNvdW50IiwibG9ncyIsIm5hdmlnYXRlVG8iLCJzZWFyY2giLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFRTs7OztBQUNBOzs7Ozs7Ozs7OztBQUZBOzs7SUFHcUJBLGE7Ozs7Ozs7Ozs7Ozs7O29NQUNuQkMsTSxHQUFTLENBQUNDLGNBQUQsQyxRQUNUQyxNLEdBQVM7QUFDUEMsOEJBQXdCLE1BRGpCO0FBRVBDLG9DQUE4QjtBQUZ2QixLLFFBSVRDLFUsR0FBYSxFLFFBQ2JDLEksR0FBTztBQUNMQyxnQkFBVSxJQURMO0FBRUxDLGNBQVEsQ0FGSDtBQUdMQyxpQkFBVyxFQUhOO0FB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dEIsT0FBTCxDQUFhRSxNQUFsQixFQUEwQixDQUN6QixDQURELE1BQ087QUFDTG9CLGVBQUtLLGdCQUFMLENBQXNCLG1CQUF0QixFQUEyQztBQUN2QzVCLG9CQUFRdUIsS0FBS3ZCLE1BRDBCO0FBRXZDRCx1QkFBV3dCLEtBQUtNLEVBRnVCO0FBR3ZDTCxxQkFBU0QsS0FBS3RCLE9BQUwsQ0FBYUUsTUFBYixDQUFvQixDQUFwQixFQUF1QnFDO0FBSE8sV0FBM0MsRUFLR1YsSUFMSCxDQUtRLFVBQVNsQyxJQUFULEVBQWU7QUFDbkJ3QixvQkFBUUMsR0FBUixDQUFZLE1BQVosRUFBb0J6QixJQUFwQjtBQUNBMkIsaUJBQUtuQixhQUFMLEdBQXFCUixLQUFLSyxPQUExQjtBQUNBc0IsaUJBQUtwQixNQUFMLEdBQWNQLEtBQUtLLE9BQUwsQ0FBYUUsTUFBM0I7QUFDQW9CLGlCQUFLQyxPQUFMLEdBQWVELEtBQUt0QixPQUFMLENBQWFFLE1BQWIsQ0FBb0IsQ0FBcEIsRUFBdUJxQyxFQUF0QztBQUNBakIsaUJBQUtRLE1BQUw7QUFDRCxXQVhIO0FBWUQ7QUFDRixPQXZCSDtBQXdCRDs7OztFQXJKd0NlLGVBQUtDLEk7O2tCQUEzQjFELGEiLCJmaWxlIjoicHJvZHVjdERldGFpbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4gIC8qIGdsb2JhbCB3eCAqL1xyXG4gIGltcG9ydCB3ZXB5IGZyb20gJ3dlcHknO1xyXG4gIGltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vbWl4aW5zL3BhZ2UnO1xyXG4gIGV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb2R1Y3REZXRhaWwgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gICAgbWl4aW5zID0gW1BhZ2VNaXhpbl07XHJcbiAgICBjb25maWcgPSB7XHJcbiAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfllYblk4Hor6bmg4UnLFxyXG4gICAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiAnIzY1QUJGRidcclxuICAgIH07XHJcbiAgICBjb21wb25lbnRzID0ge307XHJcbiAgICBkYXRhID0ge1xyXG4gICAgICBsb2FkVXNlcjogdHJ1ZSxcclxuICAgICAgbnVtYmVyOiAxLFxyXG4gICAgICBwcm9kdWN0SWQ6ICcnLFxyXG4gICAgICBzaG9wSWQ6ICcnLFxyXG4gICAgICBwcm9kdWN0OiBbXSxcclxuICAgICAgaXNCb29rOiBmYWxzZSxcclxuICAgICAgY2hpbGRzOiBbXSxcclxuICAgICAgcHJvZHVjdERldGFpbDogW11cclxuICAgIH1cclxuICAgIG1ldGhvZHMgPSB7XHJcbiAgICAgIGdldFNlYXJjaENvbnRlbnQoZSkge1xyXG4gICAgICAgIHRoaXMubnVtYmVyID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgaWYodGhpcy5udW1iZXIgPT0gMCl7XHJcbiAgICAgICAgICB0aGlzLmNoYW5nZSgpXHJcbiAgICAgICAgfWVsc2V7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgfSxcclxuICAgICAgcHJvZHVjVG9wQ2FyKCkge1xyXG4gICAgICAgIHd4LnN3aXRjaFRhYih7XHJcbiAgICAgICAgICB1cmw6ICcvcGFnZXMvY2FyJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgICBjYWxsKCkge1xyXG4gICAgICAgIHd4Lm1ha2VQaG9uZUNhbGwoe1xyXG4gICAgICAgICAgcGhvbmVOdW1iZXI6ICc0MDA4MjEwMTc4JyAvL+S7heS4uuekuuS+i++8jOW5tumdnuecn+WunueahOeUteivneWPt+eggVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0sXHJcbiAgICAgIGJhbmsoKSB7XHJcbiAgICAgICAgdGhpcy5pc0Jvb2sgPSBmYWxzZTtcclxuICAgICAgfSxcclxuICAgICAgYWRkQnRuKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiXCIpXHJcbiAgICAgICAgdGhpcy5pc0Jvb2sgPSB0cnVlO1xyXG4gICAgICB9LFxyXG4gICAgICBwcm9kdWMoZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdlZWVlZWUnLCBlKVxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLmNoaWxkSWQgPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5jaGlsZDtcclxuICAgICAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3Nob3AvcHJvZHVjdC5qc29uJywge1xyXG4gICAgICAgICAgICBzaG9wSWQ6IHNlbGYuc2hvcElkLFxyXG4gICAgICAgICAgICBwcm9kdWN0SWQ6IHNlbGYuSWQsXHJcbiAgICAgICAgICAgIGNoaWxkSWQ6IHNlbGYuY2hpbGRJZFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJkYXRhXCIsIGRhdGEpXHJcbiAgICAgICAgICAgIHNlbGYuY2hpbGRzID0gZGF0YS5wcm9kdWN0LmNoaWxkcztcclxuICAgICAgICAgICAgc2VsZi5wcm9kdWN0RGV0YWlsID0gZGF0YS5wcm9kdWN0O1xyXG4gICAgICAgICAgICBzZWxmLiRhcHBseSgpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICB9LFxyXG4gICAgICBzdWIoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubnVtYmVyID09ICcxJykge1xyXG4gICAgICAgICAgd3guc2hvd1RvYXN0KHtcclxuICAgICAgICAgICAgdGl0bGU6ICfmlbDph4/mnIDkvY7kuLoxJyxcclxuICAgICAgICAgICAgaWNvbjogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICBkdXJhdGlvbjogMjAwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMubnVtYmVyLS1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGFkZCgpIHtcclxuICAgICAgICB0aGlzLm51bWJlcisrXHJcbiAgICAgIH0sXHJcbiAgICAgIHByb2R1Y3RCdG4oKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGlmIChzZWxmLmNoaWxkSWQgPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcInNlbGYuY2hpbGRJZFwiLCBzZWxmLnByb2R1Y3QuY2hpbGRzWzBdLmlkKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcInNlbGYuY2hpbGRJZFwiLCBzZWxmLmNoaWxkSWQpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwic2VsZi5zaG9wSWRcIiwgc2VsZi5zaG9wSWQpXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJzZWxmLnByb2R1Y3RJZFwiLCBzZWxmLklkKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwic2VsZi5udW1iZXJcIiwgc2VsZi5udW1iZXIpXHJcbiAgICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKCdzaG9wL3Nob3BDYXJ0Lmpzb24nLCB7XHJcbiAgICAgICAgICAgIGFjdGlvbjogJ2FkZCcsXHJcbiAgICAgICAgICAgIHNob3BJZDogc2VsZi5zaG9wSWQsXHJcbiAgICAgICAgICAgIHByb2R1Y3RJZDogc2VsZi5JZCxcclxuICAgICAgICAgICAgY2hpbGRJZDogc2VsZi5jaGlsZElkLFxyXG4gICAgICAgICAgICBjb3VudDogc2VsZi5udW1iZXJcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcyMiAnLCBkYXRhKTtcclxuICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcclxuICAgICAgICAgICAgd3guc3dpdGNoVGFiKHtcclxuICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvY2FyJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy5pc0Jvb2sgPSBmYWxzZTtcclxuICAgICAgfSxcclxuICAgICAgbG9ncygpIHtcclxuICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICAgIHVybDogJy9wYWdlcy91cGxvYWQnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIHNlYXJjaCgpIHtcclxuICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICAgIHVybDogJy9wYWdlcy9zZWFyY2hfcmVzdWx0J1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjaGFuZ2UoKXtcclxuICAgICAgdGhpcy5udW1iZXIgPSAxO1xyXG4gICAgICB0aGlzLiRhcHBseSgpXHJcbiAgICB9XHJcbiAgICBvbkxvYWQoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZygnZScsIGUpXHJcbiAgICAgIHRoaXMuc2hvcElkID0gZS5zaG9wSWQ7XHJcbiAgICAgIHRoaXMuSWQgPSBlLklkO1xyXG4gICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgfVxyXG4gICAgd2hlbkFwcFJlYWR5U2hvdygpIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICBzZWxmLm51bWJlciA9IDE7XHJcbiAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgnc2hvcC9wcm9kdWN0Lmpzb24nLCB7XHJcbiAgICAgICAgICBzaG9wSWQ6IHNlbGYuc2hvcElkLFxyXG4gICAgICAgICAgcHJvZHVjdElkOiBzZWxmLklkXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnMjIgJywgZGF0YSk7XHJcbiAgICAgICAgICBzZWxmLnByb2R1Y3QgPSBkYXRhLnByb2R1Y3Q7XHJcbiAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgaWYgKCFzZWxmLnByb2R1Y3QuY2hpbGRzKSB7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZWxmLmZldGNoRGF0YVByb21pc2UoJ3Nob3AvcHJvZHVjdC5qc29uJywge1xyXG4gICAgICAgICAgICAgICAgc2hvcElkOiBzZWxmLnNob3BJZCxcclxuICAgICAgICAgICAgICAgIHByb2R1Y3RJZDogc2VsZi5JZCxcclxuICAgICAgICAgICAgICAgIGNoaWxkSWQ6IHNlbGYucHJvZHVjdC5jaGlsZHNbMF0uaWRcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCflrZDliIbnsbsgJywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnByb2R1Y3REZXRhaWwgPSBkYXRhLnByb2R1Y3Q7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmNoaWxkcyA9IGRhdGEucHJvZHVjdC5jaGlsZHM7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmNoaWxkSWQgPSBzZWxmLnByb2R1Y3QuY2hpbGRzWzBdLmlkO1xyXG4gICAgICAgICAgICAgICAgc2VsZi4kYXBwbHkoKVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcbiJdfQ==