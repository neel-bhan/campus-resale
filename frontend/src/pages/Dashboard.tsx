interface DashboardProps {
  user: any;
}

export function Dashboard({ user }: DashboardProps) {
  return (
    <div className="container mx-auto px-6 py-20">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-400 text-lg">
          You're now logged into CampusResale
        </p>
      </div>
    </div>
  );
}
