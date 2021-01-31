import request from '@/utils/request'

// 获取章节
export function getChaptersByCourseId(courseId) {
    return request({
        url: `/cms/admin/chapters/treeNodes/${courseId}`,
        method: 'get',
        baseURL: 'http://localhost:8800'
    })
}

// 删除章节
export function deleteChapterById(id) {
    return request({
        url: `/cms/admin/chapters/${id}`,
        method: 'delete',
        baseURL: 'http://localhost:8800'
    })
}


// 添加章节
export function addChapter(params) {
    return request({
        url: '/cms/admin/chapters/',
        method: 'post',
        data: params,
        baseURL: 'http://localhost:8800'
    })
}

// 更新章节
export function updateChapter(params) {
    return request({
        url: `/cms/admin/chapters/${params.id}`,
        method: 'put',
        data: params,
        baseURL: 'http://localhost:8800'
    })
}

// 更新(章节)小节
export function updateChapterPart(params) {
    return request({
        url: `/cms/admin/chapterPart/${params.id}`,
        method: 'put',
        data: params,
        baseURL: 'http://localhost:8800'
    })
}


// 添加(章节)小节
export function addChapterPart(params) {
    return request({
        url: '/cms/admin/chapterPart/',
        method: 'post',
        data: params,
        baseURL: 'http://localhost:8800'
    })
}

// 删除(章节)小节
export function deleteChapterPartById(id) {
    return request({
        url: `/cms/admin/chapterPart/${id}`,
        method: 'delete',
        baseURL: 'http://localhost:8800'
    })
}