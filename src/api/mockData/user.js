import Mock from 'mockjs'

// get请求从config.url获取参数，post从config.body中获取参数
function param2Obj(url) {
    // console.log('传递的数据' + url);
    const id = JSON.parse(url).id
    // console.log('处理的数据' + id);
    if (!id) {
        return {}
    }
    return id
    // return JSON.parse(
    //     '{"' +
    //     decodeURIComponent(search)
    //         .replace(/"/g, '\\"')
    //         .replace(/&/g, '","')
    //         .replace(/=/g, '":"') +
    //     '"}'
    // )
}

let List = [];
const count = 200;
//模拟200条用户数据
for (let i = 0; i < count; i++) {
    List.push(
        Mock.mock({
            id: Mock.Random.guid(),
            name: Mock.Random.cname(),
            addr: Mock.mock('@county(true)'),
            'age|18-60': 1,
            birth: Mock.Random.date(),
            sex: Mock.Random.integer(0, 1)
        })
    )
}
console.log('list', List);

export default {
    getUserList: config => {
        //limit默认是10，因为分页器默认也是一页10个
        const { name, page = 1, limit = 10 } = config.url
        const mockList = List.filter(user => {
            //如果name存在会，根据name筛选数据
            if (name && user.name.indexOf(name) === -1) {
                return false
            }
            else return true
        })
        //分页
        const pageList = List
        return {
            code: 200,
            data: {
                list: pageList,
                count: List.length, //数据总条数需要返回
            }
        }
    },
    /**
   * 删除用户
   */
    deleteUser: config => {

        const id = param2Obj(config.body)
        // console.log('传递过来的参数值：' + id)
        if (!id) {
            return {
                code: -999,
                message: '参数不正确'
            }
        } else {
            List = List.filter(u => u.id !== id)
            return {
                code: 200,
                message: '删除成功'
            }
        }
    },
    /**
   * 增加用户
   * @param name, addr, age, birth, sex
   * @return {{code: number, data: {message: string}}}
   */
    createUser: config => {
        const { name, addr, age, birth, sex } = JSON.parse(config.body)
        console.log('传递过来的增加用户的值：', name, addr, age, birth, sex)
        List.unshift({
            id: Mock.Random.guid(),
            name: name,
            addr: addr,
            age: age,
            birth: birth,
            sex: sex
        })
        return {
            code: 200,
            data: {
                message: '添加成功'
            }
        }
    },
    /**
   * 修改用户
   * @param id, name, addr, age, birth, sex
   * @return {{code: number, data: {message: string}}}
   */
    updateUser: config => {
        const { id, name, addr, age, birth, sex } = JSON.parse(config.body)
        const sex_num = parseInt(sex)
        List.some(u => {
            if (u.id === id) {
                u.name = name
                u.addr = addr
                u.age = age
                u.birth = birth
                u.sex = sex_num
                return true
            }
        })
        return {
            code: 200,
            data: {
                message: '编辑成功'
            }
        }
    }

}