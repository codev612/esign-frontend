import { Navbar } from "@/components/layouts/global/navbar";
import { Bottombar } from "@/components/layouts/global/bottombar";

export default function SigninLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow bg-background">
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="inline-block max-w-lg text-center justify-center">
            {children}
          </div>
        </section>
      </main>
      <Bottombar />
    </>
  );
}
