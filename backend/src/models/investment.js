export default (sequelize, DataTypes) => {
  const Investment = sequelize.define('Investment', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false }, // ação, renda fixa, fundo, etc
    value: { type: DataTypes.DECIMAL(15,2), allowNull: false },
    institution: { type: DataTypes.STRING },
    startDate: { type: DataTypes.DATEONLY },
    endDate: { type: DataTypes.DATEONLY },
    yieldHistory: { type: DataTypes.JSONB } // [{date, value}]
  });
  return Investment;
};
