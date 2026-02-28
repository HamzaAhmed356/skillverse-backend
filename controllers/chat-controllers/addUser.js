//user controller

import userSchema from "../../Models/userschema.js";
import User from "../../Models/userschema.js";

export const addUser = async (req, res) => {
  console.log(req.body);
  try {
    let exsist = await userSchema.findOne({ sub: req.body.sub });
    if (exsist) {
      res.status(200).json({ msg: "user already exsist" });
      console.log("user already exsist");
      return;
    }
    const newUser = new userSchema(req.body);
    await newUser.save();
    res.status(200).json({ msg: "User added" });
    console.log("user added");
  } catch (error) {
    console.log(error);
  }
};
export const getUsers = async (req, res) => {
  try {
    const user = await User.find({});
    console.log(user);

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};
