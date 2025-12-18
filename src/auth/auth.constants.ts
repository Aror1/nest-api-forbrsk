export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'secret-key-for-jwt-brsk', 
   signOptions: { expiresIn: '24h' },
};