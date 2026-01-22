import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL,
  }).$extends(withAccelerate());
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      accelerateUrl: process.env.DATABASE_URL,
    }).$extends(withAccelerate());
  }
  prisma = global.prisma;
}

export default prisma;
