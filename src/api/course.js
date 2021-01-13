import request from '@/utils/request'

// 获取课程信息
export function getCourseInfoById(id) {
    return request({
        url: `/edu/courses/${id}`,
        method: 'get',
        baseURL: 'http://localhost:8800'
    })
}

// 添加课程
export function addCourse(params) {
    return request({
        url: '/edu/courses/',
        method: 'post',
        data: params,
        baseURL: 'http://localhost:8800'
    })
}

// 添加章节
export function addChapter(params) {
    return request({
        url: '/edu/chapters/',
        method: 'post',
        data: params,
        baseURL: 'http://localhost:8800'
    })
}

// 添加小节
export function addVideo(params) {
    return request({
        url: '/edu/videos/',
        method: 'post',
        data: params,
        baseURL: 'http://localhost:8800'
    })
}

// 获取章节
export function getChaptersByCourseId(courseId) {
    return request({
        url: `/edu/chapters/treeNodes/${courseId}`,
        method: 'get',
        baseURL: 'http://localhost:8800'
    })
}

// 删除章节
export function deleteChapterById(id) {
    return request({
        url: `/edu/chapters/${id}`,
        method: 'delete',
        baseURL: 'http://localhost:8800'
    })
}

// 删除小节
export function deleteVideoById(id) {
    return request({
        url: `/edu/videos/${id}`,
        method: 'delete',
        baseURL: 'http://localhost:8800'
    })
}

// 更新课程（基本信息）
export function updateCourseInfo(params) {
    return request({
        url: `/edu/courses/${params.id}`,
        method: 'put',
        data: params,
        baseURL: 'http://localhost:8800'
    })
}

// 更新章节
export function updateChapter(params) {
    return request({
        url: `/edu/chapters/${params.id}`,
        method: 'put',
        data: params,
        baseURL: 'http://localhost:8800'
    })
}


// 更新小节
export function updateVideo(params) {
    return request({
        url: `/edu/videos/${params.id}`,
        method: 'put',
        data: params,
        baseURL: 'http://localhost:8800'
    })
}
