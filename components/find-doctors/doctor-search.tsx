"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DoctorSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "")
  const [location, setLocation] = useState(searchParams.get("location") || "")
  const [specialty, setSpecialty] = useState(searchParams.get("specialty") || "")

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set("query", searchQuery)
    if (location) params.set("location", location)
    if (specialty) params.set("specialty", specialty)

    router.push(`/patient/find-doctors?${params.toString()}`)
  }

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by doctor name"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Location"
            className="pl-9"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <Select value={specialty} onValueChange={setSpecialty}>
          <SelectTrigger>
            <SelectValue placeholder="Select specialty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specialties</SelectItem>
            <SelectItem value="cardiology">Cardiology</SelectItem>
            <SelectItem value="dermatology">Dermatology</SelectItem>
            <SelectItem value="neurology">Neurology</SelectItem>
            <SelectItem value="orthopedics">Orthopedics</SelectItem>
            <SelectItem value="pediatrics">Pediatrics</SelectItem>
            <SelectItem value="psychiatry">Psychiatry</SelectItem>
            <SelectItem value="gynecology">Gynecology</SelectItem>
            <SelectItem value="ophthalmology">Ophthalmology</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 flex justify-end">
        <Button onClick={handleSearch}>
          <Search className="mr-2 h-4 w-4" />
          Search Doctors
        </Button>
      </div>
    </div>
  )
}
