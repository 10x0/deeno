import {
  Application,
  Context,
  Router,
} from 'https://deno.land/x/oak@v12.6.0/mod.ts';
import { handleWebSockets } from './socket.ts';
import {
  CreateUser,
  FindOrCreateConversation,
  FindUser,
  GetAllConversation,
} from './mongo.ts';
import { LoginSchema, RegisterSchema } from './schema.ts';
import errorHandler from './error.ts';

const router = new Router();

router.post('/register', async (ctx: Context) => {
  let body = await ctx.request.body().value;
  body = await RegisterSchema.parseAsync(body);
  ctx.response.body = await CreateUser(body);
});

router.post('/login', async (ctx: Context) => {
  let body = await ctx.request.body().value;
  body = await LoginSchema.parseAsync(body);
  ctx.response.body = await FindUser(body);
});

router.get('/getConversation', async (ctx: Context) => {
  ctx.response.body = await GetAllConversation();
});

router.post('/startConversation', async (ctx: Context) => {
  const body = await ctx.request.body().value;
  ctx.response.body = await FindOrCreateConversation(body);
});

router.get('/ws', (ctx: Context) => {
  if (ctx.isUpgradable) {
    ctx.upgrade();
    handleWebSockets(ctx.socket!);
  }
});

const app = new Application();

app.use(errorHandler());
app.use(router.routes());
app.use(router.allowedMethods());
app.use((ctx) => {
  ctx.throw(500);
});

app.addEventListener('listen', ({ secure, hostname, port }) => {
  const protocol = secure ? 'https://' : 'http://';
  const url = `${protocol}${hostname ?? 'localhost'}:${port}`;
  console.log(`🚀 ${url}`);
});

await app.listen({ port: 8000 });
