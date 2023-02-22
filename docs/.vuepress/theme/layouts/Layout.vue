<template>
  <div
    class="theme-container"
    :class="pageClasses"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <Navbar
      v-if="shouldShowNavbar"
      @toggle-sidebar="toggleSidebar"
    />

    <div
      class="sidebar-mask"
      @click="toggleSidebar(false)"
    ></div>

    <Sidebar
      :items="sidebarItems"
      @toggle-sidebar="toggleSidebar"
    >
      <slot
        name="sidebar-top"
        #top
      />
      <slot
        name="sidebar-bottom"
        #bottom
      />
    </Sidebar>

    <Home v-if="$page.frontmatter.home"/>

    <Page
      v-else
      :sidebar-items="sidebarItems"
    >
      <slot
        name="page-top"
        #top
      />
      <slot
        name="page-bottom"
        #bottom
      />
    </Page>

    <PageSidebar
       v-if="shouldShowPageSidebar"
       :page-sidebar-items="pageSidebarItems"
       :sidebar-items="sidebarItems"
       @toggle-sidebar-force="toggleSidebarForce"
    >
      <slot
        name="page-sidebar-top"
        #top
      />
      <slot
        name="page-sidebar-bottom"
        #bottom
      />
    </PageSidebar>
  </div>
</template>

<script>
import Home from '@theme/components/Home.vue'
import Navbar from '@theme/components/Navbar.vue'
import Page from '@theme/components/Page.vue'
import Sidebar from '@theme/components/Sidebar.vue'
import PageSidebar from '@theme/components/PageSidebar.vue'
import { resolveSidebarItems, resolveHeaders } from '../util'

export default {
  components: { Home, Page, Sidebar, Navbar, PageSidebar },

  data () {
    return {
      isSidebarOpen: false,
      isForeCloseSidebar: false,
    }
  },

  computed: {
    shouldShowNavbar () {
      const { themeConfig } = this.$site
      const { frontmatter } = this.$page
      if (
        frontmatter.navbar === false
        || themeConfig.navbar === false) {
        return false
      }
      return (
        this.$title
        || themeConfig.logo
        || themeConfig.repo
        || themeConfig.nav
        || this.$themeLocaleConfig.nav
      )
    },

    shouldShowSidebar () {
      const { frontmatter } = this.$page
      return (
        !frontmatter.home
        && frontmatter.sidebar !== false
        && this.sidebarItems.length
      )
    },

    shouldShowPageSidebar (){
        const { frontmatter } = this.$page
        
        return (//false&&
            !frontmatter.home
            && frontmatter.sidebar !== false
            && this.pageSidebarItems.length
        )
    },

    sidebarItems () {
      return resolveSidebarItems(
        this.$page,
        this.$page.regularPath,
        this.$site,
        this.$localePath
      )
    },

    pageSidebarItems () {
        return resolveHeaders(this.$page)
    },

    pageClasses () {
      const userPageClass = this.$page.frontmatter.pageClass
      return [
        {
          'no-navbar': !this.shouldShowNavbar,
          'sidebar-open': this.isSidebarOpen && !this.isForeCloseSidebar,
          'no-sidebar': !this.shouldShowSidebar || this.isForeCloseSidebar
        },
        userPageClass
      ]
    }
  },

  mounted () {
    this.$router.afterEach(() => {
      if(!this.isForeCloseSidebar){
        this.isSidebarOpen = false
      }
    })
  },

  methods: {
    toggleSidebar (to, foreCloseSidebar) {
      this.isSidebarOpen = typeof to === 'boolean' ? to : !this.isSidebarOpen
      this.isForeCloseSidebar = typeof foreCloseSidebar === 'boolean' ? foreCloseSidebar : false;
      this.$emit('toggle-sidebar', this.isSidebarOpen)
    },

    toggleSidebarForce () {
      this.isSidebarOpen = !this.isSidebarOpen
      this.isForeCloseSidebar = !this.isForeCloseSidebar
      this.$emit('toggle-sidebar-force', this.isSidebarOpen)
    },

    // side swipe
    onTouchStart (e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      }
    },

    onTouchEnd (e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x
      const dy = e.changedTouches[0].clientY - this.touchStart.y
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.toggleSidebar(true)
        } else {
          this.toggleSidebar(false)
        }
      }
    }
  }
}
</script>
