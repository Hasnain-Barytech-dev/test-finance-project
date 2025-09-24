import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar } from 'lucide-react';

const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-8 w-8" />
          Reports
        </h1>
        <p className="text-muted-foreground">Generate and download financial reports</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="finance-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly Report
            </CardTitle>
            <CardDescription>Last 30 days summary</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full gradient-primary">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </CardContent>
        </Card>

        <Card className="finance-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Quarterly Report
            </CardTitle>
            <CardDescription>Last 3 months summary</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full gradient-primary">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </CardContent>
        </Card>

        <Card className="finance-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Annual Report
            </CardTitle>
            <CardDescription>Yearly summary</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full gradient-primary">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="finance-card">
        <CardHeader>
          <CardTitle>Custom Report</CardTitle>
          <CardDescription>Generate a report for a specific date range</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">Custom report generation coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;