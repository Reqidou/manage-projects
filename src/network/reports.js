import { request } from "./request";
//获取这折线图数据
export function getReport() {
  return request({
    url: '/reports/type/1',
    method: 'get'
  })
}