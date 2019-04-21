<template lang="pug">
  div
    Email-Verification-Message.text-xs-center.mb-3
    v-layout(row wrap)
      v-flex(xs12 md4 offset-md4)
        h2.text-xs-center.primary--text {{ username ? 'User Profile' : 'Add New User' }}
        div.text-xs-center.my-2(v-if="loading && username")
          v-icon.loading fas fa-sync
        div.text-xs-center.my-2(v-if="!loading && notFound")
          p The user {{ username }} does not exist.
        form(@submit.prevent="submit" v-if="!loading")
          h4.text-xs-center.my-2(v-if="username") {{ userTitle }}
          template(v-for="(item, key) in user")
            template(v-if="key !=='mailing' && key !=='physical'")
              template(v-if="((key === 'username' || key === 'position' || key === 'role') && loggedinUser.role === 'admin') || ((key === 'password' || key === 'retypePassword') && type === 'adduser') || (key !=='username' && key !== 'position' && key !== 'role' && key !== 'password' && key !== 'retypePassword')")
                template(v-if="item.type === 'input'")
                  template(v-if="key === 'password' || key === 'retypePassword'")
                    label(for="key") {{ item.label }}
                    v-text-field(v-model="user[key].value" :id="key" :class="{'form-field--errors': areErrors(key)}" :error-messages="errors[key]" @input="validateField(key, item.label, user[key].validations)" solo :disabled="key==='username'" type="password")
                  template(v-else)
                    label(for="key") {{ item.label }}
                    v-text-field(v-model="user[key].value" :id="key" :class="{'form-field--errors': areErrors(key)}" :error-messages="errors[key]" @input="validateField(key, item.label, user[key].validations)" solo :disabled="key==='username'")
                    v-alert.mb-4(v-if="username" :value="item.label === 'Email'" icon="fas fa-info-circle" type="info") Note: Your email address is used to login to the website, so if you change your email please remember to use your new email when you login.
                template(v-else)
                  label(for="key") {{ item.label }}
                  v-select(v-model="user[key].value" :items="user[key].options" :label="user[key].label" solo append-icon="fas fa-sort-down")
            template(v-else)
              template(v-for="(subitem,key2) in item")
                template(v-if="subitem.type === 'input'")
                  label(for="key2") {{ subitem.label }}
                  v-text-field(v-model="item[key2].value" :id="key2" :class="{'form-field--errors': areErrors([key,key2])}" :error-messages="errors[key] ? errors[key][key2] : []" @input="validateField([key, key2], subitem.label, user[key][key2].validations)" solo)
                template(v-else)
                  label(for="key2") {{ subitem.label }}
                  v-select(v-model="item[key2].value" :items="item[key2].options" item-text="label" item-value="value" :label="item[key2].label" solo append-icon="fas fa-sort-down")
          div.text-xs-center
            v-btn(v-if="status !== 'success' && !notFound" @click="submit" color="primary" :loading="sending" :disabled="sending || $v.$invalid") Submit
        v-alert(v-if="status === 'success' && !sending" type="success" icon="fas fa-check" value="true") Success!&nbsp;&nbsp;Your profile has been updated.
        v-alert(v-if="status === 'success' && emailUpdated && !sending" type="success" icon="fas fa-check" value="true") Success!&nbsp;&nbsp;Your email address has been updated.&nbsp;&nbsp;Please check your new email for a verification message.&nbsp;&nbsp;You must verify your new email address before continuing.
        v-alert.text-xs-left(v-if="status === 'reset request success'" type="success" icon="fas fa-check" value="true") Success!&nbsp;&nbsp;Your password reset request has been received.&nbsp;&nbsp;Your request will be processed within 24 hours.&nbsp;&nbsp;Once your reqest has been processed you will receive an email with your new password.
        v-alert(v-if="status === 'error' && !sending" type="error" icon="fas fa-times" value="true") Bummer!&nbsp;&nbsp;There was an error and your profile was not updated.&nbsp;&nbsp;Please try again.&nbsp;&nbsp;If you see this message again, please #[a(href="mailto:info@nemacolininc.com") email us] and let us know.
        v-alert(v-if="status === 'emailInUseError' && !sending" type="error" icon="fas fa-times" value="true") The email: {{ user.email.value }}, is already in use by another user.
        v-dialog(v-model="showReauthticationModal" persistant width="400")
          form.pa-3(@submit.prevent="submit" autocomplete="on")
            h4.mt-2.mb-4.text-xs-left Hello, It looks like you haven't logged in for awhile.&nbsp;&nbsp;Please re-enter your password to complete the update.
            label.d-block.text-xs-left(for="password") Password
            v-text-field#password(v-model="reauthenticationPassword"  placeholder="Password" :class="{'form-field--errors': areErrors('reauthenticationPassword')}" :error-messages="errors['reauthenticationPassword']" @input="validateField('reauthenticationPassword', 'Password', passwordValidations)" solo type="password")
            div.text-xs-center
              v-btn(v-if="status != 'success'" @click="reauthenticate(currentUserEmail, reauthenticationPassword, updatedUserdata)" color="primary" :loading="sendingPassword" :disabled="sendingPassword || $v.$invalid") Submit
              p.mt-3.link(@click="showForgotPasswordModal") I forgot my password.
            v-alert(v-if="showPasswordError && !sendingPassword" type="error" icon="fas fa-times" value="true") Incorrect password.
        Forgot-Password-Modal(:forgotPasswordModal="forgotPasswordModal" @closeForgotPasswordModal="forgotPasswordModal = false" @resetRequestSuccess="status = 'reset request success'")
</template>

<script>
import firebase from '../firebase.js'
import axios from 'axios'
import states from '../states.js'
import { mapState } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required, requiredIf, sameAs, email, numeric, minLength, maxLength, helpers } from 'vuelidate/lib/validators'

import EmailVerification from '../components/EmailVerification'
import ForgotPassword from '../components/ForgotPassword'

/* eslint-disable no-useless-escape */
const name = helpers.regex('name', /^[a-zA-Z 0-9\.\,\-]*$/)
const phone = helpers.regex('phone', /^[0-9]{3}\-[0-9]{3}\-[0-9]{4}$/)
const password = helpers.regex('password', /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)

export default {
  data () {
    return {
      loading: true,
      notFound: false,
      user: {},
      userid: '',
      errors: {},
      currentUserEmail: '',
      currentUserUsername: '',
      sending: false,
      status: 'pending',
      updatedUserdata: {},
      emailUpdated: false,
      showReauthticationModal: false,
      reauthenticationPassword: '',
      passwordValidations: ['required'],
      sendingPassword: false,
      showPasswordError: false,
      forgotPasswordModal: false
    }
  },
  props: {
    username: { type: String, required: false },
    type: { type: String, required: true }
  },
  components: { 'Email-Verification-Message': EmailVerification, 'Forgot-Password-Modal': ForgotPassword },
  mixins: [validationMixin],
  validations: {
    user: {
      email: { value: { required, email } },
      password: { value: { required: requiredIf(function () { return this.type === 'adduser' }), password } },
      retypePassword: { value: { required: requiredIf(function () { return this.type === 'adduser' }), sameAsPassword: sameAs(function () { return this.user.password.value }) } },
      firstName: { value: { required, name } },
      lastName: { value: { required, name } },
      phone: { value: { required, phone } },
      mailing: {
        address: { value: { required, name } },
        city: { value: { required, name } },
        state: { value: { required } },
        zip: { value: { required, numeric, minLength: minLength(5), maxLength: maxLength(5) } }
      },
      physical: {
        address: { value: { required, name } },
        city: { value: { required, name } },
        state: { value: { required } },
        zip: { value: { required, numeric, minLength: minLength(5), maxLength: maxLength(5) } }
      },
      username: { value: { required } },
      position: { value: { required } },
      role: { value: { required } }
    },
    reauthenticationPassword: { required: requiredIf(function () { return this.showReauthticationModal }) }
  },
  methods: {
    areErrors (field) {
      if (typeof field === 'string') {
        return this.errors[field] ? this.errors[field].length > 0 : false
      } else {
        // if this.errors[field[0]] is undefined return false, else if his.errors[field[0]][field[1]] is undefined return false else return this.errors[field[0]][field[1]].length > 0
        return !this.errors[field[0]] ? false
          : !this.errors[field[0]][field[1]] ? false : this.errors[field[0]][field[1]].length > 0
      }
    },
    getUserData () {
      let dbQuery = this.loggedinUser.role === 'admin' ? firebase.firestore().collection('users').where('username', '==', this.username).get() : firebase.firestore().collection('users').doc(this.$store.getters.user.uid).get()
      dbQuery.then((result) => {
        let firebaseData
        if (this.loggedinUser.role === 'admin') {
          result.forEach(user => {
            firebaseData = user.data()
            this.userid = user.id
          })
        } else {
          firebaseData = result.data()
          this.userid = result.id
        }
        if (!firebaseData) {
          this.loading = false
          this.notFound = true
        } else {
          this.buildForm(firebaseData)
        }
      }).catch(error => console.log('database error: ', error))
    },
    buildForm (firebaseData = null) {
      let currentUser = {
        email: { label: 'Email', value: firebaseData ? firebaseData.email : '', type: 'input', validations: ['required', 'email'] },
        password: { label: 'Password', value: '', type: 'input', validations: ['required', 'password'] },
        retypePassword: { label: 'Confirm Password', value: '', type: 'input', validations: ['required', 'sameAsPassword'] },
        firstName: { label: 'First Name', value: firebaseData ? firebaseData.firstName : '', type: 'input', validations: ['required', 'name'] },
        lastName: { label: 'Last Name', value: firebaseData ? firebaseData.lastName : '', type: 'input', validations: ['required', 'name'] },
        phone: { label: 'Phone Number', value: firebaseData ? firebaseData.phone : '', type: 'input', validations: ['required', 'phone'] },
        mailing: {
          address: { label: 'Mailing Address', value: firebaseData ? firebaseData.mailing.address : '', type: 'input', validations: ['required', 'name'] },
          city: { label: 'Mailing City', value: firebaseData ? firebaseData.mailing.city : '', type: 'input', validations: ['required', 'name'] },
          state: { label: 'Mailing State', value: firebaseData ? firebaseData.mailing.state : '', type: 'select', options: states, validations: ['required'] },
          zip: { label: 'Mailing Zip Code', value: firebaseData ? firebaseData.mailing.zip : '', type: 'input', validations: ['required', 'numeric', 'minLength', 'maxLength'] }
        },
        physical: {
          address: { label: 'Physical Address', value: firebaseData ? firebaseData.physical.address : '', type: 'input', validations: ['required', 'name'] },
          city: { label: 'Physical City', value: firebaseData ? firebaseData.physical.city : '', type: 'input', validations: ['required', 'name'] },
          state: { label: 'Physical State', value: firebaseData ? firebaseData.physical.state : '', type: 'select', options: states, validations: ['required'] },
          zip: { label: 'Physical Zip Code', value: firebaseData ? firebaseData.physical.zip : '', type: 'input', validations: ['required', 'numeric', 'minLength', 'maxLength'] }
        },
        username: { label: 'User Name', value: firebaseData ? firebaseData.username : '', type: 'input', validations: ['required'] },
        position: { label: 'Position', value: firebaseData ? firebaseData.position : '', type: 'select', options: ['President', 'Vice-President', 'Secretary', 'Treasurer', 'Member', 'Support', 'Council', 'Vendor'], validations: ['required'] },
        role: { label: 'System Role', value: firebaseData ? firebaseData.role : '', type: 'select', options: ['user', 'admin'], validations: ['required'] }
      }
      this.user = currentUser
      this.currentUserEmail = firebaseData ? firebaseData.email : ''
      this.currentUserUsername = firebaseData ? firebaseData.username : ''
      this.loading = false
    },
    submit () {
      if (!this.$v.$invalid) {
        this.sending = true
        this.stutus = 'pending'
        for (let item in this.user) {
          if (item === 'mailing' || item === 'physical') {
            if (!this.updatedUserdata['mailing']) { this.updatedUserdata['mailing'] = {} }
            if (!this.updatedUserdata['physical']) { this.updatedUserdata['physical'] = {} }
            for (let subitem in this.user[item]) {
              this.updatedUserdata[item][subitem] = this.user[item][subitem].value
            }
          } else if (item !== 'password') {
            this.updatedUserdata[item] = this.user[item].value
          }
        }
        if (this.type === 'profile') {
          this.emailChanged || this.usernameChanged ? this.updateAuthdata(this.updatedUserdata) : this.updateDatabase(this.updatedUserdata)
        } else {
          let userData = {
            email: this.updatedUserdata.email,
            emailVerified: false,
            password: this.user.password.value,
            displayName: `${this.updatedUserdata.firstName} ${this.updatedUserdata.lastName}`,
            apiKey: process.env.VUE_APP_cloudFunctionsAPIKEY
          }

          axios.post('https://us-central1-nemacolin-website.cloudfunctions.net/widgets/adduser', userData)
            .then(response => {
              if (response.status === 200) {
                firebase.firestore().collection('users').doc(response.data.uid).set(this.updatedUserdata)
                  .then(() => {
                    this.sending = false
                    this.$router.push('/users')
                  })
                  .catch(error => {
                    console.log('database error: ', error)
                    this.status = 'fail'
                    this.sending = false
                  })
              } else {
                console.log('other axios error: ', response)
                this.status = 'fail'
                this.sending = false
              }
            }).catch((error) => {
              console.log('axios error: ', error.response)
              if (error.response.data.code === 'auth/email-already-exists') {
                this.status = 'emailInUseError'
              }
              this.sending = false
            })
        }
      }
    },
    updateDatabase (updatedUserdata) {
      firebase.firestore().collection('users').doc(this.userid).update(this.updatedUserdata)
        .then(() => {
          this.status = 'success'
          this.sending = false
          if (this.usernameChanged) { window.history.pushState({ newUsername: this.updatedUserdata.username }, 'User Profile', this.updatedUserdata.username) }
        }).catch((error) => {
          console.log('database update error: ', error)
          this.status = 'error'
          this.sending = false
        })
    },
    updateAuthdata (updatedUserdata) {
      if (this.loggedinUser.uid === this.userid) {
        let currentUser = firebase.auth().currentUser
        if (this.usernameChanged) {
          currentUser.updateProfile({ displayName: `${updatedUserdata.firstName} ${updatedUserdata.lastName}` })
            .then(() => {
              if (!this.emailChanged) {
                this.updateDatabase(updatedUserdata)
              }
            }).catch((error) => {
              console.log('username update error: ', error)
              this.status = 'error'
              this.sending = false
            })
          if (this.emailChanged) {
            this.updateEmail(updatedUserdata)
          }
        }
      } else {
        let userData = {
          uid: this.userid,
          displayName: `${this.updatedUserdata.firstName} ${this.updatedUserdata.lastName}`,
          apiKey: process.env.VUE_APP_cloudFunctionsAPIKEY
        }
        if (this.emailChanged) {
          userData.email = this.updatedUserdata.email
        }
        axios.post('https://us-central1-nemacolin-website.cloudfunctions.net/widgets/updateauthdata', userData)
          .then(() => {
            if (this.emailChanged) {
              this.emailUpdated = true
              this.updateDatabase(updatedUserdata)
            } else {
              this.updateDatabase(updatedUserdata)
            }
          })
          .catch((error) => {
            console.log(error)
            if (error === 'auth/email-already-in-use') {
              this.status = 'emailInUseError'
              this.sending = false
            } else {
              this.status = 'error'
              this.sending = false
            }
          })
      }
    },
    updateEmail (updatedUserdata) {
      let currentUser = firebase.auth().currentUser
      let userData = {
        email: updatedUserdata.email,
        type: 'change',
        apiKey: process.env.VUE_APP_cloudFunctionsAPIKEY
      }
      currentUser.updateEmail(updatedUserdata.email)
        .then(() => {
          axios.post('https://us-central1-nemacolin-website.cloudfunctions.net/widgets/verifyemail', userData)
            .then(() => {
              this.emailUpdated = true
              this.updateDatabase(updatedUserdata)
            }).catch((error) => {
              console.log('verification email error: ', error)
              this.status = 'error'
              this.sending = false
            })
        }).catch((error) => {
          console.log('email update error: ', error)
          if (error.code === 'auth/requires-recent-login') {
            this.showReauthticationModal = true
          } else if (error.code === 'auth/email-already-in-use') {
            this.status = 'emailInUseError'
            this.sending = false
          }
        })
    },
    reauthenticate (email, password, updatedUserdata) {
      this.sendingPassword = true
      this.showPasswordError = false
      let loginData = { email: email, password: password }
      firebase.auth().signInWithEmailAndPassword(loginData.email, loginData.password)
        .then(() => {
          this.updateEmail(updatedUserdata)
          this.sendingPassword = false
          this.showReauthticationModal = false
        }).catch((error) => {
          console.log('reauthentication error: ', error)
          if (error.code === 'auth/wrong-password') {
            this.showPasswordError = true
          }
          this.sendingPassword = false
        })
    },
    validateField (field, label, validations) {
      if (typeof field === 'object') {
        this.$v.user[field[0]][field[1]].$touch()
        if (!this.errors[field[0]]) { this.errors[field[0]] = {}; this.errors[field[0]][field[1]] = [] } else { this.errors[field[0]][field[1]] = [] }
        validations.forEach((validation) => {
          if (validation === 'required' && !this.$v.user[field[0]][field[1]].value.required) { this.errors[field[0]][field[1]].push(`${label} is required.`) }
          if (validation === 'email' && !this.$v.user[field[0]][field[1]].value.email) { this.errors[field[0]][field[1]].push(`please enter a valid ${label}.`) }
          if (validation === 'password' && !this.$v.user[field[0]][field[1]].value.password) { this.errors[field[0]][field[1]].push(`Password must be at least 8 characters long with 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.`) }
          if (validation === 'sameAsPassword' && !this.$v.user[field[0]][field[1]].value.sameAsPassword) { this.errors[field[0]][field[1]].push(`Passwords do not match.`) }
          if (validation === 'numeric' && !this.$v.user[field[0]][field[1]].value.numeric) { this.errors[field[0]][field[1]].push(`${label} must be numbers only.`) }
          if (validation === 'minLength' && !this.$v.user[field[0]][field[1]].value.minLength) { this.errors[field[0]][field[1]].push(`${label} must be 5 characters long.`) }
          if (validation === 'maxLength' && !this.$v.user[field[0]][field[1]].value.maxLength) { this.errors[field[0]][field[1]].push(`${label} must be 5 characters long.`) }
          if (validation === 'name' && !this.$v.user[field[0]][field[1]].value.name) { this.errors[field[0]][field[1]].push(`${label} can only contain letters, numbers, spaces, commas, or periods.`) }
          if (validation === 'phone' && !this.$v.user[field[0]][field[1]].value.phone) { this.errors[field[0]][field[1]].push(`${label} must be in this format: 123-456-7890.`) }
        })
      } else {
        if (field === 'reauthenticationPassword') {
          this.$v.reauthenticationPassword.$touch()
          this.errors[field] = []
          if (validations[0] === 'required' && !this.$v.reauthenticationPassword.required) { this.errors[field].push(`${label} is required.`) }
        } else {
          this.$v.user[field].$touch()
          this.errors[field] = []
          validations.forEach((validation) => {
            if (validation === 'required' && !this.$v.user[field].value.required) { this.errors[field].push(`${label} is required.`) }
            if (validation === 'email' && !this.$v.user[field].value.email) { this.errors[field].push(`Please enter a valid ${label}.`) }
            if (validation === 'password' && !this.$v.user[field].value.password) { this.errors[field].push(`Password must be at least 8 characters long with 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.`) }
            if (validation === 'sameAsPassword' && !this.$v.user[field].value.sameAsPassword) { this.errors[field].push(`Passwords do not match.`) }
            if (validation === 'numeric' && !this.$v.user[field].value.numeric) { this.errors[field].push(`${label} must be numbers only.`) }
            if (validation === 'minLength' && !this.$v.user[field].value.minLength) { this.errors[field].push(`${label} must be 5 characters long.`) }
            if (validation === 'maxLength' && !this.$v.user[field].value.maxLength) { this.errors[field].push(`${label} must be 5 characters long.`) }
            if (validation === 'name' && !this.$v.user[field].value.name) { this.errors[field].push(`${label} can only contain letters, numbers, spaces, commas, or periods.`) }
            if (validation === 'phone' && !this.$v.user[field].value.phone) { this.errors[field].push(`${label} must be in this format: 123-456-7890.`) }
          })
        }
      }
    },
    buildUsername () {
      if (Object.keys(this.user).length !== 0) {
        let wholeName = this.user.firstName.value + this.user.lastName.value
        let filteredName = wholeName.split('').filter(letter => /[a-zA-Z0-9]/.test(letter)).join('')
        return filteredName
      }
    },
    showForgotPasswordModal () {
      this.forgotPasswordModal = true
      this.showReauthticationModal = false
    }
  },
  computed: {
    userTitle () {
      if (Object.keys(this.user).length !== 0) {
        let ofOrFor = this.user.position.value === 'Support' || this.user.position.value === 'Council' || this.user.position.value === 'Vendor' ? 'for' : 'of'
        return `For ${this.user.firstName.value} ${this.user.lastName.value} - ${this.user.position.value} ${ofOrFor} Nemacolin Inc.`
      }
    },
    emailChanged () {
      return this.user.email.value !== this.currentUserEmail
    },
    usernameChanged () {
      return this.user.username.value !== this.currentUserUsername
    },
    ...mapState({ loggedinUser: state => state.user })
  },
  watch: {
    'user.firstName.value': function () {
      this.user.username.value = this.buildUsername()
    },
    'user.lastName.value': function () {
      this.user.username.value = this.buildUsername()
    },
    loggedinUser: function () {
      this.loggedinUser && this.type === 'profile' ? this.getUserData() : this.buildForm()
    }
  },
  created () {
    this.loggedinUser && this.type === 'profile' ? this.getUserData() : this.buildForm()
  }
}
</script>
