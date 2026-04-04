import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import z from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({ username: usernameValidation });

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);

    const queryParam = {
      username: searchParams.get("username"),
    };

    // validate with zod
    const result = usernameQuerySchema.safeParse(queryParam);
    console.log(result);

    if (!result.success) {
      // TODO : Replace with z.treeify()
      const usernameError = result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            usernameError?.length > 0
              ? usernameError?.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 },
      );
    }
    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username: username,
      isVerified: true,
    });

    // If user already exists and is verified (basically this is checking if username is unique or not (for signup))
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 },
      );
    } else {
      return Response.json(
        {
          success: true,
          message: "Username is unique",
        },
        { status: 200 },
      );
    }
  } catch (err) {
    console.error("Error checking username", err);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 },
    );
  }
}
