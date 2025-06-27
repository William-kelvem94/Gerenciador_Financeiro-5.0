import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'postgres'
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importar modelos
import User from './user.js';
import Family from './family.js';
import Goal from './goal.js';
import Currency from './currency.js';
import Attachment from './attachment.js';
import Card from './card.js';
import Account from './account.js';
import Transaction from './transaction.js';
import Category from './category.js';
import Recurring from './recurring.js';
import Budget from './budget.js';
import Settings from './settings.js';
import Investment from './investment.js';
import Asset from './asset.js';
import Debt from './debt.js';
import AuditLog from './auditlog.js';
import CustomReport from './customreport.js';
import BlockRule from './blockrule.js';
import Contract from './contract.js';
import TaxProfile from './taxprofile.js';
import Cashback from './cashback.js';
import Insurance from './insurance.js';
import Inheritance from './inheritance.js';
import SharedExpense from './sharedexpense.js';
import Subscription from './subscription.js';
import ERPExport from './erpexport.js';
import Approval from './approval.js';
import CreditLimit from './creditlimit.js';

db.User = User(sequelize, Sequelize);
db.Family = Family(sequelize, Sequelize);
db.Goal = Goal(sequelize, Sequelize);
db.Currency = Currency(sequelize, Sequelize);
db.Attachment = Attachment(sequelize, Sequelize);
db.Card = Card(sequelize, Sequelize);
db.Account = Account(sequelize, Sequelize);
db.Transaction = Transaction(sequelize, Sequelize);
db.Category = Category(sequelize, Sequelize);
db.Recurring = Recurring(sequelize, Sequelize);
db.Budget = Budget(sequelize, Sequelize);
db.Settings = Settings(sequelize, Sequelize);
db.Investment = Investment(sequelize, Sequelize);
db.Asset = Asset(sequelize, Sequelize);
db.Debt = Debt(sequelize, Sequelize);
db.AuditLog = AuditLog(sequelize, Sequelize);
db.CustomReport = CustomReport(sequelize, Sequelize);
db.BlockRule = BlockRule(sequelize, Sequelize);
db.Contract = Contract(sequelize, Sequelize);
db.TaxProfile = TaxProfile(sequelize, Sequelize);
db.Cashback = Cashback(sequelize, Sequelize);
db.Insurance = Insurance(sequelize, Sequelize);
db.Inheritance = Inheritance(sequelize, Sequelize);
db.SharedExpense = SharedExpense(sequelize, Sequelize);
db.Subscription = Subscription(sequelize, Sequelize);
db.ERPExport = ERPExport(sequelize, Sequelize);
db.Approval = Approval(sequelize, Sequelize);
db.CreditLimit = CreditLimit(sequelize, Sequelize);

// Relacionamentos principais
db.Family.hasMany(db.User, { foreignKey: 'familyId' });
db.User.belongsTo(db.Family, { foreignKey: 'familyId' });

db.User.hasMany(db.Goal, { foreignKey: 'userId' });
db.Goal.belongsTo(db.User, { foreignKey: 'userId' });

db.Account.hasMany(db.Transaction, { foreignKey: 'accountId' });
db.Transaction.belongsTo(db.Account, { foreignKey: 'accountId' });

db.Category.hasMany(db.Transaction, { foreignKey: 'categoryId' });
db.Transaction.belongsTo(db.Category, { foreignKey: 'categoryId' });

db.Category.hasMany(db.Budget, { foreignKey: 'categoryId' });
db.Budget.belongsTo(db.Category, { foreignKey: 'categoryId' });

db.Transaction.hasMany(db.Attachment, { foreignKey: 'transactionId' });
db.Attachment.belongsTo(db.Transaction, { foreignKey: 'transactionId' });

export default db;
