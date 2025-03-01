import authService from "./services.js";
import { Controller } from "../../../types/controllers.js";

const registerUser: Controller = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const { newUser, otp } = await authService.registerUser(
            username,
            email,
            password,
        );

        console.log("New user registered:", newUser);
        console.log("OTP:", otp);

        res.status(201).json({
            message: "User registered successfully. Please verify your email.",
            data: { newUser, otp },
        });
    } catch (err) {
        next(err);
    }
};

export default { registerUser };
