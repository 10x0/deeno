import { isHttpError } from 'https://deno.land/std@0.193.0/http/http_errors.ts';
import { Context, Next } from 'https://deno.land/x/oak@v12.6.0/mod.ts';
import { ZodError } from 'https://deno.land/x/zod@v3.21.4/ZodError.ts';

export default function errorHandler() {
  return async (ctx: Context, next: Next) => {
    try {
      await next();
    } catch (err) {
      let statusCode = 500;
      if (isHttpError(err)) {
        statusCode = err.status;
      } else {
        statusCode = 500;
      }
      let message = err.message ?? 'INTERNAL SERVER ERROR';

      if (err instanceof ZodError) {
        statusCode = 422;
        message = err.flatten().fieldErrors;
      }

      ctx.response.status = statusCode;
      ctx.response.body = { error: message };
      ctx.response.type = 'json';
    }
  };
}
