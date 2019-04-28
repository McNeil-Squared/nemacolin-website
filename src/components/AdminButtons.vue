<template lang="pug">
  v-layout(row wrap).text-xs-center
    v-flex(xs12 md6)
      v-btn(color="secondary" to="/users") User Management
    v-flex(xs12 md6)
      v-btn(color="secondary" @click="addEvent()") Add Event
</template>

<script>
export default {
  methods: {
    addEvent () {
      this.$store.dispatch('addEvent')
    }
  }
}
</script>
