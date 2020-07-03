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
        value: function initData() {// 初始化数据
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpZ24uanMiXSwibmFtZXMiOlsiSG9tZSIsIm1peGlucyIsIlBhZ2VNaXhpbiIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsImRhdGEiLCJpbnB1dFNob3dlZCIsIm1zZyIsInNob3dUb2FzdCIsImVycm9yIiwiZGlzSW5wdXRzIiwicmVhbElucHV0IiwiZm9ybURhdGEiLCJtZXRob2RzIiwic3VyZSIsImdldE51bSIsImUiLCJkZXRhaWwiLCJ2YWx1ZSIsImxlbmd0aCIsImkiLCJsZW4iLCJjaGFyQXQiLCJjb2RlIiwidGhhdCIsImZldGNoRGF0YVByb21pc2UiLCJ0aGVuIiwiY29uc29sZSIsImxvZyIsInRvYXN0Iiwic2V0VGltZW91dCIsInd4IiwibmF2aWdhdGVCYWNrIiwiZGVsdGEiLCJjYXRjaCIsInJlcyIsIiRyZWZzIiwicHdkIiwiZm9jdXMiLCJnZXRMb2NhdGlvbiIsInR5cGUiLCJzdWNjZXNzIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJmYWlsIiwiaW5kZXgiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFRTs7OztBQUNBOzs7Ozs7Ozs7OztBQUZBOzs7SUFHcUJBLEk7Ozs7Ozs7Ozs7Ozs7O3NMQUNuQkMsTSxHQUFTLENBQUNDLGNBQUQsQyxRQUNUQyxNLEdBQVM7QUFDTEMsb0NBQXdCLE1BRG5CO0FBRUxDLDBDQUE4QjtBQUZ6QixTLFFBSVRDLFUsR0FBYSxFLFFBQ2JDLEksR0FBTztBQUNIQyx5QkFBYSxJQURWO0FBRUhDLGlCQUFLLEVBRkY7QUFHSEMsdUJBQVcsS0FIUjtBQUlIQyxtQkFBTyxFQUpKO0FBS0hDLHVCQUFXLENBQ1AsRUFETyxFQUVQLEVBRk8sRUFHUCxFQUhPLEVBSVAsRUFKTyxDQUxSO0FBV0hDLHVCQUFXLEVBWFI7QUFZSEMsc0JBQVU7QUFaUCxTLFFBc0JQQyxPLEdBQVU7QUFDTkMsZ0JBRE0s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O2tCQUFsQmpELEkiLCJmaWxlIjoic2lnbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4gIC8qIGdsb2JhbCB3eCAqL1xyXG4gIGltcG9ydCB3ZXB5IGZyb20gJ3dlcHknO1xyXG4gIGltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vbWl4aW5zL3BhZ2UnO1xyXG4gIGV4cG9ydCBkZWZhdWx0IGNsYXNzIEhvbWUgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gICAgbWl4aW5zID0gW1BhZ2VNaXhpbl07XHJcbiAgICBjb25maWcgPSB7XHJcbiAgICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+S8muiuruetvuWIsCcsXHJcbiAgICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNmZmYnXHJcbiAgICB9O1xyXG4gICAgY29tcG9uZW50cyA9IHt9O1xyXG4gICAgZGF0YSA9IHtcclxuICAgICAgICBpbnB1dFNob3dlZDogdHJ1ZSxcclxuICAgICAgICBtc2c6ICcnLFxyXG4gICAgICAgIHNob3dUb2FzdDogZmFsc2UsXHJcbiAgICAgICAgZXJyb3I6ICcnLFxyXG4gICAgICAgIGRpc0lucHV0czogW1xyXG4gICAgICAgICAgICAnJyxcclxuICAgICAgICAgICAgJycsXHJcbiAgICAgICAgICAgICcnLFxyXG4gICAgICAgICAgICAnJyxcclxuICAgICAgICBdLFxyXG4gICAgICAgIHJlYWxJbnB1dDogJycsXHJcbiAgICAgICAgZm9ybURhdGE6IHt9XHJcbiAgICB9XHJcbiAgICB0b2FzdCAoZXJyb3IpIHtcclxuICAgICAgICB0aGlzLnNob3dUb2FzdCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5lcnJvciA9IGVycm9yO1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhhdC5zaG93VG9hc3QgPSBmYWxzZTtcclxuICAgICAgICB9LCAyMDAwKTtcclxuICAgIH1cclxuICAgIG1ldGhvZHMgPSB7XHJcbiAgICAgICAgc3VyZSAoKSB7XHJcblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0TnVtKGUpIHtcclxuICAgICAgICAgICAgdGhpcy5yZWFsSW5wdXQgPSBlLmRldGFpbC52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKGUuZGV0YWlsLnZhbHVlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNJbnB1dHMgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgJycsXHJcbiAgICAgICAgICAgICAgICAgICAgJycsXHJcbiAgICAgICAgICAgICAgICAgICAgJycsXHJcbiAgICAgICAgICAgICAgICAgICAgJycsXHJcbiAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZS5kZXRhaWwudmFsdWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICgodGhpcy5kaXNJbnB1dHMubGVuZ3RoID4gZS5kZXRhaWwudmFsdWUubGVuZ3RoKSB8fCBlLmRldGFpbC52YWx1ZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbGVuID0gdGhpcy5kaXNJbnB1dHMubGVuZ3RoIC0gZS5kZXRhaWwudmFsdWUubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzSW5wdXRzWzQgLSBsZW5dID0gJyc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA8IDQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc0lucHV0c1tpXSA9IGUuZGV0YWlsLnZhbHVlLmNoYXJBdChpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZS5kZXRhaWwudmFsdWUubGVuZ3RoID49IDQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybURhdGEuY29kZSA9IGUuZGV0YWlsLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKCdtZWV0aW5nL3dlY2hhdC9zaWduSW5BcGkuanNvbicsIHRoaXMuZm9ybURhdGEsIHt9KVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJzExMScsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnRvYXN0KCfnrb7liLDmiJDlip8nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHd4Lm5hdmlnYXRlQmFjayh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsdGE6IDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcywgJzExMTExJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgaW5pdERhdGEoKSB7IC8vIOWIneWni+WMluaVsOaNrlxyXG4gICAgfVxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICB0aGlzLiRyZWZzLnB3ZC5mb2N1cygpO1xyXG4gICAgfVxyXG4gICAgb25Mb2FkICgpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgd3guZ2V0TG9jYXRpb24oe1xyXG4gICAgICAgICAgICB0eXBlOiAnZ2NqMDInLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmZvcm1EYXRhLmxhdGl0dWRlID0gcmVzLmxhdGl0dWRlO1xyXG4gICAgICAgICAgICAgICAgdGhhdC5mb3JtRGF0YS5sb25naXR1ZGUgPSByZXMubG9uZ2l0dWRlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICB0YWJGdW5TZWNhaChpbmRleCkge1xyXG4gICAgfVxyXG59XHJcbiJdfQ==