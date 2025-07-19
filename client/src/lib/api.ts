import { apiRequest } from "./queryClient";
import type { Product, Question, Report } from "@shared/schema";

export const api = {
  // Product API
  createProduct: async (productData: any): Promise<Product> => {
    const res = await apiRequest("POST", "/api/products", productData);
    return res.json();
  },

  getProduct: async (id: number): Promise<Product> => {
    const res = await apiRequest("GET", `/api/products/${id}`);
    return res.json();
  },

  updateProduct: async (id: number, updates: any): Promise<Product> => {
    const res = await apiRequest("PATCH", `/api/products/${id}`, updates);
    return res.json();
  },

  // Questions API
  getQuestions: async (productId: number): Promise<Question[]> => {
    const res = await apiRequest("GET", `/api/products/${productId}/questions`);
    return res.json();
  },

  generateQuestions: async (productId: number): Promise<Question[]> => {
    const res = await apiRequest("POST", `/api/products/${productId}/generate-questions`);
    return res.json();
  },

  updateQuestion: async (questionId: number, answer: string): Promise<Question> => {
    const res = await apiRequest("PATCH", `/api/questions/${questionId}`, { answer });
    return res.json();
  },

  // Reports API
  getReport: async (productId: number): Promise<Report> => {
    const res = await apiRequest("GET", `/api/products/${productId}/report`);
    return res.json();
  },

  generateReport: async (productId: number): Promise<Report> => {
    const res = await apiRequest("POST", `/api/products/${productId}/generate-report`);
    return res.json();
  },

  downloadReportPdf: async (productId: number): Promise<Blob> => {
    const res = await apiRequest("GET", `/api/products/${productId}/report/pdf`);
    return res.blob();
  },
};
