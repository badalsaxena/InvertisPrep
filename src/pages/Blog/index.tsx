import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, User, BookOpen, ChevronRight } from "lucide-react";

// Blog post data
const blogPosts = [
  {
    id: 1,
    title: "How to Ace Your Invertis University Exams",
    description: "Effective study techniques and strategies for scoring high in university exams.",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1000&auto=format&fit=crop",
    category: "Study Tips",
    author: "Dr. Sharma",
    date: "May 10, 2024",
    readTime: "8 min read",
    tags: ["Exams", "Study Techniques", "Time Management"]
  },
  {
    id: 2,
    title: "The Ultimate Guide to Invertis University Resources",
    description: "Discover all the hidden resources and facilities available to Invertis students.",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1000&auto=format&fit=crop",
    category: "Campus Guide",
    author: "Ravi Kumar",
    date: "April 25, 2024",
    readTime: "6 min read",
    tags: ["Campus", "Resources", "Facilities"]
  },
  {
    id: 3,
    title: "Preparing for Competitive Programming Contests",
    description: "Tips and tricks to excel in programming competitions and hackathons.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop",
    category: "Programming",
    author: "Anjali Mehta",
    date: "April 12, 2024",
    readTime: "12 min read",
    tags: ["Coding", "Algorithms", "Contests"]
  },
  {
    id: 4,
    title: "Internship Opportunities for Invertis Students",
    description: "How to find and apply for the best internships during your university years.",
    image: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?q=80&w=1000&auto=format&fit=crop",
    category: "Career",
    author: "Priya Singh",
    date: "March 28, 2024",
    readTime: "9 min read",
    tags: ["Internships", "Career", "Job Hunt"]
  },
  {
    id: 5,
    title: "Building Your Portfolio as a Computer Science Student",
    description: "Essential projects and skills to develop for an impressive CS portfolio.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop",
    category: "Portfolio",
    author: "Vishal Joshi",
    date: "March 15, 2024",
    readTime: "10 min read",
    tags: ["Portfolio", "Projects", "Skills"]
  }
];

export default function Blog() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Blog Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">InvertisPrep Blog</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Latest insights, tips, and resources for Invertis University students to excel in academics and beyond.
        </p>
      </div>

      {/* Featured Post */}
      <div className="mb-16">
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="h-64 md:h-auto overflow-hidden">
              <img 
                src={blogPosts[0].image} 
                alt={blogPosts[0].title} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <Badge className="w-fit mb-3">{blogPosts[0].category}</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{blogPosts[0].title}</h2>
              <p className="text-gray-600 mb-6">{blogPosts[0].description}</p>
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <User className="h-4 w-4 mr-1" />
                <span className="mr-4">{blogPosts[0].author}</span>
                <Calendar className="h-4 w-4 mr-1" />
                <span className="mr-4">{blogPosts[0].date}</span>
                <Clock className="h-4 w-4 mr-1" />
                <span>{blogPosts[0].readTime}</span>
              </div>
              <Button className="w-fit">
                <Link to={`/blog/${blogPosts[0].id}`} className="flex items-center w-full h-full">
                  Read Article <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.slice(1).map((post) => (
          <Card key={post.id} className="overflow-hidden flex flex-col h-full">
            <div className="h-48 overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <CardHeader className="flex-grow">
              <div className="flex items-center justify-between mb-2">
                <Badge>{post.category}</Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{post.readTime}</span>
                </div>
              </div>
              <CardTitle className="text-xl">{post.title}</CardTitle>
              <CardDescription className="line-clamp-2">{post.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center text-sm text-gray-500">
                <User className="h-3 w-3 mr-1" />
                <span className="mr-3">{post.author}</span>
                <Calendar className="h-3 w-3 mr-1" />
                <span>{post.date}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Link to={`/blog/${post.id}`} className="flex items-center justify-center w-full h-full">
                  Read Article
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Newsletter Subscription */}
      <div className="mt-20 bg-indigo-50 p-8 rounded-xl">
        <div className="text-center max-w-2xl mx-auto">
          <BookOpen className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Subscribe to our Newsletter</h2>
          <p className="text-gray-600 mb-6">Stay updated with the latest articles, study tips, and campus events.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="px-4 py-3 rounded-md border border-gray-300 flex-grow"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  );
} 