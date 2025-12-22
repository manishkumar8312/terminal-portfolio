import { profile } from '../data/profile.js'
import { skills } from '../data/skills.js'
import { projects } from '../data/projects.js'
import { learnContent } from '../data/learn.js'

export const executeCommand = (command) => {
  const trimmedCommand = command.trim().toLowerCase()
  const parts = trimmedCommand.split(' ')
  const mainCommand = parts[0]

  switch (mainCommand) {
    case 'help':
      return [
        'Available commands:',
        '  help     - Show this help message',
        '  about    - Display information about me',
        '  skills   - List my technical skills',
        '  projects - Show my projects',
        '  experience - Display work experience',
        '  education - Show educational background',
        '  contact  - Display contact information',
        '  learn    - Learn DevOps with me',
        '  clear    - Clear the terminal screen',
        '  echo     - Display a message',
        '  date     - Show current date and time',
        '  whoami   - Display current user'
      ]

    case 'about':
      return [
        `${profile.name} - ${profile.title}`,
        '',
        ...profile.about
      ]

    case 'skills':
      return [
        'Technical Skills:',
        '',
        ...Object.entries(skills.categories).map(([category, skillList]) => {
          const skillsText = skillList.map(skill => `${skill.name} (${skill.level})`).join(', ')
          return `${category}: ${skillsText}`
        }),
        '',
        'Certifications:',
        ...skills.certifications.map(cert => `  • ${cert}`)
      ]

    case 'projects':
      if (parts[1] === '--count') {
        return [`Total Projects: ${projects.length}`]
      }
      return [
        'Projects:',
        '',
        ...projects.map((project, index) => {
          return [
            `${index + 1}. ${project.name}`,
            `   Status: ${project.status}`,
            `   Description: ${project.description}`,
            `   Technologies: ${project.technologies.join(', ')}`,
            `   GitHub: ${project.github}`,
            `   Highlights: ${project.highlights.join(', ')}`
          ].join('\n')
        })
      ]

    case 'experience':
      return [
        'Work Experience:',
        '',
        ...profile.experience.map(exp => [
          `${exp.role} at ${exp.company}`,
          `Duration: ${exp.duration}`,
          '',
          ...exp.description.map(desc => `  • ${desc}`),
          ''
        ]).flat()
      ]

    case 'education':
      return [
        'Education:',
        '',
        ...profile.education.map(edu => [
          `${edu.degree}`,
          `${edu.domain || ''}`,
          `${edu.institution}`,
          `${edu.year}`,
          ''
        ]).flat()
      ]

    case 'contact':
      return [
        'Contact Information:',
        `Email: ${profile.email}`,
        `GitHub: ${profile.github}`,
        `LinkedIn: ${profile.linkedin}`,
        `Location: ${profile.location}`
      ]

    case 'clear':
      return ['CLEAR_SCREEN']

    case 'echo':
      if (parts.length > 1) {
        return [parts.slice(1).join(' ')]
      }
      return ['']

    case 'date':
      return [new Date().toString()]

    case 'whoami':
      return [profile.name]

    case 'ls':
      return [
        'drwxr-xr-x  2 user user 4096 Dec 22 10:40 components/',
        'drwxr-xr-x  2 user user 4096 Dec 22 10:40 commands/',
        'drwxr-xr-x  2 user user 4096 Dec 22 10:40 data/',
        'drwxr-xr-x  2 user user 4096 Dec 22 10:40 styles/',
        '-rw-r--r--  1 user user 1187 Dec 22 10:40 App.jsx',
        '-rw-r--r--  1 user user  215 Dec 22 10:40 main.jsx',
        '-rw-r--r--  1 user user   89 Dec 22 10:40 index.css'
      ]

    case 'pwd':
      return ['/home/user/portfolio']

    case 'learn':
      return [
        learnContent.title,
        '',
        learnContent.description,
        '',
        'Learning Path:',
        '',
        ...learnContent.learningPath.map(stage => [
          `${stage.stage}:`,
          ...stage.topics.map(topic => `  • ${topic}`),
          ''
        ]).flat(),
        'Repositories:',
        '',
        ...learnContent.repositories.map(repo => [
          `${repo.name}:`,
          `  ${repo.url}`,
          `  ${repo.description}`,
          ''
        ]).flat(),
        `Current Focus: ${learnContent.currentFocus}`,
        '',
        'Upcoming Topics:',
        ...learnContent.upcomingTopics.map(topic => `  • ${topic}`)
      ]

    default:
      return [`Command not found: ${mainCommand}. Type 'help' for available commands.`]
  }
}
