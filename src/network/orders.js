import { request } from "./request";

//订单数据列表
export function getOrders(queryInfo) {
  return request({
    url: '/orders',
    methods: 'get',
    params: {
      query: queryInfo.query, 
      pagenum: queryInfo.pagenum,
      pagesize: queryInfo.pagesize, 
    }
  })
}
// 物流进度测试接口 已废弃
export function getLogistics() {
  return request({
    url: '/kuaidi/1106975712662',
    methods: 'get',

  })
}