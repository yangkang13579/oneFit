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


var GitSample = function (_wepy$page) {
    _inherits(GitSample, _wepy$page);

    function GitSample() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, GitSample);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = GitSample.__proto__ || Object.getPrototypeOf(GitSample)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
            navigationBarTitleText: '样品申领',
            navigationBarBackgroundColor: '#fff'
        }, _this.components = {}, _this.data = {
            list: [],
            userInfo: []
        }, _this.methods = {
            toFrom: function toFrom(e) {
                console.log('e', e);
                var id = e.currentTarget.dataset.id;
                wx.navigateTo({
                    url: '/pages/form?id=' + id
                });
            },

            // 我的样品申领
            mySamples: function mySamples() {
                wx.navigateTo({
                    url: '/pages/meMaple'
                });
            },
            goDetails: function goDetails(e) {
                console.log('e11', e);
                var id = e.currentTarget.dataset.id;
                console.log(id);
                wx.navigateTo({
                    url: '/pages/sampleDetail?id=' + id
                });
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(GitSample, [{
        key: 'onLoad',
        value: function onLoad() {}
    }, {
        key: 'init',
        value: function init() {
            var _this2 = this;

            this.fetchDataPromise('user/userInfo.json', {}).then(function (data) {
                console.log('6677', data);
                _this2.userInfo = data;
                _this2.$apply();
            }).catch(function (error) {});
        }
    }, {
        key: 'whenAppReadyShow',
        value: function whenAppReadyShow() {
            var _this3 = this;

            this.fetchDataPromise('wx/specimen/querySpecimenApi.json', {}).then(function (data) {
                console.log('11 ', data);
                _this3.list = data.list;
                _this3.init();
                _this3.$apply();
            }).catch(function (error) {});
        }
    }]);

    return GitSample;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(GitSample , 'pages/gitSample'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdpdFNhbXBsZS5qcyJdLCJuYW1lcyI6WyJHaXRTYW1wbGUiLCJtaXhpbnMiLCJQYWdlTWl4aW4iLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsImNvbXBvbmVudHMiLCJkYXRhIiwibGlzdCIsInVzZXJJbmZvIiwibWV0aG9kcyIsInRvRnJvbSIsImUiLCJjb25zb2xlIiwibG9nIiwiaWQiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YXNldCIsInd4IiwibmF2aWdhdGVUbyIsInVybCIsIm15U2FtcGxlcyIsImdvRGV0YWlscyIsImZldGNoRGF0YVByb21pc2UiLCJ0aGVuIiwiJGFwcGx5IiwiY2F0Y2giLCJlcnJvciIsImluaXQiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7OztBQUZBOzs7SUFHcUJBLFM7Ozs7Ozs7Ozs7Ozs7O2dNQUNuQkMsTSxHQUFTLENBQUNDLGNBQUQsQyxRQUNUQyxNLEdBQVM7QUFDTEMsb0NBQXdCLE1BRG5CO0FBRUxDLDBDQUE4QjtBQUZ6QixTLFFBSVRDLFUsR0FBYSxFLFFBQ2JDLEksR0FBTztBQUNIQyxrQkFBTSxFQURIO0FBRUhDLHNCQUFVO0FBRlAsUyxRQUlQQyxPLEdBQVU7QUFDTkMsa0JBRE0sa0JBQ0NDLENBREQsRUFDSTtBQUNOQyx3QkFBUUMsR0FBUixDQUFZLEdBQVosRUFBaUJGLENBQWpCO0FBQ0Esb0JBQUlHLEtBQUtILEVBQUVJLGFBQUYsQ0FBZ0JDLE9BQWhCLENBQXdCRixFQUFqQztBQUNBRyxtQkFBR0MsVUFBSCxDQUFjO0FBQ1ZDLHlCQUFLLG9CQUFvQkw7QUFEZixpQkFBZDtBQUdILGFBUEs7O0FBUU47QUFDQU0scUJBVE0sdUJBU007QUFDUkgsbUJBQUdDLFVBQUgsQ0FBYztBQUNWQyx5QkFBSztBQURLLGlCQUFkO0FBR0gsYUFiSztBQWVORSxxQkFmTSxxQkFlSVYsQ0FmSixFQWVPO0FBQ1RDLHdCQUFRQyxHQUFSLENBQVksS0FBWixFQUFtQkYsQ0FBbkI7QUFDQSxvQkFBSUcsS0FBS0gsRUFBRUksYUFBRixDQUFnQkMsT0FBaEIsQ0FBd0JGLEVBQWpDO0FBQ0FGLHdCQUFRQyxHQUFSLENBQVlDLEVBQVo7QUFDQUcsbUJBQUdDLFVBQUgsQ0FBYztBQUNWQyx5QkFBSyw0QkFBNEJMO0FBRHZCLGlCQUFkO0FBSUg7QUF2QkssUzs7Ozs7aUNBeUJELENBQ1I7OzsrQkFDTTtBQUFBOztBQUNILGlCQUFLUSxnQkFBTCxDQUFzQixvQkFBdEIsRUFBNEMsRUFBNUMsRUFDS0MsSUFETCxDQUNVLGdCQUFRO0FBQ1ZYLHdCQUFRQyxHQUFSLENBQVksTUFBWixFQUFvQlAsSUFBcEI7QUFDQSx1QkFBS0UsUUFBTCxHQUFnQkYsSUFBaEI7QUFDQSx1QkFBS2tCLE1BQUw7QUFDSCxhQUxMLEVBTUtDLEtBTkwsQ0FNVyxVQUFTQyxLQUFULEVBQWdCLENBQUUsQ0FON0I7QUFPSDs7OzJDQUNrQjtBQUFBOztBQUNmLGlCQUFLSixnQkFBTCxDQUFzQixtQ0FBdEIsRUFBMkQsRUFBM0QsRUFDS0MsSUFETCxDQUNVLGdCQUFRO0FBQ1ZYLHdCQUFRQyxHQUFSLENBQVksS0FBWixFQUFtQlAsSUFBbkI7QUFDQSx1QkFBS0MsSUFBTCxHQUFZRCxLQUFLQyxJQUFqQjtBQUNBLHVCQUFLb0IsSUFBTDtBQUNBLHVCQUFLSCxNQUFMO0FBQ0gsYUFOTCxFQU9LQyxLQVBMLENBT1csVUFBU0MsS0FBVCxFQUFnQixDQUFFLENBUDdCO0FBU0g7Ozs7RUF6RG9DRSxlQUFLQyxJOztrQkFBdkI5QixTIiwiZmlsZSI6ImdpdFNhbXBsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKiBnbG9iYWwgd3ggKi9cclxuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XHJcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vbWl4aW5zL3BhZ2UnO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHaXRTYW1wbGUgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gIG1peGlucyA9IFtQYWdlTWl4aW5dO1xyXG4gIGNvbmZpZyA9IHtcclxuICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+agt+WTgeeUs+mihicsXHJcbiAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJ1xyXG4gIH07XHJcbiAgY29tcG9uZW50cyA9IHt9O1xyXG4gIGRhdGEgPSB7XHJcbiAgICAgIGxpc3Q6IFtdLFxyXG4gICAgICB1c2VySW5mbzogW11cclxuICB9O1xyXG4gIG1ldGhvZHMgPSB7XHJcbiAgICAgIHRvRnJvbShlKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnZScsIGUpO1xyXG4gICAgICAgICAgbGV0IGlkID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaWQ7XHJcbiAgICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvZm9ybT9pZD0nICsgaWRcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgICAvLyDmiJHnmoTmoLflk4HnlLPpooZcclxuICAgICAgbXlTYW1wbGVzKCkge1xyXG4gICAgICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL3BhZ2VzL21lTWFwbGUnXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdvRGV0YWlscyhlKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnZTExJywgZSk7XHJcbiAgICAgICAgICBsZXQgaWQgPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pZDtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGlkKTtcclxuICAgICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgICAgICAgIHVybDogJy9wYWdlcy9zYW1wbGVEZXRhaWw/aWQ9JyArIGlkXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgIH1cclxuICB9XHJcbiAgb25Mb2FkKCkge1xyXG4gIH1cclxuICBpbml0KCkge1xyXG4gICAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3VzZXIvdXNlckluZm8uanNvbicsIHt9KVxyXG4gICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJzY2NzcnLCBkYXRhKTtcclxuICAgICAgICAgICAgICB0aGlzLnVzZXJJbmZvID0gZGF0YTtcclxuICAgICAgICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge30pO1xyXG4gIH1cclxuICB3aGVuQXBwUmVhZHlTaG93KCkge1xyXG4gICAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3d4L3NwZWNpbWVuL3F1ZXJ5U3BlY2ltZW5BcGkuanNvbicsIHt9KVxyXG4gICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJzExICcsIGRhdGEpO1xyXG4gICAgICAgICAgICAgIHRoaXMubGlzdCA9IGRhdGEubGlzdDtcclxuICAgICAgICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge30pO1xyXG5cclxuICB9XHJcbn1cclxuIl19