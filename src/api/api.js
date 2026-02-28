import request from "./requst";

export default {
    getTableData() {
        return request({
            url: '/api/home/getTableData',
            method: 'get'
        })
    },
    getCountData() {
        return request({
            url: '/api/home/getCountData',
            method: 'get'
        })
    },
    getChartData() {
        return request({
            url: '/api/home/getChartData',
            method: 'get'
        })
    },
    getUserData(data) {
        return request({
            url: '/api/user/getUserData',
            method: 'get',
            data: data
        })
    },
    deleteUser(data) {
        return request({
            url: '/user/deleteUser',
            method: 'get',
            data: data
        })
    },
    addUser(data) {
        return request({
            url: '/user/addUser',
            method: 'post',
            data: data
        })
    },
    editUser(data) {
        return request({
            url: '/user/editUser',
            method: 'post',
            data: data
        })
    },
    getMenu(data) {
        return request({
            url: '/permission/getMenu',
            method: 'post',
            data: data
        })
    }
}