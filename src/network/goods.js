import { request } from "./request";
// 获取所有类型分类
export function getCategories(queryInfo) {
  return request({
    url: '/categories',
    method: 'get',
    params: {
      type: queryInfo.type,
      pagenum: queryInfo.pagenum,
      pagesize: queryInfo.pagesize,
    }
  })
}
// 添加分类
export function addCategories(queryInfo) {
  return request({
    url: '/categories',
    method: 'post',
    data: {
      cat_pid: queryInfo.cat_pid,
      cat_name: queryInfo.cat_name,
      cat_level: queryInfo.cat_level,
    }
  })
}
// 修改分类
export function editCategories(id, cat_name) {
  return request ({
    url: '/categories/' + id,
    data: {
      cat_name,
    },
    method: 'put'
  })
}
//删除分类
export function delCategories(id) {
  return request({
    url: '/categories/' + id,
    method: 'delete'
  })
}