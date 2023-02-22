<template>
    <table v-if="data.navlist && data.navlist.length" class="sitemap-table">
      <tr v-for="(navitem, index) in data.navlist" :key="index">
        <td nowrap><div class="sitemap-col-group">{{ navitem.title }}</div></td>
        <td v-if="0==navitem.linkMode" >
          <div class="sitemap-col-item" v-for="item in navitem.list" :key="item.url">
            <a :href="item.url" target="_blank" :title="item.title">  
              {{ item.title || '' }}
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15" class="icon outbound"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path> <polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg>
            </a>
          </div>
        </td>
        <td v-if="0!=navitem.linkMode" >
            <router-link class="sitemap-col-item" v-for="item in navitem.list" :key="item.url" :to="item.url" >
              {{ item.title || '' }}
            </router-link>
        </td>
      </tr>
    </table>
</template>

<script>

export default {
  name: 'SiteMap',
  components: {},
  computed: {
    data() {
      return {
        navlist: []
      }
    }
  },
  mounted() {
  },
  methods: {}
}
</script>
<style lang='stylus'>
  .sitemap-table
    margin 0
    tr:nth-child(2n)
      background-color: #fff;
    th, td
      border: 1px solid #f6f7f9;
      padding: 5px;
      padding-bottom: 0;

  .sitemap-col-group
    margin-bottom:5px;
    font-size: 12px;
    font-weight: bold;
  
  .sitemap-col-item
    float: left;
    margin-right: 5px;
    font-size: 12px;
    margin-bottom: 5px;
    padding: 3px 8px;
    background-color: #fbfbfb;
    border-radius: 2px;
    border: 1px solid #eee;
    //box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
    text-align: center;
    color: #42b983;
    font-weight: 400;
    a
      font-weight: 400;
      color: #42b983;
  .sitemap-col-item:hover
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.3);
    color: $accentColor
    a
      color: $accentColor

</style>
