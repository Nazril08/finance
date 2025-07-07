"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { AddGoalModal, GoalFormValues } from "./add-goal-modal"
import { differenceInMonths, differenceInWeeks } from "date-fns"

export interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    startDate: Date;
    endDate: Date;
    image?: string | null;
}

export function GoalsPage() {
    const [goals, setGoals] = useState<Goal[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
          const storedGoals = localStorage.getItem("goals");
          if (storedGoals) {
            return JSON.parse(storedGoals).map((g: any) => ({ 
                ...g, 
                startDate: new Date(g.startDate),
                endDate: new Date(g.endDate),
            }));
          }
        } catch (error) {
          console.error("Failed to parse goals from localStorage on init", error);
        }
        return [];
    });

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem("goals", JSON.stringify(goals));
    }, [goals]);

    const handleGoalAdded = (data: GoalFormValues) => {
        const newGoal: Goal = {
            id: crypto.randomUUID(),
            name: data.name,
            targetAmount: data.targetAmount,
            startDate: data.dateRange.from,
            endDate: data.dateRange.to,
            image: data.image as string | null,
        }
        setGoals(prev => [...prev, newGoal]);
    }

    const calculateSavings = (goal: Goal) => {
        const weeks = differenceInWeeks(goal.endDate, goal.startDate);
        const months = differenceInMonths(goal.endDate, goal.startDate);

        const weeklySaving = weeks > 0 ? goal.targetAmount / weeks : goal.targetAmount;
        const monthlySaving = months > 0 ? goal.targetAmount / months : goal.targetAmount;

        return { weeklySaving, monthlySaving };
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">My Goals</h1>
                <Button onClick={() => setIsAddModalOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Goal
                </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {goals.map((goal) => {
                    const { weeklySaving, monthlySaving } = calculateSavings(goal);
                    return (
                        <Card key={goal.id} className="overflow-hidden">
                            <div className="h-40 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                {goal.image ? (
                                    <img src={goal.image} alt={goal.name} className="h-full w-full object-cover" />
                                ) : (
                                    <Target className="h-16 w-16 text-gray-400" />
                                )}
                            </div>
                            <CardHeader>
                                <CardTitle>{goal.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">
                                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(goal.targetAmount)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Target: {new Date(goal.endDate).toLocaleDateString()}
                                </p>
                            </CardContent>
                            <CardFooter className="flex-col items-start gap-2 text-sm">
                               <p><strong>Weekly Savings:</strong> {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(weeklySaving)}</p>
                               <p><strong>Monthly Savings:</strong> {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(monthlySaving)}</p>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>

            {goals.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                    <p>No goals found.</p>
                    <p className="text-sm">Get started by adding a new goal.</p>
                </div>
            )}

            <AddGoalModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onGoalAdded={handleGoalAdded}
            />
        </div>
    );
} 