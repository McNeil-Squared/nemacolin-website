<template lang="pug">
  v-toolbar(app)
    router-link(to='/')
      v-toolbar-side-icon
        v-avatar(size="48")
          img.nemacolin-avatar(:src='src' :alt='alt')
    v-toolbar-title Nemacolin Inc.
    v-spacer
    v-toolbar-items
      v-menu.hidden-sm-and-down(open-on-hover offset-y)
        v-btn(slot="activator" color='primary' flat) Services
          v-icon.ml-2.mb-1(color='primary') fas fa-caret-down
        v-list
          v-list-tile(v-for="item in dropdownMenuItems" :key="item.name" @click="" :to="item.to")
            v-list-tile-title {{ item.name }}
      v-btn.hidden-sm-and-down(:color='item.color' flat v-for="item in menuItems" :key="item.name" :to="item.to") {{ item.name }}
      v-toolbar-side-icon.hidden-md-and-up(@click="toggleNavDrawer")
        v-icon fas fa-bars
</template>

<script>
export default {
  data () {
    return {
      dropdownMenuItems: [
        { name: 'Sewage Service', to: '/sewage' },
        { name: 'Trash Service', to: '/trash' },
        { name: 'Nemacolin Park', to: '/park' }
      ],
      menuItems: [
        { name: 'Resident Info', to: '/info', color: 'primary' },
        { name: 'FAQ\u2019s', to: '/faqs', color: 'primary' },
        { name: 'Contact', to: '/contact', color: 'primary' }
      ],
      src: require('../../assets/nilogo.png'),
      alt: 'Nemacolin Logo'
    }
  },
  methods: {
    toggleNavDrawer () { this.$store.dispatch('toggleDrawer') }
  }
}
</script>
