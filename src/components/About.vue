<template lang="pug">
  v-flex(xs12 md8)
    v-card.mr-2.v-card--modifications
      v-card-title(primary-title)
        h3.headline.mx-auto.primary--text About Us
      p.px-4.mt-4 We are a non-profit corporation established in 1946.&nbsp;&nbsp;Every homeowner in the village of Nemacolin is a stakeholder in the corporation.&nbsp;&nbsp;We are governed by an executive board of seven members, elected by the community.
      p.px-4 We maintain the sewage service, garbage service, streetlights, fire hydrant maintenance, and community property of the village.
      p.px-4 Our regular meetings are held the first Monday of the month at 6:30 pm at the Nemacolin UMWA Union Hall.&nbsp;&nbsp;Town meetings are held quarterly, in March, June, September, and December at 7:00 pm at the Nemacolin UMWA Union Hall.
      p.px-4 Please feel free to explore our site to see what we do for our community!
</template>

<style lang="scss" scoped>
  .v-card--modifications {
    box-shadow: none;
    .v-card__title {
      box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
      -webkit-box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
    }
  }
  table {
    border-collapse: collapse;
    td {
      padding: 0.5rem 1.0rem;
      border: 1px solid #333;
      font-size: 1.0rem;
    }
  }
</style>
