import { prisma } from ".";

export const createRefreshToken = (tokenData) => {
  return prisma.refreshToken.create({
    data: tokenData,
  });
};

export const sendRefreshToken = (event, token) => {
  setCookie(event, "refresh_token", token, {
    httpOnly: true,
    sameSite: true,
  });
};

export const getRefreshTokenByToken = (token) => {
  return prisma.refreshToken.findFirst({ where: { token } });
};
