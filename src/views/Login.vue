<template lang="pug">
  v-container(text-xs-center)
    v-layout(row wrap)
      v-flex(xs12 md4 offset-md4)
        form.mb-2(@submit.prevent="submit" autocomplete="on")
          h2.mt-2.mb-4 Nemacolin Inc Board Member Login
          v-text-field(v-model="useremail" placeholder="User Email" :class="{'form-field--errors': areErrors('useremail')}" :error-messages="errors['useremail']" @input="validateField('useremail', 'User Email', ['required', 'email'])" solo)
          v-text-field(v-model="password" placeholder="Password" :class="{'form-field--errors': areErrors('password')}" :error-messages="errors['password']" @input="validateField('password', 'Passwword', ['required'])" solo type="password")
          v-btn(v-if="status != 'success'" @click="submit" color="primary" :loading="sending" :disabled="sending || $v.useremail.$invalid || $v.password.$invalid") Submit
          p.mt-3.link(@click="forgotPasswordModal = true") I forgot my password.
        v-alert(v-if="status === 'credentialError' && !sending" type="error" icon="fas fa-times" value="true") Incorrect username or password.
        v-alert(v-if="status === 'disabled' && !sending" type="error" icon="fas fa-times" value="true") This account has been disabled.
        v-alert.text-xs-left(v-if="status === 'reset request success'" type="success" icon="fas fa-check" value="true") Success!&nbsp;&nbsp;Your password reset request has been received.&nbsp;&nbsp;Your request will be processed within 24 hours.&nbsp;&nbsp;Once your reqest has been processed you will receive an email with your new password.
        Forgot-Password-Modal(:forgotPasswordModal="forgotPasswordModal" @closeForgotPasswordModal="forgotPasswordModal = false" @resetRequestSuccess="status = 'reset request success'")
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import firebase from 'firebase'

import ForgotPassword from '../components/ForgotPassword'

export default {
  data () {
    return {
      useremail: '',
      password: '',
      errors: {},
      sending: false,
      forgotPasswordModal: false,
      status: ''
    }
  },
  components: { 'Forgot-Password-Modal': ForgotPassword },
  mixins: [validationMixin],
  validations: {
    useremail: { required, email },
    password: { required },
    email: { required, email }
  },
  methods: {
    areErrors (field) {
      return this.errors[field] ? this.errors[field].length > 0 : false
    },
    submit () {
      this.$v.$touch()
      if (!this.$v.useremail.$invalid && !this.$v.password.$invalid) {
        this.status = ''
        this.sending = true
        let loginData = { email: this.useremail.toLowerCase(), password: this.password }
        firebase.auth().signInWithEmailAndPassword(loginData.email, loginData.password)
          .then((userObject) => this.$store.dispatch('setUserData', userObject.user))
          .then(this.$router.replace('/dashboard'))
          .catch((error) => {
            console.log(error)
            if (error.code === 'auth/user-disabled') {
              this.status = 'disabled'
            } else {
              this.status = 'credentialError'
            }
            this.sending = false
          })
      }
    },
    validateField (field, label, validations) {
      this.errors[field] = []
      validations.forEach((validation) => {
        if (validation === 'required' && !this.$v[field].required) { this.errors[field].push(`${label} is required.`) }
        if (validation === 'email' && !this.$v[field].email) { this.errors[field].push(`Please enter a valid email address.`) }
      })
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
</style>
