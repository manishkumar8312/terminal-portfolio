import { profile } from '../data/profile.js'
import { skills } from '../data/skills.js'
import { projects } from '../data/projects.js'
import { learnContent } from '../data/learn.js'

// Simple in-memory file system
let fileSystem = {
  '/': {
    type: 'directory',
    children: {
      'home': {
        type: 'directory',
        children: {
          'user': {
            type: 'directory',
            children: {
              'documents': {
                type: 'directory',
                children: {}
              },
              'downloads': {
                type: 'directory',
                children: {}
              },
              'readme.txt': {
                type: 'file',
                content: 'Welcome to terminal portfolio!\nThis is a simulated file system.'
              }
            }
          }
        }
      }
    }
  }
}

let currentPath = '/home/user'

// Helper functions for file system operations
const getCurrentDirectory = () => {
  const pathParts = currentPath.split('/').filter(part => part)
  let current = fileSystem['/']
  
  for (const part of pathParts) {
    if (current.children && current.children[part]) {
      current = current.children[part]
    } else {
      return null
    }
  }
  return current
}

const resolvePath = (path) => {
  if (path.startsWith('/')) {
    return path
  } else {
    return currentPath === '/' ? `/${path}` : `${currentPath}/${path}`
  }
}

const navigateToPath = (path) => {
  const resolvedPath = resolvePath(path)
  const pathParts = resolvedPath.split('/').filter(part => part)
  let current = fileSystem['/']
  
  for (const part of pathParts) {
    if (current.children && current.children[part] && current.children[part].type === 'directory') {
      current = current.children[part]
    } else {
      return null
    }
  }
  return resolvedPath
}

// ========================================
// USER PROFILE COMMANDS
// ========================================

const handleAboutCommand = () => {
  return [
    `${profile.name} - ${profile.title}`,
    '',
    ...profile.about
  ]
}

const handleContactCommand = () => {
  return [
    'Contact Information:',
    `Email: ${profile.email}`,
    `GitHub: ${profile.github}`,
    `LinkedIn: ${profile.linkedin}`,
    `Location: ${profile.location}`
  ]
}

const handleExperienceCommand = () => {
  return [
    'Work Experience:',
    '',
    ...profile.experience.map(exp => [
      `${exp.role} at ${exp.company}`,
      `Duration: ${exp.duration}`,
      '',
      ...exp.highlights.map(highlight => `  • ${highlight}`),
      ''
    ]).flat()
  ]
}

const handleEducationCommand = () => {
  return [
    'Education:',
    '',
    `${profile.education.degree}`,
    `${profile.education.institution}`,
    `${profile.education.duration}`,
    ''
  ]
}

const handleResumeCommand = () => {
  window.open('/cv.pdf', '_blank')
  return ['Opening resume PDF...']
}

// ========================================
// SKILLS & PROJECTS COMMANDS
// ========================================

const handleSkillsCommand = () => {
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
}

const handleProjectsCommand = (parts) => {
  if (parts[1] === '--count') {
    return [`Total Projects: ${projects.length}`]
  }
  
  if (parts[1]) {
    const projectName = parts.slice(1).join(' ').toLowerCase()
    const project = projects.find(p => p.name.toLowerCase() === projectName)
    
    if (project) {
      return [
        `Project: ${project.name}`,
        `Tech Stack: ${project.technologies.join(', ')}`,
        `Description: ${project.description}`,
        `GitHub: ${project.github}`
      ]
    } else {
      return [`Project not found: ${parts.slice(1).join(' ')}`]
    }
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
}

const handleOpenCommand = (parts) => {
  if (!parts[1]) {
    return ['Usage: open <repository_name|linkedin|github>. Available repositories:']
      .concat(projects.map(p => `  • ${p.name.toLowerCase()}`))
      .concat('  • linkedin', '  • github')
  }
  
  const target = parts.slice(1).join(' ').toLowerCase()
  
  // Handle LinkedIn and GitHub special cases
  if (target === 'linkedin') {
    window.open(`https://${profile.linkedin}`, '_blank')
    return ['Opening LinkedIn profile...']
  }
  
  if (target === 'github') {
    window.open(`https://${profile.github}`, '_blank')
    return ['Opening GitHub profile...']
  }
  
  // Handle project repositories
  const project = projects.find(p => p.name.toLowerCase() === target)
  
  if (project) {
    window.open(project.github, '_blank')
    return [`Opening ${project.name} repository: ${project.github}`]
  } else {
    const availableRepos = projects.map(p => p.name.toLowerCase()).join(', ')
    return [`Repository not found: ${target}`,
            `Available repositories: ${availableRepos}`,
            `You can also use: open linkedin or open github`]
  }
}

// ========================================
// LEARNING COMMANDS
// ========================================

const handleLearnCommand = () => {
  return [
    learnContent.title,
    learnContent.tagline || '',
    '',
    learnContent.overview || '',
    '',
    'Learning Roadmap:',
    '',
    ...learnContent.roadmap.map(phase => [
      `${phase.phase} (${phase.status}):`,
      ...phase.focus.map(topic => `  • ${topic}`),
      ''
    ]).flat(),
    '',
    'Resources:',
    '',
    `${learnContent.resources.primaryRepo.name}:`,
    `  ${learnContent.resources.primaryRepo.url}`,
    `  ${learnContent.resources.primaryRepo.description}`,
    '',
    `Currently Learning: ${learnContent.currentlyLearning}`,
    '',
    'Next Goals:',
    ...learnContent.nextGoals.map(goal => `  • ${goal}`),
    '',
    `Philosophy: ${learnContent.philosophy}`
  ]
}

// ========================================
// SYSTEM COMMANDS
// ========================================

const handleThemeCommand = (parts, setTheme) => {
  if (!parts[1]) {
    return ['Usage: theme <dark|light>. Example: theme dark']
  }
  
  const theme = parts[1].toLowerCase()
  if (theme === 'dark' || theme === 'light') {
    if (setTheme) {
      setTheme(theme)
    }
    return [`Theme changed to ${theme}`]
  } else {
    return ['Invalid theme. Use: theme dark or theme light']
  }
}

const handleClearCommand = () => {
  return ['CLEAR_SCREEN']
}

const handleDateCommand = () => {
  return [new Date().toString()]
}

const handleWhoamiCommand = () => {
  return [profile.name]
}

// ========================================
// FILE SYSTEM COMMANDS
// ========================================

const handleLsCommand = () => {
  const currentDir = getCurrentDirectory()
  if (!currentDir) {
    return ['Error: Cannot access current directory']
  }
  
  if (!currentDir.children || Object.keys(currentDir.children).length === 0) {
    return ['(empty directory)']
  }
  
  return Object.keys(currentDir.children).map(name => {
    const item = currentDir.children[name]
    if (item.type === 'directory') {
      return `\x1b[34m${name}/\x1b[0m`  // Blue for directories
    } else {
      return `\x1b[32m${name}\x1b[0m`  // Green for files
    }
  })
}

const handlePwdCommand = () => {
  return [currentPath]
}


const handleCatCommand = (parts) => {
  if (!parts[1]) {
    return ['Usage: cat <filename>. Example: cat file.txt']
  }
  
  const fileName = parts[1]
  const currentDirForCat = getCurrentDirectory()
  
  if (!currentDirForCat) {
    return ['Error: Cannot access current directory']
  }
  
  if (!currentDirForCat.children || !currentDirForCat.children[fileName]) {
    return [`cat: ${fileName}: No such file or directory`]
  }
  
  const file = currentDirForCat.children[fileName]
  if (file.type !== 'file') {
    return [`cat: ${fileName}: Is a directory`]
  }
  
  return file.content ? [file.content] : ['(empty file)']
}

const handleEchoCommand = (parts) => {
  const command = parts.join(' ')
  
  // Check if it's a redirect operation (echo content > file)
  const redirectMatch = command.match(/^echo\s+(.+?)\s*>\s*(.+)$/)
  
  if (redirectMatch) {
    // Write to file
    const content = redirectMatch[1].trim()
    const fileName = redirectMatch[2].trim()
    const currentDirForEcho = getCurrentDirectory()
    
    if (!currentDirForEcho) {
      return ['Error: Cannot access current directory']
    }
    
    if (!currentDirForEcho.children) {
      currentDirForEcho.children = {}
    }
    
    if (!currentDirForEcho.children[fileName]) {
      currentDirForEcho.children[fileName] = {
        type: 'file',
        content: ''
      }
    }
    
    currentDirForEcho.children[fileName].content = content
    return [`Content written to '${fileName}'`]
  } else {
    // Display message
    if (parts.length > 1) {
      return [parts.slice(1).join(' ')]
    }
    return ['']
  }
}

// ========================================
// MAIN COMMAND HANDLER
// ========================================

export const executeCommand = (command, setTheme) => {
  const trimmedCommand = command.trim()
  const parts = trimmedCommand.split(' ')
  const mainCommand = parts[0]?.toLowerCase()

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
        '  resume   - Open resume PDF',
        '  theme    - Change theme (dark/light)',
        '  learn    - Learn DevOps with me',
        '  open     - Open repository, LinkedIn, or GitHub (e.g., "open quickstay", "open linkedin", "open github")',
        '  ls       - List files and directories',
        '  cat      - Display file contents (e.g., "cat file.txt")',
        '  echo     - Display message or write to file (e.g., "echo hello" or "echo hello > file.txt")',
        '  pwd      - Show current directory',
        '  clear/cls- Clear the terminal screen',
        '  date     - Show current date and time',
        '  whoami   - Display current user'
      ]

    case 'about':
      return handleAboutCommand()

    case 'skills':
      return handleSkillsCommand()

    case 'projects':
      return handleProjectsCommand(parts)

    case 'experience':
      return handleExperienceCommand()

    case 'education':
      return handleEducationCommand()

    case 'contact':
      return handleContactCommand()

    case 'resume':
      return handleResumeCommand()

    case 'theme':
      return handleThemeCommand(parts, setTheme)

    case 'learn':
      return handleLearnCommand()

    case 'open':
      return handleOpenCommand(parts)

    case 'clear':
    case 'cls':
      return handleClearCommand()

    case 'date':
      return handleDateCommand()

    case 'whoami':
      return handleWhoamiCommand()

    case 'ls':
      return handleLsCommand()

    case 'pwd':
      return handlePwdCommand()

    case 'cat':
      return handleCatCommand(parts)

    case 'echo':
      return handleEchoCommand(parts)

    default:
      return [`Command not found: ${mainCommand}. Type 'help' for available commands.`]
  }
}
