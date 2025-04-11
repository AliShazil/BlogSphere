// import { cn } from "@/lib/utils"

// export function PageContainer({ children, className }) {
//   return <div className={cn("pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto", className)}>{children}</div>
// }

export function PageContainer({ children }) {
  return <div className="container max-w-7xl mx-auto py-4 sm:py-6 md:py-8">{children}</div>
}


