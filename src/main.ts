import { PrismaClient } from '@prisma/client';
import { enhance } from '@zenstackhq/runtime';

const prisma = new PrismaClient();


async function main() {
  await prisma.user.deleteMany({});

  await prisma.user.createMany({data: [
    {id: 1, email: "1@web.com"},
    {id: 2, email: "2@web.com"},
    {id: 3, email: "3@web.com"},
    {id: 4, email: "4@web.com"},
    {id: 5, email: "5@web.com"},
  ]});

  console.log("-- Calling bare prisma")
  console.log("---- show me all users that have `web.com` in their email:")
  console.log(await prisma.user.findMany({ where: { email: { contains: "web.com" } } }))

  //
  //

  console.log("\n-- Calling enhanced prisma as user: 1@web.com")

  const db = enhance(prisma, { user: {id: 1} });

  console.log("---- count all users that have `web.com` in their email:")
  console.log(await db.user.count({ where: { email: { contains: "web.com" } } }))
  console.log("---- show me all users that have `web.com` in their email:")
  console.log(await db.user.findMany({ where: { email: { contains: "web.com" } } }))


  console.log("---- expect the following to NOT ignore the fact that user:1 has no access to others' emails ----")
  console.log("---- show me all users that have `web.com` in their email order desc by email:")
  console.log(await db.user.findMany({ where: { email: { contains: "web.com" } }, orderBy: {email: 'desc'}}))
  console.log("---- show me all users that have `web.com` in their email order asc by email:")
  console.log(await db.user.findMany({ where: { email: { contains: "web.com" } }, orderBy: {email: 'asc'}}))

}

main().then(()=>{
  console.log("OK")
}).catch((e)=>{
  console.error(e)
})