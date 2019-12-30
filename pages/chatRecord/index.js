//index.js
//获取应用实例
const app = getApp()

const request = require('../../utils/index.js')
Page({
	data: {
		message: '',
		lists: [],
		nowLogin: {
			id: '',
			head_img: ''
		},
		chatObj: {
			id: '',
			head_img: ''
		},
		show: true,
		socket: '',
		top: '0'
	},
	onLoad(options) {
		this.setData({
			'nowLogin.id': options.nowLoginId,
			'nowLogin.head_img': options.nowLoginImg,
			'chatObj.id': options.chatObjId,
			'chatObj.head_img': options.head_img
		})
		this.setData({
			socket: wx.getStorageSync('socket')
		})
		console.log(this.data.socket)
		this.init()
		wx.onSocketMessage(this.getMsg)
	},
	onShow() {
	},
	onChange(e) {
		this.setData({
			[e.currentTarget.dataset.prop]: e.detail
		})
	},
	onUnload() {
		wx.switchTab({
			url: '../wechat/index'
		})
	},
	init() {
		let that = this
		request.get('getMsg', {
			id1: that.data.nowLogin.id,
			id2: that.data.chatObj.id
		}).then(res => {
			let data = res.data
			that.setData({
				lists: data.data
			})
			for(let i=0 ; i<that.data.lists.length ; i++) {
				if(that.data.lists[i].sendId == that.data.chatObj.id) {
					let control = 'lists['+i+'].control'
					let head_img = 'lists['+i+'].head_img'
					that.setData({
						[control]: 'left',
						[head_img]: that.data.chatObj.head_img
					})
				} else {
					let control = 'lists['+i+'].control'
					let head_img = 'lists['+i+'].head_img'
					that.setData({
						[control]: 'right',
						[head_img]: that.data.nowLogin.head_img
					})
				}
			}
			that.setData({
				show: false,
				top: that.data.lists.length*10000
			})
		})
	},
	sendMsg() {
		let that = this
		let obj = {
			sendId: that.data.nowLogin.id,
			receiveId: that.data.chatObj.id,
			msg: that.data.message
		}
		wx.sendSocketMessage({
			data: JSON.stringify(obj)
		})
		obj.control = 'right'
		obj.head_img = that.data.nowLogin.head_img
		that.setData({
			lists: that.data.lists.concat([obj]),
			top: that.data.lists.length*1000,
			message: ''
		})
	},
	getMsg: function (res) {
		let self = this
		let data = JSON.parse(res.data)
		if(self.route == 'pages/chatRecord/index') {
			let obj = {
				control: 'left',
				head_img: self.data.chatObj.head_img,
				sendId: data.sendId,
				msg: data.msg
			}
			self.setData({
				lists: self.data.lists.concat([obj]),
				top: self.data.lists.length*1000
			})
		}
	}
})
