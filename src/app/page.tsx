import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-bold text-red-600">Netflix Clone</h1>
      <p className="text-white">Ambiente Configurado com Sucesso! 🚀</p>
      
      <div className="bg-white p-2 rounded-full">
        <UserButton afterSignOutUrl="/"/>
      </div>
    </main>
  );
}