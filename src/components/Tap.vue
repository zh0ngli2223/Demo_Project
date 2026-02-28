<script setup>

    import { computed, ref } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useAllDataStore } from '@/stores'

    const store = useAllDataStore()
    const route = useRoute()
    const router = useRouter()

    const tags = computed(() => store.state.tags)

    const changeMenu = (tag) => {
        // 单击tab时，联动面包屑
        store.selectMenu(tag)
        // 跳转对应页面
        router.push(tag.name)
    }

    //关闭tab时触发
    // const handleClose = (tag, index) => {
    //     store.updateTags(tag)
    //     // 删除对应的tag往前移一位
    //     if (tag.name !== router.name) return
    //     if (index === store.state.tags.length) {
    //         store.selectMenu(tags.value[index - 1])
    //         router.push(tags.value[index - 1].name)
    //     } else {
    //         store.selectMenu(tags.value[index])
    //         router.push(tags.value[index].name)
    //     }
    // }
    const handleClose = (tag, index) => {
        // 先保存当前要删除的标签名称
        const removedName = tag.name;

        // 从仓库中删除标签
        store.updateTags(tag);

        // 如果删除的不是当前激活的标签，直接返回
        if (removedName !== router.currentRoute.value.name) return;

        // 计算新的索引位置
        // 如果删除的是最后一个标签，则切换到前一个
        // 否则切换到原来位置的标签（因为删除后后面的标签会前移）
        const newIndex = index >= store.state.tags.length ? index - 1 : index;

        // 确保索引有效
        if (newIndex >= 0 && store.state.tags[newIndex]) {
            store.selectMenu(store.state.tags[newIndex]);
            router.push(store.state.tags[newIndex].name);
        }
    };

</script>
<template>
    <div class="tags">
        <!--closable是否有关闭按钮,hoem标签不能关闭所以为false
			effect主题，找到当前路由对应的tab，设置'dark'高亮主题
		-->
        <el-tag :key="tag.name" v-for="(tag, index) in tags" :closable="tag.name !== 'home'"
            :effect="route.name === tag.name ? 'dark' : 'plain'" @click="changeMenu(tag)"
            @close="handleClose(tag, index)">
            {{ tag.label }}
        </el-tag>
    </div>
</template>
<style scoped>
    .tags {
        margin: 20px 0 0 20px;
    }

    .el-tag {
        margin-right: 10px;
    }
</style>