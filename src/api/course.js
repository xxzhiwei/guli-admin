import request from '@/utils/request'

// 获取课程列表
export function getCourses(params) {
    return request({
        url: `/edu/admin/courses/`,
        method: 'get',
        params
    })
}

// 获取课程信息
export function getCourseInfoById(id) {
    return request({
        url: `/edu/admin/courses/${id}`,
        method: 'get'
    })
}

// 添加课程
export function addCourse(params) {
    return request({
        url: '/edu/admin/courses/',
        method: 'post',
        data: params
    })
}

// 更新课程（基本信息）
export function updateCourseInfo(params) {
    return request({
        url: `/edu/admin/courses/${params.id}`,
        method: 'put',
        data: params
    })
}

// 删除课程（包括小节&视频
export function deleteCourseById(id) {
    return request({
        url: `/edu/admin/courses/${id}`,
        method: 'delete'
    })
}
