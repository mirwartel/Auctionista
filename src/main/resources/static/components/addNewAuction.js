

export default {
    template: `
        <form @submit.prevent = "addNewAuction" class = "auctionform">
              <input required v-model = "title" type = "text"
              placeholder = "Enter title">
                <input required v-model = "description" type = "text-box"
                placeholder = "Enter description">
                  <input required v-model = "reservePrice" type = "text"
                  placeholder = "Enter reserve price">
                    <input required v-model = "startTime" type = "date"
                    placeholder = "Enter start date">
                      <input required v-model = "endTime" type = "date"
                      placeholder = "Enter end date">

                      <div v-if="images < 3">
                          <label for="files">Upload up tp 2 files:</label>
                          <input type="file" name="files" accept=".png,.jpg,.jpeg,.gif,.bmp,.jfif" multiple required @change="filesChange($event.target.files)" />
                          </div>
                          <div v-else>
  Maximum number of pictures upploaded
</div>
                          <input type="radio" id="pic1" v-model="DisplayPicNum" value="0">
<label for="pic1">Select file 1 as display picture</label><br>
<input type="radio" id="pic2" v-model="DisplayPicNum" value="1">
<label for="pic2">Select file 2 as display picture</label><br>

            
            
            <button>Add auction</button>
            <p>{{ confirmationMessage }}</p>
            <p>{{valid}}</p>
        
        </form>

    `,
    data() {
        return {
            // lägg till att hitta inloggad
            seller: '',
            title: '',
            description: '',
            reservePrice: '',
            startTime: '',
            endTime: '',
            mainImage: '',
            secondImage: '',
            confirmationMessage: '',
            mainImage: '',
            images: [],
            imageFiles: null,
            DisplayPicNum: 0,
            valid: ""
        }
    },
    methods: {



 


        create_UUID(){

            var dt = new Date().getTime();
          
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          
                var r = (dt + Math.random()*16)%16 | 0;
          
                dt = Math.floor(dt/16);
          
                return (c=='x' ? r :(r&0x3|0x8)).toString(16);
          
            });
          
            return uuid;
          
          },


        async filesChange(fileList) {
            if (!fileList.length) return;


      
            // handle file changes
            const formData = new FormData();
      
            // reset images array on file change
            //this.images = []
      
            // append the files to FormData
            Array.from(Array(fileList.length).keys())
              .map(x => {
      
                // create a new unique filename
                const uuid = this.create_UUID()
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
            console.log(this.images)
          },


        async addNewAuction() {




            // LÄGG TILL FÖR KORT LÖSEN MM
            let auction = {
                seller: this.$store.state.user.id,
                title: this.title,
                description: this.description,
                reserve_price: this.reservePrice,
                start_time: this.startTime,
                end_time: this.endTime,
                main_image: this.images[this.DisplayPicNum],
                second_image: this.images[1 - this.DisplayPicNum]
            }
            let nowDate = new Date()
            nowDate.setHours(0, 0, 0, 0)
            let startDate = new Date(this.startTime)
            let endDate = new Date(this.endTime)
        if(nowDate <= startDate && startDate < endDate){
            let result = await fetch('/rest/auctions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(auction)
            })
            console.log(this.imageFiles);

            try {

              console.log("before respone");
              //response = await response.json()
      
              // if we created an entity we then
              // send the image files
              console.log("before fetch");
              await fetch('/api/upload-files', {
                method: 'POST',
                body: this.imageFiles
              });
  
            } 
            catch {
              console.warn('Could not create entity'); 
            }
    
            result = await result.json()
            this.$store.commit('appendAuction', result)
            this.confirmationMessage = this.title + ' has been added as an auction.'

              //clearing the fields

              


        }
        else {
             this.valid = "invalid Date, try again"
             this.confirmationMessage = ""

        }


 



        this.seller = ''
        this.title = ''
        this.description = ''
        this.reservePrice = ''
        this.startTime = ''
        this.endTime = ''
        this.mainImage = ''
        this.secondImage = ''
        this.imageFiles = null
        this.images = []
        this.DisplayPicNum= 0,
        this.valid = ""


    }
}


}
