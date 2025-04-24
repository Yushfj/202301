'use client';

import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { updateEmployee, getEmployees } from '@/services/employee-service';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Employee {
  id: string;
  name: string;
  position: string;
  hourlyWage: string;
  fnpfNo: string;
  bankCode: string;
  bankAccountNumber: string;
  paymentMethod: 'cash' | 'online';
  branch: 'labasa' | 'suva';
}

// Ensure dynamic rendering
export const dynamic = 'force-dynamic';

const EmployeeFormContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    name: '',
    position: '',
    hourlyWage: '',
    fnpfNo: '',
    bankCode: '',
    bankAccountNumber: '',
    paymentMethod: 'cash',
    branch: 'labasa'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeeData = await getEmployees();
        setEmployees(employeeData);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch employees',
          variant: 'destructive',
        });
      }
    };

    fetchEmployees();
  }, [toast]);

  useEffect(() => {
    const employeeId = searchParams.get('id');
    if (employeeId) {
      setSelectedEmployeeId(employeeId);
      const employee = employees.find(emp => emp.id === employeeId);
      if (employee) {
        const { id, ...employeeData } = employee;
        setFormData(employeeData);
      }
    }
  }, [searchParams, employees]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.name || !formData.position || !formData.hourlyWage || !formData.fnpfNo) {
        throw new Error('Please fill in all required fields');
      }

      if (formData.paymentMethod === 'online' && (!formData.bankCode || !formData.bankAccountNumber)) {
        throw new Error('Bank details required for online payments');
      }

      await updateEmployee({
        id: selectedEmployeeId,
        ...formData
      });

      toast({
        title: 'Success',
        description: 'Employee updated successfully',
      });

      router.push('/employees/information');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-transparent backdrop-blur-md shadow-lg rounded-lg border border-accent/40">
      <CardHeader>
        <CardTitle className="text-2xl text-white text-center">
          Change Employee Information
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="employee" className="text-white">
              Select Employee
            </Label>
            <Select
              value={selectedEmployeeId}
              onValueChange={setSelectedEmployeeId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map(employee => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label className="text-white">Branch</Label>
            <RadioGroup 
              value={formData.branch} 
              onValueChange={v => handleChange('branch', v as 'labasa' | 'suva')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="labasa" id="labasa" />
                <Label htmlFor="labasa" className="text-white">Labasa</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="suva" id="suva" />
                <Label htmlFor="suva" className="text-white">Suva</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name" className="text-white">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="position" className="text-white">Position</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={e => handleChange('position', e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="hourlyWage" className="text-white">Hourly Wage</Label>
            <Input
              id="hourlyWage"
              type="number"
              value={formData.hourlyWage}
              onChange={e => handleChange('hourlyWage', e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fnpfNo" className="text-white">FNPF Number</Label>
            <Input
              id="fnpfNo"
              value={formData.fnpfNo}
              onChange={e => handleChange('fnpfNo', e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-white">Payment Method</Label>
            <RadioGroup
              value={formData.paymentMethod}
              onValueChange={v => handleChange('paymentMethod', v as 'cash' | 'online')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="text-white">Cash</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online" className="text-white">Online</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.paymentMethod === 'online' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="bankCode" className="text-white">Bank Code</Label>
                <Input
                  id="bankCode"
                  value={formData.bankCode}
                  onChange={e => handleChange('bankCode', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="accountNumber" className="text-white">Account Number</Label>
                <Input
                  id="accountNumber"
                  value={formData.bankAccountNumber}
                  onChange={e => handleChange('bankAccountNumber', e.target.value)}
                />
              </div>
            </>
          )}

          <Button 
            type="submit" 
            className="w-full mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Employee'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default function ChangeEmployeeInfoPage() {
  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <Image
        src="https://picsum.photos/1920/1080"
        alt="Background"
        fill
        priority
        className="absolute top-0 left-0 w-full h-full -z-10 object-cover"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 -z-9" />
      
      <Suspense fallback={
        <div className="text-white text-lg p-8 bg-black/50 rounded-lg">
          Loading employee data...
        </div>
      }>
        <EmployeeFormContent />
      </Suspense>
    </div>
  );
}
