import { db } from "#config/database.js"
import logger from "#config/logger.js"
import { users } from "#models/user.model.js"
import bcrypt from "bcrypt"
import { eq } from "drizzle-orm"

export const hashPassword=async (password)=>{
    try {
        return await bcrypt.hash(password,10)
    } catch (error) {
        logger.error("error hashing the password",error)
        throw new Error("error hashing the password")
    }
}

export const createUser=async ({first_name,last_name,email,password,phone,role='user'})=>{
    try {
        const existingUser=await db.select().from(users).where(eq(users.email,email)).limit(1)
        
        if(existingUser.length>0)
            throw new Error('user already exists')

        const passwordHash=await hashPassword(password)

        const [newUser]=await db.insert(users)
            .values({first_name,last_name,email,password:passwordHash,phone,role})
            .returning({
                id: users.id,
                first_name: users.first_name,
                last_name: users.last_name,
                phone: users.phone,
                email: users.email,
                role: users.role,
                created_at: users.created_at
            })

        logger.info(`user ${newUser.email} created successfully`)
        return newUser
    } catch (error) {
        logger.error("error creating the user",error)
        throw error
    }
}

export const findUserByEmail = async (email) => {
    try {
        const user = await db.select().from(users).where(eq(users.email, email)).limit(1)
        return user[0]
    } catch (error) {
        logger.error('error fetching user by email', error)
        throw error
    }
}

export const verifyPassword = async (plain, hash) => {
    try {
        return await bcrypt.compare(plain, hash)
    } catch (error) {
        logger.error('error verifying password', error)
        throw error
    }
}

export const updateUser = async (id, data) => {
    try {
        const [updated] = await db.update(users)
            .set(data)
            .where(eq(users.id, id))
            .returning({
                id: users.id,
                first_name: users.first_name,
                last_name: users.last_name,
                phone: users.phone,
                email: users.email,
                role: users.role,
                created_at: users.created_at
            })

        return updated
    } catch (error) {
        logger.error('error updating user', error)
        throw error
    }
}