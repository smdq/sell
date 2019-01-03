<template>
  <transition name="food-detail">
    <div v-show="showFlag" class="food"  ref="foodss">
      <div class="food-content" >
        <div class="image-header">
          <img :src="food.image" alt="">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div> 
          <div class="cartcontrol-wrapper">
              <cartcontrol  :food="food"></cartcontrol>
          </div>
          <transition name="addfirst">
            <div @click.stop.prevent="addFirst($event)" class="buy"  v-show="!food.count || food.count==0">加入购物车</div>
          </transition>   
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text" >{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect @ratingType="ratingType" @toggleConten="toggleConten" :selectType="selectType" :onlyContent="onlyContent"
          :desc="desc" :ratings="food.ratings"
          ></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings&&food.ratings.length">
              <li v-show="needShow(rating.rateType,rating.text)" class="rating-item border-bottom" v-for="(rating,index) in food.ratings" :key="index">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar" alt="">
                </div>
                <div class="time">
                  {{rating.rateTime | formatDate}}
                </div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-ratings" v-show="!food.ratings || !food.ratings.length">
              暂无评价
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import BScroll from "better-scroll";
import cartcontrol from "@/components/cartcontrol/cartcontrol";
import split from "@/components/split/split";
import ratingselect from "@/components/ratingselect/ratingselect";
import {formatDate} from 'common/js/date.js'
import Vue from "vue";


const POSITIVE = 0;
const NAGATIVE = 1;
const ALL = 2;
export default {
  props: {
    food: {
      type: Object
    }
  },
  data() {
    return {
      showFlag: false,
      selectType:ALL,
      onlyContent: true,
      desc: {
        all:'全部',
        positive:'推荐',
        negative:'吐槽'
      }
    };
  },
  methods: {
    show() {
      this.showFlag = true;
      //初始化的时候始终保持初始化
      this.selectType = ALL;
      this.onlyContent = true;
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.foodss, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    hide() {
      this.showFlag = false;
    },
    addFirst(event) {
      if(!event._constructed){
        return;
      }
     
     this.$emit('cartadd',event.target)
      Vue.set(this.food, "count", 1);
    },
    ratingType(type){
      /* 对应上面的函数不传参数  如：@ratingType="ratingType" */
      this.selectType = type
      //console.log(this.selectType)
    },
    toggleConten(content){
      this.onlyContent = !this.onlyContent
      //console.log(this.onlyContent)
    },
    needShow(type,text){
      if(this.onlyContent && !text){
        return false;
      }

      if(this.selectType === ALL){
        return true;
      }else{
        return type === this.selectType
      }

    }
  },
  filters:{
    formatDate(time){
      let date = new Date(time)
      return formatDate(date,'yyyy-MM-dd hh:mm')
    }
  },
  components: {
    cartcontrol,
    split,
    ratingselect
  }
};
</script>
<style lang="stylus" scoped>
.food 
  position: fixed;
  left: 0;
  top: 0;
  bottom: 48px;
  z-index: 30;
  width: 100%;
  background: #fff;
  .food-content
    position: relative
    .image-header 
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 100%;

      img 
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      

      .back 
        position: absolute;
        top: 10px;
        left: 0;

        .icon-arrow_lift 
          display: block;
          padding: 10px;
          font-size: 20px;
          color: #fff;
        
      
    

    .content 
      padding: 18px;
      position:relative
      .title 
        line-height: 14px;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 700;
        color: rgb(7, 17, 27);
      

      .detail 
        margin-bottom: 18px;
        line-height: 10px;
        font-size: 0;

        .sell-count, .rating 
          font-size: 10px;
          color: rgb(147, 153, 159);
        

        .sell-count 
          margin-right: 12px;
        
      

      .price 
        font-weigth: 700;
        line-height: 24px;

        .now 
          margin-right: 18px;
          font-size: 14px;
          color: rgb(240, 20, 20);
        

        .old 
          text-decoration: line-through;
          font-size: 10px;
          color: rgb(147, 153, 159);
        
      
    
    
      .cartcontrol-wrapper 
        position: absolute;
        right: 18px;
        bottom: 18px;
      

      .buy 
        position: absolute;
        right: 18px;
        bottom: 18px;
        z-index: 10;
        height: 24px;
        line-height: 24px;
        padding: 0 12px;
        box-sizing: border-box;
        font-size: 10px;
        border-radius: 12px;
        color: #ffffff;
        background: rgb(0, 160, 220);
    .info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size: 14px
        color: rgb(7,17,27)
      .text
        line-height: 24px
        padding: 0 8px
        font-size: 12px
        color: rgb(77,85,93)   
    .rating
      padding: 18px 0
      .title
        line-height: 14px
        margin-left: 18px
        font-size: 14px
        color: rgb(7,17,27)
      .rating-wrapper
        padding: 0 18px 
        .rating-item
          position: relative
          padding: 16px 0
          .user
            position: absolute 
            right: 0
            top: 16px
            font-size: 0
            line-height: 12px
            .name
              display: inline-block
              margin-right: 6px
              vertical-align: top
              font-size: 10px
              color: rgb(147,153,159)
            .avatar
              border-radius: 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147,153,159)
          .text
            line-height: 16px
            font-size: 12px
            color:rgb(7,17,27)
            .icon-thumb_up,icon-thumb_down
              line-height: 16px
              margin-right: 4px
              font-size: 12px
            .icon-thumb_up
              color: rgb(0,160,220)
            .icon-thumb_down
              color: rgb(147,153,159)  
        .no-ratings
          padding: 16px 0
          font-size: 12px
          color: rgb(147,153,159)

.food-detail-enter-active, .food-detail-leave-active 
  transition: 1s;


.food-detail-enter, .food-detail-leave-to 
  transform: translateX(100%);


.addfirst-enter-active, .addfirst-leave-active 
  transition: 1s all;
  opacity: 1;


.addfirst-enter, .addfirst-leave-to 
  opacity: 0

</style>

