import axios from 'axios'

export function request(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 5000,
    
    // 跨域请求时是否传递cookies
	  // withCredentials: true,
  })
  // return instance
// request拦截器
instance.interceptors.request.use(config => {
    //... 获取token，存储token 等操作
		//为请求头添加token验证的Antuorization字段
		config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  }, error => {
    console.log(error)
    Promise.reject(error)
  })

  // respone拦截器
  instance.interceptors.response.use(
    response => {
      // ....
        return response.data
    },
    error => {
      // ....
      return Promise.reject(error)
      // error => {
	// 	console.log('拦截器响应失败')
	// 	console.log(error)
	// 	if(error.request){
	// 		console.log(error.request)
	// 	} else if(error.response){
	// 		console.log(error.response.data);
	// 		console.log(error.response.status);
	// 	}
	// 	if (error && error.response) {
	// 		switch (error.response.status) {
	// 			case 400: error.message = '请求错误(400)'; 
	// 				break;
	// 			case 401: error.message = '未授权，请重新登录(401)';
	// 				break;
	// 			case 403: error.message = '拒绝访问(403)';
	// 				break;
	// 			case 404: error.message = '请求出错(404)'; 
	// 				break;
	// 			case 408: error.message = '请求超时(408)'; 
	// 				break;
	// 			case 500: error.message = '服务器错误(500)'; 
	// 				break;
	// 			case 501: error.message = '服务未实现(501)'; 
	// 				break;
	// 			case 502: error.message = '网络错误(502)'; 
	// 				break;
	// 			case 503: error.message = '服务不可用(503)'; 
	// 				break;
	// 			case 504: error.message = '网络超时(504)'; 
	// 				break;
	// 			case 505: error.message = 'HTTP版本不受支持(505)';
	// 				break;
	// 			default: error.message = '连接出错'(${error.response.status})!;
	// 		}
	// 	}else{
	// 		error.message ='连接服务器失败!'
	// 	}
	// 	return Promise.reject(error)
	// }
    }
  )


  // 3.发送真正的网络请求
  return instance(config)
}