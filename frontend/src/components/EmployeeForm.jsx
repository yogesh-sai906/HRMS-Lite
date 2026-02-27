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

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.employee_id.trim()) {
      newErrors.employee_id = "Employee ID is required";
    } else if (form.employee_id.trim().length < 3) {
      newErrors.employee_id = "Employee ID must be at least 3 characters";
    }

    if (!form.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.department.trim()) {
      newErrors.department = "Department is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast({
        title: "Validation error",
        description: "Please fix the highlighted fields",
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
      setErrors({});

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
      <div>
        <Input
          name="employee_id"
          placeholder="Employee ID"
          value={form.employee_id}
          onChange={handleChange}
          disabled={loading}
          className={errors.employee_id ? "border-red-500" : ""}
        />
        {errors.employee_id && (
          <p className="text-xs text-red-500 mt-1">
            {errors.employee_id}
          </p>
        )}
      </div>

      <div>
        <Input
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleChange}
          disabled={loading}
          className={errors.full_name ? "border-red-500" : ""}
        />
        {errors.full_name && (
          <p className="text-xs text-red-500 mt-1">
            {errors.full_name}
          </p>
        )}
      </div>

      <div>
        <Input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          disabled={loading}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <Input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          disabled={loading}
          className={errors.department ? "border-red-500" : ""}
        />
        {errors.department && (
          <p className="text-xs text-red-500 mt-1">
            {errors.department}
          </p>
        )}
      </div>

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