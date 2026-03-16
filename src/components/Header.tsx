interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="bg-white shadow-md py-6 px-8">
      <h1 className="text-3xl font-bold text-red-500">
        {title}
      </h1>
      <p className="text-gray-600 text-sm mt-1">E.2.A « ADMIN »ÉCRAN D'ACCUEIL</p>
    </header>
  );
}
