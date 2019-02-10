<template lang="pug">
  div
    h3.headline.text-xs-center.mb-4.primary--text Nemacolin Files
    v-layout(row wrap)
      v-flex(xs12 md6 v-for="(folder, key) in folders" :key="key")
        h3.secondary--text.text-xs-center.mb-2 {{ key }}
        v-card
          v-data-table.files-table.text-xs-center(:headers="folder.headers" :items="folder.entries" sort-icon="fas fa-arrow-up" prev-icon="fas fa-chevron-left" next-icon="fas fa-chevron-right")
            template(slot="items" slot-scope="props")
              td.text-xs-left
                a(:href="props.item.url" target="new") {{ props.item.name }}
              td {{ props.item.uploaded }}
              td(v-if="role === 'admin'")
                v-btn(color="primary") Delete
        //- a(:href="file.path") {{ file.name }}
        //- v-btn(color="primary" @click="getFiles") Get Files
        //- input(type="file" id="file" ref="file" @change="fileChange()")
        //- v-btn(color="primary" @click="uploadFile()") Upload File
</template>

<script>
import firebase from '../firebase.js'
import { mapState } from 'vuex'

let headers = [
  { text: 'Name', value: 'name', align: 'left', sortable: false },
  { text: 'Uploaded', value: 'uploaded', align: 'center', sortable: false },
  { text: 'Actions', value: 'actions', align: 'center', sortable: false }
]

// folders: {
//   folderName: [
//     { name: name, uploaded: uploaded},
//     { name: name, uploaded: uploaded}
//   ]
// }

export default {
  data () {
    return {
      folders: {},
      file: '',
      upload: { name: '', file: '' }
    }
  },
  methods: {
    getFiles () {
      firebase.firestore().collection('files').get()
        .then((result) => {
          result.forEach(file => {
            let folders = {}
            let fileData = file.data()
            let timestamp = new Date(fileData.uploaded.seconds * 1000)
            let uploaded = `${timestamp.getMonth() + 1}-${timestamp.getDay() + 1}-${timestamp.getFullYear()}`
            if (folders.hasOwnProperty(fileData.folder)) {
              folders[fileData.folder].entries.push({ name: fileData.name, uploaded: fileData.uploaded, url: fileData.url })
            } else {
              folders[fileData.folder] = { headers: headers, entries: [] }
              folders[fileData.folder].entries.push({ name: fileData.name, uploaded: uploaded, url: fileData.url })
            }
            this.folders = folders
          })
        })
        .catch((error) => { console.log(error) })
      // let storageRef = firebase.storage().ref('ordinances.pdf')
      // this.file.name = storageRef.name
      // storageRef.getDownloadURL()
      //   .then((url) => {
      //     this.file.path = url
      //   })
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
  },
  computed: {
    role () {
      if (this.user) { return this.user.role }
    },
    ...mapState(['user'])
  },
  created () {
    this.getFiles()
  }
}
</script>

<style>
  .files-table th:nth-of-type(1n) {
    width: 70%;
  }
  .files-table th:nth-of-type(2n) {
    width: 20%;
  }
  .files-table th:nth-of-type(3n) {
    width: 10%;
  }
</style>
