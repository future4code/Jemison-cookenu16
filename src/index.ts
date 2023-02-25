import express, { Request, Response } from "express";
import { UserBusiness } from "./business/UserBusiness";
import { UserInputDTO } from "./model/user";


const userBusiness = new UserBusiness();

const userRouter = express.Router();

userRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as UserInputDTO;

    const token = await userBusiness.createUser({ name, email, password });

    res.status(201).send({ token });
  } catch (error: any) {
    res.status(error.statusCode || 400).send({ message: error.message });
  }
});

userRouter.get("/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
  
      const user = await userBusiness.findUserDataById(id);
  
      res.status(200).send({ user });
    } catch (error: any) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  });

  export default userRouter;

  