import AppNav from '@/components/AppNav'

export default function ManagerLayout({
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
