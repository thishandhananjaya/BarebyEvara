import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

 
// USER REGISTRATION
 

export const addUser = async (req, res) => {

    // -------------------- Input Validation --------------------
    const firstName = req.body.firstName?.trim();
    const lastName = req.body.lastName?.trim();

    if (!firstName || !lastName) {
        return res.status(400).json({
            message: "First name and last name are required"
        });
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
        return res.status(400).json({
            message: "First name and last name must contain only letters"
        });
    }

    // -------------------- Email Validation --------------------
    const email = req.body.email?.trim().toLowerCase();
    if (!email) {
        return res.status(400).json({
            message: "Email is not valid"
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({
            message: "Email is not valid"
        });
    }
    
    

    // -------------------- Password Validation --------------------
    const password = req.body.password;

    if (!password) {
        return res.status(400).json({
            message: "Password is required"
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long"
        });
    }

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message:
                "Password must contain uppercase, lowercase, number, and special character"
        });
    }

    // -------------------- Phone Validation --------------------
     const phone = req.body.phone?.trim();
    if (!phone) {
        return res.status(400).json({
            message: "Phone number is required"
        });
    }
   
    const phoneRegex = /^(0\d{9}|\+94\d{9})$/;

    if (!phoneRegex.test(phone)) {
        return res.status(400).json({
        message: "Invalid phone number. Use 0771234567 or +94771234567"
    });
}

    // -------------------- Check Duplicate Email --------------------
try{
    const existingUser = await User.findOne({ email: email });
       

            if (existingUser) {
                return res.status(400).json({
                    message: "Email already exists"
                });
            }

            // -------------------- Password Hashing --------------------

            const passwordHash = bcrypt.hashSync(password, 10);

            // -------------------- Create User --------------------

            const user = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: passwordHash,
                phone: phone
            });

            // -------------------- Save User --------------------

            
            await user.save();
                
            return res.status(201).json({
                message: "User added successfully"
                    });

            } catch(err) {
 //------------------------------------------------duplicate email check-------------------------------------------------------------------
                if(err.code === 11000)
                    {return res.status(400).json({
                    message:"Email already exists"
                      
                });
                    }
            
                return res.status(500).json({
                    message: "Failed to add user"
                    });
            }};
        
             



 
// USER LOGIN---------------------------------------------------------------------
 

export const loginUser = async (req, res) => {

    const email = req.body.email?.trim().toLowerCase();

    const password = req.body.password;

 //Login input validation------------------------------------------------------------   
    if(!email){
        return res.status(400).json({message: "Email is required"});

    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({message: "Email is not valid"});
    }
    if(!password){
        return res.status(400).json({message: "Password is required"});
    }   
try{
    
    const user =await User.findOne({ email: email })
       

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            if (user.isBlocked) {
                return res.status(403).json({
                    message: "User is blocked"
                });
            }

            const isPasswordValid = bcrypt.compareSync(
                password,
                user.password
            );

            if (!isPasswordValid) {
                return res.status(401).json({
                    message: "Invalid password"
                });
            }

            // -------------------- Generate JWT --------------------

            const token = jwt.sign(
                {
                    userId: user._id
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "2h"
                }
            );

            return res.status(200).json({
                message: "Login successful",
                token: token
            });
        }
        catch(err) {
            console.error(err);
            return res.status(500).json({
                message: "Login failed"
            });
        };
};


 
// GET ALL USERS - ADMIN
 

export const getUsers = (req, res) => {

    User.find({}, "-password")
        .then((users) => {

            return res.status(200).json(users);

        })
        .catch((err) => {

            return res.status(500).json({
                message: "Failed to fetch users"
            });

        });
};


 
// GET USER BY ID - ADMIN
 

export const getUserById = (req, res) => {

    const id = req.params.id;

    User.findById(id, "-password")
        .then((user) => {

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            return res.status(200).json(user);

        })
        .catch((err) => {

            return res.status(500).json({
                message: "Failed to fetch user"
            });

        });
};



// UPDATE USER BY ID - ADMIN


export const updateUser = (req, res) => {

    const id = req.params.id;

    const updateData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        isBlocked: req.body.isBlocked
    };

    User.findOneAndUpdate(
        { _id: id },
        updateData,
        { new: true },
        "-password"
    )
        .then((updatedUser) => {

            if (!updatedUser) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            return res.status(200).json({
                message: "User updated successfully",
                user: updatedUser
            });

        })
        .catch((err) => {

            return res.status(500).json({
                message: "Failed to update user"
            });

        });
};



// DELETE USER BY ID - ADMIN


export const deleteUser = (req, res) => {

    const id = req.params.id;

    User.findByIdAndDelete(id)
        .then((deletedUser) => {

            if (!deletedUser) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            return res.status(200).json({
                message: "User deleted successfully"
            });

        })
        .catch((err) => {

            return res.status(500).json({
                message: "Failed to delete user"
            });

        });
}