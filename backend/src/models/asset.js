export default (sequelize, DataTypes) => {
  const Asset = sequelize.define('Asset', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false }, // imóvel, veículo, outro
    value: { type: DataTypes.DECIMAL(15,2), allowNull: false },
    acquisitionDate: { type: DataTypes.DATEONLY },
    description: { type: DataTypes.STRING }
  });
  return Asset;
};
