import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

 
// USER REGISTRATION
 

export const addUser = (req, res) => {

    // -------------------- Input Validation --------------------

    if (!req.body.firstName || !req.body.lastName) {
        return res.status(400).json({
            message: "First name and last name are required"
        });
    }

    // -------------------- Email Validation --------------------

    if (!req.body.email || !req.body.email.includes("@")) {
        return res.status(400).json({
            message: "Email is not valid"
        });
    }

    // -------------------- Password Validation --------------------

    if (!req.body.password) {
        return res.status(400).json({
            message: "Password is required"
        });
    }

    if (req.body.password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long"
        });
    }

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(req.body.password)) {
        return res.status(400).json({
            message:
                "Password must contain uppercase, lowercase, number, and special character"
        });
    }

    // -------------------- Phone Validation --------------------

    if (!req.body.phone) {
        return res.status(400).json({
            message: "Phone number is required"
        });
    }
    const phoneRegex = /^(0\d{9}|\+94\d{9})$/;

    if (!phoneRegex.test(req.body.phone)) {
        return res.status(400).json({
        message: "Invalid phone number. Use 0771234567 or +94771234567"
    });
}

    // -------------------- Check Duplicate Email --------------------

    User.findOne({ email: req.body.email })
        .then((existingUser) => {

            if (existingUser) {
                return res.status(400).json({
                    message: "Email already exists"
                });
            }

            // -------------------- Password Hashing --------------------

            const passwordhash = bcrypt.hashSync(
                req.body.password,
                10
            );

            // -------------------- Create User --------------------

            const user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: passwordhash,
                phone: req.body.phone
            });

            // -------------------- Save User --------------------

            user.save()
                .then(() => {
                    return res.status(201).json({
                        message: "User added successfully"
                    });
                })
                .catch((err) => {
                    return res.status(500).json({
                        message: "Failed to add user"
                    });
                });
        })
        .catch((err) => {
            return res.status(500).json({
                message: "Failed to check email"
            });
        });
};


 
// USER LOGIN
 

export const loginUser = (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then((user) => {

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
                    email: user.email,
                    firstname: user.firstName,
                    lastname: user.lastName,
                    role: user.role
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
        })
        .catch((err) => {
            return res.status(500).json({
                message: "Login failed"
            });
        });
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
};