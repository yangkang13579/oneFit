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

var TextDetails = function (_wepy$page) {
    _inherits(TextDetails, _wepy$page);

    function TextDetails() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, TextDetails);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TextDetails.__proto__ || Object.getPrototypeOf(TextDetails)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
            navigationBarTitleText: '田间实验',
            navigationBarBackgroundColor: '#fff'
        }, _this.data = {
            uploadIndex: 0, // 上传的编号
            uploadItems: [], // 上传的图片数组
            uploading: false, // 是否正在上传
            list: [{}, {}],
            delItem: null,
            showToast: false,
            error: '',
            user: _this.user,
            id: null,
            isOpen: false,
            details: {}
        }, _this.methods = {
            preview: function preview(event) {
                var currentUrl = event.currentTarget.dataset.src;
                wx.previewImage({
                    current: currentUrl, // 当前显示图片的http链接
                    urls: [currentUrl] // 需要预览的图片http链接列表
                });
            },
            editRecord: function editRecord(e) {
                wx.navigateTo({
                    url: '/pages/addRecord?id=' + this.id + '&record=' + JSON.stringify(e.currentTarget.dataset.id)
                });
            },

            // 打开增加实验
            open: function open() {
                wx.navigateTo({
                    url: '/pages/addRecord?id=' + this.id
                });
            },
            getUser: function getUser(e) {
                this.formData.recordUser = e.detail.value;
                this.$apply();
            },

            // 编辑实验信息
            editFun: function editFun() {
                wx.navigateTo({
                    url: '/pages/createTest?item=' + JSON.stringify(this.details)
                });
            },
            chooseImage: function chooseImage(e) {
                var self = this;
                wx.chooseImage({
                    count: 2,
                    sizeType: ['original', 'compressed'],
                    sourceType: ['album', 'camera'],
                    success: function success(res) {
                        // tempFilePath可以作为img标签的src属性显示图片
                        var tempFilePaths = res.tempFilePaths;
                        for (var i = 0; i < tempFilePaths.length; i++) {
                            self.uploadItems.push({
                                index: self.uploadIndex++,
                                file: tempFilePaths[i], // 用于直接显示
                                progress: 0,
                                uploaded: false, // 是否上传完成
                                uploadError: false, // 上传失败
                                url: '' // 上传后的URL
                            });
                        }
                        self.startUpload();
                        self.$apply();
                    },
                    fail: function fail(error) {}
                });
            },

            // 删除
            delFun: function delFun(e) {
                var self = this;
                wx.showModal({
                    title: '提示',
                    content: '是否确认删除当前实验数据?',
                    cancelText: '取消',
                    confirmText: '确认',
                    success: function success(res) {
                        if (res.confirm) {
                            self.fetchDataPromise('wx/experiment/deleteExperimentRecordApi.json', { id: e.target.dataset.id }).then(function (data) {
                                self.formData = {};
                                // 返回上上一页
                                wx.showToast({
                                    title: '删除成功'
                                });
                                self.getDeails(self.id);
                            });
                        }
                    },
                    fail: function fail(err) {}
                });
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(TextDetails, [{
        key: 'getDeails',

        // 获取实验详情
        value: function getDeails(id) {
            var that = this;
            this.fetchDataPromise('wx/experiment/queryExperimentRecordApi.json', { experimentId: id }, {}).then(function (data) {
                that.details = data.list[0];
                that.$apply();
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
        value: function onLoad(options) {
            this.id = options.id;
        }
    }, {
        key: 'whenAppReadyShow',
        value: function whenAppReadyShow() {
            // this.getList()
            this.getDeails(this.id);

            // 每次都刷新
        }
    }]);

    return TextDetails;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(TextDetails , 'pages/textDetails'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRleHREZXRhaWxzLmpzIl0sIm5hbWVzIjpbIlRleHREZXRhaWxzIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJkYXRhIiwidXBsb2FkSW5kZXgiLCJ1cGxvYWRJdGVtcyIsInVwbG9hZGluZyIsImxpc3QiLCJkZWxJdGVtIiwic2hvd1RvYXN0IiwiZXJyb3IiLCJ1c2VyIiwiaWQiLCJpc09wZW4iLCJkZXRhaWxzIiwibWV0aG9kcyIsInByZXZpZXciLCJldmVudCIsImN1cnJlbnRVcmwiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YXNldCIsInNyYyIsInd4IiwicHJldmlld0ltYWdlIiwiY3VycmVudCIsInVybHMiLCJlZGl0UmVjb3JkIiwiZSIsIm5hdmlnYXRlVG8iLCJ1cmwiLCJKU09OIiwic3RyaW5naWZ5Iiwib3BlbiIsImdldFVzZXIiLCJmb3JtRGF0YSIsInJlY29yZFVzZXIiLCJkZXRhaWwiLCJ2YWx1ZSIsIiRhcHBseSIsImVkaXRGdW4iLCJjaG9vc2VJbWFnZSIsInNlbGYiLCJjb3VudCIsInNpemVUeXBlIiwic291cmNlVHlwZSIsInN1Y2Nlc3MiLCJyZXMiLCJ0ZW1wRmlsZVBhdGhzIiwiaSIsImxlbmd0aCIsInB1c2giLCJpbmRleCIsImZpbGUiLCJwcm9ncmVzcyIsInVwbG9hZGVkIiwidXBsb2FkRXJyb3IiLCJzdGFydFVwbG9hZCIsImZhaWwiLCJkZWxGdW4iLCJzaG93TW9kYWwiLCJ0aXRsZSIsImNvbnRlbnQiLCJjYW5jZWxUZXh0IiwiY29uZmlybVRleHQiLCJjb25maXJtIiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRhcmdldCIsInRoZW4iLCJnZXREZWFpbHMiLCJlcnIiLCJ0aGF0IiwiZXhwZXJpbWVudElkIiwic2V0VGltZW91dCIsIm9wdGlvbnMiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDQTs7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OytCQWlGTWdFLE8sRUFBUztBQUNaLGlCQUFLN0QsRUFBTCxHQUFVNkQsUUFBUTdELEVBQWxCO0FBQ0g7OzsyQ0FDa0I7QUFDZjtBQUNBLGlCQUFLd0QsU0FBTCxDQUFlLEtBQUt4RCxFQUFwQjs7QUFFQTtBQUNIOzs7O0VBNUhzQzhELGVBQUtDLEk7O2tCQUF6QjlFLFciLCJmaWxlIjoidGV4dERldGFpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XHJcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vbWl4aW5zL3BhZ2UnO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXh0RGV0YWlscyBleHRlbmRzIHdlcHkucGFnZSB7XHJcbiAgbWl4aW5zID0gW1BhZ2VNaXhpbl07XHJcbiAgY29uZmlnID0ge1xyXG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn55Sw6Ze05a6e6aqMJyxcclxuICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNmZmYnXHJcbiAgfTtcclxuICBkYXRhID0ge1xyXG4gICAgICB1cGxvYWRJbmRleDogMCwgLy8g5LiK5Lyg55qE57yW5Y+3XHJcbiAgICAgIHVwbG9hZEl0ZW1zOiBbXSwgLy8g5LiK5Lyg55qE5Zu+54mH5pWw57uEXHJcbiAgICAgIHVwbG9hZGluZzogZmFsc2UsIC8vIOaYr+WQpuato+WcqOS4iuS8oFxyXG4gICAgICBsaXN0OiBbe30sIHt9XSxcclxuICAgICAgZGVsSXRlbTogbnVsbCxcclxuICAgICAgc2hvd1RvYXN0OiBmYWxzZSxcclxuICAgICAgZXJyb3I6ICcnLFxyXG4gICAgICB1c2VyOiB0aGlzLnVzZXIsXHJcbiAgICAgIGlkOiBudWxsLFxyXG4gICAgICBpc09wZW46IGZhbHNlLFxyXG4gICAgICBkZXRhaWxzOiB7fVxyXG4gIH07XHJcbiAgLy8g6I635Y+W5a6e6aqM6K+m5oOFXHJcbiAgZ2V0RGVhaWxzKGlkKSB7XHJcbiAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG4gICAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3d4L2V4cGVyaW1lbnQvcXVlcnlFeHBlcmltZW50UmVjb3JkQXBpLmpzb24nLCB7ZXhwZXJpbWVudElkOiBpZH0sIHt9KVxyXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgIHRoYXQuZGV0YWlscyA9IGRhdGEubGlzdFswXTtcclxuICAgICAgICAgICAgICB0aGF0LiRhcHBseSgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgfVxyXG4gIHRvYXN0KGVycm9yKSB7XHJcbiAgICAgIHRoaXMuc2hvd1RvYXN0ID0gdHJ1ZTtcclxuICAgICAgdGhpcy5lcnJvciA9IGVycm9yO1xyXG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgdGhhdC5zaG93VG9hc3QgPSBmYWxzZTtcclxuICAgICAgfSwgMjAwMCk7XHJcbiAgfVxyXG4gIG1ldGhvZHMgPSB7XHJcbiAgICAgIHByZXZpZXcoZXZlbnQpIHtcclxuICAgICAgICAgIGxldCBjdXJyZW50VXJsID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LnNyYztcclxuICAgICAgICAgIHd4LnByZXZpZXdJbWFnZSh7XHJcbiAgICAgICAgICAgICAgY3VycmVudDogY3VycmVudFVybCwgLy8g5b2T5YmN5pi+56S65Zu+54mH55qEaHR0cOmTvuaOpVxyXG4gICAgICAgICAgICAgIHVybHM6IFtjdXJyZW50VXJsXSAvLyDpnIDopoHpooTop4jnmoTlm77niYdodHRw6ZO+5o6l5YiX6KGoXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgZWRpdFJlY29yZChlKSB7XHJcbiAgICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvYWRkUmVjb3JkP2lkPScgKyB0aGlzLmlkICsgJyZyZWNvcmQ9JyArIEpTT04uc3RyaW5naWZ5KGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmlkKVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIOaJk+W8gOWinuWKoOWunumqjFxyXG4gICAgICBvcGVuKCkge1xyXG4gICAgICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICAgICAgdXJsOiAnL3BhZ2VzL2FkZFJlY29yZD9pZD0nICsgdGhpcy5pZFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGdldFVzZXIoZSkge1xyXG4gICAgICAgICAgdGhpcy5mb3JtRGF0YS5yZWNvcmRVc2VyID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICB9LFxyXG4gICAgICAvLyDnvJbovpHlrp7pqozkv6Hmga9cclxuICAgICAgZWRpdEZ1bigpIHtcclxuICAgICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgICAgICAgIHVybDogJy9wYWdlcy9jcmVhdGVUZXN0P2l0ZW09JyArIEpTT04uc3RyaW5naWZ5KHRoaXMuZGV0YWlscylcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgICBjaG9vc2VJbWFnZShlKSB7XHJcbiAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICB3eC5jaG9vc2VJbWFnZSh7XHJcbiAgICAgICAgICAgICAgY291bnQ6IDIsXHJcbiAgICAgICAgICAgICAgc2l6ZVR5cGU6IFsnb3JpZ2luYWwnLCAnY29tcHJlc3NlZCddLFxyXG4gICAgICAgICAgICAgIHNvdXJjZVR5cGU6IFsnYWxidW0nLCAnY2FtZXJhJ10sXHJcbiAgICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgLy8gdGVtcEZpbGVQYXRo5Y+v5Lul5L2c5Li6aW1n5qCH562+55qEc3Jj5bGe5oCn5pi+56S65Zu+54mHXHJcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBGaWxlUGF0aHMgPSByZXMudGVtcEZpbGVQYXRocztcclxuICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZW1wRmlsZVBhdGhzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBzZWxmLnVwbG9hZEl0ZW1zLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiBzZWxmLnVwbG9hZEluZGV4KyssXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogdGVtcEZpbGVQYXRoc1tpXSwgLy8g55So5LqO55u05o6l5pi+56S6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3M6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkZWQ6IGZhbHNlLCAvLyDmmK/lkKbkuIrkvKDlrozmiJBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRFcnJvcjogZmFsc2UsIC8vIOS4iuS8oOWksei0pVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJycgLy8g5LiK5Lyg5ZCO55qEVVJMXHJcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBzZWxmLnN0YXJ0VXBsb2FkKCk7XHJcbiAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBmYWlsKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIOWIoOmZpFxyXG4gICAgICBkZWxGdW4oZSkge1xyXG4gICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXHJcbiAgICAgICAgICAgICAgY29udGVudDogJ+aYr+WQpuehruiupOWIoOmZpOW9k+WJjeWunumqjOaVsOaNrj8nLFxyXG4gICAgICAgICAgICAgIGNhbmNlbFRleHQ6ICflj5bmtognLFxyXG4gICAgICAgICAgICAgIGNvbmZpcm1UZXh0OiAn56Gu6K6kJyxcclxuICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKHJlcy5jb25maXJtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBzZWxmLmZldGNoRGF0YVByb21pc2UoJ3d4L2V4cGVyaW1lbnQvZGVsZXRlRXhwZXJpbWVudFJlY29yZEFwaS5qc29uJywge2lkOiBlLnRhcmdldC5kYXRhc2V0LmlkfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZm9ybURhdGEgPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6L+U5Zue5LiK5LiK5LiA6aG1XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+WIoOmZpOaIkOWKnydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZ2V0RGVhaWxzKHNlbGYuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBmYWlsOiBmdW5jdGlvbihlcnIpIHt9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gIH07XHJcbiAgb25Mb2FkKG9wdGlvbnMpIHtcclxuICAgICAgdGhpcy5pZCA9IG9wdGlvbnMuaWQ7XHJcbiAgfVxyXG4gIHdoZW5BcHBSZWFkeVNob3coKSB7XHJcbiAgICAgIC8vIHRoaXMuZ2V0TGlzdCgpXHJcbiAgICAgIHRoaXMuZ2V0RGVhaWxzKHRoaXMuaWQpO1xyXG5cclxuICAgICAgLy8g5q+P5qyh6YO95Yi35pawXHJcbiAgfVxyXG59XHJcbiJdfQ==