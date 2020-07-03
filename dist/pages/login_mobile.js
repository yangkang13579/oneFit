'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/* global wx */


var User = function (_wepy$page) {
    _inherits(User, _wepy$page);

    function User() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, User);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = User.__proto__ || Object.getPrototypeOf(User)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
            navigationBarTitleText: '绑定手机',
            window: {}
        }, _this.components = {}, _this.data = {}, _this.computed = {}, _this.watch = {}, _this.methods = {
            getPhoneNumber: function getPhoneNumber(e) {
                // console.log(e.detail.errMsg);
                if (e.detail.iv && e.detail.encryptedData) {
                    //   console.log(e.detail.iv);
                    //   console.log(e.detail.encryptedData);
                    var app = this.$parent;
                    app.bindMobile(e.detail.iv, e.detail.encryptedData).then(function (data) {
                        wx.showToast({
                            title: '绑定成功',
                            icon: 'success',
                            duration: 2000
                        });
                        setTimeout(function () {
                            wx.navigateBack();
                        }, 500);
                    }).catch(function (reason) {
                        console.log('绑定失败:', reason);
                        wx.showToast({
                            title: '绑定失败,请重试！',
                            icon: 'success',
                            duration: 2000
                        });
                    });
                }
            },
            cancel: function cancel() {
                wx.navigateBack();
            }
        }, _this.events = {}, _temp), _possibleConstructorReturn(_this, _ret);
    }
    // 页面配置

    // 声明页面中将要使用到的组件

    // 可用于页面模板绑定的数据

    // 事件处理函数(集中保存在methods对象中)


    _createClass(User, [{
        key: 'onLoad',

        // 页面的生命周期函数
        value: function onLoad() {
            // console.log(this.$parent.globalData.passportSession.id);
        }
    }]);

    return User;
}(_wepy2.default.page);

exports.default = User;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2luX21vYmlsZS5qcyJdLCJuYW1lcyI6WyJVc2VyIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIndpbmRvdyIsImNvbXBvbmVudHMiLCJkYXRhIiwiY29tcHV0ZWQiLCJ3YXRjaCIsIm1ldGhvZHMiLCJnZXRQaG9uZU51bWJlciIsImUiLCJkZXRhaWwiLCJpdiIsImVuY3J5cHRlZERhdGEiLCJhcHAiLCIkcGFyZW50IiwiYmluZE1vYmlsZSIsInRoZW4iLCJ3eCIsInNob3dUb2FzdCIsInRpdGxlIiwiaWNvbiIsImR1cmF0aW9uIiwic2V0VGltZW91dCIsIm5hdmlnYXRlQmFjayIsImNhdGNoIiwicmVhc29uIiwiY29uc29sZSIsImxvZyIsImNhbmNlbCIsImV2ZW50cyIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7Ozs7Ozs7OztBQURBOzs7SUFFcUJBLEk7Ozs7Ozs7Ozs7Ozs7O3NMQUVuQkMsTSxHQUFTO0FBQ0xDLG9DQUF3QixNQURuQjtBQUVMQyxvQkFBUTtBQUZILFMsUUFLVEMsVSxHQUFhLEUsUUFFYkMsSSxHQUFPLEUsUUFDUEMsUSxHQUFXLEUsUUFDWEMsSyxHQUFRLEUsUUFFUkMsTyxHQUFVO0FBQ05DLDBCQURNLDBCQUNTQyxDQURULEVBQ1k7QUFDbEI7QUFDSSxvQkFBSUEsRUFBRUMsTUFBRixDQUFTQyxFQUFULElBQWVGLEVBQUVDLE1BQUYsQ0FBU0UsYUFBNUIsRUFBMkM7QUFDdkM7QUFDQTtBQUNBLHdCQUFJQyxNQUFNLEtBQUtDLE9BQWY7QUFDQUQsd0JBQ0tFLFVBREwsQ0FDZ0JOLEVBQUVDLE1BQUYsQ0FBU0MsRUFEekIsRUFDNkJGLEVBQUVDLE1BQUYsQ0FBU0UsYUFEdEMsRUFFS0ksSUFGTCxDQUVVLFVBQVNaLElBQVQsRUFBZTtBQUNqQmEsMkJBQUdDLFNBQUgsQ0FBYTtBQUNUQyxtQ0FBTyxNQURFO0FBRVRDLGtDQUFNLFNBRkc7QUFHVEMsc0NBQVU7QUFIRCx5QkFBYjtBQUtBQyxtQ0FBVyxZQUFXO0FBQ2xCTCwrQkFBR00sWUFBSDtBQUNILHlCQUZELEVBRUcsR0FGSDtBQUdILHFCQVhMLEVBWUtDLEtBWkwsQ0FZVyxVQUFTQyxNQUFULEVBQWlCO0FBQ3BCQyxnQ0FBUUMsR0FBUixDQUFZLE9BQVosRUFBcUJGLE1BQXJCO0FBQ0FSLDJCQUFHQyxTQUFILENBQWE7QUFDVEMsbUNBQU8sV0FERTtBQUVUQyxrQ0FBTSxTQUZHO0FBR1RDLHNDQUFVO0FBSEQseUJBQWI7QUFLSCxxQkFuQkw7QUFvQkg7QUFDSixhQTVCSztBQTZCTk8sa0JBN0JNLG9CQTZCRztBQUNMWCxtQkFBR00sWUFBSDtBQUNIO0FBL0JLLFMsUUFxQ1ZNLE0sR0FBUyxFOztBQWpEVDs7QUFLQTs7QUFFQTs7QUFJQTs7Ozs7O0FBa0NBO2lDQUNTO0FBQ0w7QUFDSDs7OztFQWpEK0JDLGVBQUtDLEk7O2tCQUFsQmhDLEkiLCJmaWxlIjoibG9naW5fbW9iaWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8qIGdsb2JhbCB3eCAqL1xyXG5pbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXNlciBleHRlbmRzIHdlcHkucGFnZSB7XHJcbiAgLy8g6aG16Z2i6YWN572uXHJcbiAgY29uZmlnID0ge1xyXG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn57uR5a6a5omL5py6JyxcclxuICAgICAgd2luZG93OiB7fVxyXG4gIH07XHJcbiAgLy8g5aOw5piO6aG16Z2i5Lit5bCG6KaB5L2/55So5Yiw55qE57uE5Lu2XHJcbiAgY29tcG9uZW50cyA9IHt9O1xyXG4gIC8vIOWPr+eUqOS6jumhtemdouaooeadv+e7keWumueahOaVsOaNrlxyXG4gIGRhdGEgPSB7fTtcclxuICBjb21wdXRlZCA9IHt9O1xyXG4gIHdhdGNoID0ge307XHJcbiAgLy8g5LqL5Lu25aSE55CG5Ye95pWwKOmbhuS4reS/neWtmOWcqG1ldGhvZHPlr7nosaHkuK0pXHJcbiAgbWV0aG9kcyA9IHtcclxuICAgICAgZ2V0UGhvbmVOdW1iZXIoZSkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhlLmRldGFpbC5lcnJNc2cpO1xyXG4gICAgICAgICAgaWYgKGUuZGV0YWlsLml2ICYmIGUuZGV0YWlsLmVuY3J5cHRlZERhdGEpIHtcclxuICAgICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKGUuZGV0YWlsLml2KTtcclxuICAgICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKGUuZGV0YWlsLmVuY3J5cHRlZERhdGEpO1xyXG4gICAgICAgICAgICAgIHZhciBhcHAgPSB0aGlzLiRwYXJlbnQ7XHJcbiAgICAgICAgICAgICAgYXBwXHJcbiAgICAgICAgICAgICAgICAgIC5iaW5kTW9iaWxlKGUuZGV0YWlsLml2LCBlLmRldGFpbC5lbmNyeXB0ZWREYXRhKVxyXG4gICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn57uR5a6a5oiQ5YqfJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnc3VjY2VzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDIwMDBcclxuICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB3eC5uYXZpZ2F0ZUJhY2soKTtcclxuICAgICAgICAgICAgICAgICAgICAgIH0sIDUwMCk7XHJcbiAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihyZWFzb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfnu5HlrprlpLHotKU6JywgcmVhc29uKTtcclxuICAgICAgICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfnu5HlrprlpLHotKUs6K+36YeN6K+V77yBJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnc3VjY2VzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDIwMDBcclxuICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgY2FuY2VsKCkge1xyXG4gICAgICAgICAgd3gubmF2aWdhdGVCYWNrKCk7XHJcbiAgICAgIH1cclxuICB9O1xyXG4gIC8vIOmhtemdoueahOeUn+WRveWRqOacn+WHveaVsFxyXG4gIG9uTG9hZCgpIHtcclxuICAgICAgLy8gY29uc29sZS5sb2codGhpcy4kcGFyZW50Lmdsb2JhbERhdGEucGFzc3BvcnRTZXNzaW9uLmlkKTtcclxuICB9XHJcbiAgZXZlbnRzID0ge307XHJcbn1cclxuIl19