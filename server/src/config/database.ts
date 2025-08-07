// Mock database connection for development
export const connectDatabase = async () => {
  console.log('Database connection established (SQLite)');
  return true;
};
