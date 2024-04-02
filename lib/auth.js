import {compare, hash} from 'bcryptjs'

export async function hashPassword(password) {
    const hashedpass = await hash(password,12)
    return hashedpass
}


export async function verifyPassword(password, hashedpassword){
    const isValid = await compare(password, hashedpassword)
    return isValid
}