<template lang="pug">
  ProfileForm(:type="type")
</template>

<script>
import ProfileForm from '../components/ProfileForm'
export default {
  data () {
    return {
      type: 'adduser'
    }
  },
  components: { ProfileForm }
}
</script>
