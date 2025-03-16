
import React, { useEffect, useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import ReactMarkdown from 'react-markdown';

const Research = () => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Similar approach as in About.tsx to load markdown content
    // In a real implementation, this would fetch the actual markdown file
    import('@/data/research.md')
      .then(module => {
        fetch(module.default)
          .then(response => response.text())
          .then(text => {
            setContent(text);
            setIsLoading(false);
          })
          .catch(err => {
            console.error('Failed to fetch markdown:', err);
            // Fallback content
            setContent(`
# Research

My research program focuses on developing novel computational approaches to solve complex problems in artificial intelligence, machine learning, and quantum computing. I lead the Intelligent Systems Laboratory at the University of Technology, where we explore the theoretical foundations and practical applications of these technologies.

## Current Research Areas

### Quantum Machine Learning

We are developing new algorithms that leverage quantum computing principles to enhance machine learning capabilities. Our recent work focuses on quantum neural networks and quantum-enhanced optimization for training deep learning models. Key projects include:

- **Quantum Variational Autoencoders**: Developing quantum versions of variational autoencoders that can process high-dimensional data more efficiently than classical counterparts.
- **Quantum Reinforcement Learning**: Exploring how quantum algorithms can accelerate reinforcement learning tasks in complex environments.

### Ethical AI and Fairness

My lab is deeply committed to addressing the ethical challenges in AI development and deployment. We are working on:

- **Interpretable AI Systems**: Building models that provide transparent explanations for their decisions and recommendations.
- **Algorithmic Fairness**: Developing techniques to detect and mitigate bias in machine learning systems, with a focus on applications in healthcare and criminal justice.
- **Privacy-Preserving Machine Learning**: Creating methods for training models on sensitive data while preserving individual privacy.

### Distributed AI Systems

We are pioneering approaches for deploying AI in distributed environments:

- **Federated Learning at Scale**: Enhancing federated learning techniques to work effectively across heterogeneous devices and networks.
- **Edge AI Optimization**: Developing lightweight models and optimization techniques for AI deployment on edge devices with limited computational resources.

## Research Collaborations

Our lab collaborates with various academic institutions and industry partners, including:

- **QuantumTech Research Initiative**: A multi-university collaboration exploring quantum computing applications.
- **Healthcare AI Consortium**: Working with medical institutions to develop ethical AI solutions for healthcare challenges.
- **Industry Partners**: Collaborations with technology companies to bridge theoretical research and practical applications.

## Funding

Our research is generously supported by grants from:

- National Science Foundation (NSF)
- Department of Energy (DOE)
- National Institutes of Health (NIH)
- Industry partnerships and university research grants

## Join Our Lab

We are always looking for talented graduate students and postdoctoral researchers to join our lab. If you are interested in our research areas, please visit the [Contact](/contact) page for more information about application procedures.
            `);
            setIsLoading(false);
          });
      })
      .catch(err => {
        console.error('Failed to load research module:', err);
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
              Research
            </h1>
            <div className="h-1 w-20 bg-primary mx-auto mb-8"></div>
          </div>
          
          {/* Content */}
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
          
          {/* Research Areas Visualization */}
          <div className="max-w-5xl mx-auto mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Quantum Computing",
                  image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
                  description: "Exploring quantum algorithms for machine learning and optimization problems.",
                  delay: "0s"
                },
                {
                  title: "Ethical AI",
                  image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
                  description: "Developing frameworks for responsible AI development and deployment.",
                  delay: "0.2s"
                },
                {
                  title: "Distributed Systems",
                  image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
                  description: "Building efficient AI models for edge computing and federated learning.",
                  delay: "0.4s"
                }
              ].map((area, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg overflow-hidden border shadow-sm animate-slide-up"
                  style={{ animationDelay: area.delay }}
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={area.image} 
                      alt={area.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-medium mb-3">{area.title}</h3>
                    <p className="text-muted-foreground">{area.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Research;
