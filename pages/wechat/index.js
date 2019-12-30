//index.js
//获取应用实例
const app = getApp()

const request = require('../../utils/index.js')
Page({
	data: {
		lists: [],
		nowLogin: {
			id: '',
			head_img: ''
		},
		chatObj: {
			id: '',
			head_img: ''
		},
		socket: ''
	},
	onChange(e) {
		this.setData({
			[e.currentTarget.dataset.prop]: e.detail
		})
	},
	onLoad() {
		let that = this
		// 获取缓存的登录id
		let id = wx.getStorageSync('id')
		// let id = '123456'
		that.setData({
			'nowLogin.id': id
		})
		// 获取登录者信息
		request.get('getOneUser', {
			id: that.data.nowLogin.id
		}).then(res => {
			console.log(res.data)
			let data = res.data
			that.setData({
				'nowLogin.head_img': data.info[0].head_img
			})
			wx.setStorageSync('head_img', data.info[0].head_img)
		})
		// 发起websocket连接,监听socket事件
		that.init()
		that.getFriendRequest()
	},
	onShow() {
		let that = this
		request.get('getfriends', {
			loginId: that.data.nowLogin.id
		}).then(res => {
			if(res.data.errCode == 0) {
				console.log(res.data)
				let data = res.data
				that.setData({
					lists: data.data
				})
			}
		})
		this.setData({
			['chatObj.id']: '',
			['chatObj.head_img']: ''
		})
	},
	getRecords: function(e) {
		let that = this
		let chatObjId = e.currentTarget.dataset.id
		let head_img = e.currentTarget.dataset.head_img
		that.setData({
			chatObj: {
				id: chatObjId,
				head_img: head_img
			}
		})
		let nowLoginId = that.data.nowLogin.id
		let nowLoginImg = that.data.nowLogin.head_img
		wx.navigateTo({
			url: '../chatRecord/index?nowLoginId=' + nowLoginId + '&nowLoginImg=' + nowLoginImg + '&chatObjId=' + chatObjId +
				'&head_img=' + head_img
		})
		that.clearNotRead(chatObjId)
	},
	init() {
		let that = this
		let socket = wx.connectSocket({
			url: 'ws://zhugeleilei.com:8081/socket/chatSocket?id=' + that.data.nowLogin.id,
		})
		that.setData({
			socket: socket
		})
		// 监听socket连接
		that.data.socket.onOpen(function() {
			console.log('socket连接成功')
			wx.setStorageSync('socket', that.data.socket)
		})
		that.data.socket.onMessage(that.getMsg)
		wx.onSocketClose(function() {
			wx.setStorageSync('socket', '')
		})
	},
	// 监听消息
	getMsg: function(res) {
		let that = this
		let data = JSON.parse(res.data)
		if(data.type == 1) {
			wx.setTabBarBadge({
				index: 1,
				text: '1'
			})
			return
		}
		let lists = that.data.lists
		if (that.data.chatObj.id == '') {
			for (let i = 0; i < lists.length; i++) {
				if (lists[i].loginId == data.sendId) {
					let index = 'lists[' + i + '].notSendNum'
					that.setData({
						[index]: lists[i].notSendNum + 1
					})
				}
			}
		}
	},
	// 点击未读消息后,使消息已读
	clearNotRead(id) {
		let that = this
		let lists = that.data.lists
		request.post('clearUnread', {
			sendId: id
		}).then(res => {
			for (let i = 0; i < lists.length; i++) {
				if (lists[i].loginId == id) {
					let index = 'lists[' + i + '].notSendNum'
					that.setData({
						[index]: 0
					})
				}
			}
		})
	},
	// 查询是否有好友申请
	getFriendRequest() {
		let that = this
		request.get('friends/getFriendRequest', {
			id: that.data.nowLogin.id
		}).then(res => {
			if (res.data.errCode == 0) {
				if (res.data.info.length > 0) {
					wx.setTabBarBadge({
						index: 1,
						text: ''+res.data.info.length
					})
				}
			}
		})
	}
})
