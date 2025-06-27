export default (sequelize, DataTypes) => {
  const Goal = sequelize.define('Goal', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER },
    description: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false }, // economia, gasto
    value: { type: DataTypes.DECIMAL(15,2), allowNull: false },
    current: { type: DataTypes.DECIMAL(15,2), defaultValue: 0 },
    deadline: { type: DataTypes.DATEONLY }
  });
  return Goal;
};
