import { request } from "./request";
//获取权限列表
export function getRights(type) {
  return request ({
    url: '/rights/' + type,
    method: 'get'
  })
}
//获取角色列表
export function getRoles() {
  return request ({
    url: '/roles',
    method: 'get',
  })
}
//添加角色
export function addRoles(addForm) {
  return request ({
    url: '/roles',
    method: 'post',
    data: {
      roleName: addForm.rolename,
      roleDesc: addForm.roledesc
    }
  })
}
//根据id获取当前数据
export function getRolesId(id) {
  return request({
    url: '/roles/' + id,
    method: 'get'
  })
}
//根据id获取当前数据
export function editRolesInfo(FormList) {
  return request({
    url: '/roles/' + FormList.roleId,
    method: 'put',
    data: {
      roleName: FormList.roleName,
      roleDesc: FormList.roleDesc
    }
  })
}
// 删除角色
export function delRole(id) {
  return request({
    url: '/roles/' + id,
    method: 'delete',
  })
}
//删除角色指定权限
export function delRolesRight(roleId, rightId) {
  return request({
    url: '/roles/' + roleId + '/rights/' + rightId,
    method: 'delete',
  })
}
//获取所有权限列表
export function getAllRights(type) {
  return request ({
    url: '/rights/' + type,
    method: 'get'
  })
}
//分配角色权限
export function allotRIghtsByRoleId(id, idStr) {
  return request ({
    url: '/roles/' + id + '/rights',
    data: {
      rids: idStr
    },
    method: 'post'
  })
}