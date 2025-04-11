"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Star } from "lucide-react"
import Link from "next/link"

// Mock data - would come from Convex in a real app
const doctors = [
  {
    id: "1",
    name: "Dr. James Wilson",
    specialty: "Cardiologist",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.8,
    reviews: 124,
  },
  {
    id: "2",
    name: "Dr. Maria Garcia",
    specialty: "Dermatologist",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.9,
    reviews: 98,
  },
  {
    id: "3",
    name: "Dr. Robert Chen",
    specialty: "Neurologist",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.7,
    reviews: 86,
  },
]

export function DoctorSearchPreview() {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search by name or specialty..." className="pl-8" />
      </div>
      <div className="space-y-3">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={doctor.avatar} />
                <AvatarFallback>{doctor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{doctor.name}</h4>
                <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                <div className="flex items-center text-xs mt-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-muted-foreground">
                    {doctor.rating} ({doctor.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>
            <Button size="sm" variant="outline">
              Book
            </Button>
          </div>
        ))}
      </div>
      <div className="text-center">
        <Link href="/patient/find-doctors">
          <Button variant="link" size="sm">
            View all doctors
          </Button>
        </Link>
      </div>
    </div>
  )
}

