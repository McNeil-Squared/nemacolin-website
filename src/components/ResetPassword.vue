<template lang="pug">
  v-dialog(v-model="resetPasswordModal" :width="width" persistent)
    form.pa-3.text-xs-center(@submit.prevent="submit" autocomplete="on")
      h4.mt-2.mb-4.text-xs-center Please enter the new password for {{ targetUser.firstName }} {{ targetUser.lastName }}
      label.d-block.text-xs-left(for="password") Password
      v-text-field#password(v-model="password"  placeholder="Password" :error-messages="errors['password']" @input="validateField('password', 'Password', ['required', 'password'])" solo type="password")
      label.d-block.text-xs-left(for="password") Re-enter Password
      v-text-field#password(v-model="confirmPassword"  placeholder="Re-enter Password" :error-messages="errors['confirmPassword']" @input="validateField('confirmPassword', 'Re-Enter Password', ['required', 'sameAsPassword'])" solo type="password")
      v-btn.mx-3(@click="submit" color="primary" :loading="sending" :disabled="sending || $v.$invalid") Submit
      v-btn.mx-3(@click="toggleResetPasswordModal" color="accent" v-if="!sending") Cancel
      v-alert(v-if="error && !sending" type="error" icon="fas fa-times" value="true") It looks like something went wrong.&nbsp;&nbsp;Please re-submit.
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import { validationMixin } from 'vuelidate'
import { required, sameAs, helpers } from 'vuelidate/lib/validators'
const password = helpers.regex('password', /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)

export default {
  data () {
    return {
      password: '',
      confirmPassword: '',
      errors: [],
      sending: false,
      error: false,
      width: 500
    }
  },
  mixins: [validationMixin],
  validations: {
    password: { required, password },
    confirmPassword: { required, sameAsPassword: sameAs(function () { return this.password }) }
  },
  methods: {
    validateField (field, label, validations) {
      this.errors[field] = []
      validations.forEach((validation) => {
        if (validation === 'required' && !this.$v[field].required) { this.errors[field].push(`${label} is required.`) }
        if (validation === 'password' && !this.$v[field].password) { this.errors[field].push(`Password must be at least 8 characters long with 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.`) }
        if (validation === 'sameAsPassword' && !this.$v[field].sameAsPassword) { this.errors[field].push(`Passwords do not match.`) }
      })
    },
    toggleResetPasswordModal () {
      this.$store.dispatch('toggleResetPasswordModal')
    },
    submit () {
      this.sending = true
      let userData = {
        email: this.targetUser.email,
        password: this.password,
        apiKey: process.env.VUE_APP_cloudFunctionsAPIKEY
      }
      axios.post('http://localhost:5000/nemacolin-website/us-central1/widgets/resetpassword', userData)
        .then(() => {
          this.toggleResetPasswordModal()
          this.sending = false
        })
        .catch((error) => {
          console.log('change user password error: ', error.response)
          this.sending = false
          this.error = true
        })
    }
  },
  computed: mapState([ 'resetPasswordModal', 'targetUser' ]),
  created () {
    if (window.innerwidth < 500) this.width = window.innerWidth * 0.9
  }
}
</script>
