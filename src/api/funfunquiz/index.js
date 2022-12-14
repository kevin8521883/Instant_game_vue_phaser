import store from '@/store/index'
import {
    apiUserLogin,
    apiGameList
} from "./request.js";


const userLogin = async function (Profile) {
    return apiUserLogin(Profile)
        .then(response => {
            let res = response.data;
            if (res.status && res.data.appconfig) {
                let config = res.data.appconfig;
                if (config && config.rand_photo && config.rand_photo == 2) {
                    let rand_num = Math.floor(Math.random() * 3) + 1;
                    Profile.photo = `user/${rand_num}.png`;
                }
                return {
                    config,
                    Profile
                }
            }
            return {}
        })
        .catch(error => {
            error
        });
}
//讀取題目
const gameLoad = async function () {
    let send = store.state.funfunquiz.form;
    return apiGameList(send)
        .then(response => {
            let games = response.data.data;
            games.forEach((item) => {
                item.vindex = send.offset + '_' + item.id;
            });

            store.dispatch("ADD_GAMES_LIST", games);

            window.addEventListener('scroll', gameListAtEnd);
        })
        .catch(error => {
            console.log(error);
        });
}

const gameNextPage = async function () {
    store.dispatch("TO_NEXT_PAGE");
    return gameLoad();
}
const gameListAtEnd = function () {

    let isBottom = isVisiable()
    if (isBottom) {
        window.removeEventListener('scroll', gameListAtEnd, false);
        gameNextPage();
    }
}
const isVisiable = function () {
    let scrollY = window.scrollY
    let visible = document.documentElement.clientHeight
    let pageHeight = document.documentElement.scrollHeight
    let bottomOfPage = (visible + scrollY + 800) >= pageHeight

    return bottomOfPage || (pageHeight) <= visible
}
export default {
    userLogin,
    gameLoad,
    gameNextPage
}