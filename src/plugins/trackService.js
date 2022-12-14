import Vue from 'vue'
import router from "../router";
/* trackService.js */

/**
 * @description 紀錄使用者軌跡
 * @param {String} trackedTitle 頁面標題
 */
export PageUserTrack = async ({
    trackedTitle = ''
} = {}) => {

    // 從 vue router 實體中取的目前路由 meta 資訊
    const {
        meta
    } = router.currentRoute

    // 以傳入此方法的 trackedTitle 為主，若無則使用定義在 router 上的 meta 資訊
    const pageTitle = trackedTitle || meta.trackedTitle

    // 若無傳入參數或當下路由無 mate 資訊時會略過軌跡紀錄
    if (Vue.gtm && pageTitle) {

        // 發送 content-view 事件給 GTM
        Vue.gtm.trackEvent({
            // 自行定義的事件名稱
            event: 'content-view',
            // 頁面功能/分頁標題文字
            pageTitle: pageTitle
        })
    }

}