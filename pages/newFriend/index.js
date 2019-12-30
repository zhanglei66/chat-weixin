//index.js
//获取应用实例
const app = getApp()

const request = require('../../utils/index.js')

Page({
	data: {
		user: {
			id: '',
			name: '',
			head_img: ''
		},
		input: '',
		items: []
	},
	onLoad() {
		this.getFriendRequest()
	},
	onChange: function(e) {
		this.setData({
			[e.currentTarget.dataset.prop]: e.detail
		})
	},
	searchUser() {
		let that = this
		request.get('getOneUser', {
			id: that.data.input
		}).then(res => {
			let data = res.data
			if (data.errCode == '-1') {
				that.setData({
					['user.id']: '',
					['user.name']: '',
					['user.head_img']: ''
				})
				wx.showToast({
					title: '查无此人',
					image: '../../dist/cuowu.png'
				})
			} else {
				that.setData({
					'user.head_img': data.info[0].head_img,
					'user.name': data.info[0].name,
					'user.id': data.info[0].loginId
				})
			}
		})
	},
	addFriend() {
		let that = this
		wx.showModal({
			content: '是否发送添加好友申请?',
			confirmColor: '#008B00',
			success(res) {
				if (res.confirm) {
					let obj = {
						type: 1,
						sendId: wx.getStorageSync('id'),
						receiveId: that.data.user.id
					}
					wx.sendSocketMessage({
						data: JSON.stringify(obj)
					})
					that.setData({
						['user.id']: '',
						['user.name']: '',
						['user.head_img']: ''
					})
				}
				wx.showToast({
					title: '发送成功',
					icon: 'success'
				})
			}
		})
	},
	// 获取是否有人添加我为好友
	getFriendRequest() {
		let that = this
		request.get('friends/getFriendRequest', {
			id: wx.getStorageSync('id')
		}).then(res => {
			if (res.data.errCode == 0) {
				if (res.data.info.length > 0) {
					that.setData({
						items: []
					})
					// that.setData({
					// 	items: res.data.info
					// })
					for (let i = 0; i < res.data.info.length; i++) {
						request.get('getOneUser', {
							id: res.data.info[i].sendId
						}).then(ress => {
							that.setData({
								['items['+i+'].id']: ress.data.info[0].loginId,
								['items['+i+'].head_img']: ress.data.info[0].head_img,
								['items['+i+'].name']: ress.data.info[0].name,
							})
						})
					}
				} else {
					that.setData({
						items: []
					})
				}
			}
		})
	},
	// 同意对方添加我为好友
	accept_req: function(e) {
		let that = this
		request.get('friends/acceptRequest', {
			sendId: e.currentTarget.dataset.id,
			receiveId: wx.getStorageSync('id')
		}).then(res => {
			that.getFriendRequest()
		})
	}
	// debounce(fn, interval) {
	// 	var timer;
	// 	var gapTime = interval || 1000; //间隔时间，如果interval不传，则默认1000ms
	// 	return function() {
	// 		clearTimeout(timer);
	// 		var context = this;
	// 		var args = arguments; //保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
	// 		timer = setTimeout(function() {
	// 			fn.call(context, args);
	// 		}, gapTime);
	// 	};
	// }
})
