<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-topbottom">
      <router-link class="tab-item " to="/goods">商品</router-link>
      <router-link class="tab-item " to="/ratings">评论</router-link>
      <router-link class="tab-item" to="/seller">商家</router-link>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import Header from './components/header/header'
import axios from 'axios'
import {urlParse} from '@/common/js/util.js'
const ERR_OK = 0
export default {
  name: 'App',
  data(){
    return {
      seller:{
        id:(()=>{
          let queryParam = urlParse();
          console.log(queryParam)
          return queryParam.id
        })()
      }
    }
  },
  components:{
   'v-header':Header
  },
  
  created(){
    fetch('/api/seller?id='+this.seller.id)
    .then(res =>res.json())
    .then(response =>{
      if(response.errno == ERR_OK){
        //this.seller = response.data;
        /* 为seller添加了id 这个属性 否则id会丢弃 */
        this.seller = Object.assign({},this.seller,response.data)
        //console.log(this.seller)
        console.log(this.seller.id)
      }
    })
  }
}
</script>
 
<style lang="stylus" scoped>
@import './common/stylus/varibel.styl'

#app
  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    .tab-item
      flex: 1
      text-align: center
     
      font-size: 14px
      color: rgb(77,85,93)
      
      &.active
        color: rgb(240,20,20)
        background:$bg-color
    
      
</style>
