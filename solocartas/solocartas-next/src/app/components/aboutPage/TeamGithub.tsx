'use client';

import { useState, useEffect } from 'react';

const teamGithubUsers = [
  { username: 'Ajbaus', name: 'Allan Baus' },
  { username: 'benjaminfaundezromero', name: 'Benjamín Faúndez' },
  { username: 'daniel-retamal', name: 'Daniel Retamal' },
  { username: 'elpelaoloco', name: 'José Vergara' },
  { username: 'ssalgadn', name: 'Sebastián Salgado' },
  { username: 'SebaValenzuela', name: 'Sebastián Valenzuela' },
  { username: 'vicentesalazar', name: 'Vicente Salazar' },
];

interface GithubUserData {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
}

export default function TeamGitHub() {
  const [usersData, setUsersData] = useState<GithubUserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const promises = teamGithubUsers.map(({ username }) =>
          fetch(`https://api.github.com/users/${username}`).then(res => res.json())
        );
        const results = await Promise.all(promises);

        setUsersData(results);
      } catch (error) {
        console.error('Error fetching GitHub users:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) return <p>Cargando información del equipo...</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Nuestro Equipo</h2>
      <div className="flex gap-8 flex-wrap justify-center">
        {usersData.map((user) => (
          <a
            key={user.login}
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-44 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
          >
            <img
              src={user.avatar_url}
              alt={user.name || user.login}
              className="w-20 h-20 rounded-full mb-3 border-2 border-blue-600"
            />
            <h3 className="text-lg font-semibold text-center text-gray-900 dark:text-gray-100">
              {user.name || user.login}
            </h3>
            {user.bio && (
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 text-center line-clamp-3">
                {user.bio}
              </p>
            )}
            <p className="mt-3 text-sm text-blue-600 dark:text-blue-400 font-medium">
              Repos públicos: {user.public_repos}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
