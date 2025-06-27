export default (sequelize, DataTypes) => {
  const CustomReport = sequelize.define('CustomReport', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    filters: { type: DataTypes.JSONB },
    columns: { type: DataTypes.JSONB }
  });
  return CustomReport;
};
