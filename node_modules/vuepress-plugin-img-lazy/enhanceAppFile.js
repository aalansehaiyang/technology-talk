import config from '@dynamic/imgLazy'

export default ({ Vue }) => {
  Vue.mixin({
    data() {
      return {
        $io: undefined
      }
    },

    mounted() {
      const lazyEls = document.querySelectorAll('img.' + config.selector)
      if (config.useNative && 'loading' in HTMLImageElement.prototype) {
        lazyEls.forEach(lazyEl => {
          !lazyEl.getAttribute('src') && lazyEl.setAttribute('src', lazyEl.getAttribute('data-src'))
        })
      } else {
        this.setObserver()
        lazyEls.forEach(lazyEl => {
          this.$io.observe(lazyEl)
        })
      }
    },

    methods: {
      setObserver() {
        this.$io = new IntersectionObserver(entries => {
          entries.forEach(item => {
            if (item.isIntersecting) {
              const src = this.getSrc(item.target)

              if (src) {
                item.target.src = src
              }
              this.$io.unobserve(item.target)
            }
          })
        }, {
          rootMargin: config.rootMargin
        })
      },
      getSrc(el) {
        if (el.dataset) {
          return el.dataset.src
        } else {
          const item = el.attributes.find(item => item.nodeName === 'data-src')
          return item && item.nodeValue
        }
      }
    }
  })
}
