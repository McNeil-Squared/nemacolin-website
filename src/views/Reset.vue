<template lang="pug">
  v-container(text-xs-center)
    v-layout(row wrap)
      v-flex(xs12 md4 offset-md4)
        form(@submit.prevent="submit" autocomplete="on")
          h2.mt-2.mb-4 Reset Your Password
          p.mb-4.black--text Enter your account email below and click submit.
          v-text-field(v-model="username" :error-messages="usernameErrors" label="Email" required @input="$v.username.$touch()" @blur="$v.username.$touch()" solo)
          v-btn(v-if="status != 'success'" @click="submit" color="primary" :loading="sending" :disabled="sending") Submit
        v-alert(v-if="status === 'success' && !sending" type="success" icon="fas fa-check" value="true") Success!&nbsp;&nbsp;Password reset request received.&nbsp;&nbsp;Please check your email for a link to complete the password reset process.
        v-alert(v-if="status === 'error' && !sending" type="error" icon="fas fa-times" value="true") {{ errorMessage }}
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
// import firebase from 'firebase'
import axios from 'axios'

export default {
  data () {
    return {
      username: '',
      sending: false,
      status: '',
      errorMessage: ''
    }
  },
  mixins: [validationMixin],
  validations: { username: { required } },
  computed: {
    usernameErrors () {
      const errors = []
      if (!this.$v.username.$dirty) return errors
      !this.$v.username.required && errors.push('Username is required.')
      return errors
    }
  },
  methods: {
    submit () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.status = ''
        this.sending = true
        let messageData = {
          email: this.username.toLowerCase(),
          apiKey: process.env.VUE_APP_cloudFunctionsAPIKEY
        }
        axios.post('https://us-central1-nemacolin-website.cloudfunctions.net/widgets/resetpassword', messageData)
          .then(() => {
            this.status = 'success'
            this.sending = false
          })
          .catch((error) => {
            console.log(error.response)
            error.response.data.code === 'auth/user-not-found' ? this.errorMessage = 'Sorry, there is no account with that email.\u00A0\u00A0Were you registered with a different email?' : this.errorMessage = 'Hmmmm!\u00A0\u00A0It looks like something went wrong.\u00A0\u00A0Please try again.'
            this.status = 'error'
            this.sending = false
          })
      }
    }
  }
}
</script>

<style scoped>
  .container {
    display: flex;
    align-items: center;
  }
  a {
    color: #e3f2fd;
  }
  p {
    color: blue;
  }
  p:hover {
    cursor: pointer;
  }
</style>
