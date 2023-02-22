import { VNode } from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    data?(): object
    beforeCreate?(): void
    created?(): void
    beforeMount?(): void
    mounted?(): void
    beforeDestroy?(): void
    destroyed?(): void
    beforeUpdate?(): void
    updated?(): void
    activated?(): void
    deactivated?(): void
    render?(createElement: CreateElement): VNode
    errorCaptured?(err: Error, vm: Vue, info: string): boolean | undefined
    serverPrefetch?(): Promise<unknown>
  }
}
