<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toglelist">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':totalCount>0}">
              <span :class="{'highlight':totalCount>0}" class="icon-shopping_cart"></span>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight':totalCount>0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      
      </div>
      <div class="ball-container">
        <div v-for="(ball,index) in balls" :key="index">
        <!-- //用了两种方式的动画,css和js钩子 -->
          <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
          <!-- //外层动画 -->
            <div class="ball" v-show="ball.show">
            <!-- 内层动画 -->
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>

      <!--购物车列表 -->
      <div class="shopcart-list" :class="{'show':listShow}" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <div class="empty" @click="empty">清空</div>
        </div>
        <div class="list-content" ref="content">
          <ul>
            <li class="food border-bottom" v-for="(food,index) in selectFoods" :key="index">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span >￥{{food.price*food.count}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="food"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="list-mask" v-show="listShow" @click="hideList"></div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
import cartcontrol from '@/components/cartcontrol/cartcontrol'
export default {
  props:{
    selectFoods:{
      type:Array,
      default(){
        return [{
          price: 20,
          count: 1
        }]
      }
    },
    deliveryPrice:{
      type:Number,
      default:0
    },
    minPrice:{
      type:Number,
      default: 0
    }
  },
  data(){
  return {
    balls: [
      {
        show:false
      },
       {
        show:false
      },
       {
        show:false
      },
       {
        show:false
      },
       {
        show:false
      }
    ],
    dropBalls:[],
    fold: true
  }
  },
  computed:{
    totalPrice(){
      let total = 0;
      this.selectFoods.forEach((food) =>{
         total += food.price*food.count
      });
      return total
    },
    totalCount(){
      let count = 0;
      this.selectFoods.forEach((food) =>{
        count +=food.count
      });
      return count
    },
    payDesc(){
      if(this.totalPrice ===0){
        return `￥${this.minPrice}元起送`
      }else if(this.totalPrice<this.minPrice){
        let diff = this.minPrice - this.totalPrice
        return `还差￥${diff}元起送`
      }else{
        return  `去结算`
      }
    },
    payClass(){
      if(this.totalPrice <this.minPrice){
        return 'no-enough'
      }else{
        return 'enough'
      }
    },
    listShow(){
      if(!this.totalCount){
        this.fold = true;
        return false
      }
      let show = !this.fold;

      if(show) {
        this.$nextTick(() =>{

          if(!this.scroll){
            this.scroll= new BScroll(this.$refs.content,{
            click:true
          })
          }else{
            this.scroll.refresh();
          }
          
        })
      }
      return show;
    }
    
  },
  methods: {
      drop(el) { 
      //触发一次事件就会将所有小球进行遍历
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) { //将false的小球放到dropBalls
            ball.show = true;
            ball.el = el; //设置小球的el属性为一个dom对象
            this.dropBalls.push(ball); 
            return;
          }
        }
      },

      beforeDrop(el){ //这个方法的执行是因为这是一个vue的监听事件
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect(); //获取小球的相对于视口的位移(小球高度)
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22); //负数,因为是从左上角往下的的方向
            el.style.display = ''; //清空display
            el.style.webkitTransform = `translate3d(0,${y}px,0)`; 
            el.style.transform = `translate3d(0,${y}px,0)`;
            //处理内层动画
            let inner = el.getElementsByClassName('inner-hook')[0]; //使用inner-hook类来单纯被js操作
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },

      dropping(el, done) { //这个方法的执行是因为这是一个vue的监听事件
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight; //触发重绘html
        this.$nextTick(() => { //让动画效果异步执行,提高性能
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          //处理内层动画
          let inner = el.getElementsByClassName('inner-hook')[0]; //使用inner-hook类来单纯被js操作
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend', done); //Vue为了知道过渡的完成，必须设置相应的事件监听器。
        });
      },

      afterDrop(el) { //这个方法的执行是因为这是一个vue的监听事件
        let ball = this.dropBalls.shift(); //完成一次动画就删除一个dropBalls的小球
        if (ball) {
          ball.show = false;
          el.style.display = 'none'; //隐藏小球
        }
      },
      toglelist(){
        if(!this.totalCount){
          return;
        }
        this.fold = !this.fold
      },
      empty(){
        this.selectFoods.forEach((food) =>{
          food.count =0;
        })
      },
      hideList(){
        this.fold = true
      },
      pay(){
        if(this.totalPrice<this.minPrice){
          return
        }
       window.alert(`需要支付${this.totalPrice}元`)
      }
    },
    components:{
      cartcontrol
    }
}
</script>
<style lang="stylus" scoped>

  .shopcart
    position: fixed
    left: 0
    bottom:0
    z-index: 50
    width: 100%
    height: 48px
    
    .content
      display: flex
      background: #141d27
      .content-left
        font-size: 0
        flex: 1
        .logo-wrapper
          display: inline-block
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          vertical-align: top
          border-radius: 50%
          background:#000
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            background:#2b343c
            text-align: center
            .icon-shopping_cart
              font-size: 24px
              color: #80858a
              line-height: 44px
              &.highlight
                color: #ffffff
            &.highlight
              background:rgb(0,160,220)
          .num
            position: absolute 
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight:  700
            color: #ffffff
            background:rgb(240,20,20)
            box-shadow: 0 4px 8px 0px rgba(0,0,0,.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          box-sizing: border-box
          padding-right: 12px
          border-right: 1px solid rgba(255,255,255,.1)
          font-size: 16px
          font-weight: 700
          color: rgba(255,255,255,.4)
          &.highlight
            color: #ffffff
        .desc
         display:inline-block
         font-size: 10px
         line-height: 24px
         color: rgba(255,255,255,.4)
         margin-top: 12px
         margin-left: 6px 
          
      .content-right
        flex: 0 0 105px
        width: 105px
        
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          color: rgba(255,255,255,.4)
          font-weight: 700
          background: #2b333b
          &.no-enough
            background: #2b333b
          &.enough
            background #00b43c
            color: #ffffff
    .ball-container
      
      .ball
        position: fixed 
        left: 32px
        bottom: 22px
        z-index: 200 
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.4s linear
    .shopcart-list
      position: absolute 
      left: 0
      top:0
      z-index: -1
      width: 100%
      transform: translateY(100%)
      &.show
       transform: translateY(-100%)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background #f3f5f7
        border-bottom: 1px solid rgba(7,17,27,.1)
        .title
          float: left 
          font-size: 14px
          color: rgb(7,17,27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0,160,20)
      .list-content
        padding: 0 18px
        max-height: 217px
        overflow:hidden
        background #fff
        .food
          position: relative
          padding: 12px 0 
          box-sizing: border-box
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7,17,27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-weight: 700
            font-size: 14px
            color: rgb(240,20,20)
          .cartcontrol-wrapper
            position: absolute 
            right: 0
            bottom: 6px
  .list-mask 
    position: fixed
    left: 0
    top:  0
    width: 100%
    height: 100%
    z-index: 40
    background: rgba(7,17,27,.6)  
</style>

