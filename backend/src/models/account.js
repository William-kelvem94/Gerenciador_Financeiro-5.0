export default (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false }, // corrente, poupança, etc
    balance: { type: DataTypes.DECIMAL(15,2), defaultValue: 0 }
  });
  return Account;
};
