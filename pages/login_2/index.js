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
	login() {
		let that = this
		wx.request({
			url: 'http://localhost:8081/login',
			method: 'POST',
			data: {
				loginId: that.data.username,
				password: that.data.password
			},
			success(res) {
				let data = res.data
				if(data.errCode == 0) {
					wx.showToast({
						title: '登录成功',
						icon: 'success',
						mask: true
					})
					wx.redirectTo({
						url: '../index/index?id='+that.data.username
					})
				}
			}
		})
	},
	toRegister() {
		wx.navigateTo({
			url: '../register/index'
		})
	}
})
