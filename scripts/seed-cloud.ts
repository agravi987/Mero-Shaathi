import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Define interfaces locally to avoid import issues if not running compliant ts-node
// OR import from src/lib/models if we run with proper alias support.
// Let's try importing relevant models using relative paths which usually works better in simple scripts.

// We need to register models first to avoiding MissingSchemaError
import "../src/lib/models/Subject";
import "../src/lib/models/Topic";
import "../src/lib/models/Note";
import "../src/lib/models/Quiz";
import "../src/lib/models/Question";

import Subject from "../src/lib/models/Subject";
import Topic from "../src/lib/models/Topic";
import Note from "../src/lib/models/Note";
import Quiz from "../src/lib/models/Quiz";
import Question from "../src/lib/models/Question";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
  process.exit(1);
}

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI as string);
    console.log("Connected!");

    // 1. Create Subject
    console.log("Creating Subject: AWS Certified Cloud Practitioner...");
    const subject = await Subject.create({
      name: "AWS Certified Cloud Practitioner",
      description:
        "Foundational understanding of AWS Cloud concepts, security, and services.",
      icon: "Cloud",
      color: "#FF9900", // AWS Orange
    });

    // 2. Create Topics
    console.log("Creating Topics...");
    const topicsData = [
      {
        subjectId: subject._id,
        name: "Cloud Concepts",
        description:
          "Understanding cloud computing, benefits, and AWS global infrastructure.",
        order: 1,
        tags: ["foundations", "high-priority"],
      },
      {
        subjectId: subject._id,
        name: "Security and Compliance",
        description:
          "AWS Shared Responsibility Model, IAM, and security compliance.",
        order: 2,
        tags: ["security", "critical"],
      },
      {
        subjectId: subject._id,
        name: "Technology & Services",
        description: "Core AWS services: EC2, S3, RDS, Lambda, and more.",
        order: 3,
        tags: ["services", "broad"],
      },
      {
        subjectId: subject._id,
        name: "Billing and Pricing",
        description: "AWS pricing models, TCO, and cost management tools.",
        order: 4,
        tags: ["billing"],
      },
    ];

    const topics = await Topic.insertMany(topicsData);
    const cloudConceptsTopic = topics.find((t) => t.name === "Cloud Concepts")!;
    const securityTopic = topics.find(
      (t) => t.name === "Security and Compliance"
    )!;

    // 3. Create Notes for 'Cloud Concepts'
    console.log("Creating Notes...");
    await Note.create({
      topicId: cloudConceptsTopic._id,
      title: "Six Advantages of Cloud Computing",
      content: `
# 6 Advantages of Cloud Computing

1. **Trade capital expense for variable expense**: Instead of investing heavily in data centers and servers before you know how you’re going to use them, you can pay only when you consume computing resources.
2. **Benefit from massive economies of scale**: You will never have the same purchasing power as Amazon. They get lower costs and pass them to you.
3. **Stop guessing capacity**: Eliminate guessing on your infrastructure capacity needs.
4. **Increase speed and agility**: New IT resources are only a click away.
5. **Stop spending money running and maintaining data centers**: Focus on projects that differentiate your business.
6. **Go global in minutes**: Easily deploy your application in multiple regions around the world.
      `,
      highlights: [
        "Trade capital expense",
        "Economies of scale",
        "Go global in minutes",
      ],
      isImportant: true,
      needsRevision: false,
    });

    // 4. Create Quiz for 'Security and Compliance'
    console.log("Creating Quiz...");
    const quiz = await Quiz.create({
      topicId: securityTopic._id,
      title: "Shared Responsibility Model Drill",
      description:
        "Test your understanding of who is responsible for what in the AWS Cloud.",
      difficulty: "medium",
      timeLimit: 600, // 10 minutes
      totalMarks: 20,
    });

    // 5. Create Questions
    console.log("Creating Questions...");
    const questionsData = [
      {
        quizId: quiz._id,
        type: "mcq",
        question:
          "Under the AWS Shared Responsibility Model, which of the following is the customer RESPONSIBLE for?",
        options: [
          "Physical security of data centers",
          "Patching the underlying host OS (e.g., for RDS)",
          "Setting up Security Groups and ACLs",
          "Disposing of failed disk drives",
        ],
        correctAnswer: "Setting up Security Groups and ACLs",
        explanation:
          'Customers are responsible for security "IN" the cloud (data, ports, access). AWS is responsible for security "OF" the cloud (physical, host OS for managed services).',
        marks: 5,
        difficulty: "medium",
        order: 1,
      },
      {
        quizId: quiz._id,
        type: "trueFalse",
        question: "AWS is responsible for encrypting client-side data.",
        correctAnswer: "False",
        explanation:
          "Client-side encryption is the responsibility of the Customer. AWS provides tools, but the customer must implement it.",
        marks: 5,
        difficulty: "easy",
        order: 2,
      },
      {
        quizId: quiz._id,
        type: "mcq",
        question:
          "Which service is used to manage access to AWS resources securely?",
        options: ["Amazon S3", "AWS IAM", "AWS Lambda", "Amazon EC2"],
        correctAnswer: "AWS IAM",
        explanation:
          "Identity and Access Management (IAM) is the service used to control access to AWS resources.",
        marks: 5,
        difficulty: "easy",
        order: 3,
      },
      {
        quizId: quiz._id,
        type: "fillBlank",
        question:
          "The ______ Responsibility Model divides security duties between AWS and the Customer.",
        correctAnswer: "Shared",
        explanation: "It is called the Shared Responsibility Model.",
        marks: 5,
        difficulty: "easy",
        order: 4,
      },
    ];

    const questions = await Question.insertMany(questionsData);

    // Update Quiz with Question IDs
    quiz.questions = questions.map((q) => q._id as any);
    await quiz.save();

    console.log("✅ Seeding completed successfully!");
    console.log(`Created Subject: ${subject.name}`);
    console.log(`Created ${topics.length} Topics`);
    console.log(`Created Notes and Quiz with ${questions.length} questions`);
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  }
}

seed();
