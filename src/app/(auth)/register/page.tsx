import { AuthForm } from '@/components/auth/auth-form'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Create Account</h1>
        <p className="text-gray-600">Start designing today</p>
        <AuthForm mode="register" />
      </div>
    </div>
  )
}
