module.exports = function (app) {
  return {
    '/': {'get': 'Home.index'}
  , '/soy': {'get': 'Soy.index'}
  , '/list': {get: 'PblList.index'}
  }
}
