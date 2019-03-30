<template lang="pug">
  v-dialog(v-model="forgotPasswordModal" :width="width" persistent)
    form.pa-3.text-xs-center(@submit.prevent="submitResetRequest" autocomplete="on")
      h4.mt-2.mb-4.text-xs-center Please enter your email address.
      label.d-block.text-xs-left(for="email") Email
      v-text-field(v-model="email"  placeholder="Email" :class="{'form-field--errors': areErrors('email')}" :error-messages="errors['email']" @input="validateField('email', 'Email', ['required', 'email'])" solo)
      v-btn.mx-3(@click="submitResetRequest" color="primary" :loading="sendingResetRequest" :disabled="sendingResetRequest || $v.email.$invalid") Submit
      v-btn.mx-3(@click="$emit('closeForgotPasswordModal')" color="accent" v-if="!sendingResetRequest") Cancel
      v-fade-transition
        v-alert.mt-3(v-if="status === 'user not found'" type="error" icon="fas fa-times" value="true") A user with that email does not exist in our system.
        v-alert.mt-3(v-if="status === 'disabled'" type="error" icon="fas fa-times" value="true") This account has been disabled.
        v-alert.mt-3(v-if="status === 'reset request failure'" type="error" icon="fas fa-times" value="true") It looks like something went wrong.&nbsp;&nbsp;Please re-submit.
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import axios from 'axios'

export default {
  data () {
    return {
      width: 500,
      email: '',
      errors: {},
      sendingResetRequest: false,
      status: ''
    }
  },
  props: {
    forgotPasswordModal: { type: Boolean, required: true }
  },
  mixins: [validationMixin],
  validations: {
    email: { required, email }
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
      })
    },
    submitResetRequest () {
      if (!this.$v.email.$invalid) {
        this.status = ''
        this.sendingResetRequest = true

        let userData = {
          email: this.email,
          apiKey: process.env.VUE_APP_cloudFunctionsAPIKEY
        }

        axios.post('https://us-central1-nemacolin-website.cloudfunctions.net/widgets/forgotpassword', userData)
          .then(response => {
            if (response.status === 200) {
              this.$emit('resetRequestSuccess')
              this.$emit('closeForgotPasswordModal')
              this.sendingResetRequest = false
            } else {
              console.log('other axios error: ', response)
              this.status = 'reset request failure'
              this.sendingResetRequest = false
            }
          }).catch((error) => {
            console.log('axios error: ', error.response)
            if (error.response.data.code === 'auth/user-not-found') {
              this.status = 'user not found'
            } else if (error.response.data.code === 'auth/user-disabled') {
              this.status = 'disabled'
            } else {
              this.status = 'reset request failure'
            }
            this.sendingResetRequest = false
          })
      }
    }
  }
}
</script>
