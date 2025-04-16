// Sample questions database for Quizzo
// In a production environment, this would be stored in a database

module.exports = {
  c: [
    {
      id: '1',
      question: 'What is the size of an int in C?',
      options: ['2 bytes', '4 bytes', '8 bytes', 'Depends on the system'],
      correctAnswer: 3
    },
    {
      id: '2',
      question: 'Which of these is not a valid C data type?',
      options: ['int', 'float', 'string', 'double'],
      correctAnswer: 2
    },
    {
      id: '3',
      question: 'What does the "static" keyword do in C?',
      options: [
        'Makes a variable constant',
        'Makes a variable global',
        'Makes a variable persist between function calls',
        'Makes a variable thread-safe'
      ],
      correctAnswer: 2
    },
    {
      id: '4',
      question: 'What is the correct way to declare a pointer to an integer in C?',
      options: ['int ptr;', 'pointer int ptr;', 'int *ptr;', 'int &ptr;'],
      correctAnswer: 2
    },
    {
      id: '5',
      question: 'Which of the following is true about NULL in C?',
      options: [
        'NULL is the same as 0',
        'NULL is a reserved keyword',
        'NULL is typically defined as ((void *)0)',
        'NULL can only be used with strings'
      ],
      correctAnswer: 2
    },
    {
      id: '6',
      question: 'What is the output of printf("%d", sizeof(int));?',
      options: ['2', '4', '8', 'Depends on the system'],
      correctAnswer: 3
    },
    {
      id: '7',
      question: 'Which operator is used for memory allocation in C?',
      options: ['new', 'malloc', 'alloc', 'create'],
      correctAnswer: 1
    },
    {
      id: '8',
      question: 'What is a structure in C?',
      options: [
        'A built-in data type',
        'A user-defined data type that allows grouping of different data types',
        'A pointer type',
        'A memory allocation function'
      ],
      correctAnswer: 1
    },
    {
      id: '9',
      question: 'Which of the following is used to include a standard input/output header file in C?',
      options: ['#include <stdio.h>', 'import stdio.h', 'include stdio.h', 'using stdio.h'],
      correctAnswer: 0
    },
    {
      id: '10',
      question: 'What does the "const" keyword do in C?',
      options: [
        'Makes a variable unchangeable',
        'Makes a function constant',
        'Creates a constant pointer',
        'All of the above'
      ],
      correctAnswer: 0
    }
  ],
  dsa: [
    {
      id: '1',
      question: 'What is the time complexity of binary search?',
      options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(n²)'],
      correctAnswer: 1
    },
    {
      id: '2',
      question: 'Which data structure uses FIFO principle?',
      options: ['Stack', 'Queue', 'Tree', 'Graph'],
      correctAnswer: 1
    },
    {
      id: '3',
      question: 'What is the worst-case time complexity of Quick Sort?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
      correctAnswer: 2
    },
    {
      id: '4',
      question: 'Which of the following is not a linear data structure?',
      options: ['Array', 'Linked List', 'Queue', 'Tree'],
      correctAnswer: 3
    },
    {
      id: '5',
      question: 'In a min-heap, the smallest element is found at:',
      options: ['The root', 'The leftmost leaf', 'The rightmost leaf', 'Any random position'],
      correctAnswer: 0
    },
    {
      id: '6',
      question: 'Which search algorithm works on a sorted array?',
      options: ['Linear Search', 'Binary Search', 'Depth-First Search', 'Breadth-First Search'],
      correctAnswer: 1
    },
    {
      id: '7',
      question: 'What is the time complexity of insertion in a hash table?',
      options: ['O(1) average case', 'O(n) always', 'O(log n) always', 'O(n²) worst case'],
      correctAnswer: 0
    },
    {
      id: '8',
      question: 'Which data structure is used for implementing recursion?',
      options: ['Queue', 'Stack', 'Array', 'Linked List'],
      correctAnswer: 1
    },
    {
      id: '9',
      question: 'What is the space complexity of Merge Sort?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 2
    },
    {
      id: '10',
      question: 'Which of the following is not a balanced binary search tree?',
      options: ['AVL Tree', 'Red-Black Tree', 'B-Tree', 'Linked List'],
      correctAnswer: 3
    }
  ],
  python: [
    {
      id: '1',
      question: 'What is the output of print(2 ** 3)?',
      options: ['6', '8', '5', 'Error'],
      correctAnswer: 1
    },
    {
      id: '2',
      question: 'Which of these is not a Python data type?',
      options: ['List', 'Tuple', 'Array', 'Dictionary'],
      correctAnswer: 2
    },
    {
      id: '3',
      question: 'What does the "self" keyword represent in Python?',
      options: [
        'Current class instance',
        'Parent class',
        'Global variable',
        'Static method'
      ],
      correctAnswer: 0
    },
    {
      id: '4',
      question: 'What will be the output of print(list(range(5)))?',
      options: ['[0, 1, 2, 3, 4, 5]', '[0, 1, 2, 3, 4]', '[1, 2, 3, 4, 5]', '[5, 4, 3, 2, 1]'],
      correctAnswer: 1
    },
    {
      id: '5',
      question: 'How do you create a virtual environment in Python?',
      options: [
        'python -m venv myenv',
        'virtualenv myenv',
        'pip install venv',
        'python create venv'
      ],
      correctAnswer: 0
    },
    {
      id: '6',
      question: 'What is the correct way to import a module named "math" in Python?',
      options: ['import math', 'include math', '#include <math>', 'using math'],
      correctAnswer: 0
    },
    {
      id: '7',
      question: 'Which of the following is used to handle exceptions in Python?',
      options: ['try-catch', 'try-except', 'try-finally', 'try-handle'],
      correctAnswer: 1
    },
    {
      id: '8',
      question: 'What is a lambda function in Python?',
      options: [
        'A normal function',
        'An anonymous function',
        'A built-in function',
        'A class method'
      ],
      correctAnswer: 1
    },
    {
      id: '9',
      question: 'What does PEP 8 refer to in Python?',
      options: [
        'Python Enhancement Protocol',
        'Python Extension Program',
        'Python Style Guide',
        'Python Execution Path'
      ],
      correctAnswer: 2
    },
    {
      id: '10',
      question: 'How do you remove duplicates from a list in Python?',
      options: [
        'Use the unique() method',
        'Convert to a set and back to a list',
        'Use the remove_duplicates() function',
        'Lists cannot have duplicates'
      ],
      correctAnswer: 1
    }
  ],
  java: [
    {
      id: '1',
      question: 'What is the default value of a boolean in Java?',
      options: ['true', 'false', 'null', '0'],
      correctAnswer: 1
    },
    {
      id: '2',
      question: 'Which of these is not a Java access modifier?',
      options: ['public', 'private', 'protected', 'internal'],
      correctAnswer: 3
    },
    {
      id: '3',
      question: 'What is the parent class of all classes in Java?',
      options: ['Object', 'Class', 'Main', 'Super'],
      correctAnswer: 0
    },
    {
      id: '4',
      question: 'Which keyword is used to inherit a class in Java?',
      options: ['implements', 'extends', 'inherits', 'using'],
      correctAnswer: 1
    },
    {
      id: '5',
      question: 'What is an interface in Java?',
      options: [
        'A class with only abstract methods',
        'A collection of abstract methods and constants',
        'A class with all static methods',
        'A class with all final methods'
      ],
      correctAnswer: 1
    },
    {
      id: '6',
      question: 'Which of the following is not a primitive data type in Java?',
      options: ['int', 'float', 'String', 'boolean'],
      correctAnswer: 2
    },
    {
      id: '7',
      question: 'What is the correct way to create a thread in Java?',
      options: [
        'By extending Thread class',
        'By implementing Runnable interface',
        'Both A and B',
        'None of the above'
      ],
      correctAnswer: 2
    },
    {
      id: '8',
      question: 'What is a JVM in Java?',
      options: [
        'Java Virtual Machine',
        'Java Visual Module',
        'Java Verified Method',
        'Java Virtual Method'
      ],
      correctAnswer: 0
    },
    {
      id: '9',
      question: 'Which of the following is used for exception handling in Java?',
      options: [
        'try-catch',
        'try-finally',
        'try-catch-finally',
        'All of the above'
      ],
      correctAnswer: 3
    },
    {
      id: '10',
      question: 'What is the purpose of the "final" keyword in Java?',
      options: [
        'To make a variable constant',
        'To prevent method overriding',
        'To prevent inheritance',
        'All of the above'
      ],
      correctAnswer: 3
    }
  ],
  web: [
    {
      id: '1',
      question: 'What does HTML stand for?',
      options: [
        'Hyper Text Markup Language',
        'High Tech Modern Language',
        'Hyper Transfer Markup Language',
        'Home Tool Markup Language'
      ],
      correctAnswer: 0
    },
    {
      id: '2',
      question: 'Which of these is not a CSS selector?',
      options: ['#id', '.class', '@media', ':hover'],
      correctAnswer: 2
    },
    {
      id: '3',
      question: 'What is the purpose of the JavaScript "this" keyword?',
      options: [
        'Refers to the current object',
        'Refers to the parent object',
        'Refers to the global object',
        'Refers to the window object'
      ],
      correctAnswer: 0
    },
    {
      id: '4',
      question: 'Which HTTP method is used to send data to a server to create/update a resource?',
      options: ['GET', 'POST', 'DELETE', 'PUT'],
      correctAnswer: 1
    },
    {
      id: '5',
      question: 'What is an API?',
      options: [
        'Application Programming Interface',
        'Application Protocol Interface',
        'Automated Programming Interface',
        'Application Process Integration'
      ],
      correctAnswer: 0
    },
    {
      id: '6',
      question: 'Which of the following is a JavaScript framework?',
      options: ['Django', 'Flask', 'React', 'Ruby on Rails'],
      correctAnswer: 2
    },
    {
      id: '7',
      question: 'What is the purpose of CSS?',
      options: [
        'To structure the content of web pages',
        'To style web pages',
        'To handle server-side logic',
        'To interact with databases'
      ],
      correctAnswer: 1
    },
    {
      id: '8',
      question: 'What is CORS in web development?',
      options: [
        'Cross-Origin Resource Sharing',
        'Content Origin Resource System',
        'Cross-Origin Resource System',
        'Content Origin Resource Sharing'
      ],
      correctAnswer: 0
    },
    {
      id: '9',
      question: 'Which of the following is used to store client-side data in web applications?',
      options: [
        'Cookies',
        'Local Storage',
        'Session Storage',
        'All of the above'
      ],
      correctAnswer: 3
    },
    {
      id: '10',
      question: 'What is the purpose of a CDN in web development?',
      options: [
        'To distribute service spatially relative to end-users',
        'To create dynamic web pages',
        'To connect to databases',
        'To run server-side code'
      ],
      correctAnswer: 0
    }
  ]
}; 