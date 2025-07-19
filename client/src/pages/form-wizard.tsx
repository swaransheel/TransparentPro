import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { MultiStepForm } from "@/components/ui/multi-step-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TransparencyScore } from "@/components/ui/transparency-score";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Loader2, Lightbulb, Plus } from "lucide-react";
import type { Product, Question, Report } from "@shared/schema";

// Form schemas
const basicInfoSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().optional(),
  description: z.string().optional(),
});

const detailsSchema = z.object({
  weight: z.string().optional(),
  dimensions: z.string().optional(),
  materials: z.string().optional(),
  manufacturingCountry: z.string().optional(),
  manufacturingDate: z.string().optional(),
  certifications: z.array(z.string()).default([]),
});

export default function FormWizard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [productId, setProductId] = useState<number | null>(null);
  
  // Form state
  const basicForm = useForm({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: "",
      category: "",
      brand: "",
      description: "",
    },
  });

  const detailsForm = useForm({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      weight: "",
      dimensions: "",
      materials: "",
      manufacturingCountry: "",
      manufacturingDate: "",
      certifications: [],
    },
  });

  // API queries and mutations
  const { data: questions = [], isLoading: questionsLoading } = useQuery({
    queryKey: ["products", productId, "questions"],
    queryFn: () => api.getQuestions(productId!),
    enabled: !!productId && currentStep === 3,
  });

  const { data: report, isLoading: reportLoading } = useQuery({
    queryKey: ["products", productId, "report"],
    queryFn: () => api.getReport(productId!),
    enabled: !!productId && currentStep === 4,
  });

  const createProductMutation = useMutation({
    mutationFn: api.createProduct,
    onSuccess: (product: Product) => {
      setProductId(product.id);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: any }) => 
      api.updateProduct(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const generateQuestionsMutation = useMutation({
    mutationFn: (productId: number) => api.generateQuestions(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", productId, "questions"] });
      toast({
        title: "Questions Generated",
        description: "AI has generated personalized questions for your product.",
      });
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: ({ questionId, answer }: { questionId: number; answer: string }) =>
      api.updateQuestion(questionId, answer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", productId, "questions"] });
    },
  });

  const generateReportMutation = useMutation({
    mutationFn: (productId: number) => api.generateReport(productId),
    onSuccess: (report: Report) => {
      queryClient.invalidateQueries({ queryKey: ["products", productId, "report"] });
      navigate(`/report/${productId}`);
    },
  });

  // Step navigation
  const handleNext = useCallback(async () => {
    if (currentStep === 1) {
      const isValid = await basicForm.trigger();
      if (!isValid) return;
      
      const data = basicForm.getValues();
      if (!productId) {
        createProductMutation.mutate(data);
      } else {
        updateProductMutation.mutate({ id: productId, updates: data });
      }
    } else if (currentStep === 2) {
      const isValid = await detailsForm.trigger();
      if (!isValid) return;
      
      const data = detailsForm.getValues();
      if (productId) {
        updateProductMutation.mutate({ id: productId, updates: data });
        // Generate AI questions when moving to step 3
        if (questions.length === 0) {
          generateQuestionsMutation.mutate(productId);
        }
      }
    } else if (currentStep === 3) {
      // Validate that at least some questions are answered
      const answeredQuestions = questions.filter(q => q.answer && q.answer.trim() !== '');
      if (answeredQuestions.length === 0) {
        toast({
          title: "Please answer questions",
          description: "Please answer at least one question before proceeding.",
          variant: "destructive",
        });
        return;
      }
    } else if (currentStep === 4) {
      // Generate final report
      if (productId) {
        generateReportMutation.mutate(productId);
      }
      return;
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 4));
  }, [currentStep, productId, basicForm, detailsForm, questions, createProductMutation, updateProductMutation, generateQuestionsMutation, generateReportMutation, toast]);

  const handlePrevious = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  // Step components
  const BasicInfoStep = () => (
    <Form {...basicForm}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField
            control={basicForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={basicForm.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="agriculture">Agriculture (Crops and Plant-Based Food Production)</SelectItem>
                    <SelectItem value="meat-poultry">Meat & Poultry Production</SelectItem>
                    <SelectItem value="dairy">Dairy Production</SelectItem>
                    <SelectItem value="seafood">Seafood (Wild-Caught & Aquaculture)</SelectItem>
                    <SelectItem value="processed-foods">Processed Foods</SelectItem>
                    <SelectItem value="textiles-clothing">Textiles / Clothing</SelectItem>
                    <SelectItem value="cosmetics-personal-care">Cosmetics & Personal Care</SelectItem>
                    <SelectItem value="animal-feed">Animal Feed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={basicForm.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand/Manufacturer</FormLabel>
                <FormControl>
                  <Input placeholder="Enter brand or manufacturer name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <FormField
            control={basicForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Description</FormLabel>
                <FormControl>
                  <Textarea 
                    rows={4} 
                    placeholder="Describe your product..." 
                    className="resize-none"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </Form>
  );

  const DetailsStep = () => (
    <Form {...detailsForm}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={detailsForm.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 500g" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={detailsForm.control}
            name="dimensions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dimensions</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 10x5x2 cm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={detailsForm.control}
            name="materials"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Materials</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Plastic, Metal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div>
          <FormLabel className="text-base font-semibold">Manufacturing Information</FormLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <FormField
              control={detailsForm.control}
              name="manufacturingCountry"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Country of manufacture" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={detailsForm.control}
              name="manufacturingDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Manufacturing date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div>
          <FormLabel className="text-base font-semibold">Certifications & Standards</FormLabel>
          <div className="space-y-3 mt-2">
            {["ISO Certified", "Organic Certification", "Fair Trade"].map((cert) => (
              <FormField
                key={cert}
                control={detailsForm.control}
                name="certifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(cert)}
                        onCheckedChange={(checked) => {
                          const updatedValue = checked
                            ? [...(field.value || []), cert]
                            : (field.value || []).filter((value) => value !== cert);
                          field.onChange(updatedValue);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">{cert}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </Form>
  );

  const QuestionsStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">AI-Generated Questions</h3>
          <p className="text-sm text-muted-foreground">Answer these personalized questions to improve your transparency score</p>
        </div>
        {questionsLoading && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>AI analyzing your product...</span>
          </div>
        )}
      </div>
      
      {questions.length === 0 && !questionsLoading && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-primary">
              <Lightbulb className="h-4 w-4" />
              <span className="text-sm font-medium">
                AI will generate specific questions based on your product details.
              </span>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id} className="border-border">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-primary">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-3">{question.questionText}</h4>
                  <Textarea
                    rows={3}
                    placeholder="Provide detailed information..."
                    className="resize-none"
                    defaultValue={question.answer || ""}
                    onBlur={(e) => {
                      if (e.target.value !== question.answer) {
                        updateQuestionMutation.mutate({
                          questionId: question.id,
                          answer: e.target.value,
                        });
                      }
                    }}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-4">
                      <Badge variant="secondary" className="text-xs">
                        {question.category}
                      </Badge>
                      <Badge 
                        variant={question.importance === 'high' ? 'destructive' : 
                               question.importance === 'medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {question.importance} impact
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {questions.length > 0 && (
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => productId && generateQuestionsMutation.mutate(productId)}
            disabled={generateQuestionsMutation.isPending}
            className="flex items-center space-x-2"
          >
            {generateQuestionsMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            <span>Generate More Questions</span>
          </Button>
        </div>
      )}
    </div>
  );

  const ReviewStep = () => {
    const answeredQuestions = questions.filter(q => q.answer && q.answer.trim() !== '');
    const completeness = questions.length > 0 ? Math.round((answeredQuestions.length / questions.length) * 100) : 0;
    
    return (
      <div className="space-y-8">
        {reportLoading ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Generating transparency score...</p>
          </div>
        ) : report ? (
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Preliminary Transparency Score</h3>
                <TransparencyScore score={Number(report.overallScore)} size="lg" />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-secondary">{report.sustainabilityScore}</div>
                  <div className="text-sm text-muted-foreground">Sustainability</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{report.qualityScore}</div>
                  <div className="text-sm text-muted-foreground">Quality</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{report.transparencyScore}</div>
                  <div className="text-sm text-muted-foreground">Transparency</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold mb-3">Assessment Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Questions Answered:</span>
                  <span className="font-medium">{answeredQuestions.length}/{questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completeness:</span>
                  <span className="font-medium text-secondary">{completeness}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Report Pages:</span>
                  <span className="font-medium">8-12</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold mb-3">Next Steps</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Your product assessment is ready for processing. We'll generate your comprehensive transparency report.
              </p>
              <Button 
                onClick={() => productId && generateReportMutation.mutate(productId)}
                disabled={generateReportMutation.isPending}
                className="w-full"
              >
                {generateReportMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generating Report...
                  </>
                ) : (
                  "Generate Report"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const steps = [
    { id: "basic", title: "Basic Info", component: <BasicInfoStep /> },
    { id: "details", title: "Details", component: <DetailsStep /> },
    { id: "questions", title: "AI Questions", component: <QuestionsStep /> },
    { id: "review", title: "Review", component: <ReviewStep /> },
  ];

  const getNextButtonText = () => {
    if (currentStep === 4) return "Generate Report";
    return "Continue";
  };

  const isNextDisabled = () => {
    if (currentStep === 1) return createProductMutation.isPending;
    if (currentStep === 2) return updateProductMutation.isPending;
    if (currentStep === 3) return questionsLoading;
    if (currentStep === 4) return generateReportMutation.isPending;
    return false;
  };

  return (
    <MultiStepForm
      steps={steps}
      currentStep={currentStep}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onClose={() => navigate("/")}
      nextButtonText={getNextButtonText()}
      isNextDisabled={isNextDisabled()}
    />
  );
}
