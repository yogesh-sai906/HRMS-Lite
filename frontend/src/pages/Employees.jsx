import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Employees() {
  const { toast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to load employees",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    // avoid lint warning about setState in effect by inlining the request
    (async () => {
      try {
        const res = await api.get("/employees");
        setEmployees(res.data);
      } catch (e) {
        console.error(e);
        toast({
          title: "Error",
          description: "Failed to load employees",
          variant: "destructive",
        });
      }
    })();
  }, [toast]);

  return (
    <div className="w-full min-h-full bg-background p-6 text-foreground">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Employees</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Add and manage employees
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        </div>

        {/* Employee List - Full Width */}
        <Card className="flex flex-col h-[70vh]">
          <CardHeader>
            <div className="w-full flex items-center justify-between">
              <CardTitle>Employee List</CardTitle>
              <div className="relative w-full md:w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name or ID"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-8"
                />
                {searchTerm && (
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-y-auto">
            <EmployeeList
              employees={employees.filter(e =>
                searchTerm
                  ? e.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    e.employee_id.toString().includes(searchTerm)
                  : true
              )}
              refresh={load}
            />
          </CardContent>
        </Card>

        {/* Add Employee Dialog */}
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Add New Employee</AlertDialogTitle>
            </AlertDialogHeader>
            <EmployeeForm
              onSuccess={load}
              onClose={() => setDialogOpen(false)}
            />
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}