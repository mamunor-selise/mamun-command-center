import { connectToDatabase, verifyToken } from './_db.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verify Auth Token
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '';
  const authUser = verifyToken(token);

  const userId = authUser ? (authUser.id || authUser.email) : 'guest';
  const userName = authUser ? authUser.name : 'JOHN DOE';
  const userEmail = authUser ? authUser.email : 'john.doe@email.com';

  try {
    const { db } = await connectToDatabase();
    const cvCollection = db.collection('cv_profiles');

    // 1. GET: Fetch CV Profiles for user
    if (req.method === 'GET') {
      let profiles = await cvCollection.find({ userId }).toArray();

      if (profiles.length === 0) {
        const defaultCv = {
          id: 'cv-' + Date.now(),
          userId,
          title: 'Senior Software Engineer Resume',
          targetRole: 'SENIOR SOFTWARE ENGINEER',
          templateStyle: 'modern',
          fontSize: 'base',
          spacing: 'normal',
          personalInfo: {
            fullName: userName,
            jobTitle: 'SENIOR SOFTWARE ENGINEER',
            email: userEmail,
            phone: '+880 1712 345 678',
            location: 'Dhaka, Bangladesh',
            website: '',
            github: 'github.com/johndoe',
            linkedin: 'linkedin.com/in/johndoe',
            avatarUrl: '',
            careerObjective: '',
            summary: `Results-driven Software Engineer with 7+ years of experience in designing, developing, and maintaining scalable web applications. Skilled in Angular, .NET, MongoDB, REST APIs, cloud technologies, and modern software architecture. Passionate about writing clean code and delivering high-quality solutions.`
          },
          experiences: [
            {
              id: 'exp-1',
              company: 'ABC Technologies Ltd.',
              role: 'Senior Software Engineer',
              location: 'Dhaka, Bangladesh',
              startDate: 'Jan 2023',
              endDate: 'Present',
              isCurrent: true,
              bulletPoints: [
                'Designed and developed enterprise applications using Angular and .NET Core.',
                'Improved API performance by 40% through query optimization and caching.',
                'Led a team of 5 developers and conducted code reviews and mentoring.',
                'Implemented scalable MongoDB data models and aggregation pipelines.',
                'Collaborated with product, QA, and DevOps teams to deliver high-quality features.'
              ]
            },
            {
              id: 'exp-2',
              company: 'XYZ Solutions Ltd.',
              role: 'Software Engineer',
              location: 'Dhaka, Bangladesh',
              startDate: 'Jun 2019',
              endDate: 'Dec 2022',
              isCurrent: false,
              bulletPoints: [
                'Developed responsive web applications using Angular and PrimeNG.',
                'Built RESTful APIs using ASP.NET Core and integrated third-party services.',
                'Implemented authentication and role-based authorization.',
                'Optimized application performance and resolved critical production issues.',
                'Participated in requirement analysis, system design, and Agile ceremonies.'
              ]
            }
          ],
          education: [
            {
              id: 'edu-1',
              institution: 'ABC University',
              degree: 'Bachelor of Science in Computer Science',
              fieldOfStudy: 'Computer Science',
              location: 'Dhaka, Bangladesh',
              startDate: '2015',
              endDate: '2019',
              cgpa: 'CGPA: 3.68 out of 4.00'
            }
          ],
          skillCategories: [
            {
              id: 'cat-1',
              name: 'SKILLS',
              skills: [
                'Angular | TypeScript | JavaScript',
                'React | HTML5 | CSS3 | PrimeNG',
                '.NET | ASP.NET Core | C#',
                'REST API | GraphQL',
                'MongoDB | SQL Server',
                'Azure | Docker | Jenkins',
                'Git | GitHub | CI/CD',
                'Agile | Jira | Confluence',
                'Problem Solving | Teamwork',
                'Communication | Leadership'
              ]
            }
          ],
          projects: [
            {
              id: 'proj-1',
              title: 'Insurance Management Platform',
              description: '',
              link: '',
              techStack: ['Angular', 'PrimeNG', '.NET Core', 'MongoDB', 'Azure'],
              bulletPoints: [
                'Developed case management, workflow, and document management features.',
                'Implemented advanced search, filtering, and dashboard with real-time data.',
                'Designed scalable APIs and optimized MongoDB queries for large datasets.'
              ]
            },
            {
              id: 'proj-2',
              title: 'ERP SaaS Platform',
              description: '',
              link: '',
              techStack: ['React', '.NET Core', 'MongoDB', 'Docker', 'Azure'],
              bulletPoints: [
                'Built a multi-tenant ERP system for companies, outlets, users, products, and accounts.',
                'Implemented role-based access control and data isolation for tenants.',
                'Integrated payment gateway and subscription management.'
              ]
            }
          ],
          certifications: [
            { id: 'c1', title: 'Microsoft Azure Fundamentals', issuer: 'Microsoft', date: '2023' },
            { id: 'c2', title: 'ASP.NET Core Developer', issuer: 'Microsoft', date: '2022' },
            { id: 'c3', title: 'MongoDB Developer Associate', issuer: 'MongoDB', date: '2023' },
            { id: 'c4', title: 'Agile & Scrum Foundation', issuer: 'Scrum Alliance', date: '2021' }
          ],
          awards: [
            { id: 'a1', title: 'Employee of the Year', issuer: 'Company', date: '2024', description: '' },
            { id: 'a2', title: 'Best Technical Contributor', issuer: 'Company', date: '2023', description: '' },
            { id: 'a3', title: 'Excellence in Team Leadership', issuer: 'Company', date: '2022', description: '' },
            { id: 'a4', title: 'On-the-Spot Award', issuer: 'Company', date: '2021', description: '' }
          ],
          extraCurriculars: [
            { id: 'e1', organization: 'GitHub', role: 'Open-source contributor on GitHub', startDate: '', endDate: '' },
            { id: 'e2', organization: 'Tech Blog', role: 'Technical blogger and article writer', startDate: '', endDate: '' },
            { id: 'e3', organization: 'Community', role: 'Mentor for junior developers', startDate: '', endDate: '' },
            { id: 'e4', organization: 'Tech Community', role: 'Active member of tech communities', startDate: '', endDate: '' }
          ],
          languages: [
            { id: 'l1', name: 'English', proficiency: 90 },
            { id: 'l2', name: 'Bengali', proficiency: 100 },
            { id: 'l3', name: 'German', proficiency: 65 },
            { id: 'l4', name: 'Hindi', proficiency: 80 }
          ],
          updatedAt: new Date().toISOString()
        };

        await cvCollection.insertOne(defaultCv);
        profiles = [defaultCv];
      } else {
        profiles = profiles.map(p => {
          if (!p.personalInfo || !p.personalInfo.fullName) {
            if (!p.personalInfo) p.personalInfo = {};
            p.personalInfo.fullName = userName;
            p.personalInfo.email = userEmail;
          }
          if (!p.languages) {
            p.languages = [
              { id: 'l1', name: 'English', proficiency: 90 },
              { id: 'l2', name: 'Bengali', proficiency: 100 },
              { id: 'l3', name: 'German', proficiency: 65 },
              { id: 'l4', name: 'Hindi', proficiency: 80 }
            ];
          }
          return p;
        });
      }

      return res.status(200).json({ success: true, profiles });
    }

    // 2. POST / PUT: Create/Update CV profile in MongoDB Atlas
    if (req.method === 'POST' || req.method === 'PUT') {
      const updatedProfile = req.body || {};
      updatedProfile.userId = userId;
      updatedProfile.updatedAt = new Date().toISOString();

      if (!updatedProfile.id) {
        updatedProfile.id = 'cv-' + Date.now();
      }

      if (!updatedProfile.personalInfo?.fullName) {
        if (!updatedProfile.personalInfo) updatedProfile.personalInfo = {};
        updatedProfile.personalInfo.fullName = userName;
        updatedProfile.personalInfo.email = userEmail;
      }

      await cvCollection.updateOne(
        { id: updatedProfile.id, userId },
        { $set: updatedProfile },
        { upsert: true }
      );

      return res.status(200).json({ success: true, profile: updatedProfile });
    }

    // 3. DELETE: Delete CV profile
    if (req.method === 'DELETE') {
      const { id } = req.query || req.body || {};
      if (!id) {
        return res.status(400).json({ error: { message: 'Profile ID required.' } });
      }

      await cvCollection.deleteOne({ id, userId });
      return res.status(200).json({ success: true, message: 'CV Profile deleted from MongoDB Atlas.' });
    }

    return res.status(405).json({ error: { message: 'Method Not Allowed' } });
  } catch (error) {
    console.error('MongoDB CV API Error:', error);
    return res.status(500).json({
      error: { message: error.message || 'Database error processing CV profile.' }
    });
  }
}
