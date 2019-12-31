//index.js
//获取应用实例
const app = getApp()

const request = require('../../utils/index.js')
Page({
	data: {
		username: '',
		password: '',
		name: ''
	},
	onChange(e) {
		this.setData({
			[e.currentTarget.dataset.prop]: e.detail
		})
	},
	register() {
		request.post('zhuce', {
			loginId: this.data.username,
			password: this.data.password,
			name: this.data.name
		}).then(res => {
			wx.showToast({
				title: '注册成功',
				icon: 'success',
				mask: true
			})
			wx.redirectTo({
				url: '../login.index'
			})
		})
	},
})
