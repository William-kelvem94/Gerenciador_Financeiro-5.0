export default (sequelize, DataTypes) => {
  const Family = sequelize.define('Family', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false }
  });
  return Family;
};
