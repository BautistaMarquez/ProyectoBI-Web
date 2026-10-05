import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { evictAnalyticsCache, fetchCertificadosMaster, fetchObrasResumen } from '../services/api'

export function useCertificadosMaster() {
  return useQuery({ queryKey: ['certificados-master'], queryFn: fetchCertificadosMaster })
}

export function useObrasResumen() {
  return useQuery({ queryKey: ['obras-resumen'], queryFn: fetchObrasResumen })
}

export function useEvictCache() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: evictAnalyticsCache,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['certificados-master'] }),
        queryClient.invalidateQueries({ queryKey: ['obras-resumen'] }),
      ])
    },
  })
}
