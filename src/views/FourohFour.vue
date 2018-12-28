<template lang="pug">
  v-container(text-xs-center)
    v-layout(row wrap)
      v-flex(xs12)
        h1.mb-2 404 - Page Not Found
        img(:src="img" :alt="alt")
        p.my-4 Sorry, but that page you were looking for is not part of this website.&nbsp;&nbsp;Please click the back button or choose on the menu options above.&nbsp;&nbsp;If you believe that you are seeing this message in error (and this should be an actual page) please #[a(href="/contact") contact us] and let us know.
</template>

<script>
export default {
  data () {
    return {
      img: require('../assets/school.png'),
      alt: 'Nemacolin Elementary School'
    }
  }
}
</script>