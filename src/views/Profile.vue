<template lang="pug">
  div
    app-EmailVerification.text-xs-center.mb-3
    v-layout(row wrap)
      v-flex(xs12 md4 offset-md4)
        h2.text-xs-center.primary--text User Profile
        div.text-xs-center.my-2(v-if="loading")
          v-icon.loading fas fa-sync
        form(@submit.prevent="submit" v-if="!loading")
          h4.text-xs-center.my-2 {{ userTitle }}
          template(v-for="(item, key) in user")
            template(v-if="key !=='mailing' && key !=='physical'")
              template(v-if="((key === 'username' || key === 'position' || key ==='role') && user.role.value === 'admin') || (key !=='username' && key !== 'position' && key !=='role')")
                template(v-if="item.type === 'input'")
                  label(for="key") {{ item.label }}
                  v-text-field(v-model="user[key].value" :id="key" :error-messages="errors[key]" @input="validateField(key, item.label, user[key].validations)" solo :disabled="key==='username'")
                  v-alert.mb-4(:value="item.label === 'Email'" icon="fas fa-info-circle" type="info") Note: Your email address is used to login to the website, so if you change your email please remember to use your new email when you login.
                template(v-else)
                  label(for="key") {{ item.label }}
                  v-select(v-model="user[key].value" :items="user[key].options" :label="user[key].label" solo append-icon="fas fa-sort-down")
            template(v-else)
              template(v-for="(subitem,key2) in item")
                template(v-if="subitem.type === 'input'")
                  label(for="key2") {{ subitem.label }}
                  v-text-field(v-model="item[key2].value" :id="key2" :error-messages="errors[key] ? errors[key][key2] : []" @input="validateField([key, key2], subitem.label, user[key][key2].validations)" solo)
                template(v-else)
                  label(for="key2") {{ subitem.label }}
                  v-select(v-model="item[key2].value" :items="item[key2].options" item-text="label" item-value="value" :label="item[key2].label" solo append-icon="fas fa-sort-down")
          div.text-xs-center
            v-btn(v-if="status !== 'success'" @click="submit" color="primary" :loading="sending" :disabled="sending || $v.$invalid") Submit
        v-alert(v-if="status === 'success' && !sending" type="success" icon="fas fa-check" value="true") Success!&nbsp;&nbsp;Your profile has been updated.
        v-alert(v-if="status === 'success' && emailUpdated && !sending" type="success" icon="fas fa-check" value="true") Success!&nbsp;&nbsp;Your email address has been updated.&nbsp;&nbsp;Please check your new email for a verification message.&nbsp;&nbsp;You must verify your new email address before continuing.
        v-alert(v-if="status === 'error' && !sending" type="error" icon="fas fa-times" value="true") Bummer!&nbsp;&nbsp;There was an error and your profile was not updated.&nbsp;&nbsp;Please try again.&nbsp;&nbsp;If you see this message again, please #[a(href="mailto:info@nemacolininc.com") email us] and let us know.
        v-dialog(v-model="showPasswordModal" persistant width="400")
          form.pa-3(@submit.prevent="submit" autocomplete="on")
            h4.mt-2.mb-4.text-xs-left Hello, It looks like you haven't logged in for awhile.&nbsp;&nbsp;Please re-enter your password to complete the update.
            label.d-block.text-xs-left(for="password") Password
            v-text-field#password(v-model="password"  placeholder="Password" :error-messages="errors['password']" @input="validateField('password', 'Password', passwordValidations)" solo type="password")
            v-btn(v-if="status != 'success'" @click="reauthenticate(currentUserEmail, password, updatedUserdata)" color="primary" :loading="sendingPassword" :disabled="sendingPassword") Submit
            v-alert(v-if="showPasswordError && !sendingPassword" type="error" icon="fas fa-times" value="true") Incorrect password.
            router-link.mt-3.link(tag="p" to="/resetpassword") I forgot my password.
</template>

<script>
import firebase from '../firebase.js'
import states from '../states.js'
import { mapState } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required, requiredIf, email, numeric, minLength, maxLength, helpers } from 'vuelidate/lib/validators'
import EmailVerification from '../components/EmailVerification'

/* eslint-disable no-useless-escape */
const name = helpers.regex('name', /^[a-zA-Z 0-9\.\,\-]*$/)
const phone = helpers.regex('phone', /^[0-9]{3}\-[0-9]{3}\-[0-9]{4}$/)

export default {
  data () {
    return {
      loading: true,
      user: {},
      errors: [],
      currentUserEmail: '',
      currentUserUsername: '',
      sending: false,
      status: 'pending',
      updatedUserdata: {},
      emailUpdated: false,
      showPasswordModal: false,
      password: '',
      passwordValidations: ['required'],
      sendingPassword: false,
      showPasswordError: false
    }
  },
  props: ['username'],
  components: { appEmailVerification: EmailVerification },
  mixins: [validationMixin],
  validations: {
    user: {
      email: { value: { required, email } },
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
    password: { required: requiredIf(function () { return this.showPasswordModal }) }
  },
  methods: {
    getUserData () {
      firebase.firestore().collection('users').doc(this.$store.getters.user.uid).get()
        .then((doc) => {
          let firebaseData = doc.data()
          let currentUser = {
            email: { label: 'Email', value: firebaseData.email, type: 'input', validations: ['required', 'email'] },
            firstName: { label: 'First Name', value: firebaseData.firstName, type: 'input', validations: ['required', 'name'] },
            lastName: { label: 'Last Name', value: firebaseData.lastName, type: 'input', validations: ['required', 'name'] },
            phone: { label: 'Phone Number', value: firebaseData.phone, type: 'input', validations: ['required', 'phone'] },
            mailing: {
              address: { label: 'Mailing Address', value: firebaseData.mailing.address, type: 'input', validations: ['required', 'name'] },
              city: { label: 'Mailing City', value: firebaseData.mailing.city, type: 'input', validations: ['required', 'name'] },
              state: { label: 'Mailing State', value: firebaseData.mailing.state, type: 'select', options: states, validations: ['required'] },
              zip: { label: 'Mailing Zip Code', value: firebaseData.mailing.zip, type: 'input', validations: ['required', 'numeric', 'minLength', 'maxLength'] }
            },
            physical: {
              address: { label: 'Physical Address', value: firebaseData.physical.address, type: 'input', validations: ['required', 'name'] },
              city: { label: 'Physical City', value: firebaseData.physical.city, type: 'input', validations: ['required', 'name'] },
              state: { label: 'Physical State', value: firebaseData.physical.state, type: 'select', options: states, validations: ['required'] },
              zip: { label: 'Physical Zip Code', value: firebaseData.physical.zip, type: 'input', validations: ['required', 'numeric', 'minLength', 'maxLength'] }
            },
            username: { label: 'User Name', value: firebaseData.username, type: 'input', validations: ['required'] },
            position: { label: 'Position', value: firebaseData.position, type: 'select', options: ['President', 'Vice-President', 'Secretary', 'Treasurer', 'Member', 'Support', 'Council', 'Vendor'], validations: ['required'] },
            role: { label: 'System Role', value: firebaseData.role, type: 'select', options: ['user', 'admin'], validations: ['required'] }
          }
          this.user = currentUser
          this.currentUserEmail = firebaseData.email
          this.currentUserUsername = firebaseData.username
          this.loading = false
        }).catch(error => console.log('database error: ', error))
    },
    submit () {
      if (!this.$v.$invalid) {
        this.sending = true
        for (let item in this.user) {
          if (item === 'mailing' || item === 'physical') {
            if (!this.updatedUserdata['mailing']) { this.updatedUserdata['mailing'] = {} }
            if (!this.updatedUserdata['physical']) { this.updatedUserdata['physical'] = {} }
            for (let subitem in this.user[item]) {
              this.updatedUserdata[item][subitem] = this.user[item][subitem].value
            }
          } else {
            this.updatedUserdata[item] = this.user[item].value
          }
        }
        if (this.emailChanged || this.usernameChanged) {
          this.updateAuthdata(this.updatedUserdata)
        } else { this.updateDatabase(this.updatedUserdata) }
      }
    },
    updateDatabase (updatedUserdata) {
      firebase.firestore().collection('users').doc(this.$store.getters.user.uid).update(this.updatedUserdata)
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
      }
      if (this.emailChanged) {
        currentUser.updateEmail(updatedUserdata.email)
          .then(() => {
            currentUser.sendEmailVerification()
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
              this.showPasswordModal = true
            }
          })
      }
    },
    reauthenticate (email, password, updatedUserdata) {
      this.sendingPassword = true
      this.showPasswordError = false
      let loginData = { email: email, password: password }
      firebase.auth().signInWithEmailAndPassword(loginData.email, loginData.password)
        .then(() => {
          this.updateEmail(updatedUserdata)
          this.sendingPassword = false
          this.showPasswordModal = false
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
          if (validation === 'numeric' && !this.$v.user[field[0]][field[1]].value.numeric) { this.errors[field[0]][field[1]].push(`${label} must be numbers only.`) }
          if (validation === 'minLength' && !this.$v.user[field[0]][field[1]].value.minLength) { this.errors[field[0]][field[1]].push(`${label} must be 5 characters long.`) }
          if (validation === 'maxLength' && !this.$v.user[field[0]][field[1]].value.maxLength) { this.errors[field[0]][field[1]].push(`${label} must be 5 characters long.`) }
          if (validation === 'name' && !this.$v.user[field[0]][field[1]].value.name) { this.errors[field[0]][field[1]].push(`${label} can only contain letters, numbers, spaces, commas, or periods.`) }
          if (validation === 'phone' && !this.$v.user[field[0]][field[1]].value.phone) { this.errors[field[0]][field[1]].push(`${label} must be in this format: 123-456-7890.`) }
        })
      } else {
        if (field === 'password') {
          this.$v.password.$touch()
          this.errors[field] = []
          if (validations[0] === 'required' && !this.$v.password.required) { this.errors[field].push(`${label} is required.`) }
        } else {
          this.$v.user[field].$touch()
          this.errors[field] = []
          validations.forEach((validation) => {
            if (validation === 'required' && !this.$v.user[field].value.required) { this.errors[field].push(`${label} is required.`) }
            if (validation === 'email' && !this.$v.user[field].value.email) { this.errors[field].push(`Please enter a valid ${label}.`) }
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
      if (this.loggedinUser) {
        this.getUserData()
      }
    }
  },
  created () {
    if (this.loggedinUser) {
      this.getUserData()
    }
  }
}
</script>
