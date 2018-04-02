<script src="../../../../test/PT-HTML/temptest/js/common.js"></script>
<template>
  <div class="banners">

    <div v-if="item.image_type == 3">
      <swiper height="130px">
        <swiper-item class="swiper-img bannerItem" v-for="(image, index) in item.images" :key="index">
          <img :src="image.imageUrl"  />
          <p v-if="image.linkTitle"><span>{{image.linkTitle}}</span></p>
        </swiper-item>
      </swiper>
    </div>
    <div v-else :class="item.image_type == 2 ? 'flex' : 'block'">
      <div  v-for="(image,index) in item.images"  class="bannerItem">

        <router-link :to="image.linkUrlWay == 2 ? image.linkUrl :  '/detail?id=' + image.linkUrl + (image.linkUrlWay == 3 ? ('&activity='+(image.linkMarketType == 'discount' ? 'SecondKill':'bulk')) : '')">
          <img :src="image.imageUrl"/>
          <p v-if="image.linkTitle"><span>{{image.linkTitle}}</span></p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import { Swiper, SwiperItem } from 'vux'
  export default {
    name: 'banner',
    components: {
      Swiper,
      SwiperItem
    },
    data () {
      return {
        banner: []
      }
    },
    props: ['item'],
    watch: {

    },
    mounted () {


    },
    methods: {
    }
  }
</script>

<style>

</style>
