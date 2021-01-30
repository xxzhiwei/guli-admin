import request from '@/utils/request'

// 上传视频(上面的xxxVideo其实是小节，这个才是视频)
export function uploadVideo(params) {
    return request({
        url: `/vod/videos`,
        method: 'post',
        data: params,
        baseURL: 'http://localhost:8800'
    })
}

// 删除视频
export function deleteVideosByIds(params) {
    return request({
        url: `/vod/videos`,
        method: 'delete',
        data: params,
        baseURL: 'http://localhost:8800'
    })
}