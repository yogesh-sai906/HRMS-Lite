import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, ClipboardList, ArrowRight } from "lucide-react"
import api from "../api/axios"
import { useToast } from "../hooks/use-toast"

export default function Dashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [employeeCount, setEmployeeCount] = useState(null)
  const [todayPresent, setTodayPresent] = useState(null)

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const empRes = await api.get("/employees/counts")
        setEmployeeCount(empRes.data.total_users)
      } catch (e) {
        console.error(e)
        toast({
          title: "Error",
          description: "Failed to fetch employee count",
        })
      }

      try {
        const attRes = await api.get("/attendance/today/present")
        setTodayPresent(attRes.data.length)
      } catch (e) {
        console.error(e)
        toast({
          title: "Error",
          description: "Failed to fetch attendance counts",
        })
      }
    }

    loadCounts()
  }, [toast])

  const cards = [
    {
      title: "Employees",
      description: "Manage employee records and information",
      icon: Users,
      path: "/employees",
      color: "bg-blue-50 dark:bg-blue-950",
      iconColor: "text-blue-600 dark:text-blue-400",
      count: employeeCount,
    },
    {
      title: "Attendance",
      description: "Track attendance and manage records",
      icon: ClipboardList,
      path: "/attendance",
      color: "bg-green-50 dark:bg-green-950",
      iconColor: "text-green-600 dark:text-green-400",
      count: todayPresent,
    },
  ]

  return (
    <div className="w-full min-h-full bg-background p-6 text-foreground">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Welcome to HRMS Lite. Select a module to get started.
          </p>
        </div>

        {/* Quick summary counts */}
        {/* <div className="mb-6 text-sm text-muted-foreground">
          {employeeCount !== null && (
            <span>Total employees: {employeeCount}</span>
          )}
          {todayPresent !== null && (
            <span className="ml-4">Present today: {todayPresent}</span>
          )}
        </div> */}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => {
            const IconComponent = card.icon
            return (
              <Card
                key={card.path}
                className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 overflow-hidden"
                onClick={() => navigate(card.path)}
              >
                <div className={`${card.color} h-24 flex items-center justify-center`}>
                  <IconComponent className={`${card.iconColor} h-12 w-12`} />
                </div>

                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>
                    {card.description}
                    {card.count !== null && (
                      <span className="block mt-2 text-sm font-medium">
                        {card.title === "Employees" ? "Total employees:" : "Present today:"} {card.count}
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Button variant="ghost" className="gap-2 p-2 h-auto text-primary hover:bg-transparent hover:text-red-600">
                    Go to {card.title}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
