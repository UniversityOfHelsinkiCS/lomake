import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getProgrammesUsersAction } from '../../util/redux/programmesUsersReducer'
import ProgramControlsUsers from './ProgramControlsUsers'
import FormLocker from './FormLocker'
import { useGetJoryMapQuery } from '../../util/redux/organisation'
import { organisationCodeToIam } from '@/config/common'

const OwnerAccordionContent = ({ programKey, form }) => {
  const dispatch = useDispatch()
  const [dataLoading, setDataLoading] = useState(false)
  const [dataReady, setDataReady] = useState(false)
  const usersPending = useSelector(({ programmesUsers }) => programmesUsers.pending)
  const { data } = useGetJoryMapQuery()
  const programJoryIam = organisationCodeToIam(programKey, data)

  useEffect(() => {
    setDataLoading(true)
    dispatch(getProgrammesUsersAction(programKey))
  }, [])

  useEffect(() => {
    if (!usersPending && dataLoading) {
      setDataReady(true)
      setDataLoading(false)
    }
  }, [usersPending])

  if (!dataReady) return null

  return (
    <>
      <h4>{programJoryIam}</h4>
      <FormLocker programme={programKey} form={form} />
      <ProgramControlsUsers programme={programKey} joryIam={programJoryIam} />
    </>
  )
}

export default OwnerAccordionContent
