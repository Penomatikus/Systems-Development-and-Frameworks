import jwt from "jsonwebtoken"

export function createJwt(secret) {
    try {
        return jwt.sign({
            //exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: 'foobar'
          }, secret);
    } catch (error) {
        console.error("Error creating JWT:", error)
        return ""
    }
}

export function decodeJwt(token, secret) {
    try{
        jwt.verify(token, secret);
        return true;
    }        
    catch(any){

    }
    return false;
}