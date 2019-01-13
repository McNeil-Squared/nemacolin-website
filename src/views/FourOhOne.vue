<template lang="pug">
  v-container(text-xs-center)
    v-layout(row wrap)
      v-flex(xs12)
        h1.mb-2 401 - Access Denied
        img(:src="img" :alt="alt")
        p(v-if="type === 'profile'").my-4 Users are only allowed to view their own profiles.
        p(v-if="type === 'admin'").my-4 The page that you are trying to access is for system administrators only.
        p.my-4 If you believe that you are seeing this message in error, please #[a(href="/contact") contact us] and let us know.
</template>

<script>
export default {
  data () {
    return {
      img: require('../assets/401.jpg'),
      alt: 'stop sign'
    }
  },
  props: ['type']
}
</script>
