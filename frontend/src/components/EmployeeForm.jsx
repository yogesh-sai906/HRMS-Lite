import { useState } from "react";
import api from "../api/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function EmployeeForm({ onSuccess, onClose }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    if (Object.values(form).some((v) => !v)) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await api.post("/employees", form);
      setForm({
        employee_id: "",
        full_name: "",
        email: "",
        department: "",
      });
      toast({
        title: "Success",
        description: "Employee added successfully",
      });
      onSuccess();
      if (onClose) onClose();
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.detail || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-4">
      <Input
        name="employee_id"
        placeholder="Employee ID"
        value={form.employee_id}
        onChange={handleChange}
        disabled={loading}
      />

      <Input
        name="full_name"
        placeholder="Full Name"
        value={form.full_name}
        onChange={handleChange}
        disabled={loading}
      />

      <Input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        disabled={loading}
      />

      <Input
        name="department"
        placeholder="Department"
        value={form.department}
        onChange={handleChange}
        disabled={loading}
      />

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Adding..." : "Add Employee"}
        </Button>
        {onClose && (
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
