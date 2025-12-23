import logger from '#config/logger.js';
import {
  createUser,
  findUserByEmail,
  verifyPassword,
  updateUser,
} from '#services/auth.service.js';
import {
  signupScheema,
  loginScheema,
  updateUserSchema,
} from '#validations/auth.validation.js';
import { jwttoken } from '#utils/jwt.js';
import { formatValidationError } from '#utils/format.js';
import { cookies } from '#utils/cookies.js';

export const signupController = async (req, res) => {
  try {
    const validationResult = signupScheema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Inregistrare esuata',
        details: formatValidationError(validationResult.error),
      });
    }

    const { first_name, last_name, email, password, role, phone } =
      validationResult.data;

    const user = await createUser({
      first_name,
      last_name,
      email,
      password,
      phone,
      role,
    });

    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
    });

    cookies.set(res, 'token', token);

    logger.info('user registered successfully:', email);
    res.status(201).json({
      message: 'user registered',
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Signup error', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const loginController = async (req, res) => {
  try {
    const validationResult = loginScheema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Logare esuata',
        details: formatValidationError(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;

    const user = await findUserByEmail(email);

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
    });

    cookies.set(res, 'token', token);

    logger.info('user logged in:', email);
    return res.status(200).json({
      message: 'logged in',
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Login error', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const logoutController = (req, res) => {
  try {
    cookies.clear(res, 'token');
    logger.info('User signed out successfully');
    return res.status(200).json({ message: 'logged out' });
  } catch (error) {
    logger.error('Logout error', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateDataController = async (req, res) => {
  try {
    const token = cookies.get(req, 'token');
    const payload = jwttoken.verify(token);

    const validation = updateUserSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validation.error),
      });
    }

    const data = { ...validation.data };

    const updated = await updateUser(payload.id, data);
    return res.status(200).json({ message: 'user updated', user: updated });
  } catch (error) {
    logger.error('Update error', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
