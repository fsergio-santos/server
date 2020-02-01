module.exports = app => {

   app.route('/users')
      .post(app.api.user.save)
      .get(app.api.user.get)
   
   app.route('/users/name/:nome')
      .get(app.api.user.getByName)

   app.route('/users/email/:email')
      .get(app.api.user.getByEmail)

   app.route('/users/:id')
      .post(app.api.user.save)
      .get(app.api.user.getById)

   app.route('/uploads')
      .post(app.api.user.uploadFile)

}