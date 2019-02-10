<template lang="pug">
  div
    h3.secondary--text.text-xs-center.mb-2 Upcoming Meetings
    v-card
      v-data-table#meeting-table.text-xs-center(:headers="headers" :items="entries" sort-icon="fas fa-arrow-up" prev-icon="fas fa-chevron-left" next-icon="fas fa-chevron-right")
        template(slot="items" slot-scope="props")
          td.text-xs-left {{ props.item.name }}
          td {{ props.item.date }}
            br
            | {{ props.item.time }}
          td {{ props.item.where }}
          td(v-if="role === 'admin'")
            v-icon.mr-3 {{ props.item.actions[0] }}
            v-icon.ml-3 {{ props.item.actions[1] }}
</template>

<script>
import { mapState } from 'vuex'

const actions = ['fas fa-pencil-alt', 'fas fa-times']

export default {
  data () {
    return {
      headers: [
        { text: 'Description', value: 'name', align: 'left', sortable: false },
        { text: 'When', value: 'dateTime', align: 'center', sortable: false },
        { text: 'Where', value: 'time', align: 'center', sortable: false },
        { text: 'Actions', value: 'actions', align: 'center', sortable: false }
      ],
      entries: [
        { name: 'Monthly Board Meeting', date: '2/8/2019', time: '6:30 PM', where: 'UMWA Union Hall', actions },
        { name: 'February Workshop', date: '2/19/2019', time: '6:30 PM', where: 'UMWA Union Hall', actions }
      ]
    }
  },
  computed: {
    role () {
      if (this.user) { return this.user.role }
    },
    ...mapState(['user'])
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
</style>
