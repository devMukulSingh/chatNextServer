import * as jose from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const jwtSign = async () => {
    const alg = 'HS256'
    const token = (
        await new jose.SignJWT().setProtectedHeader({ alg }).sign(secret)
    ).toString()
    return token
}


export const isAuth = async (token: string) => {
    const isAuth = await jose.jwtVerify(token, secret);
    return isAuth;
}