<template>
  <div class="pageWrapper">
    <div class="form">
      <select v-model="type">
        <option value="random">Random</option>
        <option :value="type" :key="type" v-for="type in types">{{capitalizeFirstLetter(type)}}</option>
      </select>
      <label for="participants">How many participants?</label>
      <input type="number" class="textInput" id="participants" v-model="participants" min="1" />
      <button @click="getRandomEvent">Find me something to do!</button>
      <p class="eventMessage" v-if="event.activity">{{event.activity}}</p>
      <p class="errorMessage" v-if="errorMessage">{{errorMessage}}</p>
      <p class="semiButton" v-if="eventHistoryReverse.length > 0" @click="clearHistory">Clear history</p>
      <div class="eventHistory">
        <div class="list">
          <li :key="event.id" v-for="event in eventHistoryReverse">{{event.activity}}</li>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      participants: 1,
      errorMessage: null,
      type: 'random',
      types: ['recreational', 'education', 'social', 'diy', 'charity', 'cooking', 'relaxation', 'music', 'busywork'],
    };
  },
  computed: {
    eventHistoryReverse() {
      let temp = []
      this.$store.state.eventHistory.forEach(event => {
        temp.unshift(event)
      })
      return temp
    },
    event() {
      return this.$store.state.event
    }
  },
  methods: {
    getRandomEvent() {

      let url = null
      if (this.type != 'random') {
        url = `https://www.boredapi.com/api/activity?participants=${this.participants}&type=${this.type}`;
      } else {
        url = `https://www.boredapi.com/api/activity?participants=${this.participants}`;
      }

      axios
        .get(url)
        .then(res => {
          if (res.data.error) {
            this.errorMessage = res.data.error;
          }
          this.$store.commit('ADD_EVENT_TO_HISTORY', this.event)
          this.$store.commit('UPDATE_CURRENT_EVENT', res.data)

        })
        .catch(error => {
          this.errorMessage = error;
        });
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    clearHistory() {
      this.$store.commit('CLEAR_HISTORY')
    }
  }
};
</script>

<style>
.pageWrapper {
  display: flex;
  height: 100vh;
}

.form {
  width: 20%;
  text-align: left;
  margin: auto;
}

.form button,
.form input,
.eventMessage,
.form select
 {
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin: 5px 0 15px 0;
}

.form button,
.textInput,
.eventMessage,
select {
  padding: 15px;
  border-radius: 5px;
  border: none;
}

.semiButton {
  color: #666;
  font-size: 9pt;
  margin: 5px 0;
  cursor: pointer;
}

.textInput, select {
  border: 1px solid #eaeaea;
}

.form button {
  background: rgb(76, 25, 117);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: .1s;
}

.form button:hover {
  background: rgb(97, 37, 146);
}

.eventMessage {
  border: #d0afd6 solid 1px;
  background: #e2c6ea83;
}

.eventHistory {
  height: 100px;
  max-height: 100px;
  min-height: 100px;
  overflow: scroll;
  position: relative;
}

.eventHistory li {
  font-size: 11pt;
  margin: 5px 0 0 0;
}

.eventHistory p {
  margin: 10px 0 0 0;
}


.eventHistory::-webkit-scrollbar {
    display: none;
}


@media screen and (max-width: 992px) {
  .form {
    width: 100%;
    padding: 20px;
  }
}

</style>