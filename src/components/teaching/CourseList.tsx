
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash, Book } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';

export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  semester: string;
  year: string;
  status: string;
  created_at: string;
  cover_image_url?: string;
}

interface CourseListProps {
  courses: Course[];
  isLoading: boolean;
  onSelectCourse: (course: Course) => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
}

const CourseList: React.FC<CourseListProps> = ({ 
  courses, 
  isLoading, 
  onSelectCourse, 
  onEditCourse,
  onDeleteCourse 
}) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Loading courses...</p>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="p-8 text-center">
        <Book size={48} className="text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground">No courses found. Add your first course!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {courses.map((course) => (
        <Card key={course.id} className="overflow-hidden h-full flex flex-col">
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
          <CardHeader className="pb-2 flex-shrink-0">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{course.code}</CardTitle>
              <span className={`text-xs px-2 py-1 rounded-full ${
                course.status === 'active' ? 'bg-green-100 text-green-800' :
                course.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
              </span>
            </div>
            <p className="text-base font-medium">{course.title}</p>
            <p className="text-sm text-muted-foreground">{course.semester} {course.year}</p>
          </CardHeader>
          <CardContent className="pt-4 flex-1">
            <p className="text-sm line-clamp-3">{course.description}</p>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4 flex-shrink-0">
            <Button variant="outline" size="sm" onClick={() => onSelectCourse(course)}>
              Manage Materials
            </Button>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEditCourse(course)}
              >
                <Pencil size={16} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onDeleteCourse(course.id)}
              >
                <Trash size={16} />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CourseList;
