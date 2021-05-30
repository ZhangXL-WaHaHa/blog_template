module.exports = {
	title: "Zhang XL",
	description: 'Hope have a good sleep',
	base: '/zxl/',
	serviceWorker: true,
	head: [
		['link', {
			rel: 'icon',
			href: '/img/logo.jpg'
		}]
	],
	markdown: {
		// 显示代码行号
		lineNumbers: false
	},
	theme: 'reco',
	themeConfig: {
		nav: [{
				text: 'csdn',
				link: 'https://blog.csdn.net/weixin_44113868?spm=1001.2100.3001.5343',
				icon: 'reco-csdn'
			},
			{
				text: 'Github',
				link: 'https://github.com/ZhangXL-WaHaHa',
				icon: 'reco-github'
			},
		],
		author: 'Zhang XL',
		authorAvatar: '/img/logo.jpg',
		docsDir: '/',
		lastUpdated: 'Last Updated',
		smoothScroll: true,
		type: 'blog',
		blogConfig: {
			category: {
				location: 3, // 在导航栏菜单中所占的位置，默认2
				text: '分类' // 默认文案 “分类”
			},
		},
		// 自动形成侧边导航
		subSidebar: 'auto',
		sidebarDepth: 1,
		sidebar: {
			'/technology/blog/': [
				{
					title: "博客声明",
					children: [
						''
					]
				},
			],

			'/technology/applet/': [{
					title: '小程序开发总结',
					children: [
						'',
						'购物车小球',
						'优化透明渐变导航栏',
						'滑动日历',
						'下载保存文件到本地',
						'小程序性能优化指南',
						'小程序云开发第一次尝试总结',
						'关于小程序国际化设置'
					]
				}
			],
			
			'/technology/vue/': [
				{
					title: "vue开发总结",
					children: [
						'',
						'vue项目中代码规范',
						'在vue项目中使用mock'
					]
				},
			],
			
			'/technology/js/': [
				{
					title: 'js操作相关',
					children: [
						'',
						'前端规范',
						'网页输出二维码扫描器扫描到的值'
					]
				}
			] 
		}
	},
}
