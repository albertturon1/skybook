import packagejson from "package.json";
import { getServerAuthSession } from "~/server/auth";
import { ManageSessionNavbar } from "./ManageSessionNavbar";
import Link from "next/link";
const appName = packagejson.name;

export async function Navbar() {
  const session = await getServerAuthSession();

  return (
    <nav className={`sticky top-0 z-50 bg-slate-50`}>
      <div className="container mx-auto flex h-[4.5rem] w-full items-center justify-between">
        <Link href={"/"} className="font-display font-extrabold uppercase">
          {appName}
        </Link>
        <div className="flex items-center space-x-7">
          <Link href={"/cart"} className="font-display text-sm uppercase">
            cart
          </Link>
          <ManageSessionNavbar session={session} />
        </div>
      </div>
    </nav>
  );
}
