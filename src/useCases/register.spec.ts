import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register User Case', () => {
    it('Deve ser possivel a senha do usuário ser um hash', async () => {  
        const usersRepository = new InMemoryUsersRepository()      
        const registerUseCase = new RegisterUseCase(usersRepository)

        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })

        const isPasswordCorrectlyHashed = await compare('123456', user.password_hash)

        expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('Não deve ser possivel cadastrar com o mesmo e-mail.', async () => {  
        const usersRepository = new InMemoryUsersRepository()      
        const registerUseCase = new RegisterUseCase(usersRepository)

        const email = 'johndoe@example.com'

        await registerUseCase.execute({
            name: 'John Doe',
            email,
            password: '123456'
        })

        expect(() => 
            registerUseCase.execute({
                name: 'John Doe',
                email,
                password: '123456'
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })

    it('Deve ser possivel cadastrar usuário', async () => {  
        const usersRepository = new InMemoryUsersRepository()      
        const registerUseCase = new RegisterUseCase(usersRepository)

        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })

        expect(user?.id).toEqual(expect.any(String))
    })

})