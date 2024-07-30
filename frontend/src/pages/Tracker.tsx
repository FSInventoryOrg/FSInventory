'use client'

import React from 'react';
import { EmployeeColumns } from '@/components/tracker-ui/EmployeeColumns';
import { EmployeeTable } from '@/components/tracker-ui/EmployeeTable'
import * as imsService from '@/ims-service';
import { useQuery } from '@tanstack/react-query';
import { EmployeeType } from '@/types/employee';
import { EmployeeTableSuspense } from '@/components/tracker-ui/EmployeeTableSuspense';
import DeploymentInfo from '@/components/tracker-ui/DeploymentInfo';
import Filter from '@/components/graphics/Filter';
import { useParams } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button';

const Tracker = () => {
  const { employeeCode } = useParams();
  const { data: employeeByUrl } = useQuery({
    queryKey: ['fetchEmployeeByCode', employeeCode], 
    queryFn: () => imsService.fetchEmployeeByCode(employeeCode || ''),
    enabled: !!employeeCode,
  });

  const [key, setKey] = React.useState(+new Date())
  const [open, setOpen] = React.useState(false);
  const [employees, setEmployees] = React.useState<EmployeeType[]>();
  const [selectedEmployee, setSelectedEmployee] = React.useState<EmployeeType>();

  const { data: registeredEmployees } = useQuery({ 
    queryKey: ['fetchEmployees'],
    queryFn: () => imsService.fetchAllEmployees(), 
  });
  const { data: unregisteredEmployees } = useQuery<string[]>({ 
    queryKey: ['fetch', 'assignee'], 
    queryFn: () => imsService.fetchAssetUniqueValuesByProperty('assignee'),
  });
  
  const { data: employeePositions } = useQuery<string[]>({ 
    queryKey: ['fetch', 'position'], 
    queryFn: () => imsService.fetchEmployeeUniqueValuesByProperty('position'),
  });

  const handleEmployeeSelect = (employee: EmployeeType) => {
    setSelectedEmployee(employee);
    setOpen(false);
  };

  const mergeEmployees = () => {
    const allEmployees: EmployeeType[] = [];
    const employeesAdded = new Set<string>();
    // Add registered employees
    if (registeredEmployees) {
      registeredEmployees.forEach((employee: EmployeeType) => {
        const name = `${employee.firstName} ${employee.lastName}`;
        allEmployees.push({
          ...employee,
          name: name,
          isRegistered: true,
        });
          employeesAdded.add(name)
      });
    }
    // Add unregistered employees
    if (unregisteredEmployees) {
      unregisteredEmployees.forEach((name: string) => {
        const nameParts = name.split(' ');
        const lastName = nameParts.pop()!;
        const firstName = nameParts.join(' ');
        if (!employeesAdded.has(name)) {
          allEmployees.push({
            _id: '', // Assign a unique ID or leave it empty if it's not available
            code: '', // You can assign a code or leave it empty
            firstName: firstName,
            middleName: '',
            lastName: lastName,
            name: name,
            position: '',
            startDate: new Date(),
            isActive: true,
            isRegistered: false, // Set isActive to true for unregistered employees
          });
        }
      });
    }
    // Sort employees by registered status and then by name or code
    allEmployees.sort((a, b) => {
      // Sort by registered status: registered employees come first
      if (a.isRegistered !== b.isRegistered) {
        return a.isRegistered ? -1 : 1;
      }
      // If both are registered or unregistered, sort alphabetically by name or code
      return a.isRegistered ? a.code.localeCompare(b.code) : a.name.localeCompare(b.name);
    });

    return allEmployees;
  }

  const handleFilters = (filters: string[]) => {
    const allEmployees = mergeEmployees();
    if (!allEmployees) return; // Ensure employees data is available
  
    const filteredEmployees = allEmployees.filter((employee) => {
      const statuses = ['Active', 'Inactive', 'Registered', 'Unregistered']
      return filters.some((filter) => {
        if (statuses.includes(filter)) {
          if (filter==='Active' && !employee.isActive) return false
          if (filter==='Inactive' && employee.isActive) return false
          if (filter==='Registered' && !employee.isRegistered) return false
          if (filter==='Unregistered' && employee.isRegistered) return false
          return true
        } 
        else if (employeePositions?.includes(filter)) {
          // filter for position
          return employee.position?.toLowerCase() === filter.toLowerCase();
        }
        return Object.values(employee).some((value)=> {
            return value?.toString().toLowerCase() === filter.toLowerCase() 
        })
      })
    });
  
    setEmployees(filteredEmployees);
  };
  
  React.useEffect(() => {
    const allEmployees = mergeEmployees();
    if (unregisteredEmployees) {
      setEmployees(allEmployees);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registeredEmployees, unregisteredEmployees])

  React.useEffect(() => {
    if (employeeCode) {
      setSelectedEmployee(employeeByUrl)
      setKey(+new Date())
    }
  }, [employeeByUrl, employeeCode])

  const [height, setHeight] = React.useState('calc(100vh - 91px)');
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setHeight('calc(100vh - 91px)');
      } else {
        setHeight('');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth >= 1280) {
        setOpen(false)
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);
  
  return (
    <section 
      id="tracker" 
      className="flex gap-3 sm:gap-6 w-full px-3 pb-3 sm:px-6 sm:pb-6 pt-3" 
      style={{ height }}
    >
      <aside className="order-first hidden xl:flex xl:w-80 z-50">
        {employees ? (
          <EmployeeTable
            columns={EmployeeColumns} 
            data={employees} 
            onEmployeeSelect={handleEmployeeSelect}
            onFilter={handleFilters}
          /> 
        ) : ( 
          <EmployeeTableSuspense />
        )}
      </aside>
      <main className="flex-1 flex flex-col gap-3 w-full">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className='xl:hidden bg-accent' variant="outline">View Employees</Button>
          </SheetTrigger>
          <SheetContent side='left' className='h-full overflow-y-scroll w-full'>
            <SheetHeader className='pb-4'>
              <SheetTitle>Employees</SheetTitle>
              <SheetDescription className='hidden sm:flex'>
                Select an employee below to view their currently deployed and past assets.
              </SheetDescription>
            </SheetHeader>
            {employees ? (
              <EmployeeTable
                columns={EmployeeColumns} 
                data={employees} 
                onEmployeeSelect={handleEmployeeSelect}
                onFilter={handleFilters}
              /> 
            ) : ( 
              <EmployeeTableSuspense />
            )}
          </SheetContent>
        </Sheet>
        {selectedEmployee ? (
          <DeploymentInfo key={key} employee={selectedEmployee} assignee={selectedEmployee.code ? selectedEmployee.code : `${selectedEmployee.firstName} ${selectedEmployee.lastName}`} />
        ) : (
          <div className='w-full h-full flex flex-col justify-center items-center'>
            <Filter height={300} width={300} />
            <span className='text-sm text-muted-foreground'>Select an employee to view their deployed assets</span>
          </div>
        )}
      </main>
    </section>
  )
}

export default Tracker;