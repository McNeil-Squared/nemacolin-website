<template lang="pug">
  v-navigation-drawer.pb-0(v-model="drawer" dark temporary fixed right :width="width" :height="height")
    v-list.pa-1
      v-list-tile
        v-list-tile-content
          v-list-tile-title {{ title }}
        v-list-tile-action
            v-btn(icon @click="toggleNavDrawer")
              v-icon far fa-times-circle
    v-list.pt-0(dense)
      v-divider(light)
      v-expansion-panel
          v-expansion-panel-content(expand-icon="fas fa-caret-down")
            div(slot="header") {{ dropmenu.title }}
            router-link(:to="item.link" tag="v-list-tile" active-class="active" v-for="item in dropmenu.submenu" :key="item.link")
              v-list-tile-content
                v-list-tile-title {{ item.title }}
    v-list(v-for='item in menu' :key='item.link')
      router-link(:to="item.link" tag="v-list-tile" active-class="active")
        v-list-tile-content
          v-list-tile-title {{ item.title }}
</template>

<script>
export default {
  data () {
    return {
      title: 'Menu',
      width: '',
      height: '600',
      dropmenu: {
        title: 'Services',
        submenu: [
          { link: '/sewage', title: 'Sewage Service' },
          { link: '/park', title: 'Nemacolin Park' },
          { link: '/trash', title: 'Trash Service' },
          { link: '/streetlights', title: 'Street Lights' },
          { link: '/hydrants', title: 'Fire Hydrants' }
        ]
      },
      menu: [
          { link: '/newresidents', title: 'New Residents' },
          { link: '/faqs', title: 'FAQ\u2019s' },
          { link: '/contact', title: 'Contact' },
          { link: '/login', title: 'Login' }
      ]
    }
  },
  methods: {
    toggleNavDrawer () { this.$store.dispatch('toggleDrawer') }
  },
  computed: {
    drawer() { return this.$store.getters.navDrawer }
  },
  created () {
    // Set the width of the mobile menu to fullscreen.  Percent and vw values are not allowed.
    this.width = window.innerWidth
  }
}
</script>
