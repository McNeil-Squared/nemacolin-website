<template lang="pug">
  div
    v-layout(row wrap).mt-4
      v-flex(xs12 md6)
        h3.headline.text-xs-center.mb-4.primary--text Dashboard
        UserButtons
        v-layout(row wrap v-if="role === 'admin'").mt-5
          v-flex(xs12)
            AdminButtons
      v-flex(xs12 md6)
        Events
    AddEvent
</template>

<script>
import { mapState } from 'vuex'
import UserButtons from '../components/UserButtons'
import AdminButtons from '../components/AdminButtons'
import Events from '../components/Events'
import AddEvent from '../components/addEvent'

export default {
  data () {
    return {
      height: ''
    }
  },
  components: { UserButtons, AdminButtons, Events, AddEvent },
  computed: {
    role () {
      if (this.user) { return this.user.role }
    },
    ...mapState(['user'])
  },
  created () {
    this.height = document.getElementsByClassName('v-content__wrap')[0].clientHeight * 0.75
  }
}
</script>
