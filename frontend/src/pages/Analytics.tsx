import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { TrendingUp, DollarSign, Calendar, Target } from 'lucide-react';

// Demo analytics data
const monthlyComparison = [
  { month: 'Jan', income: 2500, expenses: 1200, savings: 1300 },
  { month: 'Feb', income: 2500, expenses: 1400, savings: 1100 },
  { month: 'Mar', income: 2500, expenses: 1100, savings: 1400 },
  { month: 'Apr', income: 2500, expenses: 1300, savings: 1200 },
  { month: 'May', income: 2500, expenses: 1250, savings: 1250 },
  { month: 'Jun', income: 2500, expenses: 1350, savings: 1150 },
];

const categorySpending = [
  { category: 'Food', amount: 450, percentage: 35 },
  { category: 'Transport', amount: 200, percentage: 16 },
  { category: 'Entertainment', amount: 150, percentage: 12 },
  { category: 'Shopping', amount: 300, percentage: 23 },
  { category: 'Bills', amount: 180, percentage: 14 },
];

const savingsGoal = {
  target: 5000,
  current: 3200,
  percentage: 64
};

const Analytics: React.FC = () => {
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
            <div className="text-2xl font-bold text-success">48%</div>
            <p className="text-xs text-muted-foreground">
              +2% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="finance-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Monthly Spending</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,267</div>
            <p className="text-xs text-muted-foreground">
              -5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="finance-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Adherence</CardTitle>
            <Calendar className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">85%</div>
            <p className="text-xs text-muted-foreground">
              On track this month
            </p>
          </CardContent>
        </Card>

        <Card className="finance-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">+12%</div>
            <p className="text-xs text-muted-foreground">
              Year over year
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="finance-card">
          <CardHeader>
            <CardTitle>Income vs Expenses vs Savings</CardTitle>
            <CardDescription>Monthly financial overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="income" fill="#10B981" name="Income" />
                <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                <Bar dataKey="savings" fill="#3B82F6" name="Savings" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="finance-card">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Current month breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categorySpending.map((item, index) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.category}</span>
                    <span className="finance-amount-negative">${item.amount}</span>
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
          </CardContent>
        </Card>
      </div>

      {/* Savings Goal Progress */}
      <Card className="finance-card">
        <CardHeader>
          <CardTitle>Savings Goal Progress</CardTitle>
          <CardDescription>Track your progress towards your savings target</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold finance-amount-positive">
                  ${savingsGoal.current.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  of ${savingsGoal.target.toLocaleString()} goal
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {savingsGoal.percentage}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Complete
                </div>
              </div>
            </div>
            
            <div className="w-full bg-muted rounded-full h-4">
              <div 
                className="gradient-primary h-4 rounded-full transition-all duration-700"
                style={{ width: `${savingsGoal.percentage}%` }}
              />
            </div>
            
            <div className="text-sm text-muted-foreground">
              ${(savingsGoal.target - savingsGoal.current).toLocaleString()} remaining to reach your goal
            </div>
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
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;