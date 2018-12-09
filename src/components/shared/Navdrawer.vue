<template lang="pug">
  v-navigation-drawer.pb-0(:value="drawer" dark temporary fixed right :width="width" :height="height")
    v-list.pa-1
      v-list-tile.dense-menu
        v-list-tile-content
          v-list-tile-title {{ title }}
        v-list-tile-action
            v-btn.closer(icon @click="toggleNavDrawer")
              v-icon far fa-times-circle
    v-list.pt-0
      router-link.dense-menu.mb-2(to="/" tag="v-list-tile" exact-active-class="active")
        v-list-tile.dense-menu
          v-list-tile-content
            v-list-tile-title Home
      v-divider(light)
      v-expansion-panel
        v-expansion-panel-content(expand-icon="fas fa-caret-down")
          div(slot="header") {{ dropmenu.title }}
          router-link.dense-menu(:to="item.link" tag="v-list-tile" active-class="active" v-for="item in dropmenu.submenu" :key="item.link" @click="toggleNavDrawer")
            v-list-tile-content
              v-list-tile-title {{ item.title }}
      router-link.dense-menu(:to="item.link" tag="v-list-tile" active-class="active" v-for="(item, i) in menu" :key="i")
        v-list-tile.dense-menu
          v-list-tile-content
            v-list-tile-title {{ item.title }}
      router-link.dense-menu(to="/login" tag="v-list-tile" active-class="active" v-if="user == null")
        v-list-tile.dense-menu
          v-list-tile-content
            v-list-tile-title Login
      v-expansion-panel(v-else)
        v-expansion-panel-content(expand-icon="fas fa-caret-down")
          div(slot="header") Hello {{ user.displayName }}
          router-link.dense-menu(to="/dashboard" tag="v-list-tile")
            v-list-tile.dense-menu
              v-list-tile-content
                v-list-tile-title Dashboard
          router-link.dense-menu(:to="profileLink" tag="v-list-tile")
            v-list-tile.dense-menu
              v-list-tile-content
                v-list-tile-title User Profile
          router-link.dense-menu(to="/users" tag="v-list-tile" v-if="user.role === 'admin'")
            v-list-tile.dense-menu
              v-list-tile-content
                v-list-tile-title User Management
          router-link.dense-menu(to="" tag="v-list-tile" @click="logout")
            v-list-tile.dense-menu
              v-list-tile-content
                v-list-tile-title Logout
</template>

<script>
import firebase from 'firebase'

export default {
  data () {
    return {
      title: 'Nemacolin Inc',
      width: '',
      height: '600',
      dropmenu: {
        title: 'Services',
        submenu: [
          { link: '/sewage', title: 'Sewage Service' },
          { link: '/trash', title: 'Trash Service' },
          { link: '/park', title: 'Nemacolin Park' }
        ]
      },
      menu: [
        { link: '/info', title: 'Resident Info' },
        { link: '/faqs', title: 'FAQ\u2019s' },
        { link: '/contact', title: 'Contact' }
      ]
    }
  },
  methods: {
    toggleNavDrawer () {
      this.$store.dispatch('toggleDrawer')
    },
    logout (action) {
      firebase.auth().signOut()
        .then(this.$store.dispatch('removeUserSessionData'))
        .catch(error => console.log(error))
    }
  },
  computed: {
    drawer () { return this.$store.getters.navDrawer },
    user () { return this.$store.getters.user },
    profileLink () { return '/profile/' + this.user.username }
  },
  created () {
    // Set the width of the mobile menu to fullscreen.  Percent and vw values are not allowed.
    this.width = window.innerWidth
  }
}
</script>

<style lang="scss">
  .active {
    background: #eedbdb;
    color: #ba1b1d;
  }

  .closer {
    background: #424242;
  }
  // compact the mobile menu for small devices
  .dense-menu > a, .dense-menu > div {
    @media screen and (max-width: 500px) {
      height: 60px !important;
    }
  }
</style>
