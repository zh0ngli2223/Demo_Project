<script setup>
    import { ElMessageBox, ElMessage } from 'element-plus'
    import { de, tr } from 'element-plus/es/locales.mjs'
    import { ref, getCurrentInstance, onMounted, reactive, nextTick } from 'vue'

    const tableData = ref([])
    const { proxy } = getCurrentInstance()
    const config = reactive({
        name: '',
        total: 200,
        page: 1,
        pageSize: 10,
    })
    const getUserData = async (name) => {
        let data = await proxy.$api.getUserData(config);
        config.total = data.count
        const start = (config.page - 1) * config.pageSize;
        const end = config.page * 10;
        const pageData = data.list.slice(start, end);
        if (name) {
            tableData.value = data.list.filter(item => {
                item.sex = item.sex === 1 ? '男' : '女'
                return item.name.indexOf(name) > -1
            });
            config.total = tableData.value.length
        } else {
            tableData.value = pageData.map(item => ({
                ...item,
                sex: item.sex === 1 ? '男' : '女'
            }))
        }
    }

    const tableLabel = reactive([
        {
            prop: 'name',
            label: '姓名'
        },
        {
            prop: 'age',
            label: '年龄'
        },
        {
            prop: 'sex',
            label: '姓别'
        },
        {
            prop: 'birth',
            label: '出生日期',
            width: 200
        },
        {
            prop: 'addr',
            label: '地址',
            width: 400
        },

    ])

    const formInline = reactive({
        keyWord: ''
    })



    const Serch = () => {
        config.name = formInline.keyWord
        getUserData(config.name)
    }

    const Change = (page) => {
        config.page = page
        getUserData()
    }

    const handleDelete = (index, row) => {
        console.log('点击删除后的数据:' + row.id);
        ElMessageBox.confirm(
            '你确定要删除吗?',
            '删除的数据降无法恢复',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(async () => {
                await proxy.$api.deleteUser({ id: row.id })
                getUserData()
                ElMessage({
                    type: 'success',
                    message: '删除成功',
                })
            })
            .catch((err) => {
                ElMessage({
                    type: 'info',
                    message: '删除失败' + err,
                })
            })
    }


    //控制对话框是否显示
    const dialogVisible = ref(false)

    //新增和编辑共用一个窗口，所以通过设置action区分
    const action = ref("add")

    const formUser = reactive({
        sex: "1",
    })
    //表单校验规则
    const rules = reactive({
        name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
        age: [
            { required: true, message: "年龄是必填项", trigger: "blur" },
            { type: "number", message: "年龄必须是数字" },
        ],
        sex: [{ required: true, message: "性别是必选项", trigger: "change" }],
        birth: [{ required: true, message: "出生日期是必选项" }],
        addr: [{ required: true, message: '地址是必填项' }]
    })
    const handleClose = () => {
        proxy.$refs["userForm"].resetFields()
        dialogVisible.value = false
    }
    const handleCancel = () => {
        handleClose()
    }
    const add = () => {
        dialogVisible.value = true
        action.value = 'add'
    };
    //格式化日期，格式化为：1997-01-02这种
    const timeFormat = (time) => {
        var time = new Date(time);
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var date = time.getDate();
        function add(m) {
            return m < 10 ? "0" + m : m;
        }
        return year + "-" + add(month) + "-" + add(date);
    }

    const onSubmit = () => {
        //执行userForm表单的validate进行规则校验，传入一个回调函数，回调函数会接受到一个是否校验通过的变量
        proxy.$refs["userForm"].validate(async (valid) => {

            //如果校验成功
            if (valid) {
                //res用于接收添加用户或者编辑用户接口的返回值
                let res = null
                //这里无论是新增或者是编辑，我们都要对这个日期进行一个格式化
                //如果不是1997-01-02这种格式，使用timeFormat方法进行格式化
                formUser.birth = /^\d{4}-\d{2}-\d{2}$/.test(formUser.birth) ? formUser.birth : timeFormat(formUser.birth)
                //如果当前的操作是新增，则调用新增接口
                if (action.value == "add") {
                    res = await proxy.$api.addUser(formUser);
                } else if (action.value == "edit") {
                    res = await proxy.$api.editUser(formUser);
                }
                //如果接口调用成功
                if (res) {
                    //关闭对话框，重置表单，重新请求用户数据
                    dialogVisible.value = false;
                    proxy.$refs["userForm"].resetFields()
                    getUserData()
                }

                //如果校验失败
            } else {
                ElMessage({
                    showClose: true,
                    message: "请输入正确的内容",
                    type: "error",
                })
            }

        })
    }
    const handleEdit = (val) => {
        action.value = "edit"
        dialogVisible.value = true
        // 为了不让编辑的值跑到新增的表单中，所以需要nextTick
        nextTick(() => {
            Object.assign(formUser, { ...val })
        })
    }
    onMounted(() => {
        getUserData()
    })
</script>
<template>
    <div class="user-header">
        <el-button type="primary" @click="add">添加</el-button>
        <el-form :inline="true" :model="formInline">
            <el-form-item label="">
                <el-input placeholder="请输入用户姓名" v-model="formInline.keyWord"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="Serch">查询</el-button>
            </el-form-item>
        </el-form>
    </div>
    <!-- 数据呈现模块-->
    <div class="table">
        <el-table :data="tableData">
            <el-table-column v-for="value in tableLabel" :key="value.prop" :prop="value.prop" :label="value.label"
                :width="value.width ? value.width : 125">
            </el-table-column>
            <el-table-column fixed="right" label="操作" min-width="120">
                <template #default="scope">
                    <el-button type="primary" size="small" @click="handleEdit(scope.row)">
                        编辑
                    </el-button>
                    &nbsp;&nbsp;&nbsp;
                    <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination :page-size="config.pageSize" size="large" background layout="prev, pager, next,total"
            :total="config.total" @current-change="Change" slot="总共" class="pager">
            <!-- <span slot="total">总共{{ config.total }}条</span> -->
        </el-pagination>
    </div>
    <!-- 表单模块-->
    <el-dialog v-model="dialogVisible" :title="action == 'add' ? '新增用户' : '编辑用户'" width="35%"
        :before-close="handleClose">
        <!--需要注意的是设置了:inline="true"，
		会对el-select的样式造成影响，我们通过给他设置一个class=select-clearn
		在css进行处理-->
        <el-form :inline="true" :model="formUser" :rules="rules" ref="userForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="formUser.name" placeholder="请输入姓名" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="年龄" prop="age">
                        <el-input v-model.number="formUser.age" placeholder="请输入年龄" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item class="select-clearn" label="性别" prop="sex">
                        <el-select v-model="formUser.sex" placeholder="请选择">
                            <el-option label="男" value="1" />
                            <el-option label="女" value="0" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="出生日期" prop="birth">
                        <el-date-picker v-model="formUser.birth" type="date" placeholder="请输入" style="width: 100%" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item label="地址" prop="addr">
                    <el-input v-model="formUser.addr" placeholder="请输入地址" />
                </el-form-item>
            </el-row>
            <el-row style="justify-content: flex-end">
                <el-form-item>
                    <el-button type="primary" @click="handleCancel">取消</el-button>
                    <el-button type="primary" @click="onSubmit">确定</el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </el-dialog>
</template>
<style scoped lang="less">

    .user-header {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
    }

    .table {
        position: relative;
        height: 520px;
        top: 30px;

        .pager {
            position: absolute;
            right: 50px;
            bottom: 20px;
        }

        .el-table {
            width: 100%;
            height: 500px;
        }
    }

    .select-clearn {
        display: flex;
    }
</style>