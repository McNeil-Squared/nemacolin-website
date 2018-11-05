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
      heading: 'Nemacolin Policies',
      content: [
        { title: 'Returned Checks', text: 'Like any other utility company, we also have a returned check policy.&nbsp;&nbsp;The fee for a returned check is $50.00, in addition to any charges you may incur from your financial institution.' },
        { title: 'Streetlights', text: 'Our streetlights have been recently upgraded to energy efficient LED bulbs. If you are having an issue with a streetlight near you, please call West Penn Power at <a tel:800-686-0021>1-800-686-0021</a>. They will ask for your address and may ask you for the pole number which can usually be found on a metal disk at eye level on the pole. Or, you can <a href="https://www.firstenergycorp.com/service_requests/report-lighting-problem.html" target="new">report an issue with an online form.</a>' }
      ]
    }
  }
}
</script>
