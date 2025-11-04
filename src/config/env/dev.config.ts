import { registerAs } from '@nestjs/config';

export default () => ({
  port: process.env.PORT || 5000,
  db: {
    url: process.env.DB_URL,
  },
  tokenAccess: {},
  cloud: {},

  access: {
    jwt_secret: process.env.JWT_SECRET,
  },

 
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,  
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
});

 
export const googleAuth = registerAs('googleAuth', () => ({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,  
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}));