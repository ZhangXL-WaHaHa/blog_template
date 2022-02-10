/**
 * 扩展 VuePress 应用
 */
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// *********************** start ***********************
/**
 * 解决中文标签跳转返回404问题
 * 参考链接：https://github.com/vuepress-reco/vuepress-theme-reco/issues/276
 * 参考文章链接：https://zxl-01.gitee.io/zxl/technology/blog/%E4%B8%AD%E6%96%87%E6%A0%87%E7%AD%BE%E8%B7%B3%E8%BD%AC%E9%97%AE%E9%A2%98.html
 * decode函数是vue-router里面的一段源码函数
 * 111
 */
import Router from 'vue-router'

function decode (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      warn(false, ("Error decoding \"" + str + "\". Leaving it intact."));
    }
  }
  return str
}
const VueRouterMatch = Router.prototype.match
Router.prototype.match = function match (raw, currentRoute, redirectedFrom) {
  if (typeof raw === 'string') {
    raw = decode(raw)
  }
  return VueRouterMatch.call(this, raw, currentRoute, redirectedFrom)
}
// *********************** end ***********************

export default ({
  Vue,
}) => {
  // ...做一些其他的应用级别的优化
  Vue.use(Element)
}
