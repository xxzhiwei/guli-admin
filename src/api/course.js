import request from '@/utils/request'

// 获取课程列表
export function getCourses(params) {
    return request({
        url: `/cms/admin/courses/`,
        method: 'get',
        params,
        baseURL: 'http://localhost:8800'
    })
}

// 获取课程信息
export function getCourseInfoById(id) {
    return request({
        url: `/cms/admin/courses/${id}`,
        method: 'get',
        baseURL: 'http://localhost:8800'
    })
}

// 添加课程
export function addCourse(params) {
    return request({
        url: '/cms/admin/courses/',
        method: 'post',
        data: params,
        baseURL: 'http://localhost:8800'
    })
}

// 更新课程（基本信息）
export function updateCourseInfo(params) {
    return request({
        url: `/cms/admin/courses/${params.id}`,
        method: 'put',
        data: params,
        baseURL: 'http://localhost:8800'
    })
}

// 删除课程（包括小节&视频
export function deleteCourseById(id) {
    return request({
        url: `/cms/admin/courses/${id}`,
        method: 'delete',
        baseURL: 'http://localhost:8800'
    })
}
