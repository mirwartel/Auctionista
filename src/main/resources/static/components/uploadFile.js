export default {
    template: `
      <form id="create-auction" @submit.prevent="submitForm">
          <div>
              <label for="title">Title:</label>
              <input name="title" placeholder="Comfy sofa" v-model="title" required />
          </div>
          <div>
              <label for="files">File to upload:</label>
              <input type="file" name="files" accept=".png,.jpg,.jpeg,.gif,.bmp,.jfif" multiple required @change="filesChange($event.target.files)" />
          </div>
          <button type="submit">Create Auction</button>
      </form>
    `,
    data: {
      title: "",
      images: [],
      imageFiles: null
    },
    methods: {
      async filesChange(fileList) {
        if (!fileList.length) return;
  
        // handle file changes
        const formData = new FormData();
  
        // reset images array on file change
        this.images = []
  
        // append the files to FormData
        Array.from(Array(fileList.length).keys())
          .map(x => {
  
            // create a new unique filename
            const uuid = create_UUID()
            // with regex
            // const fileExt = fileList[x].name.replace(/[\w-]*/, '')
  
            let fileExt = fileList[x].name
            fileExt = fileExt.slice(fileExt.lastIndexOf('.'))
            const filename = uuid + fileExt
  
            // save image url in frontend array
            this.images.push('/uploads/' + filename)
            formData.append("files", fileList[x], filename);
          });
  
        // store formData to be sent later
        this.imageFiles = formData
      },
      async submitForm() {
        let response = await fetch('/api/auctions/', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: this.title,
            description: "Bla bla",
            startingBid: 200,
            images: this.images
          })
        })
  
        try {
          response = await response.json()
  
          // if we created an entity we then
          // send the image files
          await fetch('/api/upload-files', {
            method: 'POST',
            body: this.imageFiles
          });
  
          // clear variables
          this.imageFiles = null
          this.images = []
        } 
        catch {
          console.warn('Could not create entity'); 
        }
      }
    }
  }