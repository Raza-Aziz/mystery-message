import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

// Route for code verification by user after sign-up
export async function POST(request: Request) {
  await dbConnect();

  try {
    // 1. Getting username and code from request
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username); // decoding the username (like %20 to spaces)

    // 2. Finding User
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    // 3. Checking if the verifyCode first sent === code entered by user & if code NOT expired
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        { status: 200 },
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code expired. Please register again to get new code",
        },
        { status: 400 },
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        { status: 400 },
      );
    }
  } catch (err) {
    console.error("Error in user verification", err);
    return Response.json(
      {
        success: false,
        message: "Error in user verification",
      },
      { status: 500 },
    );
  }
}
