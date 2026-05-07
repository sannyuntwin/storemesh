import { UserRole } from "@prisma/client";
import prisma from "../lib/prisma";
import { GoogleAuthInput, GoogleRegisterInput } from "../utils/validators";

export const loginWithGoogleMock = async (payload: GoogleAuthInput) => {
  const existingByGoogleId = await prisma.user.findUnique({
    where: {
      googleId: payload.googleId
    }
  });

  if (existingByGoogleId) {
    return existingByGoogleId;
  }

  const existingByEmail = await prisma.user.findUnique({
    where: {
      email: payload.email
    }
  });

  if (existingByEmail) {
    return prisma.user.update({
      where: { id: existingByEmail.id },
      data: {
        googleId: payload.googleId,
        username: payload.username
      }
    });
  }

  return prisma.user.create({
    data: {
      googleId: payload.googleId,
      email: payload.email,
      username: payload.username
    }
  });
};

export const registerGoogleBuyer = async (payload: GoogleRegisterInput) => {
  const normalizedEmail = payload.email.trim().toLowerCase();
  const normalizedGoogleId = payload.googleId ?? payload.providerAccountId;

  if (normalizedGoogleId) {
    const existingByGoogleId = await prisma.user.findUnique({
      where: {
        googleId: normalizedGoogleId
      }
    });

    if (existingByGoogleId) {
      return prisma.user.update({
        where: { id: existingByGoogleId.id },
        data: {
          email: normalizedEmail,
          username: payload.username,
          address: payload.address ?? existingByGoogleId.address
        }
      });
    }
  }

  const existingByEmail = await prisma.user.findUnique({
    where: {
      email: normalizedEmail
    }
  });

  if (existingByEmail) {
    return prisma.user.update({
      where: { id: existingByEmail.id },
      data: {
        googleId: normalizedGoogleId ?? existingByEmail.googleId,
        username: payload.username,
        address: payload.address ?? existingByEmail.address
      }
    });
  }

  return prisma.user.create({
    data: {
      googleId: normalizedGoogleId,
      email: normalizedEmail,
      username: payload.username,
      address: payload.address,
      role: UserRole.BUYER
    }
  });
};
