import { FaBolt } from 'react-icons/fa'
import { useTranslation } from '../TranslationContext'

const SAMPLE_DATA_EN = {
  personalInfo: {
    fullName: 'Alex Johnson',
    title: 'Senior Software Engineer',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 987-6543',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexjohnson',
    website: 'alexjohnson.dev',
    summary: 'Results-driven Senior Software Engineer with 7+ years of experience building scalable web applications. Passionate about clean architecture, performance optimization, and mentoring teams. Led multiple cross-functional teams delivering products used by millions of users worldwide.',
    profileImage: '',
  },
  experience: [
    { id: 1, company: 'Google', position: 'Senior Software Engineer', startDate: 'Jan 2021', endDate: '', current: true, description: '• Led a team of 8 engineers to redesign the core search infrastructure\n• Improved page load performance by 45% through lazy loading and code splitting\n• Mentored 4 junior developers through quarterly growth plans\n• Architected microservices handling 2M+ requests per day' },
    { id: 2, company: 'Meta', position: 'Software Engineer', startDate: 'Mar 2018', endDate: 'Dec 2020', current: false, description: '• Built React components used across 12 internal products\n• Reduced bundle size by 30% through tree-shaking and dynamic imports\n• Implemented real-time collaboration features serving 500K+ daily users' },
  ],
  education: [
    { id: 1, institution: 'Stanford University', degree: 'Master of Science', field: 'Computer Science', startDate: '2014', endDate: '2016', gpa: '3.9/4.0' },
    { id: 2, institution: 'UC Berkeley', degree: 'Bachelor of Science', field: 'Computer Science', startDate: '2010', endDate: '2014', gpa: '3.7/4.0' },
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'GraphQL', 'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'Redis', 'CI/CD'],
  certifications: [
    { id: 1, name: 'AWS Solutions Architect Professional', issuer: 'Amazon Web Services', date: 'March 2023' },
    { id: 2, name: 'Google Cloud Professional Engineer', issuer: 'Google Cloud', date: 'Jan 2022' },
  ],
  languages: [
    { id: 1, language: 'English', proficiency: 'Native' },
    { id: 2, language: 'Spanish', proficiency: 'Fluent' },
    { id: 3, language: 'Japanese', proficiency: 'Intermediate' },
  ],
}

const SAMPLE_DATA_ES = {
  personalInfo: {
    fullName: 'Carlos García',
    title: 'Ingeniero de Software Senior',
    email: 'carlos.garcia@email.com',
    phone: '+34 612 345 678',
    location: 'Madrid, España',
    linkedin: 'linkedin.com/in/carlosgarcia',
    website: 'carlosgarcia.dev',
    summary: 'Ingeniero de Software Senior orientado a resultados con más de 7 años de experiencia construyendo aplicaciones web escalables. Apasionado por la arquitectura limpia, la optimización del rendimiento y la mentoría de equipos. Lideré múltiples equipos multifuncionales entregando productos utilizados por millones de usuarios.',
    profileImage: '',
  },
  experience: [
    { id: 1, company: 'Google', position: 'Ingeniero de Software Senior', startDate: 'Ene 2021', endDate: '', current: true, description: '• Lideré un equipo de 8 ingenieros para rediseñar la infraestructura central de búsqueda\n• Mejoré el rendimiento de carga de página en un 45% mediante carga diferida\n• Mentoré a 4 desarrolladores junior a través de planes de crecimiento trimestrales\n• Diseñé microservicios que manejan más de 2M de solicitudes por día' },
    { id: 2, company: 'Meta', position: 'Ingeniero de Software', startDate: 'Mar 2018', endDate: 'Dic 2020', current: false, description: '• Construí componentes React utilizados en 12 productos internos\n• Reduje el tamaño del paquete en un 30% mediante tree-shaking e importaciones dinámicas\n• Implementé funciones de colaboración en tiempo real para más de 500K usuarios diarios' },
  ],
  education: [
    { id: 1, institution: 'Universidad Politécnica de Madrid', degree: 'Máster en Ciencias', field: 'Informática', startDate: '2014', endDate: '2016', gpa: '9.2/10' },
    { id: 2, institution: 'Universidad Complutense de Madrid', degree: 'Grado en Ingeniería', field: 'Informática', startDate: '2010', endDate: '2014', gpa: '8.5/10' },
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'GraphQL', 'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'Redis', 'CI/CD'],
  certifications: [
    { id: 1, name: 'AWS Solutions Architect Professional', issuer: 'Amazon Web Services', date: 'Marzo 2023' },
    { id: 2, name: 'Google Cloud Professional Engineer', issuer: 'Google Cloud', date: 'Enero 2022' },
  ],
  languages: [
    { id: 1, language: 'Español', proficiency: 'Native' },
    { id: 2, language: 'Inglés', proficiency: 'Fluent' },
    { id: 3, language: 'Francés', proficiency: 'Intermediate' },
  ],
}

const SAMPLE_DATA_FR = {
  personalInfo: {
    fullName: 'Marie Dupont',
    title: 'Ingénieure Logiciel Senior',
    email: 'marie.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
    linkedin: 'linkedin.com/in/mariedupont',
    website: 'mariedupont.dev',
    summary: 'Ingénieure Logiciel Senior axée sur les résultats avec plus de 7 ans d\'expérience dans la création d\'applications web évolutives. Passionnée par l\'architecture propre, l\'optimisation des performances et le mentorat d\'équipes. Direction de plusieurs équipes transversales livrant des produits utilisés par des millions d\'utilisateurs.',
    profileImage: '',
  },
  experience: [
    { id: 1, company: 'Google', position: 'Ingénieure Logiciel Senior', startDate: 'Jan 2021', endDate: '', current: true, description: '• Direction d\'une équipe de 8 ingénieurs pour repenser l\'infrastructure de recherche\n• Amélioration des performances de chargement de 45% grâce au lazy loading\n• Mentorat de 4 développeurs juniors via des plans de croissance trimestriels\n• Architecture de microservices gérant plus de 2M de requêtes par jour' },
    { id: 2, company: 'Meta', position: 'Ingénieure Logiciel', startDate: 'Mar 2018', endDate: 'Déc 2020', current: false, description: '• Création de composants React utilisés dans 12 produits internes\n• Réduction de la taille du bundle de 30% via tree-shaking et imports dynamiques\n• Implémentation de fonctionnalités de collaboration en temps réel pour plus de 500K utilisateurs quotidiens' },
  ],
  education: [
    { id: 1, institution: 'École Polytechnique', degree: 'Master en Sciences', field: 'Informatique', startDate: '2014', endDate: '2016', gpa: '16/20' },
    { id: 2, institution: 'Université Paris-Saclay', degree: 'Licence en Sciences', field: 'Informatique', startDate: '2010', endDate: '2014', gpa: '15/20' },
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'GraphQL', 'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'Redis', 'CI/CD'],
  certifications: [
    { id: 1, name: 'AWS Solutions Architect Professional', issuer: 'Amazon Web Services', date: 'Mars 2023' },
    { id: 2, name: 'Google Cloud Professional Engineer', issuer: 'Google Cloud', date: 'Janvier 2022' },
  ],
  languages: [
    { id: 1, language: 'Français', proficiency: 'Native' },
    { id: 2, language: 'Anglais', proficiency: 'Fluent' },
    { id: 3, language: 'Allemand', proficiency: 'Intermediate' },
  ],
}

const SAMPLE_DATA_DE = {
  personalInfo: {
    fullName: 'Max Müller',
    title: 'Senior Software-Ingenieur',
    email: 'max.mueller@email.de',
    phone: '+49 170 123 4567',
    location: 'Berlin, Deutschland',
    linkedin: 'linkedin.com/in/maxmueller',
    website: 'maxmueller.dev',
    summary: 'Ergebnisorientierter Senior Software-Ingenieur mit über 7 Jahren Erfahrung in der Entwicklung skalierbarer Webanwendungen. Leidenschaftlich für saubere Architektur, Leistungsoptimierung und Teamführung. Leitung mehrerer funktionsübergreifender Teams, die Produkte für Millionen von Nutzern weltweit bereitstellen.',
    profileImage: '',
  },
  experience: [
    { id: 1, company: 'Google', position: 'Senior Software-Ingenieur', startDate: 'Jan 2021', endDate: '', current: true, description: '• Leitung eines Teams von 8 Ingenieuren zur Neugestaltung der Suchinfrastruktur\n• Verbesserung der Seitenladegeschwindigkeit um 45% durch Lazy Loading\n• Mentoring von 4 Junior-Entwicklern durch vierteljährliche Wachstumspläne\n• Architektur von Microservices mit über 2M Anfragen pro Tag' },
    { id: 2, company: 'Meta', position: 'Software-Ingenieur', startDate: 'Mär 2018', endDate: 'Dez 2020', current: false, description: '• Entwicklung von React-Komponenten für 12 interne Produkte\n• Reduzierung der Bundle-Größe um 30% durch Tree-Shaking\n• Implementierung von Echtzeit-Kollaborationsfunktionen für über 500K tägliche Nutzer' },
  ],
  education: [
    { id: 1, institution: 'Technische Universität München', degree: 'Master of Science', field: 'Informatik', startDate: '2014', endDate: '2016', gpa: '1.3' },
    { id: 2, institution: 'RWTH Aachen', degree: 'Bachelor of Science', field: 'Informatik', startDate: '2010', endDate: '2014', gpa: '1.5' },
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'GraphQL', 'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'Redis', 'CI/CD'],
  certifications: [
    { id: 1, name: 'AWS Solutions Architect Professional', issuer: 'Amazon Web Services', date: 'März 2023' },
    { id: 2, name: 'Google Cloud Professional Engineer', issuer: 'Google Cloud', date: 'Januar 2022' },
  ],
  languages: [
    { id: 1, language: 'Deutsch', proficiency: 'Native' },
    { id: 2, language: 'Englisch', proficiency: 'Fluent' },
    { id: 3, language: 'Französisch', proficiency: 'Intermediate' },
  ],
}

function getSampleData(lang) {
  if (lang?.startsWith('es')) return SAMPLE_DATA_ES
  if (lang?.startsWith('fr')) return SAMPLE_DATA_FR
  if (lang === 'de') return SAMPLE_DATA_DE
  return SAMPLE_DATA_EN
}

export default function QuickFill({ onFill }) {
  const { t, language } = useTranslation()
  return (
    <button
      onClick={() => onFill(getSampleData(language))}
      className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border-2 border-yellow-300 border-dashed rounded-xl text-yellow-700 font-medium text-sm hover:bg-yellow-100 active:scale-95 transition-all"
    >
      <FaBolt size={14} className="text-yellow-500" />
      {t('quickFill.button')}
    </button>
  )
}

export { SAMPLE_DATA_EN as SAMPLE_DATA }
