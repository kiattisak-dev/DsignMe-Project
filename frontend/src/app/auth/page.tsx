import { redirect } from 'next/navigation'

export default function AuthPage() {
  redirect('/admin/login')
}