// import bcrypt from "bcryptjs";
// import User from "../model/usermodel.js";
// import jwt from "jsonwebtoken";
// import { redis } from "../lib/redis.js";

//generating tokens and setting cookies
// const generateToken = (userId) => {
//   const accessToken = jwt.sign({ userId }, process.env.SECRET_KEY1, {
//     expiresIn: "15m",
//   });
//   const refreshToken = jwt.sign({ userId }, process.env.SECRET_KEY2, {
//     expiresIn: "7d",
//   });
//   return { accessToken, refreshToken };
// };
// const setCookies = (res, accessToken, refreshToken) => {
//   res.cookie("accesstoken", accessToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     maxAge: 15 * 60 * 1000,
//     sameSite: "none",
//     path: "/"
//   }),
//     res.cookie("refreshtoken", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//       sameSite: "none",
//       path: '/'
//     });
// };
//we can store token in redis here

// const storeRefreshToken = async(userId, refreshToken)=>{
//   await redis.set(
//     `refreshToken:${userId}`,
//     refreshToken,
//     "ex",
//     7 * 24 * 60 * 60 * 1000
//   )
// }

//for registering user
// export const registerUser = async (req, res) => {
//   try {
//     const detail = req.body;
// const { userName, email, password, confirmPassword } = detail;
// //check if user has entered password, confirmPassword or not
// if (!password || !confirmPassword) {
//   return res.status(400).json({
//     message: "Passwords are required",
//   });
// }
// //check if password and confirmPassword match or not
// if (password !== confirmPassword) {
//   return res.status(400).json({
//     message: "Passwords do not match",
//   });
// }
// //check if email or username already exists or not
// const emailExist = await User.findOne({ email: email });
// // const userNameExist = await User.findOne({userName: userName})
// if (emailExist) {
//   return res.status(400).json({
//     message: "User already exists",
//   });
// }
//     //hash the password before storing in the database
//     const hashpassword = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       userName,
//       email,
//       password: hashpassword,
//     });
//     //generate token**
//     const { accessToken, refreshToken } = generateToken(user._id);
//     await storeRefreshToken(user._id, refreshToken)
//     setCookies(res, accessToken, refreshToken);
//     // store token
//     res.status(200).json({
//       message: "User registered successfully",
//       user,
//       accessToken,
//       refreshToken,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error while registering user",
//       error,
//     });
//   }
// };
//for login purpose
// export const loginUser = async (req, res) => {
//   try {
//     const detail = req.body;
//     const { email, password } = detail;
//     //check if user exists or not
//     const user = await User.findOne({ email: email });
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }
//     //check if email and password are provided or not
//     if (!email || !password) {
//       return res.status(400).json({
//         message: "Email and password are required",
//       });
//     }
//     //compare password with hashed password in the database
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(401).json({
    //     message: "Invalid password",
    //   });
    // }
//     if (isMatch) {
//       // token working here**
//       const { accessToken, refreshToken } = generateToken(user._id);
//       await storeRefreshToken(user._id, refreshToken)
//       setCookies(res, accessToken, refreshToken);

//       res.status(200).json({
//         message: "User logged in successfully",
//         user
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: "Error while logging in user",
//       error,
//     });
//   }
// };

//to get all users
// export const getUsers = async (req, res) => {
//   try {
//     const user = await User.find();
//     res.status(200).json({
//       message: "Users fetched successfully",
//       user,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error while fetching users",
//       error,
//     });
//   }
// };

//to get user by id
// export const getUserById = async (req, res) => {
//   try {
//     //get user id from client side
//     const userId = req.params.id;
//     if (!userId) {
//       return res.status(400).json({
//         message: "SERVER ERROR",
//       });
//     }
//     //find user by id in the database
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }
//     res.status(200).json({
//       message: "User fetched successfully",
//       user,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error while fetching user",
//       error,
//     });
//   }
// };

//to delete user
// export const deleteUser = async (req, res) => {
//   try {
//     //get user id from client side
//     const userId = req.params.id;
//     if (!userId) {
//       return res.status(400).json({
//         message: "SERVER ERROR",
//       });
//     }
//     //find user by id in the database
//     const user = await User.findByIdAndDelete(userId);
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }
//     res.status(200).json({
//       message: "User deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error while deleting user",
//       error,
//     });
//   }
// };

//to logout user
// export const logout = async (req, res) => {
//   try {
//     // Check if the refreshToken exists in the cookies
//     const refreshToken = req.cookies.refreshtoken || req.cookies.refreshToken;
//     console.log(refreshToken)

//     if (!refreshToken) {
//       return res.status(400).json({ message: "No refresh token provided" });
//     }

//     // Decode the refreshToken
//     const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY2);

//     if (!decoded) {
//       return res.status(400).json({ message: "Invalid refresh token" });
//     }

//     // Delete refreshToken from Redis
//     await redis.del(`refreshToken:${decoded.userId}`);

//     // Clear cookies for access and refresh tokens
//     res.clearCookie("accessToken");
//     res.clearCookie("refreshToken",{
//       httpOnly: true,
//     sameSite: "none",
//     secure: process.env.NODE_ENV === "production",
//     path: '/',
//     });

//     return res.json({ message: "Logged out successfully" });
//   } catch (error) {
//     console.error("Error in logout controller:", error.message);
//     return res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

//this will refresh the refresh token
// export const refreshToken = async (req, res) => {
//   try {
//     const refreshToken = req.cookies.refreshToken;
//     if (!refreshToken) {
//       return res.status(401).json({ message: "No refresh token provided" });
//     }

//     const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY2);
//     const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

//     if (storedToken !== refreshToken) {
//       return res.status(401).json({ message: "Invalid refresh token" });
//     }

//     const accessToken = jwt.sign(
//       { userId: decoded.userId },
//       process.env.SECRET_KEY1,
//       { expiresIn: "15m" }
//     );

//     res.cookie("accessToken", accessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "none",
//       maxAge: 15 * 60 * 1000,
//     });

//     res.json({ message: "Token refreshed successfully" });
//   } catch (error) {
//     console.log("Error in refreshToken controller", error.message);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// export const getProfile = async (req, res) => {
//   try {
//     // Retrieve userId from query, body, or headers
//     const userId = req.query.userId || req.body.userId ||"6745b4949753df5ab92382a9";

//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required" });
//     }

//     const user = await User.findById(userId).select("-password");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({ user });
//   } catch (error) {
//     console.error("Error in getProfile:", error.message);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

//starting previous code...................................................................................
//.
//.
//.
import { redis } from "../lib/redis.js";
import User from "../model/usermodel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.SECRET_KEY1, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.SECRET_KEY2, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60 * 1000
  ); // 7days
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // prevent XSS attacks, cross site scripting attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // prevent XSS attacks, cross site scripting attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const signup = async (req, res) => {
  const { userName, email, password, confirmPassword } = req.body;

  try {
    if (!password || !confirmPassword) {
      return res.status(400).json({
        message: "Passwords are required",
      });
    }
    //check if password and confirmPassword match or not
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }
    //check if email or username already exists or not
    const emailExist = await User.findOne({ email: email });
    // const userNameExist = await User.findOne({userName: userName})
    if (emailExist) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const user = await User.create({ userName, email, password });
    console.log(user);
    // authenticate
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      _id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    //
    const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(401).json({
    //     message: "Invalid password",
    //   });
    // }
    //
    if (isMatch) {
      const { accessToken, refreshToken } = generateTokens(user._id);
      await storeRefreshToken(user._id, refreshToken);
      setCookies(res, accessToken, refreshToken);

      res.json({
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: error.message });
  }
};
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.SECRET_KEY2
      );
      await redis.del(`refresh_token:${decoded.userId}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// this will refresh the access token
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY2);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.SECRET_KEY1,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("Error in refreshToken controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
