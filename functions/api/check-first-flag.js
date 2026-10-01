export async function onRequestGet(context) {
    const cookieHeader = context.request.headers.get('Cookie') || '';
    
    // 解析 Cookie 字符串
    const cookies = Object.fromEntries(
        cookieHeader.split('; ').map(c => c.split('='))
    );
    
    const isFlag = cookies[context.env.FIRST_FLAG_COOKIE_NAME] === context.env.FIRST_FLAG;
    
    return new Response(JSON.stringify({ flag: isFlag }), {
        status: 200,
        headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
         },
    });
}
