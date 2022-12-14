// count state 必須是 Object
const state = {
  count: 0,
}

// actions 也是以 Object 形式建構。
const mutations = {
  addCount(state) {
      state.count = state.count +1;
  },
 
};

const actions = {
  ADD_COUNT({
      commit
  }) {
      commit('addCount')
  },
}

const getters = {

}

export default {
  state,
  getters,
  actions,
  mutations
}