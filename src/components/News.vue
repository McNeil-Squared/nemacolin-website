<template lang="pug">
  div
    h3.mb-3.headline.text-xs-center.primary--text Upcoming Events
    v-list(three-line)
      v-subheader April 1, 2019
      v-list-tile
        v-list-tile-avatar
          v-icon(color='primary') fas fa-chalkboard-teacher
        v-list-tile-content
          v-list-tile-title Monthly Board Meeting
          v-list-tile-sub-title UMWA Union Hall - 6:30PM
            br
            | This is a monthly board meeting for Nemacolin Inc.&nbsp;&nbsp;Board meetings are open to the public.
      //- v-divider
</template>

<style lang="scss">
  .v-list__tile {
    @media screen and (max-width: 500px) {
      height: 160px !important;
    }
  }
</style>
