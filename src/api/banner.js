import request from '@/utils/request'

// 获取banner
export function getBanners(params) {
    return request({
        url: `/edu/admin/banners/`,
        method: 'get',
        params
    })
}

// 添加banner
export function addBanner(params) {
    return request({
        url: `/edu/admin/banners/`,
        method: 'post',
        data: params
    })
}


// 更新banner
export function updateBanner(params) {
    return request({
        url: `/edu/admin/banners/${params.id}`,
        method: 'put',
        data: params
    })
}


// 删除banner
export function deleteBannerById(bannerId) {
    return request({
        url: `/edu/admin/banners/${bannerId}`,
        method: 'delete'
    })
}

