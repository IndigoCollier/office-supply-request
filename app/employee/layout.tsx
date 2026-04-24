import AppNav from '@/components/AppNav'

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AppNav />
      {children}
    </>
  )
}
