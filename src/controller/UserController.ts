import {Request, Response} from "express"
import { UserBusiness } from "../business/UserBusiness";
import { UserInputDTO, LoginInputDTO, RecipeInputDTO } from "../model/user";


export class UserController {

    public signup = async (req: Request, res: Response) => {
      try {
        const { name, email, password } = req.body;
     
        const input: UserInputDTO = {
          name,
          email,
          password,
        };
        const userBusiness = new UserBusiness()
        const token = await userBusiness.createUser(input);
  
        res.status(201).send({ message: "Usuário criado!", token });
      } catch (error: any) {
        res.status(400).send(error.message);
      }
    };  
          
    public login = async (req: Request, res: Response) => {
        try {
          const { email, password } = req.body;
    
          const input: LoginInputDTO = {
            email,
            password,
          };
          const userBusiness = new UserBusiness()
          const token = await userBusiness.login(input);
    
          res.status(200).send({ message: "Usuário logado!", token });
        } catch (error: any) {
          res.status(400).send(error.message);
        }
      };

      public async findUserDataById(req: Request, res: Response) {
        try {
          const userBusiness = new UserBusiness();
          const userData = await userBusiness.findUserDataById(req.params.id);
          return res.status(200).send(userData);
        } catch (error: any) {
          return res.status(error.statusCode || 400).send({ message: error.message });
        }
      }

      public async createRecipe(req: Request, res: Response) {
        try {
          const token = req.headers.authorization as string;
          const { title, description, MethodOfPreparation } = req.body;
    
          const post: RecipeInputDTO = {
            title,
            description,
            MethodOfPreparation,
          };
          
          const userBusiness = new UserBusiness();
          const recipe = await userBusiness.createRecipe(post);

    
          res.status(201).send({ message: "Receita criada com sucesso.", recipe });
        } catch (error: any) {
          res.status(error.statusCode || 400).send({ message: error.message });
        }
      }

    }