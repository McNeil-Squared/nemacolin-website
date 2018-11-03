<template lang="pug">
  div
    h3.headline.text-xs-center.mb-4.primary--text Nemacolin Community Park
    v-layout.mb-3(row wrap)
      v-flex.text-xs-center(xs12 md4 v-for="item in playground.images" :key="item.alt")
        img(:src="item.img" alt="item.alt")
    v-layout.mb-3(row wrap)
      v-flex(xs12)
        h2.accent--text.pl-3 {{ playground.title }}
        p.px-3 {{ playground.text }}
    v-layout(row wrap)
      v-flex.text-xs-center(xs12 md6 v-for="item in features" :key="item.alt")
        img(:src="item.img" alt="item.alt")
        h2.accent--text {{ item.title }}
        p.px-3.text-xs-left(v-html="item.text")

</template>

<script>
import slide from '../assets/slide.png'
import totter from '../assets/totter.png'
import horses from '../assets/horses.png'
import pavilion from '../assets/pavilion.png'
import ballfield from '../assets/ballfield.png'
// import pavilionRentalInfo from '../assets/docs/pavilionRentalInfo.pdf'
// import pavilionRentalApp from '../assets/docs/pavilionRentalApp.pdf'
// import guidebook from '../assets/docs/guidebook2017.pdf'

export default {
  data () {
    return {
      playground: {
        title: 'The Playground',
        text: 'Nemacolin is the only community in Cumberland Township that owns and operates its own park.&nbsp;&nbsp;We have a number of play areas on the property, as well as our own softball field and basketball court.&nbsp;&nbsp;Residents are welcome in our park from dawn until dusk, 365 days a year.',
        images: [
          { img: slide, alt: 'slides' },
          { img: totter, alt: 'teeter-totter' },
          { img: horses, alt: 'rocking horses' }
        ]
      },
      features: [
        // { img: pavilion, alt: 'the pavilion', title: 'The Pavilion', text: `We have a covered pavilion that is a terrific site for birthday parties, graduation parties, and family gatherings.&nbsp;&nbsp;Housing eight picnic tables that are accessible from all sides, our pavilion stands as the centerpiece of the park.&nbsp;&nbsp;All community members are welcome to use the pavilion on a first come, first served basis.&nbsp;&nbsp;If you would like information on reserving the pavilion for your next function, please <a href="${pavilionRentalInfo}">click here</a>.<br><br>For a reservation agreement, <a href="${pavilionRentalApp}">click here.</a>` },
        { img: pavilion, alt: 'the pavilion', title: 'The Pavilion', text: `We have a covered pavilion that is a terrific site for birthday parties, graduation parties, and family gatherings.&nbsp;&nbsp;Housing eight picnic tables that are accessible from all sides, our pavilion stands as the centerpiece of the park.&nbsp;&nbsp;All community members are welcome to use the pavilion on a first come, first served basis.&nbsp;&nbsp;If you would like information on reserving the pavilion for your next function, please call 724-320-2750.` },
        // { img: ballfield, alt: 'the ballfield', title: 'The Ballfield', text: `Our ball field has had quite a makeover in the last few years.&nbsp;&nbsp;We now host King Coal Little League team practice and King Coal Softball League practice.&nbsp;&nbsp;If you are interested in reserving our field, please <a href="${guidebook}">click here.</a>` }
        { img: ballfield, alt: 'the ballfield', title: 'The Ballfield', text: `Our ball field has had quite a makeover in the last few years.&nbsp;&nbsp;We now host King Coal Little League team practice and King Coal Softball League practice.&nbsp;&nbsp;If you are interested in reserving our field, please call 724-320-2750.` }
      ]
    }
  }
}
</script>
