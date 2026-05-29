import { FaBolt } from 'react-icons/fa'
import { useTranslation } from '../TranslationContext'

const SAMPLE_DATA = {
  personalInfo: {
    fullName: 'Alex Johnson',
    title: 'Senior Software Engineer',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 987-6543',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexjohnson',
    website: 'alexjohnson.dev',
    summary:
      'Results-driven Senior Software Engineer with 7+ years of experience building scalable web applications. Passionate about clean architecture, performance optimization, and mentoring teams. Led multiple cross-functional teams delivering products used by millions of users worldwide.',
  },
  experience: [
    {
      id: 1,
      company: 'Google',
      position: 'Senior Software Engineer',
      startDate: 'Jan 2021',
      endDate: '',
      current: true,
      description:
        '• Led a team of 8 engineers to redesign the core search infrastructure\n• Improved page load performance by 45% through lazy loading and code splitting\n• Mentored 4 junior developers through quarterly growth plans\n• Architected microservices handling 2M+ requests per day',
    },
    {
      id: 2,
      company: 'Meta',
      position: 'Software Engineer',
      startDate: 'Mar 2018',
      endDate: 'Dec 2020',
      current: false,
      description:
        '• Built React components used across 12 internal products\n• Reduced bundle size by 30% through tree-shaking and dynamic imports\n• Implemented real-time collaboration features serving 500K+ daily users\n• Won Hackathon 2019 for developing an accessibility audit tool',
    },
    {
      id: 3,
      company: 'Stripe',
      position: 'Junior Developer',
      startDate: 'Jun 2016',
      endDate: 'Feb 2018',
      current: false,
      description:
        '• Developed payment flow UI components in React and TypeScript\n• Wrote comprehensive unit and integration tests achieving 95% coverage\n• Collaborated with design team to implement responsive dashboards',
    },
  ],
  education: [
    {
      id: 1,
      institution: 'Stanford University',
      degree: 'Master of Science',
      field: 'Computer Science',
      startDate: '2014',
      endDate: '2016',
      gpa: '3.9/4.0',
    },
    {
      id: 2,
      institution: 'UC Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2010',
      endDate: '2014',
      gpa: '3.7/4.0',
    },
  ],
  skills: [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Python',
    'GraphQL',
    'AWS',
    'Docker',
    'Kubernetes',
    'PostgreSQL',
    'Redis',
    'CI/CD',
  ],
  certifications: [
    { id: 1, name: 'AWS Solutions Architect Professional', issuer: 'Amazon Web Services', date: 'March 2023' },
    { id: 2, name: 'Google Cloud Professional Engineer', issuer: 'Google Cloud', date: 'Jan 2022' },
    { id: 3, name: 'Certified Kubernetes Administrator', issuer: 'CNCF', date: 'Nov 2021' },
  ],
  languages: [
    { id: 1, language: 'English', proficiency: 'Native' },
    { id: 2, language: 'Spanish', proficiency: 'Fluent' },
    { id: 3, language: 'Japanese', proficiency: 'Intermediate' },
  ],
}

export default function QuickFill({ onFill }) {
  const { t } = useTranslation()
  return (
    <button
      onClick={() => onFill(SAMPLE_DATA)}
      className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border-2 border-yellow-300 border-dashed rounded-xl text-yellow-700 font-medium text-sm hover:bg-yellow-100 active:scale-95 transition-all"
    >
      <FaBolt size={14} className="text-yellow-500" />
      {t('quickFill.button')}
    </button>
  )
}

export { SAMPLE_DATA }
