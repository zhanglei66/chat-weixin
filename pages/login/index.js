//index.js
//获取应用实例
const app = getApp()

const request = require('../../utils/index.js')
Page({
	data: {
		username: '',
		password: ''
	},
	// 监听输入框输入
	onChange(e) {
		this.setData({
			[e.currentTarget.dataset.prop]: e.detail
		})
	},
	// 点击登录按钮,发起请求
	login() {
		let that = this
		request.post('login', {
			loginId: that.data.username,
			password: that.data.password
		}).then(res => {
			let data = res.data
			if (data.errCode == 0) {
				wx.showToast({
					title: '登录成功',
					icon: 'success',
					mask: true
				})
				wx.switchTab({
					url: '../wechat/index',
					success() {
						wx.setStorageSync('id', that.data.username)
					}
				})
			} else {
				wx.showToast({
					title: data.msg,
					icon: 'none'
				})
			}
		})
	},
	// 点击注册
	toRegister() {
		wx.navigateTo({
			url: '../register/index'
		})
	}
})
