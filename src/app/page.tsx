import Image from "next/image";
import prisma from "@/lib/prisma";
export default async function Home() {
  const res = await prisma?.user.findMany({
    select: {
      email: true,
      id: true,
    },
  });
  return <div>
    <form action="">
      <input type="text"  />
    </form>
  </div>;
}
