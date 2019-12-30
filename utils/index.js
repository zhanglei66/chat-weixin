let url_ = "http://zhugeleilei.com:8081/"

let get = (url, data) => {
	url = url_ + url
	return new Promise((resolve, reject) => {
		wx.request({
			url: url,
			data: data,
			method: 'GET',
			success(res) {
				if (res.statusCode == 200) {
					resolve(res)
				} else {
					reject(res.data)
				}
			},
			fail() {
				reject('网络出错')
			}
		})
	})
}

let post = (url, data) => {
	url = url_ + url
	return new Promise((resolve, reject) => {
		wx.request({
			url: url,
			data: data,
			method: 'POST',
			success(res) {
				if (res.statusCode == 200) {
					resolve(res)
				} else {
					reject(res.data)
				}
			},
			fail() {
				reject('网络出错')
			}
		})
	})
}

module.exports = {
	post,
	get
}
