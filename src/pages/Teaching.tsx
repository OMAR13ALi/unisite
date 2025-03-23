
import React, { useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import ReactMarkdown from 'react-markdown';
import { Bookmark, FileText, Book, Calendar, ListChecks, BookOpen, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

// Function to fetch teaching page content
const fetchTeachingContent = async () => {
  try {
    const { data, error } = await supabase
      .from('page_content')
      .select('content')
      .eq('page', 'teaching')
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching teaching content:', error);
      // Fallback to markdown file
      const response = await fetch('/src/data/teaching.md');
      return { content: await response.text() };
    }
    
    if (!data) {
      // Fallback to markdown file if no data in database
      const response = await fetch('/src/data/teaching.md');
      const content = await response.text();
      
      // Insert the content into the database for future use
      try {
        await supabase
          .from('page_content')
          .insert({
            page: 'teaching',
            content: content
          })
          .select();
      } catch (insertError) {
        console.error('Error inserting teaching content:', insertError);
      }
      
      return { content };
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchTeachingContent:', error);
    // Fallback to markdown file
    const response = await fetch('/src/data/teaching.md');
    return { content: await response.text() };
  }
};

// Function to fetch courses from Supabase
const fetchCourses = async () => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('status', 'active')
      .order('code', { ascending: true });
    
    if (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchCourses:', error);
    return [];
  }
};

// Function to fetch course materials from Supabase
const fetchCourseMaterials = async (courseId: string) => {
  try {
    const { data, error } = await supabase
      .from('course_materials')
      .select('*')
      .eq('course_id', courseId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching materials for course ${courseId}:`, error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error(`Error in fetchCourseMaterials for ${courseId}:`, error);
    return [];
  }
};

// Get icon for material type
const getMaterialTypeIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return <FileText className="h-6 w-6 text-primary shrink-0 mt-1" />;
    case 'syllabus':
      return <BookOpen className="h-6 w-6 text-primary shrink-0 mt-1" />;
    case 'assignment':
      return <ListChecks className="h-6 w-6 text-primary shrink-0 mt-1" />;
    case 'exam':
      return <Calendar className="h-6 w-6 text-primary shrink-0 mt-1" />;
    case 'video':
      return <Video className="h-6 w-6 text-primary shrink-0 mt-1" />;
    default:
      return <FileText className="h-6 w-6 text-primary shrink-0 mt-1" />;
  }
};

// Check if file is a video
const isVideoFile = (filePath: string): boolean => {
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
  return videoExtensions.some(ext => filePath.toLowerCase().endsWith(ext));
};

// Render material content based on type
const renderMaterialContent = (material: any) => {
  if (material.type === 'video' || isVideoFile(material.file_path)) {
    return (
      <a 
        key={material.id}
        href={material.file_path}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-accent/20 rounded-lg p-4 hover:bg-accent/30 transition-colors"
      >
        <div className="flex items-start gap-3">
          <Video className="h-6 w-6 text-primary shrink-0 mt-1" />
          <div>
            <h5 className="font-medium">{material.title}</h5>
            {material.description && (
              <p className="text-sm text-muted-foreground mt-1">{material.description}</p>
            )}
          </div>
        </div>
      </a>
    );
  }
  
  return (
    <a 
      key={material.id}
      href={material.file_path}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-accent/20 rounded-lg p-4 hover:bg-accent/30 transition-colors"
    >
      <div className="flex items-start gap-3">
        {getMaterialTypeIcon(material.type)}
        <div>
          <h5 className="font-medium">{material.title}</h5>
          {material.description && (
            <p className="text-sm text-muted-foreground mt-1">{material.description}</p>
          )}
        </div>
      </div>
    </a>
  );
};

const Teaching = () => {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  
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
  
  // Fetch course materials using React Query
  const { data: materialsData = [], isLoading: isLoadingMaterials } = useQuery({
    queryKey: ['courseMaterials', selectedCourse],
    queryFn: () => selectedCourse ? fetchCourseMaterials(selectedCourse) : Promise.resolve([]),
    enabled: !!selectedCourse,
  });
  
  const isLoading = isLoadingContent || isLoadingCourses;
  const content = contentData?.content || '';

  // Map courses data or use fallback if no courses in database
  const courses = coursesData.length > 0 ? coursesData.map(course => ({
    id: course.id,
    code: course.code,
    title: course.title,
    level: course.code.startsWith('4') || course.code.startsWith('5') ? 'Graduate' : 'Undergraduate',
    term: `${course.semester} ${course.year}`,
    description: course.description,
    syllabus: "#", // This would ideally be a link to a syllabus document
    highlights: course.highlights && course.highlights.length > 0 ? course.highlights : [
      "Course materials and resources",
      "Interactive learning activities",
      "Project-based assessments",
      "In-depth discussions"
    ]
  })) : [
    {
      id: "fallback-1",
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
      id: "fallback-2",
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
      id: "fallback-3",
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

  // Group materials by type
  const groupedMaterials = materialsData.reduce((acc, material) => {
    if (!acc[material.type]) {
      acc[material.type] = [];
    }
    acc[material.type].push(material);
    return acc;
  }, {} as Record<string, any[]>);

  // Add videos tab if there are videos
  const hasVideos = materialsData.some(material => material.type === 'video' || isVideoFile(material.file_path));

  // Get the selected course details
  const selectedCourseDetails = selectedCourse 
    ? courses.find(course => course.id === selectedCourse) 
    : null;

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
          
          {/* Courses Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-serif font-medium mb-8 text-center">Current Courses</h2>
            
            {selectedCourse ? (
              // Course Detail View
              <div className="animate-fade-in">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <Button 
                      variant="ghost" 
                      onClick={() => setSelectedCourse(null)}
                      className="mb-4"
                    >
                      ← Back to All Courses
                    </Button>
                    <h3 className="text-2xl font-serif font-medium">{selectedCourseDetails?.code}: {selectedCourseDetails?.title}</h3>
                    <p className="text-muted-foreground">{selectedCourseDetails?.term}</p>
                  </div>
                </div>
                
                <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
                  <h4 className="text-lg font-medium mb-2">Course Description</h4>
                  <p className="text-muted-foreground">{selectedCourseDetails?.description}</p>
                </div>
                
                <Tabs defaultValue="syllabus" className="w-full">
                  <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${hasVideos ? 5 : 4}, 1fr)` }}>
                    <TabsTrigger value="syllabus">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Syllabus
                    </TabsTrigger>
                    <TabsTrigger value="lectures">
                      <FileText className="h-4 w-4 mr-2" />
                      Lecture Notes
                    </TabsTrigger>
                    <TabsTrigger value="assignments">
                      <ListChecks className="h-4 w-4 mr-2" />
                      Assignments
                    </TabsTrigger>
                    <TabsTrigger value="exams">
                      <Calendar className="h-4 w-4 mr-2" />
                      Exams
                    </TabsTrigger>
                    {hasVideos && (
                      <TabsTrigger value="videos">
                        <Video className="h-4 w-4 mr-2" />
                        Videos
                      </TabsTrigger>
                    )}
                  </TabsList>
                  
                  {/* Syllabus Tab */}
                  <TabsContent value="syllabus" className="mt-6">
                    {isLoadingMaterials ? (
                      <div className="flex justify-center items-center h-40">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-r-transparent rounded-full"></div>
                      </div>
                    ) : !groupedMaterials.syllabus || groupedMaterials.syllabus.length === 0 ? (
                      <div className="text-center py-10 text-muted-foreground">
                        <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>No syllabus available for this course yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groupedMaterials.syllabus?.map(material => renderMaterialContent(material))}
                      </div>
                    )}
                  </TabsContent>
                  
                  {/* Lecture Notes Tab */}
                  <TabsContent value="lectures" className="mt-6">
                    {isLoadingMaterials ? (
                      <div className="flex justify-center items-center h-40">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-r-transparent rounded-full"></div>
                      </div>
                    ) : !groupedMaterials.pdf || groupedMaterials.pdf.length === 0 ? (
                      <div className="text-center py-10 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>No lecture materials available for this course yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groupedMaterials.pdf?.map(material => renderMaterialContent(material))}
                      </div>
                    )}
                  </TabsContent>
                  
                  {/* Assignments Tab */}
                  <TabsContent value="assignments" className="mt-6">
                    {isLoadingMaterials ? (
                      <div className="flex justify-center items-center h-40">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-r-transparent rounded-full"></div>
                      </div>
                    ) : !groupedMaterials.assignment || groupedMaterials.assignment.length === 0 ? (
                      <div className="text-center py-10 text-muted-foreground">
                        <ListChecks className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>No assignments available for this course yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groupedMaterials.assignment?.map(material => renderMaterialContent(material))}
                      </div>
                    )}
                  </TabsContent>
                  
                  {/* Exams Tab */}
                  <TabsContent value="exams" className="mt-6">
                    {isLoadingMaterials ? (
                      <div className="flex justify-center items-center h-40">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-r-transparent rounded-full"></div>
                      </div>
                    ) : !groupedMaterials.exam || groupedMaterials.exam.length === 0 ? (
                      <div className="text-center py-10 text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>No exam materials available for this course yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groupedMaterials.exam?.map(material => renderMaterialContent(material))}
                      </div>
                    )}
                  </TabsContent>
                  
                  {/* Videos Tab */}
                  {hasVideos && (
                    <TabsContent value="videos" className="mt-6">
                      {isLoadingMaterials ? (
                        <div className="flex justify-center items-center h-40">
                          <div className="animate-spin h-8 w-8 border-4 border-primary border-r-transparent rounded-full"></div>
                        </div>
                      ) : !groupedMaterials.video || (groupedMaterials.video?.length === 0 && !materialsData.some(m => m.type !== 'video' && isVideoFile(m.file_path))) ? (
                        <div className="text-center py-10 text-muted-foreground">
                          <Video className="h-12 w-12 mx-auto mb-3 opacity-30" />
                          <p>No video materials available for this course yet.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Display videos with type 'video' */}
                          {groupedMaterials.video?.map(material => renderMaterialContent(material))}
                          
                          {/* Also display videos with file extensions that indicate video */}
                          {Object.entries(groupedMaterials).map(([type, materials]) => 
                            type !== 'video' ? materials.filter(m => isVideoFile(m.file_path)).map(material => renderMaterialContent(material)) : null
                          )}
                        </div>
                      )}
                    </TabsContent>
                  )}
                </Tabs>
              </div>
            ) : (
              // Course Listing View
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course, index) => (
                  <div 
                    key={course.id} 
                    className="bg-white rounded-lg border shadow-sm overflow-hidden animate-slide-up cursor-pointer"
                    style={{ animationDelay: `${index * 0.2}s` }}
                    onClick={() => setSelectedCourse(course.id)}
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
                      <Button 
                        variant="ghost" 
                        className="text-sm text-primary hover:underline-animation"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCourse(course.id);
                        }}
                      >
                        View Course Materials
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Teaching Philosophy and Resources */}
          {!selectedCourse && (
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
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Teaching;
