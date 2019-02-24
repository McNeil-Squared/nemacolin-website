<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12 md4 offset-md4)
      v-dialog(v-model="deleteFileModal" :width="width")
        v-card.text-xs-center
          v-alert.title.mt-0.adjust-icon(type="warning" color="error" icon="fas fa-exclamation-triangle" value="true") Confirm deletion of {{ target.title }}
          v-card-title
            p.mx-auto.subheading() Are you sure you want to delete the {{ type }} #[span.font-weight-bold {{ target.name }}]?
            p.mx-auto.subheading(v-if="extraMessage") {{ extraMessage }}
          v-card-actions.pb-4
            v-btn.mx-auto(@click="deleteFile(type, data)" color="primary" :loading="sending" :disabled="sending") Confirm
            v-btn.mx-auto(@click="toggleDeleteFileModal" color="accent" v-show="!sending") Cancel
        v-alert(v-if="error && !sending" type="error" icon="fas fa-times" value="true") It looks like something went wrong.&nbsp;&nbsp;Please try again.
</template>

<script>
import firebase from 'firebase'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      confirm: false,
      width: 500,
      sending: false,
      error: false
    }
  },
  props: {
    type: { type: String, required: true },
    target: { type: Object, required: true },
    extraMessage: { type: String, required: false },
    data: { type: Object, required: true }
  },
  computed: mapState([ 'deleteFileModal' ]),
  methods: {
    deleteFile () {
      if (this.type === 'file') {
        this.sending = true
        let storageRef = firebase.storage().ref().child(this.data.docRef)
        let databaseDocRef = this.data.docRef.replace('/', '-')
        storageRef.delete()
          .then(() => {
            firebase.firestore().collection('files').doc(databaseDocRef).delete()
              .then(() => {
                this.$parent.getFiles()
                this.toggleDeleteFileModal()
                this.sending = false
              })
              .catch((error) => {
                this.sending = false
                this.error = true
                console.log('file database deletion error: ', error)
              })
          })
          .catch((error) => {
            this.sending = false
            this.error = true
            console.log('file deletion error: ', error)
          })
      }
    },
    toggleDeleteFileModal () {
      this.$store.dispatch('toggleDeleteFileModal')
    }
  }
}
</script>
