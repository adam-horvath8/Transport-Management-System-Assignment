import type { WaypointTypeEnum } from '@/enums'

export type Order = {
  id?: string
  number: number | null
  customer_name: string
  date: string
  waypoints: Waypoint[]
}

export type Waypoint = {
  id: string
  location_address: string
  type: (typeof WaypointTypeEnum)[keyof typeof WaypointTypeEnum]
}
