import { Place } from '../interfaces/place'

export function isArray(place: Place[] | Place): place is Place[] {
  return (<Place[]>place).length >= 0
}
