<template lang="pug">
  div
    v-alert.subheading.black--text(v-if="!verified && !verificationResend && !verificationResendError" type="warning" color="warning" icon="fas fa-exclamation-triangle" value="true") {{ user.displayName }}, you have not verified your email yet.&nbsp;&nbsp;Please check your inbox (or spam or trash folder) for a email verification message.
      v-btn(v-if="status !== 'success' && !notFound" @click="resendVerificationEmail" color="primary" :loading="sending" :disabled="sending") Resend Email Verification
    v-alert(v-if="!verified && verificationResend" type="success" icon="fas fa-check" value="true") Your verification email has been resent.&nbsp;&nbsp;Please check your inbox (or spam or trash folder) for a email verification message.&nbsp;&nbsp;Once you verify your email, click the refresh button on your browser and this annoying message should go away.
    v-alert(v-if="!verified && verificationResendError" type="error" icon="fas fa-times" value="true") There was a problem sending your verification email.&nbsp;&nbsp;Please wait and then try again.&nbsp;&nbsp;To resend the verification email, #[a(@click="resendVerificationEmail") click here].
</template>

<script>
import firebase from '../firebase.js'
import axios from 'axios'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      verified: true,
      verificationResend: false,
      verificationResendError: false,
      status: 'pending',
      sending: false
    }
  },
  methods: {
    resendVerificationEmail () {
      this.sending = true
      let currentUser = firebase.auth().currentUser
      let userData = {
        email: currentUser.email,
        type: 'resend',
        apiKey: process.env.VUE_APP_cloudFunctionsAPIKEY
      }
      axios.post('https://us-central1-nemacolin-website.cloudfunctions.net/widgets/verifyemail', userData)
        .then(() => {
          this.sending = true
          this.verificationResend = true
        }).catch((error) => {
          console.log('verification email error: ', error)
          this.sending = true
          this.verificationResendError = true
        })
    }
  },
  computed: mapState(['user']),
  watch: {
    user: function () {
      if (this.user) {
        this.verified = this.user.verified
      }
    }
  },
  created () {
    if (this.user) {
      this.verified = this.user.verified
    }
  }
}
</script>
