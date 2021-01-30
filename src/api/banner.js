import request from '@/utils/request'

// 获取banner
export function getBanners(params) {
    return request({
        url: `/cms/admin/banners/`,
        method: 'get',
        params,
        baseURL: 'http://localhost:8800'
    })
}

// 添加banner
export function addBanner(params) {
    return request({
        url: `/cms/admin/banners/`,
        method: 'post',
        data: params,
        baseURL: 'http://localhost:8800'
    })
}


// 更新banner
export function updateBanner(params) {
    return request({
        url: `/cms/admin/banners/${params.id}`,
        method: 'put',
        data: params,
        baseURL: 'http://localhost:8800'
    })
}


// 删除banner
export function deleteBannerById(bannerId) {
    return request({
        url: `/cms/admin/banners/${bannerId}`,
        method: 'delete',
        baseURL: 'http://localhost:8800'
    })
}

