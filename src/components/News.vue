<template lang="pug">
  div
    h3.mb-3.headline.text-xs-center.primary--text Upcoming Events
    p.subheading.text-xs-center(v-if="events[0] === 'There are no upcoming events at this time.'") {{ events[0] }}
    v-list(three-line v-for="(event, i) in events" :key="i" v-else)
      v-subheader {{ event.date }} at {{ event.time }}
      v-list-tile
        v-list-tile-avatar
          v-icon(color='primary') fas fa-chalkboard-teacher
        v-list-tile-content
          v-list-tile-title {{ event.title }}
          v-list-tile-sub-title {{ event.location }}
            br
            | {{ event.details }}
      v-divider(v-if="events.length > 1 && i < events.length")
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'news',
  data () {
    return {
      events: []
    }
  },
  methods: {
    getNews () {
      let fetchedEvents = []
      firebase.firestore().collection('events').where('date', '>=', new Date()).get()
        .then((snapshot) => {
          snapshot.forEach((event) => {
            let eventData = event.data()
            let eventDetails = {
              date: new Date(eventData.date.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
              time: new Date(eventData.date.seconds * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' }),
              details: eventData.details,
              location: eventData.location,
              title: eventData.title
            }
            fetchedEvents.push(eventDetails)
          })
          fetchedEvents.length > 0 ? this.events = fetchedEvents : this.events = ['There are no upcoming events at this time.']
        })
    }
  },
  created () {
    this.getNews()
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
