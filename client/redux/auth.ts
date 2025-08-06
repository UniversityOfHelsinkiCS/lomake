import { ARCHIVE_LAST_YEAR, isAdmin, isSuperAdmin } from '../../config/common'
import { defaultYears } from '../util/common'
import { RTKApi } from '../util/apiConnection'

export const getYearsUserHasAccessTo = (access: any) => {
  let usersYears: any = []
  // Set all the three answered years to be the options by default
  const allYears = defaultYears
  // Add current year as the first one, if it does not exist
  if (!allYears.includes(ARCHIVE_LAST_YEAR)) allYears.unshift(ARCHIVE_LAST_YEAR)
  // eslint disabled as using for-loop is reasonable here
  // eslint-disable-next-line no-restricted-syntax
  for (const p of Object.values(access) as any) {
    // If user only has access to one year of data, show only that year in the filters and front page
    if (p.year && !usersYears.includes(p.year)) {
      usersYears = [...usersYears, p.year]
    } else if (!p.year) {
      usersYears = allYears
      break
    }
  }
  if (usersYears.length) return usersYears
  return allYears
}

const usersApi = RTKApi.injectEndpoints({
  endpoints: builder => ({
    login: builder.query({
      query: () => '/login',
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),
  })
})

export const { useLoginQuery, useLogoutMutation } = usersApi

export const useGetAuthUserQuery = () => {
  const { data, isLoading, isFetching, error, ...rest } = useLoginQuery({})
  if (isLoading || isFetching || error) return { data, isLoading, isFetching, error, ...rest }
  return {
    ...data,
    yearsUserHasAccessTo: getYearsUserHasAccessTo(data.access),
    isAdmin: isAdmin(data) || isSuperAdmin(data),
    isSuperAdmin: isSuperAdmin(data),
    isLoading,
    error,
    ...rest,
  }
}
