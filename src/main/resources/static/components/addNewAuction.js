export default {
    template: `
        <form @submit.prevent = "addNewAuction">
              <input v-model = "title" type = "text"
              placeholder = "Enter title">
                <input v-model = "description" type = "text-box"
                placeholder = "Enter description">
                  <input v-model = "reservePrice" type = "text"
                  placeholder = "Enter reserve price">
                    <input v-model = "startTime" type = "date"
                    placeholder = "Enter start date">
                      <input v-model = "endTime" type = "date"
                      placeholder = "Enter end date">
                        <input v-model = "mainImage" type = "text"
                        placeholder = "Enter img-url">
            
            
            <button>Add auction</button>
        
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
            mainImage: ''
        }
    },
    methods: {
        async addNewAuction() {

            // LÄGG TILL FÖR KORT LÖSEN MM
            let auction = {
                seller: this.$store.state.user.id,
                title: this.title,
                description: this.description,
                reserve_price: this.reservePrice,
                start_time: this.startTime,
                end_time: this.endTime,
                main_image: this.mainImage
            }
            let result = await fetch('/rest/auctions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(auction)
            })
            result = await result.json()
            this.$store.commit('appendAuction', result)
/*

            this.seller = ''
            this.title = ''
            this.description = ''
            this.reservePrice = ''
            this.startTime = ''
            this.endTime = ''
            this.mainImage = ''
*/
        }
    }
}