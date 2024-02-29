import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

interface IRegisterUseCase {
    name: string
    email: string
    password: string
}

export async function registerUseCase({
    name,
    email,
    password
}: IRegisterUseCase) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (userWithSameEmail){
        throw new Error('E-mail já cadastrado')
    }

    await prisma.user.create({
        data: {
            name,
            email,
            password_hash
        }
    })
}