import request from '@/utils/request'

/**
 * 获取课程列表
 */
export function getSubjectTreeNodes() {
    return request({
        url: '/edu/admin/subjects/treeNodes',
        method: 'get'
    })
}

/**
 * 添加课程
 * @param {FormData} formData  
 */
export function addSubject(formData) {
    return request({
        url: '/edu/admin/subjects/upload/xlsx',
        method: 'post',
        data: formData
    })
}