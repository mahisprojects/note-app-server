import { Request, Response } from "express";
import { userModel } from "models/user.model";
import { sign } from "jsonwebtoken";
import bcrypt from "bcryptjs";

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Invalid input!" });
    }

    const existUser = await userModel.findOne({ email });
    if (!existUser || !existUser?.comparePassword(password)) {
      return res.status(401).send({ message: "Invalid credentials!" });
    }

    const token = sign(
      { id: existUser.id, email: existUser.email },
      process.env.JWT_ENCRYPTION_KEY!,
      {
        expiresIn: "7days",
      }
    );

    return res.json({ token });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "INTERNAL_SERVER_ERROR" });
  }
};

const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (process.env.JOIN_NEW_USER === "false") {
      return res
        .status(500)
        .json({ message: "Registration is disabled for public users!" });
    }

    if (!email || !password) {
      return res.status(400).json({ message: "Invalid input!" });
    }

    const newUser = await userModel.create({
      name,
      email,
      password: bcrypt.hashSync(password, 8),
      role: "user",
    });

    const token = sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_ENCRYPTION_KEY!,
      {
        expiresIn: "7days",
      }
    );

    res.json({ message: "Thank you for joining with us.", token });
  } catch (error: any) {
    if (error?.keyPattern?.email == 1)
      return res
        .status(500)
        .json({ message: "Account already exits with provided email!" });
    res.status(500).json({ message: "Account creation failed!" });
  }
};

const currentUserHandler = async (req: Request, res: Response) => {
  const userId = req["currentUser"]!.id;
  const user = await userModel.findById(userId);

  // check if user is pro to determine whether subs is expired or not
  if (user?.pro) {
    if (!user?.proExpire || user?.proExpire?.getTime()! < Date.now()) {
      // update pro to non pro
      await userModel.findByIdAndUpdate(userId, { $set: { pro: false } });
    }
  }

  res.json({ currentUser: user });
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const query: Record<string, any> = {};
    if (req.query?.["pro"]) {
      query["pro"] = true;
    }
    const users = await userModel.find(query);
    res.send(users);
  } catch (error) {
    res.status(403).json({ message: "Something went wrong!" });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    var update = req.body;
    if (update?.notesKey) delete update.notesKey;
    const updateUser = await userModel.findByIdAndUpdate(id, { $set: update });
    const updatedUser = await userModel.findById(id);
    res.send(updatedUser);
  } catch (error) {
    res
      .status(403)
      .json({ message: "Something went wrong while updating user!" });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // delete user related chats//media

    await userModel.findByIdAndDelete(id);
    res.end();
  } catch (error) {
    res.status(403).json({ message: "Something went wrong while deleting!" });
  }
};

export async function getUserById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id, {
      email: 1,
      name: 1,
      username: 1,
      profile: 1,
      status: 1,
      role: 1,
      lastActivity: 1,
    });
    res.send(user);
  } catch (error) {
    res.status(404).send({ message: "User doesn't exists!" });
  }
}

const confirmPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;

    if (!password) return res.status(400).json({ message: "Invalid input!" });

    const authUser = await userModel.findById(req.currentUser?.id);
    if (!authUser?.comparePassword(password)) {
      return res.status(401).send({ message: "Invalid attempt!" });
    }

    return res.json({ confirmed: 1 });
  } catch (error: any) {
    return res.status(500).json({ message: "Invalid attempt!" });
  }
};

export default {
  loginUser,
  registerUser,
  // resetPassword,
  currentUserHandler,
  // admin route
  getUsers,
  updateUser,
  deleteUser,
  confirmPassword,
};
