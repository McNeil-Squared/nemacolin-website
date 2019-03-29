<template lang="pug">
  div
    h3.headline.text-xs-center.mb-4.primary--text Dashboard
    v-layout(row wrap).mt-4
      v-flex(xs12 md6)
        UserButtons
        v-layout(row wrap v-if="role === 'admin'").mt-5
          v-flex(xs12)
            AdminButtons
      v-flex(xs12 md6)
        News
</template>

<script>
import { mapState } from 'vuex'
import UserButtons from '../components/UserButtons'
import AdminButtons from '../components/AdminButtons'
import News from '../components/News'

export default {
  data () {
    return {
      height: ''
    }
  },
  components: { UserButtons, AdminButtons, News },
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
