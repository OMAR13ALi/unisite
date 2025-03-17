
import React, { useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import ReactMarkdown from 'react-markdown';
import { Bookmark } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

// Function to fetch teaching page content
const fetchTeachingContent = async () => {
  const { data, error } = await supabase
    .from('page_content')
    .select('content')
    .eq('page', 'teaching')
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching teaching content:', error);
    // Fallback to markdown file if database fetch fails
    const response = await fetch('/src/data/teaching.md');
    return { content: await response.text() };
  }
  
  if (!data) {
    // Fallback to markdown file if no data in database
    const response = await fetch('/src/data/teaching.md');
    return { content: await response.text() };
  }
  
  return data;
};

// Function to fetch courses from Supabase
const fetchCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('status', 'active')
    .order('code', { ascending: true });
  
  if (error) throw error;
  return data || [];
};

const Teaching = () => {
  // Fetch teaching content using React Query
  const { data: contentData, isLoading: isLoadingContent } = useQuery({
    queryKey: ['teachingContent'],
    queryFn: fetchTeachingContent
  });

  // Fetch courses using React Query
  const { data: coursesData = [], isLoading: isLoadingCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses
  });
  
  const isLoading = isLoadingContent || isLoadingCourses;
  const content = contentData?.content || '';

  // Map courses data or use fallback if no courses in database
  const courses = coursesData.length > 0 ? coursesData.map(course => ({
    code: course.code,
    title: course.title,
    level: course.code.startsWith('4') || course.code.startsWith('5') ? 'Graduate' : 'Undergraduate',
    term: `${course.semester} ${course.year}`,
    description: course.description,
    syllabus: "#",
    highlights: course.highlights || [
      "Course materials and resources",
      "Interactive learning activities",
      "Project-based assessments",
      "In-depth discussions"
    ]
  })) : [
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
