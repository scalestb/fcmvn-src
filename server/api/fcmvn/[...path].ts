import { defineEventHandler, proxyRequest } from 'h3'

export default defineEventHandler((event) => {
  const path = (event.context.params?.path || []) as string[]
  const base = process.env.API_BASE_URL || 'https://fcmvn.com/api'
  const target = [base.replace(/\/$/, ''), ...path].join('/')
  return proxyRequest(event, target)
})
