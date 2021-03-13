import request from '@/utils/request'

/**
 * 获取讲师列表
 * @param {*} params 
 */
export function getTeachers(params) {
    return request({
        url: '/edu/admin/teachers',
        method: 'get',
        params,
    })
}

/**
 * 获取讲师信息
 * @param {*} id 
 */
export function getTeacherById(id) {
    return request({
        url: `/edu/admin/teachers/${id}`,
        method: 'get'
    })
}

/**
 * 保存讲师
 * @param {*} params 
 */
export function saveTeacher(params) {
    return request({
        url: `/edu/admin/teachers`,
        method: 'post',
        data: params
    })
}

/**
 * 更新讲师
 * @param {*} params 
 */
export function updateTeacher(params) {
    return request({
        url: `/edu/admin/teachers/${params.id}`,
        method: 'put',
        data: params
    })
}

/**
 * 删除讲师
 * @param {*} id 
 */
export function deleteTeacherById(id) {
    return request({
        url: `/edu/admin/teachers/${id}`,
        method: 'delete'
    })
}