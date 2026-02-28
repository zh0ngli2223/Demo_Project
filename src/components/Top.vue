<script setup>
    import { ArrowRight } from '@element-plus/icons-vue'
    import { useAllDataStore } from '@/stores/index';
    const stores = useAllDataStore()

    const changeShow = () => {
        stores.state.isShow = !stores.state.isShow
    }
</script>

<template>
    <div class="top">
        <div class="t_l">
            <el-button size="small" @click='changeShow'>
                <component class="icons" is="menu"></component>
            </el-button>
            <el-breadcrumb :separator-icon="ArrowRight" class="bread">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="t_r">
            <el-dropdown class="r_list">
                <span>
                    <!-- 后面得改成动态  -->
                    <img src="@/assets/冰菓1.jpg" alt="" class="head_img">
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>用户信息</el-dropdown-item>
                        <el-dropdown-item>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<style scoped>
    .top {
        width: 100%;
    }

    .top,
    .t_l {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .icons {
        width: 20px;
        height: 20px;
    }

    .bread {
        color: #fff;
        margin-left: 5px;
    }

    :deep(.bread span) {
        color: #fff !important;
        cursor: pointer !important;
    }

    .r_list {
        cursor: pointer;
        border-radius: 50%;
    }

    .head_img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }

</style>