import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Brain, FileText, Code, Check } from "lucide-react";

export default function Landing() {
  const [, navigate] = useLocation();

  const features = [
    {
      icon: Brain,
      title: "AI Question Generation",
      description: "Dynamic follow-up questions based on your product category and previous responses using advanced NLP models."
    },
    {
      icon: FileText,
      title: "Professional Reports",
      description: "Generate comprehensive PDF reports with transparency scores, compliance metrics, and actionable insights."
    },
    {
      icon: Code,
      title: "API Integration",
      description: "Seamless integration with your existing systems through our comprehensive REST API and webhooks."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <nav className="bg-background shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="font-heading font-semibold text-xl text-foreground">TransparentPro</span>
                </div>
              </div>
              <div className="hidden md:flex space-x-6">
                <a href="#" className="text-muted-foreground hover:text-primary font-medium transition-colors">Platform</a>
                <a href="#" className="text-muted-foreground hover:text-primary font-medium transition-colors">Reports</a>
                <a href="#" className="text-muted-foreground hover:text-primary font-medium transition-colors">API Docs</a>
                <a href="#" className="text-muted-foreground hover:text-primary font-medium transition-colors">Support</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">Sign In</Button>
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/10">AI-Powered</Badge>
                <Badge variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/10">Enterprise Ready</Badge>
              </div>
              <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                Build Trust Through 
                <span className="text-primary"> Product Transparency</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Generate comprehensive transparency reports with our AI-powered platform. Collect detailed product information through intelligent questioning and create professional compliance documentation.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/assessment")}
                  className="transform hover:scale-105 transition-all"
                >
                  Start Product Assessment
                </Button>
                <Button variant="outline" size="lg">
                  View Sample Report
                </Button>
              </div>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-secondary" />
                  <span>AI-Generated Questions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-secondary" />
                  <span>PDF Export</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-secondary" />
                  <span>API Integration</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Card className="transform rotate-2 shadow-2xl">
                <CardContent className="p-6">
                  <div className="bg-muted rounded-lg h-4 w-full mb-4"></div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-secondary rounded-full"></div>
                      <div className="bg-muted rounded h-3 w-3/4"></div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-accent rounded-full"></div>
                      <div className="bg-muted rounded h-3 w-1/2"></div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <div className="bg-muted rounded h-3 w-5/6"></div>
                    </div>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-primary">Transparency Score</span>
                      <span className="text-lg font-bold text-primary">87%</span>
                    </div>
                    <div className="w-full bg-primary/20 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "87%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Intelligent Product Assessment</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Our AI-powered platform streamlines the product transparency process with smart questioning, comprehensive reporting, and seamless integrations.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="bg-muted/50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-heading font-semibold text-xl text-foreground">TransparentPro</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">Building trust through intelligent product transparency and comprehensive reporting.</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Product Assessment</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Report Generation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API Integration</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Enterprise Solutions</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Sample Reports</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Support Center</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>support@transparentpro.com</li>
                <li>1-800-TRANSPARENT</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 flex items-center justify-between text-sm text-muted-foreground">
            <p>&copy; 2024 TransparentPro. All rights reserved.</p>
            <div className="flex items-center space-x-6">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
