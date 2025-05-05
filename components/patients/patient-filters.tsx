"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

export function PatientFilters() {
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const handleAddFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter])
    }
  }

  const handleRemoveFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))
  }

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-2 justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search patients..." className="pl-8 w-full" />
          </div>
          <Select onValueChange={(value) => handleAddFilter(`Sort: ${value}`)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="recent">Recent Visit</SelectItem>
              <SelectItem value="age-asc">Age (Youngest)</SelectItem>
              <SelectItem value="age-desc">Age (Oldest)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Patients</SheetTitle>
                <SheetDescription>Apply filters to narrow down your patient list</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select onValueChange={(value) => handleAddFilter(`Gender: ${value}`)}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age Range</Label>
                  <Select onValueChange={(value) => handleAddFilter(`Age: ${value}`)}>
                    <SelectTrigger id="age">
                      <SelectValue placeholder="Select age range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-18">0-18 years</SelectItem>
                      <SelectItem value="19-35">19-35 years</SelectItem>
                      <SelectItem value="36-50">36-50 years</SelectItem>
                      <SelectItem value="51-65">51-65 years</SelectItem>
                      <SelectItem value="65+">65+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Medical Conditions</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="condition-hypertension"
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleAddFilter("Condition: Hypertension")
                          } else {
                            handleRemoveFilter("Condition: Hypertension")
                          }
                        }}
                      />
                      <label
                        htmlFor="condition-hypertension"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Hypertension
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="condition-diabetes"
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleAddFilter("Condition: Diabetes")
                          } else {
                            handleRemoveFilter("Condition: Diabetes")
                          }
                        }}
                      />
                      <label
                        htmlFor="condition-diabetes"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Diabetes
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="condition-asthma"
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleAddFilter("Condition: Asthma")
                          } else {
                            handleRemoveFilter("Condition: Asthma")
                          }
                        }}
                      />
                      <label
                        htmlFor="condition-asthma"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Asthma
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="condition-anxiety"
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleAddFilter("Condition: Anxiety")
                          } else {
                            handleRemoveFilter("Condition: Anxiety")
                          }
                        }}
                      />
                      <label
                        htmlFor="condition-anxiety"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Anxiety
                      </label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Visit Status</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="visit-recent"
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleAddFilter("Visit: Recent (30 days)")
                          } else {
                            handleRemoveFilter("Visit: Recent (30 days)")
                          }
                        }}
                      />
                      <label
                        htmlFor="visit-recent"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Recent (30 days)
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="visit-upcoming"
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleAddFilter("Visit: Upcoming")
                          } else {
                            handleRemoveFilter("Visit: Upcoming")
                          }
                        }}
                      />
                      <label
                        htmlFor="visit-upcoming"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Upcoming
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="visit-overdue"
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleAddFilter("Visit: Overdue")
                          } else {
                            handleRemoveFilter("Visit: Overdue")
                          }
                        }}
                      />
                      <label
                        htmlFor="visit-overdue"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Overdue
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <SheetFooter>
                <Button type="submit">Apply Filters</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="gap-1">
              {filter}
              <button className="ml-1 rounded-full hover:bg-muted p-0.5" onClick={() => handleRemoveFilter(filter)}>
                <span className="sr-only">Remove filter</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setActiveFilters([])}>
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
