//index.js
//获取应用实例
const app = getApp()

const request = require('../../utils/index.js')

Page({
	data: {
		id: '',
		items: [],
		friendReqNum: 0
	},
	onLoad() {
		this.setData({
			id: wx.getStorageSync('id')
		})
	},
	onShow() {
		this.getFriendRequest()
		this.getFriendList()
	},
	getFriendList() {
		let that = this
		request.get('friends/searchMyFriends', {
			id: that.data.id
		}).then(res => {
			if(res.data.errCode == 0) {
				that.setData({
					items: res.data.info
				})
			}
		})
	},
	toChat: function (e) {
		let that = this
		let chatObjId = e.currentTarget.dataset.id
		let head_img = e.currentTarget.dataset.head_img
		that.setData({
			chatObj: {
				id: chatObjId,
				head_img: head_img
			}
		})
		let nowLoginId = wx.getStorageSync('id')
		let nowLoginImg = wx.getStorageSync('head_img')
		wx.navigateTo({
			url: '../chatRecord/index?nowLoginId=' + nowLoginId + '&nowLoginImg=' + nowLoginImg + '&chatObjId=' + chatObjId +
				'&head_img=' + head_img
		})
	},
	toNewFriend() {
		wx.navigateTo({
			url: '../newFriend/index'
		})
	},
	// 获取是否有人添加我为好友
	getFriendRequest() {
		let that = this
		request.get('friends/getFriendRequest', {
			id: that.data.id
		}).then(res => {
			if (res.data.errCode == 0) {
				if (res.data.info.length > 0) {
					that.setData({
						friendReqNum: res.data.info.length
					})
				} else {
					that.setData({
						friendReqNum: 0
					})
					wx.removeTabBarBadge({
						index: 1
					})
				}
			}
		})
	}
})
