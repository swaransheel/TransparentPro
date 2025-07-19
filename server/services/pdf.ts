import puppeteer from 'puppeteer';
import { Product, Question, Report } from '@shared/schema';

export async function generateProductReport(
  product: Product, 
  questions: Question[], 
  report: Report
): Promise<Buffer> {
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    const htmlContent = generateReportHTML(product, questions, report);
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });
    
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report: ' + (error as Error).message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

function generateReportHTML(product: Product, questions: Question[], report: Report): string {
  const answeredQuestions = questions.filter(q => q.answer && q.answer.trim() !== '');
  const completeness = questions.length > 0 ? Math.round((answeredQuestions.length / questions.length) * 100) : 0;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Product Transparency Report - ${product.name}</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
            }
            .header {
                background: linear-gradient(135deg, #2563eb 0%, #10b981 100%);
                color: white;
                padding: 40px 0;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 2.5em;
                font-weight: 700;
            }
            .header p {
                margin: 10px 0 0 0;
                font-size: 1.1em;
                opacity: 0.9;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                padding: 0 20px;
            }
            .section {
                margin: 40px 0;
                page-break-inside: avoid;
            }
            .section-title {
                font-size: 1.5em;
                font-weight: 600;
                color: #2563eb;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }
            .score-container {
                display: flex;
                justify-content: space-around;
                margin: 30px 0;
                text-align: center;
            }
            .score-item {
                background: #f8fafc;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #e2e8f0;
                min-width: 120px;
            }
            .score-value {
                font-size: 2em;
                font-weight: bold;
                color: #10b981;
            }
            .score-label {
                font-size: 0.9em;
                color: #64748b;
                margin-top: 5px;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin: 20px 0;
            }
            .info-item {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #f1f5f9;
            }
            .info-label {
                font-weight: 600;
                color: #475569;
            }
            .info-value {
                color: #334155;
            }
            .question-item {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 20px;
                margin: 15px 0;
                page-break-inside: avoid;
            }
            .question-text {
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 10px;
            }
            .question-meta {
                font-size: 0.85em;
                color: #64748b;
                margin-bottom: 10px;
            }
            .question-answer {
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 4px;
                padding: 15px;
                color: #334155;
                white-space: pre-wrap;
            }
            .insights-list, .recommendations-list {
                list-style: none;
                padding: 0;
            }
            .insights-list li, .recommendations-list li {
                background: #f0f9ff;
                border-left: 4px solid #2563eb;
                padding: 15px;
                margin: 10px 0;
                border-radius: 0 4px 4px 0;
            }
            .recommendations-list li {
                background: #ecfdf5;
                border-left-color: #10b981;
            }
            .footer {
                margin-top: 60px;
                padding: 30px 0;
                text-align: center;
                border-top: 1px solid #e2e8f0;
                color: #64748b;
                font-size: 0.9em;
            }
            @media print {
                .section {
                    page-break-inside: avoid;
                }
                .question-item {
                    page-break-inside: avoid;
                }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="container">
                <h1>Product Transparency Report</h1>
                <p>Generated on ${new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
            </div>
        </div>

        <div class="container">
            <div class="section">
                <h2 class="section-title">Executive Summary</h2>
                <p>This comprehensive transparency assessment for <strong>${product.name}</strong> demonstrates the product's commitment to transparency and sustainability practices. Our AI-powered evaluation reveals performance across key metrics.</p>
                
                <div class="score-container">
                    <div class="score-item">
                        <div class="score-value">${report.overallScore}</div>
                        <div class="score-label">Overall Score</div>
                    </div>
                    <div class="score-item">
                        <div class="score-value">${report.sustainabilityScore}</div>
                        <div class="score-label">Sustainability</div>
                    </div>
                    <div class="score-item">
                        <div class="score-value">${report.qualityScore}</div>
                        <div class="score-label">Quality</div>
                    </div>
                    <div class="score-item">
                        <div class="score-value">${report.transparencyScore}</div>
                        <div class="score-label">Transparency</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2 class="section-title">Product Information</h2>
                <div class="info-grid">
                    <div>
                        <div class="info-item">
                            <span class="info-label">Product Name:</span>
                            <span class="info-value">${product.name}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Category:</span>
                            <span class="info-value">${product.category}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Brand:</span>
                            <span class="info-value">${product.brand || 'Not specified'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Materials:</span>
                            <span class="info-value">${product.materials || 'Not specified'}</span>
                        </div>
                    </div>
                    <div>
                        <div class="info-item">
                            <span class="info-label">Weight:</span>
                            <span class="info-value">${product.weight || 'Not specified'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Dimensions:</span>
                            <span class="info-value">${product.dimensions || 'Not specified'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Manufacturing Country:</span>
                            <span class="info-value">${product.manufacturingCountry || 'Not specified'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Assessment Completeness:</span>
                            <span class="info-value">${completeness}%</span>
                        </div>
                    </div>
                </div>
                
                ${product.description ? `
                <div style="margin-top: 20px;">
                    <h3 style="color: #475569; margin-bottom: 10px;">Description</h3>
                    <p style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">${product.description}</p>
                </div>
                ` : ''}
            </div>

            <div class="section">
                <h2 class="section-title">Assessment Questions & Responses</h2>
                <p style="margin-bottom: 20px; color: #64748b;">
                    Total Questions: ${questions.length} | 
                    Answered: ${answeredQuestions.length} | 
                    Completeness: ${completeness}%
                </p>
                
                ${questions.map(question => `
                    <div class="question-item">
                        <div class="question-text">${question.questionText}</div>
                        <div class="question-meta">
                            Category: ${question.category.charAt(0).toUpperCase() + question.category.slice(1)} • 
                            Importance: ${question.importance.charAt(0).toUpperCase() + question.importance.slice(1)}
                        </div>
                        <div class="question-answer">
                            ${question.answer || 'No response provided'}
                        </div>
                    </div>
                `).join('')}
            </div>

            ${report.insights && report.insights.length > 0 ? `
            <div class="section">
                <h2 class="section-title">AI-Generated Insights</h2>
                <ul class="insights-list">
                    ${report.insights.map(insight => `<li>${insight}</li>`).join('')}
                </ul>
            </div>
            ` : ''}

            ${report.recommendations && report.recommendations.length > 0 ? `
            <div class="section">
                <h2 class="section-title">Recommendations</h2>
                <ul class="recommendations-list">
                    ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
            ` : ''}

            <div class="footer">
                <p>This report was generated by TransparentPro AI-powered transparency assessment platform.</p>
                <p>Report ID: ${report.id} | Generated: ${new Date().toISOString()}</p>
            </div>
        </div>
    </body>
    </html>
  `;
}
