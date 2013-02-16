module.exports = function (app, config) {
    return app.getModel("Application", true).extend(function() {
        this.DBModel = this.mongoose.model('Project', new this.Schema({
            name: {type: String, required: true},
            url:  {type: String, required: true}
        }))
    })
    .methods({
        create: function (name, url, callback) {
            var project = new this.DBModel({
                name: name,
                url : url
            });
            project.save(callback);
        },
        find: function (id, callback) {
            this.DBModel.findById(id, callback);
        },
        findAll: function (callback) {
            this.DBModel.find(callback);
        }
    })
};