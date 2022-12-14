  // just return all state
  export const getAllstate = state => state

  export const getCurrentLangCode = state => {
      return state.language.code
  }
  export const getAppConfig = state => {
      return state.app_config;
  }
  export const getPayload = state => {
      return state.payload;
  }
  export const getProfile = state => {
    return state.Profile;
 }

  /* funfunquiz相關 */
  export const getEditor = state => {
      return state.funfunquiz.editorinfo;
  }

  export const getIsShowAD = state => {
      if (state.funfunquiz.editorinfo.show_ad == 'false' || state.funfunquiz.show_ad == 'false') {
          return false;
      }
      return true;
  }



   /* game demo相關 */

   export const getcount = state => {
    return state.game_demo.count;
}
