<template lang="pug">
  v-dialog(v-model="deleteEventModal" :width="width")
    v-card.text-xs-center
      v-alert.title.mt-0.adjust-icon(type="warning" color="error" icon="fas fa-exclamation-triangle" value="true") Are you sure you want to delete this event?
      v-card-title
        div.text-xs-left.event-data
          div.headline.text-xs-center.mb-3 {{ event.title }}
          p Date: {{ event.formattedDate }} &nbsp;Time: {{ event.formattedTime }}
          p Location: {{ event.location }}
          p Details: {{ event.details }}
      v-card-actions.pb-4
        v-btn.mx-auto(@click="deleteEvent()" color="primary" :loading="sending" :disabled="sending") Confirm
        v-btn.mx-auto(@click="toggleDeleteEventModal()" color="accent" v-show="!sending") Cancel
        v-alert(v-if="error && !sending" type="error" icon="fas fa-times" value="true") It looks like something went wrong.&nbsp;&nbsp;Please re-submit.
</template>

<script>
import firebase from 'firebase'
import { mapState } from 'vuex'

export default {
  name: 'deleteEvent',
  data () {
    return {
      width: 500,
      sending: false,
      error: false
    }
  },
  methods: {
    deleteEvent () {
      this.sending = true
      this.error = false
      console.log(event.id)
      firebase.firestore().collection('events').doc(this.event.id).delete()
        .then(() => {
          this.sending = false
          this.toggleDeleteEventModal()
          this.$root.$emit('refresh-events')
        })
        .catch((error) => {
          console.log(error)
          this.sending = false
          this.error = true
        })
    },
    toggleDeleteEventModal () {
      this.$store.dispatch('toggleDeleteEventModal')
    }
  },
  computed: {
    ...mapState(['deleteEventModal', 'event'])
  },
  created () {
    if (window.innerwidth < 500) this.width = window.innerWidth * 0.9
  }
}
</script>

<style scoped>
  .event-data {
    width: 100%;
  }
</style>
