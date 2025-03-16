
import React from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <PageTransition>
      <div className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center">
          <div 
            className="absolute inset-0 z-0 bg-gradient-to-b from-secondary/40 to-transparent" 
            aria-hidden="true"
          />
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium mb-6">
                  Prof. John Smith
                </h1>
                <div className="h-1 w-20 bg-primary mb-6"></div>
                <h2 className="text-xl md:text-2xl text-muted-foreground mb-8">
                  Professor of Computer Science<br />
                  University of Technology
                </h2>
                <p className="text-lg md:text-xl mb-8 max-w-lg">
                  Exploring the frontiers of artificial intelligence, machine learning, 
                  and quantum computing to solve complex real-world problems.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    to="/about" 
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-md flex items-center gap-2 transition-colors hover:bg-primary/90"
                  >
                    <span>Learn More</span>
                    <ArrowRight size={18} />
                  </Link>
                  <Link 
                    to="/contact" 
                    className="px-6 py-3 border border-primary text-primary rounded-md transition-colors hover:bg-accent"
                  >
                    Get in Touch
                  </Link>
                </div>
              </div>
              <div className="order-1 md:order-2 flex justify-center md:justify-end animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 to-secondary/40 rounded-2xl blur-md"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
                    alt="Professor John Smith" 
                    className="w-full max-w-md rounded-xl object-cover relative z-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Research Highlights */}
        <section className="py-16 md:py-24 bg-accent">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif font-medium mb-12 text-center">
              Research Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Quantum Computing",
                  description: "Developing quantum algorithms for machine learning and optimization problems.",
                  delay: "0s"
                },
                {
                  title: "Ethical AI",
                  description: "Creating frameworks for responsible AI development and deployment.",
                  delay: "0.2s"
                },
                {
                  title: "Distributed Systems",
                  description: "Building efficient AI models for edge computing and federated learning.",
                  delay: "0.4s"
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="bg-white p-8 rounded-lg border animate-slide-up shadow-sm"
                  style={{ animationDelay: item.delay }}
                >
                  <h3 className="text-xl font-serif font-medium mb-4">{item.title}</h3>
                  <p className="text-muted-foreground mb-6">{item.description}</p>
                  <Link 
                    to="/research" 
                    className="text-primary hover-underline-animation inline-flex items-center gap-1"
                  >
                    <span>Learn more</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Publications */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4 text-center">
              Recent Publications
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              My latest contributions to academic research in artificial intelligence and computer science.
            </p>
            <div className="max-w-4xl mx-auto space-y-6">
              {[
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
              ].map((pub, index) => (
                <div 
                  key={index} 
                  className="p-6 border rounded-md bg-white animate-slide-up shadow-sm"
                  style={{ animationDelay: pub.delay }}
                >
                  <h3 className="text-xl font-semibold font-serif mb-2">{pub.title}</h3>
                  <p className="text-muted-foreground mb-2">{pub.authors}</p>
                  <div className="text-sm text-muted-foreground">
                    <span>{pub.venue}</span>
                    <span className="mx-2">•</span>
                    <span>{pub.year}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link 
                to="/publications" 
                className="px-6 py-3 border border-primary text-primary rounded-md transition-colors hover:bg-accent inline-flex items-center gap-2"
              >
                <span>View All Publications</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* Teaching */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif font-medium mb-12 text-center">
              Current Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
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
              ].map((course, index) => (
                <div 
                  key={index} 
                  className="bg-white p-8 rounded-lg border animate-slide-up shadow-sm"
                  style={{ animationDelay: course.delay }}
                >
                  <div className="mb-4">
                    <span className="text-sm font-medium bg-muted px-3 py-1 rounded-full">
                      {course.term}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif font-medium mb-2">
                    {course.code}: {course.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">{course.description}</p>
                  <Link 
                    to="/teaching" 
                    className="text-primary hover-underline-animation inline-flex items-center gap-1"
                  >
                    <span>Course details</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6">
                Get in Touch
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Interested in collaboration, speaking engagements, or student opportunities? 
                I welcome messages from colleagues, students, and industry partners.
              </p>
              <Link 
                to="/contact" 
                className="px-8 py-4 bg-primary text-primary-foreground rounded-md transition-colors hover:bg-primary/90 inline-block"
              >
                Contact Me
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Home;
