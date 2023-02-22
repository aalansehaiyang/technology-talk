<template>
  <a @click='clickFullscreen' style="text-align:center;padding-left:2px;" title="点击切换全屏">
    <img src="/assets/images/sys/full.png" width="30px" class="nozoom" />
    <span  style="color:gray;font-size:11px;font-weight:400;">全屏看</span>
  </a>

</template>

<script>
  import screenfull from 'screenfull'
  export default{
    name: 'FullScreenBtn',
    data(){
      return {
        isFullscreen: false
      }
    },
    methods:{
      clickFullscreen(){
        if (!screenfull.isEnabled) {
          this.$message({
            message: 'you browser can not work',
            type: 'warning'
          })
          return false
        }
        screenfull.toggle()
      }
    }
  }
</script>
