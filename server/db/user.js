import { prisma } from ".";
import bcrypt from "bcrypt";

export const createUser = (userData) => {
  const finalData = {
    ...userData,
    password: bcrypt.hashSync(userData.password, 10),
  };

  return prisma.user.create({
    data: finalData,
  });
};

export const loginUser = (userData) => {
  const password = bcrypt.compare();
};

export const getUserByUsername = (username) => {
  return prisma.user.findUnique({ where: { username } });
};

export const getUserById = (id) => {
  return prisma.user.findUnique({ where: { id } });
};
