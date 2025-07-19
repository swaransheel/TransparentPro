import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TransparencyScore } from "@/components/ui/transparency-score";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Download, Share2, Lightbulb } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportPreview() {
  const { productId } = useParams<{ productId: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const numericProductId = parseInt(productId!);

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["products", numericProductId],
    queryFn: () => api.getProduct(numericProductId),
  });

  const { data: report, isLoading: reportLoading } = useQuery({
    queryKey: ["products", numericProductId, "report"],
    queryFn: () => api.getReport(numericProductId),
  });

  const { data: questions = [], isLoading: questionsLoading } = useQuery({
    queryKey: ["products", numericProductId, "questions"],
    queryFn: () => api.getQuestions(numericProductId),
  });

  const handleDownloadPdf = async () => {
    try {
      const blob = await api.downloadReportPdf(numericProductId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `transparency-report-${product?.name?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'product'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download Started",
        description: "Your PDF report is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download the PDF report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const answeredQuestions = questions.filter(q => q.answer && q.answer.trim() !== '');
  const completeness = questions.length > 0 ? Math.round((answeredQuestions.length / questions.length) * 100) : 0;

  if (productLoading || reportLoading || questionsLoading) {
    return (
      <div className="min-h-screen bg-muted/50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-background rounded-xl shadow-sm mb-8">
            <div className="p-6 border-b border-border">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="p-8 space-y-8">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product || !report) {
    return (
      <div className="min-h-screen bg-muted/50 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Report Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The transparency report could not be found or is still being generated.
            </p>
            <Button onClick={() => navigate("/")}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-background rounded-xl shadow-sm mb-8">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">Product Transparency Report</h1>
              <p className="text-muted-foreground mt-1">
                Generated on {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button onClick={handleDownloadPdf} className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </Button>
            </div>
          </div>
          
          {/* Report Content */}
          <div className="p-8">
            {/* Executive Summary */}
            <section className="mb-12">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-6 flex items-center">
                <div className="w-1 h-6 bg-primary rounded mr-3"></div>
                Executive Summary
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    The <strong className="text-foreground">{product.name}</strong> demonstrates strong commitment to transparency and sustainability practices. Our comprehensive AI-powered assessment reveals performance across key metrics.
                  </p>
                  <Card className="bg-secondary/10 border-secondary/20">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-secondary mb-2">Key Strengths</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Comprehensive product documentation</li>
                        <li>• Clear information transparency</li>
                        <li>• Strong assessment completeness ({completeness}%)</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <div className="text-center">
                    <TransparencyScore 
                      score={Number(report.overallScore)} 
                      label="Overall Score"
                      size="lg" 
                    />
                    <div className="mt-4">
                      <div className="text-lg font-semibold text-secondary">
                        {Number(report.overallScore) >= 80 ? 'Excellent' : 
                         Number(report.overallScore) >= 60 ? 'Good' : 'Needs Improvement'}
                      </div>
                      <div className="text-sm text-muted-foreground">Transparency Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Product Information */}
            <section className="mb-12">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-6 flex items-center">
                <div className="w-1 h-6 bg-primary rounded mr-3"></div>
                Product Information
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">Basic Details</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Product Name:</span>
                        <span className="font-medium text-foreground">{product.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Brand:</span>
                        <span className="font-medium text-foreground">{product.brand || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="font-medium text-foreground">{product.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Materials:</span>
                        <span className="font-medium text-foreground">{product.materials || 'Not specified'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">Manufacturing</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Country:</span>
                        <span className="font-medium text-foreground">{product.manufacturingCountry || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Weight:</span>
                        <span className="font-medium text-foreground">{product.weight || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dimensions:</span>
                        <span className="font-medium text-foreground">{product.dimensions || 'Not specified'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {product.description && (
                <div className="mt-6">
                  <h3 className="font-semibold text-foreground mb-3">Description</h3>
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <p className="text-muted-foreground">{product.description}</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </section>
            
            {/* Scoring Breakdown */}
            <section className="mb-12">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-6 flex items-center">
                <div className="w-1 h-6 bg-secondary rounded mr-3"></div>
                Scoring Breakdown
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-secondary/5 border-secondary/20 text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-secondary mb-2">{report.sustainabilityScore}</div>
                    <div className="text-sm text-secondary font-medium">Sustainability</div>
                    <div className="text-xs text-muted-foreground mt-2">Environmental Impact</div>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/20 text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-primary mb-2">{report.qualityScore}</div>
                    <div className="text-sm text-primary font-medium">Quality</div>
                    <div className="text-xs text-muted-foreground mt-2">Product Standards</div>
                  </CardContent>
                </Card>
                <Card className="bg-orange-500/5 border-orange-500/20 text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-orange-600 mb-2">{report.transparencyScore}</div>
                    <div className="text-sm text-orange-700 font-medium">Transparency</div>
                    <div className="text-xs text-muted-foreground mt-2">Information Openness</div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Assessment Questions & Responses */}
            <section className="mb-12">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-6 flex items-center">
                <div className="w-1 h-6 bg-primary rounded mr-3"></div>
                Assessment Questions & Responses
              </h2>
              <p className="text-muted-foreground mb-6">
                Total Questions: {questions.length} | 
                Answered: {answeredQuestions.length} | 
                Completeness: {completeness}%
              </p>
              
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <Card key={question.id} className="border-border">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-primary">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground mb-2">{question.questionText}</h4>
                          <div className="flex items-center space-x-4 mb-3">
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
                          <Card className="bg-background border-border">
                            <CardContent className="p-4">
                              <p className="text-muted-foreground whitespace-pre-wrap">
                                {question.answer || 'No response provided'}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
            
            {/* AI Insights */}
            {report.insights && report.insights.length > 0 && (
              <section className="mb-12">
                <h2 className="font-heading text-xl font-semibold text-foreground mb-6 flex items-center">
                  <div className="w-1 h-6 bg-orange-500 rounded mr-3"></div>
                  AI-Generated Insights
                </h2>
                
                <Card className="bg-orange-50/50 border-orange-200/50">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-orange-800 mb-3">Key Insights</h3>
                        <ul className="text-sm text-orange-700 space-y-2">
                          {report.insights.map((insight, index) => (
                            <li key={index}>• {insight}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}
            
            {/* Recommendations */}
            {report.recommendations && report.recommendations.length > 0 && (
              <section className="mb-12">
                <h2 className="font-heading text-xl font-semibold text-foreground mb-6 flex items-center">
                  <div className="w-1 h-6 bg-secondary rounded mr-3"></div>
                  Recommendations
                </h2>
                
                <div className="space-y-3">
                  {report.recommendations.map((recommendation, index) => (
                    <Card key={index} className="bg-secondary/5 border-secondary/20">
                      <CardContent className="p-4">
                        <p className="text-secondary">{recommendation}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
