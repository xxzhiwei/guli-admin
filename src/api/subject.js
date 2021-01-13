import request from '@/utils/request'

/**
 * 获取课程列表
 */
export function getSubjectTreeNodes() {
    return request({
        url: '/edu/subjects/treeNodes',
        method: 'get',
        baseURL: 'http://localhost:8800'
    })
}

/**
 * 添加课程
 * @param {FormData} formData  
 */
export function addSubject(formData) {
    return request({
        url: '/edu/subjects/xlsx',
        method: 'post',
        data: formData,
        baseURL: 'http://localhost:8800'
    })
}