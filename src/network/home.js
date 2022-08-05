import { request } from "./request";
import qs from 'qs'
// 获取菜单列表
export function getMenuList() {
  return request ({
    url: '/menus',
    method: 'get',

  })
}
//获取所有用户信息
export function getUsers(queryInfo) {
  return request({
    url: '/users',
    method: 'get',
    params: {
      query: queryInfo.query,
      pagenum: queryInfo.pagenum,
      pagesize: queryInfo.pagesize,
    }
  })
}
//修改用户状态
export function putUserInfo(userInfo) {
  const id = userInfo.id
  const type = userInfo.mg_state

  return request ({
    url: '/users/' + id +'/state/' + type,
    method: 'put',

  })
}
//添加用户的网络请求
export function addUser(addForm) {
  return request ({
    url: '/users',
    method: 'post',
    data: {
      username: addForm.username,
      password: addForm.password,
      email: addForm.email,
      mobile: addForm.mobile,
    }
  })
}
//查询单个用户请求
export function getUser(id) {
  return request ({
    url: '/users/' + id,
    method: 'get'
  })
}
// 修改用户信息
export function editUsersInfo(editForm) {
  return request ({
    url: '/users/' + editForm.id,
    method: 'put',
    data: {
      email: editForm.email,
      mobile: editForm.mobile
    }
  })
}
//删除单个用户
export function delUser(id) {
  return request({
    url: '/users/' + id,
    method: 'delete',
  })
}

//获取所有角色列表
export function getRoles() {
  return request({
    url: '/roles',
    method: 'get'
  })
}
//分配用户的新角色
export function allotUsersRole(id, rid) {
  return request({
    url: '/users/' + id + '/role',
    data: {
      rid
    },
    method: 'put',
  })
}