<template lang="pug">
  v-container(text-xs-center)
    v-layout(row wrap)
      v-flex(xs12 md6 offset-md3)
        form(@submit.prevent="submit")
          h1.my-2 Send Us a Message
          v-text-field(v-model="name" :error-messages="nameErrors" label="Name" required @input="$v.name.$touch()" @blur="$v.name.$touch()" solo)
          v-text-field(v-model="email" :error-messages="emailErrors" label="E-mail" required @input="$v.email.$touch()" @blur="$v.email.$touch()" solo)
          v-textarea(v-model="message" :error-messages="messageErrors" label="What's on your mind?" required @input="$v.message.$touch()" @blur="$v.message.$touch()" solo)
          v-btn(v-if="status != 'success'" @click="submit" color="primary" :loading="sending" :disabled="sending") Submit
          v-btn(v-if="status != 'success'" @click="clear" color="accent" :disabled="sending") Clear
        v-alert(v-if="status === 'success'" type="success" icon="fas fa-check" value="true") Success!&nbsp;&nbsp;Your message was received.&nbsp;&nbsp;Someone from Nemacolin Inc will be contacting you shortly.
        v-alert(v-if="status === 'fail'" type="error" icon="fas fa-times" value="true") Bummer!&nbsp;&nbsp;There was an error and your message was not received.&nbsp;&nbsp;Please try again.&nbsp;&nbsp;If you see this message again, please #[a(href="mailto:info@nemacolininc.com") email us] and let us know.
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import axios from 'axios'
export default {
  data () {
    return {
      name: '',
      email: '',
      message: '',
      ipData: {},
      sending: false,
      status: 'unsent'
    }
  },
  mixins: [validationMixin],
  validations: {
    name: { required },
    email: { required, email },
    message: { required }
  },
  computed: {
    nameErrors () {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.required && errors.push('Name is required.')
      return errors
    },
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Please enter a valid e-mail.')
      !this.$v.email.required && errors.push('E-mail is required.')
      return errors
    },
    messageErrors () {
      const errors = []
      if (!this.$v.message.$dirty) return errors
      !this.$v.message.required && errors.push('A message is required.')
      return errors
    }
  },
  methods: {
    submit () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.sending = true
        let messageData = { name: this.name, email: this.email.toLowerCase(), message: this.message, ipData: this.ipData, apiKey: process.env.VUE_APP_cloudFunctionsAPIKEY }
        axios.post('https://us-central1-nemacolin-website.cloudfunctions.net/widgets/', messageData)
          .then(res => {
            res.status === 200 ? this.status = 'success' : this.status = 'fail'
            this.sending = false
            this.clear()
          })
          .catch(error => {
            console.log(error)
            this.status = 'fail'
            this.sending = false
          })
      }
    },
    clear () {
      this.$v.$reset()
      this.name = ''
      this.email = ''
      this.message = ''
    }
  },
  created () {
    // Get IP Address of user which is submitted with the form data
    fetch('https://ipinfo.io/json')
      .then((data) => { return data.json() })
      .then(ip => { this.ipData = ip })
  }
}
</script>

<style scoped>
  .container {
    display: flex;
    align-items: center;
  }
  a {
    color: #161925;
  }
</style>
