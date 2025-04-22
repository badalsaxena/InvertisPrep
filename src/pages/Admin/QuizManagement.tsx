import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Pencil, Trash2, Eye, Activity, Search } from 'lucide-react';

interface Question {
  id?: string;
  question: string;
  options: string[];
  correctOption: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Quiz {
  id?: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  timeLimit: number;
  questions: Question[];
  createdAt: any;
  updatedAt: any;
  isPublished: boolean;
}

const INITIAL_QUIZ: Quiz = {
  title: '',
  description: '',
  category: '',
  difficulty: 'medium',
  timeLimit: 15,
  questions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  isPublished: false
};

const INITIAL_QUESTION: Question = {
  question: '',
  options: ['', '', '', ''],
  correctOption: 0,
  explanation: '',
  difficulty: 'medium'
};

const CATEGORIES = [
  'Programming Basics',
  'Data Structures',
  'Algorithms',
  'Web Development',
  'Database',
  'Mobile Development',
  'Machine Learning',
  'DevOps',
  'Computer Networks',
  'Operating Systems'
];

const DIFFICULTIES = ['easy', 'medium', 'hard'];

const QuizManagement: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz>({ ...INITIAL_QUIZ });
  const [editMode, setEditMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({ ...INITIAL_QUESTION });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const quizzesQuery = query(collection(db, 'quizzes'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(quizzesQuery);
      
      const fetchedQuizzes: Quiz[] = [];
      querySnapshot.forEach((doc) => {
        fetchedQuizzes.push({
          id: doc.id,
          ...doc.data() as Quiz
        });
      });
      
      setQuizzes(fetchedQuizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = () => {
    setCurrentQuiz({ ...INITIAL_QUIZ });
    setEditMode(false);
    setIsDialogOpen(true);
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setCurrentQuiz({ ...quiz });
    setEditMode(true);
    setIsDialogOpen(true);
  };

  const handleSaveQuiz = async () => {
    try {
      const quizData = {
        ...currentQuiz,
        updatedAt: new Date()
      };
      
      if (editMode && currentQuiz.id) {
        // Update existing quiz
        await updateDoc(doc(db, 'quizzes', currentQuiz.id), quizData);
      } else {
        // Create new quiz
        quizData.createdAt = new Date();
        await addDoc(collection(db, 'quizzes'), quizData);
      }
      
      setIsDialogOpen(false);
      fetchQuizzes();
    } catch (error) {
      console.error("Error saving quiz:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!quizToDelete) return;
    
    try {
      await deleteDoc(doc(db, 'quizzes', quizToDelete));
      setIsDeleteDialogOpen(false);
      setQuizToDelete(null);
      fetchQuizzes();
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  const handleDeleteQuiz = (quizId: string) => {
    setQuizToDelete(quizId);
    setIsDeleteDialogOpen(true);
  };

  const handleAddQuestion = () => {
    setCurrentQuestion({ ...INITIAL_QUESTION });
    setCurrentQuestionIndex(null);
    setIsQuestionDialogOpen(true);
  };

  const handleEditQuestion = (index: number) => {
    setCurrentQuestion({ ...currentQuiz.questions[index] });
    setCurrentQuestionIndex(index);
    setIsQuestionDialogOpen(true);
  };

  const handleSaveQuestion = () => {
    const updatedQuestions = [...currentQuiz.questions];
    
    if (currentQuestionIndex !== null) {
      // Edit existing question
      updatedQuestions[currentQuestionIndex] = currentQuestion;
    } else {
      // Add new question
      updatedQuestions.push(currentQuestion);
    }
    
    setCurrentQuiz({
      ...currentQuiz,
      questions: updatedQuestions
    });
    
    setIsQuestionDialogOpen(false);
  };

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = [...currentQuiz.questions];
    updatedQuestions.splice(index, 1);
    
    setCurrentQuiz({
      ...currentQuiz,
      questions: updatedQuestions
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = value;
    
    setCurrentQuestion({
      ...currentQuestion,
      options: updatedOptions
    });
  };

  const handlePublishToggle = async (quiz: Quiz) => {
    if (!quiz.id) return;
    
    try {
      const newStatus = !quiz.isPublished;
      await updateDoc(doc(db, 'quizzes', quiz.id), {
        isPublished: newStatus,
        updatedAt: new Date()
      });
      
      fetchQuizzes();
    } catch (error) {
      console.error("Error toggling publish status:", error);
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = 
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.category.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'published') return matchesSearch && quiz.isPublished;
    if (activeTab === 'drafts') return matchesSearch && !quiz.isPublished;
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Quiz Management</h2>
        <Button onClick={handleCreateQuiz}>
          <Plus className="mr-2 h-4 w-4" />
          Create Quiz
        </Button>
      </div>
      
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quizzes by title, description or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Loading quizzes...</p>
        </div>
      ) : (
        <div>
          {filteredQuizzes.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-xl text-muted-foreground">No quizzes found</p>
              <Button variant="outline" className="mt-4" onClick={handleCreateQuiz}>
                Create your first quiz
              </Button>
            </div>
          ) : (
            <Table>
              <TableCaption>A list of all quizzes</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                    <TableCell>{quiz.category}</TableCell>
                    <TableCell>{quiz.questions.length}</TableCell>
                    <TableCell className="capitalize">{quiz.difficulty}</TableCell>
                    <TableCell>
                      <Badge variant={quiz.isPublished ? "success" : "secondary"}>
                        {quiz.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePublishToggle(quiz)}
                        >
                          {quiz.isPublished ? "Unpublish" : "Publish"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditQuiz(quiz)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => quiz.id && handleDeleteQuiz(quiz.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}
      
      {/* Quiz Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editMode ? "Edit Quiz" : "Create New Quiz"}</DialogTitle>
            <DialogDescription>
              {editMode 
                ? "Make changes to the quiz details and questions below." 
                : "Add details for your new quiz below."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Quiz Title</Label>
                <Input
                  id="title"
                  value={currentQuiz.title}
                  onChange={(e) => setCurrentQuiz({ ...currentQuiz, title: e.target.value })}
                  placeholder="Enter quiz title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={currentQuiz.category}
                  onValueChange={(value) => setCurrentQuiz({ ...currentQuiz, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={currentQuiz.difficulty}
                  onValueChange={(value) => setCurrentQuiz({ ...currentQuiz, difficulty: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTIES.map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty} className="capitalize">
                        {difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  value={currentQuiz.timeLimit}
                  onChange={(e) => setCurrentQuiz({ ...currentQuiz, timeLimit: parseInt(e.target.value) || 0 })}
                  min={1}
                  max={120}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={currentQuiz.description}
                onChange={(e) => setCurrentQuiz({ ...currentQuiz, description: e.target.value })}
                placeholder="Enter quiz description"
                rows={3}
              />
            </div>
            
            <div className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Questions ({currentQuiz.questions.length})</h3>
                <Button onClick={handleAddQuestion} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </div>
              
              {currentQuiz.questions.length === 0 ? (
                <div className="text-center py-8 border rounded-md">
                  <p className="text-muted-foreground">No questions added yet</p>
                  <Button onClick={handleAddQuestion} variant="outline" className="mt-4">
                    Add your first question
                  </Button>
                </div>
              ) : (
                <Accordion type="multiple" className="w-full">
                  {currentQuiz.questions.map((question, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center text-left">
                          <span className="mr-2">Q{index + 1}:</span>
                          <span className="font-normal">
                            {question.question.length > 50
                              ? `${question.question.substring(0, 50)}...`
                              : question.question}
                          </span>
                          <Badge className="ml-2 capitalize" variant={
                            question.difficulty === 'easy' ? 'outline' :
                            question.difficulty === 'medium' ? 'secondary' : 'destructive'
                          }>
                            {question.difficulty}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 p-2">
                          <p className="font-medium">{question.question}</p>
                          <div className="pl-4 space-y-1 mt-2">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center">
                                <Badge variant={optIndex === question.correctOption ? "success" : "outline"} className="mr-2 w-6 h-6 rounded-full flex items-center justify-center">
                                  {String.fromCharCode(65 + optIndex)}
                                </Badge>
                                <p>{option}</p>
                              </div>
                            ))}
                          </div>
                          
                          {question.explanation && (
                            <div className="mt-2 pt-2 border-t">
                              <p className="text-sm text-muted-foreground">
                                <span className="font-medium">Explanation:</span> {question.explanation}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" size="sm" onClick={() => handleEditQuestion(index)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteQuestion(index)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveQuiz}>
              {editMode ? "Update Quiz" : "Create Quiz"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Question Edit/Create Dialog */}
      <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {currentQuestionIndex !== null ? "Edit Question" : "Add New Question"}
            </DialogTitle>
            <DialogDescription>
              {currentQuestionIndex !== null
                ? "Make changes to the question below."
                : "Create a new question for your quiz."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                value={currentQuestion.question}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                placeholder="Enter your question"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Options</Label>
              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Badge className="w-6 h-6 rounded-full flex items-center justify-center">
                      {String.fromCharCode(65 + index)}
                    </Badge>
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className={index === currentQuestion.correctOption ? "bg-green-100" : ""}
                      onClick={() => setCurrentQuestion({ ...currentQuestion, correctOption: index })}
                    >
                      {index === currentQuestion.correctOption ? "Correct" : "Set Correct"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="explanation">Explanation (Optional)</Label>
              <Textarea
                id="explanation"
                value={currentQuestion.explanation || ''}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                placeholder="Explain why the correct answer is right (optional)"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="difficulty">Question Difficulty</Label>
              <Select
                value={currentQuestion.difficulty}
                onValueChange={(value: 'easy' | 'medium' | 'hard') => 
                  setCurrentQuestion({ ...currentQuestion, difficulty: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty} className="capitalize">
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQuestionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveQuestion}>
              {currentQuestionIndex !== null ? "Update Question" : "Add Question"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              quiz and all of its questions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuizManagement; 