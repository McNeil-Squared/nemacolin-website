<template lang="pug">
  div
    h3.headline.text-xs-center.mb-4.primary--text Dashboard
    v-layout(row wrap)
      v-flex(xs12 md6)
        app-files.mx-1.mb-1
      v-flex(xs12 md6)
        app-meetings.mx-1.mb-1
    v-layout(row wrap)
      v-flex(xs12 md6)
        app-time.mx-1.mb-1
      v-flex(xs12 md6)
        app-events.mx-1.mb-1
</template>

<script>
import files from '../components/Files'
import meetings from '../components/Meetings'
import time from '../components/Time'
import events from '../components/Events'

export default {
  components: { appFiles: files, appMeetings: meetings, appTime: time, appEvents: events }
}
</script>
