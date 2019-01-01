<template>
  <div class="ratingselect">
    <div class="rating-type border-bottom">
    <span @click="select(2,$event)" class="block positive" :class="{'active':selectType ===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span @click="select(0,$event)" class="block positive" :class="{'active':selectType ===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span @click="select(1,$event)" class="block negative" :class="{'active':selectType ===1}">{{desc.negative}}<span class="count">7</span></span>
    </div>
    <div @click="toggleContent($event)" class="switc" :class="{'on':onlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看内容评价</span>
    </div>
  </div>
</template>
<script>

const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;
export default {
  
  props: {
   ratings: {
     type:Array,
     default() {
       return [];
     }
   },
   selectType: {
      type: Number,
      default: ALL
   },
   onlyContent:{
     type: Boolean,
     dafault : false
   },
   desc: {
     type: Object,
     default(){
       return {
         all:'全部',
         positive: '满意',
         negative: '不满意'
       }
     }
   }
  },
  computed:{
    positives(){
      return this.ratings.filter((item) =>{
        return item.rateType === POSITIVE
      })
    },
    negatives(){
      return this.ratings.filter((item) =>{
        return item.rateType === NEGATIVE
      })
    }
  },
  methods:{
    select(type,event){
      if(!event._constructed) {
       return
     }
     /* 在这边不能直接修改父组件的数据 ，应该在父组件那边修改 */

      //this.selectType = type
      this.$emit('ratingType',type)
    },
    toggleContent(event){
      if(!event._constructed) {
       return
     }
      //this.onlyContent = !this.onlyContent
      this.$emit('toggleConten',this.onlyContent)
    }
  }
}
</script>
<style lang="stylus" scoped>
.ratingselect
  .rating-type
    padding: 18px 0
    margin: 0 18px
    .block
      display: inline-block
      padding: 8px 12px
      margin-right: 8px
      border-redius: 1px
      color: rgb(77,85,93)
      font-size: 12px
      &.active
        color: #fff
      .count
        font-size: 8px
        margin-left: 2px
      &.positive
        background: rgba(0,160,220,.2)
        &.active
          background: rgb(0,160,220)
      &.negative
        background: rgba(77,85,93,.2)
        &.active
          background: rgb(77,85,93)
          
  .switc
    padding: 12px 18px
    line-height: 24px
    border-bottom: 1px solid rgba(7,17,27,.1)
    color:rgb(147,153,159)
    font-size: 0
    &.on
      .icon-check_circle
        color: #00c850
    .icon-check_circle
      display: inline-block
      font-size: 24px
      margin-right: 4px
      vertical-align: top
    .text
      display: inline-block
      font-size: 12px
</style>

