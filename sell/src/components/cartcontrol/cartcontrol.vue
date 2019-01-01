<template>
  <div class="cartcontrol">
    <transition name="move">
     <div class="cart-decrease icon-remove_circle_outline" v-show="food.count" @click.stop.prevent="decreaseCart"></div>      
    </transition>
    <div class="cart-count" v-show="food.count">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div> 
</template>
<script>
import Vue from 'vue'
export default {
  props:{
    food:{
      type:Object
    }
  },
  created(){
   // console.log(this.food)
  },
  methods:{
    addCart(event){
      if(!event._constructed){
        return;
      }

      if(!this.food.count) {
        Vue.set(this.food,'count',1)
      }else{
        this.food.count++
      }

      this.$emit('cartadd',event.target)
    },
    decreaseCart(event){
      if(!event._constructed){
        return;
      }

      if(this.food.count >0){
        this.food.count--
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
 .cartcontrol
   font-size: 0
   .cart-decrease
     font-size: 24px
     line-height: 24px
     padding: 6px 
     display:inline-block
     color: rgb(0,160,220)
   .cart-count
     display:inline-block
     vertical-align: top
     width: 12px
     padding-top: 6px
     line-height: 24px
     text-align: center
     font-size: 10px 
     
   .cart-add
     display:inline-block
     lien-height: 24px
     font-size: 24px
     color: rgb(0,160,220)
   .move-enter,move-leave-to
     transform: translate3d(24px, 0 ,0)
     opacity :0
   .move-enter-active,.move-leave-to
     transition: all .3s linear
     
</style>

