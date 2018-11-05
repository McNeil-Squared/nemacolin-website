<template lang="pug">
  div
    h2.accent--text.text-xs-center {{ heading }}
    span(v-for='(item,i) in content' :key='i')
      h3.headline.text-xs-center.primary--text.mt-3 {{ item.title }}
      p.px-4.mt-3(v-html="item.text")
</template>

<script>
export default {
  data () {
    return {
      heading: 'Resident Requirements',
      content: [
        { title: 'Accounts', text: 'Every owner in the village of Nemacolin is required to establish an account for the services rendered by Nemacolin, Inc.&nbsp;&nbsp;Some rental properties require the tenants to establish an accounts with us.&nbsp;&nbsp;You can call our office <a href="/contact"> or use the contct form</a> to request a copied be mailed to you.' },
        { title: 'Service Termination', text: 'Nemacolin, Inc. serves as the sewage authority for the village, in addition to providing garbage service, streetlights, fire hydrant maintenace, and the community park.&nbsp;&nbsp;Each household is required to pay a fee for the services provided.&nbsp;&nbsp;Failure to pay will result in the termination of your water service.' },
        { title: 'Waste Removal', text: 'Nemacolin, Inc. is a proud supporter of locally owned businesses.&nbsp;&nbsp;Our waste removal contractor is Greene Waste Services located in Greensboro, PA.&nbsp;&nbsp;Garbage service from September until June is every Friday.&nbsp;&nbsp;June through August brings twice weekly pickup, on Tuesdays and Fridays.&nbsp;&nbsp;All households are required, by Cumberland Township ordinance, to have a covered trash receptacle.' }
      ]
    }
  }
}
</script>
