import Vue from 'vue'
import Clipboard from '@clipboardComponent'
import options from '@dynamic/copyright-options'

export default {
  data: () => ({
    isElement: false,
  }),

  created () {
    this.onCopy = (event) => {
      const textRange = getSelection().getRangeAt(0)
      if (String(textRange).length < this.minLength) return

      event.preventDefault()
      if (this.noCopy) return

      const node = document.createElement('div')
      node.appendChild(getSelection().getRangeAt(0).cloneContents())

      const lang = this.$lang
      const instance = new Vue({
        render: h => h(Clipboard, {
          props: {
            html: node.innerHTML,
            lang,
          },
        }),
      }).$mount()

      const { innerHTML, innerText } = instance.$el
      if (event.clipboardData) {
        event.clipboardData.setData('text/html', innerHTML)
        event.clipboardData.setData('text/plain', innerText)
      } else if (window.clipboardData) {
        window.clipboardData.setData('text', innerText)
      }
    }
  },

  watch: {
    isElement (value) {
      if (!value) return

      let { copyright = !options.disabled } = this.$frontmatter
      if (!copyright) return

      if (typeof copyright !== 'object') {
        copyright = {}
      }

      const noSelect = copyright.noSelect || options.noSelect
      this.minLength = copyright.minLength || options.minLength
      this.noCopy = copyright.noCopy || options.noCopy

      if (noSelect) {
        this.$el.style.userSelect = 'none'
      } else {
        this.$el.addEventListener('copy', this.onCopy)
      }
    },
  },

  updated () {
    this.isElement = this.$el.nodeName !== '#comment'
  },

  beforeDestory () {
    this.$el.removeEventListener('copy', this.onCopy)
  },
}
