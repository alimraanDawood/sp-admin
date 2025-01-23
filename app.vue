<template>
  <div>
    <NuxtLayout>
      <Toaster />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script>
import { Toaster } from '@/components/ui/sonner'
export default {
  components: {
    Toaster
  }
}
</script>