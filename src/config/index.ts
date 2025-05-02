const config = {
  env: process.env.NEXT_PUBLIC_NODE_ENV,
  base_api_url: process.env.NEXT_PUBLIC_BASE_API_URL,
  base_url: process.env.NEXT_PUBLIC_BASE_URL,
  token: {
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    access_token_exi: Number(process.env.ACCESS_TOKEN_EXI),
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_exi: Number(process.env.REFRESH_TOKEN_EXI),
    refresh_token_cookie: String(process.env.REFRESH_TOKEN_COOKIE),
  },
};

export default config;
