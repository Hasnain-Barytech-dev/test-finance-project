import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Download, Calendar, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import apiService from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const generatePDF = async (type: 'monthly' | 'quarterly' | 'annual' | 'custom') => {
    try {
      setLoading(type);
      
      let start = '';
      let end = new Date().toISOString().split('T')[0];
      let title = '';
      
      const now = new Date();
      
      switch (type) {
        case 'monthly':
          start = new Date(now.setDate(now.getDate() - 30)).toISOString().split('T')[0];
          title = 'Monthly Report - Last 30 Days';
          break;
        case 'quarterly':
          start = new Date(now.setMonth(now.getMonth() - 3)).toISOString().split('T')[0];
          title = 'Quarterly Report - Last 3 Months';
          break;
        case 'annual':
          start = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString().split('T')[0];
          title = 'Annual Report - Last Year';
          break;
        case 'custom':
          if (!startDate || !endDate) {
            alert('Please select both start and end dates');
            setLoading(null);
            return;
          }
          start = startDate;
          end = endDate;
          title = `Custom Report (${startDate} to ${endDate})`;
          break;
      }

      const [overview, transactions, categoryData] = await Promise.all([
        apiService.getOverview(),
        apiService.getTransactions({ startDate: start, endDate: end, limit: 1000 }),
        apiService.getCategoryBreakdown({ startDate: start, endDate: end })
      ]);

      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.text(title, 14, 20);
      
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
      doc.text(`User: ${user?.name || user?.email}`, 14, 34);
      doc.text(`Period: ${start} to ${end}`, 14, 40);
      
      let yPos = 50;
      
      doc.setFontSize(14);
      doc.text('Financial Summary', 14, yPos);
      yPos += 8;
      
      const summaryData = [
        ['Total Income', `$${(overview?.totalIncome || 0).toLocaleString()}`],
        ['Total Expenses', `$${(overview?.totalExpenses || 0).toLocaleString()}`],
        ['Net Savings', `$${(overview?.netSavings || 0).toLocaleString()}`]
      ];
      
      autoTable(doc, {
        startY: yPos,
        head: [['Metric', 'Amount']],
        body: summaryData,
        theme: 'grid'
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 10;
      
      doc.setFontSize(14);
      doc.text('Category Breakdown', 14, yPos);
      yPos += 8;
      
      const categoryRows = [
        ...((categoryData?.income || []).map((cat: any) => 
          ['Income', cat.name, `$${parseFloat(cat.amount).toLocaleString()}`, `${cat.percentage}%`]
        )),
        ...((categoryData?.expenses || []).map((cat: any) => 
          ['Expense', cat.name, `$${parseFloat(cat.amount).toLocaleString()}`, `${cat.percentage}%`]
        ))
      ];
      
      if (categoryRows.length > 0) {
        autoTable(doc, {
          startY: yPos,
          head: [['Type', 'Category', 'Amount', 'Percentage']],
          body: categoryRows,
          theme: 'striped'
        });
        
        yPos = (doc as any).lastAutoTable.finalY + 10;
      }
      
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.text('Recent Transactions', 14, yPos);
      yPos += 8;
      
      const transactionRows = (transactions?.transactions || []).slice(0, 50).map((txn: any) => [
        new Date(txn.date).toLocaleDateString(),
        txn.category_name || 'Uncategorized',
        txn.type === 'income' ? 'Income' : 'Expense',
        txn.description || '-',
        `$${parseFloat(txn.amount).toLocaleString()}`
      ]);
      
      if (transactionRows.length > 0) {
        autoTable(doc, {
          startY: yPos,
          head: [['Date', 'Category', 'Type', 'Description', 'Amount']],
          body: transactionRows,
          theme: 'grid',
          styles: { fontSize: 8 }
        });
      }
      
      const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`;
      doc.save(filename);
      
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setLoading(null);
    }
  };

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
            <Button 
              className="w-full gradient-primary" 
              onClick={() => generatePDF('monthly')}
              disabled={loading === 'monthly'}
            >
              {loading === 'monthly' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
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
            <Button 
              className="w-full gradient-primary" 
              onClick={() => generatePDF('quarterly')}
              disabled={loading === 'quarterly'}
            >
              {loading === 'quarterly' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
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
            <Button 
              className="w-full gradient-primary" 
              onClick={() => generatePDF('annual')}
              disabled={loading === 'annual'}
            >
              {loading === 'annual' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
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
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <Button 
            className="w-full gradient-primary" 
            onClick={() => generatePDF('custom')}
            disabled={loading === 'custom' || !startDate || !endDate}
          >
            {loading === 'custom' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Generate Custom Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;