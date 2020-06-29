// user odel declaration
'use strict';
const bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  // Define user object
  const user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Invalid email address'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 99],
          msg: 'Name must be between 1 and 99 characters'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 99],
          msg: 'Password is of incorrect length. Double check character number'
        }
      }
    }
  }, {
    hooks: {
      // before record creation
      beforeCreate: function(createdUser, options) {
        if (createdUser && createdUser.password) {
          let hash = bcrypt.hashSync(createdUser.password, 12);
          createdUser.password = hash;
        }
      }
        // Take inputed password by user and hash it
        // return new password as password for new record
    }
  });
  user.associate = function(models) {
    // TODO any user associations
  }
  // Take inputed password and compare to hashed password in user table
  user.prototype.validPassword = function(passwordTyped) {
    return bcrypt.compareSync(passwordTyped, this.password);
  }
  // remove password setup before add
  user.prototype.toJSON = function() {
    let userData = this.get();
    delete userData.password;
    return userData;
  }
  // return user model
  return user;
};