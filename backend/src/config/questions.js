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
      options: ['#id', '.class', '@media', 'element'],
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
    }
  ]
}; 