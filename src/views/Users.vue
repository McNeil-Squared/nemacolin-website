<template lang="pug">
  div
    h2.text-xs-center.primary--text.mb-3 User Management
    div.text-xs-center.my-2(v-if="loading")
      v-icon.loading fas fa-sync
    v-btn(fab fixed bottom right color="primary" to="/adduser")
      v-icon fas fa-plus
    v-layout(row wrap)
      v-flex(xs12 md6 v-for="(user, i) in users" :key="i" v-if="!loading")
        v-card(:class="[{disabledUser: user.disabled}]").mx-2
          v-card-title.pb-0(primary title)
            div.full-width.text-xs-center.mb-3
              h3.headline.mb-0.mx-auto {{ user.firstName }} {{ user.lastName }}
            v-layout(row wrap)
              v-flex(xs12 md7)
                p #[span.font-weight-bold Email:] {{ user.email }}
                p #[span.font-weight-bold Position:] {{ user.position }}
              v-flex(xs12 md5)
                p #[span.font-weight-bold Phone:] {{ user.phone }}
                p #[span.font-weight-bold Role:] {{ user.role }}
          v-card-actions.justify-center
            v-btn(color="accent" @click="toggleResetPasswordModal(user)") Reset Password
            v-btn(color="secondary" :to="user.profileLink") User Details
            v-btn.white--text(v-if="!user.disabled" color="caution" @click="confirmAction(user, 'Disable')") Disable User
            v-btn.white--text(v-else color="caution" @click="confirmAction(user, 'Re-Enable')") Re-Enable User
            v-btn(color="primary" @click="confirmAction(user, 'Delete')") Delete User
    v-layout(row wrap)
      v-flex(xs12 md4 offset-md4)
        v-dialog(v-model="confirm" :width="width")
          v-card.text-xs-center
            v-alert.title.mt-0.adjust-icon(type="warning" color="error" icon="fas fa-exclamation-triangle" value="true") Confirm {{ action }} User {{ targetUser.firstName }} {{ targetUser.lastName }}
            v-card-title
              p.mx-auto.subheading(v-if="action === 'Disable'") Are you sure you want to disable the user {{ targetUser.firstName }} {{ targetUser.lastName }}?
              p.mx-auto.subheading(v-else-if="action === 'Re-Enable'") Are you sure you want to Re-Enable the user {{ targetUser.firstName }} {{ targetUser.lastName }}?
              p.mx-auto.subheading(v-else) Are you sure you want to delete the user {{ targetUser.firstName }} {{ targetUser.lastName }}?
                br
                | This action is irreversible.
            v-card-actions.pb-4
              v-btn.mx-auto(@click="action !== 'Delete' ? disableOrReEnableUser() : deleteUser()" color="primary" :loading="sending" :disabled="sending") Confirm
              v-btn.mx-auto(@click="confirm = false" color="accent" v-show="!sending") Cancel
    v-layout(row wrap)
      v-flex(xs12 md4 offset-md4)
        ResetPassword
</template>

<script>
import firebase from '../firebase.js'
import axios from 'axios'
import ResetPassword from '../components/ResetPassword'

export default {
  data () {
    return {
      loading: true,
      width: 500,
      users: [],
      confirm: false,
      targetUser: {},
      action: '',
      sending: false,
      status: ''
    }
  },
  components: { ResetPassword },
  methods: {
    getUsers () {
      firebase.firestore().collection('users').get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            let firebaseData = doc.data()
            let userCard = {
              firstName: firebaseData.firstName,
              lastName: firebaseData.lastName,
              email: firebaseData.email,
              phone: firebaseData.phone,
              position: firebaseData.position,
              role: firebaseData.role,
              profileLink: 'profile/' + firebaseData.username,
              disabled: firebaseData.disabled
            }
            this.users.push(userCard)
          })
          this.loading = false
        }).catch((error) => {
          console.log(error)
          this.loading = false
        })
    },
    confirmAction (user, action) {
      this.confirm = true
      this.targetUser = user
      this.action = action
      this.status = ''
    },
    disableOrReEnableUser () {
      this.sending = true
      this.status = ''
      let userData = {
        action: this.action,
        email: this.targetUser.email,
        apiKey: process.env.VUE_APP_cloudFunctionsAPIKEY
      }
      axios.post('https://us-central1-nemacolin-website.cloudfunctions.net/widgets/disableorreenableuser', userData)
        .then((userRecord) => {
          let disable
          this.action === 'Disable' ? disable = true : disable = false
          console.log(userRecord)
          firebase.firestore().collection('users').doc(userRecord.data.uid).update({ disabled: disable })
            .then(() => {
              this.sending = false
              let userToUpdate = this.users.findIndex((user) => { return user.email === this.targetUser.email })
              this.users[userToUpdate].disabled = disable
              this.confirm = false
              this.status = 'success'
            })
            .catch((error) => {
              console.log('Database error: ', error)
              this.sending = false
              this.status = 'error'
            })
        })
        .catch((error) => {
          console.log('disable/re-enable user error: ', error)
          this.sending = false
          this.status = 'error'
        })
    },
    deleteUser () {
      this.sending = true
      this.status = ''
      let userData = {
        email: this.targetUser.email,
        apiKey: process.env.VUE_APP_cloudFunctionsAPIKEY
      }
      axios.post('https://us-central1-nemacolin-website.cloudfunctions.net/widgets/deleteuser', userData)
        .then((userRecord) => {
          firebase.firestore().collection('users').doc(userRecord.data.uid).delete()
            .then(() => {
              this.sending = false
              let userToDelete = this.users.findIndex((user) => { return user.email === this.targetUser.email })
              this.users.splice(userToDelete, 1)
              this.confirm = false
              this.status = 'success'
            })
            .catch((error) => {
              console.log('Database error: ', error)
              this.sending = false
              this.status = 'error'
            })
        })
        .catch((error) => {
          console.log('delete user error: ', error.response)
          this.sending = false
          this.status = 'error'
        })
    },
    toggleResetPasswordModal (user) {
      this.$store.dispatch('setTargetUser', user)
      this.$store.dispatch('toggleResetPasswordModal')
    }
  },
  created () {
    this.getUsers()
    // Set the width of the add users modal to 90% of screen width on screens less than 500px.  Percent and vw values are not allowed.
    if (window.innerwidth < 500) this.width = window.innerWidth * 0.9
  }
}
</script>

<style scoped>
  .full-width {
    width: 100%;
  }
  .v-btn--bottom:not(.v-btn--absolute) {
    bottom: 60px;
  }
  .adjust-icon >>> .v-icon {
    margin-bottom: 4px;
  }
</style>
