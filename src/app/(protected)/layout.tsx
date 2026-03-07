
import UserSync from "@/components/auth/UserSync"

export default function ProtectedLayout({children}:{
  children:React.ReactNode
}){
  return (
    <>
    <UserSync/>
    {children}
    </>
  )
}