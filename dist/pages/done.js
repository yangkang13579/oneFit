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

var AddressBook = function (_wepy$page) {
  _inherits(AddressBook, _wepy$page);

  function AddressBook() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AddressBook);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AddressBook.__proto__ || Object.getPrototypeOf(AddressBook)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
      navigationBarTitleText: '田间实验',
      navigationBarBackgroundColor: '#fff'
    }, _this.components = {}, _this.data = {
      list: [],
      delItem: null,
      showToast: false,
      error: '',
      user: _this.user,
      pageSize: 10,
      totalPage: 0,
      indexPage: 0
    }, _this.methods = {
      createFun: function createFun() {
        wx.navigateTo({
          url: '/pages/createTest'
        });
      },
      go: function go(e) {
        wx.navigateTo({
          url: '/pages/textDetails?id=' + e.currentTarget.dataset.id
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AddressBook, [{
    key: 'onReachBottom',
    value: function onReachBottom() {
      if (this.indexPage >= this.totalPage) {
        this.toast('无更多数据');
        return;
      }
      this.indexPage++;
      // 下拉触底，先判断是否有请求正在进行中
      // 以及检查当前请求页数是不是小于数据总页数，如符合条件，则发送请求
      this.getList();
    }
    // 获取列表

  }, {
    key: 'getList',
    value: function getList() {
      var self = this;
      this.fetchDataPromise('wx/experiment/queryExperimentApi.json', {
        pageSize: this.pageSize,
        indexPage: this.indexPage
      }, {}).then(function (data) {
        data.list = data.list.map(function (item) {
          var obj = item;
          obj.createDates = obj.createDate.split('T')[0].split('-');
          console.log(obj.createDates);
          obj.createDate = obj.createDates[0] + '年' + obj.createDates[1] + '月' + obj.createDates[2] + '月';
          return obj;
        });
        self.totalPage = data.queryParam.totalPage;
        self.list = self.list.concat(data.list);
        self.$apply();
      });
    }
  }, {
    key: 'toast',
    value: function toast(error) {
      this.showToast = true;
      this.error = error;
      var that = this;
      setTimeout(function () {
        that.showToast = false;
      }, 2000);
    }
  }, {
    key: 'onLoad',
    value: function onLoad() {}
  }, {
    key: 'whenAppReadyShow',
    value: function whenAppReadyShow() {
      this.list = [];
      this.getList();
    }
  }]);

  return AddressBook;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(AddressBook , 'pages/done'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvbmUuanMiXSwibmFtZXMiOlsiQWRkcmVzc0Jvb2siLCJtaXhpbnMiLCJQYWdlTWl4aW4iLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsImNvbXBvbmVudHMiLCJkYXRhIiwibGlzdCIsImRlbEl0ZW0iLCJzaG93VG9hc3QiLCJlcnJvciIsInVzZXIiLCJwYWdlU2l6ZSIsInRvdGFsUGFnZSIsImluZGV4UGFnZSIsIm1ldGhvZHMiLCJjcmVhdGVGdW4iLCJ3eCIsIm5hdmlnYXRlVG8iLCJ1cmwiLCJnbyIsImUiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YXNldCIsImlkIiwidG9hc3QiLCJnZXRMaXN0Iiwic2VsZiIsImZldGNoRGF0YVByb21pc2UiLCJ0aGVuIiwibWFwIiwib2JqIiwiaXRlbSIsImNyZWF0ZURhdGVzIiwiY3JlYXRlRGF0ZSIsInNwbGl0IiwiY29uc29sZSIsImxvZyIsInF1ZXJ5UGFyYW0iLCJjb25jYXQiLCIkYXBwbHkiLCJ0aGF0Iiwic2V0VGltZW91dCIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNFOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUNxQkEsVzs7Ozs7Ozs7Ozs7Ozs7Z01BQ25CQyxNLEdBQVMsQ0FBQ0MsY0FBRCxDLFFBQ1RDLE0sR0FBUztBQUNQQyw4QkFBd0IsTUFEakI7QUFFUEMsb0NBQThCO0FBRnZCLEssUUFJVEMsVSxHQUFhLEUsUUFFYkMsSSxHQUFPO0FBQ0xDLFlBQU0sRUFERDtBQUVMQyxlQUFTLElBRko7QUFHTEMsaUJBQVcsS0FITjtBQUlMQyxhQUFPLEVBSkY7QUFLTEMsWUFBTSxNQUFLQSxJQUxOO0FBTUxDLGdCQUFVLEVBTkw7QUFPTEMsaUJBQVcsQ0FQTjtBQVFMQyxpQkFBVztBQVJOLEssUUFnRFBDLE8sR0FBVTtBQUNSQyxlQURRLHVCQUNJO0FBQ1ZDLFdBQUdDLFVBQUgsQ0FBYztBQUNaQyxlQUFLO0FBRE8sU0FBZDtBQUdELE9BTE87QUFNUkMsUUFOUSxjQU1MQyxDQU5LLEVBTUY7QUFDSkosV0FBR0MsVUFBSCxDQUFjO0FBQ1pDLGVBQUssMkJBQTJCRSxFQUFFQyxhQUFGLENBQWdCQyxPQUFoQixDQUF3QkM7QUFENUMsU0FBZDtBQUdEO0FBVk8sSzs7Ozs7b0NBdENNO0FBQ2QsVUFBSSxLQUFLVixTQUFMLElBQWtCLEtBQUtELFNBQTNCLEVBQXNDO0FBQ3BDLGFBQUtZLEtBQUwsQ0FBVyxPQUFYO0FBQ0E7QUFDRDtBQUNELFdBQUtYLFNBQUw7QUFDQTtBQUNBO0FBQ0EsV0FBS1ksT0FBTDtBQUNEO0FBQ0Q7Ozs7OEJBQ1c7QUFDVCxVQUFNQyxPQUFPLElBQWI7QUFDQSxXQUFLQyxnQkFBTCxDQUFzQix1Q0FBdEIsRUFBK0Q7QUFDN0RoQixrQkFBVSxLQUFLQSxRQUQ4QztBQUU3REUsbUJBQVcsS0FBS0E7QUFGNkMsT0FBL0QsRUFHRyxFQUhILEVBSUNlLElBSkQsQ0FJTSxVQUFTdkIsSUFBVCxFQUFlO0FBQ25CQSxhQUFLQyxJQUFMLEdBQVlELEtBQUtDLElBQUwsQ0FBVXVCLEdBQVYsQ0FBYyxnQkFBUTtBQUNoQyxjQUFJQyxNQUFNQyxJQUFWO0FBQ0FELGNBQUlFLFdBQUosR0FBa0JGLElBQUlHLFVBQUosQ0FBZUMsS0FBZixDQUFxQixHQUFyQixFQUEwQixDQUExQixFQUE2QkEsS0FBN0IsQ0FBbUMsR0FBbkMsQ0FBbEI7QUFDQUMsa0JBQVFDLEdBQVIsQ0FBWU4sSUFBSUUsV0FBaEI7QUFDQUYsY0FBSUcsVUFBSixHQUFpQkgsSUFBSUUsV0FBSixDQUFnQixDQUFoQixJQUFxQixHQUFyQixHQUEyQkYsSUFBSUUsV0FBSixDQUFnQixDQUFoQixDQUEzQixHQUFnRCxHQUFoRCxHQUFzREYsSUFBSUUsV0FBSixDQUFnQixDQUFoQixDQUF0RCxHQUEyRSxHQUE1RjtBQUNBLGlCQUFPRixHQUFQO0FBQ0QsU0FOVyxDQUFaO0FBT0FKLGFBQUtkLFNBQUwsR0FBaUJQLEtBQUtnQyxVQUFMLENBQWdCekIsU0FBakM7QUFDQWMsYUFBS3BCLElBQUwsR0FBWW9CLEtBQUtwQixJQUFMLENBQVVnQyxNQUFWLENBQWlCakMsS0FBS0MsSUFBdEIsQ0FBWjtBQUNBb0IsYUFBS2EsTUFBTDtBQUNELE9BZkQ7QUFnQkQ7OzswQkFDTTlCLEssRUFBTztBQUNaLFdBQUtELFNBQUwsR0FBaUIsSUFBakI7QUFDQSxXQUFLQyxLQUFMLEdBQWFBLEtBQWI7QUFDQSxVQUFJK0IsT0FBTyxJQUFYO0FBQ0FDLGlCQUFXLFlBQU07QUFDZkQsYUFBS2hDLFNBQUwsR0FBaUIsS0FBakI7QUFDRCxPQUZELEVBRUcsSUFGSDtBQUdEOzs7NkJBYVMsQ0FDVDs7O3VDQUNrQjtBQUNqQixXQUFLRixJQUFMLEdBQVksRUFBWjtBQUNBLFdBQUttQixPQUFMO0FBQ0Q7Ozs7RUF6RXNDaUIsZUFBS0MsSTs7a0JBQXpCN0MsVyIsImZpbGUiOiJkb25lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbiAgaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XHJcbiAgaW1wb3J0IFBhZ2VNaXhpbiBmcm9tICcuLi9taXhpbnMvcGFnZSc7XHJcbiAgZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWRkcmVzc0Jvb2sgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gICAgbWl4aW5zID0gW1BhZ2VNaXhpbl07XHJcbiAgICBjb25maWcgPSB7XHJcbiAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfnlLDpl7Tlrp7pqownLFxyXG4gICAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiAnI2ZmZidcclxuICAgIH07XHJcbiAgICBjb21wb25lbnRzID0ge1xyXG4gICAgfTtcclxuICAgIGRhdGEgPSB7XHJcbiAgICAgIGxpc3Q6IFtdLFxyXG4gICAgICBkZWxJdGVtOiBudWxsLFxyXG4gICAgICBzaG93VG9hc3Q6IGZhbHNlLFxyXG4gICAgICBlcnJvcjogJycsXHJcbiAgICAgIHVzZXI6IHRoaXMudXNlcixcclxuICAgICAgcGFnZVNpemU6IDEwLFxyXG4gICAgICB0b3RhbFBhZ2U6IDAsXHJcbiAgICAgIGluZGV4UGFnZTogMFxyXG4gICAgfTtcclxuICAgIG9uUmVhY2hCb3R0b20oKSB7XHJcbiAgICAgIGlmICh0aGlzLmluZGV4UGFnZSA+PSB0aGlzLnRvdGFsUGFnZSkge1xyXG4gICAgICAgIHRoaXMudG9hc3QoJ+aXoOabtOWkmuaVsOaNricpXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5pbmRleFBhZ2UrK1xyXG4gICAgICAvLyDkuIvmi4nop6blupXvvIzlhYjliKTmlq3mmK/lkKbmnInor7fmsYLmraPlnKjov5vooYzkuK1cclxuICAgICAgLy8g5Lul5Y+K5qOA5p+l5b2T5YmN6K+35rGC6aG15pWw5piv5LiN5piv5bCP5LqO5pWw5o2u5oC76aG15pWw77yM5aaC56ym5ZCI5p2h5Lu277yM5YiZ5Y+R6YCB6K+35rGCXHJcbiAgICAgIHRoaXMuZ2V0TGlzdCgpXHJcbiAgICB9XHJcbiAgICAvLyDojrflj5bliJfooahcclxuICAgIGdldExpc3QgKCkge1xyXG4gICAgICBjb25zdCBzZWxmID0gdGhpc1xyXG4gICAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3d4L2V4cGVyaW1lbnQvcXVlcnlFeHBlcmltZW50QXBpLmpzb24nLCB7XHJcbiAgICAgICAgcGFnZVNpemU6IHRoaXMucGFnZVNpemUsXHJcbiAgICAgICAgaW5kZXhQYWdlOiB0aGlzLmluZGV4UGFnZVxyXG4gICAgICB9LCB7fSlcclxuICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIGRhdGEubGlzdCA9IGRhdGEubGlzdC5tYXAoaXRlbSA9PiB7XHJcbiAgICAgICAgICBsZXQgb2JqID0gaXRlbVxyXG4gICAgICAgICAgb2JqLmNyZWF0ZURhdGVzID0gb2JqLmNyZWF0ZURhdGUuc3BsaXQoJ1QnKVswXS5zcGxpdCgnLScpXHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhvYmouY3JlYXRlRGF0ZXMpXHJcbiAgICAgICAgICBvYmouY3JlYXRlRGF0ZSA9IG9iai5jcmVhdGVEYXRlc1swXSArICflubQnICsgb2JqLmNyZWF0ZURhdGVzWzFdICsgJ+aciCcgKyBvYmouY3JlYXRlRGF0ZXNbMl0gKyAn5pyIJ1xyXG4gICAgICAgICAgcmV0dXJuIG9ialxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgc2VsZi50b3RhbFBhZ2UgPSBkYXRhLnF1ZXJ5UGFyYW0udG90YWxQYWdlXHJcbiAgICAgICAgc2VsZi5saXN0ID0gc2VsZi5saXN0LmNvbmNhdChkYXRhLmxpc3QpXHJcbiAgICAgICAgc2VsZi4kYXBwbHkoKVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gICAgdG9hc3QgKGVycm9yKSB7XHJcbiAgICAgIHRoaXMuc2hvd1RvYXN0ID0gdHJ1ZVxyXG4gICAgICB0aGlzLmVycm9yID0gZXJyb3JcclxuICAgICAgdmFyIHRoYXQgPSB0aGlzXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRoYXQuc2hvd1RvYXN0ID0gZmFsc2VcclxuICAgICAgfSwgMjAwMCk7XHJcbiAgICB9XHJcbiAgICBtZXRob2RzID0ge1xyXG4gICAgICBjcmVhdGVGdW4oKSB7XHJcbiAgICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICB1cmw6ICcvcGFnZXMvY3JlYXRlVGVzdCdcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgZ28oZSkge1xyXG4gICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgICAgdXJsOiAnL3BhZ2VzL3RleHREZXRhaWxzP2lkPScgKyBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pZFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBvbkxvYWQgKCkge1xyXG4gICAgfVxyXG4gICAgd2hlbkFwcFJlYWR5U2hvdygpIHtcclxuICAgICAgdGhpcy5saXN0ID0gW11cclxuICAgICAgdGhpcy5nZXRMaXN0KClcclxuICAgIH1cclxuICB9XHJcbiJdfQ==