module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DB_URL || 'postgresql://postgres@localhost/legendum',
    JWT_SECRET: process.env.JWT_SECRET || '123NotAParticularyGreatSecret!!!',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '1h',
  }