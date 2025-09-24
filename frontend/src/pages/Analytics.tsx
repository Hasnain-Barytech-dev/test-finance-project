import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import apiService from '@/services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, DollarSign, Calendar, Target } from 'lucide-react';

const Analytics: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState<any>(null);
  const [trends, setTrends] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      console.log('Fetching analytics data...');
      const [overviewData, categoryData, trendsData] = await Promise.all([
        apiService.getOverview(),
        apiService.getCategoryBreakdown(),
        apiService.getTrends({ months: 6 })
      ]);
      
      console.log('Raw API responses:', { overviewData, categoryData, trendsData });
      
      setOverview(overviewData);
      setCategoryBreakdown(categoryData);
      setTrends(trendsData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      console.error('Error details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading analytics...</div>;
  }

  const monthlyData = trends ? trends.labels.map((label: string, idx: number) => ({
    month: label,
    income: trends.income[idx],
    expenses: trends.expenses[idx],
    savings: trends.savings[idx]
  })) : [];

  console.log('Analytics - monthlyData:', monthlyData);
  console.log('Analytics - trends:', trends);
  console.log('Analytics - categoryBreakdown:', categoryBreakdown);

  const expenseCategories = categoryBreakdown?.expenses || [];
  const totalExpenses = categoryBreakdown?.totalExpenses || 0;

  const savingsRate = overview?.totalIncome > 0 
    ? ((overview.netSavings / overview.totalIncome) * 100).toFixed(0)
    : 0;

  const avgMonthlyExpenses = monthlyData.length > 0
    ? (monthlyData.reduce((sum: number, m: any) => sum + m.expenses, 0) / monthlyData.length).toFixed(0)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
        <p className="text-muted-foreground">
          Detailed insights into your financial patterns and trends
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="finance-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            <Target className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${Number(savingsRate) > 0 ? 'text-success' : 'text-destructive'}`}>
              {savingsRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              Of total income
            </p>
          </CardContent>
        </Card>

        <Card className="finance-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Monthly Spending</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgMonthlyExpenses}</div>
            <p className="text-xs text-muted-foreground">
              Last 6 months average
            </p>
          </CardContent>
        </Card>

        <Card className="finance-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <Calendar className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold finance-amount-positive">
              ${(overview?.totalIncome || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              This year
            </p>
          </CardContent>
        </Card>

        <Card className="finance-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(overview?.netSavings || 0) >= 0 ? 'finance-amount-positive' : 'finance-amount-negative'}`}>
              ${(overview?.netSavings || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              This year
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="finance-card">
          <CardHeader>
            <CardTitle>Income vs Expenses vs Savings</CardTitle>
            <CardDescription>Monthly financial overview (Last 6 months)</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 'auto']} />
                  <Tooltip 
                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Bar dataKey="income" fill="#10B981" name="Income" />
                  <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                  <Bar dataKey="savings" fill="#3B82F6" name="Savings" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="finance-card">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Expense breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {expenseCategories.length > 0 ? (
              <div className="space-y-4">
                {expenseCategories.slice(0, 5).map((item: any) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.name}</span>
                      <span className="finance-amount-negative">${parseFloat(item.amount).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      {item.percentage}% of total spending
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No expense data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Savings Progress */}
      <Card className="finance-card">
        <CardHeader>
          <CardTitle>Net Savings Overview</CardTitle>
          <CardDescription>Your financial progress this year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold finance-amount-positive">
                  ${(overview?.totalIncome || 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Income
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold finance-amount-negative">
                  ${(overview?.totalExpenses || 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Expenses
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${(overview?.netSavings || 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
                  ${(overview?.netSavings || 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Net Savings
                </div>
              </div>
            </div>
            
            {overview?.totalIncome > 0 && (
              <div className="w-full bg-muted rounded-full h-4">
                <div 
                  className="gradient-primary h-4 rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(0, Math.min(100, (overview.netSavings / overview.totalIncome) * 100))}%` }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Spending Trends */}
      <Card className="finance-card">
        <CardHeader>
          <CardTitle>Spending Trends</CardTitle>
          <CardDescription>Your spending pattern over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 'auto']} />
                <Tooltip 
                  formatter={(value) => `$${Number(value).toLocaleString()}`}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  stackId="1"
                  stroke="#EF4444" 
                  fill="#EF4444" 
                  fillOpacity={0.6}
                  name="Expenses"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              No trend data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;