'use client';
import { motion } from 'framer-motion';
import TeamGitHub from '@/app/components/aboutPage/TeamGithub';

export default function AboutUs() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-8 max-w-4xl mx-auto"
    >
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
        About Us
      </h1>
      <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
        Somos un equipo de programadores de la Universidad Católica. La idea del proyecto es ayudar a los aficionados de los juegos de cartas TCG a encontrar y disfrutar su pasión con una plataforma dedicada.
      </p>

      <TeamGitHub />
    </motion.main>
  );
}
