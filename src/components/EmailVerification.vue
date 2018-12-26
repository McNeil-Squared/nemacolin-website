<template lang="pug">
  div
    v-alert(v-if="!user.verified && !verificationResend && !verificationResendError" type="warning" color="caution" icon="fas fa-exclamation-triangle" value="true") {{ user.displayName }}, you have not verified your email yet.&nbsp;&nbsp;Please check your inbox (or spam or trash folder) for a email verification message.&nbsp;&nbsp;If you need to resend the verification email, #[a.blue--text.text--darken-4(@click="resendVerificationEmail") click here].
    v-alert(v-if="!user.verified && verificationResend" type="success" icon="fas fa-check" value="true") Your verification email has been resent.&nbsp;&nbsp;Please check your inbox (or spam or trash folder) for a email verification message.
    v-alert(v-if="!user.verified && verificationResendError" type="error" icon="fas fa-times" value="true") There was a problem sending your verification email.&nbsp;&nbsp;Please wait and then try again.&nbsp;&nbsp;To resend the verification email, #[a(@click="resendVerificationEmail") click here].
</template>

<script>
import firebase from '../firebase.js'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      verificationResend: false,
      verificationResendError: false
    }
  },
  methods: {
    resendVerificationEmail () {
      let currentUser = firebase.auth().currentUser
      currentUser.sendEmailVerification()
        .then(() => {
          this.verificationResend = true
        }).catch((error) => {
          console.log('verification email error: ', error)
          this.verificationResendError = true
        })
    }
  },
  computed: mapState(['user'])
}
</script>
