export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '3660s',
  },
});
