// count state 必須是 Object
const state = {
    editor: false,
    app_config: null,
    editorinfo: {
        version: 1,
        mode: 'false',
        show_ad: 'true',
    },
    show_ad: 'true',
    game: {},
    game_set: false,
    games_list: [],
    played: [],
    form: {
        offset: 0,
        locale: 'zh_TW'
    },
    promoter: false
}

// actions 也是以 Object 形式建構。
const mutations = {
    setAdStatus(state, status) {
        state.show_ad = status;
    },
    setPlayGame(state, config) {
        state.game_set = true;
        state.game = config;
    },
    unsetPlayGame(state) {
        state.game_set = false;
        state.game = {};
    },
    setAppConfig(state, config) {
        state.app_config = config;
    },
    addGamesList(state, config) {
        state.games_list = state.games_list.concat(config);
    },
    unsetGamesList(state) {
        state.games_list = [];
    },
    addPlayed(state, id) {
        if (state.played.indexOf(id) == -1) {
            state.played.unshift(id);
            if (state.played.length >= 1500) {
                state.played.splice(1500);
            }
            window.localStorage.setItem('played', JSON.stringify(state.played));
        }
    },
    setPlayed(state) {
        let played = window.localStorage.getItem('played');
        // console.log(JSON.parse(played));
        if (played) {
            state.played = JSON.parse(played)
        }
    },
    toNextPage(state) {
        state.form.offset += 1;
    },
    initPage(state) {
        state.form.offset = 0;
    },
    setEditor(state) {
        state.editor = true;
    },
    setEditorInfo(state, conifg) {
        // console.log(conifg);
        window.localStorage.setItem('editor', JSON.stringify(conifg));
        state.editorinfo = conifg;
    }
};

const actions = {
    SET_EDITOR({
        commit
    }) {
        commit('setEditor')
    },
    SET_EDITOR_INFO({
        commit
    }, config) {
        commit('setEditorInfo', config)
    },
    SET_APP_CONFIG({
        commit
    }, config) {
        commit('setAppConfig', config)
    },
    SET_PAYLOAD({
        commit
    }, config) {
        commit('setPayload', config)
    },
    UNSET_PAYLOAD({
        commit
    }) {
        commit('unsetPayload')
    },
    UNSET_GAMES_LIST({
        commit
    }) {
        commit('unsetGamesList')
    },
    ADD_GAMES_LIST({
        commit
    }, info) {
        commit('addGamesList', info)
    },
    SET_PLAY_GAME({
        commit
    }, info) {
        commit('setPlayGame', info)
    },
    UNSET_PLAY_GAME({
        commit
    }) {
        commit('unsetPlayGame')
    },
    ADD_PLAYED({
        commit
    }, info) {
        commit('addPlayed', info)
    },
    TO_NEXT_PAGE({
        commit
    }) {
        commit('toNextPage')
    },
    INIT_PAGE({
        commit
    }) {
        commit('initPage')
    },
    SET_AD_STATUS({
        commit
    }, status) {
        commit('setAdStatus', status)
    }
}

const getters = {

}

export default {
    state,
    getters,
    actions,
    mutations
}