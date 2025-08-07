// Mock Redis connection for development
export const connectRedis = async () => {
  console.log('Redis connection established (mock)');
  return true;
};
