class CommandRegistry {
  constructor() {
    this.commands = new Map()
    this.aliases = new Map()
    this.currentPath = '/home/manish'
    this.fileSystem = this.createFileSystem()
  }

  createFileSystem() {
    return {
      '/': {
        type: 'directory',
        children: {
          'home': {
            type: 'directory',
            children: {
              'manish': {
                type: 'directory',
                children: {
                  'documents': {
                    type: 'directory',
                    children: {
                      'resume.txt': {
                        type: 'file',
                        content: 'Manish Kumar - Full Stack Developer\nExperience: 5+ years\nSpecialization: React, Node.js, DevOps'
                      },
                      'about.txt': {
                        type: 'file',
                        content: 'Passionate developer with expertise in building scalable web applications'
                      }
                    }
                  },
                  'downloads': {
                    type: 'directory',
                    children: {}
                  },
                  'projects': {
                    type: 'directory',
                    children: {
                      'portfolio': {
                        type: 'directory',
                        children: {
                          'README.md': {
                            type: 'file',
                            content: '# Terminal Portfolio\nA terminal-based portfolio application'
                          }
                        }
                      },
                      'ecommerce': {
                        type: 'directory',
                        children: {}
                      }
                    }
                  },
                  'desktop': {
                    type: 'directory',
                    children: {}
                  },
                  '.bashrc': {
                    type: 'file',
                    content: '# Bash configuration\nalias ll="ls -la"\nexport PS1="\\[\\033[01;32m\\]\\u@\\h\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]\\$ "'
                  }
                }
              }
            }
          },
          'etc': {
            type: 'directory',
            children: {
              'os-release': {
                type: 'file',
                content: 'PRETTY_NAME="Ubuntu 22.04 LTS"\nNAME="Ubuntu"\nVERSION_ID="22.04"\nVERSION="22.04 LTS (Jammy Jellyfish)"'
              }
            }
          },
          'var': {
            type: 'directory',
            children: {
              'log': {
                type: 'directory',
                children: {}
              }
            }
          }
        }
      }
    }
  }

  register(name, handler, description = '', aliases = []) {
    this.commands.set(name, { handler, description })
    aliases.forEach(alias => {
      this.aliases.set(alias, name)
    })
  }

  execute(command, args, context) {
    const commandName = this.aliases.get(command) || command
    
    if (!this.commands.has(commandName)) {
      return [`Command not found: ${command}. Type 'help' for available commands.`]
    }

    try {
      const { handler } = this.commands.get(commandName)
      return handler(args, context)
    } catch (error) {
      return [`Error executing command: ${error.message}`]
    }
  }

  getCommandList() {
    const list = []
    this.commands.forEach((value, key) => {
      list.push({ name: key, description: value.description })
    })
    return list.sort((a, b) => a.name.localeCompare(b.name))
  }

  getCurrentDirectory() {
    const pathParts = this.currentPath.split('/').filter(part => part)
    let current = this.fileSystem['/']
    
    for (const part of pathParts) {
      if (current.children && current.children[part]) {
        current = current.children[part]
      } else {
        return null
      }
    }
    return current
  }

  resolvePath(path) {
    if (path.startsWith('/')) {
      return path
    } else if (path === '~') {
      return '/home/manish'
    } else if (path.startsWith('~/')) {
      return `/home/manish/${path.substring(2)}`
    } else {
      return this.currentPath === '/' ? `/${path}` : `${this.currentPath}/${path}`
    }
  }

  navigateToPath(path) {
    const resolvedPath = this.resolvePath(path)
    const pathParts = resolvedPath.split('/').filter(part => part)
    let current = this.fileSystem['/']
    
    for (const part of pathParts) {
      if (current.children && current.children[part] && current.children[part].type === 'directory') {
        current = current.children[part]
      } else {
        return null
      }
    }
    return resolvedPath
  }

  setCurrentPath(path) {
    this.currentPath = path
  }

  getCurrentPath() {
    return this.currentPath
  }
}

export default CommandRegistry
