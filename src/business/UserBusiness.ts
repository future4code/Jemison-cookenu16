import { UserInputDTO, LoginInputDTO, RecipeInputDTO,  } from "./../model/user";
import { IdGenerator } from "./../services/IdGenerator";
import {
  InvalidPassword,
  InvalidEmail,
  InvalidName,
  UserNotFound,
  InvalidLenght,
} from "./../error/customError";
import { TokenGenerator } from "./../services/TokenGenerator";
import { HashManager } from "../services/HashManager";
import { UserDatabase } from "../data/UserDatabase";
import { CustomError } from "../error/customError";
import { user } from "../model/user";



const idGenerator = new IdGenerator();
const tokenGenerator = new TokenGenerator();
const userDatabase = new UserDatabase();
const hashManager = new HashManager();

export class UserBusiness {
  public createUser = async (input: UserInputDTO): Promise<string> => {
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
        throw new InvalidPassword();
      }

      const id: string = idGenerator.generateId();

      const hashPassword: string = await hashManager.generateHash(password);

      const user: user = {
        id,
        name,
        email,
        password: hashPassword,
      };

      await userDatabase.createUser(user);
      const token = tokenGenerator.generateToken(id);

      return token;
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

  public login = async (input: LoginInputDTO): Promise<string> => {
    try {
      const { email, password } = input;

      if (!email || !password) {
        throw new CustomError(400, 'Preencha os campos "email" e "password"');
      }

      if (!email.includes("@")) {
        throw new InvalidEmail();
      }

      const user = await userDatabase.findUser(email);

      if (!user) {
        throw new UserNotFound();
      }

      const compareResult: boolean = await hashManager.compareHash(
        password,
        user.password
      );

      if (!compareResult) {
        throw new InvalidPassword();
      }

      const token = tokenGenerator.generateToken(user.id);

      return token;
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

  public createRecipe = async (input: RecipeInputDTO): Promise<void> => {
    try {
      const { title, description, MethodOfPreparation } = input;

      if (!title || !description || !MethodOfPreparation) {
        throw new CustomError(
          400,
          'Preencha os campos "Titule", "Descrição" e "Modo de Preparo"'
        );
      }

      if (title.length < 4) {
        throw new InvalidLenght();
      }

      if (description.length < 4) {
        throw new InvalidLenght();
      }

      if (MethodOfPreparation.length < 4) {
        throw new InvalidLenght();
      }

      await userDatabase.createRecipe(input);
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

  public async findUserDataById(id: string): Promise<user> {
    try {
      const userData = await userDatabase.selectUserById(id);
      if (!userData) {
        throw new CustomError(404, "Usuário não encontrado");
      }
      return userData;
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  }
}

