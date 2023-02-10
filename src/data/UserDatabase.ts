import { CustomError } from "../error/customError";
import { BaseDatabase } from "./BaseDatabse";
import { user } from "../model/user";

export class UserDatabase extends BaseDatabase {
  public findUser = async (email: string) => {
    try {
  
      const result = await UserDatabase.connection("labook_users")
        .select()
        .where({email});

      
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
        .into("labook_users");
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  }};

  // public createPost = async (post: post) => {
  //   try {
  //     await UserDatabase.connection
  //       .insert({
  //         id:post.id,
  //         photo:post.photo,
  //         description:post.description,
  //         type:post.type,
  //         author_id:post.authorId
  //       })
  //         .into("labook_posts");
  //   } catch (error: any) {
  //     throw new CustomError(400, error.message);
  //   }
  // }};
