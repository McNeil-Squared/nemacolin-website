<template lang="pug">
  div
    h2.text-xs-center.primary--text User Management
    div.text-xs-center.my-2(v-if="loading")
      v-icon.loading fas fa-sync
    v-layout(row wrap)
      v-flex(xs12 md4)
        v-btn(fab fixed bottom right color="primary" @click="addUser = !addUser")
          v-icon fas fa-plus
        v-card(v-for="(user, i) in users" :key="i" v-if="!loading")
          v-card-title.pb-0(primary title)
            div.full-width.text-xs-center.mb-3
              h3.headline.mb-0.mx-auto {{ user.firstName }} {{ user.lastName }}
            v-layout(row wrap)
              v-flex(xs12 md8)
                p Email: {{ user.email }}
                p Position: {{ user.position }}
              v-flex(xs12 md4)
                p Phone: {{ user.phone }}
                p Role: {{ user.role }}
          v-card-actions.justify-center
            v-btn(color="secondary" :to="user.profileLink") User Details
            v-btn(color="primary" @click="deleteUser(user)") Delete User
    v-layout(row wrap)
      v-flex(xs12 md4 offset-md4)
        v-dialog(v-model="addUser" :width="width")
          form.pa-3(@submit.prevent="submit" v-if="!loading")
            h4.text-xs-center.my-2 Add User
            template(v-for="(item, key) in addUsers")
              template(v-if="key !=='mailing' && key !=='physical'")
                template(v-if="((key ==='username' || key === 'position' || key ==='role') && addUsers.role.value === 'admin') || (key !=='username' || key !== 'position' || key !=='role')")
                  template(v-if="item.type === 'input'")
                    template(v-if="item.label === 'Password' || item.label === 'Confirm Password'")
                      label(for="key") {{ item.label }}
                      v-text-field(v-model="addUsers[key].value" :id="key" :error-messages="errors[key]" @input="validateField(key, item.label, addUsers[key].validations)" solo :disabled="key==='username'" type="password")
                    template(v-else)
                      label(for="key") {{ item.label }}
                      v-text-field(v-model="addUsers[key].value" :id="key" :error-messages="errors[key]" @input="validateField(key, item.label, addUsers[key].validations)" solo :disabled="key==='username'")
                  template(v-else)
                    label(for="key") {{ item.label }}
                    v-select(v-model="addUsers[key].value" :items="addUsers[key].options" :label="addUsers[key].label" solo append-icon="fas fa-sort-down")
              template(v-else)
                template(v-for="(subitem,key2) in item")
                  template(v-if="subitem.type === 'input'")
                    label(for="key2") {{ subitem.label }}
                    v-text-field(v-model="item[key2].value" :id="key2" :error-messages="errors[key] ? errors[key][key2] : []" @input="validateField([key, key2], subitem.label, addUsers[key][key2].validations)" solo)
                  template(v-else)
                    label(for="key2") {{ subitem.label }}
                    v-select(v-model="item[key2].value" :items="item[key2].options" item-text="label" item-value="value" :label="item[key2].label" solo append-icon="fas fa-sort-down")
            div.text-xs-center
              v-btn(v-if="status !== 'success'" @click="submit" color="primary" :loading="sending" :disabled="sending || $v.$invalid") Submit
</template>

<script>
import firebase from '../firebase.js'
// import admin from '../firebaseAdmin.js'
import states from '../states.js'
import { validationMixin } from 'vuelidate'
import { required, sameAs, email, numeric, minLength, maxLength, helpers } from 'vuelidate/lib/validators'
/* eslint-disable no-useless-escape */
const name = helpers.regex('name', /^[a-zA-Z 0-9\.\,\-]*$/)
const phone = helpers.regex('phone', /^[0-9]{3}\-[0-9]{3}\-[0-9]{4}$/)
const password = helpers.regex('password', /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)

export default {
  data () {
    return {
      loading: true,
      width: 500,
      users: [],
      errors: [],
      sending: false,
      status: 'pending',
      newUserData: {},
      addUser: false,
      addUsers: {
        email: { label: 'Email', value: '', type: 'input', validations: ['required', 'email'] },
        password: { label: 'Password', value: '', type: 'input', validations: ['required', 'password'] },
        retypePassword: { label: 'Confirm Password', value: '', type: 'input', validations: ['required', 'sameAsPassword'] },
        firstName: { label: 'First Name', value: '', type: 'input', validations: ['required', 'name'] },
        lastName: { label: 'Last Name', value: '', type: 'input', validations: ['required', 'name'] },
        phone: { label: 'Phone Number', value: '', type: 'input', validations: ['required', 'phone'] },
        mailing: {
          address: { label: 'Mailing Address', value: '', type: 'input', validations: ['required', 'name'] },
          city: { label: 'Mailing City', value: '', type: 'input', validations: ['required', 'name'] },
          state: { label: 'Mailing State', value: '', type: 'select', options: states, validations: ['required'] },
          zip: { label: 'Mailing Zip Code', value: '', type: 'input', validations: ['required', 'numeric', 'minLength', 'maxLength'] }
        },
        physical: {
          address: { label: 'Physical Address', value: '', type: 'input', validations: ['required', 'name'] },
          city: { label: 'Physical City', value: '', type: 'input', validations: ['required', 'name'] },
          state: { label: 'Physical State', value: '', type: 'select', options: states, validations: ['required'] },
          zip: { label: 'Physical Zip Code', value: '', type: 'input', validations: ['required', 'numeric', 'minLength', 'maxLength'] }
        },
        username: { label: 'User Name', value: '', type: 'input', validations: ['required'] },
        position: { label: 'Position', value: '', type: 'select', options: ['President', 'Vice-President', 'Secretary', 'Treasurer', 'Member', 'Support', 'Council', 'Vendor'], validations: ['required'] },
        role: { label: 'System Role', value: '', type: 'select', options: ['user', 'admin'], validations: ['required'] }
      }
    }
  },
  mixins: [validationMixin],
  validations: {
    addUsers: {
      email: { value: { required, email } },
      password: { value: { required, password } },
      retypePassword: { value: { required, sameAsPassword: sameAs(function () { return this.addUsers.password.value }) } },
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
    }
  },
  methods: {
    getUsers () {
      firebase.firestore().collection('users').get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            let firebaseData = doc.data()
            let userCard = {
              firstName: firebaseData.firstName,
              lastName: firebaseData.lastName,
              email: firebaseData.email,
              phone: firebaseData.phone,
              position: firebaseData.position,
              role: firebaseData.role,
              profileLink: 'profile/' + firebaseData.username
            }
            this.users.push(userCard)
          })
          this.loading = false
        }).catch((error) => {
          console.log(error)
          this.loading = false
        })
    },
    validateField (field, label, validations) {
      if (typeof field === 'object') {
        this.$v.addUsers[field[0]][field[1]].$touch()
        if (!this.errors[field[0]]) { this.errors[field[0]] = {}; this.errors[field[0]][field[1]] = [] } else { this.errors[field[0]][field[1]] = [] }
        validations.forEach((validation) => {
          if (validation === 'required' && !this.$v.addUsers[field[0]][field[1]].value.required) { this.errors[field[0]][field[1]].push(`${label} is required.`) }
          if (validation === 'email' && !this.$v.addUsers[field[0]][field[1]].value.email) { this.errors[field[0]][field[1]].push(`Please enter a valid ${label}.`) }
          if (validation === 'password' && !this.$v.addUsers[field[0]][field[1]].value.password) { this.errors[field[0]][field[1]].push(`Password must be at least 8 characters long with 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.`) }
          if (validation === 'sameAsPassword' && !this.$v.addUsers[field[0]][field[1]].value.sameAsPassword) { this.errors[field[0]][field[1]].push(`Passwords do not match.`) }
          if (validation === 'numeric' && !this.$v.addUsers[field[0]][field[1]].value.numeric) { this.errors[field[0]][field[1]].push(`${label} must be numbers only.`) }
          if (validation === 'minLength' && !this.$v.addUsers[field[0]][field[1]].value.minLength) { this.errors[field[0]][field[1]].push(`${label} must be 5 characters long.`) }
          if (validation === 'maxLength' && !this.$v.addUsers[field[0]][field[1]].value.maxLength) { this.errors[field[0]][field[1]].push(`${label} must be 5 characters long.`) }
          if (validation === 'name' && !this.$v.addUsers[field[0]][field[1]].value.name) { this.errors[field[0]][field[1]].push(`${label} can only contain letters, numbers, spaces, commas, or periods.`) }
          if (validation === 'phone' && !this.$v.addUsers[field[0]][field[1]].value.phone) { this.errors[field[0]][field[1]].push(`${label} must be in this format: 123-456-7890.`) }
        })
      } else {
        this.$v.addUsers[field].$touch()
        this.errors[field] = []
        validations.forEach((validation) => {
          if (validation === 'required' && !this.$v.addUsers[field].value.required) { this.errors[field].push(`${label} is required.`) }
          if (validation === 'email' && !this.$v.addUsers[field].value.email) { this.errors[field].push(`Please enter a valid ${label}.`) }
          if (validation === 'password' && !this.$v.addUsers[field].value.password) { this.errors[field].push(`Password must be at least 8 characters long with 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.`) }
          if (validation === 'sameAsPassword' && !this.$v.addUsers[field].value.sameAsPassword) { this.errors[field].push(`Passwords do not match.`) }
          if (validation === 'numeric' && !this.$v.addUsers[field].value.numeric) { this.errors[field].push(`${label} must be numbers only.`) }
          if (validation === 'minLength' && !this.$v.addUsers[field].value.minLength) { this.errors[field].push(`${label} must be 5 characters long.`) }
          if (validation === 'maxLength' && !this.$v.addUsers[field].value.maxLength) { this.errors[field].push(`${label} must be 5 characters long.`) }
          if (validation === 'name' && !this.$v.addUsers[field].value.name) { this.errors[field].push(`${label} can only contain letters, numbers, spaces, commas, or periods.`) }
          if (validation === 'phone' && !this.$v.addUsers[field].value.phone) { this.errors[field].push(`${label} must be in this format: 123-456-7890.`) }
        })
      }
    },
    buildUsername () {
      if (Object.keys(this.addUsers).length !== 0) {
        let wholeName = this.addUsers.firstName.value + this.addUsers.lastName.value
        let filteredName = wholeName.split('').filter(letter => /[a-zA-Z0-9]/.test(letter)).join('')
        return filteredName
      }
    },
    submit () {
      if (!this.$v.$invalid) {
        this.sending = true
        for (let item in this.addUsers) {
          if (item === 'mailing' || item === 'physical') {
            if (!this.newUserData['mailing']) { this.newUserData['mailing'] = {} }
            if (!this.newUserData['physical']) { this.newUserData['physical'] = {} }
            for (let subitem in this.addUsers[item]) {
              this.newUserData[item][subitem] = this.addUsers[item][subitem].value
            }
          } else {
            this.newUserData[item] = this.addUsers[item].value
          }
        }
        // let userData = {
        //   email: this.newUserData.email,
        //   emailVerified: false,
        //   password: this.addUsers.password.value,
        //   displayName: `${this.newUserData.firstName} ${this.newUserData.lastName}`
        // }
        // admin.auth().createUser(userData)
        //   .then((userRecord) => {
        //     console.log(userRecord)
        //   })
        //   .catch((error) => {
        //     console.log('add user error: ', error)
        //     this.status = 'error'
        //     this.sending = false
        //   })
      }
    }
  },
  watch: {
    'addUsers.firstName.value': function () {
      this.addUsers.username.value = this.buildUsername()
    },
    'addUsers.lastName.value': function () {
      this.addUsers.username.value = this.buildUsername()
    }
  },
  created () {
    this.getUsers()
    // Set the width of the add users modal to 90% of screen width on screens less than 500px.  Percent and vw values are not allowed.
    if (window.innerwidth < 500) this.width = window.innerWidth * 0.9
  }
}
</script>

<style lang="scss" scoped>
  .full-width {
    width: 100%;
  }
  .v-btn--bottom:not(.v-btn--absolute) {
    bottom: 60px;
  }
</style>
