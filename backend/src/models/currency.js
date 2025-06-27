export default (sequelize, DataTypes) => {
  const Currency = sequelize.define('Currency', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING, allowNull: false }, // BRL, USD, EUR, etc
    symbol: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING }
  });
  return Currency;
};
