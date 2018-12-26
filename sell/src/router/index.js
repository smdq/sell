import Vue from 'vue'
import Router from 'vue-router'



import Goods from '@/components/goods/goods'
import Ratings from '@/components/ratings/ratings'
import Seller from '@/components/seller/seller'

Vue.use(Router)

export default new Router({
  // 路由配置项   被激活的a标签有添加相应的active样式
  linkActiveClass:'active',
  routes: [
    {
     path:'/',
     name:Goods,
     component:Goods
    },
    {
      path:'/goods',
      name:Goods,
      component:Goods
    },
    {
      path:'/ratings',
      name: Ratings,
      component:Ratings
    },
    {
      path:'/seller',
      name:Seller,
      component:Seller
    }
  ]
})
