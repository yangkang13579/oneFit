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


// import Tabbar from '../components/tabbar';
var SchemeLook = function (_wepy$page) {
    _inherits(SchemeLook, _wepy$page);

    function SchemeLook() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, SchemeLook);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SchemeLook.__proto__ || Object.getPrototypeOf(SchemeLook)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
            navigationBarBackgroundColor: '#000000',
            navigationBarTitleText: '方案预览'
        }, _this.components = {
            // tabbar: Tabbar
        }, _this.data = {
            inputvalue: '',
            resourceId: '',
            showTag: null,
            catalogs: [],
            resources: [],
            currentIndex: null,
            item: ['日常安全教育', '日常安全教育', '日常安全教育', '日常安全教育', '日常安全教育', '日教育', '日常安全教育', '日常安全教育', '日常安全教育'],
            modal: false,
            countryList: [],
            poId: [],
            id: '',
            blueprintId: '',
            downloadurl: '',
            imgUrl: [],
            disbal: false
        }, _this.methods = {
            othersTap: function othersTap(e) {
                console.log(e);
                var self = this;
                self.typeId = e.currentTarget.dataset.typeid;
                self.downloadurl = e.currentTarget.dataset.downloadurl;
                self.blueprintId = e.currentTarget.dataset.id;
                this.fetchDataPromise('user/resourceInfo.do', {
                    resourceId: self.blueprintId
                }).then(function (data) {
                    console.log('预览22 ', data);
                    self.$apply();
                });
                if (self.typeId === 'video' || self.typeId === 'class') {
                    console.log('2222');
                    wx.setStorageSync('video', self.downloadurl);
                    wx.navigateTo({
                        url: '/pages/movie'
                    });
                } else if (self.typeId === 'ppt') {
                    console.log('ppppppt');
                    console.log('self.downloadurleee', self.downloadurl);
                    wx.downloadFile({
                        url: self.downloadurl,
                        success: function success(res) {
                            console.log('resss', res);
                            self.filePath = res.tempFilePath;
                            wx.openDocument({
                                filePath: self.filePath,
                                success: function success(res) {
                                    console.log('打开文档成功', res);
                                },
                                fail: function fail(res) {
                                    console.log('打开文档失败', res);
                                }
                            });
                        }
                    });
                } else if (self.typeId === 'image') {
                    self.imgUrl.push(self.downloadurl);
                    wx.previewImage({
                        current: self.downloadurl,
                        urls: self.imgUrl
                    });
                }
                self.$apply();
            },
            closeModal: function closeModal() {
                this.modal = false;
            },
            getSearchContent: function getSearchContent(e) {
                console.log(e);
                this.inputvalue = e.detail.value;
                wx.setStorageSync('inputvalue', this.inputvalue);
                this.$apply();
            },
            save: function save(e) {
                var self = this;
                if (self.inputvalue == '') {
                    console.log('33');
                    wx.showToast({
                        title: '请填写方案名称',
                        icon: 'success',
                        duration: 2000
                    });
                } else if (self.showTag == null) {
                    console.log('44');
                    wx.showToast({
                        title: '请选择方案主题',
                        icon: 'success',
                        duration: 2000
                    });
                } else {
                    if (self.disbal == true) {} else {
                        console.log('55 ');
                        this.fetchDataPromise('user/blueprintSave.do', {
                            catalogId: self.showTag.id,
                            name: self.inputvalue,
                            resourceIds: self.poId.join(',')
                        }).then(function (data) {
                            console.log('dd', data);
                            self.disbal = true;
                            wx.showToast({
                                title: '方案保存成功',
                                icon: 'success',
                                duration: 2000
                            });
                            wx.removeStorageSync('video');
                            wx.removeStorageSync('inputvalue');
                            setTimeout(function () {
                                wx.switchTab({
                                    url: '/pages/scheme'
                                });
                            }, 2000);
                        });
                    }
                }
            },
            sure: function sure() {
                this.showTag = this.catalogs[this.currentIndex];
                this.modal = false;
                console.log(this.showTag.id);
                wx.setStorageSync('showTag', this.showTag);
            },
            titFun: function titFun(e) {
                console.log(e);
                this.currentIndex = e.currentTarget.dataset.index;
            },
            showModal: function showModal() {
                this.modal = !this.modal;
            },
            reset: function reset() {
                console.log(1);
                // this.modal = false
                this.currentIndex = null;
                this.showTag = null;
            },
            searchClick: function searchClick(e) {
                wx.navigateTo({
                    url: '/pages/search'
                });
            },
            ranking: function ranking(e) {
                wx.navigateTo({
                    url: '/pages/ranking'
                });
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(SchemeLook, [{
        key: 'delete',
        value: function _delete(e) {
            console.log(e);
            var self = this;
            self.resourceId = e.currentTarget.dataset.id;
            this.fetchDataPromise('user/blueprintResourceDelete.do', {
                resourceId: self.resourceId
            }).then(function (data) {
                console.log('删除 ', data);
                self.whenAppReadyShow();
                setTimeout(function () {
                    wx.showToast({
                        title: '删除成功',
                        icon: 'success',
                        duration: 2000
                    });
                }, 100);
            });
        }
    }, {
        key: 'onLoad',
        value: function onLoad(e) {
            console.log(e);
            this.resourceId = e.resourceId;
        }
    }, {
        key: 'whenAppReadyShow',
        value: function whenAppReadyShow() {
            wx.removeStorageSync('video');
            var self = this;
            if (!wx.getStorageSync('inputvalue')) {
                self.inputvalue = '';
                self.showTag = null;
                console.log(11111111111111111111111111111);
            } else {
                console.log(22222222222222222222);
                self.inputvalue = wx.getStorageSync('inputvalue');
            }
            if (!wx.getStorageSync('showTag')) {} else {
                self.showTag = wx.getStorageSync('showTag');
            }
            self.$apply();
            // self.inputvalue ="";
            self.poId = [];
            self.resourceId = '';

            this.fetchDataPromise('user/blueprintPreview.do', {}, {}).then(function (data) {
                console.log('data is:', data);
                self.catalogs = data.catalogs;
                self.resources = data.resources;
                for (var i = 0; i < self.resources.length; i++) {
                    self.poId.push(self.resources[i].id);
                }
                console.log('self.poId', self.poId);
                self.$apply();
                // 取前6个，增加一个more
            });
        }
    }, {
        key: 'onShareAppMessage',
        value: function onShareAppMessage(res) {
            return this.whenAppShare({
                title: '安全教育资源地图'
            });
        }
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

    return SchemeLook;
}(_wepy2.default.page);

exports.default = SchemeLook;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjaGVtZV9sb29rLmpzIl0sIm5hbWVzIjpbIlNjaGVtZUxvb2siLCJtaXhpbnMiLCJQYWdlTWl4aW4iLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsImNvbXBvbmVudHMiLCJkYXRhIiwiaW5wdXR2YWx1ZSIsInJlc291cmNlSWQiLCJzaG93VGFnIiwiY2F0YWxvZ3MiLCJyZXNvdXJjZXMiLCJjdXJyZW50SW5kZXgiLCJpdGVtIiwibW9kYWwiLCJjb3VudHJ5TGlzdCIsInBvSWQiLCJpZCIsImJsdWVwcmludElkIiwiZG93bmxvYWR1cmwiLCJpbWdVcmwiLCJkaXNiYWwiLCJtZXRob2RzIiwib3RoZXJzVGFwIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJzZWxmIiwidHlwZUlkIiwiY3VycmVudFRhcmdldCIsImRhdGFzZXQiLCJ0eXBlaWQiLCJmZXRjaERhdGFQcm9taXNlIiwidGhlbiIsIiRhcHBseSIsInd4Iiwic2V0U3RvcmFnZVN5bmMiLCJuYXZpZ2F0ZVRvIiwidXJsIiwiZG93bmxvYWRGaWxlIiwic3VjY2VzcyIsInJlcyIsImZpbGVQYXRoIiwidGVtcEZpbGVQYXRoIiwib3BlbkRvY3VtZW50IiwiZmFpbCIsInB1c2giLCJwcmV2aWV3SW1hZ2UiLCJjdXJyZW50IiwidXJscyIsImNsb3NlTW9kYWwiLCJnZXRTZWFyY2hDb250ZW50IiwiZGV0YWlsIiwidmFsdWUiLCJzYXZlIiwic2hvd1RvYXN0IiwidGl0bGUiLCJpY29uIiwiZHVyYXRpb24iLCJjYXRhbG9nSWQiLCJuYW1lIiwicmVzb3VyY2VJZHMiLCJqb2luIiwicmVtb3ZlU3RvcmFnZVN5bmMiLCJzZXRUaW1lb3V0Iiwic3dpdGNoVGFiIiwic3VyZSIsInRpdEZ1biIsImluZGV4Iiwic2hvd01vZGFsIiwicmVzZXQiLCJzZWFyY2hDbGljayIsInJhbmtpbmciLCJ3aGVuQXBwUmVhZHlTaG93IiwiZ2V0U3RvcmFnZVN5bmMiLCJpIiwibGVuZ3RoIiwid2hlbkFwcFNoYXJlIiwidHlwZSIsIm1hcmtlcklkIiwiY29udHJvbElkIiwid2VweSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUU7Ozs7QUFDQTs7Ozs7Ozs7Ozs7QUFGQTs7O0FBR0E7SUFDcUJBLFU7Ozs7Ozs7Ozs7Ozs7O2tNQUNqQkMsTSxHQUFTLENBQUNDLGNBQUQsQyxRQUNUQyxNLEdBQVM7QUFDTEMsMENBQThCLFNBRHpCO0FBRUxDLG9DQUF3QjtBQUZuQixTLFFBSVRDLFUsR0FBYTtBQUNUO0FBRFMsUyxRQUdiQyxJLEdBQU87QUFDSEMsd0JBQVksRUFEVDtBQUVIQyx3QkFBWSxFQUZUO0FBR0hDLHFCQUFTLElBSE47QUFJSEMsc0JBQVUsRUFKUDtBQUtIQyx1QkFBVyxFQUxSO0FBTUhDLDBCQUFjLElBTlg7QUFPSEMsa0JBQU0sQ0FBQyxRQUFELEVBQVcsUUFBWCxFQUFxQixRQUFyQixFQUErQixRQUEvQixFQUF5QyxRQUF6QyxFQUFtRCxLQUFuRCxFQUEwRCxRQUExRCxFQUFvRSxRQUFwRSxFQUE4RSxRQUE5RSxDQVBIO0FBUUhDLG1CQUFPLEtBUko7QUFTSEMseUJBQWEsRUFUVjtBQVVIQyxrQkFBTSxFQVZIO0FBV0hDLGdCQUFJLEVBWEQ7QUFZSEMseUJBQWEsRUFaVjtBQWFIQyx5QkFBYSxFQWJWO0FBY0hDLG9CQUFRLEVBZEw7QUFlSEMsb0JBQVE7QUFmTCxTLFFBaUJQQyxPLEdBQVU7QUFDTkMscUJBRE0scUJBQ0lDLENBREosRUFDTztBQUNUQyx3QkFBUUMsR0FBUixDQUFZRixDQUFaO0FBQ0Esb0JBQUlHLE9BQU8sSUFBWDtBQUNBQSxxQkFBS0MsTUFBTCxHQUFjSixFQUFFSyxhQUFGLENBQWdCQyxPQUFoQixDQUF3QkMsTUFBdEM7QUFDQUoscUJBQUtSLFdBQUwsR0FBbUJLLEVBQUVLLGFBQUYsQ0FBZ0JDLE9BQWhCLENBQXdCWCxXQUEzQztBQUNBUSxxQkFBS1QsV0FBTCxHQUFtQk0sRUFBRUssYUFBRixDQUFnQkMsT0FBaEIsQ0FB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S1gsSUFBTCxDQUFVOEIsSUFBVixDQUFlbkIsS0FBS2hCLFNBQUwsQ0FBZWdFLENBQWYsRUFBa0IxRCxFQUFqQztBQUNIO0FBQ0RRLHdCQUFRQyxHQUFSLENBQVksV0FBWixFQUF5QkMsS0FBS1gsSUFBOUI7QUFDQVcscUJBQUtPLE1BQUw7QUFDQTtBQUNILGFBVkQ7QUFXUDs7OzBDQUNpQk8sRyxFQUFLO0FBQ2YsbUJBQU8sS0FBS29DLFlBQUwsQ0FBa0I7QUFDckJyQix1QkFBTztBQURjLGFBQWxCLENBQVA7QUFHUDs7O3FDQUNZaEMsQyxFQUFHO0FBQ1JDLG9CQUFRQyxHQUFSLENBQVlGLEVBQUVzRCxJQUFkO0FBQ1A7OztrQ0FDU3RELEMsRUFBRztBQUNMQyxvQkFBUUMsR0FBUixDQUFZRixFQUFFdUQsUUFBZDtBQUNQOzs7bUNBQ1V2RCxDLEVBQUc7QUFDTkMsb0JBQVFDLEdBQVIsQ0FBWUYsRUFBRXdELFNBQWQ7QUFDUDs7OztFQXJPdUNDLGVBQUtDLEk7O2tCQUF4Qm5GLFUiLCJmaWxlIjoic2NoZW1lX2xvb2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuICAvKiBnbG9iYWwgd3ggKi9cclxuICBpbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcclxuICBpbXBvcnQgUGFnZU1peGluIGZyb20gJy4uL21peGlucy9wYWdlJztcclxuICAvLyBpbXBvcnQgVGFiYmFyIGZyb20gJy4uL2NvbXBvbmVudHMvdGFiYmFyJztcclxuICBleHBvcnQgZGVmYXVsdCBjbGFzcyBTY2hlbWVMb29rIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICAgICAgbWl4aW5zID0gW1BhZ2VNaXhpbl07XHJcbiAgICAgIGNvbmZpZyA9IHtcclxuICAgICAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjMDAwMDAwJyxcclxuICAgICAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfmlrnmoYjpooTop4gnLFxyXG4gICAgICB9O1xyXG4gICAgICBjb21wb25lbnRzID0ge1xyXG4gICAgICAgICAgLy8gdGFiYmFyOiBUYWJiYXJcclxuICAgICAgfTtcclxuICAgICAgZGF0YSA9IHtcclxuICAgICAgICAgIGlucHV0dmFsdWU6ICcnLFxyXG4gICAgICAgICAgcmVzb3VyY2VJZDogJycsXHJcbiAgICAgICAgICBzaG93VGFnOiBudWxsLFxyXG4gICAgICAgICAgY2F0YWxvZ3M6IFtdLFxyXG4gICAgICAgICAgcmVzb3VyY2VzOiBbXSxcclxuICAgICAgICAgIGN1cnJlbnRJbmRleDogbnVsbCxcclxuICAgICAgICAgIGl0ZW06IFsn5pel5bi45a6J5YWo5pWZ6IKyJywgJ+aXpeW4uOWuieWFqOaVmeiCsicsICfml6XluLjlronlhajmlZnogrInLCAn5pel5bi45a6J5YWo5pWZ6IKyJywgJ+aXpeW4uOWuieWFqOaVmeiCsicsICfml6XmlZnogrInLCAn5pel5bi45a6J5YWo5pWZ6IKyJywgJ+aXpeW4uOWuieWFqOaVmeiCsicsICfml6XluLjlronlhajmlZnogrInXSxcclxuICAgICAgICAgIG1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgIGNvdW50cnlMaXN0OiBbXSxcclxuICAgICAgICAgIHBvSWQ6IFtdLFxyXG4gICAgICAgICAgaWQ6ICcnLFxyXG4gICAgICAgICAgYmx1ZXByaW50SWQ6ICcnLFxyXG4gICAgICAgICAgZG93bmxvYWR1cmw6ICcnLFxyXG4gICAgICAgICAgaW1nVXJsOiBbXSxcclxuICAgICAgICAgIGRpc2JhbDogZmFsc2VcclxuICAgICAgfVxyXG4gICAgICBtZXRob2RzID0ge1xyXG4gICAgICAgICAgb3RoZXJzVGFwKGUpIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgc2VsZi50eXBlSWQgPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC50eXBlaWQ7XHJcbiAgICAgICAgICAgICAgc2VsZi5kb3dubG9hZHVybCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmRvd25sb2FkdXJsO1xyXG4gICAgICAgICAgICAgIHNlbGYuYmx1ZXByaW50SWQgPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pZDtcclxuICAgICAgICAgICAgICB0aGlzLmZldGNoRGF0YVByb21pc2UoJ3VzZXIvcmVzb3VyY2VJbmZvLmRvJywge1xyXG4gICAgICAgICAgICAgICAgICByZXNvdXJjZUlkOiBzZWxmLmJsdWVwcmludElkLFxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfpooTop4gyMiAnLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIGlmIChzZWxmLnR5cGVJZCA9PT0gJ3ZpZGVvJyB8fCBzZWxmLnR5cGVJZCA9PT0gJ2NsYXNzJykge1xyXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnMjIyMicpO1xyXG4gICAgICAgICAgICAgICAgICB3eC5zZXRTdG9yYWdlU3luYygndmlkZW8nLCBzZWxmLmRvd25sb2FkdXJsKTtcclxuICAgICAgICAgICAgICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvbW92aWUnXHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZi50eXBlSWQgPT09ICdwcHQnKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwcHBwcHB0Jyk7XHJcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZWxmLmRvd25sb2FkdXJsZWVlJywgc2VsZi5kb3dubG9hZHVybCk7XHJcbiAgICAgICAgICAgICAgICAgIHd4LmRvd25sb2FkRmlsZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICB1cmw6IHNlbGYuZG93bmxvYWR1cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncmVzc3MnLCByZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZmlsZVBhdGggPSByZXMudGVtcEZpbGVQYXRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHd4Lm9wZW5Eb2N1bWVudCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVQYXRoOiBzZWxmLmZpbGVQYXRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfmiZPlvIDmlofmoaPmiJDlip8nLCByZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWlsOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfmiZPlvIDmlofmoaPlpLHotKUnLCByZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZi50eXBlSWQgPT09ICdpbWFnZScpIHtcclxuICAgICAgICAgICAgICAgICAgc2VsZi5pbWdVcmwucHVzaChzZWxmLmRvd25sb2FkdXJsKTtcclxuICAgICAgICAgICAgICAgICAgd3gucHJldmlld0ltYWdlKHtcclxuICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQ6IHNlbGYuZG93bmxvYWR1cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgICB1cmxzOiBzZWxmLmltZ1VybFxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjbG9zZU1vZGFsKCkge1xyXG4gICAgICAgICAgICAgIHRoaXMubW9kYWwgPSBmYWxzZTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBnZXRTZWFyY2hDb250ZW50KGUpIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgICAgICB0aGlzLmlucHV0dmFsdWUgPSBlLmRldGFpbC52YWx1ZTtcclxuICAgICAgICAgICAgICB3eC5zZXRTdG9yYWdlU3luYygnaW5wdXR2YWx1ZScsIHRoaXMuaW5wdXR2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzYXZlKGUpIHtcclxuICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgaWYgKHNlbGYuaW5wdXR2YWx1ZSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnMzMnKTtcclxuICAgICAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn6K+35aGr5YaZ5pa55qGI5ZCN56ewJyxcclxuICAgICAgICAgICAgICAgICAgICAgIGljb246ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyMDAwXHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZi5zaG93VGFnID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJzQ0Jyk7XHJcbiAgICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+ivt+mAieaLqeaWueahiOS4u+mimCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnc3VjY2VzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjAwMFxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoc2VsZi5kaXNiYWwgPT0gdHJ1ZSkge1xyXG4gIFxyXG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJzU1ICcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKCd1c2VyL2JsdWVwcmludFNhdmUuZG8nLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0YWxvZ0lkOiBzZWxmLnNob3dUYWcuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogc2VsZi5pbnB1dHZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlSWRzOiBzZWxmLnBvSWQuam9pbignLCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2RkJywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZGlzYmFsID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5pa55qGI5L+d5a2Y5oiQ5YqfJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyMDAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3eC5yZW1vdmVTdG9yYWdlU3luYygndmlkZW8nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3gucmVtb3ZlU3RvcmFnZVN5bmMoJ2lucHV0dmFsdWUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHd4LnN3aXRjaFRhYih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnL3BhZ2VzL3NjaGVtZSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAyMDAwKTtcclxuICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICB9LFxyXG4gICAgICAgICAgc3VyZSgpIHtcclxuICAgICAgICAgICAgICB0aGlzLnNob3dUYWcgPSB0aGlzLmNhdGFsb2dzW3RoaXMuY3VycmVudEluZGV4XTtcclxuICAgICAgICAgICAgICB0aGlzLm1vZGFsID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5zaG93VGFnLmlkKTtcclxuICAgICAgICAgICAgICB3eC5zZXRTdG9yYWdlU3luYygnc2hvd1RhZycsIHRoaXMuc2hvd1RhZyk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgdGl0RnVuKGUpIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4O1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNob3dNb2RhbCgpIHtcclxuICAgICAgICAgICAgICB0aGlzLm1vZGFsID0gIXRoaXMubW9kYWw7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgcmVzZXQoKSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coMSk7XHJcbiAgICAgICAgICAgICAgLy8gdGhpcy5tb2RhbCA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50SW5kZXggPSBudWxsO1xyXG4gICAgICAgICAgICAgIHRoaXMuc2hvd1RhZyA9IG51bGw7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgc2VhcmNoQ2xpY2soZSkge1xyXG4gICAgICAgICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvc2VhcmNoJ1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHJhbmtpbmcoZSkge1xyXG4gICAgICAgICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvcmFua2luZydcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICB9O1xyXG4gIGRlbGV0ZShlKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgIHNlbGYucmVzb3VyY2VJZCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmlkO1xyXG4gICAgICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKCd1c2VyL2JsdWVwcmludFJlc291cmNlRGVsZXRlLmRvJywge1xyXG4gICAgICAgICAgICAgIHJlc291cmNlSWQ6IHNlbGYucmVzb3VyY2VJZFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfliKDpmaQgJywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgIHNlbGYud2hlbkFwcFJlYWR5U2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+WIoOmZpOaIkOWKnycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyMDAwXHJcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICB9XHJcbiAgb25Mb2FkKGUpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgdGhpcy5yZXNvdXJjZUlkID0gZS5yZXNvdXJjZUlkO1xyXG4gIH1cclxuICB3aGVuQXBwUmVhZHlTaG93KCkge1xyXG4gICAgICAgICAgd3gucmVtb3ZlU3RvcmFnZVN5bmMoJ3ZpZGVvJyk7XHJcbiAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICBpZiAoIXd4LmdldFN0b3JhZ2VTeW5jKCdpbnB1dHZhbHVlJykpIHtcclxuICAgICAgICAgICAgICBzZWxmLmlucHV0dmFsdWUgPSAnJztcclxuICAgICAgICAgICAgICBzZWxmLnNob3dUYWcgPSBudWxsO1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKDExMTExMTExMTExMTExMTExMTExMTExMTExMTExKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coMjIyMjIyMjIyMjIyMjIyMjIyMjIpO1xyXG4gICAgICAgICAgICAgIHNlbGYuaW5wdXR2YWx1ZSA9IHd4LmdldFN0b3JhZ2VTeW5jKCdpbnB1dHZhbHVlJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoIXd4LmdldFN0b3JhZ2VTeW5jKCdzaG93VGFnJykpIHtcclxuICBcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgc2VsZi5zaG93VGFnID0gd3guZ2V0U3RvcmFnZVN5bmMoJ3Nob3dUYWcnKTtcclxuXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBzZWxmLiRhcHBseSgpO1xyXG4gICAgICAgICAgLy8gc2VsZi5pbnB1dHZhbHVlID1cIlwiO1xyXG4gICAgICAgICAgc2VsZi5wb0lkID0gW107XHJcbiAgICAgICAgICBzZWxmLnJlc291cmNlSWQgPSAnJztcclxuICBcclxuICAgICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgndXNlci9ibHVlcHJpbnRQcmV2aWV3LmRvJywge30sIHt9KS50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkYXRhIGlzOicsIGRhdGEpO1xyXG4gICAgICAgICAgICAgIHNlbGYuY2F0YWxvZ3MgPSBkYXRhLmNhdGFsb2dzO1xyXG4gICAgICAgICAgICAgIHNlbGYucmVzb3VyY2VzID0gZGF0YS5yZXNvdXJjZXM7XHJcbiAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxmLnJlc291cmNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICBzZWxmLnBvSWQucHVzaChzZWxmLnJlc291cmNlc1tpXS5pZCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZWxmLnBvSWQnLCBzZWxmLnBvSWQpO1xyXG4gICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgLy8g5Y+W5YmNNuS4qu+8jOWinuWKoOS4gOS4qm1vcmVcclxuICAgICAgICAgIH0pO1xyXG4gIH1cclxuICBvblNoYXJlQXBwTWVzc2FnZShyZXMpIHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLndoZW5BcHBTaGFyZSh7XHJcbiAgICAgICAgICAgICAgdGl0bGU6ICflronlhajmlZnogrLotYTmupDlnLDlm74nXHJcbiAgICAgICAgICB9KTtcclxuICB9XHJcbiAgcmVnaW9uY2hhbmdlKGUpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGUudHlwZSk7XHJcbiAgfVxyXG4gIG1hcmtlcnRhcChlKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhlLm1hcmtlcklkKTtcclxuICB9XHJcbiAgY29udHJvbHRhcChlKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhlLmNvbnRyb2xJZCk7XHJcbiAgfVxyXG4gIH1cclxuIl19