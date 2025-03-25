
import React from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { useHomeData, stripHtml } from '@/hooks/useHomeData';

// Import the new component files
import Hero from '@/components/home/Hero';
import ResearchHighlights from '@/components/home/ResearchHighlights';
import RecentPublications from '@/components/home/RecentPublications';
import CurrentCourses from '@/components/home/CurrentCourses';
import ContactCTA from '@/components/home/ContactCTA';

const Home = () => {
  // Use our custom hook to fetch all data
  const { professor, publications, courses, researchProjects } = useHomeData();

  // Format research areas for display
  const researchAreas = researchProjects.length > 0 
    ? researchProjects.map((project, index) => {
        // Strip HTML tags from description for summary display
        const plainDescription = stripHtml(project.description);
        return {
          id: project.id,
          title: project.title,
          description: plainDescription.substring(0, 100) + (plainDescription.length > 100 ? '...' : ''),
          cover_image_url: project.cover_image_url,
          delay: `${index * 0.2}s`
        };
      })
    : [
        {
          id: "demo-1",
          title: "Quantum Computing",
          description: "Developing quantum algorithms for machine learning and optimization problems.",
          delay: "0s"
        },
        {
          id: "demo-2",
          title: "Ethical AI",
          description: "Creating frameworks for responsible AI development and deployment.",
          delay: "0.2s"
        },
        {
          id: "demo-3",
          title: "Distributed Systems",
          description: "Building efficient AI models for edge computing and federated learning.",
          delay: "0.4s"
        }
      ];

  // Format courses for display
  const displayCourses = courses.length > 0
    ? courses.map((course, index) => ({
        code: course.code,
        title: course.title,
        term: `${course.semester} ${course.year}`,
        description: course.description.substring(0, 100) + (course.description.length > 100 ? '...' : ''),
        cover_image_url: course.cover_image_url,
        delay: `${index * 0.2}s`
      }))
    : [
        {
          code: "CS 401",
          title: "Advanced Artificial Intelligence",
          term: "Fall 2023",
          description: "Graduate-level course exploring cutting-edge topics in AI.",
          delay: "0s"
        },
        {
          code: "CS 301",
          title: "Machine Learning",
          term: "Fall 2023",
          description: "Undergraduate introduction to machine learning algorithms and applications.",
          delay: "0.2s"
        },
        {
          code: "CS 201",
          title: "Data Structures and Algorithms",
          term: "Spring 2024",
          description: "Core undergraduate course on essential programming fundamentals.",
          delay: "0.4s"
        }
      ];

  // Format publications for display
  const recentPublications = publications.length > 0
    ? publications.map((pub, index) => ({
        title: pub.title,
        authors: Array.isArray(pub.authors) ? pub.authors.join(', ') : pub.authors,
        venue: pub.venue,
        year: pub.date,
        cover_image_url: pub.cover_image_url,
        delay: `${index * 0.2}s`
      }))
    : [
        {
          title: "Quantum Computing Approaches for Complex Optimization Problems",
          authors: "John Smith, Emily Chen, David Johnson",
          venue: "IEEE Transactions on Quantum Computing",
          year: "2023",
          delay: "0s"
        },
        {
          title: "Machine Learning Techniques for Large-Scale Distributed Systems",
          authors: "Sarah Wong, John Smith, Michael Brown",
          venue: "ACM Computing Surveys",
          year: "2022",
          delay: "0.2s"
        },
        {
          title: "Ethical Considerations in Artificial Intelligence Research",
          authors: "John Smith, Alexandra Martinez",
          venue: "Journal of AI Ethics",
          year: "2022",
          delay: "0.4s"
        }
      ];

  return (
    <PageTransition>
      <div className="pt-20">
        {/* Hero Section */}
        <Hero professor={professor} />

        {/* Research Highlights */}
        <ResearchHighlights researchAreas={researchAreas} />

        {/* Recent Publications */}
        <RecentPublications publications={recentPublications} />

        {/* Teaching */}
        <CurrentCourses courses={displayCourses} />

        {/* Contact CTA */}
        <ContactCTA />
      </div>
    </PageTransition>
  );
};

export default Home;
