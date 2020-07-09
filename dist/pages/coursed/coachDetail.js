'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _dayjs = require('./../../npm/dayjs/dayjs.min.js');

var _dayjs2 = _interopRequireDefault(_dayjs);

var _page = require('./../../mixins/page.js');

var _page2 = _interopRequireDefault(_page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/* global wx */


var CoachDetail = function (_wepy$page) {
    _inherits(CoachDetail, _wepy$page);

    function CoachDetail() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, CoachDetail);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CoachDetail.__proto__ || Object.getPrototypeOf(CoachDetail)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
            // navigationBarTitleText: '预约',
            // navigationBarBackgroundColor: '#fff',

        }, _this.components = {}, _this.data = {
            date: [],
            currentIndex: null,
            times: []
        }, _this.methods = {
            back: function back() {
                wx.navigateBack({
                    delta: 1
                });
            },
            goBuy: function goBuy() {
                wx.navigateTo({
                    url: 'member'
                });
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }
    // mixins = [PageMixin];


    _createClass(CoachDetail, [{
        key: 'onReachBottom',
        value: function onReachBottom() {}
    }, {
        key: 'whenAppReadyShow',
        value: function whenAppReadyShow() {
            var _this2 = this;

            this.fetchDataPromise('user/userInfo.json', {}).then(function (data) {
                var userInfo = data;
                _this2.$apply();
                wx.setStorage({
                    key: 'userInfo',
                    data: JSON.stringify(userInfo)
                });
            }).catch(function (error) {});
        }
    }, {
        key: 'onShow',
        value: function onShow() {}
    }, {
        key: 'onShareAppMessage',
        value: function onShareAppMessage(res) {}
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

    return CoachDetail;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(CoachDetail , 'pages/coursed/coachDetail'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvYWNoRGV0YWlsLmpzIl0sIm5hbWVzIjpbIkNvYWNoRGV0YWlsIiwiY29uZmlnIiwiY29tcG9uZW50cyIsImRhdGEiLCJkYXRlIiwiY3VycmVudEluZGV4IiwidGltZXMiLCJtZXRob2RzIiwiYmFjayIsInd4IiwibmF2aWdhdGVCYWNrIiwiZGVsdGEiLCJnb0J1eSIsIm5hdmlnYXRlVG8iLCJ1cmwiLCJmZXRjaERhdGFQcm9taXNlIiwidGhlbiIsInVzZXJJbmZvIiwiJGFwcGx5Iiwic2V0U3RvcmFnZSIsImtleSIsIkpTT04iLCJzdHJpbmdpZnkiLCJjYXRjaCIsImVycm9yIiwicmVzIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJ0eXBlIiwibWFya2VySWQiLCJjb250cm9sSWQiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBSEE7OztJQUlxQkEsVzs7Ozs7Ozs7Ozs7Ozs7b01BRW5CQyxNLEdBQVM7QUFDTDtBQUNBOztBQUZLLFMsUUFLVEMsVSxHQUFhLEUsUUFDYkMsSSxHQUFPO0FBQ0xDLGtCQUFNLEVBREQ7QUFFTEMsMEJBQWMsSUFGVDtBQUdMQyxtQkFBTztBQUhGLFMsUUFLUEMsTyxHQUFVO0FBQ1JDLGdCQURRLGtCQUNGO0FBQ0pDLG1CQUFHQyxZQUFILENBQWdCO0FBQ2RDLDJCQUFPO0FBRE8saUJBQWhCO0FBR0QsYUFMTztBQU1OQyxpQkFOTSxtQkFNRTtBQUNKSCxtQkFBR0ksVUFBSCxDQUFjO0FBQ1ZDLHlCQUFLO0FBREssaUJBQWQ7QUFHSDtBQVZLLFM7O0FBWlY7Ozs7O3dDQXlCZ0IsQ0FBRTs7OzJDQUVDO0FBQUE7O0FBQ2YsaUJBQUtDLGdCQUFMLENBQXNCLG9CQUF0QixFQUE0QyxFQUE1QyxFQUNLQyxJQURMLENBQ1UsZ0JBQVE7QUFDVixvQkFBTUMsV0FBV2QsSUFBakI7QUFDQSx1QkFBS2UsTUFBTDtBQUNBVCxtQkFBR1UsVUFBSCxDQUFjO0FBQ1ZDLHlCQUFLLFVBREs7QUFFVmpCLDBCQUFNa0IsS0FBS0MsU0FBTCxDQUFlTCxRQUFmO0FBRkksaUJBQWQ7QUFJSCxhQVJMLEVBU0tNLEtBVEwsQ0FTVyxVQUFTQyxLQUFULEVBQWdCLENBQUUsQ0FUN0I7QUFVSDs7O2lDQUNRLENBRVI7OzswQ0FFaUJDLEcsRUFBSyxDQUFFOzs7cUNBQ1pDLEMsRUFBRztBQUNaQyxvQkFBUUMsR0FBUixDQUFZRixFQUFFRyxJQUFkO0FBQ0g7OztrQ0FDU0gsQyxFQUFHO0FBQ1RDLG9CQUFRQyxHQUFSLENBQVlGLEVBQUVJLFFBQWQ7QUFDSDs7O21DQUNVSixDLEVBQUc7QUFDVkMsb0JBQVFDLEdBQVIsQ0FBWUYsRUFBRUssU0FBZDtBQUNIOzs7O0VBckRzQ0MsZUFBS0MsSTs7a0JBQXpCakMsVyIsImZpbGUiOiJjb2FjaERldGFpbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKiBnbG9iYWwgd3ggKi9cclxuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XHJcbmltcG9ydCBkYXlqcyBmcm9tICdkYXlqcydcclxuaW1wb3J0IFBhZ2VNaXhpbiBmcm9tICcuLi8uLi9taXhpbnMvcGFnZSc7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvYWNoRGV0YWlsIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICAvLyBtaXhpbnMgPSBbUGFnZU1peGluXTtcclxuICBjb25maWcgPSB7XHJcbiAgICAgIC8vIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfpooTnuqYnLFxyXG4gICAgICAvLyBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiAnI2ZmZicsXHJcblxyXG4gIH07XHJcbiAgY29tcG9uZW50cyA9IHt9O1xyXG4gIGRhdGEgPSB7XHJcbiAgICBkYXRlOiBbXSxcclxuICAgIGN1cnJlbnRJbmRleDogbnVsbCxcclxuICAgIHRpbWVzOiBbXVxyXG4gIH07XHJcbiAgbWV0aG9kcyA9IHtcclxuICAgIGJhY2soKXtcclxuICAgICAgd3gubmF2aWdhdGVCYWNrKHtcclxuICAgICAgICBkZWx0YTogMVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgICAgZ29CdXkoKSB7XHJcbiAgICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICAgICAgICB1cmw6ICdtZW1iZXInXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gIH07XHJcblxyXG4gIG9uUmVhY2hCb3R0b20oKSB7fVxyXG5cclxuICB3aGVuQXBwUmVhZHlTaG93KCkge1xyXG4gICAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3VzZXIvdXNlckluZm8uanNvbicsIHt9KVxyXG4gICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3QgdXNlckluZm8gPSBkYXRhO1xyXG4gICAgICAgICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgd3guc2V0U3RvcmFnZSh7XHJcbiAgICAgICAgICAgICAgICAgIGtleTogJ3VzZXJJbmZvJyxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkodXNlckluZm8pXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7fSk7XHJcbiAgfVxyXG4gIG9uU2hvdygpIHtcclxuICAgIFxyXG4gIH1cclxuIFxyXG4gIG9uU2hhcmVBcHBNZXNzYWdlKHJlcykge31cclxuICByZWdpb25jaGFuZ2UoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlLnR5cGUpO1xyXG4gIH1cclxuICBtYXJrZXJ0YXAoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlLm1hcmtlcklkKTtcclxuICB9XHJcbiAgY29udHJvbHRhcChlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUuY29udHJvbElkKTtcclxuICB9XHJcbn1cclxuIl19