<template lang="pug">
  div
    h3.secondary--text.text-xs-center.mb-2 Time Tracking
    v-card
      v-data-table#time-table.text-xs-center(:headers="headers" :items="entries" sort-icon="fas fa-arrow-up" prev-icon="fas fa-chevron-left" next-icon="fas fa-chevron-right")
        template(slot="items" slot-scope="props")
          td.text-xs-left {{ props.item.description }}
          td {{ props.item.date }}
          td {{ props.item.timeSpent }}
          td
            v-icon(color="secondary").mr-3 {{ props.item.actions[0] }}
            v-icon(color="primary").ml-3 {{ props.item.actions[1] }}
</template>

<script>
import firebase from 'firebase'
import { mapState } from 'vuex'
import { getMonthName } from '../months.js'
const actions = ['fas fa-pencil-alt', 'fas fa-times']

export default {
  data () {
    return {
      headers: [
        { text: 'Description', value: 'description', align: 'left', sortable: false },
        { text: 'Date', value: 'date', align: 'center', sortable: false },
        { text: 'Time Spent', value: 'timeSpent', align: 'center', sortable: false },
        { text: 'Actions', value: 'actions', align: 'center', sortable: false }
      ],
      entries: []
    }
  },
  computed: mapState(['user']),
  methods: {
    getTimeEntries () {
      let today = new Date()
      let firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      let lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      firebase.firestore().collection('times').where('userid', '==', this.user.uid).where('date', '>=', firstDay).where('date', '<=', lastDay).get()
        .then((results) => {
          results.forEach((doc) => {
            let entry = doc.data()
            let entryDate = entry.date.toDate()
            let formattedDate = `${entryDate.getMonth() + 1}/${entryDate.getDate()}/${entryDate.getFullYear()}`
            this.entries.push({ description: entry.description, date: formattedDate, timeSpent: entry.timespent, actions: actions })
          })
        })
        .catch((error) => {
          console.log(error)
        })
    },
    addTotal () {
      let total = 0
      this.entries.forEach((entry) => {
        total += entry.timeSpent
      })
      let month = getMonthName(new Date().getMonth() + 1)
      let tableActions = document.querySelector('#time-table .v-datatable__actions')
      let div = document.createElement('div')
      div.classList.add('v-datatable__actions__monthly-total')
      div.innerHTML = `<p>${month} Total: ${total} Hours</p>`
      if (tableActions) { tableActions.appendChild(div) }
    }
  },
  watch: {
    'user': function () {
      this.getTimeEntries()
    },
    'entries': function () {
      this.addTotal()
    }
  },
  created () {
    if (this.user) { this.getTimeEntries() }
  }
}
</script>

<style>
  #time-table th:nth-of-type(1n) {
    width: 35%;
  }
  #time-table th:nth-of-type(2n) {
    width: 25%;
  }
  #time-table th:nth-of-type(3n) {
    width: 20%;
  }
  #time-table th:nth-of-type(4n) {
    width: 20%;
  }
  #time-table .v-datatable__actions {
    justify-content: space-between;
  }
  #time-table .v-datatable__actions__select {
    width: 25%;
    margin-left: 1.45rem;
  }
  #time-table .v-datatable__actions__monthly-total p {
    margin-bottom: 0;
    margin-right: 2.0rem;
  }
</style>
