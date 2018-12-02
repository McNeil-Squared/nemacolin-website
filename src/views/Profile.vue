<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12 md4 offset-md4)
      h3.text-xs-center User Profile
      H4.text-xs-center For {{ user.firstName ? user.firstName.value : '' }} {{ user.lastName ? user.lastName.value : '' }} - {{ user.position ? user.position.value : '' }} {{ ofOrFor }} Nemacolin Inc.
      template(v-for="(item, key) in user")
        template(v-if="key !=='mailing' && key !=='physical'")
          template(v-if="item.type === 'input'")
            label(for="key") {{ item.label }}
            v-text-field(v-model="user[key].value" :id="key" :error-messages="errors[key] || []" @input="validateField(key, user[key].validations)" solo)
          template(v-else)
            label(for="key") {{ item.label }}
            v-select(v-model="user[key].value" :items="user[key].options" :label="user[key].label" solo append-icon="fas fa-sort-down")
        template(v-else)
          template(v-for="(subitem,key2) in item")
            label(for="key2") {{ subitem.label }}
            v-text-field(v-model="item[key2].value" :id="key2" :error-messages="errors[key] ? errors[key][key2] : []" @input="validateField([key, key2], user[key][key2].validations)" solo)
</template>

<script>
import firebase from '../firebase.js'
import { validationMixin } from 'vuelidate'
import { required, email, numeric, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      user: {},
      errors: []
    }
  },
  props: ['username'],
  mixins: [validationMixin],
  validations: {
    user: {
      email: { value: { required, email } },
      firstName: { value: { required } },
      lastName: { value: { required } },
      phone: { value: { required } },
      mailing: {
        address: { value: { required } },
        city: { value: { required } },
        state: { value: { required } },
        zip: { value: { required, numeric, minLength: minLength(5), maxLength: maxLength(5) } }
      },
      physical: {
        address: { value: { required } },
        city: { value: { required } },
        state: { value: { required } },
        zip: { value: { required, numeric, minLength: minLength(5), maxLength: maxLength(5) } }
      },
      userName: { value: { required } },
      position: { value: { required } },
      role: { value: { required } }
    }
  },
  methods: {
    getUserData () {
      firebase.firestore().collection('users').where('username', '==', this.username).get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            let firebaseData = doc.data()
            let currentUser = {
              email: { label: 'Email', value: firebaseData.email, type: 'input', validations: ['required', 'email'] },
              firstName: { label: 'First Name', value: firebaseData.firstName, type: 'input', validations: ['required'] },
              lastName: { label: 'Last Name', value: firebaseData.lastName, type: 'input', validations: ['required'] },
              phone: { label: 'Phone Number', value: firebaseData.phone, type: 'input', validations: ['required'] },
              mailing: {
                address: { label: 'Mailing Address', value: firebaseData.mailing.address, type: 'input', validations: ['required'] },
                city: { label: 'Mailing City', value: firebaseData.mailing.city, type: 'input', validations: ['required'] },
                state: { label: 'Mailing State', value: firebaseData.mailing.state, type: 'input', validations: ['required'] },
                zip: { label: 'Mailing Zip Code', value: firebaseData.mailing.zip, type: 'input', validations: ['required', 'numeric', 'minLength', 'maxLength'] }
              },
              physical: {
                address: { label: 'Physical Address', value: firebaseData.physical.address, type: 'input', validations: ['required'] },
                city: { label: 'Physical City', value: firebaseData.physical.city, type: 'input', validations: ['required'] },
                state: { label: 'Physical State', value: firebaseData.physical.state, type: 'input', validations: ['required'] },
                zip: { label: 'Physical Zip Code', value: firebaseData.physical.zip, type: 'input', validations: ['required', 'numeric', 'minLength', 'maxLength'] }
              },
              userName: { label: 'User Name', value: firebaseData.username, type: 'input', validations: ['required'] },
              position: { label: 'Position', value: firebaseData.position, type: 'select', options: ['President', 'Vice-President', 'Secretary', 'Treasurer', 'Member', 'Support', 'Council', 'Vendor'], validations: ['required'] },
              role: { label: 'System Role', value: firebaseData.role, type: 'select', options: ['user', 'admin'], validations: ['required'] }
            }
            this.user = currentUser
          })
        }).catch(error => console.log(error))
    },
    validateField (field, validations) {
      if (typeof field === 'object') {
        this.$v.user[field[0]][field[1]].$touch()
        if (!this.errors[field[0]]) { this.errors[field[0]] = {}; this.errors[field[0]][field[1]] = [] } else { this.errors[field[0]][field[1]] = [] }
        validations.forEach((validation) => {
          if (validation === 'required' && !this.$v.user[field[0]][field[1]].value.required) { this.errors[field[0]][field[1]].push(`${field[0]} ${field[1]} is required.`) }
          if (validation === 'email' && !this.$v.user[field[0]][field[1]].value.email) { this.errors[field[0]][field[1]].push(`please enter a valid email.`) }
          if (validation === 'numeric' && !this.$v.user[field[0]][field[1]].value.numeric) { this.errors[field[0]][field[1]].push(`${field[0]} ${field[1]} must be numbers only.`) }
          if (validation === 'minLength' && !this.$v.user[field[0]][field[1]].value.minLength) { this.errors[field[0]][field[1]].push(`${field[0]} ${field[1]} must be 5 characters long.`) }
          if (validation === 'maxLength' && !this.$v.user[field[0]][field[1]].value.maxLength) { this.errors[field[0]][field[1]].push(`${field[0]} ${field[1]} must be 5 characters long.`) }
        })
      } else {
        this.$v.user[field].$touch()
        this.errors[field] = []
        validations.forEach((validation) => {
          if (validation === 'required' && !this.$v.user[field].value.required) { this.errors[field].push(`${field} is required.`) }
          if (validation === 'email' && !this.$v.user[field].value.email) { this.errors[field].push(`please enter a valid email.`) }
          if (validation === 'numeric' && !this.$v.user[field].value.numeric) { this.errors[field].push(`${field} must be numbers only.`) }
          if (validation === 'minLength' && !this.$v.user[field].value.minLength) { this.errors[field].push(`${field} must be 5 characters long.`) }
          if (validation === 'maxLength' && !this.$v.user[field].value.maxLength) { this.errors[field].push(`${field} must be 5 characters long.`) }
        })
      }
    }
  },
  computed: {
    ofOrFor () {
      if (this.user.position) {
        return this.user.position.value === 'Support' || this.user.position.value === 'Council' || this.user.position.value === 'Vendor' ? 'for' : 'of'
      }
    }
  },
  created () {
    this.getUserData()
  }
}
</script>
