export default (sequelize, DataTypes) => {
  const Contract = sequelize.define('Contract', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING }, // ex: 'imóvel', 'veículo', 'garantia'
    description: { type: DataTypes.STRING },
    fileUrl: { type: DataTypes.STRING }, // caminho do arquivo
    relatedAssetId: { type: DataTypes.INTEGER } // opcional: vincular a um patrimônio
  });
  return Contract;
};
