
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Course {
  code: string;
  title: string;
  term: string;
  description: string;
  cover_image_url?: string;
  delay: string;
}

interface CurrentCoursesProps {
  courses: Course[];
}

const CurrentCourses: React.FC<CurrentCoursesProps> = ({ courses }) => {
  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif font-medium mb-12 text-center">
          Current Courses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg border overflow-hidden animate-slide-up shadow-sm h-full flex flex-col"
              style={{ animationDelay: course.delay }}
            >
              {course.cover_image_url ? (
                <div className="h-48 w-full overflow-hidden">
                  <img 
                    src={course.cover_image_url} 
                    alt={course.title}
                    className="w-full h-full object-cover" 
                  />
                </div>
              ) : (
                <div className="h-48 w-full bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center">
                  <span className="text-3xl font-serif font-medium text-primary/40">{course.code}</span>
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <span className="text-sm font-medium bg-muted px-3 py-1 rounded-full">
                    {course.term}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-medium mb-2">
                  {course.code}: {course.title}
                </h3>
                <p className="text-muted-foreground mb-6 flex-1">{course.description}</p>
                <Link 
                  to="/teaching" 
                  className="text-primary hover-underline-animation inline-flex items-center gap-1 mt-auto"
                >
                  <span>Course details</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CurrentCourses;
