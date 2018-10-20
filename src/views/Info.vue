<template lang="pug">
  div
    h3.headline.text-xs-center.mb-4.primary--text Important Information for Nemacolin Residents
    v-layout(row wrap)
      v-flex(xs12 md6)
        app-requirements
      v-flex(xs12 md6)
        app-policies
</template>

<script>
import requirements from '../components/Requirements'
import policies from '../components/Policies'

export default {
  components: { appRequirements: requirements, appPolicies: policies }
}
</script>
