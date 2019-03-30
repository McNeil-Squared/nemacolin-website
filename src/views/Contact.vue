<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12 md6 offset-md3)
      form(@submit.prevent="submit")
        h3.headline.text-xs-center.mb-2.primary--text Send Us a Message
        label.d-block.text-xs-left(for="name") Name
        v-text-field(v-model="name" :class="{'form-field--errors': areErrors('name')}" :error-messages="errors['name']" @input="validateField('name', 'Name', ['required', 'name'])" solo)
        label.d-block.text-xs-left(for="email") Email
        v-text-field(v-model="email" :class="{'form-field--errors': areErrors('email')}" :error-messages="errors['email']" @input="validateField('email', 'Email', ['required', 'email'])" solo)
        label.d-block.text-xs-left(for="message") Message
        v-textarea(v-model="message" :class="{'form-field--errors': areErrors('message')}" :error-messages="errors['message']" @input="validateField('message', 'Message', ['required'])" solo)
        div.text-xs-center
          v-btn(v-if="status != 'success'" @click="submit" color="primary" :loading="sending" :disabled="sending") Submit
          v-btn(v-if="status != 'success'" @click="clear" color="accent" :disabled="sending") Clear
      v-alert(v-if="status === 'success'" type="success" icon="fas fa-check" value="true") Success!&nbsp;&nbsp;Your message was received.&nbsp;&nbsp;Someone from Nemacolin Inc will be contacting you shortly.
      v-alert(v-if="status === 'fail'" type="error" icon="fas fa-times" value="true") Bummer!&nbsp;&nbsp;There was an error and your message was not received.&nbsp;&nbsp;Please try again.&nbsp;&nbsp;If you see this message again, please #[a(href="mailto:info@nemacolininc.com") email us] and let us know.
</template>

<script>
import axios from 'axios'

import { validationMixin } from 'vuelidate'
import { required, email, helpers } from 'vuelidate/lib/validators'
const name = helpers.regex('name', /^[a-zA-Z 0-9.,-]*$/)

export default {
  data () {
    return {
      name: '',
      email: '',
      message: '',
      errors: {},
      ipData: {},
      sending: false,
      status: ''
    }
  },
  mixins: [validationMixin],
  validations: {
    name: { required, name },
    email: { required, email },
    message: { required }
  },
  methods: {
    areErrors (field) {
      return this.errors[field] ? this.errors[field].length > 0 : false
    },
    validateField (field, label, validations) {
      this.errors[field] = []
      validations.forEach((validation) => {
        if (validation === 'required' && !this.$v[field].required) { this.errors[field].push(`${label} is required.`) }
        if (validation === 'email' && !this.$v[field].email) { this.errors[field].push(`Please enter a valid email address.`) }
        if (validation === 'name' && !this.$v[field].name) { this.errors[field].push(`${label} can only contain letters, numbers, spaces, commas, or periods.`) }
      })
    },
    submit () {
      if (!this.$v.$invalid) {
        this.sending = true
        let messageData = { name: this.name, email: this.email.toLowerCase(), message: this.message, ipData: this.ipData, apiKey: process.env.VUE_APP_cloudFunctionsAPIKEY }
        axios.post('https://us-central1-nemacolin-website.cloudfunctions.net/widgets/contact', messageData)
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
    fetch(`https://ipinfo.io/json?token=${process.env.VUE_APP_ipinfokey}`)
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
