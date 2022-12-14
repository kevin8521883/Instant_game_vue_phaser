//import Vue from 'vue';

export const state = {
    Profile: {
        name: 'Jack Lus Gllxen Leix',
        id: '123',
        locale: 'zh_TW',
        photo: 'user.jpg'
    },
    language: {
        code: 'zh_TW',
        name: '繁體中文',
    },
    Languages: [{
            code: 'en',
            name: 'English',
        },
        {
            code: 'zh_TW',
            name: '繁體中文',
        },
        {
            code: 'ja',
            name: '日本語',
        },
        {
            code: 'es',
            name: 'Español',
        },
        {
            code: 'id',
            name: 'Indonesia',
        },
        {
            code: 'fr',
            name: 'Français',
        },
        {
            code: 'it',
            name: 'Italiano',
        },
        {
            code: 'nl',
            name: 'Nederlands',
        },
        {
            code: 'pt',
            name: 'Português',
        },
        {
            code: 'ms',
            name: 'Bahasa Melayu',
        },
        {
            code: 'hi',
            name: 'हिंदी',
        },
        {
            code: 'te',
            name: 'తెలుగు',
        },
        {
            code: 'ar',
            name: 'العربية',
        },
        {
            code: 'th',
            name: 'ไทย',
        },
        {
            code: 'hu',
            name: 'Magyar',
        },
        {
            code: 'ru',
            name: 'Русский',
        },
        {
            code: 'ro',
            name: 'Română',
        },
        {
            code: 'bn',
            name: 'বাংলা',
        },
        {
            code: 'ia',
            name: 'English',
        },
        {
            code: 'vi',
            name: 'Tiếng Việt',
        },
        {
            code: 'tr',
            name: 'Türkçe',
        },
        {
            code: 'pl',
            name: 'Polski',
        },
        {
            code: 'sv',
            name: 'Sweden',
        },
        {
            code: 'el',
            name: 'Ελληνικά',
        },
        {
            code: 'cs',
            name: 'čeština',
        },
        {
            code: 'tl',
            name: 'Tagalog',
        },
    ],
    info: {},
    app_config: {
        ad_percent: 100,
        ad_type: 1,
        enter_confirm: 1,
        subscribe: 0,
        cdn: 1,
        special_mode: 1,
        share_mode: "2",
        rand_photo: "1",
        after_share_probability: 0,
        after_share_mode: 0,
        switch_app_id: 0,
        switch_percent: 0
    },
    entry_point: {},
}

export const mutations = {
    setProfile(state, config) {
        state.Profile = config;
    },
    changeLanguageConfig(state, config) {
        state.language = config;
        state.funfunquiz.form.locale = config.code;
        window.localStorage.setItem('language', config.code);
    },
    //設置一些資訊到store供檢查用
    setInfo(state, config) {
        state.info = config;
    },
    setEntryPoint(state, data) {
        state.entry_point = data;
    },
}

export const actions = {
    SET_PROFILE({
        commit
    }, config) {
        commit('setProfile', config)
    },
    CHANGE_LANGUAGE({
        commit
    }, config) {
        commit('changeLanguageConfig', config)
    },
    SET_INFO({
        commit
    }, config) {
        commit('setInfo', config)
    },
    SET_ENTRY_POINT({
        commit
    }, config) {
        commit('setEntryPoint', config)
    },
}