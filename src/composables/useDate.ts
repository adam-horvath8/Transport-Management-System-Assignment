import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const useDate = () => {
  const formatDate = (dateString: string) => {
    return dayjs.utc(dateString).format('DD.MM.YYYY')
  }

  return { formatDate }
}
