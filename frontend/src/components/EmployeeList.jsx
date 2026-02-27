import { useState } from "react"
import api from "../api/axios"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function EmployeeList({ employees, refresh }) {
  const { toast } = useToast()
  const [deletingId, setDeletingId] = useState(null)

  if (!employees.length) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        No employees found
      </div>
    )
  }

  const remove = async (id) => {
    try {
      setDeletingId(id)
      await api.delete(`/employees/${id}`)
      toast({
        title: "Employee deleted",
        description: "The employee has been removed successfully.",
      })
      refresh()
    } catch (err) {
      console.error(err)
      toast({
        title: "Delete failed",
        description: "Unable to delete employee.",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Employee ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="text-right w-[80px]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {employees.map((e) => (
            <TableRow key={e.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                {e.employee_id}
              </TableCell>

              <TableCell>{e.full_name}</TableCell>
              <TableCell className="text-muted-foreground">
                {e.email}
              </TableCell>
              <TableCell>{e.department}</TableCell>

              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      disabled={deletingId === e.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Delete employee?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        remove <strong>{e.full_name}</strong>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive hover:bg-destructive/90"
                        onClick={() => remove(e.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}