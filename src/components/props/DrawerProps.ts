export type DrawerProps<T> = {
    onSubmit?: (data?: T) => void,
    onCancel?: () => void,
    onClose?: () => void,
    onOpen?: () => void
}