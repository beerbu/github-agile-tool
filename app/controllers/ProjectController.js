module.exports = function (app, config) {

    var ProjectModel = app.getModel('Project', true);
    var model = new ProjectModel();

    return app.getController("Application", true).extend()
    .methods({
        index: function (req, res) {
            var self = this;

            model.findAll(function (err, projects) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                self.render(res, 'projects-index', {
                    projects: projects
                });
    //            model.mongoose.disconnect();
            });
        },
        new: function (req, res) {
            this.render(res, 'projects-new');
        },
        create: function (req, res) {
            model.create(req.body.projname, req.body.url, function(err) {
                if (err) {
                    console.log(err);
                    throw err;
                }

                res.redirect('/projects');
            });
        }
  })

}