import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";


Vue.use(Vuex)


let state = {
  event: {},
  eventHistory: []
}

let mutations = {
  UPDATE_CURRENT_EVENT(state, payload) {
    state.event = payload
  },
  ADD_EVENT_TO_HISTORY(state, payload) {
    state.eventHistory.push(payload)
  },
  CLEAR_HISTORY(state) {
    state.eventHistory = []
  }
}

export default new Vuex.Store({
  state,
  mutations,
  plugins: [createPersistedState()]
})

