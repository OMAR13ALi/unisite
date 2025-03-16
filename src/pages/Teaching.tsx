import React, { useEffect, useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import ReactMarkdown from 'react-markdown';
import { Bookmark } from 'lucide-react';

const Teaching = () => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load markdown content directly with a fetch
    fetch('/src/data/teaching.md')
      .then(response => response.text())
      .then(text => {
        setContent(text);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch markdown:', err);
        // Fallback content
        setContent(`
# Teaching

I am passionate about education and believe in creating engaging learning environments that foster critical thinking and practical skills. My teaching philosophy emphasizes active learning, real-world applications, and inclusive classroom practices.

## Current Courses

### CS 401: Advanced Artificial Intelligence

This graduate-level course explores cutting-edge topics in artificial intelligence, including deep learning, reinforcement learning, and AI ethics. Students engage with recent research papers and develop their own research projects.

**Course Highlights:**
- Deep neural network architectures and training techniques
- Reinforcement learning algorithms and applications
- Ethical considerations in AI development and deployment
- Research paper discussions and critiques

[View Syllabus](#)

### CS 301: Machine Learning

This undergraduate course introduces the fundamental concepts and algorithms in machine learning. Students learn both the theoretical foundations and practical implementations of various learning paradigms.

**Course Highlights:**
- Supervised, unsupervised, and reinforcement learning
- Model evaluation and validation techniques
- Feature engineering and selection
- Practical applications using Python and popular ML libraries

[View Syllabus](#)

### CS 201: Data Structures and Algorithms

This core undergraduate course covers essential data structures and algorithms that form the foundation of computer science. The course emphasizes algorithmic thinking and computational complexity analysis.

**Course Highlights:**
- Arrays, linked lists, trees, and graphs
- Sorting and searching algorithms
- Dynamic programming and greedy algorithms
- Algorithm design techniques and complexity analysis

[View Syllabus](#)

## Previous Courses

- CS 502: Advanced Topics in Quantum Computing (Spring 2022)
- CS 410: Ethics in Computing (Fall 2021)
- CS 310: Database Systems (Spring 2021)
- CS 210: Computer Systems Architecture (Fall 2020)

## Student Resources

### Office Hours

I hold regular office hours to provide additional support and mentoring to students. Current office hours are:

- Mondays: 2:00 PM - 4:00 PM
- Thursdays: 10:00 AM - 12:00 PM

Or by appointment (please email me to schedule).

### Undergraduate Research Opportunities

I regularly mentor undergraduate students on research projects. If you are interested in gaining research experience in AI, machine learning, or theoretical computer science, please contact me with a brief description of your interests and background.

### Graduate Advising

I am currently accepting graduate students interested in artificial intelligence, machine learning, quantum computing, and related areas. Prospective students should review my [Research](/research) page and contact me before applying to discuss potential research directions.
        `);
        setIsLoading(false);
      });
  }, []);

  const courses = [
    {
      code: "CS 401",
      title: "Advanced Artificial Intelligence",
      level: "Graduate",
      term: "Fall 2023",
      description: "This course explores cutting-edge topics in AI, including deep learning, reinforcement learning, and AI ethics.",
      syllabus: "#",
      highlights: [
        "Deep neural network architectures",
        "Reinforcement learning algorithms",
        "Ethical considerations in AI",
        "Research paper discussions"
      ]
    },
    {
      code: "CS 301",
      title: "Machine Learning",
      level: "Undergraduate",
      term: "Fall 2023",
      description: "An introduction to the fundamental concepts and algorithms in machine learning.",
      syllabus: "#",
      highlights: [
        "Supervised and unsupervised learning",
        "Model evaluation techniques",
        "Feature engineering",
        "Practical applications"
      ]
    },
    {
      code: "CS 201",
      title: "Data Structures and Algorithms",
      level: "Undergraduate",
      term: "Spring 2024",
      description: "A core course covering essential data structures and algorithms in computer science.",
      syllabus: "#",
      highlights: [
        "Arrays, linked lists, trees, graphs",
        "Sorting and searching algorithms",
        "Dynamic programming",
        "Algorithm complexity analysis"
      ]
    }
  ];

  return (
    <PageTransition>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium mb-6 animate-slide-down">
              Teaching
            </h1>
            <div className="h-1 w-20 bg-primary mx-auto mb-8"></div>
          </div>
          
          {/* Featured Courses */}
          <div className="mb-16">
            <h2 className="text-3xl font-serif font-medium mb-8 text-center">Current Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <div 
                  key={course.code} 
                  className="bg-white rounded-lg border shadow-sm overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="p-1 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-serif font-medium">{course.code}</h3>
                        <p className="text-lg">{course.title}</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-muted rounded-full">
                        {course.term}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      {course.description}
                    </p>
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold mb-2">Course Highlights:</h4>
                      <ul className="space-y-1">
                        {course.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Bookmark size={16} className="mt-0.5 shrink-0 text-primary/70" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <a 
                      href={course.syllabus} 
                      className="text-sm text-primary hover-underline-animation"
                    >
                      View Syllabus
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Teaching Philosophy and Resources */}
          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-4/5"></div>
                <div className="h-6 bg-muted rounded w-1/2 mt-8"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </div>
            ) : (
              <div className="prose prose-lg max-w-none animate-fade-in">
                <ReactMarkdown>
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Teaching;
