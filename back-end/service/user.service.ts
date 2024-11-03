import userDB from '../domain/data-access/user.db'
import { User } from '../domain/model/user'
import bcrypt from 'bcrypt'


const getAllUsers = async (): Promise<User[]> => {
    return userDB.getAllUsers()
}

const getUserById = async ({ id }: { id: number }): Promise<User | null> => {
    return userDB.getUserById({ id })
}

const getUserByUsername = async ({ username }: { username: string }): Promise<User | null> => {
    return userDB.getUserByUsername({ username })
}

const createUser = async ({
    username,
    firstName,
    lastName,
    email,
    password,
}: UserInput): Promise<User> => {
    const existingUser = await userDB.getUserByUsername({ username })

    if (existingUser) {
        throw new Error(`User with username ${username} is already registered.`)
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ username, password: hashedPassword, firstName, lastName, email })

    return await userDB.createUser({ user })
};

export default {
    getAllUsers,
    getUserById,
    createUser,
    getUserByUsername
}