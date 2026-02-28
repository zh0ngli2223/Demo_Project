import { ref } from 'vue'
import { defineStore } from 'pinia'
function initState() {
  const storedMenuList = localStorage.getItem('menuList')
  const storedToken = localStorage.getItem('token')

  return {
    isShow: false,
    tags: [{
      path: '/home',
      name: 'home',
      label: '首页',
      icon: 'home'
    }],
    currentMenu: null,
    menuList: storedMenuList ? JSON.parse(storedMenuList) : [],
    token: storedToken || ''
  }
}
export const useAllDataStore = defineStore('index', () => {
  const state = ref(initState())
  //在之前定义的selectMenu方法中
  function selectMenu(val: any) {
    if (val.name == 'home') {
      state.value.currentMenu = null
    } else {
      state.value.currentMenu = val

      //这里添加如果点击的不是home时，先找一下tags中是否存在点击的菜单
      const index = state.value.tags.findIndex(item => item.name === val.name)
      //如果不存在则添加到tags中
      index === -1 ? state.value.tags.push(val) : ""
    }
  }

  function updateTags(tag: any) {
    //找到要删除的tab索引，使用splice方法删除
    const index = state.value.tags.findIndex(item => item.name === tag.name)
    state.value.tags.splice(index, 1)
  }
  function updateMenuList(val: any) {
    state.value.menuList = val
  }
  function setToken(token: string) {
    state.value.token = token
  }
  return {
    state,
    selectMenu,
    updateTags,
    updateMenuList,
    setToken
  }
})
