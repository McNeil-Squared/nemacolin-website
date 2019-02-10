<template lang="pug">
  div
    h3.headline.text-xs-center.mb-4.primary--text Dashboard
    v-layout(row wrap).mt-4
      v-flex(xs12)
        UserButtons
    v-layout(row wrap v-if="role === 'admin'").mt-5
      v-flex(xs12)
        AdminButtons
    v-layout(row wrap).mt-5
      v-flex(xs12 md6).pr-2
        TimeTracking
      v-flex(xs12 md6).pl-2
        Meetings
</template>

<script>
import { mapState } from 'vuex'
import UserButtons from '../components/UserButtons'
import AdminButtons from '../components/AdminButtons'
import TimeTracking from '../components/Time'
import Meetings from '../components/Meetings'

export default {
  components: { UserButtons, AdminButtons, TimeTracking, Meetings },
  computed: {
    role () {
      if (this.user) { return this.user.role }
    },
    ...mapState(['user'])
  }
}
</script>
