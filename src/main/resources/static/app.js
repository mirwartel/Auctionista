//import { createNamespacedHelpers } from "./libs/vuex.esm.browser"

export default {
    template: `
      <div id="app">
        <nav class="navbar-top">
        
          <router-link to="/">Home</router-link>
          <router-link to="/register">Register</router-link>
        </nav>
        <div class="top-picture">hej hej</div>
  
        <main>
          <router-view />
        </main>

        <footer> Made from hard work</footer> 
      </div>
    `,
}