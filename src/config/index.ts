const Config = {
  api: {
    base: process.env.APP_BASE!,
    port: process.env.APP_PORT!,
  },
  database: {
    type: process.env.DB_TYPE! as 'postgres',
    host: process.env.DB_HOST!,
    port: process.env.DB_PORT!,
    name: process.env.DB_DATABASE!,
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
  },
  email: {
    encode: process.env.EMAIL_ENCODE!,
    region: process.env.EMAIL_REGION!,
    username: process.env.EMAIL_USERNAME!,
    password: process.env.EMAIL_PASSWORD!,
    source: process.env.EMAIL_SOURCE!,
  },
  ia: {
    token_url: process.env.IA_TOKEN_URL,
    message_url: process.env.IA_MESSAGE_URL,
    client_id: process.env.IA_CLIENT_ID,
    username : process.env.IA_USERNAME,
    password: process.env.IA_PASSWORD,
    grant_type: process.env.IA_GRANT_TYPE,
  } as Record<any, any>,
  jwt: {
    secret: process.env.JWT_SECRET!,
  },
} as const;

export { Config };
