type Props = {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen w-full m-0 p-0">
      {children}
    </div>
  )
}

export default DashboardLayout;