//index.js
//获取应用实例
const app = getApp()

const request = require('../../utils/index.js')
Page({
	data: {
		loginUser: {
			id: '',
			name: '',
			head_img: ''
		}
	},
	onLoad() {
		let that = this
		let id = wx.getStorageSync('id')
		request.get('getOneUser', {
			id: id
		}).then(res => {
			let data = res.data
			let obj = {
				id: data.info[0].loginId,
				name: data.info[0].name,
				head_img: data.info[0].head_img
			}
			that.setData({
				loginUser: obj
			})
		})
	},
	logout() {
		wx.setStorageSync('id', '')
		wx.setStorageSync('socket', '')
		wx.setStorageSync('head_img', '')
		wx.closeSocket({
			code: 1000
		})
		wx.reLaunch({
			url: '../login/index'
		})
	}
})
