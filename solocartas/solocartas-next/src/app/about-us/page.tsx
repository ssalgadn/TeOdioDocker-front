import TeamGitHub from '@/app/components/aboutPage/TeamGitHub';

export default function AboutUs() {
  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">About Us</h1>
      <p className="mb-4 text-lg leading-relaxed">
        Somos un equipo de programadores de la Universidad Católica. La idea del proyecto es ayudar a los aficionados de los juegos de cartas TCG a encontrar y disfrutar su pasión con una plataforma dedicada.
      </p>

      <TeamGitHub />
    </main>
  );
}
