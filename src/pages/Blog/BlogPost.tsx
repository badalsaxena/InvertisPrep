import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, User, ArrowLeft, Share2, BookmarkPlus } from "lucide-react";

// Import the blog posts data 
// In a real application, this would be fetched from an API
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
    tags: ["Exams", "Study Techniques", "Time Management"],
    content: `
      <p class="mb-4">Exam season can be stressful, but with the right strategies, you can boost your confidence and performance. This guide outlines proven techniques to help Invertis University students prepare effectively for their exams.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">1. Create a Strategic Study Plan</h2>
      <p class="mb-4">Start by organizing your study material and breaking it down into manageable chunks. Create a realistic schedule that allows sufficient time for each subject, with more time allocated to challenging topics.</p>
      <p class="mb-4">Use techniques like the Pomodoro method (25 minutes of focused study followed by a 5-minute break) to maintain concentration and prevent burnout.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">2. Active Learning Techniques</h2>
      <p class="mb-4">Passive reading is often ineffective. Instead, engage with the material actively:</p>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Create concise notes and diagrams</li>
        <li>Teach concepts to others (or even to yourself)</li>
        <li>Use flashcards for key definitions and concepts</li>
        <li>Practice with past exam papers</li>
        <li>Join study groups for collaborative learning</li>
      </ul>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">3. Optimize Your Study Environment</h2>
      <p class="mb-4">Your study environment significantly impacts your productivity. Choose a quiet, well-lit space with minimal distractions. The Invertis University library offers excellent study spaces, or you can create an effective study corner in your hostel room.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">4. Utilize University Resources</h2>
      <p class="mb-4">Invertis University offers various resources to support your exam preparation:</p>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Visit professor office hours for clarifications</li>
        <li>Use the digital library for additional reference materials</li>
        <li>Attend review sessions and workshops</li>
        <li>Access online resources through the university portal</li>
      </ul>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">5. Take Care of Your Well-being</h2>
      <p class="mb-4">Maintaining physical and mental health is crucial during exam periods:</p>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Get adequate sleep (7-8 hours per night)</li>
        <li>Stay hydrated and eat nutritious meals</li>
        <li>Take short breaks and incorporate physical activity</li>
        <li>Practice relaxation techniques like deep breathing or meditation</li>
      </ul>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">6. Exam Day Strategies</h2>
      <p class="mb-4">On the day of the exam:</p>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Arrive early and bring all necessary materials</li>
        <li>Read all questions carefully before starting</li>
        <li>Manage your time wisely, allocating minutes per question/section</li>
        <li>Start with questions you're confident about to build momentum</li>
        <li>Leave time to review your answers</li>
      </ul>
      
      <p class="mt-8 font-semibold">Remember, consistent preparation is key. Start early, stay organized, and maintain a positive mindset. With these strategies, you'll be well-equipped to excel in your Invertis University exams.</p>
    `
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
    tags: ["Campus", "Resources", "Facilities"],
    content: `
      <p class="mb-4">Invertis University offers a wealth of resources that many students aren't fully aware of. This comprehensive guide highlights the key facilities available to help you make the most of your university experience.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Library and Learning Resources</h2>
      <p class="mb-4">The university library is more than just books - it's a comprehensive learning center featuring:</p>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Over 50,000 physical books and journals</li>
        <li>Digital subscriptions to major academic databases</li>
        <li>Quiet study zones and collaborative workspaces</li>
        <li>Multimedia resources and computer labs</li>
        <li>Printing and scanning facilities</li>
      </ul>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Research Facilities</h2>
      <p class="mb-4">For students interested in research, the university provides:</p>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Department-specific research labs</li>
        <li>Research grants and funding opportunities</li>
        <li>Access to specialized equipment and software</li>
        <li>Mentorship programs with faculty members</li>
      </ul>
      
      <p class="mb-4">Many students don't realize they can participate in research as undergraduates - reach out to professors in your area of interest to explore opportunities.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Career Development Resources</h2>
      <p class="mb-4">The Career Development Center offers invaluable services:</p>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Resume and cover letter reviews</li>
        <li>Mock interviews and feedback</li>
        <li>Career counseling and planning</li>
        <li>Industry connections and networking events</li>
        <li>Job and internship boards specific to your field</li>
      </ul>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Health and Wellness Facilities</h2>
      <p class="mb-4">Take advantage of these resources to maintain your well-being:</p>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>On-campus medical center with basic healthcare services</li>
        <li>Counseling and mental health support</li>
        <li>Fitness center and sports facilities</li>
        <li>Yoga and meditation sessions</li>
      </ul>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Technology Resources</h2>
      <p class="mb-4">Invertis provides cutting-edge technology support:</p>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Campus-wide high-speed Wi-Fi</li>
        <li>Free software licenses for students (Microsoft Office, Adobe Creative Suite, etc.)</li>
        <li>Computer labs with specialized software for different departments</li>
        <li>IT helpdesk for technical issues</li>
        <li>Equipment lending (laptops, cameras, etc.)</li>
      </ul>
      
      <p class="mt-8 font-semibold">Make the most of your university experience by exploring these resources. They're there for you to use, and can significantly enhance your education and personal development during your time at Invertis University.</p>
    `
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
    tags: ["Coding", "Algorithms", "Contests"],
    content: `<p>Sample content for Programming article</p>`
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
    tags: ["Internships", "Career", "Job Hunt"],
    content: `<p>Sample content for Internship article</p>`
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
    tags: ["Portfolio", "Projects", "Skills"],
    content: `<p>Sample content for Portfolio article</p>`
  }
];

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const postId = parseInt(id || '1');
  
  // Find the blog post with the matching ID
  const post = blogPosts.find(post => post.id === postId);
  
  // Handle case where blog post is not found
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
        <p className="mb-6">Sorry, the blog post you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back to Blog */}
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link to="/blog" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </Button>
      </div>
      
      {/* Article Header */}
      <div className="max-w-3xl mx-auto mb-8">
        <Badge className="mb-4">{post.category}</Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-lg text-gray-600 mb-6">{post.description}</p>
        
        {/* Author Info and Metadata */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              <User className="h-5 w-5 text-indigo-600" />
            </div>
            <span className="font-medium">{post.author}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>{post.readTime}</span>
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* Featured Image */}
      <div className="max-w-4xl mx-auto mb-10">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-[400px] object-cover rounded-xl"
        />
      </div>
      
      {/* Article Body */}
      <div className="max-w-3xl mx-auto">
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Article Actions */}
        <div className="border-t border-b border-gray-200 py-6 my-10 flex justify-between">
          <Button variant="outline" className="flex items-center">
            <BookmarkPlus className="h-4 w-4 mr-2" />
            Save for later
          </Button>
          <Button variant="outline" className="flex items-center">
            <Share2 className="h-4 w-4 mr-2" />
            Share Article
          </Button>
        </div>
        
        {/* Author Bio */}
        <div className="bg-gray-50 p-6 rounded-xl mb-10">
          <div className="flex items-start sm:items-center flex-col sm:flex-row">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mr-6 mb-4 sm:mb-0">
              <User className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">About {post.author}</h3>
              <p className="text-gray-600">
                {post.author} is an education expert at Invertis University with years of experience in helping students achieve academic excellence.
              </p>
            </div>
          </div>
        </div>
        
        {/* Related Articles */}
        <div className="my-10">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {blogPosts
              .filter(p => p.id !== post.id)
              .slice(0, 2)
              .map(related => (
                <div key={related.id} className="flex items-start">
                  <img 
                    src={related.image} 
                    alt={related.title} 
                    className="w-20 h-20 object-cover rounded-lg mr-4"
                  />
                  <div>
                    <Badge className="mb-2">{related.category}</Badge>
                    <h3 className="font-medium mb-1">
                      <Link to={`/blog/${related.id}`} className="hover:text-indigo-600">
                        {related.title}
                      </Link>
                    </h3>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{related.readTime}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
} 