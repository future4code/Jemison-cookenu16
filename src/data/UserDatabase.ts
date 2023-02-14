import { RecipeInputDTO } from "./../model/user";
import { CustomError } from "../error/customError";
import { BaseDatabase } from "./BaseDatabse";
import { user } from "../model/user";

export class UserDatabase extends BaseDatabase {
  public findUser = async (email: string) => {
    try {
      const result = await UserDatabase.connection("cookenu_users")
        .select()
        .where({ email });

      return result[0];
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

  public createUser = async (user: user) => {
    try {
      await UserDatabase.connection
        .insert({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
        })
        .into("ookenu_users");
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

  public createRecipe = async (post: RecipeInputDTO) => {
    try {
      await UserDatabase.connection
        .insert({
          recipe_name: post.title,
          description: post.description,
          preparation: post.MethodOfPreparation,
        })
        .into("cookenu_recipe");
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };
}
