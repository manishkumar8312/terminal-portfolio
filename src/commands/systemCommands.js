import { profile } from '../data/profile.js'
import { projects } from '../data/projects.js'

export const registerSystemCommands = (registry, context) => {
  // Navigation commands
  registry.register('cd', (args) => {
    if (!args[0]) {
      registry.setCurrentPath('/home/manish')
      return []
    }

    const targetPath = args[0]
    const newPath = registry.navigateToPath(targetPath)
    
    if (newPath === null) {
      return [`cd: ${targetPath}: No such file or directory`]
    }
    
    registry.setCurrentPath(newPath)
    return []
  }, 'Change directory', [])

  registry.register('pwd', () => {
    return [registry.getCurrentPath()]
  }, 'Print working directory', [])

  registry.register('ls', (args) => {
    const currentDir = registry.getCurrentDirectory()
    if (!currentDir) {
      return ['Error: Cannot access current directory']
    }
    
    if (!currentDir.children || Object.keys(currentDir.children).length === 0) {
      return ['(empty directory)']
    }
    
    const showHidden = args.includes('-a') || args.includes('--all')
    const longFormat = args.includes('-l') || args.includes('--long')
    
    let items = Object.keys(currentDir.children)
    if (!showHidden) {
      items = items.filter(name => !name.startsWith('.'))
    }
    
    if (longFormat) {
      return items.map(name => {
        const item = currentDir.children[name]
        const permissions = item.type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--'
        const size = item.type === 'file' && item.content ? item.content.length : 4096
        const color = item.type === 'directory' ? '\x1b[34m' : '\x1b[32m'
        const suffix = item.type === 'directory' ? '/' : ''
        return `${permissions} ${size} ${color}${name}${suffix}\x1b[0m`
      })
    } else {
      return items.map(name => {
        const item = currentDir.children[name]
        const color = item.type === 'directory' ? '\x1b[34m' : '\x1b[32m'
        const suffix = item.type === 'directory' ? '/' : ''
        return `${color}${name}${suffix}\x1b[0m`
      })
    }
  }, 'List directory contents', ['ll'])

  registry.register('clear', () => {
    return ['CLEAR_SCREEN']
  }, 'Clear terminal screen', ['cls'])

  registry.register('whoami', () => {
    return ['manish']
  }, 'Display current user', [])

  registry.register('help', () => {
    const commands = registry.getCommandList()
    const helpText = [
      'Available commands:',
      '',
      ...commands.map(cmd => `  ${cmd.name.padEnd(12)} - ${cmd.description}`),
      '',
      'File operations:',
      '  echo         - Display message or write to file (use > for overwrite, >> for append)',
      '  write        - Write content to a file',
      '  append       - Append content to a file',
      '  cat          - Display file contents',
      '  touch        - Create an empty file',
      '  mkdir        - Create a directory',
      '  ls           - List directory contents',
      '  cd           - Change directory',
      '  pwd          - Print working directory',
      '',
      'Custom commands:',
      '  about        - Open About window',
      '  projects     - Open Projects window', 
      '  resume       - Open Resume window',
      '  neofetch     - Display system information',
      '  reboot       - Reboot the system',
      '',
    ]
    return helpText
  }, 'Show available commands', [])

  // System info commands
  registry.register('neofetch', () => {
    const neofetchOutput = [
      '',
      '       _____       ',
      '      /     \\      ',
      '     /  o o \\     manish@portfolio',
      '    |    ^    |    ---------',
      '    |  \\___/  |   ',
      '     \\       /     Host: Terminal Portfolio v2.0',
      '      \\_____/      Kernel: React 18.2.0',                 
      '                    Shell: bash',
      '                    Terminal: web-term',
      '                    CPU: Virtual CPU @ 2.4GHz',
      '',
      `${profile.name} - ${profile.title}`,
      'Location: ' + profile.location,
      'GitHub: ' + profile.github,
      ''
    ]
    return neofetchOutput
  }, 'Display system information', [])

  registry.register('reboot', () => {
    if (context.onReboot) {
      context.onReboot()
    }
    return ['System rebooting...']
  }, 'Reboot the system', [])

  // Application commands
  registry.register('about', () => {
    if (context.openWindow) {
      context.openWindow('about')
    }
    return ['Opening About window...']
  }, 'Open About window', [])

  registry.register('projects', () => {
    if (context.openWindow) {
      context.openWindow('projects')
    }
    return ['Opening Projects window...']
  }, 'Open Projects window', [])

  registry.register('resume', () => {
    if (context.openWindow) {
      context.openWindow('resume')
    }
    return ['Opening Resume window...']
  }, 'Open Resume window', [])

  // File commands
  registry.register('cat', (args) => {
    if (!args[0]) {
      return ['Usage: cat <filename>. Example: cat file.txt']
    }
    
    const fileName = args[0]
    const currentDir = registry.getCurrentDirectory()
    
    if (!currentDir) {
      return ['Error: Cannot access current directory']
    }
    
    if (!currentDir.children || !currentDir.children[fileName]) {
      return [`cat: ${fileName}: No such file or directory`]
    }
    
    const file = currentDir.children[fileName]
    if (file.type !== 'file') {
      return [`cat: ${fileName}: Is a directory`]
    }
    
    return file.content ? file.content.split('\n') : ['(empty file)']
  }, 'Display file contents', [])

  registry.register('echo', (args) => {
    const appendIndex = args.findIndex(arg => arg === '>>')
    const redirectIndex = args.findIndex(arg => arg === '>')
    
    if (appendIndex !== -1 && appendIndex < args.length - 1) {
      const content = args.slice(0, appendIndex).join(' ').replace(/^["']|["']$/g, '')
      const fileName = args.slice(appendIndex + 1).join(' ')
      const currentDir = registry.getCurrentDirectory()
      
      if (!currentDir) {
        return ['Error: Cannot access current directory']
      }
      
      if (!currentDir.children) {
        currentDir.children = {}
      }
      
      if (!currentDir.children[fileName]) {
        currentDir.children[fileName] = {
          type: 'file',
          content: content
        }
      } else {
        const existingContent = currentDir.children[fileName].content || ''
        currentDir.children[fileName].content = existingContent + (existingContent ? '\n' : '') + content
      }
      
      return [`Content appended to '${fileName}'`]
    } else if (redirectIndex !== -1 && redirectIndex < args.length - 1) {
      const content = args.slice(0, redirectIndex).join(' ').replace(/^["']|["']$/g, '')
      const fileName = args.slice(redirectIndex + 1).join(' ')
      const currentDir = registry.getCurrentDirectory()
      
      if (!currentDir) {
        return ['Error: Cannot access current directory']
      }
      
      if (!currentDir.children) {
        currentDir.children = {}
      }
      
      currentDir.children[fileName] = {
        type: 'file',
        content: content
      }
      return [`Content written to '${fileName}'`]
    } else {
      const content = args.join(' ').replace(/^["']|["']$/g, '')
      return [content]
    }
  }, 'Display a message or write/append to a file', [])

  registry.register('mkdir', (args) => {
    if (!args[0]) {
      return ['Usage: mkdir <directory_name>']
    }
    
    const dirName = args[0]
    const currentDir = registry.getCurrentDirectory()
    
    if (!currentDir) {
      return ['Error: Cannot access current directory']
    }
    
    if (!currentDir.children) {
      currentDir.children = {}
    }
    
    if (currentDir.children[dirName]) {
      return [`mkdir: ${dirName}: File or directory already exists`]
    }
    
    currentDir.children[dirName] = {
      type: 'directory',
      children: {}
    }
    
    return [`Directory '${dirName}' created`]
  }, 'Create a directory', [])

  registry.register('touch', (args) => {
    if (!args[0]) {
      return ['Usage: touch <filename>']
    }
    
    const fileName = args[0]
    const currentDir = registry.getCurrentDirectory()
    
    if (!currentDir) {
      return ['Error: Cannot access current directory']
    }
    
    if (!currentDir.children) {
      currentDir.children = {}
    }
    
    if (currentDir.children[fileName]) {
      return [] // File exists, just update timestamp (simulated)
    }
    
    currentDir.children[fileName] = {
      type: 'file',
      content: ''
    }
    
    return [`File '${fileName}' created`]
  }, 'Create an empty file', [])

  registry.register('write', (args) => {
    if (args.length < 2) {
      return ['Usage: write <filename> <content>. Example: write myfile.txt Hello World']
    }
    
    const fileName = args[0]
    const content = args.slice(1).join(' ')
    const currentDir = registry.getCurrentDirectory()
    
    if (!currentDir) {
      return ['Error: Cannot access current directory']
    }
    
    if (!currentDir.children) {
      currentDir.children = {}
    }
    
    currentDir.children[fileName] = {
      type: 'file',
      content: content
    }
    
    return [`Content written to '${fileName}'`]
  }, 'Write content to a file', [])

  registry.register('append', (args) => {
    if (args.length < 2) {
      return ['Usage: append <filename> <content>. Example: append myfile.txt More content']
    }
    
    const fileName = args[0]
    const content = args.slice(1).join(' ')
    const currentDir = registry.getCurrentDirectory()
    
    if (!currentDir) {
      return ['Error: Cannot access current directory']
    }
    
    if (!currentDir.children) {
      currentDir.children = {}
    }
    
    if (!currentDir.children[fileName]) {
      currentDir.children[fileName] = {
        type: 'file',
        content: content
      }
    } else {
      const existingContent = currentDir.children[fileName].content || ''
      currentDir.children[fileName].content = existingContent + (existingContent ? '\n' : '') + content
    }
    
    return [`Content appended to '${fileName}'`]
  }, 'Append content to a file', [])

  registry.register('date', () => {
    return [new Date().toString()]
  }, 'Show current date and time', [])

  // Theme commands
  registry.register('theme', (args) => {
    if (!args[0]) {
      const currentTheme = document.body.getAttribute('data-theme') || 'dark'
      return [`Current theme: ${currentTheme}`]
    }
    
    const theme = args[0].toLowerCase()
    
    if (theme === 'light') {
      if (context.setTheme) {
        context.setTheme('light')
      }
      return ['Theme set to light']
    } else if (theme === 'dark') {
      if (context.setTheme) {
        context.setTheme('dark')
      }
      return ['Theme set to dark']
    } else {
      return ['Usage: theme <light|dark>. Example: theme light']
    }
  }, 'Change terminal theme', ['th'])

  return registry
}
