import packagejson from "package.json";
import { getServerAuthSession } from "~/server/auth";
import { ManageSessionNavbar } from "./ManageSessionNavbar";
import Link from "next/link";
import { getNavbarHeight } from "~/app/layout";
const appName = packagejson.name;

export async function Navbar() {
  const session = await getServerAuthSession();

  return (
    <nav className={`container sticky top-0 z-50 flex items-center justify-between bg-white ${getNavbarHeight()}`}>
      <h1 className="font-display font-extrabold uppercase">{appName}</h1>
      <div className="flex items-center space-x-7">
        <Link href={"/cart"} className="font-display text-sm uppercase">
          cart
        </Link>
        <ManageSessionNavbar session={session} />
      </div>
    </nav>
  );
}
