// "use client";

// import UserMenu from "@/components/UserMenu";
// import { useClerk } from "@clerk/nextjs";

// const SuperAdminHeader = () => {
//   const { signOut } = useClerk();
//   const handleLogout = async () => {
//     await signOut({ redirectUrl: "/sign-in" });
//   };
//   return (
//     <header className="h-14 bg-white border-b px-6 flex items-center justify-between">
//       <div className="font-semibold">Safety Control Center</div>

//       <div className="flex items-center gap-4">
//         <UserMenu handleLogout={handleLogout} />
//       </div>
//     </header>
//   );
// };

// export default SuperAdminHeader;
