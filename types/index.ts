export interface QuizQuestion {
  question: string
  options: string[]
  answer: number
}

export interface Lab {
  title: string
  scenario: string
  steps: string[]
}

export interface Lesson {
  id: string
  moduleId: string
  title: string
  order: number
  content: string
  quiz: QuizQuestion[]
  lab: Lab
}

export interface Module {
  id: string
  title: string
  description: string
  lessons: Lesson[]
}

export interface LessonProgress {
  read: boolean
  quizScore: number
  quizPassed: boolean
  labComplete: boolean
}

export interface AllProgress {
  [lessonId: string]: LessonProgress
}
