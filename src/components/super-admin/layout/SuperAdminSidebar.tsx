// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";

// const items = [
//   { href: "/super-admin", label: "Overview" },
//   { href: "/super-dashboard/users", label: "Users" },
//   { href: "/super-admin/infra", label: "Safety Infra" },
//   { href: "/super-admin/zones", label: "Threat Zones" },
//   { href: "/super-dashboard/sos", label: "SOS Monitor" },
// ];

// const SuperAdminSidebar = () => {
//   const path = usePathname();
//   return (
//     <aside className="w-64 bg-white border-r p-4">
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold">Prohorini</h2>
//         <p className="text-xs font-bold">Super Admin Panel</p>
//       </div>

//       <nav className="space-y-2">
//         {items.map((item) => {
//           const active = path === item.href;

//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={`block px-3 py-2 rounded-lg text-sm font-medium
//               ${
//                 active
//                   ? "bg-black text-white"
//                   : "hover:bg-gray-100 text-gray-700"
//               }`}
//             >
//               {item.label}
//             </Link>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// };

// export default SuperAdminSidebar;
