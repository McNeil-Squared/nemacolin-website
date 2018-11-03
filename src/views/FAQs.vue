<template lang="pug">
   div
    h3.headline.text-xs-center.mb-4.primary--text Frequently Asked Questions
    v-layout.mb-3(row wrap)
      v-flex(xs12)
        v-expansion-panel
          v-expansion-panel-content(v-for="(item,i) in questions" :key="i" expand-icon="fas fa-caret-down")
            div.subheading(slot="header") {{ item.question }}
            v-card
              v-card-text.grey.lighten-3(v-html="item.answer")
</template>

<script>
export default {
  data () {
    return {
      questions: [
        { question: 'When is my bill due?', answer: 'You have until the fifth of the following month to pay.&nbsp;&nbsp;For example, if the current month is May, you have until June 5th to send in your payment.&nbsp;&nbsp;Any payments received after the fifth will incur a $2.00 late fee.' },
        { question: 'Do you have an office where I can pay my bill or a drop box?', answer: 'No.&nbsp;&nbsp;All payments are to be mailed to Nemacolin, Inc., PO Box 484, Nemacolin, PA 15351.&nbsp;&nbsp;<b>DO NOT SEND CASH</b>.' },
        { question: 'Who do I contact for questions concerning my account?', answer: 'You can call our customer service line at (724) 320-2750.&nbsp;&nbsp;Our office hours are 9:00 am to 1:30 pm, Monday through Friday.' }
      ]
    }
  }
}
</script>
