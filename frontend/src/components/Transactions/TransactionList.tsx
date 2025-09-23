import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  TrendingUp,
  TrendingDown 
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
}

// Demo data - In real app, this would come from your backend API
const mockTransactions: Transaction[] = [
  { id: '1', amount: -50.00, category: 'Food', description: 'Groceries at Whole Foods', date: '2024-01-15', type: 'expense' },
  { id: '2', amount: -30.00, category: 'Transport', description: 'Gas station', date: '2024-01-14', type: 'expense' },
  { id: '3', amount: 2500.00, category: 'Salary', description: 'Monthly salary deposit', date: '2024-01-01', type: 'income' },
  { id: '4', amount: -100.00, category: 'Entertainment', description: 'Movie tickets', date: '2024-01-10', type: 'expense' },
  { id: '5', amount: -200.00, category: 'Shopping', description: 'Clothing store', date: '2024-01-12', type: 'expense' },
  { id: '6', amount: -75.50, category: 'Food', description: 'Restaurant dinner', date: '2024-01-13', type: 'expense' },
  { id: '7', amount: 500.00, category: 'Freelance', description: 'Client project payment', date: '2024-01-08', type: 'income' },
  { id: '8', amount: -25.00, category: 'Transport', description: 'Uber ride', date: '2024-01-11', type: 'expense' },
];

const categories = ['All', 'Food', 'Transport', 'Entertainment', 'Shopping', 'Salary', 'Freelance', 'Bills', 'Healthcare'];

const TransactionList: React.FC = () => {
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || transaction.category === selectedCategory;
      const matchesType = selectedType === 'All' || transaction.type === selectedType;
      
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [searchTerm, selectedCategory, selectedType]);

  const handleEdit = (id: string) => {
    console.log('Edit transaction:', id);
    // In real app, navigate to edit form
  };

  const handleDelete = (id: string) => {
    console.log('Delete transaction:', id);
    // In real app, call delete API
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Manage and track all your financial transactions
          </p>
        </div>
        
        {hasPermission('write') && (
          <Button asChild className="gradient-primary shadow-financial">
            <Link to="/transactions/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="finance-card">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter your transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedType('All');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="finance-card">
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  {hasPermission('write') && <TableHead className="w-[70px]">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{transaction.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {transaction.type === 'income' ? (
                          <TrendingUp className="h-4 w-4 text-success" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                        <span className="capitalize">{transaction.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={transaction.type === 'income' ? 'finance-amount-positive' : 'finance-amount-negative'}>
                        {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
                      </span>
                    </TableCell>
                    {hasPermission('write') && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(transaction.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(transaction.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredTransactions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-muted-foreground">No transactions found</div>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search criteria or add a new transaction.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionList;