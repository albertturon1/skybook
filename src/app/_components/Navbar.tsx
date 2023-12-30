import packagejson from "package.json";
const appName = packagejson.name;

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-white px-4 py-4 md:px-6">
      <h1 className="font-display font-extrabold uppercase">{appName}</h1>
      <div className="flex items-center space-x-7">
        <h1 className="font-display text-sm uppercase">cart</h1>
        <h1 className="font-display text-sm uppercase">account</h1>
      </div>
    </nav>
  );
}
