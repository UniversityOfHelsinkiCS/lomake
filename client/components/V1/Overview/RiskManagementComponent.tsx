import Modal from '../Generic/ModalTemplateComponent'
import { Button, Typography, Box } from '@mui/material'
import { ArrowForward, MailOutlined } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

const RiskManagementComponent = ({
  modalOpen,
  setModalOpen,
}: {
  modalOpen: boolean
  setModalOpen: (open: boolean) => void
}) => {
  const { t } = useTranslation()
  return (
    <Modal contentSx={{ width: '100%' }} data-cy="risk-management-modal" open={modalOpen} setOpen={setModalOpen}>
      <Typography variant="h4">{t('riskManagement:header')}</Typography>
      <Typography sx={{ mt: 2 }}>{t('riskManagement:description1')}</Typography>
      <Typography sx={{ mt: 2 }}>{t('riskManagement:description2')}</Typography>
      <Button
        href="https://suunta.it.helsinki.fi"
        rel="noopener noreferrer"
        startIcon={<ArrowForward />}
        target="_blank"
        variant="text"
      >
        {t('riskManagement:link')}
      </Button>
      <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', my: 3 }} />
      <Typography alignItems="center" sx={{ textAlign: 'center' }}>
        {t('riskManagement:info')}
      </Typography>
      <a
        href="mailto:{t('riskManagement:contact')}"
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, marginTop: 8 }}
      >
        <MailOutlined />
        {t('riskManagement:contactTitle')}
      </a>
    </Modal>
  )
}

export default RiskManagementComponent
