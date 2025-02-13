import ModalTemplateComponent from '../Generic/ModalTemplateComponent'

export default function DataModalComponent({ data, open, setOpen }: { data: any; open: boolean; setOpen: any }) {
  return (
    <ModalTemplateComponent open={open} setOpen={setOpen}>
      Hello
    </ModalTemplateComponent>
  )
}
