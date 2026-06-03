import { Modal } from 'antd'

const confirmDefaults = ({ okButtonProps, cancelButtonProps, ...options } = {}) => ({
  centered: true,
  className: 'desoops-confirm-modal',
  okButtonProps: { className: 'desoops-confirm-ok', ...okButtonProps },
  cancelButtonProps: { className: 'desoops-confirm-cancel', ...cancelButtonProps },
  ...options
})

export function showConfirm(modal, options = {}) {
  return modal.confirm(confirmDefaults(options))
}

export function showStaticConfirm(options = {}) {
  return Modal.confirm(confirmDefaults(options))
}
