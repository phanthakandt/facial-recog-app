module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    type: {
      type: DataTypes.STRING,
    },
    imagename: {
      type: DataTypes.STRING,
    },
    fname: {
      type: DataTypes.STRING,
    },
    lname:{
      type: DataTypes.STRING,
    },
    pnum:{
      type: DataTypes.STRING,
    },
    email:{
      type: DataTypes.STRING,
    },
    company:{
      type: DataTypes.STRING,
    },
    data: {
      type: DataTypes.BLOB("long"),
    },
  });

  return User;
};
