module.exports = function (sequelize, Sequelize) {
  return sequelize.define('User', {
    facebook_id: Sequelize.STRING,
    first_name: {
      type: Sequelize.STRING
    },
    last_name: Sequelize.STRING,
    profile_picture: Sequelize.STRING,
    age: Sequelize.INTEGER,
    email: Sequelize.STRING,
    actif: {
      type: Sequelize.BOOLEAN
    }
  });
}