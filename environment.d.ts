import "next";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      AUTH_SECRET: string;
      GITHUB_CLIENT_ID: string;
      GITHUB_CLIENT_SECRET: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      RESEND_API_KEY: string;
      RESEND_DOMAIN: string;
      RESEND_FROM_EMAIL: string;
    }
  }
}