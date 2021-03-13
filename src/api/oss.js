import request from '@/utils/request'

/**
 * 上传讲师头像
 * @param {FormData} formData  
 */
export function uploadFile(formData) {
    return request({
        url: '/oss/', // /guli/oss这样不行👋🏻（缺少/）
        method: 'post',
        data: formData
    })
}