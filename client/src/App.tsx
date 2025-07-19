import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import FormWizard from "@/pages/form-wizard";
import ReportPreview from "@/pages/report-preview";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/assessment" component={FormWizard} />
      <Route path="/report/:productId" component={ReportPreview} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
