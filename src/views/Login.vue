<template lang="pug">
  v-container(text-xs-center)
    v-layout(row wrap)
      v-flex(xs12 md4 offset-md4)
        form(@submit.prevent="submit" autocomplete="on")
          h2.mt-2.mb-4 Nemacolin Inc Board Member Login
          v-text-field(v-model="username" :error-messages="usernameErrors" label="Username" required @input="$v.username.$touch()" @blur="$v.username.$touch()" solo)
          v-text-field(v-model="password" :error-messages="passwordErrors" label="Password" required @input="$v.password.$touch()" @blur="$v.password.$touch()" solo type="password")
          v-btn(v-if="status != 'success'" @click="submit" color="primary" :loading="sending" :disabled="sending") Submit
          //- v-btn(v-if="status != 'success'" @click="testing" color="warning") Test Login
          //- v-btn(v-if="status != 'success'" @click="update" color="warning") Update
        v-alert(v-if="status === 'fail' && !sending" type="error" icon="close" value="true") Incorrect username or password.
        p.mt-3(@click="console.log('i forgot')") I forgot my password.
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import firebase from 'firebase'

export default {
  data () {
    return {
      username: '',
      password: '',
      sending: false,
      status: ''
    }
  },
  mixins: [validationMixin],
  validations: {
    username: { required },
    password: { required }
  },
  computed: {
    usernameErrors () {
      const errors = []
      if (!this.$v.username.$dirty) return errors
      !this.$v.username.required && errors.push('Username is required.')
      return errors
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('Password is required.')
      return errors
    }
  },
  methods: {
    submit () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.sending = true
        let loginData = { email: this.username.toLowerCase(), password: this.password }
        firebase.auth().signInWithEmailAndPassword(loginData.email, loginData.password)
          .then((userObject) => {
            this.$store.dispatch('setUserData', userObject.user)
            this.sending = false
          })
          .then(this.$router.replace('/dashboard'))
          .catch(error => console.log(error))
      }
    },
    // testing () {
    //   let loginData = { email: process.env.VUE_APP_TESTLOGINUSER, password: process.env.VUE_APP_TESTLOGINPASS }
    //   firebase.auth().signInWithEmailAndPassword(loginData.email, loginData.password)
    //     .then(userObject => this.$store.dispatch('setUserData', userObject.user))
    //       .then((result) => this.$router.replace('/dashboard'))
    //       .catch(error => console.log(error))
    //     .catch(error => console.log(error))
    // },
    update () {
      let user = firebase.auth().currentUser
      user.updateProfile({ displayName: 'Daniel McNeil' })
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
