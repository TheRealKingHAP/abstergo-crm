import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import {MongoDBAdapter} from '@next-auth/mongodb-adapter'
import clientPromise from '../../../lib/mongodb'
export default NextAuth({
    //Añadimos el adaptador para que NextAuth funcione con nuestro cliente de MONGODb
    adapter: MongoDBAdapter(clientPromise),
    callbacks: {
    async session({ session, token, user }) {
        return session
    },
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            type: 'credentials',
            credentials: {
                username: {label: 'Usuario', type: 'text', placeholder: 'abstergo1'},
                password: {label: 'Contraseña', type:'password'}
            },
            async authorize(credentials, req){
                const user = {id: '1', username: 'Abstergo', email: 'example@abstergo.com'}
                if(credentials?.username !== user.username || credentials?.password != 'haloreach117'){
                    throw new Error('invalid credentials');
                }
                return user
            }
        }),
        
    ],
    pages: {
        signIn: '/signin'
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {strategy: "jwt"}
    
})