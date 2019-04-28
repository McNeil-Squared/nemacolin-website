<template lang="pug">
   v-dialog(v-model="addEventModal" :width="width" persistent)
    form.pa-3.text-xs-center(@submit.prevent="submit" autocomplete="on")
      h4.mt-2.mb-4.text-xs-center New Event
      v-layout(row wrap)
        v-flex.pr-1(xs12 md6)
          label.d-block.text-xs-left(for="date") Date
          v-menu(ref="dateMenu" v-model="dateMenu" :close-on-content-click="false" :return-value.sync="date" lazy transition="scale-transition" offset-y full-width max-width="290px")
            v-text-field(slot="activator" v-model="formattedDate" prepend_icon="event" label="Pick a Date" :class="{'form-field--errors': areErrors('date')}" :error-messages="errors['date']" @input="validateField('date', 'Date', ['required'])" readonly solo)
            v-date-picker(v-model="date" :min='min' color="primary" @input="$refs.dateMenu.save(date)" no-title :class="{'form-field--errors': areErrors('date')}" :error-messages="errors['date']")
        v-flex.pl-1(xs12 md6)
          label.d-block.text-xs-left(for="date") Time
          v-menu(ref="timeMenu" v-model="timeMenu" :close-on-content-click="false" :return-value.sync="time" lazy transition="scale-transition" offset-y full-width max-width="290px" :nudge-left="60")
            v-text-field(slot="activator" v-model="formattedTime" prepend_icon="access_time" label="Pick a Time" :class="{'form-field--errors': areErrors('time')}" :error-messages="errors['time']" @input="validateField('time', 'Time', ['required'])" readonly solo)
            v-time-picker(v-model="time" color="primary" @change="$refs.timeMenu.save(time)")
      label.d-block.text-xs-left(for="title") Title
      v-text-field(v-model="title"  placeholder="title" :class="{'form-field--errors': areErrors('title')}" :error-messages="errors['title']" @input="validateField('title', 'Title', ['required', 'name'])" solo)
      label.d-block.text-xs-left(for="location") Location
      v-text-field(v-model="location"  placeholder="location" :class="{'form-field--errors': areErrors('location')}" :error-messages="errors['location']" @input="validateField('location', 'Location', ['required', 'name'])" solo)
      label.d-block.text-xs-left(for="details") Details
      v-text-field(v-model="details"  placeholder="details" :class="{'form-field--errors': areErrors('details')}" :error-messages="errors['details']" @input="validateField('details', 'Details', ['required', 'name'])" solo)
      v-btn.mx-3(@click="submit" color="primary" :loading="sending" :disabled="sending || $v.$invalid") Submit
      v-btn.mx-3(@click="toggleAddEventModal" color="accent" v-if="!sending") Cancel
      v-alert(v-if="error && !sending" type="error" icon="fas fa-times" value="true") It looks like something went wrong.&nbsp;&nbsp;Please re-submit.
</template>

<script>
import firebase from 'firebase'
import { mapState } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required, helpers } from 'vuelidate/lib/validators'

const name = helpers.regex('name', /^[a-zA-Z 0-9.,-]*$/)

export default {
  data () {
    return {
      dateMenu: false,
      timeMenu: false,
      date: null,
      time: null,
      title: '',
      location: '',
      details: '',
      errors: [],
      sending: false,
      error: false,
      width: 500
    }
  },
  mixins: [validationMixin],
  validations: {
    date: { required },
    time: { required },
    title: { required, name },
    location: { required, name },
    details: { required, name }
  },
  methods: {
    areErrors (field) {
      return this.errors[field] ? this.errors[field].length > 0 : false
    },
    validateField (field, label, validations) {
      this.errors[field] = []
      validations.forEach((validation) => {
        if (validation === 'required' && !this.$v[field].required) { this.errors[field].push(`${label} is required.`) }
        if (validation === 'name' && !this.$v[field].name) { this.errors[field].push(`can only contain letters, numbers, spaces, commas, or periods.`) }
      })
    },
    toggleAddEventModal () {
      this.$store.dispatch('toggleAddEventModal')
    },
    submit () {
      if (!this.$v.$invalid) {
        this.sending = true
        this.error = false
        let eventData = {
          date: new Date(`${this.date} ${this.time}`),
          title: this.title,
          location: this.location,
          details: this.details
        }
        let dbQuery = this.event ? firebase.firestore().collection('events').doc(this.event.id).update(eventData) : firebase.firestore().collection('events').add(eventData)
        dbQuery
          .then(() => {
            this.sending = false
            this.toggleAddEventModal()
            this.$root.$emit('refresh-events')
          })
          .catch((error) => {
            console.log(error)
            this.sending = false
            this.error = true
          })
      }
    },
    getMonthName (month) {
      let monthName
      switch (month) {
        case '01':
          monthName = 'January'
          break
        case '02':
          monthName = 'February'
          break
        case '03':
          monthName = 'March'
          break
        case '04':
          monthName = 'April'
          break
        case '05':
          monthName = 'May'
          break
        case '06':
          monthName = 'June'
          break
        case '07':
          monthName = 'July'
          break
        case '08':
          monthName = 'August'
          break
        case '09':
          monthName = 'September'
          break
        case '10':
          monthName = 'October'
          break
        case '11':
          monthName = 'November'
          break
        case '12':
          monthName = 'December'
          break
      }
      return monthName
    }
  },
  computed: {
    min () {
      let today = new Date()
      return `${today.getFullYear()}-${today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1}-${today.getDate()}`
    },
    formattedDate () {
      if (this.date) {
        let [year, month, day] = this.date.split('-')
        return `${this.getMonthName(month)} ${day}, ${year}`
      }
    },
    formattedTime () {
      if (this.time) {
        let partOfDay = ''
        let [hour, minute] = this.time.split(':')
        partOfDay = hour > 12 ? 'PM' : 'AM'
        hour = hour > 12 ? hour - 12 : hour
        return `${hour}:${minute} ${partOfDay}`
      }
    },
    ...mapState(['addEventModal', 'event'])
  },
  watch: {
    event: function () {
      if (this.event) {
        let eventDate = new Date(this.event.timestamp.seconds * 1000)
        this.date = `${eventDate.getFullYear()}-${eventDate.getMonth() + 1 < 10 ? '0' + (eventDate.getMonth() + 1) : eventDate.getMonth() + 1}-${eventDate.getDate()}`
        this.time = `${eventDate.getHours()}:${eventDate.getMinutes() < 10 ? '0' + eventDate.getMinutes() : eventDate.getMinutes()}`
        this.title = this.event.title
        this.location = this.event.location
        this.details = this.event.details
      } else {
        this.date = null
        this.time = null
        this.title = ''
        this.location = ''
        this.details = ''
      }
    }
  },
  created () {
    if (window.innerwidth < 500) this.width = window.innerWidth * 0.9
  }
}
</script>
