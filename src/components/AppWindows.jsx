import { profile } from '../data/profile.js'
import { projects } from '../data/projects.js'

export const AboutWindow = () => (
  <div>
    <h1>About Me</h1>
    <p><strong>{profile.name}</strong> - {profile.title}</p>
    
    <h2>Summary</h2>
    {profile.about.map((paragraph, index) => (
      <p key={index}>{paragraph}</p>
    ))}
    
    <h2>Contact Information</h2>
    <ul>
      <li><strong>Email:</strong> {profile.email}</li>
      <li><strong>GitHub:</strong> <a href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer">{profile.github}</a></li>
      <li><strong>LinkedIn:</strong> <a href={`https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer">{profile.linkedin}</a></li>
      <li><strong>Location:</strong> {profile.location}</li>
    </ul>
    
    <h2>Education</h2>
    <p><strong>{profile.education.degree}</strong><br/>
    {profile.education.institution}<br/>
    {profile.education.duration}</p>
  </div>
)

export const ProjectsWindow = () => (
  <div>
    <h1>My Projects</h1>
    <p>Here are some of the projects I've worked on:</p>
    
    {projects.map((project, index) => (
      <div key={index} style={{ marginBottom: '24px', padding: '16px', background: '#2d2d2d', borderRadius: '8px' }}>
        <h2>{project.name}</h2>
        <p><strong>Status:</strong> {project.status}</p>
        <p><strong>Description:</strong> {project.description}</p>
        <p><strong>Technologies:</strong> {project.technologies.join(', ')}</p>
        <p><strong>GitHub:</strong> <a href={project.github} target="_blank" rel="noopener noreferrer">{project.github}</a></p>
        {project.highlights && project.highlights.length > 0 && (
          <>
            <p><strong>Highlights:</strong></p>
            <ul>
              {project.highlights.map((highlight, idx) => (
                <li key={idx}>{highlight}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    ))}
  </div>
)

export const ResumeWindow = () => (
  <div>
    <h1>Resume</h1>
    <p>Click the button below to download my full resume as PDF:</p>
    
    <button 
      onClick={() => window.open('/cv.pdf', '_blank')}
      style={{
        background: '#61dafb',
        color: '#1e1e1e',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        marginTop: '16px'
      }}
    >
      Download Resume PDF
    </button>
    
    <h2 style={{ marginTop: '32px' }}>Work Experience</h2>
    {profile.experience.map((exp, index) => (
      <div key={index} style={{ marginBottom: '20px' }}>
        <h3>{exp.role} at {exp.company}</h3>
        <p><strong>Duration:</strong> {exp.duration}</p>
        <ul>
          {exp.highlights.map((highlight, idx) => (
            <li key={idx}>{highlight}</li>
          ))}
        </ul>
      </div>
    ))}
    
    <h2>Technical Skills</h2>
    <p>I have experience with the following technologies:</p>
    <ul>
      <li><strong>Frontend:</strong> React, JavaScript, HTML5, CSS3</li>
      <li><strong>Backend:</strong> Node.js, Express, Python</li>
      <li><strong>Database:</strong> MongoDB, PostgreSQL, MySQL</li>
      <li><strong>DevOps:</strong> Docker, Kubernetes, CI/CD, AWS</li>
      <li><strong>Tools:</strong> Git, VS Code, Linux, Bash</li>
    </ul>
  </div>
)
