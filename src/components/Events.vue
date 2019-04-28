<template lang="pug">
  div
    h3.mb-3.headline.text-xs-center.primary--text Upcoming Events
    p.subheading.text-xs-center(v-if="events[0] === 'There are no upcoming events at this time.'") {{ events[0] }}
    v-list(three-line v-for="(event, i) in events" :key="i" v-else)
      v-subheader {{ event.formattedDate }} at {{ event.formattedTime }}
      v-list-tile
        v-list-tile-avatar
          v-icon(color='primary') fas fa-chalkboard-teacher
        v-list-tile-content
          v-list-tile-title {{ event.title }}
          v-list-tile-sub-title {{ event.location }}
            br
            | {{ event.details }}
      v-btn(v-if="user.role === 'admin' && onDashboard" color="secondary" @click="editEvent(event)") edit
      v-btn(v-if="user.role === 'admin' && onDashboard" color="accent" @click="deleteEvent(event.id)") delete
      v-divider(v-if="events.length > 1 && i < events.length - 1")
</template>

<script>
import firebase from 'firebase'
import { mapState } from 'vuex'

export default {
  name: 'news',
  data () {
    return {
      events: []
    }
  },
  computed: {
    onDashboard () {
      return window.location.pathname === '/dashboard'
    },
    ...mapState(['user'])
  },
  methods: {
    getEvents () {
      let fetchedEvents = []
      firebase.firestore().collection('events').where('date', '>=', new Date()).get()
        .then((snapshot) => {
          snapshot.forEach((event) => {
            let eventData = event.data()
            let eventDetails = {
              timestamp: eventData.date,
              formattedDate: new Date(eventData.date.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
              formattedTime: new Date(eventData.date.seconds * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' }),
              details: eventData.details,
              location: eventData.location,
              title: eventData.title,
              id: event.id
            }
            fetchedEvents.push(eventDetails)
          })
          fetchedEvents.length > 0 ? this.events = fetchedEvents : this.events = ['There are no upcoming events at this time.']
        })
    },
    editEvent (event) {
      this.$store.dispatch('editEvent', event)
    }
  },
  created () {
    this.getEvents()
    this.$root.$on('refresh-events', () => {
      this.getEvents()
    })
  }
}
</script>

<style lang="scss">
  .v-list__tile {
    @media screen and (max-width: 500px) {
      height: 160px !important;
    }
  }
</style>
