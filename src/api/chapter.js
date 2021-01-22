import request from '@/utils/request'

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


// 添加章节
export function addChapter(params) {
    return request({
        url: '/edu/chapters/',
        method: 'post',
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

// 更新(章节)小节
export function updateChapterPart(params) {
    return request({
        url: `/edu/chapterPart/${params.id}`,
        method: 'put',
        data: params,
        baseURL: 'http://localhost:8800'
    })
}


// 添加(章节)小节
export function addChapterPart(params) {
    return request({
        url: '/edu/chapterPart/',
        method: 'post',
        data: params,
        baseURL: 'http://localhost:8800'
    })
}

// 删除(章节)小节
export function deleteChapterPartById(id) {
    return request({
        url: `/edu/chapterPart/${id}`,
        method: 'delete',
        baseURL: 'http://localhost:8800'
    })
}