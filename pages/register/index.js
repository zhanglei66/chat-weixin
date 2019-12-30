//index.js
//获取应用实例
const app = getApp()

Page({
	data: {
		username: '',
		password: ''
	},
	onChange(e) {
		this.setData({
			[e.currentTarget.dataset.prop]: e.detail
		})
	},
	register() {
		wx.request({
			url: 'http://localhost:8081/zhuce',
			method: 'POST',
			data: {
				loginId: this.data.username,
				password: this.data.password
			},
			success(res) {
				wx.showToast({
					title: '注册成功',
					icon: 'success',
					mask: true
				})
				wx.redirectTo({
					url: '../login.index'
				})
			}
		})
	},
})
