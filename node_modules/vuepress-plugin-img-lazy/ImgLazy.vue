<template>
  <img
    v-bind="$attrs"
    :data-src="dataSrc"
    :loading="config.useNative ? 'lazy' : null"
    :class="config.selector"
  />
</template>

<script>
import config from '@dynamic/imgLazy'

export default {
  name: 'ImgLazy',
  props: {
    src: {
      type: String,
      required: true
    }
  },
  computed: {
    config() {
      return config
    },
    dataSrc() {
      return this.src &&
        this.src.charAt(0) === '/' &&
        !this.src.startsWith(this.$site.base)
        ? this.$site.base + this.src.slice(1)
        : this.src
    }
  }
}
</script>
