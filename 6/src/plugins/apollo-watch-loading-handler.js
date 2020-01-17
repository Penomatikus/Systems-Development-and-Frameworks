// plugins/apollo-watch-loading-handler.js
export default (isLoading, countModifier, nuxtContext) => {
    let loading = countModifier
    console.log('Global loading', loading, countModifier)
  }