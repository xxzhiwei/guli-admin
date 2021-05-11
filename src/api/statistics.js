import request from '@/utils/request'

// 获取每日数据统计
export function createDailyStatistics(params) {
    return request({
        url: `/statistics/daily/registerCount`,
        method: 'post',
        data
    })
}

// 获取每日数据统计
export function getDailyStatistics(params) {
    return request({
        url: `/statistics/daily/showData/${params.type}/${params.begin}/${params.end}`,
        method: 'get',
    })
}

