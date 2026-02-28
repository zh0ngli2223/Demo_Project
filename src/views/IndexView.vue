<script setup>
  import left from '@/components/Left.vue'
  import top from '@/components/Top.vue'
  import tap from '@/components/Tap.vue'
  import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="all">
    <el-container class="nav">
      <left></left>
      <el-container>
        <el-header class="header">
          <common-header>
            <top></top>
          </common-header>
        </el-header>
        <tap></tap>
        <el-main class="right_con">
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped lang="less">

  .all,
  .nav {
    height: 100vh;
  }

  .header {
    display: flex;
    align-items: center;
    background-color: #333;

    common-header {
      width: 100%;
    }
  }

  .right_con {
    height: calc(100vh - 60px);
  }

</style>