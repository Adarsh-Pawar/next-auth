import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectToDb } from '../../../lib/db'
import { verifyPassword } from '../../../lib/auth'

export const authOptions = 
    {
        providers:[
            CredentialsProvider({
                async authorize(credentials){
                    const client = await connectToDb()
                    const user = await client.db().collection('users').findOne({email: credentials.email})
                    
                    if(!user){
                        client.close()
                    throw new Error('No user found')
                }
                
                const isValidPassword = await verifyPassword(credentials.password, user.password)
                
                if(!isValidPassword){
                    client.close()
                    throw new Error('Wrong Password')
                }
                
                client.close()
                const result = {
                    email: user.email
                }
                return result
            }
        })
    ],
    session:{
        strategy: 'jwt',
    },
    pages:{
        signIn:'/auth',
    },
    secret:process.env.NEXTAUTH_SECRET,
    
}


export default NextAuth(authOptions)