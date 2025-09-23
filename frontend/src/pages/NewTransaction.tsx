import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, DollarSign, Calendar, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const categories = [
  'Food',
  'Transport', 
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Education',
  'Travel',
  'Salary',
  'Freelance',
  'Investment',
  'Other'
];

const NewTransaction: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0], // Today's date
  });

  const handleChange = (field: keyof typeof formData) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In real app, this would be an API call to your backend
      console.log('Creating transaction:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Transaction created!",
        description: "Your transaction has been successfully added.",
      });
      
      navigate('/transactions');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/transactions')}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Transactions
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Transaction</h1>
        <p className="text-muted-foreground">
          Record a new income or expense transaction
        </p>
      </div>

      <Card className="finance-card max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Transaction Details</span>
          </CardTitle>
          <CardDescription>
            Fill in the details of your transaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Transaction Type */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Transaction Type</Label>
              <RadioGroup 
                value={formData.type} 
                onValueChange={handleChange('type')}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expense" id="expense" />
                  <Label htmlFor="expense" className="cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-destructive"></div>
                      <span>Expense</span>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="income" id="income" />
                  <Label htmlFor="income" className="cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-success"></div>
                      <span>Income</span>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => handleChange('amount')(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date')(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={handleChange('category')}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select a category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter transaction description..."
                value={formData.description}
                onChange={(e) => handleChange('description')(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                className="gradient-primary shadow-financial flex-1"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Transaction'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/transactions')}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewTransaction;