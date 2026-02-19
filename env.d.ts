// env.d.ts
namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    GEMINI_API_KEY: string;
    GROQ_API_KEY: string;
    NODE_ENV: 'development' | 'production';
  }
}
