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
  const userName = authUser ? authUser.name : 'Guest Developer';
  const userEmail = authUser ? authUser.email : 'guest@example.com';

  try {
    const { db } = await connectToDatabase();
    const cvCollection = db.collection('cv_profiles');

    // 1. GET: Fetch CV Profiles for user
    if (req.method === 'GET') {
      let profiles = await cvCollection.find({ userId }).toArray();

      // If user has no CV profiles yet, create a default profile with THEIR name & email
      if (profiles.length === 0) {
        const defaultCv = {
          id: 'cv-' + Date.now(),
          userId,
          title: 'Primary Professional Profile',
          targetRole: 'Senior Full-Stack Engineer',
          templateStyle: 'modern',
          fontSize: 'base',
          spacing: 'normal',
          personalInfo: {
            fullName: userName,
            jobTitle: 'Senior Full-Stack Engineer',
            email: userEmail,
            phone: '+880 1700-000000',
            location: 'Dhaka, Bangladesh',
            website: '',
            github: '',
            linkedin: '',
            avatarUrl: '',
            summary: `Passionate Software Engineer experienced in building scalable applications, web platforms, and modern AI integrations.`
          },
          experiences: [
            {
              id: 'exp-1',
              company: 'SELISE Digital Platforms',
              role: 'Senior Software Engineer',
              location: 'Dhaka, Bangladesh',
              startDate: '2023-01',
              endDate: 'Present',
              isCurrent: true,
              bulletPoints: [
                'Architected scalable reactive web applications.',
                'Engineered backend API microservices and database integrations.'
              ]
            }
          ],
          education: [
            {
              id: 'edu-1',
              institution: 'University of Science and Technology',
              degree: 'Bachelor of Science',
              fieldOfStudy: 'Computer Science & Engineering',
              location: 'Dhaka, Bangladesh',
              startDate: '2019',
              endDate: '2023'
            }
          ],
          skillCategories: [
            {
              id: 'cat-1',
              name: 'Frontend & UI',
              skills: ['Angular', 'TypeScript', 'RxJS', 'Tailwind CSS', 'HTML5/CSS3']
            },
            {
              id: 'cat-2',
              name: 'Backend & Database',
              skills: ['Node.js', 'Next.js', 'MongoDB Atlas', 'REST APIs']
            }
          ],
          projects: [],
          certifications: [],
          updatedAt: new Date().toISOString()
        };

        await cvCollection.insertOne(defaultCv);
        profiles = [defaultCv];
      } else {
        // Enforce logged-in user name and email on fetched profiles if they match defaults
        profiles = profiles.map(p => {
          if (authUser && (p.personalInfo.fullName === 'Mamun Or Rashid' || p.personalInfo.fullName === 'Guest Developer' || !p.personalInfo.fullName)) {
            p.personalInfo.fullName = userName;
            p.personalInfo.email = userEmail;
          }
          return p;
        });
      }

      return res.status(200).json({ success: true, profiles });
    }

    // 2. POST / PUT: Create/Update CV profile
    if (req.method === 'POST' || req.method === 'PUT') {
      const updatedProfile = req.body || {};
      updatedProfile.userId = userId;
      updatedProfile.updatedAt = new Date().toISOString();

      if (!updatedProfile.id) {
        updatedProfile.id = 'cv-' + Date.now();
      }

      // Enforce logged in name if default
      if (authUser && (!updatedProfile.personalInfo?.fullName || updatedProfile.personalInfo?.fullName === 'Mamun Or Rashid')) {
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
