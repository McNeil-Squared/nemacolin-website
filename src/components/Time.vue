<template lang="pug">
  div
    h3.secondary--text.text-xs-center.mb-2 Time Tracking
    v-card
      v-data-table#time-table.text-xs-center(:headers="headers" :items="entries" sort-icon="fas fa-arrow-up" prev-icon="fas fa-chevron-left" next-icon="fas fa-chevron-right")
        template(slot="items" slot-scope="props")
          td.text-xs-left {{ props.item.name }}
          td {{ props.item.date }}
          td {{ props.item.timeSpent }}
          td
            v-icon.mr-3 {{ props.item.actions[0] }}
            v-icon.ml-3 {{ props.item.actions[1] }}
</template>

<script>
const actions = ['fas fa-pencil-alt', 'fas fa-times']

export default {
  data () {
    return {
      headers: [
        { text: 'Description', value: 'name', align: 'left', sortable: false },
        { text: 'Date', value: 'date', align: 'center', sortable: false },
        { text: 'Time Spent', value: 'timeSpent', align: 'center', sortable: false },
        { text: 'Actions', value: 'actions', align: 'center', sortable: false }
      ],
      entries: [
        { name: 'some task', date: '2/8/2019', timeSpent: 2.0, actions },
        { name: 'some task', date: '2/8/2019', timeSpent: 2.0, actions },
        { name: 'some task', date: '2/8/2019', timeSpent: 2.0, actions },
        { name: 'some task', date: '2/8/2019', timeSpent: 2.0, actions },
        { name: 'some task', date: '2/8/2019', timeSpent: 2.0, actions },
        { name: 'some task', date: '2/8/2019', timeSpent: 2.0, actions },
        { name: 'some task', date: '2/8/2019', timeSpent: 2.0, actions },
        { name: 'some task', date: '2/8/2019', timeSpent: 2.0, actions }
      ]
    }
  },
  methods: {
    addTotal () {
      let tableActions = document.querySelector('#time-table .v-datatable__actions')
      let div = document.createElement('div')
      div.classList.add('v-datatable__actions__monthly-total')
      div.innerHTML = `<p>February Total: 10.0 Hours</p>`
      if (tableActions) { tableActions.appendChild(div) }
    }
  },
  mounted () {
    this.addTotal()
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
