<template lang="pug">
  v-card
    v-card-title(primary-title)
      v-layout(row wrap)
        v-flex(xs12)
          form(@submit.prevent="submit" autocomplete="on")
            v-text-field(v-model="email" value="email" :label="email" :error-messages=`emailErrors` required @input=`$v.email.$touch()` @blur=`$v.email.$touch()` solo)
        //- v-text-field(v-model="password" :error-messages="passwordErrors" label="Password" required @input="$v.password.$touch()" @blur="$v.password.$touch()" solo type="password")
      //-   v-btn(v-if="status != 'success'" @click="submit" color="primary" :loading="sending" :disabled="sending") Submit
      //- v-alert(v-if="status === 'error' && !sending" type="error" icon="fas fa-times" value="true") Incorrect username or password.
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      email: '',
      firstName: '',
      lastName: '',
      mailingAddress: {},
      phone: '',
      physicalAddress: {},
      position: '',
      role: ''
    }
  },
  mixins: [validationMixin],
  validations: {
    email: { required }
  },
  computed: {
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.required && errors.push('Email is required.')
      return errors
    }
  },
  created () {
    let currentUser = this.$store.getters.user
    this.email = currentUser.email
  }
}
</script>
