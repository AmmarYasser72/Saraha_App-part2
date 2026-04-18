import * as authService from "./auth.service.js";

export const signup = async (req, res, next) => {
  try {
    const result = await authService.signup(req);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const result = await authService.verifyOtp(req);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req);
    res.json(result);
  } catch (err) {
    next(err);
  }
};