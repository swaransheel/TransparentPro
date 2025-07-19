import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertQuestionSchema } from "@shared/schema";
import { generateQuestions, calculateTransparencyScore } from "./services/gemini";
import { generateProductReport } from "./services/pdf";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Product routes
  app.get("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      
      // Ensure demo user exists, create if not
      let demoUser = await storage.getUserByUsername('demo_user');
      if (!demoUser) {
        demoUser = await storage.createUser({
          username: 'demo_user',
          password: 'password_hash',
          email: 'demo@example.com'
        });
      }
      
      const product = await storage.createProduct({ ...validatedData, userId: demoUser.id });
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(400).json({ message: "Failed to create product: " + (error as Error).message });
    }
  });

  app.patch("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedProduct = await storage.updateProduct(productId, updates);
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  // Question routes
  app.get("/api/products/:id/questions", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const questions = await storage.getQuestionsByProduct(productId);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  app.post("/api/products/:id/generate-questions", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const aiQuestions = await generateQuestions({
        name: product.name,
        category: product.category,
        brand: product.brand || undefined,
        description: product.description || undefined,
        materials: product.materials || undefined,
      });

      // Save AI-generated questions to database
      const savedQuestions = [];
      for (const aiQuestion of aiQuestions) {
        const question = await storage.createQuestion({
          productId,
          questionText: aiQuestion.questionText,
          category: aiQuestion.category,
          importance: aiQuestion.importance,
          orderIndex: aiQuestion.orderIndex,
          aiGenerated: true,
          answer: null,
        });
        savedQuestions.push(question);
      }

      res.json(savedQuestions);
    } catch (error) {
      console.error("Error generating questions:", error);
      res.status(500).json({ message: "Failed to generate questions" });
    }
  });

  app.patch("/api/questions/:id", async (req, res) => {
    try {
      const questionId = parseInt(req.params.id);
      const { answer } = req.body;
      
      if (!answer || typeof answer !== 'string') {
        return res.status(400).json({ message: "Answer is required" });
      }
      
      const updatedQuestion = await storage.updateQuestion(questionId, answer);
      res.json(updatedQuestion);
    } catch (error) {
      console.error("Error updating question:", error);
      res.status(500).json({ message: "Failed to update question" });
    }
  });

  // Report routes
  app.get("/api/products/:id/report", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const report = await storage.getReportByProduct(productId);
      
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      res.json(report);
    } catch (error) {
      console.error("Error fetching report:", error);
      res.status(500).json({ message: "Failed to fetch report" });
    }
  });

  app.post("/api/products/:id/generate-report", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const questions = await storage.getQuestionsByProduct(productId);
      
      // Calculate transparency scores using AI
      const questionsAndAnswers = questions.map(q => ({
        questionText: q.questionText,
        answer: q.answer || '',
        category: q.category,
        importance: q.importance,
      }));

      const scoring = await calculateTransparencyScore(product, questionsAndAnswers);

      // Create or update report
      let report = await storage.getReportByProduct(productId);
      
      if (report) {
        report = await storage.updateReport(report.id, {
          overallScore: scoring.overallScore.toString(),
          sustainabilityScore: scoring.sustainabilityScore.toString(),
          qualityScore: scoring.qualityScore.toString(),
          transparencyScore: scoring.transparencyScore.toString(),
          insights: scoring.insights,
          recommendations: scoring.recommendations,
          status: "completed",
        });
      } else {
        report = await storage.createReport({
          productId,
          overallScore: scoring.overallScore.toString(),
          sustainabilityScore: scoring.sustainabilityScore.toString(),
          qualityScore: scoring.qualityScore.toString(),
          transparencyScore: scoring.transparencyScore.toString(),
          insights: scoring.insights,
          recommendations: scoring.recommendations,
          status: "completed",
        });
      }

      res.json(report);
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({ message: "Failed to generate report" });
    }
  });

  app.get("/api/products/:id/report/pdf", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      const report = await storage.getReportByProduct(productId);
      const questions = await storage.getQuestionsByProduct(productId);
      
      if (!product || !report) {
        return res.status(404).json({ message: "Product or report not found" });
      }

      const pdfBuffer = await generateProductReport(product, questions, report);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="transparency-report-${product.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ message: "Failed to generate PDF report" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
