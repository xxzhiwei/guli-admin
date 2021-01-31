import request from '@/utils/request'

/**
 * 获取讲师列表
 * @param {*} params 
 */
export function getTeachers(params) {
    return request({
        url: '/cms/admin/teachers',
        method: 'get',
        params,
        baseURL: 'http://localhost:8800'
    })
}

/**
 * 获取全部讲师列表
 * @param {*} params 
 */
// export function getTeachersAll() {
//     return request({
//         url: '/cms/admin/teachers/all',
//         method: 'get',
//         baseURL: 'http://localhost:8800'
//     })
// }

/**
 * 获取讲师信息
 * @param {*} id 
 */
export function getTeacherById(id) {
    return request({
        url: `/cms/admin/teachers/${id}`,
        method: 'get',
        baseURL: 'http://localhost:8800'
    })
}

/**
 * 保存讲师
 * @param {*} params 
 */
export function saveTeacher(params) {
    return request({
        url: `/cms/admin/teachers`,
        method: 'post',
        baseURL: 'http://localhost:8800',
        data: params
    })
}

/**
 * 更新讲师
 * @param {*} params 
 */
export function updateTeacher(params) {
    return request({
        url: `/cms/admin/teachers/${params.id}`,
        method: 'put',
        baseURL: 'http://localhost:8800',
        data: params
    })
}

/**
 * 删除讲师
 * @param {*} id 
 */
export function deleteTeacherById(id) {
    return request({
        url: `/cms/admin/teachers/${id}`,
        method: 'delete',
        baseURL: 'http://localhost:8800'
    })
}