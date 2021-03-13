import request from '@/utils/request'

// 获取章节
export function getChaptersByCourseId(courseId) {
    return request({
        url: `/edu/admin/chapters/treeNodes/${courseId}`,
        method: 'get'
    })
}

// 删除章节
export function deleteChapterById(id) {
    return request({
        url: `/edu/admin/chapters/${id}`,
        method: 'delete'
    })
}


// 添加章节
export function addChapter(params) {
    return request({
        url: '/edu/admin/chapters/',
        method: 'post',
        data: params
    })
}

// 更新章节
export function updateChapter(params) {
    return request({
        url: `/edu/admin/chapters/${params.id}`,
        method: 'put',
        data: params
    })
}

// 更新(章节)小节
export function updateChapterPart(params) {
    return request({
        url: `/edu/admin/chapterPart/${params.id}`,
        method: 'put',
        data: params
    })
}


// 添加(章节)小节
export function addChapterPart(params) {
    return request({
        url: '/edu/admin/chapterPart/',
        method: 'post',
        data: params
    })
}

// 删除(章节)小节
export function deleteChapterPartById(id) {
    return request({
        url: `/edu/admin/chapterPart/${id}`,
        method: 'delete'
    })
}