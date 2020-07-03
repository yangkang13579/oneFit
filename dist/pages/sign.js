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


var Home = function (_wepy$page) {
  _inherits(Home, _wepy$page);

  function Home() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Home);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Home.__proto__ || Object.getPrototypeOf(Home)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
      navigationBarTitleText: '会议签到',
      navigationBarBackgroundColor: '#fff'
    }, _this.components = {}, _this.data = {
      inputShowed: true,
      msg: '',
      showToast: false,
      error: '',
      disInputs: ['', '', '', ''],
      realInput: '',
      formData: {}
    }, _this.methods = {
      sure: function sure() {},
      getNum: function getNum(e) {
        this.realInput = e.detail.value;
        if (e.detail.value.length === 0) {
          this.disInputs = ['', '', '', ''];
          return;
        }
        for (var i = 0; i < e.detail.value.length; i++) {
          if (this.disInputs.length > e.detail.value.length || e.detail.value.length === 0) {
            var len = this.disInputs.length - e.detail.value.length;
            this.disInputs[4 - len] = '';
          }
          if (i < 4) {
            this.disInputs[i] = e.detail.value.charAt(i);
          }
        }
        if (e.detail.value.length >= 4) {
          this.formData.code = e.detail.value;
          var that = this;
          this.fetchDataPromise('meeting/wechat/signInApi.json', this.formData, {}).then(function (data) {
            console.log('111', data);
            that.toast('签到成功');
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              });
            }, 1000);
          }).catch(function (res) {
            console.log(res, '11111');
          });
        }
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Home, [{
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
    key: 'initData',
    value: function initData() {//初始化数据
    }
  }, {
    key: 'init',
    value: function init() {
      this.$refs.pwd.focus();
    }
  }, {
    key: 'onLoad',
    value: function onLoad() {
      var that = this;
      wx.getLocation({
        type: 'gcj02',
        success: function success(res) {
          that.formData.latitude = res.latitude;
          that.formData.longitude = res.longitude;
        },
        fail: function fail(res) {
          console.log(res);
        }
      });
    }
  }, {
    key: 'tabFunSecah',
    value: function tabFunSecah(index) {}
  }]);

  return Home;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(Home , 'pages/sign'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpZ24uanMiXSwibmFtZXMiOlsiSG9tZSIsIm1peGlucyIsIlBhZ2VNaXhpbiIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsImRhdGEiLCJpbnB1dFNob3dlZCIsIm1zZyIsInNob3dUb2FzdCIsImVycm9yIiwiZGlzSW5wdXRzIiwicmVhbElucHV0IiwiZm9ybURhdGEiLCJtZXRob2RzIiwic3VyZSIsImdldE51bSIsImUiLCJkZXRhaWwiLCJ2YWx1ZSIsImxlbmd0aCIsImkiLCJsZW4iLCJjaGFyQXQiLCJjb2RlIiwidGhhdCIsImZldGNoRGF0YVByb21pc2UiLCJ0aGVuIiwiY29uc29sZSIsImxvZyIsInRvYXN0Iiwic2V0VGltZW91dCIsInd4IiwibmF2aWdhdGVCYWNrIiwiZGVsdGEiLCJjYXRjaCIsInJlcyIsIiRyZWZzIiwicHdkIiwiZm9jdXMiLCJnZXRMb2NhdGlvbiIsInR5cGUiLCJzdWNjZXNzIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJmYWlsIiwiaW5kZXgiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFRTs7OztBQUNBOzs7Ozs7Ozs7OztBQUZBOzs7SUFHcUJBLEk7Ozs7Ozs7Ozs7Ozs7O2tMQUNuQkMsTSxHQUFTLENBQUNDLGNBQUQsQyxRQUNUQyxNLEdBQVM7QUFDUEMsOEJBQXdCLE1BRGpCO0FBRVBDLG9DQUE4QjtBQUZ2QixLLFFBSVRDLFUsR0FBYSxFLFFBQ2JDLEksR0FBTztBQUNMQyxtQkFBYSxJQURSO0FBRUxDLFdBQUssRUFGQTtBQUdMQyxpQkFBVyxLQUhOO0FBSUxDLGFBQU8sRUFKRjtBQUtMQyxpQkFBVyxDQUNULEVBRFMsRUFFVCxFQUZTLEVBR1QsRUFIUyxFQUlULEVBSlMsQ0FMTjtBQVdMQyxpQkFBVyxFQVhOO0FBWUxDLGdCQUFVO0FBWkwsSyxRQXNCUEMsTyxHQUFVO0FBQ1JDLFVBRFEsa0JB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LCJzb3VyY2VzQ29udGVudCI6WyJcclxuICAvKiBnbG9iYWwgd3ggKi9cclxuICBpbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcclxuICBpbXBvcnQgUGFnZU1peGluIGZyb20gJy4uL21peGlucy9wYWdlJztcclxuICBleHBvcnQgZGVmYXVsdCBjbGFzcyBIb21lIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICAgIG1peGlucyA9IFtQYWdlTWl4aW5dO1xyXG4gICAgY29uZmlnID0ge1xyXG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn5Lya6K6u562+5YiwJyxcclxuICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNmZmYnXHJcbiAgICB9O1xyXG4gICAgY29tcG9uZW50cyA9IHt9O1xyXG4gICAgZGF0YSA9IHtcclxuICAgICAgaW5wdXRTaG93ZWQ6IHRydWUsXHJcbiAgICAgIG1zZzogJycsXHJcbiAgICAgIHNob3dUb2FzdDogZmFsc2UsXHJcbiAgICAgIGVycm9yOiAnJyxcclxuICAgICAgZGlzSW5wdXRzOiBbXHJcbiAgICAgICAgJycsXHJcbiAgICAgICAgJycsXHJcbiAgICAgICAgJycsXHJcbiAgICAgICAgJycsXHJcbiAgICAgIF0sXHJcbiAgICAgIHJlYWxJbnB1dDogJycsXHJcbiAgICAgIGZvcm1EYXRhOiB7fVxyXG4gICAgfVxyXG4gICAgdG9hc3QgKGVycm9yKSB7XHJcbiAgICAgIHRoaXMuc2hvd1RvYXN0ID0gdHJ1ZVxyXG4gICAgICB0aGlzLmVycm9yID0gZXJyb3JcclxuICAgICAgdmFyIHRoYXQgPSB0aGlzXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRoYXQuc2hvd1RvYXN0ID0gZmFsc2VcclxuICAgICAgfSwgMjAwMCk7XHJcbiAgICB9XHJcbiAgICBtZXRob2RzID0ge1xyXG4gICAgICBzdXJlICgpIHtcclxuXHJcbiAgICAgIH0sXHJcbiAgICAgIGdldE51bShlKSB7XHJcbiAgICAgICAgdGhpcy5yZWFsSW5wdXQgPSBlLmRldGFpbC52YWx1ZVxyXG4gICAgICAgIGlmIChlLmRldGFpbC52YWx1ZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgIHRoaXMuZGlzSW5wdXRzID0gW1xyXG4gICAgICAgICAgICAnJyxcclxuICAgICAgICAgICAgJycsXHJcbiAgICAgICAgICAgICcnLFxyXG4gICAgICAgICAgICAnJyxcclxuICAgICAgICAgIF1cclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGUuZGV0YWlsLnZhbHVlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAoKHRoaXMuZGlzSW5wdXRzLmxlbmd0aCA+IGUuZGV0YWlsLnZhbHVlLmxlbmd0aCkgfHwgZS5kZXRhaWwudmFsdWUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGxldCBsZW4gPSB0aGlzLmRpc0lucHV0cy5sZW5ndGggLSBlLmRldGFpbC52YWx1ZS5sZW5ndGhcclxuICAgICAgICAgICAgdGhpcy5kaXNJbnB1dHNbNCAtIGxlbl0gPSAnJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGkgPCA0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzSW5wdXRzW2ldID0gZS5kZXRhaWwudmFsdWUuY2hhckF0KGkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZS5kZXRhaWwudmFsdWUubGVuZ3RoID49IDQpIHtcclxuICAgICAgICAgIHRoaXMuZm9ybURhdGEuY29kZSA9IGUuZGV0YWlsLnZhbHVlXHJcbiAgICAgICAgICB2YXIgdGhhdCA9IHRoaXNcclxuICAgICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgnbWVldGluZy93ZWNoYXQvc2lnbkluQXBpLmpzb24nLCB0aGlzLmZvcm1EYXRhLCB7fSlcclxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJzExMScsIGRhdGEpXHJcbiAgICAgICAgICAgIHRoYXQudG9hc3QoJ+etvuWIsOaIkOWKnycpXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgd3gubmF2aWdhdGVCYWNrKHtcclxuICAgICAgICAgICAgICAgIGRlbHRhOiAxXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sIDEwMDApXHJcbiAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcywgJzExMTExJylcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICBpbml0RGF0YSgpIHsgLy/liJ3lp4vljJbmlbDmja5cclxuICAgfVxyXG4gICBpbml0KCkge1xyXG4gICAgIHRoaXMuJHJlZnMucHdkLmZvY3VzKCk7XHJcbiAgIH1cclxuICAgb25Mb2FkICgpIHtcclxuICAgICB2YXIgdGhhdCA9IHRoaXNcclxuICAgICB3eC5nZXRMb2NhdGlvbih7XHJcbiAgICAgICAgdHlwZTogJ2djajAyJyxcclxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICB0aGF0LmZvcm1EYXRhLmxhdGl0dWRlID0gcmVzLmxhdGl0dWRlXHJcbiAgICAgICAgICB0aGF0LmZvcm1EYXRhLmxvbmdpdHVkZSA9IHJlcy5sb25naXR1ZGVcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZhaWw6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICB9XHJcbiAgIHRhYkZ1blNlY2FoKGluZGV4KSB7XHJcbiAgIH1cclxuIH1cclxuIl19