
import React, { useEffect, useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { FileDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const About = () => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch the actual markdown file
    import('@/data/about.md')
      .then(res => {
        // Since we can't actually import markdown in this setup,
        // we'll use a raw string that we've stored in the data folder
        // This is just a simulation of how it would work
        // @ts-ignore
        setContent(res.default);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load about content:', err);
        setIsLoading(false);
      });
      
    // For now, let's manually set the content from our data
    import('@/data/about.md')
      .then(module => {
        fetch(module.default)
          .then(response => response.text())
          .then(text => {
            setContent(text);
            setIsLoading(false);
          })
          .catch(err => {
            console.error('Failed to fetch markdown:', err);
            // Fallback content if fetch fails
            setContent(`
# About Me

I am a Professor of Computer Science at the University of Technology, specializing in artificial intelligence, machine learning, and quantum computing. My research focuses on developing novel computational models and algorithms to solve complex real-world problems.

## Education

- **Ph.D. in Computer Science**, Stanford University, 2010
- **M.S. in Computer Science**, Massachusetts Institute of Technology, 2006
- **B.S. in Mathematics and Computer Science**, University of California, Berkeley, 2004

## Academic Appointments

- **Professor**, University of Technology, Department of Computer Science, 2018-Present
- **Associate Professor**, University of Technology, Department of Computer Science, 2014-2018
- **Assistant Professor**, University of Technology, Department of Computer Science, 2010-2014
- **Visiting Researcher**, Google Research, Summer 2016
- **Visiting Professor**, ETH Zurich, 2015

## Awards and Honors

- ACM Distinguished Scientist, 2022
- University Research Excellence Award, 2020
- NSF CAREER Award, 2012
- Outstanding Dissertation Award, Stanford University, 2010
- IEEE Young Researcher Award, 2009

## Professional Activities

- **Associate Editor**, Journal of Artificial Intelligence Research, 2018-Present
- **Program Committee Member**, NeurIPS, ICML, AAAI, 2014-Present
- **Board Member**, AI Ethics Council, 2019-Present
- **Chair**, ACM Special Interest Group on Artificial Intelligence, 2020-2022

## Personal

When not engaged in research or teaching, I enjoy hiking, playing chess, and exploring the intersections of technology and art. I am particularly interested in the role of AI in creative processes and the philosophical implications of advanced computational systems.
            `);
            setIsLoading(false);
          });
      })
      .catch(err => {
        console.error('Failed to load about module:', err);
        setIsLoading(false);
      });
  }, []);

  return (
    <PageTransition>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium mb-6 animate-slide-down">
              About Me
            </h1>
            <div className="h-1 w-20 bg-primary mx-auto mb-8"></div>
          </div>
          
          {/* Profile Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
              <div className="md:col-span-1 order-2 md:order-1">
                <div className="sticky top-24 animate-slide-up">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 to-secondary/40 rounded-2xl blur-md"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
                      alt="Professor John Smith" 
                      className="w-full rounded-xl relative z-10" 
                    />
                  </div>
                  
                  <div className="mt-8 text-center">
                    <a 
                      href="#" 
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md transition-colors hover:bg-primary/90"
                    >
                      <FileDown size={18} />
                      <span>Download CV</span>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2 order-1 md:order-2">
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
        </div>
      </div>
    </PageTransition>
  );
};

export default About;
