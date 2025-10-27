import { AuthForm } from '@/components/auth/auth-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Welcome Back</h1>
        <p className="text-gray-600">Sign in to your account</p>
        <AuthForm mode="login" />
      </div>
    </div>
  )
}
