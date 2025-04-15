// Sample questions database for Quizzo
// In a production environment, this would be stored in a database

export function loadQuestions() {
  return {
    // C Programming questions
    "c": [
      {
        id: "c1",
        question: "Which of the following is not a valid C data type?",
        options: ["int", "float", "string", "char"],
        correctIndex: 2
      },
      {
        id: "c2",
        question: "What is the correct way to declare a pointer to an integer in C?",
        options: ["int ptr;", "int *ptr;", "int &ptr;", "ptr int;"],
        correctIndex: 1
      },
      {
        id: "c3",
        question: "Which header file should be included to use functions like malloc() and free()?",
        options: ["<memory.h>", "<stdlib.h>", "<string.h>", "<allocation.h>"],
        correctIndex: 1
      },
      {
        id: "c4",
        question: "What does the sizeof() operator return?",
        options: ["The address of the variable", "The value of the variable", "The size of the variable in bytes", "The type of the variable"],
        correctIndex: 2
      },
      {
        id: "c5",
        question: "Which of the following is not a valid loop structure in C?",
        options: ["for", "while", "do-while", "foreach"],
        correctIndex: 3
      },
      {
        id: "c6",
        question: "What is the output of printf(\"%d\", 5/2); in C?",
        options: ["2.5", "2", "3", "2.0"],
        correctIndex: 1
      },
      {
        id: "c7",
        question: "Which operator is used to access the address of a variable in C?",
        options: ["*", "&", "#", "$"],
        correctIndex: 1
      },
      {
        id: "c8",
        question: "What is the purpose of a structure in C?",
        options: ["To define a new primitive data type", "To group variables of different data types under a single name", "To create a linked list", "To declare an array of variables"],
        correctIndex: 1
      },
      {
        id: "c9",
        question: "Which of the following is a correct way to declare a constant in C?",
        options: ["const int MAX = 100;", "int const MAX = 100;", "Both A and B", "None of the above"],
        correctIndex: 2
      },
      {
        id: "c10",
        question: "What is the result of the expression 3 << 2 in C?",
        options: ["6", "8", "12", "24"],
        correctIndex: 2
      },
      {
        id: "c11",
        question: "Which of the following is used to terminate a function and return a value?",
        options: ["break;", "exit;", "return;", "terminate;"],
        correctIndex: 2
      },
      {
        id: "c12",
        question: "What is the correct way to open a file for reading in C?",
        options: ["FILE *fp = open(\"file.txt\", \"r\");", "FILE *fp = fopen(\"file.txt\", \"r\");", "FILE *fp = readfile(\"file.txt\");", "FILE *fp = read(\"file.txt\");"],
        correctIndex: 1
      }
    ],
    
    // Data Structures & Algorithms questions
    "dsa": [
      {
        id: "dsa1",
        question: "What is the time complexity of binary search?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctIndex: 2
      },
      {
        id: "dsa2",
        question: "Which data structure works on the principle of Last In First Out (LIFO)?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correctIndex: 1
      },
      {
        id: "dsa3",
        question: "What is the worst-case time complexity of quicksort?",
        options: ["O(1)", "O(n log n)", "O(n²)", "O(n!)"],
        correctIndex: 2
      },
      {
        id: "dsa4",
        question: "Which of the following is not a linear data structure?",
        options: ["Array", "Linked List", "Queue", "Tree"],
        correctIndex: 3
      },
      {
        id: "dsa5",
        question: "What is the space complexity of the breadth-first search algorithm?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctIndex: 1
      },
      {
        id: "dsa6",
        question: "Which sorting algorithm is guaranteed to be O(n log n) in all cases?",
        options: ["Bubble Sort", "Quick Sort", "Merge Sort", "Insertion Sort"],
        correctIndex: 2
      },
      {
        id: "dsa7",
        question: "What data structure would you use for efficient insertion and deletion at both ends?",
        options: ["Array", "Stack", "Queue", "Deque"],
        correctIndex: 3
      },
      {
        id: "dsa8",
        question: "The minimum number of nodes in an AVL tree of height h is:",
        options: ["h", "2^h - 1", "Fibonacci(h+2) - 1", "2^(h+1) - 1"],
        correctIndex: 2
      },
      {
        id: "dsa9",
        question: "Which of these is not a graph traversal algorithm?",
        options: ["Depth-First Search", "Breadth-First Search", "Quick-First Search", "Bidirectional Search"],
        correctIndex: 2
      },
      {
        id: "dsa10",
        question: "What is the best data structure to implement a priority queue?",
        options: ["Linked List", "Binary Search Tree", "Heap", "Hash Table"],
        correctIndex: 2
      },
      {
        id: "dsa11",
        question: "What is the time complexity of finding an element in a hash table?",
        options: ["O(1) on average", "O(n) always", "O(log n) always", "O(n²) always"],
        correctIndex: 0
      },
      {
        id: "dsa12",
        question: "Which of the following algorithms cannot be used for external sorting?",
        options: ["Merge Sort", "Quick Sort", "Heap Sort", "Bubble Sort"],
        correctIndex: 3
      }
    ],
    
    // Python questions
    "python": [
      {
        id: "py1",
        question: "What is the correct way to create a function in Python?",
        options: ["function myFunc():", "def myFunc():", "create myFunc():", "func myFunc():"],
        correctIndex: 1
      },
      {
        id: "py2",
        question: "Which of the following is not a built-in data type in Python?",
        options: ["List", "Dictionary", "Array", "Tuple"],
        correctIndex: 2
      },
      {
        id: "py3",
        question: "How do you comment multiple lines in Python?",
        options: ["/* comment */", "<!-- comment -->", "''' comment '''", "// comment"],
        correctIndex: 2
      },
      {
        id: "py4",
        question: "What does the len() function do in Python?",
        options: ["Returns the length of a string", "Returns the length of a list", "Returns the length of an object", "All of the above"],
        correctIndex: 3
      },
      {
        id: "py5",
        question: "Which method would you use to add an element to a list?",
        options: ["list.add()", "list.append()", "list.insert()", "list.extend()"],
        correctIndex: 1
      },
      {
        id: "py6",
        question: "What is the output of print(2 ** 3) in Python?",
        options: ["6", "8", "5", "Error"],
        correctIndex: 1
      },
      {
        id: "py7",
        question: "Which of the following is not a Python framework?",
        options: ["Django", "Flask", "Rails", "FastAPI"],
        correctIndex: 2
      },
      {
        id: "py8",
        question: "How do you get the current working directory in Python?",
        options: ["os.pwd()", "os.getcwd()", "system.cwd()", "dir.current()"],
        correctIndex: 1
      },
      {
        id: "py9",
        question: "What does the 'self' keyword represent in a Python class?",
        options: ["The current module", "The current function", "The current instance of the class", "The parent class"],
        correctIndex: 2
      },
      {
        id: "py10",
        question: "What is the output of print([1, 2, 3] * 2)?",
        options: ["[2, 4, 6]", "[1, 2, 3, 1, 2, 3]", "Error", "[1, 1, 2, 2, 3, 3]"],
        correctIndex: 1
      },
      {
        id: "py11",
        question: "Which function in Python returns a list of all available attributes of an object?",
        options: ["dir()", "attrs()", "getattr()", "list_attrs()"],
        correctIndex: 0
      },
      {
        id: "py12",
        question: "What is the correct file extension for Python files?",
        options: [".py", ".pt", ".python", ".pyth"],
        correctIndex: 0
      }
    ],
    
    // Java questions
    "java": [
      {
        id: "java1",
        question: "Which of the following is not a valid Java variable name?",
        options: ["_myVariable", "$myVariable", "2myVariable", "myVariable2"],
        correctIndex: 2
      },
      {
        id: "java2",
        question: "What is the parent class of all classes in Java?",
        options: ["Parent", "Main", "Object", "Class"],
        correctIndex: 2
      },
      {
        id: "java3",
        question: "Which keyword is used to prevent a method from being overridden?",
        options: ["static", "abstract", "protected", "final"],
        correctIndex: 3
      },
      {
        id: "java4",
        question: "Which collection class allows duplicate elements and maintains insertion order?",
        options: ["HashSet", "TreeSet", "ArrayList", "HashMap"],
        correctIndex: 2
      },
      {
        id: "java5",
        question: "What is the default value of a local integer variable in Java?",
        options: ["0", "1", "null", "No default value"],
        correctIndex: 3
      },
      {
        id: "java6",
        question: "Which of these is true about the 'finally' block in Java?",
        options: ["It is executed only if no exception is thrown", "It is executed only if an exception is thrown", "It is always executed regardless of exception", "It is optional when using try-catch"],
        correctIndex: 2
      },
      {
        id: "java7",
        question: "What does the 'synchronized' keyword do in Java?",
        options: ["Prevents thread interference", "Increases execution speed", "Makes a variable constant", "Forces parallel execution"],
        correctIndex: 0
      },
      {
        id: "java8",
        question: "Which of the following is not a valid access modifier in Java?",
        options: ["public", "protected", "private", "friendly"],
        correctIndex: 3
      },
      {
        id: "java9",
        question: "What is the output of System.out.println(5 / 2); in Java?",
        options: ["2.5", "2.0", "2", "Error"],
        correctIndex: 2
      },
      {
        id: "java10",
        question: "Which class does not implement the Map interface in Java?",
        options: ["TreeMap", "HashMap", "HashTable", "Vector"],
        correctIndex: 3
      },
      {
        id: "java11",
        question: "In Java, which operator is used to compare object references?",
        options: ["==", "===", "equals()", "compare()"],
        correctIndex: 0
      },
      {
        id: "java12",
        question: "What is the purpose of the 'super' keyword in Java?",
        options: ["To call a superclass method or constructor", "To access static variables", "To create a new instance", "To prevent method overriding"],
        correctIndex: 0
      }
    ],
    
    // Web Development questions
    "web": [
      {
        id: "web1",
        question: "Which HTML tag is used to define an internal style sheet?",
        options: ["<css>", "<script>", "<style>", "<link>"],
        correctIndex: 2
      },
      {
        id: "web2",
        question: "What does CSS stand for?",
        options: ["Computer Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"],
        correctIndex: 2
      },
      {
        id: "web3",
        question: "Which of the following is NOT a JavaScript framework?",
        options: ["React", "Angular", "Vue", "SCSS"],
        correctIndex: 3
      },
      {
        id: "web4",
        question: "What does the 'DOCTYPE' declaration in HTML do?",
        options: ["Defines the document title", "Specifies the HTML version", "Links to external style sheets", "Sets the character encoding"],
        correctIndex: 1
      },
      {
        id: "web5",
        question: "Which HTTP method is used to request data from a server?",
        options: ["POST", "GET", "PUT", "DELETE"],
        correctIndex: 1
      },
      {
        id: "web6",
        question: "What is the correct CSS syntax to change the text color to red?",
        options: ["text-color: red;", "color: red;", "font-color: red;", "text: red;"],
        correctIndex: 1
      },
      {
        id: "web7",
        question: "What is the purpose of JSON in web development?",
        options: ["To style web pages", "To create interactive UI elements", "To exchange data between client and server", "To optimize images"],
        correctIndex: 2
      },
      {
        id: "web8",
        question: "Which of the following is a CSS preprocessor?",
        options: ["SASS", "PHP", "TypeScript", "jQuery"],
        correctIndex: 0
      },
      {
        id: "web9",
        question: "What is the function of the <meta> tag in HTML?",
        options: ["Display metadata on the webpage", "Provide metadata about the HTML document", "Create a meta-link to other pages", "None of the above"],
        correctIndex: 1
      },
      {
        id: "web10",
        question: "Which JavaScript method is used to access an HTML element by its ID?",
        options: ["getElementById()", "querySelector()", "getElementsByClassName()", "selectElement()"],
        correctIndex: 0
      },
      {
        id: "web11",
        question: "What is a RESTful API?",
        options: ["A programming language", "A database management system", "An architectural style for web services", "A frontend framework"],
        correctIndex: 2
      },
      {
        id: "web12",
        question: "Which of these is NOT a valid CSS position value?",
        options: ["static", "relative", "fixed", "float"],
        correctIndex: 3
      }
    ]
  };
} 