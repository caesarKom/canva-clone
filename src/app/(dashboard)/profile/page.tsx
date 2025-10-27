'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { signOut } from 'next-auth/react'

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        credentials: 'include',
      })
      
      if (!res.ok) throw new Error('Failed to fetch profile')
      
      const data = await res.json()
      setProfile(data)
      setName(data.name || '')
      setEmail(data.email || '')
    } catch (error) {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          email,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to update profile')
      }

      toast.success('Profile updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      fetchProfile()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!res.ok) throw new Error('Failed to delete account')

      toast.success('Account deleted successfully')
      signOut({ callbackUrl: '/' })
    } catch (error) {
      toast.error('Failed to delete account')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-gray-600">Manage your account settings</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Update your account details and password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Change Password</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="default"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold">{profile?.projectCount || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-lg font-semibold">
                  {new Date(profile?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove all your projects from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
