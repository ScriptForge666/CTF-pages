import { SignJWT } from 'jose';

export async function onRequestPost(context) {
  try {

    // 1. 从环境变量中读取密钥（强烈建议在 Cloudflare 后台配置加密环境变量）
    // 生产环境中请通过 `npx wrangler pages secret put JWT_SECRET` 设置
    const secretKeyString = context.env.JWT_SECRET;
    if (!secretKeyString) {
      throw new Error('JWT_SECRET environment variable is not set');
    }

    // 将密钥字符串转为 Uint8Array
    const secretKey = new TextEncoder().encode(secretKeyString);

    // 2. 创建并签发 JWT
    const jwt = await new SignJWT(
        {
            e: context.env.e,
            p: context.env.p,
            q: context.env.q
        })
      .setProtectedHeader({ 
          alg: 'HS256', 
          typ: 'JWT', 
          theFirstFlag: context.env.FIRST_FLAG,
          kid: 'my-custom-key-id' 
      }) 
      .setIssuedAt()
      .setIssuer('urn:example:issuer')
      .setAudience('urn:example:audience')
      .setExpirationTime('2h')
      .sign(secretKey);
    // 3. 返回生成的 JWT 给客户端
    return new Response(JSON.stringify({ token: jwt }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}