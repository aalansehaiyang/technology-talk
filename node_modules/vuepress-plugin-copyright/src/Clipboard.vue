<template>
  <div>
    <p>{{ text.beforeAuthor }}{{ authorName || text.author }}{{ text.afterAuthor }}<a :href="location">{{ decodeURIComponent(location) }}</a></p>
&#10;<div v-html="html"/>
  </div>
</template>

<script>

import i18n from './i18n'
import options from '@dynamic/copyright-options'

export default {
  props: {
    html: String,
    lang: String,
  },

  created () {
    this.authorName = typeof options.authorName === 'string'
      ? options.authorName
      : this.getI18nValue(options.authorName)
    this.text = this.getI18nValue(i18n)
    this.location = String(location).replace(/#.+$/, '')
  },

  methods: {
    getI18nValue (source) {
      return this.lang in source ? source[this.lang] : source['en-US']
    },
  },
}

</script>
