import {request} from './request'
import qs from 'qs';
// 我们可以将相关的网络请求都放在一个js中，这样再使用和修改的时候就方便查找了。其中get请求比较简单，post 的请求根据传对象输类型不同，要做不同设置。
// 现在来说说post请求常见的数据格式（content-type）
// Content-Type: application/json ： 请求体中的数据会以json字符串的形式发送到后端，这种是axios默认的请求数据类型，我们只需将参数序列化json字符串进行传递即可，无需多余的配置。
// Content-Type: application/x-www-form-urlencoded：请求体中的数据会以普通表单形式（键值对）发送到后端
// Content-Type: multipart/form-data： 它会将请求体的数据处理为一条消息，以标签为单元，用分隔符分开。既可以上传键值对，也可以上传文件。

export function checkLogin(username, password) {
  return request ({
    url: '/login',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    method: 'post',
    // 忽略了axios 的原理，post 请求发送的数据如果是对象的话，会自动转换为json 格式，post 请求一般是表单格式，你需要利用拦截器对请求进行拦截，可以使用qs.string 序列化数据，还有一种情况，上传文件的格式是multipart 格式，序列化数据会有问题，要使用功能检查，不同序列化样式也不一样
    // qs.parse()是将URL解析成对象的形式
    // qs.stringify()是将对象 序列化成URL的形式，以&进行拼接
    data: qs.stringify({username, password}),//转换参数
  })
}