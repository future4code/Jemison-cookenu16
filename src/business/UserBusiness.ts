import { IdGenerator } from './../services/IdGenerator';
import { InvalidPassword, InvalidEmail, InvalidName } from './../error/customError';
import { TokenGenerator } from './../services/TokenGenerator';
import { HashManager } from '../services/HashManager';
import { UserDatabase } from '../data/UserDatabase';
import { CustomError, } from '../error/customError';
import { user } from '../model/user';

const idGenerator = new IdGenerator()
const tokenGenerator = new TokenGenerator()
const userDatabase = new UserDatabase();
const hashManager = new HashManager()

export class UserBusiness {
  public createUser = async (input: user): Promise<string> => {
    try {
      const { name, email, password } = input;

      if (!name || !email || !password) {
        throw new CustomError(
          400,
          'Preencha os campos "name", "email" e "password"'
        );
      }

      if (name.length < 4) {
        throw new InvalidName();
      }

      if (!email.includes("@")) {
        throw new InvalidEmail();
      }

      if (password.length < 6) {
        throw new InvalidPassword()
      }

      const id: string = idGenerator.generateId()

      const hashPassword: string = await hashManager.generateHash(password)

      const user: user = {
        id,
        name,
        email,
        password:hashPassword,
      };
   
      await userDatabase.createUser(user);
      const token = tokenGenerator.generateToken(id)

      return token
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  }
}