<template lang="pug">
  appProfileForm(:username="username" :type="type")
</template>

<script>
import ProfileForm from '../components/ProfileForm'
export default {
  data () {
    return {
      type: 'profile'
    }
  },
  props: ['username'],
  components: { appProfileForm: ProfileForm }
}
</script>
