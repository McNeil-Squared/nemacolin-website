<template lang="pug">
  v-card
    v-card-title(primary-title)
      div.text-xs-center
        h3.secondary--text Nemacolin Files
        //- a(:href="file.path") {{ file.name }}
        //- v-btn(color="primary" @click="getFiles") Get Files
        input(type="file" id="file" ref="file" @change="fileChange()")
        v-btn(color="primary" @click="uploadFile()") Upload File
</template>

<script>
import firebase from '../firebase.js'

export default {
  data () {
    return {
      // file: { name: '', path: '' },
      file: '',
      upload: { name: '', file: '' }
    }
  },
  methods: {
    getFiles () {
      let storageRef = firebase.storage().ref('ordinances.pdf')
      this.file.name = storageRef.name
      storageRef.getDownloadURL()
        .then((url) => {
          this.file.path = url
        })
    },
    fileChange () {
      // console.log(this.$refs.file.files[0])
      this.file = this.$refs.file.files[0]
    },
    uploadFile () {
      let storageRef = firebase.storage().ref(this.file.name)
      let metadata = { title: 'Landlord Application' }
      storageRef.put(this.file, metadata)
        .then((snapshot) => {
          snapshot.ref.getDownloadURL()
            .then((url) => {
              console.log(url)
            })
        })
      console.log(storageRef.name)
    }
  }
}
</script>
