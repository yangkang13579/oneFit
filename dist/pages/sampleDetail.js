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


var SampleDetail = function (_wepy$page) {
    _inherits(SampleDetail, _wepy$page);

    function SampleDetail() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, SampleDetail);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SampleDetail.__proto__ || Object.getPrototypeOf(SampleDetail)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
            navigationBarTitleText: '样品详情',
            navigationBarBackgroundColor: '#fff'
        }, _this.data = {
            //  name: 'myHtmlParserKiner',
            screenWidth: 0,
            imgwidth: 0,
            imgheight: 0,
            id: '',
            list: [],
            background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
            indicatorDots: true,
            vertical: false,
            autoplay: false,
            interval: 2000,
            duration: 500
        }, _this.methods = {
            toFrom: function toFrom() {
                wx.navigateTo({
                    url: '/pages/form?id=' + this.id
                });
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(SampleDetail, [{
        key: 'onLoad',
        value: function onLoad(options) {
            this.id = options.id;
            var self = this;
            wx.getSystemInfo({
                success: function success(res) {
                    console.log('res', res);
                    var screenWidth = res.windowWidth;
                    self.screenWidth = screenWidth;
                    self.$apply();
                }
            });
        }
    }, {
        key: 'whenAppReadyShow',
        value: function whenAppReadyShow() {
            var _this2 = this;

            this.fetchDataPromise('wx/specimen/querySpecimenApi.json', {
                id: this.id
            }).then(function (data) {
                console.log('11 ', data);
                _this2.list = data.list[0];
                console.log('this.list', _this2.list);
                _this2.$apply();
            }).catch(function (error) {});
        }
    }]);

    return SampleDetail;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(SampleDetail , 'pages/sampleDetail'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNhbXBsZURldGFpbC5qcyJdLCJuYW1lcyI6WyJTYW1wbGVEZXRhaWwiLCJtaXhpbnMiLCJQYWdlTWl4aW4iLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsImRhdGEiLCJzY3JlZW5XaWR0aCIsImltZ3dpZHRoIiwiaW1naGVpZ2h0IiwiaWQiLCJsaXN0IiwiYmFja2dyb3VuZCIsImluZGljYXRvckRvdHMiLCJ2ZXJ0aWNhbCIsImF1dG9wbGF5IiwiaW50ZXJ2YWwiLCJkdXJhdGlvbiIsIm1ldGhvZHMiLCJ0b0Zyb20iLCJ3eCIsIm5hdmlnYXRlVG8iLCJ1cmwiLCJvcHRpb25zIiwic2VsZiIsImdldFN5c3RlbUluZm8iLCJzdWNjZXNzIiwicmVzIiwiY29uc29sZSIsImxvZyIsIndpbmRvd1dpZHRoIiwiJGFwcGx5IiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRoZW4iLCJjYXRjaCIsImVycm9yIiwid2VweSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7QUFGQTs7O0lBSXFCQSxZOzs7Ozs7Ozs7Ozs7OztzTUFDbkJDLE0sR0FBUyxDQUFDQyxjQUFELEMsUUFDVEMsTSxHQUFTO0FBQ0xDLG9DQUF3QixNQURuQjtBQUVMQywwQ0FBOEI7QUFGekIsUyxRQUtUQyxJLEdBQU87QUFDSDtBQUNBQyx5QkFBYSxDQUZWO0FBR0hDLHNCQUFVLENBSFA7QUFJSEMsdUJBQVcsQ0FKUjtBQUtIQyxnQkFBSSxFQUxEO0FBTUhDLGtCQUFNLEVBTkg7QUFPSEMsd0JBQVksQ0FBQyxhQUFELEVBQWdCLGFBQWhCLEVBQStCLGFBQS9CLENBUFQ7QUFRSEMsMkJBQWUsSUFSWjtBQVNIQyxzQkFBVSxLQVRQO0FBVUhDLHNCQUFVLEtBVlA7QUFXSEMsc0JBQVUsSUFYUDtBQVlIQyxzQkFBVTtBQVpQLFMsUUFjUEMsTyxHQUFVO0FBQ05DLGtCQURNLG9CQUNHO0FBQ0xDLG1CQUFHQyxVQUFILENBQWM7QUFDVkMseUJBQUssb0JBQW9CLEtBQUtaO0FBRHBCLGlCQUFkO0FBR0g7QUFMSyxTOzs7OzsrQkFRSGEsTyxFQUFTO0FBQ1osaUJBQUtiLEVBQUwsR0FBVWEsUUFBUWIsRUFBbEI7QUFDQSxnQkFBSWMsT0FBTyxJQUFYO0FBQ0FKLGVBQUdLLGFBQUgsQ0FBaUI7QUFDYkMseUJBQVMsaUJBQVNDLEdBQVQsRUFBYztBQUNuQkMsNEJBQVFDLEdBQVIsQ0FBWSxLQUFaLEVBQW1CRixHQUFuQjtBQUNBLHdCQUFJcEIsY0FBY29CLElBQUlHLFdBQXRCO0FBQ0FOLHlCQUFLakIsV0FBTCxHQUFtQkEsV0FBbkI7QUFDQWlCLHlCQUFLTyxNQUFMO0FBQ0g7QUFOWSxhQUFqQjtBQVFIOzs7MkNBRWtCO0FBQUE7O0FBQ2YsaUJBQUtDLGdCQUFMLENBQXNCLG1DQUF0QixFQUEyRDtBQUN2RHRCLG9CQUFJLEtBQUtBO0FBRDhDLGFBQTNELEVBR0t1QixJQUhMLENBR1UsZ0JBQVE7QUFDVkwsd0JBQVFDLEdBQVIsQ0FBWSxLQUFaLEVBQW1CdkIsSUFBbkI7QUFDQSx1QkFBS0ssSUFBTCxHQUFZTCxLQUFLSyxJQUFMLENBQVUsQ0FBVixDQUFaO0FBQ0FpQix3QkFBUUMsR0FBUixDQUFZLFdBQVosRUFBeUIsT0FBS2xCLElBQTlCO0FBQ0EsdUJBQUtvQixNQUFMO0FBQ0gsYUFSTCxFQVNLRyxLQVRMLENBU1csVUFBU0MsS0FBVCxFQUFnQixDQUFFLENBVDdCO0FBVUg7Ozs7RUFyRHVDQyxlQUFLQyxJOztrQkFBMUJyQyxZIiwiZmlsZSI6InNhbXBsZURldGFpbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKiBnbG9iYWwgd3ggKi9cclxuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XHJcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vbWl4aW5zL3BhZ2UnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2FtcGxlRGV0YWlsIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICBtaXhpbnMgPSBbUGFnZU1peGluXTtcclxuICBjb25maWcgPSB7XHJcbiAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfmoLflk4Hor6bmg4UnLFxyXG4gICAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiAnI2ZmZidcclxuICB9O1xyXG5cclxuICBkYXRhID0ge1xyXG4gICAgICAvLyAgbmFtZTogJ215SHRtbFBhcnNlcktpbmVyJyxcclxuICAgICAgc2NyZWVuV2lkdGg6IDAsXHJcbiAgICAgIGltZ3dpZHRoOiAwLFxyXG4gICAgICBpbWdoZWlnaHQ6IDAsXHJcbiAgICAgIGlkOiAnJyxcclxuICAgICAgbGlzdDogW10sXHJcbiAgICAgIGJhY2tncm91bmQ6IFsnZGVtby10ZXh0LTEnLCAnZGVtby10ZXh0LTInLCAnZGVtby10ZXh0LTMnXSxcclxuICAgICAgaW5kaWNhdG9yRG90czogdHJ1ZSxcclxuICAgICAgdmVydGljYWw6IGZhbHNlLFxyXG4gICAgICBhdXRvcGxheTogZmFsc2UsXHJcbiAgICAgIGludGVydmFsOiAyMDAwLFxyXG4gICAgICBkdXJhdGlvbjogNTAwXHJcbiAgfTtcclxuICBtZXRob2RzID0ge1xyXG4gICAgICB0b0Zyb20oKSB7XHJcbiAgICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvZm9ybT9pZD0nICsgdGhpcy5pZFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICB9O1xyXG5cclxuICBvbkxvYWQob3B0aW9ucykge1xyXG4gICAgICB0aGlzLmlkID0gb3B0aW9ucy5pZDtcclxuICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgICB3eC5nZXRTeXN0ZW1JbmZvKHtcclxuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZXMnLCByZXMpO1xyXG4gICAgICAgICAgICAgIGxldCBzY3JlZW5XaWR0aCA9IHJlcy53aW5kb3dXaWR0aDtcclxuICAgICAgICAgICAgICBzZWxmLnNjcmVlbldpZHRoID0gc2NyZWVuV2lkdGg7XHJcbiAgICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICB3aGVuQXBwUmVhZHlTaG93KCkge1xyXG4gICAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3d4L3NwZWNpbWVuL3F1ZXJ5U3BlY2ltZW5BcGkuanNvbicsIHtcclxuICAgICAgICAgIGlkOiB0aGlzLmlkXHJcbiAgICAgIH0pXHJcbiAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnMTEgJywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgdGhpcy5saXN0ID0gZGF0YS5saXN0WzBdO1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGlzLmxpc3QnLCB0aGlzLmxpc3QpO1xyXG4gICAgICAgICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7fSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==