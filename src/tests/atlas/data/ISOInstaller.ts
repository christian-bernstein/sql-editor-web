export interface ISOInstaller<Controller> {
    install(iso: File, controller: Controller): boolean
}
