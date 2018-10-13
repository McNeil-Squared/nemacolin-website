<template lang="pug">
  v-flex(xs12 md8)
    v-card.mr-2.v-card--modifications
      v-card-title(primary-title)
        h3.headline.mx-auto.primary--text About Us
      p.px-4.mt-4 Nemacolin Inc provides sewer service, trash service, maintenance for the park and ballfield, pays for electricity and maintenance for the street lights, and pays for maintenance for the fire hydrants.&nbsp;&nbsp;Nemacolin Inc changes a flat fee per house, &#36;40 for occupied homes and &#36;15 for unoccupied homes, to provide funding for the services that they provide.
      p.px-4 Nemacolin Inc was originally founded in 19xx by the Buckeye Coal company.&nbsp;&nbsp;Nemacolin Inc became a private entity in 19xx when the mine closed.
      p.px-4.text-xs-center.title.accent--text Nemacolin Inc Board
      table.mx-auto.text-xs-center
        tr
          th Name
          th Title
        tr
          td Angie Visnesky
          td President
        tr
          td Drew Cubic, Jr
          td Vice President
        tr
          td Wanda Cutright
          td Secretary
        tr
          td Eric Teagarden
          td Member
        tr
          td Rick Sokal
          td Member
        tr
          td William
          td Member
        tr
          td Ed Helman
          td Member
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
