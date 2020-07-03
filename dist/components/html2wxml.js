'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _wxParse = require('./../wxParse/wxParse.js');

var _wxParse2 = _interopRequireDefault(_wxParse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var html2wxml = function (_wepy$component) {
    _inherits(html2wxml, _wepy$component);

    function html2wxml() {
        var _ref;

        var _temp, _this, _ret;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        _classCallCheck(this, html2wxml);

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = html2wxml.__proto__ || Object.getPrototypeOf(html2wxml)).call.apply(_ref, [this].concat(args))), _this), _this.props = {
            parserName: {
                type: String,
                default: 'htmlParserName'
            },
            parserContent: {
                type: String,
                default: "<p style='font-size: 32rpx; padding: 30rpx 0; text-align: center;'>此处可以在html2wxml.wpy中自行选择删除</p>"
            },
            parserType: {
                type: String,
                default: 'html'
            },
            parserPadding: {
                type: Number,
                default: 5
            }
        }, _this.data = {
            htmlParserTpl: {}
        }, _this.events = {
            'htmlParser-broadcast': function htmlParserBroadcast($event) {}
        }, _this.methods = {
            htmlParserNotice: function htmlParserNotice() {
                this.htmlParse();
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(html2wxml, [{
        key: 'onLoad',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this.htmlParse();

                            case 1:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function onLoad() {
                return _ref2.apply(this, arguments);
            }

            return onLoad;
        }()
    }, {
        key: 'wxParseImgLoad',
        value: function wxParseImgLoad(image) {
            var imgInfo = image.detail;
        }
    }, {
        key: 'htmlParse',
        value: function htmlParse() {
            /**
              * WxParse.wxParse(bindName , type, data, target,imagePadding)
              * 1.bindName绑定的数据名(必填)
              * 2.type可以为html或者md(必填)
              * 3.data为传入的具体数据(必填)
              * 4.target为Page对象,一般为this(必填)
              * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
              */
            try {
                var htmlContent = _wxParse2.default.wxParse(this.parserName, this.parserType, this.parserContent || this.props.parserContent.default, this, this.parserPadding);
                this.htmlParserTpl = htmlContent[this.parserName];
            } catch (e) {
                console.warn('kinerHtmlParser:', '没有任何内容需要转换', e);
            }
        }
    }]);

    return html2wxml;
}(_wepy2.default.component);

exports.default = html2wxml;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0bWwyd3htbC5qcyJdLCJuYW1lcyI6WyJodG1sMnd4bWwiLCJwcm9wcyIsInBhcnNlck5hbWUiLCJ0eXBlIiwiU3RyaW5nIiwiZGVmYXVsdCIsInBhcnNlckNvbnRlbnQiLCJwYXJzZXJUeXBlIiwicGFyc2VyUGFkZGluZyIsIk51bWJlciIsImRhdGEiLCJodG1sUGFyc2VyVHBsIiwiZXZlbnRzIiwiJGV2ZW50IiwibWV0aG9kcyIsImh0bWxQYXJzZXJOb3RpY2UiLCJodG1sUGFyc2UiLCJpbWFnZSIsImltZ0luZm8iLCJkZXRhaWwiLCJodG1sQ29udGVudCIsIld4UGFyc2UiLCJ3eFBhcnNlIiwiZSIsImNvbnNvbGUiLCJ3YXJuIiwid2VweSIsImNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDRTs7OztBQUNBOzs7Ozs7Ozs7Ozs7OztJQUVxQkEsUzs7Ozs7Ozs7Ozs7Ozs7Z01BQ25CQyxLLEdBQVE7QUFDSkMsd0JBQVk7QUFDUkMsc0JBQU1DLE1BREU7QUFFUkMseUJBQVM7QUFGRCxhQURSO0FBS0pDLDJCQUFlO0FBQ1hILHNCQUFNQyxNQURLO0FBRVhDLHlCQUFTO0FBRkUsYUFMWDtBQVNKRSx3QkFBWTtBQUNSSixzQkFBTUMsTUFERTtBQUVSQyx5QkFBUztBQUZELGFBVFI7QUFhSkcsMkJBQWU7QUFDWEwsc0JBQU1NLE1BREs7QUFFWEoseUJBQVM7QUFGRTtBQWJYLFMsUUFrQlJLLEksR0FBTztBQUNIQywyQkFBZTtBQURaLFMsUUFHUEMsTSxHQUFTO0FBQ0wsb0NBQXdCLDZCQUFDQyxNQUFELEVBQXFCLENBQzVDO0FBRkksUyxRQUlUQyxPLEdBQVU7QUFDTkMsNEJBRE0sOEJBQ2E7QUFDZixxQkFBS0MsU0FBTDtBQUNIO0FBSEssUzs7Ozs7Ozs7Ozs7QUFNTixxQ0FBS0EsU0FBTDs7Ozs7Ozs7Ozs7Ozs7Ozs7O3VDQUVXQyxLLEVBQU87QUFDbEIsZ0JBQUlDLFVBQVVELE1BQU1FLE1BQXBCO0FBQ0g7OztvQ0FDVztBQUNSOzs7Ozs7OztBQVFBLGdCQUFJO0FBQ0Esb0JBQUlDLGNBQWNDLGtCQUFRQyxPQUFSLENBQWdCLEtBQUtwQixVQUFyQixFQUFpQyxLQUFLSyxVQUF0QyxFQUFrRCxLQUFLRCxhQUFMLElBQXNCLEtBQUtMLEtBQUwsQ0FBV0ssYUFBWCxDQUF5QkQsT0FBakcsRUFBMEcsSUFBMUcsRUFBZ0gsS0FBS0csYUFBckgsQ0FBbEI7QUFDQSxxQkFBS0csYUFBTCxHQUFxQlMsWUFBWSxLQUFLbEIsVUFBakIsQ0FBckI7QUFDSCxhQUhELENBR0UsT0FBT3FCLENBQVAsRUFBVTtBQUNSQyx3QkFBUUMsSUFBUixDQUFhLGtCQUFiLEVBQWlDLFlBQWpDLEVBQStDRixDQUEvQztBQUNIO0FBQ0o7Ozs7RUFwRG9DRyxlQUFLQyxTOztrQkFBdkIzQixTIiwiZmlsZSI6Imh0bWwyd3htbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4gIGltcG9ydCB3ZXB5IGZyb20gJ3dlcHknO1xyXG4gIGltcG9ydCBXeFBhcnNlIGZyb20gJy4uL3d4UGFyc2Uvd3hQYXJzZSc7XHJcblxyXG4gIGV4cG9ydCBkZWZhdWx0IGNsYXNzIGh0bWwyd3htbCBleHRlbmRzIHdlcHkuY29tcG9uZW50IHtcclxuICAgIHByb3BzID0ge1xyXG4gICAgICAgIHBhcnNlck5hbWU6IHtcclxuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICAgICAgICBkZWZhdWx0OiAnaHRtbFBhcnNlck5hbWUnXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwYXJzZXJDb250ZW50OiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICAgICAgZGVmYXVsdDogXCI8cCBzdHlsZT0nZm9udC1zaXplOiAzMnJweDsgcGFkZGluZzogMzBycHggMDsgdGV4dC1hbGlnbjogY2VudGVyOyc+5q2k5aSE5Y+v5Lul5ZyoaHRtbDJ3eG1sLndweeS4reiHquihjOmAieaLqeWIoOmZpDwvcD5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGFyc2VyVHlwZToge1xyXG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6ICdodG1sJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGFyc2VyUGFkZGluZzoge1xyXG4gICAgICAgICAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IDVcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBkYXRhID0ge1xyXG4gICAgICAgIGh0bWxQYXJzZXJUcGw6IHt9XHJcbiAgICB9XHJcbiAgICBldmVudHMgPSB7XHJcbiAgICAgICAgJ2h0bWxQYXJzZXItYnJvYWRjYXN0JzogKCRldmVudCwgLi4uYXJncykgPT4ge1xyXG4gICAgICAgIH0sXHJcbiAgICB9XHJcbiAgICBtZXRob2RzID0ge1xyXG4gICAgICAgIGh0bWxQYXJzZXJOb3RpY2UoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaHRtbFBhcnNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG4gICAgICAgIHRoaXMuaHRtbFBhcnNlKCk7XHJcbiAgICB9XHJcbiAgICB3eFBhcnNlSW1nTG9hZChpbWFnZSkge1xyXG4gICAgICAgIGxldCBpbWdJbmZvID0gaW1hZ2UuZGV0YWlsO1xyXG4gICAgfVxyXG4gICAgaHRtbFBhcnNlKCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAgKiBXeFBhcnNlLnd4UGFyc2UoYmluZE5hbWUgLCB0eXBlLCBkYXRhLCB0YXJnZXQsaW1hZ2VQYWRkaW5nKVxyXG4gICAgICAgICAgKiAxLmJpbmROYW1l57uR5a6a55qE5pWw5o2u5ZCNKOW/heWhqylcclxuICAgICAgICAgICogMi50eXBl5Y+v5Lul5Li6aHRtbOaIluiAhW1kKOW/heWhqylcclxuICAgICAgICAgICogMy5kYXRh5Li65Lyg5YWl55qE5YW35L2T5pWw5o2uKOW/heWhqylcclxuICAgICAgICAgICogNC50YXJnZXTkuLpQYWdl5a+56LGhLOS4gOiIrOS4unRoaXMo5b+F5aGrKVxyXG4gICAgICAgICAgKiA1LmltYWdlUGFkZGluZ+S4uuW9k+WbvueJh+iHqumAguW6lOaYr+W3puWPs+eahOWNleS4gHBhZGRpbmco6buY6K6k5Li6MCzlj6/pgIkpXHJcbiAgICAgICAgICAqL1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGxldCBodG1sQ29udGVudCA9IFd4UGFyc2Uud3hQYXJzZSh0aGlzLnBhcnNlck5hbWUsIHRoaXMucGFyc2VyVHlwZSwgdGhpcy5wYXJzZXJDb250ZW50IHx8IHRoaXMucHJvcHMucGFyc2VyQ29udGVudC5kZWZhdWx0LCB0aGlzLCB0aGlzLnBhcnNlclBhZGRpbmcpO1xyXG4gICAgICAgICAgICB0aGlzLmh0bWxQYXJzZXJUcGwgPSBodG1sQ29udGVudFt0aGlzLnBhcnNlck5hbWVdO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdraW5lckh0bWxQYXJzZXI6JywgJ+ayoeacieS7u+S9leWGheWuuemcgOimgei9rOaNoicsIGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiJdfQ==