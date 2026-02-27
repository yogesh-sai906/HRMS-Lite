import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

export default function Attendance() {
  const { toast } = useToast();

  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [mode, setMode] = useState("today"); // "today" | "employee"
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    employee_id: "",
    date: "",
    status: "Present",
  });

  const today = new Date().toISOString().split("T")[0];

  // Load employees for dropdown
  const loadEmployees = useCallback(async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load employees",
        variant: "destructive",
      });
    }
  }, [toast]);

  // 🔹 Load who is present today (DEFAULT)
  const loadTodayPresent = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/attendance/today/present");
      setRecords(res.data);
      setMode("today");

      if (res.data.length === 0) {
        toast({
          title: "No Attendance",
          description: "No employees marked present today",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load today's attendance",
        variant: "destructive",
      });
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // 🔹 Search by Employee ID
  const handleSearch = async () => {
    if (!searchId.trim()) {
      toast({
        title: "Error",
        description: "Please enter an Employee ID",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/attendance/${searchId}`);
      setRecords(res.data);
      setMode("employee");

      if (res.data.length === 0) {
        toast({
          title: "No Records",
          description: "No attendance found for this employee",
        });
      }
    } catch (e) {
      toast({
        title: "Error",
        description:
          e.response?.data?.detail || "Failed to fetch attendance",
        variant: "destructive",
      });
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadEmployees();
    loadTodayPresent();
  }, [loadEmployees, loadTodayPresent]);

  // Submit attendance
  const submit = async (e) => {
    e.preventDefault();

    if (!form.employee_id || !form.date) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.post("/attendance", form);
      toast({
        title: "Success",
        description: "Attendance marked successfully",
      });

      setForm({
        employee_id: "",
        date: "",
        status: "Present",
      });

      // Refresh today view if applicable
      if (mode === "today" && form.date === today) {
        loadTodayPresent();
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to mark attendance",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-background px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-lg font-medium">Attendance</h1>
          <p className="text-sm text-muted-foreground">
            {mode === "today"
              ? "Who is present today"
              : "Attendance history by employee"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT: MARK ATTENDANCE */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Mark Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-4">
                <Select
                  value={form.employee_id}
                  onValueChange={(value) =>
                    setForm({ ...form, employee_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((e) => (
                      <SelectItem
                        key={e.id}
                        value={e.employee_id.toString()}
                      >
                        {e.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="date"
                  max={today}
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                />

                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    setForm({ ...form, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Present">Present</SelectItem>
                    <SelectItem value="Absent">Absent</SelectItem>
                  </SelectContent>
                </Select>

                <Button type="submit" className="w-full">
                  Mark Attendance
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* RIGHT: TABLE */}
          <Card className="flex flex-col h-[60vh]">
            <CardHeader className="pb-3 space-y-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Attendance Records
                </CardTitle>
              </div>

              {/* Search */}
              <div className="flex gap-2">
                <Input
                  placeholder="Search by Employee ID"
                  value={searchId}
                  onChange={(e) => {
                    setSearchId(e.target.value);
                    if (!e.target.value) {
                      loadTodayPresent(); // reset to today
                    }
                  }}
                />
                <Button
                  variant="outline"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  Search
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-2">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-10">
                        Loading…
                      </TableCell>
                    </TableRow>
                  ) : records.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center py-10 text-muted-foreground"
                      >
                        No records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    records.map((r, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">
                          {r.full_name || r.employee_name || "—"}
                        </TableCell>
                        <TableCell>
                          {r.date
                            ? new Date(`${r.date}T00:00:00`).toLocaleDateString("en-IN")
                            : today}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              r.status === "Present" || !r.status
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {r.status || "Present"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}