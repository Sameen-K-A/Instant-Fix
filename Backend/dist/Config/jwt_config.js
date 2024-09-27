"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = exports.createToken = exports.adminVerifyToken = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const httpStatusCode_1 = __importDefault(require("../Enums/httpStatusCode"));
dotenv_1.default.config();
const secret_key = process.env.jwt_secret;
const accessTokenTime = process.env.Access_Token_Expirey_Time;
const refreshTokenTime = process.env.Refresh_Token_Expirey_Time;
const userAccessTokenName = process.env.userAccessTokenName;
const userRefreshTokenName = process.env.userRefreshTokenName;
const adminAccessTokenName = process.env.adminAccessTokenName;
const adminRefreshTokenName = process.env.adminRefreshTokenName;
const userRole = process.env.userRole;
const adminRole = process.env.adminRole;
const createToken = (user_id, role) => {
    return jsonwebtoken_1.default.sign({ user_id, role }, secret_key, { expiresIn: accessTokenTime });
};
exports.createToken = createToken;
const createRefreshToken = (user_id, role) => {
    return jsonwebtoken_1.default.sign({ user_id, role }, secret_key, { expiresIn: refreshTokenTime });
};
exports.createRefreshToken = createRefreshToken;
const jwtverifyToken = (accessTokenName, refreshTokenName, expectedRole) => {
    return async (req, res, next) => {
        try {
            const accessToken = req.cookies[accessTokenName];
            if (accessToken) {
                jsonwebtoken_1.default.verify(accessToken, secret_key, async (err, decoded) => {
                    if (err) {
                        await handleRefreshToken(req, res, next, accessTokenName, refreshTokenName, expectedRole);
                    }
                    else {
                        const { user_id, role } = decoded;
                        if (role !== expectedRole) {
                            res.status(httpStatusCode_1.default.Unauthorized).json({ message: 'Access denied. Invalid role.' });
                        }
                        else {
                            req.user_id = user_id;
                            next();
                        }
                        ;
                    }
                    ;
                });
            }
            else {
                await handleRefreshToken(req, res, next, accessTokenName, refreshTokenName, expectedRole);
            }
            ;
        }
        catch (error) {
            res.status(httpStatusCode_1.default.Unauthorized).json({ message: 'Access denied. Access token not valid.' });
        }
        ;
    };
};
const handleRefreshToken = async (req, res, next, accessTokenName, refreshTokenName, expectedRole) => {
    const refreshToken = req.cookies[refreshTokenName];
    if (refreshToken) {
        jsonwebtoken_1.default.verify(refreshToken, secret_key, (err, decoded) => {
            if (err) {
                return res.status(httpStatusCode_1.default.Unauthorized).json({ message: 'Access denied. Refresh token not valid.' });
            }
            else {
                const { user_id, role } = decoded;
                if (!user_id || role !== expectedRole) {
                    return res.status(httpStatusCode_1.default.Unauthorized).json({ message: 'Access denied. Token payload invalid.' });
                }
                else {
                    const newAccessToken = createToken(user_id, role);
                    res.cookie(accessTokenName, newAccessToken, {
                        httpOnly: true,
                        sameSite: 'none',
                        secure: true,
                        maxAge: 15 * 60 * 1000,
                    });
                    req.user_id = user_id;
                    next();
                }
                ;
            }
            ;
        });
    }
    else {
        return res.status(httpStatusCode_1.default.Unauthorized).json({ message: 'Access denied. Refresh token not provided.' });
    }
    ;
};
exports.verifyToken = jwtverifyToken(userAccessTokenName, userRefreshTokenName, userRole);
exports.adminVerifyToken = jwtverifyToken(adminAccessTokenName, adminRefreshTokenName, adminRole);
