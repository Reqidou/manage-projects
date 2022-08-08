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
/** params分类属性 */
// 获取分类列表
export function getCateList() {
  return request({
    url: '/categories',
    method: 'get',
  })
}
//参数列表
export function getCategoriedList(id, sel) {
  return request({
    url: '/categories/' + id + '/attributes',
    method: 'get',
    params: {
      sel,
    }
  })
}
//添加参数
export function addParams(id, attr_name, attr_sel) {
  return request({
    url: '/categories/' + id + '/attributes',
    method: 'post',
    data: {
      attr_name,
      attr_sel
    }
  })
}
//通过id查询参数
export function getCateById(id, attrId) {
  return request({
    url:'/categories/' + id + '/attributes/' + attrId,
    method: 'get',
    params: {
      attrId,
    }
  })
}
//提交修改参数
export function editCateById(id, editForm) {
  return request({
    url: '/categories/' + id + '/attributes/' + editForm.attr_id,
    method: 'put',
    data: {
      attr_name: editForm.attr_name,
      attr_sel: editForm.attr_sel,
      
    }
  })
}
//删除参数
export function removeParams(id, attrid) {
  return request({
    url: '/categories/' + id + '/attributes/' + attrid,
    method: 'delete',
  })
}
//编辑提交参数
export function editPostParams(id, row) {
  return request({
    url: '/categories/' + id + '/attributes/' + row.attr_id,
    method: 'put',
    data: {
      attr_name: row.attr_name,
      attr_sel: row.attr_sel,
      attr_vals: row.attr_vals.join(','),
    }
  })
}