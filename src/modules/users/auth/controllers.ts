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

const verifyUser: Controller = async (req, res, next) => {
    try {
        const { otp } = req.body;

        const {
            user: verifiedUser,
            accessToken,
            refreshToken,
        } = await authService.verifyUser(otp);

        console.log("User verified:", verifiedUser);
        console.log("Access token:", accessToken);
        console.log("Refresh token:", refreshToken);

        res.status(200).json({
            message: "User verified successfully.",
            data: { user: verifiedUser, tokens: { accessToken, refreshToken } },
        });
    } catch (err) {
        next(err);
    }
};

const loginUser: Controller = async (req, res, next) => {
    try {
        const { email, password, potentialRefreshToken } = req.body;

        let loginData = { email, password, potentialRefreshToken: null };

        if (potentialRefreshToken) {
            loginData.potentialRefreshToken = potentialRefreshToken;
        }

        const { user, accessToken, refreshToken } =
            await authService.loginUser(loginData);

        console.log("User logged in:", user);
        console.log("Access token:", accessToken);
        console.log("Refresh token:", refreshToken);

        res.status(200).json({
            message: "User logged in successfully.",
            data: { user, tokens: { accessToken, refreshToken } },
        });
    } catch (err) {
        next(err);
    }
};

export default { registerUser, verifyUser, loginUser };
