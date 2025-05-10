"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

export function DoctorFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [date, setDate] = useState<Date | undefined>(
    searchParams.get("date") ? new Date(searchParams.get("date")!) : undefined,
  )

  const [priceRange, setPriceRange] = useState([0, 500])
  const [availability, setAvailability] = useState<string>(searchParams.get("availability") || "")
  const [rating, setRating] = useState<string>(searchParams.get("rating") || "")
  const [gender, setGender] = useState<string>(searchParams.get("gender") || "")

  const [insurances, setInsurances] = useState<string[]>([])

  const handleInsuranceChange = (insurance: string, checked: boolean) => {
    if (checked) {
      setInsurances([...insurances, insurance])
    } else {
      setInsurances(insurances.filter((i) => i !== insurance))
    }
  }

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (date) params.set("date", format(date, "yyyy-MM-dd"))
    else params.delete("date")

    if (availability) params.set("availability", availability)
    else params.delete("availability")

    if (rating) params.set("rating", rating)
    else params.delete("rating")

    if (gender) params.set("gender", gender)
    else params.delete("gender")

    if (insurances.length > 0) params.set("insurances", insurances.join(","))
    else params.delete("insurances")

    params.set("minPrice", priceRange[0].toString())
    params.set("maxPrice", priceRange[1].toString())

    router.push(`/patient/find-doctors?${params.toString()}`)
  }

  const resetFilters = () => {
    setDate(undefined)
    setPriceRange([0, 500])
    setAvailability("")
    setRating("")
    setGender("")
    setInsurances([])

    router.push("/patient/find-doctors")
  }

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <h3 className="font-medium text-lg mb-4">Filters</h3>

      <Accordion type="multiple" defaultValue={["date", "availability", "price", "rating", "gender", "insurance"]}>
        <AccordionItem value="date">
          <AccordionTrigger>Appointment Date</AccordionTrigger>
          <AccordionContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="availability">
          <AccordionTrigger>Availability</AccordionTrigger>
          <AccordionContent>
            <RadioGroup value={availability} onValueChange={setAvailability}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="morning" id="morning" />
                <Label htmlFor="morning">Morning</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="afternoon" id="afternoon" />
                <Label htmlFor="afternoon">Afternoon</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="evening" id="evening" />
                <Label htmlFor="evening">Evening</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider defaultValue={[0, 500]} max={500} step={10} value={priceRange} onValueChange={setPriceRange} />
              <div className="flex justify-between">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rating">
          <AccordionTrigger>Rating</AccordionTrigger>
          <AccordionContent>
            <RadioGroup value={rating} onValueChange={setRating}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4+" id="rating-4" />
                <Label htmlFor="rating-4">4+ stars</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3+" id="rating-3" />
                <Label htmlFor="rating-3">3+ stars</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2+" id="rating-2" />
                <Label htmlFor="rating-2">2+ stars</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="gender">
          <AccordionTrigger>Doctor Gender</AccordionTrigger>
          <AccordionContent>
            <RadioGroup value={gender} onValueChange={setGender}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="gender-male" />
                <Label htmlFor="gender-male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="gender-female" />
                <Label htmlFor="gender-female">Female</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="insurance">
          <AccordionTrigger>Insurance</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="insurance-aetna"
                  checked={insurances.includes("aetna")}
                  onCheckedChange={(checked) => handleInsuranceChange("aetna", checked as boolean)}
                />
                <Label htmlFor="insurance-aetna">Aetna</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="insurance-bluecross"
                  checked={insurances.includes("bluecross")}
                  onCheckedChange={(checked) => handleInsuranceChange("bluecross", checked as boolean)}
                />
                <Label htmlFor="insurance-bluecross">Blue Cross</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="insurance-cigna"
                  checked={insurances.includes("cigna")}
                  onCheckedChange={(checked) => handleInsuranceChange("cigna", checked as boolean)}
                />
                <Label htmlFor="insurance-cigna">Cigna</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="insurance-medicare"
                  checked={insurances.includes("medicare")}
                  onCheckedChange={(checked) => handleInsuranceChange("medicare", checked as boolean)}
                />
                <Label htmlFor="insurance-medicare">Medicare</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-6 space-y-2">
        <Button className="w-full" onClick={applyFilters}>
          Apply Filters
        </Button>
        <Button variant="outline" className="w-full" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    </div>
  )
}
