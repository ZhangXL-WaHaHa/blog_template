/**
 * 自动生成侧边栏文件
 * 参考文章: https://segmentfault.com/a/1190000021875444
 * 相关文章: https://zxl-01.gitee.io/zxl/technology/blog/%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E4%BE%A7%E8%BE%B9%E6%A0%8F.html
 * 技术：node文件模块的相关pai函数的使用
 * 使用：在config.js中引用该文件，然后配置项 sidebar: createSideBar()
 *
 * 目录结构：
 * - technology
 * 		- 小程序
 * 			- img(该文件夹默认为白名单，不遍历生成)
 * 			- 1111.md
 * 			- 2222.md
 * 		- vue
 * 			- img(该文件夹默认为白名单，不遍历生成)
 * 			- 333.md
 * 			- 444.md
 */
const fs = require('fs') // 文件模块
const file_catalogue = {} // 最终返回的路由

module.exports = {
	/**
	 * 自动生成侧边栏
	 * @param {String} path 路径，特指存放文章的根目录
	 * @param {Array} white_path 路由白名单 表示不参与构建路由的文件名称
	 */
	createSideBar(path = 'technology', white_path = ['img']) {
		this.getFileCatalogue('/' + path, white_path)

		return this.reverse(file_catalogue)
	},

	/**
	 * 查询某一文件夹目录下的所有文件
	 * @param {string} path 文件根目录
	 * @param {Array} white_path 路由白名单 表示不参与构建路由的文件名称
	 */
	getFileCatalogue(path= '', white_path = []) {
		// 过滤掉白名单的文件
		const catagolue_list = fs.readdirSync('./docs' + path).filter(file => !white_path.includes(file))
		if (!catagolue_list.length) {
			return
		}

		// 1.找到的文件包含.md字符，判定为单一文件
		file_catalogue[path + '/'] = [
			{
				title: path.split('/')[path.split('/').length - 1],
				children: catagolue_list.filter(v => v.includes('.md')).map(file => { return file === 'README.md' || white_path.includes(file) ? '' : file.substring(0, file.length - 3) })
			}
		]

		// 2.找到的文件存在不包含.md文件，即存在文件夹，继续查找
		const folder_list = catagolue_list.filter(v => !v.includes('.md'))
		folder_list.forEach(new_path => this.getFileCatalogue(path + '/' + new_path, white_path))
	},

	/**
	 * 反序
	 */
	reverse(info) {
		let new_info = {}
		const info_keys = Object.keys(info).reverse()

		info_keys.forEach(key => {
			new_info[key] = info[key]
		})
		return new_info
	}
}
