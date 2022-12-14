const Tool = {
    isVisiable: function () {
        let scrollY = window.scrollY
        let visible = document.documentElement.clientHeight
        let pageHeight = document.documentElement.scrollHeight
        let bottomOfPage = (visible + scrollY + 800) >= pageHeight

        return bottomOfPage || (pageHeight) <= visible
    },
}

export {
    Tool
};