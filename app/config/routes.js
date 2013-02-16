module.exports = function (app) {
  return {
    '/': {'get': 'Home.index'}
  , '/soy': {'get': 'Soy.index'}
//  , '/list': {get: 'PblList.index'}
  , '/projects' : {'get': 'Project.index'}
  , '/projects/new' : {'get': 'Project.new', 'post': 'Project.create'}
  }
}
