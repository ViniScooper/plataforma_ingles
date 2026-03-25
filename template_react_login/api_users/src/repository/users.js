import { prisma } from '../database/index.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret123';
const JWT_EXPIRE = '7d';

export const signUpDB = async (email, password, name, age, username, role = 'student') => {
  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        username,
        age,
        role
      }
    });
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const signInDB = async (email, username, password) => {
  const whereCondition = email ? { email } : { username };

  try {
    const user = await prisma.user.findUnique({
      where: whereCondition
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role
      }
    };
  } catch (error) {
    console.error('Error signing in user:', error);
    throw error;
  }
};





export const userUpdateDB = async (id, email, password, name, age, username) => {
  try {
    const user = await prisma.user.update({
      where: { id: id },
      data: {
        email,
        password,
        name,
        age,
        username
      }
    });

    return user; // Retorna o usuário atualizado
  } catch (error) {
    console.error("Error updating user:", error);
    throw error; // Repassa o erro para o controller
  } finally {
    await prisma.$disconnect();
  }
};










//rota de delete

export const userDeleteDb = async (id) => {
    try {
        const user = await prisma.user.delete({
            where: { id: id },
           
        });
        return user; // Return the updated user object
    } catch (error) {
        console.error("Error delete user:", error);
        throw error; // Re-throw the error for handling in the controller
    } finally {
        await prisma.$disconnect();
    }
}









export const getUserByIdDB = async (id) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: id }
        });

        if (!user) {
            throw new Error("User not found");
        }

        return user; // Return the found user object
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw error; // Re-throw the error for handling in the controller
    } finally {
        await prisma.$disconnect();
    }
}






export const checkUserExists = async (email, username) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username }
                ]
            }
        });
        return user !== null; // Return true if user exists, false otherwise
    } catch (error) {
        console.error("Error checking user existence:", error);
        throw error; // Re-throw the error for handling in the controller
    } finally {
        await prisma.$disconnect();
    }
}