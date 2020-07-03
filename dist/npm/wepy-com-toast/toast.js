'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Panel = function (_wepy$component) {
    _inherits(Panel, _wepy$component);

    function Panel() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Panel);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Panel.__proto__ || Object.getPrototypeOf(Panel)).call.apply(_ref, [this].concat(args))), _this), _this.data = {
            reveal: false,
            img: '',
            animationData: '',
            imgClassName: '',
            imgMode: 'scaleToFill',
            title: '载入中...',
            titleClassName: ''
        }, _this.methods = {}, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Panel, [{
        key: 'onLoad',
        value: function onLoad() {
            this.hasPromise = (typeof Promise === 'undefined' ? 'undefined' : _typeof(Promise)) !== undefined;
        }
    }, {
        key: 'show',
        value: function show() {
            var _this2 = this;

            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            this.reveal = true;
            for (var k in data) {
                this[k] = data[k];
            }
            this.$apply();

            clearTimeout(this.__timeout);

            setTimeout(function () {
                var animation = wx.createAnimation();
                animation.opacity(1).step();
                _this2.animationData = animation.export();
                _this2.reveal = true;
                _this2.$apply();
            }, 30);

            if (data.duration === 0) {
                // success callback after toast showed
                if (this.hasPromise) {
                    return new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            resolve(data);
                        }, 430);
                    });
                } else {
                    setTimeout(function () {
                        return typeof data.success === 'function' ? data.success(data) : data;
                    }, 430);
                }
            } else {
                if (this.hasPromise) {
                    return new Promise(function (resolve, reject) {
                        _this2.__timeout = setTimeout(function () {
                            _this2.toast();
                            resolve(data);
                        }, (data.duration || 1500) + 400);
                    });
                } else {
                    this.__timeout = setTimeout(function () {
                        _this2.toast();

                        // success callback
                        typeof data.success === 'function' && data.success(data);
                    }, (data.duration || 1500) + 400);
                }
            }
        }
    }, {
        key: 'toast',
        value: function toast(data) {
            var err = false;
            try {
                if (!data) {
                    this.hide();
                } else {
                    this.show(data);
                }
            } catch (e) {
                err = e;
            }

            if (this.hasPromise) {
                return new Promise(function (resolve, reject) {
                    if (!err) {
                        resolve(data);
                    } else reject(data);
                });
            } else {
                if (err) {
                    typeof data.fail === 'function' && data.fail(data);
                } else {
                    typeof data.success === 'function' && data.success(data);
                }
            }
        }
    }, {
        key: 'hide',
        value: function hide() {
            clearTimeout(this.__timeout);
            this.reveal = false;

            var animation = wx.createAnimation();
            animation.opacity(0).step();
            this.animationData = animation.export();

            this.$apply();

            if (this.hasPromise) {
                return new Promise(function (resolve, reject) {
                    resolve();
                });
            } else {
                if (typeof data.success === 'function') {
                    return data.success(data);
                }
            }
        }
    }]);

    return Panel;
}(_wepy2.default.component);

exports.default = Panel;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvYXN0LmpzIl0sIm5hbWVzIjpbIlBhbmVsIiwiZGF0YSIsInJldmVhbCIsImltZyIsImFuaW1hdGlvbkRhdGEiLCJpbWdDbGFzc05hbWUiLCJpbWdNb2RlIiwidGl0bGUiLCJ0aXRsZUNsYXNzTmFtZSIsIm1ldGhvZHMiLCJoYXNQcm9taXNlIiwiUHJvbWlzZSIsInVuZGVmaW5lZCIsImsiLCIkYXBwbHkiLCJjbGVhclRpbWVvdXQiLCJfX3RpbWVvdXQiLCJzZXRUaW1lb3V0IiwiYW5pbWF0aW9uIiwid3giLCJjcmVhdGVBbmltYXRpb24iLCJvcGFjaXR5Iiwic3RlcCIsImV4cG9ydCIsImR1cmF0aW9uIiwicmVzb2x2ZSIsInJlamVjdCIsInN1Y2Nlc3MiLCJ0b2FzdCIsImVyciIsImhpZGUiLCJzaG93IiwiZSIsImZhaWwiLCJ3ZXB5IiwiY29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0k7Ozs7Ozs7Ozs7OztJQUVxQkEsSzs7Ozs7Ozs7Ozs7Ozs7d0xBRWpCQyxJLEdBQU87QUFDSEMsb0JBQVEsS0FETDtBQUVIQyxpQkFBSyxFQUZGO0FBR0hDLDJCQUFlLEVBSFo7QUFJSEMsMEJBQWMsRUFKWDtBQUtIQyxxQkFBUyxhQUxOO0FBTUhDLG1CQUFPLFFBTko7QUFPSEMsNEJBQWdCO0FBUGIsUyxRQVVkQyxPLEdBQVUsRTs7Ozs7aUNBRU87QUFDTixpQkFBS0MsVUFBTCxHQUFtQixRQUFPQyxPQUFQLHlDQUFPQSxPQUFQLE9BQW1CQyxTQUF0QztBQUNIOzs7K0JBRWdCO0FBQUE7O0FBQUEsZ0JBQVhYLElBQVcsdUVBQUosRUFBSTs7QUFDYixpQkFBS0MsTUFBTCxHQUFjLElBQWQ7QUFDQSxpQkFBSyxJQUFJVyxDQUFULElBQWNaLElBQWQsRUFBb0I7QUFDaEIscUJBQUtZLENBQUwsSUFBVVosS0FBS1ksQ0FBTCxDQUFWO0FBQ0g7QUFDRCxpQkFBS0MsTUFBTDs7QUFFQUMseUJBQWEsS0FBS0MsU0FBbEI7O0FBRUFDLHVCQUFXLFlBQUk7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QXJCOztBQUVBLGlCQUFLVCxNQUFMOztBQUVBLGdCQUFJLEtBQUtKLFVBQVQsRUFBcUI7QUFDakIsdUJBQU8sSUFBSUMsT0FBSixDQUFZLFVBQUNjLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUNwQ0Q7QUFDSCxpQkFGTSxDQUFQO0FBR0gsYUFKRCxNQUlPO0FBQ0gsb0JBQUksT0FBT3hCLEtBQUswQixPQUFaLEtBQXdCLFVBQTVCLEVBQXdDO0FBQ3BDLDJCQUFPMUIsS0FBSzBCLE9BQUwsQ0FBYTFCLElBQWIsQ0FBUDtBQUNIO0FBQ0o7QUFDSjs7OztFQW5IOEJpQyxlQUFLQyxTOztrQkFBbkJuQyxLIiwiZmlsZSI6InRvYXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbiAgICBpbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcclxuXHJcbiAgICBleHBvcnQgZGVmYXVsdCBjbGFzcyBQYW5lbCBleHRlbmRzIHdlcHkuY29tcG9uZW50IHtcclxuXHJcbiAgICAgICAgZGF0YSA9IHtcclxuICAgICAgICAgICAgcmV2ZWFsOiBmYWxzZSxcclxuICAgICAgICAgICAgaW1nOiAnJyxcclxuICAgICAgICAgICAgYW5pbWF0aW9uRGF0YTogJycsXHJcbiAgICAgICAgICAgIGltZ0NsYXNzTmFtZTogJycsXHJcbiAgICAgICAgICAgIGltZ01vZGU6ICdzY2FsZVRvRmlsbCcsXHJcbiAgICAgICAgICAgIHRpdGxlOiAn6L295YWl5LitLi4uJyxcclxuICAgICAgICAgICAgdGl0bGVDbGFzc05hbWU6ICcnXHJcbiAgICAgICAgfTtcclxuXHJcblx0bWV0aG9kcyA9IHt9O1xyXG5cclxuICAgICAgICBvbkxvYWQgKCkge1xyXG4gICAgICAgICAgICB0aGlzLmhhc1Byb21pc2UgPSAodHlwZW9mIFByb21pc2UgIT09IHVuZGVmaW5lZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzaG93IChkYXRhID0ge30pIHtcclxuICAgICAgICAgICAgdGhpcy5yZXZlYWwgPSB0cnVlO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBrIGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXNba10gPSBkYXRhW2tdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcblxyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fX3RpbWVvdXQpO1xyXG5cclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKT0+e1xyXG4gICAgICAgICAgICAgICAgbGV0IGFuaW1hdGlvbiA9IHd4LmNyZWF0ZUFuaW1hdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uLm9wYWNpdHkoMSkuc3RlcCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25EYXRhID0gYW5pbWF0aW9uLmV4cG9ydCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXZlYWwgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgICAgICAgfSwzMCk7XHJcblxyXG5cclxuICAgICAgICAgICAgaWYgKGRhdGEuZHVyYXRpb24gPT09IDApIHtcclxuICAgICAgICAgICAgICAgIC8vIHN1Y2Nlc3MgY2FsbGJhY2sgYWZ0ZXIgdG9hc3Qgc2hvd2VkXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oYXNQcm9taXNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCAoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgNDMwKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQgKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICh0eXBlb2YgZGF0YS5zdWNjZXNzID09PSAnZnVuY3Rpb24nKSA/IGRhdGEuc3VjY2VzcyhkYXRhKSA6IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgNDMwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhc1Byb21pc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fdGltZW91dCA9IHNldFRpbWVvdXQgKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9hc3QoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIChkYXRhLmR1cmF0aW9uIHx8IDE1MDApICsgNDAwKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX3RpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b2FzdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3VjY2VzcyBjYWxsYmFja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgZGF0YS5zdWNjZXNzID09PSAnZnVuY3Rpb24nICYmIGRhdGEuc3VjY2VzcyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCAoZGF0YS5kdXJhdGlvbiB8fCAxNTAwKSArIDQwMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0b2FzdCAoZGF0YSkge1xyXG4gICAgICAgICAgICBsZXQgZXJyID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93KGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBlcnIgPSBlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNQcm9taXNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiBkYXRhLmZhaWwgPT09ICdmdW5jdGlvbicgJiYgZGF0YS5mYWlsKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlb2YgZGF0YS5zdWNjZXNzID09PSAnZnVuY3Rpb24nICYmIGRhdGEuc3VjY2VzcyhkYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGhpZGUgKCkge1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fX3RpbWVvdXQpO1xyXG4gICAgICAgICAgICB0aGlzLnJldmVhbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IGFuaW1hdGlvbiA9IHd4LmNyZWF0ZUFuaW1hdGlvbigpO1xyXG4gICAgICAgICAgICBhbmltYXRpb24ub3BhY2l0eSgwKS5zdGVwKCk7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uRGF0YSA9IGFuaW1hdGlvbi5leHBvcnQoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuJGFwcGx5KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNQcm9taXNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhLnN1Y2Nlc3MgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YS5zdWNjZXNzKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4iXX0=