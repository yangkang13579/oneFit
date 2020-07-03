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
                    phoneNumber: '4008210178' // 仅为示例，并非真实的电话号码
                });
            },
            bank: function bank() {
                this.isBook = false;
            },
            addBtn: function addBtn() {
                console.log('');
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
                    console.log('data', data);
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
                    console.log('self.childId', self.product.childs[0].id);
                } else {
                    console.log('self.childId', self.childId);
                }
                console.log('self.shopId', self.shopId);
                console.log('self.productId', self.Id);
                console.log('self.number', self.number);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2R1Y3REZXRhaWwuanMiXSwibmFtZXMiOlsiUHJvZHVjdERldGFpbCIsIm1peGlucyIsIlBhZ2VNaXhpbiIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsImRhdGEiLCJsb2FkVXNlciIsIm51bWJlciIsInByb2R1Y3RJZCIsInNob3BJZCIsInByb2R1Y3QiLCJpc0Jvb2siLCJjaGlsZHMiLCJwcm9kdWN0RGV0YWlsIiwibWV0aG9kcyIsImdldFNlYXJjaENvbnRlbnQiLCJlIiwiZGV0YWlsIiwidmFsdWUiLCJjaGFuZ2UiLCJwcm9kdWNUb3BDYXIiLCJ3eCIsInN3aXRjaFRhYiIsInVybCIsImNhbGwiLCJtYWtlUGhvbmVDYWxsIiwicGhvbmVOdW1iZXIiLCJiYW5rIiwiYWRkQnRuIiwiY29uc29sZSIsImxvZyIsInByb2R1YyIsInNlbGYiLCJjaGlsZElkIiwiY3VycmVudFRhcmdldCIsImRhdGFzZXQiLCJjaGlsZCIsImZldGNoRGF0YVByb21pc2UiLCJJZCIsInRoZW4iLCIkYXBwbHkiLCJzdWIiLCJzaG93VG9hc3QiLCJ0aXRsZSIsImljb24iLCJkdXJhdGlvbiIsImFkZCIsInByb2R1Y3RCdG4iLCJ1bmRlZmluZWQiLCJpZCIsImFjdGlvbiIsImNvdW50IiwibG9ncyIsIm5hdmlnYXRlVG8iLCJzZWFyY2giLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFRTs7OztBQUNBOzs7Ozs7Ozs7OztBQUZBOzs7SUFHcUJBLGE7Ozs7Ozs7Ozs7Ozs7O3dNQUNuQkMsTSxHQUFTLENBQUNDLGNBQUQsQyxRQUNUQyxNLEdBQVM7QUFDTEMsb0NBQXdCLE1BRG5CO0FBRUxDLDBDQUE4QjtBQUZ6QixTLFFBSVRDLFUsR0FBYSxFLFFBQ2JDLEksR0FBTztBQUNIQyxzQkFBVSxJQURQO0FBRUhDLG9CQUFRLENBRkw7QUFHSEMsdUJBQVcsRUFIUjtB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R0FBZUwsS0FBS0ssT0FBcEI7QUFDQXNCLHFCQUFLUSxNQUFMO0FBQ0Esb0JBQUksQ0FBQ1IsS0FBS3RCLE9BQUwsQ0FBYUUsTUFBbEIsRUFBMEIsQ0FDekIsQ0FERCxNQUNPO0FBQ0hvQix5QkFBS0ssZ0JBQUwsQ0FBc0IsbUJBQXRCLEVBQTJDO0FBQ3ZDNUIsZ0NBQVF1QixLQUFLdkIsTUFEMEI7QUFFdkNELG1DQUFXd0IsS0FBS00sRUFGdUI7QUFHdkNMLGlDQUFTRCxLQUFLdEIsT0FBTCxDQUFhRSxNQUFiLENBQW9CLENBQXBCLEVBQXVCcUM7QUFITyxxQkFBM0MsRUFLS1YsSUFMTCxDQUtVLFVBQVNsQyxJQUFULEVBQWU7QUFDakJ3QixnQ0FBUUMsR0FBUixDQUFZLE1BQVosRUFBb0J6QixJQUFwQjtBQUNBMkIsNkJBQUtuQixhQUFMLEdBQXFCUixLQUFLSyxPQUExQjtBQUNBc0IsNkJBQUtwQixNQUFMLEdBQWNQLEtBQUtLLE9BQUwsQ0FBYUUsTUFBM0I7QUFDQW9CLDZCQUFLQyxPQUFMLEdBQWVELEtBQUt0QixPQUFMLENBQWFFLE1BQWIsQ0FBb0IsQ0FBcEIsRUFBdUJxQyxFQUF0QztBQUNBakIsNkJBQUtRLE1BQUw7QUFDSCxxQkFYTDtBQVlIO0FBQ0osYUF2Qkw7QUF3Qkg7Ozs7RUFySndDZSxlQUFLQyxJOztrQkFBM0IxRCxhIiwiZmlsZSI6InByb2R1Y3REZXRhaWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuICAvKiBnbG9iYWwgd3ggKi9cclxuICBpbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcclxuICBpbXBvcnQgUGFnZU1peGluIGZyb20gJy4uL21peGlucy9wYWdlJztcclxuICBleHBvcnQgZGVmYXVsdCBjbGFzcyBQcm9kdWN0RGV0YWlsIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICAgIG1peGlucyA9IFtQYWdlTWl4aW5dO1xyXG4gICAgY29uZmlnID0ge1xyXG4gICAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfllYblk4Hor6bmg4UnLFxyXG4gICAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjNjVBQkZGJ1xyXG4gICAgfTtcclxuICAgIGNvbXBvbmVudHMgPSB7fTtcclxuICAgIGRhdGEgPSB7XHJcbiAgICAgICAgbG9hZFVzZXI6IHRydWUsXHJcbiAgICAgICAgbnVtYmVyOiAxLFxyXG4gICAgICAgIHByb2R1Y3RJZDogJycsXHJcbiAgICAgICAgc2hvcElkOiAnJyxcclxuICAgICAgICBwcm9kdWN0OiBbXSxcclxuICAgICAgICBpc0Jvb2s6IGZhbHNlLFxyXG4gICAgICAgIGNoaWxkczogW10sXHJcbiAgICAgICAgcHJvZHVjdERldGFpbDogW11cclxuICAgIH1cclxuICAgIG1ldGhvZHMgPSB7XHJcbiAgICAgICAgZ2V0U2VhcmNoQ29udGVudChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMubnVtYmVyID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm51bWJlciA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcHJvZHVjVG9wQ2FyKCkge1xyXG4gICAgICAgICAgICB3eC5zd2l0Y2hUYWIoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3BhZ2VzL2NhcidcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjYWxsKCkge1xyXG4gICAgICAgICAgICB3eC5tYWtlUGhvbmVDYWxsKHtcclxuICAgICAgICAgICAgICAgIHBob25lTnVtYmVyOiAnNDAwODIxMDE3OCcgLy8g5LuF5Li656S65L6L77yM5bm26Z2e55yf5a6e55qE55S16K+d5Y+356CBXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYmFuaygpIHtcclxuICAgICAgICAgICAgdGhpcy5pc0Jvb2sgPSBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFkZEJ0bigpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJycpO1xyXG4gICAgICAgICAgICB0aGlzLmlzQm9vayA9IHRydWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBwcm9kdWMoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZWVlZWVlJywgZSk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgc2VsZi5jaGlsZElkID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuY2hpbGQ7XHJcbiAgICAgICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgnc2hvcC9wcm9kdWN0Lmpzb24nLCB7XHJcbiAgICAgICAgICAgICAgICBzaG9wSWQ6IHNlbGYuc2hvcElkLFxyXG4gICAgICAgICAgICAgICAgcHJvZHVjdElkOiBzZWxmLklkLFxyXG4gICAgICAgICAgICAgICAgY2hpbGRJZDogc2VsZi5jaGlsZElkXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2RhdGEnLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNoaWxkcyA9IGRhdGEucHJvZHVjdC5jaGlsZHM7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wcm9kdWN0RGV0YWlsID0gZGF0YS5wcm9kdWN0O1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHN1YigpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubnVtYmVyID09ICcxJykge1xyXG4gICAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+aVsOmHj+acgOS9juS4ujEnLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb246ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjAwMFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm51bWJlci0tO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhZGQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMubnVtYmVyKys7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBwcm9kdWN0QnRuKCkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmNoaWxkSWQgPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc2VsZi5jaGlsZElkJywgc2VsZi5wcm9kdWN0LmNoaWxkc1swXS5pZCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc2VsZi5jaGlsZElkJywgc2VsZi5jaGlsZElkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc2VsZi5zaG9wSWQnLCBzZWxmLnNob3BJZCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZWxmLnByb2R1Y3RJZCcsIHNlbGYuSWQpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc2VsZi5udW1iZXInLCBzZWxmLm51bWJlcik7XHJcbiAgICAgICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgnc2hvcC9zaG9wQ2FydC5qc29uJywge1xyXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAnYWRkJyxcclxuICAgICAgICAgICAgICAgIHNob3BJZDogc2VsZi5zaG9wSWQsXHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0SWQ6IHNlbGYuSWQsXHJcbiAgICAgICAgICAgICAgICBjaGlsZElkOiBzZWxmLmNoaWxkSWQsXHJcbiAgICAgICAgICAgICAgICBjb3VudDogc2VsZi5udW1iZXJcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnMjIgJywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgICAgICB3eC5zd2l0Y2hUYWIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvY2FyJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuaXNCb29rID0gZmFsc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBsb2dzKCkge1xyXG4gICAgICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9wYWdlcy91cGxvYWQnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2VhcmNoKCkge1xyXG4gICAgICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9wYWdlcy9zZWFyY2hfcmVzdWx0J1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjaGFuZ2UoKSB7XHJcbiAgICAgICAgdGhpcy5udW1iZXIgPSAxO1xyXG4gICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICB9XHJcbiAgICBvbkxvYWQoZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdlJywgZSk7XHJcbiAgICAgICAgdGhpcy5zaG9wSWQgPSBlLnNob3BJZDtcclxuICAgICAgICB0aGlzLklkID0gZS5JZDtcclxuICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgfVxyXG4gICAgd2hlbkFwcFJlYWR5U2hvdygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5udW1iZXIgPSAxO1xyXG4gICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgnc2hvcC9wcm9kdWN0Lmpzb24nLCB7XHJcbiAgICAgICAgICAgIHNob3BJZDogc2VsZi5zaG9wSWQsXHJcbiAgICAgICAgICAgIHByb2R1Y3RJZDogc2VsZi5JZFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCcyMiAnLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgIHNlbGYucHJvZHVjdCA9IGRhdGEucHJvZHVjdDtcclxuICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXNlbGYucHJvZHVjdC5jaGlsZHMpIHtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5mZXRjaERhdGFQcm9taXNlKCdzaG9wL3Byb2R1Y3QuanNvbicsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvcElkOiBzZWxmLnNob3BJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdElkOiBzZWxmLklkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZElkOiBzZWxmLnByb2R1Y3QuY2hpbGRzWzBdLmlkXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+WtkOWIhuexuyAnLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucHJvZHVjdERldGFpbCA9IGRhdGEucHJvZHVjdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY2hpbGRzID0gZGF0YS5wcm9kdWN0LmNoaWxkcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY2hpbGRJZCA9IHNlbGYucHJvZHVjdC5jaGlsZHNbMF0uaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG4iXX0=